import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Activity,
  BarChart3,
  Download,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { config, simulateDelay } from '../utils/config';
import { getMockAnalytics } from '../utils/mockData';

interface AnalyticsData {
  totalPatients: number;
  riskDistribution: {
    level: string;
    count: number;
    color: string;
  }[];
  readmissionTrends: {
    month: string;
    rate: number;
    target: number;
  }[];
  currentReadmissionRate: number;
  targetRate: number;
  reductionPercentage: number;
  estimatedCostSavings: number;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Check if we're in mock mode
      if (config.useMockData) {
        await simulateDelay();
        const mockData = getMockAnalytics();
        setAnalytics(mockData);
        setLoading(false);
        return;
      }

      // Use real Supabase backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
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

  const handleExportPdf = () => {
    toast.success('PDF report generation started - this would generate a comprehensive report in production');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl shadow-2xl">
              <BarChart3 className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-gray-700 text-lg mb-2">Loading analytics...</p>
          <p className="text-gray-500 text-sm">Computing readmission trends and metrics</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="mb-2 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">Analytics Dashboard</h1>
          <p className="text-gray-600">30-day readmission trends and program metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-6 duration-700">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Current Rate</p>
                  <p className="text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{analytics.currentReadmissionRate}%</p>
                  <p className="text-sm text-green-700 mt-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {analytics.reductionPercentage.toFixed(1)}% reduction
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Target Rate</p>
                  <p className="text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{analytics.targetRate}%</p>
                  <p className="text-sm mt-1">
                    {analytics.currentReadmissionRate <= analytics.targetRate ? (
                      <span className="text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Target met
                      </span>
                    ) : (
                      <span className="text-orange-600">Below target</span>
                    )}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Cost Savings</p>
                  <p className="text-4xl bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">${(analytics.estimatedCostSavings / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-600 mt-1">Estimated</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Active Patients</p>
                  <p className="text-4xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{analytics.totalPatients}</p>
                  <p className="text-sm text-gray-600 mt-1">In program</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readmission Trend */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-left-4 duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                30-Day Readmission Rate Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.readmissionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
                    domain={[0, 20]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Readmission Rate"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Target"
                    dot={{ r: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                <p className="text-sm">
                  <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">✓ Success:</span> Readmission rate decreased from 18.5% to {analytics.currentReadmissionRate}%, 
                  exceeding the {analytics.targetRate}% target by {(analytics.targetRate - analytics.currentReadmissionRate).toFixed(1)} percentage points.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                Patient Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ level, count }) => `${level}: ${count}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  {analytics.riskDistribution.map((item, index) => (
                    <div 
                      key={item.level} 
                      className="space-y-2 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-slate-50 animate-in fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full shadow-lg" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.level}</span>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-white shadow-sm">{item.count}</span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full transition-all duration-1000 ease-out rounded-full shadow-sm"
                          style={{ 
                            width: `${(item.count / analytics.totalPatients) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {((item.count / analytics.totalPatients) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              Program Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Readmission Reduction</span>
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">{analytics.reductionPercentage.toFixed(1)}%</Badge>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-1000 ease-out rounded-full shadow-lg"
                    style={{ width: `${Math.min(100, analytics.reductionPercentage * 3)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">Target: ≥15% reduction</p>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Model AUC Score</span>
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">0.84</Badge>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out rounded-full shadow-lg"
                    style={{ width: '84%' }}
                  />
                </div>
                <p className="text-sm text-gray-600">Target: ≥0.80 AUC</p>
              </div>

              <div className="space-y-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Clinician Adoption</span>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">92%</Badge>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-1000 ease-out rounded-full shadow-lg"
                    style={{ width: '92%' }}
                  />
                </div>
                <p className="text-sm text-gray-600">Target: ≥85% weekly active</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg">Cost Impact</h3>
                </div>
                <p className="text-sm text-gray-700">
                  Estimated savings of <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">${analytics.estimatedCostSavings.toLocaleString()}</span> based on prevented readmissions. 
                  Average cost per readmission: $15,000.
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg">Patient Outcomes</h3>
                </div>
                <p className="text-sm text-gray-700">
                  High-risk patients receiving intervention within 48 hours show <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">67%</span> lower readmission rates 
                  compared to standard care protocols.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export & Reports */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-6 h-6 text-gray-700" />
              Data Export
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex-1 p-5 border-0 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md hover:shadow-lg transition-all">
                <h3 className="mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Anonymized Prediction Data
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Export FHIR-compliant dataset for analysis and reporting
                </p>
                <button 
                  onClick={handleExportFhir}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                  Export as FHIR JSON
                </button>
              </div>

              <div className="flex-1 p-5 border-0 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 shadow-md hover:shadow-lg transition-all">
                <h3 className="mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Monthly Report
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive program performance report for stakeholders
                </p>
                <button 
                  onClick={handleExportPdf}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
                >
                  Generate PDF Report
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
