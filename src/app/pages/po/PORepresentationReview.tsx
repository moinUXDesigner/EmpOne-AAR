import { useState } from 'react';
import { ArrowLeft, CheckCircle, Send, Save, FileText, User, MessageSquare, ChevronRight } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router';

const scoreBreakdown = [
  { label: 'KRA Performance', score: 6.5 },
  { label: 'Personal Attributes', score: 7.2 },
  { label: 'Functional Competency', score: 6.8 },
  { label: 'Overall Score', score: 6.8, highlight: true },
];

const supportingDocs = [
  { name: 'project_status_report_Q3.pdf', size: '1.8 MB' },
  { name: 'contractor_delay_certificate.pdf', size: '540 KB' },
];

const PORepresentationReview = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [poFindings, setPoFindings] = useState('');
  const [actionTaken, setActionTaken] = useState<'uphold' | 'forward' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAction = (action: 'uphold' | 'forward') => {
    setActionTaken(action);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/po/queue');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/po/queue" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Representation Review</h1>
          <p className="text-gray-600 mt-0.5">Case ID: {caseId} · APAR Cell</p>
        </div>
      </div>

      {/* Employee Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <User className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Robert Johnson</h2>
            <p className="text-sm text-gray-600">Assistant Manager · Technical Department</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Employee ID</p>
            <p className="text-sm font-medium text-gray-900">EMP003</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Disclosed Score</p>
            <p className="text-sm font-medium text-orange-700">6.8 / 10</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Representation Filed</p>
            <p className="text-sm font-medium text-gray-900">Mar 18, 2026</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Appraisal Year</p>
            <p className="text-sm font-medium text-gray-900">2025–2026</p>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Disclosed Score Breakdown</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scoreBreakdown.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  item.highlight ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                <p
                  className={`text-2xl font-bold ${
                    item.highlight ? 'text-orange-700' : 'text-gray-900'
                  }`}
                >
                  {item.score}
                </p>
                <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${item.highlight ? 'bg-orange-500' : 'bg-blue-500'}`}
                    style={{ width: `${(item.score / 10) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee's Representation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <h2 className="font-semibold text-gray-900">Employee's Representation</h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">Filed on Mar 18, 2026</p>
        </div>
        <div className="p-6">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
            <p className="text-sm text-gray-800 leading-relaxed">
              I respectfully submit this representation regarding my Q3 performance assessment. The KRA
              score of 6.5 does not adequately reflect the actual completion status of the Transmission
              Line Upgrade project. Due to third-party contractor delays beyond my control, the physical
              work was completed at 85% by year-end, though all planning, design, and procurement
              activities were fully completed as per schedule. I request a review of this component in
              light of the documented project constraints.
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Supporting Documents</p>
            <div className="space-y-2">
              {supportingDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.size}</p>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium shrink-0">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PO Assessment */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">PO Review Assessment</h2>
          <p className="text-sm text-gray-600 mt-1">
            Record your findings after reviewing the representation and supporting documents
          </p>
        </div>
        <div className="p-6">
          <textarea
            rows={5}
            value={poFindings}
            onChange={(e) => setPoFindings(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Summarize your findings. This will be visible to the Appeal Committee if the case is forwarded..."
          />
          <p className="text-xs text-gray-500 mt-2">
            This assessment becomes part of the case record and is mandatory before taking any action.
          </p>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Take Action</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleAction('uphold')}
            disabled={!poFindings.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-gray-500" />
            Uphold Original Score
          </button>
          <button
            onClick={() => handleAction('forward')}
            disabled={!poFindings.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
            Forward to Appeal Committee
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Upholding closes this case with no score change. Forwarding sends it to the Appeal Committee
          for final decision. Both actions require PO assessment above.
        </p>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">
            {actionTaken === 'forward'
              ? 'Case forwarded to Appeal Committee successfully!'
              : 'Original score upheld. Case closed.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PORepresentationReview;
