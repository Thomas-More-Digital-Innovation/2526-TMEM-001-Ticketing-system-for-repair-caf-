'use client';

import React, { useState, useEffect } from 'react';
import EditModal from '../EditModal';
import Input from '../Input';

interface CafeDagEditModalProps {
  readonly isOpen: boolean;
  readonly item?: {
    startDate: Date;
    endDate: Date;
    location: string;
    name: string;
  } | null;
  readonly onConfirm: (data: {
    startDate: string;
    endDate: string;
    location: string;
    name: string;
  }) => void;
  readonly onCancel: () => void;
  readonly title?: string;
}

export default function CafeDagEditModal({
  isOpen,
  item,
  onConfirm,
  onCancel,
  title = 'CafeDag bewerken'
}: CafeDagEditModalProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState(item?.location || '');
  const [name, setName] = useState(item?.name || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setStartDate(formatForInput(item?.startDate));
    setEndDate(formatForInput(item?.endDate));
    setLocation(item?.location || '');
    setName(item?.name || '');
  }, [item]);

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      setError('Vul start- en einddatum in');
      return;
    }
    setError('');
    onConfirm({ startDate, endDate, location, name });
  };

  const formatForInput = (d?: Date | null) => {
    if (!d) return '';
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return (
    <EditModal
      isOpen={isOpen}
      title={title}
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      <Input
        label="Start"
        placeholder="Datum"
        required
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <Input
        label="Eind"
        placeholder="Datum"
        required
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      {error && (
        <div className="text-red-400 text-xs mt-1">{error}</div>
      )}
      <Input
        label="Locatie"
        placeholder=""
        required
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <Input
        label="Naam"
        placeholder=""
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </EditModal>
  );
}
