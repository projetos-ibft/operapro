// ============================================================
// DIAGNÓSTICO NOTES CACHE — mostra estrutura real do Drive
// ============================================================
// Rode via editor: diagnosticarNotesCache()
// Ou adicione ao menu se quiser.

function diagnosticarNotesCache() {
  var ss  = SpreadsheetApp.getActiveSpreadsheet();
  var cfg = lerConfigs_(ss);
  if (!cfg) return;

  var pastaCopys = buscarSubpasta(cfg.pastaRaiz, ["✍", "Copys"]);
  var pastaMidia = buscarSubpasta(cfg.pastaRaiz, ["🎥🎨🎵", "Vídeos, Estáticos"]);

  var log = [];
  log.push("── DIAGNÓSTICO NOTES CACHE ──");
  log.push("Projeto: " + cfg.abrev);
  log.push("Raiz: " + cfg.pastaRaiz.getName());
  log.push("");

  log.push("── PASTA COPYS ──");
  log.push(pastaCopys ? "✅ " + pastaCopys.getName() : "❌ NÃO ENCONTRADA");
  log.push("");

  log.push("── PASTA MÍDIA (🎥🎨🎵) ──");
  if (!pastaMidia) {
    log.push("❌ NÃO ENCONTRADA — não dá pra continuar");
    alerta(log.join("\n"));
    return;
  }
  log.push("✅ " + pastaMidia.getName());
  log.push("");

  log.push("── SUBPASTAS DE " + pastaMidia.getName() + " ──");
  var subs = pastaMidia.getFolders();
  var listaSubs = [];
  while (subs.hasNext()) {
    var s = subs.next();
    listaSubs.push(s.getName());
    log.push("  📁 " + s.getName());
  }
  if (!listaSubs.length) log.push("  (vazia)");
  log.push("");

  // Testa cada aba com NOTES_PASTA_PAI
  log.push("── TESTE DE MATCHING ──");
  for (var nomeAba in NOTES_PASTA_PAI) {
    if (!NOTES_PASTA_PAI.hasOwnProperty(nomeAba)) continue;
    var prefixos = NOTES_PASTA_PAI[nomeAba];
    log.push("");
    log.push("Aba: " + nomeAba);
    log.push("  Procurando prefixos: [" + prefixos.join(", ") + "]");

    var achou = null;
    for (var i = 0; i < listaSubs.length; i++) {
      var nomeSub = listaSubs[i];
      for (var p = 0; p < prefixos.length; p++) {
        if (nomeSub.indexOf(prefixos[p]) >= 0) {
          achou = nomeSub;
          log.push("  ✅ Match: '" + nomeSub + "' (via prefixo '" + prefixos[p] + "')");
          break;
        }
      }
      if (achou) break;
    }
    if (!achou) {
      log.push("  ❌ NENHUMA subpasta bate — corrija NOTES_PASTA_PAI");
      continue;
    }

    // Testa Aprovados/Material/Validação dentro
    var pastaPai = buscarSubpasta(pastaMidia, prefixos);
    if (!pastaPai) continue;

    var subAprov = buscarSubpasta(pastaPai, ["Aprovados", "Pronto"]);
    var subMat   = buscarSubpasta(pastaPai, ["Material Bruto", "Material"]);
    var subVal   = buscarSubpasta(pastaPai, ["Validação", "Validacao"]);

    log.push("    Aprovados:  " + (subAprov ? "✅ " + subAprov.getName() : "❌ NÃO ACHOU"));
    log.push("    Material:   " + (subMat   ? "✅ " + subMat.getName()   : "❌ NÃO ACHOU"));
    log.push("    Validação:  " + (subVal   ? "✅ " + subVal.getName()   : "❌ NÃO ACHOU"));

    // Lista o que existe dentro se algo falhou
    if (!subAprov || !subMat || !subVal) {
      log.push("    (conteúdo de '" + pastaPai.getName() + "'):");
      var it = pastaPai.getFolders();
      var cont = 0;
      while (it.hasNext() && cont < 10) {
        log.push("      • " + it.next().getName());
        cont++;
      }
    }

    // Se aba tem subpasta por tipo, testa também
    var subFixa    = NOTES_SUBPASTA_FIXA[nomeAba];
    var semSubTipo = NOTES_SEM_SUBPASTA_TIPO[nomeAba];
    if (!semSubTipo && subAprov) {
      log.push("    Subpastas por tipo em Aprovados:");
      var testes = [];
      if (subFixa) {
        testes.push({ label: "fixa", cands: Array.isArray(subFixa) ? subFixa : [subFixa] });
      } else {
        // Testa cada tipo definido pra essa aba
        var subsDaAba = NOTES_SUBCATEGORIAS_POR_ABA[nomeAba] || [];
        for (var t = 0; t < subsDaAba.length; t++) {
          var sub2 = subsDaAba[t];
          if (NOTES_TIPOS_APENAS_DOC[sub2]) continue;
          var cands = NOTES_SUB_POR_TIPO[sub2];
          if (!cands) continue;
          testes.push({ label: sub2, cands: Array.isArray(cands) ? cands : [cands] });
        }
      }
      for (var a = 0; a < testes.length; a++) {
        var achouTipo = buscarSubpasta(subAprov, testes[a].cands);
        var status = achouTipo
          ? "✅ " + achouTipo.getName()
          : "❌ NÃO ACHOU (candidatos: " + testes[a].cands.join(", ") + ") — usará fallback pro pai";
        log.push("      " + testes[a].label + ": " + status);
      }
    }
  }

  var texto = log.join("\n");
  Logger.log(texto);

  // Salva em aba pra facilitar leitura
  var abaLog = ss.getSheetByName("⚙️Diag Notes");
  if (abaLog) abaLog.clear();
  else        abaLog = ss.insertSheet("⚙️Diag Notes");
  var linhas = texto.split("\n");
  var vals = [];
  for (var i = 0; i < linhas.length; i++) {
    // v10.35 fix: preceder linhas que começam com "=", "+", "-", "@" com apóstrofo
    // para o Sheets não interpretar como fórmula
    var l = linhas[i];
    if (l && /^[=+\-@]/.test(l)) l = "'" + l;
    vals.push([l]);
  }
  abaLog.getRange(1, 1, vals.length, 1).setValues(vals);
  abaLog.setColumnWidth(1, 800);

  alerta("✅ Diagnóstico salvo na aba '⚙️Diag Notes'.\n\nAbra essa aba para ver a estrutura completa e identificar o que corrigir em NOTES_PASTA_PAI.");
}
