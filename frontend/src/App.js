import React, { useMemo, useState } from "react";
import "./App.css";

const PLANOS = {
  gratis: {
    id: "gratis",
    nome: "Grátis",
    mensal: 0,
    anual: 0,
    descricao:
      "Plano para conhecer o app sem cobrança: rotina base, frases diárias e check-in simples.",
    dureza: "leve",
    categoriasFrases: ["famosos"],
    tecnicas: [
      "Micro-hábitos de 2 minutos",
      "Checklist diário básico",
    ],
    diferenciais: ["Acesso inicial sem custo", "1 rotina diária", "Check-in básico"],
  },
  basico: {
    id: "basico",
    nome: "Básico",
    mensal: 19.9,
    anual: 199,
    descricao:
      "Frases diárias de famosos, rotina de disciplina e cobrança diária estilo coach.",
    dureza: "firme",
    categoriasFrases: ["famosos"],
    tecnicas: [
      "Micro-hábitos de 2 minutos",
      "Checklist diário com reforço positivo",
      "Planejamento da noite anterior",
    ],
    diferenciais: ["Agenda guiada", "Streak diário", "XP e níveis"],
  },
  pro: {
    id: "pro",
    nome: "Pro",
    mensal: 39.9,
    anual: 399,
    descricao:
      "Coach super duro, cobrança em dobro e frases de anime, filmes e famosos.",
    dureza: "duro",
    categoriasFrases: ["famosos", "anime", "filmes"],
    tecnicas: [
      "Implementação de intenção (Se X, então Y)",
      "Empilhamento de hábitos",
      "Urge surfing para controle de impulsos",
      "Atraso de recompensa (10 minutos)",
    ],
    diferenciais: [
      "Missões em dobro",
      "Radar de gatilhos de vício",
      "Relatório semanal com score",
    ],
  },
  hardcore: {
    id: "hardcore",
    nome: "Hardcore Ultra",
    mensal: 79.9,
    anual: 799,
    descricao:
      "Modo máximo: protocolo anti-vício intensivo, metas agressivas e avaliação diária sem desculpas.",
    dureza: "extremo",
    categoriasFrases: ["famosos", "anime", "filmes"],
    tecnicas: [
      "Reestruturação cognitiva (TCC)",
      "Exposição com prevenção de resposta",
      "Compromisso público e contrato comportamental",
      "Bloqueio de gatilhos + plano de contingência",
      "Jornal de urgência e craving",
    ],
    diferenciais: [
      "Sala de crise 24/7 (roteiros de emergência)",
      "Desafios hardcore com penalidade simbólica",
      "Plano de recuperação em camadas",
    ],
  },
};

const FRASES = {
  famosos: [
    "Disciplina é escolher entre o que você quer agora e o que você quer mais. — Abraham Lincoln (atribuída)",
    "Sem disciplina, o talento não vence. — Cristiano Ronaldo",
    "A ação é a chave fundamental para todo sucesso. — Pablo Picasso",
    "Você não precisa ser extremo, só consistente. — James Clear",
  ],
  anime: [
    "Não desista. O começo é sempre o mais difícil. — Naruto",
    "A diferença entre o novato e o mestre é que o mestre falhou mais vezes. — Koro-sensei",
    "Quem supera seus limites cresce de verdade. — Goku",
    "Uma pessoa cresce quando é capaz de superar dificuldades. — Jiraiya",
  ],
  filmes: [
    "Não é sobre quantas vezes você bate, e sim quantas aguenta apanhar e seguir em frente. — Rocky Balboa",
    "Faça, ou não faça. Tentativa não há. — Yoda",
    "Grandes homens não nascem grandes, tornam-se grandes. — O Poderoso Chefão",
    "Nossos atos nos definem. — Batman Begins",
  ],
};

const ROTINA_BASE = [
  { id: "manhã", periodo: "Manhã", tarefa: "Acordar sem soneca + água + 10 min foco" },
  { id: "tarde", periodo: "Tarde", tarefa: "Bloco profundo de 50 min sem distração" },
  { id: "noite", periodo: "Noite", tarefa: "Revisão do dia + planejamento de amanhã" },
];

const VICIOS_BASE = [
  "Uso excessivo de redes sociais",
  "Pornografia",
  "Apostas",
  "Procrastinação por vídeos curtos",
];

const PAGAMENTOS = [
  "Cartão de crédito",
  "Cartão de débito",
  "PIX",
  "Boleto bancário",
  "PayPal",
  "Apple Pay / Google Pay",
];

function formatarBRL(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function obterIndiceDoDia() {
  const agora = new Date();
  const inicio = new Date(agora.getFullYear(), 0, 0);
  const diff = agora - inicio;
  return Math.floor(diff / 86400000);
}

function App() {
  const [ciclo, setCiclo] = useState("mensal");
  const [planoSelecionado, setPlanoSelecionado] = useState("gratis");
  const [rotinaConcluida, setRotinaConcluida] = useState({});
  const [viciosControlados, setViciosControlados] = useState({});
  const [diasConsecutivos, setDiasConsecutivos] = useState(4);
  const [checkins, setCheckins] = useState(0);
  const [focoSemana, setFocoSemana] = useState("Reduzir 80% do uso impulsivo de celular");
  const [mensagemCoach, setMensagemCoach] = useState("");

  const plano = PLANOS[planoSelecionado];
  const indiceDoDia = obterIndiceDoDia();

  const fraseDoDia = useMemo(() => {
    const todas = plano.categoriasFrases.flatMap((categoria) => FRASES[categoria] || []);
    return todas[indiceDoDia % todas.length];
  }, [indiceDoDia, plano.categoriasFrases]);

  const progressoRotina = useMemo(() => {
    const total = ROTINA_BASE.length;
    const feitas = ROTINA_BASE.filter((item) => rotinaConcluida[item.id]).length;
    return { feitas, total, pct: Math.round((feitas / total) * 100) };
  }, [rotinaConcluida]);

  const progressoVicios = useMemo(() => {
    const total = VICIOS_BASE.length;
    const controlados = VICIOS_BASE.filter((nome) => viciosControlados[nome]).length;
    return { controlados, total, pct: Math.round((controlados / total) * 100) };
  }, [viciosControlados]);

  const xpTotal = useMemo(() => {
    const xpRotina = progressoRotina.feitas * 30;
    const xpVicios = progressoVicios.controlados * 40;
    const xpCheckins = checkins * 60;
    return xpRotina + xpVicios + xpCheckins;
  }, [progressoRotina.feitas, progressoVicios.controlados, checkins]);

  const nivel = Math.max(1, Math.floor(xpTotal / 120) + 1);

  const precoAtual = plano[ciclo];
  const assinaturaGratis = precoAtual === 0;
  const precoMensalEquivalente = ciclo === "anual" ? plano.anual / 12 : plano.mensal;

  const economiza = useMemo(() => {
    const anualSemDesconto = plano.mensal * 12;
    return Math.max(0, anualSemDesconto - plano.anual);
  }, [plano.anual, plano.mensal]);

  const badges = useMemo(() => {
    return [
      { nome: "Início bruto", ativo: checkins >= 1 },
      { nome: "Foco de aço", ativo: progressoRotina.feitas === ROTINA_BASE.length },
      { nome: "Sem recaída hoje", ativo: progressoVicios.controlados >= 2 },
      { nome: "Monstro da consistência", ativo: diasConsecutivos >= 7 },
    ];
  }, [checkins, progressoRotina.feitas, progressoVicios.controlados, diasConsecutivos]);

  function toggleRotina(id) {
    setRotinaConcluida((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleVicio(nome) {
    setViciosControlados((prev) => ({ ...prev, [nome]: !prev[nome] }));
  }

  function finalizarCheckinDiario() {
    const rotinaOk = progressoRotina.feitas >= 2;
    const viciosOk = progressoVicios.controlados >= 1;

    if (rotinaOk && viciosOk) {
      setCheckins((prev) => prev + 1);
      setDiasConsecutivos((prev) => prev + 1);
      setMensagemCoach(
        "Check-in aprovado. Você cumpriu o combinado de hoje. Continue assim amanhã sem negociar com a preguiça.",
      );
      return;
    }

    setDiasConsecutivos((prev) => Math.max(0, prev - 1));
    setMensagemCoach(
      "Check-in reprovado. Faltou execução mínima. Ajuste o ambiente, reduza distrações e volte para a rotina agora.",
    );
  }

  function gerarCobrancaCoach() {
    const faltamRotina = ROTINA_BASE.filter((item) => !rotinaConcluida[item.id]).map(
      (item) => item.periodo.toLowerCase(),
    );
    const faltamControle = VICIOS_BASE.filter((nome) => !viciosControlados[nome]).length;

    const tom =
      plano.id === "gratis"
        ? "Modo Grátis ativo. Vamos construir consistência primeiro."
        : plano.dureza === "extremo"
        ? "Você está no modo Hardcore Ultra. Sem desculpas."
        : plano.dureza === "duro"
          ? "Modo Pro ativo. Cobrança em dobro."
          : "Modo Básico ativo. Consistência diária.";

    const blocoRotina =
      faltamRotina.length > 0
        ? `Ainda faltam blocos da rotina: ${faltamRotina.join(", ")}.`
        : "Rotina concluída em 100% hoje.";

    const blocoVicio =
      faltamControle > 0
        ? `Você ainda não marcou controle em ${faltamControle} gatilhos de vício.`
        : "Excelente: você marcou controle em todos os gatilhos monitorados.";

    const tecnica = plano.tecnicas[indiceDoDia % plano.tecnicas.length];
    const proximaAcao =
      faltamRotina.length > 0
        ? "Próxima ação em 5 minutos: inicie o próximo bloco de foco com cronômetro."
        : "Próxima ação em 5 minutos: revisar metas de amanhã e dormir no horário.";

    setMensagemCoach(`${tom} ${blocoRotina} ${blocoVicio} Técnica do dia: ${tecnica}. ${proximaAcao}`);
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="hero-kicker">Vibe Coding • Disciplina Gamificada com Agente Integrado</p>
        <h1>Disciplina+ Coach</h1>
        <p>
          Um app para execução real: rotina diária, cobrança estilo coach, frases motivadoras,
          plano anti-vícios com base psicológica e assinatura mensal/anual.
        </p>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Agente Coach do Dia</h2>
          <p className="muted">Frase motivadora diária do seu plano:</p>
          <blockquote>{fraseDoDia}</blockquote>

          <label htmlFor="foco-semana">Foco principal da semana</label>
          <input
            id="foco-semana"
            value={focoSemana}
            onChange={(e) => setFocoSemana(e.target.value)}
            placeholder="Ex: 14 dias sem apostas"
          />

          <div className="actions">
            <button type="button" onClick={gerarCobrancaCoach}>
              Gerar cobrança diária
            </button>
            <button type="button" className="ghost" onClick={finalizarCheckinDiario}>
              Finalizar check-in
            </button>
          </div>

          <div className="coach-box">
            <strong>Mensagem do agente:</strong>
            <p>{mensagemCoach || "Clique em “Gerar cobrança diária” para receber sua chamada de ação."}</p>
          </div>
        </article>

        <article className="card">
          <h2>Gamificação de Disciplina</h2>
          <div className="stats">
            <div>
              <span>XP total</span>
              <strong>{xpTotal}</strong>
            </div>
            <div>
              <span>Nível</span>
              <strong>{nivel}</strong>
            </div>
            <div>
              <span>Streak</span>
              <strong>{diasConsecutivos} dias</strong>
            </div>
            <div>
              <span>Check-ins</span>
              <strong>{checkins}</strong>
            </div>
          </div>

          <div className="progress-block">
            <p>Rotina diária: {progressoRotina.pct}%</p>
            <div className="progress">
              <div style={{ width: `${progressoRotina.pct}%` }} />
            </div>
          </div>

          <div className="progress-block">
            <p>Controle de vícios: {progressoVicios.pct}%</p>
            <div className="progress alt">
              <div style={{ width: `${progressoVicios.pct}%` }} />
            </div>
          </div>

          <div className="badges">
            {badges.map((badge) => (
              <span key={badge.nome} className={badge.ativo ? "badge active" : "badge"}>
                {badge.nome}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <h2>Rotina de Disciplina</h2>
          <p className="muted">Marque seus blocos obrigatórios do dia:</p>
          <ul className="check-list">
            {ROTINA_BASE.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(rotinaConcluida[item.id])}
                    onChange={() => toggleRotina(item.id)}
                  />
                  <span>
                    <strong>{item.periodo}:</strong> {item.tarefa}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Ajuda para Parar Vícios</h2>
          <p className="muted">
            Baseado em técnicas psicológicas práticas (TCC, urge surfing, contrato comportamental):
          </p>
          <ul className="techniques">
            {plano.tecnicas.map((tecnica) => (
              <li key={tecnica}>{tecnica}</li>
            ))}
          </ul>

          <p className="muted top-gap">Marque os gatilhos que você controlou hoje:</p>
          <ul className="check-list">
            {VICIOS_BASE.map((nome) => (
              <li key={nome}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(viciosControlados[nome])}
                    onChange={() => toggleVicio(nome)}
                  />
                  <span>{nome}</span>
                </label>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card pricing">
        <h2>Planos de Assinatura</h2>
        <p className="muted">
          Escolha mensal ou anual. No anual, você economiza e reforça compromisso de longo prazo.
        </p>

        <div className="billing-toggle">
          <button
            type="button"
            className={ciclo === "mensal" ? "active" : ""}
            onClick={() => setCiclo("mensal")}
          >
            Mensal
          </button>
          <button
            type="button"
            className={ciclo === "anual" ? "active" : ""}
            onClick={() => setCiclo("anual")}
          >
            Anual
          </button>
        </div>

        <div className="plans">
          {Object.values(PLANOS).map((item) => {
            const valor = item[ciclo];
            const equivalencia = ciclo === "anual" ? item.anual / 12 : item.mensal;
            return (
              <div
                key={item.id}
                className={planoSelecionado === item.id ? "plan selected" : "plan"}
                onClick={() => setPlanoSelecionado(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setPlanoSelecionado(item.id);
                }}
                role="button"
                tabIndex={0}
              >
                <h3>{item.nome}</h3>
                <p className="price">{formatarBRL(valor)}</p>
                <p className="muted small">
                  {ciclo === "mensal" ? "por mês" : "por ano"} • Equivale a{" "}
                  {formatarBRL(equivalencia)}/mês
                </p>
                <p>{item.descricao}</p>
                <ul>
                  {item.diferenciais.map((diferencial) => (
                    <li key={diferencial}>{diferencial}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="checkout">
          <h3>Resumo do pedido</h3>
          <p>
            Plano escolhido: <strong>{plano.nome}</strong>
          </p>
          <p>
            Modalidade: <strong>{ciclo}</strong>
          </p>
          <p>
            Total agora: <strong>{formatarBRL(precoAtual)}</strong>
          </p>
          <p className="muted small">
            {assinaturaGratis
              ? "Sem cobrança no plano grátis. Faça upgrade quando quiser recursos avançados."
              : `Valor mensal equivalente: ${formatarBRL(precoMensalEquivalente)}. ${
                  ciclo === "anual" && economiza > 0
              ? `Economia anual: ${formatarBRL(economiza)}`
              : "Sem fidelidade no plano mensal."
                }`}
          </p>

          <h4>Tipos de pagamento</h4>
          <div className="payments">
            {PAGAMENTOS.map((pagamento) => (
              <span key={pagamento} className="chip">
                {pagamento}
              </span>
            ))}
          </div>

          <button type="button" className="cta">
            {assinaturaGratis ? "Começar grátis" : "Assinar agora"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;