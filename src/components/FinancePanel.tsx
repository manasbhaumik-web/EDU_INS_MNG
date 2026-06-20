/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Invoice, Expense, Department, Role } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DollarSign, FileText, PieChart, TrendingUp, Check, X, PlusCircle, AlertCircle, Calendar } from 'lucide-react';

interface FinancePanelProps {
  currentUserRole: Role;
  invoices: Invoice[];
  expenses: Expense[];
  departments: Department[];
  onAddInvoice: (invoice: Omit<Invoice, 'id' | 'dateCreated'>) => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'date' | 'status'>) => void;
  onUpdateExpenseStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function FinancePanel({
  currentUserRole,
  invoices,
  expenses,
  departments,
  onAddInvoice,
  onAddExpense,
  onUpdateExpenseStatus,
  onLogAction,
}: FinancePanelProps) {
  const [activeTab, setActiveTab] = useState<'fees' | 'budget' | 'expenses'>('fees');

  // Academic quarter & date range filter state
  const [timeframe, setTimeframe] = useState<'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'custom'>('all');
  const [customStart, setCustomStart] = useState('2026-01-01');
  const [customEnd, setCustomEnd] = useState('2026-12-31');

  // Invoice creation form state
  const [studentName, setStudentName] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState(3500);
  const [invoiceType, setInvoiceType] = useState<'Tuition' | 'Admission' | 'Library' | 'Exam'>('Tuition');
  const [invoiceStatus, setInvoiceStatus] = useState<'Paid' | 'Unpaid'>('Unpaid');

  // Expense creation form state
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(1500);
  const [expenseDeptId, setExpenseDeptId] = useState('d1');

  const hasFullAccess = ['Super Admin', 'CEO & Director'].includes(currentUserRole);
  const isClerk = currentUserRole === 'Clerk & Executive';
  const hasViewAccess = ['Super Admin', 'CEO & Director', 'HR', 'Clerk & Executive', 'HOD'].includes(currentUserRole);

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || invoiceAmount <= 0) return;

    onAddInvoice({
      studentName,
      amount: invoiceAmount,
      type: invoiceType,
      status: invoiceStatus,
    });

    onLogAction(
      'Generate Invoice',
      'Finance & Ledger',
      `Billed student ${studentName} for $${invoiceAmount} (${invoiceType})`
    );

    setStudentName('');
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || expenseAmount <= 0) return;

    onAddExpense({
      title: expenseTitle,
      amount: expenseAmount,
      departmentId: expenseDeptId,
      requestedBy: currentUserRole,
    });

    onLogAction(
      'Request Expense Payout',
      'Finance & Ledger',
      `Requested $${expenseAmount} reimbursement for: ${expenseTitle}`
    );

    setExpenseTitle('');
  };

  if (!hasViewAccess) {
    return (
      <div className="bg-white rounded-none p-8 border border-slate-200 text-center animate-fade-in shadow-none">
        <DollarSign className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Access Restricted</h2>
        <p className="text-slate-500 mt-2 text-xs">
          Only Admin, CEO, HOD, and clerical personnel have access clearance to view Account & Finance records.
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

  // Filter lists based on timeframe bounds
  const filteredInvoices = invoices.filter(item => {
    const dateOnly = item.dateCreated.split(' ')[0];
    return dateOnly >= limits.start && dateOnly <= limits.end;
  });

  const filteredExpenses = expenses.filter(item => {
    const dateOnly = item.date.split(' ')[0];
    return dateOnly >= limits.start && dateOnly <= limits.end;
  });

  // Calculate Metrics recursively based on timeframe filter
  const totalInvoiced = filteredInvoices.reduce((sum, item) => sum + item.amount, 0);
  const paidInvoiced = filteredInvoices.filter(item => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
  const unpaidInvoiced = filteredInvoices.filter(item => item.status === 'Unpaid').reduce((sum, item) => sum + item.amount, 0);

  // Departmental Budget structures for chart (Expended represents dynamic spent matching the filtered timeframe)
  const budgetChartData = departments.map((dept) => {
    const dynamicSpent = filteredExpenses
      .filter(exp => exp.departmentId === dept.id && exp.status === 'Approved')
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      name: dept.code,
      fullName: dept.name,
      Allocated: dept.budget,
      Expended: timeframe === 'all' ? dept.spent : dynamicSpent,
    };
  });

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <DollarSign className="w-4 h-4 text-indigo-600 shrink-0" />
            Core Accounts & Finance Ledger
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Oversee fee invoice generations, departmental budget caps, and logistics expenses.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-none gap-1 text-[10px] font-bold uppercase tracking-wider self-start border border-slate-200">
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'fees' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-505 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Fee Invoicing</span>
          </button>
          
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'budget' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-605 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><PieChart className="w-3.5 h-3.5" /> Budgets</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'expenses' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-65 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Expenses</span>
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
                <p className="text-[9px] text-slate-400 uppercase tracking-wide font-semibold">Segment logs, invoices, and expense claims dynamically.</p>
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
          <div className="mt-3 text-[9px] text-slate-400 font-extrabold uppercase tracking-wide flex flex-col sm:flex-row sm:items-center gap-1.5 bg-white p-2.5 border border-slate-200/60">
            <span>Active Ledger Window:</span>
            <span className="text-indigo-600 font-mono text-[9.5px]">
              {limits.start === '1970-01-01' ? 'unrestricted history' : `${limits.start} to ${limits.end}`}
            </span>
            <span className="hidden sm:inline text-slate-300 mx-1">|</span>
            <span className="inline-flex gap-1">
              Matched: <strong className="text-slate-900 font-mono">{filteredInvoices.length}</strong> Invoices, <strong className="text-slate-900 font-mono">{filteredExpenses.length}</strong> Expenses
            </span>
          </div>
        </div>

        {/* TAB 1: FEES & INVOICES */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold font-sans">
              <div className="bg-slate-50 p-4 rounded-none border border-slate-200">
                <p className="text-slate-450 uppercase tracking-wider text-[8px]">Gross Billed Invoices</p>
                <p className="text-xl font-light text-slate-900 font-display mt-2">${totalInvoiced.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-none border border-slate-200">
                <p className="text-emerald-600 uppercase tracking-wider text-[8px]">Total Fees Collected (Paid)</p>
                <p className="text-xl font-bold text-emerald-800 font-display mt-2">${paidInvoiced.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-none border border-slate-200">
                <p className="text-red-600 uppercase tracking-wider text-[8px]">Outstanding Balances (Unpaid)</p>
                <p className="text-xl font-bold text-red-800 font-display mt-2">${unpaidInvoiced.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Create Invoice (Authorized Roles) */}
              {hasFullAccess || isClerk ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-205 text-xs text-slate-705">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-650" /> Generate Student Invoice
                  </h3>
                  <form onSubmit={handleInvoiceSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Enrolled Student Name</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="John Shepard"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white focus:outline-none focus:border-indigo-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Invoice Dollar Amount ($)</label>
                      <input
                        type="number"
                        required
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Invoice Category</label>
                      <select
                        value={invoiceType}
                        onChange={(e) => setInvoiceType(e.target.value as any)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Tuition">Tuition Fees</option>
                        <option value="Admission">Admission Fee</option>
                        <option value="Library">Library Charge</option>
                        <option value="Exam">Exam Processing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Ledger Status</label>
                      <select
                        value={invoiceStatus}
                        onChange={(e) => setInvoiceStatus(e.target.value as any)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-600"
                      >
                        <option value="Unpaid">Unpaid (Outstanding)</option>
                        <option value="Paid">Paid / Cleared</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-2"
                    >
                      Bake Official Invoice Index
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs text-slate-600 text-center flex flex-col justify-center">
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[9px] mb-2">Invoice Control</p>
                  <p>Invoicing and transaction submissions are locked to Super Admins, CEOs, and Finance Clerks.</p>
                </div>
              )}

              {/* Outstanding list */}
              <div className="flex-1 overflow-x-auto border border-slate-200 rounded-none text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                    <tr>
                      <th className="p-3.5">Invoice ID</th>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5">Charge Category</th>
                      <th className="p-3.5">Billed Stamp</th>
                      <th className="p-3.5">Amount ($)</th>
                      <th className="p-3.5">Clearance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-755">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-3.5 font-mono text-[10px] font-semibold text-slate-450">{inv.id}</td>
                        <td className="p-3.5 font-bold text-slate-900">{inv.studentName}</td>
                        <td className="p-3.5 font-semibold text-slate-600">{inv.type} Fee</td>
                        <td className="p-3.5 text-slate-500 font-mono text-[10px]">{inv.dateCreated}</td>
                        <td className="p-3.5 font-mono font-bold text-xs">${inv.amount.toLocaleString()}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredInvoices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider text-[9px] bg-slate-50/50">
                          No invoices found matches the selected timeframe.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUDGETS */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Financial chart */}
              <div className="bg-slate-50 p-5 rounded-none border border-slate-200 lg:col-span-2 font-sans">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-display mb-4 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Departmental Finances (Allocated vs Spent)
                </h3>
                <div className="h-64 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 'bold' }} />
                      <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{ fontSize: 10, fill: '#64748B' }} />
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, '']} />
                      <Bar dataKey="Allocated" fill="#1e1b4b" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Expended" fill="#4f46e5" radius={[0, 0, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department breakdown listing */}
              <div className="space-y-3.5 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2"><AlertCircle className="w-3.5 h-3.5 text-indigo-600" /> Departmental Reserves</h4>
                {departments.map((dept) => {
                  const dataForDept = budgetChartData.find(d => d.name === dept.code);
                  const dynamicExpended = dataForDept ? dataForDept.Expended : dept.spent;
                  const percentUsed = Math.min(100, Math.round((dynamicExpended / dept.budget) * 100));
                  return (
                    <div key={dept.id} className="bg-white p-3.5 rounded-none border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{dept.name} ({dept.code})</span>
                        <span className="font-mono text-[10px] text-slate-500 font-bold">{percentUsed}% spent</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-none overflow-hidden">
                        <div
                          className={`h-full rounded-none ${percentUsed > 85 ? 'bg-red-500' : 'bg-indigo-600'}`}
                          style={{ width: `${percentUsed}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between font-mono text-[9px] text-slate-450 pt-0.5">
                        <span>B: ${dept.budget.toLocaleString()}</span>
                        <span>S: ${dynamicExpended.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXPENSE REQUISITIONS */}
        {activeTab === 'expenses' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Expense creation form */}
              <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                  <PlusCircle className="w-3.5 h-3.5 text-pink-600" /> Purchase Requisition
                </h3>
                <form onSubmit={handleExpenseSubmit} className="space-y-3">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Requisition Title</label>
                    <input
                      type="text"
                      required
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      placeholder="Oscilloscopes & electronic engineering tools"
                      className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Payout Amount ($)</label>
                    <input
                      type="number"
                      required
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Department Charged</label>
                    <select
                      value={expenseDeptId}
                      onChange={(e) => setExpenseDeptId(e.target.value)}
                      className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-2"
                  >
                    Submit Purchase Order File
                  </button>
                </form>
              </div>

              {/* Expense management list */}
              <div className="flex-1 overflow-x-auto border border-slate-200 rounded-none">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                    <tr>
                      <th className="p-3.5">Expense ID</th>
                      <th className="p-3.5">Description Title</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Amount ($)</th>
                      <th className="p-3.5">Requested By</th>
                      <th className="p-3.5">Ledger Status</th>
                      {hasFullAccess && <th className="p-3.5 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredExpenses.map((exp) => {
                      const deptCode = departments.find(d => d.id === exp.departmentId)?.code || 'N/A';
                      return (
                        <tr key={exp.id} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="p-3.5 font-mono text-[10px] text-slate-450 font-bold">{exp.id}</td>
                          <td className="p-3.5 font-bold text-slate-900">{exp.title}</td>
                          <td className="p-3.5 font-semibold text-slate-600">Dept {deptCode}</td>
                          <td className="p-3.5 font-mono font-bold text-slate-900">${exp.amount.toLocaleString()}</td>
                          <td className="p-3.5 font-bold text-slate-500 uppercase text-[9px] tracking-wider">{exp.requestedBy}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                              exp.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                              exp.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {exp.status}
                            </span>
                          </td>
                          {hasFullAccess && (
                            <td className="p-3.5 text-right">
                              {exp.status === 'Pending' ? (
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => {
                                      onUpdateExpenseStatus(exp.id, 'Approved');
                                      onLogAction('Approve Expense', 'Finance & Ledger', `Approved expense ${exp.title} ($${exp.amount}) for dept ${deptCode}`);
                                    }}
                                    className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-none p-1 hover:bg-emerald-100 transition cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5 font-extrabold" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      onUpdateExpenseStatus(exp.id, 'Rejected');
                                      onLogAction('Reject Expense', 'Finance & Ledger', `Rejected expense ${exp.title} ($${exp.amount})`);
                                    }}
                                    className="bg-red-50 border border-red-200 text-red-700 rounded-none p-1 hover:bg-red-100 transition cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5 font-extrabold" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Archived</span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan={hasFullAccess ? 7 : 6} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider text-[9px] bg-slate-50/50">
                          No expenses found matches the selected timeframe.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
