import React from 'react';
import { Link } from 'react-router-dom';
import PaymentButton from '../components/PaymentButton';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Básico",
      price: 29.90,
      period: "mês",
      features: [
        "Cálculo básico de pegada de carbono",
        "Relatórios mensais",
        "Suporte por email",
        "Até 5 funcionários"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: 79.90,
      period: "mês",
      features: [
        "Cálculo avançado de pegada de carbono",
        "Relatórios detalhados e personalizados",
        "Suporte prioritário",
        "Até 50 funcionários",
        "Integração com APIs",
        "Dashboard avançado"
      ],
      popular: true
    },
    {
      name: "Empresarial",
      price: 199.90,
      period: "mês",
      features: [
        "Todos os recursos do Profissional",
        "Funcionários ilimitados",
        "Consultoria especializada",
        "Relatórios customizados",
        "Integração completa",
        "Suporte 24/7"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src="/LogoPegadaZero1.svg" alt="PegadaZero" className="h-10 w-auto" />
          </Link>
        </div>
        <nav>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Início
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Cadastrar
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Escolha o Plano Ideal para sua <span className="text-primary-600">Empresa</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Transforme sua empresa em uma organização sustentável com nossos planos personalizados para cada necessidade.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                relative bg-white rounded-2xl shadow-xl p-8 
                ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}
                hover:shadow-2xl transition-all duration-300
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-600">R$ {plan.price.toFixed(2)}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <PaymentButton
                planName={plan.name}
                price={plan.price}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Como funciona o pagamento?
              </h3>
              <p className="text-gray-600">
                O pagamento é processado de forma segura através da plataforma Kiwify. Você será redirecionado para uma página segura onde poderá inserir seus dados de pagamento.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim, você pode cancelar sua assinatura a qualquer momento através do seu painel de controle ou entrando em contato conosco.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Há garantia de reembolso?
              </h3>
              <p className="text-gray-600">
                Oferecemos garantia de 7 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <img src="/LogoPegadaZero1.svg" alt="PegadaZero" className="h-8 w-auto mr-3" />
            <span className="text-xl font-bold">PegadaZero</span>
          </div>
          <p className="text-gray-400 mb-4">
            Transformando empresas em organizações sustentáveis
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/termos" className="text-gray-400 hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="text-gray-400 hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link to="/legal" className="text-gray-400 hover:text-white transition-colors">
              Legal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;