const axios = require('axios').default;

module.exports = (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }, next: any) => {

  try {

    // pattern of the token in the header file: "Bearer <token here>"
    const token = req.headers.authorization.split(" ")[1];
    axios.post('http://localhost:3005/auth/checkauth', {jwt: token})
      .then( (response: any) => {
        if (response.data.message !== "OK") {
          console.log(response);
          res.status(401).json({message: "Authentication with Neurone-Auth failed"});
        }
          
      })
      .catch((err: any) => {
        console.error(err);
      })
    next();
  } catch(err) {
    console.error(err);
    res.status(401).json({message: "Authentication with Neurone-Auth failed"});
  }
}