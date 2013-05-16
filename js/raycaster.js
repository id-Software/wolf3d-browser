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

Wolf.setConsts({
    UPPERZCOORD         :  0.6,
    LOWERZCOORD         : -0.6,

    // marks
    TRACE_MARK_MAP      : 1,	// marks traced area in 'AM_AutoMap.vis' array
    // obstacle levels
    TRACE_SIGHT         : 2,	// player sight
    TRACE_SIGHT_AI      : 4,	// enemy sight
    TRACE_BULLET        : 8,	// bullet
    TRACE_OBJECT        : 16,	// object

    TRACE_HIT_VERT      : 32,	// vertical wall was hit
    TRACE_HIT_DOOR      : 64,	// door was hit
    TRACE_HIT_PWALL     : 128	// pushwall was hit
});

Wolf.Raycaster = (function() {

    var x_tile_step = [ 1, -1, -1,  1 ],
        y_tile_step = [ 1,  1, -1, -1 ];
        
    var TILESHIFT = Wolf.TILESHIFT,
        TRACE_HIT_VERT = Wolf.TRACE_HIT_VERT,
        TILEGLOBAL = Wolf.TILEGLOBAL,
        WALL_TILE = Wolf.WALL_TILE,
        DOOR_TILE = Wolf.DOOR_TILE,
        TILE2POS = Wolf.TILE2POS,
        POS2TILE = Wolf.POS2TILE,
        FINE2RAD = Wolf.FINE2RAD,
        TRACE_HIT_DOOR = Wolf.TRACE_HIT_DOOR,
        PUSHWALL_TILE = Wolf.PUSHWALL_TILE,
        TRACE_HIT_PWALL = Wolf.TRACE_HIT_PWALL,
        DOOR_FULLOPEN = Wolf.DOOR_FULLOPEN,
        XnextTable = Wolf.Math.XnextTable,
        YnextTable = Wolf.Math.YnextTable,
        getQuadrant = Wolf.Math.getQuadrant,
        TanTable = Wolf.Math.TanTable;

    function traceCheck(tileMap, doorMap, visibleTiles, x, y, frac, dfrac, vert, flip, tracePoint) {
        var door;
        
        if (tileMap[x][y] & WALL_TILE) {
            if (vert) {
                tracePoint.x = (x << TILESHIFT) + (flip ? TILEGLOBAL : 0);
                tracePoint.y = (y << TILESHIFT) + frac;
                tracePoint.flags |= TRACE_HIT_VERT;
            } else {
                tracePoint.x = (x << TILESHIFT) + frac;
                tracePoint.y = (y << TILESHIFT) + (flip ? TILEGLOBAL : 0);
                tracePoint.flags &= ~TRACE_HIT_VERT;
            }
            tracePoint.tileX = x;
            tracePoint.tileY = y;
            tracePoint.frac = frac / TILEGLOBAL;
           
            return true; // wall, stop tracing
        }
        
        if (visibleTiles) {
            visibleTiles[x][y] = true; // this tile is visible
        }

        if (tileMap[x][y] & DOOR_TILE && doorMap[x][y].action != Wolf.dr_open) {
            door = doorMap[x][y];
            
            frac += dfrac >> 1;
            
            if (POS2TILE(frac)) {
                return false;
            }

            if (vert) {
                if (door.action != Wolf.dr_closed && (frac >> 10) > DOOR_FULLOPEN - Wolf.Doors.opened(door)) {
                    return false; // opened enough
                }
                tracePoint.x = TILE2POS(x);
                tracePoint.y = (y << TILESHIFT) + frac;
                tracePoint.flags |= TRACE_HIT_VERT;
                tracePoint.frac = frac / TILEGLOBAL;
            } else {
                if (door.action != Wolf.dr_closed && (frac >> 10) < Wolf.Doors.opened(door)) {
                    return false; // opened enough
                }
                tracePoint.y = TILE2POS(y);
                tracePoint.x = (x << TILESHIFT) + frac;
                tracePoint.flags &= ~TRACE_HIT_VERT;
                tracePoint.frac = 1 - frac / TILEGLOBAL;
            }
            
            tracePoint.flags |= TRACE_HIT_DOOR;
            tracePoint.tileX = x;
            tracePoint.tileY = y;
            tracePoint.frac += Wolf.Doors.opened(door) / DOOR_FULLOPEN;
            return true; // closed door, stop tracing
        }
        
        
        if (tileMap[x][y] & PUSHWALL_TILE) {
            
            var pwall = Wolf.PushWall.get(),
                offset = pwall.pointsMoved / 128;

            frac += dfrac * offset;
            
            if (POS2TILE(frac)) {
                return false;
            }
            
            if (vert) {
                tracePoint.x = (x << TILESHIFT) + (flip ? TILEGLOBAL : 0) + offset * TILEGLOBAL * (flip ? -1 : 1);
                tracePoint.y = (y << TILESHIFT) + frac;
                tracePoint.flags |= TRACE_HIT_VERT;
            } else {
                tracePoint.x = (x << TILESHIFT) + frac;
                tracePoint.y = (y << TILESHIFT) + (flip ? TILEGLOBAL : 0) + offset * TILEGLOBAL * (flip ? -1 : 1);
                tracePoint.flags &= ~TRACE_HIT_VERT;
            }
            
            tracePoint.flags |= TRACE_HIT_PWALL;
            tracePoint.tileX = x;
            tracePoint.tileY = y;
            tracePoint.frac = frac / TILEGLOBAL;
            return true;
        }

        return false; // no intersection, go on!
    }
    
    function trace(level, visibleTiles, tracePoint) {
        var xtilestep, ytilestep,
            xstep, ystep,
            xtile, ytile,
            xintercept, yintercept,
            YmapPos, XmapPos,
            tileMap = level.tileMap,
            doorMap = level.state.doorMap,
            q;

        // Setup for ray casting
        q = getQuadrant(FINE2RAD(tracePoint.angle));

        xtilestep = x_tile_step[q];
        ytilestep = y_tile_step[q];

        xtile = POS2TILE(tracePoint.x) + xtilestep;
        ytile = POS2TILE(tracePoint.y) + ytilestep;

        xstep = ytilestep * XnextTable[tracePoint.angle];
        ystep = xtilestep * YnextTable[tracePoint.angle];

        xintercept = (((((ytilestep == -1 ? ytile+1 : ytile) << TILESHIFT) - tracePoint.y) 
                    / TanTable[tracePoint.angle])>>0) + tracePoint.x;
        yintercept = (((((xtilestep == -1 ? xtile+1 : xtile) << TILESHIFT) - tracePoint.x) 
                    * TanTable[tracePoint.angle])>>0) + tracePoint.y;

        YmapPos = yintercept >> TILESHIFT; // toXray
        XmapPos = xintercept >> TILESHIFT; // toYray

        if (visibleTiles) {
            // this tile is visible
            visibleTiles[POS2TILE(tracePoint.x)][POS2TILE(tracePoint.y)] = true; 
        }
        
        var traceCount = 0;

        // Start of ray-casting
        while (1) {

            traceCount++;
            
            // Vertical loop // an analogue for X-Ray
            while (!(ytilestep == -1 && YmapPos <= ytile) && !(ytilestep == 1 && YmapPos >= ytile)) {

                if (xtile < 0 || xtile >= 64 || YmapPos < 0 || YmapPos >= 64) {
                    tracePoint.oob = true;
                    return;
                }

                if (traceCheck(tileMap, doorMap, visibleTiles, xtile, YmapPos, yintercept % TILEGLOBAL, ystep, true, (xtilestep == -1), tracePoint)) {
                    if (xstep < 0) {
                        tracePoint.frac = 1 - tracePoint.frac;
                    }
                    return;
                }

                // prepare for next step
                xtile += xtilestep;
                yintercept += ystep;
                YmapPos = yintercept >> TILESHIFT;
            }

            // Horizontal loop // an analogue for Y-Ray
            while (!(xtilestep == -1 && XmapPos <= xtile) && !(xtilestep == 1 && XmapPos >= xtile)) {

                if (ytile < 0 || ytile >= 64 || XmapPos < 0 || XmapPos >= 64) {
                    tracePoint.oob = true;
                    return;
                }

                if (traceCheck(tileMap, doorMap, visibleTiles, XmapPos, ytile, xintercept % TILEGLOBAL, xstep, false, (ytilestep == -1), tracePoint)) {
                    if (ystep > 0) {
                        tracePoint.frac = 1 - tracePoint.frac;
                    }
                    return;
                }

                // prepare for next step
                ytile += ytilestep;
                xintercept += xstep;
                XmapPos = xintercept >> TILESHIFT;
            }
            
            if (traceCount > 1000) {
                return;
            }

        } // end of while( 1 )
        

    }
    

    function traceRays(viewport, level) {
        var n, i, j,
            tileMap = level.tileMap,
            tracePoint,
            visibleTiles = [],
            numRays = Wolf.XRES / Wolf.SLICE_WIDTH,
            tracers = [];
        
        for (i=0;i<64;i++) {
            visibleTiles[i] = [];
            for (j=0;j<64;j++) {
                visibleTiles[i][j] = 0;
            }
        }
        
        // Ray casting
        
        for (n = 0 ; n < numRays ; ++n) {
            
            tracePoint = {
                x : viewport.x,
                y : viewport.y,
                angle : Wolf.Math.normalizeAngle(viewport.angle - Wolf.Math.ColumnAngle[n * Wolf.SLICE_WIDTH]),
                flags : Wolf.TRACE_SIGHT | Wolf.TRACE_MARK_MAP,
                oob : false
            };
            
            trace(level, visibleTiles, tracePoint);
            
            tracers[n] = tracePoint;
            
            // Ugly hack to get rid of "blank slice" glitch due to out-of-bounds raycasting.
            // We simply re-use the previous slice if possible.
            if (tracePoint.oob) {
                if (n > 0 && !tracers[n-1].oob) {
                    tracers[n] = tracers[n-1];
                }
            }
        }
        
        return {
            visibleTiles : visibleTiles,
            tracers : tracers
        };
    }
    
    
    return {
        traceRays : traceRays,
        trace : trace
    };
    
})();
