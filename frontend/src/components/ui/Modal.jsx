import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full ${sizeMap[size]} max-h-[90vh] overflow-y-auto rounded-2xl`}
            style={{
              background: 'rgba(18, 26, 42, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 229, 255, 0.05)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-6"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
