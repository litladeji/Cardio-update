import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { UserPlus, X, Mail, Phone, Loader2, CheckCircle2, Copy } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { config, simulateDelay } from '../utils/config';
import { addMockPatient, type Patient } from '../utils/mockData';

interface AddPatientFormProps {
  onPatientAdded: () => void;
  onCancel: () => void;
}

export function AddPatientForm({ onPatientAdded, onCancel }: AddPatientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    diagnosis: '',
    riskFactors: [] as string[],
    bloodPressure: '',
    heartRate: '',
    weight: ''
  });

  const [riskFactorInput, setRiskFactorInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
    patientId: string;
  } | null>(null);

  const commonRiskFactors = [
    'Diabetes',
    'Hypertension',
    'Previous MI',
    'Obesity',
    'Smoking History',
    'COPD',
    'Sleep Apnea',
    'High Cholesterol'
  ];

  const handleAddRiskFactor = (factor: string) => {
    if (factor && !formData.riskFactors.includes(factor)) {
      setFormData({ ...formData, riskFactors: [...formData.riskFactors, factor] });
    }
  };

  const handleRemoveRiskFactor = (factor: string) => {
    setFormData({
      ...formData,
      riskFactors: formData.riskFactors.filter(f => f !== factor)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.age || !formData.email || !formData.phone || !formData.diagnosis) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Use mock data mode
      if (config.useMockData) {
        await simulateDelay();
        
        // Generate mock patient ID
        const patientId = `P${String(Date.now()).slice(-3)}`;
        const password = `CardioGuard${Math.random().toString(36).slice(-6)}`;
        
        // Create mock patient
        const newPatient: Patient = {
          id: patientId,
          name: formData.name,
          age: parseInt(formData.age),
          diagnosis: formData.diagnosis,
          dischargeDate: new Date().toISOString(),
          riskScore: Math.floor(Math.random() * 40) + 30, // Random score between 30-70
          riskLevel: 'medium',
          riskFactors: formData.riskFactors,
          contactInfo: {
            phone: formData.phone,
            email: formData.email
          },
          vitalSigns: formData.bloodPressure && formData.heartRate && formData.weight ? {
            bloodPressure: formData.bloodPressure,
            heartRate: parseInt(formData.heartRate),
            weight: parseInt(formData.weight)
          } : undefined,
          onboarded: false,
          dailyCheckInStatus: 'pending'
        };
        
        // Add to mock data
        addMockPatient(newPatient);
        
        setCreatedCredentials({
          email: formData.email,
          password: password,
          patientId: patientId
        });

        toast.success('Patient profile created successfully! (Demo Mode)');
        return;
      }

      // Otherwise use Supabase
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            name: formData.name,
            age: parseInt(formData.age),
            email: formData.email,
            phone: formData.phone,
            diagnosis: formData.diagnosis,
            riskFactors: formData.riskFactors,
            vitalSigns: formData.bloodPressure && formData.heartRate && formData.weight ? {
              bloodPressure: formData.bloodPressure,
              heartRate: parseInt(formData.heartRate),
              weight: parseInt(formData.weight)
            } : undefined
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create patient');
      }

      const data = await response.json();
      setCreatedCredentials({
        email: data.credentials.email,
        password: data.credentials.password,
        patientId: data.patient.id
      });

      toast.success('Patient profile created successfully!');
    } catch (err: any) {
      console.error('Error creating patient:', err);
      setError(err.message || 'Failed to create patient profile');
      setLoading(false);
    }
  };

  const handleCopyCredentials = () => {
    if (createdCredentials) {
      const text = `CardioGuard Login Credentials\n\nPatient ID: ${createdCredentials.patientId}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\n\nPlease keep these credentials secure.`;
      navigator.clipboard.writeText(text);
      toast.success('Credentials copied to clipboard!');
    }
  };

  const handleSendCredentials = async () => {
    if (createdCredentials) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients/send-credentials`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              patientId: createdCredentials.patientId,
              email: createdCredentials.email
            })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to send credentials');
        }

        toast.success('Credentials sent via SMS/Email!');
      } catch (err) {
        console.error('Error sending credentials:', err);
        toast.error('Failed to send credentials. Please copy and send manually.');
      }
    }
  };

  const handleFinish = () => {
    onPatientAdded();
    setCreatedCredentials(null);
    setFormData({
      name: '',
      age: '',
      email: '',
      phone: '',
      diagnosis: '',
      riskFactors: [],
      bloodPressure: '',
      heartRate: '',
      weight: ''
    });
  };

  // Show credentials screen after successful creation
  if (createdCredentials) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-2 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-bold">Patient Created Successfully!</CardTitle>
            <CardDescription className="text-center text-base mt-2">
              Login credentials have been generated. Please share these securely with the patient.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Credentials Display */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Patient Login Credentials</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Patient ID</Label>
                  <div className="font-mono text-lg bg-white px-4 py-2 rounded border mt-1">
                    {createdCredentials.patientId}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Email</Label>
                  <div className="font-mono text-lg bg-white px-4 py-2 rounded border mt-1">
                    {createdCredentials.email}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Temporary Password</Label>
                  <div className="font-mono text-lg bg-white px-4 py-2 rounded border mt-1">
                    {createdCredentials.password}
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <Alert className="bg-amber-50 border-amber-300">
              <AlertDescription className="text-base">
                <strong>Important:</strong> The patient should change their password after the first login. These credentials will only be shown once.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleCopyCredentials}
                variant="outline"
                className="h-12 text-base"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Credentials
              </Button>
              <Button
                onClick={handleSendCredentials}
                variant="outline"
                className="h-12 text-base"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send via SMS/Email
              </Button>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full h-12 text-base"
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold">Add New Patient</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Create a patient profile and generate login credentials
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" onClick={onCancel}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-semibold">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., John Smith"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-base font-semibold">
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="e.g., 65"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="patient@email.com"
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-semibold">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="555-0123"
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Medical Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis" className="text-base font-semibold">
                      Diagnosis <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.diagnosis}
                      onValueChange={(value) => setFormData({ ...formData, diagnosis: value })}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select primary diagnosis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acute Myocardial Infarction">Acute Myocardial Infarction</SelectItem>
                        <SelectItem value="Congestive Heart Failure">Congestive Heart Failure</SelectItem>
                        <SelectItem value="Atrial Fibrillation">Atrial Fibrillation</SelectItem>
                        <SelectItem value="Coronary Artery Disease">Coronary Artery Disease</SelectItem>
                        <SelectItem value="Heart Valve Replacement">Heart Valve Replacement</SelectItem>
                        <SelectItem value="Cardiac Arrhythmia">Cardiac Arrhythmia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Risk Factors */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Risk Factors</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {commonRiskFactors.map((factor) => (
                        <Badge
                          key={factor}
                          variant={formData.riskFactors.includes(factor) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            if (formData.riskFactors.includes(factor)) {
                              handleRemoveRiskFactor(factor);
                            } else {
                              handleAddRiskFactor(factor);
                            }
                          }}
                        >
                          {factor}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={riskFactorInput}
                        onChange={(e) => setRiskFactorInput(e.target.value)}
                        placeholder="Add custom risk factor..."
                        className="h-10"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddRiskFactor(riskFactorInput);
                            setRiskFactorInput('');
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          handleAddRiskFactor(riskFactorInput);
                          setRiskFactorInput('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                    {formData.riskFactors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.riskFactors.map((factor) => (
                          <Badge key={factor} variant="secondary" className="gap-1">
                            {factor}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => handleRemoveRiskFactor(factor)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Vital Signs (Optional) */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Initial Vital Signs (Optional)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure" className="text-base font-semibold">Blood Pressure</Label>
                    <Input
                      id="bloodPressure"
                      value={formData.bloodPressure}
                      onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                      placeholder="120/80"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate" className="text-base font-semibold">Heart Rate (bpm)</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                      placeholder="72"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-base font-semibold">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="165"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-base">{error}</AlertDescription>
                </Alert>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 h-12 text-base"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Patient...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Patient Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
