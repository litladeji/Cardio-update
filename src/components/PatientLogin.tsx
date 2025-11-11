import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Heart, User, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { HospitalSelection } from './HospitalSelection';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PatientLoginProps {
  onLogin: (email: string, name: string) => void;
  onBackToHome?: () => void;
}

export function PatientLogin({ onLogin, onBackToHome }: PatientLoginProps) {
  const [showHospitalSelection, setShowHospitalSelection] = useState(true);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [selectedHospitalName, setSelectedHospitalName] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials
  const demoCredentials = {
    email: 'patient@demo.com',
    password: 'demo123',
    name: 'Evelyn Carter'
  };

  const handleHospitalSelected = (hospitalId: string, hospitalName: string) => {
    setSelectedHospitalId(hospitalId);
    setSelectedHospitalName(hospitalName);
    setShowHospitalSelection(false);
  };

  const handleAutoFillDemo = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setName(demoCredentials.name);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter email and password');
      setIsLoading(false);
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    try {
      // Try real authentication first
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password,
            hospitalId: selectedHospitalId
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        onLogin(email, data.patient.name || name);
        return;
      }

      // Fall back to demo credentials
      if (email === demoCredentials.email && password === demoCredentials.password) {
        onLogin(email, name);
      } else {
        setError('Invalid credentials. Use patient@demo.com / demo123 or credentials provided by your clinician');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fall back to demo credentials
      if (email === demoCredentials.email && password === demoCredentials.password) {
        onLogin(email, name);
      } else {
        setError('Login failed. Please try again.');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <div className="mb-6 animate-in fade-in duration-500 flex items-center justify-between">
          {onBackToHome && (
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="text-gray-700 hover:text-gray-900 text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => setShowHospitalSelection(true)}
            className="text-gray-700 hover:text-gray-900 text-base ml-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Change Hospital
          </Button>
        </div>

        {/* Selected Hospital Badge */}
        {selectedHospitalName && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg animate-in fade-in duration-500">
            <p className="text-sm text-gray-600 mb-1">Selected Hospital</p>
            <p className="font-semibold text-blue-900">{selectedHospitalName}</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
              <Heart className="w-12 h-12 text-white" fill="white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              CardioGuard
            </h1>
          </div>
          <p className="text-gray-700 text-2xl font-bold mb-2">
            Patient Portal
          </p>
          <p className="text-gray-600 text-base">
            Track your recovery journey and connect with your care team
          </p>
        </div>

        {/* Login Form */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-2 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl text-center font-bold">Patient Sign In</CardTitle>
              <CardDescription className="text-center text-base mt-2">
                Access your personalized recovery dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="patient@demo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 text-base"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold text-gray-700">Your Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Margaret Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11 h-12 text-base"
                      autoComplete="name"
                    />
                  </div>
                  <p className="text-sm text-gray-500">We'll use this to personalize your experience</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-semibold text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-12 text-base"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="text-base">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In to Patient Portal'}
                </Button>

                {/* Quick Demo Access */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleAutoFillDemo}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 h-12 text-base shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Auto-Fill Demo Credentials
                </Button>

                {/* Demo credentials hint */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-center text-gray-500 mb-2">
                    Demo patient: Evelyn Carter
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-gray-700">
                      <span className="font-semibold">Email:</span> patient@demo.com
                    </p>
                    <p className="text-xs text-gray-700 mt-0.5">
                      <span className="font-semibold">Password:</span> demo123
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-600 animate-in fade-in duration-1000">
          <p className="text-base font-semibold mb-2">© 2025 CardioGuard. Saving lives through predictive analytics and proactive care.</p>
          <p className="text-sm text-gray-500">
            HIPAA Compliant | SOC 2 Certified | HL7 FHIR R4 Compatible
          </p>
        </div>
      </div>
    </div>
  );
}
