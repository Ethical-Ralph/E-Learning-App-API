import passport from 'passport'
import passportLocal from "passport-local";
import { userService } from "../database";
const localStrategy = passportLocal.Strategy;



passport.use('login',
    new localStrategy((usernameOrEmail, password, done) => {
        const condition = usernameOrEmail.includes('@') ? { email: usernameOrEmail } : { username: usernameOrEmail }
        userService.findOne(condition, (err, user) => {
            if (err) return done(null, err)
            if (!user) {
                return done(null, false, 'User not registered')
            }
            if (!user.compareHash(password)) {
                return done(null, false, "Password Incorrect")
            }
            return done(null, user)
        })

    })
);

