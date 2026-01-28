import React from 'react';

export default function StaffDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Staff Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <div className="text-xs font-medium text-slate-500">My Classes Today</div>
          <ul className="mt-2 space-y-1 text-xs text-slate-700">
            <li>09:00 · CS101 · CSE-A</li>
            <li>11:00 · CS203 · CSE-B</li>
            <li>14:00 · CS301 · CSE-A</li>
          </ul>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Attendance to Review</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">3</div>
        </div>
      </div>
    </div>
  );
}

