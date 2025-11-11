# Patient Onboarding Workflow

This document describes the complete patient onboarding workflow from discharge to first login.

## Workflow Overview

```
1. Patient Discharge
   ↓
2. Clinician Creates Patient Profile
   ↓
3. System Generates Login Credentials
   ↓
4. Credentials Sent to Patient (SMS/Email)
   ↓
5. Patient Searches for Hospital
   ↓
6. Patient Logs In
   ↓
7. Login Status Reflected on Clinician Dashboard
```

## Step-by-Step Process

### 1. Patient Discharge
- Patient is discharged from the hospital after receiving cardiac care
- Care team determines patient needs post-discharge monitoring

### 2. Clinician Creates Patient Profile
- Clinician logs into the Clinician Portal
- Clicks **"Add New Patient"** button in the dashboard header
- Fills out the patient creation form:
  - **Personal Information**: Name, Age
  - **Contact Information**: Email, Phone
  - **Medical Information**: Primary Diagnosis, Risk Factors
  - **Initial Vital Signs** (optional): Blood Pressure, Heart Rate, Weight
- Clicks **"Create Patient Profile"**

### 3. System Generates Login Credentials
- System automatically:
  - Generates a unique Patient ID (e.g., P012345)
  - Creates a secure temporary password
  - Calculates initial risk score based on patient data
  - Stores patient record in database

### 4. Credentials Sent to Patient
- Clinician sees credential screen with:
  - Patient ID
  - Email address
  - Temporary password
- Clinician options:
  - **Copy Credentials**: Copy to clipboard
  - **Send via SMS/Email**: Automatically notify patient
  - Patient receives message: *"Welcome to CardioGuard! Your login credentials: Email: patient@email.com, Password: [temp_password]. Download the app and log in to start your recovery journey."*

### 5. Patient Searches for Hospital
- Patient opens CardioGuard app
- First screen: **Hospital Selection**
- Patient searches for their hospital by:
  - Hospital name
  - City/location
- Patient selects their hospital from the list
- Clicks **"Continue to Login"**

### 6. Patient Logs In
- Patient enters:
  - Email address (provided by clinician)
  - Password (temporary password)
  - Their name
- System validates credentials
- Patient is directed to:
  - **Onboarding flow** (first time) - consent, introduction
  - **Patient Dashboard** (returning) - daily check-ins, health tips

### 7. Login Status on Clinician Dashboard
- Clinician dashboard automatically updates every 10 seconds
- Patient card shows login status badge:
  - 🕒 **"Awaiting Login"** (gray) - Patient hasn't logged in yet
  - ✅ **"Logged In"** (green) - Patient has successfully logged in
- Clinician can see at a glance which patients have activated their accounts

## Key Features

### For Clinicians
- **One-Click Patient Creation**: Simple form to add new patients
- **Automatic Credential Generation**: No manual password creation needed
- **Real-Time Login Tracking**: See when patients log in
- **Hospital Association**: Track which hospital each patient belongs to
- **Risk Score Calculation**: Automatic AI-powered risk assessment

### For Patients
- **Hospital Search**: Easy way to find and select their care facility
- **Secure Login**: Credentials provided by their care team
- **Guided Onboarding**: Introduction to the platform on first login
- **Personalized Dashboard**: Recovery tracking, daily check-ins, health tips

### For Administrators
- **Patient Engagement Metrics**: Track how many patients are actively using the platform
- **Hospital Performance**: Monitor patient activation rates by facility
- **Credential Management**: Audit trail of patient account creation

## Technical Implementation

### Backend Endpoints

#### `POST /patients/create`
Creates a new patient profile and generates credentials.

**Request:**
```json
{
  "name": "John Smith",
  "age": 65,
  "email": "john.smith@email.com",
  "phone": "555-0123",
  "diagnosis": "Acute Myocardial Infarction",
  "riskFactors": ["Diabetes", "Hypertension"],
  "vitalSigns": {
    "bloodPressure": "140/90",
    "heartRate": 82,
    "weight": 180
  }
}
```

**Response:**
```json
{
  "success": true,
  "patient": { /* patient object */ },
  "credentials": {
    "email": "john.smith@email.com",
    "password": "TempPass123!",
    "patientId": "P012345"
  }
}
```

#### `POST /patients/send-credentials`
Sends login credentials to patient via SMS/Email.

#### `POST /patients/login`
Authenticates patient and tracks login status.

#### `GET /patients/login-status`
Returns login status for all patients (for clinician dashboard).

#### `GET /hospitals`
Returns list of available hospitals for patient selection.

## Data Flow

```
┌─────────────────┐
│   Clinician     │
│    Portal       │
└────────┬────────┘
         │ Creates Patient
         ▼
┌─────────────────┐
│  Backend API    │◄─────────┐
│  (Supabase)     │          │
└────────┬────────┘          │
         │ Stores            │
         │ Credentials       │
         ▼                   │
┌─────────────────┐          │
│   Patient       │          │
│   Credentials   │          │
│   Database      │          │
└─────────────────┘          │
                              │
┌─────────────────┐          │
│  Patient App    │──────────┘
│  (Login)        │  Updates Status
└─────────────────┘
```

## Security Considerations

1. **Temporary Passwords**: Patients should be prompted to change password after first login
2. **Credentials in Transit**: SMS/Email notifications should use secure channels
3. **Session Management**: Patient sessions should expire after inactivity
4. **Hospital Verification**: Ensure patients can only access data from their registered hospital
5. **HIPAA Compliance**: All patient data transmission is encrypted

## Future Enhancements

- [ ] Multi-factor authentication (MFA) for enhanced security
- [ ] Password reset flow for patients
- [ ] Batch patient import from EHR systems
- [ ] QR code credentials for easy mobile access
- [ ] Family member/caregiver access invitations
- [ ] SMS reminders for patients who haven't logged in within 24 hours
- [ ] Hospital-specific branding on login pages
- [ ] Single Sign-On (SSO) integration with hospital systems

## Demo Credentials

For testing purposes, use these demo credentials:

**Patient Demo Login:**
- Email: `patient@demo.com`
- Password: `demo123`
- Hospital: Any hospital in the list

**Clinician Demo Login:**
- Email: `clinician@demo.com`
- Password: `demo123`

---

*Last Updated: January 2025*
