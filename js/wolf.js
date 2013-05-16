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

/** @namespace */
var Wolf = {

    XRES                : 608,
    YRES                : 304,
    SLICE_WIDTH         : 3,
    WALL_TEXTURE_WIDTH  : 64,
    NUM_WALL_TEXTURES   : 55,
    HUD_FACE_WIDTH      : 48,
    HUD_FACE_HEIGHT     : 64,
    HUD_WEAPON_WIDTH    : 256,

    
    NUMAREAS            : 37,   // number of areas
    FIRSTAREA           : 0x6B, // first area in map data (it is by the way a way to the secret floor!)
    AMBUSHTILE          : 0x6A, // def guard
    AMBUSH              : -2,
    
    TILEGLOBAL          : 0x10000,
    HALFTILE            : 0x8000,
    TILESHIFT           : 16,
    MINDIST             : 0x5800,
    FLOATTILE           : 65536.0,
    
    TILE2POS            : function(a) { return (((a)<<Wolf.TILESHIFT)+Wolf.HALFTILE); },
    POS2TILE            : function(a) { return ((a)>>Wolf.TILESHIFT); },
    POS2TILEf           : function(a) { return ((a)/Wolf.FLOATTILE); },
    
    ASTEP               : 0.0078125,    // 1 FINE=x DEGREES
    ASTEPRAD            : 0.000136354,  // 1 FINE=x RADIANS
    ANG_1RAD            : 7333.8598,    // 1 RADIAN=x FINES
    ANG_0               : 0,            //(int)((float)0/ASTEP)
    ANG_1               : 128,          //(int)((float)1/ASTEP)
    ANG_6               : 768,          //(int)((float)6/ASTEP)
    ANG_15              : 1920,         //(int)((float)15/ASTEP)
    ANG_22_5            : 2880,         //(int)((float)22.5/ASTEP)
    ANG_30              : 3840,         //(int)((float)30/ASTEP)
    ANG_45              : 5760,         //(int)((float)45/ASTEP)
    ANG_67_5            : 8640,         //(int)((float)67.5/ASTEP)
    ANG_90              : 11520,        //(int)((float)90/ASTEP)
    ANG_112_5           : 14400,        //(int)((float)112.5/ASTEP)
    ANG_135             : 17280,        //(int)((float)135/ASTEP)
    ANG_157_5           : 20160,        //(int)((float)157.5/ASTEP)
    ANG_180             : 23040,        //(int)((float)180/ASTEP)
    ANG_202_5           : 25920,        //(int)((float)202.5/ASTEP)
    ANG_225             : 28800,        //(int)((float)225/ASTEP)
    ANG_247_5           : 31680,        //(int)((float)247.5/ASTEP)
    ANG_270             : 34560,        //(int)((float)270/ASTEP)
    ANG_292_5           : 37440,        //(int)((float)292.5/ASTEP)
    ANG_315             : 40320,        //(int)((float)225/ASTEP)
    ANG_337_5           : 43200,        //(int)((float)337.5/ASTEP)
    ANG_360             : 46080,        //(int)((float)360/ASTEP)
    
    ANGLES              : 360,          // must be divisable by 4
    DEATHROTATE         : 2,
    
    FINE2RAD            : function(a) { return (a * Math.PI / Wolf.ANG_180); },
    RAD2FINE            : function(a) { return (a * Wolf.ANG_180 / Math.PI); },
    FINE2DEG            : function(a) { return (a / Wolf.ANG_1) >> 0; },	// !@# don't lose precision bits
    FINE2DEGf           : function(a) { return (a / Wolf.ANG_1); },
    DEG2FINE            : function(a) { return (a * Wolf.ANG_1); }
  
};

Wolf.setConsts = function(C) {
    for (var a in C) {
        if (C.hasOwnProperty(a) && !(a in Wolf)) {
            Wolf[a] = C[a];
        }
    }
};

Wolf.noop = function() {};

Wolf.log = function(str) {
	/*
    if (typeof console != "undefined") {
        var t = new Date(),
            e = new Error(),
            f = "";
        if (typeof str == "object" && typeof e.stack == "string") { 
            // ugly hack to get some kind of reference to where the log call originated
            var s = e.stack.split("\n")[2]+"",
                m = s.match(/at (.*)$/);
            f = m ? "\t[" + m[1] + "]" : "";
        }
        console.log(t.toLocaleTimeString() + ": " + str + f);
    }
	*/
};

