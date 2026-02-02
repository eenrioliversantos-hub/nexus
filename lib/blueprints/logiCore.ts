import { SystemTemplate } from '../../types';

export const logiCoreBlueprint: SystemTemplate = {
  id: 'logistics-logicore',
  name: '🚚 LogiCore (Logística)',
  category: 'Logistics',
  description: 'Uma plataforma de gerenciamento de cadeia de suprimentos (SCM) para otimização de rotas, rastreamento de remessas em tempo real e gestão de frota.',
  icon: '🚚',
  complexity: 'high',
  estimatedDuration: '18-26 semanas',
  tags: ['Logística', 'SCM', 'Rastreamento', 'PostGIS', 'Tempo Real'],
  storytelling: {
    context: 'Empresas de logística enfrentam altos custos operacionais, ineficiência nas rotas e falta de visibilidade sobre o status das entregas, resultando em clientes insatisfeitos e prejuízos.',
    problem: 'A falta de uma plataforma centralizada para planejar rotas otimizadas, rastrear motoristas em tempo real e comunicar-se com os clientes cria um gargalo operacional complexo e caro.',
    solution: 'LogiCore é uma SCM que usa algoritmos de otimização de rota, rastreamento por GPS em tempo real e um portal do cliente para fornecer visibilidade total da cadeia de suprimentos, desde a coleta até a entrega.',
    benefits: 'Reduz custos com combustível, melhora o tempo de entrega, aumenta a satisfação do cliente com rastreamento transparente e otimiza a utilização da frota.',
  },
  systemOverview: {
    name: "LogiCore",
    objective: "Otimizar a cadeia de suprimentos através de planejamento de rotas inteligente e rastreamento de remessas em tempo real.",
    targetUsers: "Operadores de Logística, Motoristas, Clientes Finais",
    systemType: "web",
    mainFeatures: [
      "Criação e gestão de remessas (coleta/entrega)",
      "Otimização de rotas com múltiplos pontos",
      "Rastreamento de motoristas via app mobile em tempo real",
      "Painel de controle para operadores logísticos",
      "Portal do cliente para rastreamento de entrega",
      "Comprovação de entrega com assinatura digital",
    ],
    nonFunctionalRequirements: [
      "Alta precisão de geolocalização (< 10 metros)",
      "Processamento de milhares de atualizações de localização por minuto",
      "Cálculo de rotas complexas em menos de 30 segundos",
      "Disponibilidade de 99.95% para o serviço de rastreamento",
    ],
    projectScope: "large",
    teamSize: 8,
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
        systemName: 'LogiCore',
        description: 'Plataforma de gerenciamento de cadeia de suprimentos (SCM) para otimização de rotas e rastreamento de remessas em tempo real.',
        mainObjective: 'Otimizar a cadeia de suprimentos através de planejamento de rota inteligente e rastreamento em tempo real.',
        targetAudience: ['Operadores', 'Motoristas', 'Clientes'],
        businessObjectives: [
            { id: '1', text: 'Reduzir o custo de combustível em 15% através da otimização de rotas.', priority: 'Alta' },
            { id: '2', text: 'Aumentar a taxa de entregas no prazo (On-Time Delivery) para 98%.', priority: 'Alta' },
        ],
        successMetrics: ['Taxa de conversão', 'Churn rate'],
      },
      step2: { systemType: 'Hybrid', nativeMobile: 'yes_both' },
      step4: {
        frontend: ['React', 'TypeScript', 'Mapbox GL JS'],
        backend: ['Go', 'Python (FastAPI)', 'gRPC'],
        database: ['PostgreSQL (com PostGIS)', 'Redis'],
      },
      step5: {
        providers: ['E-mail e senha', 'Login social (Google, Facebook, etc.)'],
        sessionManagement: 'JWT',
        passwordRecovery: 'email',
      },
      step6: {
        userTypes: [
          { id: '1', name: 'Operador', description: 'Gerencia remessas, rotas e monitora a frota.' },
          { id: '2', name: 'Motorista', description: 'Usa o app mobile para seguir rotas e atualizar status de entrega.' },
          { id: '3', name: 'Cliente', description: 'Rastreia suas próprias remessas através do portal web.' },
        ],
      },
      step7: {
        model: 'RBAC',
        permissions: {
          'Operador': ['criar_remessa', 'criar_rota', 'associar_motorista', 'ver_dashboard_frota'],
          'Motorista': ['ver_propria_rota', 'atualizar_status_entrega', 'capturar_assinatura'],
          'Cliente': ['rastrear_propria_remessa'],
        },
      },
    },
    data_modeling: {
      step8: {
        entities: [
          { id: 'shipment', name: 'Remessa', description: 'Representa um pacote ou carga a ser transportada.', fields: [
            { id: 'f1', name: 'codigo_rastreio', type: 'String', required: true, unique: true, indexed: true },
            { id: 'f2', name: 'cliente_id', type: 'UUID', required: true, indexed: true },
            { id: 'f3', name: 'origem_endereco', type: 'String', required: true },
            { id: 'f4', name: 'destino_endereco', type: 'String', required: true },
            { id: 'f5', name: 'status', type: 'String', required: true, defaultValue: 'AGUARDANDO_COLETA' }, // ...EM_TRANSITO, ENTREGUE
          ], timestamps: true, softDeletes: true },
          { id: 'driver', name: 'Motorista', description: 'Representa um motorista da frota.', fields: [
            { id: 'f6', name: 'usuario_id', type: 'UUID', required: true, unique: true, indexed: true },
            { id: 'f7', name: 'cnh', type: 'String', required: true, unique: true },
            { id: 'f8', name: 'disponivel', type: 'Boolean', required: true, defaultValue: 'true', indexed: true },
          ], timestamps: true, softDeletes: false },
          { id: 'route', name: 'Rota', description: 'Uma rota planejada para um motorista, contendo múltiplas remessas.', fields: [
            { id: 'f9', name: 'motorista_id', type: 'UUID', required: true, indexed: true },
            { id: 'f10', name: 'data_rota', type: 'Date', required: true },
            { id: 'f11', name: 'pontos_rota_ordenados', type: 'JSON', required: true, description: 'GeoJSON com a sequência de pontos (coletas/entregas)' },
            { id: 'f12', name: 'status', type: 'String', required: true, defaultValue: 'NAO_INICIADA' }, // EM_CURSO, CONCLUIDA
          ], timestamps: true, softDeletes: false },
          { id: 'geolocation', name: 'LogGeolocalizacao', description: 'Um registro de localização de um motorista em um ponto no tempo.', fields: [
            { id: 'f13', name: 'motorista_id', type: 'UUID', required: true, indexed: true },
            { id: 'f14', name: 'coordenada', type: 'String', required: true, description: 'Ponto geográfico (usando PostGIS)' },
            { id: 'f15', name: 'timestamp', type: 'DateTime', required: true, indexed: true },
          ], timestamps: false, softDeletes: false },
        ]
      },
      step10: {
        relationships: [
          { id: 'r1', fromEntityId: 'route', toEntityId: 'driver', type: '1:N', onDelete: 'Set Null' },
          { id: 'r2', fromEntityId: 'geolocation', toEntityId: 'driver', type: '1:N', onDelete: 'Cascade' },
          // A relação Remessa <-> Rota é mais complexa, geralmente N:N através de uma tabela de junção
        ]
      },
      step13: {
        endpoints: [
          { id: 'ep1', method: 'POST', path: '/api/v1/routes/optimize', description: 'Recebe uma lista de remessas e retorna uma rota otimizada.', authRequired: true },
          { id: 'ep2', method: 'POST', path: '/api/v1/drivers/{id}/location', description: 'Recebe e armazena a atualização de geolocalização de um motorista.', authRequired: true },
          { id: 'ep3', method: 'GET', path: '/api/v1/shipments/{trackingCode}', description: 'Permite que um cliente rastreie uma remessa.', authRequired: false },
        ]
      },
      step14: {
        integrations: [
          { id: 'int1', service: 'Mapbox / Google Maps', type: 'Geolocation', direction: 'Outbound', purpose: 'Para cálculo de rotas e geocodificação de endereços.' },
          { id: 'int2', service: 'Twilio', type: 'SMS/Messaging', direction: 'Outbound', purpose: 'Enviar notificações de status da entrega para clientes via SMS.' },
        ]
      }
    },
    tech_reqs: {
        step25: {
            https: true,
            corsOrigins: 'https://app.logicore.com, https://tracking.logicore.com',
            rateLimiting: true,
            vulnerabilities: ["Cross-Site Scripting (XSS) Protection", "SQL Injection Protection"],
            csp: true,
            sensitiveData: ["Senhas", "CPF/CNPJ"],
            compliance: [],
        },
        step26: {
            levels: ["Unitários", "De Integração", "De Carga"],
            unitFramework: "Jest",
            e2eFramework: "Cypress",
            coverageTarget: 85,
            documentation: ["Documentação da API"],
        },
    },
  },
};
