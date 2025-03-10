'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/app/_components/ui/alert-dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/app/_components/ui/form';

interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface EditUserProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

const EditUser = ({ user: initialUser, onClose, onUpdate }: EditUserProps) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<User>({
    defaultValues: {
      id: initialUser.id || '',
      nome: initialUser.nome || '',
      email: initialUser.email || '',
      telefone: initialUser.telefone || '',
    },
  });

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


  const onSubmit = async (data: User) => {
    setLoading(true);
    try {
      const formattedPhoneNumber = data.telefone.replace(/[^\d]/g, '');
      const response = await axios.put(
        `http://localhost:5000/api/users/${initialUser.id}`,
        { ...data, telefone: formattedPhoneNumber },
      );
      toast.success(response.data.message);
      onUpdate();
      onClose(); // Fecha o modal após salvar
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Erro ao atualizar usuário: ${error.response.data.message}`,
        );
      } else {
        toast.error('Erro ao atualizar usuário. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os campos abaixo para editar o usuário.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Telefone"
                      value={formatPhoneNumber(field.value)}
                      onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditUser;
//