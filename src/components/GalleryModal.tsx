import React from 'react';
import { X } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: string[];
  setSnapshots: React.Dispatch<React.SetStateAction<string[]>>;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, snapshots, setSnapshots }) => {
  if (!isOpen) return null;

  const handleDelete = (index: number) => {
    const newSnaps = snapshots.filter((_, i) => i !== index);
    setSnapshots(newSnaps);
    localStorage.setItem('ascii_snapshots', JSON.stringify(newSnaps));
  };

  const handleMediaClick = (snap: string, isVideo: boolean) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html style="background: #111; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <head><title>Ascii Capture</title></head>
          <body>
            ${isVideo 
              ? `<video src="${snap}" controls autoPlay loop muted playsInline style="max-width: 100%; max-height: 100%;"></video>` 
              : `<img src="${snap}" style="max-width: 100%; max-height: 100%;" />`
            }
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleDownload = async (snap: string, isVideo: boolean) => {
    try {
        const res = await fetch(snap);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const ext = isVideo ? (blob.type.includes('webm') ? 'webm' : 'mp4') : 'png';
        a.download = isVideo ? `boomerang_${Date.now()}.${ext}` : `snapshot_${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (e) {
        console.error("Download failed, using fallback:", e);
        const a = document.createElement('a');
        a.href = snap;
        a.download = isVideo ? `boomerang_${Date.now()}.${snap.includes('webm') ? 'webm' : 'mp4'}` : `snapshot_${Date.now()}.png`;
        a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brutalDark/90 backdrop-blur-sm p-4">
      <div className="brutalist-box w-full max-w-4xl max-h-[80vh] flex flex-col bg-brutalDark p-6 relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-brutalLight hover:text-neonPink transition-colors z-10"
        >
            <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-display font-bold uppercase tracking-widest text-brutalLight mb-6 border-b-4 border-brutalLight pb-2">
          Gallery
        </h2>

        <div className="flex-1 overflow-y-auto pr-2">
            {snapshots.length === 0 ? (
                <div className="text-brutalGray font-bold uppercase text-center py-12">
                    No snapshots found
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {snapshots.map((snap, index) => {
                        const isVideo = snap.startsWith('data:video');
                        return (
                            <div key={index} className="relative group brutalist-border p-2 bg-brutalDark">
                                {isVideo ? (
                                    <video 
                                        src={snap} 
                                        autoPlay loop muted playsInline 
                                        onClick={() => handleMediaClick(snap, true)}
                                        className="w-full h-48 object-cover brutalist-border mb-4 cursor-pointer hover:opacity-80 transition-opacity" 
                                    />
                                ) : (
                                    <img 
                                        src={snap} 
                                        alt={`Snapshot ${index + 1}`} 
                                        onClick={() => handleMediaClick(snap, false)}
                                        className="w-full h-48 object-cover brutalist-border mb-4 cursor-pointer hover:opacity-80 transition-opacity" 
                                    />
                                )}
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleDownload(snap, isVideo)}
                                        className="flex-1 bg-neonGreen text-brutalDark py-2 font-bold uppercase hover:bg-brutalLight transition-colors text-xs text-center"
                                    >
                                        Download
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(index)}
                                        className="flex-1 bg-neonPink text-brutalLight py-2 font-bold uppercase hover:bg-brutalLight hover:text-brutalDark transition-colors text-xs text-center"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
