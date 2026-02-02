import { SystemTemplate, UserProfile } from '../types';

export const blogTemplate: SystemTemplate = {
  id: "simple-blog",
  name: "📝 Blog Pessoal Simples",
  description: "Uma estrutura clássica de blog com posts, categorias e comentários. Ideal para portfólios e publicações.",
  icon: "📝",
  category: "publishing",
  complexity: "low",
  estimatedDuration: "2-4 semanas",
  tags: ["Blog", "Conteúdo", "CMS", "Next.js", "Markdown"],
  systemOverview: {
    objective: "Criar um blog rápido e otimizado para SEO para publicar artigos e tutoriais.",
    targetUsers: "Escritores, Desenvolvedores, Criadores de Conteúdo",
    systemType: "web",
    mainFeatures: ["Publicação de posts com Markdown", "Sistema de categorias e tags", "Comentários em posts", "Busca de conteúdo", "Design responsivo"],
    nonFunctionalRequirements: ["Carregamento rápido (Lighthouse > 95)", "SEO otimizado", "Fácil de publicar"],
    projectScope: "small",
    name: "Blog Pessoal Simples",
    teamSize: 1,
  },
  storytelling: { context: "", problem: "", solution: "", benefits: "" },
  userProfiles: [
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-blog-admin', name: "Admin", description: "Gerencia todos os posts, categorias e comentários.", permissions: [], features: [], priority: 'high' },
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-blog-visitor', name: "Visitor", description: "Lê os posts e pode deixar comentários.", permissions: [], features: [], priority: 'medium' },
  ],
  entities: [
    {
      name: "Post",
      fields: [
        { name: "title", type: "string", required: true },
        { name: "slug", type: "string", required: true },
        { name: "content", type: "text", required: true },
        { name: "publishedAt", type: "date", required: false },
        { name: "authorId", type: "foreign_key", required: true },
      ],
      relationships: [
        { type: "N:1", targetEntity: "User", description: "Um post pertence a um autor." },
        { type: "N:N", targetEntity: "Category", description: "Um post pode ter várias categorias." },
      ],
    },
    {
      name: "Category",
      fields: [
        { name: "name", type: "string", required: true },
        { name: "slug", type: "string", required: true },
      ],
      relationships: [],
    },
     {
      name: "Comment",
      fields: [
        { name: "content", type: "text", required: true },
        { name: "authorName", type: "string", required: true },
        { name: "postId", type: "foreign_key", required: true },
      ],
      relationships: [{ type: "N:1", targetEntity: "Post", description: "Um comentário pertence a um post." }],
    },
  ],
  useCases: [],
  technologyStack: {
    frontend: ["Next.js", "Tailwind CSS"],
    backend: ["Next.js API Routes"],
    database: ["PostgreSQL"],
    devops: ["Vercel"],
  },
};

export const projectManagementTemplate: SystemTemplate = {
  id: "project-management-tool",
  name: "🔨 Ferramenta de Gestão de Projetos",
  description: "Um sistema estilo Trello/Jira para gerenciar projetos, quadros, colunas e tarefas.",
  icon: "🔨",
  category: "productivity",
  complexity: "medium",
  estimatedDuration: "6-10 semanas",
  tags: ["Kanban", "Produtividade", "Gestão", "React", "Real-time"],
  systemOverview: {
    objective: "Organizar o fluxo de trabalho de equipes ágeis através de quadros Kanban interativos.",
    targetUsers: "Gerentes de Projeto, Desenvolvedores, Designers",
    systemType: "web",
    mainFeatures: ["Criação de múltiplos projetos e quadros", "Colunas customizáveis", "Tarefas com drag-and-drop", "Atribuição de responsáveis", "Prazos e etiquetas"],
    nonFunctionalRequirements: ["Atualizações em tempo real", "Interface intuitiva", "Histórico de atividades"],
    projectScope: "medium",
    name: "Ferramenta de Gestão de Projetos",
    teamSize: 3,
  },
  storytelling: { context: "", problem: "", solution: "", benefits: "" },
  userProfiles: [
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-pm-admin', name: "Admin", description: "Cria projetos e gerencia membros.", permissions: [], features: [], priority: 'high' },
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-pm-member', name: "Member", description: "Cria e movimenta tarefas dentro dos quadros.", permissions: [], features: [], priority: 'medium' },
  ],
  entities: [
    { name: "Project", fields: [{ name: "name", type: "string", required: true }], relationships: [] },
    { name: "Board", fields: [{ name: "name", type: "string", required: true }, { name: "projectId", type: "foreign_key", required: true }], relationships: [] },
    { name: "Column", fields: [{ name: "title", type: "string", required: true }, { name: "boardId", type: "foreign_key", required: true }, { name: "order", type: "number", required: true }], relationships: [] },
    { name: "Task", fields: [{ name: "title", type: "string", required: true }, { name: "description", type: "text", required: false }, { name: "columnId", type: "foreign_key", required: true }], relationships: [] },
  ],
  useCases: [],
  technologyStack: {
    frontend: ["React (Vite)", "Tailwind CSS"],
    backend: ["Node.js (Express)"],
    database: ["PostgreSQL"],
    devops: ["Docker", "Vercel"],
  },
};

export const ecommerceMultivendorTemplate: SystemTemplate = {
  id: "ecommerce-multivendor-advanced",
  name: "🏪 Marketplace Multvendedor Avançado",
  description:
    "Plataforma completa de e-commerce multvendedor com IA, microserviços, sistema financeiro avançado e logística inteligente.",
  icon: "🏪",
  category: "ecommerce",
  complexity: "high",
  estimatedDuration: "16-24 semanas",
  tags: ["E-commerce", "Marketplace", "IA", "Microserviços", "Fintech"],
  systemOverview: {
    objective:
      "Criar uma plataforma de marketplace multvendedor de alta complexidade que integre inteligência artificial, sistema financeiro avançado, logística inteligente e experiência omnichannel.",
    targetUsers:
      "Vendedores (PMEs e grandes empresas), Compradores (B2B e B2C), Administradores da plataforma, Operadores logísticos",
    systemType: "web",
    mainFeatures: [
      "🤖 IA para recomendações e detecção de fraudes",
      "💳 Gateway de pagamentos com split automático",
      "📦 Sistema logístico inteligente",
      "💬 Chat em tempo real",
      "📊 Analytics avançados com BI integrado",
    ],
    nonFunctionalRequirements: [
      "Suporte a 100.000+ usuários simultâneos",
      "Tempo de resposta < 200ms",
      "Disponibilidade 99.9%",
    ],
    projectScope: "large",
    name: "Marketplace Multvendedor Avançado",
    teamSize: 15,
  },
  storytelling: {
    context:
      "Uma empresa de tecnologia quer criar o próximo grande marketplace do Brasil, competindo com grandes players.",
    problem:
      "Os marketplaces atuais têm limitações em personalização, taxas altas para vendedores e experiência fragmentada.",
    solution:
      "Marketplace de nova geração com IA, sistema financeiro próprio e logística inteligente.",
    benefits:
      "Taxas competitivas, IA para aumentar vendas, logística otimizada e experiência unificada.",
  },
  userProfiles: [
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-ecom-superadmin', name: "Super Administrador", description: "Acesso total ao sistema.", permissions: [], features: [], priority: 'high' },
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-ecom-enterprise', name: "Vendedor Enterprise", description: "Grandes empresas que vendem em volume alto.", permissions: [], features: [], priority: 'high' },
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-ecom-sme', name: "Vendedor PME", description: "Pequenas e médias empresas.", permissions: [], features: [], priority: 'medium' },
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-ecom-b2c', name: "Comprador B2C", description: "Consumidores finais.", permissions: [], features: [], priority: 'medium' },
    // FIX: Add missing 'id' property to UserProfile.
    { id: 'template-ecom-b2b', name: "Comprador B2B", description: "Empresas que compram para revenda ou uso.", permissions: [], features: [], priority: 'medium' },
  ],
  entities: [
    {
      name: "Usuario",
      fields: [
        { name: "email", type: "string", required: true },
        { name: "senha", type: "string", required: true },
        { name: "nome", type: "string", required: true },
        { name: "tipo", type: "enum", required: true, description: "ADMIN, VENDEDOR, COMPRADOR" },
      ],
      relationships: [],
    },
    {
      name: "Vendedor",
      fields: [
        { name: "usuarioId", type: "foreign_key", required: true },
        { name: "nomeFantasia", type: "string", required: true },
        { name: "cnpj", type: "string", required: false },
        { name: "avaliacaoMedia", type: "number", required: true },
      ],
      relationships: [],
    },
    {
      name: "Produto",
      fields: [
        { name: "vendedorId", type: "foreign_key", required: true },
        { name: "nome", type: "string", required: true },
        { name: "preco", type: "number", required: true },
        { name: "estoque", type: "number", required: true },
      ],
      relationships: [],
    },
    {
      name: "Pedido",
      fields: [
        { name: "compradorId", type: "foreign_key", required: true },
        { name: "valorTotal", type: "number", required: true },
        { name: "status", type: "enum", required: true },
      ],
      relationships: [],
    },
    {
      name: "Pagamento",
      fields: [
        { name: "pedidoId", type: "foreign_key", required: true },
        { name: "valor", type: "number", required: true },
        { name: "status", type: "enum", required: true },
      ],
      relationships: [],
    },
  ],
  useCases: [],
  technologyStack: {
    frontend: ["Next.js", "React Native", "TypeScript"],
    backend: ["Node.js", "Java Spring Boot", "Python FastAPI", "Go"],
    database: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
    devops: ["Docker", "Kubernetes", "AWS EKS", "Terraform"],
  },
};


export const ALL_TEMPLATES: SystemTemplate[] = [
    ecommerceMultivendorTemplate,
    projectManagementTemplate,
    blogTemplate,
];