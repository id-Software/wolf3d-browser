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
 * @description Door management
 */
Wolf.Doors = (function() {

    Wolf.setConsts({
        CLOSEWALL       : Wolf.MINDIST, // Space between wall & player
        MAXDOORS        : 64,           // max number of sliding doors

        MAX_DOORS       : 256, // jseidelin: doesn't look like this is used?
        DOOR_TIMEOUT    : 300,
        DOOR_MINOPEN    : 50,
        DOOR_FULLOPEN   : 63,
        DOOR_VERT       : 255,
        DOOR_HORIZ      : 254,
        DOOR_E_VERT     : 253,
        DOOR_E_HORIZ    : 252,
        DOOR_G_VERT     : 251,
        DOOR_G_HORIZ    : 250,
        DOOR_S_VERT     : 249,
        DOOR_S_HORIZ    : 248,
        FIRST_DOOR      : 248,
        LAST_LOCK       : 251,
        
        TEX_DOOR        : 98,
        // TEX_DOOR        : 126,
        
        dr_closing      : -1,
        dr_closed       : 0,
        dr_opening      : 1,
        dr_open         : 2
    });
    Wolf.setConsts({
        // texture IDs used by cache routines
        TEX_DDOOR       : (0 + Wolf.TEX_DOOR), // Simple Door
        TEX_PLATE       : (2 + Wolf.TEX_DOOR), // Door Plate
        TEX_DELEV       : (4 + Wolf.TEX_DOOR), // Elevator Door
        TEX_DLOCK        : (6 + Wolf.TEX_DOOR)  // Locked Door
    });


    /**
     * @description Reset doors in the level
     * @memberOf Wolf.Doors
     * @param {object} level The level object.
     */
    function reset(level) {
        level.state.numDoors = 0;

        for (var x=0;x<64;x++) {
            level.state.doorMap[x] = [];
            for (var y=0;y<64;y++) {
                level.state.doorMap[x][y] = 0;
            }
        }
    }

    /**
     * @description Spawn a door at the specified position.
     * @memberOf Wolf.Doors
     * @param {object} level The level object.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     * @param {number} type The door type.
     * @returns {number} The index of the new door.
     */
    function spawn(level, x, y, type) {
        if (level.state.numDoors >= Wolf.MAXDOORS) {
            throw new Error("Too many Doors on level!");
        }
        var door = level.state.doorMap[x][y] = {
                type : -1,
                vertical : 0,
                texture : -1,
                ticcount : 0
            };

        switch(type) {
            case 0x5A:
                door.type       = Wolf.DOOR_VERT;
                door.vertical   = true;
                door.texture    = Wolf.TEX_DDOOR + 1;
                break;
            case 0x5B:
                door.type       = Wolf.DOOR_HORIZ;
                door.vertical   = false;
                door.texture    = Wolf.TEX_DDOOR;
                break;
            case 0x5C:
                door.type       = Wolf.DOOR_G_VERT;
                door.vertical   = true;
                door.texture    = Wolf.TEX_DLOCK;
                break;
            case 0x5D:
                door.type       = Wolf.DOOR_G_HORIZ;
                door.vertical   = false;
                door.texture    = Wolf.TEX_DLOCK;
                break;
            case 0x5E:
                door.type       = Wolf.DOOR_S_VERT;
                door.vertical   = true;
                door.texture    = Wolf.TEX_DLOCK + 1;
                break;
            case 0x5F:
                door.type       = Wolf.DOOR_S_HORIZ;
                door.vertical   = false;
                door.texture    = Wolf.TEX_DLOCK + 1;
                break;
            case 0x64:
                door.type       = Wolf.DOOR_E_VERT;
                door.vertical   = true;
                door.texture    = Wolf.TEX_DELEV + 1;
                break;
            case 0x65:
                door.type       = Wolf.DOOR_E_HORIZ;
                door.vertical   = false;
                door.texture    = Wolf.TEX_DELEV;
                break;
            default:
                throw new Error("Unknown door type: " + type);
        }

        door.tile = {
            x : x,
            y : y
        };
        door.action = Wolf.dr_closed;

        level.state.doors[level.state.numDoors] = door;
        level.state.numDoors++;

        return level.state.numDoors - 1;
    }

    /**
     * @description Check to see if a door is open. If there are no doors in tile assume a closed door!
     * @memberOf Wolf.Doors
     * @param {object} doors The door object.
     * @returns {number} DOOR_FULLOPEN if door is opened, 
                         0 if door is closed, 
                         >0 <DOOR_FULLOPEN if partially opened.
     */
    function opened(door) {     
        return door.action == Wolf.dr_open ? Wolf.DOOR_FULLOPEN : door.ticcount;
    }

    
    /**
     * @description Process door actions.
     * @memberOf Wolf.Doors
     * @param {object} level The level object
     * @param {object} player The player object
     * @param {number} tics Tics since last
     */
    function process(level, player, tics) {
        if (player.playstate == Wolf.ex_victory) {
            return;
        }

        for (var n=0;n<level.state.numDoors;++n) {
            var door = level.state.doors[n],
                doorPos = {
                    x : Wolf.TILE2POS(door.tile.x),
                    y : Wolf.TILE2POS(door.tile.y)
                };
            switch (door.action) {
                case Wolf.dr_closed: // this door is closed!
                    continue;
                    
                case Wolf.dr_opening:
                    if (door.ticcount >= Wolf.DOOR_FULLOPEN) { // door fully opened!
                        door.action = Wolf.dr_open;
                        door.ticcount = 0;
                    } else { // opening!
                        if (door.ticcount == 0) {
                            // door is just starting to open, so connect the areas
                            Wolf.Areas.join(level, door.area1, door.area2);
                            Wolf.Areas.connect(level, player.areanumber);
                            
                            if (level.state.areabyplayer[door.area1]) { // Door Opening sound!
                                Wolf.Sound.startSound(player.position, doorPos, 1, Wolf.CHAN_AUTO, "sfx/010.wav", 1, Wolf.ATTN_STATIC, 0);
                            }
                        }

                        door.ticcount += tics;

                        if (door.ticcount > Wolf.DOOR_FULLOPEN) {
                            door.ticcount = Wolf.DOOR_FULLOPEN;
                        }
                    }
                    break;

                case Wolf.dr_closing:
                    if (door.ticcount <= 0) { // door fully closed! disconnect areas!
                        Wolf.Areas.disconnect(level, door.area1, door.area2);
                        Wolf.Areas.connect(level, player.areanumber);
                        door.ticcount = 0;
                        door.action = Wolf.dr_closed;
                    } else { // closing!
                        if (door.ticcount == Wolf.DOOR_FULLOPEN) {
                            if (level.state.areabyplayer[door.area1]) { // Door Closing sound!
                                Wolf.Sound.startSound(player.position, doorPos, 1, Wolf.CHAN_AUTO, "sfx/007.wav", 1, Wolf.ATTN_STATIC, 0);
                            }
                        }
                        door.ticcount -= tics;
                        if (door.ticcount < 0) {
                            door.ticcount = 0;
                        }
                    }
                    break;

                case Wolf.dr_open:
                    if (door.ticcount > Wolf.DOOR_MINOPEN) {
                        // If player or something is in door do not close it!
                        if (!canCloseDoor(level, player, door.tile.x, door.tile.y, door.vertical)) {
                            door.ticcount = Wolf.DOOR_MINOPEN; // do not close door immediately!
                        }
                    }
                    if (door.ticcount >= Wolf.DOOR_TIMEOUT) {
                        // Door timeout, time to close it!
                        door.action = Wolf.dr_closing;
                        door.ticcount = Wolf.DOOR_FULLOPEN;
                    } else {
                        // Increase timeout!
                        door.ticcount += tics;
                    }
                    break;
            } // End switch lvldoors->Doors[ n ].action        
        } // End for n = 0 ; n < lvldoors->numDoors ; ++n 
    }

    /**
     * @description Set the areas doors in a level
     * @memberOf Wolf.Doors
     * @param {object} level The level object.
     * @param {array} areas The areas map.
     */
    function setAreas(level) {
        var n, x, y,
            door;
        for (n=0; n<level.state.numDoors ; ++n){
            door = level.state.doors[n];
            x = door.tile.x;
            y = door.tile.y;

            if (door.vertical) {
                door.area1 = level.areas[x + 1][y] >= 0 ? level.areas[x + 1][y] : 0;
                door.area2 = level.areas[x - 1][y] >= 0 ? level.areas[x - 1][y] : 0;
            } else {
                door.area1 = level.areas[x][y + 1] >= 0 ? level.areas[x][y + 1] : 0;
                door.area2 = level.areas[x][y - 1] >= 0 ? level.areas[x][y - 1] : 0;
            }
        }
    }

    
    /**
     * @description Open a door
     * @memberOf Wolf.Doors
     * @param {object} doors The door object.
     */
    function open(door) {
        if (door.action == Wolf.dr_open) {
            door.ticcount = 0;        // reset opened time
        } else {
            door.action = Wolf.dr_opening;    // start opening it
        }
    }

    /**
     * @description Change the state of a door
     * @private
     * @param {object} level The level object.
     * @param {object} player The player object.
     * @param {object} doors The door object.
     */
    function changeDoorState(level, player, door) {
        if (door.action < Wolf.dr_opening ) {
            open(door);
        } else if (door.action == Wolf.dr_open && canCloseDoor(level, player, door.tile.x, door.tile.y, door.vertical)) {
            // !@# for the iphone with automatic using, don't allow any door close actions        
            // Door->action = dr_closing;
            // Door->ticcount = DOOR_FULLOPEN;
        }
    }

    
    function canCloseDoor(level, player, x, y, vert ) {
        var n,
            tileX = Wolf.POS2TILE(player.position.x),
            tileY = Wolf.POS2TILE(player.position.y),
            guard;

        if (tileX == x && tileY == y ) {
            return false;
        }

        if (vert) {
            if (tileY == y) {
                if (Wolf.POS2TILE(player.position.x + Wolf.CLOSEWALL) == x) {
                    return false;
                }
                if (Wolf.POS2TILE(player.position.x - Wolf.CLOSEWALL) == x) {
                    return false;
                }
            }

            for (n = 0; n<level.state.numGuards;++n) {
                guard = level.state.guards[n];
                if (guard.tile.x == x && guard.tile.y == y ) {
                    return false; // guard in door
                }
                if (guard.tile.x == x - 1 && guard.tile.y == y && Wolf.POS2TILE(guard.x + Wolf.CLOSEWALL) == x) {
                    return false; // guard in door
                }
                if (guard.tile.x == x + 1 && guard.tile.y == y && Wolf.POS2TILE(guard.x - Wolf.CLOSEWALL) == x) {
                    return false; // guard in door
                }
            }
        } else {
            if (tileX == x) {
                if (Wolf.POS2TILE(player.position.y + Wolf.CLOSEWALL) == y) {
                    return false;
                }
                if (Wolf.POS2TILE(player.position.y - Wolf.CLOSEWALL) == y) {
                    return false;
                }
            }
            for (n = 0; n<level.state.numGuards;++n) {
                var guard = level.state.guards[n];
                if (guard.tile.x == x && guard.tile.y == y ) {
                    return false; // guard in door
                }
                if (guard.tile.x == x && guard.tile.y == y - 1 && Wolf.POS2TILE(guard.y + Wolf.CLOSEWALL) == y) {
                    return false; // guard in door
                }
                if (guard.tile.x == x && guard.tile.y == y + 1 && Wolf.POS2TILE(guard.y - Wolf.CLOSEWALL) == y) {
                    return false; // guard in door
                }
            }
        }

        return true;
    }

    /**
     * @description Try to use a door with keys that the player has.
     * @memberOf Wolf.Doors
     * @param {object} level The level object
     * @param {object} player The player object
     * @param {object} door The door object
     * @returns {boolean} Always returns true.
     */
    function tryUse(level, player, door ) {
        switch (door.type) {
            case Wolf.DOOR_VERT:
            case Wolf.DOOR_HORIZ:
            case Wolf.DOOR_E_VERT:
            case Wolf.DOOR_E_HORIZ:
                changeDoorState(level, player, door); // does not require key!
                break;

            case Wolf.DOOR_G_VERT:
            case Wolf.DOOR_G_HORIZ:
                if (player.items & Wolf.ITEM_KEY_1) {
                    changeDoorState(level, player, door);
                } else {
                    Wolf.Game.notify("You need a gold key");
                }
                break;

            case Wolf.DOOR_S_VERT:
            case Wolf.DOOR_S_HORIZ:
                if (player.items & Wolf.ITEM_KEY_2) {
                    changeDoorState(level, player, door);
                } else {
                    Wolf.Game.notify("You need a silver key");
                }
                break;
        }
        return true; // FIXME
    }
    
    return {
        reset : reset,
        spawn : spawn,
        opened : opened,
        open : open,
        tryUse : tryUse,
        process : process,
        setAreas : setAreas
    };

})();
