'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card';
import {
  DollarSign,
  CalendarCheck,
  Users,
  Scissors,
  TrendingUp,
} from 'lucide-react';
import Header from '@/app/_components/Header';

const revenueData = [
  { day: 'Seg', value: 750 },
  { day: 'Ter', value: 1200 },
  { day: 'Qua', value: 980 },
  { day: 'Qui', value: 1500 },
  { day: 'Sex', value: 1800 },
  { day: 'Sáb', value: 2200 },
];

const servicesData = [
  { name: 'Corte Fade', value: 40 },
  { name: 'Barba', value: 25 },
  { name: 'Corte Simples', value: 20 },
  { name: 'Sobrancelha', value: 15 },
];

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {/* Receita do Dia */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Receita do Dia
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ 1.250,00</p>
          </CardContent>
        </Card>

        {/* Clientes Atendidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Clientes Atendidos
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18</p>
          </CardContent>
        </Card>

        {/* Próximos Agendamentos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Próximo Agendamento
            </CardTitle>
            <CalendarCheck className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">João Silva - Corte Fade</p>
            <p className="text-sm text-gray-500">Hoje às 15:30</p>
          </CardContent>
        </Card>

        {/* Serviços mais populares */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Serviço mais popular
            </CardTitle>
            <Scissors className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">Corte Fade & Barba</p>
          </CardContent>
        </Card>

        {/* Gráfico de Receita da Semana */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Receita da Semana</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--chart-1))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Distribuição de Serviços */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Serviços mais vendidos</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {servicesData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
