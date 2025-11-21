'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRLoginModalProps {
  readonly isOpen: boolean;
  readonly token: string | null;
  readonly onClose: () => void;
  readonly userName: string;
}

export default function QRLoginModal({
  isOpen,
  token,
  onClose,
  userName
}: QRLoginModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && token && canvasRef.current) {
      // Generate QR code on canvas
      QRCode.toCanvas(
        canvasRef.current,
        token,
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        },
        (error) => {
          if (error) {
            console.error('Error generating QR code:', error);
          }
        }
      );
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            QR Login voor {userName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg mb-4">
            <canvas ref={canvasRef} />
          </div>
          
          <p className="text-sm text-gray-600 text-center mb-2">
            Scan deze QR code om in te loggen
          </p>
          
          <p className="text-xs text-gray-500 text-center">
            Deze code is 5 minuten geldig
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
