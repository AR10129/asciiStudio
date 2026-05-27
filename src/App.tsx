import React, { useState, useCallback, useEffect } from 'react';
import { AsciiCanvas } from './components/AsciiCanvas';
import { ControlPanel } from './components/ControlPanel';
import { GalleryModal } from './components/GalleryModal';
import { LandingPage } from './components/LandingPage';
import type { AsciiOptions } from './types';
import { Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [options, setOptions] = useState<AsciiOptions>({
    fontSize: 10,
    brightness: 1.0,
    contrast: 1.0,
    density: 'complex',
    glitch: false,
    isDualColor: true,
    colorThreshold: 128,
    subjectColor: '#00ff41',
    bgColor: '#ff007f'
  });

  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [hasNewCapture, setHasNewCapture] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
      const saved = localStorage.getItem('ascii_snapshots');
      if (saved) {
          try {
              setSnapshots(JSON.parse(saved));
          } catch(e) { }
      }
  }, []);

  const handleCapture = useCallback((mediaData: string) => {
    let newSnaps = [mediaData, ...snapshots];
    let saved = false;
    
    while (!saved && newSnaps.length > 0) {
      try {
        localStorage.setItem('ascii_snapshots', JSON.stringify(newSnaps));
        saved = true;
      } catch (e) {
        // Quota exceeded, drop the oldest snapshot
        newSnaps.pop();
      }
    }
    setSnapshots(newSnaps);
    setHasNewCapture(true);
  }, [snapshots]);

  if (!hasStarted) {
    return <LandingPage onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="relative w-full h-screen bg-brutalDark overflow-hidden flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => setHasStarted(false)}
          className="flex items-center gap-2 text-brutalLight pointer-events-auto bg-brutalDark p-2 brutalist-border hover:bg-brutalLight hover:text-brutalDark transition-colors"
          title="Back to Landing Page"
        >
          <Terminal className="w-5 h-5" />
          <h1 className="text-lg font-display font-bold uppercase">Ascii Studio</h1>
        </button>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-grow relative z-10 p-2 sm:p-4 md:pt-20 pt-20 pb-20">
        <AsciiCanvas 
          options={options} 
          onCapture={handleCapture} 
          onOpenGallery={() => {
            setIsGalleryOpen(true);
            setHasNewCapture(false);
          }}
          hasNewCapture={hasNewCapture}
        />
      </main>

      {/* Controls */}
      <ControlPanel options={options} setOptions={setOptions} />

      {/* Modals */}
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        snapshots={snapshots}
        setSnapshots={setSnapshots}
      />
    </div>
  );
};

export default App;
