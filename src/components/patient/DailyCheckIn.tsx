import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft,
  Heart,
  Activity,
  Smile,
  Meh,
  Frown,
  Battery,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { EmergencyHelpButton } from './EmergencyHelpButton';
import { config } from '../../utils/config';
import { submitMockDailyCheckIn } from '../../utils/mockData';
import type { CheckInSubmission } from '../../utils/mockData';

interface DailyCheckInProps {
  patientId: string;
  onComplete: () => void;
  onBack: () => void;
}

const questions = [
  {
    id: 'breathing',
    question: 'How is your breathing today?',
    options: ['No problems', 'Slightly harder than usual', 'Moderate difficulty', 'Very difficult']
  },
  {
    id: 'chest',
    question: 'Are you experiencing any chest discomfort?',
    options: ['None', 'Mild discomfort', 'Moderate pain', 'Severe pain']
  },
  {
    id: 'swelling',
    question: 'Have you noticed any swelling in your legs or ankles?',
    options: ['None', 'Mild swelling', 'Moderate swelling', 'Severe swelling']
  },
  {
    id: 'medication',
    question: 'Did you take all your medications as prescribed today?',
    options: ['Yes, all of them', 'Missed one dose', 'Missed multiple doses', 'Did not take any']
  }
];

const moods = [
  { value: 'great', label: 'Great', icon: Smile, color: 'text-green-600', bg: 'bg-green-50', emoji: '😊' },
  { value: 'okay', label: 'Okay', icon: Meh, color: 'text-yellow-600', bg: 'bg-yellow-50', emoji: '😐' },
  { value: 'not good', label: 'Not Good', icon: Frown, color: 'text-red-600', bg: 'bg-red-50', emoji: '😔' }
];

export function DailyCheckIn({ patientId, onComplete, onBack }: DailyCheckInProps) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const commonSymptoms = [
    'Shortness of breath',
    'Fatigue',
    'Dizziness',
    'Rapid heartbeat',
    'Chest pain',
    'Swelling',
    'None'
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setResponses({ ...responses, [questionId]: answer });
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setStep(step + 1);
    }
  };

  const toggleSymptom = (symptom: string) => {
    if (symptom === 'None') {
      setSelectedSymptoms(['None']);
    } else {
      const filtered = selectedSymptoms.filter(s => s !== 'None');
      if (selectedSymptoms.includes(symptom)) {
        setSelectedSymptoms(filtered.filter(s => s !== symptom));
      } else {
        setSelectedSymptoms([...filtered, symptom]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!mood) {
      toast.error('Please select your mood');
      return;
    }

    setSubmitting(true);

    try {
      const submission: CheckInSubmission = {
        patientId,
        responses: Object.entries(responses).map(([id, answer]) => {
          const question = questions.find(q => q.id === id);
          return {
            question: question?.question || '',
            answer
          };
        }),
        symptoms: selectedSymptoms.filter(s => s !== 'None'),
        mood,
        energyLevel
      };

      let data;

      if (config.useMockData) {
        // Use mock data in demo mode
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        data = submitMockDailyCheckIn(submission);
        toast.success('Check-in submitted successfully!');
      } else {
        // Use real Supabase backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/patient/${patientId}/daily-check-in`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submission)
          }
        );

        if (!response.ok) {
          throw new Error('Failed to submit check-in');
        }

        data = await response.json();
      }

      setResult(data);
      setStep(step + 1);
    } catch (error) {
      console.error('Error submitting check-in:', error);
      toast.error('Failed to submit check-in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = () => {
    if (step >= questions.length) {
      return renderSymptomsAndMood();
    }

    const currentQuestion = questions[step];
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <span className="text-sm text-blue-700">Question {step + 1} of {questions.length}</span>
          </div>
          <h2 className="text-2xl mb-2">{currentQuestion.question}</h2>
        </div>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(currentQuestion.id, option)}
              className="p-5 text-left border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg group-hover:text-blue-700 transition-colors">{option}</span>
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-blue-600 transition-colors"></div>
              </div>
            </button>
          ))}
        </div>

        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous Question
          </Button>
        )}
      </div>
    );
  };

  const renderSymptomsAndMood = () => {
    if (result) {
      return renderResult();
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Symptoms */}
        <div>
          <h3 className="text-xl mb-4">Any symptoms today?</h3>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`px-4 py-2 rounded-full border-2 transition-all ${
                  selectedSymptoms.includes(symptom)
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Mood */}
        <div>
          <h3 className="text-xl mb-4">How are you feeling emotionally?</h3>
          <div className="grid grid-cols-3 gap-4">
            {moods.map((moodOption) => {
              const Icon = moodOption.icon;
              return (
                <button
                  key={moodOption.value}
                  onClick={() => setMood(moodOption.value)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    mood === moodOption.value
                      ? `${moodOption.bg} border-current ${moodOption.color} shadow-lg`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{moodOption.emoji}</div>
                    <p>{moodOption.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Level */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Energy level today</h3>
            <div className="flex items-center gap-2">
              <Battery className="w-5 h-5 text-gray-600" />
              <span className="text-2xl">{energyLevel}/10</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <h3 className="text-xl mb-4">Anything else to share? (Optional)</h3>
          <Textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any concerns or observations..."
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all py-6 text-lg"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Submit Check-in
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const isGreen = result.classification === 'green';
    const isYellow = result.classification === 'yellow';
    const isRed = result.classification === 'red';

    return (
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className={`inline-flex p-8 rounded-full ${
          isGreen ? 'bg-green-100' : isYellow ? 'bg-yellow-100' : 'bg-red-100'
        } mb-4`}>
          {isGreen ? (
            <CheckCircle2 className="w-24 h-24 text-green-600" />
          ) : (
            <AlertCircle className="w-24 h-24 text-yellow-600" />
          )}
        </div>

        <div>
          <h2 className="text-3xl mb-4">Check-in Complete! ✓</h2>
          <p className="text-xl text-gray-700 mb-6">{result.message}</p>

          {result.streak > 0 && (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <span className="text-2xl">🔥</span>
              <span className="text-lg">{result.streak} day streak!</span>
            </div>
          )}
        </div>

        {result.requiresFollowUp && (
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardContent className="p-6">
              <p className="text-blue-900">
                <strong>What happens next:</strong> A member of your care team will review your responses and may reach out within 24 hours.
              </p>
            </CardContent>
          </Card>
        )}

        <Button
          onClick={onComplete}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all px-12 py-6 text-lg"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-2xl">Daily Check-in</h1>
              <p className="text-gray-600">Help us track your recovery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EmergencyHelpButton 
              emergencyContact="1-800-CARDIO-AI"
              emergencyContactName="CardioGuard Care Team"
              compact
            />
            {!result && (
              <Button variant="outline" onClick={onBack} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit
              </Button>
            )}
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white">
          <CardContent className="p-8 md:p-12">
            {renderQuestion()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}