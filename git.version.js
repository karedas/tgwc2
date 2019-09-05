
const { gitDescribe, gitDescribeSync } = require('git-describe');
const { writeFileSync } = require('fs');
const path = require('path');

 
// Target working directory
const gitInfo = gitDescribeSync();

const info = gitDescribeSync(__dirname, {
});
const infoJson = JSON.stringify(info, null, 2);

console.log(gitInfo);
writeFileSync(path.join(__dirname, '/src/git-version.json'), infoJson);
