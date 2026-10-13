// ============================================================
// PAINEL LATERAL — Dependências de Colunas + Config AD
// ============================================================

function abrirPainelDependencias() {
  var html = HtmlService.createHtmlOutputFromFile("Sidebar")
    .setTitle("Dependências de Colunas")
    .setWidth(320);
  SpreadsheetApp.getUi().showSidebar(html);
}

function carregarDadosSidebar() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var props = PropertiesService.getDocumentProperties();

  var configRaw = props.getProperty(PROP_DEP_CONFIG) || "[]";
  var config    = [];
  try { config = JSON.parse(configRaw); } catch(e) { config = []; }

  var todas = ss.getSheets();
  var abas  = [];
  for (var i = 0; i < todas.length; i++) abas.push(todas[i].getName());

  var mapa = lerCacheAba_(ss);
  if (mapa) {
    return {
      abas:      abas,
      colPorAba: mapa.colPorAba || {},
      valPorCol: mapa.valPorCol || {},
      config:    config,
      fromCache: true
    };
  }

  return sincronizarMapaCompleto_();
}

function sincronizarDadosSidebar() {
  return sincronizarMapaCompleto_();
}

function lerColunasAba(nomeAba) {
  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName(nomeAba);
    if (!aba) return [];
    var ultimaCol = aba.getLastColumn();
    if (ultimaCol < 1) return [];
    var cab  = aba.getRange(1, 1, 1, ultimaCol).getValues()[0];
    var cols = [];
    for (var c = 0; c < cab.length; c++) {
      var n = String(cab[c] || "").trim();
      if (n) cols.push(n);
    }
    return cols;
  } catch(e) { return []; }
}

// ── Config Trigger [AD] via Sidebar ─────────────────────────

function lerConfigAD() {
  var props = PropertiesService.getDocumentProperties();
  var ss    = SpreadsheetApp.getActiveSpreadsheet();

  var colGatilho = parseInt(props.getProperty("adCols_gatilho") || "7", 10);
  var colTipo    = parseInt(props.getProperty("adCols_tipo")    || "4", 10);
  var colAD      = parseInt(props.getProperty("adCols_ad")      || "3", 10);
  var abaSalva   = props.getProperty("adCols_aba") || CONFIG.nomeAbaAds;

  function nomeColuna(nomeAba, idx) {
    try {
      var aba = ss.getSheetByName(nomeAba);
      if (!aba) return "";
      var cab = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
      return idx >= 1 && idx <= cab.length ? String(cab[idx - 1] || "").trim() : "";
    } catch(e) { return ""; }
  }

  return {
    aba:     abaSalva,
    gatilho: nomeColuna(abaSalva, colGatilho),
    tipo:    nomeColuna(abaSalva, colTipo),
    ad:      nomeColuna(abaSalva, colAD)
  };
}

function salvarConfigAD(cfgJson) {
  try {
    var cfg   = JSON.parse(cfgJson);
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var props = PropertiesService.getDocumentProperties();

    var aba = ss.getSheetByName(cfg.aba);
    if (!aba) throw new Error("Aba '" + cfg.aba + "' não encontrada.");

    var cab = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];

    function idxColuna(nome) {
      for (var i = 0; i < cab.length; i++) {
        if (String(cab[i] || "").trim() === nome) return i + 1;
      }
      throw new Error("Coluna '" + nome + "' não encontrada na aba '" + cfg.aba + "'.");
    }

    var idxGatilho = idxColuna(cfg.gatilho);
    var idxTipo    = idxColuna(cfg.tipo);
    var idxAD      = idxColuna(cfg.ad);

    props.setProperty("adCols_aba",     cfg.aba);
    props.setProperty("adCols_gatilho", String(idxGatilho));
    props.setProperty("adCols_tipo",    String(idxTipo));
    props.setProperty("adCols_ad",      String(idxAD));

    CONFIG.nomeAbaAds = cfg.aba;

    instalarTriggerSeNaoExiste_("onEditGerarIdAD");
    instalarTriggerSeNaoExiste_("onEditInvalidarCache");

    registrarLog("🆔 Config [AD] via painel", 1, 0, [],
      "Aba: " + cfg.aba +
      " | Gatilho: " + cfg.gatilho + " (col " + idxGatilho + ")" +
      " | Tipo: " + cfg.tipo + " (col " + idxTipo + ")" +
      " | ID: " + cfg.ad + " (col " + idxAD + ")"
    );

    return true;
  } catch(e) {
    throw new Error("Falha ao salvar config [AD]: " + e.message);
  }
}

function testarConfigAD() {
  var props     = PropertiesService.getDocumentProperties();
  var cols      = lerColunasAD_();
  var aba       = props.getProperty("adCols_aba") || CONFIG.nomeAbaAds;
  var idCentral = props.getProperty(CONFIG.propIdCentral);

  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var abaObj = ss.getSheetByName(aba);
  var cab    = abaObj ? abaObj.getRange(1,1,1,abaObj.getLastColumn()).getValues()[0] : [];

  function nomeCol(idx) {
    return (idx >= 1 && idx <= cab.length) ? String(cab[idx-1]||"").trim() : "col " + idx;
  }

  var triggers   = ScriptApp.getProjectTriggers();
  var temTrigger = false;
  for (var t = 0; t < triggers.length; t++) {
    if (triggers[t].getHandlerFunction() === "onEditGerarIdAD") { temTrigger = true; break; }
  }

  var linhas = [];
  linhas.push("Aba: " + aba + (abaObj ? " [OK]" : " [NAO ENCONTRADA]"));
  linhas.push("Gatilho: col " + cols.colGatilho + " = '" + nomeCol(cols.colGatilho) + "'");
  linhas.push("Tipo:    col " + cols.colTipo    + " = '" + nomeCol(cols.colTipo)    + "'");
  linhas.push("ID [AD]: col " + cols.colAD      + " = '" + nomeCol(cols.colAD)      + "'");
  linhas.push("Trigger: " + (temTrigger ? "instalado" : "NAO instalado"));
  linhas.push("ID Central: " + (idCentral ? "configurado" : "NAO configurado"));
  return linhas.join("\n");
}
