"use client";

import React from 'react'
import withRoleAuth from '@/lib/whithAdminAuth';

function ArticlesLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {
        children
      }
    </div>
  )
}

export default withRoleAuth(ArticlesLayout, "editor")
