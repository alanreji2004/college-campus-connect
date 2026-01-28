import React from 'react';

export default function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="card max-w-md text-center text-sm text-slate-600">
        You do not have permission to access this page.
      </div>
    </div>
  );
}

