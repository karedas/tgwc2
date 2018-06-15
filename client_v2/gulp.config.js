module.exports  = function() {
    let config = {
        src: {
            base: './src/',
            scss: 'scss/',
            js: 'js/',
            img: 'images/'
        },
        build: {
            base: './public/',
            css: 'css/',
            js: 'js/',
            img: 'images/',
        }
    }

    return config;
}