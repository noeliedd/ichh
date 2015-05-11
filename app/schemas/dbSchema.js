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
        name:{type:String, required: true},
        routeBeginning:{type :String, required: true},
        routeEnding:{type :String, required: true},
        description:{type :String, required: true},
        distance:{type :Number, required: true},
        isActive:{type :Boolean, required: true},
        dateCreated:{type: Date, default: Date.now},
        path : { type : Array , "default" : [] }
    },
    routeDrop:{
        routeId:{type:String, required: true},
        date:{type: Date, default: Date.now},
        totalMale:{type: Number, default: 0},
        totalMaleFed:{type: Number, default: 0},
        totalMaleClothed:{type: Number, default:0},
        totalFemale:{type: Number, default:0},
        totalFemaleFed:{type: Number, default:0},
        totalFemaleClothed:{type: Number, default:0},
        coordinates : { type : Array , "default" : [] }
    },
    routeOrder:{
        routeId:{type:String, required: true},
        userId:{type:String, required: true}, 
        name:{type:String, required: true},
        details:{type:String, required: true},
        date:{type: Date, default: Date.now},
        location : { type : Array , "default" : [] }
    },
      supportContacts:{
        name:{type:String, required: true},
        address:{type:String, required: true}, 
        contact:{
                  phone:{type:String, required: true},
                  email:{type:String, required: true}
                },
        category:{type:String, required: true},
    } 
}
module.exports = dbSchema;  