'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table';

const PaymentList = () => {
  interface Payment {
    id: string;
    valor: number;
    forma_pagamento: string;
    Appointment: {
      cliente: { nome: string };
      funcionario: { nome: string };
      Service: { nome: string };
      data_hora: string;
    };
  }

  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments');
      setPayments(response.data.payments);
    } catch (error) {
      toast.error('Erro ao listar pagamentos. Por favor, tente novamente.');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="overflow-x-auto">
      <Table className="w-full border rounded-lg">
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Cliente
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Funcionário
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Serviço
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Data e Hora
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Valor
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Forma de Pagamento
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="px-4 py-2 text-sm font-medium whitespace-normal break-words">
                {payment.Appointment.cliente.nome}
              </TableCell>
              <TableCell className="px-4 py-2 text-sm whitespace-normal break-words">
                {payment.Appointment.funcionario.nome}
              </TableCell>
              <TableCell className="px-4 py-2 text-sm whitespace-normal break-words">
                {payment.Appointment.Service.nome}
              </TableCell>
              <TableCell className="px-4 py-2 text-sm whitespace-normal break-words">
                {new Date(payment.Appointment.data_hora).toLocaleString()}
              </TableCell>
              <TableCell className="px-4 py-2 text-sm whitespace-normal break-words">
                R$ {payment.valor}
              </TableCell>
              <TableCell className="px-4 py-2 text-sm whitespace-normal break-words">
                {payment.forma_pagamento.charAt(0).toUpperCase() +
                  payment.forma_pagamento.slice(1).toLowerCase()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentList;
