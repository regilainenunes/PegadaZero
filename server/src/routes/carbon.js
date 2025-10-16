const express = require('express');
const router = express.Router();
const carbonController = require('../controllers/carbonController');
const { auth } = require('../middleware/auth');

// Todas as rotas de carbono requerem autenticação
router.use(auth);

// Rotas para pegada de carbono
router.post('/', carbonController.addFootprint);
router.get('/', carbonController.getUserFootprints);
router.get('/summary', carbonController.getFootprintSummary);
router.get('/:id', carbonController.getFootprintById);
router.put('/:id', carbonController.updateFootprint);
router.delete('/:id', carbonController.deleteFootprint);

module.exports = router;