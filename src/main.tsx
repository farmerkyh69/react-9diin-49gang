import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'

import RootLaout from './pages/layout.tsx'
import App from './pages/index'
import SignUp from './pages/sign-up/index';
import SignIn from './pages/sign-in/index';
import { ThemeProvider } from './components/theme-provider.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import CreateTopic from './pages/topics/[topic_id]/create.tsx';  //토픽생성페이지
import TopicDetail from './pages/topics/[topic_id]/detail.tsx';
import Portfolio from './pages/portfolio/index.tsx';
import AuthCallback from './pages/auth/callback.tsx';  //소셜 로그인 시 콜백 페이지

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route element={<RootLaout />} >
            <Route path="/" element={<App />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="auth/callback" element={<AuthCallback />} />
            <Route path="topics/:id/create" element={<CreateTopic />} />
            <Route path="topics/:id/detail" element={<TopicDetail />} />
            <Route path="portfolio" element={<Portfolio />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-center"/>
  </ThemeProvider>
)
