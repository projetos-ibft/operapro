// ============================================================
// OPERAPRO — Automação: Planos e Pedidos
// Versão: v10.35 — MODULAR (split em arquivos)
// ============================================================
// v10.35 — Split em arquivos + fixes:
//   • Removida duplicação de criarAbaNotes e constantes NOTES
//   • Wrapper onEditDependenciasRapido ativado no trigger
//   • Deduplicação de constantes órfãs
// ============================================================

var CONFIG = {
  abaDocs:         "📄Drive Docs",
  abaCondicionais: "📄Drive Docs Condicionais",
  abaPastas:       "📁Drive Pastas",
  abaConfigs:      "⚙️Configs",
  abaLog:          "📋Log",

  colSubidoDocs:      "📄Doc subido?",
  colSubidoPastas:    "📁Pasta subida?",
  colSubidoUnificado: "Subido Drive e Docs?",
  colNome:      "📝Nome da Tarefa/Arquivo",
  colData:      "📅Data Veiculação",
  colStatusGrav:"📽Status Gravação",
  colHorario:   "🕥Horário",
  colBase:      "🎯Base de Envio",
  colTipo:      "Tipo de Tarefa",
  colSubtipo:   "Subtipo de Tarefa",

  idMaestro: "15g9HEqhYL_WK0ft0hLY9I7O7sqy4mSt7wl1X-y_ull8",

  guiaAgrupaPorData: "(agrupa por data - H1)",
  guiaSemGuia:       "(sem guia - insere no fim)",

  diasSemana: ["seg","ter","qua","qui","sex","sáb","dom"],
  meses:      ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],

  lockTimeoutMs: 5000,

  // ── ID Global [AD] ──────────────────────────────────────────
  propIdCentral:  "idGlobal_idArquivoCentral",
  propAbaProjeto: "idGlobal_abaProjeto",
  nomeAbaAds:     "📢Ads Tráfego Pago",
  linhaInicioAds: 2,

  // ── Chaves PropertiesService para colunas configuráveis ─────
  propColGatilho: "adCols_gatilho",
  propColTipo:    "adCols_tipo",
  propColAD:      "adCols_ad",
};

// ── Chave de armazenamento — Dependências de Colunas ────────
var PROP_DEP_CONFIG = "depColunas_config";

// ── Cache de dependências ───────────────────────────────────
var CACHE_KEY_DEP_CONFIG = "operaPro_depConfig";
var CACHE_KEY_DEP_ABAS   = "operaPro_depAbas";
var CACHE_DEP_DURACAO    = 21600;

// ── CacheService helpers ────────────────────────────────────
var CACHE_KEY_SS_ID   = "operaPro_centralSsId";
var CACHE_DURACAO_SEG = 360;

// ── Links de pasta por aba (para campo criativo em docs) ────
var LINKS_PASTA_CRIATIVO = {
  "✉Grupos de Whastapp": "",
  "✉Api Whatsapp":       "",
  "✉Automação Whastapp": "",
};

// ── Mapeamento docs de copy por sufixo ──────────────────────
var MAPA_DOCS_COPY = [
  { sufixo: "[Copy] Ads Tráfego Pago",          aba: "📢Ads Tráfego Pago"       },
  { sufixo: "[Copy] LP",                         aba: "✈️LPs"                  },
  { sufixo: "[Copy][BNR] Estáticos Avulsos",    aba: "🎨Estáticos Avulsos"     },
  { sufixo: "[Copy][VID] Vídeos Avulsos",       aba: "🎥Vídeos Avulsos"        },
  { sufixo: "[Copy][aEM] Automação de E-mail",  aba: "✉Automação de E-mail"    },
  { sufixo: "[Copy][EM] E-mail Avulso",         aba: "✉E-mail Avulso"          },
  { sufixo: "[Copy][GWPP] Grupos de Whatsapp",  aba: "✉Grupos de Whastapp"     },
  { sufixo: "[Copy][WPPi] Api Whatsapp",        aba: "✉Api Whatsapp"           },
  { sufixo: "[Copy][WPPa] Automação Whastapp",  aba: "✉Automação Whastapp"     },
  { sufixo: "[Copy] SMS",                        aba: "✉SMS"                    },
  { sufixo: "[Copy][LIG] Ligação",               aba: "☎️Ligação"               },
];

// ── Mapeamento pastas de criativos por prefixo ──────────────
var MAPA_PASTAS_CRIATIVOS = [
  { prefixo: "✉[DIS][GWPP]", abas: ["✉Grupos de Whastapp"] },
  { prefixo: "🎥🎨🎵",        abas: ["🎨Estáticos Avulsos", "🎥Vídeos Avulsos",
                              "✉Api Whatsapp", "✉Automação Whastapp"] },
  { prefixo: "📢Ads",         abas: ["📢Ads Tráfego Pago"] },
];

// ── Aliases de colunas de status ────────────────────────────
var ALIAS_COLUNAS_STATUS = {
  "📄Doc Subido?":    ["Subido Drive?", "Subido Drive e Docs?", "📄Doc subido?"],
  "📁Pasta subida?":  ["Subido Drive?", "Subido Drive e Docs?", "📁Pasta Subida?"],
};
