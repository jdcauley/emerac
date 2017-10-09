const passport = requre('passport');
const passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;  
var Strategy = passportJWT.Strategy;  

const options = {
	secret: 'my-token-secret',
  jwtFromRequest: ExtractJwt.fromAuthHeader()
}

module.export = () => {

  const strategy = new Strategy(params, (payload, done) => {
    let user = users[payload.id] || null;
    if (user) {
      return done(null, {
        id: user.id
      });
    } else {
      return done(new Error("User not found"), null)
    }
  })
  passport.use(strategy)

  return {
    initialize () => {
      return passport.initialize();
    },
    authenticate () => {
      return passport.authenticate("jwt", cfg.jwtSession);
    }
  }


}