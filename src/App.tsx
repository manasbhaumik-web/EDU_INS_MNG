/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Role, User, Employee, LeaveRequest, Department, Course, Session, Applicant, StudentProfile, Invoice, Expense, FacilityBooking, LibraryResource, ComplianceCheck, AuditLog } from './types';
import {
  initialUsers,
  initialEmployees,
  initialLeaveRequests,
  initialDepartments,
  initialCourses,
  initialSessions,
  initialApplicants,
  initialStudents,
  initialInvoices,
  initialExpenses,
  initialBookings,
  initialLibraryResources,
  initialComplianceChecks,
  initialAuditLogs
} from './data/mockData';

// Subcomponents
import MegaMenu from './components/MegaMenu';
import AdminPanel from './components/AdminPanel';
import HRPanel from './components/HRPanel';
import FinancePanel from './components/FinancePanel';
import AcademicsPanel from './components/AcademicsPanel';
import AdmissionsPanel from './components/AdmissionsPanel';
import StudentsPanel from './components/StudentsPanel';
import OperationsPanel from './components/OperationsPanel';
import LibraryPanel from './components/LibraryPanel';
import CompliancePanel from './components/CompliancePanel';
import ReportsPanel from './components/ReportsPanel';
import SearchHub from './components/SearchHub';

import { Shield, Sparkles, LogOut, Terminal, Users, Cpu, FileCheck } from 'lucide-react';

export default function App() {
  // Current active impersonation Role
  const [currentUserRole, setCurrentUserRole] = useState<Role>(() => {
    return (localStorage.getItem('edu_role') as Role) || 'Super Admin';
  });

  // Current active navigation tab
  const [activeModule, setActiveModule] = useState<string>('Dashboard');

  // DATABASE STATES
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('edu_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('edu_employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('edu_leave_requests');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('edu_departments');
    return saved ? JSON.parse(saved) : initialDepartments;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edu_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('edu_sessions');
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    const saved = localStorage.getItem('edu_applicants');
    return saved ? JSON.parse(saved) : initialApplicants;
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('edu_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('edu_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('edu_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [bookings, setBookings] = useState<FacilityBooking[]>(() => {
    const saved = localStorage.getItem('edu_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [libraryResources, setLibraryResources] = useState<LibraryResource[]>(() => {
    const saved = localStorage.getItem('edu_library');
    return saved ? JSON.parse(saved) : initialLibraryResources;
  });

  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>(() => {
    const saved = localStorage.getItem('edu_compliance');
    return saved ? JSON.parse(saved) : initialComplianceChecks;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('edu_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [announcements, setAnnouncements] = useState<{ id: string; title: string; category: string; date: string; content: string; author: string }[]>(() => {
    const saved = localStorage.getItem('edu_announcements');
    const defaults = [
      { id: 'ann-1', title: 'MOE Syllabus Review Mandates Locked', category: 'Academics', date: '2026-06-19', content: 'Attention all Departments, the statutory MOE guidelines require updated syllabi files uploaded under the program templates database by tomorrow.', author: 'Director Elizabeth Vance' },
      { id: 'ann-2', title: 'Fiscal Reserves Audit Approved', category: 'Finance', date: '2026-06-18', content: 'The federal financial regulatory delegation has completed the fiscal year review. Institutional reserves sit at 3.4 months of operational overhead, fully clear.', author: 'Super Admin' }
    ];
    return saved ? JSON.parse(saved) : defaults;
  });

  // Local Storage Sync Effects
  useEffect(() => {
    localStorage.setItem('edu_role', currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    localStorage.setItem('edu_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('edu_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('edu_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('edu_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('edu_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edu_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('edu_applicants', JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem('edu_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edu_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('edu_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('edu_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('edu_library', JSON.stringify(libraryResources));
  }, [libraryResources]);

  useEffect(() => {
    localStorage.setItem('edu_compliance', JSON.stringify(complianceChecks));
  }, [complianceChecks]);

  useEffect(() => {
    localStorage.setItem('edu_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('edu_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // SYSTEM LOG HANDLER
  const handleLogAction = (action: string, moduleName: string, details: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newLog: AuditLog = {
      id: 'a-' + (auditLogs.length + 1) + '-' + Math.round(Math.random() * 100),
      user: currentUserRole + ` Token`,
      action,
      module: moduleName,
      timestamp,
      details,
    };
    setAuditLogs((prev) => [...prev, newLog]);
  };

  // HANDLERS FOR INDIVIDUAL MODULES
  const handleAddUser = (u: Omit<User, 'id' | 'joinedDate'>) => {
    const newUser: User = {
      ...u,
      id: 'u' + (users.length + 1),
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleAddEmployee = (e: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...e,
      id: 'e' + (employees.length + 1),
    };
    setEmployees((prev) => [...prev, newEmp]);
  };

  const handleUpdateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
    // Update employee status if leave is approved
    if (status === 'Approved') {
      const match = leaveRequests.find((r) => r.id === id);
      if (match) {
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === match.employeeId ? { ...emp, status: 'On Leave' } : emp
          )
        );
      }
    }
  };

  const handleAddInvoice = (inv: Omit<Invoice, 'id' | 'dateCreated'>) => {
    const newInv: Invoice = {
      ...inv,
      id: 'i-100' + (invoices.length + 1),
      dateCreated: new Date().toISOString().split('T')[0],
    };
    setInvoices((prev) => [...prev, newInv]);
  };

  const handleAddExpense = (exp: Omit<Expense, 'id' | 'date' | 'status'>) => {
    const newExp: Expense = {
      ...exp,
      id: 'x' + (expenses.length + 1),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setExpenses((prev) => [...prev, newExp]);
    // Deduct departmental actual budget allocation temporarily
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === exp.departmentId ? { ...dept, spent: dept.spent + exp.amount } : dept
      )
    );
  };

  const handleUpdateExpenseStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, status } : exp))
    );
  };

  const handleAddCourse = (course: Omit<Course, 'id' | 'resources'>) => {
    const newC: Course = {
      ...course,
      id: 'c' + (courses.length + 1),
      resources: ['Syllabus Guidelines.pdf'],
    };
    setCourses((prev) => [...prev, newC]);
  };

  const handleAddDepartment = (dept: Omit<Department, 'id' | 'facultyCount' | 'studentCount' | 'spent' | 'policyDocs'>) => {
    const newD: Department = {
      ...dept,
      id: 'd' + (departments.length + 1),
      facultyCount: 1,
      studentCount: 0,
      spent: 0,
      policyDocs: ['Core Charters Guidelines.pdf'],
    };
    setDepartments((prev) => [...prev, newD]);
  };

  const handleAddSession = (sess: Omit<Session, 'id'>) => {
    const newS: Session = {
      ...sess,
      id: 's' + (sessions.length + 1),
    };
    setSessions((prev) => [...prev, newS]);
  };

  const handleAddApplicant = (ap: Omit<Applicant, 'id' | 'dateSubmitted' | 'status'>) => {
    const newAp: Applicant = {
      ...ap,
      id: 'a' + (applicants.length + 1),
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setApplicants((prev) => [...prev, newAp]);
  };

  const handleUpdateApplicantStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setApplicants((prev) =>
      prev.map((ap) => (ap.id === id ? { ...ap, status } : ap))
    );
  };

  const handleEnrollApplicant = (applicantId: string) => {
    const app = applicants.find((a) => a.id === applicantId);
    if (!app) return;

    // 1. Create a Student Profile
    const newStudent: StudentProfile = {
      id: 'st-00' + (students.length + 1),
      name: app.name,
      email: app.email,
      departmentId: app.departmentId,
      enrollmentHistory: [
        { courseId: app.courseSelected || 'c1', semester: 'Fall 2026', status: 'Enrolled' },
      ],
      gpa: 4.0, // starting fresh
      attendancePercent: 100, // starting fresh
      guardianName: 'Guardian of ' + app.name,
      guardianContact: '+1 (555) 900-2026',
      disciplinaryRecords: [],
      clubs: [],
    };

    setStudents((prev) => [...prev, newStudent]);

    // 2. Remove applicant from Pending or set Status to enrolled
    setApplicants((prev) => prev.filter((a) => a.id !== applicantId));

    // 3. Increment department studentCount
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === app.departmentId ? { ...d, studentCount: d.studentCount + 1 } : d
      )
    );

    handleLogAction(
      'Admission Process Matriculation Done',
      'Admissions',
      `Enrolled candidate ${app.name} (${app.email}) safely into student directory file under ID: ${newStudent.id}`
    );

    alert(`Successfully processed matriculation! ${app.name} is now registered under StudID: ${newStudent.id}`);
  };

  const handleAddStudent = (stud: Omit<StudentProfile, 'id'>) => {
    const newS: StudentProfile = {
      ...stud,
      id: 'st-00' + (students.length + 1),
    };
    setStudents((prev) => [...prev, newS]);
    // increment department student size
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === stud.departmentId ? { ...d, studentCount: d.studentCount + 1 } : d
      )
    );
  };

  const handleUpdateAttendance = (id: string, newRate: number) => {
    setStudents((prev) =>
      prev.map((st) =>
        st.id === id ? { ...st, attendancePercent: Number(newRate.toFixed(1)) } : st
      )
    );
  };

  const handleAddDisciplineRecord = (id: string, record: string) => {
    setStudents((prev) =>
      prev.map((st) =>
        st.id === id
          ? { ...st, disciplinaryRecords: [...st.disciplinaryRecords, record] }
          : st
      )
    );
  };

  const handleAddBooking = (book: Omit<FacilityBooking, 'id' | 'status'>) => {
    const newB: FacilityBooking = {
      ...book,
      id: 'b' + (bookings.length + 1),
      status: 'Pending',
    };
    setBookings((prev) => [...prev, newB]);
  };

  const handleUpdateBookingStatus = (id: string, status: 'Approved' | 'Cancelled') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const handleAddAnnouncement = (ann: { title: string; category: string; content: string; author: string }) => {
    const newAnn = {
      ...ann,
      id: 'ann-' + (announcements.length + 1),
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const handleBorrowResource = (id: string, borrowerName: string) => {
    const today = new Date();
    today.setDate(today.getDate() + 14); // 2 weeks due date
    const formattedDue = today.toISOString().split('T')[0];

    setLibraryResources((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, available: false, borrower: borrowerName, dueDate: formattedDue }
          : item
      )
    );
  };

  const handleReturnResource = (id: string) => {
    setLibraryResources((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, available: true, borrower: undefined, dueDate: undefined }
          : item
      )
    );
  };

  const handleTriggerAudit = (id: string) => {
    const updated = new Date().toISOString().split('T')[0];
    setComplianceChecks((prev) =>
      prev.map((check) =>
        check.id === id ? { ...check, status: 'Compliant', lastUpdated: updated } : check
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition">
      
      {/* ⚠️ MOCK ROLE SYSTEM IMPERSONATOR BANNER (HIGH FIDELITY PROTO) */}
      <div className="bg-slate-950 text-white py-2.5 px-4 text-[10px] border-b border-slate-800 tracking-wider">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-[0.15em] text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
            <span>MOCK ROLE IMPERSONATION PANEL</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-1">
            <span className="text-slate-400 font-semibold tracking-wider mr-1 uppercase text-[9px]">Switch Role:</span>
            {['Super Admin', 'CEO & Director', 'HOD', 'HR', 'Clerk & Executive', 'Teacher & Professor', 'Student'].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setCurrentUserRole(role as Role);
                  handleLogAction('Role Switching Impersonation', 'Control Plane', `Impersonated view as ${role}`);
                  setActiveModule('Dashboard');
                }}
                className={`py-1 px-2.5 text-[9px] font-extrabold uppercase tracking-widest transition border rounded-none ${
                  currentUserRole === role
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-none'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INSTITUTION PRIMARY HEADER */}
      <header className="bg-white border-b border-slate-200 py-4 shadow-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-slate-900 text-white rounded-none w-10 h-10 flex items-center justify-center font-bold text-xl font-display shadow-none border border-slate-850">
              S
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-[0.05em] uppercase leading-none font-display text-slate-900">
                Skyline International
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-[0.15em] uppercase mt-1 leading-none">Corporate Institution Management Suite</p>
            </div>
          </div>

          {/* GLOBAL SEARCH HUB GROUNDING MODULE */}
          <div className="w-full md:w-auto flex-1 max-w-lg md:mx-4">
            <SearchHub
              students={students}
              courses={courses}
              employees={employees}
              libraryResources={libraryResources}
              invoices={invoices}
              departments={departments}
              activeModule={activeModule}
              onSelectModule={setActiveModule}
            />
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 w-full md:w-auto justify-end">
            <div className="bg-slate-50 border border-slate-200 rounded-none p-2 px-3 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              <div>
                <p className="font-bold text-slate-900 leading-none uppercase tracking-[0.1em] text-[9px]">Authenticated Token</p>
                <p className="text-[9px] text-slate-500 font-mono mt-1 leading-none">{currentUserRole} Access</p>
              </div>
            </div>

            <button
              onClick={() => {
                const cleared = confirm('Confirm core simulated system exit? This will wipe your localStorage state demo.');
                if (cleared) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="p-2 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 font-bold rounded-none transition"
              title="Factory Reset State"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* TOP MEGA MENU */}
      <MegaMenu
        currentUserRole={currentUserRole}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
      />

      {/* CENTRAL MAIN VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* ROLE BASED PERSONALIZED DASHBOARD (DEFAULT VIEW) */}
        {activeModule === 'Dashboard' && (
          <div className="space-y-6 animate-fade-in text-xs">
            
            {/* Greeting card */}
            <div className="bg-slate-900 text-white p-6 rounded-none border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-none">
              <div>
                <span className="bg-indigo-600 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-none uppercase tracking-[0.15em] font-display">Welcome Back</span>
                <h2 className="text-base sm:text-lg font-bold font-display uppercase tracking-wider mt-2">Currently Impersonating: <span className="text-indigo-400 font-bold">{currentUserRole}</span></h2>
                <p className="text-slate-450 text-xs mt-1">Accessing Skyline International Central administrative directories. Use the mega navigation to load modular system logs.</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-none border border-slate-700 text-xs font-mono shrink-0">
                <p className="text-slate-400 leading-none uppercase tracking-wider text-[8px] font-bold">Active Term Cycle</p>
                <p className="text-sm font-bold text-white mt-1">2025 / 2026</p>
              </div>
            </div>

            {/* Dashboards modules depending on role */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Left Column: Metrics overview */}
              <div className="bg-white p-6 rounded-none border border-slate-200 shadow-none space-y-4">
                <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] font-display">
                  <Cpu className="w-4 h-4 text-indigo-600 shrink-0" /> Campus Ledger KPIs
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-none text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Active Students</p>
                    <p className="text-xl font-light text-slate-900 font-display mt-1">{students.length}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-none text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Staff Onboard</p>
                    <p className="text-xl font-light text-slate-900 font-display mt-1">{employees.length}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-none text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Accreditors MOE</p>
                    <p className="text-xl font-bold text-indigo-600 font-display mt-1">100% PASS</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-none text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Student-Staff Ratio</p>
                    <p className="text-xl font-light text-slate-800 font-display mt-1">14.8 : 1</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-none">
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[9px]">Current Role Permissions:</p>
                  <p className="text-slate-600 leading-relaxed mt-1.5 text-[11px]">
                    {currentUserRole === 'Super Admin' && '✓ Full system administration configurations, user provisioning, edit lists, delete records, view audit ledgers.'}
                    {currentUserRole === 'CEO & Director' && '✓ High-level strategically managed budgeting dashboards, HR recruitment tracking, MOE status reporting check.'}
                    {currentUserRole === 'HOD' && '✓ Management level allocations over departments, peer course creation, curriculum, room session lockers, leave requests evaluation.'}
                    {currentUserRole === 'HR' && '✓ Onboarding employee files, appraisals metrics tracking, leave allowances checks, job vacancies listing.'}
                    {currentUserRole === 'Clerk & Executive' && '✓ Day-to-day administrative paperwork processing, applications tracking, receipt of student invoicing bills.'}
                    {currentUserRole === 'Teacher & Professor' && '✓ View schedules, class lists GPAs, record student absence indices, suggest library reference materials.'}
                    {currentUserRole === 'Student' && '✓ View personal GPA portfolios, download syllabus references, browse digital e-books, check transit corridors.'}
                  </p>
                </div>
              </div>

              {/* Middle Column: Priority Announcements notice board */}
              <div className="bg-white p-6 rounded-none border border-slate-200 shadow-none space-y-4">
                <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] font-display">
                  <Terminal className="w-4 h-4 text-indigo-600 shrink-0" /> Pinned notice Board
                </h3>
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((ann) => (
                    <div key={ann.id} className="p-3.5 bg-slate-50 rounded-none border border-slate-200 space-y-1">
                      <div className="flex justify-between items-start font-bold text-slate-900">
                        <span className="uppercase tracking-wide text-[10px] leading-tight break-words max-w-[70%]">{ann.title}</span>
                        <span className="text-[8px] bg-slate-200 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded-none uppercase tracking-wider font-extrabold shrink-0">{ann.category}</span>
                      </div>
                      <p className="text-slate-600 leading-normal text-[11px] mt-1">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Dynamic System Actions depending on impersonated Role */}
              <div className="bg-white p-6 rounded-none border border-slate-200 shadow-none space-y-4">
                <h3 className="font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] font-display">
                  <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" /> Quick role Operations
                </h3>
                
                <div className="space-y-2">
                  <p className="text-slate-500 mb-2 leading-relaxed text-[11px]">Simulated quick shortcuts matching your impersonated role profile clearances:</p>

                  {currentUserRole === 'Super Admin' && (
                    <>
                      <button onClick={() => setActiveModule('Administration')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        ⚙️ Security Config & 2FA Control
                      </button>
                      <button onClick={() => setActiveModule('Administration')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        📂 Run Cryptographic Audit Trails
                      </button>
                    </>
                  )}

                  {currentUserRole === 'CEO & Director' && (
                    <>
                      <button onClick={() => setActiveModule('Finance')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        📊 Strategic P&L Statements
                      </button>
                      <button onClick={() => setActiveModule('Reports')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        📈 Predict Student Retention Matrix
                      </button>
                    </>
                  )}

                  {currentUserRole === 'HOD' && (
                    <>
                      <button onClick={() => setActiveModule('Academics')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        📘 Formulate Course Syllabus
                      </button>
                      <button onClick={() => setActiveModule('Staff & HR')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        📝 Review Faculty Appraisal Scores
                      </button>
                    </>
                  )}

                  {currentUserRole === 'HR' && (
                    <>
                      <button onClick={() => setActiveModule('Staff & HR')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        🗓️ Approve Staff Leave Requests
                      </button>
                      <button onClick={() => setActiveModule('Staff & HR')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        💼 Create Work Career Opportunities
                      </button>
                    </>
                  )}

                  {currentUserRole === 'Clerk & Executive' && (
                    <>
                      <button onClick={() => setActiveModule('Admissions')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        🚀 Pipeline Approved Candidates
                      </button>
                      <button onClick={() => setActiveModule('Finance')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        💵 Generate Billing Invoices
                      </button>
                    </>
                  )}

                  {currentUserRole === 'Teacher & Professor' && (
                    <>
                      <button onClick={() => setActiveModule('Students')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        📝 Record Class Absences Index
                      </button>
                      <button onClick={() => setActiveModule('Library')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        📚 Recommend Core Library Acquisitions
                      </button>
                    </>
                  )}

                  {currentUserRole === 'Student' && (
                    <>
                      <button onClick={() => setActiveModule('Students')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        🎓 Inspect Cumulative GPA Score
                      </button>
                      <button onClick={() => setActiveModule('Library')} className="w-full text-left py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-400 rounded-none transition font-bold uppercase tracking-wider text-[9px] flex items-center gap-2">
                        📖 Retrieve Digital E-Learning Material
                      </button>
                    </>
                  )}

                </div>
              </div>

            </div>

          </div>
        )}

        {/* ADMIN HUB SCREEN */}
        {activeModule === 'Administration' && (
          <AdminPanel
            currentUserRole={currentUserRole}
            users={users}
            auditLogs={auditLogs}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onLogAction={handleLogAction}
          />
        )}

        {/* HR PANEL SCREEN */}
        {activeModule === 'Staff & HR' && (
          <HRPanel
            currentUserRole={currentUserRole}
            employees={employees}
            leaveRequests={leaveRequests}
            onAddEmployee={handleAddEmployee}
            onUpdateLeaveStatus={handleUpdateLeaveStatus}
            onLogAction={handleLogAction}
          />
        )}

        {/* FINANCE SCREEN */}
        {activeModule === 'Finance' && (
          <FinancePanel
            currentUserRole={currentUserRole}
            invoices={invoices}
            expenses={expenses}
            departments={departments}
            onAddInvoice={handleAddInvoice}
            onAddExpense={handleAddExpense}
            onUpdateExpenseStatus={handleUpdateExpenseStatus}
            onLogAction={handleLogAction}
          />
        )}

        {/* ACADEMICS REGISTRY */}
        {activeModule === 'Academics' && (
          <AcademicsPanel
            currentUserRole={currentUserRole}
            courses={courses}
            departments={departments}
            sessions={sessions}
            onAddCourse={handleAddCourse}
            onAddDepartment={handleAddDepartment}
            onAddSession={handleAddSession}
            onLogAction={handleLogAction}
          />
        )}

        {/* ADMISSIONS SCREEN */}
        {activeModule === 'Admissions' && (
          <AdmissionsPanel
            currentUserRole={currentUserRole}
            applicants={applicants}
            departments={departments}
            onAddApplicant={handleAddApplicant}
            onUpdateApplicantStatus={handleUpdateApplicantStatus}
            onEnrollApplicant={handleEnrollApplicant}
            onLogAction={handleLogAction}
          />
        )}

        {/* STUDENTS ROSTER */}
        {activeModule === 'Students' && (
          <StudentsPanel
            currentUserRole={currentUserRole}
            students={students}
            departments={departments}
            onAddStudent={handleAddStudent}
            onUpdateAttendance={handleUpdateAttendance}
            onAddDisciplineRecord={handleAddDisciplineRecord}
            onLogAction={handleLogAction}
          />
        )}

        {/* OPERATIONS MODULES */}
        {activeModule === 'Operations' && (
          <OperationsPanel
            currentUserRole={currentUserRole}
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onLogAction={handleLogAction}
          />
        )}

        {/* ONLINE LIBRARY CATALOG */}
        {activeModule === 'Library' && (
          <LibraryPanel
            currentUserRole={currentUserRole}
            resources={libraryResources}
            onBorrowResource={handleBorrowResource}
            onReturnResource={handleReturnResource}
            onLogAction={handleLogAction}
          />
        )}

        {/* MOE COMPLIANCE AUDITOR */}
        {activeModule === 'MOE Compliance' && (
          <CompliancePanel
            currentUserRole={currentUserRole}
            checks={complianceChecks}
            onTriggerAudit={handleTriggerAudit}
            onLogAction={handleLogAction}
          />
        )}

        {/* SUMMARY REPORTS & CORE ANALYSIS GRAPHICS */}
        {activeModule === 'Reports' && (
          <ReportsPanel
            currentUserRole={currentUserRole}
            students={students}
            departments={departments}
            invoices={invoices}
          />
        )}

      </main>

      {/* CORE STATUTORY FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5 font-medium">
          <p>© 2026 Skyline International University Corporation. All rights reserved.</p>
          <p className="text-[10px] text-slate-350">Accredited by the Ministry of Education (MOE Compliance Certificate #SM-48902B-26).</p>
        </div>
      </footer>
    </div>
  );
}
