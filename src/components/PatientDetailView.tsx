import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { 
  ArrowLeft,
  Activity,
  Heart,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Droplets,
  Weight,
  Stethoscope,
  Trash2
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { CircularProgress } from './CircularProgress';
import { PatientAvatar } from './PatientAvatar';
import { Sparkline } from './Sparkline';
import { config, simulateDelay } from '../utils/config';
import { 
  getMockPatientById, 
  getMockRecommendationsForPatient,
  generateMockActivityLog,
  updateMockPatient
} from '../utils/mockData';

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
}

interface Recommendation {
  action: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface CheckIn {
  date: string;
  symptoms: string[];
  vitalSigns: {
    bloodPressure: string;
    heartRate: number;
    weight: number;
  };
  notes?: string;
}

interface PatientDetailViewProps {
  patientId: string;
  onBack: () => void;
}

export function PatientDetailView({ patientId, onBack }: PatientDetailViewProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Check-in form state
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [weight, setWeight] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      // Use mock data if enabled
      if (config.useMockData) {
        await simulateDelay();
        
        const mockPatient = getMockPatientById(patientId);
        if (!mockPatient) {
          throw new Error('Patient not found');
        }
        
        setPatient(mockPatient);
        
        // Get mock recommendations
        const mockRecommendations = getMockRecommendationsForPatient(patientId);
        setRecommendations(mockRecommendations.map(r => ({
          action: r.title,
          rationale: r.description,
          priority: r.priority === 'critical' ? 'high' : r.priority,
          category: r.type
        })));
        
        // Generate mock check-ins
        const mockCheckIns: CheckIn[] = [
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            symptoms: ['Mild fatigue'],
            vitalSigns: {
              bloodPressure: mockPatient.vitalSigns?.bloodPressure || '120/80',
              heartRate: mockPatient.vitalSigns?.heartRate || 72,
              weight: mockPatient.vitalSigns?.weight || 170
            },
            notes: 'Feeling better today'
          },
          {
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            symptoms: mockPatient.patientReportedSymptoms || [],
            vitalSigns: {
              bloodPressure: mockPatient.vitalSigns?.bloodPressure || '120/80',
              heartRate: mockPatient.vitalSigns?.heartRate || 72,
              weight: mockPatient.vitalSigns?.weight || 170
            },
            notes: 'Daily check-in completed'
          }
        ];
        setCheckIns(mockCheckIns);
        setLoading(false);
        return;
      }

      // Otherwise fetch from Supabase
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients/${patientId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch patient details');
      }

      const data = await response.json();
      setPatient(data.patient);
      setRecommendations(data.recommendations);
      setCheckIns(data.checkIns);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      toast.error('Failed to load patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const checkInData = {
        vitalSigns: {
          bloodPressure,
          heartRate: parseInt(heartRate),
          weight: parseFloat(weight)
        },
        symptoms: symptoms.split(',').map(s => s.trim()).filter(Boolean),
        notes
      };

      // Use mock data if enabled
      if (config.useMockData) {
        await simulateDelay();
        
        // Add new check-in to the beginning of the list
        const newCheckIn: CheckIn = {
          date: new Date().toISOString(),
          symptoms: checkInData.symptoms,
          vitalSigns: checkInData.vitalSigns,
          notes: checkInData.notes
        };
        
        setCheckIns([newCheckIn, ...checkIns]);
        
        // Update patient vitals
        updateMockPatient(patientId, {
          vitalSigns: checkInData.vitalSigns,
          lastCheckIn: new Date().toISOString(),
          dailyCheckInStatus: 'completed'
        });
        
        toast.success('Check-in recorded successfully (Demo Mode)');
        setShowCheckInForm(false);
        
        // Reset form
        setBloodPressure('');
        setHeartRate('');
        setWeight('');
        setSymptoms('');
        setNotes('');
        
        // Refresh data
        fetchPatientDetails();
        return;
      }

      // Otherwise use Supabase
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients/${patientId}/check-in`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(checkInData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit check-in');
      }

      toast.success('Check-in recorded successfully');
      setShowCheckInForm(false);
      
      // Reset form
      setBloodPressure('');
      setHeartRate('');
      setWeight('');
      setSymptoms('');
      setNotes('');
      
      // Refresh data
      fetchPatientDetails();
    } catch (error) {
      console.error('Error submitting check-in:', error);
      toast.error('Failed to record check-in');
    }
  };

  const handleDeletePatient = async () => {
    setDeleting(true);
    
    try {
      // Use mock data if enabled
      if (config.useMockData) {
        await simulateDelay();
        
        // In mock mode, we can't actually delete from the array since it's imported
        // But we can show success and navigate back
        toast.success(`Patient deleted successfully (Demo Mode)`, {
          description: 'Note: Mock data will reset on page refresh'
        });
        
        // Go back to dashboard
        onBack();
        return;
      }

      // Otherwise use Supabase
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients/${patientId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete patient');
      }

      const data = await response.json();
      toast.success(`Patient ${data.deletedPatient.name} deleted successfully`);
      
      // Go back to dashboard
      onBack();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete patient');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };



  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium': return <Activity className="w-5 h-5 text-orange-600" />;
      case 'low': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl">
              <Stethoscope className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 text-lg mb-2">Loading patient profile...</p>
          <p className="text-gray-500 text-sm">Fetching medical history and recommendations</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Patient not found</p>
          <Button onClick={onBack} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const generateSparkline = () => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 60);
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto space-y-6 relative">
        {/* Header */}
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <Button variant="outline" onClick={onBack} className="hover:shadow-md transition-all hover:scale-105">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <PatientAvatar 
            name={patient.name} 
            status={
              patient.riskLevel === 'critical' ? 'critical' :
              patient.riskLevel === 'high' ? 'warning' :
              patient.lastCheckIn ? 'online' : 'offline'
            }
            size="lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{patient.name}</h1>
              <Badge variant="outline" className="border-gray-300 bg-gray-50">#{patient.id}</Badge>
            </div>
            <p className="text-gray-600">{patient.diagnosis}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteDialog(true)}
            className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 hover:shadow-md transition-all"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Patient
          </Button>
        </div>

        {/* Patient Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Risk Score Card */}
          <Card className="border-0 shadow-2xl relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-slate-100">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${getRiskColor(patient.riskLevel)} 10px, ${getRiskColor(patient.riskLevel)} 11px)`
            }}></div>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" style={{ color: getRiskColor(patient.riskLevel) }} />
                30-Day Readmission Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex flex-col items-center py-4">
                <div className="relative inline-flex items-center justify-center">
                  <CircularProgress
                    value={patient.riskScore}
                    size={160}
                    strokeWidth={12}
                    color={getRiskColor(patient.riskLevel)}
                    showValue={false}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-1" style={{ color: getRiskColor(patient.riskLevel) }}>
                      {patient.riskScore}
                    </div>
                    <div className="text-sm text-gray-600">Risk Score</div>
                  </div>
                </div>
                <div className="mt-6 px-6 py-3 rounded-xl text-center w-full" style={{ 
                  backgroundColor: `${getRiskColor(patient.riskLevel)}15`,
                  border: `2px solid ${getRiskColor(patient.riskLevel)}30`
                }}>
                  <div className="text-xl uppercase tracking-wider" style={{ color: getRiskColor(patient.riskLevel) }}>
                    {patient.riskLevel} Risk
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Info */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Age:</span>
                <span>{patient.age} years</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Diagnosis:</span>
                <span>{patient.diagnosis}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Discharged:</span>
                <span>{formatDate(patient.dischargeDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Phone:</span>
                <span>{patient.contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Email:</span>
                <span>{patient.contactInfo.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <Card className="border-0 shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Latest Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.vitalSigns ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 rounded-xl border-2 border-red-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-600" />
                        <div className="text-gray-600 text-sm">Blood Pressure</div>
                      </div>
                      <Sparkline data={generateSparkline()} width={50} height={20} color="#dc2626" />
                    </div>
                    <div className="text-4xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{patient.vitalSigns.bloodPressure}</div>
                    <div className="text-xs text-gray-500 mt-1">mmHg</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <div className="text-gray-600 text-sm">Heart Rate</div>
                      </div>
                      <Sparkline data={generateSparkline()} width={50} height={20} color="#2563eb" />
                    </div>
                    <div className="text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{patient.vitalSigns.heartRate}</div>
                    <div className="text-xs text-gray-500 mt-1">bpm</div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50 via-violet-50 to-purple-50 rounded-xl border-2 border-purple-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Weight className="w-5 h-5 text-purple-600" />
                        <div className="text-gray-600 text-sm">Weight</div>
                      </div>
                      <Sparkline data={generateSparkline()} width={50} height={20} color="#9333ea" />
                    </div>
                    <div className="text-4xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{patient.vitalSigns.weight}</div>
                    <div className="text-xs text-gray-500 mt-1">lbs</div>
                  </div>
                  
                  {patient.lastCheckIn && (
                    <div className="text-sm text-gray-500 pt-2 border-t border-gray-200 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      Last updated: {formatDate(patient.lastCheckIn)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No vital signs recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Risk Factors */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {patient.riskFactors.map((factor, index) => (
                <Badge 
                  key={factor} 
                  variant="outline" 
                  className="border-orange-300 bg-orange-50/50 text-orange-800 px-3 py-1 animate-in fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {factor}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 via-white to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                AI-Generated Recommendations
              </CardTitle>
              <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0">{recommendations.length} Actions</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index} 
                className="border-0 rounded-xl p-5 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg">{getPriorityIcon(rec.priority)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg">{rec.action}</h3>
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">{rec.category}</Badge>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className={rec.priority === 'high' ? 'bg-gradient-to-r from-red-600 to-pink-600 border-0' : ''}
                      >
                        {rec.priority.toUpperCase()} Priority
                      </Badge>
                    </div>
                    <p className="text-gray-700">{rec.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
            {recommendations.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No specific recommendations at this time
              </div>
            )}
          </CardContent>
        </Card>

        {/* Check-in Form & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Check-in Form */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  Record Check-in
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setShowCheckInForm(!showCheckInForm)}
                  className={showCheckInForm ? '' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
                >
                  {showCheckInForm ? 'Cancel' : 'New Check-in'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showCheckInForm ? (
                <form onSubmit={handleCheckInSubmit} className="space-y-4">
                  <div>
                    <Label>Blood Pressure (e.g., 120/80)</Label>
                    <Input
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      placeholder="120/80"
                      required
                    />
                  </div>
                  <div>
                    <Label>Heart Rate (bpm)</Label>
                    <Input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      placeholder="72"
                      required
                    />
                  </div>
                  <div>
                    <Label>Weight (lbs)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="165"
                      required
                    />
                  </div>
                  <div>
                    <Label>Symptoms (comma separated)</Label>
                    <Input
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Shortness of breath, Fatigue"
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional observations..."
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all">
                    Submit Check-in
                  </Button>
                </form>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Click "New Check-in" to record patient data</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Check-in History */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Check-in History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {checkIns.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {checkIns.map((checkIn, index) => (
                    <div 
                      key={index} 
                      className="border-0 rounded-lg p-4 bg-gradient-to-br from-gray-50 to-slate-50 shadow-sm hover:shadow-md transition-all animate-in fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="text-sm text-gray-600 mb-2">
                        {formatDate(checkIn.date)}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-gray-600">BP:</span> {checkIn.vitalSigns.bloodPressure}
                        </div>
                        <div>
                          <span className="text-gray-600">HR:</span> {checkIn.vitalSigns.heartRate}
                        </div>
                        <div>
                          <span className="text-gray-600">Wt:</span> {checkIn.vitalSigns.weight}
                        </div>
                      </div>
                      {checkIn.symptoms.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-600">Symptoms:</span> {checkIn.symptoms.join(', ')}
                        </div>
                      )}
                      {checkIn.notes && (
                        <div className="text-sm text-gray-600 mt-1">
                          {checkIn.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No check-ins recorded yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Patient Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{patient.name}</span> (ID: {patient.id})? 
              This will permanently remove all patient data including check-in history and login credentials. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePatient}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete Patient'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
