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

function head() {
  return `/*\n MIT License. \n ${package.name} v${package.version}\n author: ${package.author}\n homepage:${package.homepage}\n */ `;
}

function css() {
  return src('src/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(footer(head()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function watchTs() {
  return src('src/index.ts')
    .pipe(tsProject())
    .pipe(babel())
    .pipe(concat(`${package.name}.min.js`))
    .pipe(dest('dist'));
}

function watching() {
  return watch([ 'src/index.ts', 'src/style.scss' ], parallel(watchTs, css));
}

function commonTs() {
  return src('src/index.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(concat(`${package.name}.base.js`))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}


function js() {
  return src(`dist/${package.name}.base.js`)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel())
    .pipe(concat(`${package.name}.js`))
    .pipe(header(head()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function jsMin() {
  return src(`dist/${package.name}.base.js`)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat(`${package.name}.min.js`))
    .pipe(header(head()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function jsMvc() {
  return src(`dist/${package.name}.base.js`)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(footer('export default UxCarousel;'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat(`${package.name}.mvc.min.js`))
    .pipe(header(head()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

function jsEs5() {
  return src([ 'node_modules/@babel/polyfill/dist/polyfill.js', `dist/${package.name}.base.js` ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat(`${package.name}.ea5.min.js`))
    .pipe(header(head()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'));
}

exports.watching = watching;
exports.default = series(commonTs, parallel(js, jsMin, jsMvc, jsEs5, css));
