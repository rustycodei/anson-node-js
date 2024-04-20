import { Router } from "express";
import { query ,validationResult , matchedData ,checkSchema } from 'express-validator';
import {createValidation} from '../utlis/validationSchema.mjs';
import { mockUsers } from  '../utlis/userconstants.mjs';
import { resolveUserID } from "../middlewares/resolveUserID.mjs";



const router = Router();





// GET request : QUERY parameters
router.get('/api/users', 
        query('filter').
        isString().
        notEmpty().
        isLength({min:4,max:6}).
        withMessage('Must be 4-6 characters .') ,(req,res)=>{
            // console.log(req['express-validator#contexts']);

            const result = validationResult(req);
            console.log(result);

           
            console.log(req.sessionID);
        //checking SESSION AND SESSION-ID
            req.sessionStore.get(req.sessionID , (err,sessionData)=>{
                if(err){
                    console.log(err);
                    throw err;
                }
                console.log(sessionData);
            });
            
            // destructuring request body ...
            const { query : { filter , value } } = req;

            if(filter && value ) return res.status(200).send(mockUsers.filter((user)=>{
                return user[filter].includes(value);
            }));
            // When filter and value are undefined  or one key is sent 
            return res.status(200).send(mockUsers);
        }  
    )


    



// GET request : ROUTE params 

router.get('/api/users/:id',resolveUserID,(req,res)=>{
    
    const { findUserIndex } = req;

    const findUsers = mockUsers[findUserIndex];
     
    if(!findUsers) return res.status(404).send({msg:'No user with related id '});
    return res.send(findUsers);

})






// POST REQUEST 
router.post('/api/users' , checkSchema(createValidation) , (req,res)=>{

        const result = validationResult(req);
        console.log(result);

        if(!result.isEmpty()) return res.status(400).send({errors:result.array()});

        // Only the validated data will get extracted  while other fields from the request body will get ignored .
        const data = matchedData(req);

        //destructuring request body ...
        //const {body}  = req ;
        // const Newuser = {id:mockUsers[mockUsers.length - 1].id + 1 , ...body}

        const Newuser = {id:mockUsers[mockUsers.length - 1].id + 1 , ...data}
        mockUsers.push(Newuser);
        console.log(Newuser);
        return res.status(201).send(mockUsers);
    })







// PUT METHOD  = ENTIRE ROW/DATA UPDATE 

router.put('/api/users/:id',resolveUserID,(req,res)=>{
    // console.log(req);
    const { body , findUserIndex } = req;

    mockUsers[findUserIndex] = { id:mockUsers[findUserIndex].id , ...body }

    return res.status(200).send(mockUsers[findUserIndex]);
})







// PATCH METHOD =  A SINGLE PART OF ROW/DATA UPDATE 

router.patch('/api/users/:id',resolveUserID,(req,res)=>{
     // console.log(req);
    const { body , findUserIndex } = req;

    // destructuring only a part of the mockUsers 
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex] , ...body }

    return res.status(200).send(mockUsers[findUserIndex]);
})





//  DELETE HTTP METHOD 

router.delete('/api/users/:id',(req,res)=>{
    // destructuring req object with the findUserIndex property present inside it 
    const { findUserIndex } = req;

    mockUsers.splice(findUserIndex,1);

    return res.status(200).send(mockUsers);
})





export default router;    

