import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Project } from '../../types'; // Importando o tipo Project

// Lista estática de fallback
const fallbackProjects = [
    { name: 'Sistema ERP - TechCorp', status: 'Em Andamento', progress: 75 },
    { name: 'E-commerce - Digital Store', status: 'Planejamento', progress: 25 },
    { name: 'App Mobile - StartupX', status: 'Concluído', progress: 100 },
    { name: 'Landing Page - Marketing Pro', status: 'Pausado', progress: 40 },
];

// Função para traduzir o status do projeto
const translateStatus = (status: Project['status']) => {
    const statusMap: Record<Project['status'], string> = {
        planning: 'Planejamento',
        in_progress: 'Em Andamento',
        completed: 'Concluído',
        on_hold: 'Pausado',
        cancelled: 'Cancelado',
        awaiting_validation: 'Aguardando Validação',
        awaiting_delivery_approval: 'Aguardando Aprovação',
        changes_requested: 'Alterações Solicitadas',
    };
    return statusMap[status] || 'Desconhecido';
};

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


const getStatusColor = (status: string) => {
    switch (status) {
      case "Planejamento": return "text-blue-400 bg-blue-500/10";
      case "Em Andamento":
      case "Aguardando Validação":
      case "Aguardando Aprovação":
      case "Alterações Solicitadas":
         return "text-yellow-400 bg-yellow-500/10";
      case "Concluído": return "text-green-400 bg-green-500/10";
      case "Pausado": 
      case "Cancelado":
        return "text-text-secondary bg-sidebar";
      default: return "text-text-primary bg-card";
    }
};

interface ProjectStatusListProps {
  projects?: Project[];
}

const ProjectStatusList: React.FC<ProjectStatusListProps> = ({ projects }) => {
  const displayProjects = projects && projects.length > 0
    ? projects.map(p => ({
        name: p.name,
        status: translateStatus(p.status),
        progress: getProgressByStatus(p.status)
      }))
    : fallbackProjects;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Projetos</CardTitle>
        <CardDescription>Visão geral do progresso dos projetos ativos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayProjects.map((project, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{project.name}</span>
                <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>{project.status}</Badge>
            </div>
            <Progress value={project.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusList;
