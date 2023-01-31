const jwt = require("jsonwebtoken");

const signIn = (userId, roleGroupId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      id: userId,
      roleGroupId: roleGroupId
    };
    const options = {
      expiresIn: "1h",
    };
    jwt.sign(payload, process.env.TOKEN_SECRET, options, (err, token) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const verifyToken = (req, res, next) => {
  const rawToken = req.header("Authorization");
  if (!rawToken || !rawToken.startsWith("Bearer ")) {
    res.status(401).json({
      code: 401,
      error: "Access denied",
    });
  } else {
    const token = rawToken.substring(7);

    try {
      req.user = jwt.verify(token, process.env.TOKEN_SECRET);
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({
        code: 401,
        error: err,
      });
    }
  }
};

module.exports = {
  signIn,
  verifyToken,
};
