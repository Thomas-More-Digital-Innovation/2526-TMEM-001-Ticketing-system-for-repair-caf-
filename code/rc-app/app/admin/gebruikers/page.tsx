import BackButton from '../../components/BackButton';
import { getGebruikers } from '@/lib/data/gebruikers';
import GebruikersClient from './GebruikersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GebruikersPage() {
  const gebruikers = await getGebruikers();

  return (
    <div className="min-h-screen bg-[#03091C] flex flex-col p-2.5 lg:p-5">
      {/* Header */}
      <div className="flex items-center justify-between p-2.5 mb-5">
        <BackButton />
        <h1 className="text-white font-open-sans text-3xl lg:text-4xl font-normal">
          Gebruikers beheren
        </h1>
        <div className="w-[100px]" />
      </div>

      <GebruikersClient gebruikers={gebruikers} />
    </div>
  );
}
