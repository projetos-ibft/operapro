// ============================================================
// CACHE DE DEPENDÊNCIAS DE COLUNAS
// ============================================================

var CACHE_ABA_DEP = "⚙️CacheDepColunas";

function lerCacheAba_(ss) {
  try {
    var aba = ss.getSheetByName(CACHE_ABA_DEP);
    if (!aba) return null;

    var linha2 = String(aba.getRange(2, 1).getValue() || "").trim();
    if (!linha2 || linha2.indexOf("chunks:") !== 0) return null;

    var numChunks = parseInt(linha2.replace("chunks:", ""), 10);
    if (isNaN(numChunks) || numChunks < 1) return null;

    var dados = aba.getRange(3, 1, numChunks, 1).getValues();
    var json  = "";
    for (var i = 0; i < dados.length; i++) {
      json += String(dados[i][0] || "");
    }

    if (!json) return null;
    var parsed = JSON.parse(json);
    if (!parsed || !parsed.colPorAba) return null;
    return parsed;

  } catch(e) {
    Logger.log("lerCacheAba_ erro: " + e.message);
    return null;
  }
}

function salvarCacheAba_(ss, mapa) {
  try {
    var json      = JSON.stringify(mapa);
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");

    var qtdAbas = 0, qtdCols = 0, qtdVals = 0;
    for (var k in mapa.colPorAba) {
      if (!mapa.colPorAba.hasOwnProperty(k)) continue;
      qtdAbas++;
      qtdCols += (mapa.colPorAba[k] || []).length;
    }
    for (var k in mapa.valPorCol) {
      if (mapa.valPorCol.hasOwnProperty(k)) qtdVals += (mapa.valPorCol[k] || []).length;
    }

    var CHUNK_SIZE = 45000;

    var aba = ss.getSheetByName(CACHE_ABA_DEP);
    if (!aba) aba = ss.insertSheet(CACHE_ABA_DEP);
    aba.clearContents();

    aba.getRange(1, 1).setValue("Sync: " + timestamp + " | Abas: " + qtdAbas +
      " | Cols: " + qtdCols + " | Vals: " + qtdVals + " | Chars: " + json.length);

    var chunks = [];
    for (var i = 0; i < json.length; i += CHUNK_SIZE) {
      chunks.push([json.substring(i, i + CHUNK_SIZE)]);
    }

    aba.getRange(2, 1).setValue("chunks:" + chunks.length);
    for (var c = 0; c < chunks.length; c++) {
      aba.getRange(3 + c, 1).setValue(chunks[c][0]);
    }

    aba.hideSheet();
    SpreadsheetApp.flush();
    Logger.log("salvarCacheAba_ OK: " + qtdAbas + " abas | " + chunks.length + " chunks");

  } catch(e) {
    Logger.log("salvarCacheAba_ ERRO: " + e.message);
    throw e;
  }
}

function sincronizarMapaCompleto_() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var props = PropertiesService.getDocumentProperties();
  var todas = ss.getSheets();
  var abas  = [];

  for (var i = 0; i < todas.length; i++) {
    if (todas[i].getName() !== CACHE_ABA_DEP) abas.push(todas[i].getName());
  }

  var colPorAba    = {};
  var idxColPorAba = {};

  for (var i = 0; i < todas.length; i++) {
    var nomeAba = todas[i].getName();
    if (nomeAba === CACHE_ABA_DEP) continue;
    try {
      var ultimaCol = todas[i].getLastColumn();
      if (ultimaCol < 1) { colPorAba[nomeAba] = []; idxColPorAba[nomeAba] = {}; continue; }
      var cab    = todas[i].getRange(1, 1, 1, ultimaCol).getValues()[0];
      var cols   = [];
      var idxMap = {};
      for (var c = 0; c < cab.length; c++) {
        var n = String(cab[c] || "").trim();
        if (n && !idxMap.hasOwnProperty(n)) { cols.push(n); idxMap[n] = c; }
      }
      colPorAba[nomeAba]    = cols;
      idxColPorAba[nomeAba] = idxMap;
    } catch(e) {
      colPorAba[nomeAba]    = [];
      idxColPorAba[nomeAba] = {};
    }
  }

  var valPorCol = {};
  for (var i = 0; i < todas.length; i++) {
    var nomeAba = todas[i].getName();
    if (nomeAba === CACHE_ABA_DEP) continue;
    var cols   = colPorAba[nomeAba]    || [];
    var idxMap = idxColPorAba[nomeAba] || {};
    if (!cols.length) continue;
    try {
      var ultimaLinha = todas[i].getLastRow();
      var ultimaCol   = todas[i].getLastColumn();
      if (ultimaCol < 1) continue;

      var unicosPorCol = {};
      for (var c = 0; c < cols.length; c++) unicosPorCol[cols[c]] = {};

      if (ultimaLinha >= 2) {
        var numLinhas = Math.min(ultimaLinha - 1, 500);
        var dados = todas[i].getRange(2, 1, numLinhas, ultimaCol).getValues();
        for (var c = 0; c < cols.length; c++) {
          var nomCol  = cols[c];
          var idxReal = idxMap[nomCol];
          if (idxReal === undefined) continue;
          for (var r = 0; r < dados.length; r++) {
            var v = String(dados[r][idxReal] !== undefined ? dados[r][idxReal] : "").trim();
            if (v) unicosPorCol[nomCol][v] = true;
          }
        }
      }

      try {
        if (ultimaLinha >= 2) {
          var numLinhasVal = Math.min(ultimaLinha - 1, 200);
          var todasRegras  = todas[i].getRange(2, 1, numLinhasVal, ultimaCol).getDataValidations();
          var colResolvida = {};

          for (var rv = 0; rv < todasRegras.length; rv++) {
            var linhaRegras = todasRegras[rv];
            for (var c = 0; c < cols.length; c++) {
              var nomCol = cols[c];
              if (colResolvida[nomCol]) continue;
              var idxReal = idxMap[nomCol];
              if (idxReal === undefined || idxReal >= linhaRegras.length) continue;
              var regra = linhaRegras[idxReal];
              if (!regra) continue;
              try {
                var criterio = regra.getCriteriaType();
                var valores  = regra.getCriteriaValues();
                if (criterio === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST) {
                  var lista = valores[0];
                  if (lista && lista.length) {
                    for (var lv = 0; lv < lista.length; lv++) {
                      var vl = String(lista[lv] || "").trim();
                      if (vl) unicosPorCol[nomCol][vl] = true;
                    }
                    colResolvida[nomCol] = true;
                  }
                } else if (criterio === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE) {
                  var rangeRef = valores[0];
                  if (rangeRef) {
                    try {
                      var valsRange = rangeRef.getValues();
                      for (var vr2 = 0; vr2 < valsRange.length; vr2++) {
                        for (var vc2 = 0; vc2 < valsRange[vr2].length; vc2++) {
                          var vl2 = String(valsRange[vr2][vc2] || "").trim();
                          if (vl2) unicosPorCol[nomCol][vl2] = true;
                        }
                      }
                      colResolvida[nomCol] = true;
                    } catch(eRange) {}
                  }
                }
              } catch(eCrit) {}
            }
            var todasResolvidas = true;
            for (var c = 0; c < cols.length; c++) {
              if (!colResolvida[cols[c]]) { todasResolvidas = false; break; }
            }
            if (todasResolvidas) break;
          }
        }
      } catch(eVal) {}

      for (var c = 0; c < cols.length; c++) {
        var nomCol = cols[c];
        var chave  = nomeAba + "||" + nomCol;
        var lista  = [];
        for (var k in unicosPorCol[nomCol]) {
          if (unicosPorCol[nomCol].hasOwnProperty(k)) lista.push(k);
        }
        lista.sort();
        valPorCol[chave] = lista;
      }

    } catch(e) {}
  }

  var mapa = { colPorAba: colPorAba, valPorCol: valPorCol };
  salvarCacheAba_(ss, mapa);

  var configRaw = props.getProperty(PROP_DEP_CONFIG) || "[]";
  var config    = [];
  try { config = JSON.parse(configRaw); } catch(e) { config = []; }

  return {
    abas:      abas,
    colPorAba: colPorAba,
    valPorCol: valPorCol,
    config:    config,
    fromCache: false
  };
}

// ── Cache em memória (CacheService) — acelera onEdit ──
function popularCacheDepMemoria_() {
  try {
    var props     = PropertiesService.getDocumentProperties();
    var configRaw = props.getProperty(PROP_DEP_CONFIG) || "[]";

    var cache = CacheService.getScriptCache();
    cache.put(CACHE_KEY_DEP_CONFIG, configRaw, CACHE_DEP_DURACAO);

    var config = [];
    try { config = JSON.parse(configRaw); } catch (e) {}
    var abas = [];
    for (var i = 0; i < config.length; i++) {
      if (config[i].aba) abas.push(config[i].aba);
    }
    cache.put(CACHE_KEY_DEP_ABAS, abas.join("||"), CACHE_DEP_DURACAO);

  } catch (e) {
    Logger.log("popularCacheDepMemoria_ erro: " + e.message);
  }
}

function lerConfigDepRapido_() {
  try {
    var cache  = CacheService.getScriptCache();
    var cached = cache.get(CACHE_KEY_DEP_CONFIG);
    if (cached) return cached;
  } catch (e) {}

  var props     = PropertiesService.getDocumentProperties();
  var configRaw = props.getProperty(PROP_DEP_CONFIG) || "[]";
  try {
    CacheService.getScriptCache().put(CACHE_KEY_DEP_CONFIG, configRaw, CACHE_DEP_DURACAO);
  } catch (e) {}
  return configRaw;
}

// ── FIX v10.35: cache miss agora popula e responde precisamente ──
function abaTemDep_(nomeAba) {
  try {
    var cache  = CacheService.getScriptCache();
    var cached = cache.get(CACHE_KEY_DEP_ABAS);
    if (cached !== null && cached !== undefined) {
      return cached.indexOf(nomeAba) >= 0;
    }
    // Cache miss: popula e retorna resposta precisa
    popularCacheDepMemoria_();
    cached = cache.get(CACHE_KEY_DEP_ABAS);
    if (cached !== null && cached !== undefined) {
      return cached.indexOf(nomeAba) >= 0;
    }
  } catch (e) {}
  // Fallback conservador: se cache falhou totalmente, deixa passar
  return true;
}
