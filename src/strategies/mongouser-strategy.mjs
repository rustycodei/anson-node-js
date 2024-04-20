import passport from 'passport';
import { Strategy } from 'passport-local'
import { User } from '../mongoose/schema/user.mjs';
import { comparePassword } from '../utlis/helper.mjs';




passport.serializeUser((user,done)=>{
    console.log('Inside Serializer');
    console.log(user);
    done(null,user.id);
})


passport.deserializeUser(async (id,done)=>{
    console.log('Inside Deserializer!');
    console.log(`Deserialized User Id  : ${id}`);
    try{
        const finduser = await User.findById(id);
        if(!finduser) throw new Error('User not found');
        done(null,finduser);
    }
    catch(err){
        done(err,null);
    }
})


export default passport.use( new Strategy(
        {usernameField:'name'},
        async (name,password,done)=>{
            try{
                const findUser = await User.findOne({ name })

                // If user not found  //
                if(!findUser) throw new Error('User not found !');

                console.log(findUser.password);
                if(!comparePassword(password,findUser.password)) throw new Error('Password isnt correct !');

                // IF user got found then passed to serializeUser method  //    
                done(null,findUser);
            }
            catch(err){
                done(err,null);
            }
        }
    )
)