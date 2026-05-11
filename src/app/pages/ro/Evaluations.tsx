import {
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Search,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";

type OfficerRole = "RO" | "RVO" | "AA";
type EvaluationTab = "pending" | "approved";

const Evaluations = () => {
  const [userRole, setUserRole] = useState<OfficerRole>("RO");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as OfficerRole | null;
    setUserRole(storedRole || "RO");
  }, []);

  const isAA = userRole === "AA";
  const isRVO = userRole === "RVO";

  const activeTab: EvaluationTab =
    searchParams.get("tab") === "approved" ? "approved" : "pending";

  const pendingItems = useMemo(
    () => [
      {
        id: "1",
        employeeId: "EMP001",
        employeeName: "John Doe",
        designation: "Senior Manager",
        type: isAA ? "Final Approval" : "KRA Approval",
        submittedOn: "Mar 5, 2026",
        deadline: "Mar 15, 2026",
        daysLeft: 6,
        status: "pending" as const,
      },
      {
        id: "2",
        employeeId: "EMP002",
        employeeName: "Jane Smith",
        designation: "Manager",
        type: isAA ? "Final Approval" : "Final Evaluation",
        submittedOn: "Mar 1, 2026",
        deadline: "Mar 10, 2026",
        daysLeft: 1,
        status: "urgent" as const,
      },
      {
        id: "3",
        employeeId: "EMP003",
        employeeName: "Robert Johnson",
        designation: "Assistant Manager",
        type: isAA ? "Final Approval" : "Mid-Year Review",
        submittedOn: "Mar 7, 2026",
        deadline: "Mar 20, 2026",
        daysLeft: 11,
        status: "pending" as const,
      },
    ],
    [isAA],
  );

  const approvedItems = useMemo(
    () => [
      {
        id: "1",
        employeeId: "EMP010",
        employeeName: "Sarah Wilson",
        designation: "Senior Manager",
        type: isAA ? "Final Approval" : "Final Evaluation",
        completedOn: "Mar 8, 2026",
        completedBy: "You",
        score: "85.5",
        grade: "Gold",
      },
      {
        id: "2",
        employeeId: "EMP011",
        employeeName: "Michael Brown",
        designation: "Manager",
        type: isAA ? "Final Approval" : "KRA Approval",
        completedOn: "Mar 7, 2026",
        completedBy: "You",
        score: "92.0",
        grade: "Platinum",
      },
      {
        id: "3",
        employeeId: "EMP012",
        employeeName: "Emily Davis",
        designation: "Assistant Manager",
        type: isAA ? "Final Approval" : "Mid-Year Review",
        completedOn: "Mar 6, 2026",
        completedBy: "You",
        score: "78.5",
        grade: "Gold",
      },
      {
        id: "4",
        employeeId: "EMP013",
        employeeName: "David Martinez",
        designation: "Senior Executive",
        type: isAA ? "Final Approval" : "Final Evaluation",
        completedOn: "Mar 5, 2026",
        completedBy: "You",
        score: "68.0",
        grade: "Silver",
      },
      {
        id: "5",
        employeeId: "EMP014",
        employeeName: "Lisa Anderson",
        designation: "Manager",
        type: isAA ? "Final Approval" : "KRA Approval",
        completedOn: "Mar 4, 2026",
        completedBy: "You",
        score: "90.5",
        grade: "Platinum",
      },
    ],
    [isAA],
  );

  const pageTitle = isAA
    ? "Evaluations & Approvals"
    : isRVO
      ? "Evaluation Reviews"
      : "Evaluations";
  const pageDescription = isAA
    ? "Track pending approvals and completed approvals in one place."
    : isRVO
      ? "Track pending reviews and completed reviews in one place."
      : "Track pending and approved evaluations in one place.";

  const getReviewLink = (employeeId: string) => {
    if (isAA) return `/aa/approval/${employeeId}`;
    if (isRVO) return `/rvo/review/${employeeId}`;
    return `/review/evaluation/${employeeId}`;
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case "Platinum":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Gold":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Silver":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Bronze":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const setTab = (tab: EvaluationTab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
        <p className="mt-1 text-gray-600">{pageDescription}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {pendingItems.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Urgent (&lt; 3 days)</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {pendingItems.filter((item) => item.daysLeft <= 3).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {approvedItems.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Avg. Review Time</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">2.5d</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              aria-label="Search by employee name or ID"
              placeholder="Search by employee name or ID..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4"
            />
          </div>
          <select
            aria-label="Filter by evaluation type"
            className="rounded-lg border border-gray-300 px-4 py-2"
          >
            <option>All Types</option>
            <option>KRA Approval</option>
            <option>Final Evaluation</option>
            <option>Mid-Year Review</option>
          </select>
          {activeTab === "approved" && (
            <select
              aria-label="Filter by grade"
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              <option>All Grades</option>
              <option>Platinum</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>Bronze</option>
            </select>
          )}
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Evaluations</h2>
              <p className="mt-1 text-sm text-gray-600">
                Switch between pending and approved evaluation items.
              </p>
            </div>
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setTab("pending")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "pending"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setTab("approved")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "approved"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Approved
              </button>
            </div>
          </div>
        </div>

        {activeTab === "pending" ? (
          <div className="divide-y divide-gray-200">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="truncate font-medium text-gray-900">
                        {item.employeeName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {item.employeeId}
                      </span>
                      {item.status === "urgent" && (
                        <span className="rounded border border-red-100 bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                          Urgent
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
                      <span className="font-medium text-gray-700">
                        {item.designation}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <span>{item.type}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <div className="flex items-center gap-1">
                        <Clock
                          className={`h-3.5 w-3.5 ${
                            item.daysLeft <= 3
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={
                            item.daysLeft <= 3
                              ? "font-medium text-red-600"
                              : ""
                          }
                        >
                          {item.daysLeft}d left
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={getReviewLink(item.employeeId)}
                    className="ml-4 flex shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {approvedItems.map((item) => (
              <div
                key={item.id}
                className="p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1.5 flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">
                        {item.employeeName}
                      </h3>
                      <span className="text-sm text-gray-600">
                        ({item.employeeId})
                      </span>
                      <span
                        className={`rounded border px-2.5 py-1 text-xs font-semibold ${getGradeBadgeColor(
                          item.grade,
                        )}`}
                      >
                        {item.grade}
                      </span>
                    </div>
                    <p className="mb-2 text-sm text-gray-600">
                      {item.designation}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span>
                        <span className="font-medium text-gray-900">
                          {item.type}
                        </span>
                      </span>
                      <span>&bull;</span>
                      <span>
                        Completed:{" "}
                        <span className="font-medium text-gray-900">
                          {item.completedOn}
                        </span>
                      </span>
                      <span>&bull;</span>
                      <span>
                        Score:{" "}
                        <span className="font-bold text-blue-600">
                          {item.score}
                        </span>
                      </span>
                      <span>&bull;</span>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={getReviewLink(item.employeeId)}
                    className="ml-4 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluations;
