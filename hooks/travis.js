var crypto = require('crypto');

var express = require('express');
var router = express.Router();

var config = require('../config').hooks.travis;
var twitter = require('../twitter');

function isValid(req) {
    var hash = crypto.createHash('sha256').update(req.header('Travis-Repo-Slug') + config.token);
    return hash.digest('hex') === req.header('Authorization');
}

Number.prototype.toOrdinal = function () {
    var number = Math.floor(this);
    var ord = '';

    if (Math.floor(number % 100 / 10) === 1) {
        ord = 'th';
    } else {
        switch (number % 10) {
            case 1: ord = 'st'; break;
            case 2: ord = 'nd'; break;
            case 3: ord = 'rd'; break;
            default: ord = 'th';
        }
    }

    return number.toString() + ord;
};

router.post('/', function (req, res, next) {
    if (!req.body || !req.body.payload) {
        var err = new Error('You must specify payload parameter');
        err.status = 422;
        return next(err);
    }

    try {
        var payload = JSON.parse(decodeURIComponent(req.body.payload));
    } catch (error) {
        var err = new Error('Invalid payload');
        err.status = 400;
        return next(err);
    }

    if (!isValid(req)) {
        var err = new Error('Invalid authorization');
        err.status = 400;
        return next(err);
    }

    var text = '[Travis-CI:' + payload.repository.name + ' #' + payload.number + ']'
        + ' The build was ' + payload.status_message + '.'
        + (payload.status ? ' @hakatashi' : '')
        + ' Detail: ' + payload.build_url;

    console.log(JSON.stringify({
        headers: req.headers,
        ip: req.ip,
        query: req.query,
        body: req.body,
    }));

    twitter.post('hakatastatus', 'statuses/update', {
        status: text,
    }, function (error, responce, data) {
        if (error) {
            return next(error);
        } else {
            return res.json(data);
        }
    });
});

module.exports = router;
