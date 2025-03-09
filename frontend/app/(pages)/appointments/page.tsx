'use client';

import AppointmentList from '@/app/_components/AppointmentList';
import AppointmentForm from '@/app/_components/AppointmentForm';
import Header from '@/app/_components/Header';
import { useState } from 'react';

const AppointmentsPage = () => {
  const [refresh, setRefresh] = useState(false);

  const handleSave = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Agendamentos</h1>
        <AppointmentForm onSave={handleSave} />
        <AppointmentList key={refresh.toString()} />
      </main>
    </div>
  );
};

export default AppointmentsPage;
