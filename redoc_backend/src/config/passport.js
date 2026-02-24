const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./env');
const prisma = require('./prisma');

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Role comes from the state query param (set during /google?role=TEACHER)
        const roleFromState = req.query.state;
        const role = ['STUDENT', 'TEACHER'].includes(roleFromState) ? roleFromState : 'STUDENT';

        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          // Check if email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.emails[0].value },
          });

          if (existingUser) {
            // Link Google account to existing user
            user = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: profile.id,
                avatarUrl: existingUser.avatarUrl || profile.photos?.[0]?.value,
              },
            });
          } else {
            // Create new user with selected role
            user = await prisma.user.create({
              data: {
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                avatarUrl: profile.photos?.[0]?.value,
                role,
              },
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
