// ============================================================
// ABA 📋Log — REGISTRO DE EXECUÇÕES
// ============================================================

function obterOuCriarAbaLog(ss) {
  var aba = ss.getSheetByName(CONFIG.abaLog);
  if (aba) return aba;

  aba = ss.insertSheet(CONFIG.abaLog);
  var cabecalho = ["📅Timestamp", "⚙️Operação", "📊Resultado", "✅Processados", "⏭️Pulados", "❌Erros", "📝Detalhes"];
  aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]);
  aba.getRange(1, 1, 1, cabecalho.length)
    .setFontWeight("bold")
    .setBackground("#4a86c8")
    .setFontColor("#ffffff");
  aba.setFrozenRows(1);
  aba.setColumnWidth(1, 160);
  aba.setColumnWidth(2, 220);
  aba.setColumnWidth(3, 100);
  aba.setColumnWidth(4, 110);
  aba.setColumnWidth(5, 100);
  aba.setColumnWidth(6, 80);
  aba.setColumnWidth(7, 500);
  return aba;
}

function registrarLog(operacao, processados, pulados, erros, detalhes) {
  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var aba = obterOuCriarAbaLog(ss);

    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    var qtdErros  = (erros && erros.length) ? erros.length : 0;
    var resultado = (qtdErros === 0) ? "✅ Sucesso" : (processados > 0 ? "⚠️ Parcial" : "❌ Falha");

    var detalhesTexto = "";
    if (detalhes) {
      detalhesTexto = detalhes;
    } else if (erros && erros.length) {
      detalhesTexto = erros.slice(0, 20).join(" | ");
    }

    var novaLinha = [timestamp, operacao, resultado, processados || 0, pulados || 0, qtdErros, detalhesTexto];
    aba.appendRow(novaLinha);

    var ultimaLinha = aba.getLastRow();
    if (qtdErros === 0) {
      aba.getRange(ultimaLinha, 3).setBackground("#d9ead3");
    } else if (processados > 0) {
      aba.getRange(ultimaLinha, 3).setBackground("#fff2cc");
    } else {
      aba.getRange(ultimaLinha, 3).setBackground("#f4cccc");
    }
  } catch (e) {}
}

function registrarLinha(nomeAba, linha, col) {
  try {
    var props = PropertiesService.getDocumentProperties();
    var atual = props.getProperty("ultimaExecucao");
    var lista = atual ? JSON.parse(atual) : [];
    lista.push({ aba: nomeAba, linha: linha, col: col });
    if (lista.length > 500) lista = lista.slice(-500);
    props.setProperty("ultimaExecucao", JSON.stringify(lista));
  } catch(e) {}
}
