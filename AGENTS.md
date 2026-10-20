# Base de conhecimento do IBFT para o Claude Code

Este repositório é a base que o Claude Code lê ao trabalhar na operação do **IBFT** (Instituto Brasileiro de Formação de Terapeutas) e do **Onion**. Ele junta duas coisas:

- **`base-conhecimento/`**: os MDs 00 a 15, o conhecimento do negócio e da operação. É a **fonte única**: os Projetos do Claude (claude.ai) e o Drive recebem cópias daqui.
- **`.claude/skills/`**: os roteiros de trabalho para as tarefas do dia a dia da gestão de projetos.

O método de gestão é a **Operação Turbinada**, da OperaPro: o método em si, com o roteiro de implantação, está no MD 15; como ele está aplicado no IBFT, no MD 10, seção 1. Toda a operação de lançamentos roda em três ferramentas: a planilha de **Planos e Pedidos** de cada projeto (MD 13), o **Asana** com Kanbans e automações (MD 14) e o **Google Drive** organizado em cinco unidades (MD 10, seção 3).

## Comece por aqui

1. Leia o `base-conhecimento/MD00.md`: o mapa dos MDs e qual consultar para cada tarefa.
2. Para tarefa de gestão, use a skill certa:

| Pedido | Skill | MDs |
| :---- | :---- | :---- |
| Montar, preencher ou conferir o Planos e Pedidos de um projeto; gerar linhas para colar; backlog para o Asana | `planos-e-pedidos` | 13, 05, 14 |
| Abrir ou conferir a pasta de um projeto no Drive; onde salvar ou achar um arquivo | `estrutura-drive` | 10, 13 |
| Criar, revisar ou testar automação, campo, opção ou Kanban no Asana; entender por que uma tarefa parou | `automacoes-asana` | 14, 10 |
| Abrir projeto, TAP, kickoff, sprint, andamento, relatório de status, debriefing | `gestao-de-projetos` | 10, 05, 11 |
| Implantar o método numa unidade nova (LATAM, Onion, um setor novo), acompanhar a implantação ou explicar o método | `implantar-operacao-turbinada` | 15, 10, 14, 13 |
| Escrever copy | (sem skill) | 07, 06, 05, 02/03, 12, e o MD 13 para saber em qual documento a peça entra |

## Regras de trabalho

- **Não invente.** Data, meta, oferta, pessoa, quantidade de peça, nome de coluna ou opção que não está na base nem na fonte vira pergunta ou `[A validar]`. Dado ausente marcado é melhor que dado inventado com cara de certo.
- **Mostre o plano antes de qualquer escrita em ferramenta dos outros.** Criar ou mover tarefa no Asana, publicar regra, rodar o menu da planilha, criar pasta: a pessoa aprova antes. Tarefa e regra notificam gente.
- **Planilha de Planos e Pedidos nasce do template**, nunca da cópia do projeto anterior (MD 13, seção 13: a cópia escreve nos documentos do outro lançamento).
- **Valor de campo do Asana é copiado exatamente** da lista do Controle de Campos, com emoji e espaço (MD 14, seção 3).
- **A base é uma só.** Mudou um processo, uma ferramenta, um campo, uma regra: proponha a mudança no MD correspondente, aqui, e depois as cópias (claude.ai, Drive) são substituídas inteiras. Não se edita a cópia.
- **Cada conteúdo mora em um MD.** Se dois precisam do mesmo dado, um aponta para o outro.
- **Segredo não entra neste repositório**: nada de token, senha, chave de API ou dado pessoal de aluno.
- **Fale em português do Brasil**, direto, com o nome das coisas como elas aparecem nas ferramentas (`✉Grupos de Whastapp`, com o erro de digitação, é o nome da aba).

## O que você alcança daqui

- **Ler:** os MDs e as skills sempre. Drive e Asana, só se a sessão tiver o conector correspondente; sem ele, peça à pessoa o link, o export ou o print.
- **Escrever:** neste repositório (MDs, skills), quando a pessoa pedir. Nas planilhas, você entrega **blocos prontos para colar** (skill `planos-e-pedidos`). Documentos de copy e pastas de peça são criados pelo menu **OperaPro ⚙️** da planilha, que a pessoa roda. Regras do Asana só se montam pela tela.

## Estrutura

```
AGENTS.md                      este arquivo (o CLAUDE.md aponta para ele)
README.md                      para quem instala e mantém
base-conhecimento/MD00..MD15   a base (fonte única)
.claude/skills/                planos-e-pedidos, estrutura-drive, automacoes-asana, gestao-de-projetos,
                               implantar-operacao-turbinada
apps-script/                   cópia de leitura do Apps Script do Planos e Pedidos (v10.35) e o histórico
```

## Glossário rápido

| Termo | O que é |
| :---- | :---- |
| **Operação Turbinada** | o método de gestão da OperaPro: Planejamento, Produção e Operação, implantado em seis etapas (MD 15) |
| **PE** | projeto especial ou estruturante (`PE-NNN`), sem receita direta; a implantação do método numa unidade é um PE |
| **Planos e Pedidos (P&P)** | a planilha de cada projeto, uma linha por peça; gera tarefas, documentos de copy e pastas (MD 13) |
| **TAP** | Termo de Abertura do Projeto: escopo, metas, datas, responsáveis |
| **Checklist** | o cronograma mestre do projeto, com as datas de entrega de cada área |
| **Controle de Campos** | a planilha que documenta campos, Kanbans e automações do Asana; a fonte da verdade (MD 14) |
| **Espelho** | a aba do P&P que importa o Controle de Campos e alimenta as listas suspensas |
| **Documento maestro** | o documento com o modelo de cada tipo de peça, que o script copia para os documentos de copy |
| **Menu OperaPro ⚙️** | o menu do Apps Script dentro do P&P (MD 13, seção 12) |
| **ID Global [AD]** | a numeração única dos anúncios entre projetos, mantida num arquivo central |
| **`[Etapas] Criação`** | o campo que mostra em que etapa da produção a tarefa está, de qualquer quadro |
| **Kanbans de produção / recebimento** | as esteiras do Asana: onde se produz e onde quem usa a peça a coloca no ar (MD 14) |
| **Velocímetro** | a produtividade em pontos de complexidade, por pessoa e setor (MD 10, seção 11) |
