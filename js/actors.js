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
 * @description Actors
 */
Wolf.Actors = (function() {

    Wolf.setConsts({
        SPDPATROL       : 512,
        SPDDOG          : 1500,

        FL_SHOOTABLE    : 1,
        FL_BONUS        : 2,
        FL_NEVERMARK    : 4,
        FL_VISABLE      : 8,
        FL_ATTACKMODE   : 16,
        FL_FIRSTATTACK  : 32,
        FL_AMBUSH       : 64,
        FL_NONMARK      : 128,

        MAX_GUARDS      : 255,
        NUMENEMIES      : 31,
        NUMSTATES       : 34,

        MINACTORDIST    : 0x10000
    });
    
    Wolf.setConsts({
        en_guard        : 0,
        en_officer      : 1,
        en_ss           : 2,
        en_dog          : 3,
        en_boss         : 4,
        en_schabbs      : 5,
        en_fake         : 6,
        en_mecha        : 7,
        en_hitler       : 8,
        en_mutant       : 9,
        en_blinky       : 10,
        en_clyde        : 11,
        en_pinky        : 12,
        en_inky         : 13,
        en_gretel       : 14,
        en_gift         : 15,
        en_fat          : 16,
        // --- Projectiles
        en_needle       : 17,
        en_fire         : 18,
        en_rocket       : 19,
        en_smoke        : 20,
        en_bj           : 21,
        // --- Spear of destiny!
        en_spark        : 22,
        en_hrocket      : 23,
        en_hsmoke       : 24,

        en_spectre      : 25,
        en_angel        : 26,
        en_trans        : 27,
        en_uber         : 28,
        en_will         : 29,
        en_death        : 30
    });
    
    Wolf.setConsts({
        st_stand        : 0,
        st_path1        : 1,
        st_path1s       : 2,
        st_path2        : 3,
        st_path3        : 4,
        st_path3s       : 5,
        st_path4        : 6,
        st_pain         : 7,
        st_pain1        : 8,
        st_shoot1       : 9,
        st_shoot2       : 10,
        st_shoot3       : 11,
        st_shoot4       : 12,
        st_shoot5       : 13,
        st_shoot6       : 14,
        st_shoot7       : 15,
        st_shoot8       : 16,
        st_shoot9       : 17,
        st_chase1       : 18,
        st_chase1s      : 19,
        st_chase2       : 20,
        st_chase3       : 21,
        st_chase3s      : 22,
        st_chase4       : 23,
        st_die1         : 24,
        st_die2         : 25,
        st_die3         : 26,
        st_die4         : 27,
        st_die5         : 28,
        st_die6         : 29,
        st_die7         : 30,
        st_die8         : 31,
        st_die9         : 32,
        st_dead         : 33,
        st_remove       : 34
    });
    
    var add8dir = [4, 5, 6, 7, 0, 1, 2, 3, 0],
        r_add8dir = [4, 7, 6, 5, 0, 1, 2, 3, 0];

    /**
     * @description Create new actor.
     * @memberOf Wolf.Actors
     * @param {object} level The level object.
     * @returns {object} The new actor object.
     */
    function getNewActor(level) {

        if (level.state.numGuards > Wolf.MAX_GUARDS) {
            return null;
        }

        var actor = {
            x : 0,
            y : 0,
            angle : 0,
            type : 0,
            health : 0,
            max_health : 0,
            speed : 0,
            ticcount : 0,
            temp2 : 0,
            distance : 0,
            tile : {
                x : 0,
                y : 0
            },
            areanumber : 0,
            waitfordoorx : 0, 
            waitfordoory : 0,   // waiting on this door if non 0
            flags : 0,            //    FL_SHOOTABLE, etc
            state : 0,
            dir : 0,
            sprite : 0
        };
        level.state.guards[level.state.numGuards++] = actor;
        
        return actor;
    }
    
    /**
     * @description Process a single actor.
     * @private
     * @param {object} ent The actor object.
     * @param {object} level The level object.
     * @param {object} player The player object.
     * @param {number} tics The number of tics.
     * @returns {boolean} False if actor should be removed, otherwise true.
     */
    function doGuard(ent, game, tics) { // FIXME: revise!
        var think;

        //assert( ent->tilex >= 0 && ent->tilex < 64 );
        //assert( ent->tiley >= 0 && ent->tiley < 64 );
        //assert( ent->dir >= 0 && ent->dir <= 8 );
   
   
        // ticcounts fire discrete actions separate from think functions
        if (ent.ticcount) {
            ent.ticcount -= tics;

            while (ent.ticcount <= 0) {
                //assert( ent->type >= 0 && ent->type < NUMENEMIES );
                //assert( ent->state >= 0 && ent->state < NUMSTATES );

                think = Wolf.objstate[ent.type][ent.state].action; // end of state action
                if (think) {
                    think(ent, game, tics);
                    if (ent.state == Wolf.st_remove) {
                        return false;
                    }
                }

                ent.state = Wolf.objstate[ent.type][ent.state].next_state;
                if (ent.state == Wolf.st_remove) {
                    return false;
                }
            
                if (!Wolf.objstate[ent.type][ent.state].timeout) {
                    ent.ticcount = 0;
                    break;
                }
                
                ent.ticcount += Wolf.objstate[ent.type][ent.state].timeout;
            }
        }
        //
        // think
        //
        //assert( ent->type >= 0 && ent->type < NUMENEMIES );
        //assert( ent->state >= 0 && ent->state < NUMSTATES );
        think = Wolf.objstate[ent.type][ent.state].think;

        if (think) {
            think(ent, game, tics);
            if (ent.state == Wolf.st_remove) {
                return false;
            }
        }
        
        return true;
    }
    

    /**
     * @description Changes guard's state to that defined in newState.
     * @memberOf Wolf.Actors
     * @param {object} ent The actor object.
     * @param {number} newState The new state.
     */
    function stateChange(ent, newState) {
        ent.state = newState;
        // assert( ent->type >= 0 && ent->type < NUMENEMIES );
        if (newState == Wolf.st_remove) {
            ent.ticcount = 0;
        } else {
            // assert( ent->state >= 0 && ent->state < NUMSTATES );
            ent.ticcount = Wolf.objstate[ent.type][ent.state].timeout; //0;
        }
    }
    
    /**
     * @description Process all the enemy actors.
     * @memberOf Wolf.Actors
     * @param {object} level The level object.
     * @param {object} player The player object.
     * @param {number} tics The number of tics.
     */
    function process(game, tics) {
        var level = game.level,
            player = game.player,
            n, tex, guard,
            liveGuards = [];
            
        for (n = 0 ; n < level.state.numGuards ; ++n ) {
            guard = level.state.guards[n];

            if (!doGuard(guard, game, tics)) {
                // remove guard from the game forever!
                // remove(game, guards[n--]);
                Wolf.Sprites.remove(level, guard.sprite);
                level.state.guards[n] = null;
                continue;
            }

            Wolf.Sprites.setPos(level, guard.sprite, guard.x, guard.y, guard.angle);
            
            tex = Wolf.objstate[guard.type][guard.state].texture;
            
            if (Wolf.objstate[guard.type][guard.state].rotate) {
                if (guard.type == Wolf.en_rocket || guard.type == Wolf.en_hrocket) {
                    tex += r_add8dir[Wolf.Math.get8dir( Wolf.Angle.distCW(Wolf.FINE2RAD(player.angle), Wolf.FINE2RAD(guard.angle)))];                
                } else {
                    tex += add8dir[Wolf.Math.get8dir( Wolf.Angle.distCW(Wolf.FINE2RAD(player.angle), Wolf.FINE2RAD(guard.angle)))];                
                }
            }
            Wolf.Sprites.setTex(level, guard.sprite, 0, tex);
        }

        for (n = 0 ; n < level.state.numGuards ; ++n ) {
            if (level.state.guards[n]) {
                liveGuards.push(level.state.guards[n]);
            }
        }
        level.state.guards = liveGuards;
        level.state.numGuards = liveGuards.length;
    }
    
    /**
     * @description Reset and clear the enemy actors in the level.
     * @memberOf Wolf.Actors
     * @param {object} level The level object.
     */
    function resetGuards(level) {
        level.state.guards = [];
        level.state.numGuards = 0;
        //New = NULL;
    }

    /**
     * @description Spawn a new enemy actor at the given position.
     * @memberOf Wolf.Actors
     * @param {object} level The level object.
     * @param {number} skill The difficulty level.
     * @param {number} which The actor type.
     * @param {number} x The x position.
     * @param {number} y The y position.
     * @param {number} dir The direction.
     * @returns {object} The new actor object or null if actor creation failed.
     */
    function spawn(level, skill, which, x, y, dir) {
        var ent = getNewActor(level);
        
        if (!ent) {
            return null;
        }

        ent.x = Wolf.TILE2POS(x);
        ent.y = Wolf.TILE2POS(y);

        ent.tile.x = x;
        ent.tile.y = y;

        // assert( dir >= 0 && dir <= 4 );
        ent.angle = Wolf.Math.dir4angle[dir];
        ent.dir = Wolf.Math.dir4to8[dir];

        ent.areanumber = level.areas[x][y];

        if (ent.areanumber < 0) {
            // ambush marker tiles are listed as -3 area
            ent.areanumber = 0;
        }
    
        // assert( ent->areanumber >= 0 && ent->areanumber < NUMAREAS );
        ent.type = which;
        ent.health = Wolf.starthitpoints[skill][which];
        ent.sprite = Wolf.Sprites.getNewSprite(level);

        return ent;
    }
    
    /**
     * @description Spawn a dead guard.
     * @memberOf Wolf.Actors
     * @param {object} level The level object.
     * @param {number} skill The difficulty level.
     * @param {number} which The actor type.
     * @param {number} x The x position.
     * @param {number} y The y position.
     */
    function spawnDeadGuard(level, skill, which, x, y) {
        var self = spawn(level, skill, which, x, y, Wolf.Math.dir4_nodir);
        if (!self) {
            return;
        }
        self.state = Wolf.st_dead;
        self.speed = 0;
        self.health = 0;
        self.ticcount = Wolf.objstate[which][Wolf.st_dead].timeout ? Wolf.Random.rnd() % Wolf.objstate[which][Wolf.st_dead].timeout + 1 : 0;
    }
    
    /**
     * @description Spawn a patrolling guard.
     * @memberOf Wolf.Actors
     * @param {object} level The level object.
     * @param {number} skill The difficulty level.
     * @param {number} which The actor type.
     * @param {number} x The x position.
     * @param {number} y The y position.
     */
    function spawnPatrol(level, skill, which, x, y, dir) {
        var self = spawn(level, skill, which, x, y, dir);
        if (!self) {
            return;
        }
    
        self.state = Wolf.st_path1;
        self.speed = (which == Wolf.en_dog) ? Wolf.SPDDOG : Wolf.SPDPATROL;
        self.distance = Wolf.TILEGLOBAL;
        self.ticcount = Wolf.objstate[which][Wolf.st_path1].timeout ? Wolf.Random.rnd() % Wolf.objstate[which][Wolf.st_path1].timeout + 1 : 0;
        self.flags |= Wolf.FL_SHOOTABLE;

        level.state.totalMonsters++;
    }

    /**
     * @description Spawn a standing guard.
     * @memberOf Wolf.Actors
     * @param {object} level The level object.
     * @param {number} skill The difficulty level.
     * @param {number} which The actor type.
     * @param {number} x The x position.
     * @param {number} y The y position.
     */
    function spawnStand(level, skill, which, x, y, dir) {
        var self = spawn(level, skill, which, x, y, dir);
        if (!self) {
            return;
        }

        self.state = Wolf.st_stand;
        self.speed = Wolf.SPDPATROL;
        self.ticcount = Wolf.objstate[which][Wolf.st_stand].timeout ? Wolf.Random.rnd() % Wolf.objstate[which][Wolf.st_stand].timeout + 1 : 0;
        self.flags |= Wolf.FL_SHOOTABLE;
        
        if (level.tileMap[x][y] & Wolf.AMBUSH_TILE) {
            self.flags |= Wolf.FL_AMBUSH;
        }

        level.state.totalMonsters++;
    }
    
    function spawnBoss(level, skill, which, x, y) {
        var self,
            face;

        switch (which) {
            case Wolf.en_boss:
            case Wolf.en_schabbs:
            case Wolf.en_fat:
            case Wolf.en_hitler:
                face = Wolf.Math.dir4_south;
                break;

            case Wolf.en_fake:
            case Wolf.en_gretel:
            case Wolf.en_gift:
                face = Wolf.Math.dir4_north;
                break;

            case Wolf.en_trans:
            case Wolf.en_uber:
            case Wolf.en_will:
            case Wolf.en_death:
            case Wolf.en_angel:
            case Wolf.en_spectre:
                face = Wolf.Math.dir4_nodir;
                break;

            default:
                face = Wolf.Math.dir4_nodir;
                break;
        }

        self = spawn(level, skill, which, x, y, face);
        if (!self) {
            return;
        }
        
        self.state = which == Wolf.en_spectre ? Wolf.st_path1 : Wolf.st_stand;
        self.speed = Wolf.SPDPATROL;
        self.health = Wolf.starthitpoints[skill][which];
        self.ticcount = Wolf.objstate[which][Wolf.st_stand].timeout ? Wolf.Random.rnd() % Wolf.objstate[which][Wolf.st_stand].timeout + 1 : 0;
        self.flags |= Wolf.FL_SHOOTABLE | Wolf.FL_AMBUSH;

        level.state.totalMonsters++;
    }
    
    
    function spawnGhosts(level, skill, which, x, y) {
        var self = spawn(level, skill, which, x, y, Wolf.Math.dir4_nodir);
        if (!self) {
            return;
        }
        
        self.state = Wolf.st_chase1;
        self.speed = Wolf.SPDPATROL * 3;
        self.health = Wolf.starthitpoints[skill][which];
        self.ticcount = Wolf.objstate[which][Wolf.st_chase1].timeout ? Wolf.Random.rnd() % Wolf.objstate[which][Wolf.st_chase1].timeout + 1: 0;
        self.flags |= Wolf.FL_AMBUSH;

        level.state.totalMonsters++;
    }
    
    function spawnBJVictory(player, level, skill) {
        var x = Wolf.POS2TILE(player.position.x),
            y = Wolf.POS2TILE(player.position.y),
            bj = spawn(level, skill, Wolf.en_bj, x, y + 1, Wolf.Math.dir4_north);
        
        if (!bj) {
            return;
        }

        bj.x = player.position.x;
        bj.y = player.position.y;
        bj.state = Wolf.st_path1;
        bj.speed = Wolf.BJRUNSPEED;
        bj.flags = Wolf.FL_NONMARK; // FL_NEVERMARK;
        bj.temp2 = 6;
        bj.ticcount = 1;
    }
   
    return {
        process : process,
        resetGuards : resetGuards,
        getNewActor : getNewActor,
        spawn : spawn,
        spawnDeadGuard : spawnDeadGuard,
        spawnPatrol : spawnPatrol,
        spawnStand : spawnStand,
        spawnBoss : spawnBoss,
        spawnGhosts : spawnGhosts,
        spawnBJVictory : spawnBJVictory,
        stateChange : stateChange
    };

})();
