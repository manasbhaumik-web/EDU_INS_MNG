/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LibraryResource, Role } from '../types';
import { Library, Search, PlusCircle, Bookmark } from 'lucide-react';

interface LibraryPanelProps {
  currentUserRole: Role;
  resources: LibraryResource[];
  onBorrowResource: (id: string, borrowerName: string) => void;
  onReturnResource: (id: string) => void;
  onLogAction: (action: string, module: string, details: string) => void;
}

export default function LibraryPanel({
  currentUserRole,
  resources,
  onBorrowResource,
  onReturnResource,
  onLogAction,
}: LibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'E-Book' | 'Journal' | 'Physical Book'>('All');

  // Acquisitions Resource request state
  const [reqTitle, setReqTitle] = useState('');
  const [reqAuthor, setReqAuthor] = useState('');
  const [reqType, setReqType] = useState<'E-Book' | 'Journal' | 'Physical Book'>('E-Book');
  
  const [resourceRequests, setResourceRequests] = useState([
    { id: 'req-01', title: 'Advanced Neural Networks & Backprop', author: 'Geoffrey Hinton', type: 'E-Book', requestedBy: 'Prof. Helen Magnus', date: '2026-06-18' },
    { id: 'req-02', title: 'The Ultimate Guide to Astrophysics', author: 'Neil deGrasse Tyson', type: 'Physical Book', requestedBy: 'John Shepard', date: '2026-06-19' }
  ]);

  const handleAcquisitionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle || !reqAuthor) return;

    const newRequest = {
      id: 'req-' + (resourceRequests.length + 101),
      title: reqTitle,
      author: reqAuthor,
      type: reqType,
      requestedBy: currentUserRole,
      date: new Date().toISOString().split('T')[0]
    };

    setResourceRequests([...resourceRequests, newRequest]);
    onLogAction(
      'Library resource Request',
      'Online Library',
      `Requested book acquisition: ${reqTitle} by ${reqAuthor} (${reqType})`
    );

    setReqTitle('');
    setReqAuthor('');
    alert('Resource acquisition request submitted to library clerk pipeline.');
  };

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'All' || res.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-none border border-slate-200 shadow-none overflow-hidden animate-fade-in text-xs text-slate-705">
      <div className="border-b border-slate-200 bg-slate-50 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-[0.12em] font-display">
            <Library className="w-4 h-4 text-indigo-650 shrink-0" />
            Digital & Physical Campus Library
          </h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Access academic research journals, borrow physical references, or lodge procurement requests.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Library Search and Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center border border-slate-200 rounded-none px-3 py-2 bg-white">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Query catalog by book titles, authors, categories..."
                  className="w-full text-xs focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                value={selectedType}
                onChange={(e: any) => setSelectedType(e.target.value)}
                className="border border-slate-200 rounded-none p-2 bg-white font-bold uppercase tracking-wider text-[9px] text-slate-600 focus:outline-none"
              >
                <option value="All">All Resources</option>
                <option value="Physical Book">Physical Books</option>
                <option value="E-Book">E-Books & PDFs</option>
                <option value="Journal">Scientific Journals</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((res) => (
                <div key={res.id} className="bg-white p-4.5 rounded-none border border-slate-200 hover:border-slate-400 transition duration-150 flex flex-col justify-between shadow-none">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2 border-b border-slate-100 pb-1.5">
                      <span className="font-mono text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-none text-slate-650 uppercase font-extrabold tracking-wide">
                        {res.type}
                      </span>
                      <span className="text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 font-bold uppercase tracking-wider">
                        {res.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs sm:text-[12px] leading-tight mb-1 uppercase tracking-wide">{res.title}</h4>
                    <p className="text-slate-500 font-semibold mb-2">By <span className="text-slate-800">{res.author}</span></p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                    <div>
                      {res.available ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-250 px-2.5 py-0.5 rounded-none text-[8.5px] uppercase tracking-wider font-extrabold">Available</span>
                      ) : (
                        <div className="text-red-700 font-bold">
                          <span className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-none text-[8.5px] uppercase tracking-wider">In Use</span>
                          <p className="text-[9px] text-slate-450 mt-1 font-mono">B: {res.borrower} (Due: {res.dueDate})</p>
                        </div>
                      )}
                    </div>

                    <div>
                      {res.type === 'E-Book' ? (
                        <button
                          onClick={() => {
                            onLogAction('Read E-Book', 'Online Library', `Read digital copy of E-book: ${res.title}`);
                            alert(`Acquiring secure PDF portal connection for "${res.title}". Reading panel loading in separate secure session...`);
                          }}
                          className="bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 rounded-none py-1.5 px-3.5 text-[8.5px] font-extrabold uppercase tracking-wider transition cursor-pointer"
                        >
                          📖 Access PDF
                        </button>
                      ) : res.available ? (
                        <button
                          onClick={() => {
                            onBorrowResource(res.id, currentUserRole);
                            onLogAction('Borrow Book', 'Online Library', `Checked out physical publication: ${res.title}`);
                          }}
                          className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-none py-1.5 px-3.5 text-[8.5px] font-extrabold uppercase tracking-wider transition cursor-pointer"
                        >
                          Checkout Book
                        </button>
                      ) : (
                        res.borrower === currentUserRole && (
                          <button
                            onClick={() => {
                              onReturnResource(res.id);
                              onLogAction('Return Book', 'Online Library', `Returned physical publication: ${res.title}`);
                            }}
                            className="bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-none py-1.5 px-3.5 text-[8.5px] font-extrabold uppercase tracking-wider transition cursor-pointer"
                          >
                            Return Book
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acquisition procurement Requests columns */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-none border border-slate-200 shadow-none">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10px] border-b border-slate-200 pb-2">
                <PlusCircle className="w-3.5 h-3.5 text-indigo-650" /> Request Acquisition
              </h3>
              <form onSubmit={handleAcquisitionRequest} className="space-y-3 font-sans">
                <div>
                  <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Book / Publication Title</label>
                  <input
                    type="text"
                    required
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    placeholder="e.g. Clean Code in TypeScript"
                    className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Author Name</label>
                  <input
                    type="text"
                    required
                    value={reqAuthor}
                    onChange={(e) => setReqAuthor(e.target.value)}
                    placeholder="e.g. Robert C. Martin"
                    className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-505 font-bold uppercase tracking-wider text-[8px] mb-1">Format Type</label>
                  <select
                    value={reqType}
                    onChange={(e: any) => setReqType(e.target.value)}
                    className="w-full border border-slate-200 rounded-none p-2 bg-white text-xs focus:outline-none"
                  >
                    <option value="E-Book">Digital PDF / E-Book</option>
                    <option value="Physical Book">Physical Binding Book</option>
                    <option value="Journal">Research Journal</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold uppercase tracking-widest text-[9px] py-2.5 rounded-none transition cursor-pointer mt-1"
                >
                  Acquisition Request
                </button>
              </form>
            </div>

            <div className="space-y-3.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-[9px] font-display border-b border-slate-200 pb-2"><Bookmark className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> Pending procurements ({resourceRequests.length})</h4>
              <div className="space-y-2.5">
                {resourceRequests.map((req) => (
                  <div key={req.id} className="p-3.5 bg-white rounded-none border border-slate-200 shadow-none">
                    <p className="font-bold text-slate-900 leading-snug uppercase text-[10px] tracking-wide">{req.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">By {req.author} | Requested by: {req.requestedBy}</p>
                    <div className="flex justify-between items-center text-[8px] text-indigo-700 font-mono mt-2.5 font-extrabold uppercase bg-indigo-50 border border-indigo-150 p-1.5 rounded-none tracking-widest">
                      <span>Format: {req.type}</span>
                      <span className="animate-pulse">Active Verification</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
