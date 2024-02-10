const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.get('X-Auth-Token');
    if(!token) return res.status(401).send('Unauthorized.');

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.authUser = data;
    } catch (error) {
        return res.status(400).send('Invalid token.');
    }
    next();
}