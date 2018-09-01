let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// Keeping around in case we switch to project-level styles
// mix.js('resources/js/app.js', 'public/js')
//    .sass('resources/sass/app.scss', 'public/css');

let preprocessorsExcludes = [];
if (mix.preprocessors) {
    mix.preprocessors.forEach(preprocessor => {
        preprocessorsExcludes.push(preprocessor.test());
    });
}

let rules = [
    {
        test: /\.s[ac]ss$/,
        exclude: preprocessorsExcludes,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
    }
];

mix.react('resources/js/app.js', 'public/js')
   .webpackConfig({
       module: {
           rules: rules
       }
   }).sourceMaps();
