import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ColorsView from './views/ColorsView';
import TypographyView from './views/TypographyView';
import AssetsView from './views/AssetsView';
import VoiceView from './views/VoiceView';
import ExportView from './views/ExportView';
import useThemeStore from './store/themeStore';

export default function App() {
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <div className="flex h-screen bg-light-brand-bg overflow-hidden select-none dark:bg-brand-bg">
      {/* Draggable title bar region */}
      <div className="fixed top-0 left-0 right-0 h-10 z-50" style={{ WebkitAppRegion: 'drag' }} />

      <Sidebar />

      <main className="flex-1 overflow-hidden ml-[260px]">
        <Routes>
          <Route path="/" element={<ColorsView />} />
          <Route path="/typography" element={<TypographyView />} />
          <Route path="/assets" element={<AssetsView />} />
          <Route path="/voice" element={<VoiceView />} />
          <Route path="/export" element={<ExportView />} />
        </Routes>
      </main>

      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#16162a',
            border: '1px solid #2a2a4a',
            color: '#f0f0ff',
          },
        }}
      />
    </div>
  );
}
