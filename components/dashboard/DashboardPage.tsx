import React from 'react';
import MetricCard from './MetricCard';
import RevenueChart from './RevenueChart';
import ProjectStatusList from './ProjectStatusList';
import ActivityFeed from './ActivityFeed';
import { Project, Invoice, Client } from '../../types';

interface DashboardPageProps {
  projects?: Project[];
  invoices?: Invoice[];
  clients?: Client[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ projects = [], invoices = [], clients = [] }) => {

  const totalRevenue = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const activeProjectsCount = projects.filter(p => p.status !== 'completed').length;

  const activeClientsCount = clients.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Receita Total" 
          value={totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
          // O campo 'change' pode ser calculado no futuro se houver dados históricos
          change="+18% este mês" 
          icon="dollar-sign" 
        />
        <MetricCard 
          title="Projetos Ativos" 
          value={activeProjectsCount.toString()} 
          change={`de ${projects.length} no total`} 
          icon="briefcase" 
        />
        <MetricCard 
          title="Clientes Ativos" 
          value={activeClientsCount.toString()} 
          change="+2 este mês" 
          icon="users" 
        />
        <MetricCard 
          title="Tarefas Concluídas" 
          value="128" // Estático por enquanto, conforme o plano
          change="+32 esta semana" 
          icon="checkSquare" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart invoices={invoices} />
        </div>
        <div className="lg:col-span-1">
          <ProjectStatusList projects={projects} />
        </div>
      </div>

      <div>
        {/* O ActivityFeed permanece estático por enquanto, como definido no plano */}
        <ActivityFeed />
      </div>
    </div>
  );
};

export default DashboardPage;
