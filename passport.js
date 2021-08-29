import GoogleStrategy1 from "passport-google-oauth20";
import mongoose from "mongoose";
import User from "./models/user.model.js";
const GoogleStrategy = GoogleStrategy1.Strategy;

export default function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value
        };

        try {
          await User.findOne(
            { googleId: newUser.googleId },
            (err, foundUser) => {
              // if user already exists
              if (foundUser) {
                done(null, foundUser);
              }
              //   else will save the newuser data into the db
              else {
                User.create(newUser, (err, data) => {
                  if (!err) {
                    done(null, data);
                  }
                });
              }
            }
          );
        } catch (e) {
          console.log(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
