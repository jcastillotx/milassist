import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import Solution from './components/sections/Solution';
import Footer from './components/sections/Footer';
import DashboardLayout from './layouts/DashboardLayout';
import TaskBoard from './components/TaskBoard';

// Pages
import AdminOverview from './pages/admin/Overview';
import Users from './pages/admin/Users';
import Invoices from './pages/admin/Invoices';
import Integrations from './pages/admin/Integrations';
import FormBuilder from './pages/admin/FormBuilder';
import FormManager from './pages/admin/FormManager';
import PageBuilder from './pages/admin/PageBuilder';
import ClientOverview from './pages/client/Overview';
import ServiceRequest from './pages/client/ServiceRequest';
import TravelManagement from './pages/client/TravelManagement';
import DocumentReview from './pages/client/DocumentReview';
import DataResearch from './pages/client/DataResearch';
import CommunicationCenter from './pages/client/CommunicationCenter';
import Chat from './pages/client/Chat';
import AssistantOverview from './pages/assistant/Overview';
import Resources from './pages/assistant/Resources';
import TimeLogs from './pages/assistant/TimeLogs';
import Onboarding from './pages/assistant/Onboarding';

import Login from './pages/Login';

const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <Problem />
    <Solution />
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<Users />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="forms" element={<FormManager />} />
          <Route path="forms/new" element={<FormBuilder />} />
          <Route path="forms/edit/:id" element={<FormBuilder />} />
          <Route path="pages" element={<PageBuilder />} />
          <Route path="integrations" element={<Integrations />} />
        </Route>

        {/* Client Routes */}
        <Route path="/client" element={<DashboardLayout role="client" />}>
          <Route index element={<ClientOverview />} />
          <Route path="tasks" element={<TaskBoard role="client" />} />
          <Route path="travel" element={<TravelManagement />} />
          <Route path="documents" element={<DocumentReview />} />
          <Route path="documents" element={<DocumentReview />} />
          <Route path="research" element={<DataResearch />} />
          <Route path="communication" element={<CommunicationCenter />} />
          <Route path="messages" element={<Chat />} />
          <Route path="requests" element={<ServiceRequest />} />
        </Route>

        {/* Assistant Routes */}
        <Route path="/assistant" element={<DashboardLayout role="assistant" />}>
          <Route index element={<AssistantOverview />} />
          <Route path="tasks" element={<TaskBoard role="assistant" />} />
          <Route path="time" element={<TimeLogs />} />
          <Route path="resources" element={<Resources />} />
          <Route path="onboarding" element={<Onboarding />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App;
