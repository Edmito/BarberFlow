'use client';

import { useState } from 'react';
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

interface ServiceFormProps {
  service?: {
    id: string | number;
    nome: string;
    preco: number;
    duracao: number;
  };
  onSave: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave }) => {
  const [nome, setNome] = useState(service?.nome || '');
  const [preco, setPreco] = useState(service?.preco || '');
  const [duracao, setDuracao] = useState(service?.duracao || '');
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (service) {
        await axios.put(`http://localhost:5000/api/services/${service.id}`, {
          nome,
          preco,
          duracao,
        });
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await axios.post('http://localhost:5000/api/services', {
          nome,
          preco,
          duracao,
        });
        toast.success('Serviço criado com sucesso!');
      }
      onSave();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar serviço. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        <Plus className="mr-2 h-5 w-5" />
        Adicionar Novo Serviço
      </Button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adicionar Novo Serviço</AlertDialogTitle>
            <AlertDialogDescription>
              Preencha os campos abaixo para adicionar um novo serviço.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form id="service-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="preco">Preço</Label>
              <Input
                id="preco"
                type="number"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="duracao">Duração (minutos)</Label>
              <Input
                id="duracao"
                type="number"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                required
              />
            </div>
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" form="service-form" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceForm;
