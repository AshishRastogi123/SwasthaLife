# SwasthaLife

SwasthaLife is a cutting-edge healthcare web application that leverages artificial intelligence to predict and prevent diseases before they become critical. Our platform makes healthcare accessible, affordable, and proactive for everyone, empowering users to take control of their health through innovative technology and compassionate care.

## 🎥 Demo

![Demo GIF](frontend/src/components/Images/vision.gif)

## 🌟 Features

- **AI-Powered Disease Prediction**: Utilize advanced AI algorithms to analyze health data and predict potential health issues.
- **Intelligent Chatbot**: Get instant health advice and support through our AI-powered chatbot.
- **Department Information**: Explore various medical departments and their services.
- **Appointment Booking**: Easily schedule appointments with healthcare professionals.
- **Symptom Checker**: Input symptoms to receive personalized health recommendations.
- **User Authentication**: Secure login and signup functionality for personalized experiences.
- **Emergency Form**: Quick access to emergency healthcare services.
- **Blog & Resources**: Stay informed with health-related articles and resources.
- **Contact Support**: Direct communication with our healthcare team.
- **Responsive Design**: Optimized for all devices with a modern, user-friendly interface.

## � Project Pitch Overview

### Introduction
SwasthaLife is an AI-powered healthcare platform that helps people identify diseases early and get the right guidance instantly.

### Problem Statement
Millions of people do not know which disease they are suffering from. Many rely on online searches, self-medication, or delay visiting doctors, which leads to serious health risks—especially for rural and middle-class communities.

### Solution
SwasthaLife uses artificial intelligence to provide three intelligent ways for users to access health guidance:
- **Users who know the disease name**
- **Users who know only their symptoms**
- **Users who describe their condition in natural language**

Based on the input, the system predicts possible diseases and provides instant, actionable guidance.

### Technology & Innovation
- Machine Learning models trained on medical symptom datasets.
- Modern, API-driven backend designed to scale on cloud infrastructure.
- Future integration plans: Microsoft Azure AI and cloud services to improve prediction accuracy and scalability.

### Impact
SwasthaLife aims to support early disease detection, reduce unnecessary hospital visits, and improve access to basic healthcare guidance—particularly for underserved and remote populations.

### Vision
SwasthaLife is currently in the launch stage, with a vision to scale across India as a trusted AI-powered health companion, improving healthcare accessibility for millions.

## �🛠️ Tech Stack

- **Frontend**: React 19.1.1, Vite 7.1.7
- **Styling**: Bootstrap 5.3.8, Framer Motion 12.23.24
- **Routing**: React Router DOM 7.9.4
- **AI Integration**: Medical RAG chatbot service (Pinecone retrieval and Google Gemini)
- **Icons**: Bootstrap Icons 1.13.1
- **Build Tools**: ESLint 9.36.0, Vite Plugins
- **Backend**: Node.js, Express 5.2.1, MongoDB (Mongoose 9.0.2)
- **Authentication**: JWT (jsonwebtoken 9.0.3), bcryptjs 3.0.3
- **Other Backend Tools**: Morgan 1.10.1, CORS 2.8.5, Cookie Parser 1.4.7

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/swasthalife.git
   cd swasthalife
   ```

2. **Install frontend and backend dependencies**:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

3. **Set up backend environment variables**:
   Create `backend/.env` from `.env.example` while in the `backend` directory. Configure the backend secrets and the medical chatbot service URL and service token there. Keep provider credentials on the server; do not put them in `VITE_` variables or frontend code.
   ```
   MEDICAL_CHATBOT_URL=http://127.0.0.1:8080
   MEDICAL_CHATBOT_TOKEN=your_api_service_token
   ```

4. **Start the backend and frontend in separate terminals**:
   ```bash
   cd backend
   node app.js
   ```
   ```bash
   cd frontend
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview the production build**:
   ```bash
   npm run preview
   ```

## 📖 Usage

1. Navigate to the home page to explore the main features.
2. Sign up or log in to access personalized health recommendations.
3. Use the symptom checker to input your symptoms and receive AI-powered insights.
4. Chat with our AI chatbot for instant health advice.
5. Book appointments with healthcare professionals through the appointment system.
6. Explore different medical departments to learn about available services.

## User profiles and prediction autofill

Patient accounts can save personal details, physical measurements, and medical history in their account profile. Date of birth is stored once; age is calculated when the profile is read. Existing users remain valid with an incomplete profile, and missing values are returned as empty values rather than fabricated measurements.

### Profile API

These endpoints require the existing authenticated session (HTTP-only JWT cookie or bearer token). Updates use the application's existing CSRF protection for cookie-authenticated requests. Each route operates only on the current user's account; profile responses never include the password hash.

| Method and path | Purpose |
| --- | --- |
| `GET /api/users/profile` | Read the current user's personal, health, and medical-history details and completion percentage. |
| `PUT /api/users/profile` | Update `name`, `email`, `phone`, `dateOfBirth` (`YYYY-MM-DD`), and `gender`. |
| `PUT /api/users/health-profile` | Update `heightCm`, `weightKg`, `bloodGroup`, `bloodPressure` (`systolic/diastolic`), `heartRate`, `bodyTemperature` (°C), `smokingStatus`, `alcoholConsumption`, and `physicalActivityLevel`. |
| `PUT /api/users/medical-history` | Update `existingDiseases`, `allergies`, `currentMedications`, `previousSurgeries`, and `familyMedicalHistory` as arrays of strings. |

Example health-profile update:

```json
{
  "heightCm": 170,
  "weightKg": 65,
  "bloodPressure": "120/80",
  "heartRate": 72,
  "smokingStatus": "NEVER",
  "alcoholConsumption": "OCCASIONAL",
  "physicalActivityLevel": "MODERATE"
}
```

The existing authentication system requires an email address as the sign-in identifier, so registration email remains required even though profile health/contact details are optional. Changing that would require a separate login-identity design and is intentionally not part of this backward-compatible profile upgrade.

### Prediction feature mappings

The profile is fetched through a shared frontend hook when a prediction form opens. Matching values are labelled as profile-derived and remain editable in the form; editing a prediction does not update the saved profile. Profile-derived data is only submitted to an assessment when the user explicitly submits that form.

- Heart disease model: age from date of birth; model sex code from Male/Female only; systolic value from a valid saved blood-pressure reading for resting blood pressure. Other model features (cholesterol, fasting glucose, ECG, exercise measurements, and coded clinical results) remain blank for user entry.
- Symptom-vector model: profile demographics and matching values are used only in the saved assessment record. The ML input is the selected symptom vector; profile demographics are not converted into symptoms or model inputs.
- Disease-specific assessment wizard: maps matching personal, contact, measurement, and lifestyle values into its editable first step. Its disease-specific questions remain user-entered.
- There are no separate kidney, liver, or diabetes model endpoints in the current application. These are not treated as model inputs or auto-filled from unrelated fields.

Prediction routes retain their existing patient-role and current-health-consent requirements.

## Four-step registration and doctor verification

The `/Signup` page is a four-step registration wizard. Patient registrations optionally save physical and medical-history details. Doctor registrations require a department, license number, and certificate; they create an account with `doctorVerification.status: PENDING`. Uploading a document never grants doctor privileges. Doctor-only routes and listings require an explicit administrator approval.

The existing User authentication fields and roles are retained. User profile, health, medical-history, professional-profile, and verification state are nested subdocuments; the license number and department remain in the existing Doctor model to avoid duplicating them. The verification subdocument stores the private storage path and file metadata, with the path excluded from normal queries and API responses.

Doctor certificate endpoints:

| Method and path | Access | Purpose |
| --- | --- | --- |
| `POST /api/auth/signup` | Public | Create a patient using JSON, or create a pending doctor using `multipart/form-data` fields `registrationData` (JSON) and `verificationDocument` (file). |
| `GET /api/doctors/me/verification-document` | Authenticated doctor | Return a short-lived signed URL for the caller's own document. |
| `PUT /api/doctors/me/verification-document` | Authenticated doctor | Upload or replace a PDF/JPG/JPEG/PNG document (maximum 5 MB); the status returns to `PENDING`. |
| `GET /api/admin/doctor-verifications?status=PENDING` | Admin | List applications and issue short-lived signed URLs for private document review. |
| `PATCH /api/admin/doctor-verifications/:userId` | Admin | Approve or reject a pending application with `{ "action": "approve"|"reject", "reviewNote": "..." }`. |

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the backend environment, and optionally set `SUPABASE_DOCTOR_VERIFICATION_BUCKET` (defaults to `doctor-verification-documents`). Create that bucket as **private** in Supabase Storage. Keep the service-role key exclusively on the backend; never use a `VITE_` variable for it. The application validates file extension, MIME type, size, and file signature before upload and serves documents using signed URLs that expire after five minutes. Production deployment must provision the private bucket before doctor registration is enabled.

Existing doctor accounts without an approved verification status are intentionally treated as unverified. They can sign in to submit a certificate, but doctor-only actions remain blocked until an administrator reviews and approves it. No user records are deleted or rewritten during this transition.

### Existing-user migration

No database migration script is required. The User schema adds optional nested `profile`, `healthProfile`, `medicalHistory`, `professionalProfile`, and `doctorVerification` subdocuments; existing documents continue to authenticate and receive empty profile values until users choose to add them. Mongoose timestamps continue to be maintained. Existing doctor accounts must complete verification before using doctor-only APIs. No records are rewritten or removed.

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Our Mission

At SwasthaLife, our mission is to revolutionize healthcare by leveraging cutting-edge AI technology to predict and prevent diseases before they become critical. We believe in making healthcare accessible, affordable, and proactive for everyone, regardless of their location or background.

## 💡 Core Values

- **Compassion**: We care deeply about every individual and their health journey.
- **Innovation**: We embrace cutting-edge technology to improve healthcare outcomes.
- **Community**: We believe in the power of community for better health and wellness.
- **Trust**: We build trust through transparency, reliability, and ethical practices.

## 📞 Contact

For questions, support, or partnerships, please reach out to us at:
- Email: info@swasthalife.com
- Website: [www.swasthalife.com](https://www.swasthalife.com)

---

*Founded in 2023, SwasthaLife is committed to transforming healthcare through technology and compassion.*
