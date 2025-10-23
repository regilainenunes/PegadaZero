import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const status = searchParams.get('status');

  useEffect(() => {
    // Aqui você pode fazer uma chamada para verificar o status do pagamento
    // ou atualizar o estado do usuário
    if (orderId && status === 'approved') {
      console.log('Pagamento aprovado:', orderId);
      // Implementar lógica de ativação da conta/plano
    }
  }, [orderId, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de sucesso */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pagamento Realizado com Sucesso!
          </h1>

          <p className="text-gray-600 mb-6">
            Seu pagamento foi processado com sucesso. Você receberá um email de confirmação em breve.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>ID do Pedido:</strong> {orderId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Acessar Dashboard
            </Link>
            
            <Link
              to="/"
              className="block w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              Voltar ao Início
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Precisa de ajuda? Entre em contato conosco pelo email{' '}
              <a href="mailto:suporte@pegadazero.com" className="text-primary-600 hover:underline">
                suporte@pegadazero.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;