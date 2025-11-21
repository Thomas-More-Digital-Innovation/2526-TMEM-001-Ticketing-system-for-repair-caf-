import { getMaterialen } from '@/lib/data/materialen';
import MaterialenSelectieClient from './MaterialenSelectieClient';

interface PageProps {
  readonly params: Promise<{ volgnummer: string }>;
}

export default async function MaterialenSelectiePage({ params }: PageProps) {
  const { volgnummer } = await params;
  const materialen = await getMaterialen();

  return <MaterialenSelectieClient materialen={materialen} volgnummer={volgnummer} />;
}
