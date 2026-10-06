import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import About from "./components/About";
import Department from "./components/Department";
import DiseasePredictionForm from "./components/DepartmentForms/DiseasePredictionForm.jsx";
import DiseaseStep2 from "./components/DepartmentForms/DiseaseStep2.jsx";
import FamilyMedicine from "./components/DepartmentButtons/FamilyMedicine.jsx";
import FemaleHealth from "./components/DepartmentButtons/FemaleHealth.jsx";
import EyeVisionService from "./components/DepartmentButtons/EyeVisionService.jsx";
import HeartScience from "./components/DepartmentButtons/HeartScience.jsx";
import SkinHealthDepartment from "./components/DepartmentButtons/SkinHealthDepartment.jsx";
import ChildHealthServices from "./components/DepartmentButtons/ChildHealthServices.jsx";
import Login from "./components/LoginSignIn/Login.jsx";
import Signup from "./components/LoginSignIn/Signup.jsx";
import UserButton from "./components/UserButton";
import SymptomForm from "./components/form/form";
import Chatbot from "./components/ChatBot/ChatBot";
// import Pages from "./components/Pages.jsx";
import Documentation from "./components/NavbarComponents/Documentation .jsx";
import Blog from "./components/Blog.jsx";
import Contact from "./components/contact.jsx";
import BookAppointment from "./components/BookAppointment/BookAppointment.jsx";
import DoctorDashboard from "./components/DoctorDashboard.jsx";
import PatientHealthHistory from "./components/PatientHealthHistory.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AdminAuditLogs from "./components/AdminAuditLogs.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import TermsOfService from "./components/TermsOfService.jsx";
import HealthConsentGate from "./components/HealthConsentGate.jsx";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/department" element={<Department />} />
          <Route path="/family-medicine" element={<FamilyMedicine />} />
          <Route path="/female-health" element={<FemaleHealth />} />
          <Route path="EyeVisionService" element={<EyeVisionService />} />
          <Route path="HeartScience" element={<HeartScience />} />
          <Route path="SkinHealthDepartment" element={<SkinHealthDepartment/>}/>
          <Route path="ChildHealthServices" element={<ChildHealthServices/>}/>
          <Route path="/DiseasePredictionForm" element={<ProtectedRoute roles={["PATIENT"]}><HealthConsentGate><DiseasePredictionForm /></HealthConsentGate></ProtectedRoute>} />
          <Route path="/DiseasePredictionForm/DiseaseStep2" element={<ProtectedRoute roles={["PATIENT"]}><HealthConsentGate><DiseaseStep2/></HealthConsentGate></ProtectedRoute>}/>
          {/* <Route path="/Pages" element={<Pages />} /> */}
          <Route path="documentation" element={<Documentation />} />
          <Route path="/Blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/BookAppointment" element={<ProtectedRoute roles={["PATIENT"]}><HealthConsentGate><BookAppointment /></HealthConsentGate></ProtectedRoute>} />
          <Route path="/doctor-dashboard" element={<ProtectedRoute roles={["DOCTOR"]}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute roles={["ADMIN"]}><AdminAuditLogs /></ProtectedRoute>} />
          <Route path="/health-history" element={<ProtectedRoute roles={["PATIENT"]}><PatientHealthHistory /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute roles={["PATIENT"]}><UserButton /></ProtectedRoute>} />
          <Route path="/form" element={<ProtectedRoute roles={["PATIENT"]}><HealthConsentGate><SymptomForm /></HealthConsentGate></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute roles={["PATIENT"]}><HealthConsentGate><Chatbot /></HealthConsentGate></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
