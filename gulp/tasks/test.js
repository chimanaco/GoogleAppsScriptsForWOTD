import mocha from 'gulp-mocha';
import config from 'config'
import gulp from 'gulp';

gulp.task('test', ['babel'], () => {
  return gulp.src(config.testDir + '/**/*.js')
    .pipe(mocha())
    .on('error', () => {
      gulp.emit('end');
    });
});
