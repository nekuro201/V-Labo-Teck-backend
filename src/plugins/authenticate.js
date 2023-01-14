const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY

module.exports = (req, res, next) => {

  // Get the JWT token from the authorization header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  const tokenWithoutQuotes = token.replace(/^"|"$/g, '');

  if (tokenWithoutQuotes == null) return res.sendStatus(401) // Unauthorized

  jwt.verify(tokenWithoutQuotes, secretKey, (err, decoded) => {

    if (err) return res.sendStatus(403)

    req.googleId = decoded.googleId
    
    next() // continue with the routes
  })
}