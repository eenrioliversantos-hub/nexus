import { SystemTemplate } from '../../types';

export const quantumInvestBlueprint: SystemTemplate = {
  id: 'fintech-quantum-invest',
  name: '📈 QuantumInvest (Fintech)',
  category: 'Fintech',
  description: 'Uma plataforma de investimentos de alta performance para análise de mercado, negociação de ativos e gestão de portfólios, com foco em dados em tempo real e segurança.',
  icon: '📈',
  complexity: 'high',
  estimatedDuration: '16-24 semanas',
  tags: ['Fintech', 'Investimentos', 'Kafka', 'Tempo Real', 'Segurança'],
  storytelling: {
    context: 'Em um mercado financeiro cada vez mais rápido e orientado por dados, investidores e analistas precisam de ferramentas que ofereçam informações em tempo real e execução de ordens com baixa latência.',
    problem: 'Plataformas de investimento atuais são ou muito complexas para investidores casuais ou carecem de ferramentas analíticas poderosas para traders profissionais. A latência na atualização de dados pode levar a perdas financeiras.',
    solution: 'QuantumInvest é uma plataforma unificada que oferece uma interface intuitiva para novos investidores e um conjunto robusto de ferramentas analíticas para profissionais, tudo alimentado por uma arquitetura de streaming de eventos em tempo real para dados de mercado.',
    benefits: 'Democratiza o acesso a ferramentas de investimento avançadas, reduz a latência na tomada de decisão e fornece uma plataforma segura e escalável para gestão de portfólios.',
  },
  systemOverview: {
    name: "QuantumInvest",
    objective: "Fornecer uma plataforma de investimentos segura e de baixa latência com ferramentas analíticas avançadas e dados de mercado em tempo real.",
    targetUsers: "Investidores Individuais, Analistas Financeiros, Gestores de Portfólio",
    systemType: "web",
    mainFeatures: [
      "Dashboard de mercado em tempo real",
      "Negociação de múltiplos tipos de ativos (Ações, Cripto)",
      "Criação e gestão de múltiplos portfólios",
      "Ferramentas de análise técnica e fundamentalista",
      "Relatórios de performance do portfólio",
      "Alertas de preço e notícias",
    ],
    nonFunctionalRequirements: [
      "Latência de ponta a ponta inferior a 500ms para dados de mercado",
      "Segurança de nível bancário com 2FA",
      "Conformidade com regulamentações do Bacen/CVM",
      "Alta disponibilidade (99.99% uptime)",
    ],
    projectScope: "large",
    teamSize: 12,
  },
  userProfiles: [],
  entities: [],
  useCases: [],
  technologyStack: {
    frontend: [],
    backend: [],
    database: [],
    devops: [],
  },
  wizardData: {
    planning: {
      step1: {
        systemName: 'QuantumInvest',
        description: 'Uma plataforma de investimentos de alta performance para análise de mercado, negociação de ativos e gestão de portfólios, com foco em dados em tempo real e segurança.',
        mainObjective: 'Fornecer uma plataforma de investimentos segura e de baixa latência com ferramentas analíticas avançadas e dados de mercado em tempo real.',
        targetAudience: ['Investidores', 'Analistas', 'Gestores'],
        problemSolved: 'Plataformas atuais são lentas ou complexas. QuantumInvest unifica a experiência para todos os perfis com dados em tempo real.',
        businessObjectives: [
            { id: '1', text: 'Alcançar 10,000 usuários ativos nos primeiros 6 meses.', priority: 'Alta' },
            { id: '2', text: 'Processar 1 milhão de transações no primeiro ano.', priority: 'Alta' },
            { id: '3', text: 'Manter a latência de dados abaixo de 500ms.', priority: 'Alta' },
        ],
        successMetrics: ['Número de usuários ativos', 'Número de transações', 'Receita recorrente (MRR/ARR)'],
      },
      step2: {
        systemType: 'Hybrid',
        nativeMobile: 'no_pwa',
        mobileFeatures: ['Push notifications', 'Funcionar offline'],
      },
      step4: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js (NestJS)', 'Go', 'Kafka'],
        database: ['PostgreSQL', 'Redis', 'TimescaleDB'],
      },
      step5: {
        providers: ['E-mail e senha', 'Autenticação de 2 fatores (2FA)', 'SSO (Single Sign-On)'],
        sessionManagement: 'JWT',
        passwordRecovery: 'email',
      },
      step6: {
        userTypes: [
          { id: '1', name: 'Investidor', description: 'Usuário final que gerencia seu próprio portfólio e executa transações.' },
          { id: '2', name: 'Analista', description: 'Usuário profissional que cria análises de mercado e recomendações.' },
          { id: '3', name: 'Admin', description: 'Gerencia a plataforma, usuários e configurações de segurança.' },
        ],
      },
      step7: {
        model: 'RBAC',
        permissions: {
          'Investidor': ['visualizar_mercado', 'criar_transacao', 'visualizar_proprio_portfolio'],
          'Analista': ['visualizar_mercado', 'criar_analise', 'publicar_relatorio'],
          'Admin': ['gerenciar_usuarios', 'gerenciar_ativos', 'ver_logs_sistema'],
        },
      },
    },
    data_modeling: {
      step8: {
        entities: [
          { id: 'user', name: 'Usuario', description: 'Representa um usuário da plataforma (Investidor, Analista, etc).', fields: [
            { id: 'f1', name: 'nome', type: 'String', required: true, unique: false, indexed: false, validations: [] },
            { id: 'f2', name: 'email', type: 'String', required: true, unique: true, indexed: true, validations: [{id: 'v1', type: 'email', value: '', message: 'Email inválido'}] },
            { id: 'f3', name: 'senha_hash', type: 'String', required: true, unique: false, indexed: false, validations: [] },
            { id: 'f4', name: 'tipo_perfil', type: 'String', required: true, unique: false, indexed: true, validations: [] }, // 'INVESTIDOR', 'ANALISTA'
          ], timestamps: true, softDeletes: true },
          { id: 'asset', name: 'Ativo', description: 'Representa um ativo financeiro negociável (Ação, Cripto).', fields: [
            { id: 'f5', name: 'ticker', type: 'String', required: true, unique: true, indexed: true, validations: [] },
            { id: 'f6', name: 'nome_empresa', type: 'String', required: true, unique: false, indexed: false, validations: [] },
            { id: 'f7', name: 'tipo_ativo', type: 'String', required: true, unique: false, indexed: true, validations: [] }, // 'ACAO', 'CRIPTO'
            { id: 'f8', name: 'preco_atual', type: 'Float', required: true, unique: false, indexed: false, validations: [] },
          ], timestamps: true, softDeletes: false },
          { id: 'portfolio', name: 'Portfolio', description: 'Uma coleção de ativos pertencente a um usuário.', fields: [
            { id: 'f9', name: 'usuario_id', type: 'UUID', required: true, unique: false, indexed: true, validations: [] },
            { id: 'f10', name: 'nome_portfolio', type: 'String', required: true, unique: false, indexed: false, validations: [] },
            { id: 'f11', name: 'valor_total', type: 'Float', required: true, defaultValue: '0', unique: false, indexed: false, validations: [] },
          ], timestamps: true, softDeletes: false },
          { id: 'transaction', name: 'Transacao', description: 'Registra uma operação de compra ou venda de um ativo.', fields: [
            { id: 'f12', name: 'portfolio_id', type: 'UUID', required: true, unique: false, indexed: true, validations: [] },
            { id: 'f13', name: 'ativo_id', type: 'UUID', required: true, unique: false, indexed: true, validations: [] },
            { id: 'f14', name: 'tipo_transacao', type: 'String', required: true, unique: false, indexed: false, validations: [] }, // 'COMPRA', 'VENDA'
            { id: 'f15', name: 'quantidade', type: 'Float', required: true, unique: false, indexed: false, validations: [] },
            { id: 'f16', name: 'preco_execucao', type: 'Float', required: true, unique: false, indexed: false, validations: [] },
            { id: 'f17', name: 'data_execucao', type: 'DateTime', required: true, unique: false, indexed: false, validations: [] },
          ], timestamps: true, softDeletes: false },
        ]
      },
      step10: {
        relationships: [
          { id: 'r1', fromEntityId: 'portfolio', toEntityId: 'user', type: '1:N', onDelete: 'Cascade' },
          { id: 'r2', fromEntityId: 'transaction', toEntityId: 'portfolio', type: '1:N', onDelete: 'Cascade' },
          { id: 'r3', fromEntityId: 'transaction', toEntityId: 'asset', type: '1:N', onDelete: 'Restrict' },
        ]
      },
      step12: {
        rules: [
            { id: 'br1', rule: 'Um usuário não pode vender um ativo que não possui em seu portfólio.', category: 'Validation', trigger: 'Antes de criar uma transação de venda', priority: 'High' },
            { id: 'br2', rule: 'Transações só podem ser executadas durante o horário de funcionamento do mercado para ações.', category: 'Workflow', trigger: 'Ao processar uma transação de Ação', priority: 'High' },
        ]
      },
      step13: {
        endpoints: [
          { id: 'ep1', method: 'GET', path: '/api/v1/assets', description: 'Lista todos os ativos disponíveis.', authRequired: true },
          { id: 'ep2', method: 'GET', path: '/api/v1/assets/{id}/market-data', description: 'Retorna dados de mercado em tempo real para um ativo.', authRequired: true },
          { id: 'ep3', method: 'POST', path: '/api/v1/portfolios/{id}/transactions', description: 'Cria uma nova transação (compra/venda) para um portfólio.', authRequired: true },
        ]
      },
      step14: {
        integrations: [
          { id: 'int1', service: 'B3', type: 'Market Data', direction: 'Inbound', purpose: 'Receber cotações de ações em tempo real.' },
          { id: 'int2', service: 'Plaid', type: 'Financial', direction: 'Outbound', purpose: 'Conectar contas bancárias dos usuários para depósitos.' },
          { id: 'int3', service: 'Kafka', type: 'Messaging', direction: 'Inbound', purpose: 'Consumir eventos de atualização de preços do broker de dados.' },
        ]
      }
    },
    tech_reqs: {
        step25: {
            https: true,
            corsOrigins: 'https://app.quantuminvest.com',
            rateLimiting: true,
            vulnerabilities: ["Cross-Site Scripting (XSS) Protection", "Cross-Site Request Forgery (CSRF) Protection", "SQL Injection Protection"],
            csp: true,
            sensitiveData: ["Senhas", "Dados bancários", "CPF/CNPJ"],
            compliance: ["LGPD (Brasil)"],
        },
        step26: {
            levels: ["Unitários", "De Integração", "E2E (ponta a ponta)", "De Carga"],
            unitFramework: "Jest",
            e2eFramework: "Cypress",
            coverageTarget: 90,
            documentation: ["Documentação da API", "Diagramas de arquitetura"],
        },
    },
    deploy: {
        hostingProvider: "AWS (Amplify, ECS)",
        deploymentStrategy: "Canary",
        ciCdSteps: ["Linting", "Unit Tests", "Integration Tests", "Build Application", "Containerize", "Deploy to Staging", "E2E Tests", "Deploy to Production"],
        containerization: "Docker",
        orchestration: "Kubernetes (EKS, GKE)",
        iacTool: "Terraform",
        databaseProvider: "AWS RDS",
        backupFrequency: "Diário",
        loggingTool: "Datadog",
    }
  },
};
