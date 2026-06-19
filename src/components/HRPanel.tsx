/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Employee, LeaveRequest, Role } from '../types';
import { Users, FileText, Calendar, DollarSign, Award, TrendingUp, Check, X, UserPlus } from 'lucide-react';

interface HRPanelProps {
  currentUserRole: Role;
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  onAddEmployee: (e: Omit<Employee, 'id'>) => void;
  onUpdateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function HRPanel({
  currentUserRole,
  employees,
  leaveRequests,
  onAddEmployee,
  onUpdateLeaveStatus,
  onLogAction,
}: HRPanelProps) {
  const [activeTab, setActiveTab] = useState<'employees' | 'leave' | 'appraisal' | 'recruitment'>('employees');

  // Employee Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('Teacher & Professor');
  const [department, setDepartment] = useState('Computer Science');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState(6000);

  // Recruitment/Onboarding simulated submissions
  const [jobPostings, setJobPostings] = useState([
    { id: 'j1', title: 'Associate Professor of Cybersecurity', department: 'Computer Science', status: 'Active (4 Applicants)', applicants: ['David Miller', 'Clara Oswald', 'John Watson', 'Clara Smith'] },
    { id: 'j2', title: 'Senior Clerk & Ledger Executive', department: 'Administration', status: 'Active (2 Applicants)', applicants: ['Martha Jones', 'Donna Noble'] }
  ]);
  const [applicantTrack, setApplicantTrack] = useState([
    { id: 'ap1', name: 'David Miller', job: 'Associate Professor of Cybersecurity', stage: 'On-site Interview', score: 94 },
    { id: 'ap2', name: 'Martha Jones', job: 'Senior Clerk & Ledger Executive', stage: 'Technical Assessment', score: 87 }
  ]);

  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Computer Science');

  const hasFullAccess = ['Super Admin', 'HR', 'CEO & Director'].includes(currentUserRole);
  const canApproveLeave = ['Super Admin', 'HR', 'HOD', 'CEO & Director'].includes(currentUserRole);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddEmployee({
      name,
      role,
      department,
      email,
      leaveBalance: 15,
      salary,
      performanceScore: 85,
      attendanceRate: 100,
      status: 'Active',
    });

    onLogAction('Onboard Staff member', 'HR Management', `Added employee ${name} as ${role} in ${department}`);
    setName('');
    setEmail('');
  };

  const handleAddJobPosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle) return;
    setJobPostings([
      ...jobPostings,
      { id: 'j' + (jobPostings.length + 1), title: newJobTitle, department: newJobDept, status: 'Active (0 Applicants)', applicants: [] }
    ]);
    onLogAction('Publish Job Listing', 'HR Management', `Posted a new job opportunity for ${newJobTitle}`);
    setNewJobTitle('');
  };

  if (!hasFullAccess && currentUserRole !== 'Teacher & Professor' && currentUserRole !== 'Clerk & Executive' && currentUserRole !== 'HOD') {
    return (
      <div className="bg-white rounded-none p-8 border border-slate-200 text-center animate-fade-in shadow-none">
        <Users className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Access Restricted</h2>
        <p className="text-slate-550 mt-2 text-xs">
          Only institutional staff and administration are permitted to log in or inspect the Human Resources module.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in text-xs text-slate-705">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <Users className="w-4 h-4 text-teal-650 shrink-0" />
            Human Resources Management
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Track professional personnel files, recruitment, and attendance leaves.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-none gap-1 text-[10px] font-bold uppercase tracking-wider self-start border border-slate-200">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'employees' ? 'bg-white text-teal-700 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Staff Directory</span>
          </button>
          
          <button
            onClick={() => setActiveTab('leave')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'leave' ? 'bg-white text-teal-700 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Leaves</span>
          </button>

          <button
            onClick={() => setActiveTab('appraisal')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'appraisal' ? 'bg-white text-teal-700 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Appraisal</span>
          </button>

          <button
            onClick={() => setActiveTab('recruitment')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'recruitment' ? 'bg-white text-teal-700 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><UserPlus className="w-3.5 h-3.5" /> Recruitment</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: DIRECTORY */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Add Employee Form (Authorized Roles) */}
              {['Super Admin', 'HR'].includes(currentUserRole) ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                    <UserPlus className="w-3.5 h-3.5 text-teal-650" /> Onboard Academic/Office Staff
                  </h3>
                  <form onSubmit={handleCreateEmployee} className="space-y-3">
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Prof. Minerva McGonagall"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="minerva.m@edu.org"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Role Type</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as Role)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      >
                        <option value="Teacher & Professor">Teacher & Professor</option>
                        <option value="HOD">HOD (Head of Department)</option>
                        <option value="HR">HR Officer</option>
                        <option value="Clerk & Executive">Clerk & Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Department</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Humanities & Art">Humanities & Art</option>
                        <option value="Administration">Administration</option>
                        <option value="Human Resources">Human Resources Bureau</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Monthly Base Salary ($)</label>
                      <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs font-mono focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-2"
                    >
                      Onboard Employee File
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs text-slate-600 text-center flex flex-col justify-center">
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[9px] mb-2">Staff Profile Information</p>
                  <p className="mb-2">Your system role is set to <strong>{currentUserRole}</strong>.</p>
                  <p>You may view the general institutional staff roster and individual indices. Personnel editing is exclusive to superuser accounts.</p>
                </div>
              )}

              {/* Roster list */}
              <div className="flex-1 overflow-x-auto border border-slate-200 rounded-none">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                    <tr>
                      <th className="p-3.5">Staff Member</th>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">Assigned Role</th>
                      <th className="p-3.5">Attendance</th>
                      <th className="p-3.5">Monthly Pay</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{emp.name}</p>
                          <p className="text-[10px] text-slate-450 font-mono mt-0.5">{emp.email}</p>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-600">{emp.department}</td>
                        <td className="p-3.5">
                          <span className="bg-teal-50 text-teal-705 px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border border-teal-200">
                            {emp.role}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-indigo-700">{emp.attendanceRate}%</td>
                        <td className="p-3.5 font-mono text-slate-800 font-semibold">${emp.salary}/mo</td>
                        <td className="p-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                            emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEAVE REQUESTS */}
        {activeTab === 'leave' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-display">Staff Leave Requests</h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Approve or audit professional vacancy applications.</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-none overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                  <tr>
                    <th className="p-3.5">Applicant Name</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Leave Type</th>
                    <th className="p-3.5">Duration (Dates)</th>
                    <th className="p-3.5">Reason Given</th>
                    <th className="p-3.5">Status</th>
                    {canApproveLeave && <th className="p-3.5 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="p-3.5 font-bold text-slate-950">{req.employeeName}</td>
                      <td className="p-3.5 font-semibold text-slate-600">{req.department}</td>
                      <td className="p-3.5 font-extrabold text-teal-800 text-[9px] uppercase tracking-wider">{req.type}</td>
                      <td className="p-3.5">
                        <span className="font-mono bg-slate-105 border border-slate-200 px-1.5 py-0.5 rounded-none text-[9px] text-slate-600 font-bold">
                          {req.startDate} to {req.endDate}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 max-w-xs overflow-hidden text-ellipsis">{req.reason}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                          req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                          req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      {canApproveLeave && (
                        <td className="p-3.5 text-right">
                          {req.status === 'Pending' ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  onUpdateLeaveStatus(req.id, 'Approved');
                                  onLogAction('Approve Leave', 'HR Management', `Approved leave of absence for ${req.employeeName}`);
                                }}
                                className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-none p-1 hover:bg-emerald-100 transition cursor-pointer"
                                title="Approve Request"
                              >
                                <Check className="w-3.5 h-3.5 font-black" />
                              </button>
                              <button
                                onClick={() => {
                                  onUpdateLeaveStatus(req.id, 'Rejected');
                                  onLogAction('Reject Leave', 'HR Management', `Rejected leave of absence for ${req.employeeName}`);
                                }}
                                className="bg-red-50 border border-red-200 text-red-700 rounded-none p-1 hover:bg-red-100 transition cursor-pointer"
                                title="Reject Request"
                              >
                                <X className="w-3.5 h-3.5 font-black" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-405 font-bold uppercase tracking-wider">Completed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: APPRAISALS */}
        {activeTab === 'appraisal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-none border border-slate-200 text-xs">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3 flex items-center gap-1 uppercase tracking-wider font-display text-[10px]">
                  <Award className="w-4 h-4 text-indigo-600" /> Peer Appraisal & Goal Cycles
                </h4>
                <p className="text-slate-500 leading-relaxed mb-4">
                  Official evaluation protocols are enabled. Heads of Department (HODs) have permissions to write performance scorecard indices for faculty staff files.
                </p>
                <div className="bg-white p-4 rounded-none border border-slate-250 space-y-3 shadow-none">
                  <div className="flex justify-between font-bold">
                    <span className="uppercase text-[9px] tracking-wider text-slate-505">Performance Appraisal Benchmark:</span>
                    <span className="font-mono text-indigo-700">85%+ Score</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-100 pt-2">
                    <span className="uppercase text-[9px] tracking-wider text-slate-505">Current Active Appraisees:</span>
                    <span className="text-slate-900">7 Full-time Faculty</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-100 pt-2">
                    <span className="uppercase text-[9px] tracking-wider text-slate-505">Outstanding Bureau Submissions:</span>
                    <span className="text-teal-700 uppercase tracking-wide text-[9px]">Completed (100%)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-display">Faculty Appraisal Scores</h3>
                
                <div className="space-y-3.5">
                  {employees.filter(e => e.role === 'Teacher & Professor').map(emp => (
                    <div key={emp.id} className="bg-white p-4 rounded-none border border-slate-200 text-xs shadow-none">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-900 uppercase tracking-wide">{emp.name}</span>
                        <span className="font-mono font-bold text-indigo-600">{emp.performanceScore}/100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-none overflow-hidden mt-1.5">
                        <div
                          className="bg-teal-600 h-full rounded-none"
                          style={{ width: `${emp.performanceScore}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">Excellent teaching metrics and high student satisfaction indices.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RECRUITMENT */}
        {activeTab === 'recruitment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs text-slate-700">
              {/* Job posting creation */}
              <div className="bg-slate-50 p-5 rounded-none border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2"><UserPlus className="w-3.5 h-3.5 text-teal-600" /> post New Career Listing</h4>
                <form onSubmit={handleAddJobPosting} className="space-y-3.5">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Functional Job Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Researcher in Applied Physics"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-650"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Academic Department</label>
                    <select
                      value={newJobDept}
                      onChange={(e) => setNewJobDept(e.target.value)}
                      className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Humanities & Art">Humanities & Art</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-2"
                  >
                    Publish Career Listing File
                  </button>
                </form>

                <h4 className="font-bold text-slate-900 mt-6 mb-4 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2">Active Job Vacancies ({jobPostings.length})</h4>
                <div className="space-y-2.5">
                  {jobPostings.map((job) => (
                    <div key={job.id} className="p-3.5 bg-white rounded-none border border-slate-200 shadow-none">
                      <div className="flex justify-between font-bold text-slate-900 text-xs">
                        <span>{job.title}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-450 mt-1 uppercase font-bold tracking-wider">
                        <span>Dept: {job.department}</span>
                        <span className="text-teal-600">{job.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applicant tracking pipeline */}
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2"><TrendingUp className="w-3.5 h-3.5 text-teal-605" /> Candidate Pipeline Tracker</h4>
                <div className="bg-white rounded-none border border-slate-200 overflow-hidden shadow-none">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                      <tr>
                        <th className="p-3.5">Candidate</th>
                        <th className="p-3.5">Target Role</th>
                        <th className="p-3.5">Onboarding Stage</th>
                        <th className="p-3.5 text-right">Assessment Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {applicantTrack.map((ap) => (
                        <tr key={ap.id}>
                          <td className="p-3.5 font-bold text-slate-900">{ap.name}</td>
                          <td className="p-3.5 text-slate-500 font-medium">{ap.job}</td>
                          <td className="p-3.5">
                            <span className="inline-flex px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider bg-slate-50 border border-slate-250 text-slate-700">
                              {ap.stage}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-mono font-bold text-teal-700">{ap.score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50 rounded-none border border-slate-250 text-[11px] leading-relaxed text-slate-600">
                  <strong className="text-slate-900 font-semibold uppercase tracking-wider text-[8px] block mb-1">Compliance Directive:</strong> Background records and teaching credential verification checklist meets MOE Chapter 10 guidelines for recruitment audits.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
