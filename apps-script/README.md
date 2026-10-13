# Apps Script do Planos e Pedidos

Cópia de **leitura** do código que roda no `[IBFT][Template] Planos e Pedidos v2.1 (Apps Scripts)` (projeto Apps Script `[Automação] Planos e Pedidos`, `1qDOzJPP93tEnmj6SQFVzEFpSvHa0aw7yCXnfe9Lo2_aOasGgqbFbPyJR`), copiada do editor em 13/10/2026. O que roda de verdade é o código dentro de cada planilha: toda cópia do template leva a versão que o template tinha no dia.

Como usar e o que cada item do menu faz: **MD 13** (`base-conhecimento/MD13.md`), seções 2, 8 e 12.

## Arquivos (v10.35)

| Arquivo | O que faz |
| :---- | :---- |
| `Config.gs` | constantes, mapa aba ↔ documento de copy, mapa aba ↔ pasta de criativo, histórico da versão |
| `Menu.gs` | o menu OperaPro ⚙️ |
| `Utils.gs`, `Log.gs`, `Status.gs` | trava, progresso, aba 📋Log, `deveProcessar()` (só ❌ libera) |
| `ConfigProjeto.gs` | lê a ⚙️Configs; cria os documentos de copy e grava os IDs de documentos e pastas |
| `AutomacaoDocs.gs` | preenche os documentos de copy; desfazer |
| `PastasDrive.gs` | cria as pastas de criativo |
| `Template.gs`, `Regras.gs` | leitura do maestro, inserção no documento, regras de Condicionais e Pastas |
| `Verificacao.gs` | verificar configuração, testar uma linha, diagnosticar coluna de status |
| `Notes.gs`, `DiagnosticoNotes.gs` | a descrição das tarefas (⚙️Notes) e o cache de pastas |
| `IdGlobalAD.gs` | numeração única dos anúncios entre projetos |
| `Sidebar.gs`, `Dependencias.gs`, `CacheDep.gs`, `Background.gs` | painel e acionadores das Dependências de Colunas |

## Histórico de versões

| Versão | O que mudou |
| :---- | :---- |
| v10.4 | adaptação ao IBFT: coluna única `Subido Drive e Docs?`, abas de SMS e Ligação, `[Disparo]` normalizado para `[DIS]` |
| v10.5, v10.6 | `deveProcessar()` como porta única: só a célula com ❌ é processada |
| v10.15 a v10.18 | desempenho (cache, escrita em lote) e fuso horário |
| v10.19 | contadores independentes por tipo [VID]/[BNR] |
| v10.20 | Dependências de Colunas |
| v10.21, v10.22 | uso como biblioteca; sincronização em segundo plano ao abrir |
| v10.23 a v10.26 | ID Global [AD] por projeto, com aba selecionável no arquivo central |
| v10.28, v10.29 | aba única `📢Ads Tráfego Pago` (antes BNR e VID separadas); sufixo `[Copy] Ads Tráfego Pago` |
| v10.30 | horário correto nos documentos (`getDisplayValue`) |
| v10.31 | correção de espaços nos rótulos do maestro (Horário, Base de Envio, Pasta para criativo) |
| v10.34 | ⚙️Notes: descrição das tarefas com links do Drive, por aba e subcategoria, com cache |
| v10.35 | código dividido em 18 arquivos; Notes sem duplicação; acionador rápido das Dependências |

Os documentos `#01` e `#02 Código Gs - Apps Script` (em `4.02` › `[Projetos] Processos e Procedimentos`) guardam as versões até a v10.31. Da v10.34 em diante, o código só existia dentro do template; daqui para frente, cada versão nova é copiada para cá numa pasta `vX.YY/`.

## Defeitos conhecidos da v10.35

| Defeito | Efeito | Conserto proposto |
| :---- | :---- | :---- |
| `CONFIG.colAssunto` não existe (`Notes.gs`, linha 470) | o `{ASSUNTO}` das Notes sai sempre vazio | acrescentar `colAssunto: "Assunto",` ao `CONFIG` em `Config.gs` |
| `CONFIG.idMaestro` aponta para o maestro de outro cliente | só aparece se uma aba ficar sem maestro em `📄Drive Docs` | trocar pelo maestro V2.0 do IBFT (`1b6wGnWDo-9SFczJaDGmoPkM74KdD6EbzJ7Yx_IPuYuE`) |
| o maestro escreve `- 🔗Link do criativo:` e o script procura `- 📁Pasta para criativo:` | a linha do criativo nunca é preenchida | alinhar o rótulo (no maestro ou em `Template.gs`) |
| `LINKS_PASTA_CRIATIVO` com valores vazios | mesmo com o rótulo certo, o link sairia vazio | preencher a partir do cache das Notes, ou remover a linha do maestro |
| o acionador do ID Global lê só a primeira célula da edição | colar vários anúncios numera só o primeiro | percorrer todas as linhas de `e.range` em `onEditGerarIdAD` |
| `🎵Áudios Avulsos`, `📱Social Media`, `✉Canal de Whastapp/TL` e `✍️Redação` não estão em `MAPA_DOCS_COPY` | o menu não cria documento de copy para essas abas, embora o maestro V2.0 tenha os blocos | acrescentar o sufixo de cada uma e as linhas em `📄Drive Docs` e Condicionais |

**Antes de mexer:** faça numa cópia do template, teste com 🧪 Testar uma linha, e só então leve ao template e copie a versão nova para cá. As regras de manutenção estão no MD 13, seção 12.
