import { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Phone, AlertCircle } from 'lucide-react';

interface EmergencyHelpButtonProps {
  emergencyContact?: string;
  emergencyContactName?: string;
  compact?: boolean;
}

export function EmergencyHelpButton({ 
  emergencyContact = '1-800-555-0199',
  emergencyContactName = 'Care Team',
  compact = false
}: EmergencyHelpButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleCall911 = () => {
    window.location.href = 'tel:911';
    setShowDialog(false);
  };

  const handleCallEmergencyContact = () => {
    window.location.href = `tel:${emergencyContact}`;
    setShowDialog(false);
  };

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        size={compact ? "default" : "lg"}
        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <Phone className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
        Emergency Help
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-2xl">Emergency Help</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base text-gray-700">
              Please select who you need to contact. If you're experiencing a life-threatening emergency, call 911 immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 my-4">
            <Button
              onClick={handleCall911}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-8 text-xl shadow-lg"
            >
              <Phone className="w-6 h-6 mr-3" />
              Call 911
              <div className="text-xs ml-auto opacity-90">Life-threatening emergency</div>
            </Button>

            <Button
              onClick={handleCallEmergencyContact}
              variant="outline"
              className="w-full py-6 text-lg border-2 hover:bg-gray-50"
            >
              <Phone className="w-5 h-5 mr-3" />
              Call {emergencyContactName}
              <div className="text-xs ml-auto text-gray-600">{emergencyContact}</div>
            </Button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}