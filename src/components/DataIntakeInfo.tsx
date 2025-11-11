import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Database, Heart, MessageSquare, FileText, Check } from 'lucide-react';

export function DataIntakeInfo() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            CardioGuard Data Intake System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">
            CardioGuard's comprehensive data intake system integrates seamlessly with hospital EHRs, 
            patient engagement channels, and interoperability standards to provide a complete 
            post-discharge heart patient risk management solution.
          </p>

          {/* EHR Integration */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-blue-900">EHR Integration</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Automatically pulls discharge summaries, vital signs, and medication data from 
                  hospital EHR systems like Epic, Cerner, and Allscripts using HL7 FHIR R4 APIs.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Real-time Sync:</strong> Automated daily synchronization of patient data
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Field Mapping:</strong> Intelligent mapping of EHR fields to CardioGuard schema
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Data Sources:</strong> Discharge summaries, vital signs, medications, lab results
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Standards:</strong> HL7 FHIR R4, LOINC, SNOMED CT codes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SMS & App Engagement */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-green-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-green-900">Multi-Channel Patient Engagement</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Collect daily patient inputs via SMS and mobile app including weight, fatigue, 
                  breathing, mood, and medication adherence to power AI risk prediction.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>SMS Reminders:</strong> Automated daily check-in reminders via Twilio
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>AI-Guided Questions:</strong> Adaptive symptom assessment based on patient responses
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Gamification:</strong> Recovery streaks and achievements drive engagement
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Metrics Tracked:</strong> Weight, fatigue, breathing, swelling, medication adherence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Risk Prediction */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-purple-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-purple-900">AI Risk Prediction Engine</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Machine learning models analyze trends and compare them to historical patterns 
                  of 30-day readmissions, assigning risk scores and identifying top contributors.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Predictive Model:</strong> 0.84 AUC score for 30-day readmission prediction
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Real-time Classification:</strong> Green/Yellow/Red alert levels from daily check-ins
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Risk Factors:</strong> HRV drop, missed medications, vital sign anomalies
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Actionable Alerts:</strong> Care team notifications with intervention recommendations
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FHIR Compliance */}
          <div className="p-6 bg-white rounded-xl shadow-md border border-orange-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-orange-900">FHIR-Compliant Export</h3>
                <p className="text-sm text-gray-700 mb-3">
                  All patient data, observations, and risk assessments export in HL7 FHIR R4 format 
                  for reporting, reimbursement, and EHR integration.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>FHIR R4 Resources:</strong> Patient, Condition, Observation bundles
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Standard Codes:</strong> LOINC for vitals, SNOMED CT for conditions
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Use Cases:</strong> Reporting, analytics, CMS quality measures, reimbursement
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-600 mt-0.5" />
                    <span className="text-gray-600">
                      <strong>Integration:</strong> Import back into Epic, Cerner, or other EHRs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Outcome Metrics */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h3 className="mb-4 text-green-900">Program Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-3xl text-green-600 mb-1">28.6%</p>
                <p className="text-sm text-gray-600">Readmission Reduction</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-3xl text-blue-600 mb-1">92%</p>
                <p className="text-sm text-gray-600">Patient Engagement</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="text-3xl text-purple-600 mb-1">$245K</p>
                <p className="text-sm text-gray-600">Cost Savings</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
