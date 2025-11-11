import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Trash2, 
  CheckCircle2,
  AlertCircle,
  Shield,
  Bell,
  BellOff
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CareCircleMember {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  notificationsEnabled: boolean;
  addedDate: string;
}

interface CareCircleProps {
  patientId: string;
  members: CareCircleMember[];
  onAddMember: (member: Omit<CareCircleMember, 'id' | 'addedDate'>) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onToggleNotifications: (memberId: string) => Promise<void>;
}

export function CareCircle({ 
  patientId, 
  members, 
  onAddMember, 
  onRemoveMember, 
  onToggleNotifications 
}: CareCircleProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    email: '',
    phone: '',
    notificationsEnabled: true
  });
  
  const handleAdd = async () => {
    if (!newMember.name || !newMember.email || !newMember.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await onAddMember(newMember);
      setNewMember({
        name: '',
        relationship: '',
        email: '',
        phone: '',
        notificationsEnabled: true
      });
      setIsAdding(false);
      toast.success(`${newMember.name} added to your Care Circle`);
    } catch (error) {
      toast.error('Failed to add member');
    }
  };
  
  const handleRemove = async (memberId: string, memberName: string) => {
    if (confirm(`Remove ${memberName} from your Care Circle?`)) {
      try {
        await onRemoveMember(memberId);
        toast.success(`${memberName} removed from Care Circle`);
      } catch (error) {
        toast.error('Failed to remove member');
      }
    }
  };
  
  const handleToggleNotifications = async (memberId: string) => {
    try {
      await onToggleNotifications(memberId);
      toast.success('Notification settings updated');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };
  
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Your Care Circle
          </div>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            variant="outline"
            size="sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Banner */}
        <div className="p-4 bg-white rounded-xl border border-purple-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="text-purple-900 mb-1">What is Care Circle?</h4>
              <p className="text-sm text-gray-600">
                Share your health updates with family and caregivers. They'll receive notifications 
                when you complete check-ins or if your health status changes. You control who sees what.
              </p>
            </div>
          </div>
        </div>
        
        {/* Add Member Form */}
        {isAdding && (
          <div className="p-5 bg-white rounded-xl shadow-md border-2 border-purple-200 space-y-3">
            <h4 className="text-purple-900 mb-3">Add Care Circle Member</h4>
            
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Name *</label>
              <Input
                placeholder="Full name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Relationship</label>
              <Input
                placeholder="e.g., Daughter, Son, Spouse"
                value={newMember.relationship}
                onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Email *</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-700 mb-1 block">Phone *</label>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
              />
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                checked={newMember.notificationsEnabled}
                onChange={(e) => setNewMember({ ...newMember, notificationsEnabled: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm text-blue-900">
                Send notifications about my health status
              </label>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button onClick={handleAdd} className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Add to Care Circle
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {/* Members List */}
        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No Care Circle members yet</p>
              <p className="text-sm mt-1">Add family or caregivers to share your progress</p>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-purple-900">{member.name}</h4>
                      {member.relationship && (
                        <Badge className="bg-purple-100 text-purple-800 border-0 mt-1">
                          {member.relationship}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(member.id, member.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 ml-11">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>
                
                <div className="mt-3 ml-11 flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    {member.notificationsEnabled ? (
                      <>
                        <Bell className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Notifications enabled</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Notifications disabled</span>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleNotifications(member.id)}
                    className="text-xs"
                  >
                    Toggle
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2 ml-11">
                  Added: {new Date(member.addedDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
        
        {/* What They See */}
        {members.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="flex items-center gap-2 text-blue-900 mb-2">
              <AlertCircle className="w-4 h-4" />
              What Care Circle members can see:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
              <li>Your daily check-in completion status</li>
              <li>Overall health status (green/yellow/red)</li>
              <li>Notifications when you miss check-ins</li>
              <li>Alerts if your symptoms worsen</li>
            </ul>
            <p className="text-sm text-blue-700 mt-2 italic">
              They cannot see specific symptoms or medical details without your permission.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
