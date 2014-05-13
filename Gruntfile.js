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
                    safe_undefined: true,
                    main: 'main.js',
                    dest: 'dist/Anim.js',
                    micro_paths: true
                }
            }
        }
	});

	//grunt.registerTask('default', ['browserify']);
	grunt.registerTask('default', ['rquire']);
};