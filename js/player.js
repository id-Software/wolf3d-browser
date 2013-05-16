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
 * @description Player management
 */
Wolf.Player = (function() {

    Wolf.setConsts({
        PLAYERSIZE      : Wolf.MINDIST, // player radius
        STOPSPEED       : 0x0D00,
        FRICTION        : 0.25,
        MAXMOVE         : (Wolf.MINDIST*2-1),
        EXTRAPOINTS     : 40000,	// points for an extra life
        ITEM_KEY_1      : 1,
        ITEM_KEY_2      : 2,
        ITEM_KEY_3      : 4,
        ITEM_KEY_4      : 8,
        ITEM_WEAPON_1   : 16,
        ITEM_WEAPON_2   : 32,
        ITEM_WEAPON_3   : 64,
        ITEM_WEAPON_4   : 128,
        ITEM_WEAPON_5   : 256,
        ITEM_WEAPON_6   : 512,
        ITEM_WEAPON_7   : 1024,
        ITEM_WEAPON_8   : 2048,
        ITEM_BACKPACK   : (1<<12), // doubles carrying capacity
        ITEM_AUGMENT    : (1<<13), // adds 50 to maximum health
        ITEM_UNIFORM    : (1<<14), // allows you to pass guards
        ITEM_AUTOMAP    : (1<<15), // shows unknown map ares in other color (as in DooM)
        ITEM_FREE       : (1<<16), // - unused -
        PL_FLAG_REUSE   : 1, // use button pressed
        PL_FLAG_ATTCK   : 2, // attacking
        // debug (cheat codes) flags
        FL_GODMODE      : (1<<4),
        FL_NOTARGET     : (1<<6),
        
        WEAPON_KNIFE    : 0,
        WEAPON_PISTOL   : 1,
        WEAPON_AUTO     : 2,
        WEAPON_CHAIN    : 3,
        WEAPON_TYPES    : 4,

        KEY_GOLD        : 0,
        KEY_SILVER      : 1,
        KEY_FREE1       : 2,
        KEY_FREE2       : 3,
        KEY_TYPES       : 4,

        AMMO_BULLETS    : 0,
        AMMO_TYPES      : 1,
        
        ex_notingame    : 0,
        ex_playing      : 1,
        ex_dead         : 2,
        ex_secretlevel  : 3,
        ex_victory      : 4,
        ex_complete     : 5,
        
        // victory animation
        BJRUNSPEED      : 2048,
        BJJUMPSPEED     : 680

    });

    

    /*    
    struct atkinf
    {
        char tics, attack, frame; // attack is 1 for gun, 2 for knife
    } 
    */
    var attackinfo = [ // 4 guns, 14 frames max for every gun!
        [ {tics:6,attack:0,frame:1},{tics:6,attack:2,frame:2},{tics:6,attack:0,frame:3},{tics:6,attack:-1,frame:0}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
        [ {tics:6,attack:0,frame:1},{tics:6,attack:1,frame:2},{tics:6,attack:0,frame:3},{tics:6,attack:-1,frame:0}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
        [ {tics:6,attack:0,frame:1},{tics:6,attack:1,frame:2},{tics:6,attack:3,frame:3},{tics:6,attack:-1,frame:0}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ],
        [ {tics:6,attack:0,frame:1},{tics:6,attack:1,frame:2},{tics:6,attack:4,frame:3},{tics:6,attack:-1,frame:0}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ]
    ];

    
    /**
     * @description Spawn the player
     * @memberOf Wolf.Player
     * @param {object} location The location to spawn the player {origin, angle}
     * @param {object} level The level object
     * @param {number} skill The difficulty level
     * @param {object} [oldPlayer] A player object to copy score and weapons from
     * @returns {object} The new player object
     */
    function spawn(location, level, skill, oldPlayer) {
    
        var x = location.x,
            y = location.y,
            angle = location.angle,
            tileX = Wolf.POS2TILE(x),
            tileY = Wolf.POS2TILE(y),
            areanumber = level.areas[tileX][tileY];
            
        // Player structure: Holds all info about player
        var player = {
            episode : -1,
            level : -1,
            health : 100,
            frags : 0,
            ammo : [
            ],
            score : 0,
            lives : 0,
            startScore : 0,
            nextExtra : 0,
            items : 0, // (keys, weapon)
            weapon : 0,
            pendingWeapon : -1,
            previousWeapon : -1,
            position : {
                x : x,
                y : y
            },
            angle : angle,
            tile : {
                x : tileX,
                y : tileY
            },
            mov : {
                x : 0,
                y : 0
            },
            speed : 0,
            armor : 0, // there are 2 types. The better one is indicated by high bit set
            cmd : { // movement / action command
                forwardMove : 0,
                sideMove : 0,
                buttons : 0,
                impulse : 0
            },
            attackFrame : 0, // attack info
            attackCount : 0, 
            weaponFrame : 0, 
            
            madenoise : false,
            lastAttacker : null,
            
            faceFrame : 0, 
            faceCount : 0,    // bj's face in the HUD // FIXME decide something!
            faceGotGun : false, 
            faceOuch : false,

            flags : 0,
            areanumber : areanumber,
            playstate : 0,
            
            attackDirection : [0,0],
            
            skill : skill
        };
        
        if (player.areanumber < 0) {
            player.areanumber = 36;
        }
        
        Wolf.Areas.init(level, player.areanumber);
        Wolf.Areas.connect(level, player.areanumber);

        if (oldPlayer) {
            copyPlayer(player, oldPlayer);
        } else {
            newGame(player);
        }

        return player;
    }
    

    /**
     * @description Copy player variables from another player object
     * @private
     * @param {object} player The player object
     * @param {object} copyPlayer The player object to copy from
     */
    function copyPlayer(player, copyPlayer) {
        player.health = copyPlayer.health;
        player.ammo = copyPlayer.ammo;
        player.score = copyPlayer.score;
        player.startScore = copyPlayer.startScore;
        player.lives = copyPlayer.lives;
        player.previousWeapon = copyPlayer.previousWeapon;
        player.weapon = copyPlayer.weapon;
        player.pendingWeapon = copyPlayer.pendingWeapon;
        player.items = (copyPlayer.items & Wolf.ITEM_WEAPON_1) | 
                       (copyPlayer.items & Wolf.ITEM_WEAPON_2) |
                       (copyPlayer.items & Wolf.ITEM_WEAPON_3) |
                       (copyPlayer.items & Wolf.ITEM_WEAPON_4);
        player.nextExtra = copyPlayer.nextExtra;
    }
    
    /**
     * @description Set up player for the new game
     * @memberOf Wolf.Player
     * @param {object} player The player object
     */
    function newGame(player) {
        player.health = 100;
        player.ammo[Wolf.AMMO_BULLETS] = 8;
        player.score = 0;
        player.startScore = 0;
        player.lives = 3;
        player.previousWeapon = Wolf.WEAPON_KNIFE; //gsh
        player.weapon = player.pendingWeapon = Wolf.WEAPON_PISTOL;
        player.items = Wolf.ITEM_WEAPON_1 | Wolf.ITEM_WEAPON_2;
        player.nextExtra = Wolf.EXTRAPOINTS;
    }

    
   
    /**
     * @description Try to move player
     * @private
     * @param {object} player The player object.
     * @param {object} level The level object.
     * @returns {boolean} Returns true if move was ok
     */
    function tryMove(player, level) {
        var xl, yl, xh, yh, x, y,
            d, n;

        xl = Wolf.POS2TILE(player.position.x - Wolf.PLAYERSIZE );
        yl = Wolf.POS2TILE(player.position.y - Wolf.PLAYERSIZE );
        xh = Wolf.POS2TILE(player.position.x + Wolf.PLAYERSIZE );
        yh = Wolf.POS2TILE(player.position.y + Wolf.PLAYERSIZE );

        // Cheching for solid walls:
        for (y = yl; y <= yh; ++y) {
            for (x = xl; x <= xh; ++x) {
                if (level.tileMap[x][y] & Wolf.SOLID_TILE) {
                    return false;
                }
                if (level.tileMap[x][y] & Wolf.DOOR_TILE && Wolf.Doors.opened(level.state.doorMap[x][y]) != Wolf.DOOR_FULLOPEN) {
                    // iphone hack to allow player to move halfway into door tiles
                    // if the player bounds doesn't cross the middle of the tile, let the move continue            
                    if (Math.abs(player.position.x - Wolf.TILE2POS(x)) <= 0x9000 && Math.abs(player.position.y - Wolf.TILE2POS(y)) <= 0x9000) {
                        return false;
                    }
                }
            }
        }

        // check for actors
        for (n = 0; n < level.state.numGuards; ++n) {
            if (level.state.guards[n].state >= Wolf.st_die1) {
                continue;
            }
            if (!(level.state.guards[n].flags & Wolf.FL_SHOOTABLE)) {
                continue;
            }

            d = player.position.x - level.state.guards[n].x;
            if (d < -Wolf.MINACTORDIST || d > Wolf.MINACTORDIST) {
                continue;
            }

            d = player.position.y - level.state.guards[n].y;
            if (d < -Wolf.MINACTORDIST || d > Wolf.MINACTORDIST) {
                continue;
            }
            return false;
        }

        return true;
    }
    
    /**
     * @description Clips movement
     * @private
     * @param {object} self The player object.
     * @param {number} xmove Movement in x direction
     * @param {number} ymove Movement in y direction
     * @param {object} level The level object.
     */
    function clipMove(self, xmove, ymove, level) {
        var basex, basey;

        basex = self.position.x;
        basey = self.position.y;

        self.position.x += xmove;
        self.position.y += ymove;
        if (tryMove(self, level)) {
            return; // we moved as we wanted
        }

        if (xmove) {    // don't bother if we don't move x!
            self.position.x = basex + xmove;
            self.position.y = basey;
            if (tryMove(self, level)) {
                return; // May be we'll move only X direction?
            }
        }
        if (ymove) {    // don't bother if we don't move y!
            self.position.x = basex;
            self.position.y = basey + ymove;
            if (tryMove(self, level)) {
                return; // May be we'll move only Y direction?
            }
        }

        // movement blocked; we must stay on one place... :(
        self.position.x = basex;
        self.position.y = basey;
    }


    /**
     * @description Changes player's angle and position
     * @memberOf Wolf.Player
     * @param {object} game The game object.
     * @param {object} self The player object.
     * @param {object} level The level object.
     * @param {object} tics Number of tics.
     */
    function controlMovement(game, self, level, tics) {
        var angle, speed;

        // rotation
        angle = self.angle;

        self.mov.x = self.mov.y = 0; // clear accumulated movement

        if (self.cmd.forwardMove ) {
            speed = tics * self.cmd.forwardMove;
            self.mov.x += (speed * Wolf.Math.CosTable[angle])>>0;
            self.mov.y += (speed * Wolf.Math.SinTable[angle])>>0;
        }
        if (self.cmd.sideMove) {
            speed = tics * self.cmd.sideMove;
            self.mov.x += (speed * Wolf.Math.SinTable[angle])>>0;
            self.mov.y -= (speed * Wolf.Math.CosTable[angle])>>0;
        }

        if (!self.mov.x && !self.mov.y) {
            return;
        }
            
        self.speed = self.mov.x + self.mov.y;

        // bound movement
        if (self.mov.x > Wolf.MAXMOVE) {
            self.mov.x = Wolf.MAXMOVE;
        } else if (self.mov.x < -Wolf.MAXMOVE) {
            self.mov.x = -Wolf.MAXMOVE;
        }

        if (self.mov.y > Wolf.MAXMOVE) {
            self.mov.y = Wolf.MAXMOVE;
        } else if (self.mov.y < -Wolf.MAXMOVE) {
            self.mov.y = -Wolf.MAXMOVE;
        }

        // move player and clip movement to walls (check for no-clip mode here)
        clipMove(self, self.mov.x, self.mov.y, level);
        self.tile.x = Wolf.POS2TILE(self.position.x);
        self.tile.y = Wolf.POS2TILE(self.position.y);
        
        //    Powerup_PickUp( self.tilex, self.tiley );
        
        // pick up items easier -- any tile you touch, instead of
        // just the midpoint tile
        var x, y, tileX, tileY;
        for (x = -1 ;x <= 1; x+= 2) {
            tilex = Wolf.POS2TILE(self.position.x + x * Wolf.PLAYERSIZE);
            for (y = -1; y <= 1; y+= 2) {
                tiley = Wolf.POS2TILE(self.position.y + y * Wolf.PLAYERSIZE);
                Wolf.Powerups.pickUp(level, self, tilex, tiley);
            }
        }

        // Checking for area change, ambush tiles and doors will have negative values
        if (level.areas[self.tile.x][self.tile.y] >= 0 && level.areas[self.tile.x][self.tile.y] != self.areanumber) {
            self.areanumber = level.areas[self.tile.x][self.tile.y];
            // assert( self.areanumber >= 0 && self.areanumber < Wolf.NUMAREAS );
            Wolf.Areas.connect(level, self.areanumber);
        }

        if (level.tileMap[self.tile.x][self.tile.y] & Wolf.EXIT_TILE) {
            //Wolf.Game.startIntermission(0);
            Wolf.Game.victory(game);
        }
    }
    
    
    /**
     * @description Called if player pressed USE button
     * @private
     * @param {object} self The player object.
     * @param {object} level The level object.
     * @returns {boolean} True if the player used something.
     */
    function use(self, game) {
        var x, y, dir, newtex,
            level = game.level;

        dir = Wolf.Math.get4dir(Wolf.FINE2RAD(self.angle));
        x = self.tile.x + Wolf.Math.dx4dir[dir];
        y = self.tile.y + Wolf.Math.dy4dir[dir];

        if (level.tileMap[x][y] & Wolf.DOOR_TILE) {
            return Wolf.Doors.tryUse(level, self, level.state.doorMap[x][y]);
        }

        if (level.tileMap[x][y] & Wolf.SECRET_TILE) {
            return Wolf.PushWall.push(level, x, y, dir);
        }

        if (level.tileMap[x][y] & Wolf.ELEVATOR_TILE) {
            switch (dir) {
                case Wolf.Math.dir4_east:
                case Wolf.Math.dir4_west:
                    newtex = level.wallTexX[x][y] += 2;
                    break;
                case Wolf.Math.dir4_north:
                case Wolf.Math.dir4_south:
                    return false; // don't allow to press elevator rails
            }
            
            if (level.tileMap[self.tile.x][self.tile.y] & Wolf.SECRETLEVEL_TILE) {
                self.playstate = Wolf.ex_secretlevel;
            } else {
                self.playstate = Wolf.ex_complete;
            }
            Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_BODY, "lsfx/040.wav", 1, Wolf.ATTN_NORM, 0 );
            
            Wolf.Game.startIntermission(game);
            
            return true;
        }

        return false;
    }

    /**
     * @description Attack
     * @memberOf Wolf.Player
     * @param {object} game The game object.
     * @param {object} player The player object.
     * @param {boolean} reAttack True if re-attack
     * @param {number} tics The number of tics
     */
    function attack(game, player, reAttack, tics) {
        var cur,
            level = game.level;
        
        player.attackCount -= tics;
        while (player.attackCount <= 0) {
            cur = attackinfo[player.weapon][player.attackFrame];
            switch (cur.attack) {
                case -1:
                    player.flags &= ~Wolf.PL_FLAG_ATTCK;
                    if (!player.ammo[Wolf.AMMO_BULLETS]) {
                        player.weapon = Wolf.WEAPON_KNIFE;
                    } else if (player.weapon != player.pendingWeapon) {
                        player.weapon = player.pendingWeapon;
                    }
                    player.attackFrame = player.weaponFrame = 0;
                    return;
                case 4:
                    if (!player.ammo[Wolf.AMMO_BULLETS]) {
                        break;
                    }
                    if (reAttack) {
                        player.attackFrame -= 2;
                    }
                case 1:
                    if (!player.ammo[Wolf.AMMO_BULLETS]) { // can only happen with chain gun
                        player.attackFrame++;
                        break;
                    }
                    Wolf.Weapon.fireLead(game, player);
                    player.ammo[Wolf.AMMO_BULLETS]--;
                    break;
                case 2:
                    Wolf.Weapon.fireHit(game, player);
                    break;
                case 3:
                    if (player.ammo[Wolf.AMMO_BULLETS] && reAttack) {
                        player.attackFrame -= 2;
                    }
                    break;
            }

            player.attackCount += cur.tics;
            player.attackFrame++;
            player.weaponFrame = attackinfo[player.weapon][player.attackFrame].frame;
        }

    }

    /**
     * @description Award points to the player
     * @memberOf Wolf.Player
     * @param {object} player The player object.
     * @param {number} points The number of points.
     */
    function givePoints(player, points) {
        player.score += points;
        while (player.score >= player.nextExtra) {
            player.nextExtra += Wolf.EXTRAPOINTS;
            giveLife(player);
            Wolf.log("Extra life!");
        }
    }
    
    /*
    -----------------------------------------------------------------------------
     Returns: returns true if player needs this health.
     
     Notes: 
        gives player some HP
        max can be:
         0 - natural player's health limit (100 or 150 with augment)
        >0 - indicates the limit
    -----------------------------------------------------------------------------
    */
    function giveHealth(player, points, max) {
        if (max == 0) {
            max = (player.items & Wolf.ITEM_AUGMENT) ? 150 : 100;
        }

        if (player.health >= max) {
            return false; // doesn't need this health
        }

        player.health += points;

        if (player.health > max) {
            player.health = max;
        }

        player.faceGotGun = false;
        
        return true; // took it
    }

    function giveLife(player) {
        if (player.lives < 9) {
            player.lives++;
        }
    }

    
    function giveKey(player, key) {
        player.items |= Wolf.ITEM_KEY_1 << key;
    }


    function giveWeapon(player, weapon) {
        var itemflag;

        giveAmmo(player, Wolf.AMMO_BULLETS, 6); // give some ammo with a weapon

        itemflag = Wolf.ITEM_WEAPON_1 << weapon;
        if (player.items & itemflag) {
            return; // player owns this weapon
        } else {
            player.items |= itemflag;
            
            // don't switch if already using better weapon
            if (player.weapon < weapon ) {
                player.weapon = player.pendingWeapon = weapon;
            }
        }
    }


    
    function giveAmmo(player, type, ammo) {
        var maxAmmo = 99;

        if (player.items & Wolf.ITEM_BACKPACK) {
            maxAmmo *= 2;
        }

        if (player.ammo[type] >= maxAmmo) {
            return false; // don't need
        }

        if (!player.ammo[type] && !player.attackFrame) {
            // knife was out
            player.weapon = player.pendingWeapon;
        }

        player.ammo[type] += ammo;
        if (player.ammo[type] > maxAmmo) {
            player.ammo[type] = maxAmmo;
        }

        return true;
    }
    
    
    /**
     * @description Award points to the player
     * @memberOf Wolf.Player
     * @param {object} player The player object.
     * @param {object} attacker The attacker actor object.
     * @param {number} points The number of damage points.
     * @param {number} skill The difficulty level.
     */
    function damage(player, attacker, points, skill) {
        var dx, dy,
            angle, playerAngle, deltaAngle;
        
        if (player.playstate == Wolf.ex_dead || player.playstate == Wolf.ex_complete || self.playstate == Wolf.ex_victory) {
            return;
        }

        player.lastAttacker = attacker;

        if (skill == Wolf.gd_baby) {
            points >>= 2;
        }

        // note the direction of the last hit for the directional blends
            dx = attacker.x - player.position.x;
            dy = attacker.y - player.position.y;
        
        // probably won't ever have damage from self, but check anyway
        if (dx != 0 || dy != 0) {
            angle = Math.atan2(dy, dx);
            playerAngle = player.angle * 360.0 / Wolf.ANG_360;

            angle = angle * 180.0 / Math.PI;
            
            if (angle < 0) {
                angle = 360 + angle;
            }
            
            deltaAngle = angle - playerAngle;
            
            if (deltaAngle > 180) {
                deltaAngle = deltaAngle - 360;
            }
            if (deltaAngle < -180) {
                deltaAngle = 360 + deltaAngle;
            }
            if (deltaAngle > 40) {
                player.attackDirection[0] = 1;
            } else if (deltaAngle < -40) {
                player.attackDirection[1] = 1;
            }
        }
        // do everything else but subtract health in god mode, to ease
        // testing of damage feedback
        if (!(player.flags & Wolf.FL_GODMODE) ) {
            player.health -= points;
        }
        
        if (player.health <= 0) {
            // dead
            Wolf.Game.notify("You have died");
            player.health = 0;
            player.playstate = Wolf.ex_dead;
            Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_BODY, "lsfx/009.wav", 1, Wolf.ATTN_NORM, 0);
        }

        // red screen flash
        Wolf.Game.startDamageFlash(points);

        // stop the happy grin face if shot before it times out
        player.faceGotGun = false;

        // make BJ's eyes bulge on huge hits
        if (points > 30 && player.health != 0) {
            player.faceOuch = true;
            player.faceCount = 0;
        }
    }

    function victorySpin(game, player, tics) {
        var desty;

        if (player.angle > Wolf.ANG_270) {
            player.angle -= tics * Wolf.ANG_1 * 3;
            if (player.angle < Wolf.ANG_270) {
                player.angle = Wolf.ANG_270;
            }
        } else if (player.angle < Wolf.ANG_270) {
            player.angle += tics * Wolf.ANG_1 * 3;
            if (player.angle > Wolf.ANG_270) {
                player.angle = Wolf.ANG_270;
            }
        }

        //desty = ((player.tile.y-5) << Wolf.TILESHIFT) - 0x3000;
        desty = Wolf.TILE2POS(player.tile.y+7)

        if (player.position.y < desty) {
            player.position.y += tics * 3072;
            if (player.position.y > desty) {
                player.position.y = desty;
            }
        }
    }
    
    /**
     * @description Process player actions
     * @memberOf Wolf.Player
     * @param {object} self The player object.
     * @param {object} game The game object.
     * @param {number} tics Tics since last processing.
     */
    function process(game, self, tics) {
        var level = game.level,
            n;
        
        
        if (self.playstate == Wolf.ex_victory) {
            victorySpin(game, self, tics);
            return;
        }
        
        self.attackDirection = [0,0];
        self.madenoise = false;

        controlMovement(game, self, level, tics);

        if (self.flags & Wolf.PL_FLAG_ATTCK) {
            attack(game, self, self.cmd.buttons & Wolf.BUTTON_ATTACK, tics);
        } else {
            if (self.cmd.buttons & Wolf.BUTTON_USE) {
                if (!(self.flags & Wolf.PL_FLAG_REUSE) && use(self, game)) {
                    self.flags |= Wolf.PL_FLAG_REUSE;
                }
            } else {
                self.flags &= ~Wolf.PL_FLAG_REUSE;
            }
            if (self.cmd.buttons & Wolf.BUTTON_ATTACK) {
                self.flags |= Wolf.PL_FLAG_ATTCK;

                self.attackFrame = 0;
                self.attackCount = attackinfo[self.weapon][0].tics;
                self.weaponFrame = attackinfo[self.weapon][0].frame;
            }
        }

        // process impulses
        switch (self.cmd.impulse) {
            case 0:
                break; // no impulse
                
            case 1:
            case 2:
            case 3:
            case 4:
                changeWeapon(self, self.cmd.impulse - 1);
                break;
                
            case 10: // next weapon /like in Quake/ FIXME: weapprev, weapnext
                self.pendingWeapon = self.weapon;
                for (n = 0; n < 4; ++n) {
                    if (++self.weapon > Wolf.WEAPON_CHAIN)  {
                        self.weapon = Wolf.WEAPON_KNIFE;
                    }
                    if (changeWeapon(self, self.weapon)) {
                        break;
                    }
                }
                self.weapon = self.pendingWeapon;
                break;

            default:
                Wolf.log("Unknown Impulse: ", + self.cmd.impulse);
                break;
        }
    }
    
    return {
        spawn : spawn,
        newGame : newGame,
        controlMovement : controlMovement,
        process : process,
        damage : damage,
        givePoints : givePoints,
        giveHealth : giveHealth,
        giveAmmo : giveAmmo,
        giveWeapon : giveWeapon,
        giveLife : giveLife,
        giveKey : giveKey
    };

})();
