import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícone de cancelamento */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pagamento Cancelado
          </h1>

          <p className="text-gray-600 mb-6">
            Seu pagamento foi cancelado. Nenhuma cobrança foi realizada em seu cartão.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Não se preocupe!</strong> Você pode tentar novamente a qualquer momento. 
              Se tiver dúvidas, nossa equipe está aqui para ajudar.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/pricing"
              className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Tentar Novamente
            </Link>
            
            <Link
              to="/"
              className="block w-full text-gray-600 hover:text-gray-800 transition-colors"
            >
              Voltar ao Início
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Precisa de Ajuda?
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                Email: <a href="mailto:suporte@pegadazero.com" className="text-primary-600 hover:underline">
                  suporte@pegadazero.com
                </a>
              </p>
              <p>
                WhatsApp: <a href="https://wa.me/5511999999999" className="text-primary-600 hover:underline">
                  (11) 99999-9999
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;