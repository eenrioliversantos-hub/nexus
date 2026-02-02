import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/Tabs';
import Step1Vision from '../steps/Step1Vision';
import Step2SystemType from '../steps/Step2SystemType';
import Step4Stack from '../steps/Step4Stack';
import Step5Authentication from '../steps/Step5Authentication';
import Step7Permissions from '../steps/Step7Permissions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/Accordion';
import { Card } from '../../ui/Card';
import CodeBlock from '../../shared/CodeBlock';
import UserEntityDataTool from './UserEntityDataTool';
import EntityLifecycleTool from './EntityLifecycleTool';
import DataStateArchitectureTool from './DataStateArchitectureTool';

interface PlanningToolProps {
    initialData: any;
    onComplete: (data: any, artifacts: any) => void;
    onBack: () => void;
}

const PlanningTool: React.FC<PlanningToolProps> = ({ initialData, onComplete, onBack }) => {
    const [data, setData] = useState(initialData);

    const handleDataChange = useCallback((stepKey: string, stepData: any) => {
        setData((prev: any) => {
            if (stepKey.startsWith('step')) {
                return { ...prev, [stepKey]: stepData };
            }
            return { ...prev, [stepKey]: stepData };
        });
    }, []);

    const handleUserTypeDataChange = (id: string, userData: any) => {
        const userTypes = data.step6?.userTypes || [];
        const updatedUsers = userTypes.map((u: any) => u.id === id ? { ...u, ...userData } : u);
        handleDataChange('step6', { ...data.step6, userTypes: updatedUsers });
    };

    const handleAddUserType = () => {
        const newUser = { id: Date.now().toString(), name: 'Novo Papel' };
        const userTypes = data.step6?.userTypes || [];
        const updatedUsers = [...userTypes, newUser];
        handleDataChange('step6', { ...data.step6, userTypes: updatedUsers });
    };

    const handleRemoveUserType = (id: string) => {
        const userTypes = data.step6?.userTypes || [];
        const updatedUsers = userTypes.filter((u: any) => u.id !== id);
        handleDataChange('step6', { ...data.step6, userTypes: updatedUsers });
    };

    const handleAddEntity = () => {
        const newEntity = { id: Date.now().toString(), singularName: 'Nova Entidade' };
        const updatedEntities = [...(data.planningEntities || []), newEntity];
        handleDataChange('planningEntities', updatedEntities);
    };

    const handleRemoveEntity = (id: string) => {
        const updatedEntities = (data.planningEntities || []).filter((e: any) => e.id !== id);
        handleDataChange('planningEntities', updatedEntities);
    };

    const handleEntityDataChange = (id: string, entityData: any) => {
        const updatedEntities = (data.planningEntities || []).map((e: any) => e.id === id ? { ...e, ...entityData } : e);
        handleDataChange('planningEntities', updatedEntities);
    };

    const visionMd = useMemo(() => `
# Visão do Projeto: ${data.step1?.systemName || 'Nome não definido'}
## Descrição
${data.step1?.description || 'Descrição não definida'}
## Objetivo Principal
${data.step1?.mainObjective || 'Objetivo não definido'}
    `.trim(), [data.step1]);

    const handleGenerateAndSave = () => {
        const artifacts = { 'visao-do-projeto.md': visionMd };
        onComplete(data, artifacts);
    };

    return (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <header className="bg-sidebar/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBack}><Icon name="chevronLeft" className="h-4 w-4 mr-2" />Voltar ao Hub</Button>
                    <div className="flex items-center gap-3"><Icon name="eye" className="h-6 w-6 text-accent" />
                        <div><h1 className="text-lg font-semibold text-text-primary">Ferramenta de Planejamento</h1><p className="text-sm text-text-secondary">Defina a visão, arquitetura e stack do seu projeto.</p></div>
                    </div>
                </div>
                <Button onClick={handleGenerateAndSave}><Icon name="sparkles" className="h-4 w-4 mr-2" />Gerar Documentos e Salvar</Button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <Tabs defaultValue="vision" className="w-full">
                    <TabsList className="grid w-full grid-cols-7"><TabsTrigger value="vision">Visão</TabsTrigger><TabsTrigger value="type">Tipo</TabsTrigger><TabsTrigger value="stack">Stack</TabsTrigger><TabsTrigger value="auth">Autenticação</TabsTrigger><TabsTrigger value="users_entities_data">Usuários, Entidades e Dados</TabsTrigger><TabsTrigger value="permissions">Permissões</TabsTrigger><TabsTrigger value="artifacts">Artefatos</TabsTrigger></TabsList>
                    <div className="mt-6">
                        <TabsContent value="vision"><Step1Vision data={data.step1} setData={(d) => handleDataChange('step1', d)} /></TabsContent>
                        <TabsContent value="type"><Step2SystemType data={data.step2} setData={(d) => handleDataChange('step2', d)} /></TabsContent>
                        <TabsContent value="stack"><Step4Stack data={data.step4} setData={(d) => handleDataChange('step4', d)} /></TabsContent>
                        <TabsContent value="auth"><Step5Authentication data={data.step5} setData={(d) => handleDataChange('step5', d)} /></TabsContent>
                        
                        <TabsContent value="users_entities_data">
                             <Tabs defaultValue="users" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="users">Usuários & Fluxos</TabsTrigger>
                                    <TabsTrigger value="entities">Entidades & Ciclo de Vida</TabsTrigger>
                                    <TabsTrigger value="data_architecture">Dados & Arquitetura</TabsTrigger>
                                </TabsList>
                                <TabsContent value="users" className="mt-6">
                                     <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1"><h3 className="text-xl font-semibold">Perfis de Usuário & Fluxos</h3><p className="text-sm text-text-secondary">Defina cada papel de usuário, suas permissões, fluxos e interações com os dados.</p></div>
                                            <Button variant="outline" onClick={handleAddUserType}><Icon name="plus" className="h-4 w-4 mr-2"/>Adicionar Perfil</Button>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full space-y-4">
                                            {(data.step6?.userTypes || []).map((user: any) => (
                                                <AccordionItem value={user.id} key={user.id} className="border-none">
                                                    <Card className="bg-sidebar/50">
                                                        <AccordionTrigger className="p-4 hover:no-underline">
                                                            <div className="flex justify-between items-center w-full">
                                                                <span className="font-semibold">{user.roleName || user.name || 'Novo Papel'}</span>
                                                                <div className="flex items-center"><Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRemoveUserType(user.id)}}><Icon name="trash" className="h-4 w-4 text-red-500" /></Button></div>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><UserEntityDataTool data={user} setData={(d) => handleUserTypeDataChange(user.id, d)} /></div></AccordionContent>
                                                    </Card>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                        {(!data.step6?.userTypes || data.step6.userTypes.length === 0) && (<div className="text-center py-16 border-2 border-dashed border-card-border rounded-lg"><Icon name="users" className="h-10 w-10 text-text-secondary mx-auto mb-3" /><h3 className="font-semibold text-lg text-text-primary">Nenhum Perfil de Usuário</h3><p className="text-sm text-text-secondary mt-1">Clique em "Adicionar Perfil" para começar.</p></div>)}
                                    </div>
                                </TabsContent>
                                <TabsContent value="entities" className="mt-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1"><h3 className="text-xl font-semibold">Entidades & Ciclo de Vida</h3><p className="text-sm text-text-secondary">Defina as entidades principais, seus atributos e ciclo de vida.</p></div>
                                            <Button variant="outline" onClick={handleAddEntity}><Icon name="plus" className="h-4 w-4 mr-2"/>Adicionar Entidade</Button>
                                        </div>
                                        <Accordion type="single" collapsible className="w-full space-y-4">
                                            {(data.planningEntities || []).map((entity: any) => (
                                                <AccordionItem value={entity.id} key={entity.id} className="border-none">
                                                    <Card className="bg-sidebar/50">
                                                        <AccordionTrigger className="p-4 hover:no-underline">
                                                            <div className="flex justify-between items-center w-full">
                                                                <span className="font-semibold">{entity.singularName || 'Nova Entidade'}</span>
                                                                <div className="flex items-center"><Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRemoveEntity(entity.id) }}><Icon name="trash" className="h-4 w-4 text-red-500" /></Button></div>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-4 pt-0"><div className="border-t border-card-border pt-4"><EntityLifecycleTool data={entity} setData={(d) => handleEntityDataChange(entity.id, d)} /></div></AccordionContent>
                                                    </Card>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                        {(!data.planningEntities || data.planningEntities.length === 0) && (<div className="text-center py-16 border-2 border-dashed border-card-border rounded-lg"><Icon name="database" className="h-10 w-10 text-text-secondary mx-auto mb-3" /><h3 className="font-semibold text-lg text-text-primary">Nenhuma Entidade</h3><p className="text-sm text-text-secondary mt-1">Clique em "Adicionar Entidade" para começar.</p></div>)}
                                    </div>
                                </TabsContent>
                                <TabsContent value="data_architecture" className="mt-6">
                                    <DataStateArchitectureTool
                                        data={data.planningDataArchitecture}
                                        setData={(d) => handleDataChange('planningDataArchitecture', d)}
                                    />
                                </TabsContent>
                            </Tabs>
                        </TabsContent>
                        
                        <TabsContent value="permissions"><Step7Permissions data={data.step7} setData={(d) => handleDataChange('step7', d)} userTypes={data.step6?.userTypes || []} /></TabsContent>
                        <TabsContent value="artifacts"><CodeBlock language="markdown" code={visionMd} /></TabsContent>
                    </div>
                </Tabs>
            </main>
        </div>
    );
};

export default PlanningTool;