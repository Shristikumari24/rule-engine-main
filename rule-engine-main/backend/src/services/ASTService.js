class Node {
    constructor(type, value = null, left = null, right = null) {
      this.type = type;
      this.value = value;
      this.left = left;
      this.right = right;
    }
  }
  
  class ASTService {
    constructor() {
      this.OPERATORS = {
        AND: 'AND',
        OR: 'OR',
        GT: '>',
        LT: '<',
        EQ: '=',
        GTE: '>=',
        LTE: '<=',
      };
  
      this.NODE_TYPES = {
        OPERATOR: 'operator',
        OPERAND: 'operand',
      };
    }
  
    createRule(ruleString) {
      const sanitizedRule = this._sanitizeRuleString(ruleString);
      const tokens = this._tokenize(sanitizedRule);
      return this._buildAST(tokens);
    }
  
    combineRules(rules) {
      if (!rules || rules.length === 0) {
        throw new Error('No rules provided');
      }
  
      if (rules.length === 1) {
        return this.createRule(rules[0]);
      }
  
      const astNodes = rules.map(rule => this.createRule(rule));
      let combinedNode = new Node(this.NODE_TYPES.OPERATOR, this.OPERATORS.OR);
      combinedNode.left = astNodes[0];
  
      for (let i = 1; i < astNodes.length; i++) {
        const newCombined = new Node(this.NODE_TYPES.OPERATOR, this.OPERATORS.OR);
        newCombined.left = combinedNode;
        newCombined.right = astNodes[i];
        combinedNode = newCombined;
      }
  
      return combinedNode;
    }
  
    evaluateRule(astJson, data) {
      const node = this._jsonToNode(astJson);
      return this._evaluateNode(node, data);
    }
  
    _sanitizeRuleString(ruleString) {
      if (!ruleString || typeof ruleString !== 'string') {
        throw new Error('Invalid rule string');
      }
      return ruleString.trim();
    }
  
    _tokenize(ruleString) {
      const regex = /([()[\]]|\bAND\b|\bOR\b|>=|<=|>|<|=|\s+)/;
      return ruleString
        .split(regex)
        .map(token => token.trim())
        .filter(token => token.length > 0);
    }
  
    _buildAST(tokens) {
      const parseExpression = (tokens, startIndex = 0) => {
        const stack = [];
        let currentNode = null;
        let i = startIndex;
  
        while (i < tokens.length) {
          const token = tokens[i];
  
          if (token === '(') {
            const [subtree, newIndex] = parseExpression(tokens, i + 1);
            if (currentNode === null) {
              currentNode = subtree;
            } else if (currentNode.type === this.NODE_TYPES.OPERATOR) {
              if (!currentNode.left) {
                currentNode.left = subtree;
              } else {
                currentNode.right = subtree;
              }
            }
            i = newIndex;
          } else if (token === ')') {
            return [currentNode, i];
          } else if (Object.values(this.OPERATORS).includes(token)) {
            const newNode = new Node(this.NODE_TYPES.OPERATOR, token);
            if (currentNode) {
              newNode.left = currentNode;
              currentNode = newNode;
            } else {
              currentNode = newNode;
            }
          } else {
            // Handle operands
            const operandNode = new Node(this.NODE_TYPES.OPERAND, token);
            if (currentNode === null) {
              currentNode = operandNode;
            } else if (currentNode.type === this.NODE_TYPES.OPERATOR) {
              if (!currentNode.left) {
                currentNode.left = operandNode;
              } else {
                currentNode.right = operandNode;
              }
            }
          }
          i++;
        }
  
        return [currentNode, i];
      };
  
      const [ast] = parseExpression(tokens);
      return ast;
    }
  
    _evaluateNode(node, data) {
      if (!node) return false;
  
      if (node.type === this.NODE_TYPES.OPERAND) {
        return this._evaluateOperand(node.value, data);
      }
  
      switch (node.value) {
        case this.OPERATORS.AND:
          return this._evaluateNode(node.left, data) && this._evaluateNode(node.right, data);
        case this.OPERATORS.OR:
          return this._evaluateNode(node.left, data) || this._evaluateNode(node.right, data);
        default:
          return this._evaluateComparison(node, data);
      }
    }
  
    _evaluateOperand(value, data) {
      // Handle field references and literals
      if (value in data) {
        return data[value];
      }
      // Try to parse as number if possible
      return !isNaN(value) ? parseFloat(value) : value;
    }
  
    _evaluateComparison(node, data) {
      const leftValue = this._evaluateNode(node.left, data);
      const rightValue = this._evaluateNode(node.right, data);
  
      switch (node.value) {
        case this.OPERATORS.GT:
          return leftValue > rightValue;
        case this.OPERATORS.LT:
          return leftValue < rightValue;
        case this.OPERATORS.EQ:
          return leftValue === rightValue;
        case this.OPERATORS.GTE:
          return leftValue >= rightValue;
        case this.OPERATORS.LTE:
          return leftValue <= rightValue;
        default:
          throw new Error(`Unknown operator: ${node.value}`);
      }
    }
  
    _jsonToNode(json) {
      if (!json) return null;
      return new Node(
        json.type,
        json.value,
        this._jsonToNode(json.left),
        this._jsonToNode(json.right)
      );
    }
  }
  
  module.exports = ASTService;
  