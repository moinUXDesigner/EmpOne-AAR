import { useState } from 'react';
import { ArrowLeft, CheckCircle, Unlock, Save, User } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router';

const scoreRows = [
  { label: 'KRA Performance', ro: 8.5, rvo: 8.5, final: 8.5 },
  { label: 'Personal Attributes', ro: 9.0, rvo: 9.0, final: 9.0 },
  { label: 'Functional Competency', ro: 8.0, rvo: 8.0, final: 8.0 },
];

const getGrade = (score: number) => {
  if (score >= 9.0) return { label: 'Outstanding', color: 'text-purple-700 bg-purple-100' };
  if (score >= 8.0) return { label: 'Very Good', color: 'text-blue-700 bg-blue-100' };
  if (score >= 7.0) return { label: 'Good', color: 'text-green-700 bg-green-100' };
  if (score >= 6.0) return { label: 'Average', color: 'text-yellow-700 bg-yellow-100' };
  return { label: 'Below Average', color: 'text-red-700 bg-red-100' };
};

const POReview = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [poRemarks, setPoRemarks] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [actionType, setActionType] = useState<'draft' | 'disclosed' | null>(null);

  const finalScore = 8.5;
  const grade = getGrade(finalScore);

  const handleSaveDraft = () => {
    setActionType('draft');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDisclose = () => {
    setActionType('disclosed');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/po/queue');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/po/queue" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">AAR Review & Disclosure</h1>
            <p className="text-gray-600 mt-0.5">Employee ID: {employeeId} · APAR Cell</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={handleDisclose}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            <Unlock className="w-4 h-4" />
            Disclose Scores
          </button>
        </div>
      </div>

      {/* Employee Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">John Doe</h2>
            <p className="text-sm text-gray-600">Senior Manager · Operations Department</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Employee ID</p>
            <p className="text-sm font-medium text-gray-900">{employeeId}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Reporting Officer</p>
            <p className="text-sm font-medium text-gray-900">Sarah Wilson</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Reviewing Officer</p>
            <p className="text-sm font-medium text-gray-900">Michael Brown</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Accepting Authority</p>
            <p className="text-sm font-medium text-gray-900">Dr. Rajesh Kumar</p>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Performance Scores Summary</h2>
          <p className="text-sm text-gray-600 mt-1">Scores as approved through the AAR workflow</p>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Component</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">RO Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">RVO Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Final Score</th>
                </tr>
              </thead>
              <tbody>
                {scoreRows.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-900">{row.label}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-semibold text-sm">
                        {row.ro}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                        {row.rvo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                        {row.final}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-3 px-4 text-sm text-gray-900">Overall Score</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-800 font-bold text-sm">
                      8.5
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-200 text-blue-800 font-bold text-sm">
                      8.5
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-200 text-green-800 font-bold text-sm">
                      {finalScore}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Remarks Trail */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Remarks & Observations</h2>
        </div>
        <div className="p-6 space-y-3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Reporting Officer
            </p>
            <p className="text-sm text-gray-800">
              Excellent performance throughout the year. Consistently exceeded expectations in project
              delivery and team management.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
              Reviewing Officer
            </p>
            <p className="text-sm text-gray-800">
              Concur with RO's assessment. Employee has shown exceptional capabilities and maintains
              high standards of work.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
              Accepting Authority
            </p>
            <p className="text-sm text-gray-800">
              Approved as assessed. Employee demonstrates strong leadership and operational excellence.
            </p>
          </div>
        </div>
      </div>

      {/* PO Remarks */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Personnel Officer's Remarks</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add observations before disclosing scores to the employee (optional)
          </p>
        </div>
        <div className="p-6">
          <textarea
            rows={4}
            value={poRemarks}
            onChange={(e) => setPoRemarks(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Add any observations or notes for the record..."
          />
        </div>
      </div>

      {/* Final Grade Banner */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border-2 border-green-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-green-700 font-medium">Final Approved Score</p>
            <p className="text-4xl font-bold text-green-900 mt-1">
              {finalScore}
              <span className="text-xl text-green-700 font-normal"> / 10</span>
            </p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${grade.color}`}>
              {grade.label}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-700">AA Approved On</p>
            <p className="text-lg font-semibold text-green-900">Mar 10, 2026</p>
            <p className="text-xs text-green-600 mt-1">Awaiting disclosure to employee</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Link
          to="/po/queue"
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          Cancel
        </Link>
        <button
          onClick={handleSaveDraft}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
        >
          <Save className="w-4 h-4" />
          Save Draft
        </button>
        <button
          onClick={handleDisclose}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          <Unlock className="w-4 h-4" />
          Disclose Scores to Employee
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">
            {actionType === 'disclosed'
              ? 'Scores disclosed to employee successfully!'
              : 'Draft saved successfully!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default POReview;
