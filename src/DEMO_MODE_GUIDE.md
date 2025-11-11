# 🎬 CardioGuard Demo Mode Guide

## Overview

CardioGuard can now run in **Demo Mode** using mock data - no Supabase backend required! Perfect for demos, presentations, and development.

---

## 🔧 Quick Start

### Enable Demo Mode

Open `/utils/config.ts` and set:

```typescript
export const config = {
  useMockData: true,  // ✅ Enable demo mode
  apiDelay: 500,      // Simulated network delay (ms)
  // ...
};
```

### Disable Demo Mode (Use Real Backend)

```typescript
export const config = {
  useMockData: false, // ❌ Use Supabase backend
  // ...
};
```

That's it! The app will automatically switch between mock and real data.

---

## 📊 What's Included in Mock Data

### **8 Pre-loaded Patients**

1. **Margaret Johnson** (72) - High Risk
   - Diagnosis: Acute Myocardial Infarction
   - Risk Score: 78
   - Status: Pending check-in
   - Alert: Yellow (missed check-in)

2. **Robert Chen** (65) - Medium Risk
   - Diagnosis: Congestive Heart Failure
   - Risk Score: 52
   - Status: Check-in completed
   - Alert: Green (all good)

3. **Patricia Williams** (58) - Low Risk
   - Diagnosis: Atrial Fibrillation
   - Risk Score: 35
   - Status: 8-day recovery streak
   - Alert: Green

4. **James Anderson** (79) - Critical Risk ⚠️
   - Diagnosis: Acute Myocardial Infarction
   - Risk Score: 85
   - Status: Pending check-in
   - Alert: Red (chest pain, shortness of breath)

5. **Linda Martinez** (68) - Low Risk
   - Diagnosis: Heart Valve Replacement
   - Risk Score: 28
   - Status: 15-day recovery streak
   - Alert: Green

6. **David Thompson** (55) - Medium Risk
   - Diagnosis: Congestive Heart Failure
   - Risk Score: 62
   - Status: 1-day streak
   - Alert: Yellow

7. **Sarah Mitchell** (63) - Medium Risk
   - Diagnosis: Coronary Artery Bypass Graft
   - Risk Score: 45
   - Status: 5-day streak
   - Alert: Green

8. **Michael O'Brien** (71) - High Risk
   - Diagnosis: Acute Myocardial Infarction
   - Risk Score: 68
   - Status: Pending check-in
   - Alert: Yellow (fatigue, dizziness)

### **Login Statuses**

- 3 patients currently online (Robert, Patricia, Linda)
- 5 patients offline
- Realistic login history and timestamps

### **Recommendations**

- 5 AI-generated recommendations for high-risk patients
- Various priorities: Critical, High, Medium
- Types: Medication, Monitoring, Appointment, Lifestyle

---

## 🎯 Demo Scenarios

### Scenario 1: Show High-Risk Patient Management

1. **Filter by Risk:** Click "High Risk" or "Critical" filters
2. **View James Anderson:** Click on the critical patient
3. **Show Recommendations:** Display urgent follow-up actions
4. **Explain AI Alerts:** Point out red alert for reported symptoms

### Scenario 2: Demonstrate Patient Onboarding

1. **Add New Patient:** Click "Add New Patient" button
2. **Fill Form:**
   - Name: John Smith
   - Age: 68
   - Email: jsmith@email.com
   - Phone: 555-9999
   - Diagnosis: Congestive Heart Failure
   - Risk Factors: Diabetes, Hypertension
3. **Show Credentials:** Copy generated login credentials
4. **Verify:** Patient appears in dashboard immediately

### Scenario 3: EHR Integration Demo

1. **Go to Data Intake:** Click navigation
2. **Select EHR Tab:** Click "EHR Integration"
3. **Pull Patient History:**
   - Enter "Margaret Johnson"
   - Click "Pull Patient Data"
   - Show comprehensive patient data in popup
4. **Insert Patient History:**
   - Enter any name
   - Click "Insert to EHR"
   - Show success confirmation

### Scenario 4: Login Status Tracking

1. **View Dashboard:** Show patient list
2. **Point out indicators:**
   - Green "Online" badges
   - "Never logged in" status
   - Last login timestamps
3. **Explain Value:** Real-time engagement tracking

### Scenario 5: Risk Stratification

1. **Show Dashboard Overview:**
   - Total Patients: 8
   - High Risk: 3
   - Pending Check-ins: 4
   - Active Alerts: 1
2. **Sort by Risk:** Patients automatically sorted by risk score
3. **Filter Options:** Show different risk level filters
4. **Trend Visualization:** Point out sparkline graphs

---

## 🎨 Customizing Mock Data

### Add More Patients

Edit `/utils/mockData.ts`:

```typescript
export const mockPatients: Patient[] = [
  // Existing patients...
  {
    id: 'P009',
    name: 'Your Patient Name',
    age: 65,
    diagnosis: 'Your Diagnosis',
    dischargeDate: new Date().toISOString(),
    riskScore: 50,
    riskLevel: 'medium',
    riskFactors: ['Risk Factor 1', 'Risk Factor 2'],
    contactInfo: { 
      phone: '555-1234', 
      email: 'patient@email.com' 
    },
    // ... other fields
  }
];
```

### Modify Existing Patient Data

Just edit the values in `mockPatients` array. Changes appear immediately on refresh.

### Add Recommendations

```typescript
export const mockRecommendations: Recommendation[] = [
  // Existing recommendations...
  {
    id: 'R006',
    patientId: 'P009',
    type: 'medication',
    priority: 'high',
    title: 'Your Recommendation',
    description: 'Details here',
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
];
```

---

## 🔄 Features That Work in Demo Mode

### ✅ Fully Functional
- Patient dashboard with all filters
- Patient detail views
- Add new patients
- Search functionality
- Risk stratification
- Login status tracking
- EHR integration (simulated)
- SMS notifications (simulated)
- Dashboard statistics

### ⚠️ Simulated (No Real API Calls)
- EHR data pulling (generates mock data)
- EHR data insertion (shows confirmation only)
- SMS sending (shows success message only)
- Network delays (500ms simulated delay)

### ❌ Not Available in Demo Mode
- Real-time Supabase sync
- Persistent data storage (resets on page refresh)
- Actual email/SMS delivery
- Cross-device data sync

---

## 💡 Tips for Great Demos

### Before Your Demo

1. **Check Config:** Ensure `useMockData: true` in `/utils/config.ts`
2. **Refresh Page:** Start with a clean state
3. **Know Your Patients:** Review the 8 pre-loaded patients
4. **Prepare Scenarios:** Plan which features to showcase
5. **Test Add Patient:** Practice adding a patient beforehand

### During Your Demo

1. **Start with Overview:** Show dashboard stats
2. **Highlight High Risk:** Filter to show critical patients
3. **Deep Dive:** Click on James Anderson (critical patient)
4. **Show Workflow:** Add a new patient live
5. **EHR Integration:** Demonstrate pulling patient data
6. **Emphasize AI:** Point out AI risk scores and alerts

### Pro Tips

- **Speed:** Reduce `apiDelay` to 200ms for faster demos
- **Names:** Use memorable names when adding patients (e.g., "Demo Patient")
- **Filters:** Show filter combinations (High Risk + Needs Follow-up)
- **Story:** Create a narrative around patient care journey
- **Metrics:** Reference actual numbers ("3 high-risk patients, 4 pending check-ins")

---

## 🐛 Troubleshooting

### Data Not Showing?

**Check:** Is `useMockData: true` in `/utils/config.ts`?

### Changes Not Appearing?

**Solution:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Patients Disappear After Refresh?

**Expected:** Mock data resets on page reload in demo mode. This is normal.

### Want Persistent Demo Data?

**Solution:** Switch to real Supabase backend (`useMockData: false`)

---

## 📝 Data Persistence

### Demo Mode (useMockData: true)
- ❌ Data **does not persist** across page refreshes
- ✅ Data **persists** during same session (navigation, filters, etc.)
- ✅ New patients added are visible immediately
- ❌ Refreshing page resets to original 8 patients

### Real Backend Mode (useMockData: false)
- ✅ Data **persists** in Supabase database
- ✅ Data **syncs** across devices
- ✅ Data **survives** page refreshes
- ✅ Full production capabilities

---

## 🎬 Example Demo Script

### 1. Introduction (30 seconds)
*"CardioGuard is an AI-powered post-discharge heart patient management system. Let me show you how it works."*

### 2. Dashboard Overview (30 seconds)
*"We're currently managing 8 patients. 3 are high risk, 4 have pending daily check-ins, and we have 1 active critical alert."*

### 3. Risk Stratification (45 seconds)
*"Our AI automatically calculates risk scores. Let me filter to high-risk patients. Here's James Anderson - 85 risk score. He's reporting chest pain and shortness of breath, so we have a critical alert."*

### 4. Patient Onboarding (60 seconds)
*"Adding a new patient is simple. I'll create a profile for John Smith, 68 years old, just discharged with CHF. The system automatically generates secure credentials and calculates an initial risk score."*

### 5. EHR Integration (45 seconds)
*"We integrate with Epic and Cerner FHIR R4 APIs. Let me pull Margaret Johnson's history. We get her complete medical record, vitals, medications, everything we need."*

### 6. Closing (15 seconds)
*"This real-time dashboard helps care teams prioritize high-risk patients and prevent readmissions."*

**Total: ~3.5 minutes**

---

## 🚀 Advanced Configuration

### Adjust Simulated Network Delay

```typescript
// Faster demos (instant responses)
export const config = {
  apiDelay: 0, // No delay
};

// More realistic demos (slower network)
export const config = {
  apiDelay: 1000, // 1 second delay
};
```

### Debug Mode

```typescript
export const config = {
  demo: {
    showDebugInfo: true, // Shows mock data indicators
  }
};
```

### Auto-Refresh Dashboard

```typescript
export const config = {
  demo: {
    autoRefresh: true,
    refreshInterval: 30000, // Refresh every 30 seconds
  }
};
```

---

## 📊 Mock Data Statistics

- **Total Patients:** 8
- **High/Critical Risk:** 3 (37.5%)
- **Medium Risk:** 3 (37.5%)
- **Low Risk:** 2 (25%)
- **Pending Check-ins:** 4
- **Active Recommendations:** 5
- **Patients Online:** 3
- **Never Logged In:** 1
- **Average Risk Score:** 56

---

## 🔄 Switching Modes Mid-Demo

### From Demo to Real Backend

1. Open `/utils/config.ts`
2. Change `useMockData: true` → `useMockData: false`
3. Refresh page
4. Wait for Supabase data to load

### From Real Backend to Demo

1. Open `/utils/config.ts`
2. Change `useMockData: false` → `useMockData: true`
3. Refresh page
4. Mock data loads instantly

⚠️ **Warning:** Data doesn't transfer between modes. They use separate data sources.

---

## ✨ Best Practices

1. **Always Demo in Mock Mode** - Faster, more reliable
2. **Reset Before Presenting** - Refresh page for clean state
3. **Know Your Data** - Memorize key patient names/stats
4. **Practice Scenarios** - Run through demo flow 2-3 times
5. **Have Backup Plan** - Know how to switch to slides if tech fails
6. **Explain Mock Mode** - Be transparent: "This is demo data"
7. **Show Value First** - Features before implementation details

---

## 🎯 Ready to Demo!

With mock data mode, you can now:
- ✅ Demo anywhere, anytime (no internet required for mock data)
- ✅ Consistent, reliable demo experience
- ✅ No Supabase setup needed
- ✅ Instant load times
- ✅ Full feature showcase
- ✅ Add patients on the fly
- ✅ Professional presentation

**Toggle the config, refresh, and you're ready to impress!** 🚀
