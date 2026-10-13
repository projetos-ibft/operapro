// ============================================================
// TEMPLATE — leitura e inserção em Google Docs
// ============================================================

function obterChaveTemplate(nomeAba) {
  return nomeAba;
}

function obterCamposExtras(linha, colMap, nomeAba, rowIndex, horariosCache) {
  var idxHor  = colMap[CONFIG.colHorario];
  var idxBase = colMap[CONFIG.colBase];
  var idxTipo = colMap[CONFIG.colTipo];
  var horario = "";

  // v10.30 — getDisplayValue() resolve fuso horário corretamente
  if (idxHor !== undefined) {
    var h = linha[idxHor];
    if (h !== "" && h !== null && h !== undefined) {
      if (horariosCache && horariosCache[rowIndex] !== undefined) {
        horario = String(horariosCache[rowIndex]).trim();
      } else {
        try {
          var ss2  = SpreadsheetApp.getActiveSpreadsheet();
          var aba2 = ss2.getSheetByName(nomeAba);
          if (aba2 && rowIndex !== undefined) {
            horario = aba2.getRange(rowIndex, idxHor + 1).getDisplayValue().trim();
          }
        } catch(ex) {}
      }
    }
  }

  var base    = (idxBase !== undefined) ? String(linha[idxBase] || "").trim() : "";
  var tipo    = (idxTipo !== undefined) ? String(linha[idxTipo] || "").trim() : "";
  var temCriativo = (tipo.indexOf("🎨")>=0 || tipo.indexOf("🎥")>=0 || tipo.indexOf("🎵")>=0);
  var linkPasta   = LINKS_PASTA_CRIATIVO[nomeAba] || "";
  var pasta       = temCriativo ? linkPasta : "N/A";
  return { horario:horario, base:base, pasta:pasta, temCriativo:temCriativo };
}

function clonarBloco(bloco) {
  var copia = [];
  for (var i = 0; i < bloco.length; i++) {
    var item = bloco[i];
    var novo = {};
    for (var k in item) { if (item.hasOwnProperty(k)) novo[k] = item[k]; }
    copia.push(novo);
  }
  return copia;
}

function aplicarExtrasNoBloco(bloco, extras) {
  if (!extras) return bloco;
  var resultado = [];
  for (var i = 0; i < bloco.length; i++) {
    var item = bloco[i];
    if (item.tipo !== "paragraph" && item.tipo !== "list") {
      resultado.push(item);
      continue;
    }
    var t = (item.texto || "").trim();
    if (t === "- 🕥Horário:" || t === "- 🕥Horário: N/A") {
      var novo = {};
      for (var k in item) { if (item.hasOwnProperty(k)) novo[k] = item[k]; }
      novo.texto = "- 🕥Horário: " + extras.horario;
      resultado.push(novo);
    } else if (extras.base && (t === "- 🎯Base de Envio:" || t === "- 🎯Base de Envio: N/A")) {
      var novo = {};
      for (var k in item) { if (item.hasOwnProperty(k)) novo[k] = item[k]; }
      novo.texto = "- 🎯Base de Envio: " + extras.base;
      resultado.push(novo);
    } else if (t === "- 📁Pasta para criativo:" || t === "- 📁Pasta para criativo: N/A") {
      var novo = {};
      for (var k in item) { if (item.hasOwnProperty(k)) novo[k] = item[k]; }
      novo.texto = "- 📁Pasta para criativo: " + extras.pasta;
      resultado.push(novo);
    } else {
      resultado.push(item);
    }
  }
  return resultado;
}

function lerBlocoTemplate(docTpl, nomeGuia) {
  var body      = docTpl.getBody();
  var total     = body.getNumChildren();
  var bloco     = [], dentro = false;
  var guiaNorm  = normalizarTexto(nomeGuia);
  for (var i = 0; i < total; i++) {
    var el   = body.getChild(i);
    var tipo = el.getType();
    if (tipo === DocumentApp.ElementType.PARAGRAPH) {
      var p       = el.asParagraph();
      var heading = p.getHeading();
      var texto   = p.getText().trim();
      var textoN  = normalizarTexto(texto);
      var ehTitle = (heading===DocumentApp.ParagraphHeading.TITLE ||
                     heading===DocumentApp.ParagraphHeading.HEADING1);
      if (ehTitle) {
        if (!texto) continue;
        if (textoN === guiaNorm) { dentro=true; continue; }
        if (dentro) { if (texto.indexOf("📅")===0) continue; break; }
        continue;
      }
      if (dentro) bloco.push({
        tipo:"paragraph", texto:p.getText(), heading:heading,
        bold:!!p.getAttributes()[DocumentApp.Attribute.BOLD],
        italic:!!p.getAttributes()[DocumentApp.Attribute.ITALIC]
      });
    } else if (tipo===DocumentApp.ElementType.HORIZONTAL_RULE && dentro) {
      bloco.push({ tipo:"rule" });
    } else if (tipo===DocumentApp.ElementType.LIST_ITEM && dentro) {
      var li = el.asListItem();
      bloco.push({ tipo:"list", texto:li.getText(),
        bold:!!li.getAttributes()[DocumentApp.Attribute.BOLD],
        italic:!!li.getAttributes()[DocumentApp.Attribute.ITALIC]
      });
    }
  }
  return bloco;
}

function h2Existe(body, nomeTarefa) {
  var total = body.getNumChildren();
  for (var i = 0; i < total; i++) {
    var el = body.getChild(i);
    if (el.getType() !== DocumentApp.ElementType.PARAGRAPH) continue;
    var p = el.asParagraph();
    if (p.getHeading() === DocumentApp.ParagraphHeading.HEADING2 &&
        p.getText().trim() === nomeTarefa.trim()) return true;
  }
  return false;
}

function inserirNoDoc(docCopy, guia, nomeTarefa, bloco, dataH1, extras) {
  var body = docCopy.getBody();
  if (h2Existe(body, nomeTarefa)) return;
  var pos;
  if      (dataH1)                             pos = encontrarOuCriarH1(body, dataH1);
  else if (!guia || guia===CONFIG.guiaSemGuia) pos = body.getNumChildren();
  else                                          pos = encontrarOuCriarH1(body, guia);
  var blocoFinal = aplicarExtrasNoBloco(bloco, extras);
  var items = blocoFinal.concat([{ tipo:"rule" }]);
  for (var j = items.length-1; j>=0; j--) inserirElemento(body, pos, items[j]);
  var h2 = inserirParagrafo(body, pos, nomeTarefa);
  h2.setHeading(DocumentApp.ParagraphHeading.HEADING2);
}

function encontrarOuCriarH1(body, texto) {
  var total=body.getNumChildren(), posH1=-1, posProx=-1;
  for (var i=0; i<total; i++) {
    var el=body.getChild(i);
    if (el.getType()!==DocumentApp.ElementType.PARAGRAPH) continue;
    var p=el.asParagraph();
    var h=p.getHeading();
    var ehH1=(h===DocumentApp.ParagraphHeading.HEADING1||h===DocumentApp.ParagraphHeading.TITLE);
    if (!ehH1) continue;
    if (p.getText().trim()===texto) { posH1=i; }
    else if (posH1>=0) { posProx=i; break; }
  }
  if (posH1>=0) return posProx>=0 ? posProx : body.getNumChildren();
  if (body.getNumChildren()>0) body.appendParagraph("");
  var novo=body.appendParagraph(texto);
  novo.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  return body.getNumChildren();
}

function inserirElemento(body, idx, item) {
  if (item.tipo==="rule") return inserirParagrafo(body, idx, "");
  var p=inserirParagrafo(body, idx, item.texto||"");
  if (item.tipo==="list") { try { p.setListAttributes(DocumentApp.ListType.BULLET); } catch(e) {} }
  else if (item.heading && item.heading!==DocumentApp.ParagraphHeading.NORMAL) {
    try { p.setHeading(item.heading); } catch(e) {}
  }
  if (item.bold)   p.setBold(true);
  if (item.italic) p.setItalic(true);
  return p;
}

function inserirParagrafo(body, idx, texto) {
  if (idx>=body.getNumChildren()) return body.appendParagraph(texto);
  return body.insertParagraph(idx, texto);
}

function obterDataH1(linha, colMap) {
  var idx=colMap[CONFIG.colData];
  if (idx===undefined) return "📅N/A";
  var val=linha[idx];
  if (!val) return "📅N/A";
  return formatarDataH1(val)||"📅N/A";
}

function formatarDataH1(val) {
  try {
    var dt=(val instanceof Date)?val:new Date(val);
    if (isNaN(dt.getTime())) return null;
    var d=CONFIG.diasSemana[dt.getDay()===0?6:dt.getDay()-1];
    var dia=("0"+dt.getDate()).slice(-2);
    var mes=CONFIG.meses[dt.getMonth()];
    return "📅"+d+".,"+dia+" "+mes+".";
  } catch(e) { return null; }
}
