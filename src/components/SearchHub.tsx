import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  FileText, 
  ArrowRight, 
  Mail, 
  Award, 
  Clock, 
  ShieldAlert, 
  Coins, 
  BookMarked,
  Layout,
  CornerDownRight,
  Sparkles
} from 'lucide-react';
import { StudentProfile, Course, Employee, LibraryResource, Invoice, Department } from '../types';

interface SearchHubProps {
  students: StudentProfile[];
  courses: Course[];
  employees: Employee[];
  libraryResources: LibraryResource[];
  invoices: Invoice[];
  departments: Department[];
  activeModule: string;
  onSelectModule: (moduleName: string) => void;
}

type SearchCategory = 'Students' | 'Courses' | 'Staff' | 'Library' | 'Finance';

interface SearchResultItem {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  badgeText: string;
  rawItem: any;
}

export default function SearchHub({
  students,
  courses,
  employees,
  libraryResources,
  invoices,
  departments,
  onSelectModule
}: SearchHubProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResultItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Command+K or "/"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map Department ID to Department Code or Name
  const getDeptCode = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.code : deptId;
  };

  const getDeptName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept ? dept.name : deptId;
  };

  // Compile search indexes
  const allResults: SearchResultItem[] = [];

  // 1. Students Map
  students.forEach(st => {
    allResults.push({
      id: `student-${st.id}`,
      category: 'Students',
      title: st.name,
      subtitle: `${getDeptCode(st.departmentId)} | Major: GPA ${st.gpa.toFixed(2)} | attendance: ${st.attendancePercent}%`,
      badgeText: st.id,
      rawItem: st
    });
  });

  // 2. Courses Map
  courses.forEach(co => {
    allResults.push({
      id: `course-${co.id}`,
      category: 'Courses',
      title: `${co.code}: ${co.name}`,
      subtitle: `${getDeptCode(co.departmentId)} | Credits: ${co.credits} Units`,
      badgeText: 'CURRICULUM',
      rawItem: co
    });
  });

  // 3. Staff Map
  employees.forEach(emp => {
    allResults.push({
      id: `employee-${emp.id}`,
      category: 'Staff',
      title: emp.name,
      subtitle: `${emp.role} | Department: ${emp.department} | ${emp.email}`,
      badgeText: emp.status.toUpperCase(),
      rawItem: emp
    });
  });

  // 4. Library Map
  libraryResources.forEach(res => {
    allResults.push({
      id: `library-${res.id}`,
      category: 'Library',
      title: res.title,
      subtitle: `By ${res.author} | Category: ${res.category} | Format: ${res.type}`,
      badgeText: res.available ? 'AVAILABLE' : 'BORROWED',
      rawItem: res
    });
  });

  // 5. Invoices Map
  invoices.forEach(inv => {
    allResults.push({
      id: `invoice-${inv.id}`,
      category: 'Finance',
      title: `Invoiced Student: ${inv.studentName}`,
      subtitle: `${inv.type} Fee Allocation | Amount Charged: $${inv.amount.toLocaleString()}`,
      badgeText: inv.status.toUpperCase(),
      rawItem: inv
    });
  });

  // Filter logic
  const filteredResults = query.trim() === ''
    ? []
    : allResults.filter(item => {
        const fullSearchTarget = `${item.title} ${item.subtitle} ${item.category} ${item.badgeText}`.toLowerCase();
        const searchWords = query.toLowerCase().split(/\s+/).filter(Boolean);
        return searchWords.every(word => fullSearchTarget.includes(word));
      }).slice(0, 8); // Limits matching count for readability

  // Grouped results
  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<SearchCategory, SearchResultItem[]>);

  // Navigation map
  const routeToCategoryPanel = (category: SearchCategory) => {
    setIsOpen(false);
    setQuery('');
    switch (category) {
      case 'Students':
        onSelectModule('Students');
        break;
      case 'Courses':
        onSelectModule('Academics');
        break;
      case 'Staff':
        onSelectModule('Staff & HR');
        break;
      case 'Library':
        onSelectModule('Library');
        break;
      case 'Finance':
        onSelectModule('Finance');
        break;
    }
  };

  // Helper to highlight match words
  const renderHighlightedText = (text: string, search: string) => {
    if (!search.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${search.split(/\s+/).filter(Boolean).join('|')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <mark key={i} className="bg-indigo-100 text-indigo-900 font-bold px-0.5 rounded-none decoration-clone">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const getCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case 'Students':
        return <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Courses':
        return <BookOpen className="w-3.5 h-3.5 text-amber-650" />;
      case 'Staff':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-650" />;
      case 'Library':
        return <BookMarked className="w-3.5 h-3.5 text-teal-650" />;
      case 'Finance':
        return <Coins className="w-3.5 h-3.5 text-rose-650" />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm sm:max-w-md md:max-w-lg z-40">
      {/* SEARCH FIELD BOX */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Global register search... (File, faculty, student...)"
          className="w-full bg-slate-50 border border-slate-200 py-2.5 pl-9 pr-16 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
        />
        {query ? (
          <button 
            type="button" 
            onClick={() => { setQuery(''); setSelectedResult(null); }}
            className="absolute inset-y-0 right-10 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 bg-white border border-slate-200">
            /
          </kbd>
        </div>
      </div>

      {/* DROPDOWN EXPANSION PANEL */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute left-0 right-0 mt-1 pb-1 bg-white border border-slate-200 shadow-xl z-50 text-xs text-slate-700 animate-fade-in flex flex-col md:flex-row min-w-[320px] md:min-w-[624px]">
          
          {/* SEARCH RESULT LISTINGS */}
          <div className="flex-1 border-r border-slate-100 max-h-[380px] overflow-y-auto">
            <div className="p-3 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
              <span className="font-display font-bold uppercase text-[9px] text-slate-500 tracking-wider">
                Matching Registry Records ({filteredResults.length})
              </span>
              <span className="text-[9px] text-slate-400 font-mono">Real-time grounding</span>
            </div>

            {filteredResults.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-display font-medium text-slate-700 uppercase tracking-wide text-[10px]">No matches registered</p>
                <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto">
                  Double check spelling terms or query using alternate keywords like Student names, Department keys, or Resource catalogs.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category} className="p-2 space-y-1">
                    <div className="px-2 py-1 text-[8.5px] font-bold text-indigo-900 bg-indigo-50 tracking-widest uppercase font-display flex items-center gap-1.5 leading-none w-fit">
                      {getCategoryIcon(category as SearchCategory)}
                      {category}
                    </div>
                    <div className="space-y-0.5">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedResult(item);
                          }}
                          className={`w-full text-left p-2 hover:bg-slate-50 transition flex items-center justify-between gap-3 border rounded-none group ${
                            selectedResult?.id === item.id 
                              ? 'bg-slate-50 border-indigo-200' 
                              : 'border-transparent'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-[11px] truncate group-hover:text-indigo-600 transition-colors">
                              {renderHighlightedText(item.title, query)}
                            </p>
                            <p className="text-[10px] text-slate-550 truncate mt-0.5">
                              {renderHighlightedText(item.subtitle, query)}
                            </p>
                          </div>
                          <span className={`text-[8.5px] shrink-0 font-mono border px-1.5 py-0.5 rounded-none font-bold uppercase ${
                            item.badgeText === 'ACTIVE' || item.badgeText === 'AVAILABLE' || item.badgeText === 'PAID'
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                              : item.badgeText === 'BORROWED' || item.badgeText === 'UNPAID' || item.badgeText === 'ON LEAVE'
                              ? 'bg-rose-50 border-rose-100 text-rose-700'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}>
                            {item.badgeText}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE LOG GROUNDING INSPECTOR */}
          <div className="w-full md:w-[280px] bg-slate-50 p-4 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200">
            {selectedResult ? (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-indigo-750 font-display font-bold uppercase text-[9px] tracking-wider pb-2 border-b border-slate-200">
                    <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                    Record Detail grounding
                  </div>

                  {/* Student Records Detail Card */}
                  {selectedResult.category === 'Students' && (() => {
                    const student = selectedResult.rawItem as StudentProfile;
                    return (
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-[9px] font-mono text-slate-400 uppercase">Registered Name</p>
                          <p className="font-display font-medium text-slate-900 text-base">{student.name}</p>
                          <p className="text-[10px] font-mono text-indigo-600 mt-0.5">Student ID: {student.id}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-200 text-[11px]">
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Department</p>
                            <p className="font-bold text-slate-800">{getDeptCode(student.departmentId)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Cumulative GPA</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Award className="w-3 h-3 text-indigo-650" />
                              <p className="font-mono font-bold text-indigo-700">{student.gpa.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-[9px] font-mono text-slate-405">Attendance</p>
                            <p className="font-bold font-mono text-slate-800">{student.attendancePercent}%</p>
                          </div>
                          <div className="mt-1">
                            <p className="text-[9px] font-mono text-slate-405 font-medium">Secondary Liaison</p>
                            <p className="text-[10px] text-slate-800 leading-tight">{student.guardianName}</p>
                          </div>
                        </div>
                        {student.disciplinaryRecords && student.disciplinaryRecords.length > 0 && (
                          <div className="p-2 border border-rose-100 bg-rose-50 text-[10px]">
                            <p className="font-bold text-rose-800 flex items-center gap-1 uppercase tracking-wider text-[8px] mb-1">
                              <ShieldAlert className="w-3 h-3 text-rose-600" /> Administrative Alerts
                            </p>
                            <ul className="list-disc pl-3.5 space-y-0.5 text-slate-700 font-medium">
                              {student.disciplinaryRecords.map((rec, k) => (
                                <li key={k}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 pt-1">
                          <p className="font-bold uppercase tracking-wider text-[8px] text-slate-400 mb-1">Club Affiliations</p>
                          <p>{student.clubs.join(', ') || 'No extracurricular profiles registered.'}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Faculty/Staff Records Detail Card */}
                  {selectedResult.category === 'Staff' && (() => {
                    const staff = selectedResult.rawItem as Employee;
                    return (
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-[9px] font-mono text-slate-400 uppercase">Faculty Member</p>
                          <p className="font-display font-medium text-slate-900 text-sm leading-tight">{staff.name}</p>
                          <p className="text-[10px] text-indigo-600 font-semibold">{staff.role}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-200 text-[11px]">
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Division</p>
                            <p className="font-bold text-slate-800">{staff.department}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Staff Status</p>
                            <span className="font-semibold text-slate-850">{staff.status}</span>
                          </div>
                          <div className="mt-1">
                            <p className="text-[9px] font-mono text-slate-405">Attendance</p>
                            <p className="font-bold font-mono text-slate-750">{staff.attendanceRate}%</p>
                          </div>
                          <div className="mt-1">
                            <p className="text-[9px] font-mono text-slate-405">Appraisal Index</p>
                            <p className="font-bold text-emerald-700 font-mono">{staff.performanceScore}/100</p>
                          </div>
                        </div>
                        <div className="bg-slate-100 p-2 border border-slate-200 font-mono text-[9px] text-slate-755 break-all flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{staff.email}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Syllabus / Course Details Card */}
                  {selectedResult.category === 'Courses' && (() => {
                    const course = selectedResult.rawItem as Course;
                    return (
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-[9px] font-mono text-slate-400 uppercase">Course Catalog Unit</p>
                          <p className="font-display font-bold text-slate-900 text-sm">{course.name}</p>
                          <p className="text-[10px] text-indigo-600 font-bold font-mono mt-0.5">{course.code}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-200">
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Department</p>
                            <p className="font-bold text-slate-800 text-[11px]">{getDeptName(course.departmentId)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Credits Weight</p>
                            <p className="font-bold text-slate-800 font-mono text-[11px]">{course.credits} Hours/U</p>
                          </div>
                        </div>

                        {course.syllabus ? (
                          <div className="p-2 border border-slate-200 bg-white space-y-1">
                            <p className="font-bold uppercase text-[8px] tracking-wider text-slate-450">Syllabus Statement</p>
                            <p className="text-[10px] text-slate-600 italic leading-relaxed">{course.syllabus}</p>
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic">No formal curriculum statement file attached yet.</p>
                        )}
                        
                        {course.resources && course.resources.length > 0 && (
                          <div className="space-y-1">
                            <p className="font-bold uppercase text-[8px] tracking-wider text-slate-450">Readings & Documents</p>
                            <div className="flex flex-col gap-1">
                              {course.resources.map((resName, idx) => (
                                <div key={idx} className="flex items-center gap-1 bg-white border border-slate-150 p-1 font-mono text-[9px] text-slate-600">
                                  <CornerDownRight className="w-3 h-3 text-indigo-500" />
                                  <span className="truncate">{resName}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Library Document Details Card */}
                  {selectedResult.category === 'Library' && (() => {
                    const resource = selectedResult.rawItem as LibraryResource;
                    return (
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-[9px] font-mono text-slate-400 uppercase">Document & Media registry</p>
                          <p className="font-display font-medium text-slate-900 text-sm leading-tight">{resource.title}</p>
                          <p className="text-[10px] text-teal-650 font-bold mt-0.5">Author/Publisher: {resource.author}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-200">
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Category Section</p>
                            <p className="font-bold text-slate-800 text-[11px]">{resource.category}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Media Type</p>
                            <p className="font-bold text-slate-800 text-[11px]">{resource.type}</p>
                          </div>
                        </div>

                        <div className={`p-2 border text-[10px] font-medium ${
                          resource.available 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                            : 'bg-rose-50 border-rose-105 text-rose-800'
                        }`}>
                          <p className="font-bold uppercase tracking-wide text-[8px] mb-0.5">Circulation Status</p>
                          {resource.available ? (
                            <p>This document is currently available inside physical archives and can be matriculated online.</p>
                          ) : (
                            <div className="space-y-1">
                              <p>Currently borrowed out.</p>
                              <div className="flex items-center gap-1 font-mono text-[8px] text-rose-700 font-extrabold uppercase bg-white px-1 py-0.5 rounded-none border border-rose-100">
                                <Clock className="w-3 w-3" /> Due back: {resource.dueDate}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Billing Invoices Card Details */}
                  {selectedResult.category === 'Finance' && (() => {
                    const inv = selectedResult.rawItem as Invoice;
                    return (
                      <div className="mt-3 space-y-3">
                        <div>
                          <p className="text-[9px] font-mono text-slate-400 uppercase">Billing Invoice Voucher</p>
                          <p className="font-display font-medium text-slate-900 text-sm">{inv.studentName}</p>
                          <p className="text-[9px] text-slate-400 font-semibold font-mono">Invoice Voucher Code: #{inv.id}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-slate-200 text-[11px]">
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Fee Category</p>
                            <p className="font-bold text-slate-800">{inv.type} Ledger</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-slate-405">Outstanding Premium</p>
                            <p className="font-bold text-indigo-700 font-mono">${inv.amount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className={`p-2 border text-[10px] ${
                          inv.status === 'Paid' 
                            ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
                            : 'bg-amber-50 border-amber-150 text-amber-800 font-semibold'
                        }`}>
                          <p className="font-bold uppercase tracking-wider text-[8px] mb-0.5">Ledger Settlement Token</p>
                          {inv.status === 'Paid' ? (
                            <p>Syllabus fee allocation completed. Receipt matching clearance voucher #{inv.id}.</p>
                          ) : (
                            <p>Billing is outstanding. Remind Student to complete premium transfer process.</p>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <button
                    onClick={() => routeToCategoryPanel(selectedResult.category)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-[9px] py-2 px-3 rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer leading-5 shadow-none"
                  >
                    <span>Route To Module</span>
                    <ArrowRight className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-slate-400 p-4 space-y-1.5">
                <Layout className="w-6 h-6 text-slate-300" />
                <p className="font-display font-bold uppercase tracking-wider text-[8px] text-slate-500">Record inspector</p>
                <p className="text-[10px] text-slate-400 leading-normal max-w-[200px]">
                  Click on any search record item to pull its complete certified folder view.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
