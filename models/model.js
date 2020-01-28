const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let BaseSchema = new Schema ({
    username: {
        type: String
    },

    password: {
        type: String
    },

    id: {
        type: String,
        unique: true
    }
});

let Base = mongoose.model("Base", BaseSchema);

module.exports = Base;