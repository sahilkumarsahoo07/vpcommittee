import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

interface SubscriberItem {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
}

export const AdminSubscribersPage: React.FC = () => {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSubscribers();
      if (res.success && Array.isArray(res.data)) {
        const mapped: SubscriberItem[] = res.data.map((item: any, idx: number) => ({
          id: item._id || item.id || String(idx),
          email: item.email,
          isActive: item.isActive ?? true,
          subscribedAt: item.subscribedAt ? new Date(item.subscribedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        setSubscribers(mapped);
      }
    } catch {
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const [deleteTarget, setDeleteTarget] = useState<SubscriberItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (sub: SubscriberItem) => {
    setDeleteTarget(sub);
  };

  const handleConfirmDeleteSubscriber = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      setSubscribers(subscribers.filter((s) => s.id !== deleteTarget.id));
      await adminAPI.deleteSubscriber(deleteTarget.id);
      fetchSubscribers();
    } catch {
      fetchSubscribers();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D4A72C]/40 pb-3">
        <div>
          <h2 className="font-cinzel text-lg sm:text-2xl font-black text-[#32070B] uppercase tracking-wider">
            Newsletter Subscribers
          </h2>
          <p className="text-[11px] sm:text-xs text-[#2A1710]/70 font-semibold">
            Devotees who subscribed to receive Ganesh Utsav updates.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#5A0F16] text-[#F4B942] border border-[#F4B942] text-[11px] sm:text-xs font-black uppercase">
          Subscribers: {subscribers.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#32070B] font-cinzel font-bold text-xs">Loading subscribers...</div>
      ) : subscribers.length === 0 ? (
        <div className="text-center py-12 text-[#2A1710]/70 text-xs font-semibold">No subscribers found.</div>
      ) : (
        <div className="bg-[#240407] border-2 border-[#D4A72C]/40 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm overflow-x-auto">
          <table className="min-w-[500px] w-full text-left text-[11px] sm:text-xs text-[#FFF7E8]">
            <thead>
              <tr className="border-b border-[#D4A72C]/30 text-[#F4B942] font-cinzel font-black uppercase tracking-wider text-[10px] sm:text-[11px]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Subscribed Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4A72C]/15">
              {subscribers.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-[#32070B]/50 transition-colors">
                  <td className="py-2.5 px-3 text-[#F4B942] font-bold">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-[#E87516]" />
                      <span>{sub.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#FFF7E8]/70">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4A72C]" />
                      <span>{sub.subscribedAt}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteClick(sub)}
                      className="p-1.5 rounded-lg bg-red-900/60 hover:bg-red-700 text-red-200 transition-colors"
                      title="Remove Subscriber"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Remove Subscriber"
        itemTitle={deleteTarget?.email}
        message={`Are you sure you want to remove subscriber "${deleteTarget?.email}" from the newsletter list?`}
        confirmText="Yes, Remove Subscriber"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteSubscriber}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
