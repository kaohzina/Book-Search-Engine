const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "shhhhh";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // permits token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate Bearer from <tokenvalue>
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // if no token present, return request object
    if (!token) {
      return req;
    }
    try {
      // decode and attach user data to request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Token is invalid");
    }

    // return request object
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
