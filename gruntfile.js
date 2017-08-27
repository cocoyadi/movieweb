/**
 * Created by yadi_coco on 2017/8/19.
 */
module.exports=function(grunt){
    //对任务初始化
    grunt.initConfig({
        watch:{
            jade:{
                files:["views/**"],
                options:{
                    livereload:true//监听事件后重启
                }
            },
            js:{
                files:["public/js/**","models/**/*.js","schemas/**/*.js"],
                // tasks:["jshint"],//对js的语法进行检验
                options:{
                    livereload:true//监听事件后重启
                }
            }
        },
        nodemon:{
            dev:{
                options:{
                    script: 'app.js',
                    args:[],
                    nodeArgs:["--debug"],
                    ignoredFiles:["README.txt","node_module/**",".DS_Store"],
                    ext:"js",
                   watch:["./"],
                    delay:100,
                    cwd:__dirname,
                    env:{
                        PORT:4000
                    }

                }
            }
        },
        //传入的任务
        concurrent:{
            tasks:["nodemon","watch"],
            options:{
                logConcurrntOutput:true
            }
        }
    })

    //文件的添加修改，都会引起在其中注册事件的重新执行
    grunt.loadNpmTasks("grunt-contrib-watch");
    //对root的文件进行监听，root文件发生改变时，会重启服务器
    grunt.loadNpmTasks("grunt-nodemon");
    //优化慢任务的执行
    grunt.loadNpmTasks("grunt-concurrent");

    //强制执行
    grunt.option("force",true);
    //注册事件，默认当前事件（传入任务）
    grunt.registerTask('default', ['concurrent']);
}
