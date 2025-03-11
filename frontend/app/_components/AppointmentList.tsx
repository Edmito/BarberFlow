'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/app/_components/ui/button';
import { Trash, CreditCard } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table';
import PaymentForm from '@/app/_components/PaymentForm';

const AppointmentList = () => {
  interface Appointment {
    id: string | number;
    cliente: { nome: string } | null;
    funcionario: { nome: string } | null;
    Service: { nome: string } | null;
    data_hora: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/appointments',
      );
      console.log(response.data.agendamentos);
      setAppointments(response.data.agendamentos);
    } catch (error) {
      toast.error('Erro ao listar agendamentos. Por favor, tente novamente.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string | number) => {
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      toast.success('Agendamento cancelado com sucesso!');
      fetchAppointments();
    } catch (error) {
      toast.error('Erro ao cancelar agendamento. Por favor, tente novamente.');
    }
  };

  const handlePaymentRedirect = (id: string | number) => {
    setSelectedAppointmentId(id as number);
    setIsPaymentFormOpen(true);
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full divide-y divide-gray-200 mt-4">
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Cliente
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Funcionário
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Serviço
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Data e Hora
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
              Pagamento
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {appointment.cliente?.nome || 'N/A'}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                {appointment.funcionario?.nome || 'N/A'}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                {appointment.Service?.nome || 'N/A'}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                {new Date(appointment.data_hora).toLocaleString()}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => handlePaymentRedirect(appointment.id)}
                >
                  <CreditCard className="h-5 w-5" />
                </Button>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleCancel(appointment.id)}
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedAppointmentId && (
        <PaymentForm
          agendamentoId={selectedAppointmentId}
          onSave={() => {
            setSelectedAppointmentId(null);
            fetchAppointments();
          }}
          isOpen={isPaymentFormOpen}
          onClose={() => setIsPaymentFormOpen(false)}
        />
      )}
    </div>
  );
};

export default AppointmentList;
