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

Wolf.Sprites = (function() {
    var spriteTextures = [];
    //
    // sprite constants
    //
    var spriteNames = [
        "SPR_DEMO",
        "SPR_DEATHCAM",
        //
        // static sprites
        //
        // 002
        "SPR_STAT_0", "SPR_STAT_1","SPR_STAT_2", "SPR_STAT_3",
        "SPR_STAT_4", "SPR_STAT_5","SPR_STAT_6", "SPR_STAT_7",
        "SPR_STAT_8", "SPR_STAT_9","SPR_STAT_10","SPR_STAT_11",
        "SPR_STAT_12","SPR_STAT_13","SPR_STAT_14","SPR_STAT_15",
        "SPR_STAT_16","SPR_STAT_17","SPR_STAT_18","SPR_STAT_19",
        "SPR_STAT_20","SPR_STAT_21","SPR_STAT_22","SPR_STAT_23",
        "SPR_STAT_24","SPR_STAT_25","SPR_STAT_26","SPR_STAT_27",
        "SPR_STAT_28","SPR_STAT_29","SPR_STAT_30","SPR_STAT_31",
        "SPR_STAT_32","SPR_STAT_33","SPR_STAT_34","SPR_STAT_35",
        "SPR_STAT_36","SPR_STAT_37","SPR_STAT_38","SPR_STAT_39",
        "SPR_STAT_40","SPR_STAT_41","SPR_STAT_42","SPR_STAT_43",
        "SPR_STAT_44","SPR_STAT_45","SPR_STAT_46","SPR_STAT_47",
        "SPR_STAT_48","SPR_STAT_49","SPR_STAT_50","SPR_STAT_51",
        //
        // Guard
        //
        // 054
        "SPR_GRD_S_1","SPR_GRD_S_2","SPR_GRD_S_3","SPR_GRD_S_4",
        "SPR_GRD_S_5","SPR_GRD_S_6","SPR_GRD_S_7","SPR_GRD_S_8",

        "SPR_GRD_W1_1","SPR_GRD_W1_2","SPR_GRD_W1_3","SPR_GRD_W1_4",
        "SPR_GRD_W1_5","SPR_GRD_W1_6","SPR_GRD_W1_7","SPR_GRD_W1_8",

        "SPR_GRD_W2_1","SPR_GRD_W2_2","SPR_GRD_W2_3","SPR_GRD_W2_4",
        "SPR_GRD_W2_5","SPR_GRD_W2_6","SPR_GRD_W2_7","SPR_GRD_W2_8",

        "SPR_GRD_W3_1","SPR_GRD_W3_2","SPR_GRD_W3_3","SPR_GRD_W3_4",
        "SPR_GRD_W3_5","SPR_GRD_W3_6","SPR_GRD_W3_7","SPR_GRD_W3_8",

        "SPR_GRD_W4_1","SPR_GRD_W4_2","SPR_GRD_W4_3","SPR_GRD_W4_4",
        "SPR_GRD_W4_5","SPR_GRD_W4_6","SPR_GRD_W4_7","SPR_GRD_W4_8",

        "SPR_GRD_PAIN_1","SPR_GRD_DIE_1","SPR_GRD_DIE_2","SPR_GRD_DIE_3",
        "SPR_GRD_PAIN_2","SPR_GRD_DEAD",

        "SPR_GRD_SHOOT1","SPR_GRD_SHOOT2","SPR_GRD_SHOOT3",
        //
        // Dog
        //
        // 103
        "SPR_DOG_W1_1","SPR_DOG_W1_2","SPR_DOG_W1_3","SPR_DOG_W1_4",
        "SPR_DOG_W1_5","SPR_DOG_W1_6","SPR_DOG_W1_7","SPR_DOG_W1_8",

        "SPR_DOG_W2_1","SPR_DOG_W2_2","SPR_DOG_W2_3","SPR_DOG_W2_4",
        "SPR_DOG_W2_5","SPR_DOG_W2_6","SPR_DOG_W2_7","SPR_DOG_W2_8",

        "SPR_DOG_W3_1","SPR_DOG_W3_2","SPR_DOG_W3_3","SPR_DOG_W3_4",
        "SPR_DOG_W3_5","SPR_DOG_W3_6","SPR_DOG_W3_7","SPR_DOG_W3_8",

        "SPR_DOG_W4_1","SPR_DOG_W4_2","SPR_DOG_W4_3","SPR_DOG_W4_4",
        "SPR_DOG_W4_5","SPR_DOG_W4_6","SPR_DOG_W4_7","SPR_DOG_W4_8",

        "SPR_DOG_DIE_1","SPR_DOG_DIE_2","SPR_DOG_DIE_3","SPR_DOG_DEAD",
        "SPR_DOG_JUMP1","SPR_DOG_JUMP2","SPR_DOG_JUMP3",
        //
        // SS
        //
        // 142
        "SPR_SS_S_1","SPR_SS_S_2","SPR_SS_S_3","SPR_SS_S_4",
        "SPR_SS_S_5","SPR_SS_S_6","SPR_SS_S_7","SPR_SS_S_8",

        "SPR_SS_W1_1","SPR_SS_W1_2","SPR_SS_W1_3","SPR_SS_W1_4",
        "SPR_SS_W1_5","SPR_SS_W1_6","SPR_SS_W1_7","SPR_SS_W1_8",

        "SPR_SS_W2_1","SPR_SS_W2_2","SPR_SS_W2_3","SPR_SS_W2_4",
        "SPR_SS_W2_5","SPR_SS_W2_6","SPR_SS_W2_7","SPR_SS_W2_8",

        "SPR_SS_W3_1","SPR_SS_W3_2","SPR_SS_W3_3","SPR_SS_W3_4",
        "SPR_SS_W3_5","SPR_SS_W3_6","SPR_SS_W3_7","SPR_SS_W3_8",

        "SPR_SS_W4_1","SPR_SS_W4_2","SPR_SS_W4_3","SPR_SS_W4_4",
        "SPR_SS_W4_5","SPR_SS_W4_6","SPR_SS_W4_7","SPR_SS_W4_8",

        "SPR_SS_PAIN_1","SPR_SS_DIE_1","SPR_SS_DIE_2","SPR_SS_DIE_3",
        "SPR_SS_PAIN_2","SPR_SS_DEAD",

        "SPR_SS_SHOOT1","SPR_SS_SHOOT2","SPR_SS_SHOOT3",
        //
        // Mutant
        //
        // 191
        "SPR_MUT_S_1","SPR_MUT_S_2","SPR_MUT_S_3","SPR_MUT_S_4",
        "SPR_MUT_S_5","SPR_MUT_S_6","SPR_MUT_S_7","SPR_MUT_S_8",

        "SPR_MUT_W1_1","SPR_MUT_W1_2","SPR_MUT_W1_3","SPR_MUT_W1_4",
        "SPR_MUT_W1_5","SPR_MUT_W1_6","SPR_MUT_W1_7","SPR_MUT_W1_8",

        "SPR_MUT_W2_1","SPR_MUT_W2_2","SPR_MUT_W2_3","SPR_MUT_W2_4",
        "SPR_MUT_W2_5","SPR_MUT_W2_6","SPR_MUT_W2_7","SPR_MUT_W2_8",

        "SPR_MUT_W3_1","SPR_MUT_W3_2","SPR_MUT_W3_3","SPR_MUT_W3_4",
        "SPR_MUT_W3_5","SPR_MUT_W3_6","SPR_MUT_W3_7","SPR_MUT_W3_8",

        "SPR_MUT_W4_1","SPR_MUT_W4_2","SPR_MUT_W4_3","SPR_MUT_W4_4",
        "SPR_MUT_W4_5","SPR_MUT_W4_6","SPR_MUT_W4_7","SPR_MUT_W4_8",

        "SPR_MUT_PAIN_1","SPR_MUT_DIE_1","SPR_MUT_DIE_2","SPR_MUT_DIE_3",
        "SPR_MUT_PAIN_2","SPR_MUT_DIE_4","SPR_MUT_DEAD",

        "SPR_MUT_SHOOT1","SPR_MUT_SHOOT2","SPR_MUT_SHOOT3","SPR_MUT_SHOOT4",
        //
        // Officer
        //
        // 242
        "SPR_OFC_S_1","SPR_OFC_S_2","SPR_OFC_S_3","SPR_OFC_S_4",
        "SPR_OFC_S_5","SPR_OFC_S_6","SPR_OFC_S_7","SPR_OFC_S_8",

        "SPR_OFC_W1_1","SPR_OFC_W1_2","SPR_OFC_W1_3","SPR_OFC_W1_4",
        "SPR_OFC_W1_5","SPR_OFC_W1_6","SPR_OFC_W1_7","SPR_OFC_W1_8",

        "SPR_OFC_W2_1","SPR_OFC_W2_2","SPR_OFC_W2_3","SPR_OFC_W2_4",
        "SPR_OFC_W2_5","SPR_OFC_W2_6","SPR_OFC_W2_7","SPR_OFC_W2_8",

        "SPR_OFC_W3_1","SPR_OFC_W3_2","SPR_OFC_W3_3","SPR_OFC_W3_4",
        "SPR_OFC_W3_5","SPR_OFC_W3_6","SPR_OFC_W3_7","SPR_OFC_W3_8",

        "SPR_OFC_W4_1","SPR_OFC_W4_2","SPR_OFC_W4_3","SPR_OFC_W4_4",
        "SPR_OFC_W4_5","SPR_OFC_W4_6","SPR_OFC_W4_7","SPR_OFC_W4_8",

        "SPR_OFC_PAIN_1","SPR_OFC_DIE_1","SPR_OFC_DIE_2","SPR_OFC_DIE_3",
        "SPR_OFC_PAIN_2","SPR_OFC_DIE_4","SPR_OFC_DEAD",

        "SPR_OFC_SHOOT1","SPR_OFC_SHOOT2","SPR_OFC_SHOOT3",
        //
        // Ghosts
        //
        // 292
        "SPR_BLINKY_W1","SPR_BLINKY_W2","SPR_PINKY_W1","SPR_PINKY_W2",
        "SPR_CLYDE_W1","SPR_CLYDE_W2","SPR_INKY_W1","SPR_INKY_W2",
        //
        // Hans
        //
        // 300
        "SPR_BOSS_W1","SPR_BOSS_W2","SPR_BOSS_W3","SPR_BOSS_W4",
        "SPR_BOSS_SHOOT1","SPR_BOSS_SHOOT2","SPR_BOSS_SHOOT3","SPR_BOSS_DEAD",

        "SPR_BOSS_DIE1","SPR_BOSS_DIE2","SPR_BOSS_DIE3",
        //
        // Schabbs
        //
        // 311
        "SPR_SCHABB_W1","SPR_SCHABB_W2","SPR_SCHABB_W3","SPR_SCHABB_W4",
        "SPR_SCHABB_SHOOT1","SPR_SCHABB_SHOOT2",

        "SPR_SCHABB_DIE1","SPR_SCHABB_DIE2","SPR_SCHABB_DIE3","SPR_SCHABB_DEAD",
        "SPR_HYPO1","SPR_HYPO2","SPR_HYPO3","SPR_HYPO4",
        //
        // Fake
        //
        // 325
        "SPR_FAKE_W1","SPR_FAKE_W2","SPR_FAKE_W3","SPR_FAKE_W4",
        "SPR_FAKE_SHOOT","SPR_FIRE1","SPR_FIRE2",

        "SPR_FAKE_DIE1","SPR_FAKE_DIE2","SPR_FAKE_DIE3","SPR_FAKE_DIE4",
        "SPR_FAKE_DIE5","SPR_FAKE_DEAD",
        //
        // Hitler
        //
        // 338
        "SPR_MECHA_W1","SPR_MECHA_W2","SPR_MECHA_W3","SPR_MECHA_W4",
        "SPR_MECHA_SHOOT1","SPR_MECHA_SHOOT2","SPR_MECHA_SHOOT3","SPR_MECHA_DEAD",

        "SPR_MECHA_DIE1","SPR_MECHA_DIE2","SPR_MECHA_DIE3",

        "SPR_HITLER_W1","SPR_HITLER_W2","SPR_HITLER_W3","SPR_HITLER_W4",
        "SPR_HITLER_SHOOT1","SPR_HITLER_SHOOT2","SPR_HITLER_SHOOT3","SPR_HITLER_DEAD",

        "SPR_HITLER_DIE1","SPR_HITLER_DIE2","SPR_HITLER_DIE3","SPR_HITLER_DIE4",
        "SPR_HITLER_DIE5","SPR_HITLER_DIE6","SPR_HITLER_DIE7",
        //
        // Giftmacher
        //
        // 364
        "SPR_GIFT_W1","SPR_GIFT_W2","SPR_GIFT_W3","SPR_GIFT_W4",
        "SPR_GIFT_SHOOT1","SPR_GIFT_SHOOT2",

        "SPR_GIFT_DIE1","SPR_GIFT_DIE2","SPR_GIFT_DIE3","SPR_GIFT_DEAD",
        //
        // Rocket, smoke and small explosion
        //
        // 374
        "SPR_ROCKET_1","SPR_ROCKET_2","SPR_ROCKET_3","SPR_ROCKET_4",
        "SPR_ROCKET_5","SPR_ROCKET_6","SPR_ROCKET_7","SPR_ROCKET_8",

        "SPR_SMOKE_1","SPR_SMOKE_2","SPR_SMOKE_3","SPR_SMOKE_4",
        "SPR_BOOM_1","SPR_BOOM_2","SPR_BOOM_3",
        //
        // Angel of Death's DeathSparks(tm)
        //
        // 389
        "SPR_HROCKET_1","SPR_HROCKET_2","SPR_HROCKET_3","SPR_HROCKET_4",
        "SPR_HROCKET_5","SPR_HROCKET_6","SPR_HROCKET_7","SPR_HROCKET_8",

        "SPR_HSMOKE_1","SPR_HSMOKE_2","SPR_HSMOKE_3","SPR_HSMOKE_4",
        "SPR_HBOOM_1","SPR_HBOOM_2","SPR_HBOOM_3",

        "SPR_SPARK1","SPR_SPARK2","SPR_SPARK3","SPR_SPARK4",
        //
        // Gretel
        //
        // 408 
        "SPR_GRETEL_W1","SPR_GRETEL_W2","SPR_GRETEL_W3","SPR_GRETEL_W4",
        "SPR_GRETEL_SHOOT1","SPR_GRETEL_SHOOT2","SPR_GRETEL_SHOOT3","SPR_GRETEL_DEAD",

        "SPR_GRETEL_DIE1","SPR_GRETEL_DIE2","SPR_GRETEL_DIE3",
        //
        // Fat Face
        //
        // 419
        "SPR_FAT_W1","SPR_FAT_W2","SPR_FAT_W3","SPR_FAT_W4",
        "SPR_FAT_SHOOT1","SPR_FAT_SHOOT2","SPR_FAT_SHOOT3","SPR_FAT_SHOOT4",

        "SPR_FAT_DIE1","SPR_FAT_DIE2","SPR_FAT_DIE3","SPR_FAT_DEAD",
        //
        // bj
        //
        // 431
        "SPR_BJ_W1","SPR_BJ_W2","SPR_BJ_W3","SPR_BJ_W4",
        "SPR_BJ_JUMP1","SPR_BJ_JUMP2","SPR_BJ_JUMP3","SPR_BJ_JUMP4",
        //
        // SPEAR OF DESTINY
        //
        
        //
        // Trans Grosse
        //
        // 439
        "SPR_TRANS_W1","SPR_TRANS_W2","SPR_TRANS_W3","SPR_TRANS_W4",
        "SPR_TRANS_SHOOT1","SPR_TRANS_SHOOT2","SPR_TRANS_SHOOT3","SPR_TRANS_DEAD",

        "SPR_TRANS_DIE1","SPR_TRANS_DIE2","SPR_TRANS_DIE3",
        //
        // Wilhelm
        //
        // 450
        "SPR_WILL_W1","SPR_WILL_W2","SPR_WILL_W3","SPR_WILL_W4",
        "SPR_WILL_SHOOT1","SPR_WILL_SHOOT2","SPR_WILL_SHOOT3","SPR_WILL_SHOOT4",

        "SPR_WILL_DIE1","SPR_WILL_DIE2","SPR_WILL_DIE3","SPR_WILL_DEAD",
        //
        // UberMutant
        //
        // 462
        "SPR_UBER_W1","SPR_UBER_W2","SPR_UBER_W3","SPR_UBER_W4",
        "SPR_UBER_SHOOT1","SPR_UBER_SHOOT2","SPR_UBER_SHOOT3","SPR_UBER_SHOOT4",

        "SPR_UBER_DIE1","SPR_UBER_DIE2","SPR_UBER_DIE3","SPR_UBER_DIE4",
        "SPR_UBER_DEAD",
        //
        // Death Knight
        //
        // 475
        "SPR_DEATH_W1","SPR_DEATH_W2","SPR_DEATH_W3","SPR_DEATH_W4",
        "SPR_DEATH_SHOOT1","SPR_DEATH_SHOOT2","SPR_DEATH_SHOOT3","SPR_DEATH_SHOOT4",

        "SPR_DEATH_DIE1","SPR_DEATH_DIE2","SPR_DEATH_DIE3","SPR_DEATH_DIE4",
        "SPR_DEATH_DIE5","SPR_DEATH_DIE6","SPR_DEATH_DEAD",
        //
        // Ghost
        //
        // 490
        "SPR_SPECTRE_W1","SPR_SPECTRE_W2","SPR_SPECTRE_W3","SPR_SPECTRE_W4",
        "SPR_SPECTRE_F1","SPR_SPECTRE_F2","SPR_SPECTRE_F3","SPR_SPECTRE_F4",
        //
        // Angel of Death
        //
        // 498
        "SPR_ANGEL_W1","SPR_ANGEL_W2","SPR_ANGEL_W3","SPR_ANGEL_W4",
        "SPR_ANGEL_SHOOT1","SPR_ANGEL_SHOOT2","SPR_ANGEL_TIRED1","SPR_ANGEL_TIRED2",

        "SPR_ANGEL_DIE1","SPR_ANGEL_DIE2","SPR_ANGEL_DIE3","SPR_ANGEL_DIE4",
        "SPR_ANGEL_DIE5","SPR_ANGEL_DIE6","SPR_ANGEL_DIE7","SPR_ANGEL_DEAD",
        //
        // player attack frames
        //
        // 514
        "SPR_KNIFEREADY","SPR_KNIFEATK1","SPR_KNIFEATK2","SPR_KNIFEATK3",
        "SPR_KNIFEATK4",

        "SPR_PISTOLREADY","SPR_PISTOLATK1","SPR_PISTOLATK2","SPR_PISTOLATK3",
        "SPR_PISTOLATK4",

        "SPR_MACHINEGUNREADY","SPR_MACHINEGUNATK1","SPR_MACHINEGUNATK2","MACHINEGUNATK3",
        "SPR_MACHINEGUNATK4",

        "SPR_CHAINREADY","SPR_CHAINATK1","SPR_CHAINATK2","SPR_CHAINATK3",
        "SPR_CHAINATK4"
    ];
    
    var spriteConsts = {};
    for (var i=0,n=spriteNames.length;i<n;i++) {
        spriteConsts[spriteNames[i]] = i;
    }

    var sheets = [
        {},
        {},
        {sheet:"002_053.png",size:128,idx:0,num:52},
        {sheet:"002_053.png",size:128,idx:1,num:52},
        {sheet:"002_053.png",size:128,idx:2,num:52},
        {sheet:"002_053.png",size:128,idx:3,num:52},
        {sheet:"002_053.png",size:128,idx:4,num:52},
        {sheet:"002_053.png",size:128,idx:5,num:52},
        {sheet:"002_053.png",size:128,idx:6,num:52},
        {sheet:"002_053.png",size:128,idx:7,num:52},
        {sheet:"002_053.png",size:128,idx:8,num:52},
        {sheet:"002_053.png",size:128,idx:9,num:52},
        {sheet:"002_053.png",size:128,idx:10,num:52},
        {sheet:"002_053.png",size:128,idx:11,num:52},
        {sheet:"002_053.png",size:128,idx:12,num:52},
        {sheet:"002_053.png",size:128,idx:13,num:52},
        {sheet:"002_053.png",size:128,idx:14,num:52},
        {sheet:"002_053.png",size:128,idx:15,num:52},
        {sheet:"002_053.png",size:128,idx:16,num:52},
        {sheet:"002_053.png",size:128,idx:17,num:52},
        {sheet:"002_053.png",size:128,idx:18,num:52},
        {sheet:"002_053.png",size:128,idx:19,num:52},
        {sheet:"002_053.png",size:128,idx:20,num:52},
        {sheet:"002_053.png",size:128,idx:21,num:52},
        {sheet:"002_053.png",size:128,idx:22,num:52},
        {sheet:"002_053.png",size:128,idx:23,num:52},
        {sheet:"002_053.png",size:128,idx:24,num:52},
        {sheet:"002_053.png",size:128,idx:25,num:52},
        {sheet:"002_053.png",size:128,idx:26,num:52},
        {sheet:"002_053.png",size:128,idx:27,num:52},
        {sheet:"002_053.png",size:128,idx:28,num:52},
        {sheet:"002_053.png",size:128,idx:29,num:52},
        {sheet:"002_053.png",size:128,idx:30,num:52},
        {sheet:"002_053.png",size:128,idx:31,num:52},
        {sheet:"002_053.png",size:128,idx:32,num:52},
        {sheet:"002_053.png",size:128,idx:33,num:52},
        {sheet:"002_053.png",size:128,idx:34,num:52},
        {sheet:"002_053.png",size:128,idx:35,num:52},
        {sheet:"002_053.png",size:128,idx:36,num:52},
        {sheet:"002_053.png",size:128,idx:37,num:52},
        {sheet:"002_053.png",size:128,idx:38,num:52},
        {sheet:"002_053.png",size:128,idx:39,num:52},
        {sheet:"002_053.png",size:128,idx:40,num:52},
        {sheet:"002_053.png",size:128,idx:41,num:52},
        {sheet:"002_053.png",size:128,idx:42,num:52},
        {sheet:"002_053.png",size:128,idx:43,num:52},
        {sheet:"002_053.png",size:128,idx:44,num:52},
        {sheet:"002_053.png",size:128,idx:45,num:52},
        {sheet:"002_053.png",size:128,idx:46,num:52},
        {sheet:"002_053.png",size:128,idx:47,num:52},
        {sheet:"002_053.png",size:128,idx:48,num:52},
        {sheet:"002_053.png",size:128,idx:49,num:52},
        {sheet:"002_053.png",size:128,idx:50,num:52},
        {sheet:"002_053.png",size:128,idx:51,num:52},
        {sheet:"054_102.png",size:128,idx:0,num:49},
        {sheet:"054_102.png",size:128,idx:1,num:49},
        {sheet:"054_102.png",size:128,idx:2,num:49},
        {sheet:"054_102.png",size:128,idx:3,num:49},
        {sheet:"054_102.png",size:128,idx:4,num:49},
        {sheet:"054_102.png",size:128,idx:5,num:49},
        {sheet:"054_102.png",size:128,idx:6,num:49},
        {sheet:"054_102.png",size:128,idx:7,num:49},
        {sheet:"054_102.png",size:128,idx:8,num:49},
        {sheet:"054_102.png",size:128,idx:9,num:49},
        {sheet:"054_102.png",size:128,idx:10,num:49},
        {sheet:"054_102.png",size:128,idx:11,num:49},
        {sheet:"054_102.png",size:128,idx:12,num:49},
        {sheet:"054_102.png",size:128,idx:13,num:49},
        {sheet:"054_102.png",size:128,idx:14,num:49},
        {sheet:"054_102.png",size:128,idx:15,num:49},
        {sheet:"054_102.png",size:128,idx:16,num:49},
        {sheet:"054_102.png",size:128,idx:17,num:49},
        {sheet:"054_102.png",size:128,idx:18,num:49},
        {sheet:"054_102.png",size:128,idx:19,num:49},
        {sheet:"054_102.png",size:128,idx:20,num:49},
        {sheet:"054_102.png",size:128,idx:21,num:49},
        {sheet:"054_102.png",size:128,idx:22,num:49},
        {sheet:"054_102.png",size:128,idx:23,num:49},
        {sheet:"054_102.png",size:128,idx:24,num:49},
        {sheet:"054_102.png",size:128,idx:25,num:49},
        {sheet:"054_102.png",size:128,idx:26,num:49},
        {sheet:"054_102.png",size:128,idx:27,num:49},
        {sheet:"054_102.png",size:128,idx:28,num:49},
        {sheet:"054_102.png",size:128,idx:29,num:49},
        {sheet:"054_102.png",size:128,idx:30,num:49},
        {sheet:"054_102.png",size:128,idx:31,num:49},
        {sheet:"054_102.png",size:128,idx:32,num:49},
        {sheet:"054_102.png",size:128,idx:33,num:49},
        {sheet:"054_102.png",size:128,idx:34,num:49},
        {sheet:"054_102.png",size:128,idx:35,num:49},
        {sheet:"054_102.png",size:128,idx:36,num:49},
        {sheet:"054_102.png",size:128,idx:37,num:49},
        {sheet:"054_102.png",size:128,idx:38,num:49},
        {sheet:"054_102.png",size:128,idx:39,num:49},
        {sheet:"054_102.png",size:128,idx:40,num:49},
        {sheet:"054_102.png",size:128,idx:41,num:49},
        {sheet:"054_102.png",size:128,idx:42,num:49},
        {sheet:"054_102.png",size:128,idx:43,num:49},
        {sheet:"054_102.png",size:128,idx:44,num:49},
        {sheet:"054_102.png",size:128,idx:45,num:49},
        {sheet:"054_102.png",size:128,idx:46,num:49},
        {sheet:"054_102.png",size:128,idx:47,num:49},
        {sheet:"054_102.png",size:128,idx:48,num:49},
        {sheet:"103_141.png",size:64,idx:0,num:39},
        {sheet:"103_141.png",size:64,idx:1,num:39},
        {sheet:"103_141.png",size:64,idx:2,num:39},
        {sheet:"103_141.png",size:64,idx:3,num:39},
        {sheet:"103_141.png",size:64,idx:4,num:39},
        {sheet:"103_141.png",size:64,idx:5,num:39},
        {sheet:"103_141.png",size:64,idx:6,num:39},
        {sheet:"103_141.png",size:64,idx:7,num:39},
        {sheet:"103_141.png",size:64,idx:8,num:39},
        {sheet:"103_141.png",size:64,idx:9,num:39},
        {sheet:"103_141.png",size:64,idx:10,num:39},
        {sheet:"103_141.png",size:64,idx:11,num:39},
        {sheet:"103_141.png",size:64,idx:12,num:39},
        {sheet:"103_141.png",size:64,idx:13,num:39},
        {sheet:"103_141.png",size:64,idx:14,num:39},
        {sheet:"103_141.png",size:64,idx:15,num:39},
        {sheet:"103_141.png",size:64,idx:16,num:39},
        {sheet:"103_141.png",size:64,idx:17,num:39},
        {sheet:"103_141.png",size:64,idx:18,num:39},
        {sheet:"103_141.png",size:64,idx:19,num:39},
        {sheet:"103_141.png",size:64,idx:20,num:39},
        {sheet:"103_141.png",size:64,idx:21,num:39},
        {sheet:"103_141.png",size:64,idx:22,num:39},
        {sheet:"103_141.png",size:64,idx:23,num:39},
        {sheet:"103_141.png",size:64,idx:24,num:39},
        {sheet:"103_141.png",size:64,idx:25,num:39},
        {sheet:"103_141.png",size:64,idx:26,num:39},
        {sheet:"103_141.png",size:64,idx:27,num:39},
        {sheet:"103_141.png",size:64,idx:28,num:39},
        {sheet:"103_141.png",size:64,idx:29,num:39},
        {sheet:"103_141.png",size:64,idx:30,num:39},
        {sheet:"103_141.png",size:64,idx:31,num:39},
        {sheet:"103_141.png",size:64,idx:32,num:39},
        {sheet:"103_141.png",size:64,idx:33,num:39},
        {sheet:"103_141.png",size:64,idx:34,num:39},
        {sheet:"103_141.png",size:64,idx:35,num:39},
        {sheet:"103_141.png",size:64,idx:36,num:39},
        {sheet:"103_141.png",size:64,idx:37,num:39},
        {sheet:"103_141.png",size:64,idx:38,num:39},
        {sheet:"142_190.png",size:64,idx:0,num:49},
        {sheet:"142_190.png",size:64,idx:1,num:49},
        {sheet:"142_190.png",size:64,idx:2,num:49},
        {sheet:"142_190.png",size:64,idx:3,num:49},
        {sheet:"142_190.png",size:64,idx:4,num:49},
        {sheet:"142_190.png",size:64,idx:5,num:49},
        {sheet:"142_190.png",size:64,idx:6,num:49},
        {sheet:"142_190.png",size:64,idx:7,num:49},
        {sheet:"142_190.png",size:64,idx:8,num:49},
        {sheet:"142_190.png",size:64,idx:9,num:49},
        {sheet:"142_190.png",size:64,idx:10,num:49},
        {sheet:"142_190.png",size:64,idx:11,num:49},
        {sheet:"142_190.png",size:64,idx:12,num:49},
        {sheet:"142_190.png",size:64,idx:13,num:49},
        {sheet:"142_190.png",size:64,idx:14,num:49},
        {sheet:"142_190.png",size:64,idx:15,num:49},
        {sheet:"142_190.png",size:64,idx:16,num:49},
        {sheet:"142_190.png",size:64,idx:17,num:49},
        {sheet:"142_190.png",size:64,idx:18,num:49},
        {sheet:"142_190.png",size:64,idx:19,num:49},
        {sheet:"142_190.png",size:64,idx:20,num:49},
        {sheet:"142_190.png",size:64,idx:21,num:49},
        {sheet:"142_190.png",size:64,idx:22,num:49},
        {sheet:"142_190.png",size:64,idx:23,num:49},
        {sheet:"142_190.png",size:64,idx:24,num:49},
        {sheet:"142_190.png",size:64,idx:25,num:49},
        {sheet:"142_190.png",size:64,idx:26,num:49},
        {sheet:"142_190.png",size:64,idx:27,num:49},
        {sheet:"142_190.png",size:64,idx:28,num:49},
        {sheet:"142_190.png",size:64,idx:29,num:49},
        {sheet:"142_190.png",size:64,idx:30,num:49},
        {sheet:"142_190.png",size:64,idx:31,num:49},
        {sheet:"142_190.png",size:64,idx:32,num:49},
        {sheet:"142_190.png",size:64,idx:33,num:49},
        {sheet:"142_190.png",size:64,idx:34,num:49},
        {sheet:"142_190.png",size:64,idx:35,num:49},
        {sheet:"142_190.png",size:64,idx:36,num:49},
        {sheet:"142_190.png",size:64,idx:37,num:49},
        {sheet:"142_190.png",size:64,idx:38,num:49},
        {sheet:"142_190.png",size:64,idx:39,num:49},
        {sheet:"142_190.png",size:64,idx:40,num:49},
        {sheet:"142_190.png",size:64,idx:41,num:49},
        {sheet:"142_190.png",size:64,idx:42,num:49},
        {sheet:"142_190.png",size:64,idx:43,num:49},
        {sheet:"142_190.png",size:64,idx:44,num:49},
        {sheet:"142_190.png",size:64,idx:45,num:49},
        {sheet:"142_190.png",size:64,idx:46,num:49},
        {sheet:"142_190.png",size:64,idx:47,num:49},
        {sheet:"142_190.png",size:64,idx:48,num:49},
        {sheet:"191_241.png",size:64,idx:0,num:51},
        {sheet:"191_241.png",size:64,idx:1,num:51},
        {sheet:"191_241.png",size:64,idx:2,num:51},
        {sheet:"191_241.png",size:64,idx:3,num:51},
        {sheet:"191_241.png",size:64,idx:4,num:51},
        {sheet:"191_241.png",size:64,idx:5,num:51},
        {sheet:"191_241.png",size:64,idx:6,num:51},
        {sheet:"191_241.png",size:64,idx:7,num:51},
        {sheet:"191_241.png",size:64,idx:8,num:51},
        {sheet:"191_241.png",size:64,idx:9,num:51},
        {sheet:"191_241.png",size:64,idx:10,num:51},
        {sheet:"191_241.png",size:64,idx:11,num:51},
        {sheet:"191_241.png",size:64,idx:12,num:51},
        {sheet:"191_241.png",size:64,idx:13,num:51},
        {sheet:"191_241.png",size:64,idx:14,num:51},
        {sheet:"191_241.png",size:64,idx:15,num:51},
        {sheet:"191_241.png",size:64,idx:16,num:51},
        {sheet:"191_241.png",size:64,idx:17,num:51},
        {sheet:"191_241.png",size:64,idx:18,num:51},
        {sheet:"191_241.png",size:64,idx:19,num:51},
        {sheet:"191_241.png",size:64,idx:20,num:51},
        {sheet:"191_241.png",size:64,idx:21,num:51},
        {sheet:"191_241.png",size:64,idx:22,num:51},
        {sheet:"191_241.png",size:64,idx:23,num:51},
        {sheet:"191_241.png",size:64,idx:24,num:51},
        {sheet:"191_241.png",size:64,idx:25,num:51},
        {sheet:"191_241.png",size:64,idx:26,num:51},
        {sheet:"191_241.png",size:64,idx:27,num:51},
        {sheet:"191_241.png",size:64,idx:28,num:51},
        {sheet:"191_241.png",size:64,idx:29,num:51},
        {sheet:"191_241.png",size:64,idx:30,num:51},
        {sheet:"191_241.png",size:64,idx:31,num:51},
        {sheet:"191_241.png",size:64,idx:32,num:51},
        {sheet:"191_241.png",size:64,idx:33,num:51},
        {sheet:"191_241.png",size:64,idx:34,num:51},
        {sheet:"191_241.png",size:64,idx:35,num:51},
        {sheet:"191_241.png",size:64,idx:36,num:51},
        {sheet:"191_241.png",size:64,idx:37,num:51},
        {sheet:"191_241.png",size:64,idx:38,num:51},
        {sheet:"191_241.png",size:64,idx:39,num:51},
        {sheet:"191_241.png",size:64,idx:40,num:51},
        {sheet:"191_241.png",size:64,idx:41,num:51},
        {sheet:"191_241.png",size:64,idx:42,num:51},
        {sheet:"191_241.png",size:64,idx:43,num:51},
        {sheet:"191_241.png",size:64,idx:44,num:51},
        {sheet:"191_241.png",size:64,idx:45,num:51},
        {sheet:"191_241.png",size:64,idx:46,num:51},
        {sheet:"191_241.png",size:64,idx:47,num:51},
        {sheet:"191_241.png",size:64,idx:48,num:51},
        {sheet:"191_241.png",size:64,idx:49,num:51},
        {sheet:"191_241.png",size:64,idx:50,num:51},
        {sheet:"242_291.png",size:64,idx:0,num:50},
        {sheet:"242_291.png",size:64,idx:1,num:50},
        {sheet:"242_291.png",size:64,idx:2,num:50},
        {sheet:"242_291.png",size:64,idx:3,num:50},
        {sheet:"242_291.png",size:64,idx:4,num:50},
        {sheet:"242_291.png",size:64,idx:5,num:50},
        {sheet:"242_291.png",size:64,idx:6,num:50},
        {sheet:"242_291.png",size:64,idx:7,num:50},
        {sheet:"242_291.png",size:64,idx:8,num:50},
        {sheet:"242_291.png",size:64,idx:9,num:50},
        {sheet:"242_291.png",size:64,idx:10,num:50},
        {sheet:"242_291.png",size:64,idx:11,num:50},
        {sheet:"242_291.png",size:64,idx:12,num:50},
        {sheet:"242_291.png",size:64,idx:13,num:50},
        {sheet:"242_291.png",size:64,idx:14,num:50},
        {sheet:"242_291.png",size:64,idx:15,num:50},
        {sheet:"242_291.png",size:64,idx:16,num:50},
        {sheet:"242_291.png",size:64,idx:17,num:50},
        {sheet:"242_291.png",size:64,idx:18,num:50},
        {sheet:"242_291.png",size:64,idx:19,num:50},
        {sheet:"242_291.png",size:64,idx:20,num:50},
        {sheet:"242_291.png",size:64,idx:21,num:50},
        {sheet:"242_291.png",size:64,idx:22,num:50},
        {sheet:"242_291.png",size:64,idx:23,num:50},
        {sheet:"242_291.png",size:64,idx:24,num:50},
        {sheet:"242_291.png",size:64,idx:25,num:50},
        {sheet:"242_291.png",size:64,idx:26,num:50},
        {sheet:"242_291.png",size:64,idx:27,num:50},
        {sheet:"242_291.png",size:64,idx:28,num:50},
        {sheet:"242_291.png",size:64,idx:29,num:50},
        {sheet:"242_291.png",size:64,idx:30,num:50},
        {sheet:"242_291.png",size:64,idx:31,num:50},
        {sheet:"242_291.png",size:64,idx:32,num:50},
        {sheet:"242_291.png",size:64,idx:33,num:50},
        {sheet:"242_291.png",size:64,idx:34,num:50},
        {sheet:"242_291.png",size:64,idx:35,num:50},
        {sheet:"242_291.png",size:64,idx:36,num:50},
        {sheet:"242_291.png",size:64,idx:37,num:50},
        {sheet:"242_291.png",size:64,idx:38,num:50},
        {sheet:"242_291.png",size:64,idx:39,num:50},
        {sheet:"242_291.png",size:64,idx:40,num:50},
        {sheet:"242_291.png",size:64,idx:41,num:50},
        {sheet:"242_291.png",size:64,idx:42,num:50},
        {sheet:"242_291.png",size:64,idx:43,num:50},
        {sheet:"242_291.png",size:64,idx:44,num:50},
        {sheet:"242_291.png",size:64,idx:45,num:50},
        {sheet:"242_291.png",size:64,idx:46,num:50},
        {sheet:"242_291.png",size:64,idx:47,num:50},
        {sheet:"242_291.png",size:64,idx:48,num:50},
        {sheet:"242_291.png",size:64,idx:49,num:50},
        {sheet:"292_299.png",size:64,idx:0,num:8},
        {sheet:"292_299.png",size:64,idx:1,num:8},
        {sheet:"292_299.png",size:64,idx:2,num:8},
        {sheet:"292_299.png",size:64,idx:3,num:8},
        {sheet:"292_299.png",size:64,idx:4,num:8},
        {sheet:"292_299.png",size:64,idx:5,num:8},
        {sheet:"292_299.png",size:64,idx:6,num:8},
        {sheet:"292_299.png",size:64,idx:7,num:8},
        {sheet:"300_310.png",size:64,idx:0,num:11},
        {sheet:"300_310.png",size:64,idx:1,num:11},
        {sheet:"300_310.png",size:64,idx:2,num:11},
        {sheet:"300_310.png",size:64,idx:3,num:11},
        {sheet:"300_310.png",size:64,idx:4,num:11},
        {sheet:"300_310.png",size:64,idx:5,num:11},
        {sheet:"300_310.png",size:64,idx:6,num:11},
        {sheet:"300_310.png",size:64,idx:7,num:11},
        {sheet:"300_310.png",size:64,idx:8,num:11},
        {sheet:"300_310.png",size:64,idx:9,num:11},
        {sheet:"300_310.png",size:64,idx:10,num:11},
        {sheet:"311_324.png",size:64,idx:0,num:14},
        {sheet:"311_324.png",size:64,idx:1,num:14},
        {sheet:"311_324.png",size:64,idx:2,num:14},
        {sheet:"311_324.png",size:64,idx:3,num:14},
        {sheet:"311_324.png",size:64,idx:4,num:14},
        {sheet:"311_324.png",size:64,idx:5,num:14},
        {sheet:"311_324.png",size:64,idx:6,num:14},
        {sheet:"311_324.png",size:64,idx:7,num:14},
        {sheet:"311_324.png",size:64,idx:8,num:14},
        {sheet:"311_324.png",size:64,idx:9,num:14},
        {sheet:"311_324.png",size:64,idx:10,num:14},
        {sheet:"311_324.png",size:64,idx:11,num:14},
        {sheet:"311_324.png",size:64,idx:12,num:14},
        {sheet:"311_324.png",size:64,idx:13,num:14},
        {sheet:"325_337.png",size:64,idx:0,num:13},
        {sheet:"325_337.png",size:64,idx:1,num:13},
        {sheet:"325_337.png",size:64,idx:2,num:13},
        {sheet:"325_337.png",size:64,idx:3,num:13},
        {sheet:"325_337.png",size:64,idx:4,num:13},
        {sheet:"325_337.png",size:64,idx:5,num:13},
        {sheet:"325_337.png",size:64,idx:6,num:13},
        {sheet:"325_337.png",size:64,idx:7,num:13},
        {sheet:"325_337.png",size:64,idx:8,num:13},
        {sheet:"325_337.png",size:64,idx:9,num:13},
        {sheet:"325_337.png",size:64,idx:10,num:13},
        {sheet:"325_337.png",size:64,idx:11,num:13},
        {sheet:"325_337.png",size:64,idx:12,num:13},
        {sheet:"338_363.png",size:64,idx:0,num:26},
        {sheet:"338_363.png",size:64,idx:1,num:26},
        {sheet:"338_363.png",size:64,idx:2,num:26},
        {sheet:"338_363.png",size:64,idx:3,num:26},
        {sheet:"338_363.png",size:64,idx:4,num:26},
        {sheet:"338_363.png",size:64,idx:5,num:26},
        {sheet:"338_363.png",size:64,idx:6,num:26},
        {sheet:"338_363.png",size:64,idx:7,num:26},
        {sheet:"338_363.png",size:64,idx:8,num:26},
        {sheet:"338_363.png",size:64,idx:9,num:26},
        {sheet:"338_363.png",size:64,idx:10,num:26},
        {sheet:"338_363.png",size:64,idx:11,num:26},
        {sheet:"338_363.png",size:64,idx:12,num:26},
        {sheet:"338_363.png",size:64,idx:13,num:26},
        {sheet:"338_363.png",size:64,idx:14,num:26},
        {sheet:"338_363.png",size:64,idx:15,num:26},
        {sheet:"338_363.png",size:64,idx:16,num:26},
        {sheet:"338_363.png",size:64,idx:17,num:26},
        {sheet:"338_363.png",size:64,idx:18,num:26},
        {sheet:"338_363.png",size:64,idx:19,num:26},
        {sheet:"338_363.png",size:64,idx:20,num:26},
        {sheet:"338_363.png",size:64,idx:21,num:26},
        {sheet:"338_363.png",size:64,idx:22,num:26},
        {sheet:"338_363.png",size:64,idx:23,num:26},
        {sheet:"338_363.png",size:64,idx:24,num:26},
        {sheet:"338_363.png",size:64,idx:25,num:26},
        {sheet:"364_373.png",size:64,idx:0,num:10},
        {sheet:"364_373.png",size:64,idx:1,num:10},
        {sheet:"364_373.png",size:64,idx:2,num:10},
        {sheet:"364_373.png",size:64,idx:3,num:10},
        {sheet:"364_373.png",size:64,idx:4,num:10},
        {sheet:"364_373.png",size:64,idx:5,num:10},
        {sheet:"364_373.png",size:64,idx:6,num:10},
        {sheet:"364_373.png",size:64,idx:7,num:10},
        {sheet:"364_373.png",size:64,idx:8,num:10},
        {sheet:"364_373.png",size:64,idx:9,num:10},
        {sheet:"374_388.png",size:64,idx:0,num:15},
        {sheet:"374_388.png",size:64,idx:1,num:15},
        {sheet:"374_388.png",size:64,idx:2,num:15},
        {sheet:"374_388.png",size:64,idx:3,num:15},
        {sheet:"374_388.png",size:64,idx:4,num:15},
        {sheet:"374_388.png",size:64,idx:5,num:15},
        {sheet:"374_388.png",size:64,idx:6,num:15},
        {sheet:"374_388.png",size:64,idx:7,num:15},
        {sheet:"374_388.png",size:64,idx:8,num:15},
        {sheet:"374_388.png",size:64,idx:9,num:15},
        {sheet:"374_388.png",size:64,idx:10,num:15},
        {sheet:"374_388.png",size:64,idx:11,num:15},
        {sheet:"374_388.png",size:64,idx:12,num:15},
        {sheet:"374_388.png",size:64,idx:13,num:15},
        {sheet:"374_388.png",size:64,idx:14,num:15},
        {sheet:"389_407.png",size:64,idx:0,num:19},
        {sheet:"389_407.png",size:64,idx:1,num:19},
        {sheet:"389_407.png",size:64,idx:2,num:19},
        {sheet:"389_407.png",size:64,idx:3,num:19},
        {sheet:"389_407.png",size:64,idx:4,num:19},
        {sheet:"389_407.png",size:64,idx:5,num:19},
        {sheet:"389_407.png",size:64,idx:6,num:19},
        {sheet:"389_407.png",size:64,idx:7,num:19},
        {sheet:"389_407.png",size:64,idx:8,num:19},
        {sheet:"389_407.png",size:64,idx:9,num:19},
        {sheet:"389_407.png",size:64,idx:10,num:19},
        {sheet:"389_407.png",size:64,idx:11,num:19},
        {sheet:"389_407.png",size:64,idx:12,num:19},
        {sheet:"389_407.png",size:64,idx:13,num:19},
        {sheet:"389_407.png",size:64,idx:14,num:19},
        {sheet:"389_407.png",size:64,idx:15,num:19},
        {sheet:"389_407.png",size:64,idx:16,num:19},
        {sheet:"389_407.png",size:64,idx:17,num:19},
        {sheet:"389_407.png",size:64,idx:18,num:19},
        {sheet:"408_418.png",size:64,idx:0,num:11},
        {sheet:"408_418.png",size:64,idx:1,num:11},
        {sheet:"408_418.png",size:64,idx:2,num:11},
        {sheet:"408_418.png",size:64,idx:3,num:11},
        {sheet:"408_418.png",size:64,idx:4,num:11},
        {sheet:"408_418.png",size:64,idx:5,num:11},
        {sheet:"408_418.png",size:64,idx:6,num:11},
        {sheet:"408_418.png",size:64,idx:7,num:11},
        {sheet:"408_418.png",size:64,idx:8,num:11},
        {sheet:"408_418.png",size:64,idx:9,num:11},
        {sheet:"408_418.png",size:64,idx:10,num:11},
        {sheet:"419_430.png",size:64,idx:0,num:12},
        {sheet:"419_430.png",size:64,idx:1,num:12},
        {sheet:"419_430.png",size:64,idx:2,num:12},
        {sheet:"419_430.png",size:64,idx:3,num:12},
        {sheet:"419_430.png",size:64,idx:4,num:12},
        {sheet:"419_430.png",size:64,idx:5,num:12},
        {sheet:"419_430.png",size:64,idx:6,num:12},
        {sheet:"419_430.png",size:64,idx:7,num:12},
        {sheet:"419_430.png",size:64,idx:8,num:12},
        {sheet:"419_430.png",size:64,idx:9,num:12},
        {sheet:"419_430.png",size:64,idx:10,num:12},
        {sheet:"419_430.png",size:64,idx:11,num:12},
        {sheet:"431_438.png",size:64,idx:0,num:8},
        {sheet:"431_438.png",size:64,idx:1,num:8},
        {sheet:"431_438.png",size:64,idx:2,num:8},
        {sheet:"431_438.png",size:64,idx:3,num:8},
        {sheet:"431_438.png",size:64,idx:4,num:8},
        {sheet:"431_438.png",size:64,idx:5,num:8},
        {sheet:"431_438.png",size:64,idx:6,num:8},
        {sheet:"431_438.png",size:64,idx:7,num:8},
        {sheet:"439_449.png",size:64,idx:0,num:11},
        {sheet:"439_449.png",size:64,idx:1,num:11},
        {sheet:"439_449.png",size:64,idx:2,num:11},
        {sheet:"439_449.png",size:64,idx:3,num:11},
        {sheet:"439_449.png",size:64,idx:4,num:11},
        {sheet:"439_449.png",size:64,idx:5,num:11},
        {sheet:"439_449.png",size:64,idx:6,num:11},
        {sheet:"439_449.png",size:64,idx:7,num:11},
        {sheet:"439_449.png",size:64,idx:8,num:11},
        {sheet:"439_449.png",size:64,idx:9,num:11},
        {sheet:"439_449.png",size:64,idx:10,num:11},
        {sheet:"450_461.png",size:64,idx:0,num:12},
        {sheet:"450_461.png",size:64,idx:1,num:12},
        {sheet:"450_461.png",size:64,idx:2,num:12},
        {sheet:"450_461.png",size:64,idx:3,num:12},
        {sheet:"450_461.png",size:64,idx:4,num:12},
        {sheet:"450_461.png",size:64,idx:5,num:12},
        {sheet:"450_461.png",size:64,idx:6,num:12},
        {sheet:"450_461.png",size:64,idx:7,num:12},
        {sheet:"450_461.png",size:64,idx:8,num:12},
        {sheet:"450_461.png",size:64,idx:9,num:12},
        {sheet:"450_461.png",size:64,idx:10,num:12},
        {sheet:"450_461.png",size:64,idx:11,num:12},
        {sheet:"462_474.png",size:64,idx:0,num:13},
        {sheet:"462_474.png",size:64,idx:1,num:13},
        {sheet:"462_474.png",size:64,idx:2,num:13},
        {sheet:"462_474.png",size:64,idx:3,num:13},
        {sheet:"462_474.png",size:64,idx:4,num:13},
        {sheet:"462_474.png",size:64,idx:5,num:13},
        {sheet:"462_474.png",size:64,idx:6,num:13},
        {sheet:"462_474.png",size:64,idx:7,num:13},
        {sheet:"462_474.png",size:64,idx:8,num:13},
        {sheet:"462_474.png",size:64,idx:9,num:13},
        {sheet:"462_474.png",size:64,idx:10,num:13},
        {sheet:"462_474.png",size:64,idx:11,num:13},
        {sheet:"462_474.png",size:64,idx:12,num:13},
        {sheet:"475_489.png",size:64,idx:0,num:15},
        {sheet:"475_489.png",size:64,idx:1,num:15},
        {sheet:"475_489.png",size:64,idx:2,num:15},
        {sheet:"475_489.png",size:64,idx:3,num:15},
        {sheet:"475_489.png",size:64,idx:4,num:15},
        {sheet:"475_489.png",size:64,idx:5,num:15},
        {sheet:"475_489.png",size:64,idx:6,num:15},
        {sheet:"475_489.png",size:64,idx:7,num:15},
        {sheet:"475_489.png",size:64,idx:8,num:15},
        {sheet:"475_489.png",size:64,idx:9,num:15},
        {sheet:"475_489.png",size:64,idx:10,num:15},
        {sheet:"475_489.png",size:64,idx:11,num:15},
        {sheet:"475_489.png",size:64,idx:12,num:15},
        {sheet:"475_489.png",size:64,idx:13,num:15},
        {sheet:"475_489.png",size:64,idx:14,num:15},
        {sheet:"490_497.png",size:64,idx:0,num:8},
        {sheet:"490_497.png",size:64,idx:1,num:8},
        {sheet:"490_497.png",size:64,idx:2,num:8},
        {sheet:"490_497.png",size:64,idx:3,num:8},
        {sheet:"490_497.png",size:64,idx:4,num:8},
        {sheet:"490_497.png",size:64,idx:5,num:8},
        {sheet:"490_497.png",size:64,idx:6,num:8},
        {sheet:"490_497.png",size:64,idx:7,num:8},
        {sheet:"498_513.png",size:64,idx:0,num:16},
        {sheet:"498_513.png",size:64,idx:1,num:16},
        {sheet:"498_513.png",size:64,idx:2,num:16},
        {sheet:"498_513.png",size:64,idx:3,num:16},
        {sheet:"498_513.png",size:64,idx:4,num:16},
        {sheet:"498_513.png",size:64,idx:5,num:16},
        {sheet:"498_513.png",size:64,idx:6,num:16},
        {sheet:"498_513.png",size:64,idx:7,num:16},
        {sheet:"498_513.png",size:64,idx:8,num:16},
        {sheet:"498_513.png",size:64,idx:9,num:16},
        {sheet:"498_513.png",size:64,idx:10,num:16},
        {sheet:"498_513.png",size:64,idx:11,num:16},
        {sheet:"498_513.png",size:64,idx:12,num:16},
        {sheet:"498_513.png",size:64,idx:13,num:16},
        {sheet:"498_513.png",size:64,idx:14,num:16},
        {sheet:"498_513.png",size:64,idx:15,num:16},
        {sheet:"514_533.png",size:128,idx:0,num:20},
        {sheet:"514_533.png",size:128,idx:1,num:20},
        {sheet:"514_533.png",size:128,idx:2,num:20},
        {sheet:"514_533.png",size:128,idx:3,num:20},
        {sheet:"514_533.png",size:128,idx:4,num:20},
        {sheet:"514_533.png",size:128,idx:5,num:20},
        {sheet:"514_533.png",size:128,idx:6,num:20},
        {sheet:"514_533.png",size:128,idx:7,num:20},
        {sheet:"514_533.png",size:128,idx:8,num:20},
        {sheet:"514_533.png",size:128,idx:9,num:20},
        {sheet:"514_533.png",size:128,idx:10,num:20},
        {sheet:"514_533.png",size:128,idx:11,num:20},
        {sheet:"514_533.png",size:128,idx:12,num:20},
        {sheet:"514_533.png",size:128,idx:13,num:20},
        {sheet:"514_533.png",size:128,idx:14,num:20},
        {sheet:"514_533.png",size:128,idx:15,num:20},
        {sheet:"514_533.png",size:128,idx:16,num:20},
        {sheet:"514_533.png",size:128,idx:17,num:20},
        {sheet:"514_533.png",size:128,idx:18,num:20},
        {sheet:"514_533.png",size:128,idx:19,num:20}
    ];

    Wolf.setConsts(spriteConsts);
    
    Wolf.setConsts({
        SPRT_ONE_TEX    : 1,
        SPRT_NO_ROT     : 2,
        SPRT_CHG_POS    : 4,
        SPRT_CHG_TEX    : 8,
        SPRT_REMOVE     : 16,
        MAX_SPRITES     : 1024,
        MAX_VIS_SPRITES : 128
    });

    function getNewSprite(level) {
        var n;

        var newSprite = {
            x : 0, 
            y : 0,
            angle : 0,
            // very clever to make it not just (x>>TILESHIFT)
            // but also (x>>TILESHIFT)-1 if (x%TILEWIDTH)<HALFTILE
            // so we will check only 4 files instead of 9 as Carmack did!
            tile : {
                x : 0,
                y : 0
            },
            // controls appearence of this sprite:
            // SPRT_ONE_TEX: use one texture for each rotation
            // SPRT_NO_ROT: do not rotate sprite (fence)
            // SPRT_CHG_POS
            // SPRT_CHG_TEX
            // SPRT_REMOVE
            flags : 0,
            // 8 textures: one for each rotation phase!
            // if SPRT_ONE_TEX flag use tex with index 0!

            // these are Wolf sprite texture numbers, not OpenGL sprites
            // or indexes in the textureManager list
            tex : []
        };
        
        // check if we can recycle a spot first
        /*
        for (n=0; n < level.numSprites ; ++n) {
            sprt = level.sprites[n];
            if (sprt.flags & Wolf.SPRT_REMOVE) {
                // free spot: clear it first
                //memset( sprt, 0, sizeof( sprite_t ) );
                level.sprites[n] = newSprite;
                return n;
            }
        }
        */

        /*
        if (level.numSprites >= Wolf.MAX_SPRITES) {
            Wolf.log("Warning n_of_sprt == MAX_SPRITES");
            return -1;
        }
        */
       
        Wolf.Renderer.loadSprite(newSprite);
        
        level.sprites.push(newSprite);
        return newSprite;
        
        //level.numSprites++
        //return level.numSprites-1;
    }

    function setPos(level, sprite, x, y, angle) {
        /*
        if (sprite_id == -1) {
            return;
        }
        */

        //var sprite = level.sprites[sprite_id];
        
        sprite.x = x;
        sprite.y = y;
        sprite.angle = angle;
        sprite.tile.x = Wolf.POS2TILE( x );
        sprite.tile.y = Wolf.POS2TILE( y );
        sprite.flags |= Wolf.SPRT_CHG_POS;

        if (!(x & Wolf.HALFTILE)) { // (x%TILEGLOBAL>=HALFTILE)
            sprite.tile.x--;
        }

        if (!(y & Wolf.HALFTILE)) {
            sprite.tile.y--;
        }
    }
    
    function setTex(level, sprite, index, tex) {
        /*
        if (sprite_id == -1) {
            return;
        }
        */

        //cacheTextures(tex, tex);

        if (index == -1) {    // one texture for each phase
            sprite.tex[0] = tex;
            sprite.flags |= Wolf.SPRT_ONE_TEX;
        } else {
            sprite.tex[index] = tex;
        }
        sprite.flags |= Wolf.SPRT_CHG_TEX;
    }

    function cacheTextures(start, end) {
        var i, texname;

        for( i = start ; i <= end ; ++i ) {
            if (!spriteTextures[i]) {
                //texname = "sprites/" + () + ".png";
                //spriteTextures[i] = TM_FindTexture( texname, TT_Sprite );
            }
        }
    }
    
    function getTexture(id) {
        return sheets[id];
    }
    

    function createVisList(viewport, level, visibleTiles) {
        var tx, ty, n, num, numVisible,
            vislist,
            sprt;

        vislist = [];
        numVisible = 0;

        for (n=0, num=level.sprites.length; n < num; ++n) {
            sprt = level.sprites[n];
            if (sprt.flags & Wolf.SPRT_REMOVE) {
                continue;
            }

            tx = sprt.tile.x;
            ty = sprt.tile.y;
        
            if (tx > 63) {
                tx = 63;
            }
            if (ty > 63) {
                ty = 63;
            }
           
            // can be in any of 4 surrounding tiles; not 9 - see definition of tilex & tiley
            if (visibleTiles[tx][ty] || visibleTiles[tx + 1][ty] || visibleTiles[tx][ty + 1] || visibleTiles[tx + 1][ty + 1]) {
            
                // player spoted it
                var vis = vislist[vislist.length] = {};
                
                vis.dist = Wolf.Math.lineLen2Point(sprt.x - viewport.x, sprt.y - viewport.y, viewport.angle);
                vis.x = sprt.x;
                vis.y = sprt.y;
                vis.angle = sprt.angle;
                vis.tex = sprt.tex[0]; //FIXME!
                vis.sprite = sprt;
                
                if(++numVisible > Wolf.MAX_VIS_SPRITES) {
                    break; // vislist full
                }
            }
        }
        
        
        // sorting list
        if (numVisible) { // do not sort if no entries
            //vislist.sort();
            //qsort( vislist, numVisible, sizeof( visobj_t ), Sprite_cmpVis );
        }

        return vislist;
    }

    function remove(level, sprite) {
        if (!sprite) {
            return;
        }

        sprite.flags |= Wolf.SPRT_REMOVE;
        Wolf.Renderer.unloadSprite(sprite);
    }
    
    function clean(level) {
        var i, num,
            liveSprites = [];

        for (i=0, num=level.sprites.length; i < num; ++i) {
            if (level.sprites[i].flags & Wolf.SPRT_REMOVE) {
                continue;
            }
            liveSprites.push(level.sprites[i]);
        }
        level.sprites = liveSprites;
    }
    
    return {
        getNewSprite : getNewSprite,
        setPos : setPos,
        setTex : setTex,
        cacheTextures : cacheTextures,
        getTexture : getTexture,
        createVisList : createVisList,
        remove : remove,
        clean : clean
    };

})();