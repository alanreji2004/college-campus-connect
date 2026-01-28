import React from 'react';

export default function LabAssistantDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Lab Assistant</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Labs Today</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">5</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Devices Online</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">8</div>
        </div>
      </div>
    </div>
  );
}

