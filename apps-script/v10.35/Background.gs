// ============================================================
// SYNC EM BACKGROUND — pré-carregamento após abrir
// ============================================================

function agendarSyncBackground_() {
  try {
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === "sincronizarCacheBackground_") {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }

    ScriptApp.newTrigger("sincronizarCacheBackground_")
      .timeBased()
      .after(60 * 1000)
      .create();

  } catch (e) {
    Logger.log("agendarSyncBackground_ erro: " + e.message);
  }
}

function sincronizarCacheBackground_() {
  try {
    sincronizarMapaCompleto_();
    popularCacheDepMemoria_();
    Logger.log("sincronizarCacheBackground_: sync concluído com sucesso");

  } catch (e) {
    Logger.log("sincronizarCacheBackground_ erro: " + e.message);
  } finally {
    try {
      var triggers = ScriptApp.getProjectTriggers();
      for (var i = 0; i < triggers.length; i++) {
        if (triggers[i].getHandlerFunction() === "sincronizarCacheBackground_") {
          ScriptApp.deleteTrigger(triggers[i]);
        }
      }
    } catch (e2) {}
  }
}
