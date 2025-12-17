import { notFound, redirect } from 'next/navigation';
import { getVoorwerpByVolgnummer } from '@/lib/data/voorwerpen';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import HandleVoorwerpClient from './HandleVoorwerpClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HandleVoorwerpPage({
  params,
}: {
  params: Promise<{ volgnummer: string }>;
}) {
  const { volgnummer } = await params;
  
  // Fetch voorwerp data on server
  const voorwerp = await getVoorwerpByVolgnummer(volgnummer);

  if (!voorwerp) {
    return redirect('/student');
  }

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Student']}>
      <HandleVoorwerpClient voorwerp={voorwerp} volgnummer={volgnummer} />
    </ProtectedRoute>
  );
}
