const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.use(

    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,

            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            callbackURL:
                "http://localhost:5000/api/auth/google/callback",
        },

        async (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {

            try {

                // GOOGLE EMAIL
                const email =
                    profile.emails[0].value;

                // CHECK EXISTING USER
                let user = await User.findOne({
                    email,
                });

                // CREATE USER IF NOT EXIST
                if (!user) {

                    user = await User.create({

                        name: profile.displayName,

                        email,

                        googleId: profile.id,

                        avatar: profile.photos[0].value,

                        password: "google-login",
                    });
                }

                // LOGIN SUCCESS
                done(null, user);

            } catch (error) {

                console.log(
                    "GOOGLE AUTH ERROR =>",
                    error
                );

                done(error, null);
            }
        }
    )
);

// SAVE USER ID IN SESSION
passport.serializeUser((user, done) => {

    done(null, user.id);

});

// GET USER FROM SESSION
passport.deserializeUser(
    async (id, done) => {

        try {

            const user =
                await User.findById(id);

            done(null, user);

        } catch (error) {

            done(error, null);

        }
    }
);

module.exports = passport;