const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('../lib/mailer');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SESSION_DAYS = 7;
const VERIFICATION_HOURS = 24;

const newToken = () => crypto.randomBytes(32).toString('hex');
const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');
const verifyLink = (token) => `${process.env.APP_URL || 'http://localhost:3000'}/#/verify?token=${token}`;

module.exports = (app, mysqlConnection, requireAdmin) => {
  const db = mysqlConnection.promise();

  // Gives the admin a fresh verification token and emails the link
  const startVerification = async (adminId, email) => {
    const token = newToken();
    await db.query(
      'UPDATE admins SET verification_token = ?, verification_expires = NOW() + INTERVAL ? HOUR WHERE id = ?',
      [token, VERIFICATION_HOURS, adminId]
    );
    await sendVerificationEmail(email, verifyLink(token));
  };

  app.post('/auth/signup', async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
      const [existing] = await db.query('SELECT id, is_verified FROM admins WHERE email = ?', [email]);
      if (existing.length && existing[0].is_verified) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      // An unverified sign-up can be repeated: it updates the password and resends the link
      const passwordHash = await bcrypt.hash(password, 10);
      let adminId;
      if (existing.length) {
        adminId = existing[0].id;
        await db.query('UPDATE admins SET password_hash = ? WHERE id = ?', [passwordHash, adminId]);
      } else {
        const [result] = await db.query('INSERT INTO admins (email, password_hash) VALUES (?, ?)', [email, passwordHash]);
        adminId = result.insertId;
      }

      await startVerification(adminId, email);
      res.status(201).json({ message: 'Check your inbox to verify your email' });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Could not complete sign up' });
    }
  });

  app.post('/auth/verify', async (req, res) => {
    const { token } = req.body;
    if (typeof token !== 'string' || !token) {
      return res.status(400).json({ error: 'Invalid or expired link' });
    }

    try {
      const [result] = await db.query(
        `UPDATE admins SET is_verified = 1, verification_token = NULL, verification_expires = NULL
         WHERE verification_token = ? AND verification_expires > NOW()`,
        [token]
      );
      if (!result.affectedRows) {
        return res.status(400).json({ error: 'Invalid or expired link' });
      }
      res.json({ verified: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // Always answers 200 so the endpoint can't be used to discover which emails have accounts
  app.post('/auth/resend-verification', async (req, res) => {
    const email = normalizeEmail(req.body.email);
    try {
      const [rows] = await db.query('SELECT id FROM admins WHERE email = ? AND is_verified = 0', [email]);
      if (rows.length) {
        await startVerification(rows[0].id, email);
      }
    } catch (err) {
      console.error('Resend verification error:', err);
    }
    res.json({ message: 'If the account exists and is not verified, a new link was sent' });
  });

  app.post('/auth/login', async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    // bcrypt.compare throws on non-string input
    if (!email || typeof password !== 'string' || !password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    try {
      const [rows] = await db.query('SELECT id, email, password_hash, is_verified FROM admins WHERE email = ?', [email]);
      const admin = rows[0];
      if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      if (!admin.is_verified) {
        return res.status(403).json({ code: 'EMAIL_NOT_VERIFIED', error: 'Please verify your email before logging in' });
      }

      const token = newToken();
      await db.query('INSERT INTO sessions (token, admin_id, expires_at) VALUES (?, ?, NOW() + INTERVAL ? DAY)', [
        token,
        admin.id,
        SESSION_DAYS,
      ]);
      res.json({ token, email: admin.email });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.get('/auth/me', requireAdmin, async (req, res) => {
    try {
      const [rows] = await db.query('SELECT email FROM admins WHERE id = ?', [req.adminId]);
      res.json({ email: rows[0]?.email });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  app.post('/auth/logout', requireAdmin, async (req, res) => {
    try {
      await db.query('DELETE FROM sessions WHERE token = ?', [req.sessionToken]);
      res.json({ loggedOut: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Database error' });
    }
  });
};
