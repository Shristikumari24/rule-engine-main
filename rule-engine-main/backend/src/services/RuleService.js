const Rule = require('../models/Rule');
const ASTService = require('./ASTService');

class RuleService {
  constructor() {
    this.astService = new ASTService();
  }

  async createRule(ruleData) {
    try {
      const ast = this.astService.createRule(ruleData.ruleString);
      const rule = new Rule({
        name: ruleData.name,
        description: ruleData.description,
        ruleString: ruleData.ruleString,
        astJson: ast,
      });
      return await rule.save();
    } catch (error) {
      throw new Error(`Error creating rule: ${error.message}`);
    }
  }

  async combineRules(ruleIds) {
    try {
      const rules = await Rule.find({ _id: { $in: ruleIds } });
      const ruleStrings = rules.map(rule => rule.ruleString);
      const combinedAst = this.astService.combineRules(ruleStrings);
      return combinedAst;
    } catch (error) {
      throw new Error(`Error combining rules: ${error.message}`);
    }
  }

  async evaluateRule(ruleId, data) {
    try {
      const rule = await Rule.findById(ruleId);
      if (!rule) {
        throw new Error('Rule not found');
      }
      return this.astService.evaluateRule(rule.astJson, data);
    } catch (error) {
      throw new Error(`Error evaluating rule: ${error.message}`);
    }
  }
}

module.exports = RuleService;
