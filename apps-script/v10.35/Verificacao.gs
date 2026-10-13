// ============================================================
// VERIFICAÇÃO, TESTE E DIAGNÓSTICO
// ============================================================

function verificarConfiguracao() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    progresso("Verificando configuração...", "🔍 Verificação");

    var ss   = SpreadsheetApp.getActiveSpreadsheet();
    var rdoc = lerRegrasDocs(ss);
    var rpas = lerRegrasPastas(ss);
    var mapa = lerMapaTemplates(ss);
    var msgs = ["=== Verificação ===\n",
      rdoc.lista.length + " regras de docs | " + rpas.lista.length + " regras de pastas\n"];
    var visto = {};
    for (var i = 0; i < rdoc.lista.length; i++) {
      var r = rdoc.lista[i];
      if (!visto["a_"+r.aba]) {
        visto["a_"+r.aba] = true;
        msgs.push((ss.getSheetByName(r.aba) ? "✅" : "❌") + " Aba: " + r.aba);
      }
      if (r.docId && !visto["d_"+r.docId]) {
        try { msgs.push("   ✅ Doc: " + DocumentApp.openById(r.docId).getName()); }
        catch(e) { msgs.push("   ❌ Doc (" + r.docId.substr(0,20) + "): " + e.message); }
        visto["d_"+r.docId] = true;
      }
      var tId = mapa[r.aba];
      if (tId && !visto["t_"+tId]) {
        try { msgs.push("   ✅ Template: " + DocumentApp.openById(tId).getName()); }
        catch(e) { msgs.push("   ❌ Template: " + e.message); }
        visto["t_"+tId] = true;
      } else if (!tId) { msgs.push("   ⚠️ Sem template para " + r.aba); }
    }
    for (var i = 0; i < rpas.lista.length; i++) {
      var r = rpas.lista[i];
      if (r.idVal && !visto["v_"+r.idVal]) {
        try { DriveApp.getFolderById(r.idVal); msgs.push("✅ Pasta Val: " + r.aba); }
        catch(e) { msgs.push("❌ Pasta Val (" + r.aba + "): " + e.message); }
        visto["v_"+r.idVal] = true;
      }
      if (r.idMat && !visto["m_"+r.idMat]) {
        try { DriveApp.getFolderById(r.idMat); msgs.push("✅ Pasta Mat: " + r.aba); }
        catch(e) { msgs.push("❌ Pasta Mat (" + r.aba + "): " + e.message); }
        visto["m_"+r.idMat] = true;
      }
    }

    progresso("Verificação concluída!", "🔍 Verificação");
    alerta(msgs.join("\n"));
  } finally {
    liberarTrava(lock);
  }
}

function testarUmaAba() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    var nomeAba = pedirNomeAba();
    if (!nomeAba) return;

    progresso("Testando aba: " + nomeAba + "...", "🧪 Teste");

    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName(nomeAba);
    if (!aba) { alerta("Aba '" + nomeAba + "' não encontrada."); return; }
    var rdoc = lerRegrasDocs(ss);
    var mapa = lerMapaTemplates(ss);
    var cab    = aba.getRange(1,1,1,aba.getLastColumn()).getValues()[0];
    var colMap = mapearColunas(cab);
    var dados  = aba.getDataRange().getValues();
    var iSubDoc = resolverColunaStatus(colMap, "docs");
    for (var i = 1; i < dados.length; i++) {
      var linha = dados[i];
      var nome  = String(linha[colMap[CONFIG.colNome]] || "").trim();
      if (!nome || !deveProcessar(linha, iSubDoc)) continue;
      var log  = ["Tarefa: " + nome, ""];
      var rDoc = encontrarRegra(linha, colMap, rdoc.porAba[nomeAba] || []);
      if (rDoc) {
        var tId = mapa[nomeAba] || CONFIG.idMaestro;
        try {
          var dc = DocumentApp.openById(rDoc.docId);
          var dt = DocumentApp.openById(tId);
          var bloco  = lerBlocoTemplate(dt, obterChaveTemplate(nomeAba));
          var guia   = rDoc.guia;
          var dataH1 = (guia === CONFIG.guiaAgrupaPorData) ? obterDataH1(linha, colMap) : null;
          var extras = obterCamposExtras(linha, colMap, nomeAba, i + 1);
          inserirNoDoc(dc, guia, nome, bloco, dataH1, extras);
          dc.saveAndClose();
          log.push("✅ Inserido | guia:'" + guia + "'" + (dataH1 ? " data:" + dataH1 : "") + " (" + bloco.length + " elem)");
        } catch(e) { log.push("❌ Doc: " + e.message); }
      } else { log.push("⚠️ Sem regra de doc"); }
      if (iSubDoc !== undefined) aba.getRange(i+1, iSubDoc+1).setValue("✅");

      registrarLog("🧪 Teste: " + nomeAba, 1, 0, [], "Tarefa: " + nome);
      progresso("Teste concluído!", "🧪 Teste");
      alerta(log.join("\n"));
      return;
    }
    alerta("Nenhuma linha com ❌ em '" + nomeAba + "'.");
  } finally {
    liberarTrava(lock);
  }
}

function diagnosticarColuna() {
  var nomeAba;
  try {
    var ui = SpreadsheetApp.getUi();
    var r  = ui.prompt("Diagnóstico", "Nome exato da aba:", ui.ButtonSet.OK_CANCEL);
    if (r.getSelectedButton() !== ui.Button.OK) return;
    nomeAba = r.getResponseText().trim();
  } catch(e) {
    nomeAba = Browser.inputBox("Diagnóstico", "Nome exato da aba:", Browser.Buttons.OK_CANCEL);
    if (nomeAba === "cancel") return;
  }

  var ss  = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheetByName(nomeAba);
  if (!aba) { alerta("Aba '" + nomeAba + "' não encontrada."); return; }

  var cab    = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
  var colMap = mapearColunas(cab);
  var dados  = aba.getDataRange().getValues();

  var log = [];
  log.push("=== DIAGNÓSTICO: " + nomeAba + " ===");
  log.push("");

  log.push("— CABEÇALHO (todas as colunas) —");
  for (var c = 0; c < cab.length; c++) {
    var raw   = String(cab[c] || "");
    var chars = [];
    for (var ch = 0; ch < raw.length; ch++) {
      chars.push("U+" + ("0000" + raw.charCodeAt(ch).toString(16)).slice(-4));
    }
    log.push("  Col " + (c + 1) + ": \"" + raw + "\" [" + chars.join(" ") + "]");
  }
  log.push("");

  var iDoc = resolverColunaStatus(colMap, "docs");
  var iPas = resolverColunaStatus(colMap, "pastas");
  log.push("— RESOLUÇÃO DE COLUNA DE STATUS —");
  log.push("  resolverColunaStatus(docs):   " + (iDoc !== undefined ? "Col " + (iDoc + 1) + " = \"" + cab[iDoc] + "\"" : "NÃO ENCONTRADA"));
  log.push("  resolverColunaStatus(pastas): " + (iPas !== undefined ? "Col " + (iPas + 1) + " = \"" + cab[iPas] + "\"" : "NÃO ENCONTRADA"));
  log.push("");

  var iNome = colMap[CONFIG.colNome];
  log.push("— PRIMEIRAS LINHAS COM NOME —");
  var contagem = 0;
  for (var i = 1; i < dados.length && contagem < 10; i++) {
    var nome = String(dados[i][iNome] || "").trim();
    if (!nome) continue;
    contagem++;

    var valDoc  = (iDoc !== undefined) ? dados[i][iDoc] : "(col não encontrada)";
    var valPas  = (iPas !== undefined) ? dados[i][iPas] : "(col não encontrada)";
    var tipoDoc = (valDoc === null) ? "null" : (valDoc === undefined) ? "undefined" : (valDoc === "") ? "string vazia" : typeof valDoc;
    var tipoPas = (valPas === null) ? "null" : (valPas === undefined) ? "undefined" : (valPas === "") ? "string vazia" : typeof valPas;

    var deveDoc = deveProcessar(dados[i], iDoc);
    var devePas = deveProcessar(dados[i], iPas);

    log.push("  Linha " + (i + 1) + ": " + nome);
    log.push("    Status Doc:   \"" + valDoc + "\" (tipo: " + tipoDoc + ") → deveProcessar=" + deveDoc);
    log.push("    Status Pasta: \"" + valPas + "\" (tipo: " + tipoPas + ") → deveProcessar=" + devePas);
  }

  alerta(log.join("\n"));
}
