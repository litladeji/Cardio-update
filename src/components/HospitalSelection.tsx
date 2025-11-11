import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Building2, Search, MapPin, CheckCircle2 } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Hospital {
  id: string;
  name: string;
  location: string;
  type: string;
}

interface HospitalSelectionProps {
  onHospitalSelected: (hospitalId: string, hospitalName: string) => void;
}

export function HospitalSelection({ onHospitalSelected }: HospitalSelectionProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = hospitals.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHospitals(filtered);
    } else {
      setFilteredHospitals(hospitals);
    }
  }, [searchTerm, hospitals]);

  const fetchHospitals = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/hospitals`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }

      const data = await response.json();
      setHospitals(data.hospitals);
      setFilteredHospitals(data.hospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleContinue = () => {
    if (selectedHospital) {
      onHospitalSelected(selectedHospital.id, selectedHospital.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              CardioGuard
            </h1>
          </div>
          <p className="text-gray-700 text-2xl font-bold mb-2">
            Find Your Hospital
          </p>
          <p className="text-gray-600 text-base">
            Search and select the hospital where you received care
          </p>
        </div>

        {/* Search Card */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-2 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl text-center font-bold">Hospital Search</CardTitle>
              <CardDescription className="text-center text-base mt-2">
                Find your hospital to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search Input */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="search" className="text-base font-semibold text-gray-700">Search Hospitals</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by hospital name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-12 text-base"
                  />
                </div>
              </div>

              {/* Hospital List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading hospitals...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredHospitals.length === 0 ? (
                    <Alert>
                      <AlertDescription className="text-base">
                        No hospitals found. Try adjusting your search.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    filteredHospitals.map((hospital) => (
                      <div
                        key={hospital.id}
                        onClick={() => handleSelectHospital(hospital)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedHospital?.id === hospital.id
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-400 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Building2 className="w-5 h-5 text-blue-600" />
                              <h4 className="font-semibold text-lg">{hospital.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                              <MapPin className="w-4 h-4" />
                              <span>{hospital.location}</span>
                            </div>
                            <div className="text-sm text-gray-500">{hospital.type}</div>
                          </div>
                          {selectedHospital?.id === hospital.id && (
                            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Continue Button */}
              <div className="mt-6">
                <Button
                  onClick={handleContinue}
                  disabled={!selectedHospital}
                  className="w-full h-12 text-base"
                >
                  Continue to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-600 animate-in fade-in duration-1000">
          <p className="text-base font-semibold mb-2">© 2025 CardioGuard. Saving lives through predictive analytics and proactive care.</p>
          <p className="text-sm text-gray-500">
            HIPAA Compliant | SOC 2 Certified | HL7 FHIR R4 Compatible
          </p>
        </div>
      </div>
    </div>
  );
}
