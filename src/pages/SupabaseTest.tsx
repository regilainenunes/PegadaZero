import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { supabaseAuthService, supabaseCarbonService } from '../services/supabaseService'

const SupabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [testResults, setTestResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testSupabaseConnection = async () => {
    setLoading(true)
    setTestResults([])
    addTestResult('Iniciando testes do Supabase...')

    try {
      // Test 1: Basic connection
      addTestResult('Teste 1: Conexão básica com Supabase')
      const { data, error } = await supabase.from('users').select('count').limit(1)
      
      if (error) {
        addTestResult(`❌ Erro na conexão: ${error.message}`)
        setConnectionStatus('error')
      } else {
        addTestResult('✅ Conexão com Supabase estabelecida')
        setConnectionStatus('connected')
      }

      // Test 2: Auth service
      addTestResult('Teste 2: Serviço de autenticação')
      try {
        const currentUser = await supabaseAuthService.getCurrentUser()
        addTestResult(`✅ Serviço de auth funcionando. Usuário atual: ${currentUser.user ? 'Logado' : 'Não logado'}`)
      } catch (authError: any) {
        addTestResult(`⚠️ Serviço de auth: ${authError.message}`)
      }

      // Test 3: Database tables
      addTestResult('Teste 3: Verificando tabelas do banco')
      
      const tables = ['users', 'organizations', 'carbon_records']
      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('*').limit(1)
          if (error) {
            addTestResult(`❌ Tabela '${table}': ${error.message}`)
          } else {
            addTestResult(`✅ Tabela '${table}' acessível`)
          }
        } catch (tableError: any) {
          addTestResult(`❌ Erro ao acessar tabela '${table}': ${tableError.message}`)
        }
      }

      // Test 4: Environment variables
      addTestResult('Teste 4: Variáveis de ambiente')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (supabaseUrl && supabaseKey) {
        addTestResult('✅ Variáveis de ambiente configuradas')
        addTestResult(`URL: ${supabaseUrl}`)
        addTestResult(`Key: ${supabaseKey.substring(0, 20)}...`)
      } else {
        addTestResult('❌ Variáveis de ambiente não encontradas')
      }

      addTestResult('🎉 Testes concluídos!')

    } catch (error: any) {
      addTestResult(`❌ Erro geral: ${error.message}`)
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    addTestResult('Testando registro de usuário...')
    
    try {
      const testEmail = `test-${Date.now()}@pegadazero.local`
      const testPassword = 'Test123!'
      const testName = 'Usuário Teste'
      const testCompany = 'Empresa Teste'

      const result = await supabaseAuthService.signUp(testEmail, testPassword, testName, testCompany)
      
      if (result) {
        addTestResult('✅ Registro de usuário bem-sucedido')
        addTestResult(`Email: ${testEmail}`)
        
        // Cleanup - remove test user
        await supabaseAuthService.signOut()
        addTestResult('✅ Logout realizado')
      } else {
        addTestResult('❌ Falha no registro')
      }
    } catch (error: any) {
      addTestResult(`❌ Erro no registro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Teste de Integração Supabase
          </h1>

          {/* Status da Conexão */}
          <div className="mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                connectionStatus === 'testing' ? 'bg-yellow-500 animate-pulse' :
                connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-lg font-medium">
                Status: {
                  connectionStatus === 'testing' ? 'Testando...' :
                  connectionStatus === 'connected' ? 'Conectado' : 'Erro na Conexão'
                }
              </span>
            </div>
          </div>

          {/* Botões de Teste */}
          <div className="mb-6 space-x-4">
            <button
              onClick={testSupabaseConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
            >
              {loading ? 'Testando...' : 'Testar Conexão'}
            </button>
            
            <button
              onClick={testSignUp}
              disabled={loading || connectionStatus !== 'connected'}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
            >
              Testar Registro
            </button>
          </div>

          {/* Resultados dos Testes */}
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <h3 className="text-white font-bold mb-2">Log de Testes:</h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {result}
                </div>
              ))}
              {testResults.length === 0 && (
                <div className="text-gray-500">Nenhum teste executado ainda...</div>
              )}
            </div>
          </div>

          {/* Informações de Configuração */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">Configuração Atual:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'Não configurada'}</div>
              <div><strong>Chave:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada'}</div>
            </div>
          </div>

          {/* Documentação */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold text-yellow-900 mb-2">📚 Documentação:</h3>
            <p className="text-sm text-yellow-800">
              Para mais informações sobre a integração Supabase, consulte o arquivo{' '}
              <code className="bg-yellow-200 px-1 rounded">README_SUPABASE.md</code> na raiz do projeto.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupabaseTest