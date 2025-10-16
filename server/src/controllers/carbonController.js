const CarbonFootprint = require('../models/CarbonFootprint');

// Adicionar nova medição de pegada de carbono
exports.addFootprint = async (req, res) => {
  try {
    const { transportation, energy, food, waste } = req.body;
    
    // Cálculo simplificado da pegada total de carbono
    // Estes são valores de exemplo e devem ser ajustados com base em cálculos reais
    const totalEmissions = 
      (transportation.carKm * 0.12) + 
      (transportation.publicTransportKm * 0.03) + 
      (transportation.flightKm * 0.25) +
      (energy.electricityKwh * 0.5) + 
      (energy.gasConsumption * 0.2) +
      (food.meatConsumption * 3) + 
      (food.dairyConsumption * 1.5) -
      (waste.recyclingPercentage * 0.01 * waste.wasteProduced);
    
    const newFootprint = new CarbonFootprint({
      user: req.user._id,
      transportation,
      energy,
      food,
      waste,
      totalEmissions: Math.max(0, totalEmissions) // Garantir que não seja negativo
    });
    
    await newFootprint.save();
    
    res.status(201).json(newFootprint);
  } catch (error) {
    console.error('Erro ao adicionar pegada de carbono:', error);
    res.status(500).json({ message: 'Erro ao adicionar pegada de carbono' });
  }
};

// Obter todas as medições do usuário
exports.getUserFootprints = async (req, res) => {
  try {
    const footprints = await CarbonFootprint.find({ user: req.user._id })
      .sort({ date: -1 });
    
    res.json(footprints);
  } catch (error) {
    console.error('Erro ao obter pegadas de carbono:', error);
    res.status(500).json({ message: 'Erro ao obter pegadas de carbono' });
  }
};

// Obter uma medição específica
exports.getFootprintById = async (req, res) => {
  try {
    const footprint = await CarbonFootprint.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!footprint) {
      return res.status(404).json({ message: 'Medição não encontrada' });
    }
    
    res.json(footprint);
  } catch (error) {
    console.error('Erro ao obter medição:', error);
    res.status(500).json({ message: 'Erro ao obter medição' });
  }
};

// Atualizar uma medição
exports.updateFootprint = async (req, res) => {
  try {
    const { transportation, energy, food, waste } = req.body;
    
    // Recalcular emissões totais
    const totalEmissions = 
      (transportation.carKm * 0.12) + 
      (transportation.publicTransportKm * 0.03) + 
      (transportation.flightKm * 0.25) +
      (energy.electricityKwh * 0.5) + 
      (energy.gasConsumption * 0.2) +
      (food.meatConsumption * 3) + 
      (food.dairyConsumption * 1.5) -
      (waste.recyclingPercentage * 0.01 * waste.wasteProduced);
    
    const updatedFootprint = await CarbonFootprint.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { 
        transportation, 
        energy, 
        food, 
        waste,
        totalEmissions: Math.max(0, totalEmissions)
      },
      { new: true }
    );
    
    if (!updatedFootprint) {
      return res.status(404).json({ message: 'Medição não encontrada' });
    }
    
    res.json(updatedFootprint);
  } catch (error) {
    console.error('Erro ao atualizar medição:', error);
    res.status(500).json({ message: 'Erro ao atualizar medição' });
  }
};

// Excluir uma medição
exports.deleteFootprint = async (req, res) => {
  try {
    const deletedFootprint = await CarbonFootprint.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!deletedFootprint) {
      return res.status(404).json({ message: 'Medição não encontrada' });
    }
    
    res.json({ message: 'Medição excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir medição:', error);
    res.status(500).json({ message: 'Erro ao excluir medição' });
  }
};

// Obter resumo da pegada de carbono
exports.getFootprintSummary = async (req, res) => {
  try {
    // Obter todas as medições do usuário
    const footprints = await CarbonFootprint.find({ user: req.user._id });
    
    if (footprints.length === 0) {
      return res.json({
        totalEmissions: 0,
        averageEmissions: 0,
        transportationPercentage: 0,
        energyPercentage: 0,
        foodPercentage: 0,
        wastePercentage: 0
      });
    }
    
    // Calcular estatísticas
    let totalEmissions = 0;
    let transportationTotal = 0;
    let energyTotal = 0;
    let foodTotal = 0;
    let wasteImpact = 0;
    
    footprints.forEach(footprint => {
      totalEmissions += footprint.totalEmissions;
      
      // Calcular contribuição de cada categoria
      const transportationEmissions = 
        (footprint.transportation.carKm * 0.12) + 
        (footprint.transportation.publicTransportKm * 0.03) + 
        (footprint.transportation.flightKm * 0.25);
      
      const energyEmissions = 
        (footprint.energy.electricityKwh * 0.5) + 
        (footprint.energy.gasConsumption * 0.2);
      
      const foodEmissions = 
        (footprint.food.meatConsumption * 3) + 
        (footprint.food.dairyConsumption * 1.5);
      
      const wasteReduction = 
        (footprint.waste.recyclingPercentage * 0.01 * footprint.waste.wasteProduced);
      
      transportationTotal += transportationEmissions;
      energyTotal += energyEmissions;
      foodTotal += foodEmissions;
      wasteImpact += wasteReduction;
    });
    
    const averageEmissions = totalEmissions / footprints.length;
    
    // Calcular percentagens (evitando divisão por zero)
    const totalBeforeWaste = transportationTotal + energyTotal + foodTotal;
    const transportationPercentage = totalBeforeWaste > 0 ? (transportationTotal / totalBeforeWaste) * 100 : 0;
    const energyPercentage = totalBeforeWaste > 0 ? (energyTotal / totalBeforeWaste) * 100 : 0;
    const foodPercentage = totalBeforeWaste > 0 ? (foodTotal / totalBeforeWaste) * 100 : 0;
    const wastePercentage = totalBeforeWaste > 0 ? (wasteImpact / totalBeforeWaste) * 100 : 0;
    
    res.json({
      totalEmissions,
      averageEmissions,
      transportationPercentage,
      energyPercentage,
      foodPercentage,
      wastePercentage,
      footprintCount: footprints.length,
      latestFootprint: footprints.sort((a, b) => b.date - a.date)[0]
    });
  } catch (error) {
    console.error('Erro ao obter resumo:', error);
    res.status(500).json({ message: 'Erro ao obter resumo' });
  }
};