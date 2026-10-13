// ============================================================
// NOTES — v10.34 (com cache) — DEDUPLICADO v10.35
// ============================================================

// ── Abas COM subcategoria (leem Tipo de Tarefa) ──
var NOTES_ABAS_COM_SUBCATEGORIA = [
  "✉Api Whatsapp",
  "✉Grupos de Whastapp",
  "✉Automação Whastapp",
  "📢Ads Tráfego Pago"
];

// ── Subcategorias válidas por aba ──
var NOTES_SUBCATEGORIAS_POR_ABA = {
  "✉Api Whatsapp":       ["🎥Vídeo", "🎨Estático", "🎵Áudio", "✉[DIS] WPP/FB/TEL"],
  "✉Grupos de Whastapp": ["🎥Vídeo", "🎨Estático", "🎵Áudio", "✉[DIS] WPP/FB/TEL"],
  "✉Automação Whastapp": ["🎥Vídeo", "🎨Estático", "🎵Áudio", "✉[DIS] WPP/FB/TEL"],
  "📢Ads Tráfego Pago":  ["🎥Vídeo", "🎨Estático"]
};

// ── Tipos que só precisam do doc de copy (não buscam pastas) ──
var NOTES_TIPOS_APENAS_DOC = {
  "✉[DIS] WPP/FB/TEL": true
};

// ── Abas SEM subcategoria (uma única linha na aba Notes) ──
var NOTES_ABAS_SEM_SUBCATEGORIA = [
  "🎨Estáticos Avulsos",
  "🎥Vídeos Avulsos",
  "✈️LPs",
  "✉E-mail Avulso",
  "✉Automação de E-mail",
  "☎️Ligação",
  "✉SMS"
];

// ── Mapeamento pasta pai por aba (dentro de 🎥🎨🎵) ──
// v10.35: prefixos ampliados para tolerar variações de nome no Drive.
// Se algum aba continuar falhando, rode diagnosticarNotesCache()
// e ajuste os prefixos conforme os nomes reais das pastas.
var NOTES_PASTA_PAI = {
  "📢Ads Tráfego Pago":  ["📢Ads", "Ads Tráfego", "Ads"],
  "✉Api Whatsapp":       ["✉[DIS][GWPP]", "GWPP", "Api Whatsapp", "Whatsapp"],
  "✉Grupos de Whastapp": ["✉[DIS][GWPP]", "GWPP", "Grupos"],
  "✉Automação Whastapp": ["✉[DIS][GWPP]", "GWPP", "Grupos"],
  "🎨Estáticos Avulsos": ["Estáticos Avulsos", "Avulsos", "🎨"],
  "🎥Vídeos Avulsos":    ["Vídeos Avulsos", "Avulsos", "🎥"]
};

// ── Subpasta fixa por aba (v10.35: array de candidatos) ──
var NOTES_SUBPASTA_FIXA = {
  "🎨Estáticos Avulsos": ["Estáticos", "Estático", "Estaticos", "Estatico"],
  "🎥Vídeos Avulsos":    ["Vídeos", "Vídeo", "Videos", "Video"]
};

// ── Subpasta por subcategoria (v10.35: array de candidatos) ──
var NOTES_SUB_POR_TIPO = {
  "🎥Vídeo":    ["Vídeos", "Vídeo", "Videos", "Video"],
  "🎨Estático": ["Estáticos", "Estático", "Estaticos", "Estatico"],
  "🎵Áudio":    ["Áudios", "Áudio", "Audios", "Audio"]
};

// ── Se subpasta por tipo não existir, usa pastaBase (Aprovados/Material/Validação) ──
var NOTES_FALLBACK_PARA_PAI = true;

// ── Abas sem subpastas por tipo dentro de Aprovados/Material/Validação ──
var NOTES_SEM_SUBPASTA_TIPO = {
  "✉Api Whatsapp":       true,
  "✉Grupos de Whastapp": true,
  "✉Automação Whastapp": true
};

// ── Abas que só têm doc de copy (sem pastas de criativos) ──
var NOTES_APENAS_DOC = {
  "✈️LPs":                true,
  "✉E-mail Avulso":       true,
  "✉Automação de E-mail": true,
  "☎️Ligação":            true,
  "✉SMS":                 true
};

// ============================================================
// v10.35: Templates padrão embutidos por Tipo/Subcategoria
// Usados quando criarAbaNotes cria linhas novas E como fallback
// quando o template na aba ⚙️Notes está vazio.
// Marcadores: {ASSUNTO} {DOC} {APROV} {MAT} {VAL}
// ============================================================
var TEMPLATES_PADRAO = {
  "🎥Vídeo":
    "{ASSUNTO}\n\n" +
    "📐 FORMATOS\n" +
    "Resolução:\n" +
    " ■ 2K\n" +
    " □ 4K\n" +
    "Proporção:\n" +
    "□ Horizontal (16x9)\n" +
    "■ Vertical (9x16)\n" +
    "□ Quadrado (4x5)\n" +
    "Canais:\n" +
    "□ Feed\n" +
    "□ Meta\n" +
    "■ Reels/Stories/Short\n" +
    "□ Youtube (16x9)\n" +
    "□ Whatsapp\n" +
    "□ Outros: Especificar :\n\n" +
    "📄 Doc de Copy:\n{DOC}\n" +
    "📂 Material Bruto:\n{MAT}\n" +
    "📂 Validação:\n{VAL}\n" +
    "🏁 Pronto para rodar:\n{APROV}",

  "🎨Estático":
    "{ASSUNTO}\n\n" +
    "📐 FORMATOS\n" +
    "□ Feed (1080x1080) (1350x1080)\n" +
    "□ Reels/Stories (1080x1920)\n" +
    "□ Meta (1200x628)\n" +
    "□ Youtube (1920x1080)\n" +
    "■ Carrossel\n" +
    "□ Google Display (GDN)\n" +
    "   (1200x628) (600x314)\n" +
    "   (1200x1200) (300x300)\n" +
    "□ Whatsapp/Telegram\n" +
    "□ Banner Apolo\n" +
    "□ Modal Apolo\n" +
    "□ Outros: Especificar:\n\n" +
    "📄 Doc de Copy:\n{DOC}\n" +
    "📂 Material Bruto:\n{MAT}\n" +
    "📂 Validação:\n{VAL}\n" +
    "🏁 Pronto para rodar:\n{APROV}",

  "🎵Áudio":
    "{ASSUNTO}\n\n" +
    "📄 Doc de Copy:\n{DOC}\n" +
    "📂 Material Bruto:\n{MAT}\n" +
    "📂 Validação:\n{VAL}\n" +
    "🏁 Pronto para rodar:\n{APROV}",

  "✉[DIS] WPP/FB/TEL":
    "{ASSUNTO}\n\n" +
    "📄 Doc de Copy: \n{DOC}",

  "__padrao__":
    "{ASSUNTO}\n\n" +
    "📄 Doc de Copy: \n{DOC}"
};

// Decide qual template default usar dado (aba, subcategoria)
function templateDefault_(nomeAba, sub) {
  // 1. Match direto por subcategoria
  if (sub && TEMPLATES_PADRAO[sub]) return TEMPLATES_PADRAO[sub];
  // 2. Heurística por nome da aba (para abas SEM subcategoria)
  var n = String(nomeAba || "");
  if (n.indexOf("🎥") >= 0 || /V[íi]deos?\b/i.test(n)) return TEMPLATES_PADRAO["🎥Vídeo"];
  if (n.indexOf("🎨") >= 0 || /Est[áa]ticos?\b/i.test(n)) return TEMPLATES_PADRAO["🎨Estático"];
  if (n.indexOf("🎵") >= 0 || /[ÁA]udios?\b/i.test(n)) return TEMPLATES_PADRAO["🎵Áudio"];
  // 3. Fallback padrão
  return TEMPLATES_PADRAO["__padrao__"];
}

// ============================================================
// CRIAR/ATUALIZAR ABA ⚙️Notes
// ============================================================
function criarAbaNotes() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName("⚙️Notes");
    var criada = false;

    if (!aba) {
      aba = ss.insertSheet("⚙️Notes");
      criada = true;

      aba.getRange(1, 1, 1, 3).setValues([["Aba", "Subcategoria", "Template"]]);
      aba.getRange(1, 1, 1, 3)
        .setFontWeight("bold")
        .setBackground("#4a86e8")
        .setFontColor("#ffffff");
      aba.setFrozenRows(1);
      aba.setColumnWidth(1, 220);
      aba.setColumnWidth(2, 180);
      aba.setColumnWidth(3, 600);
    }

    var dados = aba.getDataRange().getValues();
    var existentes = {};
    for (var i = 1; i < dados.length; i++) {
      var chave = String(dados[i][0] || "").trim() + "||" + String(dados[i][1] || "").trim();
      if (chave !== "||") existentes[chave] = true;
    }

    // v10.35: linhas novas nascem com template default embutido
    var linhasEsperadas = [];
    for (var i = 0; i < NOTES_ABAS_COM_SUBCATEGORIA.length; i++) {
      var nomeAba = NOTES_ABAS_COM_SUBCATEGORIA[i];
      var subs = NOTES_SUBCATEGORIAS_POR_ABA[nomeAba] || [];
      for (var s = 0; s < subs.length; s++) {
        linhasEsperadas.push([nomeAba, subs[s], templateDefault_(nomeAba, subs[s])]);
      }
    }
    for (var i = 0; i < NOTES_ABAS_SEM_SUBCATEGORIA.length; i++) {
      linhasEsperadas.push([NOTES_ABAS_SEM_SUBCATEGORIA[i], "", templateDefault_(NOTES_ABAS_SEM_SUBCATEGORIA[i], "")]);
    }

    var linhasParaAdicionar = [];
    for (var i = 0; i < linhasEsperadas.length; i++) {
      var chave = linhasEsperadas[i][0] + "||" + linhasEsperadas[i][1];
      if (!existentes[chave]) linhasParaAdicionar.push(linhasEsperadas[i]);
    }

    if (linhasParaAdicionar.length > 0) {
      var proximaLinha = aba.getLastRow() + 1;
      aba.getRange(proximaLinha, 1, linhasParaAdicionar.length, 3).setValues(linhasParaAdicionar);
    }

    var msgTemplate = "\n\nEdite a coluna 'Template' de cada linha com o formato desejado.\n" +
      "Marcadores disponíveis:\n" +
      "  {ASSUNTO} — valor da coluna 'Assunto' da linha\n" +
      "  {DOC}     — link do Doc de Copy\n" +
      "  {APROV}   — link da pasta Aprovados (Pronto para rodar)\n" +
      "  {MAT}     — link da pasta Material Bruto\n" +
      "  {VAL}     — link da pasta Validação\n\n" +
      "Para o tipo '✉[DIS] WPP/FB/TEL' use apenas {DOC} — não há pastas.\n\n" +
      "Depois de preencher os templates, use '🔄 Sincronizar pastas no cache Notes'.";

    var msg = criada
      ? "✅ Aba ⚙️Notes criada com " + linhasParaAdicionar.length + " linhas." + msgTemplate
      : "✅ Aba ⚙️Notes atualizada.\n\n" + linhasParaAdicionar.length + " linha(s) adicionada(s).\nLinhas existentes preservadas.";

    registrarLog("⚙️ Criar/Atualizar ⚙️Notes", linhasParaAdicionar.length, 0, [],
      criada ? "Aba criada" : "Aba já existia — " + linhasParaAdicionar.length + " linhas novas");

    alerta(msg);

  } finally {
    liberarTrava(lock);
  }
}

// ============================================================
// SINCRONIZAR CACHE — varre o Drive e preenche os IDs
// ============================================================
function sincronizarNotesCache() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    progresso("Sincronizando cache de pastas...", "🔄 Notes Cache");

    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var cfg = lerConfigs_(ss);
    if (!cfg) return;

    var pastaCopys = buscarSubpasta(cfg.pastaRaiz, ["✍", "Copys"]);
    if (!pastaCopys) { alerta("❌ Pasta '✍🏼Copys' não encontrada na raiz do projeto."); return; }

    var pastaMidia = buscarSubpasta(cfg.pastaRaiz, ["🎥🎨🎵", "Vídeos, Estáticos"]);
    if (!pastaMidia) { alerta("❌ Pasta '🎥🎨🎵Vídeos, Estáticos, Áudios' não encontrada na raiz do projeto."); return; }

    var abaCache = ss.getSheetByName("⚙️Notes Cache");
    if (abaCache) abaCache.clear();
    else          abaCache = ss.insertSheet("⚙️Notes Cache");

    abaCache.getRange(1, 1, 1, 6).setValues([[
      "Aba", "Subcategoria", "ID Doc Copy", "ID Aprovados", "ID Material Bruto", "ID Validação"
    ]]);
    abaCache.getRange(1, 1, 1, 6)
      .setFontWeight("bold")
      .setBackground("#4a86e8")
      .setFontColor("#ffffff");
    abaCache.setFrozenRows(1);
    abaCache.setColumnWidth(1, 220);
    abaCache.setColumnWidth(2, 180);
    for (var c = 3; c <= 6; c++) abaCache.setColumnWidth(c, 260);

    var cachePastaPai = {};
    function obterPastaPai(nomeAba) {
      if (cachePastaPai[nomeAba]) return cachePastaPai[nomeAba];
      var prefixos = NOTES_PASTA_PAI[nomeAba];
      if (!prefixos) return null;
      var p = buscarSubpasta(pastaMidia, prefixos);
      cachePastaPai[nomeAba] = p;
      return p;
    }

    var cacheDocs = {};
    var itDocs = pastaCopys.getFiles();
    while (itDocs.hasNext()) {
      var f = itDocs.next();
      cacheDocs[f.getName()] = f.getId();
    }
    function acharDocPorSufixo(sufixo) {
      for (var nome in cacheDocs) {
        if (cacheDocs.hasOwnProperty(nome) && nome.indexOf(sufixo) >= 0) return cacheDocs[nome];
      }
      return "";
    }

    var linhas = [];
    var totalRegistros = 0;

    for (var i = 0; i < NOTES_ABAS_COM_SUBCATEGORIA.length; i++) {
      var nomeAba = NOTES_ABAS_COM_SUBCATEGORIA[i];
      var subs = NOTES_SUBCATEGORIAS_POR_ABA[nomeAba] || [];
      progresso("Processando " + nomeAba, "🔄 Notes Cache");

      for (var s = 0; s < subs.length; s++) {
        var sub = subs[s];
        var linha = processarLinhaCache_(nomeAba, sub, pastaMidia, obterPastaPai, acharDocPorSufixo);
        linhas.push(linha);
        totalRegistros++;
      }
    }

    for (var i = 0; i < NOTES_ABAS_SEM_SUBCATEGORIA.length; i++) {
      var nomeAba = NOTES_ABAS_SEM_SUBCATEGORIA[i];
      progresso("Processando " + nomeAba, "🔄 Notes Cache");
      var linha = processarLinhaCache_(nomeAba, "", pastaMidia, obterPastaPai, acharDocPorSufixo);
      linhas.push(linha);
      totalRegistros++;
    }

    if (linhas.length > 0) {
      abaCache.getRange(2, 1, linhas.length, 6).setValues(linhas);
    }

    SpreadsheetApp.flush();

    var completos = 0, incompletos = [];
    for (var i = 0; i < linhas.length; i++) {
      var l = linhas[i];
      var nomeAba = l[0];
      var sub     = l[1];
      var apenasDocAba  = NOTES_APENAS_DOC[nomeAba];
      var apenasDocTipo = NOTES_TIPOS_APENAS_DOC[sub];

      if (apenasDocAba || apenasDocTipo) {
        if (l[2]) completos++;
        else      incompletos.push(nomeAba + (sub ? " / " + sub : "") + " — sem doc");
      } else {
        var falta = [];
        if (!l[2]) falta.push("doc");
        if (!l[3]) falta.push("aprovados");
        if (!l[4]) falta.push("material");
        if (!l[5]) falta.push("validação");
        if (falta.length === 0) completos++;
        else incompletos.push(nomeAba + (sub ? " / " + sub : "") + " — falta: " + falta.join(", "));
      }
    }

    var msg = "🔄 Sincronização concluída!\n\n" +
      "✅ Completos: " + completos + " / " + totalRegistros + "\n" +
      "⚠️ Incompletos: " + incompletos.length;

    if (incompletos.length > 0) {
      msg += "\n\n" + incompletos.slice(0, 20).join("\n");
      if (incompletos.length > 20) msg += "\n... (+" + (incompletos.length - 20) + ")";
    }

    registrarLog("🔄 Sincronizar Notes Cache", completos, 0, incompletos,
      "Completos=" + completos + " Incompletos=" + incompletos.length);

    alerta(msg);

  } finally {
    liberarTrava(lock);
  }
}

function processarLinhaCache_(nomeAba, sub, pastaMidia, obterPastaPai, acharDocPorSufixo) {
  var apenasDocAba  = NOTES_APENAS_DOC[nomeAba];
  var apenasDocTipo = NOTES_TIPOS_APENAS_DOC[sub];

  var idDoc = "";
  for (var i = 0; i < MAPA_DOCS_COPY.length; i++) {
    if (MAPA_DOCS_COPY[i].aba === nomeAba) {
      idDoc = acharDocPorSufixo(MAPA_DOCS_COPY[i].sufixo);
      break;
    }
  }

  if (apenasDocAba || apenasDocTipo) {
    return [nomeAba, sub, idDoc, "", "", ""];
  }

  var pastaPai = obterPastaPai(nomeAba);
  if (!pastaPai) return [nomeAba, sub, idDoc, "", "", ""];

  var idAprov = "", idMat = "", idVal = "";
  var subAprov = buscarSubpasta(pastaPai, ["Aprovados", "Pronto"]);
  var subMat   = buscarSubpasta(pastaPai, ["Material Bruto", "Material"]);
  var subVal   = buscarSubpasta(pastaPai, ["Validação", "Validacao"]);

  var semSubTipo  = NOTES_SEM_SUBPASTA_TIPO[nomeAba];
  var subFixa     = NOTES_SUBPASTA_FIXA[nomeAba];
  var subDinamica = sub ? NOTES_SUB_POR_TIPO[sub] : null;
  // v10.35: aceita array OU string legada
  var candidatos  = subFixa || subDinamica || null;
  if (candidatos && !Array.isArray(candidatos)) candidatos = [candidatos];

  function resolverSubpasta(pastaBase) {
    if (!pastaBase) return "";
    if (semSubTipo || !candidatos || !candidatos.length) return pastaBase.getId();
    var alvo = buscarSubpasta(pastaBase, candidatos);
    if (alvo) return alvo.getId();
    // v10.35: fallback pro pai se subpasta por tipo não existe
    if (NOTES_FALLBACK_PARA_PAI) return pastaBase.getId();
    return "";
  }

  idAprov = resolverSubpasta(subAprov);
  idMat   = resolverSubpasta(subMat);
  idVal   = resolverSubpasta(subVal);

  return [nomeAba, sub, idDoc, idAprov, idMat, idVal];
}

// ============================================================
// PREENCHER NOTES — linhas selecionadas
// ============================================================
function preencherNotesSelecionados() {
  var lock = adquirirTrava();
  if (!lock) return;

  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getActiveSheet();
    var nomeAba = aba.getName();

    var usaSubcategoria = false;
    var abaSuportada    = false;
    for (var i = 0; i < NOTES_ABAS_COM_SUBCATEGORIA.length; i++) {
      if (NOTES_ABAS_COM_SUBCATEGORIA[i] === nomeAba) { usaSubcategoria = true; abaSuportada = true; break; }
    }
    if (!abaSuportada) {
      for (var i = 0; i < NOTES_ABAS_SEM_SUBCATEGORIA.length; i++) {
        if (NOTES_ABAS_SEM_SUBCATEGORIA[i] === nomeAba) { abaSuportada = true; break; }
      }
    }
    if (!abaSuportada) {
      alerta("⚠️ A aba ativa '" + nomeAba + "' não está configurada para receber Notes.");
      return;
    }

    var selecao = aba.getActiveRange();
    if (!selecao) { alerta("⚠️ Nenhuma linha selecionada."); return; }
    var linhaInicio = selecao.getRow();
    var qtdLinhas   = selecao.getNumRows();
    if (linhaInicio < 2) { alerta("⚠️ Seleção inclui o cabeçalho. Selecione apenas linhas de dados."); return; }

    var cab    = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
    var colMap = mapearColunas(cab);

    var idxNotes = colMap["Notes"];
    if (idxNotes === undefined) {
      alerta("❌ Coluna 'Notes' não encontrada na aba '" + nomeAba + "'.");
      registrarLog("📝 Preencher Notes", 0, 0, ["Coluna 'Notes' não encontrada em: " + nomeAba], null);
      return;
    }

    var idxTipo = colMap["Tipo de Tarefa"];
    if (usaSubcategoria && idxTipo === undefined) {
      alerta("❌ Coluna 'Tipo de Tarefa' não encontrada na aba '" + nomeAba + "'.");
      return;
    }

    // v10.35: coluna Assunto para placeholder {ASSUNTO} no template
    var idxAssunto = colMap[CONFIG.colAssunto];

    var abaNotes = ss.getSheetByName("⚙️Notes");
    if (!abaNotes) {
      alerta("❌ Aba '⚙️Notes' não encontrada.\n\nUse '⚙️ Criar/atualizar aba ⚙️Notes' primeiro.");
      return;
    }
    var dadosNotes = abaNotes.getDataRange().getValues();
    var mapaTemplates = {};
    for (var i = 1; i < dadosNotes.length; i++) {
      var abaNota  = String(dadosNotes[i][0] || "").trim();
      var subNota  = String(dadosNotes[i][1] || "").trim();
      var template = String(dadosNotes[i][2] || "");
      if (!abaNota) continue;
      mapaTemplates[abaNota + "||" + subNota] = template;
    }

    var abaCache = ss.getSheetByName("⚙️Notes Cache");
    if (!abaCache) {
      alerta("❌ Aba '⚙️Notes Cache' não encontrada.\n\nUse '🔄 Sincronizar pastas no cache Notes' primeiro.");
      return;
    }
    var dadosCache = abaCache.getDataRange().getValues();
    var mapaCache = {};
    for (var i = 1; i < dadosCache.length; i++) {
      var abaC = String(dadosCache[i][0] || "").trim();
      var subC = String(dadosCache[i][1] || "").trim();
      if (!abaC) continue;
      mapaCache[abaC + "||" + subC] = {
        doc:   String(dadosCache[i][2] || "").trim(),
        aprov: String(dadosCache[i][3] || "").trim(),
        mat:   String(dadosCache[i][4] || "").trim(),
        val:   String(dadosCache[i][5] || "").trim()
      };
    }

    var dadosSel = aba.getRange(linhaInicio, 1, qtdLinhas, aba.getLastColumn()).getValues();
    var preenchidas = 0;
    var preservadas = [];
    var ignoradas   = [];
    var semTemplate = [];
    var incompletas = [];
    var semAssunto  = []; // v10.35: linhas cujo Assunto veio vazio
    var usaramFallback = 0; // v10.35: quantas usaram TEMPLATES_PADRAO

    for (var r = 0; r < dadosSel.length; r++) {
      var linhaPlanilha = linhaInicio + r;
      var valorNotes = String(dadosSel[r][idxNotes] || "").trim();

      if (valorNotes) { preservadas.push(linhaPlanilha); continue; }

      var chaveBusca;
      if (usaSubcategoria) {
        var tipo = String(dadosSel[r][idxTipo] || "").trim();
        var subsValidas = NOTES_SUBCATEGORIAS_POR_ABA[nomeAba] || [];
        var subValida = false;
        for (var s = 0; s < subsValidas.length; s++) {
          if (subsValidas[s] === tipo) { subValida = true; break; }
        }
        if (!subValida) {
          ignoradas.push("Linha " + linhaPlanilha + " (Tipo: " + (tipo || "vazio") + ")");
          continue;
        }
        chaveBusca = nomeAba + "||" + tipo;
      } else {
        chaveBusca = nomeAba + "||";
      }

      var template = mapaTemplates[chaveBusca];
      var usouFallback = false;
      if (!template || !template.trim()) {
        // v10.35: fallback pro template padrão embutido (por Tipo ou __padrao__)
        template = templateDefault_(nomeAba, usaSubcategoria ? tipo : "");
        usouFallback = true;
      }
      if (!template || !template.trim()) {
        semTemplate.push("Linha " + linhaPlanilha + " (chave: " + chaveBusca + ")");
        continue;
      }

      var ids = mapaCache[chaveBusca] || { doc: "", aprov: "", mat: "", val: "" };

      var linkDoc   = ids.doc   ? "https://docs.google.com/document/d/" + ids.doc + "/edit" : "❌ não encontrado";
      var linkAprov = ids.aprov ? "https://drive.google.com/drive/folders/" + ids.aprov    : "❌ não encontrado";
      var linkMat   = ids.mat   ? "https://drive.google.com/drive/folders/" + ids.mat      : "❌ não encontrado";
      var linkVal   = ids.val   ? "https://drive.google.com/drive/folders/" + ids.val      : "❌ não encontrado";

      // v10.35: valor da coluna Assunto pra placeholder {ASSUNTO}
      var assunto = (idxAssunto !== undefined) ? String(dadosSel[r][idxAssunto] || "").trim() : "";
      if (idxAssunto !== undefined && !assunto) semAssunto.push(linhaPlanilha);

      // v10.35: split().join() substitui TODAS as ocorrências sem regex-escape
      var texto = template
        .split("{ASSUNTO}").join(assunto)
        .split("{DOC}").join(linkDoc)
        .split("{APROV}").join(linkAprov)
        .split("{MAT}").join(linkMat)
        .split("{VAL}").join(linkVal);

      if (texto.indexOf("❌ não encontrado") >= 0) incompletas.push(linhaPlanilha);
      if (usouFallback) usaramFallback++;

      aba.getRange(linhaPlanilha, idxNotes + 1).setValue(texto);
      preenchidas++;
    }

    SpreadsheetApp.flush();

    var msg = "📝 Preenchimento de Notes concluído!\n\n" +
      "✅ Preenchidas: " + preenchidas + "\n" +
      "🧩 Usaram fallback embutido: " + usaramFallback + "\n" +
      "🔒 Preservadas: " + preservadas.length + "\n" +
      "⏭️ Ignoradas (Tipo inválido): " + ignoradas.length + "\n" +
      "⚠️ Sem template: " + semTemplate.length + "\n" +
      "🟡 Preenchidas com links faltando: " + incompletas.length + "\n" +
      "📄 Sem Assunto (coluna vazia): " + semAssunto.length;

    if (preservadas.length > 0) {
      msg += "\n\n🔒 Preservadas: " + preservadas.slice(0, 20).join(", ");
      if (preservadas.length > 20) msg += " ... (+" + (preservadas.length - 20) + ")";
    }
    if (ignoradas.length > 0) {
      msg += "\n\n⏭️ Ignoradas:\n" + ignoradas.slice(0, 15).join("\n");
      if (ignoradas.length > 15) msg += "\n... (+" + (ignoradas.length - 15) + ")";
    }
    if (semTemplate.length > 0) {
      msg += "\n\n⚠️ Sem template:\n" + semTemplate.slice(0, 15).join("\n");
    }
    if (incompletas.length > 0) {
      msg += "\n\n🟡 Preenchidas mas com links faltando:\n" + incompletas.slice(0, 15).join(", ");
    }
    if (semAssunto.length > 0) {
      msg += "\n\n📄 Linhas sem Assunto: " + semAssunto.slice(0, 15).join(", ");
      if (semAssunto.length > 15) msg += " ... (+" + (semAssunto.length - 15) + ")";
    }

    var erros = [];
    for (var i = 0; i < ignoradas.length; i++)   erros.push("Ignorada: " + ignoradas[i]);
    for (var i = 0; i < semTemplate.length; i++) erros.push("Sem template: " + semTemplate[i]);

    registrarLog("📝 Preencher Notes: " + nomeAba, preenchidas, preservadas.length, erros,
      "Preenchidas=" + preenchidas + " Preservadas=" + preservadas.length +
      " Ignoradas=" + ignoradas.length + " SemTemplate=" + semTemplate.length +
      " Incompletas=" + incompletas.length);

    alerta(msg);

  } finally {
    liberarTrava(lock);
  }
}