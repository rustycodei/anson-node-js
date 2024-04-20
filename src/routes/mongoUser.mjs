import { Router } from "express";
import { query ,validationResult , matchedData ,checkSchema } from 'express-validator';
import {mongoValidation} from '../utlis/mongoUserValidation.mjs';
import { User } from '../mongoose/schema/user.mjs'
import { hashPassword } from "../utlis/helper.mjs";

const router = Router();




// Post route for creating users ....
router.post('/api/mongo/user',
    checkSchema(mongoValidation),
    async (req,res)=>{

        const result = validationResult(req);
        if(!result.isEmpty()) return res.status(400).json(result.array());

        const data = matchedData(req);
        console.log(data);
        // const { body } = req;
        
        data.password = hashPassword(data.password)
        
        // Creating new user 
        const newUser = new User(data);
        try{
            const savedUser = await newUser.save();
            return res.status(201).json(savedUser);
        }catch(err){
            console.log(err);
            return res.sendStatus(400);
        }
})


export default router;
  