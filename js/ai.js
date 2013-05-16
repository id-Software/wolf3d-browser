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
 * @description Enemy AI
 */
Wolf.AI = (function() {

    Wolf.setConsts({
        RUNSPEED    : 6000,
        MINSIGHT    : 0x18000
    });


    function checkSight(self, game) {
        var level = game.level,
            player = game.player,
            deltax, deltay;


        // don't bother tracing a line if the area isn't connected to the player's
        if (!(self.flags & Wolf.FL_AMBUSH)) {
            if (!level.state.areabyplayer[self.areanumber]) {
                return false;
            }
        }

        // if the player is real close, sight is automatic
        deltax = player.position.x - self.x;
        deltay = player.position.y - self.y;

        if (Math.abs(deltax) < Wolf.MINSIGHT && Math.abs(deltay) < Wolf.MINSIGHT) {
            return true;
        }

        // see if they are looking in the right direction
        switch (self.dir) {
            case Wolf.Math.dir8_north:
               if (deltay < 0) {
                    return false;
                }
                break;
            case Wolf.Math.dir8_east:
                if (deltax < 0) {
                    return false;
                }
                break;
            case Wolf.Math.dir8_south:
                if (deltay > 0) {
                    return false;
                }
                break;
            case Wolf.Math.dir8_west:
                if (deltax > 0) {
                    return false;
                }
                break;
            default:
                break;
        }

        // trace a line to check for blocking tiles (corners)
        return Wolf.Level.checkLine(self.x, self.y, player.position.x, player.position.y, level);
    }


    /**
     * @description Entity is going to move in a new direction.
     *              Called, when actor finished previous moving & located in 
     *              the 'center' of the tile. Entity will try walking in direction.
     * @private
     * @returns {boolean} true if direction is OK, otherwise false.
     */
    function changeDir(self, new_dir, level) {
        var oldx, 
            oldy, 
            newx, 
            newy, // all it tiles
            n,
            moveok = false;
            
        oldx = Wolf.POS2TILE(self.x);
        oldy = Wolf.POS2TILE(self.y);
        //assert( new_dir >= 0 && new_dir <= 8 );
        newx = oldx + Wolf.Math.dx8dir[new_dir];
        newy = oldy + Wolf.Math.dy8dir[new_dir];

        if (new_dir & 0x01) { // same as %2 (diagonal dir)
            if (level.tileMap[newx][oldy] & Wolf.SOLID_TILE ||
                 level.tileMap[oldx][newy] & Wolf.SOLID_TILE ||
                 level.tileMap[newx][newy] & Wolf.SOLID_TILE) {
                return false;
            }

            for (n=0; n < level.state.numGuards; ++n) {
                if (level.state.guards[n].state >= Wolf.st_die1) {
                    continue;
                }
                if (level.state.guards[n].tile.x == newx && level.state.guards[n].tile.y == newy) {
                    return false; // another guard in path
                }
                if (level.state.guards[n].tile.x == oldx && level.state.guards[n].tile.y == newy) {
                    return false; // another guard in path
                }
                if (level.state.guards[n].tile.x == newx && level.state.guards[n].tile.y == oldy) {
                    return false; // another guard in path
                }
            }
        } else { // linear dir (E, N, W, S)
            if (level.tileMap[newx][newy] & Wolf.SOLID_TILE) {
                return false;
            }
            if (level.tileMap[newx][newy] & Wolf.DOOR_TILE) {
                if (self.type == Wolf.en_fake || self.type == Wolf.en_dog) { // they can't open doors
                    if (level.state.doorMap[newx][newy].action != Wolf.dr_open) { // path is blocked by a closed opened door
                        return false;
                    }
                } else {
                    self.waitfordoorx = newx;
                    self.waitfordoory = newy;
                    moveok = true;
                }
            }
            if (!moveok) {
                for (n = 0; n < level.state.numGuards; ++n) {
                    if (level.state.guards[n].state >= Wolf.st_die1) {
                        continue;
                    }
                    if (level.state.guards[n].tile.x == newx && level.state.guards[n].tile.y == newy) {
                        return false; // another guard in path
                    }
                }
            }
        }

        //moveok:
        self.tile.x = newx;
        self.tile.y = newy;

        level.tileMap[oldx][oldy] &= ~Wolf.ACTOR_TILE; // update map status
        level.tileMap[newx][newy] |= Wolf.ACTOR_TILE;

        if (level.areas[newx][newy] > 0) {
            // ambush tiles don't have valid area numbers (-3), so don't change the area if walking over them
            self.areanumber = level.areas[newx][newy];
            // assert( self.areanumber >= 0 && self.areanumber < NUMAREAS );
        }

        self.distance = Wolf.TILEGLOBAL;
        self.dir = new_dir;

        return true;
    }

    /**
     * @description Entity is going to turn on a way point. 
     * @private
     */
    function path(self, game) {
        var level = game.level;
        if (level.tileMap[self.x >> Wolf.TILESHIFT][self.y >> Wolf.TILESHIFT] & Wolf.WAYPOINT_TILE) {
        
            var tileinfo = level.tileMap[self.x >> Wolf.TILESHIFT][self.y >> Wolf.TILESHIFT];
            
            if (tileinfo & Wolf.TILE_IS_E_TURN) {
                self.dir = Wolf.Math.dir8_east;
            } else if (tileinfo & Wolf.TILE_IS_NE_TURN) {
                self.dir = Wolf.Math.dir8_northeast;
            } else if (tileinfo & Wolf.TILE_IS_N_TURN) {
                self.dir = Wolf.Math.dir8_north;
            } else if (tileinfo & Wolf.TILE_IS_NW_TURN) {
                self.dir = Wolf.Math.dir8_northwest;
            } else if (tileinfo & Wolf.TILE_IS_W_TURN) {
                self.dir = Wolf.Math.dir8_west;
            } else if (tileinfo & Wolf.TILE_IS_SW_TURN) {
                self.dir = Wolf.Math.dir8_southwest;
            } else if (tileinfo & Wolf.TILE_IS_S_TURN) {
                self.dir = Wolf.Math.dir8_south;
            } else if (tileinfo & Wolf.TILE_IS_SE_TURN) {
                self.dir = Wolf.Math.dir8_southeast;
            }
        }

        if (!changeDir(self, self.dir, level)) {
            self.dir = Wolf.Math.dir8_nodir;
        }
    }


    /**
     * @description Called by entities that ARE NOT chasing the player. 
     * @private
     */
    function findTarget(self, game, tics) {
        var level = game.level,
            player = game.player;

        if (self.temp2) { // count down reaction time
            self.temp2 -= tics;
            if (self.temp2 > 0) {
                return false;
            }
            self.temp2 = 0; // time to react
        } else {
        
            // check if we can/want to see/hear player
            if (player.flags & Wolf.FL_NOTARGET) {
                return false; // notarget cheat
            }

            // assert( self.areanumber >= 0 && self.areanumber <    NUMAREAS );
            if (!(self.flags & Wolf.FL_AMBUSH) && ! level.state.areabyplayer[self.areanumber]) {
                return false;
            }

            if (!checkSight(self, game)) { // Player is visible - normal behavior
                if (self.flags & Wolf.FL_AMBUSH || !player.madenoise) {
                    return false;
                }
            }
            self.flags &= ~Wolf.FL_AMBUSH;
            
            
            // if we are here we see/hear player!!!
            switch (self.type) {
                case Wolf.en_guard:
                    self.temp2 = 1 + Wolf.Random.rnd() / 4;
                    break;

                case Wolf.en_officer:
                    self.temp2 = 2;
                    break;

                case Wolf.en_mutant:
                    self.temp2 = 1 + Wolf.Random.rnd() / 6;
                    break;

                case Wolf.en_ss:
                    self.temp2 = 1 + Wolf.Random.rnd() / 6;
                    break;

                case Wolf.en_dog:
                    self.temp2 = 1 + Wolf.Random.rnd() / 8;
                    break;

                case Wolf.en_boss:
                case Wolf.en_schabbs:
                case Wolf.en_fake:
                case Wolf.en_mecha:
                case Wolf.en_hitler:
                case Wolf.en_gretel:
                case Wolf.en_gift:
                case Wolf.en_fat:
                case Wolf.en_spectre:
                case Wolf.en_angel:
                case Wolf.en_trans:
                case Wolf.en_uber:
                case Wolf.en_will:
                case Wolf.en_death:
                    self.temp2 = 1;
                    break;
            }

            return false;  // we are amazed & waiting to understand what to do!
        }

        Wolf.ActorAI.firstSighting(self, game);

        return true;
    }



    /**
     * @description As dodge(), but doesn't try to dodge.  
     * @private
     */
    function chase(self, game) {
        var level = game.level,
            player = game.player,
            deltax, 
            deltay,
            d = [],
            tdir, olddir, turnaround;

        if (game.player.playstate == Wolf.ex_victory) {
            return;
        }
        
        olddir = self.dir;
        turnaround = Wolf.Math.opposite8[olddir];
        d[0] = d[1] = Wolf.Math.dir8_nodir;

        deltax = Wolf.POS2TILE(player.position.x) - Wolf.POS2TILE(self.x);
        deltay = Wolf.POS2TILE(player.position.y) - Wolf.POS2TILE(self.y);

        if (deltax > 0) {
            d[0] = Wolf.Math.dir8_east;
        } else if (deltax < 0) {
            d[0] = Wolf.Math.dir8_west;
        }
        
        if (deltay > 0) {
            d[1] = Wolf.Math.dir8_north;
        } else if (deltay < 0) {
            d[1] = Wolf.Math.dir8_south;
        }

        if (Math.abs(deltay) > Math.abs(deltax)) {
            tdir = d[0];
            d[0] = d[1];
            d[1] = tdir;
        } // swap d[0] & d[1]

        if (d[0] == turnaround) {
            d[0] = Wolf.Math.dir8_nodir;
        }

        if (d[1] == turnaround) {
            d[1] = Wolf.Math.dir8_nodir;
        }

        if (d[0] != Wolf.Math.dir8_nodir) {
            if (changeDir(self, d[0], level)) {
                return;
            }
        }

        if (d[1] != Wolf.Math.dir8_nodir) {
            if (changeDir(self, d[1], level)) {
                return;
            }
        }

        // there is no direct path to the player, so pick another direction
        if (olddir != Wolf.Math.dir8_nodir) {
            if (changeDir(self, olddir, level)) {
                return;
            }
        }

        if (Wolf.Random.rnd() > 128) { // randomly determine direction of search
            for (tdir = Wolf.Math.dir8_east; tdir <= Wolf.Math.dir8_south; tdir += 2) { // * Revision
                if (tdir != turnaround) {
                    if (changeDir(self, tdir, level)) {
                        return;
                    }
                }
            }
        } else {
            for (tdir = Wolf.Math.dir8_south; tdir >= Wolf.Math.dir8_east; tdir -= 2) { // * Revision (JDC fix for unsigned enums)
                if (tdir != turnaround) {
                    if (changeDir(self, tdir, level)) {
                        return;
                    }
                }
            }
        }

        if (turnaround != Wolf.Math.dir8_nodir) {
            if (changeDir(self, turnaround, level)) {
                return;
            }
        }

        self.dir = Wolf.Math.dir8_nodir; // can't move
    }


    /**
     * @description Run Away from player.  
     * @private
     */
    function retreat(self, game) {
        var level = game.level,
            player = game.player,
            deltax, 
            deltay,
            d = [],
            tdir;

        deltax = Wolf.POS2TILE(player.position.x) - Wolf.POS2TILE(self.x);
        deltay = Wolf.POS2TILE(player.position.y) - Wolf.POS2TILE(self.y);

        d[0] = deltax < 0 ? Wolf.Math.dir8_east  : Wolf.Math.dir8_west;
        d[1] = deltay < 0 ? Wolf.Math.dir8_north : Wolf.Math.dir8_south;

        if (Math.abs(deltay) > Math.abs(deltax)) {
            tdir = d[0];
            d[0] = d[1];
            d[1] = tdir;
        } // swap d[0] & d[1]

        if (changeDir(self, d[0], level)) {
            return;
        }
        if (changeDir(self, d[1], level)) {
            return;
        }

        // there is no direct path to the player, so pick another direction
        if (Wolf.Random.rnd() > 128) { // randomly determine direction of search
            for(tdir = Wolf.Math.dir8_east; tdir <= Wolf.Math.dir8_south; tdir += 2 ) { // * Revision
                if (changeDir(self, tdir, level)) {
                    return;
                }
            }
        } else {
            for (tdir = Wolf.Math.dir8_south; tdir >= Wolf.Math.dir8_east; tdir -= 2) { // * Revision (JDC fix for unsigned enums)
                if (changeDir(self, tdir, level)) {
                    return;
                }
            }
        }

        self.dir = Wolf.Math.dir8_nodir;        // can't move
    }

    
    /**
     * @description Attempts to choose and initiate a movement for entity
     *              that sends it towards the player while dodging.
     * @private
     */
    function dodge(self, game) {
        var level = game.level,
            player = game.player,
            deltax, 
            deltay, 
            i,
            
            dirtry = [], 
            turnaround, 
            tdir;
            
        if (game.player.playstate == Wolf.ex_victory) {
            return;
        }
       
        if (self.flags & Wolf.FL_FIRSTATTACK) {
            // turning around is only ok the very first time after noticing the player
            turnaround = Wolf.Math.dir8_nodir;
            self.flags &= ~Wolf.FL_FIRSTATTACK;
        } else {
            turnaround = Wolf.Math.opposite8[self.dir];
        }

      
        deltax = Wolf.POS2TILE(player.position.x) - Wolf.POS2TILE(self.x);
        deltay = Wolf.POS2TILE(player.position.y) - Wolf.POS2TILE(self.y);

        //
        // arange 5 direction choices in order of preference
        // the four cardinal directions plus the diagonal straight towards
        // the player
        //

        if (deltax > 0) {
            dirtry[1] = Wolf.Math.dir8_east;
            dirtry[3] = Wolf.Math.dir8_west;
        } else {
            dirtry[1] = Wolf.Math.dir8_west;
            dirtry[3] = Wolf.Math.dir8_east;
        }

        if( deltay > 0 ) {
            dirtry[2] = Wolf.Math.dir8_north;
            dirtry[4] = Wolf.Math.dir8_south;
        } else {
            dirtry[2] = Wolf.Math.dir8_south;
            dirtry[4] = Wolf.Math.dir8_north;
        }

        // randomize a bit for dodging
        if (Math.abs(deltax) > Math.abs(deltay)) {
            tdir = dirtry[1]; dirtry[1]=dirtry[2]; dirtry[2]=tdir; // => swap dirtry[1] & dirtry[2]
            tdir = dirtry[3]; dirtry[3]=dirtry[4]; dirtry[4]=tdir; // => swap dirtry[3] & dirtry[4]
        }

        if (Wolf.Random.rnd() < 128) {
            tdir = dirtry[1]; dirtry[1]=dirtry[2]; dirtry[2]=tdir;
            tdir = dirtry[3]; dirtry[3]=dirtry[4]; dirtry[4]=tdir;
        }

        dirtry[0] = Wolf.Math.diagonal[dirtry[1]][dirtry[2]];

        // try the directions util one works
        for (i=0; i < 5; ++i) {
            if (dirtry[i] == Wolf.Math.dir8_nodir || dirtry[i] == turnaround) {
                continue;
            }
            if (changeDir(self, dirtry[i], level)) {
                return;
            }
        }

        // turn around only as a last resort
        if (turnaround != Wolf.Math.dir8_nodir) {
            if (changeDir(self, turnaround, level)) {
                return;
            }
        }
        

        
        self.dir = Wolf.Math.dir8_nodir;
    }
    

    /**
     * @memberOf Wolf.AI
     */
    function T_Stand(self, game, tics) {
        findTarget(self, game, tics);
    }
    
    /**
     * @memberOf Wolf.AI
     */
    function T_Path(self, game, tics) {
        var level = game.level;
        if (findTarget(self, game, tics)) {
            return;
        }

        if (!self.speed) {
            return; // if patroling with a speed of 0
        }

        if (self.dir == Wolf.Math.dir8_nodir) {
            path(self, game);

            if (self.dir == Wolf.Math.dir8_nodir) {
                return; // all movement is blocked
            }
        }
        T_Advance(self, game, path, tics);
    }


    /**
     * @description Try to damage the player.
     * @memberOf Wolf.AI
     */
    function T_Shoot(self, game, tics) {
        var level = game.level,
            player = game.player,
            dx, dy, dist,
            hitchance,
            damage;

        if (!level.state.areabyplayer[self.areanumber]) {
            return;
        }
        
        if (!Wolf.Level.checkLine(self.x, self.y, player.position.x, player.position.y, level)) {
            return; // player is behind a wall
        }

        dx = Math.abs(Wolf.POS2TILE(self.x ) - Wolf.POS2TILE(player.position.x));
        dy = Math.abs(Wolf.POS2TILE(self.y ) - Wolf.POS2TILE(player.position.y));
        dist = Math.max(dx, dy);

        if (self.type == Wolf.en_ss || self.type == Wolf.en_boss )
        {
            dist = dist * 2 / 3;                    // ss are better shots
        }

        if (player.speed >= Wolf.RUNSPEED) {
            hitchance = 160;
        } else {
            hitchance = 256;
        }

        // if guard is visible by player
        // player can see to dodge
        // (if CheckLine both player & enemy see each other)
        // So left only check if guard is in player's fov: FIXME: not fixed fov!
        var trans = Wolf.Math.transformPoint(self.x, self.y, player.position.x, player.position.y);
        if (Wolf.Angle.diff(trans, Wolf.FINE2DEG(player.angle)) < (Math.PI/3)) {
            hitchance -= dist * 16;
        } else {
            hitchance -= dist * 8;
        }

        // see if the shot was a hit
        if (Wolf.Random.rnd() < hitchance) {
            if (dist < 2) {
                damage = Wolf.Random.rnd() >> 2;
            } else if (dist < 4) {
                damage = Wolf.Random.rnd() >> 3;
            } else {
                damage = Wolf.Random.rnd() >> 4;
            }
            Wolf.Player.damage(player, self, damage);
        }

        switch (self.type) {
            case Wolf.en_ss:
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "sfx/024.wav", 1, Wolf.ATTN_NORM, 0);
                break;
            case Wolf.en_gift:
            case Wolf.en_fat:
            case Wolf.en_mecha:
            case Wolf.en_hitler:
            case Wolf.en_boss:
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "sfx/022.wav", 1, Wolf.ATTN_NORM, 0);
                break;
            default:
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "sfx/049.wav", 1, Wolf.ATTN_NORM, 0);
                break;
        }
    }
    

    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_Chase(self, game, tics) {
        var level = game.level,
            player = game.player,
            dx, dy, 
            dist, 
            chance,
            shouldDodge = false;
        
        // if (gamestate.victoryflag) return;
        if (Wolf.Level.checkLine(self.x, self.y, player.position.x, player.position.y, level)) { // got a shot at player?
            dx = Math.abs(Wolf.POS2TILE(self.x) - Wolf.POS2TILE(player.position.x));
            dy = Math.abs(Wolf.POS2TILE(self.y) - Wolf.POS2TILE(player.position.y));
            dist = Math.max(dx, dy);
            if (!dist || (dist == 1 && self.distance < 16)) {
                chance = 300;
            } else {
                chance = (tics << 4) / dist; // 100/dist;
            }

            if (Wolf.Random.rnd() < chance) {
                // go into attack frame
                Wolf.Actors.stateChange(self, Wolf.st_shoot1);
                return;
            }
            shouldDodge = true;
        }
        

        if (self.dir == Wolf.Math.dir8_nodir) {
            if (shouldDodge) {
                dodge(self, game);
            } else {
                chase(self, game);
            }

            if (self.dir == Wolf.Math.dir8_nodir) {
                return; // object is blocked in
            }
            self.angle = Wolf.Math.dir8angle[self.dir];
        }

        T_Advance(self, game, shouldDodge ? dodge : chase, tics);

    }
    

    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_DogChase(self, game, tics) {
        var level = game.level,
            player = game.player,
            dx, dy;

        if (self.dir == Wolf.Math.dir8_nodir) {
            dodge(self, game);
            self.angle = Wolf.Math.dir8angle[ self.dir ];
            if (self.dir == Wolf.Math.dir8_nodir) {
                return; // object is blocked in
            }
        }

        //
        // check for bite range
        //
        dx = Math.abs(player.position.x - self.x) - Wolf.TILEGLOBAL / 2;
        if (dx <= Wolf.MINACTORDIST) {
            dy = Math.abs(player.position.y - self.y) - Wolf.TILEGLOBAL / 2;
            if (dy <= Wolf.MINACTORDIST) {
                Wolf.Actors.stateChange(self, Wolf.st_shoot1);
                return; // bite player!
            }
        }

        T_Advance(self, game, dodge, tics);
    }
    

    /**
     * @description Try to damage the player.
     * @memberOf Wolf.AI
     */
    function T_BossChase(self, game, tics) {
        var level = game.level,
            player = game.player,
            dx, dy, dist,
            think,
            shouldDodge = false;

        dx = Math.abs(self.tile.x - Wolf.POS2TILE(player.position.x));
        dy = Math.abs(self.tile.y - Wolf.POS2TILE(player.position.y));
        dist = Math.max(dx, dy);

        if (Wolf.Level.checkLine(self.x, self.y, player.position.x, player.position.y, level)) {
            // got a shot at player?
            if (Wolf.Random.rnd() < tics << 3) {
                // go into attack frame
                Wolf.Actors.stateChange(self, Wolf.st_shoot1);
                return;
            }
            shouldDodge = true;
        }

        if( self.dir == Wolf.Math.dir8_nodir ) {
            if (shouldDodge) {
                dodge(self, game);
            } else {
                chase(self, game);
            }

            if( self.dir == Wolf.Math.dir8_nodir ) {
                // object is blocked in
                return;    
            }
        }

        think = dist < 4 ? retreat : (shouldDodge ? dodge : chase);
        T_Advance(self, game, think, tics);
    }
    
    
    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_Fake(self, game, tics) {
        var level = game.level,
            player = game.player;
            
        if (Wolf.Level.checkLine(self.x, self.y, player.position.x, player.position.y, level)) {
            if (Wolf.Random.rnd() < tics << 1) {
                // go into attack frame
                Wolf.Actors.stateChange(self, Wolf.st_shoot1);
                return;
            }
        }
        
        if (self.dir == Wolf.Math.dir8_nodir) {
            dodge(self, game);
            if (self.dir == Wolf.Math.dir8_nodir ) {
                // object is blocked in
                return;
            }
        }

        T_Advance(self, game, dodge, tics);
    }

    
    /**
     * @description 
     * @private
     */
    function T_Advance(self, game, think, tics) {
        var level = game.level,
            move, door;

        if (!think) {
            Wolf.log("Warning: Advance without <think> proc\n");
            return;
        }

        move = self.speed * tics;
        while (move > 0) {
            // waiting for a door to open
            if (self.waitfordoorx) {
                door = level.state.doorMap[self.waitfordoorx][self.waitfordoory];

                Wolf.Doors.open(door);
                if (door.action != Wolf.dr_open) {
                    return; // not opened yet...
                }
                self.waitfordoorx = self.waitfordoory = 0;    // go ahead, the door is now open
            }

            if (move < self.distance ) {
                T_Move(self, game, move);
                break;
            }

            // fix position to account for round off during moving
            self.x = Wolf.TILE2POS(self.tile.x);
            self.y = Wolf.TILE2POS(self.tile.y);

            move -= self.distance;

            // think: Where to go now?
            think(self, game, tics);
            
            self.angle = Wolf.Math.dir8angle[self.dir];
            if (self.dir == Wolf.Math.dir8_nodir) {
                return; // all movement is blocked
            }
        }
    }
    
    /**
     * @description Moves object for distance in global units, in self.dir direction. 
     * @memberOf Wolf.AI
     */
    function T_Move(self, game, dist) {
        var level = game.level,
            player = game.player;
            
        if (self.dir == Wolf.Math.dir8_nodir || !dist) {
            return;
        }
        self.x += dist * Wolf.Math.dx8dir[self.dir];
        self.y += dist * Wolf.Math.dy8dir[self.dir];

        // check to make sure it's not on top of player
        if (Math.abs(self.x - player.position.x) <= Wolf.MINACTORDIST) {
            if (Math.abs(self.y - player.position.y) <= Wolf.MINACTORDIST) {
                var t = self.type;
                if (t == Wolf.en_blinky  || t == Wolf.en_clyde || t == Wolf.en_pinky || t == Wolf.en_inky || t == Wolf.en_spectre) {
                    Wolf.Player.damage(player, self, 2); // ghosts hurt player!
                }
                //
                // back up
                //
                self.x -= dist * Wolf.Math.dx8dir[self.dir];
                self.y -= dist * Wolf.Math.dy8dir[self.dir];
                return;
            }
        }

        self.distance -= dist;
        if (self.distance < 0) {
            self.distance = 0;
        }
    }
    
    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_Ghosts(self, game, tics) {
        var level = game.level,
            player = game.player;

        if (self.dir == Wolf.Math.dir8_nodir) {
            chase(self, game);
            if (self.dir == Wolf.Math.dir8_nodir ) {
                return;    // object is blocked in
            }
            self.angle = Wolf.Math.dir8angle[self.dir];
        }
        T_Advance(self, game, chase, tics);
    }
    
    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_Bite(self, game, tics) {
        var level = game.level,
            player = game.player,
            dx, dy;

        Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_VOICE, "sfx/002.wav", 1, Wolf.ATTN_NORM, 0);

        dx = Math.abs(player.position.x - self.x) - Wolf.TILEGLOBAL;
        if (dx <= Wolf.MINACTORDIST) {
            dy = Math.abs(player.position.y - self.y) - Wolf.TILEGLOBAL;
            if (dy <= Wolf.MINACTORDIST) {
                if (Wolf.Random.rnd() < 180) {
                    Wolf.Player.damage(player, self, Wolf.Random.rnd() >> 4);
                    return;
                }
            }
        }
    }


    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_UShoot(self, game, tics) {
        var level = game.level,
            player = game.player,
            dx, dy,
            dist;

        T_Shoot(self, game, tics);

        dx = Math.abs(self.tile.x - Wolf.POS2TILE(player.position.x));
        dy = Math.abs(self.tile.y - Wolf.POS2TILE(player.position.y));
        dist = Math.max(dx, dy);

        if (dist <= 1) {
            Wolf.Player.damage(player, self, 10);
        }
    }
    
    
    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_Launch(self, game, tics) {
        var level = game.level,
            player = game.player,
            proj, iangle;

        iangle = Wolf.Math.transformPoint(self.x, self.y, player.position.x, player.position.y) + Math.PI;
        if (iangle > 2 * Math.PI) {
            iangle -= 2 * Math.PI;
        }

        if (self.type == Wolf.en_death) {
            // death knight launches 2 rockets with 4 degree shift each.
            T_Shoot(self, game, tics);
            if (self.state == Wolf.st_shoot2) {
                iangle = Wolf.Math.normalizeAngle(iangle - Wolf.DEG2RAD(4));
            } else {
                iangle = Wolf.Math.normalizeAngle(iangle + Wolf.DEG2RAD(4));
            }
        }

        proj = Wolf.Actors.getNewActor(level);
        if (proj == null) {
            return;
        }

        proj.x = self.x;
        proj.y = self.y;

        proj.tile.x = self.tile.x;
        proj.tile.y = self.tile.y;

        proj.state = Wolf.st_stand;
        proj.ticcount = 1;
        proj.dir = Wolf.Math.dir8_nodir;

        proj.angle = Wolf.RAD2FINE(iangle)>>0;

        proj.speed = 0x2000;
        proj.flags = Wolf.FL_NONMARK; // FL_NEVERMARK;
        proj.sprite = Wolf.Sprites.getNewSprite(level);
        
        switch(self.type) {
            case Wolf.en_death:
                proj.type = Wolf.en_hrocket;
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "lsfx/078.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_angel:
                proj.type = Wolf.en_spark;
                proj.state = Wolf.st_path1;
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "lsfx/069.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_fake:
                proj.type = Wolf.en_fire;
                proj.state = Wolf.st_path1;
                proj.flags = Wolf.FL_NEVERMARK;
                proj.speed = 0x1200;
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "lsfx/069.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_schabbs:
                proj.type = Wolf.en_needle;
                proj.state = Wolf.st_path1;
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "lsfx/008.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            default:
                proj.type = Wolf.en_rocket;
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "lsfx/085.wav", 1, Wolf.ATTN_NORM, 0);
        }
        
    }
    

    
    /**
     * @description Called when projectile is airborne. 
     * @private
     * @param {object} self The projectile actor object.
     * @param {object} level The level object.
     * @returns {boolean} True if move ok, otherwise false.
     */
    function projectileTryMove(self, level) {
        var PROJSIZE = 0x2000,
            xl, yl, xh, yh, x, y;

        xl = (self.x - PROJSIZE) >> Wolf.TILESHIFT;
        yl = (self.y - PROJSIZE) >> Wolf.TILESHIFT;

        xh = (self.x + PROJSIZE) >> Wolf.TILESHIFT;
        yh = (self.y + PROJSIZE) >> Wolf.TILESHIFT;

        // Checking for solid walls:
        for (y = yl; y <= yh; ++y) {
            for (x = xl; x <= xh; ++x) {
                // FIXME: decide what to do with statics & Doors!
                if (level.tileMap[x][y] & (Wolf.WALL_TILE | Wolf.BLOCK_TILE)) {
                    return false;
                }
                if (level.tileMap[x][y] & Wolf.DOOR_TILE) {
                    if (Wolf.Doors.opened(level.state.doorMap[x][y]) != Wolf.DOOR_FULLOPEN) {
                        return false;
                    }
                }
            }
        }
        // FIXME: Projectile will fly through objects (even guards & columns) - must fix to create rocket launcher!
        return true;
    }


    /**
     * @description Called when projectile is airborne. 
     * @memberOf Wolf.AI
     * @param {object} self The enemy actor object.
     * @param {object} level The level object.
     * @param {object} player The player object.
     * @param {number} tics The number of tics.
     * @returns {boolean} True if move ok, otherwise false.
     */
    function T_Projectile(self, game, tics) {
        var level = game.level,
            player = game.player,
            PROJECTILESIZE = 0xC000,
            deltax, deltay, 
            speed, damage;
        
        speed = self.speed * tics;

        deltax = (speed * Wolf.Math.CosTable[self.angle])>>0;
        deltay = (speed * Wolf.Math.SinTable[self.angle])>>0;

        if (deltax > Wolf.TILEGLOBAL) {
            deltax = Wolf.TILEGLOBAL;
        }
        if (deltax < -Wolf.TILEGLOBAL) {
            deltax = -Wolf.TILEGLOBAL; // my
        }
        if (deltay > Wolf.TILEGLOBAL) {
            deltay = Wolf.TILEGLOBAL;
        }
        if (deltay < -Wolf.TILEGLOBAL) {
            deltay = -Wolf.TILEGLOBAL; // my
        }

        self.x += deltax;
        self.y += deltay;

        deltax = Math.abs(self.x - player.position.x);
        deltay = Math.abs(self.y - player.position.y);

        if (!projectileTryMove(self, level)) {
            if (self.type == Wolf.en_rocket || self.type == Wolf.en_hrocket ) { 
                // rocket ran into obstacle, draw explosion!
                Wolf.Sound.startSound(player.position, self, 1, Wolf.CHAN_WEAPON, "lsfx/086.wav", 1, Wolf.ATTN_NORM, 0);
                Wolf.Actors.stateChange(self, Wolf.st_die1);
            } else {
                Wolf.Actors.stateChange(self, Wolf.st_remove); // mark for removal
            }
            return;
        }

        if (deltax < PROJECTILESIZE && deltay < PROJECTILESIZE) {
            // hit the player
            switch (self.type) {
                case Wolf.en_needle:
                    damage = (Wolf.Random.rnd() >> 3) + 20;
                    break;

                case Wolf.en_rocket:
                case Wolf.en_hrocket:
                case Wolf.en_spark:
                    damage = (Wolf.Random.rnd()>>3) + 30;
                    break;

                case Wolf.en_fire:
                    damage = (Wolf.Random.rnd() >> 3);
                    break;

                default:
                    damage = 0;
                    break;
            }

            Wolf.Player.damage(player, self, damage);
            Wolf.Actors.stateChange(self, Wolf.st_remove); // mark for removal
            return;
        }

        self.tile.x = self.x >> Wolf.TILESHIFT;
        self.tile.y = self.y >> Wolf.TILESHIFT;
    }
    
    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_BJRun(self, game, tics) {
        var move = Wolf.BJRUNSPEED * tics;

        T_Move(self, game, move);

        if (!self.distance) {
            self.distance = Wolf.TILEGLOBAL;
            if (!(--self.temp2)) {
                Wolf.Actors.stateChange(self, Wolf.st_shoot1);
                self.speed = Wolf.BJJUMPSPEED;
                return;
            }
        }
    }
    
    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_BJJump(self, game, tics) {
        //var move = Wolf.BJRUNSPEED * tics;
        //T_Move(self, game, move);
    }
    
    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_BJYell(self, game, tics) {
        Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_VOICE, "sfx/082.wav", 1, Wolf.ATTN_NORM, 0);
    }
    
    /**
     * @description 
     * @memberOf Wolf.AI
     */
    function T_BJDone(self, game, tics) {
        Wolf.Player.playstate = Wolf.ex_victory; // exit castle tile
        //Wolf.Player.playstate = Wolf.ex_complete;
        Wolf.Game.endEpisode(game);
    }

    
    return {
        T_Stand : T_Stand,
        T_Path : T_Path,
        T_Ghosts : T_Ghosts,
        T_Bite : T_Bite,
        T_Shoot : T_Shoot,
        T_UShoot : T_UShoot,
        T_Launch : T_Launch,
        T_Chase : T_Chase,
        T_DogChase : T_DogChase,
        T_BossChase : T_BossChase,
        T_Fake : T_Fake,
        T_Projectile : T_Projectile,
        T_BJRun : T_BJRun,
        T_BJJump : T_BJJump,
        T_BJYell : T_BJYell,
        T_BJDone : T_BJDone
    };
    
})();