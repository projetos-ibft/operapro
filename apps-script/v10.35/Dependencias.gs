// ============================================================
// DEPENDÊNCIAS DE COLUNAS — save + triggers onEdit
// ============================================================

function salvarConfigDependencias(configJson) {
  try {
    var config = JSON.parse(configJson);

    // FIX v10.35: pré-computa colIdx e colDestIdx para o wrapper rápido
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    for (var i = 0; i < config.length; i++) {
      var c = config[i];
      var aba = ss.getSheetByName(c.aba);
      if (!aba) continue;
      var cab = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
      var colMap = {};
      for (var k = 0; k < cab.length; k++) {
        var n = String(cab[k] || "").trim();
        if (n) colMap[n] = k + 1;
      }
      var gats = c.gatilhos || [];
      for (var g = 0; g < gats.length; g++) {
        gats[g].colIdx = colMap[gats[g].col] || 0;
        var vals = gats[g].valores || [];
        for (var v = 0; v < vals.length; v++) {
          var deps = vals[v].deps || [];
          for (var d = 0; d < deps.length; d++) {
            deps[d].colDestIdx = colMap[deps[d].colDest] || 0;
          }
        }
      }
    }

    PropertiesService.getDocumentProperties().setProperty(PROP_DEP_CONFIG, JSON.stringify(config));

    // FIX v10.35: instala o wrapper RÁPIDO como trigger (não o antigo lento)
    removerTriggerDependencias();
    instalarTriggerSeNaoExiste_("onEditDependenciasRapido");
    instalarTriggerSeNaoExiste_("onEditInvalidarCache");
    popularCacheDepMemoria_();

    registrarLog("🔗 Dep. Colunas salvas", 1, 0, [], "Abas configuradas: " + config.length);
    return true;
  } catch (e) {
    throw new Error("Falha ao salvar: " + e.message);
  }
}

function testarDependencias() {
  var props     = PropertiesService.getDocumentProperties();
  var configRaw = props.getProperty(PROP_DEP_CONFIG) || "[]";
  var config    = [];
  try { config = JSON.parse(configRaw); } catch (e) {}

  if (!config.length) return "Nenhuma configuração salva ainda.";

  var linhas = [];
  for (var i = 0; i < config.length; i++) {
    var c    = config[i];
    var gats = c.gatilhos || [];
    linhas.push("Aba: " + c.aba + " — " + gats.length + " gatilho(s)");
    for (var g = 0; g < gats.length; g++) {
      var gat  = gats[g];
      var vals = gat.valores || [];
      linhas.push("  Gatilho: " + gat.col + " — " + vals.length + " valor(es)");
      for (var v = 0; v < vals.length; v++) {
        var deps = vals[v].deps || [];
        linhas.push("    [" + vals[v].valor + "] → " + deps.length + " dep(s)");
        for (var d = 0; d < deps.length; d++) {
          var dep = deps[d];
          linhas.push("      → " + dep.colDest + ": " + (dep.valores || []).join(", "));
        }
      }
    }
  }

  var triggers = ScriptApp.getProjectTriggers();
  var temRapido = false, temLento = false;
  for (var t = 0; t < triggers.length; t++) {
    var h = triggers[t].getHandlerFunction();
    if (h === "onEditDependenciasRapido") temRapido = true;
    if (h === "onEditDependencias")       temLento  = true;
  }
  linhas.push("");
  linhas.push("Trigger rápido: " + (temRapido ? "✅ instalado" : "❌ não instalado"));
  if (temLento) linhas.push("⚠️ Trigger antigo (lento) também instalado — remova via removerTriggerDependencias()");

  return linhas.join("\n");
}

// ── Handler LENTO (fallback / compatibilidade) ──
function onEditDependencias(e) {
  try {
    var sheet   = e.range.getSheet();
    var nomeAba = sheet.getName();
    var linha   = e.range.getRow();
    var coluna  = e.range.getColumn();
    if (linha < 2) return;

    var props     = PropertiesService.getDocumentProperties();
    var configRaw = props.getProperty(PROP_DEP_CONFIG) || "[]";
    var config    = [];
    try { config = JSON.parse(configRaw); } catch (ex) { return; }

    var cfgAba = null;
    for (var i = 0; i < config.length; i++) {
      if (config[i].aba === nomeAba) { cfgAba = config[i]; break; }
    }
    if (!cfgAba) return;

    var ultimaCol = sheet.getLastColumn();
    var cab       = sheet.getRange(1, 1, 1, ultimaCol).getValues()[0];
    var colMap    = {};
    for (var c = 0; c < cab.length; c++) {
      var n = String(cab[c] || "").trim();
      if (n) colMap[n] = c + 1;
    }

    var gats = cfgAba.gatilhos || [];
    for (var g = 0; g < gats.length; g++) {
      var gat    = gats[g];
      var colGat = colMap[gat.col];
      if (!colGat || colGat !== coluna) continue;

      var valorEditado = String(e.range.getValue() || "").trim();
      if (!valorEditado) continue;

      var vals = gat.valores || [];
      for (var v = 0; v < vals.length; v++) {
        if (String(vals[v].valor || "").trim() !== valorEditado) continue;

        var deps = vals[v].deps || [];
        for (var d = 0; d < deps.length; d++) {
          var dep     = deps[d];
          var colDest = colMap[dep.colDest];
          var valores = dep.valores || [];
          if (!colDest || !valores.length) continue;
          sheet.getRange(linha, colDest).setValue(valores[0]);
        }
        break;
      }
    }
  } catch (err) {
    Logger.log("onEditDependencias erro: " + err.message);
  }
}

// ── Handler RÁPIDO — usa cache em memória + colIdx pré-computado ──
function onEditDependenciasRapido(e) {
  try {
    if (e.range.getRow() < 2) return;

    var nomeAba = e.range.getSheet().getName();
    if (!abaTemDep_(nomeAba)) return;

    var configRaw = lerConfigDepRapido_();
    var config    = [];
    try { config = JSON.parse(configRaw); } catch (ex) { return; }

    var cfgAba = null;
    for (var i = 0; i < config.length; i++) {
      if (config[i].aba === nomeAba) { cfgAba = config[i]; break; }
    }
    if (!cfgAba) return;

    var coluna = e.range.getColumn();
    var gats   = cfgAba.gatilhos || [];

    // Se colIdx não pré-computado, faz fallback pro lento
    var precomputado = gats.length > 0 && gats[0].colIdx !== undefined;
    if (!precomputado) { onEditDependencias(e); return; }

    var gatilhoRelevante = false;
    for (var g = 0; g < gats.length; g++) {
      if (gats[g].colIdx === coluna) { gatilhoRelevante = true; break; }
    }
    if (!gatilhoRelevante) return;

    var sheet = e.range.getSheet();
    var linha = e.range.getRow();
    var valorEditado = String(e.range.getValue() || "").trim();
    if (!valorEditado) return;

    for (var g = 0; g < gats.length; g++) {
      var gat = gats[g];
      if (gat.colIdx !== coluna) continue;

      var vals = gat.valores || [];
      for (var v = 0; v < vals.length; v++) {
        if (String(vals[v].valor || "").trim() !== valorEditado) continue;

        var deps = vals[v].deps || [];
        for (var d = 0; d < deps.length; d++) {
          var dep = deps[d];
          if (!dep.colDestIdx || !dep.valores || !dep.valores.length) continue;
          sheet.getRange(linha, dep.colDestIdx).setValue(dep.valores[0]);
        }
        break;
      }
    }
  } catch (err) {
    Logger.log("onEditDependenciasRapido erro: " + err.message);
  }
}

function removerTriggerDependencias() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    var h = triggers[i].getHandlerFunction();
    if (h === "onEditDependencias" || h === "onEditDependenciasRapido") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function onEditInvalidarCache(e) {
  try {
    var linha   = e.range.getRow();
    var nomeAba = e.range.getSheet().getName();

    var abasIgnoradas = [
      "⚙️CacheDepColunas",
      "⚙️Configs",
      "📄Drive Docs",
      "📄Drive Docs Condicionais",
      "📁Drive Pastas",
      "📋Log"
    ];
    for (var i = 0; i < abasIgnoradas.length; i++) {
      if (nomeAba === abasIgnoradas[i]) return;
    }

    if (linha !== 1) return;

    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName("⚙️CacheDepColunas");
    if (aba) {
      aba.clearContents();
      Logger.log("onEditInvalidarCache: cache invalidado — aba '" + nomeAba + "' col alterada");
    }
  } catch(err) {
    Logger.log("onEditInvalidarCache erro: " + err.message);
  }
}

function instalarTriggerInvalidarCache_() {
  instalarTriggerSeNaoExiste_("onEditInvalidarCache");
}
