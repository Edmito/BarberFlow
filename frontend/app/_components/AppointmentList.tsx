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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import PaymentForm from '@/app/_components/PaymentForm';
import { Input } from '@/app/_components/ui/input';

const AppointmentList = () => {
  interface Appointment {
    id: string | number;
    cliente: { nome: string } | null;
    funcionario: { nome: string } | null;
    Service: { nome: string } | null;
    data_hora: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/appointments',
      );
      setAppointments(response.data.agendamentos);
      setFilteredAppointments(response.data.agendamentos);
    } catch (error) {
      toast.error('Erro ao listar agendamentos. Por favor, tente novamente.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter((appointment) =>
      appointment.cliente?.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredAppointments(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, appointments]);

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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Buscar por cliente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-secondary"
        />
      </div>
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
          {currentItems.map((appointment) => (
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar Agendamento</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar este Agendamento? Esta
                        ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancel(appointment.id)}
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div>
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              variant={index + 1 === currentPage ? 'default' : 'outline'}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

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
