import React, { useEffect, useState } from 'react';
import { HiClipboardCheck, HiX, HiDownload } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '../../components/Loader/Loader';
import EmptyState from '../../components/EmptyState/EmptyState';
import { certificateService } from '../../services/eventService';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [status, setStatus] = useState('loading');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    let mounted = true;
    certificateService
      .mine()
      .then((data) => mounted && (setCertificates(data.certificates ?? []), setStatus('ready')))
      .catch(() => mounted && setStatus('error'));
    return () => {
      mounted = false;
    };
  }, []);

  if (status === 'loading') return <Loader fullScreen label="Loading certificates" />;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display font-bold text-3xl mb-2">Your certificates</h1>
      <p className="text-ink-muted mb-8">Preview or download certificates for events you've attended.</p>

      {status === 'error' && (
        <EmptyState icon={HiClipboardCheck} title="Couldn't load certificates" message="Please try again shortly." />
      )}

      {status === 'ready' && certificates.length === 0 && (
        <EmptyState
          icon={HiClipboardCheck}
          title="No certificates yet"
          message="Certificates appear here after an organizer uploads one for an event you attended."
        />
      )}

      {status === 'ready' && certificates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="glass-panel shadow-glass rounded-xl2 p-5 flex flex-col gap-3">
              <span className="h-10 w-10 rounded-lg bg-aurora-gradient-soft flex items-center justify-center text-aurora-violet dark:text-aurora-cyan">
                <HiClipboardCheck />
              </span>
              <h3 className="font-display font-semibold">{cert.event?.title}</h3>
              <p className="text-xs font-mono text-ink-muted">{cert.certificateNumber}</p>
              <div className="mt-auto flex gap-3 pt-2">
                <button
                  onClick={() => setPreview(cert)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full gradient-btn"
                >
                  Preview
                </button>
                <a
                  href={cert.fileUrl}
                  download
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15"
                >
                  <HiDownload /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-5"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-xl2 p-4 max-w-2xl w-full relative"
            >
              <button onClick={() => setPreview(null)} className="absolute right-4 top-4 z-10" aria-label="Close">
                <HiX />
              </button>
              <img src={preview.fileUrl} alt={`Certificate for ${preview.event?.title}`} className="rounded-lg w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
