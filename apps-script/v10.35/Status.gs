// ============================================================
// CHECAGEM DE STATUS — colunas de "subido"
// ============================================================

function deveProcessar(linha, iCol) {
  if (iCol === undefined || iCol === null) return false;
  var val = linha[iCol];
  if (val === null || val === undefined) return false;
  if (val === true || val === false) return false;
  var str = String(val).trim();
  return str === "❌";
}

function jaSubido(val) {
  if (val === null || val === undefined) return true;
  if (val === true || val === "✅") return true;
  if (val === "—") return true;
  var str = String(val || "").trim();
  if (str === "") return true;
  return str.toUpperCase() === "TRUE";
}

function resolverColunaStatus(colMap, tipo) {
  var candidatos;
  if (tipo === "docs") {
    candidatos = [
      CONFIG.colSubidoDocs,
      CONFIG.colSubidoUnificado,
      "📄Doc Subido?",
      "Subido Drive?",
    ];
  } else {
    candidatos = [
      CONFIG.colSubidoPastas,
      CONFIG.colSubidoUnificado,
      "📁Pasta Subida?",
      "Subido Drive?",
    ];
  }
  for (var c = 0; c < candidatos.length; c++) {
    var idx = colMap[candidatos[c]];
    if (idx !== undefined) return idx;
  }
  return undefined;
}

function temPasta(nomeAba) {
  var ss  = SpreadsheetApp.getActiveSpreadsheet();
  var aba = ss.getSheetByName(CONFIG.abaPastas);
  if (!aba) return false;
  var dados = aba.getDataRange().getValues();
  for (var i = 1; i < dados.length; i++) {
    if (String(dados[i][1] || "").trim() === nomeAba) return true;
  }
  return false;
}
