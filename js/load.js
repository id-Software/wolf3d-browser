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


(function($) {

// these files are preloaded while the title screen is showing
var files = [
	"js/requestanimframe.js",

    "js/wolf.js",
    "js/random.js",
    "js/angle.js",
    "js/math.js",
    "js/input.js",
    "js/sound.js",
    "js/menu.js",
    "js/file.js",
    "js/game.js",
    "js/player.js",
    "js/sprites.js",
    "js/powerups.js",
    "js/ai.js",
    "js/actorai.js",
    "js/actors.js",
    "js/actstat.js",
    "js/weapon.js",
    "js/doors.js",
    "js/pushwall.js",
    "js/areas.js",
    "js/level.js",
    "js/raycaster.js",
    "js/renderer.js",
   
    "js/episodes.js",
    "js/maps.js",

    "preload!art/menubg_main.png",
    "preload!art/menuitems.png",
    "preload!art/menuselector.png"

];

// these files are preloaded in the background after the menu is displayed.
// only non-essential files here
var files2 = [
    "preload!art/menubg_episodes.png",
    "preload!art/menuitems_episodes.png",
    "preload!art/menubg_skill.png",
    "preload!art/menubg_levels.png",
    "preload!art/menuitems_levels.png",
    "preload!art/skillfaces.png",
    "preload!art/getpsyched.png",
    "preload!art/menubg_control.png",
    "preload!art/menulight.png",
    "preload!art/menubg_customize.png",
    "preload!art/control_keys.png",
    "preload!art/confirm_newgame.png",
    "preload!art/paused.png"
];

$(document).ready(function() {
  
    var progress = $("<div>"),
        n = 0;

    progress.addClass("load-progress").appendTo("#title-screen");
    $("#title-screen").show();
    
    
    yepnope.addPrefix("preload", function(resource) {
        resource.noexec = true;
        resource.instead = function(input, callback) {
            var image = new Image();
            image.onload = callback;
            image.onerror = callback;
            image.src = input.substr(input.lastIndexOf("!")+1);
        };
        return resource;
    });

    
    Modernizr.load([
        {
            load : files,
            callback : function(file) {
                progress.width((++n / files.length) * 100 + "%");
            },
            complete : function() {
                progress.remove();
                $("#title-screen").fadeOut(1500, function() {
                    Wolf.Input.init();
                    Wolf.Game.init();
                    Wolf.Menu.show();
                });
                // preload non-essential art
                Modernizr.load(files2);
            }
        }
    ]);
});

})(jQuery);