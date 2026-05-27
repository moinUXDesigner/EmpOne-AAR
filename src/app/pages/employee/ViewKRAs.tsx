import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { LayoutGrid, List, Filter, Eye, Edit, CheckCircle, Clock, X, Trash2, Save, Upload, Download, PenTool, Shield, Plus, Calendar, MapPin, User, Users, Briefcase } from 'lucide-react';
import { getEmployeePeriods, formatPeriodDate, type EmployeePeriod } from '../../data/employeePeriods';
import KRACard from '../../components/KRACard';
import { toast } from 'sonner';

const EMPLOYEE_KRA_STORAGE_KEY = 'employee_kras';

type KRAItem = {
  id: string;
  sl: string;
  code: string;
  kpi: string;
  targetAnnual: string;
  actualAchievement: string;
  sourceRefNo: string;
  uploadedFiles: Array<{ name: string; url: string }>;
  employeeNotes?: string;
  trainingRequirements?: string;
  status?: 'Approved' | 'Pending' | 'Draft';
  type?: 'initial' | 'revised';
  ro: {
    rating: string;
    weightagePercent: string;
    score: string;
    validationNotes: string;
  };
  rvo: {
    rating: string;
    weightagePercent: string;
    score: string;
    validationNotes: string;
  };
  aa: string;
  aaValidationNotes: string;
  period_id?: string | null;
  period_start_date?: string | null;
  period_end_date?: string | null;
};

const DEFAULT_KRAS: KRAItem[] = [
  {
    id: '1',
    sl: '1',
    code: 'KRA-001',
    kpi: 'Customer Service Excellence - Maintain high standards of customer service and satisfaction',
    targetAnnual: 'Customer satisfaction rating above 4.5/5 and response time within 24 hours',
    actualAchievement: 'Achieved 4.7/5 rating with average response time of 18 hours',
    sourceRefNo: 'CS-2026-001',
    uploadedFiles: [
      { name: 'Customer_Feedback_Report_Q1.pdf', url: '#' },
      { name: 'Response_Time_Analysis.xlsx', url: '#' },
    ],
    employeeNotes: '',
    trainingRequirements: '',
    status: 'Approved',
    type: 'initial',
    period_id: 'P1',
    period_start_date: '2025-04-01',
    period_end_date: '2025-06-07',
    ro: {
      rating: '9',
      weightagePercent: '25',
      score: '2.25',
      validationNotes: 'Excellent performance in customer service. Exceeded targets consistently.',
    },
    rvo: {
      rating: '9',
      weightagePercent: '25',
      score: '2.25',
      validationNotes: 'Outstanding achievement. Recommends for recognition.',
    },
    aa: 'Approved with commendation',
    aaValidationNotes: 'Exemplary performance in customer service domain.',
  },
  {
    id: '2',
    sl: '2',
    code: 'KRA-002',
    kpi: 'Process Improvement - Identify and implement process improvements to enhance operational efficiency',
    targetAnnual: 'Implement 3 process improvements with cost savings of INR 50,000',
    actualAchievement: 'Implemented 4 improvements with total cost savings of INR 65,000',
    sourceRefNo: 'PI-2026-002',
    uploadedFiles: [
      { name: 'Process_Improvement_Report.pdf', url: '#' },
      { name: 'Cost_Savings_Analysis.xlsx', url: '#' },
      { name: 'Implementation_Timeline.pdf', url: '#' },
    ],
    employeeNotes: '',
    trainingRequirements: '',
    status: 'Pending',
    type: 'initial',
    period_id: 'P1',
    period_start_date: '2025-04-01',
    period_end_date: '2025-06-07',
    ro: {
      rating: '8',
      weightagePercent: '20',
      score: '1.6',
      validationNotes: 'Good performance. Exceeded the target number of improvements.',
    },
    rvo: {
      rating: '8',
      weightagePercent: '20',
      score: '1.6',
      validationNotes: 'Agrees with RO assessment. Good initiative shown.',
    },
    aa: '',
    aaValidationNotes: '',
  },
  {
    id: '3',
    sl: '3',
    code: 'KRA-003',
    kpi: 'Team Collaboration - Foster effective collaboration within the team and across departments',
    targetAnnual: 'Participate in 2 cross-functional projects with team satisfaction score of 4.0+',
    actualAchievement: 'Participated in 3 projects with team satisfaction score of 4.3',
    sourceRefNo: 'TC-2026-003',
    uploadedFiles: [
      { name: 'Team_Feedback_Survey.pdf', url: '#' },
    ],
    employeeNotes: '',
    trainingRequirements: '',
    status: 'Approved',
    type: 'revised',
    period_id: 'P2',
    period_start_date: '2025-06-08',
    period_end_date: '2026-03-31',
    ro: {
      rating: '8',
      weightagePercent: '15',
      score: '1.2',
      validationNotes: 'Strong collaboration skills demonstrated.',
    },
    rvo: {
      rating: '',
      weightagePercent: '',
      score: '',
      validationNotes: '',
    },
    aa: '',
    aaValidationNotes: '',
  },
];

const ViewKRAs = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
  const [filterType, setFilterType] = useState<'all' | 'initial' | 'revised'>('all');
  const [kras, setKras] = useState<KRAItem[]>([]);
  const [selectedKRA, setSelectedKRA] = useState<KRAItem | null>(null);
  const [reviseKRA, setReviseKRA] = useState<KRAItem | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signMethod, setSignMethod] = useState<'dsc' | 'esign' | null>(null);
  const [reviseKPI, setReviseKPI] = useState('');
  const [reviseTarget, setReviseTarget] = useState('');
  const [reviseAchievement, setReviseAchievement] = useState('');
  const [reviseSourceRef, setReviseSourceRef] = useState('');

  const [periods, setPeriods] = useState<EmployeePeriod[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');

  // Always show employee-level view (no evaluation fields) in View KRAs page
  const userRole = 'Employee' as const;

  useEffect(() => {
    const loaded = getEmployeePeriods('01073080', '2025-26');
    setPeriods(loaded);
    if (loaded.length > 0) setActiveTab(loaded[0].period_id);
  }, []);

  useEffect(() => {
    const savedKras = localStorage.getItem(EMPLOYEE_KRA_STORAGE_KEY);

    if (savedKras) {
      try {
        setKras(JSON.parse(savedKras));
        return;
      } catch (error) {
        console.error('Error loading employee KRAs:', error);
      }
    }

    localStorage.setItem(
      EMPLOYEE_KRA_STORAGE_KEY,
      JSON.stringify(DEFAULT_KRAS),
    );
    setKras(DEFAULT_KRAS);
  }, []);

  const filteredKRAs = kras.filter(kra => {
    if (filterType === 'all') return true;
    return kra.type === filterType;
  });

  const handleDownloadPDF = () => {
    toast.success('KRA/KPI document downloaded successfully!');
  };

  const handleDSCSign = () => {
    setSignMethod('dsc');
    setShowSignModal(true);
  };

  const handleESign = () => {
    setSignMethod('esign');
    setShowSignModal(true);
  };

  const handleSignSubmit = () => {
    if (signMethod === 'dsc') {
      toast.success('Document signed successfully using DSC!');
    } else if (signMethod === 'esign') {
      toast.success('Document signed successfully using eSign!');
    }
    setShowSignModal(false);
    setSignMethod(null);
    
    // Show submission confirmation
    setTimeout(() => {
      toast.success('KRA/KPIs submitted for approval!', { duration: 4000 });
    }, 500);
  };

  const handleAddKRAForPeriod = (period: EmployeePeriod) => {
    navigate('/my-pms/kra-entry/add', { state: { periodContext: period } });
  };

  const handleEditKRA = (kra: KRAItem) => {
    navigate('/my-pms/kra-entry/add', {
      state: { editKRA: kra },
    });
  };

  const handleDeleteKRA = (kra: KRAItem) => {
    const confirmed = window.confirm(
      `Delete ${kra.code} from your KRA/KPI list?`,
    );

    if (!confirmed) return;

    const updatedKras = kras
      .filter((item) => item.id !== kra.id)
      .map((item, index) => ({
        ...item,
        sl: String(index + 1),
      }));

    setKras(updatedKras);
    localStorage.setItem(
      EMPLOYEE_KRA_STORAGE_KEY,
      JSON.stringify(updatedKras),
    );
    toast.success('KRA/KPI deleted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">View KRA/KPIs</h1>
          <p className="text-gray-600 mt-1">View, sign, and submit your Key Result Areas and Key Performance Indicators</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Action Buttons for Signing */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Sign & Submit Your KRA/KPIs</h2>
            <p className="text-sm text-gray-600">
              Review your entries and digitally sign to submit for approval. You can use DSC (Digital Signature Certificate) or eSign for authentication.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDSCSign}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-lg hover:bg-green-50 font-medium"
            >
              <Shield className="w-5 h-5" />
              Sign with DSC
            </button>
            <button
              onClick={handleESign}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              <PenTool className="w-5 h-5" />
              Sign with eSign
            </button>
          </div>
        </div>
      </div>

      {/* Period Tabs */}
      {periods.length > 0 && (
        <div>
          {/* Tab Bar */}
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
            {periods.map((p) => (
              <button
                key={p.period_id}
                onClick={() => setActiveTab(p.period_id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === p.period_id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                {formatPeriodDate(p.period_start_date)} – {formatPeriodDate(p.period_end_date)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {periods.map((p) => {
            if (p.period_id !== activeTab) return null;
            const tabKRAs = filteredKRAs.filter((k) => k.period_id === p.period_id);

            return (
              <div key={p.period_id} className="space-y-4 pt-4">
                {/* Period Summary Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-0.5">Period</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatPeriodDate(p.period_start_date)} – {formatPeriodDate(p.period_end_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-0.5 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Position
                        </p>
                        <p className="text-sm font-semibold text-gray-900">{p.designation}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{p.wing}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-0.5 flex items-center gap-1">
                          <User className="w-3 h-3" /> RO / RVO
                        </p>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{p.ro.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{p.rvo.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-0.5 flex items-center gap-1">
                          <Users className="w-3 h-3" /> AA
                        </p>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{p.aa.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 flex-shrink-0 ${
                      p.status === 'Approved' ? 'bg-green-100 text-green-700'
                      : p.status === 'Submitted' ? 'bg-blue-100 text-blue-700'
                      : p.status === 'Draft' ? 'bg-gray-100 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Controls + Add button */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as 'all' | 'initial' | 'revised')}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="all">All KRA/KPIs</option>
                          <option value="initial">Initial</option>
                          <option value="revised">Revised</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('card')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                            viewMode === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                          <span className="text-sm font-medium hidden sm:inline">Card</span>
                        </button>
                        <button
                          onClick={() => setViewMode('table')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                            viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <List className="w-4 h-4" />
                          <span className="text-sm font-medium hidden sm:inline">Table</span>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddKRAForPeriod(p)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add KRA/KPI
                    </button>
                  </div>
                </div>

                {/* Results count */}
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{tabKRAs.length}</span> KRA/KPI{tabKRAs.length !== 1 ? 's' : ''} for this period
                </p>

                {/* Empty state */}
                {tabKRAs.length === 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No KRA/KPIs for this Period</h3>
                    <p className="text-gray-600 text-sm mb-4">No KRA/KPIs added for this period yet.</p>
                    <button
                      onClick={() => handleAddKRAForPeriod(p)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add KRA/KPI
                    </button>
                  </div>
                )}

                {/* Card View */}
                {viewMode === 'card' && tabKRAs.length > 0 && (
                  <div className="space-y-6 divide-y divide-gray-200">
                    {tabKRAs.map((kra) => (
                      <div key={kra.id} className="pt-6 first:pt-0">
                        <KRACard
                          kra={kra}
                          userRole={userRole}
                          onView={() => setSelectedKRA(kra)}
                          onEdit={() => handleEditKRA(kra)}
                          onDelete={() => handleDeleteKRA(kra)}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && tabKRAs.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL / Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KRA / KPI</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {tabKRAs.map((kra) => (
                            <tr key={kra.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">SL: {kra.sl}</div>
                                <div className="text-xs text-gray-500">{kra.code}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 line-clamp-2">{kra.kpi}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {kra.type && (
                                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                                    kra.type === 'initial' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    {kra.type === 'initial' ? 'Initial' : 'Revised'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">{kra.targetAnnual}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {kra.status && (
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${
                                    kra.status === 'Approved' ? 'bg-green-100 text-green-700'
                                    : kra.status === 'Pending' ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {kra.status === 'Approved' ? <><CheckCircle className="w-3 h-3" />Approved</>
                                    : kra.status === 'Pending' ? <><Clock className="w-3 h-3" />Pending</>
                                    : <><Clock className="w-3 h-3" />Draft</>}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setSelectedKRA(kra)} className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1">
                                    <Eye className="w-4 h-4" />View
                                  </button>
                                  <button onClick={() => handleEditKRA(kra)} className="text-amber-600 hover:text-amber-700 text-sm font-medium inline-flex items-center gap-1">
                                    <Edit className="w-4 h-4" />Edit
                                  </button>
                                  <button onClick={() => handleDeleteKRA(kra)} className="text-red-600 hover:text-red-700 text-sm font-medium inline-flex items-center gap-1">
                                    <Trash2 className="w-4 h-4" />Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-200">
                      {tabKRAs.map((kra) => (
                        <div key={kra.id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">SL: {kra.sl}</span>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{kra.code}</span>
                              </div>
                              <h3 className="text-sm text-gray-900 line-clamp-2">{kra.kpi}</h3>
                            </div>
                            {kra.status && (
                              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                                kra.status === 'Approved' ? 'bg-green-100 text-green-700'
                                : kra.status === 'Pending' ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                              }`}>{kra.status}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setSelectedKRA(kra)} className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1">
                              <Eye className="w-4 h-4" />View
                            </button>
                            <button onClick={() => handleEditKRA(kra)} className="text-amber-600 hover:text-amber-700 text-sm font-medium inline-flex items-center gap-1">
                              <Edit className="w-4 h-4" />Edit
                            </button>
                            <button onClick={() => handleDeleteKRA(kra)} className="text-red-600 hover:text-red-700 text-sm font-medium inline-flex items-center gap-1">
                              <Trash2 className="w-4 h-4" />Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* KRA Details Modal */}
      {selectedKRA && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedKRA(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">KRA/KPI Details</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedKRA.code} • SL: {selectedKRA.sl}</p>
              </div>
              <button
                onClick={() => setSelectedKRA(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <KRACard kra={selectedKRA} userRole={userRole} />
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-2 sticky bottom-0">
              <button
                onClick={() => setSelectedKRA(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revise KRA Modal */}
      {reviseKRA && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setReviseKRA(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Revise KRA</h2>
                <p className="text-sm text-gray-600 mt-1">Based on {reviseKRA.code} • SL: {reviseKRA.sl}</p>
              </div>
              <button
                onClick={() => setReviseKRA(null)}
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
                    className="hidden"
                    id="file-upload-revise"
                    multiple
                  />
                  <label htmlFor="file-upload-revise" className="cursor-pointer">
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
                onClick={() => setReviseKRA(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Revised KRA submitted successfully!');
                  setReviseKRA(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Submit Revision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Modal */}
      {showSignModal && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {signMethod === 'dsc' ? (
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-purple-600" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {signMethod === 'dsc' ? 'Sign with DSC' : 'Sign with eSign'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Digitally sign and submit your KRA/KPIs
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {signMethod === 'dsc' ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">DSC Authentication</h3>
                    <p className="text-sm text-green-800">
                      Your Digital Signature Certificate will be used to sign this document. 
                      Please ensure your DSC token is connected.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select DSC Certificate
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>John Doe - DSC Class 3 (Valid till 31/12/2026)</option>
                      <option>John Doe - DSC Class 2 (Valid till 15/06/2026)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter PIN
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your DSC PIN"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">eSign via Aadhaar</h3>
                    <p className="text-sm text-purple-800">
                      An OTP will be sent to your registered mobile number linked with your Aadhaar.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      placeholder="XXXX XXXX XXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      maxLength={12}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OTP
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        maxLength={6}
                      />
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 whitespace-nowrap">
                        Send OTP
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• Total KRA/KPIs: <span className="font-medium text-gray-900">{kras.length}</span></p>
                  <p>• Document will be submitted to: <span className="font-medium text-gray-900">Sarah Williams (RO)</span></p>
                  <p>• Action: <span className="font-medium text-gray-900">Submit for Approval</span></p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSignSubmit}
                className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg ${
                  signMethod === 'dsc'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {signMethod === 'dsc' ? <Shield className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                Sign & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewKRAs;
