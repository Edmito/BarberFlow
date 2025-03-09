'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { MenuIcon, Scissors } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from './ui/navigation-menu';
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

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/dashboard" prefetch={false}>
              <div className="flex items-center gap-3">
                <Scissors className="h-6 w-6" />
                <h1 className="text-2xl font-bold">BarberFlow</h1>
              </div>
            </Link>
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
          </SheetContent>
        </Sheet>
        <Link
          href="/dashboard"
          className="mr-6 hidden lg:flex"
          prefetch={false}
        >
          <div className="flex items-center gap-3">
            <Scissors className="h-6 w-6" />
            <h1 className="text-2xl font-bold">BarberFlow</h1>
          </div>
        </Link>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="flex gap-6">
            <NavigationMenuLink asChild>
              <Link
                href="/dashboard"
                className={
                  pathname === '/dashboard' ? 'font-bold underline' : ''
                }
                prefetch={false}
              >
                Dashboard
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/services"
                className={
                  pathname === '/services' ? 'font-bold underline' : ''
                }
                prefetch={false}
              >
                Serviços
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/clients"
                className={pathname === '/clients' ? 'font-bold underline' : ''}
                prefetch={false}
              >
                Clientes
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/payments"
                className={
                  pathname === '/payments' ? 'font-bold underline' : ''
                }
                prefetch={false}
              >
                Pagamentos
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/appointments"
                className={
                  pathname === '/appointments' ? 'font-bold underline' : ''
                }
                prefetch={false}
              >
                Agendamentos
              </Link>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
    </div>
  );
};

export default Header;
