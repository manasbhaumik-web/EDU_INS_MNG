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

  // Predefined Top Level Single Word Categories
  const navCategories = [
    {
      name: 'Dashboard',
      icon: <Briefcase className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop',
      directLink: 'Dashboard',
    },
    {
      name: 'Academics',
      icon: <BookOpen className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=300&auto=format&fit=crop',
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
      icon: <ClipboardList className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=300&auto=format&fit=crop',
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
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300&auto=format&fit=crop',
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
      name: 'Staff',
      icon: <Users className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop',
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
      icon: <DollarSign className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=crop',
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
      icon: <Building2 className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop',
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
      icon: <Library className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=300&auto=format&fit=crop',
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
      icon: <Shield className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=300&auto=format&fit=crop',
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
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      imageIcon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop',
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
        <div className="flex items-center min-h-14 gap-1 md:gap-1.5 overflow-visible py-1 flex-wrap md:flex-nowrap">
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

            const isCurrentActive =
              activeModule === cat.name ||
              (cat.name === 'Staff' && activeModule === 'Staff & HR') ||
              (cat.directLink && activeModule === cat.directLink);

            return (
              <div
                key={cat.name}
                className="relative inline-block h-full shrink-0 group"
                onMouseEnter={() => !isDirect && setHoveredItem(cat.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Main Link/Header Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isDirect) {
                      onSelectModule(cat.directLink!);
                      setClickedItem(null);
                      setHoveredItem(null);
                    } else {
                      setClickedItem(isClicked ? null : cat.name);
                    }
                  }}
                  className={`flex items-center gap-2 px-2.5 h-12 text-[10px] font-bold uppercase tracking-wider transition relative focus:outline-none border-b-2 cursor-pointer ${
                    isCurrentActive
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900 group-hover:text-indigo-600'
                  }`}
                >
                  {/* Reverted back to previous rectangular/square high-quality visual style with subtle border */}
                  <img
                    src={cat.imageIcon}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-none border border-slate-200 object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <span>{cat.name}</span>
                  {!isDirect && <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-indigo-650 transition-colors" />}
                </button>

                {/* MEGA MENU DROPDOWN PANEL - positioned absolutely below parent element using top-full to eliminate hover gap */}
                {!isDirect && cat.subsections && isDropdownOpen && (
                  <div className="absolute left-0 top-full bg-white rounded-none shadow-xl border border-slate-200 p-6 z-50 min-w-[500px] max-w-2xl lg:min-w-[620px] transition-all duration-150 origin-top-left flex">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                      
                      {/* Left side panel: thematic imagery card representation of the menu module */}
                      <div className="bg-indigo-50/50 p-4 border border-indigo-100 flex flex-col justify-between">
                        <div>
                          <span className="text-[8px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                            Oxford Hub
                          </span>
                          <h4 className="text-xs font-display font-bold text-slate-900 uppercase tracking-tight mt-1.5 leading-tight">
                            {cat.name} System
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-normal mt-1.5 font-sans">
                            Operational registry maps, access logs, and core statutory clearances.
                          </p>
                        </div>
                        <div className="mt-4 relative overflow-hidden h-24 border border-indigo-200">
                          <img
                            src={cat.imageIcon}
                            alt={cat.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                        </div>
                      </div>

                      {/* Right side subsections columns */}
                      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cat.subsections.map((sub, idx) => {
                          const visibleLinks = sub.links.filter(link =>
                            isLinkVisible(link.roleTag, currentUserRole)
                          );
                          if (visibleLinks.length === 0) return null;

                          return (
                            <div key={idx} className="space-y-2">
                              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.12em] border-b border-indigo-100 pb-1">
                                {sub.title}
                              </h4>
                              <ul className="space-y-1">
                                {visibleLinks.map((link, j) => (
                                  <li key={j}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onSelectModule(link.targetModule);
                                        setClickedItem(null);
                                        setHoveredItem(null);
                                      }}
                                      className="w-full text-left py-1 text-slate-600 hover:text-indigo-650 transition flex items-center justify-between font-bold uppercase tracking-wider text-[9px] cursor-pointer"
                                    >
                                      <span>{link.label}</span>
                                      {link.roleTag !== 'All' && (
                                        <span className="text-[7.5px] bg-indigo-50 text-indigo-700 px-1 py-0.5 font-bold border border-indigo-150">
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
