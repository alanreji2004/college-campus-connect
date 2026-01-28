Campus Connect - College ERP
============================

Campus Connect is a role-based college ERP web application.

Tech stack:
- Backend: Node.js, Express.js, PostgreSQL, JWT, RBAC
- Frontend: React.js, Tailwind CSS

Roles:
- Super Admin
- Principal
- HOD
- Staff / Faculty
- Student
- Lab Assistant
- Accountant
- Librarian
- IT Admin

This repository contains:
- `backend/` - API server (auth, RBAC, dashboards, integrations)
- `frontend/` - React SPA with per-role dashboards

To be implemented:
- Secure JWT-based auth (HTTP-only cookies recommended)
- Role-based access control at route and UI level
- AI attendance integration (GhostFaceNet via Raspberry Pi device API)
- Analytics and reporting dashboards

