Rule Engine with AST
<br>
A simple 3-tier rule engine application designed to determine user eligibility based on various attributes like age, department, income, and spending. This rule engine utilizes an Abstract Syntax Tree (AST) to dynamically create, modify, and combine eligibility rules through a structured data model and flexible API.

Objective
The purpose of this application is to provide a highly configurable rule engine that allows users to:

Define custom eligibility rules as conditional expressions.
Combine and modify rules using an AST representation.
Evaluate these rules dynamically based on user attributes.
Features
AST-based Rule Representation: The engine uses an AST data structure to represent rules, allowing for easy manipulation and evaluation of complex conditions.
Flexible Rule Management: Rules can be created, combined, modified, and evaluated through a set of APIs.
Three-Tier Architecture: The application is organized into a Simple UI, API & Backend, and Data layer for efficient processing and scalability.
Data Structure
The AST structure is implemented using a Node class with the following fields:

type: Indicates the type of node (operator for AND/OR operations, operand for conditions).
left: Reference to the left child node.
right: Reference to the right child node.
value: Optional field, stores values for operand nodes (e.g., values for comparisons).
Example:

python
Copy code
class Node:
    def __init__(self, type, left=None, right=None, value=None):
        self.type = type
        self.left = left
        self.right = right
        self.value = value
Sample Rules
rule1: ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)
rule2: ((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)
Data Storage
Database Choice: A document-based NoSQL database (e.g., MongoDB) is recommended to store rule structures and application metadata.
Schema Design:
Each rule is stored as a document containing fields for type, left, right, and value attributes.
Example:
json
Copy code
{
  "type": "operator",
  "left": {...},
  "right": {...},
  "value": null
}
API Design
1. create_rule(rule_string)
Purpose: Parses a rule string and constructs the corresponding AST.
Input: A string representing the rule logic.
Output: A Node object representing the root of the AST.
2. combine_rules(rules)
Purpose: Combines multiple rules into a single AST using heuristic-based optimization to minimize redundant checks.
Input: List of rule strings.
Output: Root node of the combined AST.
3. evaluate_rule(JSON data)
Purpose: Evaluates the combined rule's AST against provided data attributes.
Input: JSON object representing user attributes (e.g., {"age": 35, "department": "Sales", "salary": 60000, "experience": 3}).
Output: Returns True if data matches the rule criteria, otherwise False.
Test Cases
Individual Rule Creation: Use create_rule with sample rules and verify the resulting AST structure.
Rule Combination: Use combine_rules to merge sample rules and check the accuracy of the combined AST.
Evaluation Testing: Test evaluate_rule using JSON data samples to validate different rule scenarios.
Additional Rule Testing: Experiment with additional rules to further assess functionality.
Bonus Features
Error Handling: Implements validation for invalid rule strings or data inputs (e.g., missing operators, unsupported comparisons).
Attribute Validation: Checks attribute existence and compatibility with a defined catalog.
Rule Modification: Allows updates to existing rules, enabling changes to operators, operand values, and sub-expressions.
Advanced Function Support: Optional support for user-defined functions within rules to accommodate complex conditions.

