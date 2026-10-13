// ============================================================
// ID GLOBAL [AD] — configuração, trigger e reserva
// ============================================================

function configurarIdGlobal() {
  var ui       = SpreadsheetApp.getUi();
  var props    = PropertiesService.getDocumentProperties();
  var idAtual  = props.getProperty(CONFIG.propIdCentral)  || "";
  var abaAtual = props.getProperty(CONFIG.propAbaProjeto) || "";

  var msgAtual = idAtual
    ? "ID atual salvo:\n" + idAtual + "\n\nCole o novo ID abaixo para substituir, ou deixe em branco para manter:"
    : "Cole abaixo o ID do arquivo Google Sheets Central de IDs [AD].\n\nVocê encontra o ID na URL do arquivo:\ndocs.google.com/spreadsheets/d/ → ID AQUI ← /edit";

  var resposta = ui.prompt("🆔 Configurar ID Global [AD] — Passo 1/2", msgAtual, ui.ButtonSet.OK_CANCEL);
  if (resposta.getSelectedButton() !== ui.Button.OK) return;

  var novoId = resposta.getResponseText().trim();
  if (!novoId && !idAtual) { alerta("Nenhum ID informado."); return; }
  if (!novoId) novoId = idAtual;

  var ssCentral;
  try {
    ssCentral = SpreadsheetApp.openById(novoId);
  } catch (e) {
    alerta("❌ Não foi possível abrir o arquivo com o ID informado.\n\nVerifique:\n• O ID está correto\n• Você tem acesso ao arquivo\n\nErro: " + e.message);
    return;
  }

  var sheets = ssCentral.getSheets();
  if (!sheets.length) { alerta("❌ O arquivo não possui abas."); return; }

  var nomeAbas = [];
  for (var i = 0; i < sheets.length; i++) nomeAbas.push(sheets[i].getName());

  var msgAbas = "Arquivo: " + ssCentral.getName() + "\n\nAbas disponíveis:\n";
  for (var i = 0; i < nomeAbas.length; i++) msgAbas += (i + 1) + ". " + nomeAbas[i] + "\n";
  if (abaAtual) msgAbas += "\nAba atual: " + abaAtual;
  msgAbas += "\n\nDigite o número da aba do projeto que esta planilha deve usar:";

  var respostaAba = ui.prompt("🆔 Configurar ID Global [AD] — Passo 2/2", msgAbas, ui.ButtonSet.OK_CANCEL);
  if (respostaAba.getSelectedButton() !== ui.Button.OK) return;

  var numAba = parseInt(respostaAba.getResponseText().trim(), 10);
  if (isNaN(numAba) || numAba < 1 || numAba > nomeAbas.length) {
    alerta("⚠️ Número inválido. Digite um número entre 1 e " + nomeAbas.length + ".");
    return;
  }

  var abaEscolhida = nomeAbas[numAba - 1];
  var abaObj      = ssCentral.getSheetByName(abaEscolhida);
  var contador    = abaObj.getRange(2, 1).getValue();
  if (!contador || isNaN(Number(contador))) {
    alerta("⚠️ A aba '" + abaEscolhida + "' não tem um contador válido em A2.\n\nCertifique-se de que A2 contém um número inteiro (ex: 1).");
    return;
  }

  props.setProperty(CONFIG.propIdCentral,  novoId);
  props.setProperty(CONFIG.propAbaProjeto, abaEscolhida);
  configurarTriggerAD_(true);

  alerta("✅ ID Global [AD] configurado!\n\nArquivo: " + ssCentral.getName() +
    "\nProjeto (aba): " + abaEscolhida +
    "\nPróximo ID: [AD-" + String(Number(contador)).padStart(3, "0") + "]" +
    "\n\nAo preencher o gatilho na aba '" + CONFIG.nomeAbaAds + "', o ID será gerado automaticamente.");
  registrarLog("🆔 Configurar ID Global [AD]", 1, 0, [], "Arquivo: " + novoId + " | Projeto: " + abaEscolhida);
}

function verificarIdGlobal() {
  var props      = PropertiesService.getDocumentProperties();
  var id         = props.getProperty(CONFIG.propIdCentral);
  var abaProjeto = props.getProperty(CONFIG.propAbaProjeto) || "";

  if (!id) {
    alerta("❌ Nenhum ID configurado.\n\nVá em: OperaPro ⚙️ > ⚙️ Configurar Planos e Pedidos > 🆔 Configurar ID Global [AD]");
    return;
  }

  try {
    var ss  = SpreadsheetApp.openById(id);
    var aba = abaProjeto ? ss.getSheetByName(abaProjeto) : null;

    if (!aba) {
      alerta("❌ Aba do projeto '" + abaProjeto + "' não encontrada.\n\nReconfigure via 🆔 Configurar ID Global [AD].\n\nArquivo: " + ss.getName());
      return;
    }

    var proximoNum = Number(aba.getRange(2, 1).getValue()) || 1;
    var proximoId  = "[AD-" + String(proximoNum).padStart(3, "0") + "]";

    alerta("✅ Conexão com ID Global [AD] OK!\n\nArquivo: " + ss.getName() +
      "\nProjeto (aba): " + abaProjeto +
      "\nPróximo ID: " + proximoId + " (contador: " + proximoNum + ")" +
      "\n\nID do arquivo:\n" + id);
  } catch (e) {
    alerta("❌ Falha ao acessar o arquivo central:\n" + e.message + "\n\nID salvo:\n" + id);
  }
}

function removerIdGlobal() {
  var ui = SpreadsheetApp.getUi();
  var resposta = ui.alert(
    "↩️ Remover configuração ID Global [AD]",
    "Isso removerá o ID e o projeto salvos, desativando a geração automática de IDs na aba '" + CONFIG.nomeAbaAds + "'.\n\nDeseja continuar?",
    ui.ButtonSet.YES_NO
  );
  if (resposta !== ui.Button.YES) return;

  var props = PropertiesService.getDocumentProperties();
  props.deleteProperty(CONFIG.propIdCentral);
  props.deleteProperty(CONFIG.propAbaProjeto);
  removerTriggerAD_();
  alerta("✅ Configuração de ID Global [AD] removida.\nTrigger desativado.");
  registrarLog("↩️ Remover ID Global [AD]", 0, 0, [], "ID e projeto removidos");
}

function ajustarContadorAD() {
  var props      = PropertiesService.getDocumentProperties();
  var id         = props.getProperty(CONFIG.propIdCentral);
  var abaProjeto = props.getProperty(CONFIG.propAbaProjeto) || "";

  if (!id) {
    alerta("❌ Nenhum arquivo central configurado.\n\nVá em: ⚙️ Configurar Planos e Pedidos > 🆔 Configurar ID Global [AD]");
    return;
  }

  var numAtual = "";
  try {
    var ssCentral = SpreadsheetApp.openById(id);
    var aba       = ssCentral.getSheetByName(abaProjeto);
    if (aba) {
      var val = aba.getRange(2, 1).getValue();
      if (val) numAtual = "\nContador atual: " + val + " (próximo seria [AD-" + String(Number(val)).padStart(3, "0") + "])";
    }
  } catch (e) {}

  var ui = SpreadsheetApp.getUi();
  var resposta = ui.prompt(
    "🔢 Ajustar contador [AD] — " + (abaProjeto || "projeto não configurado"),
    "Informe o número a partir do qual a sequência deve continuar." +
    numAtual +
    "\n\nExemplo: se o último ID criado foi [AD-071], digite 72.\nO próximo gerado será [AD-072].",
    ui.ButtonSet.OK_CANCEL
  );

  if (resposta.getSelectedButton() !== ui.Button.OK) return;

  var novoNum = parseInt(resposta.getResponseText().trim(), 10);
  if (isNaN(novoNum) || novoNum < 1) {
    alerta("⚠️ Valor inválido. Digite apenas um número inteiro maior que zero.");
    return;
  }

  try {
    var ssCentral = SpreadsheetApp.openById(id);
    var aba       = ssCentral.getSheetByName(abaProjeto);
    if (!aba) { alerta("❌ Aba '" + abaProjeto + "' não encontrada no arquivo central."); return; }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      aba.getRange(2, 1).setValue(novoNum);
    } finally {
      lock.releaseLock();
    }

    var proximoId = "[AD-" + String(novoNum).padStart(3, "0") + "]";
    alerta("✅ Contador ajustado!\n\nProjeto: " + abaProjeto + "\nPróximo ID que será gerado: " + proximoId);
    registrarLog("🔢 Ajustar contador [AD]", 1, 0, [], "Projeto: " + abaProjeto + " | Novo contador: " + novoNum + " → próximo: " + proximoId);
  } catch (e) {
    alerta("❌ Erro ao ajustar contador:\n" + e.message);
  }
}

function configurarTriggerAD() {
  var props = PropertiesService.getDocumentProperties();
  var id    = props.getProperty(CONFIG.propIdCentral);
  if (!id) {
    alerta("⚠️ Configure primeiro o ID do arquivo central.\n\nVá em: ⚙️ Configurar Planos e Pedidos > 🆔 Configurar ID Global [AD]");
    return;
  }
  configurarTriggerAD_(false);
  alerta("✅ Trigger [AD] configurado!\nAo preencher 'Assunto' na aba '" + CONFIG.nomeAbaAds + "', o ID será gerado automaticamente.");
}

function configurarTriggerAD_(silencioso) {
  removerTriggerAD_();
  ScriptApp.newTrigger("onEditGerarIdAD")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();

  var nomePlanilha = SpreadsheetApp.getActiveSpreadsheet().getName();
  var origem = silencioso ? "via configurarIdGlobal()" : "via menu";
  registrarLog("🔗 Trigger [AD] instalado", 1, 0, [],
    "Planilha: " + nomePlanilha + " | Origem: " + origem + " | Função: onEditGerarIdAD | Aba monitorada: " + CONFIG.nomeAbaAds);

  if (!silencioso) alerta("✅ Trigger [AD] instalado com sucesso.");
}

function removerTriggerAD_() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "onEditGerarIdAD") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

function lerColunasAD_() {
  var props = PropertiesService.getDocumentProperties();
  return {
    colGatilho: parseInt(props.getProperty("adCols_gatilho") || "7", 10),
    colTipo:    parseInt(props.getProperty("adCols_tipo")    || "4", 10),
    colAD:      parseInt(props.getProperty("adCols_ad")      || "3", 10),
  };
}

function configurarColunasAD() {
  var ui    = SpreadsheetApp.getUi();
  var atual = lerColunasAD_();

  var msg =
    "Informe o número de cada coluna (ex: A=1, B=2, C=3, D=4...).\n\n" +
    "Valores atuais:\n" +
    "• Gatilho (dispara o ID):  col " + atual.colGatilho + "\n" +
    "• Tipo ([VID]/[BNR]):      col " + atual.colTipo    + "\n" +
    "• ID ([AD-XXX]):           col " + atual.colAD      + "\n\n" +
    "Digite os 3 valores separados por vírgula:\n" +
    "Gatilho, Tipo, ID\n\nExemplo: 7,4,3";

  var resposta = ui.prompt("🟩 Configurar colunas [AD]", msg, ui.ButtonSet.OK_CANCEL);
  if (resposta.getSelectedButton() !== ui.Button.OK) return;

  var partes = resposta.getResponseText().trim().split(",");
  if (partes.length !== 3) { alerta("⚠️ Informe exatamente 3 valores separados por vírgula."); return; }

  var valores = partes.map(function(p) { return parseInt(p.trim(), 10); });
  if (valores.some(isNaN) || valores.some(function(v) { return v < 1; })) {
    alerta("⚠️ Todos os valores devem ser números inteiros maiores que zero.");
    return;
  }

  var props = PropertiesService.getDocumentProperties();
  props.setProperty("adCols_gatilho", String(valores[0]));
  props.setProperty("adCols_tipo",    String(valores[1]));
  props.setProperty("adCols_ad",      String(valores[2]));

  alerta("✅ Colunas [AD] configuradas!\n\n• Gatilho: col " + valores[0] +
    "\n• Tipo:    col " + valores[1] + "\n• ID:      col " + valores[2]);
  registrarLog("🟩 Configurar colunas [AD]", 1, 0, [],
    "Gatilho=" + valores[0] + " Tipo=" + valores[1] + " ID=" + valores[2]);
}

function onEditGerarIdAD(e) {
  try {
    var sheet = e.range.getSheet();
    if (sheet.getName() !== CONFIG.nomeAbaAds) return;

    var linha  = e.range.getRow();
    var coluna = e.range.getColumn();

    var cols = lerColunasAD_();
    if (coluna !== cols.colGatilho || linha < CONFIG.linhaInicioAds) return;

    var gatilho = e.range.getValue();
    if (!gatilho || String(gatilho).trim() === "") return;

    var props     = PropertiesService.getDocumentProperties();
    var idCentral = props.getProperty(CONFIG.propIdCentral);
    if (!idCentral) { Logger.log("onEditGerarIdAD: ID central não configurado."); return; }

    var idExistente = String(sheet.getRange(linha, cols.colAD).getValue() || "").trim();
    if (idExistente && idExistente.indexOf("[AD-") === 0) {
      Logger.log("onEditGerarIdAD: linha " + linha + " já tem ID " + idExistente);
      return;
    }

    var tipo         = String(sheet.getRange(linha, cols.colTipo).getValue() || "").trim();
    var nomePlanilha = SpreadsheetApp.getActiveSpreadsheet().getName();

    var resultado = reservarIdNaCentral_(idCentral, "", String(gatilho).trim(), nomePlanilha, tipo);
    if (!resultado || !resultado.sucesso) {
      Logger.log("onEditGerarIdAD: Falha — " + (resultado ? resultado.erro : "sem resposta"));
      return;
    }

    sheet.getRange(linha, cols.colAD).setValue(resultado.id);
    var labelTipo = tipo || "sem tipo";
    registrarLog("🆔 ID Gerado [AD]", 1, 0, [],
      resultado.id + " [" + labelTipo + "] | gatilho: " + String(gatilho).trim() + " | " + nomePlanilha);
    progresso(resultado.id + " (" + labelTipo + ") gerado com sucesso!", "🆔 ID Global [AD]");

  } catch (err) {
    Logger.log("onEditGerarIdAD erro: " + err.message);
  }
}

function obterAbaCentral_(idArquivo) {
  var props      = PropertiesService.getDocumentProperties();
  var abaProjeto = props.getProperty(CONFIG.propAbaProjeto) || "";
  if (!abaProjeto) throw new Error("Aba do projeto não configurada. Use '🆔 Configurar ID Global [AD]'.");
  var ssCentral = SpreadsheetApp.openById(idArquivo);
  var aba = ssCentral.getSheetByName(abaProjeto);
  if (!aba) throw new Error("Aba '" + abaProjeto + "' não encontrada no arquivo central.");
  return aba;
}

function reservarIdNaCentral_(idArquivo, projeto, assunto, planilhaOrigem, tipo) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); }
  catch (e) { return { sucesso: false, erro: "Timeout ao aguardar acesso à central: " + e.message }; }

  try {
    var aba = obterAbaCentral_(idArquivo);

    var proximoNum = Number(aba.getRange(2, 1).getValue());
    if (!proximoNum || isNaN(proximoNum)) proximoNum = 1;

    var idFormatado = "[AD-" + String(proximoNum).padStart(3, "0") + "]";
    var labelTipo   = tipo ? String(tipo).trim() : "";

    aba.getRange(2, 1).setValue(proximoNum + 1);

    var ultimaLinha = Math.max(aba.getLastRow() + 1, 3);
    aba.getRange(ultimaLinha, 1, 1, 6).setValues([[
      idFormatado,
      labelTipo,
      new Date(),
      planilhaOrigem,
      assunto,
      Session.getActiveUser().getEmail()
    ]]);

    SpreadsheetApp.flush();
    return { sucesso: true, id: idFormatado };

  } catch (e) {
    return { sucesso: false, erro: e.message };
  } finally {
    lock.releaseLock();
  }
}

function setupArquivoCentral() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var respostaNome = ui.prompt(
    "🆔 Criar aba de projeto",
    "Digite o nome do projeto para criar a aba no arquivo central.\nExemplo: TRG-Le68",
    ui.ButtonSet.OK_CANCEL
  );
  if (respostaNome.getSelectedButton() !== ui.Button.OK) return;

  var nomeProjeto = respostaNome.getResponseText().trim();
  if (!nomeProjeto) { alerta("Nome não informado."); return; }

  var aba = ss.getSheetByName(nomeProjeto);
  if (!aba) aba = ss.insertSheet(nomeProjeto);

  aba.getRange("A1:F1").setValues([[
    "Próximo ID", "ID Gerado", "Tipo", "Data", "Planilha de Origem", "Assunto"
  ]]);
  aba.getRange("A1:F1").setFontWeight("bold").setBackground("#4a86e8").setFontColor("#ffffff");

  if (!aba.getRange("A2").getValue()) aba.getRange("A2").setValue(1);
  aba.getRange("A2").setBackground("#fff2cc").setFontWeight("bold");

  aba.setColumnWidth(1, 110);
  aba.setColumnWidth(2, 110);
  aba.setColumnWidth(3, 120);
  aba.setColumnWidth(4, 160);
  aba.setColumnWidth(5, 280);
  aba.setColumnWidth(6, 220);
  aba.setFrozenRows(1);

  var idArquivo = ss.getId();
  ui.alert(
    "✅ Aba '" + nomeProjeto + "' criada!\n\n" +
    "Estrutura:\n• A2 = contador (inicia em 1)\n• B+ = histórico de IDs gerados\n\n" +
    "ID do arquivo central:\n" + idArquivo + "\n\n" +
    "Nas planilhas de projeto:\n" +
    "OperaPro ⚙️ > ⚙️ Configurar > 🆔 Configurar ID Global [AD]\n" +
    "→ Cole o ID acima e selecione a aba '" + nomeProjeto + "'"
  );
}
