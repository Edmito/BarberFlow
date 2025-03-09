'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
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
import { DollarSign, CalendarCheck, Users, Scissors } from 'lucide-react';
import Header from '@/app/_components/Header';

interface DashboardData {
  revenueOfDay: number;
  clientsAttended: number;
  nextAppointment: {
    client: string;
    service: string;
    time: string;
  };
  mostPopularService: string;
  revenueData: { day: string; value: number }[];
  servicesData: { name: string; value: number }[];
}

const DashboardPage = () => {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard');
        setData(response.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            'Erro ao carregar os dados do dashboard. Por favor, tente novamente.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Atualiza a data/hora a cada segundo
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="p-4">Carregando dados...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div>
      <Header />
      <div className="p-4">
        <p className="text-2xl font-semibold text-right">
          {currentTime.toLocaleString()}
        </p>
      </div>
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
            <p className="text-2xl font-bold">
              R$ {data?.revenueOfDay.toFixed(2)}
            </p>
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
            <p className="text-2xl font-bold">{data?.clientsAttended}</p>
          </CardContent>
        </Card>

        {/* Próximo Agendamento */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Próximo Agendamento
            </CardTitle>
            <CalendarCheck className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {data?.nextAppointment.client} - {data?.nextAppointment.service}
            </p>
            <p className="text-sm text-gray-500">
              {data?.nextAppointment.time}
            </p>
          </CardContent>
        </Card>

        {/* Serviço mais Popular */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Serviço mais popular
            </CardTitle>
            <Scissors className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{data?.mostPopularService}</p>
          </CardContent>
        </Card>

        {/* Gráfico de Receita da Semana */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Receita dos ultimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenueData || []}>
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
                  data={data?.servicesData || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {data?.servicesData?.map((_, index) => (
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
