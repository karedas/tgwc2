const {gitDescribe, gitDescribeSync} = require('git-describe');
 


// Another example: working directory, use 16 character commit hash abbreviation
const gitInfo = gitDescribeSync({
    customArguments: ['--abbrev=16']
});
 
// Asynchronous with promise
gitDescribe(__dirname)
    .then((gitInfo) => console.dir(gitInfo))
    .catch((err) => console.error(err));
 
// Asynchronous with node-style callback
gitDescribe(__dirname, (err, gitInfo) => {
    if (err)
        return console.error(err);
    console.dir(gitInfo);
});