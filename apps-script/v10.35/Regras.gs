// ============================================================
// LEITURA DE REGRAS — Docs, Pastas, Templates
// ============================================================

function lerRegrasDocs(ss) {
  var aba = ss.getSheetByName(CONFIG.abaCondicionais);
  if (!aba) return { lista:[], porAba:{} };
  var dados = aba.getDataRange().getValues();
  var lista = [];
  var cab0  = String(dados[0] && dados[0][0] || "").trim();
  var temColStatus = (cab0.indexOf("Subido") >= 0 || cab0.indexOf("📄") >= 0);
  var d = temColStatus ? 1 : 0;
  for (var i=1; i<dados.length; i++) {
    var l = dados[i];
    var r = {
      aba:  String(l[0+d]||"").trim(), docId:String(l[1+d]||"").trim(),
      col1: String(l[2+d]||"").trim(), val1: String(l[3+d]||"").trim(),
      col2: String(l[4+d]||"").trim(), val2: String(l[5+d]||"").trim(),
      guia: String(l[6+d]||"").trim(),
    };
    if (!r.guia && r.aba) r.guia = CONFIG.guiaAgrupaPorData;
    if (r.aba && r.docId && r.guia) lista.push(r);
  }
  return { lista:lista, porAba:agruparPorAbaNormalizado(lista) };
}

function lerRegrasPastas(ss) {
  var aba = ss.getSheetByName(CONFIG.abaPastas);
  if (!aba) return { lista:[], porAba:{} };
  var dados = aba.getDataRange().getValues();
  var lista = [];
  var cab0  = String(dados[0] && dados[0][0] || "").trim();
  var temColStatus = (cab0.indexOf("Subido") >= 0 || cab0.indexOf("📁") >= 0);
  var d = temColStatus ? 1 : 0;
  for (var i=1; i<dados.length; i++) {
    var l = dados[i];
    var r = {
      aba:   String(l[0+d]||"").trim(), idVal: String(l[1+d]||"").trim(),
      idMat: String(l[2+d]||"").trim(), col1:  String(l[3+d]||"").trim(),
      val1:  String(l[4+d]||"").trim(), col2:  String(l[5+d]||"").trim(),
      val2:  String(l[6+d]||"").trim(),
    };
    if (r.aba && r.col1 && r.val1) lista.push(r);
  }
  return { lista:lista, porAba:agruparPorAbaNormalizado(lista) };
}

function lerMapaTemplates(ss) {
  var aba = ss.getSheetByName(CONFIG.abaDocs);
  if (!aba) return {};
  var dados = aba.getDataRange().getValues();
  var mapa  = {};
  var cab   = dados[0];
  var iAba  = colIdx(cab, "Aba da Planilha (Planos e Pedidos)");
  var iTpl  = colIdx(cab, "ID do Documento (Template)");
  if (iAba < 0) iAba = colIdx(cab, "Subido Drive?") >= 0 ? 1 : 0;
  if (iTpl < 0) iTpl = colIdx(cab, "Subido Drive?") >= 0 ? 4 : 3;
  for (var i=1; i<dados.length; i++) {
    var nomeAba = String(dados[i][iAba]||"").trim();
    var tId     = String(dados[i][iTpl]||"").trim();
    if (!tId) tId = CONFIG.idMaestro;
    if (nomeAba && !mapa[nomeAba]) mapa[nomeAba] = tId;
  }
  return mapa;
}

function agruparPorAbaNormalizado(lista) {
  var mapa = {};
  for (var i = 0; i < lista.length; i++) {
    var r = lista[i];
    if (!mapa[r.aba]) mapa[r.aba] = [];
    mapa[r.aba].push(r);
  }
  return mapa;
}

function encontrarRegra(linha, colMap, regras) {
  var fallback        = null;
  var fallbackParcial = null;

  for (var i=0; i<regras.length; i++) {
    var r = regras[i];

    if (!r.col1 || !r.val1) { if (!fallback) fallback = r; continue; }

    var idx1 = colMap[r.col1];
    if (idx1 === undefined) continue;

    if (normalizarParaRegra(linha[idx1]) !== normalizarParaRegra(r.val1)) continue;

    if (r.col2 && r.val2) {
      var idx2 = colMap[r.col2];
      if (idx2 === undefined) { if (!fallbackParcial) fallbackParcial = r; continue; }
      var aceitos = r.val2.split("|");
      var valNorm = normalizarParaRegra(linha[idx2]);
      var encontrou = false;
      for (var a = 0; a < aceitos.length; a++) {
        if (normalizarParaRegra(aceitos[a]) === valNorm) { encontrou = true; break; }
      }
      if (!encontrou) { if (!fallbackParcial) fallbackParcial = r; continue; }
    }

    return r;
  }

  return fallbackParcial || fallback;
}
