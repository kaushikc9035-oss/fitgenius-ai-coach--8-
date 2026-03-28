import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface FamilyTreeViewProps {
  currentUser: UserProfile;
  familyMembers: UserProfile[];
  allPatients?: UserProfile[];
  isDoctorView?: boolean;
  onLinkFamily?: (patientId: string, familyId: string, relationship: string) => void;
}

const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({ 
  currentUser, 
  familyMembers, 
  allPatients = [], 
  isDoctorView = false,
  onLinkFamily
}) => {
  const [familyIdInput, setFamilyIdInput] = useState(currentUser.familyId || '');
  const [relationshipInput, setRelationshipInput] = useState(currentUser.familyRelationship || '');
  const [selectedPatientToAdd, setSelectedPatientToAdd] = useState('');
  const [addRelationship, setAddRelationship] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  // Group family members by relationship for better visualization
  const groupedMembers = familyMembers.reduce((acc, member) => {
    const rel = member.familyRelationship || 'Other';
    if (!acc[rel]) acc[rel] = [];
    acc[rel].push(member);
    return acc;
  }, {} as Record<string, UserProfile[]>);

  const relationshipOrder = ['Grandparent', 'Father', 'Mother', 'Sibling', 'Self', 'Child', 'Other'];

  const hereditaryRisks = ['Diabetes', 'Cancer', 'BP', 'Thyroid', 'Heart Disease'];

  const detectRisks = (member: UserProfile) => {
    const issues = (member.healthIssues || '').toLowerCase();
    return hereditaryRisks.filter(risk => issues.includes(risk.toLowerCase()));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold font-syne text-ll-text tracking-tight">
            {isDoctorView && currentUser.role === UserRole.Patient ? 'Clinical Family Overview' : 'Family Health Awareness'}
          </h1>
          <p className="text-ll-text-muted text-sm font-medium mt-2 max-w-2xl">
            {isDoctorView && currentUser.role === UserRole.Patient 
              ? 'Analyze hereditary patterns and manage family-linked clinical records in one place.' 
              : 'Understand your family health history and identify potential inherited risks for preventive care.'}
          </p>
        </div>
        <div className="px-4 py-2 bg-ll-accent/10 border border-ll-accent/20 rounded-xl">
          <span className="text-[10px] font-black text-ll-accent uppercase tracking-widest">
            Family ID: {currentUser.familyId || 'Not Linked'}
          </span>
        </div>
      </div>

      {!currentUser.familyId ? (
        <div className="glass p-12 rounded-[2.5rem] border border-white/5 border-dashed text-center">
          <div className="w-20 h-20 bg-ll-text/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-ll-text-muted opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-ll-text font-syne">No Family Link Found</h3>
          <p className="text-ll-text-muted max-w-md mx-auto mt-2 font-medium mb-8">
            This patient is not currently linked to a family record. {isDoctorView && currentUser.role === UserRole.Patient ? 'As a doctor, you can create a family link below.' : 'Contact your doctor to link your family members.'}
          </p>

          {isDoctorView && currentUser.role === UserRole.Patient && onLinkFamily && (
            <div className="max-w-md mx-auto glass p-8 rounded-3xl border border-ll-accent/20 bg-ll-accent/5 text-left">
              <h4 className="text-sm font-black text-ll-accent uppercase tracking-widest mb-6">Create Clinical Family Link</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest ml-1">Family ID</label>
                  <input 
                    type="text" 
                    value={familyIdInput}
                    onChange={(e) => setFamilyIdInput(e.target.value)}
                    placeholder="e.g., SMITH-FAMILY-001"
                    className="w-full bg-ll-text/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-ll-text focus:ring-2 focus:ring-ll-accent/50 outline-none transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest ml-1">Relationship</label>
                  <select 
                    value={relationshipInput}
                    onChange={(e) => setRelationshipInput(e.target.value)}
                    className="w-full bg-ll-text/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-ll-text focus:ring-2 focus:ring-ll-accent/50 outline-none transition appearance-none"
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
                <button 
                  onClick={() => onLinkFamily(currentUser.id, familyIdInput, relationshipInput)}
                  disabled={!familyIdInput || !relationshipInput}
                  className="w-full py-3 bg-ll-accent text-ll-bg rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-ll-accent/20 hover:opacity-90 transition-all disabled:opacity-30"
                >
                  Create Family Link
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {isDoctorView && currentUser.role === UserRole.Patient && (
            <div className="flex justify-end">
              <button 
                onClick={() => setShowAddMember(true)}
                className="px-6 py-3 bg-ll-accent text-ll-bg rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-ll-accent/20 hover:opacity-90 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Family Member
              </button>
            </div>
          )}

          {showAddMember && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ll-bg/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className="glass p-8 rounded-[2.5rem] border border-white/10 bg-ll-surface/90 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
                <h3 className="text-2xl font-black text-ll-text font-syne mb-2">Add Member to {currentUser.familyId}</h3>
                <p className="text-ll-text-muted text-sm font-medium mb-8">Select an existing patient to add to this family tree.</p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest ml-1">Select Patient</label>
                    <select 
                      value={selectedPatientToAdd}
                      onChange={(e) => setSelectedPatientToAdd(e.target.value)}
                      className="w-full bg-ll-text/5 border border-white/10 rounded-2xl px-6 py-4 text-ll-text focus:ring-2 focus:ring-ll-accent/50 outline-none transition appearance-none"
                    >
                      <option value="">Select a Patient</option>
                      {allPatients
                        .filter(p => p.id !== currentUser.id && p.familyId !== currentUser.familyId)
                        .map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                        ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest ml-1">Relationship</label>
                    <select 
                      value={addRelationship}
                      onChange={(e) => setAddRelationship(e.target.value)}
                      className="w-full bg-ll-text/5 border border-white/10 rounded-2xl px-6 py-4 text-ll-text focus:ring-2 focus:ring-ll-accent/50 outline-none transition appearance-none"
                    >
                      <option value="">Select Relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button 
                    onClick={() => setShowAddMember(false)}
                    className="flex-1 py-4 rounded-2xl text-[10px] font-black text-ll-text-muted uppercase tracking-widest hover:bg-ll-text/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (onLinkFamily && selectedPatientToAdd && addRelationship) {
                        onLinkFamily(selectedPatientToAdd, currentUser.familyId!, addRelationship);
                        setShowAddMember(false);
                        setSelectedPatientToAdd('');
                        setAddRelationship('');
                      }
                    }}
                    disabled={!selectedPatientToAdd || !addRelationship}
                    className="flex-1 py-4 bg-ll-accent text-ll-bg rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-ll-accent/20 hover:opacity-90 transition-all disabled:opacity-30"
                  >
                    Add to Family
                  </button>
                </div>
              </div>
            </div>
          )}
          {relationshipOrder.map(rel => {
            const members = groupedMembers[rel];
            if (!members || members.length === 0) return null;

            return (
              <div key={rel} className="space-y-6">
                <h3 className="text-[10px] font-black text-ll-text-muted uppercase tracking-[0.3em] flex items-center gap-4">
                  <span className="h-px flex-1 bg-white/5"></span>
                  {rel}s
                  <span className="h-px flex-1 bg-white/5"></span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map(member => {
                    const risks = detectRisks(member);
                    const isSelf = member.id === currentUser.id;

                    return (
                      <div 
                        key={member.id} 
                        className={`glass p-6 rounded-3xl border transition-all duration-300 group
                          ${isSelf ? 'border-ll-accent/30 bg-ll-accent/5' : 'border-white/5 hover:border-white/10'}`}
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl font-syne shadow-lg
                              ${isSelf ? 'bg-ll-accent text-white shadow-ll-accent/20' : 'bg-ll-text/5 text-ll-text-muted'}`}>
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-ll-text group-hover:text-ll-accent transition-colors">
                                {member.name} {isSelf && <span className="text-[10px] text-ll-accent ml-1 uppercase">(You)</span>}
                              </h4>
                              <p className="text-[10px] font-bold text-ll-text-muted uppercase tracking-widest opacity-50">
                                {member.age} YRS • {member.gender}
                              </p>
                            </div>
                          </div>
                          {risks.length > 0 && (
                            <div className="flex -space-x-2">
                              {risks.map(risk => (
                                <div 
                                  key={risk} 
                                  className="w-6 h-6 rounded-full bg-ll-danger/20 border border-ll-danger/30 flex items-center justify-center text-[8px] font-black text-ll-danger"
                                  title={`Hereditary Risk: ${risk}`}
                                >
                                  {risk.charAt(0)}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest opacity-40">Main Health Issue</p>
                            <p className={`text-sm font-bold ${risks.length > 0 ? 'text-ll-danger' : 'text-ll-text'}`}>
                              {member.healthIssues || 'None Reported'}
                            </p>
                          </div>

                          {isDoctorView && currentUser.role === UserRole.Patient && (
                            <div className="space-y-3 pt-4 border-t border-white/5">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black text-ll-text-muted uppercase tracking-widest opacity-40">Prescribed Pills</p>
                                <div className="flex flex-wrap gap-2">
                                  {member.prescribedPills && member.prescribedPills.length > 0 ? (
                                    member.prescribedPills.map((pill, i) => (
                                      <span key={i} className="px-2 py-1 bg-ll-accent/10 text-ll-accent rounded-md text-[9px] font-bold uppercase tracking-tight">
                                        {pill}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[9px] text-ll-text-muted italic opacity-30">No active prescriptions</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {!isDoctorView && risks.length > 0 && (
                            <div className="mt-4 p-3 bg-ll-danger/5 rounded-xl border border-ll-danger/10">
                              <p className="text-[9px] font-bold text-ll-danger uppercase tracking-widest mb-1">Risk Awareness</p>
                              <p className="text-[11px] text-ll-danger/80 font-medium leading-tight">
                                {risks.join(', ')} history detected. Monitor your metrics closely.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {isDoctorView && currentUser.role === UserRole.Patient && (
            <div className="glass p-8 rounded-[2.5rem] border border-ll-accent/20 bg-ll-accent/5 mt-8">
              <h3 className="text-xl font-bold text-ll-text font-syne mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-ll-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Hereditary Pattern Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-sm text-ll-text-muted font-medium leading-relaxed">
                    Based on the clinical data of these {familyMembers.length} family members, the following patterns are identified:
                  </p>
                  <ul className="space-y-3">
                    {hereditaryRisks.map(risk => {
                      const count = familyMembers.filter(m => (m.healthIssues || '').toLowerCase().includes(risk.toLowerCase())).length;
                      if (count < 2) return null;
                      return (
                        <li key={risk} className="flex items-center gap-3 text-sm font-bold text-ll-text">
                          <div className="w-2 h-2 rounded-full bg-ll-danger animate-pulse"></div>
                          {risk}: {count} members affected
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="p-6 glass rounded-2xl border border-white/5 bg-ll-surface/50">
                  <p className="text-[10px] font-black text-ll-accent uppercase tracking-widest mb-2">Clinical Recommendation</p>
                  <p className="text-xs text-ll-text-muted leading-relaxed font-medium">
                    Screening for metabolic markers and cardiovascular health is recommended for all adult members of this family record due to identified clusters.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyTreeView;
