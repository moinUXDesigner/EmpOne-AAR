import { CheckCircle, Clock, FileText, Download, Edit2, Save, ChevronDown, ChevronUp, X, Upload, RotateCcw, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface KRACardProps {
  kra: {
    id: string;
    sl: string;
    code: string;
    kpi: string;
    targetAnnual: string;
    actualAchievement: string;
    sourceRefNo: string;
    uploadedFiles?: Array<{ name: string; url: string }>;
    type?: 'initial' | 'revised';
    status?: 'Approved' | 'Draft' | 'Pending';
    ro?: {
      rating: string;
      weightagePercent: string;
      score: string;
      validationNotes: string;
    };
    rvo?: {
      rating: string;
      weightagePercent: string;
      score: string;
      validationNotes: string;
    };
    aa?: string;
    aaValidationNotes?: string;
  };
  userRole: 'Employee' | 'RO' | 'RVO' | 'AA' | 'HRD';
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const KRACard = ({ kra, userRole, onView, onEdit, onDelete }: KRACardProps) => {
  const showROFields = ['RO', 'RVO', 'AA', 'HRD'].includes(userRole);
  const showRVOFields = ['RVO', 'AA', 'HRD'].includes(userRole);
  const showAAFields = ['AA', 'HRD'].includes(userRole);

  const isROEditable = userRole === 'RO';
  const isRVOEditable = userRole === 'RVO';
  const isAAEditable = userRole === 'AA';

  const [isEditing, setIsEditing] = useState(isROEditable || isRVOEditable || isAAEditable);
  const [showFiles, setShowFiles] = useState(false);
  const [showReviseModal, setShowReviseModal] = useState(false);
  
  // Form state management
  const [roRating, setRoRating] = useState(kra.ro?.rating || '');
  const [roWeightage, setRoWeightage] = useState(kra.ro?.weightagePercent || '');
  const [roNotes, setRoNotes] = useState(kra.ro?.validationNotes || '');
  
  const [rvoRating, setRvoRating] = useState(kra.rvo?.rating || '');
  const [rvoWeightage, setRvoWeightage] = useState(kra.rvo?.weightagePercent || '');
  const [rvoNotes, setRvoNotes] = useState(kra.rvo?.validationNotes || '');
  
  const [aaComments, setAaComments] = useState(kra.aa || '');
  const [aaNotes, setAaNotes] = useState(kra.aaValidationNotes || '');

  // Revise form state
  const [reviseKPI, setReviseKPI] = useState(kra.kpi);
  const [reviseTarget, setReviseTarget] = useState(kra.targetAnnual);
  const [reviseAchievement, setReviseAchievement] = useState(kra.actualAchievement);
  const [reviseSourceRef, setReviseSourceRef] = useState(kra.sourceRefNo);

  const canEdit = isROEditable || isRVOEditable || isAAEditable;
  const canRevise = userRole === 'Employee';

  const handleSave = () => {
    toast.success('KRA evaluation saved successfully!');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleReviseSubmit = () => {
    toast.success('Revised KRA submitted successfully!');
    setShowReviseModal(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            SL: {kra.sl}
          </span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {kra.code}
          </span>
          {kra.type && (
            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                kra.type === 'initial'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {kra.type === 'initial' ? 'Initial' : 'Revised'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {kra.status && (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                kra.status === 'Approved'
                  ? 'bg-green-100 text-green-700'
                  : kra.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {kra.status === 'Approved' ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </>
              ) : kra.status === 'Pending' ? (
                <>
                  <Clock className="w-3 h-3" />
                  Pending
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Draft
                </>
              )}
            </span>
          )}
          {canEdit && (
            isEditing ? (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            ) : (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                onClick={handleEdit}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )
          )}
      {canRevise && (
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
            onClick={onView}
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
            onClick={onEdit}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-red-600 text-sm font-medium rounded hover:bg-red-50 transition-colors"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
            onClick={() => setShowReviseModal(true)}
          >
            <RotateCcw className="w-4 h-4" />
            Revise
          </button>
        </div>
          )}
        </div>
      </div>

      {/* Employee Section */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">KRA / KPI</label>
            <p className="text-sm text-gray-900 leading-relaxed">{kra.kpi}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Target (Annual)</label>
              <p className="text-sm text-gray-900">{kra.targetAnnual}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Actual Achievement</label>
              <p className="text-sm text-gray-900">{kra.actualAchievement}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Source Ref. No.</label>
            <p className="text-sm text-gray-900">{kra.sourceRefNo}</p>
          </div>

          {/* Uploaded Files - Collapsible */}
          {kra.uploadedFiles && kra.uploadedFiles.length > 0 && (
            <div>
              <button
                onClick={() => setShowFiles(!showFiles)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mb-2"
              >
                {showFiles ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {kra.uploadedFiles.length} Attached File{kra.uploadedFiles.length !== 1 ? 's' : ''}
              </button>
              {showFiles && (
                <div className="space-y-2">
                  {kra.uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2.5"
                    >
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-900 flex-1 truncate">{file.name}</span>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RO Section */}
      {showROFields && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">RO Evaluation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Rating (1-10) <span className="text-red-600">*</span>
              </label>
              {(isROEditable && isEditing) ? (
                <select
                  aria-label="RO rating"
                  title="RO rating"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={roRating}
                  onChange={(e) => setRoRating(e.target.value)}
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                  {roRating || '-'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Weightage (%) <span className="text-red-600">*</span>
              </label>
              {(isROEditable && isEditing) ? (
                <input
                  type="number"
                  aria-label="RO weightage percent"
                  title="RO weightage percent"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 25"
                  value={roWeightage}
                  onChange={(e) => setRoWeightage(e.target.value)}
                  min="0"
                  max="100"
                />
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                  {roWeightage ? `${roWeightage}%` : '-'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Score <span className="text-red-600">*</span>
              </label>
              <p className="text-sm text-blue-600 font-semibold bg-blue-50 rounded-lg px-3 py-2">
                {roRating && roWeightage 
                  ? ((parseFloat(roRating) * parseFloat(roWeightage)) / 100).toFixed(2)
                  : '-'}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-600 mb-2">Validation Notes</label>
            {(isROEditable && isEditing) ? (
              <textarea
                rows={3}
                aria-label="RO validation notes"
                title="RO validation notes"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter validation notes..."
                value={roNotes}
                onChange={(e) => setRoNotes(e.target.value)}
              />
            ) : (
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 whitespace-pre-wrap min-h-[60px]">
                {roNotes || '-'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* RVO Section */}
      {showRVOFields && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">RVO Evaluation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Rating (1-10) <span className="text-red-600">*</span>
              </label>
              {(isRVOEditable && isEditing) ? (
                <select
                  aria-label="RVO rating"
                  title="RVO rating"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={rvoRating}
                  onChange={(e) => setRvoRating(e.target.value)}
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                  {rvoRating || '-'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Weightage (%) <span className="text-red-600">*</span>
              </label>
              {(isRVOEditable && isEditing) ? (
                <input
                  type="number"
                  aria-label="RVO weightage percent"
                  title="RVO weightage percent"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 25"
                  value={rvoWeightage}
                  onChange={(e) => setRvoWeightage(e.target.value)}
                  min="0"
                  max="100"
                />
              ) : (
                <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                  {rvoWeightage ? `${rvoWeightage}%` : '-'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Score <span className="text-red-600">*</span>
              </label>
              <p className="text-sm text-blue-600 font-semibold bg-blue-50 rounded-lg px-3 py-2">
                {kra.rvo?.score || '-'}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-600 mb-2">Validation Notes</label>
            {(isRVOEditable && isEditing) ? (
              <textarea
                rows={3}
                aria-label="RVO validation notes"
                title="RVO validation notes"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter validation notes..."
                value={rvoNotes}
                onChange={(e) => setRvoNotes(e.target.value)}
              />
            ) : (
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 whitespace-pre-wrap min-h-[60px]">
                {rvoNotes || '-'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* AA Section */}
      {showAAFields && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">AA Evaluation</h3>
          {(isAAEditable && isEditing) ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Rating/Comments <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  aria-label="AA rating comments"
                  title="AA rating comments"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter AA rating/comments..."
                  value={aaComments}
                  onChange={(e) => setAaComments(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Validation Notes</label>
                <textarea
                  rows={3}
                  aria-label="AA validation notes"
                  title="AA validation notes"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter validation notes..."
                  value={aaNotes}
                  onChange={(e) => setAaNotes(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {aaComments && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Rating/Comments</label>
                  <p className="text-sm text-gray-900 bg-gray-50 rounded-lg px-3 py-2 whitespace-pre-wrap">{aaComments}</p>
                </div>
              )}
              {aaNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Validation Notes</label>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 whitespace-pre-wrap">{aaNotes}</p>
                </div>
              )}
              {!aaComments && !aaNotes && (
                <p className="text-sm text-gray-400 italic">No evaluation yet</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Revise Modal */}
      {showReviseModal && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowReviseModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Revise KRA</h2>
                <p className="text-sm text-gray-600 mt-1">Based on {kra.code} &bull; SL: {kra.sl}</p>
              </div>
              <button
                onClick={() => setShowReviseModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KRA / KPI <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  aria-label="Revised KRA KPI"
                  title="Revised KRA KPI"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter KRA / KPI..."
                  value={reviseKPI}
                  onChange={(e) => setReviseKPI(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target (Annual) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    aria-label="Revised annual target"
                    title="Revised annual target"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter target..."
                    value={reviseTarget}
                    onChange={(e) => setReviseTarget(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Achievement <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    aria-label="Revised actual achievement"
                    title="Revised actual achievement"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter actual achievement..."
                    value={reviseAchievement}
                    onChange={(e) => setReviseAchievement(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Ref. No. <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  aria-label="Revised source reference number"
                  title="Revised source reference number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter source ref. no..."
                  value={reviseSourceRef}
                  onChange={(e) => setReviseSourceRef(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Supporting Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <input
                    type="file"
                    aria-label="Upload supporting documents"
                    title="Upload supporting documents"
                    className="hidden"
                    id="file-upload"
                    multiple
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, XLS, or images (max 10MB each)
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 sticky bottom-0">
              <button
                onClick={() => setShowReviseModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReviseSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Submit Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KRACard;
