# EHR Integration Demo Guide

## 🎯 Quick Demo Instructions

When demonstrating the **Data Intake & Integration** → **EHR Integration** tab, use these patient names:

---

## 📥 PULL Patient History (Blue Card)

Use any of these existing patient names to pull data from the EHR:

### Recommended Demo Patients:

1. **Margaret Johnson** ✅ (Best for demo - main demo patient)
   - Primary demo patient
   - High-risk profile
   - Complete data set

2. **Robert Chen**
   - 65 years old
   - Congestive Heart Failure
   - Has completed check-ins

3. **Patricia Williams**
   - 58 years old
   - Atrial Fibrillation
   - Mid-range risk

4. **James Anderson**
   - 79 years old
   - Acute Myocardial Infarction
   - High risk factors

5. **Linda Martinez**
   - 68 years old
   - Heart Valve Replacement
   - Lower risk profile

6. **David Thompson**
   - 55 years old
   - Congestive Heart Failure
   - Multiple risk factors

---

## 📤 INSERT Patient History (Green Card)

Use any patient name - the system will confirm insertion. Suggested names:

1. **Robert Martinez** ✅ (Placeholder in UI)
2. **Sarah Williams**
3. **Michael Davis**
4. Any name from the pull list above

---

## 🎬 Demo Script

### For PULL Demo:
```
1. Navigate to: Data Intake & Integration → EHR Integration tab
2. In the blue "Pull Patient History" card
3. Type: Margaret Johnson
4. Click: "Pull Patient Data"
5. Wait for loading animation (~1.5 seconds)
6. Beautiful popup appears showing:
   ✓ Patient demographics (Name, ID, Diagnosis, Discharge Date)
   ✓ Risk Score: 68% (High Risk badge)
   ✓ Latest Vitals (BP: 138/86, HR: 78 bpm, Weight: 182 lbs, Temp: 98.6°F)
   ✓ Medications (4 items: Lisinopril, Metoprolol, Furosemide, Aspirin)
   ✓ EHR System: Epic FHIR R4
```

### For INSERT Demo:
```
1. In the green "Insert Patient History" card
2. Type: Robert Martinez (or any name)
3. Click: "Insert to EHR"
4. Wait for loading animation (~1.5 seconds)
5. Success toast appears:
   "✓ Patient data for Robert Martinez has been successfully inserted to Epic EHR"
6. Metrics refresh automatically
```

---

## 💡 What Happens Behind the Scenes

### Pull Action:
- Simulates FHIR R4 API call to Epic/Cerner
- Generates realistic mock patient data including:
  - Random EHR Patient ID
  - Diagnosis: "Congestive Heart Failure (CHF)"
  - Recent vitals and medications
  - Risk assessment score
  - Last check-in date

### Insert Action:
- Simulates posting CardioGuard data back to EHR
- Sends daily check-ins, risk scores, vital trends
- Shows confirmation toast
- Refreshes dashboard metrics

---

## 📊 Connection Status Card

At the bottom of the EHR tab, you'll see:
- **Epic FHIR R4**: Connected (green badge)
- **Total Pulls**: Current import count
- **Data Quality**: 95% completeness

---

## 🎨 Visual Highlights for Demo

1. **Color Coding**: Blue = Pull (retrieve), Green = Insert (send)
2. **Loading States**: Smooth spinner animations
3. **Popup Dialog**: Professional data display with color-coded sections
4. **Toast Notifications**: Success confirmations
5. **Gradient Backgrounds**: Modern, professional appearance

---

## ⚡ Pro Tips

- **Enter key works** on both input fields for faster demo
- Patient names are **case-insensitive** for the mock demo
- Pull dialog is **scrollable** for all data sections
- You can pull the same patient **multiple times** to show reliability
- Insert confirmation includes the **patient name** you typed

---

## 🔄 Reset/Refresh

If you need to refresh the dashboard:
- Click the **"Refresh Data"** button at bottom right
- Or refresh the browser page

---

**Perfect for:** Client demos, investor presentations, system walkthroughs, training sessions
