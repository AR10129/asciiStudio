import React from 'react';
import type { AnalysisResult } from '../types';
import { AlertTriangle, Terminal, X } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: AnalysisResult | null;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, isLoading, result }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="brutalist-box w-full max-w-lg bg-brutalDark p-6 relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-brutalLight hover:text-neonPink transition-colors"
        >
            <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 border-b-4 border-brutalLight pb-4 mb-4">
          <Terminal className="w-8 h-8 text-neonGreen" />
          <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-neonGreen">Image Analysis</h2>
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-brutalGray border-t-neonPink rounded-full animate-spin"></div>
            <p className="text-neonPink font-bold uppercase tracking-widest animate-pulse">Analyzing image...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            <div className="bg-brutalGray p-4 border-l-4 border-neonGreen">
              <p className="text-sm leading-relaxed">{result.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 bg-brutalGray p-3 border-l-4 border-neonPink flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-neonPink" />
                <span className="text-xs uppercase text-brutalLight/70">Vibe:</span>
                <span className="font-bold text-neonPink uppercase">{result.vibe}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {result.tags.map((tag, i) => (
                <span key={i} className="bg-neonGreen text-brutalDark px-2 py-1 text-xs font-bold uppercase">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-neonPink font-bold uppercase">
            Error retrieving data.
          </div>
        )}
      </div>
    </div>
  );
};
