import React from 'react';

export default function AccountantDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Accountant</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Fees Collected (Month)</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">₹ 12.4L</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Pending Dues</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">₹ 3.1L</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Defaulters</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">42</div>
        </div>
      </div>
    </div>
  );
}

