import babel from 'gulp-babel';
import config from 'config'
import gulp from 'gulp';

gulp.task('babel', () => {
  return gulp.src(config.srcDir + '/*.js')
    .pipe(babel())
    .pipe(gulp.dest(config.targetDir));
});