'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/app/_components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import ServiceForm from './ServiceForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table';

const ServiceList = () => {
  const [services, setServices] = useState<
    { id: string | number; nome: string; preco: number; duracao: number }[]
  >([]);
  const [editingService, setEditingService] = useState<{
    id: string | number;
    nome: string;
    preco: number;
    duracao: number;
  } | null>(null);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data.services);
    } catch (error) {
      toast.error('Erro ao listar serviços. Por favor, tente novamente.');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string | number) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      toast.success('Serviço removido com sucesso!');
      fetchServices();
    } catch (error) {
      toast.error('Erro ao remover serviço. Por favor, tente novamente.');
    }
  };

  const handleSave = () => {
    setEditingService(null);
    fetchServices();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gerenciar Serviços</h1>
      {editingService ? (
        <ServiceForm service={editingService} onSave={handleSave} />
      ) : (
        <ServiceForm onSave={handleSave} />
      )}
      <Table className="min-w-full divide-y divide-gray-200 mt-4">
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Nome
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Preço
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Duração (minutos)
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {service.nome}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                R$ {service.preco}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                {service.duracao} minutos
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingService(service)}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceList;
