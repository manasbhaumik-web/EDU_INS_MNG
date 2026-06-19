/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Course, Department, Session, Role } from '../types';
import { BookOpen, Table, PlusCircle, Network, FileText, Calendar } from 'lucide-react';

interface AcademicsPanelProps {
  currentUserRole: Role;
  courses: Course[];
  departments: Department[];
  sessions: Session[];
  onAddCourse: (course: Omit<Course, 'id' | 'resources'>) => void;
  onAddDepartment: (dept: Omit<Department, 'id' | 'facultyCount' | 'studentCount' | 'spent' | 'policyDocs'>) => void;
  onAddSession: (session: Omit<Session, 'id'>) => void;
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function AcademicsPanel({
  currentUserRole,
  courses,
  departments,
  sessions,
  onAddCourse,
  onAddDepartment,
  onAddSession,
  onLogAction,
}: AcademicsPanelProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'departments' | 'schedule'>('courses');

  // Course form state
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseDept, setCourseDept] = useState('d1');
  const [courseCredits, setCourseCredits] = useState(4);
  const [courseSyllabus, setCourseSyllabus] = useState('');

  // Department form state
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHod, setDeptHod] = useState('');
  const [deptBudget, setDeptBudget] = useState(100000);

  // Session form state
  const [sessCourseId, setSessCourseId] = useState('c1');
  const [sessInstructor, setSessInstructor] = useState('Prof. Charles Xavier');
  const [sessDatetime, setSessDatetime] = useState('Mon, Wed 10:30 - 12:00');
  const [sessRoom, setSessRoom] = useState('Lecture Hall 102A');
  const [sessLink, setSessLink] = useState('https://meet.google.com/abc-defg-hij');

  const offersEditRight = ['Super Admin', 'HOD', 'Teacher & Professor'].includes(currentUserRole);

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseName) return;

    onAddCourse({
      code: courseCode,
      name: courseName,
      departmentId: courseDept,
      credits: courseCredits,
      syllabus: courseSyllabus || undefined,
    });

    onLogAction(
      'Publish Course',
      'Academics',
      `Created syllabus and published course ${courseCode}: ${courseName}`
    );

    setCourseCode('');
    setCourseName('');
    setCourseSyllabus('');
  };

  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode || !deptHod) return;

    onAddDepartment({
      name: deptName,
      code: deptCode,
      hodName: deptHod,
      budget: deptBudget,
    });

    onLogAction(
      'Provision Department',
      'Academics',
      `Established academic division for ${deptName} (${deptCode}) led by HOD ${deptHod}`
    );

    setDeptName('');
    setDeptCode('');
    setDeptHod('');
  };

  const handleAddSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const course = courses.find(c => c.id === sessCourseId);
    if (!course) return;

    onAddSession({
      courseId: sessCourseId,
      courseName: course.name,
      instructor: sessInstructor,
      datetime: sessDatetime,
      room: sessRoom,
      virtualLink: sessLink || undefined,
    });

    onLogAction(
      'Schedule Session',
      'Academics',
      `Scheduled academic timetable session: ${course.name} under instruction of ${sessInstructor}`
    );

    setSessDatetime('Mon, Wed 10:30 - 12:00');
    setSessRoom('Lecture Hall 102A');
  };

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in text-xs text-slate-705">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <BookOpen className="w-4 h-4 text-indigo-650 shrink-0" />
            Academics & Program Syllabus Management
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Formulate state-approved syllabi, establish departmental divisions, and optimize dynamic timetabling logs.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-none gap-1 text-[10px] font-bold uppercase tracking-wider self-start border border-slate-200">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'courses' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Catalog</span>
          </button>
          
          <button
            onClick={() => setActiveTab('departments')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'departments' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Network className="w-3.5 h-3.5" /> Divisions</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'schedule' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Table className="w-3.5 h-3.5" /> Timetabling</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: COURSE CATALOG */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Create Course (Authorized Roles) */}
              {offersEditRight ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Provision Course
                  </h3>
                  <form onSubmit={handleAddCourseSubmit} className="space-y-3">
                    <div>
                      <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Course Code (CS202)</label>
                      <input
                        type="text"
                        required
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        placeholder="CS202"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Course Title</label>
                      <input
                        type="text"
                        required
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Advanced Machine Learning"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Division Department</label>
                      <select
                        value={courseDept}
                        onChange={(e) => setCourseDept(e.target.value)}
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
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Credits allocation</label>
                      <input
                        type="number"
                        value={courseCredits}
                        onChange={(e) => setCourseCredits(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs font-mono focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Syllabus Overview</label>
                      <textarea
                        value={courseSyllabus}
                        onChange={(e) => setCourseSyllabus(e.target.value)}
                        placeholder="Topics include deep neural architecture, convolutional networks, and gradient optimization..."
                        rows={3}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-1"
                    >
                      Publish Course Index
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 border border-slate-200 rounded-none text-slate-500 leading-relaxed text-center flex flex-col justify-center">
                  <p className="font-extrabold text-slate-900 uppercase tracking-wider text-[9px] mb-2 font-display">Syllabus Path Portal</p>
                  <p>In student mode, you have access to download high-resolution syllabus briefs and verify allocated resources.</p>
                </div>
              )}

              {/* Course Catalog List */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((course) => {
                    return (
                      <div key={course.id} className="bg-white p-4 rounded-none border border-slate-200 shadow-none hover:border-slate-400 transition duration-150 relative flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1 border-b border-slate-100 pb-1.5">
                            <span className="font-mono font-bold text-indigo-705 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-none text-[9px] tracking-wide uppercase">
                              {course.code}
                            </span>
                            <span className="text-[8.5px] bg-slate-900 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-none">
                              {course.credits} Credits
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-[12px] uppercase tracking-wide leading-tight mt-1">{course.name}</h4>
                          <p className="text-slate-450 mt-1.5 leading-relaxed text-[11px] font-medium">
                            {course.syllabus || 'No syllabus overview provided. Please request resource details.'}
                          </p>
                        </div>
                        
                        <div className="border-t border-slate-100 pt-3 mt-4">
                          <p className="text-[8px] text-slate-400 font-extrabold mb-1.5 uppercase tracking-widest">E-resources / documents</p>
                          <div className="flex flex-wrap gap-1">
                            {course.resources && course.resources.length > 0 ? (
                              course.resources.map((res, i) => (
                                <a
                                  key={i}
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    alert(`Beginning secure download of course document: ${res}`);
                                  }}
                                  className="inline-flex items-center gap-1 text-[8.5px] bg-slate-50 hover:bg-slate-100 text-slate-750 border border-slate-200 py-1 px-2.5 rounded-none transition font-extrabold uppercase tracking-wider cursor-pointer"
                                >
                                  <FileText className="w-3 h-3" /> {res}
                                </a>
                              ))
                            ) : (
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">No resources uploaded yet.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Create Department Form (Locked to Admin) */}
              {currentUserRole === 'Super Admin' ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                    <Network className="w-3.5 h-3.5 text-indigo-600" /> Establish Department Division
                  </h3>
                  <form onSubmit={handleAddDeptSubmit} className="space-y-3 font-sans">
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Division Title name</label>
                      <input
                        type="text"
                        required
                        value={deptName}
                        onChange={(e) => setDeptName(e.target.value)}
                        placeholder="Applied Chemistry"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Code letters (CHEM)</label>
                      <input
                        type="text"
                        required
                        value={deptCode}
                        onChange={(e) => setDeptCode(e.target.value)}
                        placeholder="CHEM"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">HOD Appointment</label>
                      <input
                        type="text"
                        required
                        value={deptHod}
                        onChange={(e) => setDeptHod(e.target.value)}
                        placeholder="Prof. Albert Einstein"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Division Budget Allocation ($)</label>
                      <input
                        type="number"
                        value={deptBudget}
                        onChange={(e) => setDeptBudget(Number(e.target.value))}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-1"
                    >
                      Establish Division Ledger
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs text-slate-500 leading-relaxed text-center flex flex-col justify-center">
                  <p className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[9px] font-display">HOD Office Insights</p>
                  <p>To alter structural assets, write a detailed procurement request or consult the campus executive council.</p>
                </div>
              )}

              {/* Department Table List */}
              <div className="flex-1 overflow-x-auto border border-slate-200 rounded-none">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                    <tr>
                      <th className="p-3.5">Department</th>
                      <th className="p-3.5">HOD Head</th>
                      <th className="p-3.5">Faculty Size</th>
                      <th className="p-3.5">Student Enrolled</th>
                      <th className="p-3.5">Budget Allocations</th>
                      <th className="p-3.5">Policy Docs File</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-705">
                    {departments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{dept.name}</span>
                            <span className="text-[8.5px] bg-indigo-50 border border-indigo-150 text-indigo-700 px-1.5 py-0.5 rounded-none font-mono font-bold uppercase">{dept.code}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">{dept.hodName}</td>
                        <td className="p-3.5 font-mono font-bold text-indigo-600 text-[10px]">{dept.facultyCount} Professors</td>
                        <td className="p-3.5 font-mono font-bold text-slate-800 text-[10px]">{dept.studentCount} Majors</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">${dept.budget.toLocaleString()}</td>
                        <td className="p-3.5">
                          <div className="flex flex-col gap-1 text-[9px] font-bold uppercase tracking-wider">
                            {dept.policyDocs.map((doc, idx) => (
                              <span
                                key={idx}
                                onClick={() => alert(`Reviewing MOE policy file: ${doc}`)}
                                className="cursor-pointer hover:text-indigo-600 flex items-center gap-1 hover:underline"
                              >
                                📄 {doc}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIMETABLE & SESSIONS */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Create Session Form */}
              {offersEditRight ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> Timetabling / Room lock
                  </h3>
                  <form onSubmit={handleAddSessionSubmit} className="space-y-3 font-sans">
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Target Course Program</label>
                      <select
                        value={sessCourseId}
                        onChange={(e) => setSessCourseId(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Instructor Appointment</label>
                      <input
                        type="text"
                        required
                        value={sessInstructor}
                        onChange={(e) => setSessInstructor(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Time Slot Slot (Mon, Wed 14:00)</label>
                      <input
                        type="text"
                        required
                        value={sessDatetime}
                        onChange={(e) => setSessDatetime(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Physical Room Location</label>
                      <input
                        type="text"
                        required
                        value={sessRoom}
                        onChange={(e) => setSessRoom(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-550 font-bold uppercase tracking-wider text-[8px] mb-1">Virtual Link</label>
                      <input
                        type="url"
                        value={sessLink}
                        onChange={(e) => setSessLink(e.target.value)}
                        placeholder="https://meet.google.com/xyz"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-1"
                    >
                      Schedule Active Session
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs text-slate-600 leading-relaxed text-center flex flex-col justify-center">
                  <p className="font-bold text-slate-900 mb-1 uppercase tracking-wider text-[9px] font-display">Student Timetabling</p>
                  <p>You can find virtual classroom session links for courses in your calendar. Meet links launch secure web tabs authorized with your credential.</p>
                </div>
              )}

              {/* Sessions Schedule list */}
              <div className="flex-1 space-y-4">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2">Active Timetable Sessions</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="bg-white border border-slate-200 rounded-none p-4 transition shadow-none flex flex-col justify-between hover:border-slate-400">
                      <div>
                        <div className="flex items-center justify-between mb-1 border-b border-slate-100 pb-2">
                          <span className="font-bold text-indigo-700 uppercase tracking-wide text-xs">{sess.courseName}</span>
                          <span className="text-[8.5px] bg-slate-900 border border-slate-955 text-white px-2 py-0.5 rounded-none font-mono font-bold uppercase tracking-wider">
                            Room {sess.room}
                          </span>
                        </div>
                        <p className="text-slate-500 font-semibold mt-1">Instructor: <span className="text-slate-800">{sess.instructor}</span></p>
                        <p className="text-slate-800 font-mono font-bold mt-2 text-[10px]">🗓️ {sess.datetime}</p>
                      </div>

                      <div className="mt-4 border-t border-slate-100 pt-3">
                        {sess.virtualLink ? (
                          <a
                            href={sess.virtualLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[8.5px] bg-slate-50 hover:bg-slate-100 text-slate-750 border border-slate-200 py-1.5 px-3.5 rounded-none font-extrabold transition uppercase tracking-wider"
                          >
                            💻 Connect virtual Lecture
                          </a>
                        ) : (
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">In-person attendance only.</span>
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
