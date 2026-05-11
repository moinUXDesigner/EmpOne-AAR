import { Plus, Save, Send, Trash2, Eye, X, BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import { useState } from 'react';

interface Training {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface ProposedTraining {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  submittedOn: string;
}

const TrainingDevelopment = () => {
  const [trainings, setTrainings] = useState<Training[]>([
    { id: '1', title: '', description: '', priority: 'medium' }
  ]);
  const [activeTab, setActiveTab] = useState<'proposed' | 'recommended' | 'completed'>('proposed');
  const [showForm, setShowForm] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<ProposedTraining | null>(null);
  const [proposedTrainings, setProposedTrainings] = useState<ProposedTraining[]>([
    {
      id: '1',
      title: 'Advanced Project Management',
      description: 'Comprehensive training on modern project management methodologies including Agile and Scrum',
      priority: 'high',
      status: 'pending',
      submittedOn: 'Mar 1, 2026'
    },
    {
      id: '2',
      title: 'Leadership Skills Development',
      description: 'Develop essential leadership and team management skills',
      priority: 'medium',
      status: 'approved',
      submittedOn: 'Feb 28, 2026'
    }
  ]);

  const addTraining = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setTrainings([{ id: Date.now().toString(), title: '', description: '', priority: 'medium' }]);
    }
  };

  const removeTraining = (id: string) => {
    setTrainings(trainings.filter(t => t.id !== id));
  };

  const updateTraining = (id: string, field: keyof Training, value: string) => {
    setTrainings(trainings.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addTrainingRow = () => {
    setTrainings([...trainings, { id: Date.now().toString(), title: '', description: '', priority: 'medium' }]);
  };

  const submitTrainings = () => {
    const newProposedTrainings = trainings
      .filter(t => t.title.trim() !== '' && t.description.trim() !== '')
      .map(t => ({
        ...t,
        status: 'pending' as const,
        submittedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }));
    
    setProposedTrainings([...proposedTrainings, ...newProposedTrainings]);
    setShowForm(false);
    setTrainings([{ id: Date.now().toString(), title: '', description: '', priority: 'medium' }]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Training & Development Needs</h1>
          <p className="text-gray-600 mt-1">Identify training programs that will help enhance your skills</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Send className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex flex-col sm:flex-row gap-1">
          <button
            onClick={() => setActiveTab('proposed')}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'proposed'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Proposed Trainings
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'recommended'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Recommended
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            Completed
          </button>
        </div>
      </div>

      {activeTab === 'proposed' && (
        <div className="space-y-6 transition-all">
          {/* Training Needs Form */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Section VI - Training Needs</h2>
            <p className="text-sm text-gray-600 mt-1">List training programs you would like to attend</p>
          </div>
          <button
            onClick={addTraining}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              showForm 
                ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Cancel' : 'Add Training'}
          </button>
        </div>

        {showForm && (
          <>
            <div className="p-6">
              <div className="space-y-6">
                {trainings.map((training, index) => (
                  <div key={training.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Training Need #{index + 1}</h3>
                      {trainings.length > 1 && (
                        <button
                          onClick={() => removeTraining(training.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Training Title <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          value={training.title}
                          onChange={(e) => updateTraining(training.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="e.g., Advanced Project Management, Leadership Skills, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          value={training.description}
                          onChange={(e) => updateTraining(training.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Describe the training program and how it will benefit your role..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Priority Level <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={training.priority}
                          onChange={(e) => updateTraining(training.id, 'priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between items-center">
              <button
                onClick={addTrainingRow}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                Add Another Training
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitTrainings}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                  Submit Trainings
                </button>
              </div>
            </div>
          </>
        )}
      </div>

          {/* Proposed Trainings Table */}
          <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Proposed Trainings</h2>
          <p className="text-sm text-gray-600 mt-1">All trainings you have proposed for approval</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Training Title</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proposedTrainings.map((training) => (
                <tr key={training.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{training.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-700 max-w-md truncate">{training.description}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(training.priority)}`}>
                      {training.priority.charAt(0).toUpperCase() + training.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(training.status)}`}>
                      {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{training.submittedOn}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => setSelectedTraining(training)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {proposedTrainings.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p>No proposed trainings yet</p>
            <p className="text-sm mt-1">Click "Add Training" to propose new trainings</p>
          </div>
        )}
      </div>
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="transition-all">
          {/* Completed Trainings */}
          <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Completed Trainings (Current Year)</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Training Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Completion Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Certificate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">Agile Methodology</td>
                  <td className="py-3 px-4 text-sm text-gray-900">3 days</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Jan 15, 2026</td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-blue-600 hover:text-blue-700">View</button>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">Data Analytics with Python</td>
                  <td className="py-3 px-4 text-sm text-gray-900">5 days</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Feb 20, 2026</td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-blue-600 hover:text-blue-700">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
        </div>
      )}

      {activeTab === 'recommended' && (
        <div className="transition-all">
          {/* Recommended Trainings */}
          <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recommended Trainings</h2>
          <p className="text-sm text-gray-600 mt-1">Based on your role and performance gaps</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Strategic Planning & Execution</h3>
              <p className="text-sm text-gray-600 mb-3">
                Develop skills in long-term strategic planning and implementation
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Leadership</span>
                <button className="text-sm text-blue-600 hover:text-blue-700">Learn More</button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Technical Documentation Best Practices</h3>
              <p className="text-sm text-gray-600 mb-3">
                Master the art of creating clear and comprehensive technical documentation
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Technical</span>
                <button className="text-sm text-blue-600 hover:text-blue-700">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      )}

      {/* Training Details Modal */}
      {selectedTraining && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTraining(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Training Details</h2>
              <button
                onClick={() => setSelectedTraining(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Training Title</label>
                <p className="text-lg font-semibold text-gray-900">{selectedTraining.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <p className="text-gray-700 leading-relaxed">{selectedTraining.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Priority Level</label>
                  <span className={`inline-block px-3 py-1.5 rounded text-sm font-medium ${getPriorityColor(selectedTraining.priority)}`}>
                    {selectedTraining.priority.charAt(0).toUpperCase() + selectedTraining.priority.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-block px-3 py-1.5 rounded text-sm font-medium ${getStatusColor(selectedTraining.status)}`}>
                    {selectedTraining.status.charAt(0).toUpperCase() + selectedTraining.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Submitted On</label>
                  <p className="text-gray-900 font-medium">{selectedTraining.submittedOn}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-500">
                  Training ID: <span className="font-mono text-gray-900">{selectedTraining.id}</span>
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTraining(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDevelopment;