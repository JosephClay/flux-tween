module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-rquirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['browserify'],
                options: {
                    spawn: false
                }
            }
        },

		browserify: {
            options: {
                bundleOptions: {
                    debug: true
                }
            },
            build: {
                src: ['src/index.js'],
                dest: 'dist/flux-tween.js'
            }
        },

        rquire: {
            build: {
                options: {
                    globals: {
                        'window'  : 'window',
                        'document': 'document',
                        'Math'    : 'Math',
                        'Object'  : 'Object'
                    },
                    universal: 'flux',
                    micro_paths: true,
                    safe_undefined: true,
                    main: 'index.js',
                    dest: 'dist/flux-tween.js'
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'dist/flux-tween.min.js': ['dist/flux-tween.js']
                }
            }
        },

        compress: {
            build: {
                options: {
                    mode: 'gzip'
                },
                files: [
                    {
                        src: ['dist/flux-tween.min.js'],
                        dest: 'dist/flux-tween.min.gz.js'
                    }
                ]
            }
        }
	});

    grunt.registerTask('default', ['rquire', 'uglify', 'compress']);
	grunt.registerTask('dev', ['browserify', 'watch']);
};