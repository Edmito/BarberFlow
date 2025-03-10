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
import EditUser from './EditUser';
import { Button } from './ui/button';
import { Pencil, Trash } from 'lucide-react';

const ClientList = () => {
  interface Client {
    id: string;
    nome: string;
    email: string;
    telefone: string;
  }

  const [clients, setClients] = useState<Client[]>([]);
  const [editingUser, setEditingUser] = useState<Client | null>(null);

  const fetchClients = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/users?tipo=cliente',
      );
      setClients(response.data.users);
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Erro ao listar clientes. Por favor, tente novamente.';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEdit = (client: Client) => {
    setEditingUser(client);
  };

  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  const handleUpdate = () => {
    fetchClients();
  };

  const handleDelete = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      toast.success('Cliente deletado com sucesso!');
      fetchClients();
    } catch (error) {
      toast.error('Erro ao deletar cliente. Por favor, tente novamente.');
    }
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  return (
    <div>
      <Table className="min-w-full divide-y divide-gray-200 mt-4">
        <TableHeader className='bg-secondary'>
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Nome
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Telefone
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {client.nome}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                {client.email}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
              {formatPhoneNumber(client.telefone)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right space-x-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleEdit(client)}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => handleDelete(client.id)}
                >
                  <Trash className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingUser && (
        <EditUser
          user={editingUser}
          onClose={handleCloseEdit}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ClientList;
