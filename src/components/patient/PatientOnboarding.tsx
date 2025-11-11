import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { 
  Heart,
  Shield,
  Bell,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { config, simulateDelay } from '../../utils/config';
import { updateMockPatient } from '../../utils/mockData';

interface PatientOnboardingProps {
  patientId: string;
  patientName: string;
  onComplete: () => void;
}

export function PatientOnboarding({ patientId, patientName, onComplete }: PatientOnboardingProps) {
  const [step, setStep] = useState(0);
  const [consentGiven, setConsentGiven] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConsent = async () => {
    if (!consentGiven) {
      toast.error('Please accept the terms to continue');
      return;
    }

    setSubmitting(true);

    try {
      if (config.useMockData) {
        // Mock mode - simulate onboarding
        await simulateDelay();
        
        // Update mock patient data to mark as onboarded
        updateMockPatient(patientId, { onboarded: true });
        
        toast.success('Welcome to CardioGuard AI!');
        onComplete();
      } else {
        // Real mode - call Supabase backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patient/${patientId}/onboard`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ consentGiven: true })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to complete onboarding');
        }

        toast.success('Welcome to CardioGuard AI!');
        onComplete();
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      title: 'Welcome to CardioGuard AI',
      content: (
        <div className="text-center space-y-6">
          <div className="inline-flex p-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-4">
            <Heart className="w-24 h-24 text-blue-600" fill="currentColor" />
          </div>
          <h2 className="text-3xl">Welcome, {patientName.split(' ')[0]}!</h2>
          <p className="text-xl text-gray-700">
            We're here to support your recovery journey after your recent hospital stay.
          </p>
          <p className="text-gray-600">
            CardioGuard AI helps your care team monitor your progress and catch any concerns early,
            so you can focus on getting better.
          </p>
        </div>
      )
    },
    {
      title: 'How It Works',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl text-center mb-8">Your Daily Routine</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-5 bg-blue-50 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl">
                1
              </div>
              <div>
                <h3 className="text-lg mb-1">Daily Check-in (2 minutes)</h3>
                <p className="text-gray-600">
                  Answer a few simple questions about how you're feeling each day
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-purple-50 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                2
              </div>
              <div>
                <h3 className="text-lg mb-1">AI Analysis</h3>
                <p className="text-gray-600">
                  Our AI reviews your responses and alerts your care team if anything needs attention
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-green-50 rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl">
                3
              </div>
              <div>
                <h3 className="text-lg mb-1">Personalized Support</h3>
                <p className="text-gray-600">
                  Get health tips, track your progress, and receive timely follow-up from your care team
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Your Privacy & Consent',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
              <Shield className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl mb-2">We Protect Your Privacy</h2>
          </div>

          <div className="space-y-4 text-left">
            <Card className="border-2 border-blue-100 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p><strong>HIPAA Compliant:</strong> All your health data is encrypted and securely stored</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 bg-purple-50/50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p><strong>Your Care Team Only:</strong> Only authorized healthcare providers can access your information</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-100 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p><strong>AI Assistance, Not Replacement:</strong> AI helps monitor your recovery, but your doctors make all care decisions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
                I understand that CardioGuard AI will help my care team monitor my recovery. 
                I consent to daily check-ins and understand my health data will be shared with 
                my authorized healthcare providers. I can review the full{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>.
              </label>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <Card className="border-0 shadow-2xl bg-white">
          <CardContent className="p-8 md:p-12">
            {/* Progress indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === step
                      ? 'w-12 bg-blue-600'
                      : index < step
                      ? 'w-8 bg-green-600'
                      : 'w-8 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              {currentStep.content}
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  size="lg"
                >
                  Previous
                </Button>
              )}
              
              {step < steps.length - 1 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleConsent}
                  disabled={!consentGiven || submitting}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {submitting ? 'Setting up...' : 'Get Started'}
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
