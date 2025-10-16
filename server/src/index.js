const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const carbonRoutes = require('./routes/carbon');

// Configuração
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pegadazero', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conexão com MongoDB estabelecida'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

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