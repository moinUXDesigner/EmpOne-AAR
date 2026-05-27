import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, X, Plus, MapPin, User, Users, Calendar, Briefcase, CheckCircle, Clock, FileText, AlertCircle } from "lucide-react";
import { getEmployeePeriods, formatPeriodDate, type EmployeePeriod } from "../../data/employeePeriods";

const EMPLOYEE_KRA_STORAGE_KEY = "employee_kras";

const statusStyles: Record<EmployeePeriod["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Draft: "bg-gray-100 text-gray-700",
  Submitted: "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
};

const StatusIcon = ({ status }: { status: EmployeePeriod["status"] }) => {
  if (status === "Approved") return <CheckCircle className="w-3 h-3" />;
  if (status === "Submitted") return <FileText className="w-3 h-3" />;
  return <Clock className="w-3 h-3" />;
};

const KRAEntryPage = () => {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState<EmployeePeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<EmployeePeriod | null>(null);
  const [kraCountMap, setKraCountMap] = useState<Record<string, number>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );

  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener);
    return () => window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener);
  }, []);

  useEffect(() => {
    const loaded = getEmployeePeriods("01073080", "2025-26");
    setPeriods(loaded);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMPLOYEE_KRA_STORAGE_KEY);
      if (stored) {
        const kras: Array<{ period_id?: string | null }> = JSON.parse(stored);
        const counts: Record<string, number> = {};
        kras.forEach((k) => {
          if (k.period_id) {
            counts[k.period_id] = (counts[k.period_id] || 0) + 1;
          }
        });
        setKraCountMap(counts);
      }
    } catch {
      // ignore
    }
  }, [selectedPeriod]);

  const sidebarOffset = sidebarCollapsed ? "lg:left-20" : "lg:left-64";

  const handleAddKRA = (period: EmployeePeriod) => {
    setSelectedPeriod(null);
    navigate("/my-pms/kra-entry/add", { state: { periodContext: period } });
  };

  return (
    <div className="space-y-6">
      {/* Fixed Header */}
      <div
        className={`fixed top-14 sm:top-16 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm px-6 py-4 ${sidebarOffset}`}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900">KRA/KPI Entry</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Select a service period to add or manage your KRA/KPIs — FY 2025-26
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[80px]"></div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Period-wise KRA/KPI Entry</p>
          <p className="text-sm text-blue-700 mt-0.5">
            Your KRA/KPIs are tracked separately for each service period. Click the{" "}
            <span className="font-medium">eye icon</span> next to a period to view details and add entries.
          </p>
        </div>
      </div>

      {/* Periods Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Service Periods — FY 2025-26</h2>
          <p className="text-sm text-gray-600 mt-0.5">
            {periods.length} period{periods.length !== 1 ? "s" : ""} found for this financial year
          </p>
        </div>

        {periods.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Service Periods Found</h3>
            <p className="text-gray-600 text-sm">
              No posting periods are available for FY 2025-26. Please contact HR if this is incorrect.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Period
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wing / Posting
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporting Officer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KRA/KPIs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {periods.map((p) => (
                    <tr key={p.period_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatPeriodDate(p.period_start_date)}
                            </div>
                            <div className="text-xs text-gray-500">
                              to {formatPeriodDate(p.period_end_date)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{p.designation}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{p.wing}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {p.place_of_posting}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          {p.ro.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                          {kraCountMap[p.period_id] ?? 0} added
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${statusStyles[p.status]}`}
                        >
                          <StatusIcon status={p.status} />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedPeriod(p)}
                          className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {periods.map((p) => (
                <div key={p.period_id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatPeriodDate(p.period_start_date)} – {formatPeriodDate(p.period_end_date)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{p.designation}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {p.wing} · {p.place_of_posting}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${statusStyles[p.status]}`}
                    >
                      <StatusIcon status={p.status} />
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {kraCountMap[p.period_id] ?? 0} KRA/KPI{(kraCountMap[p.period_id] ?? 0) !== 1 ? "s" : ""} added
                    </span>
                    <button
                      onClick={() => setSelectedPeriod(p)}
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Period Detail Modal */}
      {selectedPeriod && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPeriod(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Service Period Details</h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  {formatPeriodDate(selectedPeriod.period_start_date)} to{" "}
                  {formatPeriodDate(selectedPeriod.period_end_date)} · FY {selectedPeriod.financial_year}
                </p>
              </div>
              <button
                onClick={() => setSelectedPeriod(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Period & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                      Period
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPeriodDate(selectedPeriod.period_start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">To</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPeriodDate(selectedPeriod.period_end_date)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                      Position
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div>
                      <p className="text-xs text-gray-500">Designation</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedPeriod.designation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Wing / Posting</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedPeriod.wing} · {selectedPeriod.place_of_posting}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporting Hierarchy */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Reporting Hierarchy</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Reporting Officer (RO)", value: selectedPeriod.ro },
                    { label: "Reviewing Officer (RVO)", value: selectedPeriod.rvo },
                    { label: "Accepting Authority (AA)", value: selectedPeriod.aa },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                    >
                      <div>
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-sm font-medium text-gray-900">{value.name}</p>
                      </div>
                      <span className="text-xs text-gray-500 font-mono bg-white border border-gray-200 px-2 py-1 rounded">
                        {value.employee_id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KRA/KPI Status */}
              <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div>
                  <p className="text-xs text-gray-500">KRA/KPI Status for this Period</p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {kraCountMap[selectedPeriod.period_id] ?? 0} KRA/KPI
                    {(kraCountMap[selectedPeriod.period_id] ?? 0) !== 1 ? "s" : ""} added
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${statusStyles[selectedPeriod.status]}`}
                >
                  <StatusIcon status={selectedPeriod.status} />
                  {selectedPeriod.status}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setSelectedPeriod(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => handleAddKRA(selectedPeriod)}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add KRA/KPI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KRAEntryPage;
