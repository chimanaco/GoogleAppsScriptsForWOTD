import babel from 'gulp-babel';
import config from 'config'
import gulp from 'gulp';
import source from 'vinyl-source-stream'
import watchify from 'watchify'
import browserify from 'browserify'

const paths = {
  files : ['main.js', 'Instagram.js', 'Slack.js', 'Tumblr.js']
}

gulp.task('browserify', ['test'], () =>
  paths.files.forEach(function(entryPoint){
    // bundle option
    var bundler = watchify(
      browserify({
        cache: {}, //watchifyの差分ビルドを有効化
        entries:[ config.srcDir + '/' + entryPoint],
        debug: true,
        packageCache: {} //watchifyの差分ビルドを有効化
      }).transform('babelify')
        .plugin('gasify')
    );
    //bundle function
    function bundled(){
      return bundler
        .bundle()
        .pipe(source(entryPoint))
        .pipe(gulp.dest( config.destDir + '/' ));
    }
    bundler.on('update', bundled);
    bundler.on('log', function(message){console.log(message)});
    return bundled();
  })
);



