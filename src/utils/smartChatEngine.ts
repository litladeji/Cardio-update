// Smart Chat Engine for CardioGuard
// Context-aware AI response system with intent detection and escalation

import { Patient, getMockPatientById } from './mockData';

// Intent types the system can detect
export type Intent = 
  | 'symptom_report'
  | 'medication_question'
  | 'appointment_request'
  | 'emotional_support'
  | 'general_health'
  | 'emergency'
  | 'progress_inquiry'
  | 'lifestyle_question'
  | 'greeting'
  | 'gratitude'
  | 'unknown';

// Severity levels for escalation
export type Severity = 'critical' | 'high' | 'medium' | 'low';

// Response structure
export interface SmartResponse {
  content: string;
  intent: Intent;
  severity: Severity;
  shouldEscalate: boolean;
  suggestedActions?: string[];
  followUpQuestion?: string;
}

// Conversation context (memory)
interface ConversationContext {
  recentIntents: Intent[];
  lastMessageTime: number;
  escalationCount: number;
}

// Store conversation context per patient
const conversationMemory: { [patientId: string]: ConversationContext } = {};

// Critical symptom keywords that trigger immediate escalation
const CRITICAL_SYMPTOMS = [
  'chest pain', 'severe pain', 'crushing pain', 'can\'t breathe', 'cannot breathe',
  'difficulty breathing', 'shortness of breath', 'dizzy', 'dizziness', 'faint',
  'fainting', 'passed out', 'unconscious', 'severe headache', 'confusion',
  'slurred speech', 'numbness', 'weakness', 'heart racing', 'palpitations',
  'irregular heartbeat', 'bleeding', 'vomiting blood', 'severe swelling',
  'blue lips', 'blue fingers', 'cold sweat'
];

// Emergency keywords that require immediate 911
const EMERGENCY_KEYWORDS = [
  'call 911', 'emergency', 'ambulance', 'help me', 'dying', 'heart attack',
  'stroke', 'can\'t breathe', 'severe chest pain', 'crushing pain'
];

// Medication-related keywords
const MEDICATION_KEYWORDS = [
  'medication', 'medicine', 'pill', 'prescription', 'dose', 'dosage',
  'side effect', 'side-effect', 'drug', 'tablet', 'metoprolol', 'lisinopril',
  'atorvastatin', 'aspirin', 'warfarin', 'blood thinner', 'statin'
];

// Appointment-related keywords
const APPOINTMENT_KEYWORDS = [
  'appointment', 'schedule', 'follow-up', 'follow up', 'visit', 'see doctor',
  'see my doctor', 'cardiologist', 'clinic', 'office visit', 'check-up', 'checkup'
];

// Emotional/mental health keywords
const EMOTIONAL_KEYWORDS = [
  'anxious', 'anxiety', 'worried', 'scared', 'afraid', 'depressed', 'sad',
  'overwhelmed', 'stressed', 'stress', 'can\'t sleep', 'insomnia', 'lonely',
  'hopeless', 'frustrated', 'angry', 'upset'
];

// Positive/gratitude keywords
const GRATITUDE_KEYWORDS = [
  'thank you', 'thanks', 'appreciate', 'grateful', 'helpful', 'great', 'good',
  'excellent', 'perfect', 'wonderful'
];

// Greeting keywords
const GREETING_KEYWORDS = [
  'hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening',
  'greetings', 'howdy'
];

// Lifestyle keywords
const LIFESTYLE_KEYWORDS = [
  'exercise', 'walk', 'walking', 'diet', 'food', 'eat', 'eating', 'nutrition',
  'weight', 'sleep', 'sleeping', 'stress', 'activity', 'sodium', 'salt', 'water',
  'hydration', 'alcohol', 'smoking'
];

// Progress inquiry keywords
const PROGRESS_KEYWORDS = [
  'progress', 'recovery', 'healing', 'improving', 'better', 'worse',
  'how am i doing', 'am i improving', 'getting better', 'doing okay', 'doing well'
];

/**
 * Detect the primary intent from the patient's message
 */
function detectIntent(message: string, patient: Patient): Intent {
  const lowerMessage = message.toLowerCase();
  
  // Check emergency first (highest priority)
  if (EMERGENCY_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'emergency';
  }
  
  // Check for critical symptoms
  if (CRITICAL_SYMPTOMS.some(symptom => lowerMessage.includes(symptom))) {
    return 'symptom_report';
  }
  
  // Check greetings
  if (GREETING_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'greeting';
  }
  
  // Check gratitude
  if (GRATITUDE_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'gratitude';
  }
  
  // Check medication questions
  if (MEDICATION_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'medication_question';
  }
  
  // Check appointment requests
  if (APPOINTMENT_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'appointment_request';
  }
  
  // Check emotional support needs
  if (EMOTIONAL_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'emotional_support';
  }
  
  // Check lifestyle questions
  if (LIFESTYLE_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'lifestyle_question';
  }
  
  // Check progress inquiries
  if (PROGRESS_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'progress_inquiry';
  }
  
  // Check for general symptoms
  const symptomKeywords = ['pain', 'hurts', 'ache', 'swelling', 'tired', 'fatigue', 
                           'nausea', 'symptom', 'feeling', 'uncomfortable'];
  if (symptomKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'symptom_report';
  }
  
  // Check for general health
  const healthKeywords = ['health', 'recovery', 'heart', 'condition', 'vitals'];
  if (healthKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'general_health';
  }
  
  return 'unknown';
}

/**
 * Assess severity of the message
 */
function assessSeverity(message: string, intent: Intent, patient: Patient): Severity {
  const lowerMessage = message.toLowerCase();
  
  // Emergency is always critical
  if (intent === 'emergency') {
    return 'critical';
  }
  
  // Check for critical symptoms
  if (CRITICAL_SYMPTOMS.some(symptom => lowerMessage.includes(symptom))) {
    return 'critical';
  }
  
  // Severity modifiers
  const severityWords = {
    critical: ['severe', 'extreme', 'worst', 'unbearable', 'can\'t', 'cannot'],
    high: ['bad', 'serious', 'concerning', 'worried', 'increasing', 'getting worse'],
    medium: ['moderate', 'some', 'mild', 'slight', 'occasional'],
    low: ['minor', 'little', 'barely', 'improving']
  };
  
  if (severityWords.critical.some(word => lowerMessage.includes(word))) {
    return 'critical';
  }
  
  if (severityWords.high.some(word => lowerMessage.includes(word))) {
    return 'high';
  }
  
  if (severityWords.medium.some(word => lowerMessage.includes(word))) {
    return 'medium';
  }
  
  // Patient's risk level influences severity
  if (patient.riskLevel === 'critical' || patient.riskLevel === 'high') {
    // Elevate severity for high-risk patients
    if (intent === 'symptom_report') return 'high';
  }
  
  return 'low';
}

/**
 * Generate context-aware response based on intent and patient data
 */
function generateResponse(
  message: string,
  intent: Intent,
  severity: Severity,
  patient: Patient,
  context: ConversationContext
): SmartResponse {
  const firstName = patient.name.split(' ')[0];
  
  // Emergency responses
  if (intent === 'emergency' || severity === 'critical') {
    return {
      content: `${firstName}, I'm very concerned about what you're experiencing. Please call 911 immediately or go to the nearest emergency room. If you're having chest pain, difficulty breathing, or other severe symptoms, this is a medical emergency that needs immediate attention. I'm also alerting your care team right now.`,
      intent,
      severity: 'critical',
      shouldEscalate: true,
      suggestedActions: ['Call 911', 'Go to ER', 'Contact emergency services']
    };
  }
  
  // Greeting responses
  if (intent === 'greeting') {
    const greetings = [
      `Hello ${firstName}! How are you feeling today? I'm here to help with any questions or concerns.`,
      `Hi ${firstName}! Great to hear from you. What can I help you with today?`,
      `Good day, ${firstName}! I hope your recovery is going well. How can I assist you?`
    ];
    return {
      content: greetings[Math.floor(Math.random() * greetings.length)],
      intent,
      severity: 'low',
      shouldEscalate: false,
      followUpQuestion: 'Is there anything specific I can help you with today?'
    };
  }
  
  // Gratitude responses
  if (intent === 'gratitude') {
    return {
      content: `You're very welcome, ${firstName}! I'm here whenever you need support. Your commitment to your recovery is inspiring. Keep up the great work! 💙`,
      intent,
      severity: 'low',
      shouldEscalate: false
    };
  }
  
  // Symptom report responses
  if (intent === 'symptom_report') {
    const lowerMessage = message.toLowerCase();
    
    // Check specific symptoms
    if (lowerMessage.includes('chest pain')) {
      return {
        content: `${firstName}, chest pain needs to be taken seriously. Can you describe it more? Is it sharp, dull, or pressure-like? Does it come with shortness of breath or sweating? I'm alerting your care team now - they'll reach out within the hour. If the pain is severe or worsening, please call 911 immediately.`,
        intent,
        severity: 'critical',
        shouldEscalate: true,
        suggestedActions: ['Monitor pain level', 'Rest', 'Call care team if worsens'],
        followUpQuestion: 'On a scale of 1-10, how severe is the pain?'
      };
    }
    
    if (lowerMessage.includes('short') && lowerMessage.includes('breath')) {
      return {
        content: `I understand you're experiencing shortness of breath, ${firstName}. This is important to address. Are you also experiencing swelling in your legs or sudden weight gain? I'm notifying your care team right away. Please rest and avoid physical activity. If breathing becomes severely difficult, call 911.`,
        intent,
        severity: 'high',
        shouldEscalate: true,
        suggestedActions: ['Rest', 'Monitor breathing', 'Check for swelling'],
        followUpQuestion: 'Have you noticed any swelling in your ankles or legs?'
      };
    }
    
    if (lowerMessage.includes('dizz') || lowerMessage.includes('lightheaded')) {
      return {
        content: `${firstName}, dizziness can be concerning after ${patient.diagnosis}. Have you been taking your medications as prescribed? Sometimes blood pressure medications can cause this. I'm letting your care team know. Please sit or lie down, stay hydrated, and avoid sudden movements. They'll review your medications and vitals.`,
        intent,
        severity: 'high',
        shouldEscalate: true,
        suggestedActions: ['Sit down', 'Stay hydrated', 'Avoid sudden movements'],
        followUpQuestion: 'Did you take all your medications today as prescribed?'
      };
    }
    
    if (lowerMessage.includes('swell')) {
      return {
        content: `Thanks for reporting the swelling, ${firstName}. Swelling can indicate fluid retention, which is important to monitor with your condition. Have you weighed yourself today? Any sudden weight gain? I'm alerting your care team - they may want to adjust your medications. In the meantime, try to elevate your legs and reduce salt intake.`,
        intent,
        severity: 'medium',
        shouldEscalate: true,
        suggestedActions: ['Weigh yourself daily', 'Elevate legs', 'Reduce salt'],
        followUpQuestion: 'Have you gained more than 2-3 pounds in the last few days?'
      };
    }
    
    if (lowerMessage.includes('tired') || lowerMessage.includes('fatigue')) {
      return {
        content: `${firstName}, fatigue is common during recovery from ${patient.diagnosis}, but we want to make sure it's normal. How's your sleep? Are you getting 7-8 hours? Your care team will follow up to check your energy levels and possibly adjust your treatment plan. Make sure you're eating well and staying hydrated.`,
        intent,
        severity: 'medium',
        shouldEscalate: severity !== 'low',
        suggestedActions: ['Rest adequately', 'Stay hydrated', 'Eat nutritious meals'],
        followUpQuestion: 'Are you able to do your normal daily activities, or is the fatigue limiting you?'
      };
    }
    
    // General symptom response
    return {
      content: `Thank you for sharing that with me, ${firstName}. I've recorded your symptoms and notified your care team. They'll review this and reach out within 2 hours. In the meantime, please rest and monitor how you're feeling. If anything changes or gets worse, message us immediately or call the care line.`,
      intent,
      severity,
      shouldEscalate: true,
      suggestedActions: ['Rest', 'Monitor symptoms', 'Stay hydrated'],
      followUpQuestion: 'Is there anything else you\'re experiencing that I should know about?'
    };
  }
  
  // Medication question responses
  if (intent === 'medication_question') {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('side effect')) {
      return {
        content: `${firstName}, it's important to address medication side effects. What symptoms are you experiencing? Some side effects are normal and temporary, while others need attention. I'm alerting your care team so they can review your medications. Never stop taking your heart medications without talking to your doctor first - it could be dangerous.`,
        intent,
        severity: 'high',
        shouldEscalate: true,
        suggestedActions: ['Document side effects', 'Continue medications', 'Wait for care team'],
        followUpQuestion: 'What specific side effects are you experiencing?'
      };
    }
    
    if (lowerMessage.includes('forgot') || lowerMessage.includes('missed')) {
      return {
        content: `If you missed a dose, ${firstName}, don't double up on the next one. Just take your next scheduled dose. For your heart medications, consistency is really important for your recovery. Consider setting phone alarms or using a pill organizer. I'll have your care team reach out about strategies to help you stay on track.`,
        intent,
        severity: 'medium',
        shouldEscalate: true,
        suggestedActions: ['Take next dose on schedule', 'Set medication reminders', 'Use pill organizer']
      };
    }
    
    if (lowerMessage.includes('when') || lowerMessage.includes('time')) {
      return {
        content: `Great question about medication timing, ${firstName}. It's best to take your heart medications at the same time each day. Your care team will reach out with specific guidance for your prescriptions. Generally, morning medications help protect you throughout the day. Check your prescription labels or your discharge instructions for specific timing.`,
        intent,
        severity: 'low',
        shouldEscalate: false,
        suggestedActions: ['Check prescription labels', 'Set daily reminders', 'Create routine']
      };
    }
    
    // General medication question
    return {
      content: `That's a great question about your medications, ${firstName}. Your heart medications are crucial for your recovery from ${patient.diagnosis}. I'm connecting you with your care team - they have access to your complete medication list and can give you detailed guidance. They'll respond within 2 hours.`,
      intent,
      severity: 'medium',
      shouldEscalate: true,
      suggestedActions: ['Continue current medications', 'Wait for care team response']
    };
  }
  
  // Appointment request responses
  if (intent === 'appointment_request') {
    const nextAppt = patient.nextAppointment 
      ? new Date(patient.nextAppointment).toLocaleDateString()
      : 'not yet scheduled';
    
    return {
      content: `I can help with that, ${firstName}! Your next appointment is currently ${nextAppt}. I'm notifying your care coordinator who will reach out within 4 hours to schedule or reschedule your appointment. Is this for a routine follow-up or do you have specific concerns we should address?`,
      intent,
      severity: 'low',
      shouldEscalate: true,
      suggestedActions: ['Wait for care coordinator', 'Prepare questions for appointment'],
      followUpQuestion: 'Is this a routine follow-up or do you have specific symptoms you need to discuss?'
    };
  }
  
  // Emotional support responses
  if (intent === 'emotional_support') {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return {
        content: `${firstName}, it's completely normal to feel anxious after ${patient.diagnosis}. Your feelings are valid, and you're not alone in this. Recovery is not just physical - your mental health matters too. Try some deep breathing: breathe in for 4 counts, hold for 4, breathe out for 4. I'm connecting you with our care team who can provide counseling resources and possibly medication if needed.`,
        intent,
        severity: 'medium',
        shouldEscalate: true,
        suggestedActions: ['Practice deep breathing', 'Talk to care team', 'Consider counseling'],
        followUpQuestion: 'Would you like information about our cardiac counseling services?'
      };
    }
    
    if (lowerMessage.includes('depressed') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
      return {
        content: `${firstName}, I'm really glad you reached out. Depression after a cardiac event is more common than you might think - you're not alone. Your mental health is just as important as your physical recovery. I'm alerting your care team right away. They can connect you with a counselor who specializes in cardiac recovery. If you're having thoughts of self-harm, please call 988 (Suicide Prevention Lifeline) immediately.`,
        intent,
        severity: 'high',
        shouldEscalate: true,
        suggestedActions: ['Talk to care team', 'Consider counseling', 'Call 988 if needed'],
        followUpQuestion: 'Would you like me to have someone call you today to talk about this?'
      };
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      return {
        content: `Sleep problems are frustrating, ${firstName}, and they can impact your recovery. Good sleep helps your heart heal. Try keeping a consistent bedtime, avoiding screens an hour before bed, and making your room cool and dark. I'm letting your care team know - they can check if any of your medications might be affecting sleep and suggest solutions.`,
        intent,
        severity: 'medium',
        shouldEscalate: true,
        suggestedActions: ['Keep consistent sleep schedule', 'Limit screen time before bed', 'Review medications']
      };
    }
    
    // General emotional support
    return {
      content: `Thank you for sharing how you're feeling, ${firstName}. Recovering from ${patient.diagnosis} is challenging - both physically and emotionally. It's a sign of strength to talk about it. Your care team is here to support all aspects of your recovery. They'll reach out soon to see how they can help. Remember, you're doing great by staying engaged in your care! 💙`,
      intent,
      severity: 'medium',
      shouldEscalate: true,
      suggestedActions: ['Stay connected', 'Talk to care team', 'Practice self-compassion']
    };
  }
  
  // Lifestyle question responses
  if (intent === 'lifestyle_question') {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('walk')) {
      return {
        content: `Great question about exercise, ${firstName}! Physical activity is important for your recovery from ${patient.diagnosis}. Start slowly - even 5-10 minute walks are beneficial. Listen to your body and stop if you feel chest pain, severe shortness of breath, or dizziness. Your care team can provide personalized exercise guidelines. Many patients benefit from cardiac rehab programs.`,
        intent,
        severity: 'low',
        shouldEscalate: false,
        suggestedActions: ['Start with short walks', 'Listen to your body', 'Ask about cardiac rehab'],
        followUpQuestion: 'Have you been referred to a cardiac rehabilitation program?'
      };
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return {
        content: `Nutrition is a key part of your recovery, ${firstName}! Focus on a heart-healthy diet: lots of vegetables, fruits, whole grains, lean proteins, and healthy fats. Limit sodium (aim for under 2000mg/day), avoid processed foods, and watch portion sizes. I can have our nutritionist reach out with personalized meal planning if you'd like.`,
        intent,
        severity: 'low',
        shouldEscalate: false,
        suggestedActions: ['Eat heart-healthy foods', 'Limit sodium', 'Read nutrition labels'],
        followUpQuestion: 'Would you like to speak with our nutritionist for personalized meal planning?'
      };
    }
    
    if (lowerMessage.includes('sodium') || lowerMessage.includes('salt')) {
      return {
        content: `Good thinking about sodium, ${firstName}! Excess salt can increase blood pressure and fluid retention, which is especially important to avoid with ${patient.diagnosis}. Aim for less than 2000mg daily. Avoid processed foods, canned soups, and restaurant meals - they're often very high in sodium. Read labels carefully!`,
        intent,
        severity: 'low',
        shouldEscalate: false,
        suggestedActions: ['Read food labels', 'Avoid processed foods', 'Track daily sodium']
      };
    }
    
    // General lifestyle response
    return {
      content: `That's a great question about healthy lifestyle, ${firstName}! Making positive changes really supports your recovery from ${patient.diagnosis}. Your care team can provide specific guidance tailored to your situation. I'm letting them know you have questions about lifestyle modifications.`,
      intent,
      severity: 'low',
      shouldEscalate: false,
      suggestedActions: ['Focus on heart-healthy habits', 'Ask care team for guidance']
    };
  }
  
  // Progress inquiry responses
  if (intent === 'progress_inquiry') {
    const streak = patient.recoveryStreak || 0;
    const riskImprovement = patient.riskLevel === 'low' || patient.riskLevel === 'medium';
    
    return {
      content: `${firstName}, you're making ${riskImprovement ? 'excellent' : 'steady'} progress! You've completed ${streak} daily check-ins in a row - that's fantastic commitment. ${riskImprovement ? 'Your care team is pleased with your recovery trajectory.' : 'Your care team is closely monitoring your recovery.'} Keep up your medications, healthy eating, gentle exercise, and daily check-ins. Your dedication is the key to successful recovery! 💙`,
      intent,
      severity: 'low',
      shouldEscalate: false,
      suggestedActions: ['Continue daily check-ins', 'Maintain healthy habits', 'Stay consistent with medications'],
      followUpQuestion: 'Is there any specific aspect of your recovery you\'d like to know more about?'
    };
  }
  
  // General health responses
  if (intent === 'general_health') {
    return {
      content: `Thanks for checking in, ${firstName}. Your recovery from ${patient.diagnosis} is important to us. I'm here to help with any questions about your medications, symptoms, appointments, or lifestyle changes. What specific aspect of your health would you like to discuss?`,
      intent,
      severity: 'low',
      shouldEscalate: false,
      followUpQuestion: 'What would you like to know more about - medications, symptoms, diet, exercise, or appointments?'
    };
  }
  
  // Unknown intent - intelligent fallback
  return {
    content: `Thank you for your message, ${firstName}. I want to make sure I understand correctly so I can help you best. Could you tell me a bit more? For example, are you asking about symptoms, medications, appointments, or something else? A care team member is available to chat if you'd prefer to speak with someone directly.`,
    intent: 'unknown',
    severity: 'low',
    shouldEscalate: false,
    followUpQuestion: 'What would you most like help with today?',
    suggestedActions: ['Provide more details', 'Choose a topic', 'Request call back']
  };
}

/**
 * Get or initialize conversation context
 */
function getConversationContext(patientId: string): ConversationContext {
  if (!conversationMemory[patientId]) {
    conversationMemory[patientId] = {
      recentIntents: [],
      lastMessageTime: Date.now(),
      escalationCount: 0
    };
  }
  return conversationMemory[patientId];
}

/**
 * Update conversation context
 */
function updateConversationContext(
  patientId: string,
  intent: Intent,
  shouldEscalate: boolean
): void {
  const context = getConversationContext(patientId);
  
  // Add intent to recent history (keep last 5)
  context.recentIntents.push(intent);
  if (context.recentIntents.length > 5) {
    context.recentIntents.shift();
  }
  
  // Update escalation count
  if (shouldEscalate) {
    context.escalationCount++;
  }
  
  // Update last message time
  context.lastMessageTime = Date.now();
}

/**
 * Main entry point: Generate smart response
 */
export function generateSmartResponse(
  patientId: string,
  message: string
): SmartResponse {
  // Get patient data
  const patient = getMockPatientById(patientId);
  if (!patient) {
    return {
      content: 'I\'m having trouble accessing your patient information. Please try again or contact support.',
      intent: 'unknown',
      severity: 'low',
      shouldEscalate: true
    };
  }
  
  // Get conversation context
  const context = getConversationContext(patientId);
  
  // Detect intent
  const intent = detectIntent(message, patient);
  
  // Assess severity
  const severity = assessSeverity(message, intent, patient);
  
  // Generate contextual response
  const response = generateResponse(message, intent, severity, patient, context);
  
  // Update conversation memory
  updateConversationContext(patientId, intent, response.shouldEscalate);
  
  return response;
}

/**
 * Check if response requires care team escalation
 */
export function requiresEscalation(response: SmartResponse): boolean {
  return response.shouldEscalate;
}

/**
 * Get escalation notification for care team
 */
export function getEscalationNotification(
  patientId: string,
  message: string,
  response: SmartResponse
): string {
  const patient = getMockPatientById(patientId);
  if (!patient) return '';
  
  const severityLabel = response.severity.toUpperCase();
  const intentLabel = response.intent.replace('_', ' ').toUpperCase();
  
  return `[${severityLabel} ALERT] ${patient.name} (${patientId}): ${intentLabel} - "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`;
}
