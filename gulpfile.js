const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync')

const srcSCSS = `./src/scss/**/*.scss`
const srcJS = `./src/js/**/*.js`

const destCSS = `./assets/css`
const destJS = `./assets/js`

const prodCSS = () => {
	return src(srcSCSS)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(
			autoprefixer({
				overrideBrowserslist: [
					'>= 1%',
					'last 1 major version',
					'not dead',
					'Chrome >= 45',
					'Firefox >= 38',
					'Edge >= 12',
					'Explorer >= 10',
					'iOS >= 9',
					'Safari >= 9',
					'Android >= 4.4',
					'Opera >= 30',
				],
			})
		)
		.pipe(cleanCSS())
		.pipe(sourcemaps.write('.'))
		.pipe(dest(destCSS))
		.pipe(browserSync.stream())
}
const prodJS = () => {
	return src(srcJS)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				comments: false,
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(dest(destJS))
		.pipe(browserSync.stream())
}
const devCSS = () => {
	return src(srcSCSS)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(dest(destCSS))
		.pipe(browserSync.stream())
}
const devJS = () => {
	return src(srcJS)
		.pipe(
			babel({
				comments: false,
				presets: ['@babel/env'],
			})
		)
		.pipe(dest(destJS))
		.pipe(browserSync.stream())
}
const liveReload = () => {
	// For Apache, Nginx, etc...
	// browserSync.init({
	//     proxy: "http://virtual-server-name",
	//     notify: true,
	//     open: true
	// });
	browserSync.init({
		server: true,
		notify: true,
		open: true,
	})
}

const prodWatch = () => {
	liveReload()
	watch(srcSCSS, prodCSS).on('change', browserSync.reload)
	watch(srcJS, prodJS).on('change', browserSync.reload)
	watch('./**/*.html').on('change', browserSync.reload)
}
const devWatch = () => {
	liveReload()
	watch(srcSCSS, devCSS).on('change', browserSync.reload)
	watch(srcJS, devJS).on('change', browserSync.reload)
	watch('./**/*.html').on('change', browserSync.reload)
}

exports.prod = series(parallel(prodCSS, prodJS), prodWatch)
exports.default = series(parallel(devCSS, devJS), devWatch)
