
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
                    dest: 'public',
                    expand: true,
                    ext: '.html'
                },
                {
                    cwd: 'src/public/app',
                    src: '**/*.component.pug',
                    dest: 'src/public/compiled_app',
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
                    dest: 'src/public/compiled_app',
                    expand: true,
                    ext: '.component.css'
                }]
            }
        },
        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/public/compiled_app',
                    src: '**/*.js',
                    dest: 'src/public/compiled_app'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['pug', 'sass', 'uglify']);
}