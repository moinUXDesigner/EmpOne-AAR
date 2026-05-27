export interface EmployeePeriod {
  period_id: string;
  employee_id: string;
  financial_year: string;
  period_start_date: string;
  period_end_date: string;
  designation: string;
  wing: string;
  place_of_posting: string;
  ro: { id: string; name: string; employee_id: string };
  rvo: { id: string; name: string; employee_id: string };
  aa: { id: string; name: string; employee_id: string };
  status: "Pending" | "Draft" | "Submitted" | "Approved";
}

export const MOCK_EMPLOYEE_PERIODS: EmployeePeriod[] = [
  {
    period_id: "P1",
    employee_id: "01073080",
    financial_year: "2025-26",
    period_start_date: "2025-04-01",
    period_end_date: "2025-06-07",
    designation: "Assistant Engineer",
    wing: "IT Wing",
    place_of_posting: "IT Applications",
    ro: {
      id: "RO001",
      name: "Assistant Divisional Engineer / IT",
      employee_id: "01062003",
    },
    rvo: {
      id: "RVO001",
      name: "Divisional Engineer / IT",
      employee_id: "30001908",
    },
    aa: {
      id: "AA001",
      name: "Superintending Engineer / IT",
      employee_id: "01000337",
    },
    status: "Pending",
  },
  {
    period_id: "P2",
    employee_id: "01073080",
    financial_year: "2025-26",
    period_start_date: "2025-06-08",
    period_end_date: "2026-03-31",
    designation: "Assistant Engineer",
    wing: "SLDC Wing",
    place_of_posting: "SLDC",
    ro: {
      id: "RO002",
      name: "Assistant Divisional Engineer / SLDC",
      employee_id: "01062004",
    },
    rvo: {
      id: "RVO002",
      name: "Divisional Engineer / SLDC",
      employee_id: "30001909",
    },
    aa: {
      id: "AA002",
      name: "Superintending Engineer / SLDC",
      employee_id: "01000338",
    },
    status: "Pending",
  },
];

export function getEmployeePeriods(
  employeeId: string,
  financialYear: string
): EmployeePeriod[] {
  try {
    const stored = localStorage.getItem("employee_periods");
    if (stored) {
      const parsed: EmployeePeriod[] = JSON.parse(stored);
      const filtered = parsed.filter(
        (p) =>
          p.employee_id === employeeId && p.financial_year === financialYear
      );
      if (filtered.length > 0) return filtered;
    }
  } catch {
    // fall through to mock data
  }
  return MOCK_EMPLOYEE_PERIODS.filter(
    (p) => p.employee_id === employeeId && p.financial_year === financialYear
  );
}

export function formatPeriodDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}
