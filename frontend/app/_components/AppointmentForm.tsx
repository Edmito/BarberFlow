'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/app/_components/ui/alert-dialog';

interface AppointmentFormProps {
  onSave: () => void;
}

const AppointmentForm = ({ onSave }: AppointmentFormProps) => {
  interface Cliente {
    id: string;
    nome: string;
  }

  const [clientes, setClientes] = useState<Cliente[]>([]);
  interface Funcionario {
    id: string;
    nome: string;
  }

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  interface Servico {
    id: string;
    nome: string;
  }

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users?tipo=cliente',
        );
        setClientes(response.data.users);
      } catch (error) {
        toast.error('Erro ao carregar clientes. Por favor, tente novamente.');
      }
    };

    const fetchFuncionarios = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/users?tipo=funcionario',
        );
        setFuncionarios(response.data.users);
      } catch (error) {
        toast.error(
          'Erro ao carregar funcionários. Por favor, tente novamente.',
        );
      }
    };

    const fetchServicos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServicos(response.data.services);
      } catch (error) {
        toast.error('Erro ao carregar serviços. Por favor, tente novamente.');
      }
    };

    fetchClientes();
    fetchFuncionarios();
    fetchServicos();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/appointments', {
        cliente_id: clienteId,
        funcionario_id: funcionarioId,
        servico_id: servicoId,
        data_hora: dataHora,
      });
      toast.success('Agendamento criado com sucesso!');
      onSave();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao criar agendamento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        <Plus className="mr-2 h-5 w-5" />
        Adicionar Novo Agendamento
      </Button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adicionar Novo Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Preencha os campos abaixo para adicionar um novo agendamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            id="appointment-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <select
                id="cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="funcionario">Funcionário</Label>
              <select
                id="funcionario"
                value={funcionarioId}
                onChange={(e) => setFuncionarioId(e.target.value)}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map((funcionario) => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="servico">Serviço</Label>
              <select
                id="servico"
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Selecione um serviço</option>
                {servicos.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    {servico.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="dataHora">Data e Hora</Label>
              <Input
                id="dataHora"
                type="datetime-local"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                required
              />
            </div>
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" form="appointment-form" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentForm;
