import React, { useState } from 'react';
import type { AsciiOptions } from '../types';
import { Settings2 } from 'lucide-react';

interface ControlPanelProps {
  options: AsciiOptions;
  setOptions: React.Dispatch<React.SetStateAction<AsciiOptions>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ options, setOptions }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 bg-brutalDark text-neonGreen border-2 border-brutalLight p-2 z-40 hover:bg-brutalLight hover:text-brutalDark transition-colors"
        title="Open Config"
      >
        <Settings2 className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 bg-brutalDark brutalist-box p-4 z-40 w-64 text-sm shadow-2xl">
      <div className="flex items-center justify-between mb-4 border-b-2 border-brutalLight pb-2">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-neonGreen" />
          <h2 className="font-display font-bold uppercase tracking-wider text-brutalLight">CONFIG</h2>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-brutalLight hover:text-neonPink p-1 border-2 border-transparent hover:border-neonPink transition-colors"
          title="Close"
        >
          <span className="font-bold text-xs uppercase">X</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Font Size */}
        <div>
          <label className="flex justify-between text-xs mb-1 uppercase">
            <span>Resolution</span>
            <span>{options.fontSize}px</span>
          </label>
          <input 
            type="range" min="6" max="24" step="1" 
            value={options.fontSize}
            onChange={(e) => setOptions({ ...options, fontSize: parseInt(e.target.value) })}
            className="w-full accent-neonGreen"
          />
        </div>

        {/* Brightness */}
        <div>
          <label className="flex justify-between text-xs mb-1 uppercase">
            <span>Brightness</span>
            <span>{options.brightness.toFixed(1)}</span>
          </label>
          <input 
            type="range" min="0.5" max="2.0" step="0.1" 
            value={options.brightness}
            onChange={(e) => setOptions({ ...options, brightness: parseFloat(e.target.value) })}
            className="w-full accent-neonGreen"
          />
        </div>

        {/* Contrast */}
        <div>
          <label className="flex justify-between text-xs mb-1 uppercase">
            <span>Contrast</span>
            <span>{options.contrast.toFixed(1)}</span>
          </label>
          <input 
            type="range" min="0.5" max="2.0" step="0.1" 
            value={options.contrast}
            onChange={(e) => setOptions({ ...options, contrast: parseFloat(e.target.value) })}
            className="w-full accent-neonGreen"
          />
        </div>

        {/* Dual Color Mode Toggle */}
        <div className="flex items-center justify-between">
            <span className="text-xs uppercase">Dual Color Threshold</span>
            <button
                onClick={() => setOptions({ ...options, isDualColor: !options.isDualColor })}
                className={`w-10 h-5 flex items-center border-2 border-brutalLight p-0.5 ${options.isDualColor ? 'bg-neonPink' : 'bg-brutalDark'}`}
            >
                <div className={`bg-brutalLight w-3 h-3 transition-transform ${options.isDualColor ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
        </div>

        {options.isDualColor && (
          <div>
            <label className="flex justify-between text-xs mb-1 uppercase">
              <span>Threshold</span>
              <span>{options.colorThreshold}</span>
            </label>
            <input 
              type="range" min="0" max="255" step="1" 
              value={options.colorThreshold}
              onChange={(e) => setOptions({ ...options, colorThreshold: parseInt(e.target.value) })}
              className="w-full accent-neonGreen"
            />
          </div>
        )}

        <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
                <span className="text-xs uppercase">Subject Color</span>
                <input 
                    type="color" 
                    value={options.subjectColor}
                    onChange={(e) => setOptions({ ...options, subjectColor: e.target.value })}
                    className="w-full h-8 cursor-pointer bg-transparent border-2 border-brutalGray p-0"
                />
            </div>
            {options.isDualColor && (
                <div className="flex flex-col gap-1 flex-1">
                    <span className="text-xs uppercase">BG Color</span>
                    <input 
                        type="color" 
                        value={options.bgColor}
                        onChange={(e) => setOptions({ ...options, bgColor: e.target.value })}
                        className="w-full h-8 cursor-pointer bg-transparent border-2 border-brutalGray p-0"
                    />
                </div>
            )}
        </div>

        {/* Glitch Toggle */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-brutalGray">
            <span className="text-xs uppercase">Glitch FX</span>
            <button
                onClick={() => setOptions({ ...options, glitch: !options.glitch })}
                className={`w-10 h-5 flex items-center border-2 border-brutalLight p-0.5 ${options.glitch ? 'bg-neonPink' : 'bg-brutalDark'}`}
            >
                <div className={`bg-brutalLight w-3 h-3 transition-transform ${options.glitch ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
        </div>
      </div>
    </div>
  );
};
