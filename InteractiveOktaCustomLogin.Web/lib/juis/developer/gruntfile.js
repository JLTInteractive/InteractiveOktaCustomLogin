module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    bower: {
      install: {
        options: {
          targetDir: "lib/"
        }
      },
    },
    concat: {
      options: {
        separator: ";"
      },
      dist: {
        src: ["script/lib/jlta.core-2.0.js","script/lib/jlta.forms-4.2.js","script/lib/jlta.forms-au-4.0.js","script/lib/jlta.dialog-1.0.js","script/lib/jlta.datepicker-5.7.js","script/project.js"],
        dest: "script/build/<%= pkg.name %>.js"
      }
    },
    uglify: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "script/<%= pkg.name %>.min.js" : ["<%= concat.dist.dest %>"]
        }
      },
      project: {
        expand: true,
        cwd: "script",
        extDot: "last",
        src: ['*.js', '!*.min.js'],
        dest: "script/",
        ext: ".min.js"
      },
    },
    imgcompress: {
      options: {
        optimizationLevel: 1,
        duplication: "override"
      },
      dist: {
        files: [{
          expand: true,
          cwd: "images/preflight",
          src: ["*.{png,jpg}"],
          dest: "images/"
        }]
      }
    },/*
    svgstore: {
      dist: {
        files: [{
          expand: true,
          cwd: "images/preflight/icons",
          src: ["*.svg"],
          dest: "images/preflight/icons.svg"
        }]
      }
    },*/
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: "images/preflight",
          src: ["*.svg"],
          dest: "images/"
        }]
      }
    },
    grunticon: {
      dist: {
        files: [{
          expand: true,
          cwd: "images",
          src: ["*.svg"],
          dest: "images/grunt"
        }],
        options: {
          pngpath: "../preflight",
        }
      }
    },
    sass: {
      dist: {
        options: {
          lineNumbers: true,
        },
        files: [{
          expand: true,
          cwd: "sass",
          extDot: "last",
          src: ["*.scss"],
          dest: "style/",
          ext: ".css"
        }]
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({browsers: '> 1%, last 2 versions, Firefox ESR, ie >= 8'}),
        ]
      },
      dist: {
        src: 'style/*.css'
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: "style",
        extDot: "last",
        src: ['*.css', '!*.min.css'],
        dest: "style/",
        ext: ".min.css"
      }
    },
    watch: {
      scripts: {
        files: ["<%= concat.dist.src %>"],
        tasks: ["concat", "uglify"],
        options: {
          spawn: false,
        },
      },
      styles: {
        files: ["sass/*.scss"],
        tasks: ["sass"],
        options: {
          spawn: false,
        }
      },
      post: {
        files: ["style/*.css"],
        tasks: ["postcss"],
        options: {
          spawn: false,
        }        
      },
      rasters: {
        files: ["images/preflight/*.*"],
        tasks: ["imgcompress"],
        options: {
          spawn: false,
        }
      },
      icons: {
        files: ["images/preflight/icons/*.svg"],
        tasks: ["svgmin"],
        options: {
          spawn: false,
        }
      },
      vectors: {
        files: ["images/preflight/*.svg"],
        tasks: ["svgmin"],
        options: {
          spawn: false,
        }
      },
      vectorCon: {
        files: ["images/*.svg"],
        tasks: ["grunticon"],
        options: {
          spawn: true,
        }
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("imgcompress");
  grunt.loadNpmTasks("grunt-svgmin");
  grunt.loadNpmTasks("grunt-postcss");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-grunticon");
//  grunt.loadNpmTasks("grunt-svgstore");

  grunt.loadNpmTasks("grunt-bower-task");

  grunt.registerTask("default", ["bower", "uglify", "imgcompress", "svgmin", "grunticon", "sass", "postcss", "cssmin"]);
};
