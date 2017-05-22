var models = ['./user.model', './post.model', './token.model', './resetPassword.model'];

/**
 * Function to initialize all the models, based on an Array.
 */
exports.initialize = function () {
    models.forEach(function (model) {
        require(model)();
    });
};