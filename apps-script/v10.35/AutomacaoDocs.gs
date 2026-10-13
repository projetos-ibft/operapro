// ============================================================
// AUTOMAÇÃO — Preencher docs de copy
// ============================================================

function rodarAutomacao() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    progresso("Iniciando preenchimento de docs...", "📝 Docs de Copy");

    var ss           = SpreadsheetApp.getActiveSpreadsheet();
    var regrasDocs   = lerRegrasDocs(ss);
    var mapaTemplate = lerMapaTemplates(ss);
    if (!regrasDocs.lista.length) { alerta("Nenhuma regra encontrada na aba '" + CONFIG.abaCondicionais + "'."); return; }
    try { PropertiesService.getDocumentProperties().deleteProperty("ultimaExecucao"); } catch(e) {}
    var totalDocs = 0, totalPulados = 0, erros = [];

    var abasParaProcessar = [];
    for (var nomeAba in regrasDocs.porAba) {
      if (regrasDocs.porAba.hasOwnProperty(nomeAba)) abasParaProcessar.push(nomeAba);
    }

    for (var a = 0; a < abasParaProcessar.length; a++) {
      var nomeAba = abasParaProcessar[a];
      progresso("Processando aba " + (a + 1) + " de " + abasParaProcessar.length + ": " + nomeAba, "📝 Docs de Copy");
      var aba = ss.getSheetByName(nomeAba);
      if (!aba) { erros.push("Aba não encontrada: " + nomeAba); continue; }
      var res = processarAbaDocs(aba, regrasDocs.porAba[nomeAba], mapaTemplate);
      totalDocs    += res.docs;
      totalPulados += res.pulados;
      erros = erros.concat(res.erros);
    }

    registrarLog("📝 Preencher docs de copy (todas)", totalDocs, totalPulados, erros, null);

    var msg = "Função 2 concluída!\n\nDocs preenchidos: " + totalDocs +
              "\nPulados: " + totalPulados + "\nErros: " + erros.length;
    if (erros.length) msg += "\n\nDetalhes:\n" + erros.slice(0,15).join("\n");
    progresso("Preenchimento de docs concluído!", "📝 Docs de Copy");
    alerta(msg);
  } finally {
    liberarTrava(lock);
  }
}

function rodarAbaEspecifica(nomeAba) {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    progresso("Iniciando: " + nomeAba + "...", "▶ Aba Específica");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName(nomeAba);
    if (!aba) { alerta("Aba '" + nomeAba + "' não encontrada."); return; }
    var regrasDocs   = lerRegrasDocs(ss);
    var mapaTemplate = lerMapaTemplates(ss);
    var res = processarAbaDocs(aba, regrasDocs.porAba[nomeAba] || [], mapaTemplate);

    registrarLog("▶ Doc aba: " + nomeAba, res.docs, res.pulados, res.erros, null);

    var msg = "✅ " + nomeAba + " concluída!\n\nDocs: " + res.docs +
              " | Pulados: " + res.pulados + " | Erros: " + res.erros.length;
    if (res.erros.length) msg += "\n\n" + res.erros.slice(0,10).join("\n");
    progresso("Concluído: " + nomeAba, "▶ Aba Específica");
    alerta(msg);
  } finally {
    liberarTrava(lock);
  }
}

function processarAbaDocs(aba, regrasDoc, mapaTemplate) {
  var cab     = aba.getRange(1,1,1,aba.getLastColumn()).getValues()[0];
  var colMap  = mapearColunas(cab);
  var dados   = aba.getDataRange().getValues();
  var res     = { docs:0, pulados:0, erros:[] };
  var nomeAba = aba.getName();

  var tId = mapaTemplate[nomeAba] || CONFIG.idMaestro;
  var docTemplate = null;
  if (tId) {
    try { docTemplate = DocumentApp.openById(tId); }
    catch(e) { res.erros.push("Template '" + nomeAba + "': " + e.message); }
  }

  var tplKey         = obterChaveTemplate(nomeAba);
  var docsAbertos    = {};
  var iSubDoc        = resolverColunaStatus(colMap, "docs");
  var totalLinhas    = dados.length - 1;
  var linhasParaMarcar = [];

  var blocoTemplate = [];
  if (docTemplate) {
    try {
      blocoTemplate = lerBlocoTemplate(docTemplate, tplKey);
    } catch(ex) { Logger.log("Erro ao pré-carregar template: " + ex.message); }
  }

  var idxHor = colMap[CONFIG.colHorario];
  var horariosDisplay = [];
  if (idxHor !== undefined && totalLinhas > 0) {
    try {
      var displayVals = aba.getRange(2, idxHor + 1, totalLinhas, 1).getDisplayValues();
      for (var d = 0; d < displayVals.length; d++) {
        // v10.30 — índice alinhado com rowIndex (começa em 2)
        horariosDisplay[d + 2] = displayVals[d][0];
      }
    } catch(ex) { Logger.log("Erro ao pré-carregar horários: " + ex.message); }
  }

  for (var i = 1; i < dados.length; i++) {
    var linha = dados[i];
    var nome  = String(linha[colMap[CONFIG.colNome]] || "").trim();
    if (!nome) continue;

    if (i % 10 === 0) progresso("Aba " + nomeAba + ": linha " + i + " de " + totalLinhas, "📝 Docs de Copy");

    if (!deveProcessar(linha, iSubDoc)) { res.pulados++; continue; }

    var rDoc = encontrarRegra(linha, colMap, regrasDoc);
    if (!rDoc) { res.erros.push("[Doc] Sem regra: " + nome); continue; }

    try {
      if (!docsAbertos[rDoc.docId]) docsAbertos[rDoc.docId] = DocumentApp.openById(rDoc.docId);
      var guia   = rDoc.guia;
      var bloco  = clonarBloco(blocoTemplate);
      var dataH1 = (guia === CONFIG.guiaAgrupaPorData) ? obterDataH1(linha, colMap) : null;
      var extras = obterCamposExtras(linha, colMap, nomeAba, i + 1, horariosDisplay);
      inserirNoDoc(docsAbertos[rDoc.docId], guia, nome, bloco, dataH1, extras);
      res.docs++;
      if (iSubDoc !== undefined) {
        linhasParaMarcar.push(i + 1);
        registrarLinha(nomeAba, i + 1, iSubDoc + 1);
      }
    } catch(e) { res.erros.push("[Doc] " + nome + ": " + e.message); }
  }

  if (iSubDoc !== undefined && linhasParaMarcar.length > 0) {
    for (var b = 0; b < linhasParaMarcar.length; b++) {
      aba.getRange(linhasParaMarcar[b], iSubDoc + 1).setValue("✅");
    }
    SpreadsheetApp.flush();
  }

  for (var id in docsAbertos) { try { docsAbertos[id].saveAndClose(); } catch(e) {} }
  return res;
}

// ============================================================
// DESFAZER — reverter última execução
// ============================================================
function desfazerUltimaExecucao() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    var props = PropertiesService.getDocumentProperties();
    var reg   = props.getProperty("ultimaExecucao");
    if (!reg) { alerta("Nenhuma execução registrada para desfazer."); return; }
    var dados = JSON.parse(reg);
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var total = 0;
    for (var d = 0; d < dados.length; d++) {
      var item = dados[d];
      var aba = ss.getSheetByName(item.aba);
      if (!aba) continue;
      aba.getRange(item.linha, item.col).setValue("❌");
      total++;
    }
    props.deleteProperty("ultimaExecucao");
    registrarLog("↩️ Desfazer", total, 0, [], null);
    alerta("↩️ " + total + " linha(s) revertidas para ❌.");
  } finally {
    liberarTrava(lock);
  }
}
