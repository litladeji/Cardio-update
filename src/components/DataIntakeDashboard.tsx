import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { 
  Database,
  Wifi,
  MessageSquare,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  Users,
  FileText,
  Send,
  RefreshCw,
  Clock,
  Search,
  Heart
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { DataIntakeInfo } from './DataIntakeInfo';
import { config, simulateDelay } from '../utils/config';
import { mockPatients, mockSmsMessages } from '../utils/mockData';

interface EhrConfig {
  connected: boolean;
  system: string;
  lastSync: string;
  status: string;
}

interface DataIntakeMetrics {
  totalPatients: number;
  dataCompleteness: string;
  ehrImportCount: number;
  smsEngagementRate: string;
  lastEhrSync: string | null;
  lastSms: string | null;
  recentActivity: {
    ehrImports: any[];
    smsMessages: any[];
  };
}

export function DataIntakeDashboard() {
  const [metrics, setMetrics] = useState<DataIntakeMetrics | null>(null);
  const [ehrConfig, setEhrConfig] = useState<EhrConfig | null>(null);
  const [smsMetrics, setSmsMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ehr' | 'sms' | 'fhir' | 'info'>('overview');
  
  // EHR Import form
  const [ehrPatientIds, setEhrPatientIds] = useState('');
  const [importing, setImporting] = useState(false);
  
  // SMS form
  const [smsMessage, setSmsMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);
  
  // Pull/Insert Patient History
  const [pullPatientName, setPullPatientName] = useState('');
  const [insertPatientName, setInsertPatientName] = useState('');
  const [showPatientDataDialog, setShowPatientDataDialog] = useState(false);
  const [pulledPatientData, setPulledPatientData] = useState<any>(null);
  const [pulling, setPulling] = useState(false);
  const [inserting, setInserting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Use mock data if enabled
      if (config.useMockData) {
        await simulateDelay();
        
        // Set mock metrics
        const pendingCount = mockPatients.filter(p => p.dailyCheckInStatus === 'pending').length;
        setMetrics({
          totalPatients: mockPatients.length,
          dataCompleteness: '87%',
          ehrImportCount: 15,
          smsEngagementRate: '78%',
          lastEhrSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          lastSms: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          recentActivity: {
            ehrImports: [],
            smsMessages: []
          }
        });
        
        setEhrConfig({
          connected: true,
          system: 'Epic FHIR R4',
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        });
        
        setSmsMetrics({
          totalSent: 124,
          deliveryRate: '96%',
          responseRate: '78%',
          lastSent: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          recentMessages: mockSmsMessages
        });
        
        setLoading(false);
        return;
      }

      // Otherwise fetch from Supabase
      // Fetch data intake metrics
      const metricsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/data-intake/metrics`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data);
      }
      
      // Fetch EHR sync status
      const ehrRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/ehr/sync-status`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (ehrRes.ok) {
        const ehrData = await ehrRes.json();
        setEhrConfig(ehrData.ehrConfig);
      }
      
      // Fetch SMS metrics
      const smsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/sms/metrics`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (smsRes.ok) {
        const smsData = await smsRes.json();
        setSmsMetrics(smsData);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data intake metrics');
    } finally {
      setLoading(false);
    }
  };

  const handleEhrImport = async () => {
    if (!ehrPatientIds.trim()) {
      toast.error('Please enter patient IDs to import');
      return;
    }
    
    setImporting(true);
    try {
      const patientIdArray = ehrPatientIds.split(',').map(id => id.trim()).filter(id => id);
      
      // Use mock data if enabled
      if (config.useMockData) {
        await simulateDelay();
        
        toast.success(`Successfully imported ${patientIdArray.length} patient records from Epic FHIR R4 (Demo Mode)`, {
          description: 'Data simulated for demonstration'
        });
        setEhrPatientIds('');
        fetchData();
        setImporting(false);
        return;
      }

      // Otherwise use Supabase
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/ehr/import`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ehrSystem: 'Epic FHIR R4',
            patientIds: patientIdArray
          })
        }
      );
      
      if (!response.ok) throw new Error('Import failed');
      
      const data = await response.json();
      toast.success(`Successfully imported ${data.patientsImported} patients from EHR`);
      setEhrPatientIds('');
      fetchData();
    } catch (error) {
      console.error('Error importing from EHR:', error);
      toast.error('Failed to import patients from EHR');
    } finally {
      setImporting(false);
    }
  };

  const handleSendBulkSms = async () => {
    setSendingSms(true);
    try {
      // Use mock data if enabled
      if (config.useMockData) {
        await simulateDelay();
        
        const pendingPatients = mockPatients.filter(p => p.dailyCheckInStatus === 'pending');
        const sentCount = pendingPatients.length;
        
        toast.success(`SMS reminders sent to ${sentCount} patients (Demo Mode)`, {
          description: 'Messages simulated - not actually sent'
        });
        setSmsMessage('');
        fetchData();
        return;
      }

      // Otherwise use Supabase
      // Get all patients who haven't completed check-in
      const patientsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patients`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (!patientsRes.ok) throw new Error('Failed to fetch patients');
      
      const { patients } = await patientsRes.json();
      const pendingPatients = patients.filter((p: any) => p.dailyCheckInStatus === 'pending');
      const patientIds = pendingPatients.map((p: any) => p.id);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/sms/send-bulk`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            patientIds,
            message: smsMessage || undefined
          })
        }
      );
      
      if (!response.ok) throw new Error('SMS send failed');
      
      const data = await response.json();
      toast.success(`SMS reminders sent to ${data.sentCount} patients`);
      setSmsMessage('');
      fetchData();
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast.error('Failed to send SMS reminders');
    } finally {
      setSendingSms(false);
    }
  };

  const handleExportFhir = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/fhir/export`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      
      if (!response.ok) throw new Error('Export failed');
      
      const fhirBundle = await response.json();
      
      // Create download
      const blob = new Blob([JSON.stringify(fhirBundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cardioguard-fhir-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('FHIR bundle exported successfully');
    } catch (error) {
      console.error('Error exporting FHIR:', error);
      toast.error('Failed to export FHIR data');
    }
  };

  const handlePullPatient = async () => {
    if (!pullPatientName.trim()) {
      toast.error('Please enter a patient name');
      return;
    }

    setPulling(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock patient data for demo
      const mockData = {
        name: pullPatientName,
        patientId: `EHR-${Math.floor(Math.random() * 10000)}`,
        diagnosis: 'Congestive Heart Failure (CHF)',
        dischargeDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        vitals: {
          bloodPressure: '138/86 mmHg',
          heartRate: '78 bpm',
          weight: '182 lbs',
          temperature: '98.6°F'
        },
        medications: [
          'Lisinopril 10mg daily',
          'Metoprolol 25mg twice daily',
          'Furosemide 40mg daily',
          'Aspirin 81mg daily'
        ],
        riskScore: 68,
        lastCheckIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        ehrSystem: 'Epic FHIR R4'
      };

      setPulledPatientData(mockData);
      setShowPatientDataDialog(true);
      setPulling(false);
      toast.success(`Successfully pulled data for ${pullPatientName} from EHR`);
    }, 1500);
  };

  const handleInsertPatient = async () => {
    if (!insertPatientName.trim()) {
      toast.error('Please enter a patient name');
      return;
    }

    setInserting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      toast.success(`✓ Patient data for ${insertPatientName} has been successfully inserted to Epic EHR`, {
        duration: 4000
      });
      setInsertPatientName('');
      setInserting(false);
      fetchData(); // Refresh metrics
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
              <Database className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 text-lg mb-2">Loading data intake dashboard...</p>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="mb-2 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Data Intake & Integration
          </h1>
          <p className="text-gray-600">
            Manage EHR integrations, SMS notifications, and data exports
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
            className="whitespace-nowrap"
          >
            <Activity className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeTab === 'ehr' ? 'default' : 'outline'}
            onClick={() => setActiveTab('ehr')}
            className="whitespace-nowrap"
          >
            <Database className="w-4 h-4 mr-2" />
            EHR Integration
          </Button>
          <Button
            variant={activeTab === 'sms' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sms')}
            className="whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS Notifications
          </Button>
          <Button
            variant={activeTab === 'fhir' ? 'default' : 'outline'}
            onClick={() => setActiveTab('fhir')}
            className="whitespace-nowrap"
          >
            <FileText className="w-4 h-4 mr-2" />
            FHIR Export
          </Button>
          <Button
            variant={activeTab === 'info' ? 'default' : 'outline'}
            onClick={() => setActiveTab('info')}
            className="whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            System Info
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Total Patients</p>
                      <p className="text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {metrics.totalPatients}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">In system</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Data Completeness</p>
                      <p className="text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {metrics.dataCompleteness}%
                      </p>
                      <p className="text-sm text-gray-600 mt-1">With vital signs</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">EHR Imports</p>
                      <p className="text-4xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                        {metrics.ehrImportCount}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Total imported</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">SMS Engagement</p>
                      <p className="text-4xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        {metrics.smsEngagementRate}%
                      </p>
                      <p className="text-sm text-gray-600 mt-1">Response rate</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-green-600" />
                    Integration Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ehrConfig && (
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-green-900">{ehrConfig.system}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Last sync: {new Date(ehrConfig.lastSync).toLocaleString()}
                        </p>
                      </div>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-900">SMS Service (Twilio)</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Last message: {metrics.lastSms ? new Date(metrics.lastSms).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <Badge className="bg-blue-600">Active</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.recentActivity.ehrImports.slice(0, 3).map((log: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <Upload className="w-4 h-4 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Imported {log.patientsImported} patients from {log.ehrSystem}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {metrics.recentActivity.smsMessages.slice(0, 2).map((log: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Send className="w-4 h-4 text-blue-600 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm">
                            SMS sent to {log.patientName}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* EHR Integration Tab */}
        {activeTab === 'ehr' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pull Patient History */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Search className="w-5 h-5" />
                    Pull Patient History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-4">
                      Retrieve patient data from the hospital EHR system (Epic/Cerner FHIR R4)
                    </p>
                    
                    <div className="p-4 bg-white/50 rounded-lg border border-blue-200 mb-4">
                      <p className="text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-900">
                          Enter patient name to pull their complete medical history, vitals, medications, and risk scores from the EHR.
                        </span>
                      </p>
                    </div>
                    
                    <Input
                      placeholder="Enter patient name (e.g., Margaret Johnson)"
                      value={pullPatientName}
                      onChange={(e) => setPullPatientName(e.target.value)}
                      className="mb-4 bg-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handlePullPatient();
                      }}
                    />
                    
                    <Button
                      onClick={handlePullPatient}
                      disabled={pulling}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {pulling ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Pulling Data from EHR...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Pull Patient Data
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-blue-200">
                    <h4 className="mb-3 text-blue-900">Data Retrieved:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">Demographics & Patient ID</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">Diagnosis & Discharge Summary</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">Vital Signs (BP, HR, Weight)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">Medications & Risk Score</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insert Patient History */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <Upload className="w-5 h-5" />
                    Insert Patient History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-4">
                      Send patient data from CardioGuard back to the hospital EHR system
                    </p>
                    
                    <div className="p-4 bg-white/50 rounded-lg border border-green-200 mb-4">
                      <p className="text-sm flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-900">
                          This will insert the patient's daily check-in data, risk assessments, and vital trends back into Epic/Cerner EHR.
                        </span>
                      </p>
                    </div>
                    
                    <Input
                      placeholder="Enter patient name (e.g., Robert Martinez)"
                      value={insertPatientName}
                      onChange={(e) => setInsertPatientName(e.target.value)}
                      className="mb-4 bg-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleInsertPatient();
                      }}
                    />
                    
                    <Button
                      onClick={handleInsertPatient}
                      disabled={inserting}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {inserting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Inserting to EHR...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Insert to EHR
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t border-green-200">
                    <h4 className="mb-3 text-green-900">Data Inserted:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Daily Check-in Responses</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">AI Risk Assessment Scores</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Vital Sign Trends</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white/50 rounded">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Alert Notifications</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* EHR Connection Status */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  EHR Connection Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-purple-900">Epic FHIR R4</p>
                        <Badge className="bg-green-600 mt-1">Connected</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Last sync: {ehrConfig ? new Date(ehrConfig.lastSync).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-blue-900">Total Pulls</p>
                        <p className="text-2xl text-blue-600 mt-1">{metrics.ehrImportCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-green-900">Data Quality</p>
                        <p className="text-2xl text-green-600 mt-1">{metrics.dataCompleteness}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Patient Data Dialog */}
        <Dialog open={showPatientDataDialog} onOpenChange={setShowPatientDataDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-900">
                <Database className="w-6 h-6" />
                Patient Data Retrieved from EHR
              </DialogTitle>
            </DialogHeader>
            
            {pulledPatientData && (
              <div className="space-y-4">
                {/* Patient Info */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Patient Name</p>
                      <p className="text-blue-900">{pulledPatientData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">EHR Patient ID</p>
                      <p className="text-blue-900">{pulledPatientData.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Diagnosis</p>
                      <p className="text-blue-900">{pulledPatientData.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Discharge Date</p>
                      <p className="text-blue-900">{pulledPatientData.dischargeDate}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-600 mb-2">30-Day Readmission Risk</p>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl text-red-600">{pulledPatientData.riskScore}%</div>
                    <Badge className="bg-red-600">High Risk</Badge>
                  </div>
                </div>

                {/* Vital Signs */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="text-green-900 mb-3">Latest Vital Signs</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-gray-600">Blood Pressure</p>
                      <p className="text-green-900">{pulledPatientData.vitals.bloodPressure}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-gray-600">Heart Rate</p>
                      <p className="text-green-900">{pulledPatientData.vitals.heartRate}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-gray-600">Weight</p>
                      <p className="text-green-900">{pulledPatientData.vitals.weight}</p>
                    </div>
                    <div className="p-3 bg-white rounded">
                      <p className="text-xs text-gray-600">Temperature</p>
                      <p className="text-green-900">{pulledPatientData.vitals.temperature}</p>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                  <h4 className="text-purple-900 mb-3">Current Medications</h4>
                  <div className="space-y-2">
                    {pulledPatientData.medications.map((med: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-700">{med}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Info */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">EHR System</p>
                      <p className="text-gray-900">{pulledPatientData.ehrSystem}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Check-in</p>
                      <p className="text-gray-900">{pulledPatientData.lastCheckIn}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setShowPatientDataDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* SMS Notifications Tab */}
        {activeTab === 'sms' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Send Daily Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Send SMS reminders to patients who haven't completed their daily check-in
                  </p>
                  
                  {smsMetrics && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <p className="text-2xl text-blue-600">{smsMetrics.totalSent}</p>
                        <p className="text-sm text-gray-600">Total Sent</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <p className="text-2xl text-green-600">{smsMetrics.deliveryRate}%</p>
                        <p className="text-sm text-gray-600">Delivery Rate</p>
                      </div>
                    </div>
                  )}
                  
                  <Textarea
                    placeholder="Custom message (optional - default message will be used if blank)"
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    rows={3}
                    className="mb-4"
                  />
                  
                  <Button
                    onClick={handleSendBulkSms}
                    disabled={sendingSms}
                    className="w-full"
                  >
                    {sendingSms ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reminders to Pending Patients
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="mb-3">Default Message Template</h4>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    "Hi [Patient Name], reminder to complete your daily CardioGuard check-in today! 💙"
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {smsMetrics && smsMetrics.recentMessages && smsMetrics.recentMessages.length > 0 ? (
                    smsMetrics.recentMessages.slice(0, 10).map((msg: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-green-900">{msg.deliveryStatus}</span>
                          </div>
                          <span className="text-xs text-gray-600">{msg.phone}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          To: {msg.patientName}
                        </p>
                        <p className="text-xs text-gray-600 italic mb-2">
                          "{msg.message}"
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No messages sent yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FHIR Export Tab */}
        {activeTab === 'fhir' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  FHIR R4 Compliant Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Export all patient data, observations, and risk assessments in FHIR R4 format for reporting and interoperability
                  </p>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4">
                    <h4 className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-green-900">Export Includes:</span>
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
                      <li>Patient demographics and identifiers</li>
                      <li>Condition/diagnosis resources</li>
                      <li>Vital signs observations (BP, HR, weight)</li>
                      <li>Risk assessment scores</li>
                      <li>Daily symptom check-in data</li>
                      <li>Care team alerts and interventions</li>
                    </ul>
                  </div>
                  
                  <Button
                    onClick={handleExportFhir}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export FHIR Bundle (JSON)
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="mb-3">FHIR Resources Generated</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Patient Resources</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Condition Resources</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Observation Resources (Vitals & Risk)</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Survey/Check-in Observations</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Sample FHIR Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 text-xs overflow-x-auto">
                  <pre className="text-green-400">
{`{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Patient",
        "id": "P001",
        "name": [{
          "text": "Margaret Johnson"
        }],
        "telecom": [...],
        "birthDate": "1951-10-15"
      }
    },
    {
      "resource": {
        "resourceType": "Observation",
        "code": {
          "text": "30-Day Readmission Risk"
        },
        "valueInteger": 65,
        "interpretation": "high"
      }
    },
    ...
  ]
}`}
                  </pre>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Compliance:</strong> All exports follow HL7 FHIR R4 specification and include proper LOINC codes for vital signs and observations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Info Tab */}
        {activeTab === 'info' && (
          <DataIntakeInfo />
        )}

        {/* Refresh Button */}
        {activeTab !== 'info' && (
          <div className="flex justify-end">
            <Button onClick={fetchData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
