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
 * @description Artificial intelligence
 */
Wolf.ActorAI = (function() {

    var dsounds = [
        "sfx/025.wav",
        "sfx/026.wav",
        "sfx/086.wav",
        "sfx/088.wav",
        "sfx/105.wav",
        "sfx/107.wav",
        "sfx/109.wav"
    ]; 

    /**
     * @description Initiate death scream sound effect.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     * @param {object} game The game object.
     */
    function deathScream(self, game) {
        var pos = game.player.position;
        
        switch (self.type) {
            case Wolf.en_mutant:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/037.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_guard:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, dsounds[Wolf.Random.rnd() % 6], 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_officer:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/074.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_ss:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/046.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_dog:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/035.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_boss:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/019.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_schabbs:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/061.wav", 1, Wolf.ATTN_NORM, 0);            
                break;

            case Wolf.en_fake:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/069.wav", 1, Wolf.ATTN_NORM, 0);            
                break;

            case Wolf.en_mecha:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/084.wav", 1, Wolf.ATTN_NORM, 0);            
                break;

            case Wolf.en_hitler:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/044.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_gretel:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/115.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.en_gift:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/091.wav", 1, Wolf.ATTN_NORM, 0);            
                break;

            case Wolf.en_fat:
                Wolf.Sound.startSound(pos, self, 1, Wolf.CHAN_VOICE, "sfx/119.wav", 1, Wolf.ATTN_NORM, 0);
                break;
        }
    }

    /* Hitler */
    
    /**
     * @description Play Mecha sound.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     * @param {object} game The game object.
     */
    function mechaSound(self, game) {
        if (game.level.state.areabyplayer[self.areanumber]) {
            Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/080.wav", 1, Wolf.ATTN_NORM, 0);
        }
    }

    
    /**
     * @description Play Slurpie sound.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     */
    function slurpie(self, game) {
        Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "lsfx/061.wav", 1, Wolf.ATTN_NORM, 0);
    }


    /**
     * @description Spawn new actor, when Mecha Hitler is dead.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     * @param {object} game The game object.
     */
    function hitlerMorph(self, game) {
        var hitpoints = [500, 700, 800, 900],
            level = game.level,
            hitler;

        hitler = Wolf.Actors.getNewActor(level);
        if(!hitler) {
            return;
        }

        hitler.x = self.x;
        hitler.y = self.y;
        hitler.distance = self.distance;
        hitler.tile.x = self.tile.x;
        hitler.tile.y = self.tile.y;
        hitler.angle = self.angle;
        hitler.dir = self.dir;
        hitler.health = hitpoints[game.skill];
        hitler.areanumber = self.areanumber;
        hitler.state = Wolf.st_chase1;
        hitler.type = Wolf.en_hitler;
        hitler.speed = Wolf.SPDPATROL * 5;
        hitler.ticcount = 0;
        hitler.flags = self.flags | Wolf.FL_SHOOTABLE;
        hitler.sprite = Wolf.Sprites.getNewSprite(level);

    }
    
    /* Angel of Death */
    
    var angel_temp = 0;

    /**
     * @description Play Angel of Death Breathing sound.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     */
    function breathing(self) {
        Wolf.Sound.startSound(null, null, 1, Wolf.CHAN_VOICE, "lsfx/080.wav", 1, Wolf.ATTN_NORM, 0);
    }

    
    /**
     * @description Reset Angel of Death attack counter
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     */
    function startAttack(self) {
        angel_temp = 0;
    }
    

    /**
     * @description Angel of Death AI.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     */
    function relaunch(self) {
        if (++angel_temp == 3) {
            Wolf.Actors.stateChange(self, Wolf.st_pain);
            return;
        }

        if (Wolf.Random.rnd() & 1) {
            Wolf.Actors.stateChange(self, Wolf.st_chase1);
            return;
        }
    }

    /**
     * @description Victory - start intermission.
     * @memberOf Wolf.ActorAI
     */
    function victory(game) {
        Wolf.Game.startIntermission(game);
    }

    
    /**
     * @description Entity is dormant state. 
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     * @param {object} game The game object.
     */
    function dormant(self, game) {
        var level = game.level,
            player = game.player,
            deltax, 
            deltay,
            xl, xh, yl, yh, 
            x, y, n,
            moveok = false;

        deltax = self.x - player.position.x;
        deltay = self.y - player.position.y;
        
        if (deltax < -Wolf.MINACTORDIST || deltax > Wolf.MINACTORDIST) {
            moveok = true;
        } else if(deltay < -Wolf.MINACTORDIST || deltay > Wolf.MINACTORDIST) {
            moveok = true;
        }
        
        if (!moveok) {
            return;
        }

        // moveok:
        xl = (self.x - Wolf.MINDIST) >> Wolf.TILESHIFT;
        xh = (self.x + Wolf.MINDIST) >> Wolf.TILESHIFT;
        yl = (self.y - Wolf.MINDIST) >> Wolf.TILESHIFT;
        yh = (self.y + Wolf.MINDIST) >> Wolf.TILESHIFT;

        for(y = yl; y <= yh ; ++y ) {
            for(x = xl;x <= xh;++x) {
                if (level.tileMap[x][y] & Wolf.SOLID_TILE) {
                    return;
                }
                for (n=0;n<level.state.numGuards;++n) {
                    if (level.state.guards[n].state >= Wolf.st_die1) {
                        continue;
                    }
                    if (level.state.guards[n].tile.x == x && level.state.guards[n].tile.y == y) {
                        return; // another guard in path
                    }
                }
            }
        }

        self.flags |= Wolf.FL_AMBUSH | Wolf.FL_SHOOTABLE;
        self.flags &= ~Wolf.FL_ATTACKMODE;
        self.dir = Wolf.Math.dir8_nodir;
        Wolf.Actors.stateChange(self, Wolf.st_path1);
    }


    /**
     * @description Death cam animation.
     *              Tthe DeathCam feature isn't implimented, but we want to 
     *              give the animation time to play before declaring victory.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     * @param {object} game The game object.
     */
    function startDeathCam(game, self) {
        self.playstate = Wolf.ex_complete;
        setTimeout(function() {
            Wolf.Game.startIntermission(game);
        }, 5000);
    }
    

    /**
     * @description Rockets emmit smoke.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     * @param {object} level The level object.
     */
    function smoke(self, game) {
        var level = game.level,
            smokeEnt = Wolf.Actors.getNewActor(level);
        
        if (!smokeEnt) {
            return;
        }

        smokeEnt.x = self.x;
        smokeEnt.y = self.y;
        smokeEnt.tile.x = self.tile.x;
        smokeEnt.tile.y = self.tile.y;
        smokeEnt.state = Wolf.st_die1;
        smokeEnt.type = (self.type == Wolf.en_hrocket) ? Wolf.en_hsmoke : Wolf.en_smoke;
        smokeEnt.ticcount = 6;
        smokeEnt.flags = Wolf.FL_NEVERMARK;
        smokeEnt.sprite = Wolf.Sprites.getNewSprite(level);
    }

    

    /**
     * @description Puts an actor into attack mode and possibly reverses the direction if the player is behind it.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     */
    function firstSighting(self, game) {
        switch (self.type) {
            case Wolf.en_guard:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/001.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 3;    // go faster when chasing player
                break;

            case Wolf.en_officer:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/071.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 5;    // go faster when chasing player
                break;

            case Wolf.en_mutant:
                self.speed *= 3;    // go faster when chasing player
                break;

            case Wolf.en_ss:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/015.wav", 1, Wolf.ATTN_NORM, 0);    
                self.speed *= 4;            // go faster when chasing player
                break;

            case Wolf.en_dog:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/002.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 2;            // go faster when chasing player
                break;

            case Wolf.en_boss:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/017.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed = Wolf.SPDPATROL * 3;    // go faster when chasing player
                break;

            case Wolf.en_gretel:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/112.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 3;            // go faster when chasing player
                break;

            case Wolf.en_gift:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/096.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 3;            // go faster when chasing player
                break;

            case Wolf.en_fat:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/102.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 3;            // go faster when chasing player
                break;

            case Wolf.en_schabbs:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/065.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 3;            // go faster when chasing player
                break;

            case Wolf.en_fake:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/054.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 3;            // go faster when chasing player
                break;

            case Wolf.en_mecha:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/040.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 3;            // go faster when chasing player
                break;

            case Wolf.en_hitler:
                Wolf.Sound.startSound(game.player.position, self, 1, Wolf.CHAN_VOICE, "sfx/040.wav", 1, Wolf.ATTN_NORM, 0);
                self.speed *= 5;            // go faster when chasing player
                break;

            case Wolf.en_blinky:
            case Wolf.en_clyde:
            case Wolf.en_pinky:
            case Wolf.en_inky:
                self.speed *= 2;            // go faster when chasing player
                break;

            default:
                return;
        }

        Wolf.Actors.stateChange(self, Wolf.st_chase1);
        
        if (self.waitfordoorx) {
            self.waitfordoorx = self.waitfordoory = 0;    // ignore the door opening command
        }

        self.dir = Wolf.Math.dir8_nodir;
        self.flags |= Wolf.FL_ATTACKMODE | Wolf.FL_FIRSTATTACK;
    }


    /**
     * @description Called when the player succesfully hits an enemy.
     *              Does damage points to enemy ob, either putting it into a stun frame or killing it.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     * @param {object} game The game object.
     * @param {object} player The player object.
     * @param {number} damage The number of damage points.
     */
    function damageActor(self, game, player, damage) {
        player.madenoise = 1;

        // do double damage if shooting a non attack mode actor
        if (!(self.flags & Wolf.FL_ATTACKMODE)) {
            damage <<= 1;
        }

        self.health -= damage;

        if (self.health <= 0) {
            killActor(self, game, player);
        } else {
            if (!(self.flags & Wolf.FL_ATTACKMODE) ) {
                firstSighting(self, game); // put into combat mode
            }
            switch (self.type) { // dogs only have one hit point
                case Wolf.en_guard:
                case Wolf.en_officer:
                case Wolf.en_mutant:
                case Wolf.en_ss:
                    if (self.health & 1) {
                        Wolf.Actors.stateChange(self, Wolf.st_pain);
                    } else {
                        Wolf.Actors.stateChange(self, Wolf.st_pain1);
                    }
                    break;
            }
        }
    }
    
    
    /**
     * @description Actor has been killed, so give points and spawn powerups.
     * @memberOf Wolf.ActorAI
     * @param {object} self The enemy actor object.
     * @param {object} game The game object.
     * @param {object} player The player object.
     */
    function killActor(self, game, player) {
        var level = game.level,
            tilex = self.tile.x = self.x >> Wolf.TILESHIFT; // drop item on center, 
            tiley = self.tile.y = self.y >> Wolf.TILESHIFT;

        switch (self.type) {
            case Wolf.en_guard:
                Wolf.Player.givePoints(player, 100);
                Wolf.Powerups.spawn(level, tilex, tiley, Wolf.pow_clip2);
                break;

            case Wolf.en_officer:
                Wolf.Player.givePoints(player, 400);
                Wolf.Powerups.spawn(level, tilex, tiley, Wolf.pow_clip2);
                break;

            case Wolf.en_mutant:
                Wolf.Player.givePoints(player, 700);
                Wolf.Powerups.spawn(level, tilex, tiley, Wolf.pow_clip2);
                break;

            case Wolf.en_ss:
                Wolf.Player.givePoints(player, 500);
                if (player.items & Wolf.ITEM_WEAPON_3) { // have a schmeiser?
                    Wolf.Powerups.spawn(level, tilex, tiley, Wolf.pow_clip2);
                } else {
                    Wolf.Powerups.spawn(level, tilex, tiley, Wolf.pow_machinegun);
                }
                break;

            case Wolf.en_dog:
                Wolf.Player.givePoints(player, 200);
                break;

            case Wolf.en_boss:
                Wolf.Player.givePoints(player, 5000);
                Wolf.Powerups.spawn(level, tilex, tiley, Wolf.pow_key1);
                break;

            case Wolf.en_gretel:
                Wolf.Player.givePoints(player, 5000);
                Wolf.Powerups.spawn(level, tilex, tiley, Wolf.pow_key1);
                break;

            case Wolf.en_gift:
                Wolf.Player.givePoints(player, 5000);
                startDeathCam(game, self);
                break;

            case Wolf.en_fat:
                Wolf.Player.givePoints(player, 5000);
                startDeathCam(game, self);
                break;

            case Wolf.en_schabbs:
                Wolf.Player.givePoints(player, 5000);
                deathScream(self, game);
                startDeathCam(game, self);
                break;

            case Wolf.en_fake:
                Wolf.Player.givePoints(player, 2000);
                break;

            case Wolf.en_mecha:
                Wolf.Player.givePoints(player, 5000);
                break;

            case Wolf.en_hitler:
                Wolf.Player.givePoints(player, 5000);
                deathScream(self, game);
                startDeathCam(game, self);
                break;

        }

        Wolf.Actors.stateChange(self, Wolf.st_die1);
        
        if (++level.state.killedMonsters == level.state.totalMonsters) {
            Wolf.Game.notify("You killed the last enemy!");
        }
        
        self.flags &= ~Wolf.FL_SHOOTABLE;
        self.flags |= Wolf.FL_NONMARK;
    }
    
    return {
        firstSighting : firstSighting,
        damageActor : damageActor,
        killActor : killActor,
        deathScream : deathScream,
        mechaSound : mechaSound,
        slurpie : slurpie,
        hitlerMorph : hitlerMorph,
        breathing : breathing,
        startAttack : startAttack,
        relaunch : relaunch,
        victory : victory,
        dormant : dormant,
        startDeathCam : startDeathCam,
        smoke : smoke
    };

})();