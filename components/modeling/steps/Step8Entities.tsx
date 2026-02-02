
import React, { useState } from 'react';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import Icon from '../../shared/Icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';
import { Switch } from '../../ui/Switch';
import { Separator } from '../../ui/Separator';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/Dialog';
import EntityCodeViewerModal from '../EntityCodeViewerModal';
import { Badge } from '../../ui/Badge';

export interface Entity {
    id: string;
    name: string;
    description: string;
    fields: Field[];
    timestamps: boolean;
    softDeletes: boolean;
    relationships: any[];
}

export interface Field {
    id: string;
    name: string;
    type: string;
    description?: string;
    required: boolean;
    unique: boolean;
    defaultValue?: string;
    validations: Validation[];
    indexed: boolean;
}

export interface Validation {
    id: string;
    type: string; // e.g., 'minLength', 'maxLength', 'pattern'
    value: string | number;
    message: string;
}

interface Step8EntitiesProps {
  data: {
    entities?: Entity[];
  };
  setData: (data: any) => void;
  onSelectEntity: (id: string) => void;
}

const Step8Entities: React.FC<Step8EntitiesProps> = ({ data, setData, onSelectEntity }) => {
  const entities = data.entities || [];

  const handleAddEntity = () => {
    const newEntity: Entity = {
      id: new Date().getTime().toString(),
      name: 'Nova Entidade',
      description: '',
      fields: [],
      timestamps: true,
      softDeletes: false,
      relationships: [],
    };
    setData({ ...data, entities: [...entities, newEntity] });
    onSelectEntity(newEntity.id); // Go directly to editor for the new entity
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
           <Label>Entidades Principais</Label>
           <p className="text-sm text-text-secondary">Defina os conceitos centrais do seu sistema. Clique em uma entidade para editar seus detalhes.</p>
         </div>
          <Button variant="outline" onClick={handleAddEntity}>
            <Icon name="plus" className="h-4 w-4 mr-2" />
            Adicionar Entidade
          </Button>
       </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map((entity) => (
          <Card 
            key={entity.id} 
            className="cursor-pointer hover:border-accent transition-colors group"
            onClick={() => onSelectEntity(entity.id)}
          >
            <CardHeader>
                <CardTitle className="group-hover:text-accent">{entity.name}</CardTitle>
                <CardDescription className="line-clamp-2">{entity.description || 'Sem descrição.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <Badge variant="secondary">{entity.fields.length} campos</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

       {entities.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-card-border rounded-lg">
                <Icon name="database" className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-lg text-text-primary">Nenhuma Entidade Criada</h3>
                <p className="text-sm text-text-secondary mt-1">Clique em "Adicionar Entidade" para começar a modelar seus dados.</p>
          </div>
      )}
    </div>
  );
};

export default Step8Entities;