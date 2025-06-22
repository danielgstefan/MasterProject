// GDS layouts
import Dashboard from "layouts/dashboard";
import Tuning from "layouts/tuning";
import Forum from "layouts/forum";
import Chat from "layouts/chat";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import UserProfile from "layouts/user-profile";
import TuningRequests from "layouts/tuning-requests";
import Users from "layouts/users";

// GDS icons
import { IoHome } from "react-icons/io5";
import { BsFillPersonFill, BsPeopleFill } from "react-icons/bs";
import { IoBuild } from "react-icons/io5";
import { IoChatbubbles } from "react-icons/io5";
import { IoCarSport } from "react-icons/io5";
import { IoRocketSharp } from "react-icons/io5";
import { IoIosDocument } from "react-icons/io";
import AuthService from "services/AuthService";

const routes = [
  {
    type: "collapse",
    name: "Home",
    key: "home",
    route: "/dashboard",
    icon: <IoHome size="15px" color="inherit" />,
    component: Dashboard,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tuning Services",
    key: "tuning",
    route: "/tuning",
    icon: <IoCarSport size="15px" color="inherit" />,
    component: Tuning,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Forum",
    key: "forum",
    route: "/forum",
    icon: <IoChatbubbles size="15px" color="inherit" />,
    component: Forum,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Live Chat",
    key: "chat",
    route: "/chat",
    icon: <IoChatbubbles size="15px" color="inherit" />,
    component: Chat,
    noCollapse: true,
  },
  { type: "title", title: "Account", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    component: Profile,
    noCollapse: true,
  },
  // Admin section - only visible to admins
  {
    type: "title",
    title: "Admin Access",
    key: "admin-pages",
    isProtected: true,
    roleRequired: "ROLE_ADMIN"
  },
  {
    type: "collapse",
    name: "Tuning Requests",
    key: "tuning-requests",
    route: "/tuning-requests",
    icon: <IoBuild size="15px" color="inherit" />,
    component: TuningRequests,
    noCollapse: true,
    isProtected: true,
    roleRequired: "ROLE_ADMIN"
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    route: "/users",
    icon: <BsPeopleFill size="15px" color="inherit" />,
    component: Users,
    noCollapse: true,
    isProtected: true,
    roleRequired: "ROLE_ADMIN"
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <IoIosDocument size="15px" color="inherit" />,
    component: SignIn,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <IoRocketSharp size="15px" color="inherit" />,
    component: SignUp,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "User Profile",
    key: "user-profile",
    route: "/user/:username",
    icon: <BsFillPersonFill size="15px" color="inherit" />,
    component: UserProfile,
    noCollapse: true,
    noDisplay: true, // This will hide it from the sidenav
  },
];

export default routes;
