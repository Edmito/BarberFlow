'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { MenuIcon, Scissors, LogOut } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="container mx-auto">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetTitle></SheetTitle>
          <SheetContent side="left">
            <div className="flex flex-col h-full">
              <Link href="/dashboard" prefetch={false}>
                <div className="flex items-center gap-3 mb-6">
                  <Scissors className="h-6 w-6" />
                  <h1 className="text-2xl font-bold">BarberFlow</h1>
                </div>
              </Link>
              <div className="flex-grow">
                <div className="grid gap-2 py-6">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/services"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Serviços
                  </Link>
                  <Link
                    href="/clients"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Clientes
                  </Link>
                  <Link
                    href="/payments"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Pagamentos
                  </Link>
                  <Link
                    href="/appointments"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Agendamentos
                  </Link>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                className="flex w-full items-center py-2 text-lg font-semibold"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="ml-4 hidden lg:flex" prefetch={false}>
          <div className="flex items-center gap-3">
            <Scissors className="h-6 w-6" />
            <h1 className="text-2xl font-bold">BarberFlow</h1>
          </div>
        </Link>
      </header>
    </div>
  );
};

export default Header;