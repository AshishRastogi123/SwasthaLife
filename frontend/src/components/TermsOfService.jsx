import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MedicalDisclaimer from "./MedicalDisclaimer";

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="container py-5 mt-5" style={{ maxWidth: "900px" }}>
        <h1 className="text-primary">Terms of Service</h1>
        <p className="text-muted">These general terms describe use of the SwasthaLife prototype.</p>

        <h2 className="h4 mt-4">What the service provides</h2>
        <p>SwasthaLife offers informational health-assessment, chatbot, health-history, appointment, and emergency-request features. Features may be incomplete, unavailable, or changed as the prototype develops.</p>

        <h2 className="h4 mt-4">Not medical care</h2>
        <MedicalDisclaimer />
        <p>AI tools can be inaccurate or incomplete and are not a substitute for examination, diagnosis, or treatment from a qualified healthcare professional. Do not delay professional care based on an application result. In an emergency, contact appropriate emergency medical services; submitting a request in this prototype does not itself contact emergency services.</p>

        <h2 className="h4 mt-4">Your use of the service</h2>
        <p>Provide information you are comfortable sharing and use features only for their intended informational purpose. Keep your account sign-in information private. Do not use the prototype as the sole basis for medical decisions or to provide emergency response.</p>

        <h2 className="h4 mt-4">AI and third-party services</h2>
        <p>Some features rely on AI-generated responses or assessments. Those outputs can be wrong. Chatbot messages are sent to Google's Gemini service to generate responses; see the <Link to="/privacy">Privacy Policy</Link> for more information about information handling.</p>

        <h2 className="h4 mt-4">Availability and changes</h2>
        <p>The prototype is provided for evaluation and informational use. No guarantee is made that a feature will always be available, accurate, or suitable for a particular purpose. These terms may be updated as the application changes.</p>
        <p>Questions can be sent through the <Link to="/contact">Contact page</Link>.</p>
        <p><Link to="/privacy">Privacy Policy</Link></p>
      </main>
      <Footer />
    </>
  );
}
