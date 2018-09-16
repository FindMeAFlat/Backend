const gulp = require("gulp"),
  ts = require("gulp-typescript"),
  tsProject = ts.createProject("tsconfig.json");

gulp.task('scripts', function () {
  var tsResult = gulp.src('src/**/*.ts').pipe(tsProject());
  return tsResult.js.pipe(gulp.dest("dist"))
});

gulp.task('watch', ['scripts'], function () {
  gulp.watch('src/**/*.ts', ['scripts']);
});