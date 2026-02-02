import React from 'react';
import { Label } from '../../ui/Label';
import { Checkbox } from '../../ui/Checkbox';
import { Button } from '../../ui/Button';
import { Card, CardContent } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import Icon from '../../shared/Icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Switch } from '../../ui/Switch';
import { Endpoint } from './Step13ApiEndpoints';

interface NotificationEvent {
    id: string;
    name: string;
    description: string;
    channels: string[];
    recipient: string;
    template: string;
    apiEndpointId?: string;
}

interface Step19NotificationsProps {
    data: {
        channels?: string[];
        events?: NotificationEvent[];
        chatEnabled?: boolean;
        chatFeatures?: string[];
    };
    setData: (data: any) => void;
    endpoints: Endpoint[];
}

const CHANNEL_OPTIONS = ["In-app (dentro do sistema)", "E-mail", "Push notification (mobile/web)", "SMS", "WhatsApp"];
const RECIPIENT_OPTIONS = ["User who triggered event", "Project Manager", "Team Members", "All Admins"];
const CHAT_FEATURES_OPTIONS = ["Chat 1:1", "Chat em grupo", "Envio de arquivos", "Emojis/Reações", "Histórico de mensagens"];

const Step19Notifications: React.FC<Step19NotificationsProps> = ({ data, setData, endpoints }) => {
    const channels = data.channels || [];
    const events = data.events || [];

    const handleDataChange = (field: string, value: any) => {
        setData({ ...data, [field]: value });
    };

    const handleChannelChange = (channel: string) => {
        const newChannels = channels.includes(channel)
            ? channels.filter(c => c !== channel)
            : [...channels, channel];
        handleDataChange('channels', newChannels);
    };
    
    const handleChatFeatureChange = (feature: string) => {
        const currentFeatures = data.chatFeatures || [];
        const newFeatures = currentFeatures.includes(feature)
            ? currentFeatures.filter(item => item !== feature)
            : [...currentFeatures, feature];
        handleDataChange('chatFeatures', newFeatures);
    };

    const handleAddEvent = () => {
        const newEvent: NotificationEvent = { id: Date.now().toString(), name: '', description: '', channels: [], recipient: '', template: '' };
        handleDataChange('events', [...events, newEvent]);
    };

    const handleRemoveEvent = (id: string) => {
        handleDataChange('events', events.filter(e => e.id !== id));
    };
    
    const handleEventChange = (id: string, field: keyof NotificationEvent, value: any) => {
        const updatedEvents = events.map(e => (e.id === id ? { ...e, [field]: value } : e));
        handleDataChange('events', updatedEvents);
    };
    
    const handleEventChannelChange = (id: string, channel: string) => {
        const event = events.find(e => e.id === id);
        if (!event) return;
        const newChannels = event.channels.includes(channel) ? event.channels.filter(c => c !== channel) : [...event.channels, channel];
        handleEventChange(id, 'channels', newChannels);
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Label>9.1 O sistema enviará notificações?</Label>
                <p className="text-sm text-text-secondary">Selecione por quais canais o sistema poderá se comunicar com os usuários.</p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    {CHANNEL_OPTIONS.map(channel => (
                        <div key={channel} className="flex items-center space-x-2">
                            <Checkbox id={`channel-${channel}`} checked={channels.includes(channel)} onCheckedChange={() => handleChannelChange(channel)} />
                            <Label htmlFor={`channel-${channel}`} className="font-normal cursor-pointer">{channel}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <Label>9.2 Quais eventos dispararão notificações?</Label>
                <p className="text-sm text-text-secondary">Defina os gatilhos que enviarão notificações.</p>
                
                <div className="space-y-4">
                    {events.map(event => (
                        <Card key={event.id} className="bg-sidebar/50">
                            <CardContent className="p-4">
                               <div className="flex justify-between items-start">
                                 <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Nome do Evento</Label><Input placeholder="Ex: Novo Cadastro" value={event.name} onChange={e => handleEventChange(event.id, 'name', e.target.value)} /></div>
                                        <div className="space-y-1.5"><Label>Gatilho da API (Opcional)</Label><Select value={event.apiEndpointId} onValueChange={v => handleEventChange(event.id, 'apiEndpointId', v)}><SelectTrigger><SelectValue placeholder="Vincular a um endpoint..." /></SelectTrigger><SelectContent>{endpoints.map(ep => <SelectItem key={ep.id} value={ep.id}>{`${ep.method} ${ep.path}`}</SelectItem>)}</SelectContent></Select></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5"><Label>Destinatário</Label><Select value={event.recipient} onValueChange={v => handleEventChange(event.id, 'recipient', v)}><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent>{RECIPIENT_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></div>
                                        <div className="space-y-1.5"><Label>Descrição</Label><Input placeholder="Ex: Quando um novo usuário se cadastra." value={event.description} onChange={e => handleEventChange(event.id, 'description', e.target.value)} /></div>
                                    </div>
                                    <div className="space-y-1.5"><Label>Template da Mensagem</Label><Textarea placeholder="Olá {userName}, bem-vindo!" value={event.template} onChange={e => handleEventChange(event.id, 'template', e.target.value)} /></div>
                                     <div className="space-y-2"><Label>Canais para este evento</Label><div className="flex flex-wrap gap-4 pt-1">{channels.map(channel => (<div key={channel} className="flex items-center space-x-2"><Checkbox id={`event-${event.id}-channel-${channel}`} checked={event.channels.includes(channel)} onCheckedChange={() => handleEventChannelChange(event.id, channel)} /><Label htmlFor={`event-${event.id}-channel-${channel}`} className="font-normal cursor-pointer">{channel}</Label></div>))}</div></div>
                                 </div>
                                 <Button variant="ghost" size="sm" onClick={() => handleRemoveEvent(event.id)}><Icon name="trash" className="h-4 w-4 text-red-500" /></Button>
                               </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Button variant="outline" onClick={handleAddEvent}><Icon name="plus" className="h-4 w-4 mr-2" />Adicionar Evento de Notificação</Button>
            </div>
            
             <div className="space-y-4 p-4 border border-card-border rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <Label>9.3 Haverá chat ou mensagens entre usuários?</Label>
                        <p className="text-sm text-text-secondary">Permitir que usuários se comuniquem dentro da plataforma.</p>
                    </div>
                    <Switch checked={data.chatEnabled} onCheckedChange={(c) => handleDataChange('chatEnabled', c)} />
                </div>
                {data.chatEnabled && (
                    <div className="pt-4 border-t border-card-border/50">
                        <Label>Características do Chat</Label>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            {CHAT_FEATURES_OPTIONS.map(feature => (
                                <div key={feature} className="flex items-center space-x-2">
                                    <Checkbox id={`chat-feat-${feature}`} checked={(data.chatFeatures || []).includes(feature)} onCheckedChange={() => handleChatFeatureChange(feature)} />
                                    <Label htmlFor={`chat-feat-${feature}`} className="font-normal cursor-pointer">{feature}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step19Notifications;