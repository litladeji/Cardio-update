import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Heart, Lock, Mail, AlertCircle, Stethoscope, ArrowLeft } from 'lucide-react';

interface ClinicianLoginProps {
  onLogin: (email: string, name: string) => void;
  onBackToHome?: () => void;
}

export function ClinicianLogin({ onLogin, onBackToHome }: ClinicianLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials
  const demoCredentials = {
    email: 'clinician@demo.com',
    password: 'demo123',
    name: 'Dr. Sarah Chen'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (!email || !password) {
        setError('Please enter email and password');
        setIsLoading(false);
        return;
      }

      // Validate credentials
      if (email === demoCredentials.email && password === demoCredentials.password) {
        onLogin(email, demoCredentials.name);
      } else {
        setError('Invalid credentials. Use clinician@demo.com / demo123');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleQuickDemoAccess = () => {
    setError('');
    setIsLoading(true);
    
    // Quick demo access with shorter delay
    setTimeout(() => {
      onLogin(demoCredentials.email, demoCredentials.name);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back Button */}
        {onBackToHome && (
          <div className="mb-6 animate-in fade-in duration-500">
            <Button
              variant="ghost"
              onClick={onBackToHome}
              className="text-gray-700 hover:text-gray-900 text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl shadow-lg">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              CardioGuard
            </h1>
          </div>
          <p className="text-gray-700 text-2xl font-bold mb-2">
            Clinician Portal
          </p>
          <p className="text-gray-600 text-base">
            AI-powered patient risk management and care coordination
          </p>
        </div>

        {/* Login Form */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-2 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl text-center font-bold">Clinician Sign In</CardTitle>
              <CardDescription className="text-center text-base mt-2">
                Access patient dashboards and risk analytics
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
                      placeholder="clinician@demo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 text-base"
                      autoComplete="email"
                    />
                  </div>
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
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In to Clinician Portal'}
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
                  onClick={handleQuickDemoAccess}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 h-12 text-base shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  <Stethoscope className="w-5 h-5 mr-2" />
                  {isLoading ? 'Loading Demo...' : 'Quick Demo Access'}
                </Button>

                {/* Demo credentials hint */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-center text-gray-500 mb-2">
                    Manual login credentials (optional)
                  </p>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-gray-700">
                      <span className="font-semibold">Email:</span> clinician@demo.com
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
