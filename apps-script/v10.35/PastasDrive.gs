// ============================================================
// PASTAS NO DRIVE — criação em lote
// ============================================================

function criarTodasPastas() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    progresso("Iniciando criação de pastas...", "📁 Criar Pastas");

    var ss           = SpreadsheetApp.getActiveSpreadsheet();
    var regrasPastas = lerRegrasPastas(ss);
    if (!regrasPastas.lista.length) { alerta("Nenhuma regra encontrada na aba '" + CONFIG.abaPastas + "'."); return; }
    try { PropertiesService.getDocumentProperties().deleteProperty("ultimaExecucao"); } catch(e) {}
    var totalPastas = 0, totalPulados = 0, erros = [];

    var abasParaProcessar = [];
    for (var nomeAba in regrasPastas.porAba) {
      if (regrasPastas.porAba.hasOwnProperty(nomeAba)) abasParaProcessar.push(nomeAba);
    }

    for (var a = 0; a < abasParaProcessar.length; a++) {
      var nomeAba = abasParaProcessar[a];
      if (!temPasta(nomeAba)) continue;
      progresso("Processando aba " + (a + 1) + " de " + abasParaProcessar.length + ": " + nomeAba, "📁 Criar Pastas");
      var aba = ss.getSheetByName(nomeAba);
      if (!aba) { erros.push("Aba não encontrada: " + nomeAba); continue; }
      var res = processarAbaPastas(aba, regrasPastas.porAba[nomeAba]);
      totalPastas  += res.pastas;
      totalPulados += res.pulados;
      erros = erros.concat(res.erros);
    }

    registrarLog("📁 Criar pastas (todas)", totalPastas, totalPulados, erros, null);

    var msg = "Função 3 concluída!\n\nPastas criadas: " + totalPastas +
              "\nPulados: " + totalPulados + "\nErros: " + erros.length;
    if (erros.length) msg += "\n\nDetalhes:\n" + erros.slice(0,15).join("\n");
    progresso("Criação de pastas concluída!", "📁 Criar Pastas");
    alerta(msg);
  } finally {
    liberarTrava(lock);
  }
}

function processarAbaPastas(aba, regrasPasta) {
  var nomeAba = aba.getName();
  if (!temPasta(nomeAba)) return { pastas:0, pulados:0, erros:[] };

  var cab    = aba.getRange(1,1,1,aba.getLastColumn()).getValues()[0];
  var colMap = mapearColunas(cab);
  var dados  = aba.getDataRange().getValues();
  var res    = { pastas:0, pulados:0, erros:[] };

  var iSubPas               = resolverColunaStatus(colMap, "pastas");
  var totalLinhas           = dados.length - 1;
  var linhasPastaParaMarcar = [];

  for (var i = 1; i < dados.length; i++) {
    var linha = dados[i];
    var nome  = String(linha[colMap[CONFIG.colNome]] || "").trim();
    if (!nome) continue;

    if (i % 10 === 0) progresso("Aba " + nomeAba + ": pasta " + i + " de " + totalLinhas, "📁 Criar Pastas");

    if (!deveProcessar(linha, iSubPas)) { res.pulados++; continue; }

    var rPas = encontrarRegra(linha, colMap, regrasPasta);
    if (!rPas) {
      if (iSubPas !== undefined) {
        var celDV = aba.getRange(i + 1, iSubPas + 1);
        celDV.clearDataValidations();
        celDV.setValue("—");
      }
      continue;
    }

    try {
      var criadas = 0;

      if (rPas.idVal) {
        try {
          var pastaVal = DriveApp.getFolderById(rPas.idVal);
          obterOuCriarSubpasta(pastaVal, nome);
          criadas++;
        } catch (eVal) {
          res.erros.push("[Pasta Validação] " + nome + " — ID: " + rPas.idVal + " — Erro: " + eVal.message);
        }
      }

      if (rPas.idMat && rPas.val2) {
        var idxSta = colMap[CONFIG.colStatusGrav];
        var status = (idxSta !== undefined) ? String(linha[idxSta] || "").trim() : "";
        if (status === rPas.val2) {
          try {
            var pastaMat = DriveApp.getFolderById(rPas.idMat);
            obterOuCriarSubpasta(pastaMat, nome);
            criadas++;
          } catch (eMat) {
            res.erros.push("[Pasta Material Bruto] " + nome + " — ID: " + rPas.idMat + " — Erro: " + eMat.message);
          }
        }
      }

      res.pastas += criadas;

      if (iSubPas !== undefined) {
        linhasPastaParaMarcar.push(i + 1);
        registrarLinha(nomeAba, i + 1, iSubPas + 1);
      }
    } catch(e) {
      res.erros.push("[Pasta] " + nome + " — Erro inesperado: " + e.message);
    }
  }

  if (iSubPas !== undefined && linhasPastaParaMarcar.length > 0) {
    for (var b = 0; b < linhasPastaParaMarcar.length; b++) {
      aba.getRange(linhasPastaParaMarcar[b], iSubPas + 1).setValue("✅");
    }
    SpreadsheetApp.flush();
  }

  return res;
}

function obterOuCriarSubpasta(pai, nome) {
  var it = pai.getFoldersByName(nome);
  return it.hasNext() ? it.next() : pai.createFolder(nome);
}
