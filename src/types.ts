/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role =
  | 'Super Admin'
  | 'CEO & Director'
  | 'HOD'
  | 'HR'
  | 'Clerk & Executive'
  | 'Teacher & Professor'
  | 'Student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  joinedDate: string;
  status: 'Active' | 'Inactive';
}

export interface Employee {
  id: string;
  name: string;
  role: Role;
  department: string;
  email: string;
  leaveBalance: number;
  salary: number;
  performanceScore: number; // 0 to 100
  attendanceRate: number; // percentage
  status: 'Active' | 'On Leave' | 'Suspended';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: string; // e.g. 'Annual', 'Sick', 'Maternity'
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  facultyCount: number;
  studentCount: number;
  budget: number;
  spent: number;
  policyDocs: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  credits: number;
  syllabus?: string;
  resources: string[]; // urls/names
}

export interface Session {
  id: string;
  courseId: string;
  courseName: string;
  instructor: string;
  datetime: string;
  room: string;
  virtualLink?: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  dateSubmitted: string;
  score: number; // Screening score
  courseSelected?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  enrollmentHistory: { courseId: string; semester: string; status: string }[];
  gpa: number;
  attendancePercent: number;
  guardianName: string;
  guardianContact: string;
  disciplinaryRecords: string[];
  clubs: string[];
}

export interface Invoice {
  id: string;
  studentName: string;
  amount: number;
  type: 'Tuition' | 'Admission' | 'Library' | 'Exam';
  status: 'Paid' | 'Unpaid';
  dateCreated: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  departmentId: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  requestedBy: string;
}

export interface FacilityBooking {
  id: string;
  facilityName: string; // e.g. 'Seminar Hall A', 'Lab 3'
  date: string;
  timeSlot: string;
  bookedBy: string;
  purpose: string;
  status: 'Pending' | 'Approved' | 'Cancelled';
}

export interface LibraryResource {
  id: string;
  title: string;
  author: string;
  type: 'E-Book' | 'Journal' | 'Physical Book';
  available: boolean;
  category: string;
  borrower?: string;
  dueDate?: string;
}

export interface ComplianceCheck {
  id: string;
  name: string;
  category: 'Academics' | 'Governance' | 'HR' | 'Finance';
  status: 'Compliant' | 'Pending Review' | 'Non-Compliant';
  lastUpdated: string;
  description: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}
