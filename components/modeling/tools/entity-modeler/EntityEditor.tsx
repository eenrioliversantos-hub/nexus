import React, { useState, useCallback, useEffect } from 'react';
import Icon from './Icon';
import type { Entity } from '../../../../lib/entity-modeler/types';
import {
  dataTypes,
  httpMethods,
  authLevels,
  policyTypes,
  validationRules,
  structureTypes,
  logicalOptions,
  physicalOptions,
  complexityOptions,
  natureOptions,
  allocationOptions
} from '../../../../lib/entity-modeler/constants';
import CodeGenerator from './CodeGenerator';
import { Button } from '../../../ui/Button';
import { Input } from '../../../ui/Input';
import { Textarea } from '../../../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/Select';
import { Switch } from '../../../ui/Switch';
import { Checkbox } from '../../../ui/Checkbox';


interface EntityEditorProps {
  initialEntity: Entity;
  allEntities: Entity[];
  onSave: (entity: Entity) => void;
}

const TabButton: React.FC<{ iconName: string; title: string; isActive: boolean; onClick: () => void; }> = ({ iconName, title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 whitespace-nowrap
      ${isActive
                ? 'bg-card border-b-2 border-accent text-accent'
                : 'text-text-secondary hover:bg-sidebar'
            }`}
    >
        <Icon name={iconName} className="w-4 h-4" />
        <span>{title}</span>
    </button>
);

const SectionCard: React.FC<{ title: string, children: React.ReactNode, iconName?: string, className?: string }> = ({ title, children, iconName, className }) => (
  <div className={`bg-card p-6 rounded-xl shadow-lg border border-card-border ${className}`}>
    <h3 className="text-xl font-bold mb-4 text-text-primary flex items-center border-b border-card-border pb-2">
      {iconName && <Icon name={iconName} className="w-5 h-5 mr-2 text-accent" />}
      {title}
    </h3>
    {children}
  </div>
);

const AdvancedDataStructureModal: React.FC<{ entity: Entity, setEntity: React.Dispatch<React.SetStateAction<Entity>>, onClose: () => void }> = ({ entity, setEntity, onClose }) => {
  const ds = entity.dataStructure;
  const [currentDs, setCurrentDs] = useState(ds);

  const handleSave = () => {
    setEntity(prev => ({
        ...prev,
        dataStructure: currentDs
    }));
    onClose();
  };
  
  const handleAddOperation = () => {
    setCurrentDs(prev => ({
        ...prev,
        keyOperations: [...prev.keyOperations, 'Nova Operação O(?)']
    }));
  };

  const handleUpdateOperation = (index: number, value: string) => {
    const newOps = [...currentDs.keyOperations];
    newOps[index] = value;
    setCurrentDs(prev => ({ ...prev, keyOperations: newOps }));
  };

  const handleRemoveOperation = (index: number) => {
    const newOps = currentDs.keyOperations.filter((_, i) => i !== index);
    setCurrentDs(prev => ({ ...prev, keyOperations: newOps }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-2xl rounded-xl bg-card border-card-border m-4">
        <div className="flex justify-between items-center border-b border-card-border pb-3 mb-4">
          <h3 className="text-2xl font-bold text-accent flex items-center">
            <Icon name="info" className="w-6 h-6 mr-2" /> Atributos Avançados da Estrutura de Dados
          </h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <Icon name="x" className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-text-secondary mb-6">Defina as características de baixo nível desta entidade para otimização e planejamento de eficiência.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-card-border pb-1">Organização Física e Lógica</h4>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Tipo de Estrutura Principal</span>
              <Select value={currentDs.type} onValueChange={(v) => setCurrentDs(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{structureTypes.map(type => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent>
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Organização Lógica</span>
              <Select value={currentDs.logicalOrganization} onValueChange={(v) => setCurrentDs(p => ({ ...p, logicalOrganization: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{logicalOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Organização Física</span>
               <Select value={currentDs.physicalOrganization} onValueChange={(v) => setCurrentDs(p => ({ ...p, physicalOrganization: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{physicalOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary border-b border-card-border pb-1">Eficiência (Big O) e Classificação</h4>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Complexidade Temporal (Busca)</span>
              <Select value={currentDs.timeComplexity} onValueChange={(v) => setCurrentDs(p => ({...p, timeComplexity: v}))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{complexityOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Classificação por Natureza</span>
              <Select value={currentDs.classificationNature} onValueChange={(v) => setCurrentDs(p => ({ ...p, classificationNature: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{natureOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
             <label className="block space-y-1">
              <span className="text-sm font-medium text-text-secondary">Classificação por Alocação</span>
              <Select value={currentDs.classificationAllocation} onValueChange={(v) => setCurrentDs(p => ({ ...p, classificationAllocation: v }))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{allocationOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </label>
          </div>

          <div className="space-y-4 bg-background p-4 rounded-lg border border-card-border">
            <h4 className="font-semibold text-text-primary border-b border-card-border pb-1">Operações Suportadas</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {currentDs.keyOperations.map((op, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Input type="text" value={op} onChange={(e) => handleUpdateOperation(index, e.target.value)} placeholder="Ex: Inserção O(n)" />
                         <Button variant="ghost" size="sm" onClick={() => handleRemoveOperation(index)} title="Remover Operação">
                            <Icon name="trash2" className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleAddOperation} className="w-full">
                <Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Operação
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-card-border flex justify-end">
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Icon name="check" className="w-5 h-5 mr-2" /> Salvar Configuração Avançada
          </Button>
        </div>
      </div>
    </div>
  );
};

const EntityEditor: React.FC<EntityEditorProps> = ({ initialEntity, allEntities, onSave }) => {
  const [entity, setEntity] = useState(initialEntity);
  const [activeTab, setActiveTab] = useState('schema');
  const [showAdvancedDataStructure, setShowAdvancedDataStructure] = useState(false);

  useEffect(() => {
    onSave(entity);
  }, [entity, onSave]);

  const updateEntity = useCallback((key: keyof Entity, value: any) => {
    setEntity(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedProperty = useCallback((keys: string[], value: any) => {
      setEntity(prev => {
          let current = prev;
          for (let i = 0; i < keys.length - 1; i++) {
              current = current[keys[i] as keyof typeof current];
          }
          current[keys[keys.length - 1] as keyof typeof current] = value;
          return { ...prev };
      });
  }, []);

  const updateNestedList = useCallback((listName: string, id: number, key: string, value: any, parentKey: string | null = null) => {
    setEntity(prev => {
      const parent = parentKey ? (prev as any)[parentKey] : prev;
      if (!Array.isArray(parent[listName])) {
        // Handle non-array nested objects like retentionPolicy
        if (parentKey) {
            return { ...prev, [parentKey]: { ...(prev as any)[parentKey], [listName]: { ...parent[listName], [key]: value } } };
        }
        return { ...prev, [listName]: { ...parent[listName], [key]: value } };
      }

      const newList = parent[listName].map((item: { id: number }) =>
        item.id === id ? { ...item, [key]: value } : item
      );
      return parentKey
        ? { ...prev, [parentKey]: { ...(prev as any)[parentKey], [listName]: newList } }
        : { ...prev, [listName]: newList };
    });
  }, []);

  const addNestedItem = useCallback((listName: string, initialData: any, parentKey: string | null = null) => {
    setEntity(prev => {
      const list = parentKey ? (prev as any)[parentKey][listName] : (prev as any)[listName];
      const newId = Math.max(0, ...(list || []).map((a: {id: number}) => a.id)) + 1;
      const newList = [...(list || []), { id: newId, ...initialData }];

      return parentKey
        ? { ...prev, [parentKey]: { ...(prev as any)[parentKey], [listName]: newList } }
        : { ...prev, [listName]: newList };
    });
  }, []);

  const removeNestedItem = useCallback((listName: string, id: number, parentKey: string | null = null) => {
    setEntity(prev => {
      const list = parentKey ? (prev as any)[parentKey][listName] : (prev as any)[listName];
      const newList = list.filter((item: {id: number}) => item.id !== id);

      return parentKey
        ? { ...prev, [parentKey]: { ...(prev as any)[parentKey], [listName]: newList } }
        : { ...prev, [listName]: newList };
    });
  }, []);

  const renderSchemaTab = () => (
    <div className="space-y-6">
      <SectionCard title="Identidade Geral" iconName="list">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-sm font-medium text-text-secondary">Nome (Exibição)</label><Input value={entity.name} onChange={(e) => updateEntity('name', e.target.value)} placeholder="Ex: Cliente" /></div>
          <div className="space-y-1"><label className="text-sm font-medium text-text-secondary">Nome Físico (Tabela)</label><Input value={entity.physicalName} onChange={(e) => updateEntity('physicalName', e.target.value)} placeholder="Ex: clientes_tab" /></div>
        </div>
        <div className="mt-4 p-4 border border-accent/30 rounded-lg bg-sidebar/50 flex justify-between items-center">
            <div className="text-sm text-accent/80"><strong>Estrutura Lógica:</strong> {entity.dataStructure.type} ({entity.dataStructure.logicalOrganization}) - <strong>Complexidade:</strong> {entity.dataStructure.timeComplexity}</div>
            <Button onClick={() => setShowAdvancedDataStructure(true)} variant="outline" size="sm"><Icon name="info" className="w-4 h-4 mr-2" />Atributos Avançados</Button>
        </div>
      </SectionCard>
      
      <SectionCard title="Estrutura de Dados (Atributos)" iconName="grid">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-card-border">
            <thead className="bg-sidebar/50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase">Campo</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary uppercase">Tipo</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-text-secondary uppercase">PK/NN</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-text-secondary uppercase">Único</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-text-secondary uppercase">Busca</th>
                <th className="px-3 py-3 text-right text-xs font-medium text-text-secondary uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-card-border">
              {entity.attributes.map((attr) => (
                <tr key={attr.id} className="hover:bg-sidebar/50 transition-colors">
                  <td className="p-2 whitespace-nowrap"><Input value={attr.name} onChange={(e) => updateNestedList('attributes', attr.id, 'name', e.target.value)} /></td>
                  <td className="p-2 whitespace-nowrap"><Select value={attr.type} onValueChange={(v) => updateNestedList('attributes', attr.id, 'type', v)}><SelectTrigger/><SelectContent>{dataTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></td>
                  <td className="p-2 whitespace-nowrap text-center space-x-2"><Checkbox checked={attr.isPK} onCheckedChange={c => updateNestedList('attributes', attr.id, 'isPK', c)} title="Primary Key" /><Checkbox checked={attr.isNN || attr.isPK} disabled={attr.isPK} onCheckedChange={c => updateNestedList('attributes', attr.id, 'isNN', c)} title="Not Null" /></td>
                  <td className="p-2 whitespace-nowrap text-center"><Checkbox checked={attr.isUnique || attr.isPK} disabled={attr.isPK} onCheckedChange={c => updateNestedList('attributes', attr.id, 'isUnique', c)} /></td>
                  <td className="p-2 whitespace-nowrap text-center"><Checkbox checked={attr.isSearchable} onCheckedChange={c => updateNestedList('attributes', attr.id, 'isSearchable', c)} /></td>
                  <td className="p-2 whitespace-nowrap text-right"><Button variant="ghost" size="sm" onClick={() => removeNestedItem('attributes', attr.id)}><Icon name="trash2" className="w-4 h-4 text-red-500" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('attributes', { name: 'novo_campo', type: 'VARCHAR', isPK: false, isNN: false, isUnique: false, length: '255', isSearchable: false })}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Atributo</Button>
      </SectionCard>
      
      <SectionCard title="Relacionamentos (Chaves Estrangeiras)" iconName="link">
        <div className="space-y-3">
          {entity.relationships.map((rel) => (
            <div key={rel.id} className="p-3 border border-pink-500/20 rounded-lg bg-sidebar/50 flex items-center justify-between text-sm">
                <Input value={rel.name} onChange={e => updateNestedList('relationships', rel.id, 'name', e.target.value)} className="font-semibold" />
                <Select value={rel.type} onValueChange={(v) => updateNestedList('relationships', rel.id, 'type', v)}><SelectTrigger/><SelectContent><SelectItem value="1:1">1:1</SelectItem><SelectItem value="1:N">1:N</SelectItem><SelectItem value="N:1">N:1</SelectItem><SelectItem value="N:N">N:N</SelectItem></SelectContent></Select>
                <Input value={rel.fkField} onChange={e => updateNestedList('relationships', rel.id, 'fkField', e.target.value)} placeholder="fk_id" />
                <Select value={rel.targetEntity} onValueChange={(v) => updateNestedList('relationships', rel.id, 'targetEntity', v)}><SelectTrigger/><SelectContent>{allEntities.map(e => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}</SelectContent></Select>
                <Button variant="ghost" size="sm" onClick={() => removeNestedItem('relationships', rel.id)} title="Remover"><Icon name="trash2" className="w-4 h-4 text-red-500" /></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('relationships', { name: 'novo_rel', targetEntity: '', type: '1:N', fkField: 'fk_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Relacionamento</Button>
      </SectionCard>
    </div>
  );

  const renderEndpointsTab = () => (
    <div className="space-y-6">
      <SectionCard title="Configuração de Rotas e Endpoints (CRUD)" iconName="server">
        <div className="space-y-4">
          {entity.endpoints.map((ep) => (
            <div key={ep.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50 flex items-center justify-between">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <Input value={ep.operation} onChange={(e) => updateNestedList('endpoints', ep.id, 'operation', e.target.value)} placeholder="Operação"/>
                <Select value={ep.method} onValueChange={(v) => updateNestedList('endpoints', ep.id, 'method', v)}><SelectTrigger/><SelectContent>{httpMethods.map(m => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent></Select>
                <Input value={ep.path} onChange={(e) => updateNestedList('endpoints', ep.id, 'path', e.target.value)} placeholder="/caminho"/>
                <Select value={ep.auth} onValueChange={(v) => updateNestedList('endpoints', ep.id, 'auth', v)}><SelectTrigger/><SelectContent>{authLevels.map(a => (<SelectItem key={a} value={a}>{a}</SelectItem>))}</SelectContent></Select>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeNestedItem('endpoints', ep.id)}><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('endpoints', { operation: 'NOVA AÇÃO', method: 'GET', path: '/nova-acao', auth: 'AUTHENTICATED' })}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Endpoint</Button>
      </SectionCard>
    </div>
  );
  
  const renderActionsTab = () => (
    <div className="space-y-6">
      <SectionCard title="Ações Personalizadas (Métodos de Negócio)" iconName="zap">
        <div className="space-y-4">
          {entity.actions.map((act) => (
            <div key={act.id} className="p-4 border border-blue-500/20 rounded-lg bg-sidebar/50">
              <div className="flex justify-between items-start mb-3">
                <Input value={act.name} onChange={(e) => updateNestedList('actions', act.id, 'name', e.target.value)} className="text-lg font-semibold" placeholder="Nome da Ação"/>
                <Button variant="ghost" size="sm" onClick={() => removeNestedItem('actions', act.id)}><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs text-text-secondary">Método HTTP</label><Select value={act.method} onValueChange={(v) => updateNestedList('actions', act.id, 'method', v)}><SelectTrigger/><SelectContent>{httpMethods.map(m => (<SelectItem key={m} value={m}>{m}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Rota</label><Input value={act.route} onChange={(e) => updateNestedList('actions', act.id, 'route', e.target.value)} placeholder="/custom-route"/></div>
              </div>
              <div className="mt-4 space-y-1"><label className="text-xs text-text-secondary">Descrição</label><Textarea value={act.description} onChange={(e) => updateNestedList('actions', act.id, 'description', e.target.value)} rows="2" placeholder="Descreva a ação e campos requeridos..."/></div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('actions', { name: 'nova_acao', description: '', method: 'POST', route: '', requiredFields: [] })}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Ação</Button>
      </SectionCard>
    </div>
  );

  const renderLifecycleTab = () => (
    <div className="space-y-6">
      <SectionCard title="Gerenciamento de Ciclo de Vida (Status)" iconName="gitBranch">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1"><label className="text-sm font-medium text-text-secondary">Campo de Status</label><Input value={entity.lifecycle.statusField} onChange={(e) => updateNestedProperty(['lifecycle', 'statusField'], e.target.value)} placeholder="Ex: status"/></div>
          <div className="space-y-1"><label className="text-sm font-medium text-text-secondary">Status Inicial</label><Input value={entity.lifecycle.defaultStatus} onChange={(e) => updateNestedProperty(['lifecycle', 'defaultStatus'], e.target.value)} placeholder="Ex: PENDENTE"/></div>
        </div>
        <h4 className="font-semibold text-text-primary mb-3">Transições de Estado</h4>
        <div className="space-y-3">
          {entity.lifecycle.transitions.map((t, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-background border border-card-border rounded-md">
               <Input value={t.from} onChange={(e) => { const newT = [...entity.lifecycle.transitions]; newT[index].from = e.target.value; updateNestedProperty(['lifecycle', 'transitions'], newT); }} placeholder="De"/>
               <Icon name="cornerDownRight" className="w-4 h-4 text-accent" />
               <Input value={t.to} onChange={(e) => { const newT = [...entity.lifecycle.transitions]; newT[index].to = e.target.value; updateNestedProperty(['lifecycle', 'transitions'], newT); }} placeholder="Para"/>
               <Input value={t.event} onChange={(e) => { const newT = [...entity.lifecycle.transitions]; newT[index].event = e.target.value; updateNestedProperty(['lifecycle', 'transitions'], newT); }} placeholder="Evento Gatilho"/>
               <Button variant="ghost" size="sm" onClick={() => { const newT = entity.lifecycle.transitions.filter((_, i) => i !== index); updateNestedProperty(['lifecycle', 'transitions'], newT); }}><Icon name="x" className="w-4 h-4 text-red-400"/></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => { const newT = { from: '', to: '', event: '' }; updateNestedProperty(['lifecycle', 'transitions'], [...entity.lifecycle.transitions, newT]); }}><Icon name="plus" className="w-4 h-4 mr-1" /> Adicionar Transição</Button>
        </div>
      </SectionCard>
    </div>
  );
  
  const renderSecurityTab = () => (
    <div className="space-y-6">
      <SectionCard title="Regras de Acesso Fino (RLS / Políticas)" iconName="lock">
        <div className="space-y-4">
          {entity.security.policies.map((p) => (
            <div key={p.id} className="p-4 border border-purple-500/20 rounded-lg bg-sidebar/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="space-y-1"><label className="text-xs text-text-secondary">Tipo</label><Select value={p.type} onValueChange={(v) => updateNestedList('policies', p.id, 'type', v, 'security')}><SelectTrigger/><SelectContent>{policyTypes.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent></Select></div>
                    <div className="space-y-1"><label className="text-xs text-text-secondary">Roles (separados por vírgula)</label><Input value={p.roles.join(', ')} onChange={(e) => updateNestedList('policies', p.id, 'roles', e.target.value.split(',').map(s=>s.trim()), 'security')} /></div>
                    <Button variant="ghost" size="sm" onClick={() => removeNestedItem('policies', p.id, 'security')} className="self-end mb-1"><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
                </div>
                <div className="mt-3 space-y-1"><label className="text-xs text-text-secondary">Condição (SQL/DSL)</label><Input value={p.condition} onChange={(e) => updateNestedList('policies', p.id, 'condition', e.target.value, 'security')} placeholder="Ex: user_id = created_by_id" className="font-mono"/></div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('policies', { type: 'SELECT', condition: 'true', roles: ['PUBLIC'], description: '' }, 'security')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Política</Button>
      </SectionCard>
      <SectionCard title="Regras de Validação de Dados" iconName="check">
        <div className="space-y-4">
          {entity.security.validationRules.map((r) => (
            <div key={r.id} className="p-4 border border-green-500/20 rounded-lg bg-sidebar/50 flex items-center justify-between">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <Select value={r.field} onValueChange={v => updateNestedList('validationRules', r.id, 'field', v, 'security')}><SelectTrigger/><SelectContent>{entity.attributes.map(a => <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>)}</SelectContent></Select>
                <Select value={r.rule} onValueChange={v => updateNestedList('validationRules', r.id, 'rule', v, 'security')}><SelectTrigger/><SelectContent>{validationRules.map(ruleName => (<SelectItem key={ruleName} value={ruleName}>{ruleName}</SelectItem>))}</SelectContent></Select>
                <Input value={String(r.value)} onChange={(e) => updateNestedList('validationRules', r.id, 'value', e.target.value, 'security')} placeholder="Valor"/>
                <Input value={r.message} onChange={(e) => updateNestedList('validationRules', r.id, 'message', e.target.value, 'security')} placeholder="Mensagem de Erro"/>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeNestedItem('validationRules', r.id, 'security')} className="ml-4"><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('validationRules', { field: '', rule: 'MIN_LENGTH', value: 1, message: '' }, 'security')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Regra</Button>
      </SectionCard>
      
      <SectionCard title="Configurações de Auditoria e Versionamento" iconName="shield">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 bg-sidebar/50 p-4 rounded-lg">
            <Switch id="hasAudit" checked={entity.security.hasAudit} onCheckedChange={(c) => updateNestedProperty(['security', 'hasAudit'], c)} />
            <label htmlFor="hasAudit" className="font-medium cursor-pointer">Ativar Auditoria (created_at/updated_at)</label>
          </div>
          <div className="flex items-center space-x-3 bg-sidebar/50 p-4 rounded-lg">
            <Switch id="isVersioned" checked={entity.security.isVersioned} onCheckedChange={(c) => updateNestedProperty(['security', 'isVersioned'], c)} />
            <label htmlFor="isVersioned" className="font-medium cursor-pointer">Ativar Versionamento (Otimista)</label>
          </div>
        </div>
      </SectionCard>
    </div>
  );

  const renderIntegrationTab = () => (
    <div className="space-y-6">
        <SectionCard title="Fluxo de Dados & Exposição (UI)" iconName="trendingUp">
            <div className="space-y-4">
                {entity.integration.exposureChannels.map((ec) => (
                    <div key={ec.id} className="p-4 border border-yellow-500/20 rounded-lg bg-sidebar/50">
                        <div className="flex justify-between items-start mb-3">
                            <Input value={ec.channel} onChange={(e) => updateNestedList('exposureChannels', ec.id, 'channel', e.target.value, 'integration')} className="text-lg font-semibold" placeholder="Nome do Canal"/>
                            <Button variant="ghost" size="sm" onClick={() => removeNestedItem('exposureChannels', ec.id, 'integration')}><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
                        </div>
                        <div className="space-y-1"><label className="text-xs text-text-secondary">Campos Expostos (separados por vírgula)</label><Input value={ec.dataFields.join(', ')} onChange={(e) => updateNestedList('exposureChannels', ec.id, 'dataFields', e.target.value.split(',').map(s=>s.trim()), 'integration')} placeholder="id, nome, email, * para todos"/></div>
                        <div className="space-y-1 mt-2"><label className="text-xs text-text-secondary">Descrição</label><Textarea value={ec.description} onChange={(e) => updateNestedList('exposureChannels', ec.id, 'description', e.target.value, 'integration')} rows={1} placeholder="Onde esses dados são usados."/></div>
                    </div>
                ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('exposureChannels', { channel: 'Novo Canal', description: '', dataFields: ['*'] }, 'integration')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Canal de Exposição</Button>
        </SectionCard>

        <SectionCard title="Navegação Front-end" iconName="layout">
            <div className="space-y-4">
                {entity.integration.frontendRoutes.map((fr) => (
                    <div key={fr.id} className="p-4 border border-blue-500/20 rounded-lg bg-sidebar/50">
                        <div className="flex justify-between items-start mb-3">
                            <Input value={fr.name} onChange={(e) => updateNestedList('frontendRoutes', fr.id, 'name', e.target.value, 'integration')} className="text-lg font-semibold" placeholder="Nome da Rota"/>
                            <Button variant="ghost" size="sm" onClick={() => removeNestedItem('frontendRoutes', fr.id, 'integration')}><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1"><label className="text-xs text-text-secondary">Caminho (Path)</label><Input value={fr.path} onChange={(e) => updateNestedList('frontendRoutes', fr.id, 'path', e.target.value, 'integration')} className="font-mono" placeholder="/app/rota"/></div>
                            <div className="space-y-1"><label className="text-xs text-text-secondary">Componente UI</label><Input value={fr.component} onChange={(e) => updateNestedList('frontendRoutes', fr.id, 'component', e.target.value, 'integration')} placeholder="Componente.jsx"/></div>
                            <div className="space-y-1"><label className="text-xs text-text-secondary">Roles de Acesso</label><Input value={fr.roles.join(', ')} onChange={(e) => updateNestedList('frontendRoutes', fr.id, 'roles', e.target.value.split(',').map(s=>s.trim()), 'integration')} placeholder="ADMIN, USER"/></div>
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('frontendRoutes', { name: 'Nova Rota', path: '/nova/rota', roles: ['PUBLIC'], component: 'NewComponent' }, 'integration')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Rota Front-end</Button>
        </SectionCard>
    </div>
  );
  
  const renderDataGovernanceTab = () => (
    <div className="space-y-6">
      <SectionCard title="Estratégia de Indexação Explícita" iconName="server">
        <div className="space-y-4">
          {entity.indexing.customIndexes.map((idx) => (
            <div key={idx.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50 flex items-center justify-between">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <Input value={idx.name} onChange={(e) => updateNestedList('customIndexes', idx.id, 'name', e.target.value, 'indexing')} placeholder="Nome do Índice"/>
                <Input value={idx.fields.join(', ')} onChange={(e) => updateNestedList('customIndexes', idx.id, 'fields', e.target.value.split(',').map(s=>s.trim()), 'indexing')} placeholder="Campos"/>
                <Input value={idx.type} onChange={(e) => updateNestedList('customIndexes', idx.id, 'type', e.target.value, 'indexing')} placeholder="Tipo (BTREE)"/>
                <Input value={idx.notes} onChange={(e) => updateNestedList('customIndexes', idx.id, 'notes', e.target.value, 'indexing')} placeholder="Notas"/>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeNestedItem('customIndexes', idx.id, 'indexing')}><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('customIndexes', { name: '', fields: [], type: 'BTREE', notes: '' }, 'indexing')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Índice</Button>
      </SectionCard>
      
      <SectionCard title="Governança de Dados" iconName="shield">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-sidebar/50 p-4 rounded-lg border border-card-border space-y-3">
                <h4 className="font-semibold text-text-primary">Política de Retenção</h4>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Tipo</label><Select value={entity.dataGovernance.retentionPolicy.type} onValueChange={(v) => updateNestedProperty(['dataGovernance', 'retentionPolicy', 'type'], v)}><SelectTrigger/><SelectContent><SelectItem value="NONE">Nenhuma</SelectItem><SelectItem value="SOFT_DELETE">Soft Delete</SelectItem><SelectItem value="HARD_DELETE">Hard Delete</SelectItem></SelectContent></Select></div>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Após (Dias)</label><Input type="number" value={entity.dataGovernance.retentionPolicy.afterDays} onChange={(e) => updateNestedProperty(['dataGovernance', 'retentionPolicy', 'afterDays'], Number(e.target.value))} /></div>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Notas</label><Textarea value={entity.dataGovernance.retentionPolicy.notes} onChange={(e) => updateNestedProperty(['dataGovernance', 'retentionPolicy', 'notes'], e.target.value)} rows={1} /></div>
            </div>
            <div className="bg-sidebar/50 p-4 rounded-lg border border-card-border space-y-3">
                <h4 className="font-semibold text-text-primary">Política de Arquivamento</h4>
                <div className="flex items-center space-x-2"><Switch id="archivalEnabled" checked={entity.dataGovernance.archivalPolicy.enabled} onCheckedChange={(c) => updateNestedProperty(['dataGovernance', 'archivalPolicy', 'enabled'], c)} /><label htmlFor="archivalEnabled">Ativar Arquivamento</label></div>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Após (Anos)</label><Input type="number" value={entity.dataGovernance.archivalPolicy.afterYears} onChange={(e) => updateNestedProperty(['dataGovernance', 'archivalPolicy', 'afterYears'], Number(e.target.value))} disabled={!entity.dataGovernance.archivalPolicy.enabled} /></div>
                <div className="space-y-1"><label className="text-xs text-text-secondary">Armazenamento Alvo</label><Input value={entity.dataGovernance.archivalPolicy.targetStorage} onChange={(e) => updateNestedProperty(['dataGovernance', 'archivalPolicy', 'targetStorage'], e.target.value)} disabled={!entity.dataGovernance.archivalPolicy.enabled} /></div>
            </div>
        </div>
        <div className="mt-4 p-4 border border-card-border rounded-lg bg-sidebar/50 space-y-1">
            <label className="text-sm font-medium text-text-secondary">Proprietário de Dados (Data Owner)</label>
            <Input value={entity.dataGovernance.dataOwner} onChange={(e) => updateNestedProperty(['dataGovernance', 'dataOwner'], e.target.value)} placeholder="Ex: Departamento Financeiro"/>
        </div>
      </SectionCard>

      <SectionCard title="Linha de Dados (Data Lineage)" iconName="gitBranch">
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-semibold text-text-primary mb-2">Sistemas Upstream (Fontes)</h4>
                <div className="space-y-2">
                    {entity.dataFlow.upstreamSystems.map(sys => (<div key={sys.id} className="flex gap-2"><Input value={sys.name} onChange={e => updateNestedList('upstreamSystems', sys.id, 'name', e.target.value, 'dataFlow')} /><Button variant="ghost" size="sm" onClick={() => removeNestedItem('upstreamSystems', sys.id, 'dataFlow')}><Icon name="x" className="h-4 w-4"/></Button></div>))}
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => addNestedItem('upstreamSystems', { name: '', integrationType: 'API', frequency: '' }, 'dataFlow')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Fonte</Button>
            </div>
            <div>
                <h4 className="font-semibold text-text-primary mb-2">Sistemas Downstream (Consumidores)</h4>
                <div className="space-y-2">
                    {entity.dataFlow.downstreamSystems.map(sys => (<div key={sys.id} className="flex gap-2"><Input value={sys.name} onChange={e => updateNestedList('downstreamSystems', sys.id, 'name', e.target.value, 'dataFlow')} /><Button variant="ghost" size="sm" onClick={() => removeNestedItem('downstreamSystems', sys.id, 'dataFlow')}><Icon name="x" className="h-4 w-4"/></Button></div>))}
                </div>
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => addNestedItem('downstreamSystems', { name: '', integrationType: 'API', frequency: '' }, 'dataFlow')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Consumidor</Button>
            </div>
        </div>
      </SectionCard>
      
      <SectionCard title="Event Sourcing (Eventos de Domínio)" iconName="zap">
        <div className="space-y-4">
          {entity.dataFlow.domainEvents.map((event) => (
            <div key={event.id} className="p-4 border border-card-border rounded-lg bg-sidebar/50 flex items-center justify-between">
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <Input value={event.name} onChange={(e) => updateNestedList('domainEvents', event.id, 'name', e.target.value, 'dataFlow')} placeholder="Nome do Evento"/>
                <Input value={event.payloadFields.join(', ')} onChange={(e) => updateNestedList('domainEvents', event.id, 'payloadFields', e.target.value.split(',').map(s=>s.trim()), 'dataFlow')} placeholder="Campos do Payload"/>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeNestedItem('domainEvents', event.id, 'dataFlow')}><Icon name="trash2" className="w-4 h-4 text-red-500"/></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4 w-full" onClick={() => addNestedItem('domainEvents', { name: '', payloadFields: [] }, 'dataFlow')}><Icon name="plus" className="w-4 h-4 mr-2" /> Adicionar Evento de Domínio</Button>
      </SectionCard>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'schema': return renderSchemaTab();
      case 'endpoints': return renderEndpointsTab();
      case 'actions': return renderActionsTab();
      case 'lifecycle': return renderLifecycleTab();
      case 'security': return renderSecurityTab();
      case 'integration': return renderIntegrationTab();
      case 'governance': return renderDataGovernanceTab();
      default: return null;
    }
  };

  return (
    <div>
        <div className="border-b border-card-border mb-6">
          <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
            <TabButton iconName="grid" title="Schema & Rel." isActive={activeTab === 'schema'} onClick={() => setActiveTab('schema')} />
            <TabButton iconName="server" title="Endpoints" isActive={activeTab === 'endpoints'} onClick={() => setActiveTab('endpoints')} />
            <TabButton iconName="zap" title="Ações" isActive={activeTab === 'actions'} onClick={() => setActiveTab('actions')} />
            <TabButton iconName="gitBranch" title="Ciclo de Vida" isActive={activeTab === 'lifecycle'} onClick={() => setActiveTab('lifecycle')} />
            <TabButton iconName="shield" title="Segurança" isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} />
            <TabButton iconName="layout" title="Integração (UI/UX)" isActive={activeTab === 'integration'} onClick={() => setActiveTab('integration')} />
            <TabButton iconName="settings" title="Governança" isActive={activeTab === 'governance'} onClick={() => setActiveTab('governance')} />
          </nav>
        </div>

        {renderContent()}

        {showAdvancedDataStructure && (
            <AdvancedDataStructureModal 
                entity={entity} 
                setEntity={setEntity}
                onClose={() => setShowAdvancedDataStructure(false)} 
            />
        )}
    </div>
  );
};

export default EntityEditor;
