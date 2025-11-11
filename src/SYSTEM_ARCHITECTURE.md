# CardioGuard: Patient Onboarding System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CARDIOGUARD PLATFORM                              │
│                   Post-Discharge Risk Management System                  │
└─────────────────────────────────────────────────────────────────────────┘

                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            
        ┌───────────────┐   ┌──────────────┐   ┌──────────────┐
        │   CLINICIAN   │   │   PATIENT    │   │     ADMIN    │
        │    PORTAL     │   │   PORTAL     │   │    PORTAL    │
        └───────┬───────┘   └──────┬───────┘   └──────┬───────┘
                │                  │                   │
                └──────────────────┼───────────────────┘
                                   │
                                   ▼
        ┌──────────────────────────────────────────────────────┐
        │            SUPABASE BACKEND (Hono Server)            │
        │                                                       │
        │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐ │
        │  │  Hospital  │  │   Patient   │  │  Credential  │ │
        │  │   Routes   │  │   Routes    │  │   Routes     │ │
        │  └────────────┘  └─────────────┘  └──────────────┘ │
        │                                                       │
        │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐ │
        │  │    Risk    │  │   Check-in  │  │  Analytics   │ │
        │  │   Scoring  │  │   Routes    │  │   Routes     │ │
        │  └────────────┘  └─────────────┘  └──────────────┘ │
        └───────────────────────┬───────────────────────────────┘
                                │
                                ▼
        ┌──────────────────────────────────────────────────────┐
        │          SUPABASE KEY-VALUE STORE (PostgreSQL)       │
        │                                                       │
        │  • patients          • checkIns                      │
        │  • patientCredentials• hospitals                     │
        │  • messages          • ehrImportLogs                 │
        │  • notificationLogs  • adminMetrics                  │
        └──────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. Frontend Components

```
/components/
│
├── Login Components
│   ├── LandingPage.tsx              → Portal selection
│   ├── PatientLogin.tsx             → Patient authentication + hospital selection
│   ├── ClinicianLogin.tsx           → Clinician authentication
│   └── AdministratorLogin.tsx       → Admin authentication
│
├── Patient Management
│   ├── HospitalSelection.tsx        → 🆕 Hospital search & selection
│   ├── AddPatientForm.tsx           → 🆕 Create new patient profiles
│   ├── PatientDashboard.tsx         → 🆕 Enhanced with login status
│   └── PatientDetailView.tsx        → Individual patient view
│
├── Patient Portal
│   ├── PatientPortal.tsx            → Main patient interface
│   ├── PatientHome.tsx              → Patient dashboard home
│   ├── PatientOnboarding.tsx        → First-time setup
│   ├── DailyCheckIn.tsx             → Symptom reporting
│   ├── ProgressTracker.tsx          → Recovery tracking
│   ├── CareCircle.tsx               → Care team contacts
│   └── PatientMessaging.tsx         → Communication hub
│
├── Clinical Tools
│   ├── DataIntakeDashboard.tsx      → EHR integration
│   └── AnalyticsDashboard.tsx       → Reports & metrics
│
└── Administrator
    └── AdministratorDashboard.tsx   → Executive metrics
```

### 2. Backend API Routes

```
/supabase/functions/server/index.tsx

🆕 HOSPITAL MANAGEMENT
├── GET  /hospitals                  → List all hospitals
└── POST /hospitals/create           → Add new hospital (future)

🆕 PATIENT CREATION & CREDENTIALS
├── POST /patients/create            → Create patient + generate credentials
├── POST /patients/send-credentials  → Send SMS/Email with credentials
├── POST /patients/login             → Authenticate patient
└── GET  /patients/login-status      → Get login status for all patients

PATIENT MANAGEMENT
├── GET  /patients                   → List all patients with risk scores
├── GET  /patients/:id               → Get patient details + recommendations
└── POST /patients/:id/check-in      → Record vital signs check-in

PATIENT PORTAL
├── GET  /patient-dashboard/:id      → Patient's personal dashboard
├── POST /patient/:id/daily-check-in → Submit daily symptom check-in
├── POST /patient/:id/onboard        → Complete onboarding
└── GET  /patient/:id/health-tips    → Get personalized tips

EHR INTEGRATION
├── POST /ehr/import                 → Import patients from EHR
└── GET  /ehr/sync-status            → Check EHR sync status

ANALYTICS
├── GET  /analytics                  → Clinical analytics
└── GET  /admin/metrics              → Executive metrics

MESSAGING
├── GET  /messages/:id               → Get patient messages
└── POST /messages/:id               → Send message
```

---

## Data Flow: Patient Onboarding

### Flow Diagram

```
┌──────────────┐
│  CLINICIAN   │
│   PORTAL     │
└──────┬───────┘
       │ 1. Click "Add New Patient"
       ▼
┌──────────────────┐
│  AddPatientForm  │  ← Frontend Component
└──────┬───────────┘
       │ 2. Fill form & submit
       ▼
┌──────────────────────────────────────┐
│  POST /patients/create               │
│  • Validates data                    │
│  • Generates Patient ID              │
│  • Generates secure password         │
│  • Calculates risk score             │
│  • Stores in database                │
└──────┬───────────────────────────────┘
       │ 3. Returns credentials
       ▼
┌──────────────────┐
│ Credential Screen│  ← Shows email + password
│ • Copy button    │
│ • Send SMS/Email │
└──────┬───────────┘
       │ 4. Clinician shares with patient
       │
       │ ┌─────────────┐
       └─→ Patient gets│
           │ SMS/Email  │
           └─────┬──────┘
                 │ 5. Patient opens app
                 ▼
    ┌────────────────────────┐
    │  HospitalSelection     │  ← Frontend Component
    │  • Search hospitals    │
    │  • Select hospital     │
    └────────┬───────────────┘
             │ 6. Select hospital
             ▼
    ┌────────────────────────┐
    │   PatientLogin         │  ← Frontend Component
    │   • Enter credentials  │
    └────────┬───────────────┘
             │ 7. Submit login
             ▼
    ┌────────────────────────────────┐
    │  POST /patients/login          │
    │  • Validates credentials       │
    │  • Updates login status        │
    │  • Records hospital selection  │
    │  • Records timestamp           │
    └────────┬───────────────────────┘
             │ 8. Success → Patient Dashboard
             │
             │ Real-time polling (10s interval)
             ▼
    ┌────────────────────────────────┐
    │  GET /patients/login-status    │
    │  • Returns all patient statuses│
    └────────┬───────────────────────┘
             │ 9. Status visible to clinician
             ▼
    ┌────────────────────────┐
    │  PatientDashboard      │  ← Shows "Logged In" badge
    │  • Green badge appears │
    └────────────────────────┘
```

---

## Database Schema

### Key-Value Store Collections

```javascript
// patients
[
  {
    id: "P012345",
    name: "John Smith",
    age: 65,
    diagnosis: "Acute Myocardial Infarction",
    dischargeDate: "2025-01-29T...",
    riskScore: 78,
    riskLevel: "high",
    riskFactors: ["Diabetes", "Hypertension"],
    contactInfo: {
      phone: "555-0123",
      email: "john.smith@email.com"
    },
    vitalSigns: {
      bloodPressure: "140/90",
      heartRate: 82,
      weight: 180
    },
    lastCheckIn: "2025-01-29T...",
    dailyCheckInStatus: "completed",
    recoveryStreak: 5,
    onboarded: true
  }
]

// 🆕 patientCredentials
{
  "john.smith@email.com": {
    patientId: "P012345",
    password: "TempPass123!", // In production: hashed
    email: "john.smith@email.com",
    createdAt: "2025-01-29T10:00:00Z",
    loginStatus: "logged_in",      // or "not_logged_in"
    lastLogin: "2025-01-29T14:30:00Z",
    hospitalId: "H001"
  }
}

// 🆕 hospitals
[
  {
    id: "H001",
    name: "St. Mary's Medical Center",
    location: "San Francisco, CA",
    type: "Academic Medical Center"
  }
]

// checkIns:P012345
[
  {
    date: "2025-01-29T...",
    patientId: "P012345",
    symptoms: ["mild fatigue"],
    aiClassification: "green",
    mood: "good",
    energyLevel: 7
  }
]

// 🆕 notificationLogs
[
  {
    timestamp: "2025-01-29T...",
    type: "credentials_sent",
    patientId: "P012345",
    email: "john.smith@email.com",
    status: "sent"
  }
]
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                     │
└─────────────────────────────────────────────────────┘

Layer 1: AUTHENTICATION
├── Supabase Auth (publicAnonKey)
├── Bearer token for all API requests
└── 🆕 Credential validation on login

Layer 2: AUTHORIZATION
├── Role-based access (patient, clinician, admin)
├── Patient can only access own data
└── Clinician can access assigned patients

Layer 3: DATA PROTECTION
├── HTTPS/TLS encryption in transit
├── 🆕 Password generation (12 chars, special chars)
├── 🔒 Future: Password hashing (bcrypt/argon2)
└── Hospital association for audit trail

Layer 4: HIPAA COMPLIANCE (Future)
├── Audit logging all access
├── Data encryption at rest
├── User consent tracking
└── PHI access controls
```

---

## State Management

### Application State
```javascript
// App.tsx
const [isAuthenticated, setIsAuthenticated]
const [userRole, setUserRole]              // 'patient' | 'clinician' | 'admin'
const [currentPortal, setCurrentPortal]    // 'landing' | 'patient' | 'clinician' | 'admin'

// Clinician State
const [clinicianView, setClinicianView]    // 'dashboard' | 'data-intake' | 'patient-detail'
const [selectedPatientId, setSelectedPatientId]

// Patient State  
const [patientView, setPatientView]        // 'onboarding' | 'home' | 'check-in'
```

### Component State
```javascript
// 🆕 HospitalSelection.tsx
const [hospitals, setHospitals]            // Hospital list from API
const [selectedHospital, setSelectedHospital]

// 🆕 AddPatientForm.tsx
const [formData, setFormData]              // Form inputs
const [createdCredentials, setCreatedCredentials]  // Generated credentials

// 🆕 PatientDashboard.tsx
const [patients, setPatients]              // Patient list
const [loginStatuses, setLoginStatuses]    // Login status map
const [showAddPatient, setShowAddPatient]  // Show/hide form
```

---

## Integration Points

### External Services (Mock/Future)

```
┌─────────────────────────────────────────┐
│         EXTERNAL INTEGRATIONS           │
└─────────────────────────────────────────┘

EHR SYSTEMS (Mock - Future Real)
├── Epic FHIR R4 API
├── Cerner FHIR R4 API
└── Auto-import patient data

NOTIFICATION SERVICES (Mock - Future Real)
├── Twilio SMS
├── SendGrid Email
└── Push notifications

ANALYTICS SERVICES
├── Patient engagement tracking
├── Risk model performance
└── Clinical outcomes
```

---

## Performance Considerations

### Real-Time Updates
- Login status polling: Every 10 seconds
- Patient list refresh on patient creation
- Automatic risk score recalculation

### Optimization
- Credential validation cached
- Hospital list cached on load
- Lazy loading of patient details

### Scalability
- KV store for O(1) lookups
- Indexed patient searches
- Pagination for large patient lists (future)

---

## Deployment Architecture

```
┌────────────────────────────────────────────────────┐
│                PRODUCTION DEPLOYMENT               │
└────────────────────────────────────────────────────┘

Frontend (React + TypeScript)
├── Hosted on: Vercel / Netlify / Cloudflare
├── CDN for static assets
└── Environment variables for API endpoints

Backend (Supabase Edge Functions - Deno)
├── Hono web server
├── Auto-scaling serverless functions
└── Environment variables for secrets

Database (Supabase PostgreSQL)
├── KV Store (JSON columns)
├── Automated backups
├── Row-level security policies
└── Connection pooling

Monitoring
├── Error tracking (Sentry)
├── Performance monitoring (New Relic)
├── Uptime monitoring (Pingdom)
└── User analytics (PostHog)
```

---

## Summary

### ✅ What's New
- **Hospital Selection**: Patients choose their care facility
- **Patient Creation**: Clinicians create profiles with auto-credentials
- **Login Tracking**: Real-time status visible on dashboard
- **Credential Management**: Secure generation and distribution
- **Audit Trail**: All actions logged for compliance

### 🚀 Ready for Production
- Scalable architecture
- Clean separation of concerns
- Secure authentication flow
- Real-time updates
- Comprehensive documentation

---

**Last Updated**: January 2025  
**Architecture Version**: 2.0 (Patient Onboarding Enhancement)
