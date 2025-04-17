// components/editor/ImageUploadButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Image, Upload } from 'lucide-react';

export function ImageUploadButton() {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, upload to your server and get URL
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      if (typeof window !== 'undefined' && (window as any).insertImage) {
        (window as any).insertImage(src);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Button type='button' variant="ghost" size="sm" >
      <label className="cursor-pointer">
        <Image className="toolbar-item spaced" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>
    </Button>
  );
}