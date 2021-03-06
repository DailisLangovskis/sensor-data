const jwt = require('jsonwebtoken')
exports.authentificateToken = function (req, res, next) {
    //check for authorization header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[0]
    if (token == null) return res.sendStatus(403)
    //verify users JWT
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).send('Please relog to proceed!')
        req.user = user
        next()
    })
}