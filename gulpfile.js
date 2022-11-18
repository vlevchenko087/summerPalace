const { on } = require('gulp');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
const { src, dest } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
var spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
var rename = require("gulp-rename");
// const uglify = require('gulp-uglify');
const concat = require('gulp-concat');



gulp.task('server', function() {
    browserSync.init({
        server: {
            port:9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

// gulp.task('templates:compile', function buildHTML() {
//     return gulp.src('source/templates/index.pug')
//       .pipe(pug({
//         pretty: true
//       }))
//       .pipe(gulp.dest('build'))
//   });

// copy index.html to build
gulp.task('copy:index', function(){
  return gulp.src('source/index.html')
  .pipe(gulp.dest('build'));

})

//   SASS
gulp.task('buildStyles', function () {
    return gulp.src('source/styles/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(rename('main.css'))
      .pipe(gulp.dest('build/styles'));
  })
;

// JS

// gulp.task('js', function () {
//   return gulp.src(['source/js/form.js',
//                       'source/js/main.js'])
//     .pipe(sourcemaps.init())
//     .pipe(concat('main.min.js'))
//     .pipe(uglify())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('build/js'));
// });

  //    spritesheet
  gulp.task('sprite', function (cb) {
    var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath:'../images/sprite.png',
      cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
  });


//   delete
gulp.task('clean', function del(cb) {
    return rimraf('build', cb)
});

// copy fonts
gulp.task('copy:fonts', function(){
    return gulp.src('source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));

})

// copy images
gulp.task('copy:images', function(){
    return gulp.src('source/images/**/*.*')
    .pipe(gulp.dest('build/images'));

});

// copy

gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images', 'copy:index'));

// watchers

gulp.task('watch', function () {
    gulp.watch('source/index.html', gulp.series('copy:index'));
    gulp.watch('source/styles/**/*.scss', gulp.series('buildStyles'))
    // gulp.watch('source/js/**/*.js', gulp.series('js'))
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('buildStyles', 'sprite', 'copy'),
    gulp.parallel('watch', 'server' )
));