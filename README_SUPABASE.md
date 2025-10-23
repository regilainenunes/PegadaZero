# Integração Supabase - PegadaZero

## 📋 Visão Geral

Este documento descreve a integração do Supabase no projeto PegadaZero, fornecendo uma alternativa moderna e escalável ao backend atual.

## 🚀 Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.development`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://wtgwppgkijrzbiznrgkt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Z3dwcGdraWpyemJpem5yZ2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDg5MDEsImV4cCI6MjA3NjgyNDkwMX0.ke8vo_eeL732h5ZBh_stwrd_LnnZ97RI9PQRvVr3t_8
```

### 2. Dependências

O projeto já inclui a dependência do Supabase:

```bash
npm install @supabase/supabase-js
```

## 📁 Estrutura de Arquivos

### Novos Arquivos Criados

- `src/services/supabase.ts` - Cliente Supabase e tipos de banco de dados
- `src/services/supabaseService.ts` - Serviços específicos do Supabase
- `src/contexts/SupabaseAuthContext.tsx` - Contexto de autenticação Supabase
- `src/components/SupabaseRoute.tsx` - Componente de rota protegida

## 🔧 Serviços Disponíveis

### Autenticação (`supabaseAuthService`)

```typescript
// Registro de usuário
await supabaseAuthService.signUp(email, password, name, company)

// Login
await supabaseAuthService.signIn(email, password)

// Logout
await supabaseAuthService.signOut()

// Obter usuário atual
await supabaseAuthService.getCurrentUser()

// Atualizar perfil
await supabaseAuthService.updateProfile(userId, updates)
```

### Registros de Carbono (`supabaseCarbonService`)

```typescript
// Adicionar registro
await supabaseCarbonService.addRecord(record)

// Obter registros do usuário
await supabaseCarbonService.getUserRecords(userId)

// Obter registros da organização
await supabaseCarbonService.getOrganizationRecords(organizationId)

// Atualizar registro
await supabaseCarbonService.updateRecord(id, updates)

// Deletar registro
await supabaseCarbonService.deleteRecord(id)

// Obter resumo
await supabaseCarbonService.getSummary(userId, organizationId)
```

### Organizações (`supabaseOrganizationService`)

```typescript
// Criar organização
await supabaseOrganizationService.create(name)

// Obter por ID
await supabaseOrganizationService.getById(id)

// Atualizar
await supabaseOrganizationService.update(id, updates)

// Obter usuários
await supabaseOrganizationService.getUsers(organizationId)
```

## 🎯 Como Usar

### 1. Contexto de Autenticação

Envolva sua aplicação com o `SupabaseAuthProvider`:

```tsx
import { SupabaseAuthProvider } from './contexts/SupabaseAuthContext'

function App() {
  return (
    <SupabaseAuthProvider>
      {/* Sua aplicação */}
    </SupabaseAuthProvider>
  )
}
```

### 2. Hook de Autenticação

Use o hook `useSupabaseAuth` em seus componentes:

```tsx
import { useSupabaseAuth } from './contexts/SupabaseAuthContext'

function MyComponent() {
  const { user, profile, signIn, signOut, loading } = useSupabaseAuth()
  
  // Sua lógica aqui
}
```

### 3. Rotas Protegidas

Use o componente `SupabaseRoute` para proteger rotas:

```tsx
import SupabaseRoute from './components/SupabaseRoute'

<SupabaseRoute requireAuth={true} requiredRole="admin">
  <AdminPanel />
</SupabaseRoute>
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas

#### `users`
- `id` (string, PK)
- `email` (string)
- `name` (string)
- `role` (string)
- `organization_id` (string, FK)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `organizations`
- `id` (string, PK)
- `name` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `carbon_records`
- `id` (string, PK)
- `user_id` (string, FK)
- `organization_id` (string, FK)
- `category` (string)
- `subcategory` (string)
- `value` (number)
- `unit` (string)
- `co2_equivalent` (number)
- `date` (string)
- `description` (string, opcional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## 🔄 Migração Gradual

O Supabase foi integrado como uma alternativa ao backend atual, permitindo:

1. **Coexistência**: Ambos os sistemas podem funcionar simultaneamente
2. **Migração Gradual**: Migre funcionalidades uma por vez
3. **Fallback**: Mantenha o sistema atual como backup

## 🧪 Testes

Para testar a integração:

1. Configure as variáveis de ambiente
2. Inicie o frontend: `npm run dev`
3. Use os novos serviços Supabase em seus componentes
4. Monitore o console para logs de debug

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 🔐 Segurança

- As chaves de API estão configuradas como variáveis de ambiente
- Use Row Level Security (RLS) no Supabase para proteção adicional
- Implemente validação adequada no frontend e backend

## 🚀 Próximos Passos

1. Configurar RLS no Supabase
2. Migrar componentes específicos para usar Supabase
3. Implementar sincronização de dados
4. Configurar backup e recuperação
5. Otimizar queries e performance