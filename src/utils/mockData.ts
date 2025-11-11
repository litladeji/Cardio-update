// Mock data for CardioGuard demo
// This allows the app to run without Supabase backend

export interface Patient {
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

export interface Recommendation {
  id: string;
  patientId: string;
  type: 'medication' | 'lifestyle' | 'appointment' | 'monitoring';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'dismissed';
}

export interface PatientLoginStatus {
  patientId: string;
  patientName: string;
  lastLoginTime: string | null;
  isOnline: boolean;
  loginCount: number;
  firstLoginTime: string | null;
}

// Mock Patients Data
export const mockPatients: Patient[] = [
  {
    id: 'P001',
    name: 'Margaret Johnson',
    age: 72,
    diagnosis: 'Acute Myocardial Infarction',
    dischargeDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 78,
    riskLevel: 'high',
    riskFactors: ['Diabetes', 'Hypertension', 'Previous MI'],
    contactInfo: { 
      phone: '555-0101', 
      email: 'mjohnson@email.com' 
    },
    vitalSigns: { 
      bloodPressure: '145/92', 
      heartRate: 88, 
      weight: 165 
    },
    recoveryStreak: 0,
    dailyCheckInStatus: 'pending',
    aiAlertLevel: 'yellow',
    onboarded: true,
    nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'P002',
    name: 'Robert Chen',
    age: 65,
    diagnosis: 'Congestive Heart Failure',
    dischargeDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 52,
    riskLevel: 'medium',
    riskFactors: ['Hypertension', 'Sleep Apnea'],
    contactInfo: { 
      phone: '555-0102', 
      email: 'rchen@email.com' 
    },
    lastCheckIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    vitalSigns: { 
      bloodPressure: '132/85', 
      heartRate: 76, 
      weight: 180 
    },
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
    riskScore: 35,
    riskLevel: 'low',
    riskFactors: ['Obesity'],
    contactInfo: { 
      phone: '555-0103', 
      email: 'pwilliams@email.com' 
    },
    lastCheckIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    vitalSigns: { 
      bloodPressure: '128/80', 
      heartRate: 72, 
      weight: 195 
    },
    recoveryStreak: 8,
    dailyCheckInStatus: 'completed',
    aiAlertLevel: 'green',
    onboarded: true,
    nextAppointment: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'P004',
    name: 'James Anderson',
    age: 79,
    diagnosis: 'Acute Myocardial Infarction',
    dischargeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 85,
    riskLevel: 'critical',
    riskFactors: ['Diabetes', 'Hypertension', 'COPD', 'Previous MI'],
    contactInfo: { 
      phone: '555-0104', 
      email: 'janderson@email.com' 
    },
    vitalSigns: { 
      bloodPressure: '158/95', 
      heartRate: 92, 
      weight: 172 
    },
    dailyCheckInStatus: 'pending',
    aiAlertLevel: 'red',
    patientReportedSymptoms: ['Chest pain', 'Shortness of breath'],
    onboarded: true,
    nextAppointment: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'P005',
    name: 'Linda Martinez',
    age: 68,
    diagnosis: 'Heart Valve Replacement',
    dischargeDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 28,
    riskLevel: 'low',
    riskFactors: ['Hypertension'],
    contactInfo: { 
      phone: '555-0105', 
      email: 'lmartinez@email.com' 
    },
    lastCheckIn: new Date().toISOString(),
    vitalSigns: { 
      bloodPressure: '118/75', 
      heartRate: 68, 
      weight: 155 
    },
    recoveryStreak: 15,
    dailyCheckInStatus: 'completed',
    aiAlertLevel: 'green',
    onboarded: true,
    nextAppointment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'P006',
    name: 'David Thompson',
    age: 55,
    diagnosis: 'Congestive Heart Failure',
    dischargeDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 62,
    riskLevel: 'medium',
    riskFactors: ['Diabetes', 'Obesity', 'Smoking History'],
    contactInfo: { 
      phone: '555-0106', 
      email: 'dthompson@email.com' 
    },
    vitalSigns: { 
      bloodPressure: '138/88', 
      heartRate: 84, 
      weight: 220 
    },
    recoveryStreak: 1,
    dailyCheckInStatus: 'pending',
    aiAlertLevel: 'yellow',
    onboarded: true,
    nextAppointment: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'P007',
    name: 'Sarah Mitchell',
    age: 63,
    diagnosis: 'Coronary Artery Bypass Graft',
    dischargeDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 45,
    riskLevel: 'medium',
    riskFactors: ['High Cholesterol', 'Family History'],
    contactInfo: { 
      phone: '555-0107', 
      email: 'smitchell@email.com' 
    },
    lastCheckIn: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    vitalSigns: { 
      bloodPressure: '125/82', 
      heartRate: 74, 
      weight: 158 
    },
    recoveryStreak: 5,
    dailyCheckInStatus: 'completed',
    aiAlertLevel: 'green',
    onboarded: true,
    nextAppointment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'P008',
    name: 'Michael O\'Brien',
    age: 71,
    diagnosis: 'Acute Myocardial Infarction',
    dischargeDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 68,
    riskLevel: 'high',
    riskFactors: ['Hypertension', 'Diabetes', 'Kidney Disease'],
    contactInfo: { 
      phone: '555-0108', 
      email: 'mobrien@email.com' 
    },
    vitalSigns: { 
      bloodPressure: '142/90', 
      heartRate: 86, 
      weight: 188 
    },
    dailyCheckInStatus: 'pending',
    aiAlertLevel: 'yellow',
    patientReportedSymptoms: ['Fatigue', 'Dizziness'],
    onboarded: true,
    nextAppointment: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Recommendations
export const mockRecommendations: Recommendation[] = [
  {
    id: 'R001',
    patientId: 'P001',
    type: 'medication',
    priority: 'high',
    title: 'Review Medication Adherence',
    description: 'Patient missed check-in. Follow up on medication compliance.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 'R002',
    patientId: 'P001',
    type: 'monitoring',
    priority: 'medium',
    title: 'Schedule Blood Pressure Check',
    description: 'Recent readings show elevated BP (145/92). Monitor closely.',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 'R003',
    patientId: 'P004',
    type: 'appointment',
    priority: 'critical',
    title: 'Urgent Follow-up Required',
    description: 'Patient reporting chest pain and shortness of breath. Schedule immediate appointment.',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 'R004',
    patientId: 'P006',
    type: 'lifestyle',
    priority: 'medium',
    title: 'Nutrition Counseling',
    description: 'Patient has obesity risk factor. Recommend dietary consultation.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  },
  {
    id: 'R005',
    patientId: 'P008',
    type: 'monitoring',
    priority: 'high',
    title: 'Address Reported Symptoms',
    description: 'Patient reported fatigue and dizziness. Evaluate for medication side effects.',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
];

// Mock Login Statuses
export const mockLoginStatuses: PatientLoginStatus[] = [
  {
    patientId: 'P001',
    patientName: 'Margaret Johnson',
    lastLoginTime: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    isOnline: false,
    loginCount: 2,
    firstLoginTime: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  },
  {
    patientId: 'P002',
    patientName: 'Robert Chen',
    lastLoginTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isOnline: true,
    loginCount: 5,
    firstLoginTime: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString()
  },
  {
    patientId: 'P003',
    patientName: 'Patricia Williams',
    lastLoginTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isOnline: true,
    loginCount: 12,
    firstLoginTime: new Date(Date.now() - 240 * 60 * 60 * 1000).toISOString()
  },
  {
    patientId: 'P004',
    patientName: 'James Anderson',
    lastLoginTime: null,
    isOnline: false,
    loginCount: 0,
    firstLoginTime: null
  },
  {
    patientId: 'P005',
    patientName: 'Linda Martinez',
    lastLoginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isOnline: true,
    loginCount: 15,
    firstLoginTime: new Date(Date.now() - 360 * 60 * 60 * 1000).toISOString()
  },
  {
    patientId: 'P006',
    patientName: 'David Thompson',
    lastLoginTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isOnline: false,
    loginCount: 3,
    firstLoginTime: new Date(Date.now() - 192 * 60 * 60 * 1000).toISOString()
  },
  {
    patientId: 'P007',
    patientName: 'Sarah Mitchell',
    lastLoginTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isOnline: true,
    loginCount: 6,
    firstLoginTime: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString()
  },
  {
    patientId: 'P008',
    patientName: 'Michael O\'Brien',
    lastLoginTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isOnline: false,
    loginCount: 4,
    firstLoginTime: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
  }
];

// Helper function to get patient by ID
export function getMockPatientById(id: string): Patient | undefined {
  return mockPatients.find(p => p.id === id);
}

// Helper function to get recommendations for a patient
export function getMockRecommendationsForPatient(patientId: string): Recommendation[] {
  return mockRecommendations.filter(r => r.patientId === patientId);
}

// Helper function to get login status for a patient
export function getMockLoginStatus(patientId: string): PatientLoginStatus | undefined {
  return mockLoginStatuses.find(s => s.patientId === patientId);
}

// Helper function to add a new patient (for demo)
export function addMockPatient(patient: Patient): void {
  mockPatients.push(patient);
  // Also add a login status entry
  mockLoginStatuses.push({
    patientId: patient.id,
    patientName: patient.name,
    lastLoginTime: null,
    isOnline: false,
    loginCount: 0,
    firstLoginTime: null
  });
}

// Helper to simulate patient data updates (for demo interactions)
export function updateMockPatient(id: string, updates: Partial<Patient>): Patient | undefined {
  const index = mockPatients.findIndex(p => p.id === id);
  if (index !== -1) {
    mockPatients[index] = { ...mockPatients[index], ...updates };
    return mockPatients[index];
  }
  return undefined;
}

// Health Tips for Patient Dashboard
const healthTips = [
  "Take a 10-minute walk after meals to help with digestion and heart health. Start slow and gradually increase your pace.",
  "Monitor your weight daily at the same time each day. A sudden gain of 2-3 pounds in a day could indicate fluid retention.",
  "Take your medications at the same time each day. Setting phone reminders can help you stay consistent.",
  "Stay hydrated by drinking 6-8 glasses of water daily, unless your doctor has given you different instructions.",
  "Get 7-8 hours of sleep each night. Good sleep helps your heart recover and reduces stress on your cardiovascular system.",
  "Practice deep breathing exercises for 5 minutes twice daily to reduce stress and improve oxygen flow.",
  "Reduce sodium intake by avoiding processed foods and checking nutrition labels. Aim for less than 2,000mg per day.",
  "Keep a symptom journal. Track any chest pain, shortness of breath, or unusual fatigue and share it with your care team.",
  "Attend all follow-up appointments. Regular check-ins with your cardiologist are crucial for monitoring your recovery.",
  "Consider joining a cardiac rehabilitation program. These supervised exercise programs are designed for heart patients."
];

// Get a daily health tip (rotates based on day of year)
export function getDailyHealthTip(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return healthTips[dayOfYear % healthTips.length];
}

// Get patient dashboard data (for mock mode)
export function getMockPatientDashboard(patientId: string) {
  const patient = getMockPatientById(patientId);
  
  if (!patient) {
    return null;
  }

  return {
    patient: {
      ...patient,
      aiAlertLevel: patient.aiAlertLevel || 'green',
      recoveryStreak: patient.recoveryStreak || 0,
      nextAppointment: patient.nextAppointment,
      riskLevel: patient.riskLevel
    },
    healthTip: getDailyHealthTip(),
    checkInCompleteToday: patient.dailyCheckInStatus === 'completed'
  };
}

// Get mock analytics data
export function getMockAnalytics() {
  return {
    totalPatients: mockPatients.length,
    riskDistribution: {
      level: 'Risk Levels',
      critical: mockPatients.filter(p => p.riskLevel === 'critical').length,
      high: mockPatients.filter(p => p.riskLevel === 'high').length,
      medium: mockPatients.filter(p => p.riskLevel === 'medium').length,
      low: mockPatients.filter(p => p.riskLevel === 'low').length
    },
    checkInCompliance: {
      completed: mockPatients.filter(p => p.dailyCheckInStatus === 'completed').length,
      pending: mockPatients.filter(p => p.dailyCheckInStatus === 'pending').length,
      rate: Math.round((mockPatients.filter(p => p.dailyCheckInStatus === 'completed').length / mockPatients.length) * 100)
    },
    avgRiskScore: Math.round(mockPatients.reduce((sum, p) => sum + p.riskScore, 0) / mockPatients.length),
    readmissionPredictions: {
      highRisk: mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length,
      likelyReadmissions: Math.round(mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length * 0.3)
    },
    trends: [
      { month: 'Jan', rate: 18.5, target: 15 },
      { month: 'Feb', rate: 17.2, target: 15 },
      { month: 'Mar', rate: 16.8, target: 15 },
      { month: 'Apr', rate: 15.9, target: 15 },
      { month: 'May', rate: 14.8, target: 15 },
      { month: 'Jun', rate: 13.2, target: 15 }
    ],
    currentReadmissionRate: 13.2,
    targetRate: 15,
    reductionPercentage: 28.6,
    estimatedCostSavings: 385000
  };
}

// Get mock administrator metrics
export function getMockAdministratorMetrics() {
  const totalPatients = mockPatients.length;
  const activePatients = mockPatients.filter(p => p.dailyCheckInStatus === 'completed').length;
  const averageCheckInRate = Math.round((activePatients / totalPatients) * 100);
  const averageStreakDays = Math.round(
    mockPatients.reduce((sum, p) => sum + (p.recoveryStreak || 0), 0) / totalPatients
  );

  return {
    readmissionMetrics: {
      current30DayRate: 13.2,
      baseline30DayRate: 18.5,
      reductionPercentage: 28.6,
      preventedReadmissions: 42
    },
    costMetrics: {
      totalSavings: 385000,
      costPerReadmission: 15000,
      roi: 4.2
    },
    engagementMetrics: {
      totalPatients,
      activePatients,
      averageCheckInRate,
      averageStreakDays
    },
    clinicianMetrics: {
      totalClinicians: 12,
      weeklyActiveRate: 94,
      averageResponseTime: 2.3
    },
    qualityMetrics: {
      patientSatisfaction: 92,
      careQualityScore: 87,
      nps: 68
    },
    trends: [
      { month: 'Jan', readmissionRate: 18.5, engagement: 68, cost: 520000 },
      { month: 'Feb', readmissionRate: 17.2, engagement: 72, cost: 485000 },
      { month: 'Mar', readmissionRate: 16.8, engagement: 75, cost: 465000 },
      { month: 'Apr', readmissionRate: 15.9, engagement: 78, cost: 445000 },
      { month: 'May', readmissionRate: 14.8, engagement: 82, cost: 420000 },
      { month: 'Jun', readmissionRate: 13.2, engagement: 85, cost: 385000 }
    ]
  };
}

// Generate mock activity log entries
export function generateMockActivityLog(patientId: string, count: number = 5) {
  const activities = [
    'Daily check-in completed',
    'Vital signs recorded',
    'Medication taken',
    'Symptoms reported',
    'Care team message sent',
    'Educational content viewed',
    'Exercise logged'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `ACT-${patientId}-${i}`,
    patientId,
    activity: activities[Math.floor(Math.random() * activities.length)],
    timestamp: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
    details: 'Activity completed successfully'
  }));
}

// Mock SMS Messages
export interface SmsMessage {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  message: string;
  timestamp: string;
  deliveryStatus: 'Delivered' | 'Pending' | 'Failed';
}

export const mockSmsMessages: SmsMessage[] = [
  {
    id: 'SMS001',
    patientId: 'P005',
    patientName: 'Linda Martinez',
    phone: '555-0105',
    message: 'Great job completing your daily check-in! Keep up the excellent work. 💙',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    deliveryStatus: 'Delivered'
  },
  {
    id: 'SMS002',
    patientId: 'P003',
    patientName: 'Patricia Williams',
    phone: '555-0103',
    message: 'Reminder: Your follow-up appointment is scheduled for next week. Please confirm.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: 'Delivered'
  },
  {
    id: 'SMS003',
    patientId: 'P002',
    patientName: 'Robert Chen',
    phone: '555-0102',
    message: 'Hi Robert, reminder to complete your daily CardioGuard check-in today! 💙',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: 'Delivered'
  },
  {
    id: 'SMS004',
    patientId: 'P007',
    patientName: 'Sarah Mitchell',
    phone: '555-0107',
    message: 'Your recent vitals look good! Remember to take your medications as prescribed.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: 'Delivered'
  },
  {
    id: 'SMS005',
    patientId: 'P001',
    patientName: 'Margaret Johnson',
    phone: '555-0101',
    message: 'We noticed you missed your check-in yesterday. Please complete it when you can.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: 'Delivered'
  },
  {
    id: 'SMS006',
    patientId: 'P006',
    patientName: 'David Thompson',
    phone: '555-0106',
    message: 'Hi David, reminder to complete your daily CardioGuard check-in today! 💙',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: 'Delivered'
  },
  {
    id: 'SMS007',
    patientId: 'P008',
    patientName: 'Michael O\'Brien',
    phone: '555-0108',
    message: 'Your care team reviewed your symptoms. Please call if you have concerns.',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: 'Delivered'
  },
  {
    id: 'SMS008',
    patientId: 'P004',
    patientName: 'James Anderson',
    phone: '555-0104',
    message: 'URGENT: Please complete your daily check-in. Your care team needs to review your status.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    deliveryStatus: 'Delivered'
  }
];

// Export statistics based on mock data
export function getMockDashboardStats() {
  const totalPatients = mockPatients.length;
  const highRiskPatients = mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical').length;
  const pendingCheckIns = mockPatients.filter(p => p.dailyCheckInStatus === 'pending').length;
  const activeAlerts = mockRecommendations.filter(r => r.status === 'pending' && r.priority === 'critical').length;

  return {
    totalPatients,
    highRiskPatients,
    pendingCheckIns,
    activeAlerts,
    averageRiskScore: Math.round(mockPatients.reduce((sum, p) => sum + p.riskScore, 0) / totalPatients)
  };
}

// Mock messaging data
export interface Message {
  id: string;
  sender: 'patient' | 'care-team' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Store messages in memory for each patient
const mockMessages: { [patientId: string]: Message[] } = {
  'P001': [
    {
      id: 'MSG001',
      sender: 'system',
      senderName: 'CardioGuard AI Assistant',
      content: 'Good morning, Margaret! Welcome to your AI-powered care chat. I\'m here 24/7 to help with questions about symptoms, medications, appointments, or just to provide support. How are you feeling today?',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'MSG002',
      sender: 'patient',
      senderName: 'Margaret Johnson',
      content: 'I have a question about my medication',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'MSG003',
      sender: 'system',
      senderName: 'CardioGuard AI Assistant',
      content: 'That\'s a great question about your medications, Margaret. Your heart medications are crucial for your recovery from Acute Myocardial Infarction. I\'m connecting you with your care team - they have access to your complete medication list and can give you detailed guidance. They\'ll respond within 2 hours.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'MSG004',
      sender: 'care-team',
      senderName: 'Dr. Sarah Williams',
      content: 'Hi Margaret, I\'m here to help with your medication questions. What specifically would you like to know?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true
    }
  ],
  'P002': [
    {
      id: 'MSG003',
      sender: 'system',
      senderName: 'CardioGuard AI Assistant',
      content: 'Hello Robert! Great to see you. How can I help you today?',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'MSG004',
      sender: 'patient',
      senderName: 'Robert Chen',
      content: 'Can I start exercising again?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'MSG005',
      sender: 'system',
      senderName: 'CardioGuard AI Assistant',
      content: 'Great question about exercise, Robert! Physical activity is important for your recovery from Congestive Heart Failure. Start slowly - even 5-10 minute walks are beneficial. Listen to your body and stop if you feel chest pain, severe shortness of breath, or dizziness. Your care team can provide personalized exercise guidelines. Many patients benefit from cardiac rehab programs.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true
    },
    {
      id: 'MSG006',
      sender: 'system',
      senderName: 'CardioGuard AI Assistant',
      content: 'Have you been referred to a cardiac rehabilitation program?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true
    }
  ],
  // Add initial welcome message for Evelyn Carter (P003) who is the demo patient
  'P003': [
    {
      id: 'MSG007',
      sender: 'system',
      senderName: 'CardioGuard AI Assistant',
      content: 'Welcome to CardioGuard, Patricia! 💙 I\'m your AI-powered health assistant, here to help you 24/7. I can answer questions about your symptoms, medications, lifestyle, and more. Try asking me something like "Can I exercise today?" or "I have a question about my medication." How can I help you today?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: true
    }
  ]
};

// Mock functions for messaging
export function getMockMessages(patientId: string): Message[] {
  return mockMessages[patientId] || [];
}

export function sendMockMessage(
  patientId: string,
  content: string,
  senderName: string
): Message {
  if (!mockMessages[patientId]) {
    mockMessages[patientId] = [];
  }

  const newMessage: Message = {
    id: `MSG${Date.now()}`,
    sender: 'patient',
    senderName,
    content,
    timestamp: new Date().toISOString(),
    read: false
  };

  mockMessages[patientId].push(newMessage);

  // Use smart AI engine for intelligent responses
  setTimeout(async () => {
    // Import the smart chat engine (dynamic import to avoid circular dependency)
    const { generateSmartResponse } = await import('./smartChatEngine');
    
    // Generate intelligent, context-aware response
    const smartResponse = generateSmartResponse(patientId, content);
    
    const autoResponse: Message = {
      id: `MSG${Date.now() + 1}`,
      sender: 'system',
      senderName: 'CardioGuard AI Assistant',
      content: smartResponse.content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    mockMessages[patientId].push(autoResponse);
    
    // If the response includes a follow-up question, send it after a brief delay
    if (smartResponse.followUpQuestion) {
      setTimeout(() => {
        const followUpMessage: Message = {
          id: `MSG${Date.now() + 2}`,
          sender: 'system',
          senderName: 'CardioGuard AI Assistant',
          content: smartResponse.followUpQuestion,
          timestamp: new Date().toISOString(),
          read: false
        };
        
        mockMessages[patientId].push(followUpMessage);
        
        // Trigger event for follow-up
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('newMockMessage', { detail: { patientId } }));
        }
      }, 1500);
    }
    
    // Log escalation if needed (in production, this would alert the care team)
    if (smartResponse.shouldEscalate) {
      console.log(`🚨 CARE TEAM ALERT: ${smartResponse.severity.toUpperCase()} - Patient ${patientId} needs attention`);
      console.log(`Intent: ${smartResponse.intent}, Message: "${content}"`);
      
      // In a real system, this would create a notification for the care team
      // For demo, we could add a visual indicator in the clinician dashboard
    }
    
    // Trigger custom event to notify UI of new message
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('newMockMessage', { detail: { patientId } }));
    }
  }, 800);

  return newMessage;
}

// Mock daily check-in submission
export interface CheckInSubmission {
  patientId: string;
  responses: Array<{ question: string; answer: string }>;
  symptoms: string[];
  mood: string;
  energyLevel: number;
}

export interface CheckInResult {
  classification: 'green' | 'yellow' | 'red';
  message: string;
  streak: number;
  requiresFollowUp: boolean;
}

export function submitMockDailyCheckIn(submission: CheckInSubmission): CheckInResult {
  const patient = getMockPatientById(submission.patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }

  // Analyze the submission to determine risk classification
  const hasCriticalSymptoms = submission.symptoms.some(s => 
    s.toLowerCase().includes('chest pain') || 
    s.toLowerCase().includes('severe') ||
    s.toLowerCase().includes('difficulty')
  );

  const hasModerateSymptoms = submission.symptoms.some(s => 
    s.toLowerCase().includes('moderate') ||
    s.toLowerCase().includes('swelling') ||
    s.toLowerCase().includes('shortness of breath')
  );

  const hasLowEnergy = submission.energyLevel < 4;
  const hasPoorMood = submission.mood === 'not good';

  // Determine classification
  let classification: 'green' | 'yellow' | 'red';
  let message: string;
  let requiresFollowUp: boolean;

  if (hasCriticalSymptoms) {
    classification = 'red';
    message = 'Your responses indicate symptoms that need attention. A care team member will contact you soon.';
    requiresFollowUp = true;
  } else if (hasModerateSymptoms || (hasLowEnergy && hasPoorMood)) {
    classification = 'yellow';
    message = 'Thank you for checking in. We\'re monitoring your progress and will reach out if needed.';
    requiresFollowUp = true;
  } else {
    classification = 'green';
    message = 'Great job! Your responses look positive. Keep up the excellent work with your recovery!';
    requiresFollowUp = false;
  }

  // Update patient data
  const currentStreak = patient.recoveryStreak || 0;
  const newStreak = currentStreak + 1;
  
  updateMockPatient(submission.patientId, {
    dailyCheckInStatus: 'completed',
    lastCheckIn: new Date().toISOString(),
    recoveryStreak: newStreak,
    aiAlertLevel: classification,
    patientReportedSymptoms: submission.symptoms
  });

  return {
    classification,
    message,
    streak: newStreak,
    requiresFollowUp
  };
}
