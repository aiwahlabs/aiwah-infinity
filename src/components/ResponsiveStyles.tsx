'use client';

import React from 'react';

export function ResponsiveStyles() {
  return (
    <noscript>
      <style jsx global>{`
        @media (max-width: 799px), (max-height: 499px) {
          body > div {
            display: none !important;
          }
          
          body::before {
            content: "This app requires a screen width of at least 800px and height of at least 500px.";
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
            color: white;
            background-color: #171923;
            font-family: var(--font-geist-sans), sans-serif;
          }
        }
      `}</style>
    </noscript>
  );
} 