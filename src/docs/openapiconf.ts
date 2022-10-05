const port = process.env.PORT || 3002;

export default {
    "definition":{
        "openapi": "3.0.3",
        "info": {
            "version": "1.1.0",
            "title": "Neurone-Profile",
            "description": "Neurone component that manages user data with the help of Neurone-Auth.",
            "license": {
                "name": "AGPL-3.0",
                "url": "https://www.gnu.org/licenses/agpl-3.0.en.html"
            }
        },
        "servers": [
            {
                "url": "http://localhost:"  + port
            }
        ],
    },
    "apis": ["./src/routes/*.ts"]
    
}