import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { PatientLogin } from './components/PatientLogin';
import { ClinicianLogin } from './components/ClinicianLogin';
import { AdministratorLogin } from './components/AdministratorLogin';
import { PatientDashboard } from './components/PatientDashboard';
import { PatientDetailView } from './components/PatientDetailView';
import { DataIntakeDashboard } from './components/DataIntakeDashboard';
import { AdministratorDashboard } from './components/AdministratorDashboard';
import { PatientHome } from './components/patient/PatientHome';
import { PatientPortal } from './components/patient/PatientPortal';
import { DailyCheckIn } from './components/patient/DailyCheckIn';
import { PatientOnboarding } from './components/patient/PatientOnboarding';
import { Button } from './components/ui/button';
import { Heart, Users, Menu, Database, LogOut } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type UserRole = 'clinician' | 'patient' | 'admin';
type ClinicianView = 'dashboard' | 'data-intake' | 'patient-detail';
type PatientView = 'home' | 'check-in' | 'onboarding';
type LoginPortal = 'landing' | 'patient' | 'clinician' | 'admin';

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  
  // User role and view management
  const [userRole, setUserRole] = useState<UserRole>('patient');
  const [currentPortal, setCurrentPortal] = useState<LoginPortal>('landing');
  const [clinicianView, setClinicianView] = useState<ClinicianView>('dashboard');
  const [patientView, setPatientView] = useState<PatientView>('onboarding');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // For patient view - simulating logged in patient
  const demoPatientId = 'P001';

  // Portal selection handler
  const handleSelectPortal = (portal: 'patient' | 'clinician' | 'admin') => {
    setCurrentPortal(portal);
  };

  // Back to landing page handler
  const handleBackToLanding = () => {
    setCurrentPortal('landing');
  };

  // Authentication handlers
  const handlePatientLogin = (email: string, name: string) => {
    setIsAuthenticated(true);
    setUserRole('patient');
    setUserEmail(email);
    setUserName(name);
    setPatientView('onboarding');
    
    const firstName = name.split(' ')[0];
    toast.success(`Welcome, ${firstName}!`);
  };

  const handleClinicianLogin = (email: string, name: string) => {
    setIsAuthenticated(true);
    setUserRole('clinician');
    setUserEmail(email);
    setUserName(name);
    setClinicianView('dashboard');
    
    const firstName = name.split(' ')[0];
    toast.success(`Welcome, ${firstName}!`);
  };

  const handleAdminLogin = (email: string, name: string) => {
    setIsAuthenticated(true);
    setUserRole('admin');
    setUserEmail(email);
    setUserName(name);
    
    const firstName = name.split(' ')[0];
    toast.success(`Welcome, ${firstName}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setUserRole('patient');
    setCurrentPortal('landing');
    setClinicianView('dashboard');
    setPatientView('onboarding');
    setSelectedPatientId(null);
    setMobileMenuOpen(false);
    toast.success('Logged out successfully');
  };

  // Clinician navigation
  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setClinicianView('patient-detail');
    setMobileMenuOpen(false);
  };

  const handleBackToDashboard = () => {
    setClinicianView('dashboard');
    setSelectedPatientId(null);
  };

  const navigateToClinicianView = (view: ClinicianView) => {
    setClinicianView(view);
    setMobileMenuOpen(false);
    if (view !== 'patient-detail') {
      setSelectedPatientId(null);
    }
  };

  // Patient navigation
  const handleStartCheckIn = () => {
    setPatientView('check-in');
  };

  const handleCompleteCheckIn = () => {
    setPatientView('home');
  };

  const handleBackToPatientHome = () => {
    setPatientView('home');
  };

  const handleCompleteOnboarding = () => {
    setPatientView('home');
  };

  // Show appropriate login page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Toaster />
        {currentPortal === 'landing' && (
          <LandingPage onSelectPortal={handleSelectPortal} />
        )}
        {currentPortal === 'patient' && (
          <PatientLogin 
            onLogin={handlePatientLogin} 
            onBackToHome={handleBackToLanding}
          />
        )}
        {currentPortal === 'clinician' && (
          <ClinicianLogin 
            onLogin={handleClinicianLogin} 
            onBackToHome={handleBackToLanding}
          />
        )}
        {currentPortal === 'admin' && (
          <AdministratorLogin 
            onLogin={handleAdminLogin} 
            onBackToHome={handleBackToLanding}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Toaster />
      
      {/* Navigation - Show for clinician and admin views */}
      {(userRole === 'clinician' || userRole === 'admin') && (
        <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl blur opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-red-500 to-pink-600 p-2 rounded-xl">
                      <Heart className="w-6 h-6 text-white" fill="white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Continuum Care</h2>
                    <p className="text-sm text-gray-600">{userRole === 'admin' ? 'Administrator Portal' : 'Clinician Portal'}</p>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {userRole === 'clinician' && (
                  <>
                    <Button
                      variant={clinicianView === 'dashboard' ? 'default' : 'ghost'}
                      onClick={() => navigateToClinicianView('dashboard')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Patients
                    </Button>
                    <Button
                      variant={clinicianView === 'data-intake' ? 'default' : 'ghost'}
                      onClick={() => navigateToClinicianView('data-intake')}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Data Intake
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 flex flex-col gap-2 pb-2">
                {userRole === 'clinician' && (
                  <>
                    <Button
                      variant={clinicianView === 'dashboard' ? 'default' : 'ghost'}
                      onClick={() => navigateToClinicianView('dashboard')}
                      className="justify-start"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Patients
                    </Button>
                    <Button
                      variant={clinicianView === 'data-intake' ? 'default' : 'ghost'}
                      onClick={() => navigateToClinicianView('data-intake')}
                      className="justify-start"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Data Intake
                    </Button>
                    <div className="border-t border-gray-200 my-2"></div>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="justify-start text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main>
        {userRole === 'admin' ? (
          <AdministratorDashboard />
        ) : userRole === 'clinician' ? (
          <>
            {clinicianView === 'dashboard' && (
              <PatientDashboard onSelectPatient={handleSelectPatient} />
            )}
            
            {clinicianView === 'data-intake' && (
              <DataIntakeDashboard />
            )}
            
            {clinicianView === 'patient-detail' && selectedPatientId && (
              <PatientDetailView 
                patientId={selectedPatientId} 
                onBack={handleBackToDashboard}
              />
            )}
          </>
        ) : (
          <>
            {patientView === 'onboarding' && (
              <PatientOnboarding
                patientId={demoPatientId}
                patientName={userName}
                onComplete={handleCompleteOnboarding}
              />
            )}

            {patientView === 'home' && (
              <PatientPortal
                patientId={demoPatientId}
                patientName={userName}
                onStartCheckIn={handleStartCheckIn}
              />
            )}

            {patientView === 'check-in' && (
              <DailyCheckIn
                patientId={demoPatientId}
                onComplete={handleCompleteCheckIn}
                onBack={handleBackToPatientHome}
              />
            )}

            {/* Patient view logout button */}
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="shadow-lg bg-white hover:shadow-xl text-red-600 hover:text-red-700 hover:border-red-300"
                size="lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </>
        )}
      </main>

      {/* Footer - only show for clinician */}
      {userRole === 'clinician' && (
        <footer className="bg-white/60 backdrop-blur-lg border-t border-gray-200/50 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                <p>Continuum Care - Post-Discharge Heart Patient Risk Management</p>
                <p className="text-xs mt-1">
                  ⚠️ Prototype for demonstration purposes only. Not for clinical use. 
                  Not HIPAA compliant or FDA cleared.
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">28.6%</div>
                  <div className="text-xs text-gray-600">Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">0.84</div>
                  <div className="text-xs text-gray-600">Model AUC</div>
                </div>
                <div className="text-center">
                  <div className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">92%</div>
                  <div className="text-xs text-gray-600">Adoption</div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
