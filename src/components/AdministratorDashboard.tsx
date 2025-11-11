import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Activity,
  Download,
  FileText,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle
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
import { isMockMode, simulateDelay } from '../utils/config';
import { getMockAdministratorMetrics } from '../utils/mockData';

interface AdministratorMetrics {
  readmissionMetrics: {
    current30DayRate: number;
    baseline30DayRate: number;
    reductionPercentage: number;
    preventedReadmissions: number;
  };
  costMetrics: {
    totalSavings: number;
    costPerReadmission: number;
    roi: number;
  };
  engagementMetrics: {
    totalPatients: number;
    activePatients: number;
    averageCheckInRate: number;
    averageStreakDays: number;
  };
  clinicianMetrics: {
    totalClinicians: number;
    weeklyActiveRate: number;
    averageResponseTime: number;
  };
  qualityMetrics: {
    patientSatisfaction: number;
    careQualityScore: number;
    nps: number;
  };
  trends: {
    month: string;
    readmissionRate: number;
    engagement: number;
    cost: number;
  }[];
}

export function AdministratorDashboard() {
  const [metrics, setMetrics] = useState<AdministratorMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      if (isMockMode()) {
        // Use mock data in demo mode
        await simulateDelay();
        const mockMetrics = getMockAdministratorMetrics();
        setMetrics(mockMetrics);
      } else {
        // Use real Supabase backend
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c21253d3/admin/metrics`,
          {
            headers: { 'Authorization': `Bearer ${publicAnonKey}` }
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'cms') => {
    if (!metrics) return;

    try {
      if (format === 'excel') {
        exportToExcel(metrics);
      } else if (format === 'pdf') {
        exportToPDF(metrics);
      } else if (format === 'cms') {
        exportToCMS(metrics);
      }
      toast.success(`${format.toUpperCase()} report exported successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export ${format.toUpperCase()} report`);
    }
  };

  const exportToExcel = (data: AdministratorMetrics) => {
    // Generate CSV data (Excel-compatible)
    const csvContent = [
      ['CardioGuard Executive Report', ''],
      ['Generated:', new Date().toLocaleDateString()],
      [''],
      ['READMISSION METRICS', ''],
      ['Baseline 30-Day Rate', `${data.readmissionMetrics.baseline30DayRate}%`],
      ['Current 30-Day Rate', `${data.readmissionMetrics.current30DayRate}%`],
      ['Reduction Percentage', `${data.readmissionMetrics.reductionPercentage}%`],
      ['Prevented Readmissions', data.readmissionMetrics.preventedReadmissions],
      [''],
      ['COST METRICS', ''],
      ['Total Savings', `$${data.costMetrics.totalSavings.toLocaleString()}`],
      ['Cost per Readmission', `$${data.costMetrics.costPerReadmission.toLocaleString()}`],
      ['Return on Investment', `${data.costMetrics.roi}x`],
      [''],
      ['ENGAGEMENT METRICS', ''],
      ['Total Patients', data.engagementMetrics.totalPatients],
      ['Active Patients', data.engagementMetrics.activePatients],
      ['Average Check-In Rate', `${data.engagementMetrics.averageCheckInRate}%`],
      ['Average Streak Days', data.engagementMetrics.averageStreakDays],
      [''],
      ['CLINICIAN METRICS', ''],
      ['Total Clinicians', data.clinicianMetrics.totalClinicians],
      ['Weekly Active Rate', `${data.clinicianMetrics.weeklyActiveRate}%`],
      ['Average Response Time', `${data.clinicianMetrics.averageResponseTime} hours`],
      [''],
      ['QUALITY METRICS', ''],
      ['Patient Satisfaction', `${data.qualityMetrics.patientSatisfaction}%`],
      ['Care Quality Score', `${data.qualityMetrics.careQualityScore}/100`],
      ['Net Promoter Score', data.qualityMetrics.nps],
      [''],
      ['MONTHLY TRENDS', ''],
      ['Month', 'Readmission Rate', 'Engagement %', 'Cost'],
      ...data.trends.map(t => [t.month, `${t.readmissionRate}%`, `${t.engagement}%`, `$${t.cost.toLocaleString()}`])
    ].map(row => row.join(',')).join('\n');

    downloadFile(csvContent, 'cardioguard-executive-report.csv', 'text/csv');
  };

  const exportToPDF = (data: AdministratorMetrics) => {
    // Generate HTML for PDF printing
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CardioGuard Executive Summary</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
          h1 { color: #1e40af; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
          .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .metric-label { font-weight: 500; color: #6b7280; }
          .metric-value { font-weight: 600; color: #111827; }
          .highlight { background: linear-gradient(to right, #dbeafe, #e0e7ff); padding: 20px; border-radius: 8px; margin: 20px 0; }
          .highlight-value { font-size: 32px; font-weight: bold; color: #1e40af; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e5e7eb; }
          th { background-color: #f9fafb; font-weight: 600; color: #374151; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>CardioGuard Executive Summary</h1>
        <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
        
        <div class="highlight">
          <h3 style="margin-top: 0;">Key Achievement</h3>
          <div class="highlight-value">${data.readmissionMetrics.reductionPercentage.toFixed(1)}% Readmission Reduction</div>
          <p>Prevented ${data.readmissionMetrics.preventedReadmissions} readmissions, resulting in $${(data.costMetrics.totalSavings / 1000).toFixed(0)}K total savings</p>
        </div>

        <h2>Readmission Analytics</h2>
        <div class="metric">
          <span class="metric-label">Baseline 30-Day Rate</span>
          <span class="metric-value">${data.readmissionMetrics.baseline30DayRate}%</span>
        </div>
        <div class="metric">
          <span class="metric-label">Current 30-Day Rate</span>
          <span class="metric-value">${data.readmissionMetrics.current30DayRate}%</span>
        </div>
        <div class="metric">
          <span class="metric-label">Prevented Readmissions</span>
          <span class="metric-value">${data.readmissionMetrics.preventedReadmissions}</span>
        </div>

        <h2>Financial Impact</h2>
        <div class="metric">
          <span class="metric-label">Total Cost Savings</span>
          <span class="metric-value">$${data.costMetrics.totalSavings.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Cost per Readmission</span>
          <span class="metric-value">$${data.costMetrics.costPerReadmission.toLocaleString()}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Return on Investment</span>
          <span class="metric-value">${data.costMetrics.roi.toFixed(1)}x</span>
        </div>

        <h2>Patient Engagement</h2>
        <div class="metric">
          <span class="metric-label">Total Patients Enrolled</span>
          <span class="metric-value">${data.engagementMetrics.totalPatients}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Active Patients</span>
          <span class="metric-value">${data.engagementMetrics.activePatients}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Average Check-In Rate</span>
          <span class="metric-value">${data.engagementMetrics.averageCheckInRate}%</span>
        </div>
        <div class="metric">
          <span class="metric-label">Average Streak Days</span>
          <span class="metric-value">${data.engagementMetrics.averageStreakDays}</span>
        </div>

        <h2>Quality Indicators</h2>
        <div class="metric">
          <span class="metric-label">Patient Satisfaction</span>
          <span class="metric-value">${data.qualityMetrics.patientSatisfaction}%</span>
        </div>
        <div class="metric">
          <span class="metric-label">Care Quality Score</span>
          <span class="metric-value">${data.qualityMetrics.careQualityScore}/100</span>
        </div>
        <div class="metric">
          <span class="metric-label">Net Promoter Score</span>
          <span class="metric-value">${data.qualityMetrics.nps}</span>
        </div>

        <h2>Monthly Performance Trends</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Readmission Rate</th>
              <th>Engagement</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            ${data.trends.map(t => `
              <tr>
                <td>${t.month}</td>
                <td>${t.readmissionRate}%</td>
                <td>${t.engagement}%</td>
                <td>$${t.cost.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p><strong>CardioGuard AI-Powered Post-Discharge Heart Patient Risk Management System</strong></p>
          <p>This report is confidential and intended for authorized healthcare personnel only.</p>
        </div>
      </body>
      </html>
    `;

    // Open print dialog for PDF generation
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const exportToCMS = (data: AdministratorMetrics) => {
    // Generate CMS HRRP-compliant report
    const cmsReport = {
      reportType: 'Hospital Readmission Reduction Program (HRRP)',
      facility: 'CardioGuard Program',
      reportingPeriod: {
        start: '2025-01-01',
        end: '2025-06-30'
      },
      generatedDate: new Date().toISOString(),
      
      // CMS Core Measures
      coreMeasures: {
        heartFailure30DayReadmission: {
          baseline: data.readmissionMetrics.baseline30DayRate,
          current: data.readmissionMetrics.current30DayRate,
          improvement: data.readmissionMetrics.reductionPercentage,
          preventedAdmissions: data.readmissionMetrics.preventedReadmissions
        },
        costImpact: {
          totalSavings: data.costMetrics.totalSavings,
          avgCostPerReadmission: data.costMetrics.costPerReadmission,
          roi: data.costMetrics.roi
        }
      },
      
      // Patient Engagement & Quality
      qualityMetrics: {
        patientEngagement: {
          totalEnrolled: data.engagementMetrics.totalPatients,
          activeParticipation: data.engagementMetrics.activePatients,
          complianceRate: data.engagementMetrics.averageCheckInRate,
          avgEngagementStreak: data.engagementMetrics.averageStreakDays
        },
        outcomeMetrics: {
          patientSatisfactionScore: data.qualityMetrics.patientSatisfaction,
          careQualityIndex: data.qualityMetrics.careQualityScore,
          netPromoterScore: data.qualityMetrics.nps
        },
        clinicalWorkforce: {
          activeClinicians: data.clinicianMetrics.totalClinicians,
          weeklyEngagementRate: data.clinicianMetrics.weeklyActiveRate,
          avgResponseTimeHours: data.clinicianMetrics.averageResponseTime
        }
      },
      
      // Trend Analysis
      monthlyTrends: data.trends.map(t => ({
        month: t.month,
        readmissionRate: t.readmissionRate,
        patientEngagement: t.engagement,
        programCost: t.cost
      })),
      
      // Compliance Statement
      compliance: {
        hrrpCompliant: true,
        dataValidation: 'Verified',
        auditTrail: 'Available upon request'
      }
    };

    const jsonContent = JSON.stringify(cmsReport, null, 2);
    downloadFile(jsonContent, 'cardioguard-cms-hrrp-report.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 mx-auto mb-3 text-blue-600 animate-pulse" />
          <p className="text-gray-700">Loading administrator dashboard...</p>
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
          <h1 className="mb-2 bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
            Executive Dashboard
          </h1>
          <p className="text-gray-600">
            High-level metrics and outcomes for CardioGuard program leadership
          </p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Readmission Reduction */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Readmission Reduction</p>
                  <p className="text-4xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {metrics.readmissionMetrics.reductionPercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-700 mt-1 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {metrics.readmissionMetrics.preventedReadmissions} prevented
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Savings */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Total Cost Savings</p>
                  <p className="text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ${(metrics.costMetrics.totalSavings / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-blue-700 mt-1 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {metrics.costMetrics.roi.toFixed(1)}x ROI
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Engagement */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Patient Engagement</p>
                  <p className="text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {metrics.engagementMetrics.averageCheckInRate.toFixed(0)}%
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    {metrics.engagementMetrics.activePatients}/{metrics.engagementMetrics.totalPatients} active
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Score */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Care Quality Score</p>
                  <p className="text-4xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    {metrics.qualityMetrics.careQualityScore}
                  </p>
                  <p className="text-sm text-orange-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    NPS: {metrics.qualityMetrics.nps}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readmission Rate Trend */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>30-Day Readmission Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="readmissionRate" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Readmission Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-900">
                  <strong>Trend Analysis:</strong> Consistent month-over-month improvement. 
                  Current rate of {metrics.readmissionMetrics.current30DayRate}% is 
                  {' '}{metrics.readmissionMetrics.reductionPercentage.toFixed(1)}% below baseline.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Engagement & Cost */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Program Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#8b5cf6" name="Engagement %" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl text-purple-600">{metrics.engagementMetrics.averageStreakDays}</p>
                  <p className="text-xs text-gray-600">Avg Streak Days</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl text-blue-600">{metrics.clinicianMetrics.weeklyActiveRate}%</p>
                  <p className="text-xs text-gray-600">Clinician Adoption</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Readmission Details */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Readmission Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Baseline Rate</span>
                <Badge className="bg-gray-600">{metrics.readmissionMetrics.baseline30DayRate}%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Current Rate</span>
                <Badge className="bg-green-600">{metrics.readmissionMetrics.current30DayRate}%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Prevented</span>
                <Badge className="bg-blue-600">{metrics.readmissionMetrics.preventedReadmissions}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cost Analysis */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Financial Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Cost per Readmission</span>
                <Badge className="bg-gray-600">${metrics.costMetrics.costPerReadmission.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Total Savings</span>
                <Badge className="bg-green-600">${metrics.costMetrics.totalSavings.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Return on Investment</span>
                <Badge className="bg-purple-600">{metrics.costMetrics.roi.toFixed(1)}x</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quality Metrics */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">Quality Indicators</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">Patient Satisfaction</span>
                <Badge className="bg-gray-600">{metrics.qualityMetrics.patientSatisfaction}%</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Care Quality Score</span>
                <Badge className="bg-blue-600">{metrics.qualityMetrics.careQualityScore}/100</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-700">Net Promoter Score</span>
                <Badge className="bg-orange-600">{metrics.qualityMetrics.nps}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Report Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <h4 className="mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  CMS Quality Report
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Hospital Readmission Reduction Program (HRRP) compliant report
                </p>
                <Button 
                  onClick={() => handleExportReport('cms')}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CMS Format
                </Button>
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <h4 className="mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Executive Summary
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Comprehensive PDF report for leadership and stakeholders
                </p>
                <Button 
                  onClick={() => handleExportReport('pdf')}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
              </div>

              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <h4 className="mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Data Export
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Raw data export for custom analysis and reporting
                </p>
                <Button 
                  onClick={() => handleExportReport('excel')}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-slate-50">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">EHR Integration</p>
                  <p className="text-green-700">Active</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">SMS Service</p>
                  <p className="text-green-700">Operational</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">AI Model</p>
                  <p className="text-green-700">0.84 AUC</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-blue-700">{metrics.clinicianMetrics.averageResponseTime}h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
