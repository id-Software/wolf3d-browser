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
 * @description Angle math
 */
Wolf.Angle = (function() {

    Wolf.setConsts({
        DEG2RAD         : function(a) { return a * 0.01745329251994329576; }, // a * M_PI / 180.0f
        RAD2DEG         : function(a) { return a / 0.01745329251994329576; }, // a * 180.0f / M_PI 
        ANGLE2SHORT     : function(x) {	return ((x * 65536 / 360)>>0) & 65535; },
        SHORT2ANGLE     : function(x) {	return x * 360.0 / 65536; }
    });

    /**
     * @description Finds the difference between two angles.
     * @memberOf Wolf.Angle
     * @param {number} angle1 Angle in radians.
     * @param {number} angle2 Angle in radians.
     * @returns {number} The absolute difference between two angles, this will always be between 0 and 180 degrees.
     */
    function diff(angle1, angle2) {
        var d;

        if (angle1 > angle2) {
            d = angle1 - angle2;
        } else {
            d = angle2 - angle1;
        }

        if (d > Math.PI) {
            return 2 * Math.PI - d;
        } else {
            return d;
        }
    }

    /**
     * @description Clockwise distance between two angles.
     * @memberOf Wolf.Angle
     * @param {number} angle1 Angle in radians.
     * @param {number} angle2 Angle in radians.
     * @returns {number} The clockwise distance from angle2 to angle1, this may be greater than 180 degrees.
     */
    function distCW(angle1, angle2) {
        if (angle1 > angle2) {
            return angle1 - angle2;
        } else {
            return angle1 + 2 * Math.PI - angle2;
        }
    }

    /**
     * @description Linear interpolate between angle from and to by fraction frac.
     * @memberOf Wolf.Angle
     * @param {number} from Angle in radians.
     * @param {number} to Angle in radians.
     * @param {number} frac Fraction.
     * @returns {number}
     */
    function interpolate(from, to, frac) {
        var d = diff(from, to) * frac;

        if (distCW(to, from) >= Math.PI) {
            return from - diff;
        } else {
            return from + diff;
        }
    }


    /**
     * @description Normalize angle.
     * @memberOf Wolf.Angle
     * @param {number} angle
     * @returns {number}
     */
    function normalize(angle) {
        while (angle < 0) {
            angle += (2 * Math.PI);
        }
        while (angle >= (2 * Math.PI)) {
            angle -= (2 * Math.PI);
        }
        return angle;
    }



    /**
     * @description Linear interpolate allowing for the Modulo 360 problem.
     * @memberOf Wolf.Angle
     * @param {number} from Angle in radians.
     * @param {number} to Angle in radians.
     * @param {number} frac fraction.
     * @returns {number}
     */

    function lerp(from, to, frac) {
        if (to - from > 180) {
            to -= 360;
        }
        if (to - from < -180) {
            to += 360;
        }
        return from + frac * (to - from);
    }

    return {
        diff : diff,
        distCW : distCW,
        normalize : normalize,
        interpolate : interpolate,
        lerp : lerp
    }

})();