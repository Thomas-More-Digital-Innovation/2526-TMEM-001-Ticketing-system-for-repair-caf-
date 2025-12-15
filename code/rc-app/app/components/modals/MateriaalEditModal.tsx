'use client';

import React, { useState, useEffect } from 'react';
import EditModal from '../EditModal';
import Input from '../Input';
import { Upload } from '@deemlol/next-icons/';

interface MateriaalEditModalProps {
  isOpen: boolean;
  item?: {
    name: string;
    price: string;
    photo?: string;
  } | null;
  onConfirm: (data: {
    name: string;
    price: string;
    photo?: File | null;
  }) => void;
  onCancel: () => void;
  title?: string;
}

export default function MateriaalEditModal({
  isOpen,
  item,
  onConfirm,
  onCancel,
  title = 'Materiaal bewerken'
}: MateriaalEditModalProps) {
  const [name, setName] = useState(item?.name || '');
  const [price, setPrice] = useState(item?.price || '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState(item?.photo || '');
  const [nameTouched, setNameTouched] = useState(false);


  useEffect(() => {
    // Reset fields when the modal is opened or the item changes so
    // a previously selected preview doesn't persist between opens.
    if (isOpen) {
      setName(item?.name || '');
      setPrice(item?.price || '');
      setPhoto(null);
      setPhotoPreview(item?.photo || '');
      setNameTouched(false);
    }
  }, [item, isOpen]);

  const nameIsValid = name.trim().length > 0;



  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    onConfirm({ name, price, photo });
  };

  return (
    <EditModal
      isOpen={isOpen}
      title={title}
      onConfirm={handleConfirm}
      confirmDisabled={!nameIsValid}
      onCancel={onCancel}
    >
      <div className="flex flex-col gap-2">
        <Input
          label="Naam"
          placeholder="Bout"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setNameTouched(true)}
        />
        {nameTouched && !nameIsValid && (
          <span className="text-red-400 font-inter text-xs">Naam mag niet leeg zijn</span>
        )}
        <Input
          label="Prijs"
          placeholder="0,90"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-white font-inter text-xs font-normal">
          Foto
        </label>
        <div className="flex items-stretch gap-2.5">
          {photoPreview && (
            <div
              className="w-1/2 h-36 rounded overflow-hidden bg-gray-200"
            >
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <label
            className={`border-6 border-dotted border-white rounded-4xl cursor-pointer flex items-center justify-center -bg-transparent hover:bg-white/10 transition-colors ${photoPreview ? 'w-1/2' : 'w-full'} h-36` }
          >
            <div className='h-full w-full flex items-center justify-center p-2.5'>
              <Upload className="w-full h-full" color="#FFFFFF" />
              <span className="ml-2 text-white font-inter text-md font-normal">
                Upload een foto van het materiaal (Optioneel)
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </EditModal>
  );
}
