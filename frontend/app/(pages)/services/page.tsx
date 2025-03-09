import ServiceList from '@/app/_components/ServiceList';
import Header from '@/app/_components/Header';

const ServicesPage = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <ServiceList />
      </main>
    </div>
  );
};

export default ServicesPage;
