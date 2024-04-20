import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockLoginUser } from './utlis/userconstants.mjs';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

//EITHER USE LOCAL OR  MONGOUSER-STRATEGY AS PER NEED 
// import './strategies/local-strategy.mjs';
 import './strategies/mongouser-strategy.mjs';




const app = express();


//CONNECTING TO MONGOOSE DB CONNECTION 
mongoose.connect('mongodb://127.0.0.1/express_js').
    then(()=>console.log('Connected to database')).
    catch((err)=>console.log(`Error : ${err}`));


// middleware to handle json type request body
app.use(express.json())

//Remember to use cookieParser before the routes are registered ..
// ITS A SIGNED COOKIE ..
app.use(cookieParser('secretcode'));

// REMEMBER TO CALL SERIAL WISE ROUTES SHOULD BE CALLED AFTER THE COOKIE AND SESSION 
app.use(session({
    secret : 'abhi the dev',
    saveUninitialized : false ,// false = only when session obj modified it will get stored .    // Here only passport is modifying session .   
    resave : false ,  // update the cookie in the session stored  at every http request  .
    cookie : {
        maxAge : 60000 * 60  // 1hour
    },
    store : MongoStore.create({
        client : mongoose.connection.getClient()
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);




const PORT = process.env.PORT || 3000 ;
      

// SETTING PORT NUMBER         
app.listen(PORT,()=>{
    console.log(`Running on port : ${PORT}`);
}) 



// Get request to home route         
app.get('/',(req,res)=>{
    console.log(req.session);
    console.log(req.sessionID);

    // MODIFYING SESSION OBJ AND CREATING NEW PROPERTY VISITED  
    req.session.visited  = true ; 

    // STORE SIGNED COOKIE LIKE THIS 
    //  TO ACCESS SIGNED COOKIE MUST USE SIGNED PROPERTY TO TRUE 
    res.cookie('name','abhi', { maxAge:10000 , signed:true })
    res.status(200).send({'Hey':'my name'});
})




// MIDDLEWARE APPLIED ON A SPECIFIC API ENDPOINT 
// app.get('/midware',(req,res,next)=>{

//     console.log(`${req.url}`);
//     // Pass the request to next req/res handler( MIDDLEWARE ) 
//     next();

// },(req,res)=>{
//     res.status(200).send('Hey its new api');
// })




app.get('/cookie',(req,res)=>{
    console.log(req.headers.cookie);
    console.log(req.cookies);
    // ACCESS SIGNED COOKIE LIKE THIS ..
    console.log(req.signedCookies.name);
    
    if(req.signedCookies.name && req.signedCookies.name == 'abhi'){
        return res.send({ 'name':'abhi' , 'age' : 32 });
    }
    
    return res.status(403).send({"msg":"No cookie avaliable !"});
})




//********************************************************* */
//  PASSPORT STRATEGY FOR USER AUTHENTICATION 

app.post('/api/auth' , passport.authenticate("local") , (req,res)=>{
    res.sendStatus(200);
}) 


app.post('/api/auth/logout' , (req,res)=>{
    if(!req.user) return res.sendStatus(401);

    req.logOut((err)=>{
        if(err) return res.sendStatus(400);
        res.sendStatus(200);
    })
}) 


app.get('/api/auth/status' , (req,res)=>{
    console.log(` Inside api/auth/status Endpoint`);
    console.log(req.user);
    console.log(req.session);
    console.log(req.sessionID);
    return req.user ? res.send(req.user) : res.sendStatus(401);
})





//*****************   MOCK USER LOGIN   ************************* *** */

// Mockuser LOgin 
app.post('/api/Log/auth',(req,res)=>{
    const { body:{ name , password } } = req ;
    const findUser = mockLoginUser.find( user => user.name === name);

    if(!findUser || findUser.password !== password){
        return res.status(401).send({msg:'Bad Credentials!'})
    }

    req.session.user = findUser ;
    return res.status(200).send(findUser);
})



// check login status 
app.get('/api/Log/auth/status',(req,res)=>{
    req.sessionStore.get(req.sessionID , (err,sessionData)=>{
            if(err){
                console.log(err);
                throw err;
            }
            console.log(sessionData);
        });

    return  req.session.user ? 
        res.status(200).send(req.session.user) :  res.status(401).send({msg:'Bad Credentials!'})
})



// check your data attached with login data
app.get('/api/Log/cart',(req,res)=>{
    if(!req.session.user) return res.sendStatus(401);

    return res.send( req.session.cart ?? [] );
})


// Sending or storing data in session 
app.post('/api/Log/cart',(req,res)=>{
    if(!req.session.user) return res.sendStatus(401);

    const { body:item} = req ;
    const { cart } = req.session;

    if(cart){
        cart.push(item);
    }else{
        req.session.cart = [item];
    }

    return res.status(201).send(item);
})