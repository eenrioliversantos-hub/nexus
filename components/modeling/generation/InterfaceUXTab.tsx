
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import Icon from '../../shared/Icon';

interface InterfaceUXTabProps {
    wizardData: any;
}

const InterfaceUXTab: React.FC<InterfaceUXTabProps> = ({ wizardData }) => {
    // Correctly navigate the nested structure: interface_ux contains the steps
    const interfaceData = wizardData?.interface_ux || {};
    const layoutData = interfaceData.step17 || {};
    const themeData = interfaceData.step18 || {};
    const screensData = interfaceData.step15 || { screens: [] };
    const componentsData = interfaceData.step16 || { components: {} };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Layout Principal & Tema</CardTitle>
                    <CardDescription>Estrutura base e identidade visual da aplicação.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Navegação</p>
                            <p className="font-semibold">{layoutData.navigation || 'Padrão'}</p>
                        </div>
                         <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Posição do Perfil</p>
                            <p className="font-semibold">{layoutData.profilePosition || 'Topo'}</p>
                        </div>
                         <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Tema Base</p>
                            <p className="font-semibold">{layoutData.theme || 'Escuro'}</p>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-sidebar/50 rounded-lg flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full border border-white/10" style={{ backgroundColor: themeData.primaryColor || '#38bdf8' }} />
                            <div>
                                <p className="text-sm text-text-secondary">Cor Primária</p>
                                <p className="font-semibold">{themeData.primaryColor || '#38bdf8'}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Família Tipográfica</p>
                            <p className="font-semibold">{themeData.fontFamily || 'Inter'}</p>
                        </div>
                         <div className="p-4 bg-sidebar/50 rounded-lg">
                            <p className="text-sm text-text-secondary">Espaçamento / Raio</p>
                            <p className="font-semibold">{themeData.baseSpacing || '8'}px / {themeData.borderRadius || '0.5'}rem</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Telas & Componentes</CardTitle>
                    <CardDescription>Páginas definidas e seus principais componentes de interface.</CardDescription>
                </CardHeader>
                <CardContent>
                    {screensData.screens && screensData.screens.length > 0 ? (
                         <ul className="space-y-4">
                            {screensData.screens.map((screen: any) => (
                                <li key={screen.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-accent">{screen.path}</h4>
                                            <p className="text-sm text-text-secondary">{screen.description}</p>
                                            <Badge variant="outline" className="mt-2 text-[10px]">Layout: {screen.layout}</Badge>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-card-border/50">
                                         <h5 className="text-xs font-bold uppercase text-text-secondary mb-2">Componentes UI:</h5>
                                         {(componentsData.components && componentsData.components[screen.id] && componentsData.components[screen.id].length > 0) ? (
                                            <div className="flex flex-wrap gap-2">
                                                {componentsData.components[screen.id].map((comp: any) => (
                                                    <Badge key={comp.id} variant="secondary" className="text-[10px]">{comp.type}</Badge>
                                                ))}
                                            </div>
                                         ) : (
                                            <p className="text-xs text-text-secondary italic">Nenhum componente específico definido.</p>
                                         )}
                                    </div>
                                </li>
                            ))}
                         </ul>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed border-card-border rounded-lg bg-sidebar/20">
                            <Icon name="layout" className="h-8 w-8 mx-auto mb-2 text-text-secondary" />
                            <p className="text-text-secondary">Nenhuma tela foi modelada nesta sessão.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default InterfaceUXTab;
