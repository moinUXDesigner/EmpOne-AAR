import { useState } from 'react';
import { Search, Clock, Eye, Gavel } from 'lucide-react';
import { Link } from 'react-router';

const appeals = [
  {
    id: 'AC001',
    employeeId: 'EMP003',
    employeeName: 'Robert Johnson',
    designation: 'Assistant Manager',
    department: 'Technical',
    originalScore: 6.8,
    representationDate: 'Mar 18, 2026',
    poForwardedDate: 'Mar 25, 2026',
    daysInQueue: 3,
    concern: 'Representation against KRA score for Q3 project delivery citing contractor delays',
    status: 'pending',
  },
  {
    id: 'AC002',
    employeeId: 'EMP005',
    employeeName: 'Anita Sharma',
    designation: 'Senior Executive',
    department: 'Accounts',
    originalScore: 7.4,
    representationDate: 'Mar 20, 2026',
    poForwardedDate: 'Mar 27, 2026',
    daysInQueue: 1,
    concern: 'Representation regarding personal attributes scoring methodology',
    status: 'under-review',
  },
  {
    id: 'AC003',
    employeeId: 'EMP006',
    employeeName: 'Vikram Singh',
    designation: 'Executive Engineer',
    department: 'Projects',
    originalScore: 7.9,
    representationDate: 'Mar 15, 2026',
    poForwardedDate: 'Mar 22, 2026',
    daysInQueue: 0,
    concern: 'Representation against overall evaluation score',
    status: 'decided',
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending Review', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  'under-review': { label: 'Under Review', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  decided: { label: 'Decision Taken', color: 'bg-green-50 text-green-700 border-green-200' },
};

const AppealQueue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = appeals.filter((a) => {
    const matchSearch =
      a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Appeal Committee Queue</h1>
        <p className="text-gray-600 mt-1">Review representations forwarded by the Personnel Officer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Cases</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{appeals.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {appeals.filter((a) => a.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Under Review</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {appeals.filter((a) => a.status === 'under-review').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Decisions Taken</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {appeals.filter((a) => a.status === 'decided').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or employee ID..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="under-review">Under Review</option>
            <option value="decided">Decision Taken</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Appeal Cases</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Gavel className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>No appeal cases found</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{item.employeeName}</h3>
                      <span className="text-xs text-gray-500">{item.employeeId}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig[item.status].color}`}
                      >
                        {statusConfig[item.status].label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 mb-1.5">
                      <span className="font-medium text-gray-700">{item.designation}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{item.department}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>PO Forwarded: {item.poForwardedDate}</span>
                      {item.status !== 'decided' && (
                        <>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="text-yellow-700 font-medium">{item.daysInQueue}d in queue</span>
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.concern}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-500">Original Score</p>
                      <p className="text-lg font-bold text-gray-700">{item.originalScore}</p>
                    </div>
                    <Link
                      to={`/ac/decision/${item.id}`}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-sm font-medium rounded-md transition-colors ${
                        item.status === 'decided'
                          ? 'bg-gray-400 hover:bg-gray-500'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {item.status === 'decided' ? 'View Decision' : 'Review & Decide'}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AppealQueue;
