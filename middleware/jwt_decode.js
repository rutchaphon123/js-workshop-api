const jwt = require('jsonwebtoken')


module.export = (req, res, next) => {
    try {
        const token = req.headers.authorization.split("Bearer ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.auth = decoded;
        req.next();
    } catch (error) {
        return  res.status(401).json({
            message: 'Auth failed'
        })
    }
}
