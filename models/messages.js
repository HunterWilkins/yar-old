const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ChatSchema = new Schema ({
    recipient: {
        type: String,
        required: true,
    },

    author: {
        type: String,
        required: true
    },

    messages: {
        type: Array,
        required: true
    },

    id: {
        type: String,
        required: true
    }
   
});

let Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;