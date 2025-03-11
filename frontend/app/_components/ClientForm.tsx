'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  FormMessage,
} from '@/app/_components/ui/form';

const clientSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z
    .string()
    .min(10, 'Telefone inválido')
    .max(15, 'Telefone inválido'),
});

type ClientFormData = z.infer<typeof clientSchema>;

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const phoneNumber = value.replace(/\D/g, '');
  if (phoneNumber.length <= 2) return phoneNumber;
  if (phoneNumber.length <= 6)
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
  return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
    2,
    7,
  )}-${phoneNumber.slice(7, 11)}`;
};

const ClientForm: React.FC<{ onClientAdded: () => void }> = ({
  onClientAdded,
}) => {
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { nome: '', email: '', telefone: '' },
  });

  const onSubmit = async (data: ClientFormData) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        {
          ...data,
          telefone: data.telefone.replace(/\D/g, ''), // Remove caracteres não numéricos
          senha: '123456',
          tipo: 'cliente',
        },
      );

      toast.success(response.data.message || 'Cliente criado com sucesso!', {
        description: `A senha temporária do cliente é "123456". Peça para alterá-la no primeiro login.`,
      });

      form.reset();
      setIsDialogOpen(false);
      onClientAdded(); // Atualiza a lista de clientes após criação
    } catch (error) {
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Erro ao salvar'
          : 'Erro inesperado',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        Adicionar Novo Cliente
      </Button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adicionar Novo Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Preencha os campos abaixo para cadastrar um novo cliente.
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
                      <Input {...field} placeholder="Nome" />
                    </FormControl>
                    <FormMessage />
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
                      <Input {...field} placeholder="Email" />
                    </FormControl>
                    <FormMessage />
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
                        placeholder="(00) 00000-0000"
                        value={formatPhoneNumber(field.value)}
                        onChange={(e) =>
                          field.onChange(formatPhoneNumber(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AlertDialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
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
    </div>
  );
};

export default ClientForm;
