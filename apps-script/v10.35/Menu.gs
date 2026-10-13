// ============================================================
// MENU — onOpen + wrappers de aba específica
// ============================================================

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("OperaPro ⚙️")
    .addSubMenu(
      ui.createMenu("⚙️ Configurar Planos e Pedidos")
        .addItem("⚙️📝 [Docs] Criar e gerar IDs",    "configurarDocs")
        .addItem("⚙️📁 [Pastas] Gerar IDs",           "configurarPastas")
        .addSeparator()
        .addItem("🆔 Configurar ID Global [AD]",       "configurarIdGlobal")
        .addItem("🔍 Verificar ID Global [AD]",        "verificarIdGlobal")
        .addItem("🔢 Ajustar contador [AD]",           "ajustarContadorAD")
        .addItem("↩️ Remover configuração ID Global",  "removerIdGlobal")
        .addSeparator()
        .addItem("🔗 Configurar Trigger [AD]",            "configurarTriggerAD")
        .addItem("🟩 Configurar colunas [AD]",            "configurarColunasAD")
    )
    .addSeparator()
    .addItem("📝 Preencher docs de copy",          "rodarAutomacao")
    .addItem("📁 Criar pastas no Drive",            "criarTodasPastas")
    .addSeparator()
    .addSubMenu(
      ui.createMenu("▶ Aba específica — Docs")
        .addItem("📢 Ads Tráfego Pago",    "rodarAds")
        .addItem("✈️ LPs",                  "rodarLPs")
        .addItem("🎨 Estáticos Avulsos",    "rodarBNR")
        .addItem("🎥 Vídeos Avulsos",       "rodarVID")
        .addItem("✉ Automação de E-mail",   "rodarAEM")
        .addItem("✉ E-mail Avulso",         "rodarEM")
        .addItem("✉ Api Whatsapp",          "rodarWPPi")
        .addItem("✉ Automação Whastapp",    "rodarWPPa")
        .addItem("✉ Grupos de Whatsapp",    "rodarGWPP")
        .addItem("✉ SMS",                   "rodarSMS")
        .addItem("☎️ Ligação",              "rodarLigacao")
    )
    .addSeparator()
    .addItem("🔗 Dependências de Colunas",   "abrirPainelDependencias")
    .addSeparator()
    .addItem("⚙️ Criar/atualizar aba ⚙️Notes",       "criarAbaNotes")
    .addItem("🔄 Sincronizar pastas no cache Notes", "sincronizarNotesCache")
    .addItem("📝 Preencher Notes (linhas selec.)",   "preencherNotesSelecionados")
    .addSeparator()
    .addItem("🔍 Verificar configuração",    "verificarConfiguracao")
    .addItem("🧪 Testar uma linha",          "testarUmaAba")
    .addSeparator()
    .addItem("↩️ Desfazer última execução",  "desfazerUltimaExecucao")
    .addSeparator()
    .addItem("🩺 Diagnosticar coluna de status", "diagnosticarColuna")
    .addItem("🩺 Diagnosticar Notes Cache",       "diagnosticarNotesCache")
    .addToUi();

  // ── Background: agenda sync do cache de dependências ──
  agendarSyncBackground_();
}

function rodarAds()     { rodarAbaEspecifica("📢Ads Tráfego Pago"); }
function rodarLPs()     { rodarAbaEspecifica("✈️LPs"); }
function rodarBNR()     { rodarAbaEspecifica("🎨Estáticos Avulsos"); }
function rodarVID()     { rodarAbaEspecifica("🎥Vídeos Avulsos"); }
function rodarAEM()     { rodarAbaEspecifica("✉Automação de E-mail"); }
function rodarEM()      { rodarAbaEspecifica("✉E-mail Avulso"); }
function rodarGWPP()    { rodarAbaEspecifica("✉Grupos de Whastapp"); }
function rodarWPPi()    { rodarAbaEspecifica("✉Api Whatsapp"); }
function rodarWPPa()    { rodarAbaEspecifica("✉Automação Whastapp"); }
function rodarSMS()     { rodarAbaEspecifica("✉SMS"); }
function rodarLigacao() { rodarAbaEspecifica("☎️Ligação"); }
