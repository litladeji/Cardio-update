import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Activity, 
  AlertCircle, 
  Phone, 
  Calendar,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Waves,
  Droplet,
  UserPlus,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { PatientAvatar } from './PatientAvatar';
import { Sparkline } from './Sparkline';
import { EmptyState } from './EmptyState';
import { AddPatientForm } from './AddPatientForm';
import { config, simulateDelay } from '../utils/config';
import { 
  mockPatients, 
  mockLoginStatuses, 
  addMockPatient,
  type Patient as MockPatient,
  type PatientLoginStatus as MockPatientLoginStatus
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

interface PatientLoginStatus {
  patientId: string;
  loginStatus: 'logged_in' | 'not_logged_in';
  lastLogin: string | null;
}

interface PatientDashboardProps {
  onSelectPatient: (patientId: string) => void;
}

export function PatientDashboard({ onSelectPatient }: PatientDashboardProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [needsFollowup, setNeedsFollowup] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [loginStatuses, setLoginStatuses] = useState<Record<string, PatientLoginStatus>>({});

  useEffect(() => {
    fetchPatients();
    fetchLoginStatuses();
    // Poll for login status updates every 10 seconds
    const interval = setInterval(fetchLoginStatuses, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (needsFollowup) {
      // Show critical and high risk patients when "Needs Follow-up" is active
      filtered = filtered.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high');
    } else if (filterRisk !== 'all') {
      filtered = filtered.filter(p => p.riskLevel === filterRisk);
    }

    setFilteredPatients(filtered);
  }, [searchTerm, filterRisk, needsFollowup, patients]);

  const fetchPatients = async () => {
    try {
      // Use mock data if enabled
      if (config.useMockData) {
        await simulateDelay();
        const sortedPatients = [...mockPatients].sort((a, b) => b.riskScore - a.riskScore);
        setPatients(sortedPatients);
        setFilteredPatients(sortedPatients);
        setLoading(false);
        return;
      }

      // Otherwise fetch from Supabase
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle case where backend returns empty array with error
      if (data.error) {
        console.warn('Backend warning:', data.error, data.details);
      }
      
      setPatients(data.patients || []);
      setFilteredPatients(data.patients || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Set empty arrays to prevent UI crash
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoginStatuses = async () => {
    try {
      // Use mock data if enabled
      if (config.useMockData) {
        await simulateDelay();
        const statusMap: Record<string, PatientLoginStatus> = {};
        mockLoginStatuses.forEach((status) => {
          statusMap[status.patientId] = {
            patientId: status.patientId,
            loginStatus: status.isOnline ? 'logged_in' : 'not_logged_in',
            lastLogin: status.lastLoginTime
          };
        });
        setLoginStatuses(statusMap);
        return;
      }

      // Otherwise fetch from Supabase
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients/login-status`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      const statusMap: Record<string, PatientLoginStatus> = {};
      data.patientStatuses.forEach((status: PatientLoginStatus) => {
        statusMap[status.patientId] = status;
      });
      setLoginStatuses(statusMap);
    } catch (error) {
      console.error('Error fetching login statuses:', error);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const criticalCount = patients.filter(p => p.riskLevel === 'critical').length;
  const highCount = patients.filter(p => p.riskLevel === 'high').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl">
              <Heart className="w-12 h-12 text-white animate-pulse" fill="white" />
            </div>
          </div>
          <p className="text-gray-700 text-lg mb-2">Loading patient data...</p>
          <p className="text-gray-500 text-sm">Analyzing risk scores and vital signs</p>
        </div>
      </div>
    );
  }

  // Generate mock sparkline data for demo
  const generateSparkline = () => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 30) + 60);
  };

  // Show Add Patient Form
  if (showAddPatient) {
    return (
      <AddPatientForm
        onPatientAdded={() => {
          setShowAddPatient(false);
          fetchPatients();
          fetchLoginStatuses();
        }}
        onCancel={() => setShowAddPatient(false)}
      />
    );
  }

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto space-y-6 relative">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-3">
                <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">Post-Discharge Care Management</h1>
                {config.useMockData && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                    Demo Mode
                  </Badge>
                )}
              </div>
            </div>
            <Button
              onClick={() => setShowAddPatient(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-6 duration-700">
          <Card 
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 group cursor-pointer ${
              filterRisk === 'all' && !needsFollowup ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setFilterRisk('all');
              setNeedsFollowup(false);
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-300/10 to-transparent rounded-full -ml-10 -mb-10"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-600 mb-1 text-sm">Total Patients</p>
                  <p className="text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{patients.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <TrendingUp className="w-4 h-4" />
                <span>Active monitoring</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-red-50 via-pink-50 to-red-50 group cursor-pointer ${
              filterRisk === 'critical' && !needsFollowup ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => {
              setFilterRisk('critical');
              setNeedsFollowup(false);
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-red-300/10 to-transparent rounded-full -ml-10 -mb-10"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-600 mb-1 text-sm">Critical Risk</p>
                  <p className="text-4xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">{criticalCount}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg animate-pulse group-hover:scale-110 transition-transform duration-300">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-red-700">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span>Requires immediate action</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 group cursor-pointer ${
              filterRisk === 'high' && !needsFollowup ? 'ring-2 ring-orange-500' : ''
            }`}
            onClick={() => {
              setFilterRisk('high');
              setNeedsFollowup(false);
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-300/10 to-transparent rounded-full -ml-10 -mb-10"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-600 mb-1 text-sm">High Risk</p>
                  <p className="text-4xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">{highCount}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Waves className="w-4 h-4" />
                <span>Elevated monitoring</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50 group cursor-pointer ${
              needsFollowup ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={() => {
              setNeedsFollowup(true);
              setFilterRisk('all');
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-300/10 to-transparent rounded-full -ml-10 -mb-10"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-600 mb-1 text-sm">Needs Follow-up</p>
                  <p className="text-4xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{criticalCount + highCount}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <Calendar className="w-4 h-4" />
                <span>Scheduled outreach</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search by name, ID, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterRisk === 'all' && !needsFollowup ? 'default' : 'outline'}
                  onClick={() => {
                    setFilterRisk('all');
                    setNeedsFollowup(false);
                  }}
                  className={filterRisk === 'all' && !needsFollowup ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-md' : 'hover:shadow-sm transition-all'}
                >
                  <Users className="w-4 h-4 mr-1" />
                  All
                </Button>
                <Button
                  variant={filterRisk === 'critical' && !needsFollowup ? 'destructive' : 'outline'}
                  onClick={() => {
                    setFilterRisk('critical');
                    setNeedsFollowup(false);
                  }}
                  className={filterRisk === 'critical' && !needsFollowup ? 'bg-gradient-to-r from-red-600 to-pink-600 shadow-md' : 'hover:border-red-300 hover:shadow-sm transition-all'}
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Critical
                </Button>
                <Button
                  variant={filterRisk === 'high' && !needsFollowup ? 'destructive' : 'outline'}
                  onClick={() => {
                    setFilterRisk('high');
                    setNeedsFollowup(false);
                  }}
                  className={filterRisk === 'high' && !needsFollowup ? 'bg-gradient-to-r from-orange-600 to-amber-600 shadow-md' : 'hover:border-orange-300 hover:shadow-sm transition-all'}
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  High
                </Button>
                <Button
                  variant={filterRisk === 'medium' && !needsFollowup ? 'default' : 'outline'}
                  onClick={() => {
                    setFilterRisk('medium');
                    setNeedsFollowup(false);
                  }}
                  className={filterRisk === 'medium' && !needsFollowup ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-md' : 'hover:border-yellow-300 hover:shadow-sm transition-all'}
                >
                  <Activity className="w-4 h-4 mr-1" />
                  Medium
                </Button>
                <Button
                  variant={filterRisk === 'low' && !needsFollowup ? 'secondary' : 'outline'}
                  onClick={() => {
                    setFilterRisk('low');
                    setNeedsFollowup(false);
                  }}
                  className={filterRisk === 'low' && !needsFollowup ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md' : 'hover:border-green-300 hover:shadow-sm transition-all'}
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  Low
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <div className="space-y-4">
          {filteredPatients.map((patient, index) => (
            <Card 
              key={patient.id} 
              className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.01] bg-white/95 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 group overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => onSelectPatient(patient.id)}
            >
              {/* Subtle gradient border top */}
              <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
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
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="group-hover:text-blue-600 transition-colors">{patient.name}</h3>
                          <Badge variant="outline" className="bg-gray-50">#{patient.id}</Badge>
                          <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="shadow-sm">
                            {patient.riskLevel.toUpperCase()}
                          </Badge>
                          {loginStatuses[patient.id] && (
                            <Badge 
                              variant={loginStatuses[patient.id].loginStatus === 'logged_in' ? 'default' : 'outline'}
                              className={loginStatuses[patient.id].loginStatus === 'logged_in' 
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : 'bg-gray-100 text-gray-600 border-gray-300'
                              }
                            >
                              {loginStatuses[patient.id].loginStatus === 'logged_in' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Logged In
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Awaiting Login
                                </>
                              )}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{patient.diagnosis}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">Age: <span className="text-blue-700">{patient.age}</span></span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700">Discharged: {formatDate(patient.dischargeDate)}</span>
                      </div>
                      {patient.lastCheckIn && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                          <Activity className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">Last: {formatDate(patient.lastCheckIn)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {patient.riskFactors.slice(0, 3).map((factor) => (
                        <Badge key={factor} variant="outline" className="bg-orange-50/50 border-orange-200 text-orange-800 hover:bg-orange-100 transition-colors">
                          {factor}
                        </Badge>
                      ))}
                      {patient.riskFactors.length > 3 && (
                        <Badge variant="outline" className="bg-gray-50 border-gray-300">
                          +{patient.riskFactors.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Risk Score & Vitals */}
                  <div className="flex items-center gap-6">
                    {patient.vitalSigns && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                          <Heart className="w-5 h-5 text-red-600" />
                          <div>
                            <div className="text-xs text-gray-600">Blood Pressure</div>
                            <div className="text-lg text-red-700">{patient.vitalSigns.bloodPressure}</div>
                          </div>
                          <Sparkline data={generateSparkline()} width={60} height={20} color="#dc2626" />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <Activity className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-xs text-gray-600">Heart Rate</div>
                            <div className="text-lg text-blue-700">{patient.vitalSigns.heartRate} bpm</div>
                          </div>
                          <Sparkline data={generateSparkline()} width={60} height={20} color="#2563eb" />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center relative p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 shadow-md group-hover:shadow-lg transition-shadow">
                      <div className={`text-6xl mb-1 ${getRiskColor(patient.riskLevel)}`}>
                        {patient.riskScore}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Risk Score</div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-20 mx-auto">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            patient.riskLevel === 'critical' ? 'bg-red-600' :
                            patient.riskLevel === 'high' ? 'bg-orange-600' :
                            patient.riskLevel === 'medium' ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${patient.riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPatients.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12">
                <EmptyState
                  icon={Search}
                  title="No patients found"
                  description="Try adjusting your search criteria or filters to find the patients you're looking for."
                  action={{
                    label: "Clear Filters",
                    onClick: () => {
                      setSearchTerm('');
                      setFilterRisk('all');
                      setNeedsFollowup(false);
                    }
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
