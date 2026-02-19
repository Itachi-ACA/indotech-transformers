export function requireAuth(req, res, next) {
    if (req.session && req.session.isAdmin) {
        // Reset session expiry on activity
        req.session.touch();
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
}
