# PRISM — Backlog de Implementação para a Defesa da CS3

**Contexto para o Claude Code:** projeto de monitoramento preditivo de motores. Backend `forzy-api-main` (FastAPI + SQLAlchemy + Postgres), frontend `forzy-web` (React + TS + Vite). Sensores lidos da Forzy (empresa) via poller a cada 10s → tabela `leitura_sensor`; pipeline de ML a cada 5 min → tabela `diagnostico`. Hierarquia `planta → maquina → componente`. Auth JWT com papéis `admin/technician/client`.

**Objetivo deste backlog:** tornar *demonstrável no app* o que o documento de governança da Sprint 3 descreve — para gravar um vídeo defendendo o sistema. O barema do vídeo cobra três coisas: (1) **limites/thresholds disparando**, (2) **supervisão humana / handoff**, (3) **demonstração prática funcionando**. As tarefas abaixo estão priorizadas por isso.

> Observação: as referências de arquivo são baseadas na documentação técnica e podem estar levemente desatualizadas — confirme no código real antes de editar.

---

## ✅ O que JÁ existe (NÃO reimplementar)

- Hierarquia Plantas → Máquinas → Componentes (telas de Gestão de Plantas, Maquinário, Detalhe do Motor).
- Leitura de sensores (vibração, temperatura, RPM) e gráficos ao vivo.
- Pipeline de ML (Isolation Forest, LSTM, XGBoost RUL) → `diagnostico` com health score, risco, anomalia.
- Classificação **ISO Zona** já exibida no detalhe do motor.
- Assistente RAG (PRISMO) com geração de relatórios.
- Estados de motor desligado (< 0,3 mm/s) e online/offline (30s).

## 🚫 NÃO implementar (é design de governança no doc, não precisa pro vídeo)

- Log com hash SHA-256 / criptografia / append-only (foi removido do doc).
- DMAL / planta baixa 2D / rastreabilidade de TAG.
- RBAC de 5 níveis (mantém os 3 papéis atuais).
- Canal de aceleração de alta frequência (o doc marca como cláusula prospectiva).

---

## 🎯 P0 — Essenciais para o vídeo

### P0.1 — Metric Contract: thresholds configuráveis por motor
**Por quê:** é o coração da CS3 (Rigor nos Limites, 25%). Hoje o motor só mostra "Zona A / Normal"; precisamos que ATENÇÃO e CRÍTICO existam e possam ser disparados na demo.

**Implementar:**
- Tabela/config de limites por componente: `vib_atencao`, `vib_critico`, `temp_atencao`, `temp_critico` (defaults do doc: vibração 1,8 / 4,5 mm/s — ISO 10816-1 Classe I; temperatura 70 / 90 °C).
- Endpoint CRUD para ler/gravar esses limites (ex.: `GET/PUT /componentes/{id}/limites`).
- Tela **"Configuração de Limites"** no detalhe do motor (botão Editar já existe) para ajustar os valores.

**Critério de aceite:** consigo abrir um motor, definir o limite crítico de vibração (ex.: 0,5 mm/s) e salvar.
**Demo no vídeo:** baixo o limite crítico abaixo da leitura atual (0,57 mm/s) → o motor deve virar CRÍTICO na tela.

### P0.2 — Classificação de estado por threshold + alerta real
**Por quê:** o vídeo precisa mostrar o limite *disparando* (Evidências, 15%).

**Implementar:**
- Na avaliação do diagnóstico (provável `src/services/diagnostico_scheduler.py` + `ml_module/inference/predict.py`), comparar a última leitura com os limites da P0.1 e derivar o estado: **NOMINAL / ATENÇÃO / CRÍTICO**.
- Quando cruzar para ATENÇÃO ou CRÍTICO, gravar um registro em `alerts` (tabela já existe) com: motor, parâmetro, valor medido, limite, estado, timestamp.
- Refletir o estado (cor + texto) no card do maquinário e no detalhe do motor; refletir a contagem em "ALERTAS" na Gestão de Plantas.

**Critério de aceite:** ao cruzar o limite, aparece um alerta na tela de Alertas e o contador de alertas da planta sai de 0.
**Demo no vídeo:** mostrar o motor passando de NOMINAL → CRÍTICO e o alerta surgindo.

### P0.3 — Circuit Breaker (trava por incerteza)
**Por quê:** governança da decisão (Rigor + Supervisão). Mostra que o sistema *não* dispara alarme com dado ruim.

**Implementar (evoluir o que já existe):**
- Sanity check de faixa física na ingestão/diagnóstico: vibração 0–50 mm/s, temperatura −10–150 °C. Leitura fora da faixa = inválida (descartada), não gera alerta.
- Se dado **offline** (>30s sem leitura) OU **< 5 leituras** na janela → NÃO classificar estado nem gerar alerta; marcar o diagnóstico como **"retido — dado insuficiente/offline"**.
- Exibir esse estado retido na UI (badge tipo "Alerta retido — aguardando dado confiável").

**Critério de aceite:** com o motor offline, o sistema mostra "retido" em vez de alarme, e não cria alerta.
**Demo no vídeo:** mostrar um motor offline → sistema segura o alerta em vez de disparar (evita parada desnecessária).

### P0.4 — Handoff humano (aprovação de ação crítica) + registro de autoria
**Por quê:** Supervisão e Handoff (25% no doc, 15% no vídeo). E resolve o registro de autoria real da §3.1.

**Implementar:**
- No alerta CRÍTICO, além da "ação recomendada", um botão **"Registrar decisão / Aprovar ação"** disponível para papel `technician`/`admin`.
- Ao clicar, gravar: usuário autenticado, timestamp, decisão tomada e (opcional) justificativa em texto. Isso É o "log de autoria" da §3.1 — uma tabela simples `audit_log` (usuário, ação, alvo, data/hora, justificativa). Sem hash, sem criptografia.
- A ação da IA nunca executa "parada" sozinha — só recomenda; a decisão fica registrada com o humano responsável.

**Critério de aceite:** aprovar/registrar uma ação num alerta crítico grava um log com meu usuário e a hora.
**Demo no vídeo:** mostrar que a IA recomenda, mas quem decide/registra a parada é o humano (Nível técnico), com o registro ficando salvo.

---

## 🔹 P1 — Reforço (se sobrar tempo)

### P1.1 — Score de confiança visível no Diagnóstico ML
Exibir um % de confiança no painel de Diagnóstico ML (derivar dos campos já existentes em `diagnostico`, ex.: severidade LSTM / anomalia IF). Amarra com o circuit breaker (confiança < 60% → tratar como retido/handoff).

### P1.2 — Justificativa de status automática
No detalhe do motor, gerar o texto explicativo do estado com base nos limites (ex.: "Vibração em X mm/s, acima do limite crítico Y mm/s"). Parte já aparece na recomendação — só padronizar com os números do limite.

---

## Ordem sugerida de execução
1. **P0.1** (config de limites) → destrava a demo inteira.
2. **P0.2** (estado + alerta) → o "threshold disparando".
3. **P0.4** (handoff + log de autoria) → supervisão humana.
4. **P0.3** (circuit breaker) → trava por incerteza.
5. P1.1 / P1.2 se der tempo.

Com P0.1 a P0.4 prontos, o vídeo consegue demonstrar: limites configurados → estado disparando → sistema segurando alerta com dado ruim → humano aprovando a ação crítica. É exatamente o que o barema do vídeo pede.
