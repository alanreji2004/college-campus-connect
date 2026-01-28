const db = require('../models/db');

async function logAudit({
  actorUserId,
  actorRoles,
  action,
  entityType,
  entityId,
  metadata,
  ipAddress,
  userAgent
}) {
  try {
    await db.query(
      `INSERT INTO audit_logs
         (actor_user_id, actor_role, action, entity_type, entity_id, metadata, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        actorUserId || null,
        Array.isArray(actorRoles) ? actorRoles.join(',') : actorRoles || null,
        action,
        entityType,
        entityId || null,
        metadata || null,
        ipAddress || null,
        userAgent || null
      ]
    );
  } catch (err) {
    // Do not crash the request if audit logging fails.
    // In production, you might want to send this to a separate log sink.
    // eslint-disable-next-line no-console
    console.error('Audit log failed', err);
  }
}

module.exports = {
  logAudit
};

