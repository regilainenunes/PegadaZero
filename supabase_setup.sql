-- PegadaZero Database Schema for Supabase
-- Execute este script no SQL Editor do Supabase

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de organizações
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cálculos de carbono
CREATE TABLE IF NOT EXISTS carbon_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    energy_consumption DECIMAL(10,2) NOT NULL,
    transport_km DECIMAL(10,2) NOT NULL,
    waste_kg DECIMAL(10,2) NOT NULL,
    water_usage DECIMAL(10,2) NOT NULL,
    energy_co2 DECIMAL(10,4) NOT NULL,
    transport_co2 DECIMAL(10,4) NOT NULL,
    waste_co2 DECIMAL(10,4) NOT NULL,
    water_co2 DECIMAL(10,4) NOT NULL,
    total_co2 DECIMAL(10,4) NOT NULL,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_carbon_calculations_user_id ON carbon_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_carbon_calculations_date ON carbon_calculations(calculation_date);
CREATE INDEX IF NOT EXISTS idx_carbon_calculations_organization ON carbon_calculations(organization_id);

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_calculations ENABLE ROW LEVEL SECURITY;

-- Política para usuários (podem ver apenas seus próprios dados)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Política para cálculos de carbono (usuários podem ver apenas seus próprios cálculos)
CREATE POLICY "Users can view own calculations" ON carbon_calculations
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own calculations" ON carbon_calculations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own calculations" ON carbon_calculations
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Política para organizações (públicas para leitura)
CREATE POLICY "Organizations are viewable by everyone" ON organizations
    FOR SELECT USING (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional)
INSERT INTO organizations (name, description) VALUES 
    ('Empresa Sustentável Ltda', 'Empresa focada em sustentabilidade'),
    ('EcoTech Solutions', 'Soluções tecnológicas verdes'),
    ('Green Business Corp', 'Corporação de negócios verdes')
ON CONFLICT DO NOTHING;