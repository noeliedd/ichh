dbSchema = {  
    user: {
        firstName: {type :String, required: true},
        surname: {type :String, required: true},
        phoneNumber: {type :String, required: true},
        email: {type :String, required: true, unique: true},
        password: {type :String, required: true}        
        //role: {type :Boolean, required: true}
       }
}
module.exports = dbSchema;  