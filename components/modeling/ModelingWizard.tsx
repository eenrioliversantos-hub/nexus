
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '../ui/Button';
import Icon from '../shared/Icon';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
// FIX: Import 'ProjectArtifacts' from the correct types file.
import { SystemTemplate, Project, DevelopmentPlan, ProjectArtifacts } from '../../types';
import GenerationViewer from './generation/GenerationViewer';
import PlanningTool from './tools/PlanningTool';
import InterfaceUXTool from './tools/InterfaceUXTool';
import BackendDesignSystem from '../design-system/BackendDesignSystem';
import DatabaseDesignSystem from '../design-system/DatabaseDesignSystem';
import TechReqsTool from './tools/TechReqsTool';
import DeployTool from './tools/DeployTool';
import { generateSqlSchema } from '../../lib/generation/sqlGenerator';
import { generatePrismaSchema } from '../../lib/generation/prismaGenerator';
import { generateZodSchemas } from '../../lib/generation/validationGenerator';
import { generateApiRoutes } from '../../lib/generation/apiGenerator';
import { buildOficinaFacilPlan } from '../../lib/oficinaFacilPlanBuilder';
import { generateBillOfMaterials } from '../../lib/generation/billOfMaterialsGenerator';
import ArchitectureTool from './tools/ArchitectureTool';
import ApiDesignTool from './tools/ApiDesignTool';

interface ModelingWizardProps {
    initialData?: any; // SystemTemplate OR wizardData
    isExistingData?: boolean; // Flag to indicate if initialData is already in wizard format
    onBack: () => void;
    setCurrentView: (view: string, context?: any) => void;
    project: Project;
    onArtifactsUpdate: (projectId: string, updates: Partial<ProjectArtifacts>) => void;
}

const LOCAL_STORAGE_KEY_PREFIX = 'modeling-wizard-data-';

const DEFAULT_WIZARD_DATA = {
    planning: { step1: {}, step2: {}, step4: {}, step5: {}, step6: { userTypes: [] }, step7: {}, planningEntities: [], planningDataArchitecture: {} },
    architecture_design: {},
    data_modeling: { step8: { entities: [] }, step9: {}, step10: { relationships: [] }, step11: {}, step12: { rules: [] }, step13: { endpoints: [] }, step14: { integrations: [] } },
    api_design: {},
    interface_ux: { step15: {screens: []}, step16: {components: {}}, step17: {}, step18: {} },
    functionalities: { 
        step19: {channels: [], events: []}, 
        step20: {globalSearch: { enabled: false, entities: [] }, filters: []}, 
        step21: {reports: []}, 
        step22: {tools: []},
        webhooks: {},
        paymentGateways: {},
        thirdPartyApis: {},
        jobs: {},
        functions: {},
        caching: {}
    },
    tech_reqs: { step23: {}, step24: {}, step25: {}, step26: {} },
    devops: {
        hostingProvider: "Vercel",
        deploymentStrategy: "Rolling Update",
        ciCdSteps: ["Linting", "Unit Tests", "Build Application", "Deploy to Staging"],
        containerization: "Docker",
        orchestration: "Nenhum",
        iacTool: "Nenhum",
        databaseProvider: "NeonDB",
        backupFrequency: "Diário",
        loggingTool: "Vercel Logging"
    },
    artifacts: {}
};

const mapTemplateToWizardData = (template: SystemTemplate) => {
    // Simple deep merge that overwrites arrays, which is what we want.
    const isObject = (item: any) => item && typeof item === 'object' && !Array.isArray(item);

    const mergeDeep = (target: any, source: any): any => {
        const output = { ...target };
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key]) && key in target && isObject(target[key])) {
                    output[key] = mergeDeep(target[key], source[key]);
                } else {
                    output[key] = source[key];
                }
            });
        }
        return output;
    };

    // If the new, detailed format is provided, use it with defaults.
    if (template.wizardData) {
        const defaults = JSON.parse(JSON.stringify(DEFAULT_WIZARD_DATA));
        return mergeDeep(defaults, template.wizardData);
    }

    // --- Fallback to old, simple mapping for legacy templates ---
    return {
        ...DEFAULT_WIZARD_DATA, // Start with defaults
        planning: {
            ...DEFAULT_WIZARD_DATA.planning,
            step1: {
                systemName: template.systemOverview.name,
                description: template.description,
                mainObjective: template.systemOverview.objective,
                targetAudience: template.systemOverview.targetUsers.split(',').map(s => s.trim()),
                problemSolved: template.storytelling.problem,
                successCriteria: template.storytelling.benefits,
            },
            step2: {
                systemType: template.systemOverview.systemType,
            },
            step4: {
                frontend: template.technologyStack.frontend,
                backend: template.technologyStack.backend,
                database: template.technologyStack.database,
            },
            step6: {
                userTypes: template.userProfiles.map(profile => ({
                    id: `user-type-${Math.random()}`,
                    name: profile.name,
                    description: profile.description,
                })),
            },
        },
        data_modeling: {
            ...DEFAULT_WIZARD_DATA.data_modeling,
            step8: {
                 entities: template.entities.map(e => ({
                     ...e, 
                     id: `entity-${Math.random()}`, 
                     fields: e.fields.map(f => ({
                         ...f, 
                         id: `field-${Math.random()}`, 
                         validations: []
                     })), 
                     timestamps: true, 
                     softDeletes: false 
                }))
            }
        },
        // Fill rest with defaults
        interface_ux: DEFAULT_WIZARD_DATA.interface_ux,
        functionalities: DEFAULT_WIZARD_DATA.functionalities,
        tech_reqs: DEFAULT_WIZARD_DATA.tech_reqs,
        devops: DEFAULT_WIZARD_DATA.devops,
        artifacts: {},
    };
};

const ModelingWizard: React.FC<ModelingWizardProps> = ({ initialData, isExistingData, onBack, setCurrentView, project, onArtifactsUpdate }) => {
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [wizardData, setWizardData] = useState<any>(() => {
        const savedData = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${project.id}`);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch {
                if (isExistingData && initialData) return initialData;
                return initialData ? mapTemplateToWizardData(initialData) : DEFAULT_WIZARD_DATA;
            }
        }
        if (isExistingData && initialData) return initialData;
        return initialData ? mapTemplateToWizardData(initialData) : DEFAULT_WIZARD_DATA;
    });
    const [isGenerated, setIsGenerated] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const saveTimeoutRef = useRef<number | null>(null);
    
    const categories = useMemo(() => [
        { id: 'planning', title: 'Planejamento', icon: 'eye', component: PlanningTool, dataKey: 'planning', description: "Defina a visão, escopo, usuários e tecnologias do seu sistema." },
        { id: 'architecture_design', title: 'Arquitetura', icon: 'gitBranch', component: ArchitectureTool, dataKey: 'architecture_design', description: "Mapeie os componentes, serviços, fluxo de dados e infraestrutura." },
        { id: 'data_modeling', title: 'Modelagem de Dados', icon: 'database', component: DatabaseDesignSystem, dataKey: 'data_modeling', description: "Construa o esqueleto de dados: entidades, campos e relacionamentos." },
        { id: 'api_design', title: 'Engenharia de API', icon: 'webhook', component: ApiDesignTool, dataKey: 'api_design', description: "Modele os contratos e a forma como os dados serão expostos." },
        { id: 'interface_ux', title: 'Interface e UX', icon: 'layout', component: InterfaceUXTool, dataKey: 'interface_ux', description: "Projete as telas, componentes e a experiência visual do usuário." },
        { id: 'functionalities', title: 'Funcionalidades', icon: 'puzzle', component: BackendDesignSystem, dataKey: 'functionalities', description: "Modele lógicas complexas como notificações, busca e integrações." },
        { id: 'devops', title: 'Engenharia DevOps', icon: 'server', component: DeployTool, dataKey: 'devops', description: "Planeje a infraestrutura de deploy, CI/CD e monitoramento." },
        { id: 'tech_reqs', title: 'Requisitos Técnicos', icon: 'shield', component: TechReqsTool, dataKey: 'tech_reqs', description: "Especifique requisitos de SEO, performance, segurança e testes." },
    ], []);

    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(() => {
        const savedData = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${project.id}`);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                return parsed.currentPhaseIndex || 0;
            } catch { return 0; }
        }
        return 0;
    });

    // Effect to handle autosaving with debounce
    useEffect(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        setSaveStatus('unsaved');
        saveTimeoutRef.current = window.setTimeout(() => {
            setSaveStatus('saving');
            const dataToSave = { ...wizardData, currentPhaseIndex };
            localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${project.id}`, JSON.stringify(dataToSave));
            setTimeout(() => setSaveStatus('saved'), 1000);
        }, 1500);
        return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
    }, [wizardData, currentPhaseIndex, project.id]);

    
    const handleCompleteCategory = (categoryKey: string, data: any, toolGeneratedArtifacts?: any) => {
        let artifacts = toolGeneratedArtifacts || {};
        // Centralized artifact generation logic
        if (categoryKey === 'data_modeling') {
            const fullDataForGen = { ...wizardData, data_modeling: data };
            artifacts = {
                ...artifacts,
                sql: generateSqlSchema(fullDataForGen),
                prisma: generatePrismaSchema(fullDataForGen),
                zod: generateZodSchemas(fullDataForGen),
                api: generateApiRoutes(fullDataForGen),
            };
        }

        setWizardData(prev => {
            const updatedWizData = {
                ...prev,
                [categoryKey]: data,
                artifacts: { ...prev.artifacts, [categoryKey]: artifacts }
            };
            onArtifactsUpdate(project.id, { wizardData: updatedWizData });
            return updatedWizData;
        });

        const completedIndex = categories.findIndex(c => c.dataKey === categoryKey);
        if(completedIndex === currentPhaseIndex && currentPhaseIndex < categories.length - 1) {
            setCurrentPhaseIndex(currentPhaseIndex + 1);
        }
        setActiveTool(null);
    };

    const handleCompleteWizard = () => {
        const billOfMaterials = generateBillOfMaterials(wizardData);
        const finalWizardData = { ...wizardData, billOfMaterials };
        onArtifactsUpdate(project.id, { wizardData: finalWizardData });
        
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${project.id}`);

        // Navigate back to the hub, which will now show the generation step.
        setCurrentView('construction_hub', { projectId: project.id });
    };
    
    const isPhaseCompleted = (index: number) => {
        const category = categories[index];
        // A phase is complete if its data object is not empty or has some meaningful content.
        // This is a heuristic and can be improved.
        const categoryData = wizardData[category.dataKey];
        if (!categoryData) return false;
        if(category.dataKey === 'planning' && !wizardData.planning?.step1?.systemName) return false;
        if(category.dataKey === 'data_modeling' && wizardData.data_modeling?.step8?.entities.length === 0) return false;
        return Object.keys(categoryData).length > 0;
    };
    
    const allPhasesCompleted = categories.every((_, index) => isPhaseCompleted(index));

    if (isGenerated) {
        return <GenerationViewer wizardData={wizardData} setCurrentView={setCurrentView} project={project} onArtifactsUpdate={onArtifactsUpdate} />;
    }

    if (activeTool) {
        const toolInfo = categories.find(c => c.id === activeTool);
        if (toolInfo && toolInfo.component) {
            const ToolComponent = toolInfo.component;
            return (
                <ToolComponent
                    initialData={wizardData[toolInfo.dataKey]}
                    planningData={wizardData.planning}
                    entitiesData={wizardData.data_modeling}
                    setEntitiesData={(d: any) => setWizardData(prev => ({...prev, data_modeling: d}))}
                    onComplete={(data: any, artifacts: any) => handleCompleteCategory(toolInfo.dataKey, data, artifacts)}
                    onBack={() => setActiveTool(null)}
                />
            );
        }
    }
    
    const currentCategory = categories[currentPhaseIndex];
    const isCurrentPhaseCompleted = isPhaseCompleted(currentPhaseIndex);
    
    return (
        <div className="flex flex-col h-screen bg-background text-text-primary p-4 md:p-8">
            <header className="flex-shrink-0 mb-6">
                <Button variant="outline" size="sm" onClick={onBack} className="mb-4"><Icon name="chevronLeft" className="h-4 w-4 mr-2" />Voltar</Button>
                <div className="text-center"><h1 className="text-3xl font-bold">Hub de Modelagem de Sistema</h1><p className="text-text-secondary mt-1 max-w-2xl mx-auto">Siga a esteira de montagem para construir seu blueprint digital.</p></div>
            </header>
            
            <main className="flex-1 overflow-y-auto">
                {/* Stepper */}
                <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-8">
                    {categories.map((category, index) => {
                        const isCompleted = isPhaseCompleted(index);
                        const isCurrent = index === currentPhaseIndex;
                        const isLocked = index > 0 && !isPhaseCompleted(index - 1);
                        
                        let statusClasses = 'bg-sidebar border-card-border text-text-secondary';
                        if (isCurrent) statusClasses = 'bg-accent border-accent text-white ring-4 ring-accent/20';
                        if (isCompleted) statusClasses = 'bg-green-500/20 border-green-500/50 text-green-300';
                        if (isLocked) statusClasses = 'bg-sidebar border-card-border text-text-secondary opacity-50';

                        return (
                            <React.Fragment key={category.id}>
                                <button
                                    onClick={() => !isLocked && setCurrentPhaseIndex(index)}
                                    disabled={isLocked}
                                    className="flex flex-col items-center text-center w-24"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${statusClasses}`}>
                                        {isCompleted && !isCurrent ? <Icon name="check" className="h-5 w-5"/> : <Icon name={category.icon} className="h-5 w-5"/>}
                                    </div>
                                    <p className={`text-xs mt-2 font-semibold ${isCurrent ? 'text-accent' : isCompleted ? 'text-text-primary' : 'text-text-secondary'} ${isLocked ? 'opacity-50' : ''}`}>{category.title}</p>
                                </button>
                                {index < categories.length - 1 && <div className="flex-1 h-0.5 bg-card-border mt-[-1.5rem]" />}
                            </React.Fragment>
                        );
                    })}
                </div>
                
                {/* Current Phase Content */}
                <Card className="max-w-3xl mx-auto bg-sidebar/50 text-center animate-in fade-in-50">
                    <CardContent className="p-8">
                        <div className="p-3 bg-accent/10 rounded-full inline-block mb-4 border-2 border-accent/20">
                            <Icon name={currentCategory.icon} className="h-8 w-8 text-accent"/>
                        </div>
                        <h2 className="text-2xl font-bold">{currentCategory.title}</h2>
                        <p className="text-text-secondary mt-2 mb-6">{currentCategory.description}</p>
                        <Button size="lg" onClick={() => setActiveTool(currentCategory.id)}>
                            <Icon name={isCurrentPhaseCompleted ? 'edit' : 'play'} className="h-5 w-5 mr-2"/>
                            {isCurrentPhaseCompleted ? 'Revisar Fase' : 'Iniciar Fase'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Final step */}
                {allPhasesCompleted && (
                     <Card className="max-w-3xl mx-auto mt-6 bg-green-500/10 border-green-500/30 text-center animate-in fade-in-50">
                        <CardContent className="p-8">
                            <Icon name="check" className="h-10 w-10 text-green-400 mx-auto mb-3"/>
                            <h2 className="text-2xl font-bold text-green-300">Todas as Fases Concluídas!</h2>
                            <p className="text-green-400/80 mt-2 mb-6">Você completou todas as etapas da modelagem. Clique abaixo para ir para a revisão final e gerar os artefatos.</p>
                            <Button size="lg" onClick={handleCompleteWizard} className="bg-green-600 hover:bg-green-700">
                                <Icon name="sparkles" className="h-5 w-5 mr-2"/>
                                Concluir Modelagem e Voltar ao Hub
                            </Button>
                        </CardContent>
                    </Card>
                )}

            </main>

            <footer className="flex-shrink-0 mt-6 text-center">
                <div className="h-4 mb-2">
                    {saveStatus === 'saving' && <span className="text-xs text-text-secondary flex items-center gap-1 justify-center"><Icon name="spinner" className="h-3 w-3 animate-spin" /> Salvando...</span>}
                    {saveStatus === 'saved' && <span className="text-xs text-green-400 flex items-center gap-1 justify-center"><Icon name="check" className="h-3 w-3" /> Salvo automaticamente</span>}
                </div>
            </footer>
        </div>
    );
};

export default ModelingWizard;
