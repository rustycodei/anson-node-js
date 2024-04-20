export const mongoValidation = {
    name : {
        isLength : {
            options : {
                min:4 ,
                max:6
            },
            errormessage: "Must be 4-6 characters."
        },
        notEmpty : {
            errormessage : "Name field is empty"
        } ,
        isString : {
            errormessage : "Name must be string"
        },
    },
    password : {
        isLength : {
            options : {
                min:5 ,
                max:8
            },
            errormessage: "Password Must be 5-8 characters."
        },
        notEmpty : {
            errormessage : "Password field is empty"
        } ,
        isString : {
            errormessage : "Password must be string"
        },
    }

}