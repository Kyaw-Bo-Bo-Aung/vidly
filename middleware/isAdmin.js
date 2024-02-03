module.exports = function(req, res, next) {
    if(!req.authUser.isAdmin) 
        return res.status(403).send('Access denied.');

    next();
}