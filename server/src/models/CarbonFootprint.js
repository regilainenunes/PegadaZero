const mongoose = require('mongoose');

const CarbonFootprintSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  transportation: {
    carKm: { type: Number, default: 0 },
    publicTransportKm: { type: Number, default: 0 },
    flightKm: { type: Number, default: 0 }
  },
  energy: {
    electricityKwh: { type: Number, default: 0 },
    gasConsumption: { type: Number, default: 0 }
  },
  food: {
    meatConsumption: { type: Number, default: 0 },
    dairyConsumption: { type: Number, default: 0 },
    locallySourced: { type: Boolean, default: false }
  },
  waste: {
    recyclingPercentage: { type: Number, default: 0 },
    wasteProduced: { type: Number, default: 0 }
  },
  totalEmissions: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('CarbonFootprint', CarbonFootprintSchema);