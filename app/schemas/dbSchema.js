dbSchema = {  
    user: {
        firstName: {type :String, required: true},
        surname: {type :String, required: true},
        phoneNumber: {type :String, required: true},
        email: {type :String, required: true, unique: true},
        password: {type :String, required: true},        
        admin: {type :Boolean, required: true}
       },
    route:{
        name:{type:String, required: false},
        routeBeginning:{type :String, required: false},
        routeEnding:{type :String, required: false},
        description:{type :String, required: false},
        distsance:{type :Number, required: false},
        isActive:{type :Boolean, required: false},
        dateCreated:{type: Date, default: Date.now},
        path : { type : Array , "default" : [] }
    }
}
module.exports = dbSchema;  