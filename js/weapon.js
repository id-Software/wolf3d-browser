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
 * @description Weapons
 */
Wolf.Weapon = (function() {


    function fireHit(game, player) {
        var level = game.level,
            closest,
            dist, 
            d1, 
            n, 
            shotDist, 
            damage,
            guard;

        Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_WEAPON, "lsfx/023.wav", 1, Wolf.ATTN_NORM, 0);

        // actually fire
        dist = 0x7fffffff;
        closest = null;

        for (n=0; n<level.state.numGuards; ++n) {
            guard = level.state.guards[n];
            if (guard.flags & Wolf.FL_SHOOTABLE) { // && Guards[n].flags&FL_VISABLE
                shotDist = Wolf.Math.point2LineDist(guard.x - player.position.x, guard.y - player.position.y, player.angle);
                
                if (shotDist > (2 * Wolf.TILEGLOBAL / 3)) {
                    continue; // miss
                }
                
                d1 = Wolf.Math.lineLen2Point(guard.x - player.position.x, guard.y - player.position.y, player.angle);
                
                if (d1 < 0 || d1 > dist) {
                    continue;
                }
               
                if (!Wolf.Level.checkLine(guard.x, guard.y, player.position.x, player.position.y, level)) {
                    continue; // obscured
                }
                dist = d1;
                closest = guard;
            }
        }

        if (!closest || dist > Wolf.TILE2POS(1)) {
            return; // missed if further than 1.5 tiles
        }

        damage = Wolf.Random.rnd() >> 4;

        Wolf.ActorAI.damageActor(closest, game, player, damage); // hit something
    }


    function fireLead(game, player) {
        var level = game.level,
            closest,
            damage,
            dx, dy, dist,
            d1, shotDist, n,
            guard;

        switch (player.weapon) {
            case Wolf.WEAPON_PISTOL:
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_WEAPON, "sfx/012.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.WEAPON_AUTO:
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_WEAPON, "sfx/011.wav", 1, Wolf.ATTN_NORM, 0);
                break;

            case Wolf.WEAPON_CHAIN:
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_WEAPON, "sfx/013.wav", 1, Wolf.ATTN_NORM, 0);
                break;
        }

        player.madenoise = true;

        dist = 0x7fffffff;
        closest = null;

        for (n=0;n < level.state.numGuards; ++n) {
            guard = level.state.guards[n];
            if (guard.flags & Wolf.FL_SHOOTABLE ) { // && Guards[n].flags&FL_VISABLE
                shotDist = Wolf.Math.point2LineDist(guard.x - player.position.x, guard.y - player.position.y, player.angle);
                if (shotDist > (2 * Wolf.TILEGLOBAL / 3)) {
                    continue; // miss
                }

                d1 = Wolf.Math.lineLen2Point(guard.x - player.position.x, guard.y - player.position.y, player.angle);
                if (d1 < 0 || d1 > dist) {
                    continue;
                }
                if (!Wolf.Level.checkLine(guard.x, guard.y, player.position.x, player.position.y, level)) {
                    continue; // obscured
                }

                dist = d1;
                closest = guard;
            }
        }

        if (!closest) { // missed
            var tracePoint = {
                angle : Wolf.Math.normalizeAngle(player.angle - Wolf.DEG2FINE(2) + (Math.random() * 0x10000) % (Wolf.DEG2FINE(4))),
                x : player.position.x,
                y : player.position.y,
                flags : Wolf.TRACE_BULLET
            }
            
            Wolf.Raycaster.trace(level, null, tracePoint);

            if (tracePoint.flags & Wolf.TRACE_HIT_DOOR) {
                Wolf.Sound.startSound(null, null, 0, Wolf.CHAN_AUTO, "lsfx/028.wav", 1, Wolf.ATTN_NORM, 0);
            }
            
            return;
        }

        // hit something
        dx = Math.abs(closest.tile.x - player.tile.x);
        dy = Math.abs(closest.tile.y - player.tile.y);
        dist = Math.max(dx, dy);

        if (dist < 2) {
            damage = Wolf.Random.rnd() / 4;
        } else if (dist < 4) {
            damage = Wolf.Random.rnd() / 6;
        } else {
            if (Wolf.Random.rnd() / 12 < dist) {
                return; // missed
            }
            damage = Wolf.Random.rnd() / 6;
        }

        Wolf.ActorAI.damageActor(closest, game, player, damage);
    }



    return {
        fireHit : fireHit,
        fireLead : fireLead
    };
    
    
})();