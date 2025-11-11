# Quick Start: Creating and Onboarding Patients

## 🚀 5-Minute Setup Guide

This guide walks you through the complete patient creation and login workflow in CardioGuard.

---

## Step 1: Create a Patient Profile (Clinician Side)

### Login to Clinician Portal
1. Go to CardioGuard landing page
2. Click **"Clinician Portal"**
3. Enter credentials:
   - Email: `clinician@demo.com`
   - Password: `demo123`
4. Click **"Sign In to Clinician Portal"**

### Add New Patient
1. On the Patient Dashboard, click **"Add New Patient"** button (top right)
2. Fill out the form:

   **Personal Information**
   - Full Name: `John Smith`
   - Age: `65`

   **Contact Information**
   - Email: `john.smith@email.com`
   - Phone: `555-0123`

   **Medical Information**
   - Diagnosis: Select `Acute Myocardial Infarction`
   - Risk Factors: Click badges to add (e.g., Diabetes, Hypertension)
   - Or type custom risk factors

   **Initial Vital Signs** (Optional)
   - Blood Pressure: `140/90`
   - Heart Rate: `82`
   - Weight: `180`

3. Click **"Create Patient Profile"**

### Copy or Send Credentials
You'll see a success screen with credentials like:
```
Patient ID: P012345
Email: john.smith@email.com
Password: Abc123XYZ!@#
```

**Options:**
- Click **"Copy Credentials"** to copy to clipboard
- Click **"Send via SMS/Email"** to notify patient (mock)
- Manually share credentials with patient

4. Click **"Done"** to return to dashboard

---

## Step 2: Patient Logs In (Patient Side)

### Access Patient Portal
1. Logout from clinician portal (click Logout)
2. On landing page, click **"Patient Portal"**

### Select Hospital
1. You'll see the Hospital Selection screen
2. Search for your hospital:
   - Type hospital name or city in search box
   - Example: "St. Mary's" or "San Francisco"
3. Click on the hospital card to select it
4. Click **"Continue to Login"**

### Login with Credentials
1. Enter the credentials provided by your clinician:
   - Email: `john.smith@email.com`
   - Password: `Abc123XYZ!@#` (the one generated)
   - Name: `John Smith`
2. Click **"Sign In to Patient Portal"**

### Complete Onboarding
- First-time login shows onboarding screens
- Follow the prompts to complete setup

---

## Step 3: Verify Login Status (Clinician Side)

### Check Patient Status
1. Logout from patient portal
2. Login to clinician portal again
3. Find the patient you created on the dashboard
4. Look for the login status badge next to their name:
   - ✅ **"Logged In"** (green) = Patient has logged in
   - 🕒 **"Awaiting Login"** (gray) = Patient hasn't logged in yet

The dashboard automatically updates every 10 seconds, so you'll see the status change in real-time!

---

## 🎯 Quick Test Scenarios

### Scenario A: Complete Flow
```
1. Clinician creates patient → Takes credentials
2. Patient logs in with credentials
3. Clinician sees "Logged In" badge
```

### Scenario B: Demo Patient
Use existing demo credentials to test immediately:
```
Hospital: Any hospital
Email: patient@demo.com
Password: demo123
Name: Margaret Johnson
```

---

## 📋 Common Use Cases

### Creating Multiple Patients
1. Click **"Add New Patient"** for each patient
2. System generates unique credentials each time
3. All patients appear on dashboard with status badges

### Checking Who's Logged In
- Look at the badges on the patient dashboard
- Green "Logged In" = Active
- Gray "Awaiting Login" = Needs to log in

### Sending Credentials Again
- Copy credentials from initial screen
- Or manually create and share new credentials

---

## 🔧 Troubleshooting

**Problem**: Patient can't find their hospital
- **Solution**: Add more hospitals or search by city

**Problem**: Login credentials don't work
- **Solution**: Verify email and password exactly as shown (case-sensitive)
- **Fallback**: Use demo credentials (patient@demo.com / demo123)

**Problem**: Badge still shows "Awaiting Login"
- **Solution**: Wait 10 seconds for auto-refresh, or refresh the page

**Problem**: Can't see "Add New Patient" button
- **Solution**: Make sure you're logged in as a clinician, not a patient

---

## 💡 Pro Tips

1. **Copy Credentials Immediately**: The credential screen only shows once
2. **Use Strong Emails**: Helps prevent duplicate patient records
3. **Add Complete Info**: More complete profiles = better risk scores
4. **Track Login Times**: Badge updates show last login timestamp
5. **Mobile Friendly**: Works great on phones and tablets

---

## 🎓 Video Walkthrough (Conceptual)

**Part 1: Clinician Creates Patient (2 min)**
```
00:00 - Login to clinician portal
00:30 - Click "Add New Patient"
00:45 - Fill out patient form
01:30 - View generated credentials
01:45 - Copy/send credentials
02:00 - Return to dashboard
```

**Part 2: Patient Logs In (1.5 min)**
```
00:00 - Select hospital
00:30 - Enter credentials
01:00 - Complete onboarding
01:30 - View patient dashboard
```

**Part 3: Verify Status (0.5 min)**
```
00:00 - Return to clinician dashboard
00:15 - View "Logged In" badge
00:30 - Success!
```

---

## 📞 Need Help?

For issues or questions:
1. Check `/PATIENT_ONBOARDING_WORKFLOW.md` for detailed documentation
2. Review `/IMPLEMENTATION_SUMMARY.md` for technical details
3. Use demo credentials for testing without creating new patients

---

## ✅ Checklist

Before going live with real patients:

- [ ] Test complete flow with demo data
- [ ] Verify hospital list is accurate
- [ ] Confirm SMS/Email integration works (if using real notifications)
- [ ] Train care team on credential management
- [ ] Set up password security policies
- [ ] Enable production authentication system
- [ ] Review HIPAA compliance requirements

---

**Last Updated**: January 2025  
**Quick Start Complete!** 🎉
