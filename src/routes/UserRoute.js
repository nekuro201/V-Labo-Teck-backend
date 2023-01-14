const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken");

const User = require("../database/Schemas/User");

router.get('/count', async (req, res) => {
  User.countDocuments({}, function (err, count) {
    res.send(`Existe ${count} pessoas cadastradas no db!`)
  });
})

router.post('/', async (request, res) => {

  const { access_token } = request.body

  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    }
  })

  const userData = await userResponse.json()

  const userInfo = {
    googleId: userData.id,
    email: userData.email,
    name: userData.name,
    picture: userData.picture,
  }

  const { googleId, name, email, picture } = userInfo;
  
  // find user is exists in db
  let user = []
  const responseFind = await User.find({googleId: googleId});

  if(responseFind.length > 0){
    user = responseFind[0];
  }

  // if dont have user in db
  if (JSON.stringify(user) === "[]") {
    user = await User.create({
      name,
      email,
      googleId,
      picture
    });
  }

  const token = jwt.sign({
    name: user.name,
    avatarUrl: user.avatarUrl,
    googleId: user.googleId,
    }, process.env.SECRET_KEY, {
      expiresIn: '7 days',
    });

  res.send(token)
});

module.exports = router