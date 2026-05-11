import { useEffect, useMemo, useState } from "react";
import {
  Save,
  Lock,
  ArrowLeft,
  CheckCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "sonner";

type RatingKey =
  | "kra"
  | "personal"
  | "functional"
  | "overall";

type RatingItem = {
  key: RatingKey;
  label: string;
  ro: number;
  rvo: number;
  aa: string;
  status: "Agreed" | "Revised";
  roRemark: string;
  rvoRemark: string;
};

type KRAReviewItem = {
  id: string;
  sl: string;
  title: string;
  roRating: string;
  roWeightage: string;
  roScore: string;
  rvoRating: string;
  rvoWeightage: string;
  rvoScore: string;
  aaRating: string;
  aaWeightage: string;
  aaScore: string;
};

type RatingMap = {
  [key: number]: string;
};

type WeightedReviewItem = {
  sl_no: number;
  attribute?: string;
  competency?: string;
  weightage_percent: number;
};

type Training = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
};

const initialRatings: RatingItem[] = [
  {
    key: "kra",
    label: "KRA Performance",
    ro: 8.5,
    rvo: 8.7,
    aa: "8.7",
    status: "Agreed",
    roRemark:
      "RO rated KRA delivery highly based on target completion, evidence quality, and delivery consistency.",
    rvoRemark:
      "RVO concurred with the outcome quality and noted stronger moderation support on critical deliverables.",
  },
  {
    key: "personal",
    label: "Personal Attributes",
    ro: 9.0,
    rvo: 8.8,
    aa: "8.8",
    status: "Agreed",
    roRemark:
      "RO observed strong discipline, dependability, and proactive ownership across the review period.",
    rvoRemark:
      "RVO agreed overall but moderated the score slightly to reflect uneven performance in stakeholder escalation handling.",
  },
  {
    key: "functional",
    label: "Functional Competency",
    ro: 8.0,
    rvo: 8.4,
    aa: "8.4",
    status: "Agreed",
    roRemark:
      "RO highlighted stable domain knowledge and good process compliance with room to improve drafting quality.",
    rvoRemark:
      "RVO emphasized stronger gains in planning and systems usage than reflected in the RO score.",
  },
  {
    key: "overall",
    label: "Overall Score",
    ro: 8.5,
    rvo: 8.6,
    aa: "8.6",
    status: "Agreed",
    roRemark:
      "RO concluded the employee delivered a consistently strong year with leadership potential.",
    rvoRemark:
      "RVO broadly concurred and recommended higher exposure to larger responsibilities.",
  },
];

const initialKraReviewItems: KRAReviewItem[] = [
  {
    id: "1",
    sl: "1",
    title: "Customer Service Excellence",
    roRating: "9",
    roWeightage: "25",
    roScore: "22.50",
    rvoRating: "9",
    rvoWeightage: "25",
    rvoScore: "22.50",
    aaRating: "9",
    aaWeightage: "25",
    aaScore: "22.50",
  },
  {
    id: "2",
    sl: "2",
    title: "Operational Efficiency Improvement",
    roRating: "8",
    roWeightage: "15",
    roScore: "12.00",
    rvoRating: "8",
    rvoWeightage: "15",
    rvoScore: "12.00",
    aaRating: "8",
    aaWeightage: "15",
    aaScore: "12.00",
  },
  {
    id: "3",
    sl: "3",
    title: "Project Delivery & Timely Completion",
    roRating: "7",
    roWeightage: "15",
    roScore: "10.50",
    rvoRating: "8",
    rvoWeightage: "15",
    rvoScore: "12.00",
    aaRating: "8",
    aaWeightage: "15",
    aaScore: "12.00",
  },
  {
    id: "4",
    sl: "4",
    title: "Cost Optimization & Budget Control",
    roRating: "8",
    roWeightage: "10",
    roScore: "8.00",
    rvoRating: "8",
    rvoWeightage: "10",
    rvoScore: "8.00",
    aaRating: "8",
    aaWeightage: "10",
    aaScore: "8.00",
  },
  {
    id: "5",
    sl: "5",
    title: "Team Development & Capacity Building",
    roRating: "9",
    roWeightage: "10",
    roScore: "9.00",
    rvoRating: "9",
    rvoWeightage: "10",
    rvoScore: "9.00",
    aaRating: "9",
    aaWeightage: "10",
    aaScore: "9.00",
  },
  {
    id: "6",
    sl: "6",
    title: "Compliance & Governance",
    roRating: "8",
    roWeightage: "10",
    roScore: "8.00",
    rvoRating: "8",
    rvoWeightage: "10",
    rvoScore: "8.00",
    aaRating: "8",
    aaWeightage: "10",
    aaScore: "8.00",
  },
  {
    id: "7",
    sl: "7",
    title: "Digital Transformation Initiatives",
    roRating: "7",
    roWeightage: "7.5",
    roScore: "5.25",
    rvoRating: "8",
    rvoWeightage: "7.5",
    rvoScore: "6.00",
    aaRating: "8",
    aaWeightage: "7.5",
    aaScore: "6.00",
  },
  {
    id: "8",
    sl: "8",
    title: "Stakeholder Engagement & Reporting",
    roRating: "8",
    roWeightage: "7.5",
    roScore: "6.00",
    rvoRating: "8",
    rvoWeightage: "7.5",
    rvoScore: "6.00",
    aaRating: "8",
    aaWeightage: "7.5",
    aaScore: "6.00",
  },
];

const personalAttributes: WeightedReviewItem[] = [
  {
    sl_no: 1,
    attribute: "Integrity & Ethics",
    weightage_percent: 15,
  },
  {
    sl_no: 2,
    attribute: "Discipline / Dependability",
    weightage_percent: 15,
  },
  {
    sl_no: 3,
    attribute: "Communication / Perception / Understanding Capabilities",
    weightage_percent: 15,
  },
  {
    sl_no: 4,
    attribute: "Creativity",
    weightage_percent: 10,
  },
  {
    sl_no: 5,
    attribute: "Teamwork / Collaboration",
    weightage_percent: 15,
  },
  {
    sl_no: 6,
    attribute: "Initiative / Proactiveness",
    weightage_percent: 10,
  },
  {
    sl_no: 7,
    attribute: "Stakeholder / Consumer Orientation",
    weightage_percent: 10,
  },
  {
    sl_no: 8,
    attribute: "Punctuality / Promptness",
    weightage_percent: 10,
  },
];

const functionalCompetencies: WeightedReviewItem[] = [
  {
    sl_no: 1,
    competency: "Job Knowledge / Domain Capability",
    weightage_percent: 20,
  },
  {
    sl_no: 2,
    competency: "Planning & Organizing",
    weightage_percent: 15,
  },
  {
    sl_no: 3,
    competency: "Problem Solving / Decision Support",
    weightage_percent: 15,
  },
  {
    sl_no: 4,
    competency: "Quality Orientation",
    weightage_percent: 10,
  },
  {
    sl_no: 5,
    competency: "Safety & Compliance Orientation",
    weightage_percent: 15,
  },
  {
    sl_no: 6,
    competency: "Digital / Systems Usage (e-Office / SAP / Tools)",
    weightage_percent: 15,
  },
  {
    sl_no: 7,
    competency: "Drafting Skills",
    weightage_percent: 10,
  },
];

const roAttributeRatings: RatingMap = {
  1: "9",
  2: "8",
  3: "8",
  4: "7",
  5: "9",
  6: "8",
  7: "8",
  8: "9",
};

const rvoAttributeRatings: RatingMap = {
  1: "9",
  2: "9",
  3: "9",
  4: "8",
  5: "9",
  6: "9",
  7: "8",
  8: "9",
};

const roCompetencyRatings: RatingMap = {
  1: "8",
  2: "8",
  3: "7",
  4: "8",
  5: "9",
  6: "7",
  7: "7",
};

const rvoCompetencyRatings: RatingMap = {
  1: "9",
  2: "8",
  3: "8",
  4: "9",
  5: "8",
  6: "8",
  7: "9",
};

const roTrainingRecommendations: Training[] = [
  {
    id: "ro-1",
    title: "Advanced stakeholder communication workshop",
    description: "Improve coordination and escalation handling.",
    priority: "medium",
  },
  {
    id: "ro-2",
    title: "Cross-functional planning and coordination training",
    description: "Build stronger planning discipline across larger initiatives.",
    priority: "medium",
  },
];

const rvoTrainingRecommendations: Training[] = [
  {
    id: "rvo-1",
    title: "Leadership readiness and delegation program",
    description: "Prepare for larger team responsibilities.",
    priority: "high",
  },
  {
    id: "rvo-2",
    title: "Strategic execution and review moderation coaching",
    description: "Strengthen execution review and moderation judgment.",
    priority: "medium",
  },
];

const roSummary = {
  kraKpiValidationNotes:
    "RO validated the employee's KRA/KPI submissions against available source records, operational trackers, and outcome evidence.",
  keyOutcomes:
    "Delivered key operational targets, improved service response timelines, and supported team execution across priority initiatives.",
  strengths:
    "Strong ownership, dependable execution, and good coordination with stakeholders.",
  areasForImprovement:
    "Needs to improve cross-functional planning on larger initiatives.",
  overallAssessment:
    "A strong performer who consistently meets expectations and demonstrates leadership potential.",
  remarks:
    "Excellent performance throughout the year. Consistently exceeded expectations in project delivery and team management.",
};

const rvoSummary = {
  kraKpiValidationNotes:
    "RVO concurred with the core KRA/KPI assessment and noted that reported outcomes are aligned with the submitted evidence.",
  keyOutcomes:
    "Maintained delivery quality, supported process improvements, and showed steady performance across the review cycle.",
  strengths:
    "Good judgment, steady stakeholder handling, and reliable follow-through.",
  areasForImprovement:
    "Should broaden strategic delegation and improve stretch goal planning.",
  overallAssessment:
    "Concur with RO's assessment. Employee has shown exceptional capabilities and maintains high standards of work.",
  remarks:
    "Recommend for advanced leadership roles, with continued focus on larger organizational responsibilities.",
};

const steps = [
  { number: 1, title: "Basic Info", fullTitle: "Basic Information" },
  { number: 2, title: "KRA Rating", fullTitle: "KRA Rating" },
  { number: 3, title: "Personal", fullTitle: "Personal Attributes" },
  { number: 4, title: "Functional", fullTitle: "Functional Competencies" },
  { number: 5, title: "Summary", fullTitle: "Overall Summary" },
  { number: 6, title: "Review", fullTitle: "AA Review" },
];

const AAApproval = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [ratings, setRatings] = useState<RatingItem[]>(initialRatings);
  const [kraReviewItems, setKraReviewItems] =
    useState<KRAReviewItem[]>(initialKraReviewItems);
  const [reviseKraRatings, setReviseKraRatings] = useState(false);
  const [reviseAttributesMode, setReviseAttributesMode] = useState(false);
  const [reviseCompetenciesMode, setReviseCompetenciesMode] = useState(false);
  const [reviseSummaryMode, setReviseSummaryMode] = useState(false);
  const [reviseTrainingMode, setReviseTrainingMode] = useState(false);
  const [aaAttributeRatings, setAaAttributeRatings] =
    useState<RatingMap>(rvoAttributeRatings);
  const [aaCompetencyRatings, setAaCompetencyRatings] =
    useState<RatingMap>(rvoCompetencyRatings);
  const [aaKraKpiValidationNotes, setAaKraKpiValidationNotes] = useState("");
  const [aaKeyOutcomes, setAaKeyOutcomes] = useState("");
  const [aaStrengths, setAaStrengths] = useState("");
  const [aaAreasForImprovement, setAaAreasForImprovement] = useState("");
  const [aaOverallAssessment, setAaOverallAssessment] = useState("");
  const [aaRemarks, setAaRemarks] = useState("");
  const [aaRecommendations, setAaRecommendations] = useState("");
  const [justification, setJustification] = useState("");
  const [aaTrainings, setAaTrainings] = useState<Training[]>([]);
  const [showAaTrainingForm, setShowAaTrainingForm] = useState(false);
  const [currentAaTraining, setCurrentAaTraining] = useState<Training>({
    id: "",
    title: "",
    description: "",
    priority: "medium",
  });
  const [isEditingAaTraining, setIsEditingAaTraining] = useState(false);

  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setSidebarCollapsed(event.detail.collapsed);
    };

    const saved = localStorage.getItem("sidebarCollapsed");
    setSidebarCollapsed(saved === "true");

    window.addEventListener(
      "sidebarToggle",
      handleSidebarToggle as EventListener,
    );

    return () => {
      window.removeEventListener(
        "sidebarToggle",
        handleSidebarToggle as EventListener,
      );
    };
  }, []);

  const updateAaRating = (key: RatingKey, value: string) => {
    setRatings((currentRatings) =>
      currentRatings.map((item) =>
        item.key === key
          ? {
              ...item,
              aa: value,
              status:
                value !== "" &&
                Number(value).toFixed(1) !== item.rvo.toFixed(1)
                  ? "Revised"
                  : "Agreed",
            }
          : item,
      ),
    );
  };

  const calculateScore = (rating: string, weightage: number) => {
    if (!rating) return "-";
    return ((parseFloat(rating) * weightage) / 100).toFixed(2);
  };

  const calculateTotalScore = (
    ratingMap: RatingMap,
    items: WeightedReviewItem[],
  ) => {
    const total = items.reduce((sum, item) => {
      const rating = ratingMap[item.sl_no];
      if (!rating) return sum;
      return sum + (parseFloat(rating) * item.weightage_percent) / 100;
    }, 0);

    return total.toFixed(2);
  };

  const updateAaAttributeRating = (slNo: number, value: string) => {
    const nextRatings = {
      ...aaAttributeRatings,
      [slNo]: value,
    };

    setAaAttributeRatings(nextRatings);
    updateAaRating(
      "personal",
      calculateTotalScore(nextRatings, personalAttributes),
    );
  };

  const updateAaCompetencyRating = (slNo: number, value: string) => {
    const nextRatings = {
      ...aaCompetencyRatings,
      [slNo]: value,
    };

    setAaCompetencyRatings(nextRatings);
    updateAaRating(
      "functional",
      calculateTotalScore(nextRatings, functionalCompetencies),
    );
  };

  const handleAddAaTrainingClick = () => {
    setCurrentAaTraining({
      id: Date.now().toString(),
      title: "",
      description: "",
      priority: "medium",
    });
    setIsEditingAaTraining(false);
    setShowAaTrainingForm(true);
  };

  const handleSaveAaTraining = () => {
    if (!currentAaTraining.title.trim()) {
      toast.error("Please enter a training title");
      return;
    }

    if (isEditingAaTraining) {
      setAaTrainings(
        aaTrainings.map((training) =>
          training.id === currentAaTraining.id ? currentAaTraining : training,
        ),
      );
    } else {
      setAaTrainings([...aaTrainings, currentAaTraining]);
    }

    setShowAaTrainingForm(false);
    setCurrentAaTraining({
      id: "",
      title: "",
      description: "",
      priority: "medium",
    });
  };

  const handleCancelAaTraining = () => {
    setShowAaTrainingForm(false);
    setCurrentAaTraining({
      id: "",
      title: "",
      description: "",
      priority: "medium",
    });
  };

  const handleEditAaTraining = (training: Training) => {
    setCurrentAaTraining(training);
    setIsEditingAaTraining(true);
    setShowAaTrainingForm(true);
  };

  const removeAaTraining = (id: string) => {
    setAaTrainings(aaTrainings.filter((training) => training.id !== id));
  };

  const updateCurrentAaTraining = (field: keyof Training, value: string) => {
    setCurrentAaTraining({ ...currentAaTraining, [field]: value });
  };

  const finalScore = useMemo(() => {
    const overallItem = ratings.find((item) => item.key === "overall");
    if (overallItem?.aa) {
      return Number(overallItem.aa).toFixed(1);
    }

    const scoredItems = ratings.filter(
      (item) => item.key !== "overall" && item.aa !== "",
    );
    if (scoredItems.length === 0) return "0.0";

    const total = scoredItems.reduce(
      (sum, item) => sum + Number(item.aa || 0),
      0,
    );
    return (total / scoredItems.length).toFixed(1);
  }, [ratings]);

  const finalGrade = useMemo(() => {
    const score = Number(finalScore);
    if (score >= 9) return "Outstanding";
    if (score >= 8) return "Very Good";
    if (score >= 7) return "Good";
    if (score >= 6) return "Satisfactory";
    return "Needs Improvement";
  }, [finalScore]);

  const hasAaKraRevision = kraReviewItems.some(
    (item) => item.aaRating && item.aaRating !== item.rvoRating,
  );
  const hasAaAttributeRevision = personalAttributes.some(
    (item) =>
      aaAttributeRatings[item.sl_no] &&
      aaAttributeRatings[item.sl_no] !== rvoAttributeRatings[item.sl_no],
  );
  const hasAaCompetencyRevision = functionalCompetencies.some(
    (item) =>
      aaCompetencyRatings[item.sl_no] &&
      aaCompetencyRatings[item.sl_no] !== rvoCompetencyRatings[item.sl_no],
  );
  const hasAaRevision =
    ratings.some((item) => item.status === "Revised") ||
    hasAaKraRevision ||
    hasAaAttributeRevision ||
    hasAaCompetencyRevision;
  const totalRvoKraScore = useMemo(
    () =>
      kraReviewItems
        .reduce((sum, item) => sum + (Number(item.rvoScore) || 0), 0)
        .toFixed(2),
    [kraReviewItems],
  );
  const totalAaKraScore = useMemo(
    () =>
      kraReviewItems
        .reduce((sum, item) => sum + (Number(item.aaScore) || 0), 0)
        .toFixed(2),
    [kraReviewItems],
  );

  const updateAaKraRating = (id: string, value: string) => {
    setKraReviewItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;

        const aaScore =
          value && item.aaWeightage
            ? ((Number(value) / 10) * Number(item.aaWeightage)).toFixed(2)
            : "";

        return {
          ...item,
          aaRating: value,
          aaScore,
        };
      }),
    );
  };

  const validateStep = (step: number) => {
    if (step === 2 && reviseKraRatings) {
      const hasMissingAaRatings = kraReviewItems.some((item) => !item.aaRating);
      if (hasMissingAaRatings) {
        toast.error("Please enter all AA KRA ratings before proceeding");
        return false;
      }
    }

    if (step === 6) {
      if (!aaRemarks.trim()) {
        toast.error("Please enter AA final remarks");
        return false;
      }

      if (hasAaRevision && !justification.trim()) {
        toast.error("Please provide justification for revised AA ratings");
        return false;
      }
    }

    return true;
  };

  const handleStepClick = (stepNumber: number) => {
    if (
      completedSteps.includes(stepNumber) ||
      stepNumber === currentStep ||
      stepNumber === currentStep + 1
    ) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep === steps.length) {
      setShowSuccessMessage(true);
      toast.success("AA appraisal finalized successfully!");
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate("/review/evaluations?tab=pending");
      }, 1500);
      return;
    }

    setCurrentStep((prev) => prev + 1);
    toast.success("Progress saved");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = () => {
    setShowSuccessMessage(true);
    toast.success("AA draft saved successfully!");
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  const renderSectionCard = (
    title: string,
    accentClasses: string,
    summary: typeof roSummary,
  ) => (
    <div className={`rounded-lg border p-4 space-y-4 ${accentClasses}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div>
        <p className="text-xs font-semibold uppercase mb-1">
          KRA/KPI Validation Notes
        </p>
        <p className="text-sm">{summary.kraKpiValidationNotes}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase mb-1">
          Key Outcomes Delivered
        </p>
        <p className="text-sm">{summary.keyOutcomes}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase mb-1">
          Strength Observed
        </p>
        <p className="text-sm">{summary.strengths}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase mb-1">
          Improvement Area
        </p>
        <p className="text-sm">{summary.areasForImprovement}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase mb-1">Remarks</p>
        <p className="text-sm">{summary.remarks}</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Employee Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Review employee details and prior reviewers before final
                approval.
              </p>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Employee ID</p>
                <p className="font-semibold text-gray-900 mt-1">{employeeId}</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-gray-900 mt-1">John Doe</p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Designation</p>
                <p className="font-semibold text-gray-900 mt-1">
                  Senior Manager
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-900 mt-1">Operations</p>
              </div>
              <div className="rounded-lg border border-blue-200 p-4 bg-blue-50 md:col-span-1 xl:col-span-2">
                <p className="text-sm text-blue-700">Reporting Officer</p>
                <p className="font-semibold text-blue-950 mt-1">
                  Sarah Wilson
                </p>
                <p className="text-sm text-blue-900 mt-2">{roSummary.remarks}</p>
              </div>
              <div className="rounded-lg border border-amber-200 p-4 bg-amber-50 md:col-span-1 xl:col-span-2">
                <p className="text-sm text-amber-700">Reviewing Officer</p>
                <p className="font-semibold text-amber-950 mt-1">
                  Michael Brown
                </p>
                <p className="text-sm text-amber-900 mt-2">
                  {rvoSummary.remarks}
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-4 md:p-6">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Section II - KRA Rating
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review RO and RVO KRA ratings first, then use revise mode to
                    provide AA ratings.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-blue-600">
                    Total KRAs: {kraReviewItems.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setReviseKraRatings(!reviseKraRatings)}
                    className={
                      reviseKraRatings
                        ? "text-sm text-amber-700 hover:text-amber-900 underline"
                        : "flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700"
                    }
                  >
                    {!reviseKraRatings && <RefreshCw className="w-4 h-4" />}
                    {reviseKraRatings ? "Cancel Revision" : "Revise Ratings"}
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6 space-y-4">
                <div className="overflow-x-auto">
                  <table
                    className={`w-full ${
                      reviseKraRatings ? "min-w-[1320px]" : "min-w-[1040px]"
                    }`}
                  >
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th
                          className="text-center py-3 px-4 text-sm font-medium text-gray-700"
                          rowSpan={2}
                        >
                          #
                        </th>
                        <th
                          className="text-left py-3 px-4 text-sm font-medium text-gray-700"
                          rowSpan={2}
                        >
                          KRA / KPI Title
                        </th>
                        <th
                          className="text-center py-3 px-4 text-sm font-medium text-gray-700"
                          rowSpan={2}
                        >
                          View
                        </th>
                        <th
                          className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50"
                          colSpan={3}
                        >
                          RO Evaluation
                        </th>
                        <th
                          className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50"
                          colSpan={3}
                        >
                          RVO Evaluation
                        </th>
                        {reviseKraRatings && (
                          <th
                            className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50"
                            colSpan={3}
                          >
                            AA Evaluation
                          </th>
                        )}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Rating (1-10)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Weightage (%)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Score
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Rating (1-10)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Weightage (%)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Score
                        </th>
                        {reviseKraRatings && (
                          <>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Rating (1-10)
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Weightage (%)
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Score
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {kraReviewItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {item.sl}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">
                            {item.title}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700"
                              aria-label={`View ${item.title}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {item.roRating}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {item.roWeightage}
                          </td>
                          <td className="py-4 px-4 text-center text-sm font-semibold text-blue-600">
                            {item.roScore}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900 bg-amber-50/40">
                            {item.rvoRating}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900 bg-amber-50/40">
                            {item.rvoWeightage}
                          </td>
                          <td className="py-4 px-4 text-center text-sm font-semibold text-amber-700 bg-amber-50/40">
                            {item.rvoScore}
                          </td>
                          {reviseKraRatings && (
                            <>
                              <td className="py-4 px-4 text-center bg-green-50/40">
                                <select
                                  value={item.aaRating}
                                  onChange={(e) =>
                                    updateAaKraRating(item.id, e.target.value)
                                  }
                                  className="w-36 px-3 py-2 border border-green-300 rounded-lg bg-white text-sm"
                                >
                                  <option value="">Select</option>
                                  {Array.from({ length: 10 }, (_, index) => {
                                    const rating = String(index + 1);
                                    return (
                                      <option key={rating} value={rating}>
                                        {rating}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td className="py-4 px-4 text-center text-sm text-gray-900 bg-green-50/40">
                                {item.aaWeightage}
                              </td>
                              <td className="py-4 px-4 text-center text-sm font-semibold text-green-700 bg-green-50/40">
                                {item.aaScore || "-"}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold leading-tight">
                        Total Score Summary {reviseKraRatings ? "(AA)" : "(RVO)"}
                      </h4>
                      <p className="text-xs text-blue-100 leading-tight">
                        {kraReviewItems.length} / {kraReviewItems.length} KRAs
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="rounded bg-white/95 px-3 py-2 text-gray-900">
                        <div className="text-[10px] text-gray-600">Total</div>
                        <div className="text-sm font-semibold">
                          {reviseKraRatings
                            ? totalAaKraScore
                            : totalRvoKraScore}
                        </div>
                      </div>
                      <div className="rounded bg-white/95 px-3 py-2 text-gray-900">
                        <div className="text-[10px] text-gray-600">
                          Weightage
                        </div>
                        <div className="text-sm font-semibold">100%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4 md:p-6">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Section III (A) - Personal Attributes
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review RO and RVO ratings first, then use revise mode to
                    provide AA ratings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviseAttributesMode(!reviseAttributesMode)}
                  className={
                    reviseAttributesMode
                      ? "text-sm text-amber-700 hover:text-amber-900 underline"
                      : "flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700"
                  }
                >
                  {!reviseAttributesMode && <RefreshCw className="w-4 h-4" />}
                  {reviseAttributesMode
                    ? "Cancel Revision"
                    : "Revise Ratings"}
                </button>
              </div>

              <div className="p-4 md:p-6">
                <div className="overflow-x-auto">
                  <table
                    className={`w-full ${
                      reviseAttributesMode
                        ? "min-w-[1320px]"
                        : "min-w-[980px]"
                    }`}
                  >
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th
                          rowSpan={2}
                          className="text-center py-3 px-4 text-sm font-medium text-gray-700"
                        >
                          #
                        </th>
                        <th
                          rowSpan={2}
                          className="text-left py-3 px-4 text-sm font-medium text-gray-700"
                        >
                          Attribute
                        </th>
                        <th
                          colSpan={3}
                          className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50"
                        >
                          RO Evaluation
                        </th>
                        <th
                          colSpan={3}
                          className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50"
                        >
                          RVO Evaluation
                        </th>
                        {reviseAttributesMode && (
                          <th
                            colSpan={3}
                            className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50"
                          >
                            AA Evaluation
                          </th>
                        )}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Rating (1-10)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Weightage (%)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Score
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Rating (1-10)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Weightage (%)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Score
                        </th>
                        {reviseAttributesMode && (
                          <>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Rating (1-10)
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Weightage (%)
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Score
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {personalAttributes.map((item) => (
                        <tr
                          key={item.sl_no}
                          className="border-b border-gray-100"
                        >
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {item.sl_no}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">
                            {item.attribute}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {roAttributeRatings[item.sl_no]}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {item.weightage_percent}
                          </td>
                          <td className="py-4 px-4 text-center text-sm font-semibold text-blue-600">
                            {calculateScore(
                              roAttributeRatings[item.sl_no],
                              item.weightage_percent,
                            )}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900 bg-amber-50/40">
                            {rvoAttributeRatings[item.sl_no]}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900 bg-amber-50/40">
                            {item.weightage_percent}
                          </td>
                          <td className="py-4 px-4 text-center text-sm font-semibold text-amber-700 bg-amber-50/40">
                            {calculateScore(
                              rvoAttributeRatings[item.sl_no],
                              item.weightage_percent,
                            )}
                          </td>
                          {reviseAttributesMode && (
                            <>
                              <td className="py-4 px-4 text-center bg-green-50/40">
                                <select
                                  value={aaAttributeRatings[item.sl_no] || ""}
                                  onChange={(e) =>
                                    updateAaAttributeRating(
                                      item.sl_no,
                                      e.target.value,
                                    )
                                  }
                                  className="w-36 px-3 py-2 border border-green-300 rounded-lg bg-white text-sm"
                                >
                                  <option value="">Select</option>
                                  {Array.from({ length: 10 }, (_, index) => {
                                    const rating = String(index + 1);
                                    return (
                                      <option key={rating} value={rating}>
                                        {rating}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td className="py-4 px-4 text-center text-sm text-gray-900 bg-green-50/40">
                                {item.weightage_percent}
                              </td>
                              <td className="py-4 px-4 text-center text-sm font-semibold text-green-700 bg-green-50/40">
                                {calculateScore(
                                  aaAttributeRatings[item.sl_no] || "",
                                  item.weightage_percent,
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-semibold">
                        <td
                          colSpan={4}
                          className="py-3 px-4 text-right text-sm text-gray-900"
                        >
                          RO Total Score:
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-blue-700">
                          {calculateTotalScore(
                            roAttributeRatings,
                            personalAttributes,
                          )}
                        </td>
                        <td
                          colSpan={2}
                          className="py-3 px-4 text-right text-sm text-gray-900 bg-amber-100"
                        >
                          RVO Total Score:
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-amber-700 bg-amber-100">
                          {calculateTotalScore(
                            rvoAttributeRatings,
                            personalAttributes,
                          )}
                        </td>
                        {reviseAttributesMode && (
                          <>
                            <td
                              colSpan={2}
                              className="py-3 px-4 text-right text-sm text-gray-900 bg-green-100"
                            >
                              AA Total Score:
                            </td>
                            <td className="py-3 px-4 text-center text-sm text-green-700 bg-green-100">
                              {calculateTotalScore(
                                aaAttributeRatings,
                                personalAttributes,
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4 md:p-6">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Section III (B) - Functional Competencies
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review RO and RVO ratings first, then use revise mode to
                    provide AA ratings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setReviseCompetenciesMode(!reviseCompetenciesMode)
                  }
                  className={
                    reviseCompetenciesMode
                      ? "text-sm text-amber-700 hover:text-amber-900 underline"
                      : "flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700"
                  }
                >
                  {!reviseCompetenciesMode && (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {reviseCompetenciesMode
                    ? "Cancel Revision"
                    : "Revise Ratings"}
                </button>
              </div>

              <div className="p-4 md:p-6">
                <div className="overflow-x-auto">
                  <table
                    className={`w-full ${
                      reviseCompetenciesMode
                        ? "min-w-[1320px]"
                        : "min-w-[980px]"
                    }`}
                  >
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th
                          rowSpan={2}
                          className="text-center py-3 px-4 text-sm font-medium text-gray-700"
                        >
                          #
                        </th>
                        <th
                          rowSpan={2}
                          className="text-left py-3 px-4 text-sm font-medium text-gray-700"
                        >
                          Competency
                        </th>
                        <th
                          colSpan={3}
                          className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50"
                        >
                          RO Evaluation
                        </th>
                        <th
                          colSpan={3}
                          className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50"
                        >
                          RVO Evaluation
                        </th>
                        {reviseCompetenciesMode && (
                          <th
                            colSpan={3}
                            className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50"
                          >
                            AA Evaluation
                          </th>
                        )}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Rating (1-10)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Weightage (%)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 bg-blue-50">
                          Score
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Rating (1-10)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Weightage (%)
                        </th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-amber-800 bg-amber-50">
                          Score
                        </th>
                        {reviseCompetenciesMode && (
                          <>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Rating (1-10)
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Weightage (%)
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-green-800 bg-green-50">
                              Score
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {functionalCompetencies.map((item) => (
                        <tr
                          key={item.sl_no}
                          className="border-b border-gray-100"
                        >
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {item.sl_no}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">
                            {item.competency}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {roCompetencyRatings[item.sl_no]}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900">
                            {item.weightage_percent}
                          </td>
                          <td className="py-4 px-4 text-center text-sm font-semibold text-blue-600">
                            {calculateScore(
                              roCompetencyRatings[item.sl_no],
                              item.weightage_percent,
                            )}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900 bg-amber-50/40">
                            {rvoCompetencyRatings[item.sl_no]}
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-900 bg-amber-50/40">
                            {item.weightage_percent}
                          </td>
                          <td className="py-4 px-4 text-center text-sm font-semibold text-amber-700 bg-amber-50/40">
                            {calculateScore(
                              rvoCompetencyRatings[item.sl_no],
                              item.weightage_percent,
                            )}
                          </td>
                          {reviseCompetenciesMode && (
                            <>
                              <td className="py-4 px-4 text-center bg-green-50/40">
                                <select
                                  value={aaCompetencyRatings[item.sl_no] || ""}
                                  onChange={(e) =>
                                    updateAaCompetencyRating(
                                      item.sl_no,
                                      e.target.value,
                                    )
                                  }
                                  className="w-36 px-3 py-2 border border-green-300 rounded-lg bg-white text-sm"
                                >
                                  <option value="">Select</option>
                                  {Array.from({ length: 10 }, (_, index) => {
                                    const rating = String(index + 1);
                                    return (
                                      <option key={rating} value={rating}>
                                        {rating}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              <td className="py-4 px-4 text-center text-sm text-gray-900 bg-green-50/40">
                                {item.weightage_percent}
                              </td>
                              <td className="py-4 px-4 text-center text-sm font-semibold text-green-700 bg-green-50/40">
                                {calculateScore(
                                  aaCompetencyRatings[item.sl_no] || "",
                                  item.weightage_percent,
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      <tr className="bg-blue-50 font-semibold">
                        <td
                          colSpan={4}
                          className="py-3 px-4 text-right text-sm text-gray-900"
                        >
                          RO Total Score:
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-blue-700">
                          {calculateTotalScore(
                            roCompetencyRatings,
                            functionalCompetencies,
                          )}
                        </td>
                        <td
                          colSpan={2}
                          className="py-3 px-4 text-right text-sm text-gray-900 bg-amber-100"
                        >
                          RVO Total Score:
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-amber-700 bg-amber-100">
                          {calculateTotalScore(
                            rvoCompetencyRatings,
                            functionalCompetencies,
                          )}
                        </td>
                        {reviseCompetenciesMode && (
                          <>
                            <td
                              colSpan={2}
                              className="py-3 px-4 text-right text-sm text-gray-900 bg-green-100"
                            >
                              AA Total Score:
                            </td>
                            <td className="py-3 px-4 text-center text-sm text-green-700 bg-green-100">
                              {calculateTotalScore(
                                aaCompetencyRatings,
                                functionalCompetencies,
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4 md:p-6">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Summary Review
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review RO and RVO summaries first, then use revise mode to
                    provide AA summary.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviseSummaryMode(!reviseSummaryMode)}
                  className={
                    reviseSummaryMode
                      ? "text-sm text-amber-700 hover:text-amber-900 underline"
                      : "flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700"
                  }
                >
                  {!reviseSummaryMode && <RefreshCw className="w-4 h-4" />}
                  {reviseSummaryMode ? "Cancel Revision" : "Revise Summary"}
                </button>
              </div>
              <div className="p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {renderSectionCard(
                    "RO Review Summary",
                    "border-blue-200 bg-blue-50 text-blue-950",
                    roSummary,
                  )}
                  {renderSectionCard(
                    "RVO Review Summary",
                    "border-amber-200 bg-amber-50 text-amber-950",
                    rvoSummary,
                  )}
                </div>

                {reviseSummaryMode && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-4">
                    <h3 className="text-sm font-semibold text-green-900">
                      AA Revised Summary
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        KRA/KPI Validation Notes{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={aaKraKpiValidationNotes}
                        onChange={(e) =>
                          setAaKraKpiValidationNotes(e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Key Outcomes Delivered{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={aaKeyOutcomes}
                          onChange={(e) => setAaKeyOutcomes(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Strength Observed{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={aaStrengths}
                          onChange={(e) => setAaStrengths(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Improvement Area{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={aaAreasForImprovement}
                          onChange={(e) =>
                            setAaAreasForImprovement(e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Overall Assessment{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={aaOverallAssessment}
                          onChange={(e) =>
                            setAaOverallAssessment(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">
                  AA Final Review
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Finalize the decision after reviewing RO and RVO observations.
                </p>
              </div>
              <div className="p-4 md:p-6 space-y-4">
                {hasAaRevision && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Justification for Rating Revision{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AA Final Remarks <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={aaRemarks}
                    onChange={(e) => setAaRemarks(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recommendations
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={aaRecommendations}
                    onChange={(e) => setAaRecommendations(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 p-6">
              <div className="text-center">
                <p className="text-sm text-green-700 mb-2">Final Grade</p>
                <p className="text-4xl font-bold text-green-900 mb-2">
                  {finalGrade}
                </p>
                <p className="text-lg text-green-700">Score: {finalScore}/10</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Final Review Snapshot
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  Overall AA rating:{" "}
                  <span className="font-semibold text-gray-900">
                    {ratings.find((item) => item.key === "overall")?.aa}
                  </span>
                </p>
                <p>
                  Rating status:{" "}
                  <span className="font-semibold text-gray-900">
                    {hasAaRevision ? "Revised by AA" : "Concurred with RVO"}
                  </span>
                </p>
                <p>
                  Summary notes ready:{" "}
                  <span className="font-semibold text-gray-900">
                    {aaKraKpiValidationNotes &&
                    aaKeyOutcomes &&
                    aaStrengths &&
                    aaAreasForImprovement &&
                    aaOverallAssessment
                      ? "Yes"
                      : "Pending"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="">
      <div
        className="fixed top-[20px] sm:top-[60px] left-0 lg:left-64 right-0 z-10 bg-white border-b border-gray-200 transition-all duration-300"
        style={{
          left:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? sidebarCollapsed
                ? "5rem"
                : "16rem"
              : "0",
        }}
      >
        <div className="px-4 lg:px-6 py-2 sm:py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/review/evaluations?tab=pending"
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Approvals"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="leading-tight">
                <h1 className="text-sm sm:text-lg font-bold text-gray-900">
                  AA Final Approval
                </h1>
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-tight">
                  Employee ID: {employeeId}
                </p>
              </div>
            </div>
            <button
              onClick={handleSaveDraft}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-sm transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              SAVE DRAFT
            </button>
          </div>
        </div>
      </div>

      <div
        className="hidden md:block fixed top-[109px] sm:top-[125px] left-0 lg:left-64 right-0 z-[9] bg-white border-b border-gray-200 shadow-sm transition-all duration-300"
        style={{
          left:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? sidebarCollapsed
                ? "5rem"
                : "16rem"
              : "0",
        }}
      >
        <div className="px-6 lg:px-8 py-2.5">
          <div className="flex items-start">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="flex-1 flex flex-col items-center relative"
              >
                {index < steps.length - 1 && (
                  <div
                    className="absolute top-3 left-1/2 right-0 h-0.5 -translate-y-1/2 z-0"
                    style={{ width: "calc(100% - 0.75rem)" }}
                  >
                    <div
                      className={`h-full ${
                        completedSteps.includes(step.number)
                          ? "bg-green-600"
                          : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}

                <div className="relative z-10">
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={
                      !completedSteps.includes(step.number) &&
                      step.number !== currentStep &&
                      step.number !== currentStep + 1
                    }
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      currentStep === step.number
                        ? "bg-blue-600 text-white"
                        : completedSteps.includes(step.number)
                          ? "bg-green-600 text-white cursor-pointer hover:bg-green-700"
                          : "bg-gray-200 text-gray-500"
                    } ${
                      !completedSteps.includes(step.number) &&
                      step.number !== currentStep &&
                      step.number !== currentStep + 1
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {completedSteps.includes(step.number) && (
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <span
                  className={`mt-1.5 text-xs font-medium whitespace-nowrap ${
                    currentStep === step.number
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[72px] sm:h-[109px] md:h-[130px]"></div>

      <div className="md:hidden">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">
              Step {currentStep} of 6
            </span>
            <span className="text-sm text-gray-600">
              {steps[currentStep - 1].fullTitle}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 pb-24 md:pb-20">{renderStepContent()}</div>

      <div
        className="hidden md:flex fixed bottom-0 left-0 lg:left-64 right-0 justify-between items-center gap-3 bg-white border-t border-gray-200 p-4 z-10 transition-all duration-300"
        style={{
          left:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? sidebarCollapsed
                ? "5rem"
                : "16rem"
              : "0",
        }}
      >
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-sm border border-gray-300 rounded-lg ${
            currentStep === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-50"
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {currentStep === 6 ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                Finalize & Lock
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg font-medium ${
              currentStep === 1
                ? "opacity-50 cursor-not-allowed text-gray-400"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Prev
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Save className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {currentStep === 6 ? (
              <>
                <Lock className="w-5 h-5" />
                Finalize
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm font-medium">Action completed successfully!</p>
        </div>
      )}
    </div>
  );
};

export default AAApproval;
