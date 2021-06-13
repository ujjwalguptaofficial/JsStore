var packageInfo = require("../../package.json");
const { execSync } = require('child_process');

if (packageInfo) {
    const version = packageInfo.version;
    console.log('version', version);
    execSync(`npm pack`);
    execSync(`cd test/injector && npm un jsstore && npm i ../../jsstore-${version}.tgz --no-save`);
    console.log('building')
    execSync(`cd test/injector && npm run builds`);

}
else {
    throw "no package found";
}
