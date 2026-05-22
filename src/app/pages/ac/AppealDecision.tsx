import { useState } from 'react';
import { ArrowLeft, CheckCircle, Database, Save, FileText, User, MessageSquare } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router';

const originalScores = [
  { label: 'KRA Performance', score: 6.5 },
  { label: 'Personal Attributes', score: 7.2 },
  { label: 'Functional Competency', score: 6.8 },
  { label: 'Overall Score', score: 6.8, highlight: true },
];

const AppealDecision = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [decisionType, setDecisionType] = useState<'uphold' | 'modify'>('uphold');
  const [modifiedScore, setModifiedScore] = useState('');
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const originalScore = 6.8;

  const computedFinalScore =
    decisionType === 'modify' && modifiedScore ? Number(modifiedScore) : originalScore;

  const handlePublishToSAP = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/ac/queue');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/ac/queue" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Appeal Decision</h1>
          <p className="text-gray-600 mt-0.5">Case ID: {caseId} · Appeal Committee Review</p>
        </div>
      </div>

      {/* Employee Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <User className="w-5 h-5 text-purple-600" />
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
            <p className="text-xs text-gray-500">Original Score</p>
            <p className="text-sm font-medium text-orange-700">{originalScore} / 10</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Representation Date</p>
            <p className="text-sm font-medium text-gray-900">Mar 18, 2026</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">PO Forwarded On</p>
            <p className="text-sm font-medium text-gray-900">Mar 25, 2026</p>
          </div>
        </div>
      </div>

      {/* Case History */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Case History</h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete record of the appraisal and representation process
          </p>
        </div>
        <div className="p-6 space-y-6">
          {/* Original Scores */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Original Performance Scores</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {originalScores.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    item.highlight ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <p
                    className={`text-xl font-bold mt-1 ${
                      item.highlight ? 'text-orange-700' : 'text-gray-900'
                    }`}
                  >
                    {item.score}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Representation */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              Employee Representation
            </h3>
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <p className="text-sm text-gray-800 leading-relaxed">
                I respectfully submit this representation regarding my Q3 performance assessment. The
                KRA score of 6.5 does not adequately reflect the actual completion status of the
                Transmission Line Upgrade project. Due to third-party contractor delays beyond my
                control, the physical work was completed at 85% by year-end.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['project_status_report_Q3.pdf', 'contractor_delay_certificate.pdf'].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-orange-200 rounded text-xs text-gray-700"
                  >
                    <FileText className="w-3.5 h-3.5 text-orange-500" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PO Findings */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-blue-700 mb-2">PO Review Findings</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-gray-800 leading-relaxed">
                After reviewing the employee's representation and supporting documents, I confirm that
                contractor delay certificates are valid and on record. However, the KRA target was for
                100% completion. The matter warrants Appeal Committee review as the delays were
                partially within the employee's control in terms of contractor management.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AC Decision Form */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Appeal Committee Decision</h2>
          <p className="text-sm text-gray-600 mt-1">This decision is final and will be published to SAP</p>
        </div>
        <div className="p-6 space-y-5">
          {/* Decision Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Decision</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setDecisionType('uphold')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-colors ${
                  decisionType === 'uphold'
                    ? 'border-gray-700 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    decisionType === 'uphold' ? 'border-gray-700' : 'border-gray-300'
                  }`}
                >
                  {decisionType === 'uphold' && (
                    <div className="w-2 h-2 rounded-full bg-gray-700" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Uphold Original Score</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Final score remains at {originalScore}
                  </p>
                </div>
              </button>
              <button
                onClick={() => setDecisionType('modify')}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-colors ${
                  decisionType === 'modify'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    decisionType === 'modify' ? 'border-purple-600' : 'border-gray-300'
                  }`}
                >
                  {decisionType === 'modify' && (
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Modify Score</p>
                  <p className="text-xs text-gray-500 mt-0.5">Override with a revised final score</p>
                </div>
              </button>
            </div>
          </div>

          {/* Modified Score Input */}
          {decisionType === 'modify' && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Revised Final Score <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                value={modifiedScore}
                onChange={(e) => setModifiedScore(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g., 7.5"
              />
            </div>
          )}

          {/* Decision Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision Remarks <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              value={decisionRemarks}
              onChange={(e) => setDecisionRemarks(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Provide detailed reasoning for the committee's decision..."
            />
          </div>
        </div>
      </div>

      {/* Final Score Preview */}
      <div
        className={`rounded-lg border-2 p-6 ${
          decisionType === 'modify' && modifiedScore
            ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
            : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
        }`}
      >
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Final Score to be Published to SAP</p>
          <p
            className={`text-5xl font-bold mt-2 ${
              decisionType === 'modify' && modifiedScore ? 'text-purple-900' : 'text-gray-900'
            }`}
          >
            {computedFinalScore}
            <span className="text-2xl text-gray-500 font-normal"> / 10</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {decisionType === 'modify' && modifiedScore
              ? 'Modified by Appeal Committee'
              : 'Original Score Upheld'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link
          to="/ac/queue"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          Cancel
        </Link>
        <button
          onClick={handlePublishToSAP}
          disabled={!decisionRemarks.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <Database className="w-4 h-4" />
          Publish Final Score to SAP
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Final score published to SAP successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AppealDecision;
