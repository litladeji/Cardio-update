import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  Heart, 
  Activity,
  Weight,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface VitalTrend {
  date: string;
  value: number;
}

interface ProgressTrackerProps {
  weightTrend: VitalTrend[];
  heartRateTrend: VitalTrend[];
  symptomStreakDays: number;
  lastWeight?: number;
  lastHeartRate?: number;
  targetWeight?: number;
}

export function ProgressTracker({
  weightTrend,
  heartRateTrend,
  symptomStreakDays,
  lastWeight,
  lastHeartRate,
  targetWeight
}: ProgressTrackerProps) {
  
  const getWeightTrend = () => {
    if (weightTrend.length < 2) return 'stable';
    const recent = weightTrend[weightTrend.length - 1].value;
    const previous = weightTrend[weightTrend.length - 2].value;
    const diff = recent - previous;
    
    if (diff > 2) return 'up';
    if (diff < -2) return 'down';
    return 'stable';
  };
  
  const getHeartRateTrend = () => {
    if (heartRateTrend.length < 2) return 'stable';
    const recent = heartRateTrend[heartRateTrend.length - 1].value;
    const previous = heartRateTrend[heartRateTrend.length - 2].value;
    const diff = recent - previous;
    
    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  };
  
  const weightTrendType = getWeightTrend();
  const heartRateTrendType = getHeartRateTrend();
  
  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-orange-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };
  
  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-orange-600 bg-orange-50';
    if (trend === 'down') return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };
  
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          Your Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Symptom-Free Streak */}
        <div className="p-5 bg-white rounded-xl shadow-md border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-green-900">Healthy Days Streak</h4>
                <p className="text-xs text-gray-600">Consecutive days with good check-ins</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {symptomStreakDays}
              </p>
              <p className="text-xs text-gray-600">days</p>
            </div>
          </div>
          
          {symptomStreakDays >= 7 && (
            <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-300">
              <p className="text-sm text-green-800 flex items-center gap-2">
                🎉 <strong>Amazing!</strong> You've maintained a week-long streak!
              </p>
            </div>
          )}
          
          {symptomStreakDays >= 30 && (
            <div className="mt-2 p-3 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg border border-yellow-300">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                🏆 <strong>Outstanding!</strong> 30-day milestone reached!
              </p>
            </div>
          )}
        </div>
        
        {/* Weight Tracking */}
        <div className="p-5 bg-white rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Weight className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-blue-900">Weight</h4>
                <p className="text-xs text-gray-600">Daily monitoring</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-2xl">{lastWeight || '--'} <span className="text-sm text-gray-600">lbs</span></p>
                {getTrendIcon(weightTrendType)}
              </div>
              <Badge className={`${getTrendColor(weightTrendType)} border-0 mt-1`}>
                {weightTrendType === 'stable' ? 'Stable' : weightTrendType === 'up' ? 'Increasing' : 'Decreasing'}
              </Badge>
            </div>
          </div>
          
          {/* Mini trend visualization */}
          <div className="flex items-end gap-1 h-16 mt-3">
            {weightTrend.slice(-7).map((point, idx) => {
              const max = Math.max(...weightTrend.slice(-7).map(p => p.value));
              const min = Math.min(...weightTrend.slice(-7).map(p => p.value));
              const range = max - min || 1;
              const height = ((point.value - min) / range) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t transition-all"
                    style={{ height: `${Math.max(height, 10)}%` }}
                  />
                  <span className="text-xs text-gray-500">
                    {new Date(point.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
          
          {targetWeight && lastWeight && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                Target: {targetWeight} lbs 
                {lastWeight > targetWeight && (
                  <span className="ml-2 text-blue-700">
                    ({(lastWeight - targetWeight).toFixed(1)} lbs to go)
                  </span>
                )}
                {lastWeight <= targetWeight && (
                  <span className="ml-2 text-green-700">✓ Target met!</span>
                )}
              </p>
            </div>
          )}
        </div>
        
        {/* Heart Rate Tracking */}
        <div className="p-5 bg-white rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-red-900">Heart Rate</h4>
                <p className="text-xs text-gray-600">Resting rate</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-2xl">{lastHeartRate || '--'} <span className="text-sm text-gray-600">bpm</span></p>
                {getTrendIcon(heartRateTrendType)}
              </div>
              <Badge className={`${getTrendColor(heartRateTrendType)} border-0 mt-1`}>
                {heartRateTrendType === 'stable' ? 'Stable' : heartRateTrendType === 'up' ? 'Elevated' : 'Decreased'}
              </Badge>
            </div>
          </div>
          
          {/* Mini trend visualization */}
          <div className="flex items-end gap-1 h-16 mt-3">
            {heartRateTrend.slice(-7).map((point, idx) => {
              const max = Math.max(...heartRateTrend.slice(-7).map(p => p.value));
              const min = Math.min(...heartRateTrend.slice(-7).map(p => p.value));
              const range = max - min || 1;
              const height = ((point.value - min) / range) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-gradient-to-t from-red-500 to-pink-600 rounded-t transition-all"
                    style={{ height: `${Math.max(height, 10)}%` }}
                  />
                  <span className="text-xs text-gray-500">
                    {new Date(point.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Normal range: 60-100 bpm at rest
            </p>
          </div>
        </div>
        
        {/* Last Updated */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-2">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
