export default function MedicalDisclaimer({ className = "" }) {
  return (
    <aside className={`alert alert-info ${className}`} role="note" aria-label="Healthcare information disclaimer">
      AI-generated results are health assessments and possible conditions, not confirmed medical diagnoses. Consult a qualified healthcare professional for advice. For an emergency, seek appropriate emergency medical assistance.
    </aside>
  );
}
