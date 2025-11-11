# 🎯 Prompts to Recreate EHR Integration Feature

Use these prompts in sequence on your original project to recreate the exact EHR integration we just built.

---

## 📋 Context Prompt (Start Here)

```
I have a CardioGuard AI-powered post-discharge heart patient management system. 
There's a DataIntakeDashboard component at /components/DataIntakeDashboard.tsx 
that has an "EHR Integration" tab. 

Currently, the EHR tab shows a complex import form with patient IDs and sync logs.

I want to completely redesign this tab to show TWO simple actions that clinicians 
can perform for demo purposes:

1. Pull Patient History (retrieve data FROM EHR)
2. Insert Patient History (send data TO EHR)

Can you help me redesign this?
```

---

## 🎨 Detailed Requirements Prompt

```
Here's exactly what I need for the EHR Integration tab redesign:

## Two Main Cards (Side by Side):

### Card 1: Pull Patient History (Left - Blue themed)
- Title: "Pull Patient History" with a Search icon
- Description: "Retrieve patient data from the hospital EHR system (Epic/Cerner FHIR R4)"
- Input field: Single text input for patient name (placeholder: "Enter patient name (e.g., Margaret Johnson)")
- Button: "Pull Patient Data" with Download icon
- Info box: Blue alert explaining this pulls data from Epic FHIR R4 API
- Bottom section: Show what data is retrieved (Demographics, Diagnosis, Vitals, Medications) with checkmarks
- Use blue/indigo gradient background (from-blue-50 to-indigo-50)

### Card 2: Insert Patient History (Right - Green themed)
- Title: "Insert Patient History" with Upload icon
- Description: "Send patient data from CardioGuard back to the hospital EHR system"
- Input field: Single text input for patient name (placeholder: "Enter patient name (e.g., Robert Martinez)")
- Button: "Insert to EHR" with Upload icon
- Info box: Green alert explaining data will be inserted to Epic/Cerner EHR
- Bottom section: Show what data is inserted (Check-ins, Risk scores, Vital trends, Alerts) with checkmarks
- Use green/emerald gradient background (from-green-50 to-emerald-50)

### Card 3: EHR Connection Status (Bottom - Full Width)
- Title: "EHR Connection Status"
- Show 3 metrics in a grid:
  1. Epic FHIR R4 connection status (Connected badge, last sync time)
  2. Total Pulls count
  3. Data Quality percentage

## Functionality:

### Pull Patient History:
- When user types a name and clicks "Pull Patient Data"
- Show loading state (spinner animation for 1.5 seconds)
- Open a Dialog/Modal popup showing complete patient data:
  - Patient name & EHR ID (random generated)
  - Diagnosis: "Congestive Heart Failure (CHF)"
  - Discharge date (7 days ago)
  - Risk Score: 68% with "High Risk" red badge
  - Latest Vitals section (BP: 138/86, HR: 78 bpm, Weight: 182 lbs, Temp: 98.6°F)
  - Medications list (4 items: Lisinopril, Metoprolol, Furosemide, Aspirin)
  - EHR System: "Epic FHIR R4"
  - Last check-in date
- Toast notification: "Successfully pulled data for [name] from EHR"
- This is MOCK DATA for demo purposes

### Insert Patient History:
- When user types a name and clicks "Insert to EHR"
- Show loading state (spinner animation for 1.5 seconds)
- Show success toast: "✓ Patient data for [name] has been successfully inserted to Epic EHR"
- Clear the input field
- Refresh dashboard metrics
- This is DEMO functionality only

## Technical Requirements:
- Import Dialog component from shadcn/ui
- Add state variables: pullPatientName, insertPatientName, showPatientDataDialog, pulledPatientData, pulling, inserting
- Create two handler functions: handlePullPatient() and handleInsertPatient()
- Both inputs should support Enter key to submit
- Use loading states with disabled buttons during API calls
- Use setTimeout() to simulate API delays (1500ms)

Do you understand what I need?
```

---

## 🔧 Implementation Prompt

```
Perfect! Now please implement this in the /components/DataIntakeDashboard.tsx file.

Please:
1. Import the Dialog component from './ui/dialog'
2. Add Search and Heart icons from lucide-react
3. Add all the state variables I mentioned
4. Create the handlePullPatient() function that generates mock patient data
5. Create the handleInsertPatient() function that shows confirmation
6. Replace the entire EHR Integration tab section (the part inside `{activeTab === 'ehr' && (...)})
7. Add the Dialog component at the end (after the closing of all tabs, but before the Refresh button)

The Dialog should be beautiful with color-coded sections:
- Patient info: Blue background
- Risk score: Red/orange background  
- Vitals: Green background
- Medications: Purple background
- System info: Gray background

Make it look professional and modern with gradients matching the existing CardioGuard design system.
```

---

## ✅ Verification Prompt

```
Great! Now let's verify it works:

1. Can you confirm the Pull Patient History card is on the left with blue theme?
2. Can you confirm the Insert Patient History card is on the right with green theme?
3. Can you confirm there's an EHR Connection Status card at the bottom?
4. Can you confirm the Dialog popup shows all patient data sections when pulling?
5. Can you confirm both actions show loading states and toast notifications?

If yes to all, we're done! If not, let me know what needs adjustment.
```

---

## 🎨 Optional: Styling Refinement Prompt

```
The functionality works! Can you make these visual improvements:

1. Make the input fields have white background (bg-white class)
2. Add "Enter key" support to both input fields
3. Make the buttons use gradient backgrounds:
   - Pull button: from-blue-600 to-indigo-600
   - Insert button: from-green-600 to-emerald-600
4. Add flex-shrink-0 to AlertCircle icons so they don't squish
5. Make the Dialog max height 80vh with overflow-y-auto so it's scrollable
6. Add a "Close" button at the bottom of the Dialog

Make it look polished and production-ready!
```

---

## 📝 Testing Prompt

```
Perfect! Now let's test the demo flow:

For Pull Patient History, suggest using these patient names from the existing system:
- Margaret Johnson (main demo patient)
- Robert Chen
- Patricia Williams
- James Anderson
- Linda Martinez
- David Thompson

For Insert Patient History, any name works since it's demo functionality.

Can you create a quick demo guide (markdown file) showing:
1. What patient names to use
2. What happens when you click each button
3. What data shows in the popup
4. What toast messages appear

Save it as /EHR_DEMO_GUIDE.md
```

---

## 🚀 Usage Instructions

### How to Use These Prompts:

1. **Copy the Context Prompt** → Send to AI
2. **Wait for AI response** confirming understanding
3. **Copy the Detailed Requirements Prompt** → Send to AI
4. **Wait for AI response** confirming understanding
5. **Copy the Implementation Prompt** → Send to AI
6. **Let AI implement the feature**
7. **Copy the Verification Prompt** → Check everything works
8. **Optional: Copy Styling Refinement Prompt** → Polish the UI
9. **Optional: Copy Testing Prompt** → Get demo guide

### Tips:

- ✅ Send prompts **one at a time** and wait for responses
- ✅ If AI asks clarifying questions, refer back to the detailed requirements
- ✅ Mention you want to preserve existing functionality in other tabs
- ✅ Specify you want MOCK/DEMO data, not real API calls
- ✅ Emphasize the blue/green color theming for visual clarity

### Expected Files Modified:

- `/components/DataIntakeDashboard.tsx` - Main implementation

### Expected Files Created:

- `/EHR_DEMO_GUIDE.md` - Demo instructions (optional)

---

## 🎯 Key Points to Emphasize

When using these prompts, make sure the AI understands:

1. **This is for DEMO purposes** - Mock data, simulated delays
2. **Two distinct actions** - Pull (retrieve) vs Insert (send)
3. **Color coding matters** - Blue = Pull, Green = Insert
4. **Professional appearance** - Gradients, smooth animations, toast notifications
5. **Dialog popup for Pull** - Shows comprehensive patient data overview
6. **Simple confirmation for Insert** - Just a toast message
7. **Enter key support** - Better UX for demos
8. **Loading states** - Shows system is "working"

---

## 🔄 If You Get Stuck

If the AI doesn't understand or implements it differently:

### Clarification Prompt:
```
Let me be more specific. I want the EHR Integration tab to look like this:

[Left Card - Blue]     [Right Card - Green]
Pull Patient History   Insert Patient History

When I type "Margaret Johnson" in the left card and click the button,
a popup dialog should appear showing her medical data like a patient chart.

When I type any name in the right card and click the button,
just show a toast message confirming the data was inserted to EHR.

Can you show me the code for just the two cards first?
```

---

## ✨ Final Result

After using all prompts, you should have:

✅ Two-card layout for Pull and Insert actions  
✅ Beautiful dialog popup showing patient data when pulling  
✅ Toast confirmation when inserting  
✅ Loading states with spinners  
✅ Professional gradients and color coding  
✅ EHR connection status display  
✅ Demo guide with patient names to use  
✅ Enter key support on inputs  
✅ Smooth animations and transitions  

**Ready for client demos and investor presentations!** 🎬
