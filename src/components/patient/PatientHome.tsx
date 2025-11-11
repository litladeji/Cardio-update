import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Heart,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Activity,
  Award
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { EmergencyHelpButton } from './EmergencyHelpButton';
import { config, simulateDelay } from '../../utils/config';
import { getMockPatientDashboard } from '../../utils/mockData';

interface PatientHomeProps {
  patientId: string;
  patientName: string;
  onStartCheckIn: () => void;
}

export function PatientHome({ patientId, patientName, onStartCheckIn }: PatientHomeProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [patientId]);

  const fetchDashboard = async () => {
    try {
      // Check if we're in mock mode
      if (config.useMockData) {
        // Simulate network delay
        await simulateDelay();
        
        // Get mock dashboard data
        const mockData = getMockPatientDashboard(patientId);
        
        if (!mockData) {
          throw new Error('Patient not found in mock data');
        }
        
        setDashboardData(mockData);
      } else {
        // Use real Supabase backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patient-dashboard/${patientId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard');
        }

        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAlertInfo = (level?: string) => {
    switch (level) {
      case 'green':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2, message: 'Doing great!' };
      case 'yellow':
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle, message: 'Monitoring' };
      case 'red':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle, message: 'Needs attention' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-50', icon: Activity, message: 'Check in today' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
              <Heart className="w-12 h-12 text-white animate-pulse" fill="white" />
            </div>
          </div>
          <p className="text-gray-700 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600">Error loading dashboard</p>
        <p className="text-gray-600 text-sm mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  const { patient, healthTip, checkInCompleteToday } = dashboardData;
  const alertInfo = getAlertInfo(patient.aiAlertLevel);
  const AlertIcon = alertInfo.icon;

  return (
    <div className="space-y-7">
        {/* Welcome Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                Welcome back, {patientName.split(' ')[0]}!
              </h1>
              <p className="text-base text-gray-600">Your Recovery Journey</p>
            </div>
            <div className="flex items-center gap-4">
              <EmergencyHelpButton 
                emergencyContact="1-800-CARDIO-AI"
                emergencyContactName="CardioGuard Care Team"
                compact
              />
              <div className="p-3.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Heart className="w-9 h-9 text-white" fill="white" />
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Streak Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
          <CardContent className="p-8 sm:p-10 relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <Award className="w-7 h-7" />
                  <p className="text-lg text-white/95">Recovery Streak</p>
                </div>
                <div className="text-6xl sm:text-7xl mb-2">{patient.recoveryStreak || 0}</div>
                <p className="text-base text-white/95">
                  {patient.recoveryStreak === 1 ? 'day' : 'days'} of healthy check-ins! 🎉
                </p>
              </div>
              <div className="text-8xl opacity-20">
                🔥
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Check-in Card */}
        <Card className="border-0 shadow-xl bg-white overflow-hidden">
          <CardContent className="p-8 sm:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3.5 ${alertInfo.bg} rounded-xl`}>
                    <AlertIcon className={`w-7 h-7 ${alertInfo.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl mb-1">Today's Check-in</h3>
                    <p className="text-base text-gray-600">{checkInCompleteToday ? '✓ Completed' : 'Ready to start'}</p>
                  </div>
                </div>

                {checkInCompleteToday ? (
                  <div className={`p-5 ${alertInfo.bg} rounded-xl`}>
                    <p className={`${alertInfo.color}`}>
                      <span className="block mb-2 text-base">Status: {alertInfo.message}</span>
                      <span className="text-sm opacity-75">
                        Thanks for checking in! We're monitoring your progress.
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-base text-gray-600">
                    Let us know how you're feeling today. It only takes 2 minutes!
                  </p>
                )}
              </div>

              {!checkInCompleteToday && (
                <Button
                  onClick={onStartCheckIn}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all px-10 py-7 text-lg"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Start Check-in
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health Tip of the Day */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10 text-8xl">💡</div>
          <CardContent className="p-7 sm:p-8 relative">
            <div className="flex items-start gap-5">
              <div className="p-3.5 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg flex-shrink-0">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-lg">💡 Health Tip of the Day</h3>
                <p className="text-base text-gray-700 leading-relaxed">{healthTip}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-blue-50 rounded-xl">
                  <Calendar className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Appointment</p>
                  <p className="text-xl">{patient.nextAppointment ? formatDate(patient.nextAppointment) : 'Not scheduled'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-center gap-5">
                <div className="p-3.5 bg-purple-50 rounded-xl">
                  <TrendingUp className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recovery Status</p>
                  <Badge className="mt-1.5 bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-1">
                    {patient.riskLevel === 'low' ? 'On Track' : 'Monitored'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Info */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-slate-50">
          <CardContent className="p-7">
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              Need help? Call your care team at{' '}
              <a href="tel:1-800-CARDIO-AI" className="text-blue-600 hover:underline">
                1-800-CARDIO-AI
              </a>
              {' '}• If you're experiencing a medical emergency, call 911 immediately.
            </p>
          </CardContent>
        </Card>
      </div>
  );
}