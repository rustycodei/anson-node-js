import { Router } from "express";
import UserRouter from './users.mjs';
import MongoUser from './mongoUser.mjs'


const router =  Router();

router.use(UserRouter);
router.use(MongoUser);



export default router;