import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Sidebar />
      <Footer />
      <main className="pt-16 pb-12 pr-16 min-h-screen">
        <div className="flex items-center justify-center min-h-[calc(100vh-7rem)]">
          <div className="text-center">
            <h1 className="font-orbitron text-4xl font-bold mb-4">ZENITH</h1>
            <p className="text-dim">Organização Pessoal com IA</p>
            <p className="text-dim text-sm mt-2">Fase 0 - Fundação</p>
          </div>
        </div>
      </main>
    </>
  );
}
