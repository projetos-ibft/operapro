---
name: automacoes-asana
description: Criar, revisar ou testar automações (regras), campos personalizados, opções de campo e Kanbans no Asana do IBFT. Usar quando o pedido for desenhar uma regra nova, auditar as regras de um quadro, incluir uma pessoa ou um projeto novo nos campos, entender por que uma tarefa foi parar num quadro ou montar um plano de teste.
---

# Automações do Asana

O manual é o **MD 14** (`base-conhecimento/MD14.md`). Leia antes de começar: ele tem os quadros, os campos com as opções, a pontuação, as famílias de regra e as divergências conhecidas entre a planilha e o Asana.

## O que você consegue fazer daqui

- **A API do Asana não cria regras.** Regra se monta pela tela do Asana (Personalizar › Automatizações). O seu trabalho é **desenhar, revisar e montar o roteiro**; quem publica é a pessoa.
- **A fonte da verdade é a planilha** `[IBFT][Asana] Controle de Campos Personalizados e Automações`. Tudo nasce lá antes de existir no Asana.
- Se houver um conector do Asana nesta sessão, use-o para **ler** (quadros, colunas, campos, histórico de tarefas). **Não crie, mova, comente nem conclua tarefa sem a pessoa pedir e aprovar o plano.** Tarefa criada e regra disparada notificam gente.

## 1. Desenhar uma regra nova

1. Entenda o caso: em que quadro, qual o gatilho (quase sempre "tarefa movida para a coluna X"), qual condição (que campo, que valor) e qual efeito.
2. Confira no MD 14, seção 5.1, se é de uma família que já existe (Etapa, Quem faz, Quem valida, Em andamento, Correção, Desvio, Entrega, Recebimento, Conclusão, Backlog). Se for, siga o padrão dela, inclusive no nome.
3. Confira o **nome real das colunas** no Asana (a planilha pode estar atrás: MD 14, seção 5.2). Peça à pessoa um print do quadro ou leia pelo conector.
4. Escreva a regra como **linha da aba de automações**, nas colunas da planilha:

   | Asana ok? | Automação ok? | Projeto | Quando | Marcar Se | Fazer isto | Ações | 🤖Nome da Automação |
   | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
   | FALSE | FALSE | ✍🏼 Kanban de Redação | Uma tarefa foi movida para uma seção | - Seção: 📝A fazer<br>- 👤Redator: Fulano | 👤Definir o responsável como | - Campo responsável: e-mail do redator<br>- Alterar campo📝Status Tarefa para "Não iniciado"<br>- Criar subtarefa: ... | 📝👤Fulano |

5. Aplique os princípios (MD 14, seção 6): regra lê campo, nunca nome; uma regra por pessoa; subtarefa para a mesma pessoa, vencendo no dia; roteamento **acrescenta** ao quadro seguinte; todo valor tem caminho.
6. **Mostre o desenho e espere o OK** antes de dar o roteiro de montagem.
7. Roteiro de montagem na tela: MD 14, seção 6, passo 4, e as pegadinhas do construtor logo abaixo dele. A IA de automação do Asana não compensa: monte à mão.

## 2. Revisar as regras de um quadro

Use o checklist do MD 14, seção 7. Entregue o resultado em três listas:
- **Faltando:** coluna sem regra de Etapa, pessoa ativa sem regra de responsável, valor de campo sem caminho, quadro sem regra de conclusão.
- **Sobrando ou desatualizado:** regra de pessoa que saiu, regra apontando para coluna que mudou de nome, divergência entre planilha e Asana.
- **A decidir:** o que depende de alguém dizer como deve ser. Vira linha `[A validar]` na planilha.

Não proponha apagar regra: desligar e marcar `FALSE` preserva o desenho.

## 3. Montar um plano de teste

Siga o MD 14, seção 8. Entregue:
- a lista de cards `[TESTE]`, um por caminho, com o nome no padrão do quadro e **todos os campos que cada um precisa ter preenchidos antes de entrar na coluna** (crie na última coluna, preencha, só então mova);
- a sequência de movimentos e, para cada um, o que deve acontecer (responsável, subtarefa, campo, quadro de destino, Slack);
- o aviso para o time de que as regras de responsável vão notificar pessoas reais;
- a limpeza no fim (apagar os cards de teste leva as subtarefas junto).

## 4. Campo, opção ou quadro novo

Siga o MD 14, seção 9. Lembre sempre:
- **Opção nova primeiro na planilha** (`Campos Personalizados v1.0`), depois no Asana, com a cor do tipo.
- **Pessoa nova** pede a opção nos campos `👤` do papel dela e a regra de responsável.
- **Subtipo novo** pede a linha no `Padrão de Complexidade`.
- **Projeto novo** é uma opção em `Projeto 2026`, no formato `TRG-Le75 (Jan-27)`.
- A opção nova só aparece no Planos e Pedidos onde a lista suspensa vai até a linha 1001 do Espelho (MD 13, seção 10).

## 5. "Por que a tarefa foi parar ali?" / "Por que ela não andou?"

Peça o link ou o nome da tarefa e leia: o quadro e a coluna atuais, os campos `Tipo de Tarefa`, `Subtipo`, `📽Status Gravação`, `Setor`, `Idioma` e os `👤`, e o histórico (o que o Asana fez e quando). Compare com as regras de desvio e entrega (MD 14, seção 5.1). Tarefa parada quase sempre é campo vazio ou valor sem caminho.

## Regras desta skill

- Não publique, apague nem altere regra, campo ou opção. Desenhe, revise e oriente; quem executa é a pessoa, depois de aprovar.
- Não invente nome de pessoa, coluna ou opção. O que não estiver na planilha nem no Asana vira pergunta.
- Mudou o desenho, mude o MD 14 junto (proponha o texto).
