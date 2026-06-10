import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, pageTitle = 'Dashboard', pageSubtitle }) => {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background-base)' }}>
      {/* Subtle dot-grid background */}
      <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header pageTitle={pageTitle} pageSubtitle={pageSubtitle} />

        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="px-7 py-7"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
