/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ComplianceCheck, Role } from '../types';
import { ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

interface CompliancePanelProps {
  currentUserRole: Role;
  checks: ComplianceCheck[];
  onTriggerAudit: (id: string) => void;
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function CompliancePanel({
  currentUserRole,
  checks,
  onTriggerAudit,
  onLogAction,
}: CompliancePanelProps) {
  const [lastAuditDate, setLastAuditDate] = useState('2026-06-15');

  const offersEditRight = ['Super Admin', 'CEO & Director'].includes(currentUserRole);
  const belongsToStaff = ['Super Admin', 'CEO & Director', 'HR', 'HOD', 'Clerk & Executive'].includes(currentUserRole);

  if (!belongsToStaff) {
    return (
      <div className="bg-white rounded-none p-8 border border-slate-200 text-center animate-fade-in shadow-none">
        <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Access Restricted</h2>
        <p className="text-slate-550 mt-2 text-xs">
          MOE Auditing directories are restricted files. Choose an administrative staff profile to verify compliance.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in text-xs text-slate-705">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <ShieldAlert className="w-4 h-4 text-indigo-650 shrink-0" />
            Ministry of Education Compliance Registry
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Audit syllabus distributions, fiscal solvency levels, and staffing credentials templates.</p>
        </div>
      </div>

      <div className="p-6 text-xs text-slate-700">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main checks list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 border border-slate-200 p-4.5 rounded-none leading-relaxed">
              <div>
                <p className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">Accreditorial Status Rating: EXCELLENT (Grade A+)</p>
                <p className="text-slate-500 text-[10px] mt-1 font-medium">Skyline Campus holds 100% legal accreditation status under MOE Statutory Charter #401-E.</p>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <span className="font-mono text-indigo-700 font-extrabold bg-white border border-slate-200 px-2.5 py-1 rounded-none text-[10px]">VERIFIED: {lastAuditDate}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {checks.map((check) => (
                <div key={check.id} className="bg-white p-4.5 rounded-none border border-slate-200 relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">{check.name}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                      check.status === 'Compliant' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      check.status === 'Non-Compliant' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                      'bg-amber-50 text-amber-700 border-amber-250'
                    }`}>
                      {check.status === 'Compliant' ? <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-3 h-3 text-red-500 shrink-0 animate-pulse" />}
                      {check.status}
                    </span>
                  </div>

                  <p className="text-slate-500 font-medium text-[11px] leading-relaxed">{check.description}</p>
                  
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-100 pt-2.5">
                    <span>Category: <span className="text-slate-600">{check.category}</span></span>
                    <span>Last audited: <span className="text-slate-600 font-mono font-medium">{check.lastUpdated}</span></span>
                    {offersEditRight && (
                      <button
                        onClick={() => {
                          onTriggerAudit(check.id);
                          onLogAction('Re-run MOE Audit', 'MOE Compliance', `Revalidated statutory criteria for: ${check.name}`);
                        }}
                        className="text-[9px] bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest py-1 px-2.5 rounded-none transition cursor-pointer"
                      >
                        Re-evaluate Criteria File
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate design */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-none border border-slate-200 text-center flex flex-col justify-between items-center relative aspect-square shadow-none">
              <span className="absolute top-2 right-2 text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-none text-[8px] uppercase tracking-wider font-extrabold">MoE Accredited</span>
              <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center p-2 mt-4 text-indigo-650 shadow-none text-xl leading-tight">
                📜
              </div>
              <div className="space-y-1 mt-4">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] font-display">Charter Compliance certificate</h4>
                <p className="text-[10px] text-slate-450 font-semibold uppercase tracking-wide">Skyline International University Corporation</p>
                <div className="text-[10px] leading-relaxed italic text-slate-500 max-w-xxs mx-auto mt-2 font-medium">
                  "Certified and audited compliant under Chapter 12: High-Performance Educational Infrastructure Management."
                </div>
              </div>
              
              <div className="w-full border-t border-dashed border-slate-200 pt-3 text-[9px] text-slate-400 mt-4 flex justify-between font-mono font-bold uppercase tracking-wider">
                <span>Cert code: SM-48902B-26</span>
                <span>Audit rating: 98.4%</span>
              </div>
            </div>

            {offersEditRight && (
              <button
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setLastAuditDate(today);
                  onLogAction('Global Audits Check', 'MOE Compliance', 'CEO triggered global compliance audit sweep across all active departments');
                  alert('Successfully completed complete campus compliance sweep! Academic, HR, and Ledger matrices revalidated.');
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer flex items-center justify-center gap-1 hover:bg-slate-850"
              >
                Trigger Global Compliance Audits
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
