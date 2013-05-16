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


Wolf.Powerups = (function() {

    Wolf.setConsts({
        pow_gibs        : 0,    //  1% if <=10%; SLURPIESND
        pow_gibs2       : 1,    //  1% if <=10%; SLURPIESND
        pow_alpo        : 2,    //  4% if <100%; HEALTH1SND
        pow_firstaid    : 3,    // 25% if <100%; HEALTH2SND
        pow_key1        : 4,    // gold key;		GETKEYSND
        pow_key2        : 5,    // silver key;	GETKEYSND
        pow_key3        : 6,    // not used
        pow_key4        : 7,    // not used
        pow_cross       : 8,    //  100pts; BONUS1SND
        pow_chalice     : 9,    //  500pts; BONUS2SND
        pow_bible       : 10,   // 1000pts; BONUS3SND
        pow_crown       : 11,   // 5000pts; BONUS4SND
        pow_clip        : 12,   // 8bul if <99bul; GETAMMOSND
        pow_clip2       : 13,   // 4bul if <99bul; GETAMMOSND
        pow_machinegun  : 14,   // machine gun; GETMACHINESND
        pow_chaingun    : 15,   // gatling gun; GETGATLINGSND
        pow_food        : 16,   // 10% if <100%; HEALTH1SND
        pow_fullheal    : 17,   // 99%, 25bul; BONUS1UPSND
        pow_25clip      : 18,   // 25bul if <99bul; GETAMMOBOXSND
        pow_spear       : 19,   // spear of destiny!
        pow_last        : 20
        // add new types <!only!> here (after last)
    });

    var texture = [
        Wolf.SPR_STAT_34,	// pow_gibs
        Wolf.SPR_STAT_38,	// pow_gibs2
        Wolf.SPR_STAT_6,		// pow_alpo
        Wolf.SPR_STAT_25,	// pow_firstaid
        Wolf.SPR_STAT_20,	// pow_key1
        Wolf.SPR_STAT_21,	// pow_key2
        // not used
        Wolf.SPR_STAT_20,	// pow_key3
        Wolf.SPR_STAT_20,	// pow_key4

        Wolf.SPR_STAT_29,	// pow_cross
        Wolf.SPR_STAT_30,	// pow_chalice
        Wolf.SPR_STAT_31,	// pow_bible
        Wolf.SPR_STAT_32,	// pow_crown
        Wolf.SPR_STAT_26,	// pow_clip
        Wolf.SPR_STAT_26,	// pow_clip2
        Wolf.SPR_STAT_27,	// pow_machinegun
        Wolf.SPR_STAT_28,	// pow_chaingun
        Wolf.SPR_STAT_24,	// pow_food
        Wolf.SPR_STAT_33,	// pow_fullheal
        // spear
        Wolf.SPR_STAT_49,	// pow_25clip
        Wolf.SPR_STAT_51	// pow_spear
    ];
    

    function remove(level, powerup) {
        powerup.x = -1;
        powerup.y = -1;
    }
    
    function addNew(level) {
        /*
        for (var i = 0;i < level.state.numPowerups; i++ ) {
            if (level.state.powerups[i].x == -1 ) {
                return level.state.powerups[i];
            }
        }
        */
        /*
        if (level.state.numPowerups == Wolf.MAX_POWERUPS ) {
            return level.state.powerups[0];
        }
        */
        level.state.numPowerups++;
        
        var newp = {
            x : -1,
            y : -1,
            type : 0,
            sprite : null
        };
        
        level.state.powerups[level.state.numPowerups-1] = newp;
        
        return newp;
    }

    function reset(level) {
        level.state.numPowerups = 0;
        level.state.powerups = [];
    }
    
    // x,y are in TILES.
    function spawn(level, x, y, type) {
        var newp = addNew(level);

        newp.sprite = Wolf.Sprites.getNewSprite(level);
        newp.type = type;
       
        Wolf.Sprites.setPos(level, newp.sprite, Wolf.TILE2POS(newp.x = x), Wolf.TILE2POS(newp.y = y), 0);

        Wolf.Sprites.setTex(level, newp.sprite, -1, texture[type]);
        
        level.tileMap[x][y] |= Wolf.POWERUP_TILE;
        // good place to update total treasure count!
    }
    
    
    function give(level, player, type) {
        var keynames = ["Gold", "Silver", "?", "?"];

        switch (type) {
            // Keys
            case Wolf.pow_key1:
            case Wolf.pow_key2:
            case Wolf.pow_key3:
            case Wolf.pow_key4:
                type -= Wolf.pow_key1;
                Wolf.Player.giveKey(player, type);
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/012.wav", 1, Wolf.ATTN_NORM, 0);
                Wolf.Game.notify(keynames[type] + " key");
                break;
            // Treasure
            case Wolf.pow_cross:
                Wolf.Player.givePoints(player, 100);
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/035.wav", 1, Wolf.ATTN_NORM, 0);
                if ( ++level.state.foundTreasure == level.state.totalTreasure ) {
                    Wolf.Game.notify("You found the last treasure!");
                }
                break;

            case Wolf.pow_chalice:
                Wolf.Player.givePoints(player, 500);
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/036.wav", 1, Wolf.ATTN_NORM, 0);
                if (++level.state.foundTreasure == level.state.totalTreasure) {
                    Wolf.Game.notify("You found the last treasure!");
                }
                break;

            case Wolf.pow_bible:
                Wolf.Player.givePoints(player, 1000);
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/037.wav", 1, Wolf.ATTN_NORM, 0);
                if (++level.state.foundTreasure == level.state.totalTreasure) {
                    Wolf.Game.notify("You found the last treasure!");
                }
                break;

            case Wolf.pow_crown:
                Wolf.Player.givePoints(player, 5000);
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/045.wav", 1, Wolf.ATTN_NORM, 0);
                if (++level.state.foundTreasure == level.state.totalTreasure) {
                    Wolf.Game.notify("You found the last treasure!");
                }
                break;

            // Health
            case Wolf.pow_gibs:
                if (!Wolf.Player.giveHealth(player, 1, 11)) {
                    return false;
                }
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/061.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.pow_alpo:
                if (!Wolf.Player.giveHealth(player, 4, 0)) {
                    return false;
                }
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/033.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.pow_food:
                if (!Wolf.Player.giveHealth(player, 10, 0)) {
                    return false;
                }
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/033.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.pow_firstaid:
                if (!Wolf.Player.giveHealth(player, 25, 0)) {
                    return false;
                }
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/034.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            // Weapon & Ammo
            case Wolf.pow_clip:
                if (!Wolf.Player.giveAmmo(player, Wolf.AMMO_BULLETS, 8)) {
                    return false;
                }
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/031.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.pow_clip2:
                if (!Wolf.Player.giveAmmo(player, Wolf.AMMO_BULLETS, 4)) {
                    return false;
                }
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/031.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.pow_25clip:
                if (!Wolf.Player.giveAmmo(player, Wolf.AMMO_BULLETS, 25)) {
                    return false;
                }
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/031.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.pow_machinegun:
                Wolf.Player.giveWeapon(player, Wolf.WEAPON_AUTO );
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/030.wav", 1, Wolf.ATTN_NORM, 0);
                Wolf.Game.notify("Machinegun");
                break;

            case Wolf.pow_chaingun:
                Wolf.Player.giveWeapon(player, Wolf.WEAPON_CHAIN );
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/038.wav", 1, Wolf.ATTN_NORM, 0);
                Wolf.Game.notify("Chaingun");

                player.faceCount = -100;
                player.faceGotGun = true;
                break;

            // Artifacts
            case Wolf.pow_fullheal:
                // go to 150 health
                Wolf.Player.giveHealth(player, 99, 99 );
                Wolf.Player.giveAmmo(player, Wolf.AMMO_BULLETS, 25 );
                Wolf.Player.giveLife(player);
                if (++level.state.foundTreasure == level.state.totalTreasure) {
                    Wolf.Game.notify("You found the last treasure!");
                } else {
                    Wolf.Game.notify("Full Heal");
                }
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_ITEM, "lsfx/034.wav", 1, Wolf.ATTN_NORM, 0);
                Wolf.log("Extra life!");
                break;
                
            default:
                Wolf.log("Warning: Unknown item type: " + type);
                break;
        }

        Wolf.Game.startBonusFlash();
        
        return true;
    }

    // x,y are in TILES.
    function pickUp(level, player, x, y) {
        var i, pow,
            p_left = false, 
            p_pick = false;

        for (i=0; i<level.state.numPowerups; i++) {
            pow = level.state.powerups[i];
            if (pow.x == x && pow.y == y) {
                // got a powerup here
                if (give(level, player, pow.type)) { //FIXME script
                    // picked up this stuff, remove it!
                    p_pick = true;
                    Wolf.Sprites.remove(level, pow.sprite);
                    remove(level, pow);
                } else {
                    // player do not need it, so may be next time!
                    p_left = true;
                }
            }
        }

        if(p_left) {
            level.tileMap[x][y] |= Wolf.POWERUP_TILE;
        } else {
            level.tileMap[x][y] &= ~Wolf.POWERUP_TILE;
        }
    }
   
    
    return {
        spawn : spawn,
        reset : reset,
        pickUp : pickUp
    };
    
})();
