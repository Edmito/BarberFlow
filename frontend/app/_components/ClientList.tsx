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
import ClientForm from './ClientForm';
import { Button } from './ui/button';
import { Pencil, Trash } from 'lucide-react';
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
      toast.error('Erro ao listar clientes. Por favor, tente novamente.');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEdit = (client: Client) => setEditingUser(client);
  const handleCloseEdit = () => setEditingUser(null);
  const handleUpdate = () => fetchClients();

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
    if (phoneNumber.length < 3) return phoneNumber;
    if (phoneNumber.length < 7)
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
      2,
      7,
    )}-${phoneNumber.slice(7, 11)}`;
  };

  return (
    <div className="overflow-x-auto">
      <ClientForm onClientAdded={fetchClients} /> {/* Passamos a função aqui */}
      <Table className="w-full border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Nome
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Email
            </TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-medium uppercase">
              Telefone
            </TableHead>
            <TableHead className="px-4 py-2 text-right text-xs font-medium uppercase">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="px-4 py-2 text-sm font-medium whitespace-normal break-words">
                {client.nome}
              </TableCell>
              <TableCell className="px-4 py-2 text-sm whitespace-normal break-words">
                {client.email}
              </TableCell>
              <TableCell className="px-4 py-2 text-sm whitespace-normal break-words">
                {formatPhoneNumber(client.telefone)}
              </TableCell>
              <TableCell className="px-4 py-2 text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(client)}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar Cliente</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar este cliente? Esta ação
                        não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(client.id)}
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
