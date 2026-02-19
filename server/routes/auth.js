import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { queryOne, runSql } from '../db.js';
import { sendOTPEmail } from '../mailer.js';

const router = Router();

router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required.' });
        }

        const user = queryOne('SELECT * FROM admin_users WHERE username = ?', [username]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        req.session.isAdmin = true;
        req.session.username = username;
        req.session.userId = user.id;

        return res.json({ success: true, message: 'Login successful.' });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed.' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed.' });
        res.clearCookie('indotech_session');
        return res.json({ success: true });
    });
});

router.get('/check', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.json({ authenticated: true, username: req.session.username });
    }
    return res.json({ authenticated: false });
});

router.post('/request-otp', (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: 'Username is required.' });

        const user = queryOne('SELECT * FROM admin_users WHERE username = ?', [username]);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

        runSql('UPDATE admin_users SET otp = ?, otp_expires = ? WHERE username = ?', [otp, expiresAt, username]);

        const targetEmail = 'devaraj.K@indo-tech.com';
        sendOTPEmail(targetEmail, otp);

        console.log(`🔑 OTP generated for ${username}: ${otp}`);

        return res.json({ success: true, message: 'OTP sent to the registered email address.' });
    } catch (error) {
        console.error('OTP request error:', error);
        return res.status(500).json({ error: 'Failed to send OTP.' });
    }
});

router.post('/verify-otp', (req, res) => {
    try {
        const { username, otp } = req.body;
        if (!username || !otp) return res.status(400).json({ error: 'Username and OTP are required.' });

        const user = queryOne('SELECT * FROM admin_users WHERE username = ?', [username]);
        if (!user || !user.otp) return res.status(400).json({ error: 'No OTP request found.' });

        if (new Date() > new Date(user.otp_expires)) {
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP.' });

        runSql('UPDATE admin_users SET otp = NULL, otp_expires = NULL WHERE username = ?', [username]);
        return res.json({ success: true, message: 'OTP verified. You can now reset your password.' });
    } catch (error) {
        console.error('OTP verify error:', error);
        return res.status(500).json({ error: 'Failed to verify OTP.' });
    }
});

router.post('/reset-password', (req, res) => {
    try {
        const { username, newPassword } = req.body;
        if (!username || !newPassword) return res.status(400).json({ error: 'Username and new password are required.' });
        if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

        const hashedPassword = bcrypt.hashSync(newPassword, 12);
        runSql('UPDATE admin_users SET password = ? WHERE username = ?', [hashedPassword, username]);

        return res.json({ success: true, message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({ error: 'Failed to reset password.' });
    }
});

export default router;
