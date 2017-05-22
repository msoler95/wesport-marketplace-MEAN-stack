
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Function to define the model of tasks.
 * See defaults here. For example, completed is put false by default, and Date.now is the default for created.
 * See the Array of subtasks, with a embedded schema inside.
 */
module.exports = function() {


    var resetPasswordSchema = new mongoose.Schema({
        userMail: { type: String, required: true },
        token: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },
        verified: {type: Boolean}
    });

    mongoose.model('ResetPassword', resetPasswordSchema); //per exportar el model li posem un nom
};