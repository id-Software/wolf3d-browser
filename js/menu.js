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
 * @description Game menu management
 */
Wolf.Menu = (function() {
    var setupDone = false,
        menuInputActive = false,
        activeIndex = 0,
        activeMouseItem = null,
        activeEpisode,
        messageBlink,
        activeMessage,
        activeSkill;
        
    var keySprites = {}, 
        i,
        keySpriteNames = [
            "BLANK", 
            "QUESTION",
            "SHIFT",
            "SPACE",
            "CTRL",
            "LEFT",
            "RIGHT",
            "UP",
            "DOWN",
            "ENTER",
            "DEL",
            "PGUP",
            "PGDN",
            "INS",
            "SLASH",
            "HOME",
            "COMMA",
            "PERIOD",
            "PLUS",
            "MINUS",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z"
        ];
        
    for (i=0;i<keySpriteNames.length;i++) {
        if (keySpriteNames[i] !== "") {
            keySprites[keySpriteNames[i]] = i;
        }
    }
    
    function playSound(file) {
        Wolf.Sound.startSound(null, null, 1, Wolf.CHAN_AUTO, file, 1, Wolf.ATTN_NORM, 0);
    }

    function setActiveItem(item) {
        playSound("lsfx/005.wav");
        
        $("#menu div.menu.active li").removeClass("active");
        item.addClass("active");
        
        if ($("#menu div.menu.active").hasClass("skill")) {
            $("#menu div.menu.active div.face")
                .removeClass()
                .addClass("face " + item.data("skill"));
        }
    }
    
    /** 
     * @description Bind events to menu items
     * @private 
     */
    function setupEvents() {
        $(document).on("keydown", function(e) {

            if (!$("#menu").is(":visible")) {
                return;
            }
            if (!menuInputActive) {
                return;
            }
            
            var oldActive = activeIndex;
            switch (e.keyCode) {
                case 38:
                    activeIndex--;
                    activeMouseItem = null;
                    break;
                case 40:
                    activeIndex++;
                    activeMouseItem = null;
                    break;
                case 13:
                    if (activeMouseItem) {
                        activeMouseItem.trigger("click");
                    } else {
                        $("#menu div.menu.active li").eq(activeIndex).trigger("click");
                    }
                    break;
                case 27: // ESC
                    var back = $("#menu div.menu.active").data("backmenu");
                    if (back) {
                        playSound("lsfx/039.wav");
                        show(back);
                    }
                    return;
            }
            if (oldActive != activeIndex) {
                var items = $("#menu div.menu.active li:not(.hidden)");
                if (activeIndex < 0) {
                    activeIndex += items.length;
                }
                activeIndex %= items.length;
                setActiveItem(items.eq(activeIndex));
            }
        });
        
        $("#menu li").mouseover(function() {
            if (!menuInputActive) {
                return;
            }
            activeMouseItem = $(this);
            setActiveItem($(this));
        });

        $("#menu li").on("click", function(e) {
            if (!menuInputActive) {
                return;
            }

            playSound("lsfx/032.wav");
            
            var $this = $(this),
                sub = $this.data("submenu");
            if (sub) {
                show(sub);
                e.stopPropagation();
            }
            
            if ($this.hasClass("sfxon")) {
                $("div.light", $this).addClass("on");
                $("#menu li.sfxoff div.light").removeClass("on");
                Wolf.Sound.toggleSound(true);
            }
            if ($this.hasClass("sfxoff")) {
                $("div.light", $this).addClass("on");
                $("#menu li.sfxon div.light").removeClass("on");
                Wolf.Sound.toggleSound(false);
            }
            if ($this.hasClass("musicon")) {
                $("div.light", $this).addClass("on");
                $("#menu li.musicoff div.light").removeClass("on");
                Wolf.Sound.toggleMusic(true);
            }
            if ($this.hasClass("musicoff")) {
                $("div.light", $this).addClass("on");
                $("#menu li.musicon div.light").removeClass("on");
                Wolf.Sound.toggleMusic(false);
            }
            if ($this.hasClass("mouseenabled")) {
                var mouseOn = Wolf.Game.isMouseEnabled();
                $("div.light", $this).toggleClass("on", !mouseOn);
                Wolf.Game.enableMouse(!mouseOn);
            }

            if ($this.hasClass("customizekeys")) {
                customizeKeys($this);
                e.stopPropagation();
            }

        });
        
        $("#menu div.menu.episodes li").on("click", function(e) {
            if (!menuInputActive) {
                return;
            }
            var episode = $(this).data("episode");
            if (Wolf.Game.isPlaying()) {
                showMessage("confirm-newgame", true, function(result) {
                    if (result) {
                        activeEpisode = episode;
                        show("skill");
                    } else {
                        show("main");
                    }
                });
            } else {
                activeEpisode = episode;
                show("skill");
            }
        });
        
        $("#menu div.menu.skill li").on("click", function(e) {
            if (!menuInputActive) {
                return;
            }
            activeSkill = $(this).data("skill");
        });
        
        $("#menu div.menu.main li.resumegame").on("click", function(e) {
            if (!menuInputActive) {
                return;
            }
            if (Wolf.Game.isPlaying()) {
                hide();
                Wolf.Game.resume();
            }
        });
        
        $("#menu div.menu.main li.readthis").on("click", function(e) {
            if (!menuInputActive) {
                return;
            }
            menuInputActive = false;
            $("#menu").fadeOut(null, function() {
                showText("help", 11, function() {
                    $("#menu").fadeIn();
                });
            });
            e.stopPropagation();
        });
        
        $("#menu div.menu.levels li").on("click", function(e) {
            if (!menuInputActive) {
                return;
            }
            var level, gameState;
            
            hide();
            level = $(this).data("level");

            gameState = Wolf.Game.startGame(Wolf[activeSkill]);
            Wolf.Game.startLevel(gameState, activeEpisode, level);
        });

    }
    
    function customizeKeys($this) {
        menuInputActive = false;
        
        var current = 0,
            isBinding = false,
            blinkInterval;
        
        function selectKey(index) {
            if (index < 0) index += 4;
            index = index % 4;
            var currentSprite = $("span.active", $this);
            if (currentSprite[0]) {
                setCustomizeKey(
                    currentSprite.data("action"),
                    currentSprite.data("keyIndex"),
                    false
                );
            }
            
            var sprite = $("span.k" + (index+1), $this);
            setCustomizeKey(
                sprite.data("action"),
                sprite.data("keyIndex"),
                true
            );
            current = index;
        }

        function activateKey(index) {
            isBinding = true;
            
            var sprite = $("span.k" + (index+1), $this),
                blink = false;
            
            setCustomizeKey(
                sprite.data("action"), "QUESTION", true
            );
            
            if (blinkInterval) {
                clearInterval(blinkInterval);
            }
            blinkInterval = setInterval(function() {
                setCustomizeKey(sprite.data("action"), (blink = !blink) ? "BLANK" : "QUESTION", true);
            }, 500)
        }
        
        function bindKey(index, key) {
            var sprite = $("span.k" + (index+1), $this);
            setCustomizeKey(
                sprite.data("action"),
                key,
                true
            );
            Wolf.Game.bindControl(sprite.data("action"), [key]);
        }
        
        function exitCustomize() {
            $(document).off("keydown", keyHandler);
            initCustomizeMenu();
            menuInputActive = true;
        }
        
        function keyHandler(e) {
            var i;
            if (isBinding) {
                // look for key in bindable key codes. TODO: LUT?
                for (i=2;i<keySpriteNames.length;i++) {
                    if (Wolf.Keys[keySpriteNames[i]] == e.keyCode) {
                        bindKey(current, keySpriteNames[i]);
                        isBinding = false;
                        clearInterval(blinkInterval);
                        blinkInterval = 0;
                        break;
                    }
                }
                return;
            }
            
            switch (e.keyCode) {
                case 39: // right
                    selectKey(current + 1);
                    break;
                case 37: // left
                    selectKey(current - 1);
                    break;
                case 13: // enter
                    activateKey(current);
                    break;
                case 27: // ESC
                case 38: // up
                case 40: // down
                    exitCustomize()
                    break;
            }
        }
        $(document).on("keydown", keyHandler);

        
        selectKey(current);
    }
    
    function setCustomizeKey(action, keyIndex, active) {
        var menu = $("#menu div.menu.customize"),
            x = (active ? -256 : 0),
            y = -keySprites[keyIndex] * 32;
        $("span." + action, menu)
            .css(
                "backgroundPosition", x + "px " + y + "px"
            )
            .data("keyIndex", keyIndex)
            .toggleClass("active", !!active);
    }
    
    function initCustomizeMenu() {
        var controls = Wolf.Game.getControls(),
            keys = ["run", "use", "attack", "strafe", "left", "right", "up", "down"],
            i;

        for (i=0;i<keys.length;i++) {
            setCustomizeKey(keys[i], controls[keys[i]][0])
        }
    }
    
    function showMessage(name, blink, onclose) {
        var box, 
            blinkOn = false;
        
        activeMessage = name;
        menuInputActive = false;
        
        if (messageBlink) {
            clearInterval(messageBlink);
            messageBlink = 0;
        }
        
        $("#menu .message." + name).show();
        
        box = $("#menu .message." + name + " div.box");
        
        box.removeClass("blink");
        
        if (blink) {
            setInterval(function() {
                blinkOn = !blinkOn;
                if (blinkOn) {
                    box.addClass("blink");
                } else {
                    box.removeClass("blink");
                }
            }, 200);
        }
        
        function close(value) {
            playSound("lsfx/039.wav");
            $(document).off("keydown", keyHandler);
            $("#menu .message." + name).hide();
            if (messageBlink) {
                clearInterval(messageBlink);
                messageBlink = 0;
            }
            menuInputActive = true;
            
            if (onclose) {
                onclose(value)
            }
        }
        
        
        function keyHandler(e) {
            switch (e.keyCode) {
                case 27: // ESC
                case 78: // N
                    close(false);
                    break;
                case 89: // Y
                    close(true);
                    break;
            }
        }

        $(document).on("keydown", keyHandler);
       
    }

    
    /** 
     * @description Show the menu
     * @memberOf Wolf.Menu
     */
    function show(menuName) {
        var musicOn, soundOn, mouseOn;
        
        if (!setupDone) {
            setupEvents();
            setupDone = true;
        }
        Wolf.Sound.startMusic("music/WONDERIN.ogg");
        
        menuName = menuName || "main";

        if (menuName == "main") {
            if (Wolf.Game.isPlaying()) {
                $("#menu div.menu.main li.resumegame")
                    .removeClass("hidden")
                    .show();
            } else {
                $("#menu div.menu.main li.resumegame")
                    .addClass("hidden")
                    .hide();
            }
        }
        
        if (menuName == "customize") {
            initCustomizeMenu();
        }
        
        if (menuName == "episodes") {
            $("#menu div.menu.episodes li")
                .removeClass("hidden")
                .show();
                
            if (!Wolf.Episodes[0].enabled) {
                $("#menu div.menu.episodes li.episode-0")
                    .addClass("hidden")
                    .hide();
            }
            if (!Wolf.Episodes[1].enabled) {
                $("#menu div.menu.episodes li.episode-1")
                    .addClass("hidden")
                    .hide();
            }
            if (!Wolf.Episodes[2].enabled) {
                $("#menu div.menu.episodes li.episode-2")
                    .addClass("hidden")
                    .hide();
            }
        }
        
        if (menuName == "sound") {
            musicOn = Wolf.Sound.isMusicEnabled();
            soundOn = Wolf.Sound.isSoundEnabled();
            $("#menu li.sfxoff div.light").toggleClass("on", !soundOn);
            $("#menu li.sfxon div.light").toggleClass("on", soundOn);
            $("#menu li.musicoff div.light").toggleClass("on", !musicOn);
            $("#menu li.musicon div.light").toggleClass("on", musicOn);
        }
        
        if (menuName == "control") {
            mouseOn = Wolf.Game.isMouseEnabled();
            $("#menu li.mouseenabled div.light").toggleClass("on", mouseOn);
        }
        
        if ($("#menu").data("menu")) {
            $("#menu").removeClass($("#menu").data("menu"));
        }
        $("#menu div.menu").removeClass("active").hide();
        $("#menu li").removeClass("active");
        $("#menu").data("menu", menuName).addClass(menuName).show();
        $("#menu div.menu." + menuName).addClass("active").show();
        $("#menu div.menu." + menuName + " ul li").first().addClass("active");
        $("#menu").focus();
        
        activeIndex = 0;
        activeMouseItem = null;
        menuInputActive = true;
    }
    
    /** 
     * @description Hide the menu
     * @memberOf Wolf.Menu
     */
    function hide() {
        $("#menu").hide();
        menuInputActive = false;
    }
    
    function showText(name, num, closeFunction) {
        var screen = $("#text-screen"),
            current = 0;
            
        menuInputActive = false;            

        function show(moveIdx) {
            current += moveIdx;
            if (current < 0) {
                current += num;
            }
            current = current % num;
            screen.css({
                "backgroundImage" : "url(art/text-screens/" + name + "-" + (current+1) + ".png)"
            });
            // preload the next in the background
            var next = (current + 1) % num,
                nextImg = new Image();
            nextImg.src = "art/text-screens/" + name + "-" + (next+1) + ".png";
        }
        function close() {
            $(document).off("keydown", keyHandler);
            screen.fadeOut(null, closeFunction);
            menuInputActive = true;
        }
        
        function keyHandler(e) {
            switch (e.keyCode) {
                case 39: // right
                    show(1);
                    break;
                case 37: // left
                    show(-1);
                    break;
                case 27: // ESC
                    close();
                    break;
            }
        }
        show(0);
        
        screen.fadeIn(null, function() {
            $(document).on("keydown", keyHandler);
        });
    }

    return {
        show : show,
        hide : hide,
        showText : showText
    };

})();
