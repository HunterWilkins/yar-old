const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema ({
    name: {
        type: String
    },

    username: {
        type: String,
        unique: true
    },

    password: {
        type: String
    },

    age: {
        type: Number
    },

    gender: {
        type: String,
    },

    race: {
        type: String,
    },

    height: {
        type: String,
    },
    
    weight: {
        type: Number,
    },

    religion: {
        type: String,
    },

    outgoing: {
        type: String,
    },

    prolife: {
        type: Boolean,
    },

    politics: {
        type: String,
    },
    
    role: {
        type: Number,
    },
    
    image: {
        type: String,
    },

    interests: {
        type: Array,
    },

    termination: {
        type: Array
    },
    
    sexy: {
        type: String
    },

    babies: {
        type: Number
    },

    leisure: {
        type: String
    },

    priority: {
        type: String
    },

    priorities: {
        type: Array
    },

    messages: {
        type: Array
    },

    id: {
        type: String,
        unique: true
    }
});

let User = mongoose.model("User", UserSchema);

module.exports = User;