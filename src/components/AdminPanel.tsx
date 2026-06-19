/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, AuditLog, Role } from '../types';
import { Shield, Users, Activity, Settings, Plus, Search, Trash, Terminal } from 'lucide-react';

interface AdminPanelProps {
  currentUserRole: Role;
  users: User[];
  auditLogs: AuditLog[];
  onAddUser: (u: Omit<User, 'id' | 'joinedDate'>) => void;
  onDeleteUser: (id: string) => void;
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function AdminPanel({
  currentUserRole,
  users,
  auditLogs,
  onAddUser,
  onDeleteUser,
  onLogAction,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'audit' | 'health'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('Student');
  const [newUserDept, setNewUserDept] = useState('');

  // Settings State
  const [institutionName, setInstitutionName] = useState('Skyline International University');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [emailIntegration, setEmailIntegration] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  // Checks
  const hasEditAccess = currentUserRole === 'Super Admin';
  const hasViewAccess = ['Super Admin', 'CEO & Director', 'HR'].includes(currentUserRole);

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    onAddUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept || undefined,
      status: 'Active',
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserDept('');
  };

  if (!hasViewAccess) {
    return (
      <div className="bg-white rounded-none p-8 border border-slate-200 text-center shadow-none animate-fade-in">
        <Shield className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">Access Restricted</h2>
        <p className="text-slate-500 mt-2 text-xs">
          Only Super Admins, CEOs & Directors, and HR personnel are permitted to view the Administration module.
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in">
      {/* Mini header/tabs */}
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
            Administration Hub
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Manage institutional records, configurations, and security protocols.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-none gap-1 text-[10px] font-bold uppercase tracking-wider self-start border border-slate-200">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'users' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Users & Access</span>
          </button>
          
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'audit' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> Audit log</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Settings className="w-3.5 h-3.5" /> Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'health' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" /> Engine health</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: USERS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Form to Create User (Visible only to Super Admin) */}
              {hasEditAccess ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-display border-b border-slate-200 pb-2">
                      <Plus className="w-3.5 h-3.5 text-indigo-600" />
                      Provision New User Account
                    </h3>
                    <form onSubmit={handleAddUserSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Arthur Pendragon"
                          className="w-full border border-slate-200 rounded-none p-2 bg-white focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Institutional Email</label>
                        <input
                          type="email"
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="prefix@edu.org"
                          className="w-full border border-slate-200 rounded-none p-2 bg-white focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Access Role Profile</label>
                        <select
                          value={newUserRole}
                          onChange={(e) => setNewUserRole(e.target.value as Role)}
                          className="w-full border border-slate-200 rounded-none p-2 bg-white focus:outline-none focus:border-indigo-600 text-xs"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="CEO & Director">CEO & Director</option>
                          <option value="HOD">HOD (Head of Department)</option>
                          <option value="HR">HR Officer</option>
                          <option value="Clerk & Executive">Clerk & Executive</option>
                          <option value="Teacher & Professor">Teacher & Professor</option>
                          <option value="Student">Student Portal</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1">Department Tag (Optional)</label>
                        <input
                          type="text"
                          value={newUserDept}
                          onChange={(e) => setNewUserDept(e.target.value)}
                          placeholder="e.g. Computer Science"
                          className="w-full border border-slate-200 rounded-none p-2 bg-white focus:outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] p-2.5 rounded-none transition shadow-none mt-2 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Provision Account
                      </button>
                    </form>
                  </div>
                  <div className="mt-4 p-4 bg-white text-slate-600 rounded-none border border-slate-200 text-[10px] leading-relaxed">
                    <strong className="text-slate-900 font-bold uppercase tracking-wider text-[8px] block mb-1">Super Admin Notice:</strong> Creating users automatically provisions database records and logs a security audit payload.
                  </div>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-slate-700 text-xs text-center flex flex-col justify-center">
                  <span className="font-bold block uppercase tracking-wider text-[9px] text-slate-900 mb-1">Read-Only Directory</span>
                  Creating or deleting accounts requires full administrative credentials.
                </div>
              )}

              {/* Right Column: User list & Filter */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center border border-slate-200 rounded-none px-3 py-2 bg-white">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search accounts catalog by name, email, or role profile..."
                    className="w-full text-xs focus:outline-none bg-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-none">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                        <th className="p-3.5">User Profile</th>
                        <th className="p-3.5">System Role</th>
                        <th className="p-3.5">Department</th>
                        <th className="p-3.5">Provisioned Date</th>
                        <th className="p-3.5">Status</th>
                        {hasEditAccess && <th className="p-3.5 text-right">Delete</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="p-3.5">
                            <div>
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-[10px] text-slate-450 font-mono mt-0.5">{u.email}</p>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                              u.role === 'Super Admin' ? 'bg-red-55 text-red-700 border-red-200' :
                              u.role === 'CEO & Director' ? 'bg-purple-50 text-purple-705 border-purple-200' :
                              u.role === 'HR' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                              u.role === 'Teacher & Professor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              u.role === 'Student' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-600">{u.department || 'N/A'}</td>
                          <td className="p-3.5 text-slate-500 font-mono text-[10px]">{u.joinedDate}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                              <span className="w-1.5 h-1.5 bg-emerald-500"></span> Active
                            </span>
                          </td>
                          {hasEditAccess && (
                            <td className="p-3.5 text-right">
                              {u.role !== 'Super Admin' ? (
                                <button
                                  onClick={() => {
                                    onDeleteUser(u.id);
                                    onLogAction('Delete User', 'Administration', `Revoked access for user ${u.name} (${u.email})`);
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded-none hover:bg-slate-100 transition cursor-pointer"
                                  title="Delete User"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Locked</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-display">System Audit Ledger</h3>
                <p className="text-[10px] text-slate-400 mt-1">Chronological record of high-authority administrative modifications, operations, and compliance checks.</p>
              </div>
              <button
                onClick={() => {
                  onLogAction('Export Logs', 'Administration', 'Super Admin triggered system backup of logs');
                  alert('Audit log dump generated. Secure encrypted transmission complete.');
                }}
                className="text-[9px] font-extrabold uppercase tracking-widest bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-none transition cursor-pointer"
              >
                Export Safe Ledger
              </button>
            </div>

            <div className="border border-slate-200 rounded-none overflow-hidden max-h-[450px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px] sticky top-0 bg-slate-50 z-10">
                  <tr>
                    <th className="p-3.5">Operator</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Module</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Decrypted Trace Log Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[10px]">
                  {auditLogs.slice().reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-indigo-50/10 transition">
                      <td className="p-3.5 font-bold text-slate-955 font-sans text-xs">{log.user}</td>
                      <td className="p-3.5 text-indigo-700 font-bold font-sans">{log.action}</td>
                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-750 px-2 py-0.5 rounded-none text-[8px] font-bold border border-slate-200 uppercase tracking-widest">
                          {log.module}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-450 font-sans">{log.timestamp}</td>
                      <td className="p-3.5 text-slate-700 max-w-sm overflow-hidden text-ellipsis font-sans text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-3 uppercase tracking-wider font-display">Global Campus Configurations</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-750">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1.5">Official Institution Title</label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    disabled={!hasEditAccess}
                    className="w-full border border-slate-200 rounded-none p-2.5 bg-white disabled:bg-slate-50 text-xs font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold uppercase tracking-wider text-[8px] mb-1.5">Active Academic Term cycle</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    disabled={!hasEditAccess}
                    className="w-full border border-slate-200 rounded-none p-2.5 bg-white disabled:bg-slate-50 text-xs text-indigo-600 font-mono font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-4.5 p-5 bg-slate-50 rounded-none border border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2">Automated Communications & Security</h4>
                
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailIntegration}
                    onChange={(e) => setEmailIntegration(e.target.checked)}
                    disabled={!hasEditAccess}
                    className="accent-indigo-600 w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[8.5px]">MoE Integration Sync Server</p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Automatically broadcast audit-level state changes directly to Ministry storage repositories.</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mfaEnabled}
                    onChange={(e) => setMfaEnabled(e.target.checked)}
                    disabled={!hasEditAccess}
                    className="accent-indigo-600 w-4 h-4 mt-0.5 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[8.5px]">Enforce MFA Authentication</p>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">Mandate cryptographic authentication checks prior to clerk ledger transaction approvals.</p>
                  </div>
                </label>
              </div>
            </div>

            {hasEditAccess && (
              <div className="flex justify-end gap-2 text-xs pt-5 border-t border-slate-200 mt-6">
                <button
                  onClick={() => {
                    onLogAction('Update Settings', 'Administration', `Updated global term to ${academicYear}`);
                    alert('Configurations securely saved to Cloud systems.');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold uppercase tracking-widest text-[9px] px-5 py-2.5 rounded-none transition cursor-pointer"
                >
                  Apply System Configurations
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: HEALTH MONITORING */}
        {activeTab === 'health' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-3 uppercase tracking-wider font-display text-xs">Technical Engine Health Indicators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-none border border-slate-200">
                <p className="text-slate-450 font-bold uppercase tracking-wider text-[8.5px]">Core API Response Rate</p>
                <p className="text-xl font-light text-slate-900 font-display mt-2">99.98%</p>
                <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider mt-1">Operational (28 ms Latency)</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-none border border-slate-200">
                <p className="text-slate-450 font-bold uppercase tracking-wider text-[8.5px]">V8 Memory Allocation</p>
                <p className="text-xl font-light text-slate-900 font-display mt-2">1.4 GB / 4.0 GB</p>
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider mt-1">Garbage Collector Optimal</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-none border border-slate-200">
                <p className="text-slate-450 font-bold uppercase tracking-wider text-[8.5px]">Persistent Connections</p>
                <p className="text-xl font-light text-slate-900 font-display mt-2">112 Sockets Active</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Websocket Channels Connected</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-none border border-slate-200">
                <p className="text-slate-450 font-bold uppercase tracking-wider text-[8.5px]">Sync Pipeline Hub</p>
                <p className="text-xl font-light text-slate-900 font-display mt-2">100% Locked</p>
                <p className="text-[10px] text-purple-600 font-semibold uppercase tracking-wider mt-1">Last MOE Heartbeat: 6s ago</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
