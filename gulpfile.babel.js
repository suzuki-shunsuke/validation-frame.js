import gulp from 'gulp';
import mocha from 'gulp-mocha';

gulp.task('test', () => {
  return gulp.src('test/src/main.js', {read: false}).pipe(mocha());
});
