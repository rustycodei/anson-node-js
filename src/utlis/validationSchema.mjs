export const createValidation = {
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
    place : {
        notEmpty : {
            errormessage : "Name field is empty"
        } ,
        isString : {
            errormessage : "Name must be string"
        },
    }

}