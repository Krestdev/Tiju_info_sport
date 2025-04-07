import Footbar from '@/components/footbar';
import Navbar from '@/components/navbar';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Navbar/>
      {children}
      <Footbar/>
    </div>
  );
}