export default function MedicalDisclaimer({ className = "" }) {
  return (
    <aside className={`alert alert-info ${className}`} role="note" aria-label="Healthcare information disclaimer">
      AI-generated health information and assessment results may be incomplete or inaccurate; possible conditions are not confirmed diagnoses. Consult a qualified healthcare professional for advice. For an emergency, seek appropriate emergency medical assistance.
    </aside>
  );
}
