import express from "express";
import registerUser from "../controllers/users/registerUsers";
import verifyEmail, {resendMail}  from "../controllers/users/verifyResendEmail";
import loginUser from "../controllers/users/loginUser";
import logoutUser from "../controllers/users/logoutUser";
import { checkUserAgent, checkDuplicate } from "../middlewares/user";

const userRoutes = express.Router()
userRoutes.use(express.json());
userRoutes.use(checkUserAgent);

userRoutes.post('/verify-email', verifyEmail);
userRoutes.post('/register', checkDuplicate, registerUser);
userRoutes.post('/resend-mail', resendMail);
userRoutes.post('/login', loginUser);
userRoutes.post('/logout', logoutUser);

export default userRoutes;