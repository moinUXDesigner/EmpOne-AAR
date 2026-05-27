import { createBrowserRouter } from "react-router";
import Root from "./layouts/Root";
import Dashboard from "./pages/Dashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import KRAEntry from "./pages/employee/KRAEntry";
import KRAEntryPage from "./pages/employee/KRAEntryPage";
import ViewKRAs from "./pages/employee/ViewKRAs";
import MidYearReview from "./pages/employee/MidYearReview";
import FinalScore from "./pages/employee/FinalScore";
import Representation from "./pages/employee/Representation";
import TrainingDevelopment from "./pages/employee/TrainingDevelopment";
import PendingApprovals from "./pages/ro/PendingApprovals";
import RecentlyCompleted from "./pages/ro/RecentlyCompleted";
import Evaluations from "./pages/ro/Evaluations";
import Evaluation from "./pages/ro/Evaluation";
import RVOReview from "./pages/rvo/RVOReview";
import AAApproval from "./pages/aa/AAApproval";
import POQueue from "./pages/po/POQueue";
import POReview from "./pages/po/POReview";
import PORepresentationReview from "./pages/po/PORepresentationReview";
import AppealQueue from "./pages/ac/AppealQueue";
import AppealDecision from "./pages/ac/AppealDecision";
import Analytics from "./pages/hrd/Analytics";
import Administration from "./pages/hrd/Administration";
import Reports from "./pages/Reports";
import Activity from "./pages/Activity";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter(
  [
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/",
      Component: Root,
      children: [
        { index: true, Component: Dashboard },
        { path: "profile", Component: Profile },
        { path: "officer-dashboard", Component: OfficerDashboard },

        // Employee Routes
        { path: "my-pms/kra-entry", Component: KRAEntryPage },
        { path: "my-pms/kra-entry/add", Component: KRAEntry },
        { path: "my-pms/view-kras", Component: ViewKRAs },
        { path: "my-pms/mid-year-review", Component: MidYearReview },
        { path: "my-pms/final-score", Component: FinalScore },
        { path: "my-pms/representation", Component: Representation },
        { path: "my-pms/training", Component: TrainingDevelopment },

        // RO Routes
        { path: "review/evaluations", Component: Evaluations },
        { path: "review/pending-approvals", Component: PendingApprovals },
        { path: "review/recently-completed", Component: RecentlyCompleted },
        { path: "review/evaluation/:employeeId", Component: Evaluation },

        // RVO Routes
        { path: "rvo/review/:employeeId", Component: RVOReview },

        // AA Routes
        { path: "aa/approval/:employeeId", Component: AAApproval },

        // PO (Personnel Officer / APAR Cell) Routes
        { path: "po/queue", Component: POQueue },
        { path: "po/review/:employeeId", Component: POReview },
        { path: "po/representation-review/:caseId", Component: PORepresentationReview },

        // AC (Appeal Committee) Routes
        { path: "ac/queue", Component: AppealQueue },
        { path: "ac/decision/:caseId", Component: AppealDecision },

        // HRD Routes
        { path: "analytics", Component: Analytics },
        { path: "administration", Component: Administration },

        // Reports
        { path: "reports", Component: Reports },

        { path: "activity", Component: Activity },

        { path: "*", Component: NotFound },
      ],
    },
  ],
  { basename: "/EmpOne-AAR" }
);
