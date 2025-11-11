import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Types
interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  dischargeDate: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
  lastCheckIn?: string;
  vitalSigns?: {
    bloodPressure: string;
    heartRate: number;
    weight: number;
  };
  recoveryStreak?: number;
  dailyCheckInStatus?: 'pending' | 'completed';
  aiAlertLevel?: 'green' | 'yellow' | 'red';
  patientReportedSymptoms?: string[];
  onboarded?: boolean;
  nextAppointment?: string;
}

interface Recommendation {
  action: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface CheckIn {
  patientId: string;
  date: string;
  symptoms: string[];
  vitalSigns?: {
    bloodPressure: string;
    heartRate: number;
    weight: number;
  };
  notes?: string;
  aiClassification?: 'green' | 'yellow' | 'red';
  patientResponses?: {
    question: string;
    answer: string;
  }[];
  mood?: string;
  energyLevel?: number;
}

interface DailyCheckInSubmission {
  patientId: string;
  responses: {
    question: string;
    answer: string;
  }[];
  symptoms: string[];
  mood: string;
  energyLevel: number;
}

// Mock predictive model - calculates risk score based on patient factors
function calculateRiskScore(patient: any): number {
  let score = 0;
  
  // Age factor
  if (patient.age > 75) score += 30;
  else if (patient.age > 65) score += 20;
  else if (patient.age > 55) score += 10;
  
  // Diagnosis severity
  if (patient.diagnosis?.includes('MI') || patient.diagnosis?.includes('Infarction')) score += 25;
  if (patient.diagnosis?.includes('Failure')) score += 20;
  if (patient.diagnosis?.includes('Arrhythmia')) score += 15;
  
  // Days since discharge
  const daysSinceDischarge = Math.floor(
    (new Date().getTime() - new Date(patient.dischargeDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceDischarge < 7) score += 15;
  else if (daysSinceDischarge < 14) score += 10;
  
  // Risk factors
  const riskFactors = patient.riskFactors || [];
  score += riskFactors.length * 5;
  
  // Vital signs (if available)
  if (patient.vitalSigns) {
    const [systolic] = patient.vitalSigns.bloodPressure.split('/').map(Number);
    if (systolic > 140 || systolic < 90) score += 10;
    if (patient.vitalSigns.heartRate > 100 || patient.vitalSigns.heartRate < 50) score += 10;
  }
  
  return Math.min(100, score);
}

function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

function generateRecommendations(patient: Patient): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  if (patient.riskLevel === 'critical' || patient.riskLevel === 'high') {
    recommendations.push({
      action: 'Schedule urgent follow-up within 48 hours',
      rationale: `Patient has ${patient.riskLevel} risk score (${patient.riskScore}). Early intervention critical for preventing readmission.`,
      priority: 'high',
      category: 'Follow-up Care'
    });
  }
  
  if (!patient.lastCheckIn) {
    recommendations.push({
      action: 'Initiate daily symptom check-in protocol',
      rationale: 'No recent check-ins recorded. Regular monitoring helps detect early warning signs.',
      priority: 'high',
      category: 'Patient Engagement'
    });
  }
  
  if (patient.riskFactors.includes('Diabetes') || patient.riskFactors.includes('Hypertension')) {
    recommendations.push({
      action: 'Review medication adherence',
      rationale: 'Comorbidities present. Medication non-adherence is a top readmission driver.',
      priority: 'medium',
      category: 'Medication Management'
    });
  }
  
  if (patient.vitalSigns) {
    const [systolic, diastolic] = patient.vitalSigns.bloodPressure.split('/').map(Number);
    if (systolic > 140 || diastolic > 90) {
      recommendations.push({
        action: 'BP management consult',
        rationale: `Recent BP reading ${patient.vitalSigns.bloodPressure} exceeds target range.`,
        priority: 'high',
        category: 'Clinical Intervention'
      });
    }
  }
  
  const daysSinceDischarge = Math.floor(
    (new Date().getTime() - new Date(patient.dischargeDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceDischarge < 7) {
    recommendations.push({
      action: 'Conduct post-discharge call',
      rationale: 'Patient in critical first week post-discharge. Personal outreach reduces anxiety and catches issues early.',
      priority: 'high',
      category: 'Care Coordination'
    });
  }
  
  return recommendations;
}

// AI Classification Logic for Daily Check-ins
function classifyCheckIn(submission: DailyCheckInSubmission): 'green' | 'yellow' | 'red' {
  let redFlags = 0;
  let yellowFlags = 0;
  
  // Critical symptoms that trigger red alert
  const criticalSymptoms = [
    'severe chest pain',
    'difficulty breathing',
    'severe shortness of breath',
    'fainting',
    'severe swelling',
    'chest pressure',
    'cannot catch breath'
  ];
  
  // Warning symptoms that trigger yellow alert
  const warningSymptoms = [
    'shortness of breath',
    'mild chest pain',
    'swelling',
    'fatigue',
    'dizziness',
    'rapid heartbeat',
    'weight gain',
    'reduced appetite'
  ];
  
  // Check for critical symptoms
  submission.symptoms.forEach(symptom => {
    const lowerSymptom = symptom.toLowerCase();
    if (criticalSymptoms.some(cs => lowerSymptom.includes(cs))) {
      redFlags++;
    } else if (warningSymptoms.some(ws => lowerSymptom.includes(ws))) {
      yellowFlags++;
    }
  });
  
  // Check responses for concerning patterns
  submission.responses.forEach(({ question, answer }) => {
    const lowerAnswer = answer.toLowerCase();
    
    // Breathing questions
    if (question.toLowerCase().includes('breath')) {
      if (lowerAnswer.includes('severe') || lowerAnswer.includes('very difficult') || lowerAnswer.includes('cannot')) {
        redFlags++;
      } else if (lowerAnswer.includes('difficult') || lowerAnswer.includes('harder') || lowerAnswer.includes('sometimes')) {
        yellowFlags++;
      }
    }
    
    // Pain questions
    if (question.toLowerCase().includes('pain') || question.toLowerCase().includes('chest')) {
      if (lowerAnswer.includes('severe') || lowerAnswer.includes('very bad') || lowerAnswer.includes('intense')) {
        redFlags++;
      } else if (lowerAnswer.includes('moderate') || lowerAnswer.includes('some') || lowerAnswer.includes('mild')) {
        yellowFlags++;
      }
    }
    
    // Medication adherence
    if (question.toLowerCase().includes('medication') || question.toLowerCase().includes('medicine')) {
      if (lowerAnswer.includes('no') || lowerAnswer.includes('forgot') || lowerAnswer.includes('missed')) {
        yellowFlags++;
      }
    }
  });
  
  // Check energy level (1-10 scale)
  if (submission.energyLevel <= 3) {
    yellowFlags++;
  }
  if (submission.energyLevel <= 1) {
    redFlags++;
  }
  
  // Check mood
  const negativeMoods = ['very bad', 'terrible', 'awful', 'extremely anxious', 'panicked'];
  if (negativeMoods.some(mood => submission.mood.toLowerCase().includes(mood))) {
    yellowFlags++;
  }
  
  // Classification logic
  if (redFlags >= 1) return 'red';
  if (yellowFlags >= 2) return 'yellow';
  return 'green';
}

// Generate health tip based on patient condition
function generateHealthTip(patient: Patient): string {
  const tips = [
    `💧 Staying hydrated helps your heart pump more efficiently. Aim for 6-8 glasses of water daily.`,
    `🧂 Limiting sodium to 2,000mg/day can significantly reduce fluid retention and strain on your heart.`,
    `🚶 Short, gentle walks (even 5 minutes) improve circulation and aid recovery.`,
    `💊 Take your medications at the same time each day to build a routine and improve adherence.`,
    `😴 Getting 7-8 hours of quality sleep helps your heart heal and reduces stress.`,
    `🍎 Eating heart-healthy foods like fruits, vegetables, and lean proteins supports recovery.`,
    `📊 Weighing yourself daily helps catch fluid retention early - call your doctor if you gain 2+ lbs in a day.`,
    `🧘 Deep breathing exercises can lower stress and improve oxygen flow to your heart.`
  ];
  
  // Personalize based on risk factors
  if (patient.riskFactors.includes('Hypertension')) {
    return `🩺 Monitor your blood pressure regularly. High BP is silent but manageable with medication and lifestyle changes.`;
  }
  if (patient.riskFactors.includes('Diabetes')) {
    return `🍬 Managing blood sugar levels is crucial for heart health. Check levels as recommended by your doctor.`;
  }
  
  // Random tip otherwise
  return tips[Math.floor(Math.random() * tips.length)];
}

// Initialize with sample data
async function initializeSampleData() {
  try {
    const existingPatients = await kv.get('patients');
    if (!existingPatients || existingPatients.length === 0) {
      console.log('Initializing sample patient data...');
      const samplePatients: Patient[] = [
        {
          id: 'P001',
          name: 'Margaret Johnson',
          age: 72,
          diagnosis: 'Acute Myocardial Infarction',
          dischargeDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 0,
          riskLevel: 'low',
          riskFactors: ['Diabetes', 'Hypertension', 'Previous MI'],
          contactInfo: { phone: '555-0101', email: 'mjohnson@email.com' },
          vitalSigns: { bloodPressure: '145/92', heartRate: 88, weight: 165 },
          recoveryStreak: 0,
          dailyCheckInStatus: 'pending',
          onboarded: true,
          nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'P002',
          name: 'Robert Chen',
          age: 65,
          diagnosis: 'Congestive Heart Failure',
          dischargeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 0,
          riskLevel: 'low',
          riskFactors: ['Hypertension', 'Sleep Apnea'],
          contactInfo: { phone: '555-0102', email: 'rchen@email.com' },
          lastCheckIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          vitalSigns: { bloodPressure: '132/85', heartRate: 76, weight: 180 },
          recoveryStreak: 3,
          dailyCheckInStatus: 'completed',
          aiAlertLevel: 'green',
          onboarded: true,
          nextAppointment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'P003',
          name: 'Patricia Williams',
          age: 58,
          diagnosis: 'Atrial Fibrillation',
          dischargeDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 0,
          riskLevel: 'low',
          riskFactors: ['Obesity'],
          contactInfo: { phone: '555-0103', email: 'pwilliams@email.com' },
          lastCheckIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          vitalSigns: { bloodPressure: '128/80', heartRate: 72, weight: 195 }
        },
        {
          id: 'P004',
          name: 'James Anderson',
          age: 79,
          diagnosis: 'Acute Myocardial Infarction',
          dischargeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 0,
          riskLevel: 'low',
          riskFactors: ['Diabetes', 'Hypertension', 'COPD', 'Previous MI'],
          contactInfo: { phone: '555-0104', email: 'janderson@email.com' }
        },
        {
          id: 'P005',
          name: 'Linda Martinez',
          age: 68,
          diagnosis: 'Heart Valve Replacement',
          dischargeDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 0,
          riskLevel: 'low',
          riskFactors: ['Hypertension'],
          contactInfo: { phone: '555-0105', email: 'lmartinez@email.com' },
          lastCheckIn: new Date().toISOString(),
          vitalSigns: { bloodPressure: '118/75', heartRate: 68, weight: 155 }
        },
        {
          id: 'P006',
          name: 'David Thompson',
          age: 55,
          diagnosis: 'Congestive Heart Failure',
          dischargeDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: 0,
          riskLevel: 'low',
          riskFactors: ['Diabetes', 'Obesity', 'Smoking History'],
          contactInfo: { phone: '555-0106', email: 'dthompson@email.com' },
          vitalSigns: { bloodPressure: '138/88', heartRate: 84, weight: 220 }
        }
      ];
      
      // Calculate risk scores for sample patients
      samplePatients.forEach(patient => {
        patient.riskScore = calculateRiskScore(patient);
        patient.riskLevel = getRiskLevel(patient.riskScore);
      });
      
      await kv.set('patients', samplePatients);
      console.log('✅ Sample patient data initialized successfully:', samplePatients.length, 'patients');
    } else {
      console.log('✅ Patient data already exists:', existingPatients.length, 'patients');
    }
  } catch (error) {
    console.error('❌ Error initializing sample data:', error);
  }
}

// Initialize on startup with better error handling
initializeSampleData().catch(err => {
  console.error('❌ Failed to initialize sample data:', err);
});

// Health check endpoint
app.get("/make-server-c21253d3/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all patients with risk scores (sorted by risk)
app.get("/make-server-c21253d3/patients", async (c) => {
  try {
    let patients = await kv.get('patients');
    
    // If no patients exist, try to initialize
    if (!patients || patients.length === 0) {
      console.log('No patients found, initializing...');
      await initializeSampleData();
      patients = await kv.get('patients') || [];
    }
    
    // Recalculate risk scores for all patients
    const updatedPatients = patients.map((patient: Patient) => {
      const riskScore = calculateRiskScore(patient);
      return {
        ...patient,
        riskScore,
        riskLevel: getRiskLevel(riskScore)
      };
    });
    
    // Sort by risk score (highest first)
    updatedPatients.sort((a: Patient, b: Patient) => b.riskScore - a.riskScore);
    
    // Update in storage
    await kv.set('patients', updatedPatients);
    
    return c.json({ patients: updatedPatients });
  } catch (error) {
    console.error('❌ Error fetching patients:', error);
    // Return empty array instead of error to prevent app crash
    return c.json({ 
      patients: [], 
      error: 'Failed to fetch patients', 
      details: String(error),
      message: 'Please check Supabase connection and try again'
    }, 200);
  }
});

// Get patient by ID with recommendations
app.get("/make-server-c21253d3/patients/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const patients = await kv.get('patients') || [];
    
    const patient = patients.find((p: Patient) => p.id === id);
    
    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    // Recalculate risk score
    patient.riskScore = calculateRiskScore(patient);
    patient.riskLevel = getRiskLevel(patient.riskScore);
    
    // Generate recommendations
    const recommendations = generateRecommendations(patient);
    
    // Get check-in history
    const checkIns = await kv.get(`checkIns:${id}`) || [];
    
    return c.json({
      patient,
      recommendations,
      checkIns
    });
  } catch (error) {
    console.log('Error fetching patient detail:', error);
    return c.json({ error: 'Failed to fetch patient', details: String(error) }, 500);
  }
});

// Record patient check-in
app.post("/make-server-c21253d3/patients/:id/check-in", async (c) => {
  try {
    const id = c.req.param('id');
    const checkInData = await c.req.json();
    
    const patients = await kv.get('patients') || [];
    const patientIndex = patients.findIndex((p: Patient) => p.id === id);
    
    if (patientIndex === -1) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    // Update patient's last check-in and vital signs
    patients[patientIndex].lastCheckIn = new Date().toISOString();
    if (checkInData.vitalSigns) {
      patients[patientIndex].vitalSigns = checkInData.vitalSigns;
    }
    
    await kv.set('patients', patients);
    
    // Store check-in history
    const checkIns = await kv.get(`checkIns:${id}`) || [];
    checkIns.unshift({
      ...checkInData,
      date: new Date().toISOString(),
      patientId: id
    });
    await kv.set(`checkIns:${id}`, checkIns.slice(0, 30)); // Keep last 30 check-ins
    
    return c.json({ success: true, message: 'Check-in recorded' });
  } catch (error) {
    console.log('Error recording check-in:', error);
    return c.json({ error: 'Failed to record check-in', details: String(error) }, 500);
  }
});

// Get analytics data
app.get("/make-server-c21253d3/analytics", async (c) => {
  try {
    const patients = await kv.get('patients') || [];
    
    // Calculate statistics
    const totalPatients = patients.length;
    const criticalCount = patients.filter((p: Patient) => getRiskLevel(calculateRiskScore(p)) === 'critical').length;
    const highCount = patients.filter((p: Patient) => getRiskLevel(calculateRiskScore(p)) === 'high').length;
    const mediumCount = patients.filter((p: Patient) => getRiskLevel(calculateRiskScore(p)) === 'medium').length;
    const lowCount = patients.filter((p: Patient) => getRiskLevel(calculateRiskScore(p)) === 'low').length;
    
    // Mock readmission data (in real scenario, this would come from historical data)
    const readmissionTrends = [
      { month: 'Oct 2024', rate: 18.5, target: 15 },
      { month: 'Nov 2024', rate: 17.2, target: 15 },
      { month: 'Dec 2024', rate: 15.8, target: 15 },
      { month: 'Jan 2025', rate: 14.5, target: 15 },
      { month: 'Feb 2025', rate: 13.9, target: 15 },
      { month: 'Mar 2025', rate: 13.2, target: 15 }
    ];
    
    const riskDistribution = [
      { level: 'Critical', count: criticalCount, color: '#dc2626' },
      { level: 'High', count: highCount, color: '#ea580c' },
      { level: 'Medium', count: mediumCount, color: '#ca8a04' },
      { level: 'Low', count: lowCount, color: '#16a34a' }
    ];
    
    return c.json({
      totalPatients,
      riskDistribution,
      readmissionTrends,
      currentReadmissionRate: 13.2,
      targetRate: 15.0,
      reductionPercentage: 28.6, // (18.5 - 13.2) / 18.5 * 100
      estimatedCostSavings: 245000
    });
  } catch (error) {
    console.log('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics', details: String(error) }, 500);
  }
});

// Patient-facing endpoints

// Get patient dashboard (for logged-in patient)
app.get("/make-server-c21253d3/patient-dashboard/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const patients = await kv.get('patients') || [];
    
    const patient = patients.find((p: Patient) => p.id === id);
    
    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    // Recalculate risk score
    patient.riskScore = calculateRiskScore(patient);
    patient.riskLevel = getRiskLevel(patient.riskScore);
    
    // Get health tip
    const healthTip = generateHealthTip(patient);
    
    // Get recent check-ins
    const checkIns = await kv.get(`checkIns:${id}`) || [];
    const recentCheckIns = checkIns.slice(0, 7);
    
    return c.json({
      patient: {
        id: patient.id,
        name: patient.name,
        diagnosis: patient.diagnosis,
        recoveryStreak: patient.recoveryStreak || 0,
        dailyCheckInStatus: patient.dailyCheckInStatus || 'pending',
        aiAlertLevel: patient.aiAlertLevel || 'green',
        nextAppointment: patient.nextAppointment,
        riskLevel: patient.riskLevel
      },
      healthTip,
      recentCheckIns,
      checkInCompleteToday: patient.dailyCheckInStatus === 'completed'
    });
  } catch (error) {
    console.log('Error fetching patient dashboard:', error);
    return c.json({ error: 'Failed to fetch dashboard', details: String(error) }, 500);
  }
});

// Submit daily check-in (patient-reported)
app.post("/make-server-c21253d3/patient/:id/daily-check-in", async (c) => {
  try {
    const id = c.req.param('id');
    const submission: DailyCheckInSubmission = await c.req.json();
    
    const patients = await kv.get('patients') || [];
    const patientIndex = patients.findIndex((p: Patient) => p.id === id);
    
    if (patientIndex === -1) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    // AI Classification
    const aiClassification = classifyCheckIn(submission);
    
    // Update patient record
    const patient = patients[patientIndex];
    patient.lastCheckIn = new Date().toISOString();
    patient.dailyCheckInStatus = 'completed';
    patient.aiAlertLevel = aiClassification;
    patient.patientReportedSymptoms = submission.symptoms;
    
    // Update recovery streak
    if (aiClassification === 'green') {
      patient.recoveryStreak = (patient.recoveryStreak || 0) + 1;
    }
    
    await kv.set('patients', patients);
    
    // Store check-in history
    const checkIns = await kv.get(`checkIns:${id}`) || [];
    checkIns.unshift({
      patientId: id,
      date: new Date().toISOString(),
      symptoms: submission.symptoms,
      aiClassification,
      patientResponses: submission.responses,
      mood: submission.mood,
      energyLevel: submission.energyLevel
    });
    await kv.set(`checkIns:${id}`, checkIns.slice(0, 30));
    
    // Generate response message based on classification
    let message = '';
    let requiresFollowUp = false;
    
    if (aiClassification === 'red') {
      message = "We've noticed some concerning symptoms. A care team member will reach out to you shortly. If you feel this is an emergency, please call 911.";
      requiresFollowUp = true;
    } else if (aiClassification === 'yellow') {
      message = "Thank you for checking in. We've noted a few changes in your symptoms. A nurse may follow up with you today.";
      requiresFollowUp = true;
    } else {
      message = `Great job! You're on day ${patient.recoveryStreak} of your recovery streak. Keep up the excellent work! 🎉`;
    }
    
    return c.json({
      success: true,
      classification: aiClassification,
      message,
      requiresFollowUp,
      streak: patient.recoveryStreak
    });
  } catch (error) {
    console.log('Error submitting daily check-in:', error);
    return c.json({ error: 'Failed to submit check-in', details: String(error) }, 500);
  }
});

// Complete patient onboarding
app.post("/make-server-c21253d3/patient/:id/onboard", async (c) => {
  try {
    const id = c.req.param('id');
    const { consentGiven } = await c.req.json();
    
    if (!consentGiven) {
      return c.json({ error: 'Consent required' }, 400);
    }
    
    const patients = await kv.get('patients') || [];
    const patientIndex = patients.findIndex((p: Patient) => p.id === id);
    
    if (patientIndex === -1) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    patients[patientIndex].onboarded = true;
    patients[patientIndex].recoveryStreak = 0;
    patients[patientIndex].dailyCheckInStatus = 'pending';
    
    await kv.set('patients', patients);
    
    return c.json({ success: true, message: 'Onboarding complete!' });
  } catch (error) {
    console.log('Error completing onboarding:', error);
    return c.json({ error: 'Failed to complete onboarding', details: String(error) }, 500);
  }
});

// Get patient's health tips history
app.get("/make-server-c21253d3/patient/:id/health-tips", async (c) => {
  try {
    const id = c.req.param('id');
    const patients = await kv.get('patients') || [];
    const patient = patients.find((p: Patient) => p.id === id);
    
    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    // Generate multiple tips
    const tips = [
      generateHealthTip(patient),
      `💧 Staying hydrated helps your heart pump more efficiently. Aim for 6-8 glasses of water daily.`,
      `🚶 Short, gentle walks (even 5 minutes) improve circulation and aid recovery.`,
      `😴 Getting 7-8 hours of quality sleep helps your heart heal and reduces stress.`
    ];
    
    return c.json({ tips });
  } catch (error) {
    console.log('Error fetching health tips:', error);
    return c.json({ error: 'Failed to fetch tips', details: String(error) }, 500);
  }
});

// ========================================
// EHR INTEGRATION ENDPOINTS
// ========================================

// Mock EHR data importer (simulates Epic/Cerner integration)
app.post("/make-server-c21253d3/ehr/import", async (c) => {
  try {
    const { ehrSystem, patientIds } = await c.req.json();
    
    // Simulate importing patient data from EHR
    const importedPatients = [];
    const timestamp = new Date().toISOString();
    
    // In a real system, this would call EHR API (e.g., Epic FHIR API)
    // For demo purposes, we generate realistic mock data
    for (const ehrPatientId of patientIds || []) {
      const mockPatient: Patient = {
        id: `P${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `Patient ${ehrPatientId}`,
        age: 60 + Math.floor(Math.random() * 20),
        diagnosis: ['Acute Myocardial Infarction', 'Congestive Heart Failure', 'Atrial Fibrillation'][Math.floor(Math.random() * 3)],
        dischargeDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        riskScore: 0,
        riskLevel: 'low',
        riskFactors: ['Hypertension', 'Diabetes'],
        contactInfo: {
          phone: `555-${Math.floor(1000 + Math.random() * 9000)}`,
          email: `patient${ehrPatientId}@email.com`
        },
        vitalSigns: {
          bloodPressure: `${120 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
          heartRate: 60 + Math.floor(Math.random() * 40),
          weight: 150 + Math.floor(Math.random() * 80)
        },
        onboarded: false,
        dailyCheckInStatus: 'pending'
      };
      
      mockPatient.riskScore = calculateRiskScore(mockPatient);
      mockPatient.riskLevel = getRiskLevel(mockPatient.riskScore);
      importedPatients.push(mockPatient);
    }
    
    // Add to existing patients
    const existingPatients = await kv.get('patients') || [];
    const updatedPatients = [...existingPatients, ...importedPatients];
    await kv.set('patients', updatedPatients);
    
    // Log import event
    const importLogs = await kv.get('ehrImportLogs') || [];
    importLogs.unshift({
      timestamp,
      ehrSystem,
      patientsImported: importedPatients.length,
      status: 'success',
      patientIds: importedPatients.map((p: Patient) => p.id)
    });
    await kv.set('ehrImportLogs', importLogs.slice(0, 100)); // Keep last 100 logs
    
    return c.json({
      success: true,
      patientsImported: importedPatients.length,
      patients: importedPatients
    });
  } catch (error) {
    console.log('Error importing from EHR:', error);
    return c.json({ error: 'Failed to import from EHR', details: String(error) }, 500);
  }
});

// Get EHR sync status and logs
app.get("/make-server-c21253d3/ehr/sync-status", async (c) => {
  try {
    const importLogs = await kv.get('ehrImportLogs') || [];
    const patients = await kv.get('patients') || [];
    
    const ehrConfig = {
      connected: true,
      system: 'Epic FHIR R4',
      lastSync: importLogs[0]?.timestamp || new Date().toISOString(),
      status: 'active'
    };
    
    const stats = {
      totalImports: importLogs.length,
      totalPatients: patients.length,
      lastImportCount: importLogs[0]?.patientsImported || 0,
      recentLogs: importLogs.slice(0, 10)
    };
    
    return c.json({ ehrConfig, stats });
  } catch (error) {
    console.log('Error fetching EHR sync status:', error);
    return c.json({ error: 'Failed to fetch sync status', details: String(error) }, 500);
  }
});

// ========================================
// SMS NOTIFICATION ENDPOINTS
// ========================================

// Send SMS reminder to patient
app.post("/make-server-c21253d3/sms/send-reminder", async (c) => {
  try {
    const { patientId, message } = await c.req.json();
    
    const patients = await kv.get('patients') || [];
    const patient = patients.find((p: Patient) => p.id === patientId);
    
    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    // In production, this would use Twilio or similar service
    // For demo, we simulate SMS sending
    const smsLog = {
      timestamp: new Date().toISOString(),
      patientId,
      patientName: patient.name,
      phone: patient.contactInfo.phone,
      message: message || `Hi ${patient.name.split(' ')[0]}, reminder to complete your daily CardioGuard check-in today! 💙`,
      status: 'sent',
      deliveryStatus: 'delivered'
    };
    
    // Store SMS log
    const smsLogs = await kv.get('smsLogs') || [];
    smsLogs.unshift(smsLog);
    await kv.set('smsLogs', smsLogs.slice(0, 500)); // Keep last 500 SMS
    
    return c.json({ success: true, smsLog });
  } catch (error) {
    console.log('Error sending SMS:', error);
    return c.json({ error: 'Failed to send SMS', details: String(error) }, 500);
  }
});

// Bulk send SMS reminders
app.post("/make-server-c21253d3/sms/send-bulk", async (c) => {
  try {
    const { patientIds, message } = await c.req.json();
    const patients = await kv.get('patients') || [];
    const smsLogs = await kv.get('smsLogs') || [];
    const timestamp = new Date().toISOString();
    
    let sentCount = 0;
    
    for (const patientId of patientIds || []) {
      const patient = patients.find((p: Patient) => p.id === patientId);
      if (patient) {
        const smsLog = {
          timestamp,
          patientId,
          patientName: patient.name,
          phone: patient.contactInfo.phone,
          message: message || `Hi ${patient.name.split(' ')[0]}, reminder to complete your daily CardioGuard check-in! 💙`,
          status: 'sent',
          deliveryStatus: 'delivered'
        };
        smsLogs.unshift(smsLog);
        sentCount++;
      }
    }
    
    await kv.set('smsLogs', smsLogs.slice(0, 500));
    
    return c.json({ success: true, sentCount });
  } catch (error) {
    console.log('Error sending bulk SMS:', error);
    return c.json({ error: 'Failed to send bulk SMS', details: String(error) }, 500);
  }
});

// Get SMS engagement metrics
app.get("/make-server-c21253d3/sms/metrics", async (c) => {
  try {
    const smsLogs = await kv.get('smsLogs') || [];
    const patients = await kv.get('patients') || [];
    
    // Calculate metrics
    const totalSent = smsLogs.length;
    const sentToday = smsLogs.filter((log: any) => {
      const logDate = new Date(log.timestamp).toDateString();
      const today = new Date().toDateString();
      return logDate === today;
    }).length;
    
    const deliveryRate = smsLogs.filter((log: any) => log.deliveryStatus === 'delivered').length / Math.max(totalSent, 1);
    
    // Response rate (patients who completed check-in after SMS)
    const patientsWithCheckIns = patients.filter((p: Patient) => p.dailyCheckInStatus === 'completed').length;
    const responseRate = patientsWithCheckIns / Math.max(patients.length, 1);
    
    return c.json({
      totalSent,
      sentToday,
      deliveryRate: (deliveryRate * 100).toFixed(1),
      responseRate: (responseRate * 100).toFixed(1),
      recentMessages: smsLogs.slice(0, 20)
    });
  } catch (error) {
    console.log('Error fetching SMS metrics:', error);
    return c.json({ error: 'Failed to fetch SMS metrics', details: String(error) }, 500);
  }
});

// ========================================
// FHIR EXPORT ENDPOINTS
// ========================================

// Generate FHIR-compliant export
app.get("/make-server-c21253d3/fhir/export", async (c) => {
  try {
    const patients = await kv.get('patients') || [];
    const bundle: any = {
      resourceType: "Bundle",
      type: "collection",
      timestamp: new Date().toISOString(),
      entry: []
    };
    
    for (const patient of patients) {
      // Patient Resource
      const patientResource = {
        fullUrl: `urn:uuid:${patient.id}`,
        resource: {
          resourceType: "Patient",
          id: patient.id,
          identifier: [
            {
              system: "http://cardioguard.ai/patient-id",
              value: patient.id
            }
          ],
          name: [
            {
              text: patient.name,
              family: patient.name.split(' ').pop(),
              given: patient.name.split(' ').slice(0, -1)
            }
          ],
          birthDate: new Date(Date.now() - patient.age * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          telecom: [
            {
              system: "phone",
              value: patient.contactInfo.phone
            },
            {
              system: "email",
              value: patient.contactInfo.email
            }
          ]
        }
      };
      bundle.entry.push(patientResource);
      
      // Condition Resource (Diagnosis)
      const conditionResource = {
        fullUrl: `urn:uuid:condition-${patient.id}`,
        resource: {
          resourceType: "Condition",
          id: `condition-${patient.id}`,
          subject: { reference: `Patient/${patient.id}` },
          code: {
            text: patient.diagnosis
          },
          onsetDateTime: patient.dischargeDate,
          clinicalStatus: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active"
              }
            ]
          }
        }
      };
      bundle.entry.push(conditionResource);
      
      // Observation Resource (Risk Score)
      const riskObservation = {
        fullUrl: `urn:uuid:risk-${patient.id}`,
        resource: {
          resourceType: "Observation",
          id: `risk-${patient.id}`,
          status: "final",
          category: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/observation-category",
                  code: "survey"
                }
              ]
            }
          ],
          code: {
            text: "30-Day Readmission Risk Score"
          },
          subject: { reference: `Patient/${patient.id}` },
          effectiveDateTime: new Date().toISOString(),
          valueInteger: patient.riskScore,
          interpretation: [
            {
              text: patient.riskLevel
            }
          ]
        }
      };
      bundle.entry.push(riskObservation);
      
      // Vital Signs Observations
      if (patient.vitalSigns) {
        const [systolic, diastolic] = patient.vitalSigns.bloodPressure.split('/');
        
        const bpObservation = {
          fullUrl: `urn:uuid:bp-${patient.id}`,
          resource: {
            resourceType: "Observation",
            id: `bp-${patient.id}`,
            status: "final",
            category: [
              {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/observation-category",
                    code: "vital-signs"
                  }
                ]
              }
            ],
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "85354-9",
                  display: "Blood pressure panel"
                }
              ]
            },
            subject: { reference: `Patient/${patient.id}` },
            effectiveDateTime: patient.lastCheckIn || new Date().toISOString(),
            component: [
              {
                code: {
                  coding: [
                    {
                      system: "http://loinc.org",
                      code: "8480-6",
                      display: "Systolic blood pressure"
                    }
                  ]
                },
                valueQuantity: {
                  value: parseInt(systolic),
                  unit: "mmHg",
                  system: "http://unitsofmeasure.org",
                  code: "mm[Hg]"
                }
              },
              {
                code: {
                  coding: [
                    {
                      system: "http://loinc.org",
                      code: "8462-4",
                      display: "Diastolic blood pressure"
                    }
                  ]
                },
                valueQuantity: {
                  value: parseInt(diastolic),
                  unit: "mmHg",
                  system: "http://unitsofmeasure.org",
                  code: "mm[Hg]"
                }
              }
            ]
          }
        };
        bundle.entry.push(bpObservation);
      }
      
      // Get check-ins for this patient
      const checkIns = await kv.get(`checkIns:${patient.id}`) || [];
      if (checkIns.length > 0) {
        const recentCheckIn = checkIns[0];
        
        const checkInObservation = {
          fullUrl: `urn:uuid:checkin-${patient.id}`,
          resource: {
            resourceType: "Observation",
            id: `checkin-${patient.id}`,
            status: "final",
            category: [
              {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/observation-category",
                    code: "survey"
                  }
                ]
              }
            ],
            code: {
              text: "Daily Symptom Check-In"
            },
            subject: { reference: `Patient/${patient.id}` },
            effectiveDateTime: recentCheckIn.date,
            valueString: recentCheckIn.aiClassification || 'green',
            note: [
              {
                text: `Symptoms: ${recentCheckIn.symptoms?.join(', ') || 'None reported'}`
              }
            ]
          }
        };
        bundle.entry.push(checkInObservation);
      }
    }
    
    return c.json(bundle);
  } catch (error) {
    console.log('Error generating FHIR export:', error);
    return c.json({ error: 'Failed to generate FHIR export', details: String(error) }, 500);
  }
});

// Get data intake metrics
app.get("/make-server-c21253d3/data-intake/metrics", async (c) => {
  try {
    const patients = await kv.get('patients') || [];
    const ehrLogs = await kv.get('ehrImportLogs') || [];
    const smsLogs = await kv.get('smsLogs') || [];
    
    // Calculate various metrics
    const totalPatients = patients.length;
    const patientsWithData = patients.filter((p: Patient) => p.vitalSigns).length;
    const dataCompleteness = (patientsWithData / Math.max(totalPatients, 1)) * 100;
    
    const ehrImportCount = ehrLogs.reduce((sum: number, log: any) => sum + (log.patientsImported || 0), 0);
    const smsEngagementRate = patients.filter((p: Patient) => p.dailyCheckInStatus === 'completed').length / Math.max(totalPatients, 1) * 100;
    
    const lastEhrSync = ehrLogs[0]?.timestamp || null;
    const lastSms = smsLogs[0]?.timestamp || null;
    
    return c.json({
      totalPatients,
      dataCompleteness: dataCompleteness.toFixed(1),
      ehrImportCount,
      smsEngagementRate: smsEngagementRate.toFixed(1),
      lastEhrSync,
      lastSms,
      recentActivity: {
        ehrImports: ehrLogs.slice(0, 5),
        smsMessages: smsLogs.slice(0, 5)
      }
    });
  } catch (error) {
    console.log('Error fetching data intake metrics:', error);
    return c.json({ error: 'Failed to fetch metrics', details: String(error) }, 500);
  }
});

// ========================================
// MESSAGING ENDPOINTS
// ========================================

// Get messages for a patient
app.get("/make-server-c21253d3/messages/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const messages = await kv.get(`messages:${id}`) || [];
    
    return c.json({ messages });
  } catch (error) {
    console.log('Error fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages', details: String(error) }, 500);
  }
});

// Send message from patient
app.post("/make-server-c21253d3/messages/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const { content, sender, senderName } = await c.req.json();
    
    const messages = await kv.get(`messages:${id}`) || [];
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender,
      senderName,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    messages.push(newMessage);
    await kv.set(`messages:${id}`, messages);
    
    // Auto-reply from care team (simulation)
    if (sender === 'patient') {
      setTimeout(async () => {
        const autoReply = {
          id: `msg_${Date.now()}_reply`,
          sender: 'care-team',
          senderName: 'Care Team',
          content: 'Thank you for your message. A member of our care team will respond shortly. If this is urgent, please call 1-800-CARDIO-1.',
          timestamp: new Date().toISOString(),
          read: false
        };
        const updatedMessages = await kv.get(`messages:${id}`) || [];
        updatedMessages.push(autoReply);
        await kv.set(`messages:${id}`, updatedMessages);
      }, 2000);
    }
    
    return c.json({ success: true, message: newMessage });
  } catch (error) {
    console.log('Error sending message:', error);
    return c.json({ error: 'Failed to send message', details: String(error) }, 500);
  }
});

// ========================================
// HOSPITAL AND PATIENT MANAGEMENT ENDPOINTS
// ========================================

// Initialize hospitals data
async function initializeHospitals() {
  const existingHospitals = await kv.get('hospitals');
  if (!existingHospitals) {
    const hospitals = [
      { id: 'H001', name: 'St. Mary\'s Medical Center', location: 'San Francisco, CA', type: 'Academic Medical Center' },
      { id: 'H002', name: 'Memorial Heart Institute', location: 'Los Angeles, CA', type: 'Specialty Hospital' },
      { id: 'H003', name: 'City General Hospital', location: 'San Diego, CA', type: 'Community Hospital' },
      { id: 'H004', name: 'University Medical Center', location: 'Sacramento, CA', type: 'Academic Medical Center' },
      { id: 'H005', name: 'Coastal Regional Medical Center', location: 'Santa Barbara, CA', type: 'Regional Hospital' },
      { id: 'H006', name: 'Valley Presbyterian Hospital', location: 'Fresno, CA', type: 'Community Hospital' },
    ];
    await kv.set('hospitals', hospitals);
    console.log('Hospital data initialized');
  }
}

// Initialize hospitals on startup
initializeHospitals();

// Get list of hospitals
app.get("/make-server-c21253d3/hospitals", async (c) => {
  try {
    const hospitals = await kv.get('hospitals') || [];
    return c.json({ hospitals });
  } catch (error) {
    console.log('Error fetching hospitals:', error);
    return c.json({ error: 'Failed to fetch hospitals', details: String(error) }, 500);
  }
});

// Generate random password
function generatePassword(length = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Create new patient with credentials
app.post("/make-server-c21253d3/patients/create", async (c) => {
  try {
    const patientData = await c.req.json();
    
    // Validation
    if (!patientData.name || !patientData.age || !patientData.email || !patientData.phone || !patientData.diagnosis) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Generate patient ID
    const timestamp = Date.now();
    const patientId = `P${timestamp.toString().slice(-6)}`;
    
    // Generate credentials
    const password = generatePassword();
    
    // Create patient object
    const newPatient: Patient = {
      id: patientId,
      name: patientData.name,
      age: patientData.age,
      diagnosis: patientData.diagnosis,
      dischargeDate: new Date().toISOString(), // Set to today (discharge date)
      riskScore: 0,
      riskLevel: 'low',
      riskFactors: patientData.riskFactors || [],
      contactInfo: {
        phone: patientData.phone,
        email: patientData.email
      },
      vitalSigns: patientData.vitalSigns,
      onboarded: false,
      dailyCheckInStatus: 'pending',
      recoveryStreak: 0
    };
    
    // Calculate risk score
    newPatient.riskScore = calculateRiskScore(newPatient);
    newPatient.riskLevel = getRiskLevel(newPatient.riskScore);
    
    // Add to patients list
    const patients = await kv.get('patients') || [];
    patients.push(newPatient);
    await kv.set('patients', patients);
    
    // Store credentials (in production, hash the password)
    const credentials = await kv.get('patientCredentials') || {};
    credentials[patientData.email] = {
      patientId,
      password,
      email: patientData.email,
      createdAt: new Date().toISOString(),
      loginStatus: 'not_logged_in',
      hospitalId: null
    };
    await kv.set('patientCredentials', credentials);
    
    return c.json({
      success: true,
      patient: newPatient,
      credentials: {
        email: patientData.email,
        password,
        patientId
      }
    });
  } catch (error) {
    console.log('Error creating patient:', error);
    return c.json({ error: 'Failed to create patient', details: String(error) }, 500);
  }
});

// Send credentials to patient (mock SMS/Email notification)
app.post("/make-server-c21253d3/patients/send-credentials", async (c) => {
  try {
    const { patientId, email } = await c.req.json();
    
    // In production, this would send actual SMS/Email via Twilio/SendGrid
    console.log(`Sending credentials to patient ${patientId} at ${email}`);
    
    // Mock notification log
    const notifications = await kv.get('notificationLogs') || [];
    notifications.unshift({
      timestamp: new Date().toISOString(),
      type: 'credentials_sent',
      patientId,
      email,
      status: 'sent'
    });
    await kv.set('notificationLogs', notifications.slice(0, 100));
    
    return c.json({ success: true, message: 'Credentials sent successfully' });
  } catch (error) {
    console.log('Error sending credentials:', error);
    return c.json({ error: 'Failed to send credentials', details: String(error) }, 500);
  }
});

// Patient login with hospital selection
app.post("/make-server-c21253d3/patients/login", async (c) => {
  try {
    const { email, password, hospitalId } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }
    
    // Check credentials
    const credentials = await kv.get('patientCredentials') || {};
    const userCred = credentials[email];
    
    if (!userCred || userCred.password !== password) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }
    
    // Update login status
    userCred.loginStatus = 'logged_in';
    userCred.lastLogin = new Date().toISOString();
    if (hospitalId) {
      userCred.hospitalId = hospitalId;
    }
    credentials[email] = userCred;
    await kv.set('patientCredentials', credentials);
    
    // Get patient data
    const patients = await kv.get('patients') || [];
    const patient = patients.find((p: Patient) => p.id === userCred.patientId);
    
    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    return c.json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name,
        email: userCred.email
      }
    });
  } catch (error) {
    console.log('Error during patient login:', error);
    return c.json({ error: 'Login failed', details: String(error) }, 500);
  }
});

// Get patient login statuses (for clinician dashboard)
app.get("/make-server-c21253d3/patients/login-status", async (c) => {
  try {
    const credentials = await kv.get('patientCredentials') || {};
    const patients = await kv.get('patients') || [];
    
    // Map login status to patients
    const patientStatuses = patients.map((patient: Patient) => {
      const cred = Object.values(credentials).find((c: any) => c.patientId === patient.id);
      return {
        patientId: patient.id,
        name: patient.name,
        email: patient.contactInfo.email,
        loginStatus: cred?.loginStatus || 'not_logged_in',
        lastLogin: cred?.lastLogin || null,
        hospitalId: cred?.hospitalId || null
      };
    });
    
    return c.json({ patientStatuses });
  } catch (error) {
    console.log('Error fetching login statuses:', error);
    return c.json({ error: 'Failed to fetch login statuses', details: String(error) }, 500);
  }
});

// Delete patient
app.delete("/make-server-c21253d3/patients/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const patients = await kv.get('patients') || [];
    
    const patientIndex = patients.findIndex((p: Patient) => p.id === id);
    
    if (patientIndex === -1) {
      return c.json({ error: 'Patient not found' }, 404);
    }
    
    // Remove patient from the list
    const deletedPatient = patients.splice(patientIndex, 1)[0];
    await kv.set('patients', patients);
    
    // Delete patient's check-in history
    await kv.del(`checkIns:${id}`);
    
    // Delete patient's login credentials
    const credentials = await kv.get('patientCredentials') || {};
    const credentialEmail = Object.keys(credentials).find(
      email => credentials[email].patientId === id
    );
    if (credentialEmail) {
      delete credentials[credentialEmail];
      await kv.set('patientCredentials', credentials);
    }
    
    console.log(`Patient deleted: ${deletedPatient.name} (${id})`);
    
    return c.json({ 
      success: true, 
      message: 'Patient deleted successfully',
      deletedPatient: {
        id: deletedPatient.id,
        name: deletedPatient.name
      }
    });
  } catch (error) {
    console.log('Error deleting patient:', error);
    return c.json({ error: 'Failed to delete patient', details: String(error) }, 500);
  }
});

// ========================================
// ADMINISTRATOR METRICS ENDPOINTS
// ========================================

// Get comprehensive administrator metrics
app.get("/make-server-c21253d3/admin/metrics", async (c) => {
  try {
    const patients = await kv.get('patients') || [];
    const totalPatients = patients.length;
    const activePatients = patients.filter((p: Patient) => 
      p.lastCheckIn && 
      (new Date().getTime() - new Date(p.lastCheckIn).getTime()) < 7 * 24 * 60 * 60 * 1000
    ).length;
    
    // Mock comprehensive metrics (in production, these would be calculated from real data)
    const metrics = {
      readmissionMetrics: {
        baseline30DayRate: 18.5,
        current30DayRate: 13.2,
        reductionPercentage: 28.6,
        preventedReadmissions: 12
      },
      costMetrics: {
        costPerReadmission: 15000,
        totalSavings: 180000, // 12 prevented × $15,000
        roi: 3.2 // For every $1 spent, $3.20 saved
      },
      engagementMetrics: {
        totalPatients,
        activePatients,
        averageCheckInRate: 89.5,
        averageStreakDays: 12
      },
      clinicianMetrics: {
        totalClinicians: 8,
        weeklyActiveRate: 92,
        averageResponseTime: 1.5 // hours
      },
      qualityMetrics: {
        patientSatisfaction: 94,
        careQualityScore: 88,
        nps: 67 // Net Promoter Score
      },
      trends: [
        { month: 'Aug 2024', readmissionRate: 18.5, engagement: 72, cost: 277500 },
        { month: 'Sep 2024', readmissionRate: 17.2, engagement: 78, cost: 258000 },
        { month: 'Oct 2024', readmissionRate: 15.8, engagement: 82, cost: 237000 },
        { month: 'Nov 2024', readmissionRate: 14.5, engagement: 85, cost: 217500 },
        { month: 'Dec 2024', readmissionRate: 13.9, engagement: 87, cost: 208500 },
        { month: 'Jan 2025', readmissionRate: 13.2, engagement: 90, cost: 198000 }
      ]
    };
    
    return c.json(metrics);
  } catch (error) {
    console.log('Error fetching admin metrics:', error);
    return c.json({ error: 'Failed to fetch metrics', details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);