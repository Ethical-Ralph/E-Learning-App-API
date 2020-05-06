import Response from "../../utilities/response";
import { isEmpty } from "lodash";
import { registrationDataValidation } from "../../utilities/validation";
import { userService } from '../../database'
import passport from "passport";


class userController {
    static async createUser(req, res, next) {
        const userData = req.body.user

        const userPassword = userData.password.passOne

        const errorData = registrationDataValidation(userData)

        if (!isEmpty(errorData)) return Response.validationError(res, errorData)

        userData.password = userService.hashPass(userPassword);

        try {
            const isEmailRegistered = await userService.checkEmail(userData.email)

            if (isEmailRegistered) return Response.conflictError(res, 'An account already exists with this email')

            const data = await userService.registerUser(userData)
            const user = data.authJSON()

            return Response.customResponse(res, 200, "User created successfully", user)
        } catch (error) {
            next(err)
        }

    }

    static async loginUser(req, res, next) {
        let userData;
        let infoData;
        passport.authenticate('login', (err, user, info) => {
            if (info) {
                infoData = info.message ? info.message : info
            }
            if (err) return Response.customResponse(res, 500, 'An Error Occured', err.message)

            if (!user) return Response.authenticationError(res, infoData)

            userData = user.authJSON()

            return Response.customResponse(res, 200, 'Login Successful', userData)
        })(req, res, next)

    }

}


export default userController