
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Verificamos o localStorage apenas no lado do cliente
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (consent !== 'given') {
        setShowConsent(true);
      }
    } catch (e) {
      // Se localStorage não estiver disponível, mostramos o banner
      setShowConsent(true);
    }
  }, []);

  const acceptConsent = () => {
    try {
      localStorage.setItem('cookie_consent', 'given');
      setShowConsent(false);
    } catch (e) {
      console.error("Não foi possível salvar o consentimento de cookies.");
    }
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="bg-secondary text-secondary-foreground p-4 shadow-lg animate-in slide-in-from-bottom-full">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
             <Cookie className="h-5 w-5 mt-1 flex-shrink-0" />
            <p className="text-sm">
              Utilizamos cookies essenciais para garantir o bom funcionamento do nosso site e para lhe proporcionar a melhor experiência de navegação. Ao continuar, você concorda com o uso destes cookies. Para mais detalhes, consulte nossa{' '}
              <Link href="/politica-de-privacidade" className="underline font-semibold hover:text-primary">
                Política de Privacidade
              </Link>.
            </p>
          </div>
          <Button onClick={acceptConsent} className="flex-shrink-0">
            Entendi e Aceitar
          </Button>
        </div>
      </div>
    </div>
  );
}
