---
name: estrutura-drive
description: Armar ou conferir a estrutura de pastas de um projeto do IBFT no Google Drive (lançamento, lançamento semanal, Black Friday, evento, funil) e dizer onde salvar ou achar um arquivo. Usar quando o pedido for abrir a pasta de um projeto novo, conferir se a pasta está pronta para o menu OperaPro ⚙️, achar a pasta de um projeto pelo campo Projeto 2026 do Asana ou decidir onde um arquivo deve morar.
---

# Estrutura do Drive

Referências: **MD 10**, seção 3 (as cinco unidades, nomenclatura, como achar a pasta de um projeto) e **MD 13**, seção 7 (o esqueleto da pasta de projeto e como o script acha cada subpasta).

## O que você consegue fazer daqui

Você não cria pasta no Drive. Você **diz exatamente o que criar e onde**, e **confere** o que existe quando há um conector do Google Drive na sessão (ou a pessoa cola a lista de pastas). Documentos de copy e subpastas de cada peça **não se criam à mão**: quem cria é o menu OperaPro ⚙️ da planilha de Planos e Pedidos (skill `planos-e-pedidos`).

## 1. Abrir a pasta de um projeto novo

1. **Onde:** unidade `1. 💰Vendas`:
   - lançamento: `1.1. 🚀Lançamentos` › `1.BRASIL` ou `2.LATAM`;
   - Lançamento Semanal: dentro da pasta-mãe `[TRG-Ls01] Lançamento Semanal` (ou `[TRG-ES-Ls01] Lançamento Semanal ES`), uma pasta por ciclo;
   - funil perpétuo: `1.2. 🔽Perpétuos`;
   - evento: `1.3. 🎤Eventos`.
2. **Nome:** `[CÓDIGO] (Mmm-aa)`, como `[TRG-Le75] (Jan-27)`. Black Friday leva o nome: `[BF-Li03] Black Friday (nov-26)`. O código é o mesmo do campo `Projeto 2026` do Asana, sem o mês.
3. **Esqueleto** (os nomes têm que começar exatamente assim, porque o script procura pelo começo do nome):

```
[CÓDIGO] (Mmm-aa)
├── ♟️Concepção
│   ├── ✍🏼Copy + Estratégia (Big Idea, Narrativa, Promessa)
│   ├── 🎥Vídeos (Projeto Padrão, Vinheta)
│   └── 🎨Identidade Visual (Manual de Marca, Logos)
├── ✍🏼Copys
├── 🎥🎨🎵Vídeos, Estáticos, Áudios
│   ├── ✉[DIS][GWPP] Grupos de Whastapp (criativos)
│   │   ├── Aprovados (🏁Pronto para rodar)
│   │   ├── Material Bruto
│   │   └── Validação
│   ├── 🎥🎨🎵Vídeos, Estáticos, Áudios avulsos
│   │   ├── Aprovados (🏁Pronto para rodar)   → Áudios · Estáticos · Vídeos
│   │   ├── Material Bruto                    → Áudios · Estáticos · Vídeos
│   │   └── Validação                         → Áudios · Estáticos · Vídeos
│   ├── 📢Ads Tráfego Pago (criativos)
│   │   ├── Aprovados (🏁Pronto para rodar)   → Estáticos · Vídeos
│   │   ├── Material Bruto                    → Estáticos · Vídeos
│   │   └── Validação                         → Estáticos · Vídeos
│   └── 📱Social Media
│       ├── Aprovados (🏁Pronto para rodar)
│       ├── Material Bruto
│       └── Validação
└── 📝Documentos
```

4. **Em `📝Documentos`, os três documentos do projeto**, copiados dos templates de `4.02. 🔀Setor de Projetos` com o nome `[CÓDIGO] <nome do template>`: Termo de Abertura, Checklist e Planos e Pedidos (este, sempre do template; nunca do projeto anterior).
5. **Passe para a pessoa o ID da pasta raiz** (o trecho do link depois de `/folders/`): ele vai na célula C3 da `⚙️Configs` do Planos e Pedidos.

O caminho mais rápido para o esqueleto é copiar as pastas vazias de um projeto anterior. `[A validar]`: se o time tem uma pasta modelo para isso. Se copiar de um projeto anterior, **copie só as pastas**, nunca os arquivos.

## 2. Conferir uma pasta antes de rodar o menu

- [ ] A pasta raiz é a deste projeto, e o ID dela está na `⚙️Configs` C3.
- [ ] Existe uma subpasta começando com `✍` (Copys).
- [ ] Existe `🎥🎨🎵Vídeos, Estáticos, Áudios` com as três subpastas: a de grupos (`✉[DIS][GWPP]...`), a de avulsos (`🎥🎨🎵...avulsos`) e a de Ads (`📢Ads...`), cada uma com `Validação` e `Material Bruto`.
- [ ] Os nomes não foram "corrigidos" (o `Whastapp` com erro de digitação é o que o script espera).
- [ ] `📝Documentos` tem TAP, Checklist e Planos e Pedidos com o código deste projeto.

Se o cache das Notes não achar uma pasta, a pessoa roda 🩺 Diagnosticar Notes Cache, que mostra o que não casou.

## 3. Achar a pasta de um projeto a partir de uma tarefa do Asana

Leia o campo `Projeto 2026` da tarefa (`TRG-Le74 (Dez-26)`) e procure na unidade `1. 💰Vendas` a pasta com a mesma **abreviação** (`[TRG-Le74] (Dez-26)`). Nem sempre o texto bate inteiro; a abreviação bate (MD 10, seção 3.7). Criativo da peça: `🎥🎨🎵...` › pasta do tipo de peça › `Validação` › subpasta com o nome da tarefa.

## 4. Onde mora cada coisa (fora dos projetos)

| O que | Onde |
| :---- | :---- |
| Templates de projeto (TAP, Checklist, Planos e Pedidos) | `4. 🔀Setores (Processos)` › `4.02. 🔀Setor de Projetos` › `[Template] Documentos` e `[Template] Planilhas` |
| Controle de Campos, Guia de Horas, POPs, ID Global de anúncios | `4.02` › `[Projetos] Processos e Procedimentos` |
| Documento maestro e Padrão de Descrição | `4.01. ✍🏼️Setor de Estratégia e Copy` › `[Copy] Processos e Procedimentos` |
| Anúncios validados para reaproveitar | `1.1. 🚀Lançamentos` › `Central de Anúncios` › `🥇Ads validados` |
| Projetos encerrados | `1.1. 🚀Lançamentos` › `Projetos Finalizados` › `Brasil` ou `Latam` |
| Planejamento anual, metas | `5. ♟️Gestão e Estratégia` › `5.1. Negócio e Estratégia` › `2026` (acesso restrito) |
| Conteúdo orgânico | `2. 📢Marketing` › `2.02. Conteúdo` |
| Material de produto (aulas, depoimentos) | `3. 📦Produto e 🫂Experiência do Cliente (CX)` |

## Regras desta skill

- **Só unidade compartilhada.** Nada de projeto no "Meu Drive" de alguém: sai com a pessoa.
- **Não renomeie pasta que o script usa** sem atualizar o MD 13 e o script juntos.
- **Encerrar projeto é mover a pasta** para `Projetos Finalizados`, não copiar: mover mantém o link de tudo que já circulou.
- Nunca oriente apagar pasta ou arquivo de projeto. Se algo sobrar, a pessoa decide.
