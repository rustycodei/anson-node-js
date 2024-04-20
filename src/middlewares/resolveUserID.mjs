import { mockUsers } from  '../utlis/userconstants.mjs';



// GLOBAL MIDDLEWARE FOR RESOLVING ID 
export const resolveUserID = (req,res,next)=>{
    // console.log(req);
    const { params:{id} } = req;

    // changing type of destructured id into integer .
    const parseID = parseInt(id);
    if(isNaN(parseID)) return res.sendStatus(400);

    //retreiving the index of the element with id inside array mockUsers
    const findUserIndex = mockUsers.findIndex((user)=> user.id === parseID );

    // if index not found 
    if(findUserIndex === -1) return res.statusCode(404);
    
    //attaching userIndex to req object so that it can used by next middleware
    req.findUserIndex = findUserIndex;
    console.log(findUserIndex);
    next();
}



//*************   MIDDLEWARE DEFINED   *******************  */
// Middleware created 
export const loggingMiddleware = (req,res,next)=>{
    console.log(`${req.method} - ${req.url}`)
    next();
}


// GLOBAL MIDDLEWARE ..
// To make the global middleware work for every api endpoint , initliaze it before the api/route are defined 
// You can pass as many as middleware inside the use method  , make sure to call next method also 
// app.use(loggingMiddleware,(req,res,next)=>{ console.log('This is last middleware'); next(); });

//************************************************************* */
