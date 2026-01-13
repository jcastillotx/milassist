import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import Problem from './components/sections/Problem';
import Solution from './components/sections/Solution';
import Footer from './components/sections/Footer';
import DashboardLayout from './layouts/DashboardLayout';
import PortalLayout from './layouts/PortalLayout';
import TaskBoard from './components/TaskBoard';
import LiveChatWidget from './components/LiveChatWidget';

// Pages
import AdminOverview from './pages/admin/Overview';
import Users from './pages/admin/Users';
import Invoices from './pages/admin/Invoices';
import Integrations from './pages/admin/Integrations';
import FormBuilder from './pages/admin/FormBuilder';
import FormManager from './pages/admin/FormManager';
import PageBuilder from './pages/admin/PageBuilder';
import NDAEditor from './pages/admin/NDAEditor';
import ClientOverview from './pages/client/Overview';
import ClientInvoices from './pages/client/Invoices';
import Payment from './pages/client/Payment';
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
import InboxManager from './pages/assistant/InboxManager';
import LiveChatDashboard from './pages/assistant/LiveChatDashboard';
import PrivacyCenter from './pages/PrivacyCenter';
import EmailSettings from './pages/client/EmailSettings';
import CalendarView from './pages/client/CalendarView';
import MeetingScheduler from './pages/client/MeetingScheduler';
import SetupWizard from './pages/SetupWizard';

// Portal Pages
import PortalHome from './pages/portal/Home';
import PortalAbout from './pages/portal/About';
import PortalServices from './pages/portal/Services';
import PortalContact from './pages/portal/Contact';
import PortalPrivacy from './pages/portal/Privacy';
import PortalDataProtection from './pages/portal/DataProtection';
import PortalLogin from './pages/portal/Login';
import PortalForgotPassword from './pages/portal/ForgotPassword';

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
        <Route path="/setup" element={<SetupWizard />} />

        {/* Portal Routes */}
        <Route path="/portal" element={<PortalLayout />}>
          <Route index element={<PortalHome />} />
          <Route path="about" element={<PortalAbout />} />
          <Route path="services" element={<PortalServices />} />
          <Route path="contact" element={<PortalContact />} />
          <Route path="privacy" element={<PortalPrivacy />} />
          <Route path="data-protection" element={<PortalDataProtection />} />
        </Route>
        <Route path="/portal/login" element={<PortalLogin />} />
        <Route path="/portal/forgot-password" element={<PortalForgotPassword />} />

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
          <Route path="privacy" element={<PrivacyCenter />} />
          <Route path="settings/nda" element={<NDAEditor />} />
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
          <Route path="invoices" element={<ClientInvoices />} />
          <Route path="payment/:invoiceId" element={<Payment />} />
          <Route path="email" element={<EmailSettings />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="meetings/new" element={<MeetingScheduler />} />
        </Route>

        {/* Assistant Routes */}
        <Route path="/assistant" element={<DashboardLayout role="assistant" />}>
          <Route index element={<AssistantOverview />} />
          <Route path="tasks" element={<TaskBoard role="assistant" />} />
          <Route path="time" element={<TimeLogs />} />
          <Route path="resources" element={<Resources />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="privacy" element={<PrivacyCenter />} />
          <Route path="inbox" element={<InboxManager />} />
          <Route path="live-chat" element={<LiveChatDashboard />} />
        </Route>

      </Routes>

      {/* Live Chat Widget - appears on all pages for authenticated clients */}
      <LiveChatWidget />
    </BrowserRouter>
  )
}

export default App;
