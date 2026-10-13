// ============================================================
// CONFIGURAÇÃO DO PROJETO — leitura + configurar Docs/Pastas
// ============================================================

function lerConfigs_(ss) {
  var aba = ss.getSheetByName("⚙️Configs");
  if (!aba) { alerta("Aba ⚙️Configs não encontrada."); return null; }
  var dados = aba.getDataRange().getValues();
  var idPasta = String((dados[2] && dados[2][2]) || "").trim();
  var abrev   = String((dados[3] && dados[3][2]) || "").trim();
  if (!abrev) {
    var m = ss.getName().match(/^\[([^\]]+)\]/);
    abrev = m ? "[" + m[1] + "]" : "";
  }
  if (!idPasta) { alerta("Preencha o ID da pasta raiz na aba ⚙️Configs (linha 3, coluna C)."); return null; }
  if (!abrev)   { alerta("Preencha a abreviação do projeto na aba ⚙️Configs (linha 4, coluna C). Ex: [SA-Le03]"); return null; }
  var pastaRaiz;
  try { pastaRaiz = DriveApp.getFolderById(idPasta); }
  catch(e) { alerta("Pasta raiz não encontrada. Verifique o ID na aba ⚙️Configs.\n\nErro: " + e.message); return null; }
  return { pastaRaiz: pastaRaiz, abrev: abrev };
}

function configurarDocs() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    progresso("Iniciando configuração de docs...", "⚙️ Configurar Docs");

    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var cfg = lerConfigs_(ss);
    if (!cfg) return;

    var pastaCopys = buscarSubpasta(cfg.pastaRaiz, ["✍", "Copys"]);
    if (!pastaCopys) { alerta("Pasta de Copys não encontrada.\nCrie uma subpasta cujo nome comece com '✍🏼' ou 'Copys'."); return; }

    var log = ["Projeto: " + cfg.abrev, "Copys: " + pastaCopys.getName(), ""];
    var erros = [];
    var mapaAbaDocId = {};
    var mapaDocsCompleto = {};
    var abaDocs = ss.getSheetByName(CONFIG.abaDocs);
    if (!abaDocs) { alerta("Aba '" + CONFIG.abaDocs + "' não encontrada."); return; }

    var dadosDocs = abaDocs.getDataRange().getValues();
    var cabDocs   = dadosDocs[0];
    var iSubDD  = colIdx(cabDocs, "📄Doc Subido?");
    var iAbaDD  = colIdx(cabDocs, "Aba da Planilha (Planos e Pedidos)");
    var iNomeDD = colIdx(cabDocs, "Nome do Documento (Google Drive do Projeto)");
    var iIdDD   = colIdx(cabDocs, "ID do Documento (Google Drive do Projeto)");
    if (iAbaDD  < 0) iAbaDD  = (iSubDD >= 0) ? 1 : 0;
    if (iNomeDD < 0) iNomeDD = (iSubDD >= 0) ? 2 : 1;
    if (iIdDD   < 0) iIdDD   = (iSubDD >= 0) ? 3 : 2;

    var totalDocs = dadosDocs.length - 1;
    for (var i = 1; i < dadosDocs.length; i++) {
      var linha = dadosDocs[i];
      var aba   = String(linha[iAbaDD]  || "").trim();
      var nome  = String(linha[iNomeDD] || "").trim();

      if (i % 5 === 0) progresso("Processando doc " + i + " de " + totalDocs + "...", "⚙️ Configurar Docs");

      if (!aba || !nome) continue;
      if (iSubDD >= 0 && String(linha[iSubDD] || "").trim() === "✅") continue;
      var def = acharDefPorSufixo(nome, cfg.abrev);
      if (!def) continue;
      var nomeDoc = nome.indexOf(cfg.abrev) >= 0
        ? nome
        : (cfg.abrev + " " + def.sufixo).replace(/\s+/g, " ").trim();
      var docId = criarOuAcharDoc(pastaCopys, nomeDoc);
      if (!docId) { erros.push("Falha ao criar: " + nomeDoc); continue; }
      abaDocs.getRange(i + 1, iNomeDD + 1, 1, 2).setValues([[nomeDoc, docId]]);
      if (iSubDD >= 0) abaDocs.getRange(i + 1, iSubDD + 1).setValue("✅");
      for (var m = 0; m < MAPA_DOCS_COPY.length; m++) {
        if (MAPA_DOCS_COPY[m].sufixo !== def.sufixo) continue;
        var abaAlvo = MAPA_DOCS_COPY[m].aba;
        if (!mapaAbaDocId[abaAlvo]) mapaAbaDocId[abaAlvo] = docId;
        if (!mapaDocsCompleto[abaAlvo]) mapaDocsCompleto[abaAlvo] = [];
        var jaExiste = false;
        for (var x = 0; x < mapaDocsCompleto[abaAlvo].length; x++) {
          if (mapaDocsCompleto[abaAlvo][x].docId === docId) { jaExiste = true; break; }
        }
        if (!jaExiste) mapaDocsCompleto[abaAlvo].push({ nome: nomeDoc, docId: docId });
      }
      log.push("✅ " + nomeDoc);
    }

    var abaCond = ss.getSheetByName(CONFIG.abaCondicionais);
    if (abaCond) {
      progresso("Preenchendo condicionais...", "⚙️ Configurar Docs");
      var dadosCond = abaCond.getDataRange().getValues();
      var cabCond   = dadosCond[0];
      var iSubDC  = colIdx(cabCond, "📄Doc Subido?");
      var iAbaDC  = colIdx(cabCond, "Aba da Planilha (Planos e Pedidos)");
      var iIdDC   = colIdx(cabCond, "ID do Documento");
      var iVal1DC = colIdx(cabCond, "Valor Condicional 1 (se)");
      if (iAbaDC  < 0) iAbaDC  = (iSubDC >= 0) ? 1 : 0;
      if (iIdDC   < 0) iIdDC   = (iSubDC >= 0) ? 2 : 1;
      if (iVal1DC < 0) iVal1DC = (iSubDC >= 0) ? 4 : 3;
      for (var i = 1; i < dadosCond.length; i++) {
        var linha  = dadosCond[i];
        var nomAba = String(linha[iAbaDC]  || "").trim();
        var val1   = String(linha[iVal1DC] || "").trim();
        if (!nomAba) continue;
        if (iSubDC >= 0 && String(linha[iSubDC] || "").trim() === "✅") continue;
        var docId = resolverDocIdParaCondicional(nomAba, val1, mapaDocsCompleto);
        if (!docId) continue;
        abaCond.getRange(i + 1, iIdDC + 1).setValue(docId);
        if (iSubDC >= 0) abaCond.getRange(i + 1, iSubDC + 1).setValue("✅");
      }
      log.push("✅ Drive Docs Condicionais preenchida");
    }

    var docsConfigurados = log.length - 3;
    registrarLog("⚙️ Configurar Docs", docsConfigurados, 0, erros, null);

    var msg = log.join("\n");
    if (erros.length) msg += "\n\n⚠️ Erros:\n" + erros.join("\n");
    progresso("Configuração de docs concluída!", "⚙️ Configurar Docs");
    alerta(msg);
  } finally {
    liberarTrava(lock);
  }
}

function configurarPastas() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    progresso("Iniciando configuração de pastas...", "⚙️ Configurar Pastas");

    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var cfg = lerConfigs_(ss);
    if (!cfg) return;

    var pastaMidia = buscarSubpasta(cfg.pastaRaiz, ["🎥🎨🎵", "Vídeos, Estáticos"]);
    if (!pastaMidia) { alerta("Pasta '🎥🎨🎵Vídeos, Estáticos, Áudios' não encontrada.\nVerifique se o nome começa com '🎥🎨🎵'."); return; }

    var log   = ["Pasta mãe: " + pastaMidia.getName(), ""];
    var erros = [];
    var mapeamento = [
      { prefixos: ["✉[DIS][GWPP]", "GWPP"],       abas: ["✉Grupos de Whastapp"] },
      { prefixos: ["🎥🎨🎵", "avulsos"],           abas: ["🎨Estáticos Avulsos", "🎥Vídeos Avulsos",
                                                          "✉Api Whatsapp", "✉Automação Whastapp"] },
      { prefixos: ["📢Ads", "Ads Tráfego"],        abas: ["📢Ads Tráfego Pago"] },
    ];
    var mapaAbaPastas = {};
    for (var m = 0; m < mapeamento.length; m++) {
      var map   = mapeamento[m];
      var pasta = buscarSubpasta(pastaMidia, map.prefixos);
      if (!pasta) { erros.push("Subpasta não encontrada: " + map.prefixos[0]); continue; }
      var idVal = buscarSubpastaId(pasta, "Validação");
      var idMat = buscarSubpastaId(pasta, "Material Bruto");
      log.push("✅ " + pasta.getName());
      if (!idVal) log.push("   ⚠️ Subpasta 'Validação' não encontrada");
      if (!idMat) log.push("   ⚠️ Subpasta 'Material Bruto' não encontrada");
      for (var a = 0; a < map.abas.length; a++) {
        mapaAbaPastas[map.abas[a]] = { idVal: idVal || "", idMat: idMat || "" };
      }
    }

    var abaPastas = ss.getSheetByName(CONFIG.abaPastas);
    if (!abaPastas) { alerta("Aba '" + CONFIG.abaPastas + "' não encontrada."); return; }
    var dadosPastas = abaPastas.getDataRange().getValues();
    var cabPastas   = dadosPastas[0];
    var iSubDP  = colIdx(cabPastas, "📁Pasta subida?");
    var iAbaDP  = colIdx(cabPastas, "Aba da Planilha (Planos e Pedidos)");
    var iIdVal  = colIdx(cabPastas, "ID Pasta Validação");
    var iIdMat  = colIdx(cabPastas, "ID Pasta Material Bruto");
    if (iAbaDP < 0) iAbaDP = (iSubDP >= 0) ? 1 : 0;
    if (iIdVal < 0) iIdVal = (iSubDP >= 0) ? 2 : 1;
    if (iIdMat < 0) iIdMat = (iSubDP >= 0) ? 3 : 2;

    var abasFeitas = {};
    var totalPastas = dadosPastas.length - 1;
    for (var i = 1; i < dadosPastas.length; i++) {
      var linha  = dadosPastas[i];
      var nomAba = String(linha[iAbaDP] || "").trim();

      if (i % 5 === 0) progresso("Processando pasta " + i + " de " + totalPastas + "...", "⚙️ Configurar Pastas");

      if (!nomAba) continue;
      if (iSubDP >= 0 && String(linha[iSubDP] || "").trim() === "✅") continue;
      var pastas = mapaAbaPastas[nomAba];
      if (!pastas) continue;
      if (pastas.idVal) abaPastas.getRange(i + 1, iIdVal + 1).setValue(pastas.idVal);
      if (pastas.idMat) abaPastas.getRange(i + 1, iIdMat + 1).setValue(pastas.idMat);
      if (iSubDP >= 0) abaPastas.getRange(i + 1, iSubDP + 1).setValue("✅");
      if (!abasFeitas[nomAba]) { abasFeitas[nomAba] = true; log.push("✅ Pastas: " + nomAba); }
    }

    var pastasConfiguradas = 0;
    for (var k in abasFeitas) { if (abasFeitas.hasOwnProperty(k)) pastasConfiguradas++; }
    registrarLog("⚙️ Configurar Pastas", pastasConfiguradas, 0, erros, null);

    var msg = log.join("\n");
    if (erros.length) msg += "\n\n⚠️ Erros:\n" + erros.join("\n");
    progresso("Configuração de pastas concluída!", "⚙️ Configurar Pastas");
    alerta(msg);
  } finally {
    liberarTrava(lock);
  }
}

function resolverDocIdParaCondicional(nomAba, val1, mapaDocsCompleto) {
  var docs = mapaDocsCompleto[nomAba];
  if (!docs || docs.length === 0) return null;
  if (!val1 || docs.length === 1) return docs[0].docId;
  var keywords = {
    "🎥Vídeo":             ["[VID]", "Vídeo", "Video", "VID"],
    "🎨Estático":          ["[BNR]", "Estático", "Estatico", "Banner", "BNR"],
    "🎵Áudio":             ["[AUD]", "Áudio", "Audio", "AUD"],
    "✈️Página":            ["[LP]",  " LP"],
    "✈Página":             ["[LP]",  " LP"],
    "✉[DIS] E-mail":       ["[EM]",  "E-mail", "Email", "aEM"],
    "✉[DIS] WPP/FB/TEL":  ["[WPP]", "WPP", "WPPi", "WPPa", "GWPP"],
    "SMS/Ligação":         ["SMS", "LIG", "Ligação"],
    "✍🏼️Redação":           ["RED", "Redação"],
    "📝Documento":          ["DOC", "Documento"],
    "⚙️Configuração":       ["Setup", "Config"],
  };
  var val1Norm = normalizarTexto(val1);
  var kws = keywords[val1] || keywords[val1Norm];
  if (kws) {
    for (var d = 0; d < docs.length; d++) {
      var nome = docs[d].nome;
      for (var k = 0; k < kws.length; k++) {
        if (nome.indexOf(kws[k]) >= 0) return docs[d].docId;
      }
    }
  }
  return docs[0].docId;
}

function buscarSubpasta(pai, prefixos) {
  var it = pai.getFolders();
  while (it.hasNext()) {
    var f = it.next(), nome = f.getName();
    for (var i = 0; i < prefixos.length; i++) {
      if (nome.indexOf(prefixos[i]) >= 0) return f;
    }
  }
  return null;
}

function buscarSubpastaId(pasta, nome) {
  var it = pasta.getFolders();
  while (it.hasNext()) {
    var f = it.next();
    if (f.getName().indexOf(nome) >= 0) return f.getId();
  }
  return null;
}

function criarOuAcharDoc(pastaCopys, nomeDoc) {
  var it = pastaCopys.getFilesByName(nomeDoc);
  if (it.hasNext()) return it.next().getId();
  try {
    var doc = DocumentApp.create(nomeDoc);
    DriveApp.getFileById(doc.getId()).moveTo(pastaCopys);
    doc.saveAndClose();
    return doc.getId();
  } catch(e) { return null; }
}

function acharDefPorSufixo(nomeLinha, abrev) {
  for (var i = 0; i < MAPA_DOCS_COPY.length; i++) {
    var d = MAPA_DOCS_COPY[i];
    if (nomeLinha.indexOf(d.sufixo) >= 0) return d;
    var semAbrev = nomeLinha.replace(abrev, "").trim();
    if (semAbrev === d.sufixo) return d;
  }
  return null;
}
