'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/app/_components/ui/alert-dialog';

interface PaymentFormProps {
  agendamentoId: number | null;
  onSave: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface Agendamento {
  id: number;
  cliente: { nome: string };
  funcionario: { nome: string };
  service: { nome: string; preco: number };
  data_hora: string;
}

const PaymentForm = ({ agendamentoId, onSave, isOpen, onClose }: PaymentFormProps) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [valor, setValor] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [loading, setLoading] = useState(false);

  // Buscar os agendamentos da API
  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/appointments',
        );

        const agendamentosCorrigidos = response.data.agendamentos.map(
          (agendamento: any) => ({
            ...agendamento,
            service: agendamento.Service, // Renomeando a chave para evitar problemas
          }),
        );

        console.log('Agendamentos carregados:', agendamentosCorrigidos);
        setAgendamentos(agendamentosCorrigidos);
      } catch (error) {
        toast.error(
          'Erro ao carregar agendamentos. Por favor, tente novamente.',
        );
      }
    };

    fetchAgendamentos();
  }, []);

  // Atualizar o valor automaticamente ao selecionar um agendamento
  useEffect(() => {
    if (!agendamentos.length || !agendamentoId) return;

    const selectedAgendamento = agendamentos.find(
      (a) => a.id === agendamentoId,
    );

    if (selectedAgendamento) {
      console.log('Agendamento selecionado:', selectedAgendamento);
      console.log('Preço do serviço:', selectedAgendamento.service?.preco);

      setValor(selectedAgendamento.service?.preco?.toString() || '');
    }
  }, [agendamentoId, agendamentos]);

  // Submeter o pagamento
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/payments', {
        agendamento_id: agendamentoId,
        valor,
        forma_pagamento: formaPagamento,
      });

      toast.success('Pagamento registrado com sucesso!');
      onSave();
      onClose();
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Erro ao registrar pagamento. Por favor, tente novamente.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Adicionar Novo Pagamento</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para adicionar um novo pagamento.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
            <select
              id="formaPagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione uma forma de pagamento</option>
              <option value="PIX">PIX</option>
              <option value="CARTÃO">Cartão</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button type="submit" form="payment-form" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentForm;