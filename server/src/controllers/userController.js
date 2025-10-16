const User = require('../models/User');

// Atualizar perfil do usuário
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Verificar se o email já está em uso por outro usuário
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Este email já está em uso' });
      }
    }
    
    // Atualizar usuário
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
};

// Alterar senha
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verificar se as senhas foram fornecidas
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
    }
    
    // Verificar se a nova senha tem pelo menos 6 caracteres
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres' });
    }
    
    // Buscar usuário com senha
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Verificar senha atual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }
    
    // Atualizar senha
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro ao alterar senha' });
  }
};

// Excluir conta
exports.deleteAccount = async (req, res) => {
  try {
    // Excluir usuário
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Aqui você também pode excluir todos os dados relacionados ao usuário
    // Por exemplo: await CarbonFootprint.deleteMany({ user: req.user._id });
    
    res.json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    res.status(500).json({ message: 'Erro ao excluir conta' });
  }
};