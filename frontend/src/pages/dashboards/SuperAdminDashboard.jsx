import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LayoutDashboard, Users, Building2, GraduationCap, Upload, Plus, UserPlus, Briefcase, Search, Filter, MoreVertical, CheckCircle, XCircle, Shield, Calendar, LogOut, ChevronRight, BookOpen } from 'lucide-react';

const chartData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 180 },
  { month: 'Mar', users: 260 },
  { month: 'Apr', users: 320 },
  { month: 'May', users: 410 }
];

export default function SuperAdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [stats, setStats] = useState({ totalUsers: 0, activeDevices: 14, attendance: '94.3%' });
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchDepartments();
    fetchStaff();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats');
      const data = await response.json();
      if (data.totalUsers) {
        setStats(prev => ({ ...prev, totalUsers: data.totalUsers }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/departments');
      const data = await response.json();
      if (data.departments) {
        setDepartments(data.departments);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/staff');
      const data = await response.json();
      if (data.staff) {
        setStaffList(data.staff);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'manage-roles', label: 'Manage Roles', icon: Shield },
    { id: 'add-student', label: 'Add Student/Class', icon: GraduationCap },
    { id: 'add-staff', label: 'Add Staff', icon: Briefcase },
    { id: 'promote', label: 'Promote Students', icon: BookOpen },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
        </h1>
        <p className="text-slate-500 mt-1">
          {activeTab === 'overview' && 'Real-time overview of your campus operations.'}
          {activeTab === 'users' && 'Manage all students and staff members in one place.'}
          {activeTab === 'departments' && 'Organize and manage faculty departments.'}
          {activeTab === 'manage-roles' && 'Assign HOD and Principal roles to staff.'}
          {activeTab === 'add-student' && 'Manage departments, classes and student registration.'}
          {activeTab === 'add-staff' && 'Onboard new faculty and administrative staff.'}
          {activeTab === 'promote' && 'Perform bulk semester promotion for students.'}
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'users' && <UsersListTab />}
        {activeTab === 'departments' && <DepartmentsTab departments={departments} onUpdate={fetchDepartments} />}
        {activeTab === 'manage-roles' && <ManageRolesTab departments={departments} />}
        {activeTab === 'add-student' && <AddStudentTab departments={departments} staffList={staffList} />}
        {activeTab === 'add-staff' && <AddStaffTab departments={departments} />}
        {activeTab === 'promote' && <PromoteTab />}
      </div>
    </div>
  );
}
function OverviewTab({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend="+12% from last month" color="bg-blue-500" />
        <StatCard title="Active Devices" value={stats.activeDevices} icon={Shield} trend="+2 new this week" color="bg-emerald-500" />
        <StatCard title="Avg. Attendance" value={stats.attendance} icon={CheckCircle} trend="Consistent" color="bg-purple-500" />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">User Growth</h3>
            <p className="text-sm text-slate-500">New joins over the last 5 months</p>
          </div>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">View Report</button>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} dy={10} tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{ stroke: '#cbd5e1' }} />
              <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`rounded-xl p-3 ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">30 Days</span>
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <div className="text-sm font-medium text-slate-500 mt-1">{title}</div>
      </div>
      <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
        {trend}
      </div>
    </div>
  );
}

function UsersListTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}? This will permanently delete their account.`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('User removed successfully');
        fetchUsers();
      } else {
        const data = await res.json();
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div className="text-center py-10 text-slate-500">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all"
          />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Official ID</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Department</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {user.officialId || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'STUDENT' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.dept}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <XCircle size={18} />
                    </button>
                    <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function AddStudentTab({ departments, staffList }) {
  const [view, setView] = useState('depts');
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', name: '', dob: '', admissionNo: '', tutor: '', semester: '1', batch: 'A'
  });

  const fetchClasses = async (deptCode) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/classes?departmentCode=${deptCode}`);
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    const className = e.currentTarget.classNameInput.value;
    const tutorId = e.currentTarget.tutorId.value;
    const semester = e.currentTarget.semester.value;
    const batch = e.currentTarget.batch.value;

    try {
      const res = await fetch('http://localhost:5000/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: className, department_code: selectedDept.code, tutor_id: tutorId || null, semester, batch })
      });
      if (res.ok) {
        alert('Class created successfully');
        fetchClasses(selectedDept.code);
      } else {
        const data = await res.json();
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to create class');
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          role: 'STUDENT',
          metadata: {
            departmentCode: selectedDept.code,
            class_id: selectedClass.id,
            dob: formData.dob,
            semester: selectedClass.semester,
            admissionNo: formData.admissionNo
          }
        })
      });
      if (res.ok) {
        alert('Student added successfully');
        setFormData({ ...formData, email: '', name: '', dob: '', admissionNo: '' });
      } else {
        const data = await res.json();
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'depts') {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map(dept => (
            <div
              key={dept.id}
              onClick={() => { setSelectedDept(dept); fetchClasses(dept.code); setView('classes'); }}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-primary-500 hover:shadow-md transition-all text-center"
            >
              <div className="mx-auto h-16 w-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 size={32} />
              </div>
              <h3 className="font-bold text-slate-900">{dept.name}</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">{dept.code}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'classes') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <button onClick={() => setView('depts')} className="hover:text-primary-600">Departments</button>
          <ChevronRight size={14} />
          <span className="font-bold text-slate-900">{selectedDept.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-slate-900">Create New Class</h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Class Name</label>
                <input name="classNameInput" required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500" placeholder="e.g. CS S7 A batch" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Semester</label>
                  <select name="semester" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>S{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Batch</label>
                  <input name="batch" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="e.g. A" defaultValue="A" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Assigned Tutor</label>
                <select name="tutorId" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none bg-white">
                  <option value="">Select a Tutor</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800">Create Class</button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Existing Classes</h3>
            <div className="grid gap-4">
              {classes.map(cls => (
                <div key={cls.id} onClick={() => { setSelectedClass(cls); setView('management'); }} className="cursor-pointer flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-primary-400 transition-all">
                  <div>
                    <div className="font-bold text-slate-900">{cls.name}</div>
                    <div className="text-xs text-slate-500">Tutor: {cls.tutor?.full_name || 'Not assigned'}</div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </div>
              ))}
              {classes.length === 0 && <p className="text-center py-10 text-slate-400 italic">No classes found in this department.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'management') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <button onClick={() => setView('depts')} className="hover:text-primary-600">Departments</button>
          <ChevronRight size={14} />
          <button onClick={() => setView('classes')} className="hover:text-primary-600">{selectedDept.name}</button>
          <ChevronRight size={14} />
          <span className="font-bold text-slate-900">{selectedClass.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-slate-900">Add Student to {selectedClass.name}</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Full Name" />
              <input required value={formData.admissionNo} onChange={e => setFormData({ ...formData, admissionNo: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Admission Number" />
              <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Email" />
              <input type="date" required value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" />
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary-600 py-3 text-sm font-bold text-white hover:bg-primary-700">Add Student</button>
            </form>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Bulk Upload</h3>
            <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 hover:bg-slate-100 transition-all">
              <Upload className="h-6 w-6 text-primary-600 mb-2" />
              <p className="text-sm font-medium">Click to upload CSV</p>
              <input type="file" accept=".csv" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (evt) => {
                  const text = evt.target.result;
                  const lines = text.split('\n');
                  const users = [];
                  lines.forEach(line => {
                    const [email, name, dob, admissionNo] = line.split(',').map(s => s?.trim());
                    if (email && email.includes('@')) {
                      users.push({
                        email, name, role: 'STUDENT',
                        metadata: { departmentCode: selectedDept.code, class_id: selectedClass.id, dob: dob || '', semester: selectedClass.semester, admissionNo: admissionNo || '' }
                      });
                    }
                  });
                  if (users.length > 0) {
                    if (!window.confirm(`Upload ${users.length} students?`)) return;
                    try {
                      await fetch('http://localhost:5000/api/admin/users/bulk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ users })
                      });
                      alert('Upload complete');
                    } catch (err) { alert(err.message); }
                  }
                };
                reader.readAsText(file);
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function AddStaffTab({ departments }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '', name: '', departmentCode: departments[0]?.code || '', role: 'LECTURER', dob: '', employeeId: ''
  });

  useEffect(() => {
    if (departments.length > 0 && !formData.departmentCode) {
      setFormData(prev => ({ ...prev, departmentCode: departments[0].code }));
    }
  }, [departments]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name, role: formData.role, metadata: { departmentCode: formData.departmentCode, dob: formData.dob, employeeId: formData.employeeId } })
      });
      if (!response.ok) throw new Error('Failed to add staff');
      alert('Staff added successfully!');
      setFormData({ ...formData, email: '', name: '', dob: '', employeeId: '' });
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-xl font-bold text-slate-900">Add New Staff Member</h3>
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Dr. Sarah Connor" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Staff Employee ID</label>
              <input type="text" required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500" value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} placeholder="e.g. EMP123" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input type="date" required className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary-500" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input type="email" required className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary-500" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="staff@college.edu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" value={formData.departmentCode} onChange={e => setFormData({ ...formData, departmentCode: e.target.value })}>
                {departments.map(dept => <option key={dept.id} value={dept.code}>{dept.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Designation</label>
              <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="LECTURER">Lecturer</option>
                <option value="ASST_PROF">Asst. Professor</option>
                <option value="HOD">HOD</option>
                <option value="PRINCIPAL">Principal</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white disabled:opacity-70">
            {loading ? 'Processing...' : 'Add Staff Member'}
          </button>
        </form>
      </div>
    </div>
  );
}

function PromoteTab() {
  const [loading, setLoading] = useState(false);
  const handlePromote = async () => {
    if (!window.confirm('Are you sure you want to promote all students? This will increment semester levels for all classes.')) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/promote', { method: 'POST' });
      const data = await res.json();
      alert(`Promotion complete. Promoted Classes: ${data.promotedClasses}, Graduated Students: ${data.graduatedStudents}`);
    } catch (err) { alert('Failed to promote'); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-10 text-center">
      <GraduationCap size={48} className="mx-auto text-amber-600 mb-6" />
      <h3 className="text-2xl font-bold text-amber-900 mb-4">Semester Promotion</h3>
      <p className="text-amber-800/80 mb-8 decoration-slate-500">
        Bulk promote all classes and students. The system will automatically update class names (e.g., S1 to S2) and increment user semesters. Students in S8 will be graduated.
      </p>
      <button onClick={handlePromote} disabled={loading} className="w-full rounded-xl bg-amber-600 py-4 text-lg font-bold text-white shadow-lg hover:bg-amber-700 transition-all disabled:opacity-70">
        {loading ? 'Processing Promotion...' : 'Trigger Global Promotion'}
      </button>
    </div>
  );
}
function DepartmentsTab({ departments, onUpdate }) {
  const [newDept, setNewDept] = useState({ name: '', code: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', code: '' });

  const handleCreate = async () => {
    if (!newDept.name || !newDept.code) return alert('Name and Code are required');
    try {
      const res = await fetch('http://localhost:5000/api/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDept)
      });
      if (res.ok) {
        setNewDept({ name: '', code: '' });
        setIsAdding(false);
        onUpdate();
      } else {
        const data = await res.json();
        alert('Failed to add department: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to add department: ' + err.message);
    }
  };

  const handleUpdate = async (id) => {
    if (!editData.name || !editData.code) return alert('Name and Code are required');
    if (!window.confirm(`Are you sure you want to update this department?`)) {
      setEditingId(null);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/admin/departments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (res.ok) {
        setEditingId(null);
        onUpdate();
      } else {
        const data = await res.json();
        alert('Failed to update department: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to update department: ' + err.message);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the "${name}" department? This cannot be undone.`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/departments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onUpdate();
      } else {
        const data = await res.json();
        alert('Failed to delete department: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to delete department: ' + err.message);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Departments</h3>
          <p className="text-sm text-slate-500">Manage campus departments and faculties with unique codes</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {isAdding && (
        <div className="mb-8 grid gap-3 sm:grid-cols-3 animate-in fade-in slide-in-from-top-2 duration-200 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <input
            type="text"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            placeholder="Department Name"
            value={newDept.name}
            onChange={e => setNewDept({ ...newDept, name: e.target.value })}
          />
          <input
            type="text"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
            placeholder="Code"
            value={newDept.code}
            onChange={e => setNewDept({ ...newDept, code: e.target.value })}
          />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="flex-1 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-sm">
              Save
            </button>
            <button onClick={() => setIsAdding(false)} className="rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map(dept => (
          <div key={dept.id} className="group relative flex flex-col rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:border-primary-200 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white shadow-sm text-primary-600 ring-1 ring-slate-100 group-hover:ring-primary-100 transition-colors">
                  <Building2 size={24} />
                </div>
                {editingId === dept.id ? (
                  <div className="space-y-2">
                    <input
                      autoFocus
                      className="w-full border-b-2 border-primary-500 bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                      value={editData.name}
                      onChange={e => setEditData({ ...editData, name: e.target.value })}
                    />
                    <input
                      className="w-full border-b-2 border-primary-500 bg-transparent text-xs text-slate-500 focus:outline-none"
                      value={editData.code}
                      onChange={e => setEditData({ ...editData, code: e.target.value })}
                    />
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleUpdate(dept.id)} className="text-[10px] font-bold text-emerald-600 uppercase">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-[10px] font-bold text-slate-400 uppercase">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      {dept.name}
                      <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">{dept.code}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditingId(dept.id); setEditData({ name: dept.name, code: dept.code }); }}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Edit
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => handleDelete(dept.id, dept.name)}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 italic">
            No departments found.
          </div>
        )}
      </div>
    </div>
  );
}

function ManageRolesTab({ departments }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/users');
      const data = await response.json();
      if (data.users) {
        const staffList = data.users.filter(u => u.role !== 'STUDENT' && u.role !== 'SUPER_ADMIN');
        setStaff(staffList);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId, role, departmentCode = null) => {
    if (!window.confirm(`Assign role?`)) return;
    try {
      const res = await fetch('http://localhost:5000/api/admin/assign-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, departmentCode })
      });
      if (res.ok) {
        alert('Role assigned successfully!');
        fetchStaff();
      } else {
        const data = await res.json();
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Failed to assign role');
    }
  };

  if (loading) return <div className="text-center py-10">Loading staff list...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Role Management</h3>
        <div className="grid gap-6">
          {staff.map(member => (
            <div key={member.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{member.name}</div>
                  <div className="text-sm text-slate-500">{member.email} · {member.dept}</div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${member.role === 'PRINCIPAL' ? 'bg-purple-100 text-purple-700' :
                      member.role === 'HOD' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => handleAssignRole(member.id, 'HOD', dept.code)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-primary-500 hover:text-primary-600 transition-all"
                  >
                    HOD ({dept.code})
                  </button>
                ))}
                <button
                  onClick={() => handleAssignRole(member.id, 'PRINCIPAL')}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-primary-600 text-white hover:bg-primary-700 shadow-sm transition-all"
                >
                  Principal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
