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
 * @description Level management
 */
Wolf.Level = (function() {

    Wolf.setConsts({
        WALL_TILE           : 1,
        PUSHWALL_TILE       : (1 << 20),
        DOOR_TILE           : 2,
        SECRET_TILE         : 4,
        DRESS_TILE          : 8,
        BLOCK_TILE          : 16,
        ACTOR_TILE          : 32,
        DEADACTOR_TILE      : 64,
        POWERUP_TILE        : 128,
        AMBUSH_TILE         : 256,
        EXIT_TILE           : 512,
        SECRETLEVEL_TILE    : 1024,
        ELEVATOR_TILE       : (1 << 11),
        
        MAPHEADER_SIZE      : 49,
        MAP_SIGNATURE       : 0x21444921,
        
        TILE_IS_E_TURN      : (1 << 12),
        TILE_IS_NE_TURN     : (1 << 13),
        TILE_IS_N_TURN      : (1 << 14),
        TILE_IS_NW_TURN     : (1 << 15),
        TILE_IS_W_TURN      : (1 << 16),
        TILE_IS_SW_TURN     : (1 << 17),
        TILE_IS_S_TURN      : (1 << 18),
        TILE_IS_SE_TURN     : (1 << 19),
        
        MAX_POWERUPS        : 1000
    });
    Wolf.setConsts({
        SOLID_TILE          : (Wolf.WALL_TILE | Wolf.BLOCK_TILE | Wolf.PUSHWALL_TILE),
        BLOCKS_MOVE_TILE    : (Wolf.WALL_TILE | Wolf.BLOCK_TILE | Wolf.PUSHWALL_TILE | Wolf.ACTOR_TILE),
        WAYPOINT_TILE       : (Wolf.TILE_IS_E_TURN | Wolf.TILE_IS_NE_TURN | Wolf.TILE_IS_N_TURN | Wolf.TILE_IS_NW_TURN | 
                               Wolf.TILE_IS_W_TURN | Wolf.TILE_IS_SW_TURN | Wolf.TILE_IS_S_TURN | Wolf.TILE_IS_SE_TURN )
    });

    var statinfo = [
        [false, -1],                    // puddle          spr1v
        [ true, -1],                    // Green Barrel    "
        [ true, -1],                    // Table/chairs    "
        [ true, -1],                    // Floor lamp      "
        [false, -1],                    // Chandelier      "
        [ true, -1],                    // Hanged man      "
        [false, Wolf.pow_alpo],            // Bad food        "
        [ true, -1],                    // Red pillar      "
        [ true, -1],                    // Tree            spr2v
        [false, -1],                    // Skeleton flat   "
        [ true, -1],                    // Sink            " (SOD:gibs)
        [ true, -1],                    // Potted plant    "
        [ true, -1],                    // Urn             "
        [ true, -1],                    // Bare table      "
        [false, -1],                    // Ceiling light   "
        [false, -1],                    // Kitchen stuff   "
        [ true, -1],                    // suit of armor   spr3v
        [ true, -1],                    // Hanging cage    "
        [ true, -1],                    // SkeletoninCage  "
        [false, -1],                    // Skeleton relax  "
        [false, Wolf.pow_key1],            // Key 1           "
        [false, Wolf.pow_key2],            // Key 2           "
        [ true, -1],                    // stuff                (SOD:gibs)
        [false, -1],                    // stuff
        [false, Wolf.pow_food],            // Good food       spr4v
        [false, Wolf.pow_firstaid],        // First aid       "
        [false, Wolf.pow_clip],            // Clip            "
        [false, Wolf.pow_machinegun],   // Machine gun     "
        [false, Wolf.pow_chaingun],        // Gatling gun     "
        [false, Wolf.pow_cross],        // Cross           "
        [false, Wolf.pow_chalice],        // Chalice         "
        [false, Wolf.pow_bible],        // Bible           "
        [false, Wolf.pow_crown],        // crown           spr5v
        [false, Wolf.pow_fullheal],        // one up          "
        [false, Wolf.pow_gibs],            // gibs            "
        [ true, -1],                    // barrel          "
        [ true, -1],                    // well            "
        [ true, -1],                    // Empty well      "
        [false, Wolf.pow_gibs],            // Gibs 2          "
        [ true, -1],                    // flag                "
        [ true, -1],                    // Call Apogee        spr7v
        [false, -1],                    // junk            "
        [false, -1],                    // junk            "
        [false, -1],                    // junk            "
        [false, -1],                    // pots            "
        [ true, -1],                     // stove           " (SOD:gibs)
        [ true, -1],                    // spears          " (SOD:gibs)
        [false, -1]                        // vines           "
    ];
    
    for (var i=0;i<statinfo.length;i++) {
        var info = {
            idx : i,
            block : statinfo[i][0],
            powerup : statinfo[i][1]
        };
        statinfo[i] = info;
    }

    

     /**
     * @description Create a new level object
     * @private 
     * @returns {object} The new level 
     */
    function newLevel() {
        return {
            // readonly after level load
            areas : [],
            tileMap : [],
            wallTexX : [],
            wallTexY : [],
           
            spawn : {
                x: -1,
                y: -1,
                angle : 0
            },
            
            sprites : [],
            
            floorNum : 0,
            fParTime : 0,
            sParTime : "",
            
            levelName : "", // the descriptive name (Outer Base, etc)
            mapName : "",   // the server name (base1, etc)
            nextMap : "",   // go here when fraglimit is hit
            music : "",

            // state variables
            state : {
                framenum : 0,
                time : 0,

                // intermission state
                levelCompleted : 0,                // in case the game was saved at the intermission
                
                totalSecrets : 0,
                foundSecrets : 0,

                totalTreasure : 0,
                foundTreasure : 0,

                totalMonsters : 0,
                killedMonsters : 0,
                
                areaconnect : null,
                areabyplayer : null,
                
                numDoors : 0,
                doors : [],
                doorMap : [],
                
                powerups : [],
                numPowerups : 0,

                guards : [],
                numGuards : 0,
                
                startTime : 0,
                elapsedTime : 0
            }
        };
    }
    
    /**
     * @description Parse map file data.
     * @private
     * @param {object} file The file object
     * @returns {object} The new level object
     */
    function parseMapData(file) {
        var F = Wolf.File,
            level = newLevel(),
            length, offset,
            mapNameLength,
            musicNameLength,
            x, y, y0,
            layer1, layer2, layer3;

        file.position = 0;
            
        level.file = file;
        
        if (file.size < Wolf.MAPHEADER_SIZE) {
            throw new Error("Map file size is smaller than mapheader size");
        }
        if (F.readUInt32(file) != Wolf.MAP_SIGNATURE) {
            throw new Error("File signature does not match MAP_SIGNATURE");
        }
        
        rle = F.readUInt16(file);
        
        level.width = F.readUInt16(file);
        level.height = F.readUInt16(file);
        
        level.ceiling = [F.readUInt8(file), F.readUInt8(file), F.readUInt8(file), F.readUInt8(file)];
        level.floor = [F.readUInt8(file), F.readUInt8(file), F.readUInt8(file), F.readUInt8(file)];

        length = [
            F.readUInt16(file),
            F.readUInt16(file),
            F.readUInt16(file)
        ];
        offset = [
            F.readUInt32(file),
            F.readUInt32(file),
            F.readUInt32(file)
        ];
    
        mapNameLength = F.readUInt16(file);
        musicNameLength = F.readUInt16(file);
        
        file.position += 4; // (single) fpartime;
        
        level.sParTime = F.readString(file, 5);

        if (file.size < (Wolf.MAPHEADER_SIZE + mapNameLength + musicNameLength + length[0] + length[1] + length[2])) {
            throw new Error("filesize is less than MAPHEADER_SIZE + mapNameLength + musicNameLength + etc");
        }
        
        level.levelName = level.mapName = F.readString(file, mapNameLength);
        level.music = F.readString(file, musicNameLength);

        level.plane1 = readPlaneData(file, offset[0], length[0], rle);
        level.plane2 = readPlaneData(file, offset[1], length[1], rle);
        level.plane3 = readPlaneData(file, offset[2], length[2], rle);
        
        
        
        // jseidelin: hack disabled since we only use up to map 30
        // HUGE HACK to take out the pushwall maze that occasionally
        // gets players stuck in level E4M2 without actually touching
        // a map editor...
        /*
        if (file == "maps/w31.map") {
            for (x = 22; x <= 32; x++) {
                for (y0 = 30; y0 <= 32; y0++) {
                    Plane1[y0 * 64 + x] = Plane1[30*64+21];
                    Plane2[y0 * 64 + x] = Plane2[30*64+21];
                    Plane3[y0 * 64 + x] = Plane3[30*64+21];
                }
            }
        }
        */
        
        Wolf.Doors.reset(level);
        
        for (x=0;x<64;x++) {
            level.areas[x] = [];
            level.tileMap[x] = [];
            level.wallTexX[x] = [];
            level.wallTexY[x] = [];
            
            for (y=0;y<64;y++) {
                level.areas[x][y] = 0;
                level.tileMap[x][y] = 0;
                level.wallTexX[x][y] = 0;
                level.wallTexY[x][y] = 0;
            }
        }
    
   
        for (y0 = 0; y0 < 64; ++y0) {
            for (x = 0; x < 64; ++x) {
                y = 63 - y0; 
                
                layer1 = level.plane1[y0 * 64 + x];
                layer2 = level.plane2[y0 * 64 + x];
                layer3 = level.plane3[y0 * 64 + x];

                // if server, process obj layer!
                if (layer2) {
                    spawnObj(level, layer2, x, y);
                }

                // Map data layer
                if (layer1 == 0) {
                    level.areas[x][y] = -3; // unknown area
                } else if (layer1 < 0x6a) { // solid map object
                    if ((layer1 >= 0x5A && layer1 <= 0x5F) || layer1 == 0x64 || layer1 == 0x65) { // door
                        level.tileMap[x][y] |= Wolf.DOOR_TILE;
                        Wolf.Doors.spawn(level, x, y, layer1);
                        level.areas[x][y] = -2; // door area
                    } else {
                        level.tileMap[x][y] |= Wolf.WALL_TILE;
                        level.wallTexX[x][y] = (layer1-1) * 2 + 1;
                        level.wallTexY[x][y] = (layer1-1) * 2;
                        level.areas[x][y] = -1; // wall area
                        if (layer1 == 0x15) { // elevator
                            level.tileMap[x][y] |= Wolf.ELEVATOR_TILE;
                        }
                    }
                } else if (layer1 == 0x6a) { // Ambush floor tile
                    level.tileMap[x][y] |= Wolf.AMBUSH_TILE;
                    level.areas[x][y] = -3; // unknown area
                } else if (layer1 >= Wolf.FIRSTAREA && layer1 < (Wolf.FIRSTAREA + Wolf.NUMAREAS)) { // area
                    if (layer1 == Wolf.FIRSTAREA) { // secret level
                        level.tileMap[x][y] |= Wolf.SECRETLEVEL_TILE;
                    }
                    level.areas[x][y] = layer1 - Wolf.FIRSTAREA;// spawn area
                } else {
                    level.areas[x][y] = -3; // unknown area
                }
                // End of the map data layer
            }
        }
        
        
        // JDC: try to replace all the unknown areas with an adjacent area, to
        // avoid the silent attack / no damage problem when you get an ambush
        // guard stuck on their original tile
        for (x=1;x<63;x++) {
            for (y=1;y<63;y++) {
                if (level.areas[x][y] != -3) {
                    continue;
                }
                if (level.areas[x-1][y] >= 0) {
                    level.areas[x][y] = level.areas[x-1][y];
                } else if (level.areas[x+1][y] >= 0) {
                    level.areas[x][y] = level.areas[x+1][y];
                } else if (level.areas[x][y-1] >= 0) {
                    level.areas[x][y] = level.areas[x][y-1];
                } else if (level.areas[x+1][y+1] >= 0) {
                    level.areas[x][y] = level.areas[x][y+1];
                }
            }
        }

        Wolf.Doors.setAreas(level);
    
        return level;
    }
   
    /**
     * @description Read plane data from map data
     * @private
     * @param {object} file The file object
     * @param {number} offset The starting position
     * @param {number} length The length of the plane data
     * @param {number} rle The RLE tag
     * @returns {array} The plane data
     */
    function readPlaneData(file, offset, length, rle) {
        file.position = offset;
        
        var expandedLength = Wolf.File.readUInt16(file),
            carmackData = Wolf.File.readBytes(file, length - 2),
            expandedData = carmackExpand(carmackData, expandedLength);
        
        return rlewExpand(expandedData.slice(1), 64*64*2, rle);
    }

    
    /**
     * @description Expand RLE data
     * @private
     * @param {array} source The source data
     * @param {number} length The length of the expanded data
     * @param {number} rlewtag The RLE tag
     * @returns {array} The expanded data
     */
    function rlewExpand(source, length, rlewtag) {
        var value,
            count,
            i,
            end, /* W16 */
            inptr = 0,
            outptr = 0,
            dest = [];
    
        end = outptr + (length >> 1);
        
        do {
            value = source[inptr++];
            if (value != rlewtag) {
                // uncompressed
                dest[outptr++] = value;
            } else {
                // compressed string
                count = source[inptr++];
                value = source[inptr++];
                for (i=1;i<=count;++i) {
                    dest[outptr++] = value;
                }
            }
        } while (outptr < end);
        
        return dest;
    }
    
    /**
     * @description Expand Carmackized data
     * @private
     * @param {array} source The source data
     * @param {number} length The length of the expanded data
     * @returns {array} The expanded data
     */
    function carmackExpand(source, length) {
        var NEARTAG = 0xA7,
            FARTAG  = 0xA8;

        var chhigh, offset, /* W32 */
            copyptr, outptr, /* W16 */
            inptr, /* W8 */
            ch, count, /* W16 */
            dest;

        length /= 2;

        inptr = 0;
        outptr = 0;
        dest = [];
        
        function W16(b, i) {
            return b[i] + (b[i+1] << 8);
        }

        while (length) {
            ch = source[inptr] + (source[inptr+1] << 8);
            //ch = W16(source, inptr);
            inptr += 2;
            chhigh = ch >> 8;
            if (chhigh == NEARTAG) {
                count = ch & 0xff;
                if (!count) { 
                    // have to insert a word containing the tag byte
                    ch |= source[inptr++];
                    dest[outptr++] = ch;
                    length--;
                } else {
                    offset = source[inptr++];
                    copyptr = outptr - offset;
                    length -= count;
                    while (count--) {
                        dest[outptr++] = dest[copyptr++];
                    }
                }
            } else if (chhigh == FARTAG) {
                count = ch & 0xff;
                if (!count)    {
                    // have to insert a word containing the tag byte
                    ch |= source[inptr++];
                    dest[outptr++] = ch;
                    length--;
                } else {
                    offset = source[inptr] + (source[inptr+1] << 8);
                    //offset = W16(source, inptr);
                    inptr += 2;
                    copyptr = offset;
                    length -= count;
                    while (count--) {
                        dest[outptr++] = dest[copyptr++];
                    }
                }
            } else {
                dest[outptr++] = ch;
                length--;
            }
        }
        return dest;
    }
    
    /**
     * @description Load level data
     * @memberOf Wolf.Level
     * @param {string} filename The name of the level file.
     * @param {function} callback Called with the resulting level object.
     * @returns {object} The level object.
     */
    function load(filename, callback) {
        Wolf.File.open(filename, Wolf.MapData, function(error, file) {
            var level;
            if (error) {
                callback(error);
            }
            try {
                level = parseMapData(file);
            } catch(error) {
                callback(error);
                return;
            }
            callback(null, level);
        });
    }
    
    function reload(level) {
        return parseMapData(level.file);
    }

    
    /**
     * @description Spawn an object in the level at the specified position.
     * @private
     * @param {object} level The level object.
     * @param {number} type The object type.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     */
    function spawnObj(level, type, x, y) {
        if (type >= 23 && type < 23 + statinfo.length) { // static object
            spawnStatic(level, type - 23, x, y);
            return;
        }

        switch (type) {
            case 0x13: // start N
                level.spawn.x = Wolf.TILE2POS(x);
                level.spawn.y = Wolf.TILE2POS(y);
                level.spawn.angle = Wolf.ANG_90;
                break;
            case 0x14: // start E
                level.spawn.x = Wolf.TILE2POS(x);
                level.spawn.y = Wolf.TILE2POS(y);
                level.spawn.angle = Wolf.ANG_0;
                break;
            case 0x15: // start S
                level.spawn.x = Wolf.TILE2POS(x);
                level.spawn.y = Wolf.TILE2POS(y);
                level.spawn.angle = Wolf.ANG_270;
                break;
            case 0x16: // start W
                level.spawn.x = Wolf.TILE2POS(x);
                level.spawn.y = Wolf.TILE2POS(y);
                level.spawn.angle = Wolf.ANG_180;
                break;
            case 0x5a: // turn E
                level.tileMap[x][y] |= Wolf.TILE_IS_E_TURN;//FIXME!
                break;
            case 0x5b: // turn NE
                level.tileMap[x][y] |= Wolf.TILE_IS_NE_TURN;//FIXME!
                break;
            case 0x5c: // turn N
                level.tileMap[x][y] |= Wolf.TILE_IS_N_TURN;//FIXME!
                break;
            case 0x5d: // turn NW
                level.tileMap[x][y] |= Wolf.TILE_IS_NW_TURN;//FIXME!
                break;
            case 0x5e: // turn W
                level.tileMap[x][y] |= Wolf.TILE_IS_W_TURN;//FIXME!
                break;
            case 0x5f: // turn SW
                level.tileMap[x][y] |= Wolf.TILE_IS_SW_TURN;//FIXME!
                break;
            case 0x60: // turn S
                level.tileMap[x][y] |= Wolf.TILE_IS_S_TURN;//FIXME!
                break;
            case 0x61: // turn SE
                level.tileMap[x][y] |= Wolf.TILE_IS_SE_TURN;//FIXME!
                break;
            case 0x62: // pushwall modifier
                level.tileMap[x][y] |= Wolf.SECRET_TILE;
                level.state.totalSecrets++;
                break;
            case 0x63: // Victory trigger
                level.tileMap[x][y] |= Wolf.EXIT_TILE;
                break;
            // spawn guards
        } // end of switch( type )

    }
    
    /**
     * @description Spawn a static object at the specified position.
     * @private
     * @param {object} level The level object.
     * @param {number} type The static object type.
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     */
    function spawnStatic(level, type, x, y) {
        var sprite, pu;

        if (statinfo[type].powerup == -1 ) {
            if (statinfo[type].block) {    // blocking static
                level.tileMap[x][y] |= Wolf.BLOCK_TILE;
            } else {                    // dressing static
                level.tileMap[x][y] |= Wolf.DRESS_TILE;
            }

            sprite = Wolf.Sprites.getNewSprite(level);
            if (!sprite) {
                return;
            }

            Wolf.Sprites.setPos(level, sprite, Wolf.TILE2POS(x), Wolf.TILE2POS(y), 0 );
            Wolf.Sprites.setTex(level, sprite, 0, Wolf.SPR_STAT_0 + type);
        } else {
            pu = statinfo[type].powerup;
            Wolf.Powerups.spawn(level, x, y, pu);
            
            if (pu == Wolf.pow_cross || pu == Wolf.pow_chalice || pu == Wolf.pow_bible || pu == Wolf.pow_crown || pu == Wolf.pow_fullheal) {
                level.state.totalTreasure++; // FIXME: move this to Powerup_Spawn Function!
            }
        }
    }



    var cachedGuard = 0,
        cachedOfficer = 0,
        cachedSS = 0,
        cachedDog = 0,
        cachedMutant = 0,
        progress_bar = 0;


    /**
     * @description Spawn all actors and mark down special places.
     * @memberOf Wolf.Level
     * @param {object} level The level object.
     * @param {number} skill The difficulty level.
     */
    function scanInfoPlane(level, skill) {
        var x, y, tile;
        
        cachedGuard = 0;
        cachedOfficer = 0;
        cachedSS = 0;
        cachedDog = 0;
        cachedMutant = 0;
        progress_bar = 0;

        for (y = 0;y < 64;++y) {
            for (x = 0;x < 64;++x) {
                tile = level.plane2[(63 - y) * 64 + x];
                if (!tile) {
                    continue;
                }

                switch (tile) {
                    // guard
                    case 180:
                    case 181:
                    case 182:
                    case 183:
                        if (skill < Wolf.gd_hard) {
                            break;
                        }
                        tile -= 36;
                    case 144:
                    case 145:
                    case 146:
                    case 147:
                        if(skill < Wolf.gd_medium) {
                            break;
                        }
                        tile -= 36;
                    case 108:
                    case 109:
                    case 110:
                    case 111:
                        if (!cachedGuard) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_GRD_S_1, Wolf.SPR_GRD_SHOOT3);
                            cachedGuard = 1;
                        }
                        Wolf.Actors.spawnStand(level, skill, Wolf.en_guard, x, y, tile - 108);
                        break;
                    case 184:
                    case 185:
                    case 186:
                    case 187:
                        if (skill < Wolf.gd_hard) {
                            break;
                        }
                        tile -= 36;
                    case 148:
                    case 149:
                    case 150:
                    case 151:
                        if (skill < Wolf.gd_medium) {
                            break;
                        }
                        tile -= 36;
                    case 112:
                    case 113:
                    case 114:
                    case 115:
                        if (!cachedGuard) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_GRD_S_1, Wolf.SPR_GRD_SHOOT3);
                            cachedGuard = 1;
                        }
                        Wolf.Actors.spawnPatrol(level, skill, Wolf.en_guard, x, y, tile - 112);
                        break;
                    case 124:
                        Wolf.Actors.spawnDeadGuard(level, skill, Wolf.en_guard, x, y);
                        break;
                    // officer
                    case 188:
                    case 189:
                    case 190:
                    case 191:
                        if (skill < Wolf.gd_hard) {
                            break;
                        }
                        tile -= 36;
                    case 152:
                    case 153:
                    case 154:
                    case 155:
                        if (skill < Wolf.gd_medium) {
                            break;
                        }
                        tile -= 36;
                    case 116:
                    case 117:
                    case 118:
                    case 119:
                        if (!cachedOfficer) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_OFC_S_1,Wolf.SPR_OFC_SHOOT3);
                            cachedOfficer = 1;
                        }
                        Wolf.Actors.spawnStand(level, skill, Wolf.en_officer, x, y, tile - 116);
                        break;
                    case 192:
                    case 193:
                    case 194:
                    case 195:
                        if (skill < Wolf.gd_hard) {
                            break;
                        }
                        tile -= 36;
                    case 156:
                    case 157:
                    case 158:
                    case 159:
                        if (skill < Wolf.gd_medium) {
                            break;
                        }
                        tile -= 36;
                    case 120:
                    case 121:
                    case 122:
                    case 123:
                        if (!cachedOfficer) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_OFC_S_1, Wolf.SPR_OFC_SHOOT3);
                            cachedOfficer = 1;
                        }
                        Wolf.Actors.spawnPatrol(level, skill, Wolf.en_officer, x, y, tile - 120);
                        break;
                    // SS
                    case 198:
                    case 199:
                    case 200:
                    case 201:
                        if (skill < Wolf.gd_hard) {
                            break;
                        }
                        tile -= 36;
                    case 162:
                    case 163:
                    case 164:
                    case 165:
                        if (skill < Wolf.gd_medium) {
                            break;
                        }
                        tile -= 36;
                    case 126:
                    case 127:
                    case 128:
                    case 129:
                        if (!cachedSS) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_SS_S_1, Wolf.SPR_SS_SHOOT3);
                            cachedSS = 1;
                        }
                        Wolf.Actors.spawnStand(level, skill, Wolf.en_ss, x, y, tile - 126);
                        break;
                    case 202:
                    case 203:
                    case 204:
                    case 205:
                        if (skill < Wolf.gd_hard) {
                            break;
                        }
                        tile -= 36;
                    case 166:
                    case 167:
                    case 168:
                    case 169:
                        if (skill < Wolf.gd_medium) {
                            break;
                        }
                        tile -= 36;
                    case 130:
                    case 131:
                    case 132:
                    case 133:
                        if (!cachedSS) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_SS_S_1, Wolf.SPR_SS_SHOOT3);
                            cachedSS = 1;
                        }
                        Wolf.Actors.spawnPatrol(level, skill, Wolf.en_ss, x, y, tile - 130);
                        break;
                    // dogs
                    case 206:
                    case 207:
                    case 208:
                    case 209:
                        if (skill < Wolf.gd_hard) {
                            break;
                        }
                        tile -= 36;
                    case 170:
                    case 171:
                    case 172:
                    case 173:
                        if (skill < Wolf.gd_medium) {
                            break;
                        }
                        tile -= 36;
                    case 134:
                    case 135:
                    case 136:
                    case 137:
                        if (!cachedDog) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_DOG_W1_1, Wolf.SPR_DOG_JUMP3);
                            cachedDog = 1;
                        }
                        Wolf.Actors.spawnStand(level, skill, Wolf.en_dog, x, y, tile - 134);
                        break;
                    case 210:
                    case 211:
                    case 212:
                    case 213:
                        if (skill < Wolf.gd_hard) {
                            break;
                        }
                        tile -= 36;
                    case 174:
                    case 175:
                    case 176:
                    case 177:
                        if (skill < Wolf.gd_medium) {
                            break;
                        }
                        tile -= 36;
                    case 138:
                    case 139:
                    case 140:
                    case 141:
                        if (!cachedDog) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_DOG_W1_1, Wolf.SPR_DOG_JUMP3);
                            cachedDog = 1;
                        }
                        Wolf.Actors.spawnPatrol(level, skill, Wolf.en_dog, x, y, tile - 138);
                        break;
                    // bosses
                    case 214:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_BOSS_W1, Wolf.SPR_BOSS_DIE3);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_boss, x, y);
                        break;
                    case 197:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_GRETEL_W1, Wolf.SPR_GRETEL_DIE3);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_gretel, x, y);
                        break;
                    case 215:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_GIFT_W1, Wolf.SPR_GIFT_DEAD);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_gift, x, y);
                        break;
                    case 179:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_FAT_W1, Wolf.SPR_FAT_DEAD);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_fat, x, y);
                        break;
                    case 196:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_SCHABB_W1, Wolf.SPR_HYPO4);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_schabbs, x, y);
                        break;
                    case 160:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_FAKE_W1, Wolf.SPR_FAKE_DEAD);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_fake, x, y);
                        break;
                    case 178:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_MECHA_W1, Wolf.SPR_HITLER_DIE7);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_mecha, x, y);
                        break;
                    // Spear
                    case 106:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_SPECTRE_W1, Wolf.SPR_SPECTRE_F4);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_spectre, x, y);
                        break;
                    case 107:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_ANGEL_W1, Wolf.SPR_ANGEL_DEAD);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_angel, x, y);
                        break;
                    case 125:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_TRANS_W1, Wolf.SPR_TRANS_DIE3);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_trans, x, y);
                        break;
                    case 142:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_UBER_W1, Wolf.SPR_UBER_DEAD);
                        Wolf.Actors.spawnBoss(level, skill, olf.en_uber, x, y);
                        break;
                    case 143:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_WILL_W1, Wolf.SPR_WILL_DEAD);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_will, x, y);
                        break;
                    case 161:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_DEATH_W1, Wolf.SPR_DEATH_DEAD);
                        Wolf.Actors.spawnBoss(level, skill, Wolf.en_death, x, y);
                        break;
                    // mutants
                    case 252:
                    case 253:
                    case 254:
                    case 255:
                        if (skill < Wolf.gd_hard)
                            break;
                        tile -= 18;
                    case 234:
                    case 235:
                    case 236:
                    case 237:
                        if (skill < Wolf.gd_medium)
                            break;
                        tile -= 18;
                    case 216:
                    case 217:
                    case 218:
                    case 219:
                        if (!cachedMutant) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_MUT_S_1, Wolf.SPR_MUT_SHOOT4);
                            cachedMutant = 1;
                        }
                        Wolf.Actors.spawnStand(level, skill, Wolf.en_mutant, x, y, tile - 216);
                        break;
                    case 256:
                    case 257:
                    case 258:
                    case 259:
                        if (skill < Wolf.gd_hard)
                            break;
                        tile -= 18;
                    case 238:
                    case 239:
                    case 240:
                    case 241:
                        if (skill < Wolf.gd_medium )
                            break;
                        tile -= 18;
                    case 220:
                    case 221:
                    case 222:
                    case 223:
                        if (!cachedMutant) {
                            Wolf.Sprites.cacheTextures(Wolf.SPR_MUT_S_1, Wolf.SPR_MUT_SHOOT4);
                            cachedMutant = 1;
                        }
                        Wolf.Actors.spawnPatrol(level, skill, Wolf.en_mutant, x, y, tile - 220 );
                        break;
                    // ghosts
                    case 224:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_BLINKY_W1, Wolf.SPR_BLINKY_W2);
                        Wolf.Actors.spawnGhosts(level, skill, Wolf.en_blinky, x, y);
                        break;
                    case 225:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_PINKY_W1, Wolf.SPR_PINKY_W2);
                        Wolf.Actors.spawnGhosts(level, skill, Wolf.en_clyde, x, y);
                        break;
                    case 226:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_CLYDE_W1, Wolf.SPR_CLYDE_W2);
                        Wolf.Actors.spawnGhosts(level, skill, Wolf.en_pinky, x, y);
                        break;
                    case 227:
                        Wolf.Sprites.cacheTextures(Wolf.SPR_INKY_W1, Wolf.SPR_INKY_W2);
                        Wolf.Actors.spawnGhosts(level, skill, Wolf.en_inky, x, y);
                        break;
                }
            }
        }
    }
    
   
    /**
     * @description Check if there is a clear line of sight between 2 points.
     * @memberOf Wolf.Level
     * @param {number} x1 The x coordinate of point 1.
     * @param {number} y1 The y coordinate of point 1.
     * @param {number} x2 The x coordinate of point 2.
     * @param {number} y2 The y coordinate of point 2.
     * @param {object} level The level object.
     * @returns {boolean} True if a straight line between 2 points is unobstructed, otherwise false.
     */
    function checkLine(x1, y1, x2, y2, level) {
        var xt1, yt1, xt2, yt2, /* tile positions */
            x, y,               /* current point in !tiles! */
            xdist, ydist,
            xstep, ystep,       /* Step value for each whole xy */
        
            deltafrac,          /* current point in !1/256 of tile! */

            frac,               /* Fractional xy stepper */

            partial,            /* how much to move in our direction to border */
            intercept,          /* Temp for door code */

            FRACBITS = 8;       /* Number of bits of fraction */

        // get start & end tiles
        xt1 = x1 >> Wolf.TILESHIFT; 
        yt1 = y1 >> Wolf.TILESHIFT;
        
        xt2 = x2 >> Wolf.TILESHIFT; 
        yt2 = y2 >> Wolf.TILESHIFT;

        xdist = Math.abs(xt2 - xt1); // X distance in tiles
        ydist = Math.abs(yt2 - yt1); // Y distance in tiles

        // 1/256 tile precision (TILESHIFT is 16)
        x1 >>= FRACBITS; y1 >>= FRACBITS;
        x2 >>= FRACBITS; y2 >>= FRACBITS;

        if (xdist) { // always positive check only for 0
            if (xt2 > xt1) {
                partial = 256 - (x1 & 0xff);
                xstep = 1;
            } else {
                partial = x1 & 0xff;
                xstep = -1;
            }

            deltafrac = Math.abs(x2 - x1);
            ystep = ((y2 - y1) << FRACBITS) / deltafrac;
            frac = y1 + ((ystep * partial) >> FRACBITS);

            x = xt1 + xstep;
            xt2 += xstep;
            do {
                y = frac >> FRACBITS;
                frac += ystep;
                
                // assert( x >= 0 && x < 64 && y >= 0 && y < 64 );
                if (level.tileMap[x][y] & Wolf.WALL_TILE) {
                    return false; // Wall is in path quitting!
                }

                if (level.tileMap[x][y] & Wolf.DOOR_TILE ) {
                    // door, see if the door is open enough
                    if (level.state.doorMap[x][y].action != Wolf.dr_open) {
                        if (level.state.doorMap[x][y].action == Wolf.dr_closed) {
                            return false;
                        }
                        // checking vertical doors in action: ->_I_
                        intercept = ((frac - ystep / 2) & 0xFF) >> 4; // 1/64 of tile
                        if (intercept < (63 - level.state.doorMap[x][y].ticcount)) {
                            return false;
                        }
                    }
                }
                x += xstep;
            } while (x != xt2);
        }

        if (ydist) { // always positive check only for 0
            if (yt2 > yt1) {
                partial = 256 - (y1 & 0xff);
                ystep = 1;
            } else {
                partial = y1 & 0xff;
                ystep = -1;
            }

            deltafrac = Math.abs(y2 - y1);
            xstep = ((x2 - x1) << FRACBITS) / deltafrac;
            frac = x1 + ((xstep * partial) >> FRACBITS);

            y = yt1 + ystep;
            yt2 += ystep;
            do {
                x = frac >> FRACBITS;
                frac += xstep;

                //assert( x >= 0 && x < 64 && y >= 0 && y < 64 );
                if (level.tileMap[x][y] & Wolf.WALL_TILE ) {
                    return false; // Wall is in path quitting!
                }
                    
                if (level.tileMap[x][y] & Wolf.DOOR_TILE) {
                    // door, see if the door is open enough
                    if (level.state.doorMap[x][y].action != Wolf.dr_open) {
                        if (level.state.doorMap[x][y].action == Wolf.dr_closed ) {
                            return false;
                        }
                        // checking vertical doors in action: ->_I_
                        intercept = ((frac - xstep / 2) & 0xFF) >> 4; // 1/64 of tile
                        if (intercept < level.state.doorMap[x][y].ticcount) {
                            return false;
                        }
                    }
                }
                y += ystep;
            } while (y != yt2);
        }
        return true;
    }
    
    return {
        load : load,
        reload : reload,
        scanInfoPlane : scanInfoPlane,
        checkLine : checkLine
    };

})();