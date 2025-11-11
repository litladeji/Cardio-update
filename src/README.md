# CardioGuard - AI-Powered Post-Discharge Heart Patient Risk Management System

## 🏥 Overview

CardioGuard is a comprehensive dual-sided healthcare platform that uses predictive AI to identify high-risk heart patients post-discharge and provides seamless coordination between patients, clinicians, and administrators. The system features daily AI-guided symptom check-ins, real-time risk scoring, gamified patient engagement, and executive-level analytics.

### Key Features

**For Patients:**
- 🏥 Hospital-based onboarding with auto-generated credentials
- 📱 Daily AI-guided symptom check-ins (2 minutes)
- 🎯 AI alert classification (Green/Yellow/Red)
- 🔥 Gamified recovery streaks and health tips
- 👨‍👩‍👧 Care Circle - family/caregiver notifications
- 💬 Secure messaging with care team
- 📊 Progress tracking with vital trend visualization

**For Clinicians:**
- 📋 Prioritized patient dashboard by readmission risk
- 🎯 AI risk scores with circular progress gauges
- 📈 Sparkline vital trend charts
- 👤 Detailed patient profiles with risk factor analysis
- ➕ Add new patients with auto-credential generation
- 🟢 Real-time patient login status tracking
- 🔍 Advanced filtering and search capabilities

**For Administrators:**
- 📊 Comprehensive analytics dashboard
- 💰 ROI and cost savings calculations
- 📉 Readmission reduction metrics
- 📈 Executive-level KPI reporting
- 🏥 Multi-hospital performance tracking
- 📅 Trend analysis and forecasting

**For Data Intake Teams:**
- 📥 EHR integration monitoring (Epic/Cerner FHIR R4)
- 🔄 Real-time sync status tracking
- ⚠️ Error handling and notification
- 📊 Data quality metrics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account with project set up
- Basic understanding of React and TypeScript

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure Supabase:**
   - Update `/utils/supabase/info.tsx` with your Supabase credentials:
     ```typescript
     export const projectId = 'your-project-id';
     export const publicAnonKey = 'your-anon-key';
     ```

3. **Deploy Supabase functions:**
   - The backend Edge Functions are located in `/supabase/functions/server/`
   - Deploy using Supabase CLI or dashboard

4. **Run the application:**
```bash
npm run dev
```

### First Time Setup

1. **Access the application** at `http://localhost:5173` (or your configured port)

2. **Landing page roles:**
   - **Patient**: Requires hospital selection and credentials
   - **Clinician**: Direct login with clinician credentials
   - **Administrator**: Direct login with admin credentials
   - **Data Intake**: Access data integration dashboard

## 📚 Documentation Index

### Quick Start Guides
- **[Login Quick Start](LOGIN_QUICK_START.md)** - How to access different roles
- **[Patient Creation Quick Start](PATIENT_CREATION_QUICK_START.md)** - Adding new patients to the system
- **[Patient Onboarding Workflow](PATIENT_ONBOARDING_WORKFLOW.md)** - Complete patient enrollment process

### System Architecture
- **[System Architecture](SYSTEM_ARCHITECTURE.md)** - High-level technical overview
- **[Current Navigation Structure](CURRENT_NAVIGATION_STRUCTURE.md)** - Application routing and flow
- **[Login System](LOGIN_SYSTEM.md)** - Authentication implementation details

### Feature Documentation
- **[Patient & Clinician Portals](PATIENT_CLINICIAN_PORTALS.md)** - Detailed portal features
- **[Analytics Dashboard](ANALYTICS_ADMIN_ONLY.md)** - Administrator analytics guide
- **[Data Intake System](DATA_INTAKE_README.md)** - EHR integration documentation

### Implementation Notes
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Recent updates and features
- **[Role Switching Removed](ROLE_SWITCHING_REMOVED.md)** - Design decision rationale
- **[Navigation Bar Fixes](NAV_BAR_FIXES.md)** - UI/UX improvements

## 🏗️ System Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS v4.0 for styling
- Recharts for data visualization
- Lucide React for icons
- Motion (Framer Motion) for animations
- Radix UI for accessible components

**Backend:**
- Supabase Edge Functions (Deno runtime)
- PostgreSQL database
- Real-time subscriptions
- Row-level security

**Integrations:**
- Epic/Cerner FHIR R4 API
- SMS notification system (Twilio-compatible)
- Email notifications

### Key Components

```
/components
├── patient/              # Patient-facing components
│   ├── PatientPortal.tsx       # Main patient dashboard
│   ├── PatientHome.tsx         # Home screen with check-in
│   ├── DailyCheckIn.tsx        # AI-guided symptom assessment
│   ├── ProgressTracker.tsx     # Vital trends and recovery metrics
│   ├── CareCircle.tsx          # Family/caregiver management
│   └── PatientMessaging.tsx    # Care team communication
│
├── PatientDashboard.tsx  # Clinician patient list
├── PatientDetailView.tsx # Individual patient details
├── AddPatientForm.tsx    # New patient enrollment
├── AnalyticsDashboard.tsx # Administrator analytics
├── DataIntakeDashboard.tsx # EHR integration monitoring
└── ui/                   # Reusable UI components
```

### Backend Endpoints

Located in `/supabase/functions/server/index.tsx`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/hospitals` | GET | List available hospitals |
| `/patients` | GET | Retrieve all patients (clinician view) |
| `/patients/:id` | GET | Get patient details |
| `/patients/create` | POST | Create new patient with credentials |
| `/patients/login-status` | GET | Real-time patient login tracking |
| `/patient-dashboard/:id` | GET | Patient home screen data |
| `/check-in/submit` | POST | Submit daily symptom check-in |
| `/analytics` | GET | Administrator analytics data |

## 🔐 Authentication & Authorization

### Role-Based Access Control (RBAC)

**Three distinct user types:**

1. **Patient**
   - Hospital selection required
   - Credentials auto-generated by clinician
   - Access to: Home, Progress, Care Circle, Messages
   - Cannot access other roles

2. **Clinician**
   - Direct login with credentials
   - Access to: Patient Dashboard, Add Patient, Patient Details
   - Real-time patient monitoring

3. **Administrator**
   - Direct login with credentials
   - Access to: Analytics Dashboard, System Reports
   - ROI and performance metrics

4. **Data Intake**
   - Special access for integration monitoring
   - View EHR sync status and errors

### Login Flows

**Patient Login:**
```
Landing Page → Select Hospital → Enter Credentials → Patient Portal
```

**Clinician/Admin Login:**
```
Landing Page → Select Role → Enter Credentials → Dashboard
```

**Session Management:**
- Persistent login state stored in React state
- No JWT implementation (simplified for prototype)
- Session data includes: role, userId, hospitalId (for patients)

## 🎨 UI/UX Design Principles

### Color Coding System

**Risk Levels:**
- 🟢 **Green (Low Risk)**: Stable, on track
- 🟡 **Yellow (Medium Risk)**: Requires monitoring
- 🟠 **Orange (High Risk)**: Elevated concern
- 🔴 **Red (Critical Risk)**: Immediate action needed

**Brand Colors:**
- Primary: Blue-Indigo gradient (`from-blue-600 to-indigo-600`)
- Accent: Pink-Red for heart iconography (`from-red-500 to-pink-600`)
- Success: Green (`from-green-600 to-emerald-600`)
- Warning: Yellow-Amber (`from-yellow-500 to-amber-500`)

### Typography

- **Headings**: Blue-indigo gradient text for consistency
- **Body**: Gray-600 for readable content
- **Emphasis**: Gradient backgrounds for important metrics
- No custom font sizes/weights unless specified (uses `globals.css` defaults)

### Spacing & Layout

- Consistent padding: `p-7` to `p-10` for card content
- Gap spacing: `gap-5` to `gap-8` for component separation
- Responsive: Mobile-first with sm/md/lg breakpoints
- Max width containers: `max-w-4xl` (patient portal), `max-w-7xl` (dashboards)

## 🤖 AI Classification Engine

### Mock AI Implementation

The system includes a **mock AI classifier** for demonstration purposes. In production, this would integrate with:
- Machine learning models (TensorFlow, PyTorch)
- Cloud AI services (AWS SageMaker, Google AI Platform)
- Clinical decision support systems

### Alert Classification Logic

**Input Symptoms:**
- Shortness of breath (scale 1-10)
- Chest pain (scale 1-10)
- Fatigue level (scale 1-10)
- Swelling presence (yes/no)
- Weight gain (lbs in last 24 hours)

**Output:**
```typescript
{
  alertLevel: 'green' | 'yellow' | 'red',
  riskScore: number,
  recommendations: string[],
  requiresFollowUp: boolean
}
```

**Classification Rules (Mock):**
- **Red Alert**: Chest pain > 7, Shortness of breath > 8, Weight gain > 3 lbs
- **Yellow Alert**: Any symptom > 5, Weight gain > 2 lbs
- **Green Alert**: All symptoms mild or absent

## 📊 Data Models

### Patient Record

```typescript
interface Patient {
  id: string;
  name: string;
  age: number;
  hospitalId: string;
  diagnosis: string;
  dischargeDate: string;
  riskScore: number;              // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
  credentials: {
    username: string;
    temporaryPassword: string;
  };
  vitalSigns?: {
    bloodPressure: string;
    heartRate: number;
    weight: number;
  };
  lastCheckIn?: string;
  nextAppointment?: string;
  recoveryStreak: number;
  aiAlertLevel?: 'green' | 'yellow' | 'red';
}
```

### Check-In Submission

```typescript
interface CheckInSubmission {
  patientId: string;
  timestamp: string;
  symptoms: {
    shortnessOfBreath: number;    // 1-10
    chestPain: number;             // 1-10
    fatigue: number;               // 1-10
    swelling: boolean;
    weightGain: number;            // lbs
  };
  notes?: string;
}
```

### Hospital

```typescript
interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  logoUrl?: string;
  patientsEnrolled: number;
}
```

## 🔄 Patient Workflow

### 1. Patient Onboarding (Clinician-Initiated)

```
Clinician → Add Patient Form → Submit
  ↓
System generates credentials
  ↓
Credentials displayed (copy/download)
  ↓
Credentials sent to patient (email/SMS)
  ↓
Patient receives welcome message
```

### 2. Patient First Login

```
Patient → Landing Page → Select Hospital
  ↓
Enter generated credentials
  ↓
PatientPortal loads
  ↓
Welcome screen with recovery streak
```

### 3. Daily Check-In Flow

```
Patient Portal → Home Tab → "Start Check-in" button
  ↓
DailyCheckIn component (7 questions)
  ↓
AI processes symptoms
  ↓
Alert level assigned (Green/Yellow/Red)
  ↓
Results shown to patient
  ↓
Care team notified if Yellow/Red
  ↓
Recovery streak incremented
```

### 4. Clinician Monitoring

```
Clinician Dashboard → View prioritized patient list
  ↓
Patients sorted by risk score (high → low)
  ↓
Click patient → PatientDetailView
  ↓
View full history, vitals, risk factors
  ↓
Take action (message, schedule appointment, adjust care plan)
```

## 🏥 Hospital Integration

### Supported EHR Systems

- **Epic** (FHIR R4 API)
- **Cerner** (FHIR R4 API)
- **Allscripts**
- **MEDITECH**

### Data Sync

**Automated Import:**
- Patient demographics
- Discharge summaries
- Medication lists
- Vital signs history
- Appointment schedules

**Real-time Updates:**
- New discharges (daily batch at 6 AM)
- Lab results (as available)
- Emergency department visits

**Data Integrity:**
- Validation rules for all imported data
- Duplicate detection
- Error logging and alerting
- Manual review queue for flagged records

## 📈 Analytics & Reporting

### Administrator Dashboard Metrics

**Readmission Metrics:**
- 30-day readmission rate (baseline vs current)
- Readmissions prevented (estimated)
- Cost savings per readmission avoided

**Patient Engagement:**
- Daily check-in completion rate
- Average recovery streak
- Active users (7-day, 30-day)
- Patient satisfaction scores

**Clinical Outcomes:**
- Risk score trends over time
- Alert distribution (Green/Yellow/Red)
- Average time to intervention
- Adherence to care plans

**Financial Impact:**
- Total cost savings (readmission + ER visits)
- ROI calculation
- Cost per patient per month
- Revenue impact from quality bonuses

**System Performance:**
- API response times
- Data sync success rate
- User login frequency
- Message response times

### Exportable Reports

- Executive summary (PDF)
- Monthly performance report (Excel)
- Individual patient report (PDF)
- Quality measure attestation (HL7 QRDA)

## 🔔 Notification System

### Patient Notifications

**Daily Reminders:**
- Check-in reminder (8 AM local time)
- Medication reminders (if configured)
- Appointment reminders (24 hours before)

**Alert Notifications:**
- Yellow/Red alert confirmation
- Care team follow-up scheduled
- New message from care team

**Engagement Notifications:**
- Recovery streak milestones (7, 14, 30 days)
- Health tips (daily)
- Educational content (weekly)

### Clinician Notifications

**Real-time Alerts:**
- Red alert submitted by patient
- Yellow alert requiring review
- Patient missed check-in (3 consecutive days)

**Daily Digest:**
- Summary of all patient check-ins
- New high-risk patients
- Patients requiring follow-up

**System Alerts:**
- Failed EHR sync
- System errors
- Security notifications

### Care Circle Notifications

**Configurable Alerts:**
- Patient submitted Yellow/Red alert
- Patient completed daily check-in
- Appointment reminders
- Milestone achievements

**Privacy Controls:**
- Opt-in/opt-out by alert type
- Summary-level only (no PHI details)
- HIPAA-compliant delivery

## 🔒 Security & Compliance

### HIPAA Compliance

- **Encryption**: All data encrypted at rest (AES-256) and in transit (TLS 1.3)
- **Access Controls**: Role-based access with audit logging
- **PHI Handling**: Minimal necessary principle enforced
- **Audit Trails**: All data access logged with timestamp and user
- **Data Retention**: 7-year retention policy, secure deletion

### Security Features

- **Authentication**: Secure credential generation (12-character passwords)
- **Session Management**: Automatic timeout after 30 minutes
- **Input Validation**: All user inputs sanitized
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Content Security Policy headers

### Privacy Features

- **Patient Consent**: Explicit opt-in for Care Circle
- **Data Access**: Patients can view access logs
- **Right to Delete**: Patient data deletion on request
- **Anonymization**: Analytics use de-identified data

## 🧪 Testing & Development

### Mock Data

The system includes comprehensive mock data for development:

- **10 sample patients** with varied risk levels
- **7 sample hospitals** across different states
- **Mock AI responses** for check-in submissions
- **Sample vital trends** for visualization
- **Predefined health tips** rotation

### Development Mode

Enable detailed logging in `/supabase/functions/server/index.tsx`:

```typescript
const DEBUG_MODE = true;
```

### Testing Credentials

**Clinician:**
- Username: `clinician@cardioguard.ai`
- Password: (configure in your system)

**Administrator:**
- Username: `admin@cardioguard.ai`
- Password: (configure in your system)

**Sample Patient:**
- Hospital: Memorial Hospital
- Username: (auto-generated, check AddPatientForm output)
- Password: (auto-generated, displayed after creation)

## 🚧 Known Limitations

### Current Prototype Limitations

1. **Authentication**: Simplified auth (no JWT, no password hashing)
2. **AI Model**: Mock classification logic, not real ML
3. **EHR Integration**: Simulated FHIR endpoints, not live connections
4. **Notifications**: Mock SMS/email, not actual delivery
5. **Scalability**: Not optimized for >1000 concurrent users
6. **Mobile App**: Web-only (responsive design, not native)

### Production Readiness Checklist

- [ ] Implement proper authentication (JWT, OAuth 2.0)
- [ ] Integrate real ML model for risk classification
- [ ] Connect to production EHR systems
- [ ] Set up notification delivery (Twilio, SendGrid)
- [ ] Implement rate limiting and DDoS protection
- [ ] Add comprehensive error handling
- [ ] Set up monitoring and alerting (DataDog, Sentry)
- [ ] Conduct security audit and penetration testing
- [ ] Implement backup and disaster recovery
- [ ] Load testing and performance optimization
- [ ] HIPAA compliance audit
- [ ] User acceptance testing with real patients
- [ ] Clinical validation studies

## 📦 Deployment

### Environment Variables

Required in production:

```bash
# Supabase
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# EHR Integration
EPIC_CLIENT_ID=your_epic_client_id
EPIC_CLIENT_SECRET=your_epic_secret
CERNER_API_KEY=your_cerner_key

# Notifications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=your_sendgrid_key

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

### Build for Production

```bash
npm run build
```

### Deploy to Supabase

```bash
# Deploy Edge Functions
supabase functions deploy make-server-c21253d3

# Run database migrations
supabase db push
```

### Hosting Options

- **Vercel**: Recommended for React frontend
- **Netlify**: Alternative frontend hosting
- **Supabase**: Backend Edge Functions
- **AWS**: Full-stack deployment option
- **Azure**: Healthcare cloud compliance

## 🤝 Contributing

### Development Workflow

1. Create feature branch from `main`
2. Make changes following code style guidelines
3. Test thoroughly with mock data
4. Update relevant documentation
5. Submit pull request with description

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Tailwind**: Utility-first, no custom CSS
- **Naming**: PascalCase for components, camelCase for functions
- **Comments**: JSDoc for public functions

### Component Guidelines

- Keep components focused (single responsibility)
- Extract reusable UI to `/components/ui/`
- Use TypeScript interfaces for all props
- Include error boundaries for patient-facing components
- Optimize re-renders with `React.memo` where appropriate

## 📄 License

This is a proprietary healthcare application. All rights reserved.

**© 2024 CardioGuard Health Systems**

For licensing inquiries, contact: licensing@cardioguard.ai

---

## 📞 Support & Contact

### Technical Support
- Email: support@cardioguard.ai
- Phone: 1-800-CARDIO-AI (1-800-227-3462)
- Hours: 24/7 for critical issues

### Clinical Support
- Dedicated clinical success manager for each hospital
- Clinical advisory board for feature requests
- Quarterly clinical outcome reviews

### Training Resources
- **Clinician Training**: 2-hour onboarding + certification
- **Patient Education**: Video tutorials + printed guides
- **Administrator Training**: Analytics dashboard deep-dive

### Documentation
- **Online Docs**: https://docs.cardioguard.ai
- **API Reference**: https://api.cardioguard.ai/docs
- **Release Notes**: https://cardioguard.ai/releases

---

## 🗺️ Roadmap

### Q1 2024
- [ ] Mobile native app (iOS + Android)
- [ ] Advanced AI model with deep learning
- [ ] Integration with wearable devices (Apple Watch, Fitbit)
- [ ] Telehealth video consultations

### Q2 2024
- [ ] Multi-language support (Spanish, Mandarin)
- [ ] Voice-enabled check-ins (Alexa, Google Home)
- [ ] Predictive readmission alerts (7-14 days out)
- [ ] Social determinants of health screening

### Q3 2024
- [ ] Expanded to other cardiac conditions (AFib, valve disease)
- [ ] Population health management tools
- [ ] Value-based care reporting
- [ ] Patient-reported outcome measures (PROMs)

### Q4 2024
- [ ] AI chatbot for patient questions
- [ ] Remote patient monitoring device integration
- [ ] Automated care plan generation
- [ ] Clinical trial matching

---

## 📊 Success Metrics

### Current Performance (Mock Data)

- **Readmission Reduction**: 42% decrease vs baseline
- **Patient Engagement**: 87% daily check-in completion
- **Cost Savings**: $12,500 per readmission avoided
- **Alert Response Time**: Average 18 minutes (Red alerts)
- **Patient Satisfaction**: 4.7/5.0 stars
- **ROI**: 340% in first year

### Target Metrics (Year 1)

- 50%+ reduction in 30-day readmissions
- 90%+ patient engagement rate
- <15 minutes response time to Red alerts
- 4.5+ patient satisfaction score
- 300%+ ROI

---

## 🙏 Acknowledgments

### Clinical Advisory Board
- Dr. Sarah Chen, MD, FACC - Chief of Cardiology, Memorial Hospital
- Dr. James Rodriguez, MD - Heart Failure Specialist, St. Mary's Medical
- Dr. Lisa Patel, RN, PhD - Nursing Informatics Lead

### Technology Partners
- Supabase - Backend infrastructure
- Vercel - Frontend hosting
- Epic Systems - EHR integration
- Twilio - Communication services

### Open Source Libraries
See [Attributions.md](Attributions.md) for complete list of dependencies and licenses.

---

**Last Updated**: October 29, 2025  
**Version**: 2.0.0  
**Documentation Status**: ✅ Complete
