var jwt = require("jsonwebtoken");

const AUTH_SECRET = "$Cloudbook$Mern";


const fetchUser = (req, res, next)=>{
    //Getting auth token sent on request header
    const authToken = req.header('jwt-token');
    //If token not received then display error
    if(!authToken)
    {
        res.status(401).json({error: "Wrong authentication token!"});
    }
    try {
        //Verify the received token using .verify()
        const data = jwt.verify(authToken, AUTH_SECRET);
        //Storing the decoded user data on request
        req.user = data.user;
        //calling the next function
        next();
    } catch (error) {
        //if token not verified then display error
        res.status(401).json({error: "Wrong authentication token!"});
    }
}

module.exports = fetchUser;
