/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Applicant, Department, Role } from '../types';
import { FilePlus, Search, UserCheck, Check, X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface AdmissionsPanelProps {
  currentUserRole: Role;
  applicants: Applicant[];
  departments: Department[];
  onAddApplicant: (ap: Omit<Applicant, 'id' | 'dateSubmitted' | 'status'>) => void;
  onUpdateApplicantStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  onEnrollApplicant: (applicantId: string) => void; // Converts Applicant into a Student profile
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function AdmissionsPanel({
  currentUserRole,
  applicants,
  departments,
  onAddApplicant,
  onUpdateApplicantStatus,
  onEnrollApplicant,
  onLogAction,
}: AdmissionsPanelProps) {
  const [activeTab, setActiveTab] = useState<'applicants' | 'capacity'>('applicants');

  // Submit Application Form State
  const [appName, setAppName] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appDeptId, setAppDeptId] = useState('d1');
  const [appScore, setAppScore] = useState(85);
  const [appCourse, setAppCourse] = useState('CS101');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const offersEditRight = ['Super Admin', 'Clerk & Executive', 'HOD'].includes(currentUserRole);
  const hasViewAccess = ['Super Admin', 'CEO & Director', 'Clerk & Executive', 'HOD'].includes(currentUserRole);

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !appEmail) return;

    onAddApplicant({
      name: appName,
      email: appEmail,
      departmentId: appDeptId,
      score: appScore,
      courseSelected: appCourse,
    });

    onLogAction(
      'Admission Application Received',
      'Admissions',
      `Candidate application submitted: ${appName} (${appEmail}) for screening`
    );

    alert('Application submitted successfully to registrar queue!');
    setAppName('');
    setAppEmail('');
  };

  if (!hasViewAccess && currentUserRole !== 'Student') {
    return (
      <div className="bg-white rounded-none p-8 border border-slate-200 text-center animate-fade-in shadow-none">
        <UserCheck className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Access Restricted</h2>
        <p className="text-slate-550 mt-2 text-xs">
          Admission files are core administrative documents. Please select an authorized role like Clerk, HOD, or CEO to evaluate portfolios.
        </p>
      </div>
    );
  }

  const filteredApplicants = applicants.filter(
    (ap) =>
      ap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ap.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in text-xs text-slate-705">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <UserCheck className="w-4 h-4 text-indigo-650 shrink-0" />
            Admissions & Student Intake Bureau
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Conduct academic screenings, review transcript files, and trigger automated campus enrollments.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-none gap-1 text-[10px] font-bold uppercase tracking-wider self-start border border-slate-200">
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'applicants' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> Applicant Tracking</span>
          </button>
          
          <button
            onClick={() => setActiveTab('capacity')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'capacity' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Capacity Caps</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Form representing either candidate application OR administrative intake */}
              <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                  <FilePlus className="w-3.5 h-3.5 text-indigo-600" /> Lodge Candidate Dossier
                </h3>
                <form onSubmit={handleApplicationSubmit} className="space-y-3 font-sans">
                  <div>
                    <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Applicant Name</label>
                    <input
                      type="text"
                      required
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      placeholder="Luna Lovegood"
                      className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={appEmail}
                      onChange={(e) => setAppEmail(e.target.value)}
                      placeholder="luna@hogwarts.edu"
                      className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Target Division</label>
                    <select
                      value={appDeptId}
                      onChange={(e) => setAppDeptId(e.target.value)}
                      className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                    >
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Course Choice</label>
                    <input
                      type="text"
                      placeholder="CS101"
                      value={appCourse}
                      onChange={(e) => setAppCourse(e.target.value)}
                      className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Screening score (%)</label>
                    <input
                      type="number"
                      value={appScore}
                      onChange={(e) => setAppScore(Number(e.target.value))}
                      className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-1"
                  >
                    Register Applicant File
                  </button>
                </form>
              </div>

              {/* Roster of Applicants */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center border border-slate-200 rounded-none px-3 py-2 bg-white">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Filter entry pipeline by candidate names, departments, scores..."
                    className="w-full focus:outline-none text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-none text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                      <tr>
                        <th className="p-3.5">Portfolio</th>
                        <th className="p-3.5">Target Division</th>
                        <th className="p-3.5">Credits Choice</th>
                        <th className="p-3.5">Screening Score</th>
                        <th className="p-3.5">MoE Compliance</th>
                        <th className="p-3.5">Status</th>
                        {offersEditRight && <th className="p-3.5 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-705">
                      {filteredApplicants.map((ap) => {
                        const dept = departments.find((d) => d.id === ap.departmentId);
                        const isQualifying = ap.score >= 70;
                        return (
                          <tr key={ap.id} className="hover:bg-slate-50/50 transition duration-150">
                            <td className="p-3.5">
                              <p className="font-bold text-slate-900">{ap.name}</p>
                              <p className="text-[10px] text-slate-450 font-mono mt-0.5">{ap.email}</p>
                            </td>
                            <td className="p-3.5 font-semibold text-slate-600">{dept?.name || 'N/A'}</td>
                            <td className="p-3.5">
                              <span className="font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-none text-[9px] text-indigo-705 font-bold uppercase tracking-wider">
                                {ap.courseSelected || 'CS101'}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono font-bold text-indigo-700">{ap.score}%</td>
                            <td className="p-3.5 font-bold">
                              {isQualifying ? (
                                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-0.5 rounded-none text-[8.5px] uppercase tracking-wider">Passes</span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-none text-[8.5px] uppercase tracking-wider">
                                  <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" /> Fails
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className={`inline-flex px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                                ap.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                ap.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {ap.status}
                              </span>
                            </td>
                            {offersEditRight && (
                              <td className="p-3.5 text-right">
                                {ap.status === 'Pending' ? (
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        onUpdateApplicantStatus(ap.id, 'Approved');
                                        onLogAction('Approve Admission', 'Admissions', `Approved admission for applicant ${ap.name}`);
                                      }}
                                      className="bg-emerald-50 border border-emerald-250 text-emerald-700 rounded-none p-1 hover:bg-emerald-105 transition cursor-pointer"
                                      title="Approve Candidate"
                                    >
                                      <Check className="w-3.5 h-3.5 font-black" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        onUpdateApplicantStatus(ap.id, 'Rejected');
                                        onLogAction('Reject Admission', 'Admissions', `Rejected admission for applicant ${ap.name}`);
                                      }}
                                      className="bg-red-50 border border-red-250 text-red-700 rounded-none p-1 hover:bg-red-105 transition cursor-pointer"
                                      title="Reject Candidate"
                                    >
                                      <X className="w-3.5 h-3.5 font-black" />
                                    </button>
                                  </div>
                                ) : ap.status === 'Approved' ? (
                                  <button
                                    onClick={() => {
                                      onEnrollApplicant(ap.id);
                                    }}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3 py-1.5 rounded-none text-[8.5px] tracking-widest uppercase transition cursor-pointer"
                                  >
                                    Process Matriculation Card
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Archived</span>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Intakes Capacity metrics */}
        {activeTab === 'capacity' && (
          <div className="space-y-6 animate-fade-in font-sans">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-display">Capacity Intake Schedules (MoE Compliance directives)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-none border border-slate-200 text-slate-700 space-y-4">
                <h4 className="font-bold flex items-center gap-1.5 text-slate-900 uppercase tracking-wider text-[10px] pb-2 border-b border-slate-200"><AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse shrink-0" /> MoE Caps Limits Notifications</h4>
                <p className="leading-relaxed text-slate-550 text-[11px] font-medium">
                  Under MOE statutory regulatory circulars, no individual department can exceed a <strong>15:1 Student-to-Faculty ratio</strong>. Over-enrollment leads to non-compliant indicator flags in audits.
                </p>
                <div className="bg-white p-4 rounded-none border border-slate-200 text-xs text-slate-705 space-y-2 font-bold shadow-none">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="uppercase text-[8.5px] tracking-wide text-slate-400">Active Campus Enrolled:</span>
                    <span className="font-mono text-indigo-700">415 Students</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="uppercase text-[8.5px] tracking-wide text-slate-400">Approved Academic Faculty:</span>
                    <span className="font-mono text-indigo-700">28 Instructors</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase text-[8.5px] tracking-wide text-slate-400">Institutional Ratio:</span>
                    <span className="text-emerald-700 uppercase tracking-wider text-[9px]">14.8 : 1 (State Compliant)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2">Institutional Intake Periods</h4>
                <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-none border border-slate-200 space-y-1 hover:border-slate-400 transition shadow-none cursor-default">
                    <div className="flex justify-between font-bold text-slate-900 border-b border-slate-100 pb-1">
                      <span className="uppercase tracking-wide">Fall Semester 2026</span>
                      <span className="text-[8.5px] bg-emerald-50 text-emerald-700 font-extrabold uppercase tracking-wider border border-emerald-200 px-2 py-0.5 rounded-none">Active Enrollment Open</span>
                    </div>
                    <p className="text-slate-500 text-[10px] font-medium mt-1">Deadline: September 15, 2026. Target limit: 120 Students maximum.</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-none border border-slate-200 space-y-1 hover:border-slate-400 transition shadow-none cursor-default">
                    <div className="flex justify-between font-bold text-slate-900 border-b border-slate-100 pb-1">
                      <span className="uppercase tracking-wide">Spring Semester 2027</span>
                      <span className="text-[8.5px] bg-indigo-50 text-indigo-700 font-extrabold uppercase tracking-wider border border-indigo-200 px-2 py-0.5 rounded-none">Planning Stage</span>
                    </div>
                    <p className="text-slate-500 text-[10px] font-medium mt-1">Form templates configuration completes on November 01, 2026.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
