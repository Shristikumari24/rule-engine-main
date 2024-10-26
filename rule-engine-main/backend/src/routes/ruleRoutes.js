const express = require('express');
const router = express.Router();
const RuleService = require('../services/RuleService');
const ruleService = new RuleService();

router.post('/rules', async (req, res) => {
  try {
    const rule = await ruleService.createRule(req.body);
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/rules/combine', async (req, res) => {
  try {
    const combinedAst = await ruleService.combineRules(req.body.ruleIds);
    res.json(combinedAst);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/rules/:id/evaluate', async (req, res) => {
  try {
    const result = await ruleService.evaluateRule(req.params.id, req.body.data);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
