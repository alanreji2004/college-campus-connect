-- Strengthen device security with API keys and optional IP allow-list

ALTER TABLE IF EXISTS devices
    ADD COLUMN IF NOT EXISTS api_key_hash TEXT,
    ADD COLUMN IF NOT EXISTS allowed_ip INET,
    ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_health_status TEXT;

