-- Core attendance table for subject-wise tracking, if not already present

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
    session TEXT, -- e.g. period number or FN/AN
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'MANUAL',
    confidence NUMERIC(5,4),
    needs_review BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure one record per student/subject/date/session from primary channel
CREATE UNIQUE INDEX IF NOT EXISTS ux_attendance_unique
    ON attendance (student_id, subject_id, date, COALESCE(session, 'DEFAULT'));

CREATE INDEX IF NOT EXISTS idx_attendance_student_date
    ON attendance (student_id, date);

CREATE INDEX IF NOT EXISTS idx_attendance_subject_date
    ON attendance (subject_id, date);

-- Manual correction requests for audit-able overrides
CREATE TABLE IF NOT EXISTS attendance_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_id UUID REFERENCES attendance(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_by_role TEXT NOT NULL,
    requested_status TEXT NOT NULL CHECK (requested_status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_corrections_student
    ON attendance_corrections (student_id, subject_id);

CREATE INDEX IF NOT EXISTS idx_attendance_corrections_status
    ON attendance_corrections (status);

