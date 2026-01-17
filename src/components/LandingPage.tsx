import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Heart, User, Stethoscope, Shield, ArrowRight, TrendingDown, Target, Users } from 'lucide-react';

interface LandingPageProps {
  onSelectPortal: (portal: 'patient' | 'clinician' | 'admin') => void;
}

export function LandingPage({ onSelectPortal }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="pt-16 pb-12 text-center px-4">
        <div className="flex items-center justify-center gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
            <Heart className="w-14 h-14 text-white" fill="white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Continuum Care
          </h1>
        </div>
        <p className="text-gray-700 text-2xl font-semibold mb-3">
          AI-Powered Post-Discharge Heart Patient Risk Management
        </p>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Advanced predictive analytics and personalized care coordination to reduce readmissions
          and improve patient outcomes.
        </p>
      </div>

      {/* Portal Selection Cards */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">Select Your Portal</h2>
        
        <div className="grid md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Patient Portal */}
          <Card className="border-2 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col"
                onClick={() => onSelectPortal('patient')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-5 p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Patient Portal</CardTitle>
              <CardDescription className="text-base text-gray-600">
                For heart patients managing their recovery journey
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Daily symptom check-ins</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Personalized health insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Care team messaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Recovery progress tracking</span>
                </li>
              </ul>
              <Button 
                className="w-full group-hover:bg-blue-600 transition-colors text-base py-6"
                onClick={() => onSelectPortal('patient')}
              >
                Access Patient Portal
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Clinician Portal */}
          <Card className="border-2 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col"
                onClick={() => onSelectPortal('clinician')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-5 p-5 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Clinician Portal</CardTitle>
              <CardDescription className="text-base text-gray-600">
                For care managers and clinical teams
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">AI-powered risk stratification</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Prioritized patient dashboards</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Real-time vital trend analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Actionable intervention alerts</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-colors text-base py-6"
                onClick={() => onSelectPortal('clinician')}
              >
                Access Clinician Portal
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Administrator Portal */}
          <Card className="border-2 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col"
                onClick={() => onSelectPortal('admin')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-5 p-5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</CardTitle>
              <CardDescription className="text-base text-gray-600">
                For system administrators and executives
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 mb-6 flex-1">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Readmission reduction metrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">ROI and cost savings analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">Executive KPI dashboards</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <span className="text-base text-gray-700">System-wide performance insights</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors text-base py-6"
                onClick={() => onSelectPortal('admin')}
              >
                Access Admin Portal
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Why CardioGuard Section - Redesigned */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-center text-4xl font-bold text-gray-900 mb-4">
          Why Continuum Care?
        </h3>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Proven results in reducing readmissions and improving patient outcomes through AI-driven care management
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Metric 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                28.6%
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Readmission Reduction
              </h4>
              <p className="text-base text-gray-600">
                Significant decrease in 30-day cardiac readmissions through proactive monitoring
              </p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                0.84
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Model Accuracy (AUC)
              </h4>
              <p className="text-base text-gray-600">
                High-precision AI predictions identifying at-risk patients early
              </p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                92%
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Patient Engagement
              </h4>
              <p className="text-base text-gray-600">
                Exceptional adoption rate with gamified recovery tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-12 px-4 pt-8">
        <p className="text-base text-gray-700 font-semibold mb-2">
          © 2025 Continuum Care. Saving lives through predictive analytics and proactive care.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          HIPAA Compliant | SOC 2 Certified | HL7 FHIR R4 Compatible
        </p>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg py-2 px-4 inline-block">
          ⚠️ Prototype for demonstration purposes only. Not for clinical use.
        </p>
      </div>
    </div>
  );
}
