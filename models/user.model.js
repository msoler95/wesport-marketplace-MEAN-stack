var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Function to define the model of tasks.
 * See defaults here. For example, completed is put false by default, and Date.now is the default for created.
 * See the Array of subtasks, with a embedded schema inside.
 */
module.exports = function () {


    var userSchema = new Schema({
    	//informació Obligatoria
        mail: {type: String, unique: true, required: true},	//Ens ho donará facebook
        name: {type: String, required: true},		//Ens ho donará facebook
        password: {type: String, required: true},	//No caldra amb facebook
        isVerified: { type: Boolean, default: false },

        //informació Opcional
        surname: {type: String},    //Ens ho donará facebook
        gender:  {type: String},
        birthday: {type: Date},
        medium_valoration: {type: Number},	//Calcular cada cop que es faci una valoració
        num_valoration: {type: Number},	//+1 cada cop que es faci una valoració
        avatar: {type: String},
        contact: {type: Number}

    });

    mongoose.model('User', userSchema); //per exportar el model li posem un nom
};

