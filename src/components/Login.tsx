import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Heart, User, Lock, Mail, AlertCircle } from 'lucide-react';

type UserRole = 'patient' | 'clinician' | 'admin';

interface LoginProps {
  onLogin: (role: UserRole, email: string, name?: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials for easy access
  const demoCredentials = {
    patient: { email: 'patient@demo.com', password: 'demo123', name: 'Margaret Johnson' },
    clinician: { email: 'clinician@demo.com', password: 'demo123', name: 'Dr. Sarah Chen' },
    admin: { email: 'admin@demo.com', password: 'demo123', name: 'System Administrator' }
  };

  // Determine role from email
  const getRoleFromEmail = (email: string): UserRole => {
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('admin')) return 'admin';
    if (lowerEmail.includes('clinician') || lowerEmail.includes('doctor') || lowerEmail.includes('dr')) return 'clinician';
    return 'patient';
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

      // Determine role from email
      const role = getRoleFromEmail(email);
      
      // For patients, require name
      if (role === 'patient' && !name.trim()) {
        setError('Please enter your name');
        setIsLoading(false);
        return;
      }
      
      // Simple validation for demo - check if credentials match demo credentials
      const demo = demoCredentials[role];
      if (email === demo.email && password === demo.password) {
        onLogin(role, email, name || demo.name);
      } else {
        // Allow any email/password for demo purposes
        setError('Invalid credentials.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
            <h1 className="text-4xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Continuum Care
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-Powered Post-Discharge Heart Patient Risk Management
          </p>
        </div>

        {/* Login Form */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Show name field for patient emails */}
                {email && getRoleFromEmail(email) === 'patient' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="name">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Margaret Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        autoComplete="name"
                      />
                    </div>
                    <p className="text-xs text-gray-500">We'll use this to personalize your experience</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 animate-in fade-in duration-1000">
          <p>© 2025 Continuum Care. Saving lives through predictive analytics and proactive care.</p>
          <p className="mt-2 text-xs text-gray-500">
            HIPAA Compliant | SOC 2 Certified | HL7 FHIR R4 Compatible
          </p>
        </div>
      </div>
    </div>
  );
}
