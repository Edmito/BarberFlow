'use client';

import PaymentList from '@/app/_components/PaymentList';
import PaymentForm from '@/app/_components/PaymentForm';
import Header from '@/app/_components/Header';
import { useState } from 'react';

const PaymentsPage = () => {
  const [refresh, setRefresh] = useState(false);

  const handleSave = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Pagamentos</h1>
        <PaymentForm onSave={handleSave} />
        <PaymentList key={refresh.toString()} />
      </main>
    </div>
  );
};

export default PaymentsPage;
