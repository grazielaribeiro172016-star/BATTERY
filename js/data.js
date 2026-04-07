/* ═══════════════════════════════════════════
   data.js — Definição de baterias, níveis e conquistas
═══════════════════════════════════════════ */

const BATTERIES = [
  { id:'ingles',        name:'Inglês',                icon:'💬', lessons:[
    'Aprender "Hello"','Verbo To Be','Saudações básicas','Números 1–10','Cores em inglês',
    'Frases do dia a dia','Presente simples','Perguntas básicas','Phrasal Verbs essenciais','Conversação fluente'
  ]},
  { id:'vendas',        name:'Vendas',                icon:'💰', lessons:[
    'O que é valor percebido','Rapport com o cliente','Técnica SPIN Selling','Superar objeções',
    'Fechamento consultivo','Follow-up estratégico','Proposta de valor','Venda por ancoragem',
    'Gatilhos mentais','Fidelização de clientes'
  ]},
  { id:'comunicacao',   name:'Comunicação',           icon:'🎙️', lessons:[
    'Escuta ativa','Linguagem corporal','Tom de voz','Comunicação não-violenta',
    'Storytelling pessoal','Falar em público','Feedback construtivo','Comunicação assertiva',
    'Influência & persuasão','Comunicação executiva'
  ]},
  { id:'lideranca',     name:'Liderança',             icon:'🦁', lessons:[
    'O que é liderar','Tipos de liderança','Delegação eficaz','Dar e receber feedback',
    'Gestão de conflitos','Visão estratégica','Motivar equipes','Decisão sob pressão',
    'Cultura de alta performance','Liderança servidora'
  ]},
  { id:'marketing',     name:'Marketing',             icon:'📣', lessons:[
    'Fundamentos de branding','Persona e ICP','Funil de vendas','Marketing de conteúdo',
    'SEO básico','Tráfego pago','E-mail marketing','Métricas essenciais',
    'Growth hacking','Posicionamento de marca'
  ]},
  { id:'financas',      name:'Finanças',              icon:'📈', lessons:[
    'Fluxo de caixa','Orçamento pessoal','Controle de gastos','Reserva de emergência',
    'Tipos de investimento','Renda variável x fixa','Imposto de renda','Crédito inteligente',
    'Independência financeira','Mentalidade de investidor'
  ]},
  { id:'produtividade', name:'Produtividade',         icon:'⚡', lessons:[
    'Método GTD','Deep Work','Técnica Pomodoro','Priorização (matriz Eisenhower)',
    'Eliminar distrações','Gestão de energia','Rotina de alta performance','Síndrome do impostor',
    'Automação de tarefas','Review semanal'
  ]},
  { id:'emocional',     name:'Inteligência Emocional',icon:'🧠', lessons:[
    'O que é IE','Autoconhecimento','Autogestão emocional','Empatia',
    'Gestão de relacionamentos','Controle do estresse','Resiliência','Mindfulness',
    'Comunicação emocional','Equilíbrio mente-corpo'
  ]},
  { id:'programacao',   name:'Programação',           icon:'💻', lessons:[
    'Lógica de programação','Variáveis e tipos','Condicionais (if/else)','Laços (for, while)',
    'Funções','Arrays e objetos','HTML & CSS básico','JavaScript essencial',
    'Git & GitHub','APIs REST'
  ]},
  { id:'saude',         name:'Saúde',                 icon:'💪', lessons:[
    'Hábitos fundamentais','Sono de qualidade','Hidratação','Alimentação anti-inflamatória',
    'Exercício e cognição','Gestão do estresse','Meditação prática','Postura e ergonomia',
    'Check-ups essenciais','Longevidade ativa'
  ]},
  { id:'negociacao',    name:'Negociação',            icon:'🤝', lessons:[
    'BATNA: sua alternativa','Barganha colaborativa','Ancoragem de valor','Silêncio estratégico',
    'Concessões inteligentes','Negociação por interesses','Leitura do outro lado','Timing ideal',
    'Fechar acordos win-win','Negociação em grupo'
  ]},
  { id:'empreend',      name:'Empreendedorismo',      icon:'🚀', lessons:[
    'Validação de ideia','MVP enxuto','Business Model Canvas','Product Market Fit',
    'Precificação estratégica','Captação de clientes','Pitch eficaz','Métricas de startup',
    'Escalar o negócio','Cultura e time'
  ]},
];

const LEVELS = [
  {min:0,    name:'LEVEL 1 SPARK'},
  {min:100,  name:'LEVEL 2 IGNITE'},
  {min:250,  name:'LEVEL 3 WIRE'},
  {min:500,  name:'LEVEL 4 CHARGE'},
  {min:800,  name:'LEVEL 5 VOLTAGE'},
  {min:1200, name:'LEVEL 6 CURRENT'},
  {min:1700, name:'LEVEL 7 HUMAN'},
  {min:2300, name:'LEVEL 8 POWER'},
  {min:3000, name:'LEVEL 9 SURGE'},
  {min:4000, name:'LEVEL 10 MASTERMIND'},
];

const BADGES_DEF = [
  {id:'first_charge',  name:'1ª Carga',      emoji:'⚡', cond: s => s.totalLessons >= 1},
  {id:'streak_7',      name:'7 dias',         emoji:'🔥', cond: s => s.streak >= 7},
  {id:'streak_30',     name:'30 dias',        emoji:'💎', cond: s => s.streak >= 30},
  {id:'lessons_10',    name:'10 habilidades', emoji:'🌟', cond: s => s.totalLessons >= 10},
  {id:'lessons_50',    name:'50 habilidades', emoji:'🏹', cond: s => s.totalLessons >= 50},
  {id:'lessons_100',   name:'100 habilidades',emoji:'👑', cond: s => s.totalLessons >= 100},
  {id:'bat_full',      name:'Bateria 100%',   emoji:'🔋', cond: s => s.fullBatteries >= 1},
  {id:'bat_5',         name:'5 baterias',     emoji:'🚀', cond: s => s.activeBatteries >= 5},
];
