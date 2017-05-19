
module.exports = function (grunt) {
    grunt.initConfig({
        pug: {
            compile: {
                options: {
                    data: {
                        debug: false
                    }
                },
                files: [{
                    cwd: 'src/public',
                    src: 'index.pug',
                    dest: 'dist/public',
                    expand: true,
                    ext: '.html'
                },
                {
                    cwd: 'src/public/app',
                    src: '**/*.component.pug',
                    dest: 'src/public/app',
                    expand: true,
                    ext: '.component.html'
                }]
            }
        },
        sass: {
            dist: {
                options: {
                },
                files: [{
                    cwd: 'src/public/app',
                    src: '**/*.sass',
                    dest: 'src/public/app',
                    expand: true,
                    ext: '.component.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['pug', 'sass']);
}