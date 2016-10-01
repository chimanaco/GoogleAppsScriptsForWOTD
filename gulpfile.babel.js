import gulp from 'gulp';
import config from 'config'
import requireDir from 'require-dir'
import runSequence from 'run-sequence'

requireDir('./gulp/tasks', { recurse: true });

// gulp.task('build', ['webpack']);

gulp.task('watch', () => {
  return gulp.watch( [ config.srcDir + '/**', config.testDir + '/**' ], ['release']);
});

gulp.task("release", (cb) =>
  runSequence(
    'browserify',
    'upload:gapp',
    cb
  )
)

// gulp.task('watch-test', () => {
//   return gulp.watch([config.srcDir + '/**', config.testDir + '/**'], ['test']);
// });