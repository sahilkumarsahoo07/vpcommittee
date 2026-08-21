import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemTitle?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title = 'Confirm Deletion',
  itemTitle,
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1F0407] border-2 border-[#D4A72C]/50 rounded-3xl p-6 sm:p-8 max-w-md w-full text-[#FFF7E8] shadow-2xl relative overflow-hidden transform transition-all scale-100">
        {/* Glow backdrop effect */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#D4A72C]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-[#FFF7E8]/60 hover:text-[#F4B942] hover:bg-[#32070B] rounded-full transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#3E0A10] border-2 border-red-500/40 text-red-400 flex items-center justify-center shadow-lg shadow-red-900/30">
            <Trash2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-cinzel text-xl font-bold text-[#F4B942] tracking-wide">{title}</h3>
            {itemTitle && (
              <p className="text-sm font-bold text-red-300 bg-[#2A050A] border border-red-500/30 px-3 py-1 rounded-xl inline-block mt-1">
                "{itemTitle}"
              </p>
            )}
          </div>

          <p className="text-xs text-[#FFF7E8]/80 leading-relaxed pt-1">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#D4A72C]/20">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#D4A72C]/30 bg-[#120204] hover:bg-[#32070B] text-[#FFF7E8]/80 hover:text-[#FFF7E8] text-xs font-bold transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white text-xs font-bold shadow-lg shadow-red-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
