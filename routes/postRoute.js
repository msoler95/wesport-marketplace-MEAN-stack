var express = require('express');
var router = express.Router();
var User = require('mongoose').model('User');
var Post = require('mongoose').model('Post');
var ObjectId = require('mongoose').Types.ObjectId;
var jwt_secret = require('../config').jwt_secret;
var express_jwt = require('express-jwt');


////////  CREATE  /////////

router.post('/createPost', express_jwt({ secret: jwt_secret }), function(req, res, next) {
    req.assert('sport', 'Falta algun parametro').notEmpty();
    req.assert('dateInit','Falta algun parametro').notEmpty();
    req.assert('dateEnd', 'Falta algun parametro').notEmpty();
    req.assert('money', 'Falta algun parametro').notEmpty();
    req.assert('contact', 'Falta algun parametro').notEmpty();
    req.assert('loc', 'Falta algun parametro').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.json({ success: false, msg: 'Revisa los campos' });
    }

    if(req.body.dateInit > req.body.dateEnd) res.json({ success: false, msg: 'La fecha de finalización es menor a la de inicio' });
    User.findOne({ "mail": req.user.mail }).exec(function(err, user) {
        if (err) res.json({ success: false, msg: 'Ha ocurrido un error' });
        else {
            var postData = {
                sport: req.body.sport,
                dateInit: req.body.dateInit,
                dateEnd: req.body.dateEnd,
                money: req.body.money,
                contact: req.body.contact,
                description: req.body.description,
                loc: req.body.loc,
                idUser: new ObjectId(user._id)
            };
            var new_post = new Post(postData); //pone los paramentros en esquema Task
            new_post.save(function(err, post) {
                if (err) {
                    console.log(err);
                    res.json({ success: false, msg: 'Ha ocurrido un error' });
                } else {
                    res.json({ success: true, msg: 'Felicidades! Tu anuncio ya está visible' });
                }
            })
        }
    })
});



////////  GET  /////////

//Find information of a User
router.get('/getPersonalPosts', express_jwt({ secret: jwt_secret }), function(req, res, next) {

    User.findOne({ "mail": req.user.mail }).exec(function(err, data) {
        if (err) {
            console.log(err)
            res.json({ success: false, msg: 'Ha ocurrido un error' });
        } else {
            Post.find({ "idUser": req.user._id }).exec(function(err, posts) {
                if (err) {
                    res.json({ success: false, msg: 'Ha ocurrido un error' });
                } else res.json({ success: true, posts: posts }); //Enviem info 
            })
        }
    })
});

router.post('/getTelefonOfPost', express_jwt({ secret: jwt_secret }), function(req, res, next) {
    Post.findOne({ _id: req.body.id_post }, function(err, post) {
        if (err) {
            res.json({ success: false, msg: 'Ha ocurrido un error' });
        } else {
            var telf = post.contact;
            res.json({ success: true, tlf: telf }); //Enviem info 
        }

    });

});

router.get('/getAllPosts', function(req, res, next) {
    Post.find({}, function(err, posts) {
        User.populate(posts, { path: "idUser", select: 'name avatar' }, function(err, user) {
            if (err) {
                console.log(err)
                res.json({ success: false, msg: 'Ha ocurrido un error' });
            } else {
                res.json({ success: true, posts: posts }); //Enviem info 
            }
        })

    })
});


// router.get('/getAllPosts', function(req, res, next) {

//     var maxDistance = 7000; //km
//     maxDistance = maxDistance * 1000;
//     Post.collection.geoNear(40.411283, -3.699336, { "distanceMultiplier": 6371, spherical: true, maxDistance: maxDistance / 6370000 }, function(err, result) {
//         if (err) res.json(err);
//         else {
//             var posts = result.results;
//             User.populate(posts, { path: "obj.idUser", select: 'name avatar' }, function(err, user) {
//                 if (err) {
//                     console.log(err)
//                     res.json({ success: false, msg: 'Ha ocurrido un error' });
//                 } else {
//                     for (var i = 0; i < posts.length; ++i) {
//                         posts[i].obj.distance = parseInt(posts[i].dis, 10); //posem la distancia dintre del objecte;
//                         posts[i] = posts[i].obj; //borrem la distancia
//                     }
//                     res.json({ success: true, posts: posts }); //Enviem info 
//                 }
//             })
//         }
//     });

// });

router.post('/getAllPostsByFilter', function(req, res, next) {
    if (req.body.sport == undefined) {
        Post.find({ dateInit: { $lte: req.body.dateInit }, dateEnd: { $gte: req.body.dateEnd }, money: { $gte: req.body.moneyMin, $lte: req.body.moneyMax } }, function(err, posts) {
            User.populate(posts, { path: "idUser", select: 'name avatar' }, function(err, user) {
                if (err) {
                    console.log(err)
                    res.json({ success: false, msg: 'Ha ocurrido un error' });
                } else {
                    res.json({ success: true, posts: posts }); //Enviem info 
                }
            })
        })
    } else {
        Post.find({ sport: req.body.sport, dateInit: { $lte: req.body.dateInit }, dateEnd: { $gte: req.body.dateEnd }, money: { $gte: req.body.moneyMin, $lte: req.body.moneyMax } }, function(err, posts) {
            User.populate(posts, { path: "idUser", select: 'name avatar' }, function(err, user) {
                if (err) {
                    console.log(err)
                    res.json({ success: false, msg: 'Ha ocurrido un error' });
                } else {
                    res.json({ success: true, posts: posts }); //Enviem info 
                }
            })

        });
    }
});


router.post('/getPostsByLocation', function(req, res, next) {

    var maxDistance = 70; //km
    maxDistance = maxDistance * 1000;
    Post.collection.geoNear(req.body.lat, req.body.lng, { "distanceMultiplier": 6371, spherical: true, maxDistance: maxDistance / 6370000 }, function(err, result) {
        if (err) res.json(err);
        else {
            var posts = result.results;
            User.populate(posts, { path: "obj.idUser", select: 'name avatar' }, function(err, user) {
                if (err) {
                    console.log(err)
                    res.json({ success: false, msg: 'Ha ocurrido un error' });
                } else {
                    for (var i = 0; i < posts.length; ++i) {
                        posts[i].obj.distance = parseInt(posts[i].dis, 10); //posem la distancia dintre del objecte;
                        posts[i] = posts[i].obj; //borrem la distancia
                    }
                    res.json({ success: true, posts: posts }); //Enviem info 
                }
            })
        }
    });

});



////////  UPDATE  /////////
router.post('/updatePost', express_jwt({ secret: jwt_secret }), function(req, res, next) {
    req.assert('sport', 'Falta algun parametro').notEmpty();
    req.assert('dateInit','Falta algun parametro').notEmpty();
    req.assert('dateEnd', 'Falta algun parametro').notEmpty();
    req.assert('money', 'Falta algun parametro').notEmpty();
    req.assert('contact', 'Falta algun parametro').notEmpty();
    req.assert('loc', 'Falta algun parametro').notEmpty();
    Post.findOne({ "_id": req.body._id, "idUser": req.user._id }).exec(function(err, post) {

        if (err) {
            console.log(err)
            res.json({ success: false, msg: 'Ha ocurrido un error' });
        } else {
            if (req.body.sport) post.sport = req.body.sport;
            if (req.body.place) post.place = req.body.place;
            if (req.body.dateInit) post.dateInit = req.body.dateInit;
            if (req.body.dateEnd) post.dateEnd = req.body.dateEnd;
            if (req.body.money) post.money = req.body.money;
            if (req.body.contact) post.contact = req.body.contact;
            if (req.body.description) post.description = req.body.description;
            if(req.body.loc) {
                console.log('loc ' + req.body.loc.name)
                post.loc = req.body.loc;
            }
            post.save(function(err, postAct) {
                if (err) {
                    console.log(err)
                    res.json({ success: false, msg: 'Ha ocurrido un error' });
                } else {
                    res.json({ success: true, msg: 'Anuncio actualizado' });
                }
            });
        }
    })
});




////////  DELETE  /////////
router.post('/deletePost', express_jwt({ secret: jwt_secret }), function(req, res, next) {

    Post.remove({ "_id": req.body.idPost, "idUser": req.user._id }).exec(function(err) {

        if (err) {
            console.log(err)
            res.json({ success: false, msg: 'Ha ocurrido un error' });
        } else {
            res.json({ success: true, msg: 'Tu anuncio ha sido eliminado' });
        }
    })

});


module.exports = router; //When calling require('tasks'), we get the router.