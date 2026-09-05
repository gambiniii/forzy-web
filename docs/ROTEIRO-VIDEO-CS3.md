# Roteiro do Vídeo — Defesa CS3 (PRISM) · alvo 4:00 (limite 3–5 min)

## ⚙️ Antes de gravar — prepare os estados (o ciclo do scheduler é de 5 min, então não dá pra esperar disparar na câmera)

1. **Logue como admin** — pra aparecer o botão "Limites" e o "Registrar decisão".
2. **Prepare um motor CRÍTICO:** abra "Limites" de um motor, baixe o limite crítico de vibração pra abaixo da leitura atual (ex.: lê 0,57 → ponha crítico em 0,40). Espere o próximo ciclo (~5 min) e confirme que virou **CRÍTICO** + criou alerta. Deixe assim.
3. **Prepare um motor RETIDO (circuit breaker):** identifique um offline / sem leitura recente (ou baixa confiança) e confirme o badge **"retido"**.
4. **Deixe as telas na ordem de navegação** e faça **1 ensaio cronometrado** (tem que fechar entre 3 e 5 min).
5. Regra de ouro: **não leia o documento** — fale olhando a tela e clicando (vídeo lendo doc é desconsiderado).

---

## 🎬 Roteiro

**[0:00–0:25] Abertura**
- **Fale:** "Somos o grupo [nomes/RM]. Este é o **PRISM**, a plataforma de monitoramento preditivo que desenvolvemos para a **Forzy**. Neste vídeo mostramos a governança da decisão da Sprint 3: os limites de interpretação, o circuit breaker e a supervisão humana."
- **Mostre:** tela de Gestão de Plantas.

**[0:25–1:00] Hierarquia + linha de base**
- **Mostre:** clicar planta → maquinário → detalhe de um motor saudável. Aponte **ISO Zona A**, saúde 100%, diagnóstico ML.
- **Fale:** "O sistema organiza os ativos em Plantas → Máquinas → Componentes, lê vibração e temperatura em tempo real e classifica pela norma ISO 10816."

**[1:00–1:45] Metric Contract (os limites)**
- **Mostre:** botão **"Limites"** → modal com os thresholds (vibração e temperatura, atenção/crítico; defaults ISO Classe I).
- **Fale:** "Aqui está o **Metric Contract**: os limites são explícitos e configuráveis por motor, não escondidos dentro do modelo. Definidos por norma — pra esse porte de motor, vibração crítica em 4,5 mm/s."
- **Teste antes:** confirmar que edita e salva.

**[1:45–2:30] Threshold disparando**
- **Mostre:** o motor que você deixou em **CRÍTICO** — badge vermelho, a mensagem automática ("Vibração em X mm/s, acima do limite crítico de Y"), e o **alerta** na lista.
- **Fale:** "Quando a leitura cruza o limite, o sistema classifica sozinho e gera o alerta, com a justificativa já em números — o operador não precisa interpretar dado bruto."

**[2:30–3:15] Circuit Breaker**
- **Mostre:** o motor em **"retido"** (offline / dado insuficiente / baixa confiança).
- **Fale:** "Mas o sistema não alarma com dado ruim. Se o dado está offline, insuficiente, ou o modelo tem confiança abaixo de 60%, o **circuit breaker retém o alerta** em vez de disparar — evitando parar a planta à toa. Ele segura, registra, e espera dado confiável."

**[3:15–3:50] Handoff humano**
- **Mostre:** no motor crítico/retido, o botão **"Registrar decisão / Aprovar ação"** (aparece só pra admin/técnico) → registrar → mostrar que ficou no **log de autoria** (quem + quando).
- **Fale:** "A IA recomenda, mas nunca para a planta sozinha. A ação crítica exige um humano autorizado, e a decisão fica registrada com autor e horário — é o **handoff** e a rastreabilidade."

**[3:50–4:15] Fecho**
- **Fale:** "Resumindo: limites explícitos, um sistema que sabe a hora de calar, e a decisão final sempre com o humano onde errar custa caro. Essa é a governança da decisão do PRISM. Obrigado."

---

## ✅ Checklist final
- [ ] Logado como admin
- [ ] 1 motor em CRÍTICO preparado (+ alerta gerado)
- [ ] 1 motor em RETIDO preparado
- [ ] Ensaio cronometrado entre 3 e 5 min
- [ ] Falando sobre a tela, sem ler documento
