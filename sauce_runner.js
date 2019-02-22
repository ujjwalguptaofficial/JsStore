 var output = require('child_process').execSync(
     "git symbolic-ref --short HEAD"
 ).toString().trim();
 if (output === "master") {
    require('child_process').execSync(
        "npm run test:sauce"
    )
 }
 
//  process.exit(0);