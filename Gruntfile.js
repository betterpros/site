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
    exec: {
      install_composer: {
        cmd: function() {
          var fs = require('fs'), cmd = '';
          if (!fs.existsSync(__dirname + '/composer.phar')) {
            cmd = 'curl -sS https://getcomposer.org/installer | php'
          }
          return cmd;
        }
      }
    },
    composer: {
      options: {
        usePhp: true,
        composerLocation: 'composer.phar'
      },
      main: {}
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
      },
      php: {
        src: 'src/*.php',
        expand: true,
        flatten: true,
        dest: grunt_output_dir
      }
    },
    watch: {
      default: {
        files: [
          'app/**.js',
          'app/**/*.jade',
          'src/*.php',
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
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-composer');

  grunt.registerTask('default', ['bower', 'exec:install_composer', 'composer:main:install:optimize-autoloader', 'copy', 'jade', 'wiredep']);
};
