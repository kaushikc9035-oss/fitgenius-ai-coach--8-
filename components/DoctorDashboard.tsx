import React, { useState } from 'react';
import { UserProfile, HealthLog } from '../types';

interface DoctorDashboardProps {
  patients: UserProfile[];
  onPrescribe: (patientId: string, pills: string[]) => void;
  onViewFamilyTree: (patient: UserProfile) => void;
  onLinkFamily: (patientId: string, familyId: string, relationship: string) => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ patients, onPrescribe, onViewFamilyTree, onLinkFamily }) => {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [newPill, setNewPill] = useState('');
  const [familyIdInput, setFamilyIdInput] = useState('');
  const [relationshipInput, setRelationshipInput] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || null;

  const handleAddPill = () => {
    if (!selectedPatient || !newPill.trim()) return;
    const updatedPills = [...(selectedPatient.prescribedPills || []), newPill.trim()];
    onPrescribe(selectedPatient.id, updatedPills);
    setNewPill('');
  };

  const handleRemovePill = (pillToRemove: string) => {
    if (!selectedPatient) return;
    const updatedPills = (selectedPatient.prescribedPills || []).filter(p => p !== pillToRemove);
    onPrescribe(selectedPatient.id, updatedPills);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh] animate-fade-in">
      {/* Patient List Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <div className="glass p-6 rounded-2xl border border-white/5 bg-ll-surface/30 shadow-xl">
          <h2 className="text-xl font-bold text-ll-text font-syne flex items-center gap-3">
            <div className="w-2 h-6 bg-ll-accent rounded-full shadow-lg shadow-ll-accent/20"></div>
            Patient Directory
          </h2>
          <p className="text-ll-text-muted text-[10px] font-bold mt-1 uppercase tracking-widest opacity-50">Active Clinical Cases</p>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] lg:max-h-none pr-2 custom-scrollbar">
          {patients.length === 0 ? (
            <div className="p-8 text-center glass rounded-2xl border border-white/5 border-dashed">
              <p className="text-ll-text-muted text-sm font-medium">No patients found.</p>
            </div>
          ) : (
            patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center gap-4 group
                  ${selectedPatientId === patient.id 
                    ? 'bg-ll-accent/10 border-ll-accent/30 shadow-inner' 
                    : 'glass border-white/5 hover:border-ll-accent/20 hover:bg-ll-text/5'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-colors
                  ${selectedPatientId === patient.id ? 'bg-ll-accent text-white shadow-lg shadow-ll-accent/20' : 'bg-ll-text/5 text-ll-text-muted group-hover:bg-ll-accent/20 group-hover:text-ll-accent'}`}>
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold truncate ${selectedPatientId === patient.id ? 'text-ll-text' : 'text-ll-text-muted'}`}>
                    {patient.name}
                  </p>
                  <p className="text-[10px] text-ll-text-muted/50 font-bold uppercase tracking-widest truncate">
                    {patient.healthIssues || 'General Wellness'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Patient Detail Area */}
      <div className="flex-1">
        {!selectedPatient ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 glass rounded-[2.5rem] border border-white/5 border-dashed">
            <div className="w-20 h-20 bg-ll-text/5 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-ll-text-muted opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-ll-text font-syne">Select a Patient</h3>
            <p className="text-ll-text-muted max-w-xs mt-2 font-medium">Choose a patient from the directory to view their clinical history and daily feedback.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Patient Header Card */}
            <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-ll-surface/30 shadow-2xl">
              <div className="flex flex-wrap justify-between items-start gap-6">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-ll-accent to-ll-accent2 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-ll-accent/20 font-syne">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-ll-text font-syne tracking-tight">{selectedPatient.name}</h2>
                    <div className="flex gap-3 mt-2">
                      <span className="px-3 py-1 bg-ll-text/5 text-ll-text-muted rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {selectedPatient.age} YRS
                      </span>
                      <span className="px-3 py-1 bg-ll-text/5 text-ll-text-muted rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {selectedPatient.gender}
                      </span>
                      <span className="px-3 py-1 bg-ll-accent/10 text-ll-accent rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {selectedPatient.weight} KG
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-[0.2em] mb-1 opacity-50">Primary Diagnosis</p>
                    <p className="text-xl font-bold text-ll-accent font-syne">{selectedPatient.healthIssues || 'No reported issues'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onViewFamilyTree(selectedPatient)}
                      className="px-4 py-2 bg-ll-accent/10 text-ll-accent border border-ll-accent/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ll-accent/20 transition-all flex items-center gap-2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      View Family Tree
                    </button>
                    <button 
                      onClick={() => {
                        setFamilyIdInput(selectedPatient.familyId || '');
                        setRelationshipInput(selectedPatient.familyRelationship || '');
                        setShowLinkModal(true);
                      }}
                      className="px-4 py-2 bg-ll-text/5 text-ll-text-muted border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ll-text/10 transition-all"
                    >
                      Link Family
                    </button>
                  </div>
                </div>
              </div>

              {showLinkModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ll-bg/80 backdrop-blur-md animate-in fade-in duration-300">
                  <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-ll-surface/90 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
                    <h3 className="text-2xl font-black text-ll-text font-syne mb-2">Link to Family</h3>
                    <p className="text-ll-text-muted text-sm font-medium mb-8">Group patients under a single family record for clinical analysis.</p>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest ml-1">Family ID</label>
                        <input 
                          type="text" 
                          value={familyIdInput}
                          onChange={(e) => setFamilyIdInput(e.target.value)}
                          placeholder="e.g., SMITH-FAMILY-001"
                          className="w-full bg-ll-text/5 border border-white/10 rounded-2xl px-6 py-4 text-ll-text focus:ring-2 focus:ring-ll-accent/50 outline-none transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest ml-1">Relationship to Family</label>
                        <select 
                          value={relationshipInput}
                          onChange={(e) => setRelationshipInput(e.target.value)}
                          className="w-full bg-ll-text/5 border border-white/10 rounded-2xl px-6 py-4 text-ll-text focus:ring-2 focus:ring-ll-accent/50 outline-none transition appearance-none"
                        >
                          <option value="">Select Relationship</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Child">Child</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Grandparent">Grandparent</option>
                          <option value="Self">Self (Primary)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                      <button 
                        onClick={() => setShowLinkModal(false)}
                        className="flex-1 py-4 rounded-2xl text-[10px] font-black text-ll-text-muted uppercase tracking-widest hover:bg-ll-text/5 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          onLinkFamily(selectedPatient.id, familyIdInput, relationshipInput);
                          setShowLinkModal(false);
                        }}
                        className="flex-1 py-4 bg-ll-accent text-ll-bg rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-ll-accent/20 hover:opacity-90 transition-all"
                      >
                        Save Link
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest opacity-50">Activity Level</p>
                  <p className="font-bold text-ll-text">{selectedPatient.activityLevel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest opacity-50">Food Preference</p>
                  <p className="font-bold text-ll-text">{selectedPatient.foodPreference}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest opacity-50">Patient Since</p>
                  <p className="font-bold text-ll-text">{new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Prescriptions Section */}
              <div className="xl:col-span-1 glass p-8 rounded-[2.5rem] border border-white/5 bg-ll-surface/30 shadow-xl h-fit">
                <h3 className="text-lg font-bold text-ll-text font-syne mb-6 flex items-center gap-3">
                  <svg className="w-5 h-5 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Prescribed Pills
                </h3>
                
                <div className="space-y-3 mb-6">
                  {(!selectedPatient.prescribedPills || selectedPatient.prescribedPills.length === 0) ? (
                    <p className="text-ll-text-muted text-sm italic opacity-50">No medications prescribed.</p>
                  ) : (
                    selectedPatient.prescribedPills.map((pill, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-ll-text/5 rounded-xl border border-white/5 group">
                        <span className="text-sm font-bold text-ll-text">{pill}</span>
                        <button 
                          onClick={() => handleRemovePill(pill)}
                          className="text-ll-text-muted/30 hover:text-ll-danger transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPill}
                    onChange={(e) => setNewPill(e.target.value)}
                    placeholder="Add medication..."
                    className="flex-1 bg-ll-text/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-ll-text focus:ring-2 focus:ring-ll-accent/50 outline-none transition"
                  />
                  <button 
                    onClick={handleAddPill}
                    className="p-2 bg-ll-accent text-white rounded-xl hover:bg-ll-accent/80 transition-all shadow-lg shadow-ll-accent/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </button>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="xl:col-span-2 space-y-6">
                <div className="glass p-8 rounded-[2.5rem] border border-white/5 bg-ll-surface/30 shadow-xl">
                  <h3 className="text-xl font-bold text-ll-text font-syne mb-8 flex items-center gap-3">
                    <svg className="w-6 h-6 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Clinical Feedback Timeline
                  </h3>

                  {(!selectedPatient.healthLogs || selectedPatient.healthLogs.length === 0) ? (
                    <div className="py-12 text-center glass rounded-3xl border border-white/5 border-dashed">
                      <p className="text-ll-text-muted font-medium">No clinical logs available for this patient.</p>
                    </div>
                  ) : (
                    [...selectedPatient.healthLogs].reverse().map((log, idx) => (
                      <div key={idx} className="mb-10 last:mb-0 relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-white/5">
                        <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-ll-accent shadow-[0_0_10px_rgba(var(--ll-accent-rgb),0.5)]"></div>
                        
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="text-xl font-black text-ll-text font-syne">
                                  {new Date(log.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${log.medicationTaken ? 'bg-ll-accent3/10 text-ll-accent3' : 'bg-ll-danger/10 text-ll-danger'}`}>
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={log.medicationTaken ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} /></svg>
                                  {log.medicationTaken ? 'Medication Taken' : 'Medication Missed'}
                                </span>
                              </div>
                              <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-[0.2em] opacity-50">Daily Clinical Entry</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1 opacity-50">Health Score</p>
                                <p className="text-sm font-bold text-ll-accent">{log.healthScore}</p>
                              </div>
                              <div className="w-px h-8 bg-white/5"></div>
                              <div className="text-right">
                                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1 opacity-50">Bio Age</p>
                                <p className="text-sm font-bold text-ll-text">{log.bioAge}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-3">
                              <h4 className="text-[10px] font-black text-ll-accent uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-ll-accent"></span>
                                Patient Feedback & Symptoms
                              </h4>
                              <div className="glass rounded-2xl p-5 border border-white/5 text-ll-text-muted text-sm leading-relaxed font-medium shadow-sm whitespace-pre-wrap">
                                {log.dailyFeedback || "No detailed feedback provided for this entry."}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="p-4 glass rounded-2xl border border-white/5 shadow-sm">
                                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1 opacity-50">Weight</p>
                                <p className="text-sm font-bold text-ll-text">{log.weight} KG</p>
                              </div>
                              <div className="p-4 glass rounded-2xl border border-white/5 shadow-sm">
                                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1 opacity-50">Steps</p>
                                <p className="text-sm font-bold text-ll-text">{(log.steps ?? 0).toLocaleString()}</p>
                              </div>
                              <div className="p-4 glass rounded-2xl border border-white/5 shadow-sm">
                                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest mb-1 opacity-50">Status</p>
                                <p className="text-sm font-bold text-ll-text">Logged</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;