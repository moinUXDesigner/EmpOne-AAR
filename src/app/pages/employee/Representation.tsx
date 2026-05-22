import { useState } from 'react';
import { Upload, Clock, Send, FileText, CheckCircle, AlertCircle, Gavel, Database } from 'lucide-react';

type RepresentationStatus = 'not-submitted' | 'submitted' | 'po-review' | 'forwarded-ac' | 'decided';

interface StatusStep {
  label: string;
  date: string | null;
  done: boolean;
  active: boolean;
}

const mockStatus: RepresentationStatus = 'forwarded-ac';

const statusSteps = (status: RepresentationStatus): StatusStep[] => [
  { label: 'Representation Submitted', date: 'Mar 20, 2026', done: true, active: false },
  {
    label: 'Under PO Review',
    date: status === 'submitted' ? null : 'Mar 22, 2026',
    done: ['po-review', 'forwarded-ac', 'decided'].includes(status),
    active: status === 'submitted',
  },
  {
    label: 'Forwarded to Appeal Committee',
    date: status === 'forwarded-ac' || status === 'decided' ? 'Mar 25, 2026' : null,
    done: ['forwarded-ac', 'decided'].includes(status),
    active: status === 'po-review',
  },
  {
    label: 'Final Decision Published',
    date: status === 'decided' ? 'Apr 2, 2026' : null,
    done: status === 'decided',
    active: status === 'forwarded-ac',
  },
];

const Representation = () => {
  const [text, setText] = useState('');
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(mockStatus !== 'not-submitted');
  const currentStatus: RepresentationStatus = submitted ? mockStatus : 'not-submitted';
  const timeRemaining = '10 days 5 hours';

  const handleSubmit = () => {
    if (!text.trim() || !declared) return;
    setSubmitted(true);
  };

  const steps = statusSteps(submitted ? mockStatus : 'not-submitted');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Representation</h1>
        <p className="text-gray-600 mt-1">Submit representation against your performance evaluation</p>
      </div>

      {/* Status Tracker (shown after submission) */}
      {submitted && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Representation Status</h2>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-gray-200" />
            <div className="space-y-5">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                      step.done
                        ? 'bg-green-500 text-white'
                        : step.active
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : step.active ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p
                      className={`text-sm font-medium ${
                        step.done
                          ? 'text-green-800'
                          : step.active
                          ? 'text-blue-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-xs text-gray-500 mt-0.5">{step.date}</p>
                    )}
                    {step.active && (
                      <p className="text-xs text-blue-600 mt-0.5">In progress...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Result (if decided) */}
          {currentStatus === 'decided' && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <Database className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Appeal Committee Decision Published to SAP
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Final Score: <span className="font-bold">7.5 / 10</span> · Grade: Good
                </p>
                <p className="text-xs text-green-600 mt-1">
                  The committee reviewed your representation and revised the KRA performance score
                  in light of documented contractor delays.
                </p>
              </div>
            </div>
          )}

          {/* Forwarded to AC notice */}
          {currentStatus === 'forwarded-ac' && (
            <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-3">
              <Gavel className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-purple-800">
                  Case Forwarded to Appeal Committee
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  The Personnel Officer has reviewed your representation and forwarded it to the
                  Appeal Committee for final decision. You will be notified once the decision is taken.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Evaluation Summary */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Your Evaluation Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Overall Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">6.8</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grade</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">Average</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">KRA Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">6.5</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Disclosed On</p>
              <p className="text-sm font-medium text-gray-900 mt-1">Mar 15, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Representation Form — only shown when not yet submitted */}
      {!submitted && (
        <>
          {/* Timer Alert */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-orange-900">Submission Deadline</p>
              <p className="text-sm text-orange-700 mt-1">
                You have <span className="font-semibold">{timeRemaining}</span> remaining to submit
                your representation
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Submit Representation</h2>
              <p className="text-sm text-gray-600 mt-1">
                You may submit a representation if you disagree with any aspect of your evaluation
              </p>
            </div>
            <div className="p-6 space-y-6">
              {/* Representation Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Representation Details <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={8}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="Please provide detailed reasons for your representation. Be specific about which aspects of the evaluation you disagree with and provide supporting facts..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Please be professional and factual in your representation
                </p>
              </div>

              {/* Supporting Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, Word, or Excel (max 10MB)</p>
                  <input type="file" className="hidden" multiple aria-label="Upload supporting documents" />
                </div>
              </div>

              {/* Uploaded Files Preview */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">project_achievements.pdf</p>
                        <p className="text-xs text-gray-500">2.4 MB</p>
                      </div>
                    </div>
                    <button type="button" className="text-sm text-red-600 hover:text-red-700">Remove</button>
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="declaration"
                    checked={declared}
                    onChange={(e) => setDeclared(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="declaration" className="text-sm text-gray-700">
                    I declare that the information provided in this representation is true and accurate
                    to the best of my knowledge. I understand that any false or misleading information
                    may result in disciplinary action.
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button type="button" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() || !declared}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Send className="w-4 h-4" />
              Submit Representation
            </button>
          </div>
        </>
      )}

      {/* Representation History */}
      {submitted && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Representation History</h2>
          </div>
          <div className="p-6">
            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Representation for 2025–2026</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {currentStatus === 'decided'
                    ? 'Decided'
                    : currentStatus === 'forwarded-ac'
                    ? 'With Appeal Committee'
                    : 'Under Review'}
                </span>
              </div>
              <p className="text-xs text-gray-500">Submitted: Mar 20, 2026</p>
              <p className="text-sm text-gray-700 line-clamp-2">
                Representation against KRA performance score for Q3 project delivery citing
                third-party contractor delays beyond control.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Representation;
