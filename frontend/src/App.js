import React, { useMemo, useState } from "react";
import "./App.css";

const PLANOS = [
  {
    id: "gratis",
    nome: "Grátis",
    selo: "Teste sem risco",
    mensal: 0,
    anual: 0,
    dureza: "leve",
    categoriasFrases: ["famosos"],
    descricao: "Para conhecer o app sem cobrança e criar consistência inicial.",
    diferenciais: [
      "Rotina diária essencial",
      "Check-in básico",
      "Frase motivadora diária",
      "Onboarding imediato",
    ],
    tecnicas: ["Micro-hábitos de 2 minutos", "Checklist mínimo viável"],
  },
  {
    id: "basico",
    nome: "Básico",
    selo: "Popular para iniciar",
    mensal: 19.9,
    anual: 199,
    dureza: "firme",
    categoriasFrases: ["famosos"],
    descricao: "Cobrança diária estilo coach e gamificação completa para disciplina.",
    diferenciais: ["Agenda guiada", "XP + níveis", "Streak diário", "Missões progressivas"],
    tecnicas: [
      "Planejamento da noite anterior",
      "Reforço positivo estruturado",
      "Empilhamento de hábitos",
    ],
  },
  {
    id: "pro",
    nome: "Pro",
    selo: "Mais vendido",
    mensal: 39.9,
    anual: 399,
    dureza: "duro",
    categoriasFrases: ["famosos", "anime", "filmes"],
    descricao: "Coach super duro, cobrança em dobro e protocolo anti-procrastinação.",
    diferenciais: [
      "Cobrança em dobro",
      "Frases anime/filme/famosos",
      "Radar de gatilhos de vício",
      "Relatório semanal de performance",
    ],
    tecnicas: [
      "Implementação de intenção (Se X, então Y)",
      "Urge surfing",
      "Atraso de recompensa",
      "Contratos de compromisso",
    ],
  },
  {
    id: "hardcore",
    nome: "Hardcore Ultra",
    selo: "Modo extremo",
    mensal: 79.9,
    anual: 799,
    dureza: "extremo",
    categoriasFrases: ["famosos", "anime", "filmes"],
    descricao: "Operação disciplina máxima com protocolo intensivo anti-vício.",
    diferenciais: [
      "Metas agressivas diárias",
      "Sala de crise com roteiros",
      "Plano de contingência em camadas",
      "Avaliação diária sem desculpas",
    ],
    tecnicas: [
      "Reestruturação cognitiva (TCC)",
      "Exposição com prevenção de resposta",
      "Jornal de craving e urgência",
      "Bloqueio de gatilhos ambientais",
    ],
  },
];

const FRASES = {
  famosos: [
    "Disciplina é a ponte entre metas e resultados. — Jim Rohn",
    "A consistência transforma o comum em extraordinário. — Robin Sharma",
    "A ação derrota a ansiedade. — Mel Robbins",
    "Não precisa ser extremo, precisa ser constante. — James Clear",
  ],
  anime: [
    "O poder vem da vontade de não desistir. — Naruto",
    "Um passo por dia ainda é progresso. — Tanjiro",
    "Você evolui quando supera seus limites. — Goku",
    "A dor do treino vence a dor do arrependimento. — Rock Lee",
  ],
  filmes: [
    "Não importa quantas vezes você cai, importa quantas levanta. — Rocky",
    "Faça, ou não faça. Tentativa não há. — Yoda",
    "Grandes homens não nascem grandes, tornam-se grandes. — O Poderoso Chefão",
    "Nossos atos nos definem. — Batman Begins",
  ],
};

const METODOS_PAGAMENTO = [
  "Cartão de crédito",
  "Cartão de débito",
  "PIX",
  "Boleto",
  "PayPal",
  "Apple Pay / Google Pay",
];

const ROTINA_PADRAO = [
  { id: "r1", titulo: "Acordar sem soneca + água", pontos: 30 },
  { id: "r2", titulo: "Bloco profundo de 50 minutos", pontos: 40 },
  { id: "r3", titulo: "Treino ou caminhada de 20 minutos", pontos: 35 },
  { id: "r4", titulo: "Planejar o dia seguinte", pontos: 30 },
];

const GATILHOS = [
  "Redes sociais em horários improdutivos",
  "Vídeos curtos sem controle",
  "Apostas/compulsão de risco",
  "Conteúdo adulto compulsivo",
];

const DEPOIMENTOS = [
  { nome: "Renato, 27", texto: "Saí de 0 para 19 dias de streak. A cobrança diária mudou meu jogo." },
  { nome: "Camila, 31", texto: "O modo Pro me fez cortar distração. Produção subiu muito em 2 semanas." },
  { nome: "Davi, 22", texto: "Usei o protocolo anti-vício e finalmente consegui ritmo de disciplina." },
];

const FAQ = [
  {
    pergunta: "Existe cobrança automática no plano grátis?",
    resposta: "Não. O plano grátis é sem cobrança. Upgrade só quando você escolher um plano pago.",
  },
  {
    pergunta: "Esse app substitui terapia?",
    resposta:
      "Não. O app oferece suporte comportamental e técnicas práticas, mas não substitui atendimento clínico.",
  },
  {
    pergunta: "Tem plano mensal e anual?",
    resposta: "Sim. Todos os planos pagos têm opção mensal e anual com economia no ciclo anual.",
  },
];

const LINK_PUBLICO_SUGERIDO = "https://goaoo.github.io/art-ia/";

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
  const [planoSelecionado, setPlanoSelecionado] = useState("pro");
  const [metodoPagamento, setMetodoPagamento] = useState(METODOS_PAGAMENTO[2]);
  const [rotina, setRotina] = useState(
    ROTINA_PADRAO.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
  );
  const [gatilhosControlados, setGatilhosControlados] = useState(
    GATILHOS.reduce((acc, item) => ({ ...acc, [item]: false }), {}),
  );
  const [onboard, setOnboard] = useState({
    nome: "",
    email: "",
    meta: "Construir 30 dias de disciplina sem recaídas fortes",
    focoVicio: "Uso excessivo de celular",
  });
  const [clienteAtivo, setClienteAtivo] = useState(false);
  const [mensagemCoach, setMensagemCoach] = useState("");
  const [pedidoStatus, setPedidoStatus] = useState("");
  const [checkins, setCheckins] = useState(0);
  const [streak, setStreak] = useState(3);

  const plano = PLANOS.find((item) => item.id === planoSelecionado) || PLANOS[0];
  const indiceDoDia = obterIndiceDoDia();

  const fraseDoDia = useMemo(() => {
    const frases = plano.categoriasFrases.flatMap((categoria) => FRASES[categoria] || []);
    return frases[indiceDoDia % frases.length];
  }, [indiceDoDia, plano.categoriasFrases]);

  const progressoRotina = useMemo(() => {
    const concluidas = ROTINA_PADRAO.filter((item) => rotina[item.id]).length;
    const total = ROTINA_PADRAO.length;
    return {
      concluidas,
      total,
      pct: Math.round((concluidas / total) * 100),
      xp: ROTINA_PADRAO.filter((item) => rotina[item.id]).reduce((acc, item) => acc + item.pontos, 0),
    };
  }, [rotina]);

  const progressoVicios = useMemo(() => {
    const controlados = GATILHOS.filter((item) => gatilhosControlados[item]).length;
    const total = GATILHOS.length;
    return {
      controlados,
      total,
      pct: Math.round((controlados / total) * 100),
      xp: controlados * 45,
    };
  }, [gatilhosControlados]);

  const xpTotal = progressoRotina.xp + progressoVicios.xp + checkins * 80;
  const nivel = Math.max(1, Math.floor(xpTotal / 140) + 1);
  const precoAtual = plano[ciclo];
  const planoGratis = precoAtual === 0;
  const economiaAnual = Math.max(0, plano.mensal * 12 - plano.anual);

  const badges = [
    { nome: "Arrancada", ativo: checkins >= 1 },
    { nome: "Foco de aço", ativo: progressoRotina.concluidas >= 3 },
    { nome: "Controle mental", ativo: progressoVicios.controlados >= 2 },
    { nome: "Disciplina monstra", ativo: streak >= 10 },
  ];

  function alterarCampoOnboard(chave, valor) {
    setOnboard((prev) => ({ ...prev, [chave]: valor }));
  }

  function iniciarPlanoGratis(event) {
    event.preventDefault();
    if (!onboard.nome || !onboard.email) {
      setPedidoStatus("Preencha nome e e-mail para iniciar o plano grátis.");
      return;
    }
    setPlanoSelecionado("gratis");
    setClienteAtivo(true);
    setPedidoStatus(`Conta criada para ${onboard.nome}. Você já está no plano Grátis sem cobrança.`);
    setMensagemCoach(
      `Bem-vindo, ${onboard.nome}. Hoje seu compromisso é simples: execute o básico sem negociar com a preguiça.`,
    );
  }

  function alternarRotina(id) {
    setRotina((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function alternarGatilho(gatilho) {
    setGatilhosControlados((prev) => ({ ...prev, [gatilho]: !prev[gatilho] }));
  }

  function gerarCobrancaDiaria() {
    const faltamRotina = ROTINA_PADRAO.filter((item) => !rotina[item.id]).length;
    const faltamGatilhos = GATILHOS.filter((item) => !gatilhosControlados[item]).length;
    const tecnica = plano.tecnicas[indiceDoDia % plano.tecnicas.length];

    const tom =
      plano.id === "hardcore"
        ? "Hardcore Ultra ativo. Hoje não existe espaço para desculpas."
        : plano.id === "pro"
          ? "Modo Pro ativo. Execução em alto padrão."
          : plano.id === "basico"
            ? "Modo Básico ativo. Consistência vence motivação."
            : "Modo Grátis ativo. O foco é criar constância de verdade.";

    const texto = `${tom} Meta principal: ${onboard.meta}. Gatilho prioritário: ${onboard.focoVicio}. Faltam ${faltamRotina} blocos da rotina e ${faltamGatilhos} controles de gatilho. Técnica do dia: ${tecnica}. Próxima ação: iniciar um bloco de foco de 5 minutos agora.`;
    setMensagemCoach(texto);
  }

  function finalizarCheckin() {
    const rotinaOk = progressoRotina.concluidas >= 3;
    const viciosOk = progressoVicios.controlados >= 1;

    if (rotinaOk && viciosOk) {
      setCheckins((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setMensagemCoach("Check-in aprovado. Você executou o mínimo de elite. Repita amanhã.");
      return;
    }

    setStreak((prev) => Math.max(0, prev - 1));
    setMensagemCoach(
      "Check-in reprovado. Ajuste o ambiente agora: bloqueie distrações, reduza a meta e execute o próximo passo.",
    );
  }

  function simularCheckout() {
    if (!clienteAtivo) {
      setPedidoStatus("Ative sua conta no formulário de onboarding antes de assinar.");
      return;
    }

    if (plano.id === "gratis") {
      setPedidoStatus("Plano Grátis ativo. Nenhuma cobrança realizada.");
      return;
    }

    setPedidoStatus(
      `Assinatura simulada com sucesso: ${plano.nome} (${ciclo}) via ${metodoPagamento}. Total: ${formatarBRL(
        precoAtual,
      )}.`,
    );
  }

  return (
    <main className="saas">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <strong>Disciplina+ Coach</strong>
        </div>
        <nav>
          <a href="#precos">Planos</a>
          <a href="#onboarding">Onboarding</a>
          <a href="#dashboard">Dashboard</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="kicker">Versão Comercial • Estilo Lovable</p>
          <h1>Seu coach de disciplina com produto pronto para vender</h1>
          <p>
            Landing de conversão, onboarding, plano grátis, planos mensal/anual, checkout,
            gamificação e rotina anti-vício com técnicas psicológicas aplicáveis no dia a dia.
          </p>
          <div className="hero-actions">
            <a href="#onboarding" className="btn">
              Começar grátis
            </a>
            <a href="#precos" className="btn ghost">
              Ver planos
            </a>
          </div>
        </div>
        <aside className="hero-card">
          <h3>Oferta comercial</h3>
          <ul>
            <li>Plano Grátis sem cobrança</li>
            <li>Básico R$ 19,90/mês</li>
            <li>Pro R$ 39,90/mês</li>
            <li>Hardcore Ultra R$ 79,90/mês</li>
          </ul>
          <p className="micro">
            Inclui cobrança diária estilo coach, frases motivadoras e protocolo anti-vício.
          </p>
        </aside>
      </section>

      <section className="cards-3">
        <article className="panel">
          <h3>Agente integrado</h3>
          <p>Cobrança diária inteligente por plano com tom adaptado de leve a extremo.</p>
        </article>
        <article className="panel">
          <h3>Gamificação séria</h3>
          <p>XP, níveis, streak e badges para reforçar consistência e reduzir recaídas.</p>
        </article>
        <article className="panel">
          <h3>Produto comercial</h3>
          <p>Jornada pronta: aquisição (landing) → ativação (onboarding) → retenção (dashboard).</p>
        </article>
      </section>

      <section className="panel install-panel">
        <h2>Link público estável + instalação no celular</h2>
        <p>
          Para distribuição gratuita e segura, publique este app via GitHub Pages (HTTPS) e compartilhe
          o link público abaixo.
        </p>
        <div className="public-link-box">
          <span>Link sugerido:</span>
          <a href={LINK_PUBLICO_SUGERIDO} target="_blank" rel="noreferrer">
            {LINK_PUBLICO_SUGERIDO}
          </a>
        </div>
        <ol>
          <li>Abra o link no celular (Chrome/Safari).</li>
          <li>Toque em “Adicionar à tela inicial” para instalar grátis como app.</li>
          <li>Compartilhe o mesmo link por WhatsApp, Instagram, TikTok ou QR Code.</li>
        </ol>
      </section>

      <section id="precos" className="panel pricing">
        <div className="section-head">
          <h2>Planos e Assinatura</h2>
          <p>Escolha o ciclo de cobrança e o plano ideal para sua intensidade de execução.</p>
        </div>
        <div className="billing-switch">
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

        <div className="plan-grid">
          {PLANOS.map((item) => {
            const valor = item[ciclo];
            const selecionado = item.id === planoSelecionado;
            const economia = Math.max(0, item.mensal * 12 - item.anual);
            return (
              <article
                key={item.id}
                className={selecionado ? "plan-card selected" : "plan-card"}
                role="button"
                tabIndex={0}
                onClick={() => setPlanoSelecionado(item.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setPlanoSelecionado(item.id);
                }}
              >
                <p className="tag">{item.selo}</p>
                <h3>{item.nome}</h3>
                <p className="price">{formatarBRL(valor)}</p>
                <p className="micro">
                  {ciclo === "mensal" ? "por mês" : "por ano"}
                  {ciclo === "anual" && economia > 0 ? ` • economiza ${formatarBRL(economia)}` : ""}
                </p>
                <p>{item.descricao}</p>
                <ul>
                  {item.diferenciais.map((diferencial) => (
                    <li key={diferencial}>{diferencial}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section id="onboarding" className="panel onboarding">
        <div className="section-head">
          <h2>Onboarding do Cliente</h2>
          <p>Fluxo de ativação em minutos para entrada no plano grátis e upgrade posterior.</p>
        </div>
        <form onSubmit={iniciarPlanoGratis} className="onboard-form">
          <label htmlFor="nome">
            Nome
            <input
              id="nome"
              value={onboard.nome}
              onChange={(event) => alterarCampoOnboard("nome", event.target.value)}
              placeholder="Seu nome"
            />
          </label>
          <label htmlFor="email">
            E-mail
            <input
              id="email"
              type="email"
              value={onboard.email}
              onChange={(event) => alterarCampoOnboard("email", event.target.value)}
              placeholder="voce@email.com"
            />
          </label>
          <label htmlFor="meta">
            Meta de disciplina
            <input
              id="meta"
              value={onboard.meta}
              onChange={(event) => alterarCampoOnboard("meta", event.target.value)}
            />
          </label>
          <label htmlFor="vicio">
            Foco anti-vício
            <input
              id="vicio"
              value={onboard.focoVicio}
              onChange={(event) => alterarCampoOnboard("focoVicio", event.target.value)}
            />
          </label>
          <button type="submit" className="btn full">
            Ativar plano grátis
          </button>
        </form>
      </section>

      <section id="dashboard" className="dashboard">
        <div className="section-head">
          <h2>Dashboard do Cliente</h2>
          <p>Gestão diária de disciplina com coach, rotina, vícios e cobrança.</p>
        </div>

        <div className="cards-3 stats-row">
          <article className="panel stat">
            <p>XP total</p>
            <strong>{xpTotal}</strong>
          </article>
          <article className="panel stat">
            <p>Nível atual</p>
            <strong>{nivel}</strong>
          </article>
          <article className="panel stat">
            <p>Streak</p>
            <strong>{streak} dias</strong>
          </article>
        </div>

        <div className="dashboard-grid">
          <article className="panel">
            <h3>Coach do Dia</h3>
            <blockquote>{fraseDoDia}</blockquote>
            <div className="actions">
              <button type="button" className="btn" onClick={gerarCobrancaDiaria}>
                Gerar cobrança diária
              </button>
              <button type="button" className="btn ghost" onClick={finalizarCheckin}>
                Finalizar check-in
              </button>
            </div>
            <p className="coach-msg">
              {mensagemCoach || "Ative o coach para receber sua cobrança e plano de ação de hoje."}
            </p>
          </article>

          <article className="panel">
            <h3>Rotina de Disciplina</h3>
            <ul className="checklist">
              {ROTINA_PADRAO.map((item) => (
                <li key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(rotina[item.id])}
                      onChange={() => alternarRotina(item.id)}
                    />
                    <span>
                      {item.titulo} <small>(+{item.pontos} XP)</small>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="micro">
              Progresso: {progressoRotina.concluidas}/{progressoRotina.total} ({progressoRotina.pct}%)
            </p>
            <div className="progress">
              <div style={{ width: `${progressoRotina.pct}%` }} />
            </div>
          </article>

          <article className="panel">
            <h3>Controle de Vícios</h3>
            <ul className="checklist">
              {GATILHOS.map((item) => (
                <li key={item}>
                  <label>
                    <input
                      type="checkbox"
                      checked={Boolean(gatilhosControlados[item])}
                      onChange={() => alternarGatilho(item)}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="micro">
              Progresso: {progressoVicios.controlados}/{progressoVicios.total} ({progressoVicios.pct}%)
            </p>
            <div className="progress alt">
              <div style={{ width: `${progressoVicios.pct}%` }} />
            </div>
          </article>

          <article className="panel">
            <h3>Cobrança e Checkout</h3>
            <p>
              Plano selecionado: <strong>{plano.nome}</strong> ({ciclo})
            </p>
            <p>
              Total atual: <strong>{formatarBRL(precoAtual)}</strong>
            </p>
            <label htmlFor="pagamento">
              Método de pagamento
              <select
                id="pagamento"
                value={metodoPagamento}
                onChange={(event) => setMetodoPagamento(event.target.value)}
              >
                {METODOS_PAGAMENTO.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div className="payment-chips">
              {METODOS_PAGAMENTO.map((item) => (
                <span key={item} className={item === metodoPagamento ? "chip active" : "chip"}>
                  {item}
                </span>
              ))}
            </div>

            <button type="button" className="btn full" onClick={simularCheckout}>
              {planoGratis ? "Manter no grátis" : "Simular assinatura"}
            </button>
            <p className="micro">
              {planoGratis
                ? "Plano grátis sem cobrança."
                : ciclo === "anual" && economiaAnual > 0
                  ? `Economia no anual: ${formatarBRL(economiaAnual)}`
                  : "Pagamento mensal sem fidelidade."}
            </p>
            <p className="checkout-status">{pedidoStatus || "Nenhuma transação executada ainda."}</p>
          </article>
        </div>

        <article className="panel">
          <h3>Badges de evolução</h3>
          <div className="badge-list">
            {badges.map((badge) => (
              <span key={badge.nome} className={badge.ativo ? "badge on" : "badge"}>
                {badge.nome}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="cards-3 testimonials">
        {DEPOIMENTOS.map((item) => (
          <article key={item.nome} className="panel">
            <p className="quote">“{item.texto}”</p>
            <strong>{item.nome}</strong>
          </article>
        ))}
      </section>

      <section className="panel faq">
        <h2>Perguntas frequentes</h2>
        {FAQ.map((item) => (
          <article key={item.pergunta} className="faq-item">
            <h4>{item.pergunta}</h4>
            <p>{item.resposta}</p>
          </article>
        ))}
      </section>

      <footer className="footer">
        <p>Disciplina+ Coach • Versão comercial pronta para apresentação.</p>
        <p className="micro">
          Aviso: suporte comportamental, não substitui atendimento médico/psicológico profissional.
        </p>
      </footer>
    </main>
  );
}

export default App;