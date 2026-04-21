import { createBrowserRouter, Navigate } from "react-router";
import { Root } from "./components/layout/Root";
import { Login } from "./components/pages/Login";
import { Dashboard } from "./components/pages/Dashboard";
import { Members } from "./components/pages/Members";
import { Attendance } from "./components/pages/Attendance";
import { Billing } from "./components/pages/Billing";
import { Plans } from "./components/pages/Plans";
import { Leads } from "./components/pages/Leads";
import { Expenses } from "./components/pages/Expenses";
import { Reports } from "./components/pages/Reports";
import { Settings } from "./components/pages/Settings";
import { MobileMenu } from "./components/pages/MobileMenu";
import { PublicMemberRegistration } from "./components/pages/PublicMemberRegistration";
import { FormBuilder } from "./components/pages/FormBuilder";

export const router = createBrowserRouter([
  {
    path: "/register-member",
    Component: PublicMemberRegistration,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "members", Component: Members },
      { path: "attendance", Component: Attendance },
      { path: "billing", Component: Billing },
      { path: "plans", Component: Plans },
      { path: "leads", Component: Leads },
      { path: "expenses", Component: Expenses },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
      { path: "form-builder", Component: FormBuilder },
      { path: "menu", Component: MobileMenu },
    ],
  },
  {
    path: "*",
    Component: () => <Navigate to="/" replace />,
  }
]);
