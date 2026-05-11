import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Save,
  Eye,
  X,
  Upload,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Check,
  BookOpen,
  Target,
  AlertCircle,
  TrendingUp,
  GraduationCap,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";

interface KRA {
  id: string;
  sl?: string;
  code?: string;
  kpi: string;
  targetAnnual: string;
  actualAchievement: string;
  sourceRefNo: string;
  sourceFiles?: string[];
  employeeNotes: string;
  startDate?: string;
  endDate?: string;
  trainingRequirements: string;
  uploadedFiles?: Array<{ name: string; url: string }>;
  status?: "Approved" | "Pending" | "Draft";
  type?: "initial" | "revised";
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
}

const EMPLOYEE_KRA_STORAGE_KEY = "employee_kras";

const KRAEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editKRA = (location.state as { editKRA?: KRA } | null)?.editKRA;
  const [currentStep, setCurrentStep] = useState(1);
  const [showExamples, setShowExamples] = useState(false);

  // Track sidebar width to offset the fixed header correctly
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => {
      return (
        localStorage.getItem("sidebarCollapsed") === "true"
      );
    },
  );

  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    window.addEventListener(
      "sidebarToggle",
      handleSidebarToggle as EventListener,
    );
    return () =>
      window.removeEventListener(
        "sidebarToggle",
        handleSidebarToggle as EventListener,
      );
  }, []);

  const sidebarOffset = sidebarCollapsed
    ? "lg:left-20"
    : "lg:left-64";

  const [formData, setFormData] = useState<KRA>({
    id: editKRA?.id || Date.now().toString(),
    sl: editKRA?.sl || "",
    code: editKRA?.code || "",
    kpi: "",
    targetAnnual: "",
    actualAchievement: "",
    sourceRefNo: "",
    sourceFiles: [],
    employeeNotes: "",
    startDate: "",
    endDate: "",
    trainingRequirements: "",
  });

  useEffect(() => {
    if (!editKRA) return;

    setFormData({
      id: editKRA.id,
      sl: editKRA.sl || "",
      code: editKRA.code || "",
      kpi: editKRA.kpi || "",
      targetAnnual: editKRA.targetAnnual || "",
      actualAchievement: editKRA.actualAchievement || "",
      sourceRefNo: editKRA.sourceRefNo || "",
      sourceFiles:
        editKRA.sourceFiles ||
        editKRA.uploadedFiles?.map((file) => file.name) ||
        [],
      employeeNotes: editKRA.employeeNotes || "",
      startDate: editKRA.startDate || "",
      endDate: editKRA.endDate || "",
      trainingRequirements: editKRA.trainingRequirements || "",
      uploadedFiles: editKRA.uploadedFiles || [],
      status: editKRA.status,
      type: editKRA.type,
      ro: editKRA.ro,
      rvo: editKRA.rvo,
      aa: editKRA.aa,
      aaValidationNotes: editKRA.aaValidationNotes,
    });
  }, [editKRA]);

  const steps = [
    { number: 1, name: "Basic Info", icon: BookOpen },
    { number: 2, name: "KRA/KPI", icon: Target },
    { number: 3, name: "Targets", icon: TrendingUp },
    {
      number: 4,
      name: "Notes",
      icon: GraduationCap,
    },
    { number: 5, name: "Review", icon: FileCheck },
  ];

  // Example KPIs for reference
  const exampleKPIs = [
    {
      kpi: "Project Delivery and Timeline Management",
      targetAnnual:
        "Complete 95% of assigned projects within scheduled timeline and budget",
      sourceRefNo:
        "Annual Project Plan 2025-26, Department Strategic Goals Document",
    },
    {
      kpi: "Customer Satisfaction Score",
      targetAnnual:
        "Achieve minimum 4.2/5.0 average customer satisfaction rating across all service touchpoints",
      sourceRefNo:
        "Customer Service Excellence Framework, Monthly Feedback Reports",
    },
    {
      kpi: "Process Improvement and Innovation",
      targetAnnual:
        "Implement at least 3 process improvement initiatives resulting in 10% efficiency gain",
      sourceRefNo:
        "Operational Excellence Policy, Innovation Guidelines 2025",
    },
    {
      kpi: "Team Development and Mentoring",
      targetAnnual:
        "Conduct quarterly skill development sessions and mentor 2 junior team members",
      sourceRefNo:
        "HR Development Policy, Training Calendar 2025-26",
    },
    {
      kpi: "Quality and Compliance Adherence",
      targetAnnual:
        "Maintain 100% compliance with quality standards and zero critical audit findings",
      sourceRefNo:
        "ISO Quality Standards, Compliance Manual Section 4.2",
    },
    {
      kpi: "Stakeholder Engagement",
      targetAnnual:
        "Organize monthly stakeholder meetings with 90% attendance and action item closure rate",
      sourceRefNo:
        "Stakeholder Management Framework, Communication Policy",
    },
  ];

  const updateFormData = (
    field: keyof KRA,
    value: string | number | string[],
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSourceFilesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileNames = Array.from(files).map(
      (file) => file.name,
    );
    const existingFiles = formData.sourceFiles || [];
    updateFormData("sourceFiles", [
      ...existingFiles,
      ...fileNames,
    ]);
    toast.success(
      `${files.length} file(s) attached to source reference`,
    );
  };

  const removeSourceFile = (fileName: string) => {
    const updatedFiles = (formData.sourceFiles || []).filter(
      (f) => f !== fileName,
    );
    updateFormData("sourceFiles", updatedFiles);
    toast.success("File removed");
  };

  const saveKRA = () => {
    if (!formData.kpi.trim()) {
      toast.error("Please enter KRA/KPI");
      return;
    }
    if (!formData.targetAnnual.trim()) {
      toast.error("Please enter annual target");
      return;
    }
    if (!formData.sourceRefNo.trim()) {
      toast.error("Please enter source reference");
      return;
    }

    const savedKras = localStorage.getItem(EMPLOYEE_KRA_STORAGE_KEY);
    const existingKras: KRA[] = savedKras
      ? JSON.parse(savedKras)
      : [];
    const isEditing = existingKras.some(
      (item) => item.id === formData.id,
    );

    const uploadedFiles =
      formData.sourceFiles?.map((fileName) => ({
        name: fileName,
        url: "#",
      })) || [];

    const kraToSave: KRA = {
      ...formData,
      sl:
        formData.sl ||
        String(
          isEditing
            ? existingKras.findIndex(
                (item) => item.id === formData.id,
              ) + 1
            : existingKras.length + 1,
        ),
      code:
        formData.code ||
        `KRA-${String(existingKras.length + 1).padStart(3, "0")}`,
      uploadedFiles,
      status: formData.status || "Draft",
      type: formData.type || "initial",
      ro: formData.ro || {
        rating: "",
        weightagePercent: "",
        score: "",
        validationNotes: "",
      },
      rvo: formData.rvo || {
        rating: "",
        weightagePercent: "",
        score: "",
        validationNotes: "",
      },
      aa: formData.aa || "",
      aaValidationNotes: formData.aaValidationNotes || "",
    };

    const updatedKras = isEditing
      ? existingKras.map((item) =>
          item.id === formData.id ? kraToSave : item,
        )
      : [...existingKras, kraToSave];

    localStorage.setItem(
      EMPLOYEE_KRA_STORAGE_KEY,
      JSON.stringify(updatedKras),
    );

    toast.success(
      isEditing
        ? "KRA/KPI updated successfully!"
        : "KRA/KPI saved successfully!",
    );

    // Show info message
    setTimeout(() => {
      toast.info(
        isEditing
          ? "Redirecting to View KRA/KPIs page with your updated entry."
          : "Redirecting to View KRA/KPIs page where you can add more entries, sign and submit.",
        {
          duration: 5000,
        },
      );
    }, 500);

    // Redirect to View KRAs page
    setTimeout(() => {
      navigate("/my-pms/view-kras");
    }, 1500);
  };

  const cancelForm = () => {
    navigate("/my-pms/view-kras");
  };

  const nextStep = () => {
    // Validation for each step
    if (currentStep === 2 && !formData.kpi.trim()) {
      toast.error("Please enter KRA/KPI");
      return;
    }
    if (currentStep === 3) {
      if (!formData.targetAnnual.trim()) {
        toast.error("Please enter annual target");
        return;
      }
      if (!formData.sourceRefNo.trim()) {
        toast.error("Please enter source reference");
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Fixed Header with Title and Stepper */}
      <div
        className={`fixed top-14 sm:top-16 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm px-6 py-4 ${sidebarOffset}`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {editKRA ? "Edit KRA Entry" : "KRA Entry Wizard"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {editKRA
                ? "Update the existing KRA/KPI details with the pre-filled data"
                : "Add one KRA/KPI at a time for focused entry"}
            </p>
          </div>

          {/* Compact Stepper */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div
                  key={step.number}
                  className="flex items-center flex-1"
                >
                  <div className="flex flex-col items-center flex-1">
                    <button
                      onClick={() => goToStep(step.number)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        isCompleted
                          ? "bg-green-600 text-white"
                          : isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </button>
                    <span
                      className={`mt-1.5 text-xs font-medium text-center ${
                        isCurrent
                          ? "text-blue-600"
                          : "text-gray-600"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 rounded ${
                        isCompleted
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-[140px]"></div>

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Step 1: Basic Information
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Officer details and reporting hierarchy
                </p>
              </div>

              {/* Period of Report */}
              <div className="flex items-center gap-4 bg-white border border-blue-200 rounded-lg px-4 py-3 flex-shrink-0">
                <div className="text-center">
                  <label className="block text-xs font-medium text-blue-600 mb-1">
                    Start Date
                  </label>
                  <p className="text-lg font-bold text-blue-900">
                    01.04.2025
                  </p>
                </div>
                <div className="w-8 h-0.5 bg-blue-300"></div>
                <div className="text-center">
                  <label className="block text-xs font-medium text-blue-600 mb-1">
                    End Date
                  </label>
                  <p className="text-lg font-bold text-blue-900">
                    31.03.2026
                  </p>
                </div>
                <div className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                  FY 2025-26
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Officer Information */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Name of Officer
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    John Doe
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Employee ID
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    EMP001
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Cadre/Wing
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    Technical Services
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Designation
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    Senior Manager
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Place of Posting
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    Head Office, Mumbai
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date of Joining (current post)
                  </label>
                  <p className="text-base font-medium text-gray-900">
                    15 Jan 2024
                  </p>
                </div>
              </div>
            </div>

            {/* Reporting Hierarchy */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Reporting Hierarchy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Reporting Officer */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-xs">
                      RO
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Reporting Officer
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Sarah Williams
                    </p>
                    <p className="text-xs text-gray-600">
                      EMP450
                    </p>
                  </div>
                </div>

                {/* Reviewing Officer */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                      RVO
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Reviewing Officer
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Michael Chen
                    </p>
                    <p className="text-xs text-gray-600">
                      EMP789
                    </p>
                  </div>
                </div>

                {/* Accepting Authority */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold text-xs">
                      AA
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      Accepting Authority
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      Robert Kumar
                    </p>
                    <p className="text-xs text-gray-600">
                      EMP156
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-10 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end shadow-lg ${sidebarOffset}`}
          >
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next: KRA/KPI Title
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: KRA/KPI Title and Dates */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">
                  Step 2: KRA/KPI Title
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the KRA/KPI and specify its duration
                </p>
              </div>
              <button
                onClick={() => setShowExamples(true)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">
                  View Examples
                </span>
                <span className="sm:hidden">Examples</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KRA/KPI{" "}
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.kpi}
                  onChange={(e) =>
                    updateFormData("kpi", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your Key Result Area or Key Performance Indicator"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific and measurable in defining your
                  KRA/KPI
                </p>
              </div>

              {/* KPI Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      updateFormData(
                        "startDate",
                        e.target.value,
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      updateFormData("endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-10 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between shadow-lg ${sidebarOffset}`}
          >
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next: Targets
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Targets and Source */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div>
              <h2 className="font-semibold text-gray-900">
                Step 3: Targets & Source Reference
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Define annual target, achievement, and
                supporting documentation
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target (Annual){" "}
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={formData.targetAnnual}
                  onChange={(e) =>
                    updateFormData(
                      "targetAnnual",
                      e.target.value,
                    )
                  }
                  rows={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the annual target for this KPI"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Clearly state what you aim to achieve by the
                  end of the year
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Achievement
                </label>
                <textarea
                  value={formData.actualAchievement}
                  onChange={(e) =>
                    updateFormData(
                      "actualAchievement",
                      e.target.value,
                    )
                  }
                  rows={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="This will be updated during the year as you achieve milestones"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Can be filled later during mid-year
                  or final review
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source Ref. No.{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.sourceRefNo}
                  onChange={(e) =>
                    updateFormData(
                      "sourceRefNo",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter source reference number or document name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Reference the policy, plan, or document that
                  defines this KPI
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Source Files
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleSourceFilesChange}
                    className="hidden"
                    id="sourceFiles"
                  />
                  <label
                    htmlFor="sourceFiles"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </label>
                  <span className="text-sm text-gray-500">
                    PDF, DOC, XLS, or images
                  </span>
                </div>
                {formData.sourceFiles &&
                  formData.sourceFiles.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Attached Files:
                      </p>
                      <ul className="space-y-1">
                        {formData.sourceFiles.map(
                          (file, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                            >
                              <span className="text-sm text-gray-900">
                                {file}
                              </span>
                              <button
                                onClick={() =>
                                  removeSourceFile(file)
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Remove File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-10 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between shadow-lg ${sidebarOffset}`}
          >
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next: Notes
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Training and Notes */}
      {currentStep === 4 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div>
              <h2 className="font-semibold text-gray-900">
                Step 4: Additional Notes
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Specify any additional information
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Requirements
                </label>
                <textarea
                  value={formData.trainingRequirements}
                  onChange={(e) =>
                    updateFormData(
                      "trainingRequirements",
                      e.target.value,
                    )
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Specify any training, certifications, or skill development needed to achieve this KRA/KPI"
                />
                <p className="text-xs text-gray-500 mt-1">
                  List specific courses, workshops, or
                  certifications that would help you achieve
                  this goal
                </p>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Notes - Constraints / Support
                  Required
                </label>
                <textarea
                  value={formData.employeeNotes}
                  onChange={(e) =>
                    updateFormData(
                      "employeeNotes",
                      e.target.value,
                    )
                  }
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter any constraints faced or support required (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mention any resource requirements,
                  dependencies, or challenges you foresee
                </p>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-10 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between shadow-lg ${sidebarOffset}`}
          >
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next: Review
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Review & Save */}
      {currentStep === 5 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div>
              <h2 className="font-semibold text-gray-900">
                Step 5: Review & Save
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Review your KRA/KPI details before saving
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-22rem)] pb-6 pr-1">
              {/* KRA/KPI Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  KRA/KPI Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      KRA/KPI
                    </label>
                    <p className="text-base text-gray-900">
                      {formData.kpi || (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  {(formData.startDate || formData.endDate) && (
                    <div className="grid grid-cols-2 gap-4">
                      {formData.startDate && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Start Date
                          </label>
                          <p className="text-base text-gray-900">
                            {new Date(
                              formData.startDate,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}
                      {formData.endDate && (
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            End Date
                          </label>
                          <p className="text-base text-gray-900">
                            {new Date(
                              formData.endDate,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Targets */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Targets & Reference
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Annual Target
                    </label>
                    <p className="text-base text-gray-900">
                      {formData.targetAnnual || (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  {formData.actualAchievement && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Actual Achievement
                      </label>
                      <p className="text-base text-gray-900">
                        {formData.actualAchievement}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Source Reference
                    </label>
                    <p className="text-base text-gray-900">
                      {formData.sourceRefNo || (
                        <span className="text-gray-400 italic">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  {formData.sourceFiles &&
                    formData.sourceFiles.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Attached Files
                        </label>
                        <ul className="space-y-1">
                          {formData.sourceFiles.map(
                            (file, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-900 flex items-center gap-2"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                {file}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </div>

              {/* Training & Notes */}
              {(formData.trainingRequirements ||
                formData.employeeNotes) && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    {formData.trainingRequirements && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Training Requirements
                        </label>
                        <p className="text-base text-gray-900">
                          {formData.trainingRequirements}
                        </p>
                      </div>
                    )}
                    {formData.employeeNotes && (
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Employee Notes
                        </label>
                        <p className="text-base text-gray-900">
                          {formData.employeeNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step Navigation */}
          <div
            className={`fixed bottom-0 left-0 right-0 z-10 px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg ${sidebarOffset}`}
          >
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={cancelForm}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={saveKRA}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save & Continue to View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Examples Modal */}
      {showExamples && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowExamples(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Example KRA/KPIs
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Reference examples to help you define your
                  KPIs
                </p>
              </div>
              <button
                onClick={() => setShowExamples(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {exampleKPIs.map((example, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {example.kpi}
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                              Target (Annual)
                            </label>
                            <p className="text-sm text-gray-900">
                              {example.targetAnnual}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                              Source Ref. No.
                            </label>
                            <p className="text-sm text-gray-900">
                              {example.sourceRefNo}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end sticky bottom-0">
              <button
                onClick={() => setShowExamples(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KRAEntry;
