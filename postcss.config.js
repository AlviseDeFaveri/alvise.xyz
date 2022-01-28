const purgecss = require('@fullhuman/postcss-purgecss')
const cssnano = require('cssnano')

module.exports = {
    plugins: {
        '@fullhuman/postcss-purgecss': {
            content: [
                './themes/hugo-theme-console/layouts/**/*.html',
                './themes/hugo-theme-console/assets/js/*.js',
                './themes/hugo-theme-console/static/js/*.js',
                './layouts/**/*.html',
                './static/js/*.js'
              ],
            whitelist: [
                'highlight',
                'language-bash',
                'pre',
                'video',
                'code',
                'content',
                'h3',
                'h4',
                'ul',
                'li'
            ]
        },
        autoprefixer: {},
        cssnano: {preset: 'default'}
    }
  };
