const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
// Forçar fallback em memória para desenvolvimento/local quando desejar
process.env.FORCE_MEMORY = process.env.FORCE_MEMORY || 'true';

const User = require('./models/User');

// Rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const carbonRoutes = require('./routes/carbon');

// Configuração
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

async function seedMasterUser() {
  const email = process.env.MASTER_EMAIL || 'master@pegadazero.com.br';
  const password = process.env.MASTER_PASSWORD || 'PegadaZero@123';
  const name = process.env.MASTER_NAME || 'Master';
  try {
    const exists = await User.findOne({ email });
    if (!exists) {
      const master = new User({ name, email, password, role: 'admin', points: 1000 });
      await master.save();
      console.log(`Usuário Master criado: ${email}`);
    } else {
      console.log(`Usuário Master já existe: ${email}`);
    }
  } catch (e) {
    console.error('Falha ao criar usuário Master:', e);
  }
}

// Conexão com o banco de dados (usa Mongo se MONGO_URI definido e memória NÃO estiver forçada; caso contrário, fallback em memória via modelos)
if (process.env.MONGO_URI && process.env.FORCE_MEMORY !== 'true') {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Conectado ao MongoDB');
    seedMasterUser();
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    console.log('Forçando fallback em memória para continuar execução.');
    seedMasterUser();
  });
} else {
  console.log('Usando armazenamento em memória para dados de usuário.');
  seedMasterUser();
}

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carbon', carbonRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do PegadaZero está funcionando!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});