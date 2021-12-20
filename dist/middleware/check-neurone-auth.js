"use strict";
var axios = require('axios').default;
module.exports = function (req, res, next) {
    try {
        // pattern of the token in the header file: "Bearer <token here>"
        var token = req.headers.authorization.split(" ")[1];
        axios.post('http://localhost:3005/auth/checkauth', { jwt: token })
            .then(function (response) {
            if (response.data.message !== "OK") {
                console.log(response);
                res.status(401).json({ message: "Authentication with Neurone-Auth failed" });
            }
        })
            .catch(function (err) {
            console.error(err);
        });
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: "Authentication with Neurone-Auth failed" });
    }
};
