import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Team } from './pages/Team';
import { Events } from './pages/Events';
import { EventPage } from './pages/EventPage';
import { Sponsors } from './pages/Sponsors';
import { FAQ } from './pages/FAQ';
import { Login } from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventPage />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
