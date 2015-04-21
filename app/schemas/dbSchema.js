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
    },
    routeDrop:{
        routeId:{type:String, required: false},
        date:{type: Date, default: Date.now},
        totalMale:{type: Number},
        totalMaleFed:{type: Number},
        totalMaleClothed:{type: Number},
        totalFemale:{type: Number},
        totalFemaleFed:{type: Number},
        totalFemaleClothed:{type: Number},
        coordinates : { type : Array , "default" : [] }
    }  
}
module.exports = dbSchema;  