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
 * @description Area management
 */
Wolf.Areas = (function() {
    /*
        Notes:

        Open doors connect two areas, so sounds will travel between them and sight
        will be checked when the player is in a connected area.

        Areaconnect is incremented/decremented by each door. If >0 they connect.

        Every time a door opens or closes the areabyplayer matrix gets recalculated.
        An area is true if it connects with the player's current spor.

    */
    
    /**
     * @description Initialize areas 
     * @memberOf Wolf.Areas
     * @param {object} levelState The level state object
     * @param {number} areanumber Initial area
     */
    function init(level, areanumber) {
        level.state.areaconnect = [];
        level.state.areabyplayer = [];
        for (var i=0;i<Wolf.NUMAREAS;i++) {
            level.state.areaconnect[i] = [];
            for (var j=0;j<Wolf.NUMAREAS;j++) {
                level.state.areaconnect[i][j] = 0;
            }
            level.state.areabyplayer[i] = false;
        }
        level.state.areabyplayer[areanumber] = true;
    }
    
    
    /**
     * @private
     * @description Scans outward from playerarea, marking all connected areas. 
     * @param {object} level The level object
     * @param {number} areanumber Area
     */
    function recursiveConnect(level, areanumber) {
        for (var i = 0;i < Wolf.NUMAREAS; ++i) {
            if (level.state.areaconnect[areanumber][i] && !level.state.areabyplayer[i]) {
                level.state.areabyplayer[i] = true;
                recursiveConnect(level, i);
            }
        }
    }

    /**
     * @description Connect area. 
     * @memberOf Wolf.Areas
     * @param {object} level The level object
     * @param {number} areanumber New area
     */
    function connect(level, areanumber) {
        var	i, c = 0;
        
        if (areanumber >= Wolf.NUMAREAS) {
            throw new Error("areanumber >= Wolf.NUMAREAS");
        }
        
        level.state.areabyplayer = [];
        level.state.areabyplayer[areanumber] = true;
        
        recursiveConnect(level, areanumber);
        for (i = 0; i < Wolf.NUMAREAS; i++) {
            if (level.state.areabyplayer[i]) {
                c++;
            }
        }
    }

    /**
     * @description Join ares 
     * @memberOf Wolf.Areas
     * @param {object} level The level object
     * @param {number} area1 Area 1
     * @param {number} area2 Area 2
     */
    function join(level, area1, area2) {
        if (area1 < 0 || area1 >= Wolf.NUMAREAS) {
            throw new Error("area1 < 0 || area1 >= Wolf.NUMAREAS");
        }
        if (area2 < 0 || area2 >= Wolf.NUMAREAS) {
            throw new Error("area2 < 0 || area2 >= Wolf.NUMAREAS");
        }
        level.state.areaconnect[area1][area2]++;
        level.state.areaconnect[area2][area1]++;
    }

    /**
     * @description Disconnect ares 
     * @memberOf Wolf.Areas
     * @param {object} level The level object
     * @param {number} area1 Area 1
     * @param {number} area2 Area 2
     */
    function disconnect(level, area1, area2) {
        if (area1 < 0 || area1 >= Wolf.NUMAREAS) {
            throw new Error("area1 < 0 || area1 >= Wolf.NUMAREAS");
        }
        if (area2 < 0 || area2 >= Wolf.NUMAREAS) {
            throw new Error("area2 < 0 || area2 >= Wolf.NUMAREAS");
        }
        level.state.areaconnect[area1][area2]--;
        level.state.areaconnect[area2][area1]--;
    }

    return {
        init : init,
        connect : connect,
        join : join,
        disconnect : disconnect
    };

})();

