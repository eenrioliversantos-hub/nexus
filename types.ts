// FIX: Removed circular import of 'SystemOverview'.
export interface SystemOverview {
  name: string
  objective: string
  targetUsers: string
  systemType: "web" | "mobile" | "api" | "desktop" | "internal"
  mainFeatures: string[]
  nonFunctionalRequirements: string[]
  projectScope: "small" | "medium" | "large"
  estimatedDuration: string
  teamSize: number
  budget?: string
}

export interface Validation {
    id: string;
    type: string;
    value: string | number;
    message: string;
}

// NEW: Type for User Stories
export interface UserStory {
    id: string;
    asA: string;
    iWantTo: string;
    soThat: string;
}

// NEW: Type for Global State Properties
export interface StateProperty {
    id: string;
    name: string;
    scope: string;
    persistence: 'session' | 'local' | 'none';
    description: string;
}

// NEW: Type for UML-like methods
export interface UmlMethod {
    id: string;
    name: string;
    parameters: string;
    description: string;
}

// NEW: Type for User-Data Interactions (CRUD)
export interface DataInteraction {
    id: string;
    entityId: string;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

// NEW: Type for User Flow steps
export interface UserFlowStep {
    id: string;
    description: string;
}

export interface Entity {
  id: string;
  name: string
  fields: EntityField[]
  relationships: Relationship[]
  description?: string
  businessRules?: string[]
  userInteractions?: UserInteraction[];
  // NEW detailed fields
  lifecycle?: string;
  stateManagement?: 'local' | 'global' | 'server_cache';
  eventsEmitted?: string[];
  indexingStrategy?: string;
  methods?: UmlMethod[]; // UML-like methods for entity
}

export interface EntityField {
  id: string;
  name: string
  type: "string" | "number" | "boolean" | "date" | "text" | "foreign_key" | "enum" | "json"
  required: boolean
  description?: string
  // FIX: validation should be optional.
  validation?: string
  defaultValue?: string
  // Added for detailed modeling
  unique?: boolean;
  indexed?: boolean;
  validations?: Validation[];
}

export interface Relationship {
  type: "1:1" | "1:N" | "N:N" | "N:1"
  targetEntity: string
  description: string
  foreignKey?: string
}

export interface UseCase {
  userType: string
  actions: string[]
  priority: "high" | "medium" | "low"
  complexity: "simple" | "medium" | "complex"
}

export interface BusinessRule {
  rule: string
  description: string
  priority: "high" | "medium" | "low"
  category: "validation" | "calculation" | "workflow" | "security" | "integration"
}

// Detailed User Profile for Planning Tool
export interface UserAttribute {
    id: string;
    name: string;
    type: string;
}
export interface UserAction {
    id: string;
    description: string;
    type: 'create' | 'read' | 'update' | 'delete' | 'other';
    entityIds: string[];
    dataManipulated: string;
}
export interface UserEvent {
    id: string;
    description: string;
}
export interface UserProfile {
  id: string;
  name: string
  description: string
  permissions: string[]
  features: string[]
  priority: "high" | "medium" | "low"
  // Added for detailed modeling
  attributes?: UserAttribute[];
  actions?: UserAction[];
  events?: UserEvent[];
  // NEW detailed fields
  userStories?: UserStory[];
  permissionsScope?: 'own' | 'team' | 'all';
  goals?: string;
  triggers?: string;
  methods?: UmlMethod[]; // UML-like methods
  dataInteractions?: DataInteraction[];
  eventsReceived?: string[];
}

// NEW: Type for defining how users interact with entities
export interface UserInteraction {
    id: string;
    userProfileId: string;
    description: string;
}

// NEW: Type for structured data flow
export interface DataFlowItem {
    id: string;
    source: string;
    destination: string;
    trigger: string;
    payload: string;
    // NEW detailed fields
    description?: string;
    frequency?: 'real-time' | 'batch' | 'on-demand';
}


export interface TechnologyChoice {
  category: "frontend" | "backend" | "database" | "devops" | "testing" | "monitoring"
  technology: string
  version?: string
  justification: string
  alternatives?: string[]
  experience: "expert" | "intermediate" | "beginner"
}

export interface ProjectMilestone {
  id: string
  name: string
  description: string
  version: string
  deliverables: string[]
  estimatedDate: string
  dependencies: string[]
  criticalPath: boolean
}

export interface CommitPlan {
  id: string
  taskId: string
  message: string
  files: string[]
  type: "feat" | "fix" | "docs" | "style" | "refactor" | "test" | "chore"
  estimatedDate: string
  branch: string
}

export interface VersioningStrategy {
  strategy: "semantic" | "calendar" | "custom"
  majorVersion: number
  minorVersion: number
  patchVersion: number
  preRelease?: string
  buildMetadata?: string
  releaseNotes: string[]
}

// Novas interfaces para as etapas expandidas
export interface SystemEvent {
  id: string
  name: string
  description: string
  type: "user_action" | "system_trigger" | "external_api" | "scheduled" | "webhook"
  trigger: string
  payload: EventPayload[]
  handlers: EventHandler[]
  priority: "high" | "medium" | "low"
  async: boolean
  retryPolicy?: RetryPolicy
  deadLetterQueue?: boolean
}

export interface EventPayload {
  field: string
  type: string
  required: boolean
  description: string
  validation?: string
}

export interface EventHandler {
  id: string
  name: string
  description: string
  action: string
  conditions: string[]
  sideEffects: string[]
  errorHandling: string
}

export interface RetryPolicy {
  maxAttempts: number
  backoffStrategy: "linear" | "exponential" | "fixed"
  delayMs: number
  maxDelayMs?: number
}

export interface Automation {
  id: string
  name: string
  description: string
  type: "workflow" | "rule_engine" | "scheduled_task" | "trigger_based"
  trigger: AutomationTrigger
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  schedule?: ScheduleConfig
  enabled: boolean
  priority: "high" | "medium" | "low"
}

export interface AutomationTrigger {
  type: "event" | "schedule" | "condition" | "manual"
  eventName?: string
  schedule?: string
  condition?: string
  description: string
}

export interface AutomationCondition {
  field: string
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "exists"
  value: string
  description: string
}

export interface AutomationAction {
  type: "send_email" | "update_record" | "call_api" | "create_notification" | "run_script"
  config: Record<string, any>
  description: string
  order: number
}

export interface ScheduleConfig {
  type: "cron" | "interval" | "once"
  expression: string
  timezone: string
  startDate?: string
  endDate?: string
}

export interface BackgroundJob {
  id: string
  name: string
  description: string
  type: "data_processing" | "file_upload" | "email_sending" | "report_generation" | "cleanup" | "sync"
  priority: "high" | "medium" | "low"
  schedule?: ScheduleConfig
  timeout: number
  retryPolicy: RetryPolicy
  resources: JobResources
  monitoring: JobMonitoring
}

export interface JobResources {
  memory: string
  cpu: string
  storage?: string
  concurrency: number
}

export interface JobMonitoring {
  logging: boolean
  metrics: string[]
  alerts: JobAlert[]
  healthCheck?: string
}

export interface JobAlert {
  condition: string
  action: string
  recipients: string[]
}

export interface NotificationSystem {
  id: string
  name: string
  description: string
  channels: NotificationChannel[]
  templates: NotificationTemplate[]
  rules: NotificationRule[]
  preferences: NotificationPreferences
}

export interface NotificationChannel {
  type: "email" | "sms" | "push" | "in_app" | "webhook" | "slack"
  provider: string
  config: Record<string, any>
  enabled: boolean
  fallback?: string
}

export interface NotificationTemplate {
  id: string
  name: string
  channel: string
  subject?: string
  content: string
  variables: TemplateVariable[]
  localization?: Record<string, string>
}

export interface TemplateVariable {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
}

export interface NotificationRule {
  id: string
  name: string
  trigger: string
  conditions: string[]
  channels: string[]
  template: string
  priority: "high" | "medium" | "low"
  throttling?: ThrottlingConfig
}

export interface ThrottlingConfig {
  maxPerMinute: number
  maxPerHour: number
  maxPerDay: number
}

export interface NotificationPreferences {
  defaultChannel: string
  userOptOut: boolean
  quietHours: QuietHours
  grouping: boolean
}

export interface QuietHours {
  enabled: boolean
  startTime: string
  endTime: string
  timezone: string
}

export interface CacheStrategy {
  id: string
  name: string
  description: string
  type: "memory" | "redis" | "database" | "cdn" | "hybrid"
  layers: CacheLayer[]
  policies: CachePolicy[]
  invalidation: InvalidationStrategy
  monitoring: CacheMonitoring
}

export interface CacheLayer {
  name: string
  type: string
  ttl: number
  maxSize?: string
  evictionPolicy: "lru" | "lfu" | "fifo" | "ttl"
  compression?: boolean
}

export interface CachePolicy {
  pattern: string
  ttl: number
  tags: string[]
  conditions: string[]
  priority: "high" | "medium" | "low"
}

export interface InvalidationStrategy {
  type: "time_based" | "event_based" | "manual" | "hybrid"
  triggers: string[]
  cascading: boolean
  batchSize?: number
}

export interface CacheMonitoring {
  hitRatio: boolean
  performance: boolean
  memory: boolean
  alerts: CacheAlert[]
}

export interface CacheAlert {
  metric: string
  threshold: number
  action: string
}

export interface QueueSystem {
  id: string
  name: string
  description: string
  type: "fifo" | "priority" | "delay" | "pub_sub" | "work_queue"
  queues: Queue[]
  deadLetterQueue: DeadLetterQueue
  monitoring: QueueMonitoring
  scaling: QueueScaling
}

export interface Queue {
  name: string
  type: string
  priority?: number
  maxRetries: number
  visibility: number
  batchSize: number
  consumers: QueueConsumer[]
}

export interface QueueConsumer {
  name: string
  concurrency: number
  timeout: number
  errorHandling: string
  scaling: ConsumerScaling
}

export interface ConsumerScaling {
  minInstances: number
  maxInstances: number
  targetUtilization: number
  scaleUpCooldown: number
  scaleDownCooldown: number
}

export interface DeadLetterQueue {
  enabled: boolean
  maxReceiveCount: number
  retention: number
  alerting: boolean
}

export interface QueueMonitoring {
  metrics: string[]
  dashboards: string[]
  alerts: QueueAlert[]
  logging: boolean
}

export interface QueueAlert {
  metric: string
  threshold: number
  duration: number
  action: string
  recipients: string[]
}

export interface QueueScaling {
  enabled: boolean
  minCapacity: number
  maxCapacity: number
  targetUtilization: number
  scaleUpCooldown: number
  scaleDownCooldown: number
}

export interface LoggingSystem {
  id: string
  name: string
  description: string
  levels: LogLevel[]
  appenders: LogAppender[]
  formatters: LogFormatter[]
  retention: RetentionPolicy
  aggregation: LogAggregation
  alerting: LogAlerting
}

export interface LogLevel {
  name: string
  priority: number
  color?: string
  enabled: boolean
}

export interface LogAppender {
  name: string
  type: "console" | "file" | "database" | "external" | "stream"
  config: Record<string, any>
  filters: LogFilter[]
  async: boolean
}

export interface LogFilter {
  field: string
  operator: string
  value: string
  action: "include" | "exclude"
}

export interface LogFormatter {
  name: string
  pattern: string
  timestamp: boolean
  structured: boolean
  fields: string[]
}

export interface RetentionPolicy {
  duration: number
  unit: "days" | "weeks" | "months"
  compression: boolean
  archiving: boolean
  deletion: boolean
}

export interface LogAggregation {
  enabled: boolean
  interval: number
  metrics: string[]
  groupBy: string[]
  storage: string
}

export interface LogAlerting {
  enabled: boolean
  rules: LogAlertRule[]
  channels: string[]
  throttling: ThrottlingConfig
}

export interface LogAlertRule {
  name: string
  condition: string
  threshold: number
  duration: number
  severity: "critical" | "warning" | "info"
}

export interface MonitoringSystem {
  id: string
  name: string
  description: string
  metrics: MetricDefinition[]
  dashboards: Dashboard[]
  alerts: AlertRule[]
  healthChecks: HealthCheck[]
  tracing: TracingConfig
  profiling: ProfilingConfig
}

export interface MetricDefinition {
  name: string
  type: "counter" | "gauge" | "histogram" | "summary"
  description: string
  labels: string[]
  unit?: string
  aggregation: string[]
}

export interface Dashboard {
  name: string
  description: string
  panels: DashboardPanel[]
  refresh: number
  timeRange: string
  variables: DashboardVariable[]
}

export interface DashboardPanel {
  title: string
  type: "graph" | "table" | "stat" | "gauge" | "heatmap"
  query: string
  visualization: Record<string, any>
  position: PanelPosition
}

export interface PanelPosition {
  x: number
  y: number
  width: number
  height: number
}

export interface DashboardVariable {
  name: string
  type: "query" | "constant" | "interval"
  query?: string
  value?: string
  multiValue: boolean
}

export interface AlertRule {
  name: string
  description: string
  query: string
  condition: string
  threshold: number
  duration: number
  severity: "critical" | "warning" | "info"
  channels: string[]
  annotations: Record<string, string>
}

export interface HealthCheck {
  name: string
  endpoint: string
  method: string
  timeout: number
  interval: number
  retries: number
  expectedStatus: number[]
  expectedContent?: string
}

export interface TracingConfig {
  enabled: boolean
  samplingRate: number
  exporters: TracingExporter[]
  instrumentation: string[]
}

export interface TracingExporter {
  type: "jaeger" | "zipkin" | "otlp"
  endpoint: string
  config: Record<string, any>
}

export interface ProfilingConfig {
  enabled: boolean
  types: string[]
  samplingRate: number
  storage: string
  retention: number
}

export interface WebhookConfiguration {
  id: string
  name: string
  description: string
  url: string
  method: "POST" | "PUT" | "PATCH"
  headers: Record<string, string>
  authentication: WebhookAuth
  events: string[]
  payload: WebhookPayload
  retry: RetryPolicy
  security: WebhookSecurity
  monitoring: WebhookMonitoring
}

export interface WebhookAuth {
  type: "none" | "basic" | "bearer" | "api_key" | "oauth2" | "signature"
  config: Record<string, any>
}

export interface WebhookPayload {
  format: "json" | "xml" | "form"
  template?: string
  fields: PayloadField[]
  transformation?: string
}

export interface PayloadField {
  name: string
  source: string
  type: string
  required: boolean
  transformation?: string
}

export interface WebhookSecurity {
  encryption: boolean
  signature: boolean
  ipWhitelist: string[]
  rateLimit: RateLimit
}

export interface RateLimit {
  requests: number
  window: number
  unit: "second" | "minute" | "hour"
}

export interface WebhookMonitoring {
  logging: boolean
  metrics: string[]
  alerts: WebhookAlert[]
  healthCheck: boolean
}

export interface WebhookAlert {
  condition: string
  threshold: number
  action: string
  recipients: string[]
}

// FIX: Add missing types for Production Phases, Steps, and SubSteps used in production hub components.
export interface SubStep {
  id: string;
  title: string;
  details: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  subSteps: SubStep[];
}

export interface ProductionPhase {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: Step[];
}

// Interfaces existentes mantidas
export interface ProjectPhase {
  id: string
  name: string
  description: string
  status: "pending" | "in_progress" | "completed"
  steps: PhaseStep[]
  deliverables: string[]
  estimatedHours: number
  actualHours?: number
  startDate?: string
  endDate?: string
  commits: CommitPlan[]
  version: string
}

export interface PhaseStep {
  id: string
  name: string
  description: string
  status: "pending" | "in_progress" | "completed"
  estimatedHours: number
  actualHours?: number
  commands: string[]
  files: string[]
  dependencies: string[]
  commits: CommitPlan[]
}

export interface RequirementsGathering {
  stakeholderInterviews: StakeholderInterview[]
  functionalRequirements: FunctionalRequirement[]
  nonFunctionalRequirements: NonFunctionalRequirement[]
  businessRules: BusinessRule[]
  constraints: Constraint[]
  assumptions: string[]
  userProfiles: UserProfile[]
  integrations: SystemIntegration[]
}

export interface StakeholderInterview {
  stakeholder: string
  role: string
  date: Date
  keyPoints: string[]
  requirements: string[]
  concerns: string[]
}

export interface FunctionalRequirement {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  category: string
  acceptanceCriteria: string[]
  dependencies: string[]
  userStory: string
  estimatedHours: number
}

export interface NonFunctionalRequirement {
  id: string
  category: "performance" | "security" | "usability" | "reliability" | "scalability" | "maintainability"
  requirement: string
  metric: string
  target: string
  testCriteria: string[]
}

export interface Constraint {
  type: "technical" | "business" | "legal" | "budget" | "time" | "resource"
  description: string
  impact: "high" | "medium" | "low"
  mitigation?: string
}

export interface SystemArchitecture {
  architecturalPattern: string
  components: ArchitecturalComponent[]
  layers: ArchitecturalLayer[]
  integrations: SystemIntegration[]
  technologyStack: TechnologyStack
  deploymentStrategy: DeploymentStrategy
}

export interface ArchitecturalComponent {
  name: string
  type: "frontend" | "backend" | "database" | "external" | "service" | "middleware"
  description: string
  responsibilities: string[]
  interfaces: ComponentInterface[]
  dependencies: string[]
  technology: string
}

export interface ComponentInterface {
  name: string
  type: "REST" | "GraphQL" | "WebSocket" | "Database" | "Event" | "File"
  description: string
  methods: InterfaceMethod[]
  authentication: string
  rateLimit?: string
}

export interface InterfaceMethod {
  name: string
  type: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "SUBSCRIBE" | "PUBLISH"
  endpoint: string
  parameters: Parameter[]
  response: string
  errorCodes: string[]
}

export interface Parameter {
  name: string
  type: string
  required: boolean
  description: string
  validation?: string
  example?: string
}

export interface ArchitecturalLayer {
  name: string
  description: string
  components: string[]
  dependencies: string[]
  patterns: string[]
}

export interface SystemIntegration {
  name: string
  type: "API" | "Database" | "File" | "Message Queue" | "Webhook" | "Socket"
  description: string
  protocol: string
  authentication: string
  dataFormat: string
  errorHandling: string
  rateLimit?: string
}

export interface TechnologyStack {
  frontend: Technology[]
  backend: Technology[]
  database: Technology[]
  devops: Technology[]
  testing: Technology[]
  monitoring: Technology[]
  external: Technology[]
}

export interface Technology {
  name: string
  version?: string
  purpose: string
  justification: string
  alternatives: string[]
  learningCurve: "easy" | "medium" | "hard"
  communitySupport: "excellent" | "good" | "limited"
  documentation: "excellent" | "good" | "limited"
}

export interface DeploymentStrategy {
  environment: "development" | "staging" | "production"
  platform: string
  containerization: boolean
  cicd: boolean
  monitoring: boolean
  backup: boolean
  scaling: "manual" | "auto"
  rollback: boolean
}

export interface UMLDiagram {
  type: "class" | "sequence" | "usecase" | "activity" | "component" | "deployment" | "er"
  name: string
  description: string
  mermaidCode: string
  entities?: string[]
  relationships?: string[]
}

export interface FolderStructure {
  name: string
  type: "folder" | "file"
  description: string
  children?: FolderStructure[]
  template?: string
  purpose: string
}

export interface ComponentSuggestion {
  name: string
  type: "page" | "component" | "modal" | "form" | "layout" | "service" | "utility"
  description: string
  props: ComponentProp[]
  children: string[]
  dependencies: string[]
  codeTemplate: string
  testTemplate?: string
}

export interface ComponentProp {
  name: string
  type: string
  required: boolean
  description: string
  defaultValue?: string
  validation?: string
}

export interface DevelopmentPlan {
  id: string;
  title: string;
  systemOverview: SystemOverview
  requirementsGathering: RequirementsGathering
  systemArchitecture: SystemArchitecture
  entities: Entity[]
  useCases: UseCase[]
  umlDiagrams: UMLDiagram[]
  folderStructure: FolderStructure
  componentSuggestions: ComponentSuggestion[]
  developmentTasks: DevelopmentTask[]
  phases: ProjectPhase[]
  milestones: ProjectMilestone[]
  versioningStrategy: VersioningStrategy
  timeline: ProjectTimeline
  // Novas propriedades para as etapas expandidas
  systemEvents: SystemEvent[]
  automations: Automation[]
  backgroundJobs: BackgroundJob[]
  notificationSystems: NotificationSystem[]
  cacheStrategies: CacheStrategy[]
  queueSystems: QueueSystem[]
  loggingSystems: LoggingSystem[]
  monitoringSystems: MonitoringSystem[]
  webhookConfigurations: WebhookConfiguration[]

  // Simplified plan for tool
  setupAndDevOps: DevTask[];
  sprints: Sprint[];
  postDeploy: DevTask[];
  checklist: DevTask[];

  createdAt: Date
  updatedAt: Date
}

export interface DevelopmentTask {
  id: string
  phase: "requirements" | "planning" | "development" | "deployment" | "maintenance"
  sprint: number
  category: "backend" | "frontend" | "database" | "devops" | "testing" | "documentation" | "integration"
  title: string
  description: string
  completed: boolean
  priority: "high" | "medium" | "low"
  estimatedHours: number
  actualHours?: number
  dependencies: string[]
  assignee?: string
  subtasks: string[]
  commands: string[]
  files: string[]
  commits: CommitPlan[]
  acceptanceCriteria: string[]
}

export interface ProjectTimeline {
  startDate: string
  endDate: string
  phases: PhaseTimeline[]
  milestones: MilestoneTimeline[]
  criticalPath: string[]
}

export interface PhaseTimeline {
  phaseId: string
  startDate: string
  endDate: string
  duration: number
  dependencies: string[]
  resources: string[]
}

export interface MilestoneTimeline {
  milestoneId: string
  targetDate: string
  actualDate?: string
  status: "pending" | "in_progress" | "completed" | "delayed"
  blockers: string[]
}

// FIX: Add Storytelling interface for use in SystemTemplate
export interface Storytelling {
  context: string;
  problem: string;
  solution: string;
  benefits: string;
}

export interface SystemTemplate {
  id: string
  name: string
  category: string
  description: string
  // FIX: Add missing properties to SystemTemplate to match usage in lib/templates.ts
  icon: string
  complexity: 'low' | 'medium' | 'high'
  estimatedDuration: string
  tags: string[]
  storytelling: Storytelling
  userProfiles: UserProfile[]
  systemOverview: {
    // FIX: Add missing properties to SystemTemplate.systemOverview
    name: string
    teamSize: number
    objective: string
    targetUsers: string
    systemType: "web" | "mobile" | "api" | "desktop" | "internal"
    mainFeatures: string[]
    nonFunctionalRequirements: string[]
    projectScope: "small" | "medium" | "large"
  }
  entities: Array<{
    name: string
    fields: Array<{
      name: string
      type: "string" | "number" | "boolean" | "date" | "text" | "foreign_key" | "enum" | "json"
      required: boolean
      description?: string
    }>
    relationships: Array<{
      type: "1:1" | "1:N" | "N:N" | "N:1"
      targetEntity: string
      description: string
    }>
// FIX: Add optional description property to entity definition
    description?: string
  }>
  useCases: Array<{
    userType: string
    actions: string[]
  }>
  technologyStack: {
    frontend: string[]
    backend: string[]
    database: string[]
    devops: string[]
  }
  // NEW: Field for detailed wizard data pre-population
  wizardData?: Partial<{
    planning: any;
    architecture_design: any;
    data_modeling: any;
    interface_ux: any;
    functionalities: any;
    tech_reqs: any;
    deploy: any;
    currentPhaseIndex?: number;
  }>
}


// Types from the old file, merged and adapted

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}

export interface ProjectTask {
  id: string;
  title: string;
  projectId: string;
  priority: TaskPriority;
  assignee: User;
}

export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanBoardData {
  tasks: { [key: string]: ProjectTask };
  columns: { [key: string]: KanbanColumn };
  columnOrder: string[];
}


// Types for the parsed Development Plan Tool
export interface SubTask {
  id: string;
  text: string;
  status: 'todo' | 'done';
}

export interface TaskDetails {
  description?: string;
  errosComuns?: { erro: string; solucao: string; prevencao: string }[];
  testes?: { comandos: any[], validacoes: string[], testeDeMesa: string[] };
  recursos?: { documentacao: any[], videos: any[], repositorios: any[] };
  faq?: { pergunta: string; resposta: string }[];
}

export interface DevTask {
  id: string;
  title: string;
  subTasks: SubTask[];
  status: 'todo' | 'done';
  details?: TaskDetails;
  toolTarget?: ToolTarget;
}

export interface Sprint {
  id: string;
  title: string;
  backendTasks: DevTask[];
  frontendTasks: DevTask[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  description: string;
}

export interface ProjectValidation {
  id: string;
  type: 'phase_validation';
  targetId: string; // id from ProductionPhase
  targetName: string; // title from ProductionPhase
  status: 'pending' | 'approved' | 'changes_requested';
  requestedAt: string;
  respondedAt?: string;
  data: any; // Contains the summary/data for validation
  feedback?: string; // For client feedback
}

export interface ProjectAsset {
    id: string;
    label: string;
    type: 'file' | 'text' | 'credentials';
    status: 'pending' | 'submitted';
    value?: string; // For text/credentials
    fileName?: string; // For files
    submittedAt?: string;
    sender?: 'client' | 'operator';
    submittedBy?: string;
    size?: number; // in bytes
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client?: string;
  projectScope: 'client' | 'internal';
  type: string;
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  estimatedHours?: string;
  milestones: Milestone[];
  budget?: string;
  hourlyRate?: string;
  paymentTerms?: string;
  projectManager?: string;
  teamMembers: string[];
  technologies: string[];
  requirements?: string;
  features: Feature[];
  status: 'planning' | 'awaiting_validation' | 'in_progress' | 'awaiting_delivery_approval' | 'completed' | 'changes_requested';
  validations: ProjectValidation[];
  assets: ProjectAsset[];
}

// State for generated artifacts and plans, mapped by projectId
export interface ProjectArtifacts {
    wizardData?: any;
    developmentPlan?: DevelopmentPlan;
    generatedFiles?: { [filePath: string]: string };
    billOfMaterials?: string;
    commitHistory?: { hash: string; message: string; author: string; date: string }[];
}


// =================================================================
// START: Development Plan Object (DPO) for the Digital Assembly Line
// =================================================================

// FIX: Add 'backend_design_system' and 'database_design_system' to support all tool targets from the plan builder.
export type ToolTarget = 'laboratory' | 'playground' | 'design_system' | 'modeling_hub' | 'backend_design_system' | 'database_design_system' | 'construction_hub' | 'ide';
export type TaskStatus = 'pending' | 'inProgress' | 'completed';

/**
 * The specific data payload required to initialize a tool for a given task.
 */
export interface ContextPayload {
  [key: string]: any; // Flexible payload, e.g., { algorithmDescription: '...', testCases: [...] }
}

/**
 * Represents a single, actionable task within a module.
 */
export interface DpoTask {
  taskId: string;
  title: string;
  description: string;
  status: TaskStatus;
  toolTarget: ToolTarget;
  contextPayload: ContextPayload;
  aiEnrichment?: {
    commonErrors?: { error: string; solution: string }[];
    faq?: { question: string; answer: string }[];
    codeSuggestions?: string;
  };
}

/**
 * A logical grouping of tasks, e.g., "Authentication", "User Profile".
 */
export interface DpoModule {
  moduleId: string;
  title: string;
  tasks: DpoTask[];
}

/**
 * The root object representing the entire development plan for the assembly line.
 * This is the "chassis" that moves through the factory.
 */
export interface DevelopmentPlanObject {
  metadata: {
    planId: string;
    version: string;
    createdAt: string;
    updatedAt: string;
  };
  systemSpecs: {
    systemName: string;
    description: string;
  };
  modules: DpoModule[];
}

// ===============================================================
// END: Development Plan Object (DPO)
// ===============================================================

// New types for Software Factory
export interface Concept {
  id: string;
  title: string;
  icon: string;
  description: string;
  content?: string; // Final content if it's a leaf node
  children?: Concept[]; // Nested concepts
  status: TaskStatus;
  toolTarget?: ToolTarget;
}

export interface SoftwareFactoryPhase {
  id: string;
  title: string;
  icon: string;
  description: string;
  children: Concept[];
}

// NEW TYPES FOR BUSINESS LOGIC

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'prospect' | 'inactive';
  projects: number;
  totalValue: string;
  satisfaction: number;
  lastContact: string;
  avatar: string;
  tags: string[];
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  status: 'pending' | 'converted';
  createdAt: string;

  // NEW DETAILED FIELDS
  projectType?: 'webapp' | 'mobile' | 'desktop' | 'api' | 'other';
  targetAudience?: string;
  mainGoals?: string;
  coreFeatures?: string[];
  designPreferences?: 'minimalist' | 'corporate' | 'modern' | 'playful';
  budgetRange?: string;
  desiredTimeline?: string;
  existingSystem?: string;
}


export interface Proposal {
  id: string;
  quoteId?: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  projectName?: string;
  // FIX: Make properties of `scopeDetails` optional to allow for draft proposals.
  scopeDetails?: {
    complexity?: string;
    estimatedHours?: number;
    timeline?: string;
    valueProposition?: string;
    team?: string;
  };
  budget: number;
  deadline: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  projectId?: string;
}

export interface Contract {
  id: string;
  proposalId: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  amount: number;
  title: string;
  terms: string;
  signedAt?: string;
  status: 'pending' | 'signed' | 'expired';
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
}


// =================================================================
// START: Communication Hub Types
// =================================================================

export interface Message {
  id: string;
  senderId: string; // 'me' or user id
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  name: string;
  avatarUrl?: string;
  project: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTimestamp: string;
}

export interface Appointment {
    id: string;
    title: string;
    type: string;
    date: string;
    time: string;
    notes: string;
    with: string[];
}

export interface SupportTicket {
    id: string;
    subject: string;
    priority: 'Baixa' | 'Média' | 'Alta';
    description: string;
    status: 'Aberto' | 'Em Andamento' | 'Resolvido';
    lastUpdate: string;
    createdAt: string;
}

export interface KnowledgeBaseArticle {
    id: string;
    title: string;
    category: string;
    content: string;
    tags: string[];
}

// ===============================================================
// END: Communication Hub Types
// ===============================================================


// ===============================================================
// START: Notification System Types
// ===============================================================
export enum NotificationType {
    PROPOSAL_SENT,
    PROPOSAL_APPROVED,
    VALIDATION_REQUESTED,
    VALIDATION_APPROVED,
    ASSET_REQUESTED,
    ASSET_SUBMITTED,
    INVOICE_GENERATED,
    CONTRACT_SIGNED,
    DELIVERY_READY_FOR_APPROVAL,
    DELIVERY_CHANGES_REQUESTED,
}

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    timestamp: Date;
    read: boolean;
    cta: {
        label: string;
        view: string;
        context: any;
    };
    icon: string;
}
// ===============================================================
// END: Notification System Types
// ===============================================================

// NEW: Type for AI-generated file structure
export interface GeneratedFile {
  path: string;
  content: string;
  language?: string;
}

// For new Table Editor
export type CascadeAction = 'NO ACTION' | 'RESTRICT' | 'CASCADE' | 'SET NULL' | 'SET DEFAULT';

export interface ValidationRules {
    isUnique?: boolean;
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
}

export interface Column {
    id: string;
    name: string;
    dataType: string;
    description?: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    isNullable: boolean;
    isIndexed: boolean;
    isAutoIncrement: boolean;
    foreignKeyTable?: string;
    foreignKeyColumn?: string;
    onDeleteAction?: CascadeAction;
    onUpdateAction?: CascadeAction;
    validations?: ValidationRules;
}

export interface Table {
    id: string;
    name: string;
    description?: string;
    columns: Column[];
    checkConstraints?: string;
}

export type Schema = {
    tables: Table[];
};