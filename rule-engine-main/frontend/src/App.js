import React, { useState } from 'react';
import { Layout, Menu } from 'lucide-react';
import RuleBuilder from './components/RuleBuilder';
import RuleList from './components/RuleList';
import RuleEvaluator from './components/RuleEvaluator';

const App = () => {
  const [activeTab, setActiveTab] = useState('builder');

  const renderContent = () => {
    switch (activeTab) {
      case 'builder':
        return <RuleBuilder />;
      case 'list':
        return <RuleList />;
      case 'evaluator':
        return <RuleEvaluator />;
      default:
        return <RuleBuilder />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-blue-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Rule Engine</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-4 text-sm font-medium ${
                activeTab === 'builder'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Rule
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-4 text-sm font-medium ${
                activeTab === 'list'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Rules
            </button>
            <button
              onClick={() => setActiveTab('evaluator')}
              className={`px-3 py-4 text-sm font-medium ${
                activeTab === 'evaluator'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Evaluate Rules
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Rule Engine Application - Built with React & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;