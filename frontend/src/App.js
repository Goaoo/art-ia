import React, { useMemo, useState } from "react";
import "./App.css";
const PLANS = [
  {
    id: "basic",
    name: "Plano Básico",
    monthlyPrice: 19.9,
    badge: "Essencial",
    description:
      "Frases diárias de pessoas famosas, rotina base e cobrança diária equilibrada.",
    features: [
      "Frases motivadoras de famosos todos os dias",
      "Rotina de disciplina com checklist inteligente",
      "Cobrança diária estilo coach moderado",
      "Gamificação com XP, moedas e streak",
    ],
  },
  {
    id: "pro",
    name: "Plano Pro",
    monthlyPrice: 39.9,
    badge: "Mais vendido",
    description:
      "Coach super duro, intensidade em dobro e frases de anime, filme e famosos.",
    features: [
      "Tudo do Básico com intensidade em dobro",
      "Cobrança firme com metas agressivas",
      "Frases de anime, filmes e pessoas famosas",
      "Protocolos extras para quebrar hábitos ruins",
    ],
  },
  {
    id: "hardcore",
    name: "Hardcore Ultra",
    monthlyPrice: 79.9,
    badge: "Nível extremo",
    description:
      "Ritual de alta performance com desafios extremos, score de consistência e modo sem desculpas.",
    features: [
      "Modo sem desculpas com checkpoints no dia",
      "Missões hardcore e metas adaptativas",
      "Plano anti-vícios com protocolo psicológico completo",
      "Análise semanal de disciplina e ranking pessoal",
    ],
  },
];

const PAYMENT_METHODS = [
  "Pix",
  "Cartão de crédito",
  "Cartão de débito",
  "Boleto bancário",
  "PayPal",
  "Carteira digital",
];

const QUOTES = {
  famosos: [
    "A disciplina é a ponte entre metas e realizações. — Jim Rohn",
    "Você não precisa ser ótimo para começar, mas precisa começar para ser ótimo. — Zig Ziglar",
    "Sucesso é a soma de pequenos esforços repetidos diariamente. — Robert Collier",
    "A motivação te coloca em movimento, o hábito te mantém no caminho. — Jim Ryun",
  ],
  anime: [
    "Desista do que te prende, não do que te transforma. — (inspirado em Naruto)",
    "O esforço contínuo vence o talento indisciplinado. — (inspirado em My Hero Academia)",
    "Não existe atalho para o treino de verdade. — (inspirado em Dragon Ball)",
  ],
  filmes: [
    "Não é sobre cair, é sobre levantar mais forte. — (inspirado em Rocky)",
    "Hoje é o dia de fazer o que o seu futuro vai agradecer. — (inspirado em À Procura da Felicidade)",
    "Coragem é agir com medo mesmo assim. — (inspirado em Batman Begins)",
  ],
};

const INITIAL_TASKS = [
  { id: 1, title: "Acordar no horário sem soneca", points: 20, done: false },
  { id: 2, title: "Treino físico ou caminhada (30 min)", points: 25, done: false },
  { id: 3, title: "Bloco de foco profundo (45 min)", points: 30, done: false },
  { id: 4, title: "Zero redes sociais até 10h", points: 15, done: false },
  { id: 5, title: "Revisão noturna + planejamento amanhã", points: 20, done: false },
];

const formatMoney = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const billingPrice = (monthlyPrice, cycle) => {
  if (cycle === "mensal") {
    return monthlyPrice;
  }

  // Desconto de 20% no anual.
  return monthlyPrice * 12 * 0.8;
};

function App() {
  const [billingCycle, setBillingCycle] = useState("mensal");
  const [selectedPlanId, setSelectedPlanId] = useState("pro");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [focusSessions, setFocusSessions] = useState(0);
  const [streakDays, setStreakDays] = useState(5);
  const [dayClosed, setDayClosed] = useState(false);
  const [habitTrigger, setHabitTrigger] = useState("");

  const selectedPlan = PLANS.find((plan) => plan.id === selectedPlanId) || PLANS[1];

  const completedTasks = tasks.filter((task) => task.done).length;
  const totalTasks = tasks.length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);
  const routinePoints = tasks
    .filter((task) => task.done)
    .reduce((sum, task) => sum + task.points, 0);
  const xp = routinePoints + focusSessions * 15;
  const level = Math.floor(xp / 100) + 1;
  const coins = completedTasks * 8 + focusSessions * 5 + streakDays * 2;

  const dailyQuotes = useMemo(() => {
    const daySeed = new Date().getDate();
    const famousQuote =
      QUOTES.famosos[daySeed % QUOTES.famosos.length];
    const animeQuote = QUOTES.anime[daySeed % QUOTES.anime.length];
    const movieQuote =
      QUOTES.filmes[daySeed % QUOTES.filmes.length];

    if (selectedPlanId === "basic") {
      return [famousQuote];
    }
    if (selectedPlanId === "pro") {
      return [famousQuote, animeQuote];
    }
    return [famousQuote, animeQuote, movieQuote];
  }, [selectedPlanId]);

  const toggleTask = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const closeDay = () => {
    if (dayClosed) {
      return;
    }

    if (completionRate >= 80) {
      setStreakDays((value) => value + 1);
    }
    setDayClosed(true);
  };

  const coachMessage = useMemo(() => {
    const missingTasks = totalTasks - completedTasks;

    let tonePrefix =
      "Coach diário: disciplina não é humor, é compromisso com o seu futuro.";
    if (selectedPlanId === "pro") {
      tonePrefix =
        "Coach PRO (super duro): sem negociação. Você faz o que precisa ser feito.";
    }
    if (selectedPlanId === "hardcore") {
      tonePrefix =
        "Coach HARDCORE ULTRA: desculpa não paga boleto, ação paga. Execute agora.";
    }

    let progressMessage = `Hoje você concluiu ${completedTasks}/${totalTasks} tarefas (${completionRate}%).`;
    if (missingTasks > 0) {
      progressMessage += ` Ainda faltam ${missingTasks} tarefa(s).`;
    } else {
      progressMessage += " Meta diária batida, padrão de elite.";
    }

    let habitMessage =
      "Anti-vícios: use a regra dos 10 minutos (urge surfing), respire fundo e substitua o impulso por uma ação curta positiva.";
    if (habitTrigger.trim()) {
      habitMessage = `Gatilho identificado: "${habitTrigger}". Estratégia psicológica: Se eu sentir esse gatilho, então eu vou tomar água, respirar por 90 segundos e iniciar 5 minutos da tarefa principal.`;
    }

    if (selectedPlanId === "hardcore") {
      habitMessage +=
        " Protocolo hardcore: bloqueie o ambiente gatilho por 24h e registre vitória no diário.";
    }

    return `${tonePrefix} ${progressMessage} ${habitMessage}`;
  }, [selectedPlanId, completedTasks, totalTasks, completionRate, habitTrigger]);

  return (
    <main className="discipline-app">
      <section className="hero">
        <p className="eyebrow">Vibe Coding + Agente Integrado</p>
        <h1>Disciplina XP</h1>
        <p>
          App de disciplina com gamificação, rotina diária, frases motivadoras e
          cobrança estilo coach para manter constância real.
        </p>
      </section>

      <section className="stats-grid">
        <article className="card stat-card">
          <h3>Nível</h3>
          <strong>{level}</strong>
          <p>{xp} XP acumulado</p>
        </article>
        <article className="card stat-card">
          <h3>Streak</h3>
          <strong>{streakDays} dias</strong>
          <p>Consistência em sequência</p>
        </article>
        <article className="card stat-card">
          <h3>Moedas</h3>
          <strong>{coins}</strong>
          <p>Recompensas pela disciplina</p>
        </article>
        <article className="card stat-card">
          <h3>Progresso diário</h3>
          <strong>{completionRate}%</strong>
          <p>{completedTasks} de {totalTasks} tarefas concluídas</p>
        </article>
      </section>

      <section className="content-grid">
        <article className="card">
          <div className="section-header">
            <h2>Rotina de disciplina</h2>
            <button type="button" onClick={() => setFocusSessions((v) => v + 1)}>
              + sessão foco (25 min)
            </button>
          </div>
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.title}</span>
                </label>
                <span className="points">+{task.points} XP</span>
              </li>
            ))}
          </ul>
          <button type="button" className="primary" onClick={closeDay}>
            {dayClosed ? "Dia encerrado" : "Encerrar dia e validar streak"}
          </button>
        </article>

        <article className="card coach-card">
          <h2>Agente Coach</h2>
          <p>{coachMessage}</p>
          <label htmlFor="habit-trigger">
            Qual gatilho do vício apareceu hoje?
          </label>
          <input
            id="habit-trigger"
            type="text"
            placeholder="Ex: ansiedade depois do almoço"
            value={habitTrigger}
            onChange={(event) => setHabitTrigger(event.target.value)}
          />
          <small>
            Técnicas usadas: implementação "se-então", urge surfing, substituição
            comportamental e design de ambiente.
          </small>
        </article>
      </section>

      <section className="card quotes-card">
        <h2>Frases motivadoras diárias</h2>
        <p>
          Plano atual: <strong>{selectedPlan.name}</strong>
        </p>
        <ul>
          {dailyQuotes.map((quote) => (
            <li key={quote}>{quote}</li>
          ))}
        </ul>
      </section>

      <section className="plans">
        <div className="plans-header">
          <h2>Assinaturas</h2>
          <div className="billing-toggle">
            <button
              type="button"
              className={billingCycle === "mensal" ? "active" : ""}
              onClick={() => setBillingCycle("mensal")}
            >
              Mensal
            </button>
            <button
              type="button"
              className={billingCycle === "anual" ? "active" : ""}
              onClick={() => setBillingCycle("anual")}
            >
              Anual (20% off)
            </button>
          </div>
        </div>

        <div className="plan-grid">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`card plan-card ${selectedPlanId === plan.id ? "selected" : ""}`}
            >
              <p className="plan-badge">{plan.badge}</p>
              <h3>{plan.name}</h3>
              <p className="price">
                {formatMoney(billingPrice(plan.monthlyPrice, billingCycle))}
                <span>/{billingCycle}</span>
              </p>
              <p>{plan.description}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button type="button" onClick={() => setSelectedPlanId(plan.id)}>
                Escolher {plan.name}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="card payment-card">
        <h2>Formas de pagamento</h2>
        <div className="payment-list">
          {PAYMENT_METHODS.map((method) => (
            <span key={method}>{method}</span>
          ))}
        </div>
        <p>
          Cobrança automática conforme ciclo escolhido ({billingCycle}) com opção
          de troca de plano a qualquer momento.
        </p>
      </section>
    </main>
  );
}

export default App;