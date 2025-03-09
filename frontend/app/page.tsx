import { Button } from '@/app/_components/ui/button';
import { Scissors } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-12 py-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <Scissors className="h-6 w-6" />
          <span className="font-bold">Barbearia</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-6 flex flex-col items-center justify-center gap-6 max-w-[600px] mx-auto text-center">
        <h1 className="text-3xl font-bold">Bem-vindo à Barbearia</h1>
        <p className="text-muted-foreground">
          Sistema completo para gerenciamento de barbearia. Agende seus serviços
          online e gerencie seu negócio de forma eficiente.
        </p>
        <Button size="lg" asChild>
          <Link href="/login">Acessar sistema</Link>
        </Button>
      </div>
    </div>
  );
}
