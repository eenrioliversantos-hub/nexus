import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent } from '../../ui/Card';
import { GoogleGenAI, Type } from "@google/genai";
import { Entity } from './Step8Entities';

interface Step22AnalyticsProps {
    data: {
        tools?: string[];
        kpis?: any[];
        events?: any[];
        dashboardWidgets?: string[];
        suggestedKpis?: string[];
        suggestedEvents?: string[];
    };
    setData: (data: any) => void;
    entities: Entity[];
    planningData: any;
}

const ANALYTICS_TOOLS = ["Google Analytics", "Mixpanel / Amplitude", "Hotjar / Clarity", "Sentry / LogRocket", "Internal Dashboard"];
const DASHBOARD_WIDGETS = ["KPIs principais", "Gráficos de tendência", "Comparativo de períodos", "Alertas e warnings", "Atividades recentes", "Metas vs Realizado"];

const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
        kpis: { type: Type.ARRAY, items: { type: Type.STRING } },
        events: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['kpis', 'events'],
};


const Step22Analytics: React.FC<Step22AnalyticsProps> = ({ data, setData, entities, planningData }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleToolChange = (tool: string) => {
        const newTools = (data.tools || []).includes(tool) ? (data.tools || []).filter(t => t !== tool) : [...(data.tools || []), tool];
        setData({ ...data, tools: newTools });
    };

    const handleWidgetChange = (widget: string) => {
        const newWidgets = (data.dashboardWidgets || []).includes(widget) ? (data.dashboardWidgets || []).filter(w => w !== widget) : [...(data.dashboardWidgets || []), widget];
        setData({ ...data, dashboardWidgets: newWidgets });
    };
    
    const handleSuggest = async () => {
        setIsLoading(true);
        try {
            if (!process.env.API_KEY) throw new Error("API_KEY do Gemini não configurada.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const entityNames = entities.map(e => e.name).join(', ');
            const objective = planningData?.step1?.mainObjective || 'aumentar a eficiência';

            const prompt = `Para um sistema com o objetivo de "${objective}" e com as entidades "${entityNames}", sugira 3 KPIs (Key Performance Indicators) e 3 eventos de usuário importantes para rastrear com analytics. Retorne um objeto JSON.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: suggestionSchema,
                },
            });
            
            const suggestions = JSON.parse(response.text);
            setData({ ...data, suggestedKpis: suggestions.kpis || [], suggestedEvents: suggestions.events || [] });

        } catch (error) {
            console.error("Erro ao sugerir KPIs e eventos:", error);
            alert("Falha ao obter sugestões da IA.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Label>Ferramentas de Analytics e Monitoramento</Label>
                <p className="text-sm text-text-secondary">Selecione quais ferramentas serão integradas.</p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {ANALYTICS_TOOLS.map(tool => (
                        <div key={tool} className="flex items-center space-x-2">
                            <Checkbox id={`tool-${tool}`} checked={(data.tools || []).includes(tool)} onChange={() => handleToolChange(tool)} />
                            <Label htmlFor={`tool-${tool}`} className="font-normal cursor-pointer">{tool}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 p-4 border border-card-border rounded-lg">
                <Label>10.2 Haverá dashboard executivo?</Label>
                 <div className="grid grid-cols-2 gap-4 pt-2">
                    {DASHBOARD_WIDGETS.map(widget => (
                        <div key={widget} className="flex items-center space-x-2">
                            <Checkbox id={`widget-${widget}`} checked={(data.dashboardWidgets || []).includes(widget)} onChange={() => handleWidgetChange(widget)} />
                            <Label htmlFor={`widget-${widget}`} className="font-normal cursor-pointer">{widget}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <Card className="bg-sidebar/50">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <Label>Sugestões de IA para KPIs e Eventos</Label>
                            <p className="text-sm text-text-secondary">Use a IA para obter ideias de métricas importantes.</p>
                        </div>
                        <Button variant="outline" onClick={handleSuggest} disabled={isLoading}>
                             <Icon name={isLoading ? 'spinner' : 'sparkles'} className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Sugerir KPIs e Eventos
                        </Button>
                    </div>
                    {(data.suggestedKpis || data.suggestedEvents) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-card-border">
                            <div>
                                <h4 className="font-semibold mb-2">KPIs Sugeridos</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {(data.suggestedKpis || []).map((kpi: string, i: number) => <li key={i}>{kpi}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Eventos Sugeridos</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {(data.suggestedEvents || []).map((event: string, i: number) => <li key={i}>{event}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Step22Analytics;