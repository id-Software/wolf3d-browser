/*
* ===========================================================================
* 
* Wolf3D Browser Version GPL Source Code
* Copyright (C) 2012 id Software LLC, a ZeniMax Media company. 
* 
* This file is part of the Wolf3D Browser Version GPL Source Code ("Wolf3D Browser Source Code").  
* 
* Wolf3D Browser Source Code is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 2 of the License, or
* (at your option) any later version.
* 
* Wolf3D Browser Source Code is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License version 2
* along with Wolf3D Browser Source Code.  If not, see <http://www.gnu.org/licenses/>.
* 
* If you have questions concerning this license, you may contact in writing id Software LLC, c/o ZeniMax Media Inc., Suite 120, Rockville, Maryland 20850 USA.
* 
* ===========================================================================
*/

 
/** 
 * @namespace 
 * @description Functions for capturing keyboard/mouse input
 */
Wolf.Input = (function() {

    var keys,
        lmbDown = false,
        rmbDown = false,
        bindings = [],
        hasFocus = false,
        mouseX = -1, mouseY = -1,
        mouseMoveX = 0, mouseMoveY = 0;
    
    function init() {
        var game = $("#game"),
            main = $("#main"),
            renderer = $("#game .renderer");
        
        if (!keys) {
            keys = [];
            
            $(document)
                .on("keydown", function(e) {
                    e.preventDefault();
                    
                    if (!Wolf.Game.isPlaying()) {
                        return;
                    }
                    
                    keys[e.keyCode] = true;
                    if (bindings[e.keyCode]) {
                        for (var i=0,n=bindings[e.keyCode].length;i<n;i++) {
                            bindings[e.keyCode][i](e);
                        }
                    }
                })
                .on("keyup", function(e) {
                    e.preventDefault();
                    if (!Wolf.Game.isPlaying()) {
                        return;
                    }
                    keys[e.keyCode] = false;
                })
                .on("keypress", function(e) {
                    e.preventDefault();
                })
                .on("contextmenu", function(e) {
                    e.preventDefault();
                })
                .on("onrightclick", function(e) {
                    e.preventDefault();
                })
                .on("mousedown", function(e) {
                    window.focus();
                    e.preventDefault();
                })
                .on("mouseup", function(e) {
                    e.preventDefault();
                });
                
            $("#game")
                .on("mousedown", function(e) {
                    if (hasFocus) {
                        if (e.which == 1) {
                            lmbDown = true;
                        } else if (e.which == 3) {
                            rmbDown = true;
                        }
                    } else {
                        window.focus();
                    }
                    e.preventDefault();
                })
                .on("mouseup", function(e) {
                    if (hasFocus) {
                        if (e.which == 1) {
                            lmbDown = false;
                        } else if (e.which == 3) {
                            rmbDown = false;
                        }
                    }
                    e.preventDefault();
                })
                .on("mousemove", function(e) {
                    if (!hasFocus) {
                        return;
                    }
                    
                    if (isPointerLocked()) {
                        if ("webkitMovementX" in e.originalEvent) {
                            mouseMoveX += e.originalEvent.webkitMovementX;
                            mouseMoveY += e.originalEvent.webkitMovementY;
                        } else if ("mozMovementX" in e.originalEvent) {
                            mouseMoveX += e.originalEvent.mozMovementX;
                            mouseMoveY += e.originalEvent.mozMovementY;
                        } else if ("movementX" in e.originalEvent) {
                            mouseMoveX += e.originalEvent.movementX;
                            mouseMoveY += e.originalEvent.movementY;
                        }
                    } else {
                        if (Wolf.Game.isFullscreen()) {
                            mouseX = e.pageX / window.innerWidth;
                            mouseY = e.pageY / window.innerHeight;
                        } else {
                            var offset = main.offset();
                            mouseX = (e.pageX - offset.left) / main.width();
                            mouseY = (e.pageY - offset.top) / main.height();
                        }
                    }
                    e.preventDefault();
                });
                
            // reset keys and mouse if window/tab loses focus
            $(window).on("blur", function(e) {
                hasFocus = false;
                reset();
            });
            $(window).on("focus", function(e) {
                hasFocus = true;
            });
        }
    }

    function reset() {
        resetMouse();
        keys = [];
    }
    
    function resetMouse() {
        lmbDown = false;
        rmbDown = false;
        mouseX = mouseY = 0.5;
    }
    
    function bindKey(k, handler) {
        var keyCode = Wolf.Keys[k];
        if (!bindings[keyCode]) {
            bindings[keyCode] = [];
        }
        bindings[keyCode].push(handler);
    }
    
    /**
     * @memberOf Wolf.Input
     * @description Check if one of the specified keys is pressed.
     * @param {array} keys Array of key names.
     * @returns {boolean} True if a key is pressed, otherwise false.
     */
    function checkKeys(ckeys) {
        for (var i=0;i<ckeys.length;i++) {
            var k = ckeys[i];
            if (!!keys[Wolf.Keys[k]]) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @memberOf Wolf.Input
     * @description Clear status for keys.
     * @param {array} keys Array of key names.
     */
    function clearKeys(ckeys) {
        for (var i=0;i<ckeys.length;i++) {
            var k = ckeys[i];
            keys[Wolf.Keys[k]] = false;
        }
        return false;
    }
    
    function leftMouseDown() {
        return lmbDown;
    }

    function rightMouseDown() {
        return rmbDown;
    }
    
    function getMouseCoords() {
        if (mouseX < 0 || mouseX > 1 || mouseY < 0 || mouseY > 1) {
            return null;
        } else {
            return {
                x : (mouseX - 0.5) * 2,
                y : (mouseY - 0.5) * 2
            };
        }
    }
    
    function getMouseMovement() {
        var x = mouseMoveX,
            y = mouseMoveY;
        mouseMoveX = 0;
        mouseMoveY = 0;
        return {
            x : x / screen.width,
            y : y / screen.height
        };
    }
    
    function getPointer() {
        var pointer = navigator.pointer ||
                      navigator.webkitPointer ||
                      navigator.mozPointer ||
                      navigator.msPointer ||
                      navigator.oPointer;
        return pointer;
    }

    function isPointerLocked() {
        var pointer = getPointer();
        return pointer && pointer.isLocked && pointer.isLocked();
    }
    
    function lockPointer() {
        var pointer = getPointer();
        if (!pointer) {
            return;
        }
        
        if (Wolf.Game.isFullscreen()) {
            pointer.lock($("#game")[0], 
                function(e) {
                    Wolf.log("Pointer locked")
                }, function(e) {
                    Wolf.log("Could not lock pointer: " + e);
                }
            );
        }
    }
    
    function unlockPointer() {
        var pointer = getPointer();
        if (!pointer) {
            return;
        }
        pointer.unlock($("#game")[0]);
    }
    
    
    return {
        init : init,
        reset : reset,
        resetMouse : resetMouse,
        checkKeys : checkKeys,
        clearKeys : clearKeys,
        bindKey : bindKey,
        leftMouseDown : leftMouseDown,
        rightMouseDown : rightMouseDown,
        getMouseCoords : getMouseCoords,
        getMouseMovement : getMouseMovement,
        isPointerLocked : isPointerLocked,
        lockPointer : lockPointer,
        unlockPointer : unlockPointer
    };

})();


Wolf.Keys = {
    LEFT    : 37,
    UP      : 38,
    RIGHT   : 39,
    DOWN    : 40,
    ENTER   : 13,
    SPACE   : 32,
    SHIFT   : 16,
    CTRL    : 17,
    ALT     : 18,
    ESC     : 27,
    HOME    : 36,
    END     : 35,
    DEL     : 46,
    INS     : 45,
    PGUP    : 33,
    PGDN    : 34,
    SLASH   : 111,
    MINUS   : 109,
    PLUS    : 107,
    COMMA   : 188,
    PERIOD  : 190,
    1       : 49,
    2       : 50,
    3       : 51,
    4       : 52,
    5       : 53,
    6       : 54,
    7       : 55,
    8       : 56,
    9       : 57,
    0       : 58,
    A       : 65,
    B       : 66,
    C       : 67,
    D       : 68,
    E       : 69,
    F       : 70,
    G       : 71,
    H       : 72,
    I       : 73,
    J       : 74,
    K       : 75,
    L       : 76,
    M       : 77,
    N       : 78,
    O       : 79,
    P       : 80,
    Q       : 81,
    R       : 82,
    S       : 83,
    T       : 84,
    U       : 85,
    V       : 86,
    W       : 87,
    X       : 88,
    Y       : 89,
    Z       : 90,
    F1      : 112,
    F2      : 113,
    F3      : 114,
    F4      : 115,
    F5      : 116,
    F6      : 117,
    F7      : 118,
    F8      : 119,
    F9      : 120,
    F10     : 121,
    F11     : 122,
    F12     : 123    
};