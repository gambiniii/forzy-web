<!--
DOCUMENTO CONSOLIDADO — Challenge Sprint 3 (Governança em IA e Business Analytics)
Projeto Forzy Digital Twin — CS1 + CS2 + CS3 (documentação viva)

ORIENTAÇÕES DE MONTAGEM (remover antes de gerar o .docx final):
- Este .md é a fonte. O .docx final segue ABNT/FIAP (capa, sumário, lista de figuras).
- Seções marcadas com  ✍️ AUTORAL — GRUPO ESCREVE  NÃO podem ser escritas por IA (regra do barema):
  9.3 Matriz de Supervisão  e  11 Considerações Finais.
- Marcações  [IMG]  indicam onde entram os prints reais do app (capturar forçando anomalia).
- Legenda da figura ACIMA da imagem; Fonte ABAIXO (padrão FIAP).
-->

# FORZY — Gêmeo Digital com IA
## Governança em IA e Business Analytics
### Challenge Sprint 3 — Inteligência Operacional e Governança da Decisão

**Curso:** Tecnólogo em Inteligência Artificial (2TIAPY) — 1º Semestre / 2026
**Disciplina:** Governança em IA e Business Analytics

**Grupo:**
- Matheus Cardoso Gomes — RM 564898
- Caique Signorelli e Sousa Salerno — RM 563621
- Paulo Gabriel Pessoa da Silva — RM 566446
- William Stahl Sanches Furquim Garcia — RM 562800
- Lucas Gambini — RM 564750

---

## Sumário

1. Introdução
2. Estruturação de Ativos e Controle de Exibição *(base — CS1)*
   2.1 Matriz de Hierarquia e Acesso (RBAC)
   2.2 Modelagem da Cadeia D-I-C-I
3. Rastreabilidade, Ética e Proteção de Ativos *(base — CS1)*
   3.1 Protocolo de Rastreabilidade — Log de Auditoria
   3.2 Explainability — Prevenção da Caixa-Preta
   3.3 Mitigação de Viés, Fairness e Human-in-the-Loop
4. Clareza e Explicabilidade na Interface *(evolução — CS2)*
   4.1 Disclaimers Visuais — D+0 vs. Histórico
   4.2 Protocolo de Justificativa de Status
5. Rastreabilidade da Associação TAG–Ativo–Localização *(evolução — CS2)*
   5.1 Dicionário de Metadados de Auditoria de Localização (DMAL)
   5.2 Linhagem do Dado — Validado vs. IA-Generated
6. Controle de Exibição e Segurança — RBAC Evoluído *(evolução — CS2)*
   6.1 Matriz de Visibilidade Operacional na Planta Digital
   6.2 Princípio de Minimização de Dados
7. Metric Contract — Contrato de Métricas dos Sensores *(novo — CS3)*
   7.1 Descrição do Caso
   7.2 Informações Gerais
   7.3 Objetivo de Negócio
   7.4 Métricas (Vibração, Temperatura, Aceleração)
   7.5 Métricas de Qualidade
   7.6 Thresholds e Alertas
   7.7 Plano de Monitoramento
8. Circuit Breaker — Governança da Incerteza *(novo — CS3)*
   8.1 Gatilhos de Trava
   8.2 Comportamento Fail-Safe
   8.3 Integração com o Handoff Humano
9. Supervisão Humana — Informação Tácita vs. Explícita *(novo — CS3)*
   9.1 Decisões por Informação Explícita
   9.2 Cenários de Informação Tácita
   9.3 Matriz de Supervisão ✍️
   9.4 Protocolo de Handoff Humano
10. Evidências de Funcionamento
11. Considerações Finais ✍️
Referências

---

## 1. Introdução

A **PRISM** é a plataforma de monitoramento preditivo de ativos industriais desenvolvida para a empresa **Forzy**, com foco em motores elétricos. Sensores instalados nos motores capturam continuamente vibração, temperatura e rotação; esses dados alimentam modelos de Machine Learning que estimam a saúde do equipamento, detectam anomalias e projetam a vida útil restante, permitindo que a manutenção seja planejada antes da falha, e não como reação a ela.

Este relatório é a consolidação viva das três etapas do Challenge. Na **Sprint 1**, estabeleceu-se a base de governança da plataforma: quem acessa o quê (RBAC), como o dado bruto percorre a cadeia D-I-C-I até virar recomendação, e o protocolo de auditoria que torna cada decisão rastreável. Na **Sprint 2**, o foco mudou da correção do dado para a compreensão do operador: disclaimers de temporalidade, justificativa visual de status, rastreabilidade geoespacial da associação TAG–Ativo–Localização e a matriz de visibilidade por perfil. Na **Sprint 3**, o objeto de governança passa a ser a própria inteligência que dispara os alertas: normatizam-se os limites de interpretação dos sensores (Metric Contract), define-se a lógica de trava por incerteza (Circuit Breaker) e delimita-se a fronteira entre a autonomia da IA e a soberania do engenheiro (supervisão humana e protocolo de handoff).

O fio condutor das três sprints é único, baseando-se na ideia de uma plataforma que explica suas decisões, rastreia a origem dos dados e conhece os limites da própria autonomia gera confiança e reduz riscos operacionais e legais. A metodologia combina princípios de *Responsible AI*, o NIST AI Risk Management Framework, a norma ISO 10816 para severidade de vibração e boas práticas de engenharia de dados aplicadas ao contexto industrial (IIoT). O resultado esperado é uma plataforma gerenciada, auditável e escalável para múltiplos clientes.

**Nota sobre nomenclatura.** Neste documento, *Forzy* designa a **empresa cliente** cujos ativos industriais são monitorados (em parceria com a Promon); *PRISM* é a **plataforma de software** desenvolvida para esse monitoramento; e *PRISMO* é o **assistente conversacional** embarcado na PRISM.

**Evolução da implementação (CS2 → CS3).** Além da evolução conceitual de governança, o produto amadureceu concretamente nesta etapa. A estruturação de ativos definida na Sprint 1 foi implementada como uma hierarquia navegável de três camadas — **Plantas → Máquinas → Componentes** —, hoje visível na plataforma, da tela de Gestão de Plantas ao detalhe do motor. A tela de maquinário foi remodelada como um **dashboard do ativo**, com telemetria ao vivo, classificação por zona ISO e diagnóstico de ML. O conceito de navegação espacial esboçado na Sprint 2 (a planta baixa 2D) amadureceu para essa **hierarquia de ativos**, mais fiel à forma como uma planta industrial de fato organiza seus equipamentos. E foi implementada a tela do assistente **PRISMO** (RAG), na qual o operador pergunta em linguagem natural sobre a condição do motor e solicita a geração de relatórios auditáveis — uma forma ativa de Explainability (Seção 3.2).

---

# PARTE I — Fundação da Governança (Sprint 1)

## 2. Estruturação de Ativos e Controle de Exibição

### 2.1 Matriz de Hierarquia e Acesso (RBAC)

O *Role-Based Access Control* (RBAC) é o mecanismo central pelo qual a PRISM garante que cada usuário acesse apenas os dados e funcionalidades compatíveis com sua responsabilidade operacional. A hierarquia foi definida considerando quatro dimensões: visibilidade de dados, capacidade de ação, escopo geográfico e nível de auditoria. Foram mapeados cinco perfis de usuário, cada um representando um papel funcional típico de uma planta industrial:

- **Técnico de Operação (Nível 1)** - Operador de campo responsável pelo acompanhamento em tempo real dos equipamentos sob sua responsabilidade direta. Não acessa histórico de outros setores nem configurações do sistema.
- **Técnico de Manutenção (Nível 2)** - Executa intervenções preventivas e corretivas. Necessita de acesso ao histórico de alertas e ao diagnóstico da IA para planejar e registrar manutenções.
- **Gestor de Planta (Nível 3)** - Responsável pela gestão operacional de toda a planta. Visualiza KPIs consolidados, relatórios gerenciais e tem autoridade para aprovar ações críticas.
- **Auditor de Segurança (Nível 4)** - Perfil de auditoria interna/externa. Acesso somente-leitura a logs, trilhas de auditoria e metadados de rastreabilidade, sem permissão de alteração.
- **Administrador da Plataforma (Nível 5)** - Responsável pela configuração global: usuários, integrações, modelos de IA e políticas de acesso por cliente.

**Princípios de implementação:** a hierarquia segue o princípio do *menor privilégio*. Cada usuário acessa apenas o mínimo necessário à sua função, reduzindo a superfície de ataque em caso de comprometimento de credenciais e garantindo conformidade com a LGPD. O acesso multi-tenant é garantido por isolamento de namespace, onde um usuário de uma empresa nunca visualiza dados de outro cliente.

### 2.2 Modelagem da Cadeia D-I-C-I

A cadeia **D-I-C-I** (Dado → Informação → Conhecimento → Inteligência) representa o fluxo pelo qual um sinal elétrico bruto captado por um sensor se transforma em uma recomendação de manutenção compreensível para um operador humano. Esse mapeamento é essencial para garantir a *Explainability* (a capacidade de explicar as decisões da IA de forma transparente, evitando a opacidade da "caixa-preta").

| Camada | O que representa na PRISM |
|---|---|
| **Dado** | Leitura bruta do sensor (vibração em mm/s, temperatura em °C, rotação em rpm), com carimbo de tempo. |
| **Informação** | Leitura contextualizada contra a faixa de operação do motor (dentro/fora do limite, tendência). |
| **Conhecimento** | Diagnóstico dos modelos de ML (anomalia, severidade, vida útil restante, health score). |
| **Inteligência** | Recomendação acionável em linguagem natural, adaptada ao perfil que a recebe. |

---

## 3. Rastreabilidade, Ética e Proteção de Ativos

### 3.1 Protocolo de Rastreabilidade — Log de Auditoria

A rastreabilidade na plataforma consiste em registrar as operações relevantes — cadastro, atualização ou decisão automatizada sobre um ativo — junto com a sua autoria. O objetivo é permitir que qualquer ação possa ser consultada depois, identificando quem fez, o que foi feito e quando.

Para isso, a plataforma mantém uma tabela de logs em que cada ação realizada no sistema é vinculada ao usuário autenticado que a executou, com data e hora. Assim, quando um motor é cadastrado ou tem seus dados alterados, o registro guarda a identificação do responsável pela operação, dando suporte à auditoria e à responsabilização (accountability) das decisões da plataforma.

### 3.2 Explainability — Prevenção da Caixa-Preta

Todo alerta crítico obedece a cinco critérios de explicabilidade:

- **Evidências visíveis:** o alerta exibe as métricas específicas que dispararam a decisão (ex.: vibração X, temperatura Y), não apenas o resultado final.
- **Score de confiança:** a plataforma exibe o percentual de confiança do modelo e o intervalo de incerteza, permitindo avaliar o risco de falso positivo.
- **Alternativa contrafactual:** o sistema informa o que precisa mudar para que o alerta deixe de ser emitido (ex.: "se a temperatura cair abaixo de 65 °C por 6 h, o risco volta ao nível nominal").
- **Rastreio da decisão:** um link "Ver Raciocínio da IA" abre o log detalhado com o padrão de referência, a versão do modelo e os pesos das features.
- **Linguagem adaptada ao perfil:** o Técnico de Operação vê mensagem simples com cor de alerta; o Gestor vê dados agregados; o Auditor acessa o log técnico completo.

### 3.3 Mitigação de Viés, Fairness e Human-in-the-Loop

Um modelo que funciona bem apenas em condições ideais ou com uma marca específica de motor pode acabar agindo de maneira enviesada. Para o **PRISM**, o **viés de representação** é o principal risco ético.

A indústria brasileira opera com um mix heterogêneo de equipamentos. Motores novos de alta eficiência convivem com ativos legados de décadas, de marcas variadas e condições ambientais distintas.

**Princípio de Human-in-the-Loop:** nenhuma decisão de alta criticidade (parada de equipamento, manutenção de emergência) é executada automaticamente pela IA. O modelo gera a recomendação; um humano autorizado (mínimo Nível 3 no RBAC) aprova a ação. Isso garante que vieses residuais sejam interceptados antes de causar impacto operacional — princípio que é a semente do Protocolo de Handoff formalizado na Seção 9.4.

---

# PARTE II — Governança na Visualização e Navegação (Sprint 2)

## 4. Clareza e Explicabilidade na Interface

Explicabilidade, na prática, significa uma coisa simples: o operador precisa entender o que está vendo sem precisar perguntar a ninguém. Se olha para um número na tela, precisa saber de quando ele é, de onde veio e em que contexto é relevante. Para garantir isso, a PRISM trabalha com dois mecanismos complementares: os Disclaimers Visuais e a Justificativa de Status.

### 4.1 Disclaimers Visuais — D+0 vs. Histórico

Todo dado tem uma idade, e na operação industrial a diferença entre um dado de agora e um de ontem pode ser a diferença entre prevenir e remediar. O PRISM adota o conceito de **D+0** para dados em tempo real (latência máxima de 30 s) e **Dado Histórico** para períodos anteriores, exigindo que a distinção seja comunicada visualmente em todos os componentes:

| Categoria | Definição | Indicador Visual | Disclaimer |
|---|---|---|---|
| **D+0 (Tempo Real)** | Capturado nos últimos 30 s. | Badge "LIVE" verde pulsante + timestamp. | "Dado em tempo real, última atualização [HH:MM:SS]. Precisão ±0,5%. Latência < 30 s." |
| **D+0 (Parcial)** | Dia corrente, < 24 h de histórico contínuo. | Badge "HOJE" amarelo. | "Dado parcial do dia, coleta iniciada às [HH:MM]." |
| **Histórico (< 30 dias)** | Série temporal consolidada. | Badge "HIST." cinza. | "Dado histórico, período [DD/MM] a [DD/MM]. Resolução [1/5/60 min]. Validado por [Humano/IA]." |
| **Histórico (> 30 dias)** | Arquivo de longo prazo, resolução reduzida. | Badge "ARQUIVO" roxo. | "Dado arquivado. Resolução reduzida por política de retenção. Precisão ±2%." |
| **Simulado (Digital Twin)** | Gerado por modelo/simulação. | Badge "SIMULADO" azul-índigo. | "Dado simulado pelo Digital Twin, modelo v[X.Y]. Confiança [XX%]. Não é valor medido; valide antes de acionar manutenção." |

### 4.2 Protocolo de Justificativa de Status

Uma mudança de cor num ícone de motor é um sinal. A informação vem depois: o que mudou, por que mudou e o que fazer. Por isso, qualquer alteração no estado visual de um ativo vem acompanhada de um texto explicativo gerado automaticamente, baseado nos **parâmetros contratuais daquele motor específico** (base direta do Metric Contract da Seção 7). São cinco os estados visuais:

| Estado | Cor | Condição de Disparo | Ação Recomendada |
|---|---|---|---|
| **NOMINAL** | Verde sólido | Todos os parâmetros dentro dos limites contratuais. | Nenhuma ação. |
| **ATENÇÃO** | Amarelo pulsante | Parâmetro entre 80% e 100% do limite crítico. | Monitorar; registrar; notificar Técnico N2. |
| **ALERTA CRÍTICO** | Vermelho pulsante | Parâmetro excedeu o limite crítico contratual. | Intervenção imediata; abrir OS; aprovação Gestor N3 para parada. |
| **OFFLINE / SEM SINAL** | Cinza | Sensor sem comunicação há mais de T segundos. | Verificar conectividade IoT; **não decidir com base no último valor**. |
| **EM MANUTENÇÃO** | Azul | OS aberta e vinculada ao ativo. | Telemetria suspensa; alertas automáticos suprimidos; retomada ao fechar OS. |

Os estados OFFLINE e EM MANUTENÇÃO já operam como suspensões de alerta. São a semente do Circuit Breaker formalizado na Seção 8.

---

## 5. Rastreabilidade da Associação TAG–Ativo–Localização

Na Sprint 1, rastreabilidade significava saber quem cadastrou um ativo, quando e com qual dado. Mas existe um erro que o log de cadastro não captura: alguém mover uma TAG para o lugar errado no mapa digital. Essa falha é silenciosa — o sistema continua funcionando, os alertas continuam chegando, mas direcionados ao motor errado. Para fechar essa lacuna, a Sprint 2 adiciona a dimensão geoespacial à rastreabilidade.

> **Nota de evolução (CS3).** Na implementação atual, a navegação até o ativo se dá pela hierarquia **Plantas → Máquinas → Componentes**, e não por um mapa 2D. O Dicionário de Metadados de Auditoria de Localização (DMAL) permanece como o **projeto de governança** da rastreabilidade espacial — o padrão de auditoria a ser seguido caso o posicionamento em planta baixa venha a ser implementado —, de modo que a associação ativo–localização já nasça com um contrato de auditoria definido.

### 5.1 Dicionário de Metadados de Auditoria de Localização (DMAL)

O DMAL define os 26 campos registrados sempre que uma TAG é associada, movida ou desvinculada de um motor. Complementa o log de cadastro da Sprint 1: aquele cobre o ciclo de vida do cadastro; o DMAL cobre o ciclo de vida da localização.

| # | Campo | Tipo | Descrição |
|---|---|---|---|
| 01 | event_id | UUID v4 | Identificador único e imutável do evento. |
| 02 | event_type | ENUM | TAG_ASSOCIATED / TAG_MOVED / TAG_DISSOCIATED / TAG_VALIDATED / TAG_AI_GENERATED. |
| 03 | tag_id | String | Código da TAG (ex.: MTR-L3-042). |
| 04 | asset_id | UUID v4 | ID do ativo associado. |
| 05 | asset_name | String | Nome legível do ativo. |
| 06 | user_id | UUID v4 | Usuário que executou a ação (NULL se IA). |
| 07 | user_role | ENUM | Nível RBAC (LEVEL_2_MANUTENCAO … AI_SYSTEM). |
| 08 | timestamp_utc | ISO 8601 | Momento do evento em UTC (imutável). |
| 09 | timestamp_local | ISO 8601 | Timestamp no fuso da planta. |
| 10 | map_version_id | SemVer | Versão do mapa/planta baixa vigente. |
| 11 | map_file_hash | SHA-256 | Hash do arquivo de planta baixa (integridade). |
| 12 | pos_x_prev | Float | Coordenada X anterior (NULL na 1ª associação). |
| 13 | pos_y_prev | Float | Coordenada Y anterior. |
| 14 | pos_x_new | Float | Nova coordenada X. |
| 15 | pos_y_new | Float | Nova coordenada Y. |
| 16 | pos_reference | String | Sistema de coordenadas (PIXEL_2D / METER_PLANT / GPS_WGS84). |
| 17 | sector_id | String | Setor/zona da planta. |
| 18 | data_lineage | ENUM | Origem: HUMAN_MANUAL / AI_COMPUTER_VISION / AI_NLP / SYSTEM_IMPORT. |
| 19 | validation_status | ENUM | PENDING / VALIDATED / REJECTED / AUTO_APPROVED. |
| 20 | validated_by_user_id | UUID / NULL | Usuário que validou. |
| 21 | validated_at_utc | ISO 8601 / NULL | Timestamp da validação. |
| 22 | justification_text | String (≤500) | Justificativa ao mover/rejeitar uma TAG. |
| 23 | ip_address | IPv4/IPv6 | IP do dispositivo (auditoria de segurança). |
| 24 | session_id | UUID v4 | Sessão de login ativa. |
| 25 | previous_event_id | UUID / NULL | Referência ao evento anterior (cadeia de custódia). |
| 26 | hash_chain | SHA-256 | Hash encadeado SHA-256(event_id + previous_hash). |

**Segurança:** o log DMAL é *append-only*, separado do banco operacional, com criptografia AES-256 em repouso e integridade via hash encadeado (campo 26). Nenhum usuário, incluindo o Administrador (Nível 5), pode modificar ou deletar entradas; a exclusão física só é permitida por ordem judicial documentada, conforme Art. 18 da LGPD.

### 5.2 Linhagem do Dado — Validado vs. IA-Generated

O campo 18 (data_lineage) registra a origem do dado, que a interface traduz em badges visuais:

| Origem | Badge | Implicação para o Operador |
|---|---|---|
| HUMAN_MANUAL | Validado por Humano (verde sólido) | Dado confiável para decisões operacionais. Rastreável ao responsável. |
| AI_COMPUTER_VISION | IA-Gerado / Visão (amarelo pulsante) | Requer validação Nível 2+. Se não validado em 24 h, alerta ao Gestor. |
| AI_NLP | IA-Gerado / NLP (roxo) | Extraído de documentação por NLP. Menor confiabilidade em parâmetros numéricos. |
| SYSTEM_IMPORT | Importado (azul) | Origem em ERP/CMMS externo. Validar consistência com documentação física. |
| PENDING | Origem Desconhecida (vermelho) | Estado de erro: dado sem linhagem. Não deve ocorrer em produção. |

---

## 6. Controle de Exibição e Segurança — RBAC Evoluído

A Matriz RBAC da Sprint 1 respondeu "quem pode entrar onde?". A Sprint 2 aprofunda: dentro da planta baixa digital — o componente mais sensível, pois mostra a topologia física real da fábrica — o que cada perfil vê, clica, edita ou simplesmente não enxerga? A lógica é a **Minimização de Dados**: excesso de informação na tela de um operador cria ruído, não clareza; e para um auditor, acesso a telemetria bruta só aumenta a superfície de exposição.

### 6.1 Matriz de Visibilidade Operacional na Planta Digital

| Elemento | N1 Operação | N2 Manutenção | N3 Gestor | N4 Auditor | N5 Admin |
|---|---|---|---|---|---|
| Mapa da planta (topologia) | Setores atribuídos | Toda a planta | Toda a planta | Toda a planta (leitura) | Total |
| Ícones de status dos motores | Motores do setor | Todos | Todos | Todos (sem ação) | Total |
| TAG de identificação | Visível (setor) | Visível | Visível | Visível | Visível + editável |
| Telemetria em tempo real | Valores do setor | Todos os motores | KPIs agregados | Sem acesso a raw | Total |
| Telemetria histórica | Sem acesso | 90 dias (atribuídos) | Completo (KPIs) | Metadados (sem raw) | Total |
| Diagnósticos e recomendações da IA | Resumo simplificado | Completo + score | Agregado por setor | Sem acesso | Total |
| Badge de linhagem do dado | Simplificado | Detalhado | Resumido | Detalhado + log | Total + editável |
| Logs de auditoria (DMAL) | Sem acesso | Sem acesso | Só as próprias ações | Completo (leitura) | Completo + exportação |
| Ferramentas de edição de TAG | Sem acesso | Associar/mover (c/ justificativa) | Aprovar/rejeitar N2 | Sem acesso | Total |
| Histórico de versões do mapa | Sem acesso | Versão atual (leitura) | Atual + anterior | Histórico completo | Total + gerenciar |
| Alertas ativos | Do setor | Todos (detalhes) | Todos (consolidado) | Histórico (leitura) | Total |

### 6.2 Princípio de Minimização de Dados

Três mecanismos concretizam o princípio na planta digital:

- **Mascaramento progressivo:** telemetria exibida em camadas. Nível 1 vê "NORMAL / ALERTA / CRÍTICO"; Nível 2 vê o valor exato; Nível 3 vê a média por setor.
- **Ocultação por namespace:** ativos de outros clientes (multi-tenant) são completamente invisíveis e não existem no DOM da interface. O isolamento é garantido no backend por middleware de namespace.
- **Expiração de sessão com contexto:** sessões inativas por mais de 15 min ocultam a telemetria e exibem tela de bloqueio, evitando que o operador acumule contexto *stale* de dados antigos não validados.

---

# PARTE III — Inteligência Operacional e Governança da Decisão (Sprint 3)

## 7. Metric Contract — Contrato de Métricas dos Sensores

### 7.1 Descrição do Caso

Nas sprints anteriores, o PRISM definiu *quem* vê o dado e *como* ele é comunicado. Falta normatizar o núcleo da decisão: **o que a inteligência considera comportamento normal, o que considera anomalia, e sob qual grau de incerteza ela deve calar-se.** Sem esse contrato, cada motor teria limites implícitos e não auditáveis, escondidos dentro dos modelos de ML; um mesmo padrão de vibração poderia gerar alerta em um motor e silêncio em outro sem justificativa formal.

Este Metric Contract estabelece o racional único dos indicadores de condição mecânica do motor (**vibração, temperatura e aceleração**) e da saúde consolidada do ativo, tornando a detecção de anomalia e as ações automáticas consistentes, auditáveis e defensáveis. Ele formaliza, em contrato, os "limites contratuais por ativo" que a Sprint 2 já exibia na interface (Seção 4.2 e Figura de Configuração de Limites).

### 7.2 Informações Gerais

| Campo | Valor |
|---|---|
| Nome do Projeto | PRISM — Plataforma de Monitoramento Preditivo de Motores |
| Cliente | Forzy (parceria com a Promon) |
| Responsável Técnico | Grupo 2TIAPY — FIAP |
| Ativo de referência | Motor WEG W22 Monofásico, carcaça 100L, cód. 13887610 |
| Especificação | 2,2 kW (3 cv); 2 polos; 3525 rpm; 60 Hz; classe de isolamento F; rolamentos 6206 ZZ; IP55; regime S1 |
| Norma do ativo | ABNT NBR 17094 |
| Data de Criação | 30/08/2026 |
| Versão | 3.0.0 |
| Revisão | — |

### 7.3 Objetivo de Negócio

Estabelecer o racional único dos limiares de condição do motor, de modo que a detecção de anomalias e as ações automáticas do sistema sejam **auditáveis, consistentes entre ativos e tecnicamente defensáveis**, reduzindo paradas não planejadas (falha não antecipada) sem introduzir paradas desnecessárias (falso positivo que interrompe a planta sem causa real).

### 7.4 Métricas

Cada métrica é medida pelo mesmo sensor físico instalado no motor: um **acelerômetro** que capta a aceleração da carcaça e, por integração, fornece a velocidade de vibração (mm/s) usada como indicador primário conforme a norma ISO 10816. A temperatura é medida por sensor térmico solidário ao mancal/carcaça. Como o ativo de referência é um motor de **2,2 kW**, ele se enquadra na **Classe I (máquinas pequenas, até 15 kW)** da norma ISO 10816-1, o que define limiares de vibração substancialmente menores do que os de máquinas de grande porte.

#### 7.4.1 Vibração (Velocidade RMS)

Indicador primário de desgaste mecânico (desalinhamento, desbalanceamento, folgas, falha de rolamento em baixa/média frequência). Medida em **mm/s (RMS)**, classificada pelas zonas de severidade da norma ISO 10816-1 para máquinas Classe I. As zonas A e B correspondem a operação normal; a Zona C a operação insatisfatória (atenção); a Zona D a nível inaceitável, com risco de dano (crítico).

| Estado | Zona ISO 10816-1 (Classe I) | Faixa (mm/s RMS) |
|---|---|---|
| Motor desligado (piso de operação) | — | < 0,3 mm/s |
| NOMINAL (operação normal) | Zonas A / B | 0,3 – 1,8 mm/s |
| ATENÇÃO (operação insatisfatória) | Zona C | 1,8 – 4,5 mm/s |
| CRÍTICO (nível inaceitável / risco de dano) | Zona D | > 4,5 mm/s |

- **Atualização:** leitura pelo sensor a cada 10 s; avaliação de diagnóstico em janela móvel de 5 min.
- **Fonte de Dados:** acelerômetro do sensor Forzy, integrado para velocidade RMS; tabela `leitura_sensor`, campo `vibracao`.
- **Observação:** estes limiares **refinam** o exemplo ilustrativo de 12 mm/s exibido no mockup da Sprint 2 (que pressupunha um motor de grande porte). A adequação à Classe I do motor real é uma correção de rigor técnico exigida pela norma.
- **Alinhamento com a implementação:** a própria plataforma já classifica a vibração por zona ISO — a tela de detalhe do motor exibe o selo "ISO Zona A · Normal", e a leitura real em operação normal (≈ 0,57 mm/s) cai justamente na Zona A. Este contrato, portanto, formaliza o critério que o sistema já aplica, e não um parâmetro apenas teórico.

#### 7.4.2 Temperatura

Indicador de sobrecarga térmica ou falha de refrigeração, medido em **°C**. Os sensores são fornecidos e instalados pela **Forzy**; a plataforma apenas **consome as leituras**. Portanto, este contrato define a *interpretação* do dado recebido, não a especificação do sensor. Nas leituras reais em operação normal, a temperatura observada situa-se em torno de **28–34 °C** (temperatura de superfície/carcaça), bem abaixo do teto de projeto: a classe de isolamento **F** do motor admite até **155 °C** no enrolamento (elevação nominal de 105 K sobre ambiente de até 40 °C). Os limiares abaixo são definidos com folga sobre a operação normal observada e conservadoramente distantes do teto do enrolamento.

| Estado | Faixa (°C, superfície/carcaça) |
|---|---|
| NOMINAL (operação normal) | < 70 °C |
| ATENÇÃO | 70 – 90 °C |
| CRÍTICO | > 90 °C |
| Teto absoluto do enrolamento (Classe F) | 155 °C (referência de projeto) |

- **Fonte de Dados:** leitura de temperatura enviada pelo sensor Forzy; tabela `leitura_sensor`, campo `temperatura`. Atualização a cada 10 s; janela de diagnóstico de 5 min.

#### 7.4.3 Aceleração (Alta Frequência) — *Cláusula Prospectiva*

Indicador precoce de falha de rolamento e defeitos de alta frequência que a velocidade RMS (ISO 10816) tende a mascarar. Medida em **g (gravidade)** na banda de alta frequência (aprox. 1–10 kHz) do mesmo acelerômetro que origina o sinal de vibração. O alvo direto é o par de **rolamentos 6206 ZZ** do motor: a análise de envelope busca as frequências de defeito características do 6206 — pista externa (BPFO), pista interna (BPFI), esferas (BSF) e gaiola (FTF) —, moduladas sobre a rotação de eixo de 3525 rpm (≈ 58,75 Hz). Como o canal de alta frequência ainda não é persistido pela aplicação, esta é uma **cláusula prospectiva**: o limiar já é normatizado, de modo que, quando o canal for exposto, o contrato de interpretação já esteja vigente.

| Estado | Aceleração RMS (banda alta freq.) |
|---|---|
| NOMINAL (rolamento saudável) | < 2 g |
| ATENÇÃO (suspeita de rolamento) | 2 – 4 g |
| CRÍTICO (falha de rolamento provável) | > 4 g |

- **Atualização:** medição em alta frequência; consolidação por envelope/demodulação nas frequências de defeito do 6206 (análise futura).
- **Fonte de Dados:** canal de aceleração bruta do acelerômetro (a expor).

### 7.5 Métricas de Qualidade

Antes de qualquer limiar de condição ser aplicado, o dado precisa ser confiável. Estas métricas de qualidade governam a entrada do pipeline e são a base do Circuit Breaker (Seção 8):

| Métrica de Qualidade | Indicador |
|---|---|
| Cobertura de leituras na janela | ≥ 5 leituras válidas na janela de 5 min (mínimo para diagnóstico) |
| Frescor do dado (latência) | ≤ 30 s desde a última leitura (define Online/Offline) |
| Faixa física válida — Vibração | 0 a 50 mm/s (fora ⇒ leitura inválida) |
| Faixa física válida — Temperatura | −10 a 150 °C (fora ⇒ leitura inválida) |
| Faixa física válida — Aceleração | 0 a 20 g (fora ⇒ leitura inválida) |
| Confiança mínima do modelo | Score de confiança do diagnóstico ≥ 60% para ação automática |

### 7.6 Thresholds e Alertas

Tabela central do contrato: cada gatilho e a ação automática correspondente do sistema. As ações espelham os estados visuais da Seção 4.2 e as aprovações RBAC da Seção 6.

| Threshold / Alerta | Gatilho | Incidente / Ação Automática |
|---|---|---|
| Motor desligado | Vibração média < 0,3 mm/s | Suspende diagnóstico ("Análise de anomalia não aplicável"). |
| Vibração — Atenção | ≥ 1,8 mm/s (Zona C, ISO 10816-1) | Estado ATENÇÃO (amarelo). Monitorar; notificar Técnico N2. |
| Vibração — Crítico | ≥ 4,5 mm/s (Zona D, ISO 10816-1) | ALERTA CRÍTICO. Abrir OS; aprovação Gestor N3 para parada. |
| Temperatura — Atenção | ≥ 70 °C (mancal/carcaça) | ATENÇÃO. Verificar refrigeração; monitorar tendência. |
| Temperatura — Crítico | ≥ 90 °C (mancal/carcaça) | ALERTA CRÍTICO. Inspeção térmica; aprovação N3 para parada. |
| Aceleração — Atenção | ≥ 2 g (banda alta freq., rolamento 6206) | ATENÇÃO. Suspeita de rolamento; agendar análise de envelope. |
| Aceleração — Crítico | ≥ 4 g | ALERTA CRÍTICO. Falha de rolamento provável. |
| Anomalia (ML) | Isolation Forest **OU** LSTM sinaliza desvio | Marca diagnóstico como anomalia (prioriza sensibilidade). |
| Saúde crítica | Health score < 40% **OU** RUL < 100 h | Status CRÍTICO consolidado. |
| Dado offline | Sem leitura há > 30 s | OFFLINE. **Circuit breaker:** não decidir pelo último valor. |
| Lacuna de dados | < 5 leituras válidas na janela | **Circuit breaker:** pula ciclo; não gera diagnóstico. |
| Baixa confiança | Score do modelo < 60% ou IF×LSTM divergentes na fronteira | **Circuit breaker:** rebaixa a revisão humana (handoff). |

O health score é calculado como `40% × (normalidade Isolation Forest) + 60% × (normalidade da severidade LSTM)`; a classificação de risco deriva do RUL estimado (>5000 h baixo; 1000–5000 h médio; 100–1000 h alto; <100 h crítico).

### 7.7 Plano de Monitoramento

Caso seja identificada **lacuna de dados** (menos de 5 leituras válidas na janela) ou **latência superior a 30 s**, o diagnóstico **não** é persistido e o alerta é **travado** — o motor é exibido como OFFLINE e o sistema aciona verificação de conectividade IoT, e não intervenção mecânica. Caso uma leitura esteja **fora da faixa física válida**, ela é descartada como falha de sensor; se o padrão persistir, o alerta é travado e uma inspeção do sensor é acionada. Caso o **score de confiança do modelo** seja inferior a 60%, ou os modelos Isolation Forest e LSTM divirjam próximos da fronteira de decisão, o alerta é rebaixado de "ação automática" para "revisão humana" (handoff, Seção 9.4). O monitoramento é retomado automaticamente assim que as métricas de qualidade retornam à faixa normal.

---

## 8. Circuit Breaker — Governança da Incerteza

O Circuit Breaker é a materialização do Plano de Monitoramento (Seção 7.7) como mecanismo de governança. Seu propósito não é detectar falha no motor, mas detectar **falha na própria confiança do sistema**, e, diante dela, falhar de forma segura.

### 8.1 Gatilhos de Trava

A trava é acionada por três classes de incerteza:

1. **Incerteza de disponibilidade** — dado ausente ou velho: menos de 5 leituras válidas na janela, ou latência acima de 30 s. O sistema não sabe o estado atual do motor.
2. **Incerteza de integridade** — leitura fisicamente impossível (fora da faixa de sanidade): sinal de sensor defeituoso, não de motor defeituoso.
3. **Incerteza de modelo** — confiança do diagnóstico abaixo de 60%, ou discordância entre Isolation Forest e LSTM próxima da fronteira de decisão. O sistema tem dado, mas não tem convicção.

### 8.2 Comportamento Fail-Safe

O princípio de projeto é assimétrico e deliberado: **na dúvida, o sistema não escala uma ação que pare a planta.** Um falso alerta que interrompe uma linha de produção tem custo direto e imediato; por isso, sob incerteza, o Circuit Breaker rebaixa o alerta em vez de propagá-lo como ordem. Ele nunca *apaga* a condição, o evento é registrado no log de auditoria (Seção 3.1) e o ativo é sinalizado para revisão, mas impede que um dado não confiável dispare, sozinho, uma parada. Isso distingue a PRISM de um sistema de alarme ingênuo, que trata todo desvio como emergência e treina o operador a ignorar alertas (fadiga de alarme).

É importante notar a fronteira: o Circuit Breaker governa a **incerteza sobre o dado e o modelo**, não a gravidade da condição. Um alerta crítico com dado confiável é escalado ao humano conforme o handoff. O que se trava é o alerta *duvidoso*, não o alerta *grave*.

### 8.3 Integração com o Handoff Humano

Toda vez que o Circuit Breaker dispara, a decisão **muda de destinatário**. Em vez de acionar uma ação automática, o sistema transfere o caso para um humano, anexando o motivo da trava (qual classe de incerteza) e o último estado confiável conhecido. O Circuit Breaker é, portanto, a ponte técnica que conecta o Metric Contract (Seção 7) ao Protocolo de Handoff (Seção 9.4): ele é o gatilho automático que reconhece o limite da autonomia da máquina e devolve a decisão ao especialista.

---

## 9. Supervisão Humana — Informação Tácita vs. Explícita

A governança da decisão exige delimitar, com precisão, onde termina a autonomia da IA e onde começa a soberania do engenheiro. Essa fronteira segue a distinção entre **informação explícita** codificável em fórmulas, tabelas e limiares (o Metric Contract) e **informação tácita** a percepção contextual do especialista, que não cabe em uma regra.

### 9.1 Decisões por Informação Explícita (Autonomia da IA)

Informação explícita é tudo que está formalizado neste documento: os limiares do Metric Contract, as fórmulas de health score e RUL, as faixas de risco, os critérios de anomalia. Sobre esse domínio, a IA decide sozinha, porque a decisão é determinística, auditável e reproduzível. Pertencem a este domínio:

- Classificar o estado do motor (NOMINAL / ATENÇÃO / CRÍTICO) a partir dos thresholds contratuais.
- Detectar anomalia (Isolation Forest OU LSTM) e calcular health score e RUL.
- Determinar se o motor está operando ou desligado (piso de 0,3 mm/s).
- Distinguir Online/Offline pela latência do dado.
- Gerar a recomendação textual e disparar a notificação ao nível RBAC correspondente.
- Acionar o Circuit Breaker quando as métricas de qualidade saem da faixa.

### 9.2 Cenários de Informação Tácita (Soberania do Engenheiro)

Informação tácita é o conhecimento que o engenheiro possui em relação aos ativos e planta em si, coisa que a IA não consegue enxergar num contexto mais amplo e dinâmico (contexto físico, a história do ativo, o ruído externo). Nestes cenários, a percepção do especialista deve **sobrepor-se** à recomendação da IA. Exemplos aplicáveis à PRISM:

- **Contexto operacional programado:** um teste de carga ou partida em rampa produz vibração elevada que o modelo lê como anomalia, mas que o engenheiro sabe ser esperada.
- **Assinatura conhecida do ativo:** um motor legado específico sempre vibra acima do baseline por característica construtiva, sem que isso indique falha iminente.
- **Ruído de contexto físico:** vibração transmitida por um equipamento vizinho, obra na planta, ou fixação temporária, fontes que o sensor capta mas não atribui corretamente.
- **Suspeita sobre o próprio sensor:** o engenheiro reconhece, pela textura do dado, uma falha de instrumentação que o Circuit Breaker ainda não travou.
- **Julgamento de oportunidade:** decidir *parar ou não* a planta é uma ponderação de risco, custo e contexto de produção que a IA recomenda, mas não autoriza.

### 9.3 Matriz de Supervisão

A matriz abaixo cruza cada tipo de decisão da PRISM com a natureza da informação envolvida, o grau de autonomia concedido à IA, o ponto de intervenção humana e o nível RBAC responsável. Ela materializa a fronteira entre o que é delegável e o que exige julgamento humano.

| Decisão / Situação | Informação | Autonomia da IA | Intervenção Humana | RBAC |
|---|---|---|---|---|
| Detectar se o motor está ligado ou desligado (piso 0,3 mm/s) | Explícita | Total (automática) | Nenhuma | — |
| Classificar estado NOMINAL (tudo dentro do limite) | Explícita | Total | Nenhuma | — |
| Calcular health score, RUL e detectar anomalia (IF ou LSTM) | Explícita | Total | Nenhuma | — |
| Emitir ATENÇÃO (vibração 1,8–4,5 mm/s) | Explícita | Automática (notifica) | Ciência e monitoramento | Técnico N2 |
| Emitir ALERTA CRÍTICO (vibração > 4,5 mm/s) | Explícita (dispara) | Recomenda — **não executa a parada** | **Aprovação obrigatória** para parar | Gestor N3 |
| Distinguir anomalia real de contexto esperado (teste de carga, partida em rampa) | **Tácita** | Só sinaliza | Override humano com justificativa | Técnico N2 |
| Suspeitar de falha do próprio sensor (dado "estranho" mas dentro da faixa) | **Tácita** | Não detecta sozinha | Julgamento do técnico | Técnico N2 |
| Motor legado que sempre vibra acima do baseline por característica construtiva | **Tácita** | Alerta recorrente | Ajuste de limiar documentado | Gestor N3 / Admin N5 |
| Circuit Breaker: dado offline ou lacuna de leituras | Explícita | **Trava o alerta sozinha** | Revisão antes de qualquer ação | Técnico N2 |
| Alterar os limiares do Metric Contract de um ativo | — | **Nenhuma** | Decisão humana obrigatória | Gestor N3 / Admin N5 |
| Decisão final de **parar a planta** | **Tácita** | Recomenda | Autorização humana (risco × custo × produção) | Gestor N3 |

**Leitura do grupo.** Ao construir esta matriz, definimos duas fronteiras que, como grupo, não delegamos à IA em hipótese alguma: **parar a planta** e **alterar os próprios limiares**. As duas carregam um custo que exige responsabilidade humana rastreável. Uma parada indevida custa produção; um contrato de métrica corrompido contamina todas as decisões seguintes. Nos cenários de informação tácita, os que consideramos mais críticos no contexto da Forzy são o **teste de carga programado**, em que a vibração sobe por um motivo legítimo que a IA leria como anomalia. E o **sensor mentindo**, em que o dado passa nas faixas de validade mas o técnico percebe, pela textura da leitura, que o instrumento falhou. Nenhum limiar resolve esses dois casos; só o contexto humano resolve. Por fim, diante do trade-off entre um alarme a mais e uma falha não detectada, nossa escolha é priorizar a **sensibilidade**: no nosso contexto, deixar um motor ruim rodando é pior do que revisar um alerta que se revelou falso. Por isso o **PRISM** é **sensível na detecção, mas conservadora na ação** — ela alerta com facilidade e encaminha ao humano, mas nunca executa sozinha uma parada baseada em dado incerto.

### 9.4 Protocolo de Handoff Humano

O Handoff é o critério de transbordo da decisão da máquina para o especialista. Ele evolui o princípio de *Human-in-the-Loop* da Sprint 1 (Seção 3.3), tornando explícito o gatilho de cada transferência:

| Gatilho | Destinatário do Handoff | Natureza |
|---|---|---|
| Estado NOMINAL / ATENÇÃO com dado confiável | — (IA autônoma) | Decisão automática |
| Anomalia detectada / ATENÇÃO sustentada | Técnico de Manutenção (N2) | Notificação + registro |
| Estado CRÍTICO / decisão de **parada** | Gestor de Planta (N3) | **Aprovação obrigatória** — nunca automática |
| Circuit Breaker acionado (incerteza) | Humano responsável pelo ativo | Revisão do dado antes de qualquer ação |
| Override tácito do engenheiro | Registrado no log (campo justification_text, DMAL) | Decisão humana rastreável |

O handoff nunca é uma perda de rastreabilidade: toda transferência e todo override humano são registrados no log de auditoria, com autor, timestamp e justificativa — fechando o ciclo de *accountability* iniciado na Sprint 1.

---

## 10. Evidências de Funcionamento

As capturas a seguir documentam a plataforma **PRISM** em operação (monitorando os ativos da Forzy), evidenciando a hierarquia de ativos, a telemetria ao vivo e a classificação por limites (zonas ISO) definidos no Metric Contract. Cada figura traz legenda acima e fonte abaixo, conforme o padrão FIAP. Vale notar que a Figura 1 já evidencia o critério de saúde em ação: o sistema classifica uma planta com ativo degradado em **40% de saúde** (destaque em vermelho) e outra, saudável, em **100%** — a aplicação prática dos limiares deste contrato sobre motores em condições distintas.

**Figura 1 — Gestão de Plantas (camada de Plantas da hierarquia)**
`[IMG: tela "Gestão de Plantas" com as duas plantas, KPIs de máquinas/alertas/saúde e selo ISO Zona]`
*Fonte: Elaborado pelos autores a partir da plataforma PRISM (2026).*

**Figura 2 — Dashboard de Maquinário com telemetria ao vivo**
`[IMG: lista de motores da planta Forzy-Promon com temperatura, vibração e status Online]`
*Fonte: Elaborado pelos autores a partir da plataforma PRISM (2026).*

**Figura 3 — Detalhe do Motor com Diagnóstico ML e classificação ISO**
`[IMG: detalhe do motor com health score, "ISO Zona A · Normal", tendência de saúde e medições de vibração/RPM/temperatura]`
*Fonte: Elaborado pelos autores a partir da plataforma PRISM (2026).*

**Figura 4 — Assistente PRISMO: Explainability ativa**
`[IMG: painel do assistente PRISMO aberto sobre o detalhe do motor]`
*Fonte: Elaborado pelos autores a partir da plataforma PRISM (2026).*

**Figura 5 — Assistente PRISMO: diagnóstico e geração de relatórios**
`[IMG: tela do PRISMO com capacidades — dados ao vivo, diagnóstico ML (IF/LSTM/RUL) e relatórios PDF/Excel/Word]`
*Fonte: Elaborado pelos autores a partir da plataforma PRISM (2026).*

---

## 11. Considerações Finais

Ao longo destas três sprints, a nossa percepção sobre governança de IA mudou de forma concreta. No começo, tratávamos governança como um conjunto de requisitos a cumprir, como controle de acesso, log de auditoria, disclaimers na interface, etc... Ao chegar à Sprint 3, entendemos que ela é, na verdade, a estrutura que define o que o sistema *é*: um sistema governado não é um sistema de monitoramento com auditoria por cima, é um sistema em que a explicação, a rastreabilidade e o limite de autonomia fazem parte da própria decisão.

Essa mudança ficou mais nítida quando precisamos decidir até onde a IA pode ir sozinha. Como grupo, definimos duas fronteiras das quais não abrimos mão: a IA nunca para a planta sozinha, e nunca altera os próprios limiares sem um humano no meio. Trata-se do reconhecimento de que essas duas decisões carregam um custo (produção perdida, ou um contrato de métrica corrompido) que exige responsabilidade humana rastreável. Foi para isso que o Metric Contract e o protocolo de handoff existem: para que o sistema decida a maior parte do tempo, mas devolva a decisão ao engenheiro exatamente onde errar custa caro.

Também aprendemos que a experiência do técnico é vital para cobrir aquilo que o modelo não vê. Os dois cenários que mais nos marcaram foram o teste de carga programado, em que a vibração sobe por um motivo legítimo que a IA leria como falha, e o sensor mentindo, em que o dado passa nas faixas de validade mas o técnico percebe pela textura que o instrumento falhou. Nenhuma fórmula resolve esses casos; só o contexto humano resolve. E, na dúvida entre um alarme a mais e uma falha não detectada, preferimos o alarme, porque no nosso contexto, deixar um motor ruim rodando é pior do que revisar um alerta que acabou sendo falso. Por isso o sistema é sensível na detecção, mas conservador na ação: ele alerta com facilidade, mas não executa uma parada sobre um dado incerto.

Por fim, sendo honestos sobre a maturidade da solução: ela funciona bem no protótipo, mas ainda não foi validada em um motor real em produção. Os limiares que definimos pela norma ISO 10816 precisam ser confirmados em campo, observando o comportamento de um motor de verdade ao longo do tempo. Isso se deve ao fato de que os endpoints disponibilizados pela Forzy com as medições dos motores não funcionaram todos os dias estipulados pela empresa, e nos poucos dias que funcionaram, enviaram uma quantidade ínfima de dados (10 minutos no total), inviabilizando quaisquer testes que pensássemos em fazer.

Mas essas intercorrências de forma alguma impediram a implementação do sistema descrito aqui, já que a ideia do projeto, na nossa concepção, já está bem madura. E pelo feedback fornecido pela forzy na última review, parece que estamos indo na direção certa. Já estamos alinhando com eles alguns detalhes que vão favorecer ainda mais as automações e decisões que serão tomadas pela IA juntamente dos operadores de campo, o que vai tornar o sistema muito mais funcional, pois a ideia é de que ele vá além de um mero protótipo e que a forzy enxergue nosso produto como algo que seja realmente útil para ser colocado em produção.

Dito isso, para as próximas entregas, vamos investir pesado na representação visual dos ativos, bem como na indetificação de falhas de maneira visual também, com representação em modelos 3D relacionados com entidades reais de sistema e medições telemétricas de motores reais.

---

## Referências

1. NIST AI Risk Management Framework (AI RMF 1.0). National Institute of Standards and Technology, 2023.
2. ISO 10816-1. *Mechanical vibration — Evaluation of machine vibration by measurements on non-rotating parts — Part 1: General guidelines.* International Organization for Standardization.
3. ABNT NBR 17094. *Máquinas elétricas girantes — Motores de indução.* Associação Brasileira de Normas Técnicas.
4. WEG S/A. *Folha de Dados — Motor W22 Monofásico, código 13887610.* 2026.
5. ISO/IEC 38500:2024. *Information Technology — Governance of IT for the Organization.*
6. BRASIL. Lei nº 13.709, de 14 de agosto de 2018 — Lei Geral de Proteção de Dados (LGPD).
7. IEC 62443. *Security for Industrial Automation and Control Systems.* International Electrotechnical Commission, 2018–2022.
8. EUROPEAN COMMISSION. *Ethics Guidelines for Trustworthy AI.* High-Level Expert Group on Artificial Intelligence, 2019.
9. DAMA INTERNATIONAL. *DAMA-DMBOK: Data Management Body of Knowledge.* 2. ed. Technics Publications, 2017.
