var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = mongoose.model('User');
/**
 * Function to define the model of tasks.
 * See defaults here. For example, completed is put false by default, and Date.now is the default for created.
 * See the Array of subtasks, with a embedded schema inside.
 */
module.exports = function () {


    var postSchema = new Schema({

        sport: {type: String, required: true},	
        loc :  { type: {type:String}, coordinates: [Number], name: String},
        dateInit: {type: String, required: true},	
        dateEnd: {type: String, required: true},	
        money: {type: Number, required: true},
        contact: {type: Number, required: true},	
        description: {type: String},
        idUser: {type: Schema.Types.ObjectId, Ref: "User", required: true}

    });
    postSchema.index({loc: '2dsphere'});
    mongoose.model('Post', postSchema); //per exportar el model li posem un nom
};

