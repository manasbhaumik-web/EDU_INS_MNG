/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, Department, Invoice, Role, Expense, AuditLog } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, FileText, Sparkles, Award, ShieldAlert, CheckCircle, RefreshCcw, Calendar, DollarSign, Activity } from 'lucide-react';

interface ReportsPanelProps {
  currentUserRole: Role;
  students: StudentProfile[];
  departments: Department[];
  invoices: Invoice[];
  expenses: Expense[];
  auditLogs: AuditLog[];
}

export default function ReportsPanel({
  currentUserRole,
  students,
  departments,
  invoices,
  expenses,
  auditLogs,
}: ReportsPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'retaining'>('analytics');
  
  // Academic quarter & date range filter state
  const [timeframe, setTimeframe] = useState<'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'custom'>('all');
  const [customStart, setCustomStart] = useState('2026-01-01');
  const [customEnd, setCustomEnd] = useState('2026-12-31');

  // Predictive analytics run state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [retentionMetrics, setRetentionMetrics] = useState<{
    riskCount: number;
    satisfactoryCount: number;
    gpaAverage: number;
    reasonsList: { name: string; risk: string; advice: string }[];
  } | null>(null);

  const triggerAIAnalysis = () => {
    setIsAnalyzing(true);
    setRetentionMetrics(null);
    setTimeout(() => {
      // Analyze current student state
      const atRisk = students.filter(s => s.attendancePercent < 75 || s.gpa < 2.5);
      const riskNames = atRisk.map(s => {
        let riskType = '';
        let advice = '';
        if (s.attendancePercent < 75 && s.gpa < 2.5) {
          riskType = 'Severe Risk (Double Limit)';
          advice = 'Direct administrative intervention required. Recommend mandatory tutoring & counselor meetings.';
        } else if (s.attendancePercent < 75) {
          riskType = 'Critical Absenteeism Risk';
          advice = 'Notify guardians. Attendance is below the 75% limit, which is non-compliant with MoE rules.';
        } else {
          riskType = 'Academic GPA Risk';
          advice = 'Recommend remedial syllabus files and peer tutoring. Target GPA improvement above 2.50.';
        }
        return {
          name: s.name,
          risk: riskType,
          advice
        };
      });

      const avgGpa = students.reduce((sum, s) => sum + s.gpa, 0) / students.length;

      setRetentionMetrics({
        riskCount: atRisk.length,
        satisfactoryCount: students.length - atRisk.length,
        gpaAverage: Number(avgGpa.toFixed(2)),
        reasonsList: riskNames
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  const hasViewAccess = ['Super Admin', 'CEO & Director', 'HOD', 'HR', 'Teacher & Professor'].includes(currentUserRole);

  if (!hasViewAccess) {
    return (
      <div className="bg-white rounded-none p-8 border border-slate-200 text-center animate-fade-in shadow-none">
        <TrendingUp className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Access Restricted</h2>
        <p className="text-slate-505 mt-2 text-xs">
          Consolidated analytics ledger files require director or teaching counselor permissions. Select an authorized staff role.
        </p>
      </div>
    );
  }

  // Calculate timeframe bounds
  const getLimits = () => {
    switch (timeframe) {
      case 'Q1':
        return { start: '2026-01-01', end: '2026-03-31' };
      case 'Q2':
        return { start: '2026-04-01', end: '2026-06-30' };
      case 'Q3':
        return { start: '2026-07-01', end: '2026-09-30' };
      case 'Q4':
        return { start: '2026-10-01', end: '2026-12-31' };
      case 'custom':
        return { start: customStart, end: customEnd };
      default:
        return { start: '1970-01-01', end: '2099-12-31' };
    }
  };

  const limits = getLimits();

  // Filter components
  const filteredInvoices = invoices.filter(item => {
    const dateOnly = item.dateCreated.split(' ')[0];
    return dateOnly >= limits.start && dateOnly <= limits.end;
  });

  const filteredExpenses = expenses.filter(item => {
    const dateOnly = item.date.split(' ')[0];
    return dateOnly >= limits.start && dateOnly <= limits.end;
  });

  const filteredLogs = auditLogs.filter(item => {
    const dateOnly = item.timestamp.split(' ')[0];
    return dateOnly >= limits.start && dateOnly <= limits.end;
  });

  // Analytics tab metrics
  const studentsCountByDept = departments.map(d => {
    const matched = students.filter(s => s.departmentId === d.id);
    const avgGpa = matched.length > 0 ? (matched.reduce((sum, s) => sum + s.gpa, 0) / matched.length) : 0;
    return {
      code: d.code,
      name: d.name,
      'Average GPA': Number(avgGpa.toFixed(2)),
      'Majors Enrolled': matched.length
    };
  });

  // Calculate timeframe financial metrics
  const timeframeRevenue = filteredInvoices.filter(item => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
  const timeframeOutstanding = filteredInvoices.filter(item => item.status === 'Unpaid').reduce((sum, item) => sum + item.amount, 0);
  const timeframeExpensesPaid = filteredExpenses.filter(item => item.status === 'Approved').reduce((sum, item) => sum + item.amount, 0);
  const timeframeNetSurplus = timeframeRevenue - timeframeExpensesPaid;

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in text-xs text-slate-705">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
            Consolidated Reports & Metrics Analysis
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Review student performance clusters, financial balances, and AI academic retention vectors.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-none gap-1 text-[10px] font-bold uppercase tracking-wider self-start border border-slate-200">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'analytics' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-605 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Performance Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab('retaining')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'retaining' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-605 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Predictive retention</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Dynamic Academic Quarter & Date Range Picker Toolbar */}
        <div className="mb-6 bg-slate-50 border border-slate-200 p-4 font-sans text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-50 border border-indigo-200 p-1.5 text-indigo-600 rounded-none shrink-0 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] font-display">Academic Quarter Timeframe Filter</p>
                <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">Align reports, tuition records, and action logs dynamically.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {(['all', 'Q1', 'Q2', 'Q3', 'Q4', 'custom'] as const).map((q) => {
                const label = q === 'all' ? 'All Quarters' : q === 'custom' ? 'Custom Range' : `${q} 2026`;
                return (
                  <button
                    key={q}
                    onClick={() => setTimeframe(q)}
                    className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border rounded-none transition cursor-pointer ${
                      timeframe === q
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Picker Inputs - rendered only if custom is selected */}
          {timeframe === 'custom' && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Custom Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs outline-none focus:border-indigo-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Custom End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs outline-none focus:border-indigo-600 font-mono"
                />
              </div>
            </div>
          )}

          {/* Current range info preview */}
          <div className="mt-3 text-[9px] text-slate-400 font-extrabold uppercase tracking-wide flex flex-col sm:flex-row sm:items-center gap-1.5 bg-white p-2.5 border border-slate-200/60 font-sans">
            <span>Active Reporting Window:</span>
            <span className="text-indigo-600 font-mono text-[9.5px]">
              {limits.start === '1970-01-01' ? 'unrestricted history' : `${limits.start} to ${limits.end}`}
            </span>
            <span className="hidden sm:inline text-slate-300 mx-1">|</span>
            <span className="inline-flex gap-1">
              Matched: <strong className="text-slate-900 font-mono">{filteredInvoices.length}</strong> Invoices, <strong className="text-slate-900 font-mono">{filteredExpenses.length}</strong> Expenses, <strong className="text-slate-900 font-mono">{filteredLogs.length}</strong> Logs
            </span>
          </div>
        </div>

        {/* GRAPH & PERFORMANCE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Departmental GPA breakdown chart */}
              <div className="bg-slate-50 p-5 border border-slate-200 rounded-none">
                <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider font-display mb-3 flex items-center gap-1 border-b border-slate-200 pb-2">
                  <Award className="w-4 h-4 text-indigo-600" /> Departmental Average GPA Score Distribution
                </h3>
                <div className="h-64 mt-2 font-sans">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentsCountByDept} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="code" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} />
                      <YAxis domain={[0, 4]} tick={{ fontSize: 10, fill: '#64748B' }} />
                      <Tooltip formatter={(val: any) => [`GPA: ${val}`, '']} />
                      <Bar dataKey="Average GPA" fill="#818CF8" radius={[0, 0, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Departmental Enrollments overview chart */}
              <div className="bg-slate-50 p-5 border border-slate-200 rounded-none">
                <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider font-display mb-3 flex items-center gap-1 border-b border-slate-200 pb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Major enrollment counts
                </h3>
                <div className="h-64 mt-2 font-sans">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studentsCountByDept} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="#E2E8F0" vertical={false} />
                      <XAxis dataKey="code" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="Majors Enrolled" stroke="#4f46e5" fill="#EEF2FF" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* QUARTER FINANCIAL PERFORMANCE TRENDS */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-none">
              <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider font-display mb-4 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Timeframe Financial Ledger Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-sans">
                <div className="p-3 bg-white border border-slate-200/80">
                  <p className="text-[8px] text-slate-350 uppercase font-bold tracking-wider">Tuition Fees Collected</p>
                  <p className="text-base font-bold text-slate-900 mt-1">${timeframeRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white border border-slate-200/80">
                  <p className="text-[8px] text-slate-350 uppercase font-bold tracking-wider">Outstanding Accounts</p>
                  <p className="text-base font-bold text-slate-505 mt-1">${timeframeOutstanding.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white border border-slate-200/80">
                  <p className="text-[8px] text-slate-350 uppercase font-bold tracking-wider">Approved Operating Costs</p>
                  <p className="text-base font-bold text-red-700 mt-1">${timeframeExpensesPaid.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-white border border-slate-200/80">
                  <p className="text-[8px] text-slate-350 uppercase font-bold tracking-wider">Net Institutional Surplus</p>
                  <p className={`text-base font-extrabold mt-1 ${timeframeNetSurplus >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    ${timeframeNetSurplus.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* DYNAMIC TIMEFRAME LEDGER ACTION LOGS */}
            <div className="bg-white border border-slate-200 rounded-none overflow-hidden text-xs">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-600" /> Active Quarter System Log Ledger
                </h3>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Matched {filteredLogs.length} audit operations</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Operator</th>
                      <th className="p-3">Action File</th>
                      <th className="p-3">Module Dept</th>
                      <th className="p-3">Operational Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-3 font-mono text-[9px] text-slate-400 font-semibold">{log.timestamp}</td>
                        <td className="p-3 font-bold text-slate-900">{log.user}</td>
                        <td className="p-3">
                          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-extrabold px-1.5 py-0.5 uppercase tracking-wide">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-600">{log.module}</td>
                        <td className="p-3 text-slate-500 font-medium">{log.details}</td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider text-[9px] bg-slate-50/50">
                          No audit record traces matches this active quarter window.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Strategic reports pointers */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-none leading-relaxed text-[11.5px] text-slate-705">
              <strong className="text-slate-900 uppercase tracking-wider text-[9px] block mb-1">Director Strategical Insight Statement:</strong>
              Average students GPA across the institution sits around <strong className="font-mono text-indigo-600">3.30</strong>. Physics and Humanities divisions suggest steady enrollment increments, while CS research tracks have secured 100% of their allocated budget, preparing students files for dynamic AI research.
            </div>
          </div>
        )}

        {/* AI PREDICTIVE RETENTION STATISTICS */}
        {activeTab === 'retaining' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 text-white p-5 rounded-none border border-slate-900">
              <div>
                <h3 className="font-bold text-white text-[11px] uppercase tracking-wider font-display flex items-center gap-1.5"><Sparkles className="w-4 h-4 animate-pulse text-indigo-400" /> AI Retention & Student Risk Forecaster</h3>
                <p className="text-slate-400 text-[10px] uppercase tracking-wide mt-1">Scan the student cluster records databases based on attendance constraints and class grade metrics.</p>
              </div>
              <button
                disabled={isAnalyzing}
                onClick={triggerAIAnalysis}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-3 px-4 rounded-none transition flex items-center gap-1.5 shadow-none font-sans shrink-0 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Database...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Compute Retention Risks
                  </>
                )}
              </button>
            </div>

            {retentionMetrics ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual scorecards */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px]">Forecast Overview</h4>
                  
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-none text-center">
                    <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Satisfactory / Low Risk</p>
                    <p className="text-xl font-light text-slate-900 font-display mt-1">{retentionMetrics.satisfactoryCount} Students</p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-none text-center">
                    <ShieldAlert className="w-6 h-6 text-red-650 mx-auto mb-2 animate-pulse" />
                    <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Academic Retention Risk</p>
                    <p className="text-xl font-light text-red-800 font-display mt-1">{retentionMetrics.riskCount} Students</p>
                  </div>
                </div>

                {/* Risk detailed accounts listing */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px]">Individual Risk Vectors & Counselor Advice</h4>
                  
                  <div className="space-y-3">
                    {retentionMetrics.reasonsList.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-none border border-slate-200 space-y-1">
                        <div className="flex justify-between items-center font-bold pb-1 border-b border-slate-100">
                          <span className="text-slate-900 text-xs font-bold uppercase tracking-wide">{item.name}</span>
                          <span className="text-[8px] bg-red-100 text-red-700 px-2 py-0.5 rounded-none border border-red-200 uppercase font-extrabold tracking-wider">{item.risk}</span>
                        </div>
                        <p className="text-slate-505 leading-relaxed text-[11px] pt-1">
                          <strong className="text-slate-900 uppercase tracking-wider text-[8px] font-bold block mb-0.5">Counselor Action Proposal:</strong> 
                          <span className="text-slate-755 font-medium">{item.advice}</span>
                        </p>
                      </div>
                    ))}

                    {retentionMetrics.reasonsList.length === 0 && (
                      <div className="p-5 text-center text-slate-400 bg-slate-50 rounded-none border border-dashed border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                        Excellent Academic Health! Active database scans report zero high-risk student warnings.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              !isAnalyzing && (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-none text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                  Click 'Compute Retention Risks' to query institutional database metrics in real-time.
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
