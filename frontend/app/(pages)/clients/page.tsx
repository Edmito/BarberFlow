import ClientList from '@/app/_components/ClientList';
import Header from '@/app/_components/Header';

const ClientsPage = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <ClientList />
      </main>
    </div>
  );
};

export default ClientsPage;