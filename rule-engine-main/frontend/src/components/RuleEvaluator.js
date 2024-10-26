import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader } from 'lucide-react';

const RuleEvaluator = () => {
  const [rules, setRules] = useState([]);
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [inputData, setInputData] = useState({
    age: '',
    department: '',
    salary: '',
    experience: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [evaluationHistory, setEvaluationHistory] = useState([]);

  // Fetch available rules on component mount
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/rules');
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError('Failed to fetch rules');
    }
  };

  const validateInputData = () => {
    const errors = [];
    
    if (inputData.age && isNaN(inputData.age)) {
      errors.push('Age must be a number');
    }
    
    if (inputData.salary && isNaN(inputData.salary)) {
      errors.push('Salary must be a number');
    }
    
    if (inputData.experience && isNaN(inputData.experience)) {
      errors.push('Experience must be a number');
    }
    
    return errors;
  };

  const handleInputChange = (field, value) => {
    setInputData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
    setResult(null);
  };

  const handleEvaluate = async () => {
    setError('');
    setResult(null);
    setIsLoading(true);

    // Validate selected rule
    if (!selectedRuleId) {
      setError('Please select a rule to evaluate');
      setIsLoading(false);
      return;
    }

    // Validate input data
    const validationErrors = validateInputData();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setIsLoading(false);
      return;
    }

    // Convert string values to appropriate types
    const processedData = {
      ...inputData,
      age: inputData.age ? Number(inputData.age) : '',
      salary: inputData.salary ? Number(inputData.salary) : '',
      experience: inputData.experience ? Number(inputData.experience) : ''
    };

    try {
      const response = await fetch(`http://localhost:3001/api/rules/${selectedRuleId}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: processedData }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      setResult(data.result);
      
      // Add to evaluation history
      const historyEntry = {
        timestamp: new Date().toLocaleString(),
        ruleId: selectedRuleId,
        ruleName: rules.find(r => r._id === selectedRuleId)?.name,
        inputData: processedData,
        result: data.result
      };
      
      setEvaluationHistory(prev => [historyEntry, ...prev].slice(0, 10));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputData({
      age: '',
      department: '',
      salary: '',
      experience: ''
    });
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Rule Evaluator</h2>
      
      {/* Rule Selection */}
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Select Rule:</span>
          <select
            value={selectedRuleId}
            onChange={(e) => setSelectedRuleId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
          >
            <option value="">Select a rule...</option>
            {rules.map(rule => (
              <option key={rule._id} value={rule._id}>
                {rule.name}
              </option>
            ))}
          </select>
        </label>

        {selectedRuleId && (
          <div className="text-sm text-gray-600">
            Rule: {rules.find(r => r._id === selectedRuleId)?.ruleString}
          </div>
        )}
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block">
            <span className="text-gray-700">Age:</span>
            <input
              type="number"
              value={inputData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Enter age"
            />
          </label>
        </div>

        <div>
          <label className="block">
            <span className="text-gray-700">Department:</span>
            <select
              value={inputData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            >
              <option value="">Select department...</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block">
            <span className="text-gray-700">Salary:</span>
            <input
              type="number"
              value={inputData.salary}
              onChange={(e) => handleInputChange('salary', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Enter salary"
            />
          </label>
        </div>

        <div>
          <label className="block">
            <span className="text-gray-700">Experience (years):</span>
            <input
              type="number"
              value={inputData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
              placeholder="Enter years of experience"
            />
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleEvaluate}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Evaluating...
            </span>
          ) : (
            'Evaluate Rule'
          )}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Reset
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Result Display */}
      {result !== null && (
        <div className={`p-4 rounded-md ${result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-medium">
            Rule evaluation result: {result ? 'Passed ✓' : 'Failed ✗'}
          </p>
        </div>
      )}

      {/* Evaluation History */}
      {showHistory && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Evaluation History</h3>
          <div className="space-y-4">
            {evaluationHistory.map((entry, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{entry.ruleName}</span>
                  <span>{entry.timestamp}</span>
                </div>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded ${
                    entry.result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {entry.result ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Input: {JSON.stringify(entry.inputData)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleEvaluator;