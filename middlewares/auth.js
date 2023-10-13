const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    //check token
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Authentication Error" });

    //validate
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) return res.status(400).json({ msg: "Authentication Failed" });
      req.user = user;
      next();
    });
  } catch {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
