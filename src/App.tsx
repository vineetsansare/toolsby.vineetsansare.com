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

import JsonStudio from './components/tools/json-formatter/JsonStudio';
import PdfHub from './components/tools/pdf-toolkit/PdfHub';
import PromptCraft from './components/tools/prompt-craft/PromptCraft';

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
    if (toolId === 'json-formatter') {
      navigate('/jsonStudio', { replace: true });
      return;
    }
    if (toolId === 'pdf-toolkit') {
      navigate('/pdfhub', { replace: true });
      return;
    }

    const targetTool = TOOLS_REGISTRY.find(t => t.id === toolId);
    if (targetTool) {
      if (targetTool.isExternal) {
        window.location.href = targetTool.url;
      } else {
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
          <Route path="/jsonStudio/*" element={<JsonStudio />} />
          <Route path="/pdfhub/*" element={<PdfHub />} />
          <Route path="/prompt-craft/*" element={<PromptCraft />} />
          <Route path="/prompt-studio/*" element={<PromptCraft />} />
          <Route path="/json-formatter" element={<JsonStudio />} />
          <Route path="/pdf-toolkit" element={<PdfHub />} />
          <Route path="/prompt-studio" element={<PromptCraft />} />
          <Route path="/tools/:toolId" element={<ToolRouteRedirect />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
