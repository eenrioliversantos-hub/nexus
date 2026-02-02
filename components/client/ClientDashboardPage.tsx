
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import Icon from '../shared/Icon';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Dialog } from '../ui/Dialog';
import ClientQuoteRequestForm from './ClientQuoteRequestForm';
import { QuoteRequest, ProjectValidation, Project, Invoice } from '../../types';
import MetricCard from '../dashboard/MetricCard'; // Reutilizando o MetricCard

const getStatusBadge = (status: Invoice['status']) => {
    switch(status) {
        case 'paid': return <Badge variant="secondary" className="bg-green-500/10 text-green-400">Paga</Badge>;
        case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400">Pendente</Badge>;
        case 'overdue': return <Badge variant="secondary" className="bg-red-500/10 text-red-400">Vencida</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

// Função para determinar o progresso com base no status
const getProgressByStatus = (status: Project['status']): number => {
    const progressMap: Record<Project['status'], number> = {
        planning: 25,
        in_progress: 75,
        completed: 100,
        on_hold: 40,
        cancelled: 0,
        awaiting_validation: 60,
        awaiting_delivery_approval: 95,
        changes_requested: 80,
    };
    return progressMap[status] || 0;
};

interface ClientDashboardPageProps {
    setView: (view: string, context?: any) => void;
    onQuoteRequest: (requestData: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) => void;
    pendingValidations: (ProjectValidation & { projectName: string, projectId: string })[];
    projectForAssets?: Project;
    projectsForDelivery: Project[];
    projects: Project[];
    invoices?: Invoice[]; 
}

const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({ 
    setView, 
    onQuoteRequest, 
    pendingValidations, 
    projectForAssets, 
    projectsForDelivery, 
    projects = [], 
    invoices = [] 
}) => {
    const [isRequestingQuote, setIsRequestingQuote] = useState(false);

    const handleQuoteSubmit = (requestData: Omit<QuoteRequest, 'id' | 'status' | 'createdAt'>) => {
        onQuoteRequest(requestData);
        setIsRequestingQuote(false);
    };
    
    const planningProjects = projects.filter(p => p.status === 'planning');
    const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'planning');
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
    const pendingInvoicesCount = pendingInvoices.length;
    const pendingInvoicesValue = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const sortedInvoices = [...invoices].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()).slice(0, 5);

    return (
        <div className="space-y-8">
            <Dialog open={isRequestingQuote} onClose={() => setIsRequestingQuote(false)}>
                <ClientQuoteRequestForm onCancel={() => setIsRequestingQuote(false)} onSubmit={handleQuoteSubmit} />
            </Dialog>

            <div>
                <h1 className="text-3xl font-bold">Deck de Observação</h1>
                <p className="text-text-secondary">Acompanhe a fabricação do seu software em tempo real.</p>
            </div>
            
            {/* DELIVERY APPROVAL */}
            {projectsForDelivery.length > 0 && (
                 <Card className="bg-green-500/10 border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-green-300 flex items-center gap-2">
                            <Icon name="package" className="h-5 w-5"/> Entrega Pronta para Expedição!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {projectsForDelivery.map(proj => (
                            <div key={proj.id} className="flex items-center justify-between p-3 bg-sidebar rounded-md border border-green-500/20">
                                <div>
                                    <p className="font-semibold">O projeto '{proj.name}' foi finalizado pela fábrica.</p>
                                </div>
                                <Button size="sm" onClick={() => setView('client_project_detail', { projectId: proj.id })}>
                                    Inspecionar e Receber
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* PENDING VALIDATIONS */}
            {pendingValidations.length > 0 && (
                <Card className="bg-yellow-500/10 border-yellow-500/30">
                    <CardHeader>
                        <CardTitle className="text-yellow-300 flex items-center gap-2">
                            <Icon name="alertCircle" className="h-5 w-5"/> Controle de Qualidade: Aprovação Necessária
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pendingValidations.map(val => (
                            <div key={val.id} className="flex items-center justify-between p-3 bg-sidebar rounded-md">
                                <div>
                                    <p className="font-semibold">Blueprint/Fase para: {val.projectName}</p>
                                    <p className="text-sm text-text-secondary">Aguardando sua revisão para continuar a produção.</p>
                                </div>
                                <Button size="sm" onClick={() => setView('validation_detail', { projectId: val.projectId, validationId: val.id })}>
                                    Revisar Agora
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
            
            {/* NEXT STEPS */}
            {planningProjects.length > 0 && (
                <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardHeader>
                        <CardTitle className="text-blue-300 flex items-center gap-2">
                            <Icon name="compass" className="h-5 w-5"/> Em Planejamento
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {planningProjects.map(proj => (
                            <div key={proj.id} className="p-3 bg-sidebar rounded-md">
                                <p className="font-semibold">Projeto '{proj.name}'</p>
                                <p className="text-sm text-text-secondary mt-1">Nossos arquitetos estão desenhando o blueprint. Você será notificado em breve.</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}


            {/* PENDING ASSETS */}
            {projectForAssets && (
                 <Card className="bg-sky-500/10 border-sky-500/30">
                    <CardHeader>
                        <CardTitle className="text-sky-300 flex items-center gap-2">
                            <Icon name="listChecks" className="h-5 w-5"/> Material Pendente
                        </CardTitle>
                        <CardDescription className="text-sky-400/80">
                            A fábrica precisa de insumos (logos, credenciais) para o projeto '{projectForAssets.name}'.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <p className="text-sm">Existem {projectForAssets.assets.filter(a => a.status === 'pending').length} item(ns) pendente(s).</p>
                        <Button size="sm" onClick={() => setView('client_project_detail', { projectId: projectForAssets.id })}>Enviar Material</Button>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Produtos em Produção" value={activeProjects.length.toString()} icon='package' change='Linha de montagem ativa' />
                <MetricCard title='Faturas Pendentes' value={pendingInvoicesCount.toString()} icon='creditCard' change={pendingInvoicesValue.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} />
                <MetricCard title='Próxima Entrega' value='N/A' icon='truck' change='Módulo de Relatórios' />
                <MetricCard title='Mensagens' value='N/A' icon='messageSquare' change='Da engenharia' />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Linha de Produção (Seus Projetos)</CardTitle>
                            <CardDescription>Status em tempo real da fabricação.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {activeProjects.map(project => (
                                <div key={project.id}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h4 className="font-semibold">{project.name}</h4>
                                            <p className="text-sm text-text-secondary">Gerente: Carlos Silva</p> {/* Placeholder */}
                                        </div>
                                        <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">Em Andamento</Badge>
                                    </div>
                                    <Progress value={getProgressByStatus(project.status)} />
                                </div>
                            ))}
                            <Button variant="outline" className="w-full" onClick={() => setView('projects')}>Ver detalhes de todos</Button>
                        </CardContent>
                    </Card>

                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações Rápidas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full gap-2" onClick={() => setIsRequestingQuote(true)}><Icon name="plus" className="h-4 w-4"/>Nova Encomenda</Button>
                            <Button variant="outline" className="w-full gap-2" onClick={() => setView('messages')}><Icon name="messageSquare" className="h-4 w-4"/>Falar com Engenharia</Button>
                            <Button variant="outline" className="w-full gap-2" onClick={() => setView('support')}><Icon name="headphones" className="h-4 w-4"/>Suporte Técnico</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Faturas Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fatura</TableHead>
                                <TableHead>Projeto</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedInvoices.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.projectName}</TableCell>
                                    <TableCell className="text-text-secondary">{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{invoice.amount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</TableCell>
                                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => setView('invoice_detail', { invoiceId: invoice.id })}>
                                            <Icon name="eye" className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientDashboardPage;
