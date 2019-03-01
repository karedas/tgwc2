module.exports  = function() {
    let config = {
        src: {
            base: './src',
            assets: './src/assets/',
            scss: './src/scss/',
            js: './src/assets/js/',
            img: './src/assets/images/',
            fonts:'./src/assets/fonts/'
        },
        build: {
            base: './public/',
            css: 'css/',
            js: 'js/',
            img: 'images/',
            fonts:'fonts/'
        }
    }

    return config;
}