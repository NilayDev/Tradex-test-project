const { supabase } = require('../config/supabase');

const getAllStrategies = async (req, res) => {
  try {
    const { data: strategies, error } = await supabase
      .from('strategies')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    res.json({ strategies });
  } catch (error) {
    console.error('Get strategies error:', error);
    res.status(500).json({ error: 'Failed to get strategies' });
  }
};

const getStrategyById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: strategy, error } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ strategy });
  } catch (error) {
    console.error('Get strategy error:', error);
    res.status(500).json({ error: 'Failed to get strategy' });
  }
};

const createStrategy = async (req, res) => {
  try {
    const strategyData = req.body;

    const { data: strategy, error } = await supabase
      .from('strategies')
      .insert([strategyData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: 'Strategy created successfully',
      strategy,
    });
  } catch (error) {
    console.error('Create strategy error:', error);
    res.status(500).json({ error: 'Failed to create strategy' });
  }
};

const updateStrategy = async (req, res) => {
  try {
    const { id } = req.params;
    const strategyData = req.body;

    const { data: strategy, error } = await supabase
      .from('strategies')
      .update(strategyData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Strategy updated successfully',
      strategy,
    });
  } catch (error) {
    console.error('Update strategy error:', error);
    res.status(500).json({ error: 'Failed to update strategy' });
  }
};

module.exports = {
  getAllStrategies,
  getStrategyById,
  createStrategy,
  updateStrategy
};
