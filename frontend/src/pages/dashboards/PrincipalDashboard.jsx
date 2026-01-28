import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const attendanceData = [
  { day: 'Mon', attendance: 93 },
  { day: 'Tue', attendance: 95 },
  { day: 'Wed', attendance: 91 },
  { day: 'Thu', attendance: 96 },
  { day: 'Fri', attendance: 94 }
];

export default function PrincipalDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Principal Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Departments</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">12</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Faculty</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">184</div>
        </div>
        <div className="card">
          <div className="text-xs font-medium text-slate-500">Overall Attendance</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">93.8%</div>
        </div>
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Weekly Attendance</div>
            <div className="text-xs text-slate-500">All departments</div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#16a34a"
                fill="url(#attGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

