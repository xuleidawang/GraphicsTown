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
var Tree = undefined;
var SpinningTree = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Tree = function Tree(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [34/255,139/255,34/255];
    };
    Tree.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["tree-vs", "tree-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                -0.5,0,-0.5, 0,1.5,0, 0.5,0,-0.5,   -0.5,0,-0.5, 0,1.5,0,  0.5,0,-0.5,//back,two overlap tirangle
                -0.5,0,-0.5, 0,1.5,0, -0.5,0,0.5,   -0.5,0,-0.5, 0,1.5,0, -0.5,0,0.5, //left
                -0.5,0,0.5, 0,1.5,0, 0.5,0,0.5,     -0.5,0,0.5, 0,1.5,0, 0.5,0,0.5,//front
                 0.5,0,-0.5, 0,1.5,0, 0.5,0,0.5,    0.5,0,-0.5, 0,1.5,0, 0.5,0,0.5,//right
                 -0.5,0,-0.5, 0.5,0,-0.5, 0.5,0,0.5,  0.5,0,-0.5, -0.5,0,0.5, 0.5,0,0.5//bottom



 
                ] },
                vnormal : {numComponents:3, data: [
                    0,0.5,-1.5, 0,0.5,-1.5,0,0.5,-1.5,    0,0.5,-1.5,0,0.5,-1.5,0,0.5,-1.5, 
                    1.5,-0.5,0,1.5,-0.5,0,1.5,-0.5,0,     1.5,-0.5,0,1.5,-0.5,0,1.5,-0.5,0,
                    0,-0.5-1.5,0,-0.5-1.5,0,-0.5-1.5,     0,-0.5-1.5,0,-0.5-1.5,0,-0.5-1.5,
                    1.5,0.5,0,1.5,0.5,0,1.5,0.5,0,       1.5,0.5,0,1.5,0.5,0,1.5,0.5,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    0,-1,0, 0,-1,0, 0,-1,0,        0,-1,0, 0,-1,0, 0,-1,0, 
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Tree.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
     	var normTrans = twgl.m4.identity();
     
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.m4.transpose(twgl.m4.inverse(modelM, normTrans), normTrans);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
       twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj,  normTrans:normTrans,lightdir:drawingState.sunDirection,
            treecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Tree.prototype.center = function(drawingState) {
        return this.position;
    }


    ////////
    // constructor for Cubes
    SpinningTree = function SpinningCube(name, position, size, color, axis) {
        Tree.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningTree.prototype = Object.create(Tree.prototype);
    SpinningTree.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/2000.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            treecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningTree.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Tree("tree1",[-2,0.3,   0.5],0.5));
grobjects.push(new Tree("tree2",[ 2,0.3,   0.5],0.5));
grobjects.push(new Tree("tree3",[ 0, 0.3,  -2],0.5));
grobjects.push(new Tree("tree4",[ 0,0.3,   2],0.5));
