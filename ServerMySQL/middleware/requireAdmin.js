// Row-level scoping: resolves the Bearer token to an admin id. Every protected query filters by req.adminId,
// and the client never sends an admin id itself.
module.exports = (mysqlConnection) => async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [rows] = await mysqlConnection
      .promise()
      .query('SELECT admin_id FROM sessions WHERE token = ? AND expires_at > NOW()', [token]);
    if (!rows.length) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.adminId = rows[0].admin_id;
    req.sessionToken = token;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
