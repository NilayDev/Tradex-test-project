const { Router } = require('express');
const {
  getAllStrategies,
  getStrategyById,
  createStrategy,
  updateStrategy,
} = require('../controllers/strategyController');

const router = Router();

router.get('/', getAllStrategies);
router.get('/:id', getStrategyById);
router.post('/', createStrategy);
router.put('/:id', updateStrategy);

module.exports = router;
