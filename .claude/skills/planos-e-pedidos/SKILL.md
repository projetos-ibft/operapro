---
name: planos-e-pedidos
description: Montar, preencher ou revisar a planilha de Planos e Pedidos de um projeto do IBFT (lançamento, lançamento semanal, Black Friday, evento). Usar quando o pedido for criar a planilha de um projeto novo, listar as peças de um lançamento, gerar as linhas de uma aba para colar, conferir uma planilha antes de rodar o menu OperaPro ⚙️ ou montar o backlog para o Asana.
---

# Planos e Pedidos

O manual completo é o **MD 13** (`base-conhecimento/MD13.md`). Leia antes de começar. Esta skill é o roteiro de trabalho.

## Antes de tudo: o que você consegue fazer daqui

Você não escreve na planilha diretamente. O seu trabalho é **preparar e conferir**; quem cola, roda o menu e importa no Asana é a pessoa. Por isso:

- **Leitura:** se houver um conector do Google Drive nesta sessão, leia a planilha por ele. Sem conector, peça à pessoa o link e um export (Arquivo › Fazer download › .xlsx ou .csv da aba).
- **Escrita:** você entrega **blocos prontos para colar**, um por aba, no formato da seção "Formato de entrega".
- **Menu OperaPro ⚙️ e Apps Script:** quem roda é a pessoa. Você diz qual item, em que ordem, e o que conferir depois.

## 1. Criar a planilha de um projeto novo

1. Confirme com a pessoa: **código do projeto** (`[TRG-Le75]`), **modelo** (mensal, semanal, interno, evento), **mercado** (Brasil ou LATAM) e as **datas-âncora** (início da captação, aulas ou live, abertura e fechamento do carrinho, reabertura). Datas vêm do Planejamento anual e do Checklist; não invente.
2. Oriente a criação, seguindo o MD 13, seção 2:
   - pasta do projeto em `1.1. 🚀Lançamentos` › `1.BRASIL` ou `2.LATAM`, com o esqueleto do MD 13, seção 7 (skill `estrutura-drive`);
   - **cópia do template** `[IBFT][Template] Planos e Pedidos v2.1 (Apps Scripts)` para `📝Documentos`, com o nome `[CÓDIGO] Planos e Pedidos v2.1 (Scripts)`. **Nunca a cópia da planilha do projeto anterior** (MD 13, seção 13);
   - `⚙️Configs`: C3 com o ID da pasta raiz (ID puro), C4 com o código entre colchetes;
   - autorizar o Espelho (A1 do `⚙️Espelho Campos Personalizados` › Permitir acesso);
   - se houver anúncios, configurar o ID Global (BR ou LATAM), o trigger e as colunas [AD].
3. Lembre a pessoa de apagar as abas de backlog datadas que o template ainda carrega, se ela quiser a planilha limpa (MD 13, seção 10).

## 2. Montar a lista de peças

1. **Receita:** peça o link da planilha do **último projeto do mesmo modelo** e leia as abas de peças. Ela é a melhor referência: mesmas abas, mesma cadência. As contagens típicas estão no MD 13, seção 11, e o que cada fase pede no MD 05, seção 8.
2. **Desloque as datas** pelas datas-âncora do novo projeto. Mantenha a distância de cada peça até a âncora dela (aula, abertura do carrinho), não a data do calendário.
3. **Confira com o desenho** da campanha (Miro) e o TAP: peça prevista que falta, peça que sobra.
4. **Mostre a lista à pessoa antes de gerar os blocos**: por aba, quantas peças, por fase, e o que mudou em relação à receita. Peça o OK.

## 3. Preencher cada peça (as regras)

- **Nome:** `[Subtipo-NNN][Formato][Fase][Projeto] Assunto`. Prefixos e tags no MD 10, seção 3.6. A numeração recomeça em cada projeto e é sequencial por aba; nos anúncios o `[AD-NNN]` vem do ID Global: deixe só `[AD]` e avise a pessoa que, depois de colar, ela precisa editar a célula de gatilho de cada anúncio, um por vez, porque o acionador numera só a primeira linha de uma colagem (MD 13, seção 13).
- **Valores de campo exatamente iguais às opções** do Controle de Campos (listas no MD 14, seção 3), com emoji e espaço. Valor fora da lista vira opção nova no Asana quando o backlog é importado. `⏳Backlog ` (Etapa) tem um espaço no fim.
- **Toda peça leva:** `📝Status Tarefa` = `Não iniciado`; `[Etapas] Criação` = `⏳Backlog `; `Tipo de Tarefa`; `Subtipo de Tarefa`; `Setor`; `Projeto 2026` (`TRG-Le75 (Jan-27)`); `Fase da Ação`; `📅Data Veiculação`; `⏱Sprint`; `📽Status Gravação`; `Tamanho`; `Complexidade` (MD 14, seção 4); `Idioma`; `🔖Marca Mãe`; `📦Produto`.
- **Papéis:** o `👤` de cada papel que toca a peça (o nome, ou `A definir` se ainda não se sabe) e `N/A` nos que não tocam. Não atribua pessoa por palpite: use o padrão do projeto anterior ou `A definir`.
- **`📽Status Gravação`:** `Pendente` se vai ser gravado, `Reaproveitamento` ou `IA` se não, `Duplicação` se é cópia de peça existente, `N/A` se não é vídeo nem áudio.
- **Notes:** deixe vazia para a pessoa gerar pelo menu (📝 Preencher Notes). Escreva só quando pedirem, seguindo o Padrão de Descrição (MD 13, seção 4).
- **Marcações:** `❌` nas colunas `📄Doc subido?`, `📁Pasta subida?` e `Subido Asana?` das peças da fase que vai ser liberada agora; em branco nas de fases futuras.
- **Sprint por fase:** peças de captação e aquecimento entram nas primeiras sprints; lembrete e CPL depois; vendas e downsell por último (marcos do POP, MD 10, seção 7.1). Confirme os números de sprint com a pessoa.

## 4. Formato de entrega (blocos para colar)

Um bloco por aba, em texto separado por **tabulação**, sem cabeçalho, com **todas as colunas da aba na ordem exata** de `colunas-por-aba.md` (nesta pasta). Antes de gerar, pergunte em que linha a pessoa vai colar em cada aba (a primeira linha vazia).

- Coluna sem valor: deixe vazia (duas tabulações seguidas), nunca escreva "vazio" ou "-".
- Coluna `📝Nome da Tarefa/Arquivo`: a fórmula com o número da linha de destino, no separador `;` da planilha em português, igual à do template. Exemplo para a aba de Ads colando na linha 5: `=CONCATENATE(D5;E5;F5;H5;" ";I5)`. Confira em `colunas-por-aba.md` quais letras a aba usa (ID, formato, fase, projeto e assunto mudam de letra entre abas).
- Datas no formato da planilha (`dd/mm/aaaa`) e horário `hh:mm`.
- Entregue cada bloco num bloco de código separado, com o nome da aba e a linha de início em cima, para a pessoa copiar e colar na célula A da linha indicada.

Depois de colar, peça à pessoa que confira as células com triângulo vermelho (valor fora da lista).

## 5. Conferir uma planilha antes de rodar o menu

Leia a planilha e responda com uma lista do que está certo e do que precisa de ação:
- [ ] `⚙️Configs` C3 é o ID da pasta **deste** projeto (abra e confira o nome) e C4 é o código **deste** projeto.
- [ ] `📄Drive Docs`: os IDs preenchidos são de documentos da pasta `✍🏼Copys` **deste** projeto. Linha com ✅ e ID de outro projeto é o erro mais caro (MD 13, seção 13): o menu escreveria no documento do outro lançamento.
- [ ] Marcações: só ❌ nas linhas a processar agora.
- [ ] Toda peça liberada tem nome, `Tipo de Tarefa`, `Subtipo`, `Fase da Ação`, `📅Data Veiculação`, `Setor`, `📽Status Gravação`.
- [ ] Nenhum valor fora das listas do Controle de Campos.
- [ ] Nenhum nome de peça repetido na mesma aba (entraria uma vez só no documento).
- [ ] O Espelho está autorizado (as listas suspensas abrem com opções).

## 6. Rodar o menu (a ordem que você passa à pessoa)

1. ⚙️ Configurar › ⚙️📝 [Docs] Criar e gerar IDs
2. ⚙️ Configurar › ⚙️📁 [Pastas] Gerar IDs
3. 🔍 Verificar configuração (não escreve nada); depois 🧪 Testar uma linha, que processa de verdade a primeira linha com ❌ da aba e serve para a pessoa conferir o documento antes de rodar o resto
4. 📝 Preencher docs de copy
5. 📁 Criar pastas no Drive
6. 🔄 Sincronizar pastas no cache Notes, depois selecionar as linhas e 📝 Preencher Notes (linhas selec.)
7. Conferir o resumo de cada execução (processadas, puladas, erros) e a aba `📋Log`. "Pulado" quase sempre é marcação diferente de ❌.

## 7. Backlog para o Asana

Siga o MD 13, seção 9: duplicar `⏳Backlog - Template`, renomear `DD-MM-AAAA⏳Backlog`, colar as peças **casando coluna por nome** (a aba de Ads não tem `🕥Horário`), baixar CSV, importar no `⏳Backlog`, marcar `Subido Asana?` = ✅. Você pode gerar o bloco já na ordem das 30 colunas do backlog.

## Regras desta skill

- Não invente data, meta, pessoa, quantidade de peça ou oferta. O que faltar vira pergunta ou `[A validar]`.
- Mostre o plano de peças antes de gerar os blocos.
- Não oriente copiar a planilha do projeto anterior, nem rodar o menu numa planilha que aponta para outro projeto.
- Se a tarefa revelar algo novo sobre a planilha ou o script, proponha a atualização do MD 13.
