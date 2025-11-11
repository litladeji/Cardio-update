# CardioGuard Patient & Clinician Portals

## Overview

CardioGuard now features comprehensive dual-sided portals designed to empower patients and provide actionable insights to care teams.

---

## 🧍‍♀️ Patient Portal Features

### 1. **Daily Health Check-Ins** ✅

**Location:** `DailyCheckIn.tsx`

**Features:**
- Simple, friendly interface with AI-guided questions
- Quick yes/no responses for common symptoms:
  - Shortness of breath
  - Chest pain
  - Swelling
  - Fatigue
- Weight and medication tracking
- Real-time AI analysis that updates risk scores
- **AI Classification:** Automatically categorizes responses as 🟢 Green / 🟡 Yellow / 🔴 Red

**User Flow:**
```
Patient Home → Start Check-in → Answer Questions → AI Analysis → Results & Recommendations
```

### 2. **Personal Progress Tracker** 📈

**Location:** `ProgressTracker.tsx`

**Visual Dashboards:**
- **Weight Trends:** 7-day chart with target goals
- **Heart Rate Monitoring:** Resting HR trends with normal range indicators
- **Symptom-Free Streaks:** Gamified counter to encourage engagement
- **Color-Coded Indicators:**
  - 🟢 Stable (on track)
  - 🟡 Watch (minor changes)
  - 🔴 Alert (needs attention)

**Insights Provided:**
- Daily fluctuations vs. concerning trends
- Progress towards weight targets
- Heart rate improvements over time
- Achievement milestones (7-day, 30-day streaks)

### 3. **Smart Alerts & Education** 🔔

**Automatic Notifications:**
- Real-time alerts when symptoms worsen
- Care team may reach out notification
- Medication reminders (future enhancement)

**Educational Micro-Tips:**
- Personalized to patient's condition
- Daily health tips based on risk factors
- Examples:
  - "Skipping one diuretic dose can affect recovery"
  - "Weigh yourself daily to catch fluid retention early"
  - "Short walks improve circulation and aid healing"

### 4. **Care Circle** (Caregiver Access) 👨‍👩‍👧

**Location:** `CareCircle.tsx`

**Functionality:**
- Add family members and caregivers
- Secure access control with notifications
- Share health status updates automatically

**What Care Circle Members See:**
- Daily check-in completion status
- Overall health status (green/yellow/red)
- Alerts when patient misses check-ins
- Notifications if symptoms worsen

**Privacy Controls:**
- Patient controls who has access
- Toggle notifications per member
- HIPAA-compliant data sharing
- Members see status, NOT detailed symptoms (unless patient shares)

**Setup Process:**
1. Patient adds member (name, relationship, email, phone)
2. Member receives secure link
3. Member verifies identity
4. Access granted with patient-defined permissions

### 5. **Two-Way Communication** 💬

**Location:** `PatientMessaging.tsx`

**Features:**
- **Direct Messaging:** Secure chat with care team
- **Quick Replies:** Pre-written common messages
  - "I'm feeling good today"
  - "I have a medication question"
  - "I need to schedule an appointment"
- **Click-to-Call:** Direct phone connection to care team
- **Response Time:** Usually within 2 hours during business hours
- **Message History:** Full conversation archive

**Voice Interface (Accessibility):**
- Future enhancement for elderly patients
- Voice-to-text dictation
- Text-to-speech for messages

### 6. **Privacy & Transparency** 🔐

**Data Sharing Dashboard:**
- Shows who can see patient data (care team only by default)
- What's shared and when
- Audit log of data access
- Simple consent toggles

**Controls:**
- Opt in/out of specific data sharing
- Revoke Care Circle access
- Download personal data (FHIR format)
- Request data deletion

---

## 👨‍⚕️ Clinician/Care Manager Dashboard

### 1. **AI Risk Stratification Dashboard** 🩸

**Location:** `PatientDashboard.tsx`

**Features:**
- **Risk-Ranked Patient List:** Auto-sorted by readmission risk score
- **Visual Risk Indicators:**
  - 🔴 Critical (75-100): Urgent intervention needed
  - 🟠 High (50-74): Schedule follow-up within 48 hours
  - 🟡 Medium (25-49): Enhanced monitoring
  - 🟢 Low (0-24): Standard care

**Filters:**
- Risk level (Critical/High/Medium/Low)
- Days since discharge (0-7, 7-14, 14-30)
- Hospital/unit
- Last check-in date
- Alert status (Red/Yellow/Green)

**Sorting Options:**
- Risk score (highest first)
- Days since discharge
- Last check-in date
- Patient name

### 2. **Real-Time Alerts** ⚠️

**Alert Types:**

**🔴 Red Alerts (Critical):**
- Severe symptoms reported (chest pain, severe SOB)
- Significant vital sign changes (BP >180/110 or <90/60)
- Multiple missed check-ins (3+ consecutive)
- Patient didn't respond to yellow alert follow-up

**🟡 Yellow Alerts (Warning):**
- Moderate symptoms reported
- Trending vital sign changes
- Missed medication doses
- Weight gain >2 lbs in 24 hours

**Alert Details:**
- Contributing factors highlighted
- AI-generated recommendation
- Suggested actions with priority
- One-click to mark as reviewed

**Example Alert:**
```
🔴 CRITICAL: Margaret Johnson (P001)
Risk Score: 82 | Days Since Discharge: 3

Contributing Factors:
• Reported severe shortness of breath
• Weight gain: +3 lbs in 24 hours
• BP: 168/98 (elevated)
• Missed morning diuretic dose

AI Recommendation:
Schedule urgent tele-visit within 4 hours. Consider:
• Diuretic dose adjustment
• Order chest X-ray if symptoms persist
• Monitor for pulmonary edema

[View Details] [Mark Reviewed] [Contact Patient]
```

### 3. **Patient Summary View** 🩺

**Location:** `PatientDetailView.tsx`

**Compact Profile Includes:**

**Demographics & Diagnosis:**
- Age, gender, primary diagnosis
- Discharge date, length of stay
- Comorbidities and risk factors

**Discharge Summary:**
- Admission reason
- Procedures performed
- Discharge medications
- Follow-up instructions

**Current Vital Trends:**
- Blood pressure (with sparkline chart)
- Heart rate (with sparkline chart)
- Weight (7-day trend)
- Oxygen saturation

**AI Insights:**
- Risk score with trend (↑ increasing, ↓ decreasing, → stable)
- Top 3 risk factors
- Predicted readmission probability
- Recommended interventions

**Recent Check-ins:**
- Last 7 days of patient-reported symptoms
- Alert classification history
- Compliance rate

**Care Team Notes:**
- Timestamped interventions
- Phone call logs
- Medication changes
- Appointment history

**Actions:**
- Log new note
- Mark intervention complete
- Send message to patient
- Schedule follow-up

### 4. **Two-Way Communication** 💬

**Secure Messaging:**
- Send messages directly to patients
- Templates for common scenarios:
  - Appointment reminders
  - Medication instructions
  - Encouragement messages ("Your numbers look better!")
  - Follow-up questions

**SMS Relay:**
- Send SMS to patient's phone
- Track delivery status
- Auto-log in patient record

**Phone Integration:**
- Click-to-call patient
- Call duration tracked
- Auto-generate call note template

---

## 🏥 Administrator Dashboard

**Location:** `AdministratorDashboard.tsx`

> **Note:** Analytics and comprehensive reporting are now **administrator-only** to provide executive-level insights while keeping the clinician interface focused on direct patient care.

### Executive Metrics

**Readmission Reduction:**
- Current 30-day rate: 13.2%
- Baseline rate: 18.5%
- Reduction: 28.6%
- Prevented readmissions: 12

**Financial Impact:**
- Total cost savings: $180,000
- Cost per readmission: $15,000
- Return on investment: 3.2x
- Net program cost

**Patient Engagement:**
- Total active patients: 500
- Average check-in rate: 89.5%
- Average streak days: 12
- Patient satisfaction: 94%

**Care Quality:**
- Quality score: 88/100
- Net Promoter Score: 67
- Model AUC: 0.84
- Clinician adoption: 92%

### Comprehensive Analytics & Reporting 📊

**Readmission Trends:**
- 30-day readmission rate over time (interactive line charts)
- Comparison to baseline and target goals
- Prevented readmission count
- Cost savings calculation and ROI metrics

**Risk Distribution Analysis:**
- Patient cohort breakdown by risk level (pie charts)
- High-risk vs. low-risk patient trends
- Risk score distribution over time
- Early intervention impact metrics

**Engagement Metrics:**
- Patient check-in completion rate
- Average check-in streak days
- Active patient rate (% completing daily check-ins)
- Clinician adoption rate (% using system daily)
- Weekly active clinician rate

**Cohort Analysis:**
- By diagnosis (MI, CHF, AFib)
- By risk level (High/Medium/Low)
- By age group
- By care manager
- By geographic region

**Quality Metrics:**
- Patient satisfaction scores
- Care quality score (0-100)
- Medication adherence rates
- AI model performance (AUC-ROC)
- Alert accuracy (true positive rate)
- Intervention effectiveness
- Patient outcomes tracking

**Cost & Financial Impact:**
- Total cost savings from prevented readmissions
- Cost per readmission ($15,000 avg)
- Return on investment (ROI) calculation
- Program vs. traditional care comparison

**Trend Visualizations:**
- Month-over-month readmission rate decline
- Engagement rate improvement trends
- Cost savings accumulation (bar charts)
- Quality score progression (line charts)
- Multi-metric comparison views

### Report Generation

**CMS Quality Report:**
- HRRP (Hospital Readmission Reduction Program) compliant
- Exportable for Medicare reimbursement
- Includes all required quality metrics
- Automatically formatted for submission

**Executive Summary PDF:**
- Comprehensive report for C-suite leadership
- Includes interactive charts, trends, and outcomes
- Stakeholder-friendly visualizations
- Board meeting ready format

**Data Export (Excel/CSV):**
- Raw data for custom analysis
- De-identified patient records
- Aggregate statistics and metrics
- Compatible with external analytics tools

**FHIR Export:**
- One-click download of complete FHIR-compliant dataset
- Hospital analytics system integration ready
- CMS quality reporting format
- De-identified research exports
- Epic/Cerner import compatible

### System Health Monitoring

**Integration Status:**
- EHR sync: Active ✓
- SMS service: Operational ✓
- AI model: 0.84 AUC ✓
- Average response time: 1.5 hours

**Performance Dashboards:**
- System uptime and reliability metrics
- Data sync status (real-time monitoring)
- API performance and response times
- User activity and engagement tracking

---

## 🎯 Key User Flows

### Patient Daily Routine

```
Morning:
1. Receive SMS reminder: "Good morning! Time for your CardioGuard check-in"
2. Open app/click link
3. Answer 5 simple questions (2 minutes)
4. See results: "Great job! You're on day 12 of your recovery streak! 🎉"
5. Read daily health tip

Throughout Day:
6. Check progress tracker to see weight/heart rate trends
7. Message care team with question about medication
8. Share status update with daughter via Care Circle

Evening:
9. Receive encouragement notification: "You completed your check-in! Keep it up!"
```

### Clinician Morning Workflow

```
Start of Shift:
1. Log in to clinician dashboard
2. Review overnight alerts
   - 2 red alerts (severe symptoms)
   - 5 yellow alerts (monitoring needed)
3. Prioritize critical patients (sorted by risk score)

For High-Risk Patient (e.g., Margaret Johnson):
4. Click patient name → View detailed summary
5. Review AI recommendation: "Schedule urgent follow-up within 48 hours"
6. Check recent check-ins and vital trends
7. Send secure message: "I noticed your weight increased. Let's schedule a call."
8. Mark intervention in system
9. Set reminder to follow up in 24 hours

Mid-Day:
10. Respond to patient messages
11. Update care notes after phone calls
12. Review and triage new alerts

End of Day:
13. Review pending alerts
14. Hand off critical cases to night shift
15. Document daily interventions and outcomes
```

### Administrator Monthly Review

```
1. Open administrator dashboard
2. Review key metrics:
   - Readmission reduction: ✓ 28.6%
   - Cost savings: ✓ $180K
   - ROI: ✓ 3.2x
3. Analyze trends:
   - Engagement improving month-over-month
   - Quality scores meeting targets
4. Generate reports:
   - CMS quality report for reimbursement
   - Executive summary PDF for board meeting
   - Data export for hospital analytics team
5. Review system health:
   - All integrations operational
   - Model performance stable
6. Plan improvements based on data insights
```

---

## 📱 Accessibility Features

### For Elderly Patients

1. **Large Text & Icons:** All UI elements sized for easy reading
2. **Simple Language:** Avoid medical jargon, use plain English
3. **Voice Options:** (Future) Voice-to-text for check-ins
4. **Emergency Buttons:** Prominent 911 and Care Team contact buttons
5. **SMS Option:** Can complete check-ins via text without app

### For Rural Patients

1. **Low Bandwidth Mode:** Optimized for slow connections
2. **SMS-Only Option:** Full functionality via text messages
3. **Offline Support:** Cache responses, sync when connected
4. **Phone Support:** Can complete check-in via automated phone call

### For Caregivers

1. **Care Circle Access:** Family can monitor without patient needing to update
2. **Automatic Alerts:** Notify if patient misses check-in
3. **Simplified Status:** Easy-to-understand green/yellow/red system
4. **Emergency Contacts:** Direct access to care team

---

## 🔒 Security & Compliance

### HIPAA Compliance
- End-to-end encryption (data at rest and in transit)
- Access audit logs
- Role-based access control (RBAC)
- Automatic session timeout
- Secure password requirements

### Data Privacy
- Patient consent management
- Right to access (download data)
- Right to deletion (request data removal)
- Data minimization (only collect what's needed)
- De-identification for research/analytics

### Caregiver Access Controls
- Identity verification required
- Patient must explicitly grant access
- Access can be revoked anytime
- Limited data visibility (status only, not details)
- All access logged and auditable

---

## 🚀 Future Enhancements

### Patient Portal
- **Wearable Integration:** Apple Watch, Fitbit sync
- **Voice Interface:** Alexa/Google Assistant check-ins
- **Multilingual Support:** Spanish, Mandarin, Vietnamese
- **Video Visits:** Built-in telemedicine
- **Medication Reminders:** Push notifications with pill tracker
- **Community Support:** Connect with other heart patients (anonymously)

### Clinician Portal
- **Predictive Alerts:** 7-day readmission forecasts
- **Auto-Generated Notes:** AI-written progress notes
- **Care Pathways:** Automated protocol suggestions
- **Population Health:** Cohort management tools
- **Integration:** Epic MyChart, Cerner messaging

### Administrator
- **Benchmarking:** Compare to other hospitals
- **Cost-Benefit Analysis:** ROI calculator
- **Staffing Optimization:** Workload distribution
- **Quality Improvement:** A/B testing interventions

---

## 📞 Support

**For Patients:**
- Care Team: 1-800-CARDIO-1
- Technical Support: support@cardioguard.ai
- Emergency: Call 911

**For Clinicians:**
- Clinical Support: clinician-support@cardioguard.ai
- Technical Issues: it-support@cardioguard.ai
- Training: training@cardioguard.ai

**For Administrators:**
- Account Management: admin@cardioguard.ai
- Custom Reports: analytics@cardioguard.ai
- API Access: developers@cardioguard.ai

---

**CardioGuard AI** - Empowering patients, enabling clinicians, and saving lives through intelligent post-discharge care.
