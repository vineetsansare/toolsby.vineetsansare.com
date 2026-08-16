import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolsGrid } from './components/ToolsGrid';
import { Footer } from './components/Footer';
import { ToolDetailModal } from './components/ToolDetailModal';
import { TOOLS_REGISTRY } from './data/tools';
import { Tool } from './types/tool';

const HomePage: React.FC = () => {
  const [activeModalTool, setActiveModalTool] = useState<Tool | null>(null);

  return (
    <>
      <div className="bg-glow-container" aria-hidden="true" />
      <Header />
      <main className="container">
        <Hero />
        <ToolsGrid 
          tools={TOOLS_REGISTRY} 
          onOpenDetails={(tool) => setActiveModalTool(tool)}
        />
      </main>
      <Footer />
      <ToolDetailModal 
        tool={activeModalTool} 
        onClose={() => setActiveModalTool(null)} 
      />
    </>
  );
};

// Tool route component supporting /tools/:id redirects or native sub-app view
const ToolRouteRedirect: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const targetTool = TOOLS_REGISTRY.find(t => t.id === toolId);
    if (targetTool) {
      if (targetTool.isExternal) {
        window.location.href = targetTool.url;
      } else {
        // Native tool location fallback
        navigate('/', { replace: true });
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [toolId, navigate]);

  return (
    <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Redirecting to tool...</p>
    </div>
  );
};

const JD2CVRedirect: React.FC = () => {
  useEffect(() => {
    window.location.href = 'https://toolsby.vineetsansare.com/jd2cv/';
  }, []);

  return (
    <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Opening JD2CV...</p>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jd2cv" element={<JD2CVRedirect />} />
          <Route path="/tools/:toolId" element={<ToolRouteRedirect />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
