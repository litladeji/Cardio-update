import { useState } from 'react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PatientHome } from './PatientHome';
import { ProgressTracker } from './ProgressTracker';
import { CareCircle } from './CareCircle';
import { PatientMessaging } from './PatientMessaging';
import { Card, CardContent } from '../ui/card';
import { 
  Home, 
  Activity, 
  Users, 
  MessageSquare,
  Shield,
  Heart
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PatientPortalProps {
  patientId: string;
  patientName: string;
  onStartCheckIn: () => void;
}

export function PatientPortal({ patientId, patientName, onStartCheckIn }: PatientPortalProps) {
  const [activeTab, setActiveTab] = useState('home');
  
  // Mock data for progress tracker
  const mockWeightTrend = [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 167 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 166 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 165 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 165 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 164 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 165 },
    { date: new Date().toISOString(), value: 164 }
  ];
  
  const mockHeartRateTrend = [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 88 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 86 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 84 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 82 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 80 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 79 },
    { date: new Date().toISOString(), value: 78 }
  ];
  
  const [careCircleMembers, setCareCircleMembers] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      relationship: 'Daughter',
      email: 'sarah.j@email.com',
      phone: '(555) 123-4567',
      notificationsEnabled: true,
      addedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
  
  const handleAddMember = async (member: any) => {
    const newMember = {
      ...member,
      id: `${Date.now()}`,
      addedDate: new Date().toISOString()
    };
    setCareCircleMembers([...careCircleMembers, newMember]);
  };
  
  const handleRemoveMember = async (memberId: string) => {
    setCareCircleMembers(careCircleMembers.filter(m => m.id !== memberId));
  };
  
  const handleToggleNotifications = async (memberId: string) => {
    setCareCircleMembers(careCircleMembers.map(m => 
      m.id === memberId 
        ? { ...m, notificationsEnabled: !m.notificationsEnabled }
        : m
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-h-screen flex flex-col">
        {/* Fixed Navigation Header */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Logo/Title Row */}
            <div className="flex items-center justify-between py-5 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl blur opacity-40"></div>
                  <div className="relative p-2.5 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
                    <Heart className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                    CardioGuard
                  </h2>
                  <p className="text-xs text-blue-600/80 mt-0.5">Patient Portal</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{patientName}</p>
                <p className="text-xs text-blue-600/70 mt-0.5">ID: {patientId}</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="py-4">
              <TabsList className="h-auto grid w-full grid-cols-4 gap-2 bg-gray-100/50 p-1">
                <TabsTrigger value="home" className="h-auto flex flex-row items-center justify-center gap-2 px-3 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
                  <Home className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Home</span>
                </TabsTrigger>
                <TabsTrigger value="progress" className="h-auto flex flex-row items-center justify-center gap-2 px-3 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
                  <Activity className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Progress</span>
                </TabsTrigger>
                <TabsTrigger value="care-circle" className="h-auto flex flex-row items-center justify-center gap-2 px-3 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Care Circle</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="h-auto flex flex-row items-center justify-center gap-2 px-3 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Messages</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* Tab Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
            {/* Home Tab */}
            <TabsContent value="home" className="mt-0">
              <PatientHome 
                patientId={patientId}
                patientName={patientName}
                onStartCheckIn={onStartCheckIn}
              />
            </TabsContent>

            {/* Progress Tracker Tab */}
            <TabsContent value="progress" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h1 className="mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Your Progress
                  </h1>
                  <p className="text-gray-600">Track your recovery journey and health trends</p>
                </div>
                
                <ProgressTracker
                  weightTrend={mockWeightTrend}
                  heartRateTrend={mockHeartRateTrend}
                  symptomStreakDays={12}
                  lastWeight={164}
                  lastHeartRate={78}
                  targetWeight={160}
                />
                
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h3 className="mb-3 flex items-center gap-2 text-blue-900">
                      <Activity className="w-5 h-5" />
                      Understanding Your Progress
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>Weight:</strong> Daily fluctuations of 1-2 lbs are normal. Report sudden weight gain of 2+ lbs in a day to your care team.
                      </p>
                      <p>
                        <strong>Heart Rate:</strong> Lower resting heart rate often indicates improved cardiovascular fitness. Notify your team if your rate increases significantly or drops below 50 bpm.
                      </p>
                      <p>
                        <strong>Streak:</strong> Consistent check-ins help us detect early warning signs. Keep up the great work!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Care Circle Tab */}
            <TabsContent value="care-circle" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h1 className="mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Care Circle
                  </h1>
                  <p className="text-gray-600">Stay connected with family and caregivers</p>
                </div>
                
                <CareCircle
                  patientId={patientId}
                  members={careCircleMembers}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  onToggleNotifications={handleToggleNotifications}
                />
                
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <h3 className="mb-3 flex items-center gap-2 text-green-900">
                      <Shield className="w-5 h-5" />
                      Privacy & Security
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>
                        <strong>✓ You're in control:</strong> Add or remove Care Circle members anytime. Turn notifications on/off individually.
                      </p>
                      <p>
                        <strong>✓ Limited access:</strong> Members see your overall status (green/yellow/red) and check-in completion, but not detailed symptoms unless you share.
                      </p>
                      <p>
                        <strong>✓ HIPAA compliant:</strong> All data is encrypted and stored securely. Your Care Circle members must verify their identity.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h1 className="mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Messages
                  </h1>
                  <p className="text-gray-600">Communicate with your CardioGuard care team</p>
                </div>
                
                <PatientMessaging
                  patientId={patientId}
                  patientName={patientName}
                />
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
