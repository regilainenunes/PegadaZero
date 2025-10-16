const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

// Middleware para verificar autenticação
const auth = async (req, res, next) => {
  try {
    // Verificar se o header de autorização existe
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    // Extrair o token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Acesso negado. Token inválido.' });
    }

    // Verificar o token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    // Verificar se o usuário existe
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Adicionar o usuário ao objeto de requisição
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Middleware para verificar se o usuário é admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Permissão de administrador necessária.' });
  }
};

module.exports = { auth, admin };