const { src, dest, parallel, watch, series } = require('gulp');
const package = require('./package.json');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const header = require('gulp-header');
const footer = require('gulp-footer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const browserSync = require('browser-sync').create();

function fnHead() {
  return `/*\n MIT License. \n ${package.name} v${package.version}\n author: ${package.author}\n homepage:${package.homepage}\n */ `;
}

function taskCss() {
  return src('src/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(footer(fnHead()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
}

function taskWatchTs() {
  return src('src/index.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(concat(`${package.name}.min.js`))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
}

function fnWatch() {
  return watch([ 'src/index.ts', 'src/style.scss' ], parallel(taskWatchTs, taskCss));
}

function taskTs() {
  return src('src/index.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(concat(`${package.name}.base.js`))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}


function taskJs() {
  return src(`dist/${package.name}.base.js`)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel())
    .pipe(concat(`${package.name}.js`))
    .pipe(header(fnHead()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function taskJsMin() {
  return src(`dist/${package.name}.base.js`)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat(`${package.name}.min.js`))
    .pipe(header(fnHead()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function taskJsMvs() {
  return src(`dist/${package.name}.base.js`)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(footer('export default UxDialog;'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat(`${package.name}.mvc.min.js`))
    .pipe(header(fnHead()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function taskJsEs5() {
  return src([ 'node_modules/@babel/polyfill/dist/polyfill.js', `dist/${package.name}.base.js` ])
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat(`${package.name}.ea5.min.js`))
    .pipe(header(fnHead()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function taskBrowserSync() {
  return browserSync.init({ port: 3333, server: { index: './demo/index.html' } });

}

exports.watch = parallel(fnWatch, taskBrowserSync);
exports.default = series(taskTs, parallel(taskJs, taskJsMin, taskJsMvs, taskJsEs5, taskCss));
