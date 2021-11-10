
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Function to define the model of tasks.
 * See defaults here. For example, completed is put false by default, and Date.now is the default for created.
 * See the Array of subtasks, with a embedded schema inside.
 */
module.exports = function() {


    var tokenSchema = new mongoose.Schema({
        _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        token: { type: String, required: true },
        createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
    });

    mongoose.model('Token', tokenSchema); //per exportar el model li posem un nom
};