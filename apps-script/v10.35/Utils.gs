// ============================================================
// UTILITÁRIOS GERAIS
// ============================================================

function adquirirTrava() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(CONFIG.lockTimeoutMs);
    return lock;
  } catch (e) {
    alerta("⚠️ Outra execução já está em andamento.\nAguarde a conclusão antes de executar novamente.");
    return null;
  }
}

function liberarTrava(lock) {
  if (lock) {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function progresso(msg, titulo) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(msg, titulo || "OperaPro ⚙️", 3);
  } catch (e) {}
}

function alerta(msg) {
  try { SpreadsheetApp.getUi().alert(msg); }
  catch(e) { Browser.msgBox(msg); }
}

function pedirNomeAba() {
  try {
    var ui = SpreadsheetApp.getUi();
    var r  = ui.prompt("Teste", "Nome exato da aba:", ui.ButtonSet.OK_CANCEL);
    if (r.getSelectedButton() !== ui.Button.OK) return null;
    return r.getResponseText().trim();
  } catch(e) {
    var r = Browser.inputBox("Teste", "Nome exato da aba:", Browser.Buttons.OK_CANCEL);
    return (r === "cancel") ? null : r;
  }
}

function normalizarTexto(t) {
  return t ? t.replace(/️/g, "").trim() : "";
}

function normalizarParaRegra(val) {
  return String(val || "").trim().replace(/\[Disparo\]/gi, "[DIS]");
}

function colIdx(cab, nome) {
  for (var i = 0; i < cab.length; i++) {
    if (String(cab[i] || "").trim() === nome) return i;
  }
  var aliases = ALIAS_COLUNAS_STATUS[nome];
  if (aliases) {
    for (var a = 0; a < aliases.length; a++) {
      for (var i = 0; i < cab.length; i++) {
        if (String(cab[i] || "").trim() === aliases[a]) return i;
      }
    }
  }
  return -1;
}

function mapearColunas(cab) {
  var mapa = {};
  for (var i = 0; i < cab.length; i++) {
    var n = String(cab[i] || "").trim();
    if (n) mapa[n] = i;
  }
  var unif = mapa[CONFIG.colSubidoUnificado];
  if (unif !== undefined) {
    if (mapa[CONFIG.colSubidoDocs]   === undefined) mapa[CONFIG.colSubidoDocs]   = unif;
    if (mapa[CONFIG.colSubidoPastas] === undefined) mapa[CONFIG.colSubidoPastas] = unif;
  }
  return mapa;
}

function instalarTriggerSeNaoExiste_(nomeFuncao) {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === nomeFuncao) return;
  }
  ScriptApp.newTrigger(nomeFuncao)
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
}
