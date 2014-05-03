module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-rquirejs');

	grunt.initConfig({
		browserify: {
            build: {
                src: ['src/main.js'],
                dest: 'dist/Anim.js'
            }
        },
        rquire: {
            build: {
                options: {
                    globals: {
                        'window': 'window',
                        'document': 'document'
                    },
                    safeUndef: true,
                    main: 'main.js',
                    dest: 'dist/rAnim.js'
                }
            }
        }
	});

	grunt.registerTask('default', ['browserify']);
};