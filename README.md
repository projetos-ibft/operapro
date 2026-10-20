# operapro

Repositório de automações e ferramentas internas do IBFT. Inclui scripts de integração com Asana, automações de disparo, utilitários de gestão de projetos e experimentos com Claude Code para apoiar a operação de lançamentos e processos.

## IBFT · Base de conhecimento para o Claude Code

Base de conhecimento e roteiros de trabalho para o Claude usado na operação do IBFT. Montada pela OperaPro em outubro de 2026, a partir dos MDs da base de conhecimento IBFT + Onion (maio de 2026), do Controle de Campos do Asana, do template de Planos e Pedidos v2.1 e do Apps Script v10.35.

## O que tem aqui

- `base-conhecimento/`: os MDs 00 a 15. O 13 (Planos e Pedidos e estrutura do Drive) e o 14 (Asana: campos e automações) são novos; o 10 foi reescrito; o 00, o 05 e o 11 foram atualizados; os demais só tiveram o cabeçalho ajustado para a nova contagem. O MD 04 é o do Projeto `🧠[IBFT] Base de Conhecimento` (estrutura didática e grade de módulos), e o MD 04a é a síntese completa das transcrições, que circulava com o nome de MD 04.
- **Em 20/10/2026:** o MD 15 (Operação Turbinada: o método e como implantar) é novo; o 13 ganhou o Checklist aba por aba, a sprint de cada peça, as regras de montagem e as pastas do padrão OperaPro e as pegadinhas do importador do Asana; o 14 ganhou o racional dos campos, a montagem da estrutura pela tela e o painel da sprint; o 00 ganhou o mapa novo.
- `.claude/skills/`: cinco skills que o Claude Code carrega sozinho ao abrir a pasta: `planos-e-pedidos`, `estrutura-drive`, `automacoes-asana`, `gestao-de-projetos` e `implantar-operacao-turbinada`.
- `apps-script/`: cópia de leitura do código que roda no template de Planos e Pedidos, para consulta e manutenção.
- `AGENTS.md`: o contexto que o Claude lê ao abrir o projeto (o `CLAUDE.md` aponta para ele).

## Como usar

**No Claude Code:** clone este repositório e abra o Claude Code na pasta. O `AGENTS.md` e as skills carregam sozinhos. Para tarefas que leem o Drive ou o Asana, conecte os conectores do Google Drive e do Asana na conta do Claude; sem eles, o Claude pede link, export ou print.

**Nos Projetos do Claude (claude.ai):** suba os arquivos de `base-conhecimento/` no projeto `🧠[IBFT] Base de Conhecimento`, **substituindo** as versões antigas. Os projetos específicos (copy, performance, script) recebem só os MDs que usam, sempre copiados daqui.

## Como manter

- **A versão oficial é a deste repositório.** Mudou um MD: muda aqui, faz commit e substitui as cópias (claude.ai, Drive) inteiras. Não se edita a cópia.
- **Os MDs 10, 13 e 14 descrevem ferramentas vivas.** Versão nova do Apps Script, campo ou regra nova no Asana, coluna nova no template: o MD muda na mesma entrega.
- **Versão nova do Apps Script:** copie os arquivos do editor (Extensões › Apps Script, no template) para `apps-script/vX.YY/` e registre a mudança no `apps-script/README.md`.
- **Pendências conhecidas** estão marcadas com `[A validar]` e `[A PREENCHER]` nos MDs, e a lista de consertos do template de Planos e Pedidos está no MD 13, seção 10.
