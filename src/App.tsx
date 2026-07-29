import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import PasswordGate from '@/components/PasswordGate';
import SyncToServer from '@/components/SyncToServer';
import Dashboard from '@/pages/Dashboard';
import History from '@/pages/History';
import Add from '@/pages/Add';
import Admin from '@/pages/Admin';
import Settings from '@/pages/Settings';

export default function App() {
  return (
    <PasswordGate>
      <Router>
        <SyncToServer />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/add" element={<Add />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </PasswordGate>
  );
}
