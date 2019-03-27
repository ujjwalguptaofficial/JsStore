 var output = require('child_process').execSync(
     "$TRAVIS_BRANCH"
 ).toString().trim();
 if (output === "master") {
    require('child_process').execSync(
        "npm run test:sauce"
    )
 }
 
//  process.exit(0);