# Smart AI Chat Engine - CardioGuard

## Overview

The CardioGuard messaging system now features an **intelligent, context-aware AI chat engine** that provides personalized responses to patients based on their medical history, current condition, and the content of their messages.

## 🎯 Key Features

### 1. **Intent Detection**
The system automatically identifies what the patient is asking about:
- 🚨 **Emergency** - Immediate life-threatening situations
- 💊 **Medication Questions** - Dosage, timing, side effects
- 🏥 **Appointment Requests** - Scheduling follow-ups
- 💔 **Symptom Reports** - Chest pain, shortness of breath, swelling, etc.
- 🧠 **Emotional Support** - Anxiety, depression, stress
- 🏃 **Lifestyle Questions** - Exercise, diet, sodium intake
- 📊 **Progress Inquiries** - Recovery status, improvement
- 👋 **Greetings & Gratitude** - Social niceties
- ❓ **General Health** - Other health-related questions

### 2. **Severity Assessment**
Each message is evaluated for urgency:
- **Critical** - Requires immediate action (911, ER)
- **High** - Needs same-day care team attention
- **Medium** - Should be reviewed within 2-4 hours
- **Low** - Standard response, no urgent action needed

### 3. **Context-Aware Responses**
The AI uses patient-specific data to personalize responses:
- Patient's first name
- Diagnosis (AMI, CHF, AFib, etc.)
- Risk level (critical, high, medium, low)
- Recovery streak
- Next appointment date
- Recent symptoms

### 4. **Multi-Turn Conversations**
- Remembers recent intents from the patient
- Asks intelligent follow-up questions
- Tracks escalation count
- Maintains conversation context

### 5. **Automatic Escalation**
- Alerts care team for critical symptoms
- Logs escalations in console (demo mode)
- Different escalation thresholds based on patient risk level
- Provides specific suggested actions

### 6. **Smart Features by Intent**

#### Emergency Detection
```
Keywords: "chest pain", "can't breathe", "call 911", "severe pain"
Response: Immediate 911 instruction + care team alert
```

#### Symptom Analysis
```
Chest Pain → Detailed assessment questions + immediate escalation
Shortness of Breath → Check for swelling, rest instructions
Dizziness → Medication review, hydration reminder
Swelling → Weight check, elevate legs, reduce salt
Fatigue → Sleep assessment, energy level check
```

#### Medication Support
```
Side Effects → Document symptoms, continue meds, alert care team
Missed Dose → Don't double up, set reminders
Timing Questions → Schedule guidance, routine building
```

#### Emotional Support
```
Anxiety → Breathing exercises, counseling resources
Depression → Immediate support, counseling referral, crisis line
Sleep Issues → Sleep hygiene tips, medication review
```

#### Lifestyle Coaching
```
Exercise → Safe activity levels, cardiac rehab info
Diet → Heart-healthy eating, sodium limits
Sodium → Daily targets, label reading tips
```

## 🏗️ Architecture

### Files
- **`/utils/smartChatEngine.ts`** - Core AI engine with intent detection and response generation
- **`/utils/mockData.ts`** - Updated to use smart chat engine in `sendMockMessage()`
- **`/components/patient/PatientMessaging.tsx`** - Enhanced UI with AI branding

### How It Works

1. **Patient sends message** → Captured in `PatientMessaging.tsx`
2. **Message sent to mock backend** → `sendMockMessage()` in `mockData.ts`
3. **Smart engine analyzes** → `generateSmartResponse()` in `smartChatEngine.ts`
   - Detects intent
   - Assesses severity
   - Loads patient context
   - Checks conversation history
4. **Response generated** → Context-aware, personalized reply
5. **Follow-up questions** → If appropriate, asks clarifying questions
6. **Escalation triggered** → If needed, alerts care team
7. **UI updated** → Real-time message display with typing indicators

## 💡 Example Conversations

### Symptom Report
```
Patient: "I'm having some chest discomfort"

AI: "Margaret, chest pain needs to be taken seriously. Can you describe 
it more? Is it sharp, dull, or pressure-like? Does it come with 
shortness of breath or sweating? I'm alerting your care team now - 
they'll reach out within the hour. If the pain is severe or worsening, 
please call 911 immediately."

Follow-up: "On a scale of 1-10, how severe is the pain?"
```

### Medication Question
```
Patient: "I forgot to take my medication this morning"

AI: "If you missed a dose, Robert, don't double up on the next one. 
Just take your next scheduled dose. For your heart medications, 
consistency is really important for your recovery. Consider setting 
phone alarms or using a pill organizer. I'll have your care team 
reach out about strategies to help you stay on track."
```

### Emotional Support
```
Patient: "I'm feeling anxious about my recovery"

AI: "Margaret, it's completely normal to feel anxious after Acute 
Myocardial Infarction. Your feelings are valid, and you're not alone 
in this. Recovery is not just physical - your mental health matters 
too. Try some deep breathing: breathe in for 4 counts, hold for 4, 
breathe out for 4. I'm connecting you with our care team who can 
provide counseling resources and possibly medication if needed."

Follow-up: "Would you like information about our cardiac counseling services?"
```

### Lifestyle Question
```
Patient: "Can I exercise today?"

AI: "Great question about exercise, Robert! Physical activity is 
important for your recovery from Congestive Heart Failure. Start 
slowly - even 5-10 minute walks are beneficial. Listen to your body 
and stop if you feel chest pain, severe shortness of breath, or 
dizziness. Your care team can provide personalized exercise guidelines. 
Many patients benefit from cardiac rehab programs."

Follow-up: "Have you been referred to a cardiac rehabilitation program?"
```

## 🚀 Testing the AI Chat

### Quick Replies Available
1. "I'm feeling good today! 😊"
2. "I have a question about my medication"
3. "I need to schedule an appointment"
4. "I'm experiencing some chest discomfort"
5. "I'm feeling anxious about my recovery"
6. "Can I exercise today?"

### Try These Messages
- "I'm having chest pain" → Emergency response
- "I missed my medication" → Medication guidance
- "I'm feeling dizzy" → Symptom assessment
- "I'm worried about my recovery" → Emotional support
- "Can I eat salt?" → Lifestyle coaching
- "How am I doing?" → Progress report
- "I need to schedule an appointment" → Appointment scheduling
- "I'm experiencing shortness of breath" → High-severity symptom response

## 🔧 Customization

### Adding New Intents
In `/utils/smartChatEngine.ts`, add keywords to detection arrays:
```typescript
const NEW_INTENT_KEYWORDS = ['keyword1', 'keyword2', 'keyword3'];
```

### Adding New Responses
In `generateResponse()` function, add a new case:
```typescript
if (intent === 'new_intent') {
  return {
    content: `Personalized response for ${firstName}...`,
    intent,
    severity: 'medium',
    shouldEscalate: true,
    followUpQuestion: 'Follow-up question?'
  };
}
```

### Adjusting Severity Thresholds
Modify `assessSeverity()` function to change escalation triggers.

## 🎨 UI Enhancements

- **AI Branding** - "AI-Powered Care Team Chat" header
- **Smart Typing Indicator** - Blue gradient with AI assistant label
- **Enhanced Quick Replies** - More diverse options including emotional support
- **System Messages** - Blue gradient background for AI responses
- **24/7 Support Badge** - "Intelligent responses • 24/7 support • Instant help"

## 🔮 Future Enhancements (Real AI Integration)

The system is designed to easily upgrade to real AI:

### Option 1: OpenAI GPT-4
```typescript
import OpenAI from 'openai';

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: patientMessage }
  ],
  functions: [escalationFunction, intentClassification]
});
```

### Option 2: Anthropic Claude
```typescript
import Anthropic from '@anthropic-ai/sdk';

const message = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1024,
  messages: [{ role: "user", content: patientMessage }]
});
```

### Option 3: RAG with Medical Guidelines
```typescript
// Retrieval-Augmented Generation
const context = await vectorStore.similaritySearch(patientMessage);
const response = await llm.generate({
  prompt: buildPrompt(context, patientData, patientMessage)
});
```

## 📊 Analytics & Monitoring

The system logs:
- All escalations (severity, intent, message preview)
- Conversation context (recent intents, escalation count)
- Intent distribution (for improving detection)

Console logs show:
```
🚨 CARE TEAM ALERT: HIGH - Patient P001 needs attention
Intent: symptom_report, Message: "I'm having chest pain"
```

## 🔒 Safety & Compliance

- **No PII Storage** - Conversations in memory only (demo mode)
- **Clear Escalation** - Critical symptoms trigger immediate alerts
- **Human-in-the-Loop** - AI assists, humans decide
- **Disclaimer** - Messages note response times for real care team
- **Emergency Override** - Always suggests 911 for critical situations

## 🎯 Key Benefits

1. **Instant Support** - Patients get immediate, helpful responses
2. **Reduced Anxiety** - 24/7 availability provides reassurance
3. **Better Triage** - Automatic escalation ensures urgent issues are prioritized
4. **Consistent Quality** - Every patient gets evidence-based guidance
5. **Care Team Efficiency** - Filters routine questions, escalates urgent ones
6. **Patient Engagement** - Interactive, personalized conversations
7. **Easy Upgrade Path** - Can swap to real AI without changing UI

## 🎓 Medical Guidelines Embedded

Responses include evidence-based guidance:
- AHA/ACC cardiac recovery guidelines
- Medication adherence best practices
- Heart-healthy lifestyle recommendations
- Mental health support resources
- Cardiac rehabilitation referrals

---

**Built with ❤️ for better cardiac care outcomes**
