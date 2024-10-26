import React, { useState, useEffect } from 'react';
import { Loader, Trash2, Edit2, Plus, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';

const RuleList = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRules, setSelectedRules] = useState([]);
  const [showCombineDialog, setShowCombineDialog] = useState(false);
  const [combinedRuleName, setCombinedRuleName] = useState('');
  const [editingRule, setEditingRule] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/rules');
      if (!response.ok) {
        throw new Error('Failed to fetch rules');
      }
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRuleSelect = (ruleId) => {
    setSelectedRules(prev => {
      if (prev.includes(ruleId)) {
        return prev.filter(id => id !== ruleId);
      }
      return [...prev, ruleId];
    });
  };

  const handleCombineRules = async () => {
    if (selectedRules.length < 2) {
      setError('Please select at least two rules to combine');
      return;
    }

    if (!combinedRuleName.trim()) {
      setError('Please provide a name for the combined rule');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/rules/combine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ruleIds: selectedRules,
          name: combinedRuleName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to combine rules');
      }

      await fetchRules();
      setSelectedRules([]);
      setShowCombineDialog(false);
      setCombinedRuleName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete rule');
      }

      await fetchRules();
      setShowDeleteConfirm(false);
      setRuleToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateRule = async (ruleId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/rules/${ruleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update rule');
      }

      await fetchRules();
      setEditingRule(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rules Management</h2>
        
        <div className="flex space-x-4">
          <button
            onClick={() => fetchRules()}
            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </button>

          <button
            onClick={() => setShowCombineDialog(true)}
            disabled={selectedRules.length < 2}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            Combine Selected
          </button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule String
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRules.includes(rule._id)}
                      onChange={() => handleRuleSelect(rule._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                    {rule.description && (
                      <div className="text-sm text-gray-500">{rule.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xl overflow-hidden overflow-ellipsis">
                      {rule.ruleString}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(rule.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditingRule(rule)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setRuleToDelete(rule);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Combine Rules Dialog */}
      <Dialog open={showCombineDialog} onOpenChange={setShowCombineDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Combine Rules</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Combined Rule Name
              </label>
              <input
                type="text"
                value={combinedRuleName}
                onChange={(e) => setCombinedRuleName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                placeholder="Enter name for combined rule"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Selected Rules
              </label>
              <div className="mt-1 space-y-2">
                {selectedRules.map(ruleId => {
                  const rule = rules.find(r => r._id === ruleId);
                  return (
                    <div key={ruleId} className="text-sm text-gray-600">
                      • {rule?.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowCombineDialog(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCombineRules}
              disabled={loading || !combinedRuleName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 ml-3"
            >
              {loading ? 'Combining...' : 'Combine Rules'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rule</DialogTitle>
          </DialogHeader>
          {editingRule && (
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={editingRule.name}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      name: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rule String
                  </label>
                  <textarea
                    value={editingRule.ruleString}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      ruleString: e.target.value
                    })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={editingRule.description || ''}
                    onChange={(e) => setEditingRule({
                      ...editingRule,
                      description: e.target.value
                    })}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => setEditingRule(null)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => handleUpdateRule(editingRule._id, editingRule)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-3"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Rule</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete the rule "{ruleToDelete?.name}"? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteRule(ruleToDelete?._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-3"
            >
              Delete Rule
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RuleList;