import gulp from 'gulp';
import exec from 'gulp-exec'

const reportOptions = {
  err: true, // default = true, false means don't write err
  stderr: true, // default = true, false means don't write stderr
  stdout: true // default = true, false means don't write stdout
}

gulp.task('upload:gapp', (cb) => {
    gulp.src('package.json')
      .pipe(exec("gapps upload", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
      }))
      .pipe(exec.reporter(reportOptions))
  }
)