module.exports  = function() {
    let config = {
        src: {
            base: './src/',
            scss: 'scss/',
            js: 'js/',
            img: 'images/',
            fonts:'fonts/'
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