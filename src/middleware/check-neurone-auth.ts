import 'dotenv/config';
const axios = require('axios').default;

export default function(
  req: any,
  res: any,
  next: () => void) {

  try {
    
    if (process.env.disableAuth) {
      console.log("*\n*\n*\n*\n*\n*\n*-------->CHECK AUTH DISABLED\n*\n*\n*\n*\n*\n*\n*\n*\n*\n");
      next();
      return;
    }

    const neuroneAuthPort = process.env.NEURONE_AUTH_PORT || 3005;

    // pattern of the token in the header file: "Bearer <token here>"
    let token = ""
    if (req.headers.authorization){
      token = req.headers.authorization.split(" ")[1];
    }
    else {
      console.log("[check-neurone-auth] No token found in headers");
      res.status(401).json({message: "Authentication with Neurone-Auth failed"});
    }
    axios.post('http://localhost:' + neuroneAuthPort + '/auth/checkauth', {jwt: token})
      .then( (response: any) => {
        if (response.data.message !== "OK") {
          console.log("ERROR: Neurone-Auth did not authorize token.");
          res.status(401).json({message: "Authentication with Neurone-Auth failed"});
        }
        else {
          // auth successful!
          next();
        }
      })
      .catch((err: any) => {
        console.error("ERROR: axios request to retured an error.");
        console.error("Status: ", err.response.status);
        console.error("StatusText: ", err.response.statusText);
        if (!res.headersSent){
          res.status(401).json({message: "Authentication with Neurone-Auth failed"});
        }
      });
  } catch(err) {
    console.error("Unknown error while authorizing user.");
    if (!res.headersSent){
      res.status(401).json({message: "Authentication with Neurone-Auth failed"});
    }
  }
}