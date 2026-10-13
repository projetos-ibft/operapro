---
name: gestao-de-projetos
description: Conduzir um projeto do IBFT do início ao fechamento pelo método Operação Turbinada, que é o método de gestão de projetos da OperaPro (abrir projeto, preparar kickoff, planejar sprint por fase, acompanhar o checklist, montar relatório de sprint ou status, preparar debriefing). Usar quando o pedido for sobre o andamento de um lançamento, o que falta para uma fase, a sprint da semana, um relatório de status ou o fechamento de um projeto.
---

# Gestão de projetos

Referências: **MD 10** (seção 7.1, o ciclo do lançamento; seção 6, os rituais; seção 11, os relatórios e o Velocímetro), **MD 05** (seção 8, o que cada fase pede), **MD 13** (Planos e Pedidos) e **MD 14** (Asana).

## 1. Abrir um projeto (fase de Início)

Monte com a pessoa o checklist de abertura, na ordem do guia de transição (MD 10, seção 7.1), dizendo o que já existe e o que falta:

- [ ] Datas e metas definidas no Planejamento Geral (Diretoria + OperaPro)
- [ ] Pasta do projeto no Drive (skill `estrutura-drive`)
- [ ] Checklist com as datas da operação (`[CÓDIGO] Checklist v1.0`, do template)
- [ ] Concepção da campanha (só em campanha nova)
- [ ] Termo de Abertura (`[CÓDIGO] Termo de Abertura v1.0`, do template)
- [ ] Desenho da campanha no Miro
- [ ] Planos e Pedidos (skill `planos-e-pedidos`)
- [ ] Opção do projeto no campo `Projeto 2026` do Asana (skill `automacoes-asana`)
- [ ] Backlog importado e estrutura no Asana
- [ ] Kickoff marcado

Para o **TAP**, ajude a redigir a partir do template e do TAP do último projeto do mesmo tipo: objetivo, escopo, metas, datas das fases, responsáveis por área (MD 10, seção 5.1). Datas e metas vêm da pessoa ou do Planejamento anual, nunca de suposição.

## 2. Planejar a sprint

- O IBFT roda em sprint quinzenal (Planejamento na segunda, Revisão e Retrospectiva na sexta, Refinamento do Backlog na quarta: MD 10, seção 6).
- **A produção segue os marcos por fase** do POP do Analista de Projetos: LD + AQ funcional, LD + AQ finalizados, LM + CPL finalizados, VD e DSELL finalizado (MD 10, seção 7.1). A sprint puxa do Backlog as peças da fase que vem, com prazo antes da `📅Data Veiculação`.
- **Capacidade em pontos:** some a `Complexidade` das peças por papel e compare com o que cada pessoa entregou nas últimas sprints (velocity, MD 10, seção 11). Sinalize papel sobrecarregado antes de fechar a sprint.
- Entregue a proposta de sprint em tabela: peça, fase, data de veiculação, papel, pontos. Marque o que fica de fora e por quê.

## 3. Acompanhar o andamento

Para responder "como está o lançamento" ou "o que está atrasado":
- **Checklist do projeto:** as datas de entrega de cada área.
- **Asana:** o campo `[Etapas] Criação` diz em que etapa cada peça está, de qualquer quadro. `🏁Pronto para rodar` e `✅Tarefa Concluída` contam como entregue.
- **Alertas do sistema de relatórios** (MD 10, seção 11.9): peça parada há mais de X dias no mesmo Kanban (2 dias disparos, 3 design e copy, 5 edição), veiculação em menos de 3 dias fora de 🏁, veiculação vencida.
- **Não confie só no `📝Status Tarefa`.** Confira a coluna e o histórico antes de dizer que algo não andou.

## 4. Relatório de sprint ou de status

Formato:
1. **Sumário executivo** primeiro: o que foi feito, o que trava, o que precisa de decisão.
2. **Por objetivo ou por fase**, um item por linha, com marca fixa: ✅ concluído · 🟡 avançou sem fechar · 🔵 sem avanço · 🔴 impedimento ou atraso. Item com parte feita e parte travada vira duas linhas.
3. **Números:** peças planejadas × entregues por fase; pontos entregues por setor; veiculações em risco.
4. **Próximos passos** e o que fica para a sprint seguinte.

Números saem do Asana e da planilha; a leitura (por que travou, o que fazer) é julgamento e se escreve como tal.

## 5. Fechamento (Debriefing)

Prepare o roteiro do Debriefing (MD 10, seção 7.1): resultados contra as metas do TAP e do Planejamento (MD 11, seção 9), cumprimento de cronograma por fase, retrabalho (campos `Correção ...?`), pontos entregues por setor, o que funcionou e o que mudar no próximo. Modelos de apresentação: `4.02` › `[Template] Apresentações`. Depois, a pasta do projeto vai para `Projetos Finalizados`.

## Regras desta skill

- Não invente data, meta, resultado nem responsável. Pergunte ou marque `[A validar]`.
- Antes de criar ou mover qualquer coisa no Asana, mostre o plano e espere o OK.
- Aprendizado de processo que vale para os próximos projetos vira proposta de atualização do MD 10, 13 ou 14.
