const axios = require('axios').default;

module.exports = (req: { headers: { authorization: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; headersSent: any; }, next: () => void) => {

  try {

    const disabled = false;
    if (disabled) {
      console.log("*\n*\n*\n*\n*\n*\n*\n*CHECK AUTH DISABLED\n*\n*\n*\n*\n*\n*\n*\n*\n*\n*\n");
      next();
    }

    // pattern of the token in the header file: "Bearer <token here>"
    let token = ""
    if (req.headers.authorization){
      token = req.headers.authorization.split(" ")[1];
    }
    else {
      console.log("[check-neurone-auth] No token found in headers");
      res.status(401).json({message: "Authentication with Neurone-Auth failed"});
    }
    // todo: change port to env variable
    axios.post('http://localhost:3005/auth/checkauth', {jwt: token})
      .then( (response: any) => {
        if (response.data.message !== "OK") {
          console.log(response);
          res.status(401).json({message: "Authentication with Neurone-Auth failed"});
        }
        else {
          // auth successful!
          next();
        }
      })
      .catch((err: any) => {
        //console.error(err);
        if (!res.headersSent){
          res.status(401).json({message: "Authentication with Neurone-Auth failed"});
        }
      });
  } catch(err) {
    console.error(err);
    if (!res.headersSent){
      res.status(401).json({message: "Authentication with Neurone-Auth failed"});
    }
  }
}