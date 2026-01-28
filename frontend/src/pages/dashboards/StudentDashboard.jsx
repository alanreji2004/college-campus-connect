import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const attendanceData = [
  { subject: 'CS101', attendance: 96 },
  { subject: 'MA102', attendance: 92 },
  { subject: 'PH103', attendance: 89 },
  { subject: 'EC104', attendance: 94 }
];

export default function StudentDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Student Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Overall Attendance</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">93%</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-slate-500">GPA</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">8.4</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Pending Dues</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">₹ 1,200</div>
        </div>
      </div>
      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Attendance by Subject</div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="attendance" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

