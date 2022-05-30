const mongoose = require('mongoose');

const examfile = new mongoose.Schema({
    name : {
        type: String,
        required : [true, "file must have a name"],
    },
    Uploaded : {
        type : Date,
        ddefault: Date.now,
    }
});

const File = mongoose.model("file", examfile)

module.exports = File