var grunt_output_dir = process.env.WERCKER_OUTPUT_DIR || 'public/'

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
      }
    },
    wiredep: {
      target: {
        src: [
          grunt_output_dir + '*.html'
        ]
      }
    },
    jade: {
      options: {
        data: function(dest, src) {
          return require('./data.json')
        }
      },
      release: {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'app/pages/*.jade',
            dest: grunt_output_dir,
            ext: '.html'
          }
        ]
      }
    },
    copy: {
      jquery: {
        expand: true,
        flatten: true,
        src: 'bower_components/jquery/dist/jquery.min.map',
        dest: grunt_output_dir
      },
      bootstrap: {
        expand: true,
        flatten: true,
        src: 'bower_components/bootstrap/dist/fonts/**',
        dest: grunt_output_dir + 'fonts/'
      }
    },
    watch: {
      default: {
        files: [
          'app/**.js',
          'app/**/*.jade',
          '*.js',
          '*.json',
        ],
        tasks: ['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('default', ['bower', 'copy', 'jade', 'wiredep']);
};
