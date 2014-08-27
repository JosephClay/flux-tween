module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-rquirejs');
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
                    universal: 'FLUX',
                    micro_paths: true,
                    safe_undefined: true,
                    main: 'index.js',
                    dest: 'dist/flux-tween.js'
                }
            }
        }
	});

	grunt.registerTask('default', ['browserify', 'watch']);
    grunt.registerTask('rq', ['rquire']);
};