-- Additional columns and tables to support AI-based attendance

-- Add metadata columns to attendance if they don't exist
ALTER TABLE IF EXISTS attendance
    ADD COLUMN IF NOT EXISTS confidence NUMERIC(5,4),
    ADD COLUMN IF NOT EXISTS needs_review BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'DEVICE';

-- Device logs table (if not already present)
CREATE TABLE IF NOT EXISTS device_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    log_type TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_logs_device_id ON device_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_device_logs_created_at ON device_logs(created_at);

-- Face encodings table (if not already present)
CREATE TABLE IF NOT EXISTS face_encodings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    encoding JSONB NOT NULL, -- expected to be numeric vector, e.g. [0.1, 0.2, ...]
    version TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_face_encodings_student_id ON face_encodings(student_id);
CREATE INDEX IF NOT EXISTS idx_face_encodings_staff_id ON face_encodings(staff_id);
CREATE INDEX IF NOT EXISTS idx_face_encodings_is_active ON face_encodings(is_active);

