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
 * @description Math functions and lookup tables
 */
Wolf.Math = (function() {
 
        // ------------------------- * LUTs * -------------------------
    var SinTable = [], // [ ANG_360 + ANG_90 + 1 ], 
        CosTable = [], // SinTable + ANG_90,
        TanTable = [], //[ ANG_360 + 1 ];

        XnextTable = [], //[ ANG_360 + 1 ],
        YnextTable = [], //[ ANG_360 + 1 ],

        ColumnAngle = [], // [ 640 ]; // ViewAngle=PlayerAngle+ColumnAngle[curcolumn]; /in fines/
        
        // Angle Direction Types & LUTs (Hard Coded! Please do not mess them)
        q_first = 0, q_second = 1, q_third = 2, q_fourth = 3, // quadrant;
        dir4_east = 0, dir4_north = 1, dir4_west = 2, dir4_south = 3, dir4_nodir = 4,   // dir4type;
        
        dir8_east = 0, dir8_northeast = 1, dir8_north = 2, dir8_northwest = 3, dir8_west = 4,
        dir8_southwest = 5,    dir8_south = 6,    dir8_southeast = 7,    dir8_nodir = 8, // dir8type;

        dx4dir = [1, 0, -1,  0, 0],  // dx & dy based on direction
        dy4dir = [0, 1,  0, -1, 0],
        dx8dir = [1, 1, 0, -1, -1, -1,  0,  1, 0],  // dx & dy based on direction
        dy8dir = [0, 1, 1,  1,  0, -1, -1, -1, 0],
        opposite4 = [2, 3, 0, 1, 4],
        opposite8 = [4, 5, 6, 7, 0, 1, 2, 3, 8],
        dir4to8 = [0, 2, 4, 6, 8],
        diagonal = [
            /* east */  [dir8_nodir, dir8_nodir, dir8_northeast, dir8_nodir, dir8_nodir, dir8_nodir, dir8_southeast, dir8_nodir, dir8_nodir],
                        [dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir],
            /* north */ [dir8_northeast, dir8_nodir, dir8_nodir, dir8_nodir, dir8_northwest, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir],
                        [dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir],
            /* west */  [dir8_nodir, dir8_nodir, dir8_northwest, dir8_nodir, dir8_nodir, dir8_nodir, dir8_southwest, dir8_nodir, dir8_nodir],
                        [dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir],
            /* south */ [dir8_southeast, dir8_nodir, dir8_nodir, dir8_nodir, dir8_southwest, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir],
                        [dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir],
                        [dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir, dir8_nodir]
        ],

        // dir of delta tooks dx{-1|0|1}+1 & dy{-1|0|1}+1 and give direction
        dir4d = [
            [dir4_nodir, dir4_west , dir4_nodir],
            [dir4_south, dir4_nodir, dir4_north],
            [dir4_nodir, dir4_east , dir4_nodir]
        ],
        dir8angle = [Wolf.ANG_0, Wolf.ANG_45, Wolf.ANG_90, Wolf.ANG_135, Wolf.ANG_180, Wolf.ANG_225, Wolf.ANG_270, Wolf.ANG_315, Wolf.ANG_0];
        dir4angle = [Wolf.ANG_0, Wolf.ANG_90, Wolf.ANG_180, Wolf.ANG_270, Wolf.ANG_0];


    /** 
     * @private 
     * @description Build LUTs, etc.
     */
    function buildTables() {
        var angle, tanfov2, tanval, value,
            n;

        for (n = 0; n <= Wolf.ANG_90 ; ++n) {
            angle = Wolf.FINE2RAD(n);
            value = Math.sin(angle);
            SinTable[n] = SinTable[Wolf.ANG_180 - n] = SinTable[n + Wolf.ANG_360] = value;
            SinTable[Wolf.ANG_180 + n] = SinTable[Wolf.ANG_360 - n] = -value;
        }

        for (n = 0; n <= SinTable.length - Wolf.ANG_90; ++n) {
            CosTable[n] = SinTable[n + Wolf.ANG_90];
        }

        for (n = 0; n <= Wolf.ANG_360 ; ++n) {
            angle = Wolf.FINE2RAD(n); //angle is in radians, n is in FINEs

            if (n == Wolf.ANG_90 || n == Wolf.ANG_270) {
                TanTable[n] = Math.tan(Wolf.FINE2RAD(n - 0.5));    // infinity
                YnextTable[n] = (Wolf.FLOATTILE * Math.tan(Wolf.FINE2RAD(n - 0.5)))>>0; // infinity
            } else {
                TanTable[n] = Math.tan(angle);
                YnextTable[n] = (Wolf.FLOATTILE * Math.tan(angle))>>0;
            }

            if(n == Wolf.ANG_0 || n == Wolf.ANG_360) {
                XnextTable[n] = (Wolf.FLOATTILE / Math.tan(Wolf.FINE2RAD(n + 0.5)))>>0; // infinity
            } else if (n == Wolf.ANG_180) {
                XnextTable[n] = (Wolf.FLOATTILE / Math.tan(Wolf.FINE2RAD(n - 0.5)))>>0; // -infinity
            } else if (n == Wolf.ANG_90 || n == Wolf.ANG_270) {
                XnextTable[n] = 0;
            } else {
                XnextTable[n] = (Wolf.FLOATTILE / Math.tan(angle))>>0;
            }
        }

        tanfov2 = (Math.tan(Wolf.DEG2RAD((calcFov(75, Wolf.XRES, Wolf.YRES) / 2.0)))) * (Wolf.XRES / Wolf.YRES);
        for (n = 0; n < Wolf.XRES; ++n) {
            tanval = tanfov2 * (-1.0 + 2.0 * n / (Wolf.XRES-1));
            ColumnAngle[n] = Wolf.RAD2FINE(Math.atan(tanval)) >> 0;
        }

        Wolf.Random.init(1); // random number generators

        return 1;
    }


    /**
     * @description Calculate the field of view.
     * @memberOf Wolf.Math
     * @param {number} fovX Must be within 1 and 179 degrees.
     * @param {number} width Width of viewing area.
     * @param {number} height Height of viewing area.
     * @returns {number} The field of view in degrees.
     */
         
    function calcFov(fovX, width, height) {
        if (fovX < 1 || fovX > 179) {
            throw Error("Bad fov: " + fovX );
        }

        return Wolf.RAD2DEG(Math.atan(height / (width / Math.tan(fovX / 360 * Math.PI)))) * 2;
    }


    /**
     * @description Clips angle to [0..360] bounds.
     * @memberOf Wolf.Math
     * @param {number} alpha Angle in degrees.
     * @returns {number} Normalized angle.
     */
    function normalizeAngle(alpha) {
        if (alpha > Wolf.ANG_360) {
            alpha %= Wolf.ANG_360;
        }
        if (alpha < Wolf.ANG_0) {
            alpha = Wolf.ANG_360 - (-alpha) % Wolf.ANG_360;
        }
        return alpha;
    }


    /**
     * @description Get quadrant.
     * @memberOf Wolf.Math
     * @param {number} angle Radian angle.
     * @returns {number}
     */
    function getQuadrant(angle) {
        angle = Wolf.Angle.normalize(angle);

        if (angle < Math.PI / 2) {
            return q_first;
        } else if (angle < Math.PI) {
            return q_second;
        } else if (angle < 3 * Math.PI / 2) {
            return q_third;
        } else {
            return q_fourth;
        }
    }

    /**
     * @description Get 4 point direction.
     * @memberOf Wolf.Math
     * @param {number} angle Radian angle.
     * @returns {number} Directional point.
     */
    function get4dir(angle) {
        angle = Wolf.Angle.normalize(angle + Math.PI / 4);

        if (angle < Math.PI / 2) {
            return dir4_east;
        } else if( angle < Math.PI ) {
            return dir4_north;
        } else if( angle < 3 * Math.PI / 2 ) {
            return dir4_west;
        } else {
            return dir4_south;
        }
    }

    /**
     * @description Get 8 point direction.
     * @memberOf Wolf.Math
     * @param {number} angle Radian angle.
     * @returns {number} Directional point.
     */
    function get8dir(angle) {
        angle = Wolf.Angle.normalize(angle + Math.PI / 12);

        if ( angle <= (Math.PI / 4)) {
            return dir8_east;
        } else if (angle < (Math.PI / 2)) {
            return dir8_northeast;
        } else if (angle <= (3 * Math.PI / 4)) {
            return dir8_north;
        } else if (angle < Math.PI)  {
            return dir8_northwest;
        } else if (angle <= (5 * Math.PI / 4)) {
            return dir8_west;
        } else if (angle < (3 * Math.PI / 2)) {
            return dir8_southwest;
        } else if (angle <= (7 * Math.PI / 4)) {
            return dir8_south;
        } else {
            return dir8_southeast;
        }
    }

    /**
     * @description calculates distance between a point (x, y) and a line.
     * @memberOf Wolf.Math
     * @param {number} x X coord of point
     * @param {number} y Y coord of point
     * @param {number} a Line angle in degrees
     * @returns {number} Distance
     */
    function point2LineDist(x, y, a) {
        return Math.abs( (x * SinTable[a] - y * CosTable[a]) >> 0);
    }



    /**
     * @description Calculates line length to the point nearest to (poin).
     * @memberOf Wolf.Math
     * @param {number} x X coord of point
     * @param {number} y Y coord of point
     * @param {number} a Line angle in degrees
     * @returns {number} Distance
     */
    function lineLen2Point( x, y, a) {
        return (x * CosTable[a] + y * SinTable[a]) >> 0;
    }


    /*
                point2 = {x,y}
                  / |
                /   |    
               /     |
            /a______|----------> x
        point1 = {x, y}
    */
    /**
     * @description Returns angle in radians
     * @memberOf Wolf.Math
     * @param {number} x X coord of point
     * @param {number} y Y coord of point
     * @param {number} a Line angle in degrees
     * @returns {number} Distance
     */
    function transformPoint(point1X, point1Y, point2X, point2Y) {
        var angle = Math.atan2(point1Y - point2Y, point1X - point2X);
        return Wolf.Angle.normalize(angle);
    }


    buildTables();

    return {
        calcFov : calcFov,
        normalizeAngle : normalizeAngle,
        getQuadrant : getQuadrant,
        get4dir : get4dir,
        get8dir : get8dir,
        point2LineDist : point2LineDist,
        lineLen2Point : lineLen2Point,
        transformPoint : transformPoint,
        
        SinTable : SinTable,
        CosTable : CosTable,
        TanTable : TanTable,
        XnextTable : XnextTable,
        YnextTable : YnextTable,
        ColumnAngle : ColumnAngle,
        
        dir4_east : dir4_east,
        dir4_north : dir4_north, 
        dir4_west : dir4_west, 
        dir4_south : dir4_south, 
        dir4_nodir : dir4_nodir,
        dir8_east : dir8_east,
        dir8_northeast : dir8_northeast,
        dir8_north : dir8_north,
        dir8_northwest : dir8_northwest,
        dir8_west : dir8_west,
        dir8_southwest : dir8_southwest,
        dir8_south : dir8_south,
        dir8_southeast : dir8_southeast,
        dir8_nodir : dir8_nodir,
        dx4dir : dx4dir,
        dy4dir  : dy4dir,
        dx8dir : dx8dir,
        dy8dir : dy8dir,
        dir4angle : dir4angle,
        dir8angle : dir8angle,
        dir4to8 : dir4to8,
        opposite4 : opposite4,
        opposite8 : opposite8,
        diagonal : diagonal
    };

})();