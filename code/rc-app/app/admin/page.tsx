'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../components/Button';
import ProtectedRoute from '../components/ProtectedRoute';
import EditModal from '../components/EditModal';
import Input from '../components/Input';
import { getPrinterSettings, updatePrinterSettings } from '@/lib/actions/printerSettings';

export default function AdminDashboard() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [topMessage, setTopMessage] = useState('REPAIR CAFE');
  const [bottomMessage, setBottomMessage] = useState('Bedankt!');
  const [isSaving, setIsSaving] = useState(false);

  const adminSections = [
    { title: 'CaféDagen', href: '/admin/cafedagen' },
    { title: 'Gebruikers', href: '/admin/gebruikers' },
    { title: 'Afdelingen', href: '/admin/afdelingen' },
    { title: 'Materialen', href: '/admin/materialen' },
    { title: 'Voorwerpen', href: '/admin/voorwerpen' },
    { title: 'Statistieken', href: '/admin/statistieken' }
  ];

  useEffect(() => {
    const loadSettings = async () => {
      const result = await getPrinterSettings();

      if (result.success && result.settings) {
        setTopMessage(result.settings.topMessage);
        setBottomMessage(result.settings.bottomMessage);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);

    const result = await updatePrinterSettings({
      topMessage,
      bottomMessage,
    });

    if (!result.success) {
      alert('Fout bij opslaan: ' + result.error);
      setIsSaving(false);
      return;
    }

    if (result.settings) {
      setTopMessage(result.settings.topMessage);
      setBottomMessage(result.settings.bottomMessage);
    }

    setIsSaving(false);
    setShowSettingsModal(false);
  };

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="relative min-h-screen bg-[#03091C] flex items-center justify-center p-4 lg:p-0">
        <button
          type="button"
          aria-label="Printer instellingen"
          onClick={() => setShowSettingsModal(true)}
          className="absolute top-4 right-4 lg:top-8 lg:right-8 w-12 h-12 rounded-md bg-[#05293D] text-white text-2xl hover:bg-[#0a3d58]"
        >
          ⚙
        </button>

        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[85px]">
          {adminSections.map((section) => (
            <Link key={section.href} href={section.title === 'Statistieken' ? '#' : section.href} className="w-full">
              <Button variant="primary" className={`w-full h-32 lg:h-44 text-4xl`} disabled={section.title === 'Statistieken'}>
                {section.title}
              </Button>
            </Link>
          ))}
        </div>

        <EditModal
          isOpen={showSettingsModal}
          title="Printer instellingen"
          onConfirm={handleSaveSettings}
          onCancel={() => setShowSettingsModal(false)}
          confirmText={isSaving ? 'Opslaan...' : 'Opslaan'}
          confirmDisabled={isSaving}
        >
          <Input
            label="Printer top message"
            value={topMessage}
            onChange={(e) => setTopMessage(e.target.value)}
          />
          <Input
            label="Printer bottom message"
            value={bottomMessage}
            onChange={(e) => setBottomMessage(e.target.value)}
          />
        </EditModal>
      </div>
    </ProtectedRoute>
  );
}
