import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-xl', xl: 'max-w-3xl' };

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop">
          {/* Backdrop click */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={`modal-panel w-full ${sizes[size]}`}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', damping: 30, stiffness: 380, mass: 0.8 }}
          >
            <div className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid var(--border-color)' }}>
              <h2 className="text-sm font-semibold text-text-1 tracking-snug-2 font-display">{title}</h2>
              <button
                onClick={onClose}
                className="btn-icon btn-ghost"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
