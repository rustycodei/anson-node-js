import passport from 'passport';
import { Strategy } from 'passport-local'
import { mockLoginUser } from '../utlis/userconstants.mjs';



passport.serializeUser((user,done)=>{
    console.log('Inside Serializer');
    console.log(user);
    done(null,user.id);
})


passport.deserializeUser((id,done)=>{
    console.log('Inside Deserializer!');
    console.log(`Deserialized User Id  : ${id}`);
    try{
        const finduser = mockLoginUser.find( user => user.id === id);
        if(!finduser) throw new Error('User not found');
        done(null,finduser);
    }
    catch(err){
        done(err,null);
    }
})


export default passport.use(new Strategy(
        {usernameField:'name'},
        (name,password,done)=>{
            console.log(`name:${name} , password:${password}`)
            try{
                const findUser = mockLoginUser.find(user => user.name ===  name)

                // If user not found or Password doesnt match //
                if(!findUser) throw new Error('User not found !');
                if( findUser.password !== password ) throw new Error('Password is wrong !');

                // IF user got found //    
                done(null,findUser);
            }
            catch(err){
                done(err,null);
            }
        }
    )
)