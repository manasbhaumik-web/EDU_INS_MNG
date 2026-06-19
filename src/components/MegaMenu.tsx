/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Role } from '../types';
import { BookOpen, GraduationCap, Users, Shield, DollarSign, Building2, Library, ClipboardList, Briefcase, ChevronDown, TrendingUp } from 'lucide-react';

interface MegaMenuProps {
  currentUserRole: Role;
  activeModule: string;
  onSelectModule: (moduleName: string) => void;
}

export default function MegaMenu({
  currentUserRole,
  activeModule,
  onSelectModule,
}: MegaMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setClickedItem(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isLinkVisible = (roleTag: string, role: Role): boolean => {
    if (roleTag === 'All') return true;
    if (role === 'Super Admin') return true;

    switch (roleTag) {
      case 'Admin/HOD':
        return ['CEO & Director', 'HOD'].includes(role);
      case 'Faculty':
        return ['CEO & Director', 'HOD', 'Teacher & Professor'].includes(role);
      case 'Staff':
      case 'All Staff':
        return ['CEO & Director', 'HOD', 'HR', 'Clerk & Executive', 'Teacher & Professor'].includes(role);
      case 'Clerk/HOD':
        return ['CEO & Director', 'HOD', 'Clerk & Executive'].includes(role);
      case 'Director/Admin':
      case 'Admin/CEO':
      case 'Director':
      case 'Counselors/CEO':
        return ['CEO & Director'].includes(role);
      case 'Admin/Clerk':
      case 'Clerk/Admin':
        return ['CEO & Director', 'Clerk & Executive'].includes(role);
      case 'Staff/Student':
        return true; // accessible to anyone (both staff and students)
      case 'HR/Admin':
      case 'HR':
        return ['CEO & Director', 'HR'].includes(role);
      case 'HOD/CEO':
      case 'Director/HOD':
        return ['CEO & Director', 'HOD'].includes(role);
      case 'Super Admin':
        return false;
      default:
        return true;
    }
  };

  // Configuration for top-level navigation categories and their sub-menus
  const navCategories = [
    {
      name: 'Dashboard',
      icon: <Briefcase className="w-4 h-4" />,
      directLink: 'Dashboard',
    },
    {
      name: 'Academics',
      icon: <BookOpen className="w-4 h-4" />,
      subsections: [
        {
          title: 'Courses & Syllabus',
          links: [
            { label: 'Course Catalog', targetModule: 'Academics', roleTag: 'All' },
            { label: 'Curriculum Designer', targetModule: 'Academics', roleTag: 'Admin/HOD' },
            { label: 'Syllabus Management', targetModule: 'Academics', roleTag: 'Faculty' },
            { label: 'Learning Resources', targetModule: 'Academics', roleTag: 'All' }
          ]
        },
        {
          title: 'Classes & Sessions',
          links: [
            { label: 'Timetable Scheduling', targetModule: 'Academics', roleTag: 'Staff' },
            { label: 'Session Management', targetModule: 'Academics', roleTag: 'Faculty' },
            { label: 'Virtual Lecture Desks', targetModule: 'Academics', roleTag: 'All' }
          ]
        }
      ]
    },
    {
      name: 'Admissions',
      icon: <ClipboardList className="w-4 h-4" />,
      subsections: [
        {
          title: 'Intake Bureau',
          links: [
            { label: 'Applicant Tracker Registry', targetModule: 'Admissions', roleTag: 'Clerk/HOD' },
            { label: 'Capacity & Ratio checks', targetModule: 'Admissions', roleTag: 'Director/Admin' },
            { label: 'Matriculation Onboarding', targetModule: 'Admissions', roleTag: 'Admin/Clerk' }
          ]
        }
      ]
    },
    {
      name: 'Students',
      icon: <GraduationCap className="w-4 h-4" />,
      subsections: [
        {
          title: 'Student Profiles',
          links: [
            { label: 'Academic Dossiers', targetModule: 'Students', roleTag: 'Staff/Student' },
            { label: 'Incident Records Ledger', targetModule: 'Students', roleTag: 'Admin/HOD' },
            { label: 'Clubs & Extra-curriculars', targetModule: 'Students', roleTag: 'All' }
          ]
        },
        {
          title: 'Attendance Monitors',
          links: [
            { label: 'Instructor Absence Marking', targetModule: 'Students', roleTag: 'Faculty' },
            { label: 'Absence Trigger Notifications', targetModule: 'Students', roleTag: 'All' }
          ]
        }
      ]
    },
    {
      name: 'Staff & HR',
      icon: <Users className="w-4 h-4" />,
      subsections: [
        {
          title: 'Staff Management',
          links: [
            { label: 'Employee Files Director', targetModule: 'Staff & HR', roleTag: 'HR/Admin' },
            { label: 'On-boarding Paperworks', targetModule: 'Staff & HR', roleTag: 'HR' },
            { label: 'Performance Appraisals', targetModule: 'Staff & HR', roleTag: 'Admin/HOD' }
          ]
        },
        {
          title: 'Time & Leave Requests',
          links: [
            { label: 'Vacancy & Leave Balances', targetModule: 'Staff & HR', roleTag: 'All Staff' },
            { label: 'Authorizations Desk', targetModule: 'Staff & HR', roleTag: 'HR' }
          ]
        }
      ]
    },
    {
      name: 'Finance',
      icon: <DollarSign className="w-4 h-4" />,
      subsections: [
        {
          title: 'Fee administration',
          links: [
            { label: 'Invoice Generations Registry', targetModule: 'Finance', roleTag: 'Admin/Clerk' },
            { label: 'Collected Outstanding Balances', targetModule: 'Finance', roleTag: 'Director' }
          ]
        },
        {
          title: 'Budgets & Expense claims',
          links: [
            { label: 'Department Division Budgets', targetModule: 'Finance', roleTag: 'HOD/CEO' },
            { label: 'Requisition Claims Desk', targetModule: 'Finance', roleTag: 'Staff' }
          ]
        }
      ]
    },
    {
      name: 'Operations',
      icon: <Building2 className="w-4 h-4" />,
      subsections: [
        {
          title: 'Facilities assets',
          links: [
            { label: 'Space & Lab Bookings', targetModule: 'Operations', roleTag: 'Staff' },
            { label: 'Logistics Asset Directories', targetModule: 'Operations', roleTag: 'Clerk/Admin' }
          ]
        },
        {
          title: 'Logistics fleet',
          links: [
            { label: 'Transport Route Allocator', targetModule: 'Operations', roleTag: 'All' },
            { label: 'Broadcast notice Board', targetModule: 'Operations', roleTag: 'Staff' }
          ]
        }
      ]
    },
    {
      name: 'Library',
      icon: <Library className="w-4 h-4" />,
      subsections: [
        {
          title: 'Circulation & catalog',
          links: [
            { label: 'Factual Publication Search', targetModule: 'Library', roleTag: 'All' },
            { label: 'Check-outs Borrowing Desk', targetModule: 'Library', roleTag: 'All' },
            { label: 'Acquisitions Request channels', targetModule: 'Library', roleTag: 'All' }
          ]
        }
      ]
    },
    {
      name: 'Administration',
      icon: <Shield className="w-4 h-4" />,
      subsections: [
        {
          title: 'Configurations & Registry',
          links: [
            { label: 'Cryptographic Security settings', targetModule: 'Administration', roleTag: 'Super Admin' },
            { label: 'System health Indicators', targetModule: 'Administration', roleTag: 'Admin/CEO' }
          ]
        },
        {
          title: 'MOE & Audit Logs',
          links: [
            { label: 'MOE Statutory Compliance', targetModule: 'MOE Compliance', roleTag: 'Staff' },
            { label: 'Chronological Audit trails', targetModule: 'Administration', roleTag: 'Admin/CEO' }
          ]
        }
      ]
    },
    {
      name: 'Reports',
      icon: <TrendingUp className="w-4 h-4" />,
      subsections: [
        {
          title: 'Consolidated Records Audits',
          links: [
            { label: 'Pre-configured Strategic reports', targetModule: 'Reports', roleTag: 'Director/HOD' },
            { label: 'AI Retention forecasting charts', targetModule: 'Reports', roleTag: 'Counselors/CEO' }
          ]
        }
      ]
    }
  ];

  return (
    <nav ref={navRef} className="relative bg-white border-b border-slate-200 text-slate-800 z-30 font-sans shadow-none select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center h-12 gap-1 md:gap-2 overflow-visible">
          {navCategories.filter((cat) => {
            if (cat.directLink !== undefined) return true;
            if (!cat.subsections) return false;
            return cat.subsections.some(sub =>
              sub.links.some(link => isLinkVisible(link.roleTag, currentUserRole))
            );
          }).map((cat) => {
            const isDirect = cat.directLink !== undefined;
            const isHovered = hoveredItem === cat.name;
            const isClicked = clickedItem === cat.name;
            const isDropdownOpen = isHovered || isClicked;

            return (
              <div
                key={cat.name}
                className="relative inline-block h-full group"
                onMouseEnter={() => !isDirect && setHoveredItem(cat.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Main Link/Header */}
                <button
                  onClick={() => {
                    if (isDirect) {
                      onSelectModule(cat.directLink!);
                      setClickedItem(null);
                      setHoveredItem(null);
                    } else {
                      // Toggle the dropdown state for clicks (essential for click-to-open or mobile touch)
                      setClickedItem(isClicked ? null : cat.name);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 h-full text-[11px] font-bold uppercase tracking-wider transition relative focus:outline-none border-b-2 cursor-pointer ${
                    activeModule === cat.name || (cat.directLink && activeModule === cat.directLink)
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900 group-hover:text-indigo-600'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.name}</span>
                  {!isDirect && <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />}
                </button>

                {/* MEGA MENU DROPDOWN PANEL */}
                {!isDirect && cat.subsections && (
                  <div className={`absolute left-0 top-12 bg-white rounded-none shadow-lg border border-slate-200 p-6 z-50 min-w-[340px] max-w-lg lg:min-w-[420px] transition-all duration-150 origin-top-left ${
                    isDropdownOpen
                      ? 'opacity-100 pointer-events-auto scale-100 flex'
                      : 'opacity-0 pointer-events-none scale-95 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 flex'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
                      {cat.subsections.map((sub, idx) => {
                        const visibleLinks = sub.links.filter(link =>
                          isLinkVisible(link.roleTag, currentUserRole)
                        );
                        if (visibleLinks.length === 0) return null;

                        return (
                          <div key={idx} className="space-y-2.5">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 pb-1">
                              {sub.title}
                            </h4>
                            <ul className="space-y-1.5 text-xs">
                              {visibleLinks.map((link, j) => (
                                <li key={j}>
                                  <button
                                    onClick={() => {
                                      onSelectModule(link.targetModule);
                                      setClickedItem(null);
                                      setHoveredItem(null);
                                    }}
                                    className="w-full text-left py-1 text-slate-600 hover:text-indigo-600 transition flex items-center justify-between font-bold uppercase tracking-wider text-[10px]"
                                  >
                                    <span>{link.label}</span>
                                    {link.roleTag !== 'All' && (
                                      <span className="text-[8px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded-sm font-bold border border-slate-200 group-hover:bg-slate-200">
                                        {link.roleTag}
                                      </span>
                                    )}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
