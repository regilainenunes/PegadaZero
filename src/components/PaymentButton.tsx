import React from 'react';

interface PaymentButtonProps {
  planName: string;
  price: number;
  className?: string;
  children?: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ 
  planName, 
  price, 
  className = "", 
  children 
}) => {
  const kiwifyUrl = "https://pay.kiwify.com.br/a58ev1P";
  
  const handlePayment = () => {
    // Adicionar parâmetros UTM para tracking
    const urlWithParams = new URL(kiwifyUrl);
    urlWithParams.searchParams.append('utm_source', 'pegadazero');
    urlWithParams.searchParams.append('utm_medium', 'website');
    urlWithParams.searchParams.append('utm_campaign', planName.toLowerCase().replace(/\s+/g, '_'));
    
    // Abrir em nova aba
    window.open(urlWithParams.toString(), '_blank');
  };

  return (
    <button
      onClick={handlePayment}
      className={`
        bg-gradient-to-r from-primary-500 to-primary-600 
        hover:from-primary-600 hover:to-primary-700 
        text-white font-semibold py-3 px-6 rounded-lg 
        transition-all duration-300 transform hover:scale-105 
        shadow-lg hover:shadow-xl
        ${className}
      `}
    >
      {children || `Assinar ${planName} - R$ ${price.toFixed(2)}`}
    </button>
  );
};

export default PaymentButton;