# Smart AI Chat - Quick Reference Card

## 🎯 Intent Detection Cheat Sheet

| Intent | Trigger Keywords | Example Message | Severity | Escalates? |
|--------|-----------------|-----------------|----------|------------|
| 🚨 **Emergency** | call 911, can't breathe, severe chest pain | "I'm having severe chest pain" | Critical | Yes ✅ |
| 💔 **Symptom** | chest pain, dizzy, swelling, tired, pain | "I'm feeling dizzy today" | Variable | Usually ✅ |
| 💊 **Medication** | medication, pill, side effect, dose | "Forgot to take my medication" | Medium | Yes ✅ |
| 📅 **Appointment** | appointment, schedule, follow-up, visit | "I need to schedule an appointment" | Low | Yes ✅ |
| 🧠 **Emotional** | anxious, depressed, stressed, worried | "I'm feeling anxious" | Medium-High | Yes ✅ |
| 🏃 **Lifestyle** | exercise, diet, food, walk, sodium | "Can I exercise today?" | Low | No ❌ |
| 📊 **Progress** | progress, recovery, how am I doing | "How's my recovery going?" | Low | No ❌ |
| 👋 **Greeting** | hello, hi, good morning | "Hello!" | Low | No ❌ |
| 🙏 **Gratitude** | thank you, thanks, appreciate | "Thank you!" | Low | No ❌ |

---

## 🎨 Response Characteristics

### By Severity Level

#### 🔴 Critical
- **Response Time:** Immediate (911)
- **Tone:** Urgent, directive
- **Actions:** Call 911, go to ER, alert care team
- **Example:** Severe chest pain, can't breathe

#### 🟠 High  
- **Response Time:** Within 1 hour
- **Tone:** Serious, supportive
- **Actions:** Rest, monitor, care team notified
- **Example:** Chest discomfort, dizziness

#### 🟡 Medium
- **Response Time:** Within 2-4 hours
- **Tone:** Helpful, informative
- **Actions:** Document, care team review
- **Example:** Medication questions, fatigue

#### 🟢 Low
- **Response Time:** Standard response
- **Tone:** Friendly, educational
- **Actions:** General guidance, no urgent escalation
- **Example:** Diet questions, greetings

---

## 💬 Sample Conversations

### Emergency
```
👤 "I can't breathe and have severe chest pain"
🤖 "[Name], I'm very concerned... Call 911 immediately..."
🚨 CRITICAL ALERT TRIGGERED
```

### Symptom Assessment
```
👤 "I'm feeling dizzy"
🤖 "[Name], dizziness can be concerning... medication review...
     sit down, stay hydrated... care team notified"
❓ "Did you take all your medications today?"
🟠 HIGH ALERT TRIGGERED
```

### Medication Help
```
👤 "I forgot my medication this morning"
🤖 "Don't double up... take next dose on schedule...
     set reminders... pill organizer suggestion"
❓ No follow-up (clear guidance given)
🟡 MEDIUM ALERT TRIGGERED
```

### Emotional Support
```
👤 "I'm feeling really anxious"
🤖 "[Name], completely normal after [diagnosis]...
     breathing exercise: 4-4-4... counseling resources"
❓ "Would you like information about counseling services?"
🟡 MEDIUM ALERT TRIGGERED
```

### Lifestyle Coaching
```
👤 "Can I start exercising?"
🤖 "Start slowly - 5-10 minute walks... listen to body...
     cardiac rehab programs"
❓ "Have you been referred to cardiac rehab?"
🟢 NO ALERT (Educational)
```

---

## 🔧 Context Used in Responses

| Patient Data | How It's Used | Example |
|--------------|---------------|---------|
| **First Name** | Personalization | "Hi Margaret..." |
| **Diagnosis** | Context for advice | "...after your AMI..." |
| **Risk Level** | Severity adjustment | High-risk → escalate more |
| **Recovery Streak** | Progress feedback | "15 days in a row!" |
| **Next Appointment** | Scheduling context | "Your appointment is [date]" |

---

## 🚀 Quick Test Commands

Copy-paste these into the chat:

### Test Emergency
```
I'm having severe chest pain and shortness of breath
```

### Test Symptom
```
I'm feeling a little dizzy and tired today
```

### Test Medication
```
I have a question about side effects from my medication
```

### Test Emotional
```
I'm feeling anxious about my recovery
```

### Test Lifestyle
```
Can I go for a walk today? What about my diet?
```

### Test Appointment
```
I need to schedule a follow-up appointment
```

### Test Progress
```
How am I doing with my recovery?
```

---

## 📊 Console Logs to Watch For

```javascript
// Critical escalation
🚨 CARE TEAM ALERT: CRITICAL - Patient P003 needs attention
Intent: emergency, Message: "I can't breathe..."

// High priority escalation  
🚨 CARE TEAM ALERT: HIGH - Patient P003 needs attention
Intent: symptom_report, Message: "I'm dizzy..."

// Medium priority escalation
🚨 CARE TEAM ALERT: MEDIUM - Patient P003 needs attention
Intent: medication_question, Message: "I forgot my pill..."
```

---

## ✨ UI Features

| Feature | Description | Visual |
|---------|-------------|--------|
| **AI Badge** | Sparkle icon on header | ✨ Blue sparkle overlay |
| **Typing Indicator** | Shows AI is "thinking" | Blue gradient bubble with dots |
| **Patient Messages** | Your sent messages | Blue/indigo gradient, right-aligned |
| **AI Messages** | System responses | Light blue gradient, left-aligned |
| **Care Team** | Human clinician messages | Purple/pink gradient, left-aligned |
| **Quick Replies** | Pre-written buttons | 6 common scenarios |

---

## 🎯 Response Time Indicators

- **AI Response:** ~800ms (typing indicator shown)
- **Follow-up Question:** +1.5s after main response
- **Human Care Team:** "within 2 hours" (noted in footer)
- **Emergency:** "Call 911 immediately" (bypasses queue)

---

## 🧩 Integration Points

### Current (Demo Mode)
```typescript
if (config.useMockData) {
  const response = generateSmartResponse(patientId, message);
  // Use smart AI engine
}
```

### Future (Production)
```typescript
if (config.useRealAI) {
  const response = await openai.chat.completions.create({...});
  // Use GPT-4/Claude
} else {
  const response = generateSmartResponse(patientId, message);
  // Fallback to smart pattern matching
}
```

---

## 📈 Success Metrics

### For Demo/MVP
- ✅ Detects all critical symptoms
- ✅ Provides context-aware responses
- ✅ Escalates appropriately
- ✅ Asks relevant follow-ups
- ✅ Uses patient data correctly
- ✅ Natural conversation flow

### For Production
- Response relevance score >90%
- Intent detection accuracy >95%
- Patient satisfaction (NPS) >70
- Care team time saved >40%
- Early symptom detection rate ↑
- Emergency escalation accuracy 100%

---

## 🛠️ Customization Quick Guide

### Add New Intent
1. Add keywords to detection array in `smartChatEngine.ts`
2. Add case in `detectIntent()` function
3. Add response logic in `generateResponse()`

### Modify Severity Thresholds
1. Edit `assessSeverity()` function
2. Adjust keyword arrays and patient risk logic

### Add New Response Template
1. Find intent in `generateResponse()`
2. Add new condition block with response object

### Change Escalation Rules
1. Modify `shouldEscalate` logic in response objects
2. Adjust critical/high severity triggers

---

## 🎓 Best Practices

### For Clinicians
- Review escalation logs daily
- Respond to high/critical alerts within SLA
- Provide feedback on AI accuracy
- Suggest new patterns to detect

### For Patients  
- Be specific about symptoms
- Use natural language (AI understands!)
- Report changes immediately
- Trust escalation guidance

### For Administrators
- Monitor intent distribution
- Track escalation accuracy
- Review patient satisfaction
- Plan upgrade to real AI when ready

---

## 📞 Support & Resources

- **Technical Docs:** `/SMART_AI_CHAT_README.md`
- **Demo Guide:** `/AI_CHAT_DEMO_GUIDE.md`
- **Implementation Summary:** `/SMART_AI_IMPLEMENTATION_SUMMARY.md`
- **Quick Reference:** This file!

---

**Print this and keep it handy during demos! 📋**
