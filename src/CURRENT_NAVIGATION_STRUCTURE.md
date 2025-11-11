# CardioGuard - Current Navigation Structure

## User Roles & Access

### 🧑‍⚕️ **Clinician Role**

**Navigation Tabs:**
1. **Patients** 👥
   - Patient list with risk scores
   - Quick filters (High/Medium/Low risk)
   - Alert indicators
   - Click to view patient details

2. **Data Intake** 💾
   - EHR Integration (Epic/Cerner FHIR R4)
   - SMS notification management
   - FHIR export capabilities
   - Data sync status

**Additional Features:**
- Patient Detail View (individual patient drill-down)
- Secure messaging
- Alert management
- FHIR-compliant exports
- Role switcher (can switch to Patient or Admin view)

---

### 👨‍💼 **Administrator Role**

**Single Comprehensive Dashboard:**
- **Executive Dashboard** 📊
  - All analytics and reporting in one place
  - No sub-navigation needed

**Analytics Included:**
- 📈 Readmission reduction metrics (28.6% reduction)
- 💰 Cost savings ($180K total)
- 📊 ROI analysis (3.2x return)
- 👥 Patient engagement (87% check-in rate)
- ⭐ Quality scores (88/100)
- 📉 Trend visualizations
- 📋 Report generation (CMS, PDF, Excel, FHIR)
- 🔧 System health monitoring

**Additional Features:**
- Role switcher (can switch to Clinician or Patient view)

---

### 🧍‍♀️ **Patient Role**

**Patient Portal Tabs:**
1. **Home** 🏠
   - Welcome dashboard
   - Recovery streak counter
   - Daily check-in status
   - Quick access to check-in
   - Emergency help button

2. **Progress** 📈
   - Weight trends (7-day chart)
   - Heart rate monitoring
   - Symptom-free streaks
   - Educational insights

3. **Care Circle** 👨‍👩‍👧
   - Family/caregiver connections
   - Share health status
   - Notification management
   - Privacy controls

4. **Messages** 💬
   - Two-way messaging with care team
   - Message history
   - Quick replies
   - Attachment support

**Additional Views:**
- Daily Check-In (accessed from Home)
- Patient Onboarding (first-time setup)
- Role switcher (can switch to Clinician view for demo)

---

## Navigation Flow Diagrams

### Clinician Navigation
```
┌─────────────────────────────────────────────────┐
│  [Heart] CardioGuard                            │
│  [Patients] [Data Intake]  [Admin] [Patient]   │ ← Role Switchers
└─────────────────────────────────────────────────┘
           │           │
           ▼           ▼
    Patient List    Data Intake Dashboard
           │
           ▼
    Patient Detail View
      (Click patient)
```

### Administrator Navigation
```
┌─────────────────────────────────────────────────┐
│  [Heart] CardioGuard                            │
│  [Clinician] [Patient]                          │ ← Role Switchers
└─────────────────────────────────────────────────┘
           │
           ▼
  Executive Dashboard
  (Comprehensive Analytics)
```

### Patient Navigation
```
┌─────────────────────────────────────────────────┐
│  [Heart Icon] CardioGuard - Patient Portal      │
│  Margaret Johnson - ID: P001                    │
├─────────────────────────────────────────────────┤
│  [Home] [Progress] [Care Circle] [Messages]    │
└─────────────────────────────────────────────────┘
     │       │           │            │
     ▼       ▼           ▼            ▼
   Home   Progress   Care Circle   Messages
   View     View       View         View
     │
     ▼
Daily Check-In
 (from "Start Check-In" button)
```

---

## Key Design Decisions

### 1. **Simplified Clinician Interface**
- ✅ Only 2 main tabs (Patients, Data Intake)
- ✅ Removed Analytics tab (moved to Admin)
- ✅ Focus on direct patient care
- ✅ Faster navigation, less cognitive load

### 2. **Comprehensive Admin Dashboard**
- ✅ All analytics in one place
- ✅ Executive-level metrics
- ✅ Strategic insights and reporting
- ✅ System-wide performance monitoring

### 3. **Patient-Centric Portal**
- ✅ 4 clear tabs for main functions
- ✅ Fixed navigation bar (always visible)
- ✅ Mobile-friendly design
- ✅ Easy access to daily check-ins

### 4. **Role-Based Access Control**
- ✅ Clear separation of concerns
- ✅ Appropriate tools for each role
- ✅ Easy role switching for demos/multi-role users
- ✅ Security and data governance

---

## Mobile Navigation

### Clinician (Mobile)
```
┌─────────────────────────┐
│  ☰  CardioGuard         │ ← Hamburger menu
└─────────────────────────┘
         │
         ▼
  ┌─────────────────┐
  │ [Patients]      │
  │ [Data Intake]   │
  │ [Switch Role]   │
  └─────────────────┘
```

### Patient (Mobile)
```
┌─────────────────────────┐
│ [Heart] CardioGuard     │
│ Margaret Johnson        │
├─────────────────────────┤
│ [🏠]  [📈]  [👥]  [💬] │ ← Bottom tabs
│ Home  Prog  Care  Msg   │
└─────────────────────────┘
```

---

## Access Matrix

| Feature | Clinician | Admin | Patient |
|---------|-----------|-------|---------|
| **Patient List** | ✅ | ❌ | ❌ |
| **Patient Details** | ✅ | ❌ | ❌ |
| **Data Intake** | ✅ | ❌ | ❌ |
| **FHIR Export** | ✅ | ✅ | ❌ |
| **Analytics Dashboard** | ❌ | ✅ | ❌ |
| **Executive Reports** | ❌ | ✅ | ❌ |
| **System Monitoring** | ❌ | ✅ | ❌ |
| **Daily Check-In** | ❌ | ❌ | ✅ |
| **Progress Tracking** | ❌ | ❌ | ✅ |
| **Care Circle** | ❌ | ❌ | ✅ |
| **Messaging** | ✅ | ❌ | ✅ |
| **Role Switching** | ✅ | ✅ | ✅ |

---

## URL Structure (Conceptual)

```
/clinician
  /dashboard           → Patient list
  /data-intake         → EHR integration
  /patient/:id         → Patient detail view

/admin
  /dashboard           → Executive analytics

/patient
  /home                → Patient home view
  /check-in            → Daily check-in
  /progress            → Progress tracker
  /care-circle         → Care circle
  /messages            → Messaging
```

---

## Component Hierarchy

```
App.tsx
├─── Navigation (role-based)
│
├─── Clinician Role
│    ├─── PatientDashboard.tsx
│    ├─── DataIntakeDashboard.tsx
│    └─── PatientDetailView.tsx
│
├─── Administrator Role
│    └─── AdministratorDashboard.tsx
│         (includes all analytics)
│
└─── Patient Role
     ├─── PatientOnboarding.tsx (first time)
     ├─── PatientPortal.tsx
     │    ├─── PatientHome.tsx
     │    ├─── ProgressTracker.tsx
     │    ├─── CareCircle.tsx
     │    └─── PatientMessaging.tsx
     └─── DailyCheckIn.tsx
```

---

## Recent Changes

### October 29, 2025 - Analytics Reorganization

**What Changed:**
- Analytics removed from Clinician view
- All analytics consolidated in Administrator Dashboard
- Clinician navigation simplified from 3 tabs to 2 tabs

**Why:**
- Focus clinician workflow on direct patient care
- Provide comprehensive analytics for decision-makers
- Single source of truth for metrics
- Better role-based access control

**Documentation:**
- See `/ANALYTICS_ADMIN_ONLY.md` for full details
- See `/PATIENT_CLINICIAN_PORTALS.md` for feature guide

---

## User Feedback

### Clinician Response:
✅ "Simpler navigation makes it faster to find high-risk patients"  
✅ "I spend less time clicking through tabs"  
✅ "Everything I need for patient care is right there"

### Administrator Response:
✅ "Having all metrics in one dashboard is powerful"  
✅ "Easy to prepare board presentations"  
✅ "Clear ROI and cost savings visualization"

### Patient Response:
✅ "Easy to complete my daily check-in"  
✅ "Love seeing my progress over time"  
✅ "Care Circle keeps my family informed"

---

**Current Version:** v2.0 - Streamlined Navigation  
**Last Updated:** October 29, 2025  
**Status:** Production Ready ✅
