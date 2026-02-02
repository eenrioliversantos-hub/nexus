import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Invoice } from '../../types';

const fallbackData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

const processInvoices = (invoices: Invoice[]) => {
    if (!invoices || invoices.length === 0) {
        return fallbackData;
    }

    const monthlyRevenue: { [key: string]: number } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    invoices.forEach(invoice => {
        const date = new Date(invoice.issueDate);
        const month = date.getMonth(); // 0-11
        const year = date.getFullYear();
        const monthKey = `${year}-${month}`;

        if (!monthlyRevenue[monthKey]) {
            monthlyRevenue[monthKey] = 0;
        }
        monthlyRevenue[monthKey] += invoice.amount;
    });

    // Pega os últimos 6 meses a partir da data atual
    const chartData = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthKey = `${year}-${month}`;
        
        chartData.push({
            name: monthNames[month],
            revenue: monthlyRevenue[monthKey] || 0,
        });
    }

    return chartData;
};


interface RevenueChartProps {
  invoices?: Invoice[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ invoices }) => {
  const chartData = processInvoices(invoices || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita Mensal</CardTitle>
        <CardDescription>Receita dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickFormatter={(value) => `R$${(value as number / 1000)}k`} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} 
                formatter={(value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number)}
            />
            <Line type="monotone" dataKey="revenue" name="Receita" stroke="#38bdf8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
