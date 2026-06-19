/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FacilityBooking, Role } from '../types';
import { Building2, Calendar, Bus, PlusCircle, AlertCircle, Share2, ClipboardList } from 'lucide-react';

interface OperationsPanelProps {
  currentUserRole: Role;
  bookings: FacilityBooking[];
  onAddBooking: (booking: Omit<FacilityBooking, 'id' | 'status'>) => void;
  onUpdateBookingStatus: (id: string, status: 'Approved' | 'Cancelled') => void;
  announcements: { id: string; title: string; category: string; date: string; content: string; author: string }[];
  onAddAnnouncement: (ann: { title: string; category: string; content: string; author: string }) => void;
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function OperationsPanel({
  currentUserRole,
  bookings,
  onAddBooking,
  onUpdateBookingStatus,
  announcements,
  onAddAnnouncement,
  onLogAction,
}: OperationsPanelProps) {
  const [activeTab, setActiveTab] = useState<'facilities' | 'logistics' | 'messaging'>('facilities');

  // Booking Form State
  const [facilityName, setFacilityName] = useState('Seminar Hall A');
  const [bookingDate, setBookingDate] = useState('2026-06-25');
  const [timeSlot, setTimeSlot] = useState('10:00 - 13:00');
  const [purpose, setPurpose] = useState('');

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState('General');
  const [annContent, setAnnContent] = useState('');

  // Logistics simulated inventories
  const [inventories] = useState([
    { id: 'inv1', item: 'Dell OptiPlex workstations', qty: 45, dept: 'Computer Science', status: 'Optimal' },
    { id: 'inv2', item: 'Advanced Helium Plasma Tubes', qty: 3, dept: 'Physics', status: 'Maintenance Scheduled' },
    { id: 'inv3', item: 'Dry erase dual markers', qty: 120, dept: 'Administration', status: 'Needs Restock' }
  ]);
  const [transitRoutes] = useState([
    { id: 'r1', route: 'Campus North Corridor Shuttle', driver: 'Capt. David Anderson', vehicle: 'Shuttle Bus #04', capacity: '24 seats' },
    { id: 'r2', route: 'Metropolitan Downtown Loop', driver: 'Jeff Moreau', vehicle: 'Transit Bus #12', capacity: '45 seats' }
  ]);

  const canEditFacilities = ['Super Admin', 'HOD', 'Clerk & Executive', 'Teacher & Professor'].includes(currentUserRole);
  const canApproveBooking = ['Super Admin', 'Clerk & Executive'].includes(currentUserRole);
  const canPostNotices = ['Super Admin', 'Clerk & Executive', 'CEO & Director', 'HR'].includes(currentUserRole);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose) return;

    onAddBooking({
      facilityName,
      date: bookingDate,
      timeSlot,
      bookedBy: currentUserRole,
      purpose,
    });

    onLogAction(
      'Request Facility Lock',
      'Operations & Logistics',
      `Booked facility: ${facilityName} on ${bookingDate} (${timeSlot}) for: ${purpose}`
    );

    setPurpose('');
    alert('Room reservation request placed in scheduling queue!');
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    onAddAnnouncement({
      title: annTitle,
      category: annCategory,
      content: annContent,
      author: currentUserRole,
    });

    onLogAction(
      'Broadcast announcement',
      'Operations & Logistics',
      `Broadcast notice - [${annCategory}]: ${annTitle}`
    );

    setAnnTitle('');
    setAnnContent('');
    alert('notice board updated. Broadcast complete.');
  };

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in text-xs text-slate-705">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <Building2 className="w-4 h-4 text-indigo-655 shrink-0" />
            Operations, Logistics, & Pinned Notice Hub
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Lock down campus facilities, monitor assets inventory, and pin institutional notifications.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-none gap-1 text-[10px] font-bold uppercase tracking-wider self-start border border-slate-200">
          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'facilities' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Bookings</span>
          </button>
          
          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'logistics' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Bus className="w-3.5 h-3.5" /> Logistics</span>
          </button>

          <button
            onClick={() => setActiveTab('messaging')}
            className={`px-3 py-1.5 rounded-none transition cursor-pointer ${
              activeTab === 'messaging' ? 'bg-white text-indigo-600 border border-slate-200 shadow-none' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Notice Board</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* FACILITIES TAB */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {canEditFacilities ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-600" /> Space Booking Allocation
                  </h3>
                  <form onSubmit={handleBookingSubmit} className="space-y-3 font-sans">
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Target Room / Facility</label>
                      <select
                        value={facilityName}
                        onChange={(e) => setFacilityName(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      >
                        <option value="Seminar Hall A">Seminar Hall A (Main)</option>
                        <option value="Lab 403">Machine Learning Lab 403</option>
                        <option value="Conference Room 2B">Conference Room 2B</option>
                        <option value="Science Lab 10">Science Lab 10</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-550 font-bold uppercase tracking-wider text-[8px] mb-1">Reservation Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-550 font-bold uppercase tracking-wider text-[8px] mb-1">Time Slots</label>
                      <input
                        type="text"
                        required
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        placeholder="e.g. 10:00 - 13:00"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white font-mono text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Stated Purpose</label>
                      <input
                        type="text"
                        required
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="CS Syllabus outcome coordination"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-1"
                    >
                      Lodge Reserve Lock
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs text-slate-500 leading-relaxed text-center flex flex-col justify-center">
                  <p className="font-bold text-slate-901 uppercase tracking-wider text-[9px] font-display">Student Space Reservation</p>
                  <p className="mt-1">In student mode, room booking schedules are read-only. Contact your department HOD office to reserve labs or seminar assets.</p>
                </div>
              )}

              {/* Booking List */}
              <div className="flex-1 overflow-x-auto border border-slate-200 rounded-none">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-[0.12em] text-[8.5px]">
                    <tr>
                      <th className="p-3.5">Facility Name</th>
                      <th className="p-3.5">Schedule Slot</th>
                      <th className="p-3.5">Booked By</th>
                      <th className="p-3.5">Purpose Statement</th>
                      <th className="p-3.5">Lock Status</th>
                      {canApproveBooking && <th className="p-3.5 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bookings.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-3.5 font-bold text-slate-950">{book.facilityName}</td>
                        <td className="p-3.5">
                          <span className="font-mono bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-none text-[9px] text-indigo-705 font-bold">
                            {book.date} | {book.timeSlot}
                          </span>
                        </td>
                        <td className="p-3.5 italic text-slate-600 font-bold text-[10px] uppercase tracking-wider">{book.bookedBy}</td>
                        <td className="p-3.5 text-slate-500 max-w-xxs text-ellipsis overflow-hidden font-medium">{book.purpose}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                            book.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            book.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {book.status}
                          </span>
                        </td>
                        {canApproveBooking && (
                          <td className="p-3.5 text-right">
                            {book.status === 'Pending' ? (
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    onUpdateBookingStatus(book.id, 'Approved');
                                    onLogAction('Lock space allocation', 'Operations & Logistics', `Approved reservation for ${book.facilityName}`);
                                  }}
                                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-none px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-wider hover:bg-emerald-100 cursor-pointer transition"
                                >
                                  Lock Space
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateBookingStatus(book.id, 'Cancelled');
                                    onLogAction('Cancel space allocation', 'Operations & Logistics', `Cancelled reservation for ${book.facilityName}`);
                                  }}
                                  className="bg-red-50 text-red-800 border border-red-200 rounded-none px-2.5 py-1 text-[8.5px] font-extrabold uppercase tracking-wider hover:bg-red-100 cursor-pointer transition"
                                >
                                  Cancel Lock
                                </button>
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Archived</span>
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
        )}

        {/* LOGISTICS TAB */}
        {activeTab === 'logistics' && (
          <div className="space-y-6 animate-fade-in text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Asset Inventories list */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2"><ClipboardList className="w-4 h-4 text-indigo-600 shrink-0" /> Administrative Asset Inventory</h4>
                <div className="bg-white rounded-none border border-slate-200 overflow-hidden shadow-none">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-400 text-[8.5px] uppercase tracking-[0.12em]">
                      <tr>
                        <th className="p-3.5">Asset description</th>
                        <th className="p-3.5 font-mono">Qty</th>
                        <th className="p-3.5">Division Major</th>
                        <th className="p-3.5 text-right">Maintenance status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {inventories.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="p-3.5 font-bold text-slate-900">{inv.item}</td>
                          <td className="p-3.5 font-mono font-bold text-indigo-700 text-[11px]">{inv.qty}</td>
                          <td className="p-3.5 font-semibold text-slate-600">{inv.dept}</td>
                          <td className="p-3.5 text-right">
                            <span className={`inline-flex px-2 py-0.5 rounded-none border text-[8.5px] font-extrabold uppercase tracking-wide ${
                              inv.status === 'Optimal' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transport fleet */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2"><Bus className="w-4 h-4 text-indigo-655 shrink-0" /> Campus Fleet & Transit Corridors</h4>
                <div className="bg-white rounded-none border border-slate-200 overflow-hidden shadow-none">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-extrabold text-[8.5px] uppercase tracking-[0.12em]">
                      <tr>
                        <th className="p-3.5">Transit Route Name</th>
                        <th className="p-3.5">Authorized Pilot Driver</th>
                        <th className="p-3.5 text-right font-mono">Capacity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {transitRoutes.map((trans) => (
                        <tr key={trans.id} className="hover:bg-slate-50/50 transition duration-150">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{trans.route}</div>
                            <div className="text-[10px] text-slate-450 font-mono font-bold mt-0.5">{trans.vehicle}</div>
                          </td>
                          <td className="p-3.5 italic text-slate-600 font-bold">{trans.driver}</td>
                          <td className="p-3.5 text-right font-mono font-bold text-indigo-700">{trans.capacity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50 rounded-none border border-slate-200 text-[11px] leading-relaxed text-slate-600 font-medium">
                  <strong className="text-slate-900 font-bold uppercase tracking-wider text-[8px] block mb-1">MoE Logistics directive:</strong> All campus transport shuttle assets are tracked with GPS telemetry and undergo weekly emissions safety screening.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'messaging' && (
          <div className="space-y-6 animate-fade-in text-xs text-slate-700">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Post public announcement */}
              {canPostNotices ? (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider text-[10px] font-display border-b border-slate-200 pb-2">
                    <AlertCircle className="w-3.5 h-3.5 text-indigo-650 animate-pulse shrink-0" /> Pin Public Announcement
                  </h3>
                  <form onSubmit={handleAnnouncementSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Headline title</label>
                      <input
                        type="text"
                        required
                        value={annTitle}
                        onChange={(e) => setAnnTitle(e.target.value)}
                        placeholder="System Migration and MFA mandates"
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Category Segment Tag</label>
                      <select
                        value={annCategory}
                        onChange={(e) => setAnnCategory(e.target.value)}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      >
                        <option value="General">General / Administrative</option>
                        <option value="Academics">Academic Syllabus Bulletins</option>
                        <option value="Finance">Tuition & Finance Announcements</option>
                        <option value="Events">Campus Events & Logistics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Notice Body Content</label>
                      <textarea
                        required
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        placeholder="Attention all departments, the MoE syllabus compliance checklist is now fully locked down..."
                        rows={4}
                        className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-1"
                    >
                      Publish Broadcast Notice
                    </button>
                  </form>
                </div>
              ) : (
                <div className="w-full lg:w-1/3 bg-slate-50 p-5 rounded-none border border-slate-200 text-xs text-slate-605 leading-relaxed text-center flex flex-col justify-center">
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[9px] mb-2 font-display">Notice Board Limits</p>
                  <p>In student mode, broadcasting notice flyers is restricted. Contact department HOD officers to publish notices or club announcements.</p>
                </div>
              )}

              {/* Roster of Announcements */}
              <div className="flex-1 space-y-4">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2">Skyline Campus pinned bulletin Board</h4>
                
                <div className="space-y-3.5">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="bg-white p-4.5 rounded-none border border-slate-200 shadow-none relative hover:border-slate-400 transition duration-150">
                      <div className="flex justify-between items-start mb-2 gap-2 border-b border-slate-100 pb-1.5">
                        <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">{ann.title}</span>
                        <span className={`inline-flex px-2 py-0.5 rounded-none text-[8.5px] font-extrabold uppercase tracking-wider border ${
                          ann.category === 'Finance' ? 'bg-red-50 text-red-700 border-red-200' :
                          ann.category === 'Academics' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          ann.category === 'Events' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          'bg-slate-100 text-slate-650 border border-slate-200'
                        }`}>
                          {ann.category}
                        </span>
                      </div>
                      <p className="text-slate-550 leading-relaxed font-sans text-[11px] mb-3 font-medium">{ann.content}</p>
                      
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider pt-2 border-t border-slate-100">
                        <span>Pinned by: <span className="text-slate-600">{ann.author}</span></span>
                        <span>Stamp: <span className="text-slate-600 font-mono">{ann.date}</span></span>
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
