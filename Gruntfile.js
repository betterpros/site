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
          grunt_output_dir + '/**.js',
          grunt_output_dir + '/**.html',
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
        src: [
          'bower_components/jquery/dist/jquery.min.map',
          'bower_components/jquery/dist/jquery.min.js',
        ],
        dest: grunt_output_dir
      },
      bootstrap: {
        expand: true,
        flatten: true,
        src: [
          'lib/bootstrap/bootstrap.css',
          'lib/bootstrap/bootstrap.js'
        ],
        dest: grunt_output_dir
      },
      fontawesome: {
        expand: true,
        flatten: true,
        src: 'lib/font-awesome/font-awesome.css',
        dest: grunt_output_dir
      },
      theme: {
        src: 'bower_components/bootstrap-theme-cirrus/dist/css/bootstrap.min.css',
        dest: grunt_output_dir + '/theme.css'
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
