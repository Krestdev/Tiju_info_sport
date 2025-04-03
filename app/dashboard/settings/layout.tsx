import React from 'react'

export default function PubsLayout({
    children
}:{
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
