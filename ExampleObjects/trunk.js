/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Trunk = undefined;

// this is a functione the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Trunk = function Trunk(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 0.5;
        this.color = color || [138/255,54/255,15/255];
    };
    Trunk.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    -.2,-.5,-.2,  .2,-.5,-.2,  .2, .5,-.2,        -.2,-.5,-.2,  .2, .5,-.2, -.2, .5,-.2,    // z = 0
                    -.2,-.5, .2,  .2,-.5, .2,  .2, .5, .2,        -.2,-.5, .2,  .2, .5, .2, -.2, .5, .2,    // z = 1
                    -.2,-.5,-.2,  .2,-.5,-.2,  .2,-.5, .2,        -.2,-.5,-.2,  .2,-.5, .2, -.2,-.5, .2,    // y = 0
                    -.2, .5,-.2,  .2, .5,-.2,  .2, .5, .2,        -.2, .5,-.2,  .2, .5, .2, -.2, .5, .2,    // y = 1
                    -.2,-.5,-.2, -.2, .5,-.2, -.2, .5, .2,        -.2,-.5,-.2, -.2, .5, .2, -.2,-.5, .2,    // x = 0
                     .2,-.5,-.2,  .2, .5,-.2,  .2, .5, .2,         .2,-.5,-.2,  .2, .5, .2,  .2,-.5, .2     // x = 1
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Trunk.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing code is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Trunk.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.




grobjects.push(new Trunk("trunk1",[-2,0.2,0.5],.3));

grobjects.push(new Trunk("tree2",[ 2,0.2,   0.5],0.3));
grobjects.push(new Trunk("tree3",[ 0, 0.2,  -2],0.3));
grobjects.push(new Trunk("tree4",[ 0,0.2,   2],0.3));
