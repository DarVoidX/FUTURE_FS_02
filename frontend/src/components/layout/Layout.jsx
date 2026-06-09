import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, pageTitle = 'Dashboard' }) => {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0A0F1C' }}>
      {/* Background grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

      {/* Ambient glow effects */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header pageTitle={pageTitle} />

        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
