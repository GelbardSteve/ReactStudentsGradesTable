// Resolves a Bearer token to the admin id of a live session, or null
const findAdminIdByToken = async (mysqlConnection, token) => {
  const [rows] = await mysqlConnection
    .promise()
    .query('SELECT admin_id FROM sessions WHERE token = ? AND expires_at > NOW()', [token]);
  return rows.length ? rows[0].admin_id : null;
};

const parseBearer = (header) => {
  const [scheme, token] = (header || '').split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

// Row-level scoping: resolves the Bearer token to an admin id. Every protected query filters by req.adminId,
// and the client never sends an admin id itself.
const createRequireAdmin = (mysqlConnection) => async (req, res, next) => {
  const token = parseBearer(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const adminId = await findAdminIdByToken(mysqlConnection, token);
    if (!adminId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.adminId = adminId;
    req.sessionToken = token;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = createRequireAdmin;
module.exports.findAdminIdByToken = findAdminIdByToken;
module.exports.parseBearer = parseBearer;
