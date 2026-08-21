import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock } from 'lucide-react';
import { adminAPI } from '../../services/api';

interface VolunteerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  areaOfInterest: string;
  availability: string;
  status: string;
}

export const AdminVolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getVolunteers();
      if (res.success && Array.isArray(res.data)) {
        const mapped: VolunteerItem[] = res.data.map((item: any, idx: number) => ({
          id: item._id || item.id || String(idx),
          name: item.name || 'Volunteer Applicant',
          phone: item.phone || '+91 98000 00000',
          email: item.email || 'volunteer@vighnaharta.org',
          areaOfInterest: item.areaOfInterest || item.interest || 'Crowd Management & Queue Control',
          availability: item.availability || 'Evening Shift',
          status: item.status || 'NEW',
        }));
        setVolunteers(mapped);
      }
    } catch {
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleDeleteVolunteer = async (id: string) => {
    try {
      setVolunteers(volunteers.filter(v => v.id !== id));
      await adminAPI.deleteVolunteer(id);
      fetchVolunteers();
    } catch {
      fetchVolunteers();
    }
  };

  const toggleStatus = (id: string) => {
    setVolunteers(
      volunteers.map((v) => (v.id === id ? { ...v, status: v.status === 'NEW' ? 'APPROVED' : 'NEW' } : v))
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D4A72C]/40 pb-4">
        <h2 className="font-cinzel text-2xl font-black text-[#32070B] uppercase tracking-wider">
          Volunteer Roster & Applications
        </h2>
        <p className="text-xs text-[#2A1710]/70 font-semibold">
          Review community volunteer applications, assign duties (Crowd management, Prasad, Security), and approve roster.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-sm">Loading volunteers from database...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="bg-[#240407] text-[#FFF7E8] border-2 border-[#D4A72C]/40 rounded-3xl p-5 shadow-md space-y-3 relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-base text-[#F4B942]">{vol.name}</h4>
                  <p className="text-xs text-[#FFF7E8]/70">{vol.areaOfInterest} • {vol.availability}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(vol.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                      vol.status === 'APPROVED'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#E87516] text-white hover:bg-emerald-700'
                    }`}
                  >
                    {vol.status}
                  </button>
                  <button
                    onClick={() => handleDeleteVolunteer(vol.id)}
                    className="p-1 rounded-lg bg-red-900/60 hover:bg-red-700 text-red-200 text-xs font-bold transition-colors ml-1"
                    title="Delete Application"
                  >
                    ✕
                  </button>
                </div>
              </div>

            <div className="text-xs space-y-1 border-t border-[#D4A72C]/30 pt-3">
              <div className="flex items-center gap-2 text-[#FFF7E8]/80">
                <Phone className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>{vol.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#FFF7E8]/80">
                <Mail className="w-3.5 h-3.5 text-[#D4A72C]" />
                <span>{vol.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[#F4B942]">
                <Clock className="w-3.5 h-3.5" />
                <span>{vol.availability}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};
