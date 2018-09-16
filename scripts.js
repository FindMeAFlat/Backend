const { execFile } = require('child_process');

execFile('gulp', ['scripts'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
  // execFile('node', ['./dist/bin/www'], (error, stdout, stderr) => {
  //   if (error) {
  //     throw error;
  //   }
  //   console.log(stdout);
  // });
})