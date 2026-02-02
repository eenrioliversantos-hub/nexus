import { SystemTemplate } from '../../types';

export const nexusHealthBlueprint: SystemTemplate = {
  id: 'healthtech-nexus-health',
  name: '❤️ NexusHealth (Healthtech)',
  category: 'Healthtech',
  description: 'Uma plataforma de telemedicina segura e compatível com LGPD/HIPAA, conectando pacientes e médicos por meio de consultas por vídeo, prontuários eletrônicos e prescrições digitais.',
  icon: '❤️',
  complexity: 'high',
  estimatedDuration: '20-30 semanas',
  tags: ['Healthtech', 'Telemedicina', 'LGPD', 'HIPAA', 'WebRTC'],
  storytelling: {
    context: 'Acesso a cuidados de saúde pode ser difícil e demorado. Pacientes enfrentam longas esperas e deslocamentos, enquanto médicos lutam com a gestão de prontuários em papel e a comunicação ineficiente.',
    problem: 'Falta uma plataforma integrada que ofereça uma experiência de telemedicina segura, desde o agendamento da consulta até a prescrição eletrônica, garantindo a privacidade e a conformidade dos dados de saúde.',
    solution: 'NexusHealth é uma solução ponta a ponta que permite agendamento online, consultas por vídeo seguras (WebRTC), gestão de prontuários eletrônicos centralizados e emissão de prescrições digitais com validade legal.',
    benefits: 'Aumenta o acesso a cuidados de saúde, melhora a eficiência para os médicos, centraliza o histórico do paciente de forma segura e garante conformidade com as mais rigorosas leis de proteção de dados.',
  },
  systemOverview: {
    name: "NexusHealth",
    objective: "Conectar pacientes e médicos de forma segura e eficiente através de uma plataforma completa de telemedicina.",
    targetUsers: "Pacientes, Médicos, Administradores de Clínicas",
    systemType: "web",
    mainFeatures: [
      "Agendamento de consultas online",
      "Consultas por vídeo em tempo real (WebRTC)",
      "Prontuário Eletrônico do Paciente (PEP)",
      "Prescrição digital com assinatura eletrônica",
      "Gestão de agenda para médicos",
      "Pagamento de consultas online",
    ],
    nonFunctionalRequirements: [
      "Conformidade com LGPD e HIPAA",
      "Criptografia de ponta a ponta para todas as comunicações",
      "Auditoria de acesso a dados sensíveis",
      "Alta qualidade de vídeo e áudio",
    ],
    projectScope: "large",
    teamSize: 10,
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
        systemName: 'NexusHealth',
        description: 'Plataforma de telemedicina segura e compatível com LGPD/HIPAA, conectando pacientes e médicos.',
        mainObjective: 'Oferecer uma solução completa e segura para cuidados de saúde remotos.',
        targetAudience: ['Pacientes', 'Médicos', 'Administradores'],
        problemSolved: 'Dificuldade de acesso a saúde, gestão de prontuários ineficiente e falta de segurança em comunicações.',
        businessObjectives: [
            { id: '1', text: 'Realizar 50,000 consultas no primeiro ano.', priority: 'Alta' },
            { id: '2', text: 'Obter certificação de conformidade HIPAA.', priority: 'Alta' },
        ],
        successMetrics: ['Número de usuários ativos', 'Número de transações', 'NPS (Net Promoter Score)'],
      },
      step2: { systemType: 'Web Application', nativeMobile: 'no_pwa' },
      step4: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS'],
        backend: ['Node.js (NestJS)', 'WebRTC Server (Kurento/Janus)'],
        database: ['PostgreSQL', 'Redis'],
      },
      step5: {
        providers: ['E-mail e senha', 'Autenticação de 2 fatores (2FA)', 'Biometria'],
        sessionManagement: 'JWT',
        passwordRecovery: 'both',
      },
      step6: {
        userTypes: [
          { id: '1', name: 'Paciente', description: 'Usuário que busca e realiza consultas médicas.' },
          { id: '2', name: 'Medico', description: 'Profissional de saúde que atende pacientes e gerencia prontuários.' },
          { id: '3', name: 'AdminClinica', description: 'Gerencia médicos e configurações da clínica na plataforma.' },
        ],
      },
      step7: {
        model: 'RBAC',
        permissions: {
          'Paciente': ['agendar_consulta', 'ver_proprio_prontuario', 'ver_prescricoes'],
          'Medico': ['gerenciar_agenda', 'iniciar_consulta_video', 'editar_prontuario_paciente', 'emitir_prescricao'],
          'AdminClinica': ['gerenciar_medicos', 'ver_relatorios_clinica'],
        },
      },
    },
    data_modeling: {
      step8: {
        entities: [
          { id: 'user', name: 'Usuario', description: 'Conta base para Pacientes e Médicos.', fields: [
            { id: 'f1', name: 'email', type: 'String', required: true, unique: true, indexed: true, validations: [] },
            { id: 'f2', name: 'cpf', type: 'String', required: true, unique: true, indexed: true, description: "Criptografado em repouso" },
          ], timestamps: true, softDeletes: true },
          { id: 'patient', name: 'Paciente', description: 'Perfil de paciente, ligado a um usuário.', fields: [
            { id: 'f3', name: 'usuario_id', type: 'UUID', required: true, unique: true, indexed: true, validations: [] },
          ], timestamps: true, softDeletes: false },
          { id: 'doctor', name: 'Medico', description: 'Perfil de médico, ligado a um usuário.', fields: [
            { id: 'f4', name: 'usuario_id', type: 'UUID', required: true, unique: true, indexed: true, validations: [] },
            { id: 'f5', name: 'crm', type: 'String', required: true, unique: true, indexed: true },
            { id: 'f6', name: 'especialidade', type: 'String', required: true, indexed: true },
          ], timestamps: true, softDeletes: false },
          { id: 'appointment', name: 'Consulta', description: 'Um agendamento de consulta entre um paciente e um médico.', fields: [
            { id: 'f7', name: 'paciente_id', type: 'UUID', required: true, indexed: true },
            { id: 'f8', name: 'medico_id', type: 'UUID', required: true, indexed: true },
            { id: 'f9', name: 'data_hora', type: 'DateTime', required: true, indexed: true },
            { id: 'f10', name: 'status', type: 'String', required: true, defaultValue: 'AGENDADA' }, // AGENDADA, REALIZADA, CANCELADA
            { id: 'f11', name: 'webrtc_room_id', type: 'String', required: false },
          ], timestamps: true, softDeletes: false },
          { id: 'medical_record', name: 'ProntuarioMedico', description: 'Registro de informações de saúde de um paciente.', fields: [
            { id: 'f12', name: 'paciente_id', type: 'UUID', required: true, indexed: true },
            { id: 'f13', name: 'consulta_id', type: 'UUID', required: true, indexed: true },
            { id: 'f14', name: 'anotacoes_criptografadas', type: 'Text', required: true },
          ], timestamps: true, softDeletes: false },
          { id: 'prescription', name: 'Prescricao', description: 'Prescrição médica digital emitida por um médico.', fields: [
            { id: 'f15', name: 'consulta_id', type: 'UUID', required: true, indexed: true },
            { id: 'f16', name: 'conteudo_criptografado', type: 'Text', required: true },
            { id: 'f17', name: 'assinatura_digital', type: 'String', required: true },
          ], timestamps: true, softDeletes: false },
        ]
      },
      step10: {
        relationships: [
          { id: 'r1', fromEntityId: 'patient', toEntityId: 'user', type: '1:1', onDelete: 'Cascade' },
          { id: 'r2', fromEntityId: 'doctor', toEntityId: 'user', type: '1:1', onDelete: 'Cascade' },
          { id: 'r3', fromEntityId: 'appointment', toEntityId: 'patient', type: '1:N', onDelete: 'Restrict' },
          { id: 'r4', fromEntityId: 'appointment', toEntityId: 'doctor', type: '1:N', onDelete: 'Restrict' },
          { id: 'r5', fromEntityId: 'medical_record', toEntityId: 'appointment', type: '1:1', onDelete: 'Restrict' },
          { id: 'r6', fromEntityId: 'prescription', toEntityId: 'appointment', type: '1:N', onDelete: 'Restrict' },
        ]
      },
      step13: {
        endpoints: [
          { id: 'ep1', method: 'POST', path: '/api/v1/appointments', description: 'Agenda uma nova consulta.', authRequired: true },
          { id: 'ep2', method: 'GET', path: '/api/v1/patients/{id}/medical-records', description: 'Lista o histórico de prontuários de um paciente (acesso restrito).', authRequired: true },
          { id: 'ep3', method: 'POST', path: '/api/v1/appointments/{id}/start-session', description: 'Inicia uma sessão de vídeo e retorna token de acesso ao WebRTC.', authRequired: true },
        ]
      },
      step14: {
        integrations: [
          { id: 'int1', service: 'Stripe', type: 'Payment', direction: 'Outbound', purpose: 'Processar pagamento de consultas.' },
          { id: 'int2', service: 'ICP-Brasil', type: 'Digital Signature', direction: 'Outbound', purpose: 'Validar assinatura digital em prescrições.' },
        ]
      }
    },
    tech_reqs: {
        step25: {
            https: true,
            corsOrigins: 'https://app.nexushealth.com',
            rateLimiting: true,
            vulnerabilities: ["Cross-Site Scripting (XSS) Protection", "Cross-Site Request Forgery (CSRF) Protection", "SQL Injection Protection"],
            csp: true,
            sensitiveData: ["Senhas", "Dados de saúde", "CPF/CNPJ"],
            compliance: ["LGPD (Brasil)", "HIPAA (Saúde - EUA)"],
        },
        step26: {
            levels: ["Unitários", "De Integração", "E2E (ponta a ponta)"],
            unitFramework: "Vitest",
            e2eFramework: "Playwright",
            coverageTarget: 95,
            documentation: ["Documentação da API", "Manual do usuário", "Guia de conformidade"],
        },
    },
  },
};
