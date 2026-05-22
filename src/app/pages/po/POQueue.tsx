import { useState } from 'react';
import { Search, Clock, Eye, FileCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router';

const pendingAARs = [
  {
    id: 'AAR001',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    designation: 'Senior Manager',
    department: 'Operations',
    aaApprovedOn: 'Mar 10, 2026',
    daysInQueue: 3,
    overallScore: 8.5,
    status: 'pending',
  },
  {
    id: 'AAR002',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    designation: 'Manager',
    department: 'Finance',
    aaApprovedOn: 'Mar 8, 2026',
    daysInQueue: 5,
    overallScore: 7.2,
    status: 'urgent',
  },
  {
    id: 'AAR003',
    employeeId: 'EMP004',
    employeeName: 'Priya Kumar',
    designation: 'Deputy Manager',
    department: 'HR',
    aaApprovedOn: 'Mar 12, 2026',
    daysInQueue: 1,
    overallScore: 9.1,
    status: 'pending',
  },
];

const representations = [
  {
    id: 'REP001',
    employeeId: 'EMP003',
    employeeName: 'Robert Johnson',
    designation: 'Assistant Manager',
    department: 'Technical',
    disclosedScore: 6.8,
    representationDate: 'Mar 18, 2026',
    daysInQueue: 5,
    concern: 'Disagrees with KRA performance score for Q3 project delivery citing contractor delays',
    status: 'pending',
  },
  {
    id: 'REP002',
    employeeId: 'EMP005',
    employeeName: 'Anita Sharma',
    designation: 'Senior Executive',
    department: 'Accounts',
    disclosedScore: 7.4,
    representationDate: 'Mar 20, 2026',
    daysInQueue: 3,
    concern: 'Requests review of personal attributes scoring methodology',
    status: 'pending',
  },
];

const POQueue = () => {
  const [activeTab, setActiveTab] = useState<'pending-aars' | 'representations'>('pending-aars');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAARs = pendingAARs.filter(
    (item) =>
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRepresentations = representations.filter(
    (item) =>
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">APAR Cell Queue</h1>
        <p className="text-gray-600 mt-1">Manage AAR disclosures and employee representations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending AARs</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{pendingAARs.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Representations</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{representations.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Disclosed This Month</p>
          <p className="text-2xl font-bold text-green-600 mt-1">18</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Forwarded to AC</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">4</p>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Tab Bar */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('pending-aars')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'pending-aars'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Pending AARs
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'pending-aars'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {pendingAARs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('representations')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'representations'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Representations
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === 'representations'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {representations.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or employee ID..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Pending AARs */}
        {activeTab === 'pending-aars' && (
          <div className="divide-y divide-gray-100">
            {filteredAARs.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <FileCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>No pending AARs found</p>
              </div>
            ) : (
              filteredAARs.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{item.employeeName}</h3>
                        <span className="text-xs text-gray-500">{item.employeeId}</span>
                        {item.status === 'urgent' && (
                          <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded border border-red-100">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">{item.designation}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{item.department}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>AA Approved: {item.aaApprovedOn}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-1">
                          <Clock
                            className={`w-3.5 h-3.5 ${item.daysInQueue >= 5 ? 'text-red-500' : 'text-gray-400'}`}
                          />
                          <span className={item.daysInQueue >= 5 ? 'text-red-600 font-medium' : ''}>
                            {item.daysInQueue}d in queue
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-500">AA Score</p>
                        <p className="text-lg font-bold text-blue-700">{item.overallScore}</p>
                      </div>
                      <Link
                        to={`/po/review/${item.employeeId}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review & Disclose
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Representations */}
        {activeTab === 'representations' && (
          <div className="divide-y divide-gray-100">
            {filteredRepresentations.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>No pending representations found</p>
              </div>
            ) : (
              filteredRepresentations.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{item.employeeName}</h3>
                        <span className="text-xs text-gray-500">{item.employeeId}</span>
                        <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-medium rounded border border-orange-100">
                          Representation
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                        <span className="font-medium text-gray-700">{item.designation}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{item.department}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>Filed: {item.representationDate}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-orange-600">{item.daysInQueue}d pending</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">{item.concern}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-gray-500">Disclosed Score</p>
                        <p className="text-lg font-bold text-orange-700">{item.disclosedScore}</p>
                      </div>
                      <Link
                        to={`/po/representation-review/${item.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default POQueue;
