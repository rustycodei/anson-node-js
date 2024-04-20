import bcrypt from 'bcrypt';


// how much complex you want Password . So algo will run that much times .
const saltRounds = 10;

export const hashPassword = (password) =>{
    const salt = bcrypt.genSaltSync(saltRounds);
    console.log(salt);
    return bcrypt.hashSync(password,salt);
}


// Comparing hashed password with plain/normal password .
export const comparePassword = (plain,hashed) =>{
    // compares plain password with hashed password 
    // returns boolean value if comparison is correct
   return bcrypt.compareSync(plain,hashed);
}