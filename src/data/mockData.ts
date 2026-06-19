/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  Employee,
  LeaveRequest,
  Department,
  Course,
  Session,
  Applicant,
  StudentProfile,
  Invoice,
  Expense,
  FacilityBooking,
  LibraryResource,
  ComplianceCheck,
  AuditLog
} from '../types';

export const initialUsers: User[] = [
  { id: 'u1', name: 'Dr. Arthur Pendragon', email: 'arthur.p@edu.org', role: 'Super Admin', joinedDate: '2021-01-15', status: 'Active' },
  { id: 'u2', name: 'Director Elizabeth Vance', email: 'elizabeth.v@edu.org', role: 'CEO & Director', joinedDate: '2020-03-10', status: 'Active' },
  { id: 'u3', name: 'Prof. Helen Magnus', email: 'helen.m@edu.org', role: 'HOD', department: 'Computer Science', joinedDate: '2019-06-01', status: 'Active' },
  { id: 'u4', name: 'Sarah Connor', email: 'sarah.c@edu.org', role: 'HR', joinedDate: '2022-09-01', status: 'Active' },
  { id: 'u5', name: 'Denny Duquette', email: 'denny.d@edu.org', role: 'Clerk & Executive', joinedDate: '2023-01-20', status: 'Active' },
  { id: 'u6', name: 'Prof. Charles Xavier', email: 'charles.x@edu.org', role: 'Teacher & Professor', department: 'Computer Science', joinedDate: '2018-08-15', status: 'Active' },
  { id: 'u7', name: 'John Shepard', email: 'john.s@edu.org', role: 'Student', department: 'Computer Science', joinedDate: '2023-09-05', status: 'Active' }
];

export const initialEmployees: Employee[] = [
  { id: 'e1', name: 'Sarah Connor', role: 'HR', department: 'Human Resources', email: 'sarah.c@edu.org', leaveBalance: 18, salary: 6500, performanceScore: 92, attendanceRate: 98.4, status: 'Active' },
  { id: 'e2', name: 'Denny Duquette', role: 'Clerk & Executive', department: 'Administration', email: 'denny.d@edu.org', leaveBalance: 12, salary: 4200, performanceScore: 84, attendanceRate: 95.2, status: 'Active' },
  { id: 'e3', name: 'Prof. Helen Magnus', role: 'HOD', department: 'Computer Science', email: 'helen.m@edu.org', leaveBalance: 14, salary: 9500, performanceScore: 96, attendanceRate: 99.1, status: 'Active' },
  { id: 'e4', name: 'Prof. Charles Xavier', role: 'Teacher & Professor', department: 'Computer Science', email: 'charles.x@edu.org', leaveBalance: 10, salary: 8000, performanceScore: 95, attendanceRate: 97.8, status: 'Active' },
  { id: 'e5', name: 'Prof. Minerva McGonagall', role: 'Teacher & Professor', department: 'Mathematics', email: 'minerva.m@edu.org', leaveBalance: 15, salary: 8200, performanceScore: 98, attendanceRate: 99.5, status: 'Active' },
  { id: 'e6', name: 'Alan Turing', role: 'Teacher & Professor', department: 'Computer Science', email: 'alan.turing@edu.org', leaveBalance: 8, salary: 8100, performanceScore: 99, attendanceRate: 96.5, status: 'Active' },
  { id: 'e7', name: 'Richard Feynman', role: 'Teacher & Professor', department: 'Physics', email: 'rfeynman@edu.org', leaveBalance: 16, salary: 8500, performanceScore: 94, attendanceRate: 94.0, status: 'Active' }
];

export const initialLeaveRequests: LeaveRequest[] = [
  { id: 'l1', employeeId: 'e4', employeeName: 'Prof. Charles Xavier', department: 'Computer Science', type: 'Annual Leave', startDate: '2026-07-10', endDate: '2026-07-15', reason: 'Family vacation and resting.', status: 'Pending' },
  { id: 'l2', employeeId: 'e2', employeeName: 'Denny Duquette', department: 'Administration', type: 'Sick Leave', startDate: '2026-06-21', endDate: '2026-06-22', reason: 'Medical dental appointment.', status: 'Approved' },
  { id: 'l3', employeeId: 'e5', employeeName: 'Prof. Minerva McGonagall', department: 'Mathematics', type: 'Annual Leave', startDate: '2026-08-01', endDate: '2026-08-05', reason: 'Attending educational symposium.', status: 'Approved' }
];

export const initialDepartments: Department[] = [
  { id: 'd1', name: 'Computer Science', code: 'CS', hodName: 'Prof. Helen Magnus', facultyCount: 8, studentCount: 150, budget: 150000, spent: 112000, policyDocs: ['CS Lab Safety Guidelines.pdf', 'CS Syllabus Structure v2.pdf'] },
  { id: 'd2', name: 'Mathematics', code: 'MATH', hodName: 'Prof. Alistair Cook', facultyCount: 5, studentCount: 85, budget: 90000, spent: 65400, policyDocs: ['Math Dept Grading Criteria.pdf'] },
  { id: 'd3', name: 'Physics', code: 'PHYS', hodName: 'Dr. Richard Feynman', facultyCount: 4, studentCount: 70, budget: 110000, spent: 93200, policyDocs: ['Physics Lab Protocol.pdf', 'Radiation Safety Regulations.pdf'] },
  { id: 'd4', name: 'Humanities & Art', code: 'HUM', hodName: 'Prof. Walter White', facultyCount: 6, studentCount: 110, budget: 75000, spent: 54000, policyDocs: ['Academic Integrity Handbook.pdf'] }
];

export const initialCourses: Course[] = [
  { id: 'c1', code: 'CS101', name: 'Introduction to Algorithms', departmentId: 'd1', credits: 4, syllabus: 'Topics include asymptotic analysis, divide and conquer, tree structures, sorting and searching algorithms, and basic graph traversals.', resources: ['Lecture Slides 01-10.zip', 'Assignment Specs 1.pdf'] },
  { id: 'c2', code: 'CS202', name: 'Advanced Databases & SQL', departmentId: 'd1', credits: 4, syllabus: 'Comprehensive view of database systems, relational algebra, SQL optimization, transactions, ACID properties, and non-relational structures.', resources: ['SQL Cheat Sheet.pdf', 'Relational Schema Designer.xlsx'] },
  { id: 'c3', code: 'MATH301', name: 'Linear Algebra II', departmentId: 'd2', credits: 3, syllabus: 'Vector spaces, eigenvalues & eigenvectors, linear transformations, inner product spaces, and applications to numerical methods.', resources: ['Matrix Compendium.pdf'] },
  { id: 'c4', code: 'PHYS201', name: 'Thermodynamics & Electromagnetism', departmentId: 'd3', credits: 4, syllabus: 'Laws of thermodynamics, heat engines, Maxwell equations, static electromagnetic fields, and wave propagation through medium.', resources: ['Thermodynamics Worksheets.pdf'] }
];

export const initialSessions: Session[] = [
  { id: 's1', courseId: 'c1', courseName: 'Introduction to Algorithms', instructor: 'Prof. Charles Xavier', datetime: 'Mon, Wed 09:00 - 10:30', room: 'Lecture Hall 102A', virtualLink: 'https://meet.edu/cs101-xavier' },
  { id: 's2', courseId: 'c2', courseName: 'Advanced Databases & SQL', instructor: 'Alan Turing', datetime: 'Tue, Thu 14:00 - 15:30', room: 'Lab 403', virtualLink: 'https://meet.edu/cs202-turing' },
  { id: 's3', courseId: 'c3', courseName: 'Linear Algebra II', instructor: 'Prof. Minerva McGonagall', datetime: 'Wed, Fri 11:00 - 12:30', room: 'Seminar Hall B', virtualLink: 'https://meet.edu/math301-minerva' },
  { id: 's4', courseId: 'c4', courseName: 'Thermodynamics & Electromagnetism', instructor: 'Richard Feynman', datetime: 'Mon, Fri 13:00 - 14:30', room: 'Science Lab 10', virtualLink: '' }
];

export const initialApplicants: Applicant[] = [
  { id: 'a1', name: 'Harry Potter', email: 'harry.p@gmail.com', departmentId: 'd1', status: 'Pending', dateSubmitted: '2026-06-01', score: 88, courseSelected: 'CS101' },
  { id: 'a2', name: 'Hermione Granger', email: 'hermione.g@gmail.com', departmentId: 'd1', status: 'Approved', dateSubmitted: '2026-05-28', score: 99, courseSelected: 'CS202' },
  { id: 'a3', name: 'Ron Weasley', email: 'ron.w@gmail.com', departmentId: 'd2', status: 'Rejected', dateSubmitted: '2026-06-03', score: 62, courseSelected: 'MATH301' },
  { id: 'a4', name: 'Luke Skywalker', email: 'luke.s@tatooine.net', departmentId: 'd3', status: 'Pending', dateSubmitted: '2026-06-15', score: 81, courseSelected: 'PHYS201' }
];

export const initialStudents: StudentProfile[] = [
  {
    id: 'st-001',
    name: 'John Shepard',
    email: 'john.s@edu.org',
    departmentId: 'd1',
    enrollmentHistory: [
      { courseId: 'c1', semester: 'Fall 2025', status: 'Completed (A)' },
      { courseId: 'c2', semester: 'Spring 2026', status: 'Enrolled' }
    ],
    gpa: 3.82,
    attendancePercent: 94.5,
    guardianName: 'Capt. David Anderson',
    guardianContact: '+1 (555) 304-4903',
    disciplinaryRecords: [],
    clubs: ['Robotics Club', 'Cybersecurity Alliance']
  },
  {
    id: 'st-002',
    name: 'Tali Vas Normandy',
    email: 'tali.v@edu.org',
    departmentId: 'd1',
    enrollmentHistory: [
      { courseId: 'c1', semester: 'Fall 2025', status: 'Completed (A+)' },
      { courseId: 'c2', semester: 'Spring 2026', status: 'Enrolled' }
    ],
    gpa: 4.0,
    attendancePercent: 98.2,
    guardianName: 'Rael Zorah',
    guardianContact: '+1 (555) 902-8321',
    disciplinaryRecords: [],
    clubs: ['Hardware Hacking Guild']
  },
  {
    id: 'st-003',
    name: 'Garrus Vakarian',
    email: 'garrus.v@edu.org',
    departmentId: 'd3',
    enrollmentHistory: [
      { courseId: 'c4', semester: 'Spring 2026', status: 'Enrolled' }
    ],
    gpa: 3.45,
    attendancePercent: 88.0,
    guardianName: 'Castis Vakarian',
    guardianContact: '+1 (555) 120-4491',
    disciplinaryRecords: ['Calibration Overdrive Incident (Reprimanded)'],
    clubs: ['Rifle Association', 'Tactics & Chess Team']
  },
  {
    id: 'st-004',
    name: 'Arthur Dent',
    email: 'arthur.d@edu.org',
    departmentId: 'd4',
    enrollmentHistory: [],
    gpa: 2.15,
    attendancePercent: 68.4, // At academic risk!
    guardianName: 'Ford Prefect',
    guardianContact: '+44 (7700) 900077',
    disciplinaryRecords: ['Absenteeism during tea times'],
    clubs: ['Tea Appreciation Society']
  },
  {
    id: 'st-005',
    name: 'Wanderer Bennett',
    email: 'wanderer.b@edu.org',
    departmentId: 'd2',
    enrollmentHistory: [
      { courseId: 'c3', semester: 'Spring 2026', status: 'Enrolled' }
    ],
    gpa: 3.10,
    attendancePercent: 71.2, // At risk (attendance below 75%)
    guardianName: 'Emily Bennett',
    guardianContact: '+1 (555) 712-4411',
    disciplinaryRecords: [],
    clubs: []
  }
];

export const initialInvoices: Invoice[] = [
  { id: 'i-1001', studentName: 'John Shepard', amount: 3500, type: 'Tuition', status: 'Paid', dateCreated: '2026-05-15' },
  { id: 'i-1002', studentName: 'Tali Vas Normandy', amount: 3500, type: 'Tuition', status: 'Paid', dateCreated: '2026-05-15' },
  { id: 'i-1003', studentName: 'Garrus Vakarian', amount: 3500, type: 'Tuition', status: 'Unpaid', dateCreated: '2026-05-16' },
  { id: 'i-1004', studentName: 'Arthur Dent', amount: 3500, type: 'Tuition', status: 'Unpaid', dateCreated: '2026-05-18' }
];

export const initialExpenses: Expense[] = [
  { id: 'x1', title: 'High-performance GPU Server cluster upgrading', amount: 15000, departmentId: 'd1', date: '2026-06-05', status: 'Approved', requestedBy: 'Prof. Helen Magnus' },
  { id: 'x2', title: 'Oscilloscopes & Signal Generators for Physics lab', amount: 4800, departmentId: 'd3', date: '2026-06-10', status: 'Approved', requestedBy: 'Richard Feynman' },
  { id: 'x3', title: 'Whiteboards & ergonomic tables for Math division', amount: 2500, departmentId: 'd2', date: '2026-06-12', status: 'Pending', requestedBy: 'Prof. Minerva McGonagall' },
  { id: 'x4', title: 'Annual symposium flyers & hospitality catering', amount: 1200, departmentId: 'd4', date: '2026-06-14', status: 'Approved', requestedBy: 'Prof. Walter White' }
];

export const initialBookings: FacilityBooking[] = [
  { id: 'b1', facilityName: 'Seminar Hall A', date: '2026-06-25', timeSlot: '10:00 - 13:00', bookedBy: 'Sarah Connor', purpose: 'HR Leadership and Compliance workshop', status: 'Approved' },
  { id: 'b2', facilityName: 'Lab 403', date: '2026-06-26', timeSlot: '14:00 - 17:00', bookedBy: 'Prof. Charles Xavier', purpose: 'Advanced Python guest lecture session', status: 'Approved' },
  { id: 'b3', facilityName: 'Conference Room 2B', date: '2026-06-28', timeSlot: '09:00 - 11:30', bookedBy: 'Prof. Helen Magnus', purpose: 'CS Departmental curriculum sync', status: 'Pending' }
];

export const initialLibraryResources: LibraryResource[] = [
  { id: 'lib-01', title: 'Introduction to Algorithms, 4th Edition', author: 'Cormen, Leiserson, Rivest, Stein', type: 'Physical Book', available: true, category: 'Computer Science' },
  { id: 'lib-02', title: 'Calculus: Early Transcendentals', author: 'James Stewart', type: 'Physical Book', available: false, category: 'Mathematics', borrower: 'Tali Vas Normandy', dueDate: '2026-07-02' },
  { id: 'lib-03', title: 'Feynman Lectures on Physics, Vol 1-3', author: 'Richard Feynman', type: 'E-Book', available: true, category: 'Physics' },
  { id: 'lib-04', title: 'The Elements of Statistical Learning', author: 'Hastie, Tibshirani, Friedman', type: 'E-Book', available: true, category: 'Computer Science' },
  { id: 'lib-05', title: 'The Hitchhikers Guide to Rhetoric', author: 'Prostetnic Vogon Jeltz', type: 'Journal', available: true, category: 'Humanities' }
];

export const initialComplianceChecks: ComplianceCheck[] = [
  { id: 'c-01', name: 'Qualified Staff Ratio', category: 'HR', status: 'Compliant', lastUpdated: '2026-05-10', description: 'Over 85% of permanent teaching staff must hold a PhD or terminal degree in their field as mandated by MOE.' },
  { id: 'c-02', name: 'Syllabus Alignment & Review', category: 'Academics', status: 'Compliant', lastUpdated: '2026-06-01', description: 'All courses must have syllabi updated within the current academic cluster and conform to standardized outcomes.' },
  { id: 'c-03', name: 'Fiscal Reserves Audit', category: 'Finance', status: 'Pending Review', lastUpdated: '2026-06-15', description: 'Institutional reserves must meet or exceed 3 months of dynamic operational costs.' },
  { id: 'c-04', name: 'Disaster Recovery and Fire Safety Safety Protocols', category: 'Governance', status: 'Compliant', lastUpdated: '2026-04-20', description: 'Inspection and verification documents for campus fire escape structures and server backup redundancy.' }
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'a-1', user: 'Dr. Arthur Pendragon', action: 'Update Permissions', module: 'Administration', timestamp: '2026-06-19 09:30', details: 'Added access rights for Student role in Library e-books' },
  { id: 'a-2', user: 'Sarah Connor', action: 'Hire Employee', module: 'HR Management', timestamp: '2026-06-19 10:15', details: 'Completed recruitment dossier for Richard Feynman in Physics department' },
  { id: 'a-3', user: 'Director Elizabeth Vance', action: 'Approve Budget Expense', module: 'Account & Finance', timestamp: '2026-06-19 10:45', details: 'Approved expenditure x1 ($15,000) for CS High-performance GPU Server cluster' }
];
