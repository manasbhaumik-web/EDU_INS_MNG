/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudentProfile, Department, Role } from '../types';
import { Users, GraduationCap, Calendar, ShieldAlert, Award, Search, PlusCircle, Check } from 'lucide-react';

interface StudentsPanelProps {
  currentUserRole: Role;
  students: StudentProfile[];
  departments: Department[];
  onAddStudent: (stud: Omit<StudentProfile, 'id'>) => void;
  onUpdateAttendance: (id: string, newRate: number) => void;
  onAddDisciplineRecord: (id: string, record: string) => void;
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function StudentsPanel({
  currentUserRole,
  students,
  departments,
  onAddStudent,
  onUpdateAttendance,
  onAddDisciplineRecord,
  onLogAction,
}: StudentsPanelProps) {
  const [activeTab, setActiveTab] = useState<'profiles' | 'attendance' | 'discipline'>('profiles');
  const [searchQuery, setSearchQuery] = useState('');

  // Student profile form state
  const [studName, setStudName] = useState('');
  const [studEmail, setStudEmail] = useState('');
  const [studDeptId, setStudDeptId] = useState('d1');
  const [studGpa, setStudGpa] = useState(3.5);
  const [studGuardianName, setStudGuardianName] = useState('');
  const [studGuardianContact, setStudGuardianContact] = useState('');
  const [studClub, setStudClub] = useState('');

  // Disciplinary submission State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [disciplineIncident, setDisciplineIncident] = useState('');

  const isTeacher = currentUserRole === 'Teacher & Professor';
  const offersEditRight = ['Super Admin', 'Clerk & Executive', 'HOD'].includes(currentUserRole);
  const hasFullAccess = ['Super Admin', 'HOD', 'Clerk & Executive', 'Teacher & Professor', 'CEO & Director'].includes(currentUserRole);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studName || !studEmail) return;

    onAddStudent({
      name: studName,
      email: studEmail,
      departmentId: studDeptId,
      enrollmentHistory: [],
      gpa: studGpa,
      attendancePercent: 95.0,
      guardianName: studGuardianName || 'N/A',
      guardianContact: studGuardianContact || 'N/A',
      disciplinaryRecords: [],
      clubs: studClub ? [studClub] : [],
    });

    onLogAction(
      'Manual Student Matriculation',
      'Student Profiles',
      `Direct administrative registration of student ${studName} (${studEmail}) under department ${studDeptId}`
    );

    setStudName('');
    setStudEmail('');
    setStudGuardianName('');
    setStudGuardianContact('');
    setStudClub('');
    alert('Student profile compiled and authorized!');
  };

  const handleDisciplineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !disciplineIncident) return;

    onAddDisciplineRecord(selectedStudentId, disciplineIncident);
    const matchedName = students.find(s => s.id === selectedStudentId)?.name || 'Unknown';
    onLogAction(
      'Register disciplinary incident',
      'Student Profiles',
      `Incident recorded against student ${matchedName}: ${disciplineIncident}`
    );

    setDisciplineIncident('');
    alert('Security and disciplinary ledger updated.');
  };

  if (currentUserRole === 'Student') {
    // Student checking their own single profile
    const myProfile = students.find((s) => s.email === 'john.s@edu.org') || students[0];
    return (
      <div className="bg-white rounded-none border border-slate-200 p-6 space-y-6 animate-fade-in shadow-none text-xs text-slate-705">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <GraduationCap className="w-4 h-4 text-indigo-650 shrink-0" />
            My Academic Study Portfolio
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Official Skyline International student portal record sheets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-5 rounded-none border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-205 pb-2 flex items-center gap-1 uppercase tracking-wider text-[9px] font-display">
              👤 Personal Portfolio details
            </h3>
            <div className="space-y-1.5 font-bold text-slate-705">
              <p>Name: <span className="font-extrabold text-slate-900">{myProfile.name}</span></p>
              <p>Student Index ID: <span className="font-mono text-indigo-700">{myProfile.id}</span></p>
              <p>Portal Email: <span className="text-slate-600 font-normal">{myProfile.email}</span></p>
              <p>Department Major: <span className="font-extrabold text-slate-900">
                {departments.find((d) => d.id === myProfile.departmentId)?.name || 'Computer Science'}
              </span></p>
            </div>
            
            <h3 className="font-bold text-slate-800 border-b border-slate-200 pt-2 pb-2 uppercase tracking-wider text-[9px] font-display">Emergency Contact/Guardian</h3>
            <div className="space-y-1.5 font-bold">
              <p>Guardian: <span className="text-slate-900">{myProfile.guardianName}</span></p>
              <p>Direct Phone: <span className="font-mono text-slate-500 font-normal">{myProfile.guardianContact}</span></p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-none border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-205 pb-2 flex items-center gap-1 uppercase tracking-wider text-[9px] font-display">
              <Award className="w-4 h-4 text-indigo-600" /> Academic Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 text-center border border-slate-200 rounded-none">
                <p className="text-[8px] text-slate-450 font-extrabold uppercase tracking-widest">Cumulative GPA</p>
                <p className="text-xl font-light text-slate-900 font-display mt-2">{myProfile.gpa.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-50 text-center border border-slate-200 rounded-none">
                <p className="text-[8px] text-slate-450 font-extrabold uppercase tracking-widest">Attendance</p>
                <p className="text-xl font-bold text-indigo-650 font-display mt-2">{myProfile.attendancePercent}%</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="font-bold text-slate-850 mb-1.5 uppercase text-[8.5px] tracking-wider font-display border-b border-slate-100 pb-1">Assigned Clubs & Guilds</p>
              <div className="flex flex-wrap gap-1">
                {myProfile.clubs.map((club, i) => (
                  <span key={i} className="bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border border-purple-200">
                    {club}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-none border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-205 pb-2 uppercase tracking-wider text-[9px] font-display">Enrollment Syllabus History</h3>
            <div className="space-y-2">
              {myProfile.enrollmentHistory.map((hist, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-none text-[10px]">
                  <span className="font-mono font-bold text-indigo-700">{hist.courseId}</span>
                  <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">{hist.semester}</span>
                  <span className="font-extrabold text-emerald-700 uppercase text-[8.5px] tracking-wider">{hist.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin and Staff view
  if (!hasFullAccess) {
    return (
      <div className="bg-white rounded-none p-8 border border-slate-200 text-center animate-fade-in shadow-none">
        <GraduationCap className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Access Restricted</h2>
        <p className="text-slate-550 mt-2 text-xs">
          Student personal portfolios are protected under federal informational security frameworks. Select a Teacher, HOD, Clerk or Director role to manage catalog tables.
        </p>
      </div>
    );
  }

  const filteredStudents = students.filter(
    (st) =>
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in text-xs text-slate-705">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
            Student Academic Portfolios & Attendance
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Coordinate student records, mark daily attendance metrics, and audit behavioral files.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-none gap-1 text-[10px] font-bold uppercase tracking-wider self-start border border-slate-200">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'profiles' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Student Profiles</span>
          </button>
          
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'attendance' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Attendance Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('discipline')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'discipline' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Discipline</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: PROFILES */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Form to insert student manually (Only Admin and Clerk) */}
              {offersEditRight ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-600" /> Matriculate Student File
                  </h3>
                  <form onSubmit={handleCreateStudent} className="space-y-3 font-sans">
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Full Student Name</label>
                      <input
                        type="text"
                        required
                        value={studName}
                        onChange={(e) => setStudName(e.target.value)}
                        placeholder="Arthur Dent"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Portal Login Email</label>
                      <input
                        type="email"
                        required
                        value={studEmail}
                        onChange={(e) => setStudEmail(e.target.value)}
                        placeholder="arthur.d@edu.org"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-655"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Department Major</label>
                      <select
                        value={studDeptId}
                        onChange={(e) => setStudDeptId(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">GPA (0.00 to 4.00)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={studGpa}
                        onChange={(e) => setStudGpa(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Guardian Name</label>
                      <input
                        type="text"
                        value={studGuardianName}
                        onChange={(e) => setStudGuardianName(e.target.value)}
                        placeholder="Ford Prefect"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-655"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Guardian Contact Phone</label>
                      <input
                        type="text"
                        value={studGuardianContact}
                        onChange={(e) => setStudGuardianContact(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Club Guild</label>
                      <input
                        type="text"
                        value={studClub}
                        onChange={(e) => setStudClub(e.target.value)}
                        placeholder="Debate Club"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-655"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-2"
                    >
                      Process Matriculation Card
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs text-slate-600 leading-relaxed text-center flex flex-col justify-center">
                  <p className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[9px] font-display">Directory Reader Mode</p>
                  <p>In Instructor/HOD mode, you can inspect student files, GPAs, and guardians. Contact clerks or admins to modify records manually.</p>
                </div>
              )}

              {/* Roster Database */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center border border-slate-200 rounded-none px-3 py-2 bg-white">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search student profiles by ID index or first/last names..."
                    className="w-full focus:outline-none text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-none">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                      <tr>
                        <th className="p-3.5">Student ID</th>
                        <th className="p-3.5">Full Name</th>
                        <th className="p-3.5">Academic Major</th>
                        <th className="p-3.5">Average GPA</th>
                        <th className="p-3.5">Attendance</th>
                        <th className="p-3.5 animate-pulse">Clubs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredStudents.map((st) => {
                        const dept = departments.find((d) => d.id === st.departmentId);
                        const isAtRisk = st.attendancePercent < 75 || st.gpa < 2.5;
                        return (
                          <tr key={st.id} className="hover:bg-slate-50/50 transition duration-150">
                            <td className="p-3.5 font-mono text-[10px] font-bold text-indigo-750">{st.id}</td>
                            <td className="p-3.5">
                              <div>
                                <span className="font-bold text-slate-900">{st.name}</span>
                                {isAtRisk && (
                                  <span className="ml-2 px-1.5 py-0.2 bg-red-50 text-red-700 text-[8px] font-extrabold uppercase tracking-wider border border-red-200">AI Risk Warning</span>
                                )}
                                <p className="text-[10px] text-slate-450 font-mono mt-0.5">{st.email}</p>
                              </div>
                            </td>
                            <td className="p-3.5 font-semibold text-slate-600">{dept?.name || 'Computer Science'}</td>
                            <td className="p-3.5 font-mono font-bold text-slate-900">{st.gpa.toFixed(2)}</td>
                            <td className="p-3.5 font-mono font-semibold text-indigo-650">{st.attendancePercent}%</td>
                            <td className="p-3.5">
                              <div className="flex flex-wrap gap-1 max-w-xxs">
                                {st.clubs.map((c, idx) => (
                                  <span key={idx} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-none text-[8px] font-extrabold uppercase border border-purple-200 tracking-wider">
                                    {c}
                                  </span>
                                ))}
                                {st.clubs.length === 0 && <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">None</span>}
                              </div>
                            </td>
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

        {/* TAB 2: ATTENDANCE TRACKER */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-display">Attendances Marking Ledger</h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Record classroom absences or adjust semester percentages directly below.</p>
              </div>
              {isTeacher && <span className="bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1 font-extrabold text-[8.5px] uppercase tracking-widest rounded-none">Active Session</span>}
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-none">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                  <tr>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Major Code</th>
                    <th className="p-3.5">Attendance Rate</th>
                    <th className="p-3.5 text-center">Status Registration Action</th>
                    <th className="p-3.5 text-right">Emergency Contacts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-705 font-bold">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="p-3.5 font-bold text-slate-900">{st.name}</td>
                      <td className="p-3.5 text-slate-600 uppercase font-mono text-[10px]">{departments.find(d => d.id === st.departmentId)?.code || 'N/A'}</td>
                      <td className="p-3.5 text-[11px] font-mono">
                        <span className={st.attendancePercent < 75 ? 'text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-none font-bold' : 'text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none'}>
                          {st.attendancePercent}%
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              const next = Math.min(100, st.attendancePercent + 1);
                              onUpdateAttendance(st.id, next);
                              onLogAction('Mark Attendance Present', 'Students & Attendance', `Successfully marked present for ${st.name}`);
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[9px] font-extrabold uppercase tracking-wider py-1 px-3.5 rounded-none transition cursor-pointer"
                          >
                            ✓ Present
                          </button>
                          <button
                            onClick={() => {
                              const prev = Math.max(0, st.attendancePercent - 1.5);
                              onUpdateAttendance(st.id, prev);
                              onLogAction('Register Unexplained Absence', 'Students & Attendance', `Broadcasted automatic parental warning: ${st.name} absent`);
                            }}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-[9px] font-extrabold uppercase tracking-wider py-1 px-3.5 rounded-none transition cursor-pointer"
                          >
                            ✗ Absent
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 text-right text-slate-500 font-mono text-[10px]">{st.guardianName} ({st.guardianContact})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DISCIPLINE */}
        {activeTab === 'discipline' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Form to submit Incident */}
              {offersEditRight || isTeacher ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-display border-b border-slate-200 pb-2">
                    <ShieldAlert className="w-4 h-4 text-red-650 animate-pulse shrink-0" /> Register Incident Report
                  </h3>
                  <form onSubmit={handleDisciplineSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Target Student Profile</label>
                      <select
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      >
                        <option value="">-- Choose Student --</option>
                        {students.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name} ({st.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Incident & Action Ledger</label>
                      <textarea
                        required
                        value={disciplineIncident}
                        onChange={(e) => setDisciplineIncident(e.target.value)}
                        placeholder="Misuse of laboratory computing resources or unauthorized leave..."
                        rows={3}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-1"
                    >
                      Commit Incident to Ledger
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs text-slate-550 leading-relaxed text-center flex flex-col justify-center">
                  <p className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[9px] font-display">Administrative Security</p>
                  <p>Incident report log submissions are strictly limited to HOD and administrative team members.</p>
                </div>
              )}

              {/* Roster with Incident charts/lists */}
              <div className="flex-1 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2"><ShieldAlert className="w-4 h-4 text-red-600" /> Active Disciplinary Ledger</h4>
                <div className="space-y-2.5">
                  {students.map((st) => (
                    <div key={st.id} className="p-4 bg-white rounded-none border border-slate-200 flex flex-col justify-between shadow-none">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                        <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wide">{st.name}</span>
                        <span className="font-mono text-[9px] text-slate-400 font-bold">ID: {st.id}</span>
                      </div>
                      
                      <div className="mt-2 text-[11px] space-y-1.5">
                        {st.disciplinaryRecords.length > 0 ? (
                          st.disciplinaryRecords.map((rec, idx) => (
                            <div key={idx} className="p-2.5 bg-red-50 border border-red-200 rounded-none text-red-900 font-mono text-[10px] flex items-start gap-1">
                              <span>⚠️</span> <span>{rec}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-none font-mono text-[9px] font-bold uppercase tracking-wider inline-block">✓ Secure (0 active behavioural records)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
