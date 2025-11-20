import { notFound, redirect } from 'next/navigation';
import { getVoorwerpByNummer } from '@/lib/data/voorwerpen';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import HandleVoorwerpClient from './HandleVoorwerpClient';

export default async function HandleVoorwerpPage({
  params,
}: {
  params: Promise<{ voorwerpNummer: string }>;
}) {
  const { voorwerpNummer } = await params;
  
  // Fetch voorwerp data on server
  const voorwerp = await getVoorwerpByNummer(voorwerpNummer);

  if (!voorwerp) {
    return redirect('/student');
  }

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Student']}>
      <HandleVoorwerpClient voorwerp={voorwerp} voorwerpNummer={voorwerpNummer} />
    </ProtectedRoute>
  );
}
