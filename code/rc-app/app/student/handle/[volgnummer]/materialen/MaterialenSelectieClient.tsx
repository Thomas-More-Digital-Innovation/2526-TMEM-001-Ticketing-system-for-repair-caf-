'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import Button from '@/app/components/Button';
import { addMateriaalToVoorwerp } from '@/lib/actions/materialen';

interface Materiaal {
  materiaalId: number;
  naam: string;
}

interface MaterialenSelectieClientProps {
  readonly materialen: Materiaal[];
  readonly volgnummer: string;
}

export default function MaterialenSelectieClient({ materialen, volgnummer }: MaterialenSelectieClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMaterialen, setFilteredMaterialen] = useState(materialen);
  const [selectedMaterialen, setSelectedMaterialen] = useState<Map<number, number>>(new Map());

  // Filter materials based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMaterialen(materialen);
    } else {
      const filtered = materialen.filter(materiaal =>
        materiaal.naam.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMaterialen(filtered);
    }
  }, [searchQuery, materialen]);

  const handleIncrement = (materiaalId: number) => {
    setSelectedMaterialen(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(materiaalId) || 0;
      newMap.set(materiaalId, current + 1);
      return newMap;
    });
  };

  const handleDecrement = (materiaalId: number) => {
    setSelectedMaterialen(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(materiaalId) || 0;
      if (current > 0) {
        newMap.set(materiaalId, current - 1);
      }
      return newMap;
    });
  };

  const handleAddMaterials = async () => {
    try {
      // Add all selected materials
      for (const [materiaalId, aantal] of selectedMaterialen.entries()) {
        if (aantal > 0) {
          await addMateriaalToVoorwerp(volgnummer, materiaalId, aantal);
        }
      }
      router.back();
    } catch (error) {
      console.error('Error adding materials:', error);
      alert('Er is een fout opgetreden bij het toevoegen van materialen');
    }
  };

  return (
    <div className="min-h-screen bg-[#03091C] text-white p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <BackButton />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Zoeken"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white text-black px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ED5028]"
        />
      </div>

      {/* Materials List */}
      <div className="mb-8">
        {filteredMaterialen.map((materiaal) => {
          const aantal = selectedMaterialen.get(materiaal.materiaalId) || 0;

          return (
            <div
              key={materiaal.materiaalId}
              className="flex items-center gap-4 bg-[#0A1532] p-4 border-b last:border-b-0 border-white"
            >
              {/* Material Image Placeholder */}
              <div className="w-20 h-20 bg-white rounded-md flex-shrink-0"></div>

              {/* Material Name */}
              <div className="flex-1 text-lg">
                {materiaal.naam}
              </div>

              {/* Quantity Display */}
              <div className="text-2xl px-4 font-semibold w-8 text-center">
                {aantal}
              </div>

              {/* Increment/Decrement Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDecrement(materiaal.materiaalId)}
                  className="p-2 sm:p-4 rounded-full border-2 border-white flex items-center justify-center text-xl font-bold hover:bg-white hover:text-[#03091C] transition-colors"
                  aria-label="Verminderen"
                >
                  −
                </button>
                <button
                  onClick={() => handleIncrement(materiaal.materiaalId)}
                  className="p-2 sm:p-4 rounded-full border-2 border-white flex items-center justify-center text-xl font-bold hover:bg-white hover:text-[#03091C] transition-colors"
                  aria-label="Verhogen"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Button */}
      {Array.from(selectedMaterialen.values()).some(aantal => aantal > 0) && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center">
          <Button
            variant="primary"
            onClick={handleAddMaterials}
            className="px-12 py-4 text-lg"
          >
            Materialen Toevoegen
          </Button>
        </div>
      )}
    </div>
  );
}
