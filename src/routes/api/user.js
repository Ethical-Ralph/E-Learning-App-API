import express from "express";
import auth from '../auth';
import userController from "../controllers/user";

const router = express.Router();



router.post('/login', auth.optional, userController.loginUser);



router.post('/register', userController.createUser);


module.exports = router;


