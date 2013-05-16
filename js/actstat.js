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


(function() {
    var ST_INFO_NULL = [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_dead]

    /*
        1-if object can be rotated, 0 if one sprite for every direction
        base object's state texture if rotation is on facing player
        after how man frames change state to .next_state
        what to do every frame
        what to do once per state
        next state
    */

    //var objstate[Wolf.NUMENEMIES][Wolf.NUMSTATES] = [
    var objstate = [
        // en_guard,
        [
            [ 1, Wolf.SPR_GRD_S_1,     0, Wolf.AI.T_Stand, null, Wolf.st_stand ], // Wolf.st_stand,

            [ 1, Wolf.SPR_GRD_W1_1,    20,  Wolf.AI.T_Path, null, Wolf.st_path1s ], // Wolf.st_path1,
            [ 1, Wolf.SPR_GRD_W1_1,     5,  null,           null, Wolf.st_path2  ], // Wolf.st_path1s,
            [ 1, Wolf.SPR_GRD_W2_1,    15,  Wolf.AI.T_Path, null, Wolf.st_path3  ], // Wolf.st_path2,
            [ 1, Wolf.SPR_GRD_W3_1,    20,  Wolf.AI.T_Path, null, Wolf.st_path3s ], // Wolf.st_path3,
            [ 1, Wolf.SPR_GRD_W3_1,     5,  null,           null, Wolf.st_path4  ], // Wolf.st_path3s,
            [ 1, Wolf.SPR_GRD_W4_1,    15,  Wolf.AI.T_Path, null, Wolf.st_path1  ], // Wolf.st_path4,

            [ 0, Wolf.SPR_GRD_PAIN_1,    10, null,    null, Wolf.st_chase1],// Wolf.st_pain,
            [ 0, Wolf.SPR_GRD_PAIN_2,    10, null,    null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [ 0, Wolf.SPR_GRD_SHOOT1,    20, null,    null,             Wolf.st_shoot2],// Wolf.st_shoot1,
            [ 0, Wolf.SPR_GRD_SHOOT2,    20, null,    Wolf.AI.T_Shoot,  Wolf.st_shoot3],// Wolf.st_shoot2,
            [ 0, Wolf.SPR_GRD_SHOOT3,    20, null,    null,             Wolf.st_chase1],// Wolf.st_shoot3,

            [ 0, Wolf.SPR_DEMO,    0, null,    null, Wolf.st_chase1 ], // Wolf.st_shoot4,
            [ 0, Wolf.SPR_DEMO,    0, null,    null, Wolf.st_chase1 ], // Wolf.st_shoot5,
            [ 0, Wolf.SPR_DEMO,    0, null,    null, Wolf.st_chase1 ], // Wolf.st_shoot6,
            [ 0, Wolf.SPR_DEMO,    0, null,    null, Wolf.st_chase1 ], // Wolf.st_shoot7,
            [ 0, Wolf.SPR_DEMO,    0, null,    null, Wolf.st_chase1 ], // Wolf.st_shoot8,
            [ 0, Wolf.SPR_DEMO,    0, null,    null, Wolf.st_chase1 ], // Wolf.st_shoot9,

            [ 1, Wolf.SPR_GRD_W1_1, 10, Wolf.AI.T_Chase,    null, Wolf.st_chase1s ], // Wolf.st_chase1,
            [ 1, Wolf.SPR_GRD_W1_1,  3, null,               null, Wolf.st_chase2  ], // Wolf.st_chase1s,
            [ 1, Wolf.SPR_GRD_W2_1,  8, Wolf.AI.T_Chase,    null, Wolf.st_chase3  ], // Wolf.st_chase2,
            [ 1, Wolf.SPR_GRD_W3_1, 10, Wolf.AI.T_Chase,    null, Wolf.st_chase3s ], // Wolf.st_chase3,
            [ 1, Wolf.SPR_GRD_W3_1,  3, null,               null, Wolf.st_chase4  ], // Wolf.st_chase3s,
            [ 1, Wolf.SPR_GRD_W4_1,  8, Wolf.AI.T_Chase,    null, Wolf.st_chase1  ], // Wolf.st_chase4,

            [ 0, Wolf.SPR_GRD_DIE_1, 15, null, Wolf.ActorAI.deathScream,    Wolf.st_die2 ], // Wolf.st_die1,
            [ 0, Wolf.SPR_GRD_DIE_2, 15, null, null,                        Wolf.st_die3 ], // Wolf.st_die2,
            [ 0, Wolf.SPR_GRD_DIE_3, 15, null, null,                        Wolf.st_dead ], // Wolf.st_die3,

            [ 0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead ], // Wolf.st_die4,
            [ 0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead ], // Wolf.st_die5,
            [ 0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead ], // Wolf.st_die6,
            [ 0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead ], // Wolf.st_die7,
            [ 0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead ], // Wolf.st_die8,
            [ 0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead ], // Wolf.st_die9,

            [ 0, Wolf.SPR_GRD_DEAD,    0, null,     null, Wolf.st_dead ] // Wolf.st_dead
        ],
        // en_officer,
        [
            [1, Wolf.SPR_OFC_S_1,   0,  Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [1, Wolf.SPR_OFC_W1_1,  20, Wolf.AI.T_Path, null, Wolf.st_path1s],// Wolf.st_path1,
            [1, Wolf.SPR_OFC_W1_1,  5,  null,           null, Wolf.st_path2], // Wolf.st_path1s,
            [1, Wolf.SPR_OFC_W2_1,  15, Wolf.AI.T_Path, null, Wolf.st_path3], // Wolf.st_path2,
            [1, Wolf.SPR_OFC_W3_1,  20, Wolf.AI.T_Path, null, Wolf.st_path3s],// Wolf.st_path3,
            [1, Wolf.SPR_OFC_W3_1,  5,  null,           null, Wolf.st_path4], // Wolf.st_path3s,
            [1, Wolf.SPR_OFC_W4_1,  15, Wolf.AI.T_Path, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_OFC_PAIN_1,    10, null,     null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_OFC_PAIN_2,    10, null,     null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_OFC_SHOOT1,     6, null,     null,             Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_OFC_SHOOT2,    20, null,     Wolf.AI.T_Shoot,  Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_OFC_SHOOT3,    10, null,     null,             Wolf.st_chase1],// Wolf.st_shoot3,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot4,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot5,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot9,

            [1, Wolf.SPR_OFC_W1_1, 10, Wolf.AI.T_Chase, null, Wolf.st_chase1s],// Wolf.st_chase1,
            [1, Wolf.SPR_OFC_W1_1,  3, null,            null, Wolf.st_chase2], // Wolf.st_chase1s,
            [1, Wolf.SPR_OFC_W2_1,  8, Wolf.AI.T_Chase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [1, Wolf.SPR_OFC_W3_1, 10, Wolf.AI.T_Chase, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [1, Wolf.SPR_OFC_W3_1,  3, null,            null, Wolf.st_chase4], // Wolf.st_chase3s,
            [1, Wolf.SPR_OFC_W4_1,  8, Wolf.AI.T_Chase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_OFC_DIE_1, 11, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_OFC_DIE_2, 11, null, null,                     Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_OFC_DIE_3, 11, null, null,                     Wolf.st_dead],// Wolf.st_die3,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_OFC_DEAD,    0, null,     null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_ss,
        [
            [1, Wolf.SPR_SS_S_1,     0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [1, Wolf.SPR_SS_W1_1,   20, Wolf.AI.T_Path, null, Wolf.st_path1s],// Wolf.st_path1,
            [1, Wolf.SPR_SS_W1_1,   5,  null,           null, Wolf.st_path2], // Wolf.st_path1s,
            [1, Wolf.SPR_SS_W2_1,   15, Wolf.AI.T_Path, null, Wolf.st_path3], // Wolf.st_path2,
            [1, Wolf.SPR_SS_W3_1,   20, Wolf.AI.T_Path, null, Wolf.st_path3s],// Wolf.st_path3,
            [1, Wolf.SPR_SS_W3_1,   5,  null,           null, Wolf.st_path4], // Wolf.st_path3s,
            [1, Wolf.SPR_SS_W4_1,   15, Wolf.AI.T_Path, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_SS_PAIN_1,    10, null,     null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_SS_PAIN_2,    10, null,     null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_SS_SHOOT1, 20, null, null,             Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_SS_SHOOT2, 20, null, Wolf.AI.T_Shoot,  Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_SS_SHOOT3, 10, null, null,             Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_SS_SHOOT2, 10, null, Wolf.AI.T_Shoot,  Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_SS_SHOOT3, 10, null, null,             Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_SS_SHOOT2, 10, null, Wolf.AI.T_Shoot,  Wolf.st_shoot7],// Wolf.st_shoot6,
            [0, Wolf.SPR_SS_SHOOT3, 10, null, null,             Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_SS_SHOOT2, 10, null, Wolf.AI.T_Shoot,  Wolf.st_shoot9],// Wolf.st_shoot8,
            [0, Wolf.SPR_SS_SHOOT3, 10, null, null,             Wolf.st_chase1],// Wolf.st_shoot9,

            [1, Wolf.SPR_SS_W1_1, 10, Wolf.AI.T_Chase,  null, Wolf.st_chase1s],// Wolf.st_chase1,
            [1, Wolf.SPR_SS_W1_1,  3, null,             null, Wolf.st_chase2], // Wolf.st_chase1s,
            [1, Wolf.SPR_SS_W2_1,  8, Wolf.AI.T_Chase,  null, Wolf.st_chase3], // Wolf.st_chase2,
            [1, Wolf.SPR_SS_W3_1, 10, Wolf.AI.T_Chase,  null, Wolf.st_chase3s],// Wolf.st_chase3,
            [1, Wolf.SPR_SS_W3_1,  3, null,             null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [1, Wolf.SPR_SS_W4_1,  8, Wolf.AI.T_Chase,  null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_SS_DIE_1, 15, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_SS_DIE_2, 15, null, null,                     Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_SS_DIE_3, 15, null, null,                     Wolf.st_dead],// Wolf.st_die3,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_SS_DEAD,    0, null,     null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_dog,
        [
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_stand], // Wolf.st_stand,

            [1, Wolf.SPR_DOG_W1_1,      20, Wolf.AI.T_Path, null, Wolf.st_path1s],// Wolf.st_path1,
            [1, Wolf.SPR_DOG_W1_1,      5,  null,           null, Wolf.st_path2], // Wolf.st_path1s,
            [1, Wolf.SPR_DOG_W2_1,      15, Wolf.AI.T_Path, null, Wolf.st_path3], // Wolf.st_path2,
            [1, Wolf.SPR_DOG_W3_1,      20, Wolf.AI.T_Path, null, Wolf.st_path3s],// Wolf.st_path3,
            [1, Wolf.SPR_DOG_W3_1,      5,  null,           null, Wolf.st_path4], // Wolf.st_path3s,
            [1, Wolf.SPR_DOG_W4_1,      15, Wolf.AI.T_Path, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_DOG_JUMP1, 10, null,     null,     Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_DOG_JUMP2, 10, null,     Wolf.AI.T_Bite, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_DOG_JUMP3, 10, null,     null,   Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_DOG_JUMP1, 10, null,     null,     Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_DOG_W1_1,     10, null,     null,     Wolf.st_chase1],// Wolf.st_shoot5,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot9,

            [1, Wolf.SPR_DOG_W1_1, 10, Wolf.AI.T_DogChase, null, Wolf.st_chase1s],// Wolf.st_chase1,
            [1, Wolf.SPR_DOG_W1_1,  3, null            , null, Wolf.st_chase2], // Wolf.st_chase1s,
            [1, Wolf.SPR_DOG_W2_1,  8, Wolf.AI.T_DogChase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [1, Wolf.SPR_DOG_W3_1, 10, Wolf.AI.T_DogChase, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [1, Wolf.SPR_DOG_W3_1,  3, null            , null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [1, Wolf.SPR_DOG_W4_1,  8, Wolf.AI.T_DogChase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_DOG_DIE_1, 15, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_DOG_DIE_2, 15, null, null,                    Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_DOG_DIE_3, 15, null, null,                    Wolf.st_dead],// Wolf.st_die3,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_DOG_DEAD,    0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_boss,
        [
            [0, Wolf.SPR_BOSS_W1,    0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_BOSS_SHOOT1, 30, null, null,        Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_BOSS_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_BOSS_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_BOSS_SHOOT2, 10, null, Wolf.AI.T_Shoot,    Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_BOSS_SHOOT3, 10, null, Wolf.AI.T_Shoot,    Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_BOSS_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot7],// Wolf.st_shoot6,
            [0, Wolf.SPR_BOSS_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_BOSS_SHOOT1, 10, null, null,        Wolf.st_chase1],// Wolf.st_shoot8,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_BOSS_W1, 10, Wolf.AI.T_Chase, null, Wolf.st_chase1s],// Wolf.st_chase1,
            [0, Wolf.SPR_BOSS_W1,  3, null        , null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_BOSS_W2,  8, Wolf.AI.T_Chase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_BOSS_W3, 10, Wolf.AI.T_Chase, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_BOSS_W3,  3, null        , null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_BOSS_W4,  8, Wolf.AI.T_Chase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_BOSS_DIE1, 15, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_BOSS_DIE2, 15, null, null,                    Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_BOSS_DIE3, 15, null, null,                    Wolf.st_dead],// Wolf.st_die3,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_BOSS_DEAD, 0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_schabbs,
        [
            [0, Wolf.SPR_SCHABB_W1,    0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_SCHABB_SHOOT1, 30, null, null,     Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_SCHABB_SHOOT2, 10, null, Wolf.AI.T_Launch, Wolf.st_chase1],// Wolf.st_shoot2,
            
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot3,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],//  Wolf.st_shoot4,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot5,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_SCHABB_W1, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase1s],// Wolf.st_chase1,
            [0, Wolf.SPR_SCHABB_W1,  3, null            , null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_SCHABB_W2,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_SCHABB_W3, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_SCHABB_W3,  3, null            , null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_SCHABB_W4,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_SCHABB_W1,        10, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_SCHABB_W1,        10, null, null,                     Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_SCHABB_DIE1,    10, null, null,                     Wolf.st_die4],// Wolf.st_die3,
            [0, Wolf.SPR_SCHABB_DIE2,    10, null, null,                     Wolf.st_die5],// Wolf.st_die4,
            [0, Wolf.SPR_SCHABB_DIE3,    10, null, null,                     Wolf.st_dead],// Wolf.st_die5,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_SCHABB_DEAD, 0, null, Wolf.ActorAI.startDeathCam, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_fake,
        [
            [0, Wolf.SPR_FAKE_W1,    0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, Wolf.AI.T_Launch, Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, Wolf.AI.T_Launch, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, Wolf.AI.T_Launch, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, Wolf.AI.T_Launch, Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, Wolf.AI.T_Launch, Wolf.st_shoot6],// Wolf.st_shoot4,
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, Wolf.AI.T_Launch, Wolf.st_shoot7],// Wolf.st_shoot4,
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, Wolf.AI.T_Launch, Wolf.st_shoot8],// Wolf.st_shoot4,
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, Wolf.AI.T_Launch, Wolf.st_shoot9],// Wolf.st_shoot4,
            [0, Wolf.SPR_FAKE_SHOOT,    8, null, null,             Wolf.st_chase1],// Wolf.st_shoot4,

            [0, Wolf.SPR_FAKE_W1, 10, Wolf.AI.T_Fake,   null, Wolf.st_chase1s],// Wolf.st_chase1,
            [0, Wolf.SPR_FAKE_W1,  3, null,             null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_FAKE_W2,  8, Wolf.AI.T_Fake,   null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_FAKE_W3, 10, Wolf.AI.T_Fake,   null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_FAKE_W3,  3, null,             null, Wolf.st_chase4], // Wolf.st_chase3s,
            [0, Wolf.SPR_FAKE_W4,  8, Wolf.AI.T_Fake,   null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_FAKE_DIE1, 10, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_FAKE_DIE2, 10, null, null,                     Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_FAKE_DIE3, 10, null, null,                     Wolf.st_die4],// Wolf.st_die3,
            [0, Wolf.SPR_FAKE_DIE4, 10, null, null,                     Wolf.st_die5],// Wolf.st_die4,
            [0, Wolf.SPR_FAKE_DIE5, 10, null, null,                     Wolf.st_dead],// Wolf.st_die5,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_FAKE_DEAD, 0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_hitler, (mecha)
        [
            [0, Wolf.SPR_MECHA_W1,    0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_MECHA_SHOOT1, 30, null, null, Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_MECHA_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_MECHA_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_MECHA_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_MECHA_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_MECHA_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_chase1],// Wolf.st_shoot6,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot9],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_MECHA_W1, 10, Wolf.AI.T_Chase, Wolf.ActorAI.mechaSound, Wolf.st_chase1s],// Wolf.st_chase1,
            [0, Wolf.SPR_MECHA_W1,  6, null     , null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_MECHA_W2,  8, Wolf.AI.T_Chase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_MECHA_W3, 10, Wolf.AI.T_Chase, Wolf.ActorAI.mechaSound, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_MECHA_W3,  6, null     , null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_MECHA_W4,  8, Wolf.AI.T_Chase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_MECHA_DIE1, 10, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_MECHA_DIE2, 10, null, null,                     Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_MECHA_DIE3, 10, null, Wolf.ActorAI.hitlerMorph, Wolf.st_dead],// Wolf.st_die3,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_MECHA_DEAD, 0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_hitler,
        [
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_HITLER_SHOOT1, 30, null, null, Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_HITLER_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_HITLER_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_HITLER_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_HITLER_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_HITLER_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_chase1],// Wolf.st_shoot6,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot9],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_HITLER_W1, 6, Wolf.AI.T_Chase, null, Wolf.st_chase1s], // Wolf.st_chase1,
            [0, Wolf.SPR_HITLER_W1, 4, null     , null, Wolf.st_chase2],  // Wolf.st_chase1s,
            [0, Wolf.SPR_HITLER_W2, 2, Wolf.AI.T_Chase, null, Wolf.st_chase3],  // Wolf.st_chase2,
            [0, Wolf.SPR_HITLER_W3, 6, Wolf.AI.T_Chase, null, Wolf.st_chase3s], // Wolf.st_chase3,
            [0, Wolf.SPR_HITLER_W3, 4, null        , null, Wolf.st_chase4], // Wolf.st_chase3s,
            [0, Wolf.SPR_HITLER_W4, 2, Wolf.AI.T_Chase, null, Wolf.st_chase1],  // Wolf.st_chase4,

            [0, Wolf.SPR_HITLER_W1,    1, null, Wolf.ActorAI.deathScream,  Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_HITLER_W1,     10, null, null, Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_HITLER_DIE1, 10, null, null, Wolf.st_die4],// Wolf.st_die3,
            [0, Wolf.SPR_HITLER_DIE2, 10, null, null, Wolf.st_die5],// Wolf.st_die4,
            [0, Wolf.SPR_HITLER_DIE3, 10, null, null, Wolf.st_die6],// Wolf.st_die5,
            [0, Wolf.SPR_HITLER_DIE4, 10, null, null, Wolf.st_die7],// Wolf.st_die6,
            [0, Wolf.SPR_HITLER_DIE5, 10, null, null, Wolf.st_die8],// Wolf.st_die7,
            [0, Wolf.SPR_HITLER_DIE6, 10, null, null, Wolf.st_die9],// Wolf.st_die8,
            [0, Wolf.SPR_HITLER_DIE7, 10, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_HITLER_DEAD, 0, null, Wolf.ActorAI.startDeathCam, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_mutant,
        [
            [1, Wolf.SPR_MUT_S_1,     0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [1, Wolf.SPR_MUT_W1_1,    20, Wolf.AI.T_Path,     null, Wolf.st_path1s],// Wolf.st_path1,
            [1, Wolf.SPR_MUT_W1_1,  5, null    ,  null, Wolf.st_path2], // Wolf.st_path1s,
            [1, Wolf.SPR_MUT_W2_1, 15, Wolf.AI.T_Path,  null, Wolf.st_path3], // Wolf.st_path2,
            [1, Wolf.SPR_MUT_W3_1,    20, Wolf.AI.T_Path,     null, Wolf.st_path3s],// Wolf.st_path3,
            [1, Wolf.SPR_MUT_W3_1,     5, null    ,     null, Wolf.st_path4], // Wolf.st_path3s,
            [1, Wolf.SPR_MUT_W4_1,    15, Wolf.AI.T_Path,     null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_MUT_PAIN_1,    10, null,     null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_MUT_PAIN_2,    10, null,     null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_MUT_SHOOT1,     6, null, Wolf.AI.T_Shoot, Wolf.st_shoot2], // Wolf.st_shoot1,
            [0, Wolf.SPR_MUT_SHOOT2,    20, null, null,         Wolf.st_shoot3], // Wolf.st_shoot2,
            [0, Wolf.SPR_MUT_SHOOT3,    10, null, Wolf.AI.T_Shoot, Wolf.st_shoot4], // Wolf.st_shoot3,
            [0, Wolf.SPR_MUT_SHOOT4,    20, null, null,         Wolf.st_chase1], // Wolf.st_shoot4,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot5,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot9,

            [1, Wolf.SPR_MUT_W1_1, 10, Wolf.AI.T_Chase, null, Wolf.st_chase1s],// Wolf.st_chase1,
            [1, Wolf.SPR_MUT_W1_1,  3, null     , null, Wolf.st_chase2], // Wolf.st_chase1s,
            [1, Wolf.SPR_MUT_W2_1,  8, Wolf.AI.T_Chase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [1, Wolf.SPR_MUT_W3_1, 10, Wolf.AI.T_Chase, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [1, Wolf.SPR_MUT_W3_1,  3, null     , null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [1, Wolf.SPR_MUT_W4_1,  8, Wolf.AI.T_Chase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_MUT_DIE_1, 7, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_MUT_DIE_2, 7, null, null,                     Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_MUT_DIE_3, 7, null, null,                     Wolf.st_die4],// Wolf.st_die3,
            [0, Wolf.SPR_MUT_DIE_4, 7, null, null,                     Wolf.st_dead],// Wolf.st_die4,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_MUT_DEAD,    0, null,     null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_blinky,
        [
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot9],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_BLINKY_W1, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase2],// Wolf.st_chase1,
            [0, Wolf.SPR_DEMO,  0, null, null, Wolf.st_chase2],            // Wolf.st_chase1s,
            [0, Wolf.SPR_BLINKY_W2, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase1],// Wolf.st_chase2,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_dead],// Wolf.st_die3,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_clyde,
        [
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot9],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_CLYDE_W1, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase2],// Wolf.st_chase1,
            [0, Wolf.SPR_DEMO,  0, null, null, Wolf.st_chase2],            // Wolf.st_chase1s,
            [0, Wolf.SPR_CLYDE_W2, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase1],// Wolf.st_chase2,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_dead],// Wolf.st_die3,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_pinky,
        [
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot9],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_PINKY_W1, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase2],// Wolf.st_chase1,
            [0, Wolf.SPR_DEMO,  0, null, null, Wolf.st_chase2],            // Wolf.st_chase1s,
            [0, Wolf.SPR_PINKY_W2, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase1],// Wolf.st_chase2,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_dead],// Wolf.st_die3,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_inky,
        [
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_shoot9],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_INKY_W1, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase2],// Wolf.st_chase1,
            [0, Wolf.SPR_DEMO,  0, null, null, Wolf.st_chase2],            // Wolf.st_chase1s,
            [0, Wolf.SPR_INKY_W2, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase1],// Wolf.st_chase2,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_DEMO, 10, null, null, Wolf.st_dead],// Wolf.st_die3,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_gretel,
        [
            [0, Wolf.SPR_GRETEL_W1,    0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_GRETEL_SHOOT1, 30, null, null,        Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_GRETEL_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_GRETEL_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_GRETEL_SHOOT2, 10, null, Wolf.AI.T_Shoot,    Wolf.st_shoot5],// Wolf.st_shoot4,
            [0, Wolf.SPR_GRETEL_SHOOT3, 10, null, Wolf.AI.T_Shoot,    Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_GRETEL_SHOOT2, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot7],// Wolf.st_shoot6,
            [0, Wolf.SPR_GRETEL_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot8],// Wolf.st_shoot7,
            [0, Wolf.SPR_GRETEL_SHOOT1, 10, null, null,        Wolf.st_chase1],// Wolf.st_shoot8,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_GRETEL_W1, 10, Wolf.AI.T_Chase, null, Wolf.st_chase1s],// Wolf.st_chase1,
            [0, Wolf.SPR_GRETEL_W1,  3, null        , null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_GRETEL_W2,  8, Wolf.AI.T_Chase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_GRETEL_W3, 10, Wolf.AI.T_Chase, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_GRETEL_W3,  3, null        , null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_GRETEL_W4,  8, Wolf.AI.T_Chase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_GRETEL_DIE1, 15, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_GRETEL_DIE2, 15, null, null,                    Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_GRETEL_DIE3, 15, null, null,                    Wolf.st_dead],// Wolf.st_die3,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die4,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die5,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_GRETEL_DEAD, 0, null, null, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_gift,
        [
            [0, Wolf.SPR_GIFT_W1,    0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_GIFT_SHOOT1, 30, null, null,     Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_GIFT_SHOOT2, 10, null, Wolf.AI.T_Launch, Wolf.st_chase1],// Wolf.st_shoot2,
            
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot3,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],//  Wolf.st_shoot4,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot5,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot6,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_GIFT_W1, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase1s],// Wolf.st_chase1,
            [0, Wolf.SPR_GIFT_W1,  3, null            , null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_GIFT_W2,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_GIFT_W3, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_GIFT_W3,  3, null            , null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_GIFT_W4,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_GIFT_W1,     10, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_GIFT_W1,     10, null, null,                     Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_GIFT_DIE1, 10, null, null,                     Wolf.st_die4],// Wolf.st_die3,
            [0, Wolf.SPR_GIFT_DIE2, 10, null, null,                     Wolf.st_die5],// Wolf.st_die4,
            [0, Wolf.SPR_GIFT_DIE3, 10, null, null,                     Wolf.st_dead],// Wolf.st_die5,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_GIFT_DEAD, 0, null, Wolf.ActorAI.startDeathCam, Wolf.st_dead] // Wolf.st_dead
        ],
        // en_fat,
        [
            [0, Wolf.SPR_FAT_W1,    0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1s],// Wolf.st_path1,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path3s],// Wolf.st_path3,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_DEMO, 0, null, null, Wolf.st_path1], // Wolf.st_path4,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_chase1],// Wolf.st_pain1,
        
            [0, Wolf.SPR_FAT_SHOOT1, 30, null, null,                 Wolf.st_shoot2],// Wolf.st_shoot1,
            [0, Wolf.SPR_FAT_SHOOT2, 10, null, Wolf.AI.T_Launch, Wolf.st_shoot3],// Wolf.st_shoot2,
            [0, Wolf.SPR_FAT_SHOOT3,    10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot4],// Wolf.st_shoot3,
            [0, Wolf.SPR_FAT_SHOOT4,    10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot5],//  Wolf.st_shoot4,
            [0, Wolf.SPR_FAT_SHOOT3,    10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot6],// Wolf.st_shoot5,
            [0, Wolf.SPR_FAT_SHOOT4,    10, null,    Wolf.AI.T_Shoot, Wolf.st_chase1],// Wolf.st_shoot6,

            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot7,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot8,
            [0, Wolf.SPR_DEMO,    0, null,     null, Wolf.st_chase1],// Wolf.st_shoot9,

            [0, Wolf.SPR_FAT_W1, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase1s],// Wolf.st_chase1,
            [0, Wolf.SPR_FAT_W1,  3, null       , null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_FAT_W2,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_FAT_W3, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase3s],// Wolf.st_chase3,
            [0, Wolf.SPR_FAT_W3,  3, null       , null, Wolf.st_chase4],     // Wolf.st_chase3s,
            [0, Wolf.SPR_FAT_W4,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_FAT_W1,        10, null, Wolf.ActorAI.deathScream, Wolf.st_die2],// Wolf.st_die1,
            [0, Wolf.SPR_FAT_W1,        10, null, null,                     Wolf.st_die3],// Wolf.st_die2,
            [0, Wolf.SPR_FAT_DIE1, 10, null, null,                     Wolf.st_die4],// Wolf.st_die3,
            [0, Wolf.SPR_FAT_DIE2,    10, null, null,                     Wolf.st_die5],// Wolf.st_die4,
            [0, Wolf.SPR_FAT_DIE3,    10, null, null,                     Wolf.st_dead],// Wolf.st_die5,

            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die6,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die7,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die8,
            [0, Wolf.SPR_DEMO,    0, null, null, Wolf.st_dead],// Wolf.st_die9,

            [0, Wolf.SPR_FAT_DEAD, 0, null, Wolf.ActorAI.startDeathCam, Wolf.st_dead] // Wolf.st_dead
        ],
    // --- Projectiles
        // en_needle,
        [
            ST_INFO_NULL, // Wolf.st_stand,

            [0, Wolf.SPR_HYPO1, 6, Wolf.AI.T_Projectile, null, Wolf.st_path2], // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            [0, Wolf.SPR_HYPO2, 6, Wolf.AI.T_Projectile, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_HYPO3, 6, Wolf.AI.T_Projectile, null, Wolf.st_path4], // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            [0, Wolf.SPR_HYPO4, 6, Wolf.AI.T_Projectile, null, Wolf.st_path1], // Wolf.st_path4,

            ST_INFO_NULL,// Wolf.st_pain,
            ST_INFO_NULL,// Wolf.st_pain1,
        
            ST_INFO_NULL,// Wolf.st_shoot1,
            ST_INFO_NULL,// Wolf.st_shoot2,
            ST_INFO_NULL,// Wolf.st_shoot3,
            ST_INFO_NULL,//  Wolf.st_shoot4,
            ST_INFO_NULL,// Wolf.st_shoot5,
            ST_INFO_NULL,// Wolf.st_shoot6,

            ST_INFO_NULL,// Wolf.st_shoot7,
            ST_INFO_NULL,// Wolf.st_shoot8,
            ST_INFO_NULL,// Wolf.st_shoot9,

            ST_INFO_NULL,// Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            ST_INFO_NULL, // Wolf.st_chase2,
            ST_INFO_NULL,// Wolf.st_chase3,
            ST_INFO_NULL,     // Wolf.st_chase3s,
            ST_INFO_NULL, // Wolf.st_chase4,

            ST_INFO_NULL, // Wolf.st_die1,
            ST_INFO_NULL, // Wolf.st_die2,
            ST_INFO_NULL, // Wolf.st_die3,
            ST_INFO_NULL,// Wolf.st_die4,
            ST_INFO_NULL,// Wolf.st_die5,

            ST_INFO_NULL,// Wolf.st_die6,
            ST_INFO_NULL,// Wolf.st_die7,
            ST_INFO_NULL,// Wolf.st_die8,
            ST_INFO_NULL,// Wolf.st_die9,

            ST_INFO_NULL // Wolf.st_dead
        ],
        // en_fire,
        [
            ST_INFO_NULL, // Wolf.st_stand,

            [0, Wolf.SPR_FIRE1, 6, null, Wolf.AI.T_Projectile, Wolf.st_path2], // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            [0, Wolf.SPR_FIRE2, 6, null, Wolf.AI.T_Projectile, Wolf.st_path1], // Wolf.st_path2,
            ST_INFO_NULL, // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL,// Wolf.st_pain,
            ST_INFO_NULL,// Wolf.st_pain1,
        
            ST_INFO_NULL,// Wolf.st_shoot1,
            ST_INFO_NULL,// Wolf.st_shoot2,
            ST_INFO_NULL,// Wolf.st_shoot3,
            ST_INFO_NULL,//  Wolf.st_shoot4,
            ST_INFO_NULL,// Wolf.st_shoot5,
            ST_INFO_NULL,// Wolf.st_shoot6,

            ST_INFO_NULL,// Wolf.st_shoot7,
            ST_INFO_NULL,// Wolf.st_shoot8,
            ST_INFO_NULL,// Wolf.st_shoot9,

            ST_INFO_NULL,// Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            ST_INFO_NULL, // Wolf.st_chase2,
            ST_INFO_NULL,// Wolf.st_chase3,
            ST_INFO_NULL,     // Wolf.st_chase3s,
            ST_INFO_NULL, // Wolf.st_chase4,

            ST_INFO_NULL, // Wolf.st_die1,
            ST_INFO_NULL, // Wolf.st_die2,
            ST_INFO_NULL, // Wolf.st_die3,
            ST_INFO_NULL,// Wolf.st_die4,
            ST_INFO_NULL,// Wolf.st_die5,

            ST_INFO_NULL,// Wolf.st_die6,
            ST_INFO_NULL,// Wolf.st_die7,
            ST_INFO_NULL,// Wolf.st_die8,
            ST_INFO_NULL,// Wolf.st_die9,

            ST_INFO_NULL // Wolf.st_dead
        ],
        // en_rocket,
        [
            [1, Wolf.SPR_ROCKET_1, 3, Wolf.AI.T_Projectile, Wolf.ActorAI.smoke, Wolf.st_stand], // Wolf.st_stand,

            ST_INFO_NULL,// Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL,// Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL,// Wolf.st_pain,
            ST_INFO_NULL,// Wolf.st_pain1,
        
            ST_INFO_NULL,// Wolf.st_shoot1,
            ST_INFO_NULL,// Wolf.st_shoot2,
            ST_INFO_NULL,// Wolf.st_shoot3,
            ST_INFO_NULL,//  Wolf.st_shoot4,
            ST_INFO_NULL,// Wolf.st_shoot5,
            ST_INFO_NULL,// Wolf.st_shoot6,

            ST_INFO_NULL,// Wolf.st_shoot7,
            ST_INFO_NULL,// Wolf.st_shoot8,
            ST_INFO_NULL,// Wolf.st_shoot9,

            ST_INFO_NULL,// Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            ST_INFO_NULL, // Wolf.st_chase2,
            ST_INFO_NULL,// Wolf.st_chase3,
            ST_INFO_NULL,     // Wolf.st_chase3s,
            ST_INFO_NULL, // Wolf.st_chase4,

            [0, Wolf.SPR_BOOM_1, 6, null, null, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_BOOM_2, 6, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_BOOM_3, 6, null, null, Wolf.st_remove], // Wolf.st_die3,
            ST_INFO_NULL,// Wolf.st_die4,
            ST_INFO_NULL,// Wolf.st_die5,

            ST_INFO_NULL,// Wolf.st_die6,
            ST_INFO_NULL,// Wolf.st_die7,
            ST_INFO_NULL,// Wolf.st_die8,
            ST_INFO_NULL,// Wolf.st_die9,

            ST_INFO_NULL // Wolf.st_dead
        ],
        // en_smoke,
        [
            ST_INFO_NULL, // Wolf.st_stand,

            ST_INFO_NULL, // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL, // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL, // Wolf.st_pain,
            ST_INFO_NULL, // Wolf.st_pain1,
        
            ST_INFO_NULL, // Wolf.st_shoot1,
            ST_INFO_NULL, // Wolf.st_shoot2,
            ST_INFO_NULL, // Wolf.st_shoot3,
            ST_INFO_NULL, // Wolf.st_shoot4,
            ST_INFO_NULL, // Wolf.st_shoot5,
            ST_INFO_NULL, // Wolf.st_shoot6,

            ST_INFO_NULL, // Wolf.st_shoot7,
            ST_INFO_NULL, // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            ST_INFO_NULL, // Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            ST_INFO_NULL, // Wolf.st_chase2,
            ST_INFO_NULL, // Wolf.st_chase3,
            ST_INFO_NULL,    // Wolf.st_chase3s,
            ST_INFO_NULL, // Wolf.st_chase4,

            [0, Wolf.SPR_SMOKE_1, 3, null, null, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_SMOKE_2, 3, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_SMOKE_3, 3, null, null, Wolf.st_die4], // Wolf.st_die3,
            [0, Wolf.SPR_SMOKE_4, 3, null, null, Wolf.st_remove], // Wolf.st_die4,
            ST_INFO_NULL, // Wolf.st_die5,

            ST_INFO_NULL, // Wolf.st_die6,
            ST_INFO_NULL, // Wolf.st_die7,
            ST_INFO_NULL, // Wolf.st_die8,
            ST_INFO_NULL, // Wolf.st_die9,

            ST_INFO_NULL  // Wolf.st_dead
        ],
        // en_bj,
        [
            ST_INFO_NULL, // Wolf.st_stand,

            [0, Wolf.SPR_BJ_W1, 12, Wolf.AI.T_BJRun,    null, Wolf.st_path1s], // Wolf.st_path1,
            [0, Wolf.SPR_BJ_W1,  3, null,               null, Wolf.st_path2], // Wolf.st_path1s,
            [0, Wolf.SPR_BJ_W2,  8, Wolf.AI.T_BJRun,    null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_BJ_W3, 12, Wolf.AI.T_BJRun,    null, Wolf.st_path3s], // Wolf.st_path3,
            [0, Wolf.SPR_BJ_W3,  3, null,               null, Wolf.st_path4], // Wolf.st_path3s,
            [0, Wolf.SPR_BJ_W4,  8, Wolf.AI.T_BJRun,    null, Wolf.st_path1], // Wolf.st_path4,

            ST_INFO_NULL, // Wolf.st_pain,
            ST_INFO_NULL, // Wolf.st_pain1,
        
            [0, Wolf.SPR_BJ_JUMP1, 14, Wolf.AI.T_BJJump,    null,               Wolf.st_shoot2], // Wolf.st_shoot1,
            [0, Wolf.SPR_BJ_JUMP2, 14, Wolf.AI.T_BJJump,    Wolf.AI.T_BJYell,   Wolf.st_shoot3], // Wolf.st_shoot2,
            [0, Wolf.SPR_BJ_JUMP3, 14, Wolf.AI.T_BJJump,    null,               Wolf.st_shoot4], // Wolf.st_shoot3,
            [0, Wolf.SPR_BJ_JUMP4,150, null,                Wolf.AI.T_BJDone,   Wolf.st_shoot4], // Wolf.st_shoot4,
            ST_INFO_NULL, // Wolf.st_shoot5,
            ST_INFO_NULL, // Wolf.st_shoot6,

            ST_INFO_NULL, // Wolf.st_shoot7,
            ST_INFO_NULL, // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            ST_INFO_NULL, // Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            ST_INFO_NULL, // Wolf.st_chase2,
            ST_INFO_NULL, // Wolf.st_chase3,
            ST_INFO_NULL,    // Wolf.st_chase3s,
            ST_INFO_NULL, // Wolf.st_chase4,

            ST_INFO_NULL, // Wolf.st_die1,
            ST_INFO_NULL, // Wolf.st_die2,
            ST_INFO_NULL, // Wolf.st_die3,
            ST_INFO_NULL, // Wolf.st_die4,
            ST_INFO_NULL, // Wolf.st_die5,

            ST_INFO_NULL, // Wolf.st_die6,
            ST_INFO_NULL, // Wolf.st_die7,
            ST_INFO_NULL, // Wolf.st_die8,
            ST_INFO_NULL, // Wolf.st_die9,

            ST_INFO_NULL  // Wolf.st_dead
        ],

    // --- Spear of destiny!
        // en_spark,
        [
            ST_INFO_NULL, // Wolf.st_stand,

            [0, Wolf.SPR_SPARK1, 6, Wolf.AI.T_Projectile, null, Wolf.st_path2], // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            [0, Wolf.SPR_SPARK2, 6, Wolf.AI.T_Projectile, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_SPARK3, 6, Wolf.AI.T_Projectile, null, Wolf.st_path4], // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            [0, Wolf.SPR_SPARK4, 6, Wolf.AI.T_Projectile, null, Wolf.st_path1], // Wolf.st_path4,

            ST_INFO_NULL,// Wolf.st_pain,
            ST_INFO_NULL,// Wolf.st_pain1,
        
            ST_INFO_NULL,// Wolf.st_shoot1,
            ST_INFO_NULL,// Wolf.st_shoot2,
            ST_INFO_NULL,// Wolf.st_shoot3,
            ST_INFO_NULL,//  Wolf.st_shoot4,
            ST_INFO_NULL,// Wolf.st_shoot5,
            ST_INFO_NULL,// Wolf.st_shoot6,

            ST_INFO_NULL,// Wolf.st_shoot7,
            ST_INFO_NULL,// Wolf.st_shoot8,
            ST_INFO_NULL,// Wolf.st_shoot9,

            ST_INFO_NULL,// Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            ST_INFO_NULL, // Wolf.st_chase2,
            ST_INFO_NULL,// Wolf.st_chase3,
            ST_INFO_NULL,     // Wolf.st_chase3s,
            ST_INFO_NULL, // Wolf.st_chase4,

            ST_INFO_NULL, // Wolf.st_die1,
            ST_INFO_NULL, // Wolf.st_die2,
            ST_INFO_NULL, // Wolf.st_die3,
            ST_INFO_NULL,// Wolf.st_die4,
            ST_INFO_NULL,// Wolf.st_die5,

            ST_INFO_NULL,// Wolf.st_die6,
            ST_INFO_NULL,// Wolf.st_die7,
            ST_INFO_NULL,// Wolf.st_die8,
            ST_INFO_NULL,// Wolf.st_die9,

            ST_INFO_NULL // Wolf.st_dead
        ],
        // en_hrocket,
        [
            [1, Wolf.SPR_HROCKET_1, 3, Wolf.AI.T_Projectile, Wolf.ActorAI.smoke, Wolf.st_stand], // Wolf.st_stand,

            ST_INFO_NULL,// Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL,// Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL,// Wolf.st_pain,
            ST_INFO_NULL,// Wolf.st_pain1,
        
            ST_INFO_NULL,// Wolf.st_shoot1,
            ST_INFO_NULL,// Wolf.st_shoot2,
            ST_INFO_NULL,// Wolf.st_shoot3,
            ST_INFO_NULL,//  Wolf.st_shoot4,
            ST_INFO_NULL,// Wolf.st_shoot5,
            ST_INFO_NULL,// Wolf.st_shoot6,

            ST_INFO_NULL,// Wolf.st_shoot7,
            ST_INFO_NULL,// Wolf.st_shoot8,
            ST_INFO_NULL,// Wolf.st_shoot9,

            ST_INFO_NULL,// Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            ST_INFO_NULL, // Wolf.st_chase2,
            ST_INFO_NULL,// Wolf.st_chase3,
            ST_INFO_NULL,     // Wolf.st_chase3s,
            ST_INFO_NULL, // Wolf.st_chase4,

            [0, Wolf.SPR_HBOOM_1, 6, null, null, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_HBOOM_2, 6, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_HBOOM_3, 6, null, null, Wolf.st_remove], // Wolf.st_die3,
            ST_INFO_NULL,// Wolf.st_die4,
            ST_INFO_NULL,// Wolf.st_die5,

            ST_INFO_NULL,// Wolf.st_die6,
            ST_INFO_NULL,// Wolf.st_die7,
            ST_INFO_NULL,// Wolf.st_die8,
            ST_INFO_NULL,// Wolf.st_die9,

            ST_INFO_NULL // Wolf.st_dead
        ],
        // en_hsmoke,
        [
            ST_INFO_NULL, // Wolf.st_stand,

            ST_INFO_NULL, // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL, // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL, // Wolf.st_pain,
            ST_INFO_NULL, // Wolf.st_pain1,
        
            ST_INFO_NULL, // Wolf.st_shoot1,
            ST_INFO_NULL, // Wolf.st_shoot2,
            ST_INFO_NULL, // Wolf.st_shoot3,
            ST_INFO_NULL, // Wolf.st_shoot4,
            ST_INFO_NULL, // Wolf.st_shoot5,
            ST_INFO_NULL, // Wolf.st_shoot6,

            ST_INFO_NULL, // Wolf.st_shoot7,
            ST_INFO_NULL, // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            ST_INFO_NULL, // Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            ST_INFO_NULL, // Wolf.st_chase2,
            ST_INFO_NULL, // Wolf.st_chase3,
            ST_INFO_NULL,    // Wolf.st_chase3s,
            ST_INFO_NULL, // Wolf.st_chase4,

            [0, Wolf.SPR_HSMOKE_1, 3, null, null, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_HSMOKE_2, 3, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_HSMOKE_3, 3, null, null, Wolf.st_die4], // Wolf.st_die3,
            [0, Wolf.SPR_HSMOKE_4, 3, null, null, Wolf.st_remove], // Wolf.st_die4,
            ST_INFO_NULL, // Wolf.st_die5,

            ST_INFO_NULL, // Wolf.st_die6,
            ST_INFO_NULL, // Wolf.st_die7,
            ST_INFO_NULL, // Wolf.st_die8,
            ST_INFO_NULL, // Wolf.st_die9,

            ST_INFO_NULL  // Wolf.st_dead
        ],
        // en_spectre,
        [
            ST_INFO_NULL, // Wolf.st_stand,

            [0, Wolf.SPR_SPECTRE_W1, 10, Wolf.AI.T_Stand, null, Wolf.st_path2], // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            [0, Wolf.SPR_SPECTRE_W2, 10, Wolf.AI.T_Stand, null, Wolf.st_path3], // Wolf.st_path2,
            [0, Wolf.SPR_SPECTRE_W3, 10, Wolf.AI.T_Stand, null, Wolf.st_path4], // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            [0, Wolf.SPR_SPECTRE_W4, 10, Wolf.AI.T_Stand, null, Wolf.st_path1], // Wolf.st_path4,

            ST_INFO_NULL, // Wolf.st_pain,
            ST_INFO_NULL, // Wolf.st_pain1,
        
            ST_INFO_NULL, // Wolf.st_shoot1,
            ST_INFO_NULL, // Wolf.st_shoot2,
            ST_INFO_NULL, // Wolf.st_shoot3,
            ST_INFO_NULL, // Wolf.st_shoot4,
            ST_INFO_NULL, // Wolf.st_shoot5,
            ST_INFO_NULL, // Wolf.st_shoot6,

            ST_INFO_NULL, // Wolf.st_shoot7,
            ST_INFO_NULL, // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            [0, Wolf.SPR_SPECTRE_W1, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase2], // Wolf.st_chase1,
            ST_INFO_NULL, // Wolf.st_chase1s,
            [0, Wolf.SPR_SPECTRE_W2, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_SPECTRE_W3, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase4], // Wolf.st_chase3,
            ST_INFO_NULL,    // Wolf.st_chase3s,
            [0, Wolf.SPR_SPECTRE_W4, 10, Wolf.AI.T_Ghosts, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_SPECTRE_F1, 10, null, null, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_SPECTRE_F2, 10, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_SPECTRE_F3, 10, null, null, Wolf.st_die4], // Wolf.st_die3,
            [0, Wolf.SPR_SPECTRE_F4, 300, null, null, Wolf.st_die5], // Wolf.st_die4,
            [0, Wolf.SPR_SPECTRE_F4, 10, null, Wolf.ActorAI.dormant, Wolf.st_die5], // Wolf.st_die5,

            ST_INFO_NULL, // Wolf.st_die6,
            ST_INFO_NULL, // Wolf.st_die7,
            ST_INFO_NULL, // Wolf.st_die8,
            ST_INFO_NULL, // Wolf.st_die9,

            ST_INFO_NULL  // Wolf.st_dead
        ],
        // en_angel,
        [
            [0, Wolf.SPR_ANGEL_W1, 0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            ST_INFO_NULL, // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL, // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            [0, Wolf.SPR_ANGEL_TIRED1, 40, null,    Wolf.ActorAI.breathing, Wolf.st_pain1], // Wolf.st_pain,
            [0, Wolf.SPR_ANGEL_TIRED2, 40, null,    null, Wolf.st_shoot4], // Wolf.st_pain1,
        
            [0, Wolf.SPR_ANGEL_SHOOT1, 10, null,    Wolf.ActorAI.startAttack, Wolf.st_shoot2], // Wolf.st_shoot1,
            [0, Wolf.SPR_ANGEL_SHOOT2, 20, null,    Wolf.AI.T_Launch, Wolf.st_shoot3], // Wolf.st_shoot2,
            [0, Wolf.SPR_ANGEL_SHOOT1, 10, null,    Wolf.ActorAI.relaunch, Wolf.st_shoot2], // Wolf.st_shoot3,

            [0, Wolf.SPR_ANGEL_TIRED1, 40, null,    Wolf.ActorAI.breathing, Wolf.st_shoot5], // Wolf.st_shoot4,
            [0, Wolf.SPR_ANGEL_TIRED2, 40, null,    null, Wolf.st_shoot6], // Wolf.st_shoot5,
            [0, Wolf.SPR_ANGEL_TIRED1, 40, null,    Wolf.ActorAI.breathing, Wolf.st_shoot7], // Wolf.st_shoot6,
            [0, Wolf.SPR_ANGEL_TIRED2, 40, null,    null, Wolf.st_shoot8], // Wolf.st_shoot7,
            [0, Wolf.SPR_ANGEL_TIRED1, 40, null,    Wolf.ActorAI.breathing, Wolf.st_chase1], // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            [0, Wolf.SPR_ANGEL_W1, 10, Wolf.AI.T_BossChase,    null, Wolf.st_chase1s], // Wolf.st_chase1,
            [0, Wolf.SPR_ANGEL_W1,  3, null,        null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_ANGEL_W2,  8, Wolf.AI.T_BossChase,    null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_ANGEL_W3, 10, Wolf.AI.T_BossChase,    null, Wolf.st_chase3s], // Wolf.st_chase3,
            [0, Wolf.SPR_ANGEL_W3,  3, null,        null, Wolf.st_chase4],    // Wolf.st_chase3s,
            [0, Wolf.SPR_ANGEL_W4,  8, Wolf.AI.T_BossChase,    null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_ANGEL_W1, 1, null, Wolf.ActorAI.deathScream, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_ANGEL_W1, 1, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_ANGEL_DIE1, 10, null, Wolf.ActorAI.slurpie, Wolf.st_die4], // Wolf.st_die3,
            [0, Wolf.SPR_ANGEL_DIE2, 10, null, null, Wolf.st_die5], // Wolf.st_die4,
            [0, Wolf.SPR_ANGEL_DIE3, 10, null, null, Wolf.st_die6], // Wolf.st_die5,
            [0, Wolf.SPR_ANGEL_DIE4, 10, null, null, Wolf.st_die7], // Wolf.st_die6,
            [0, Wolf.SPR_ANGEL_DIE5, 10, null, null, Wolf.st_die8], // Wolf.st_die7,
            [0, Wolf.SPR_ANGEL_DIE6, 10, null, null, Wolf.st_die9], // Wolf.st_die8,
            [0, Wolf.SPR_ANGEL_DIE7, 10, null, null, Wolf.st_dead], // Wolf.st_die9,

            [0, Wolf.SPR_ANGEL_DEAD, 130, null, Wolf.ActorAI.victory, Wolf.st_dead]  // Wolf.st_dead
        ],
        // en_trans,
        [
            [0, Wolf.SPR_TRANS_W1, 0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            ST_INFO_NULL, // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL, // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL, // Wolf.st_pain,
            ST_INFO_NULL, // Wolf.st_pain1,
        
            [0, Wolf.SPR_TRANS_SHOOT1, 30, null,    null, Wolf.st_shoot2], // Wolf.st_shoot1,
            [0, Wolf.SPR_TRANS_SHOOT2, 10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot3], // Wolf.st_shoot2,
            [0, Wolf.SPR_TRANS_SHOOT3, 10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot4], // Wolf.st_shoot3,
            [0, Wolf.SPR_TRANS_SHOOT2, 10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot5], // Wolf.st_shoot4,
            [0, Wolf.SPR_TRANS_SHOOT3, 10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot6], // Wolf.st_shoot5,
            [0, Wolf.SPR_TRANS_SHOOT2, 10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot7], // Wolf.st_shoot6,
            [0, Wolf.SPR_TRANS_SHOOT3, 10, null,    Wolf.AI.T_Shoot, Wolf.st_shoot8], // Wolf.st_shoot7,
            [0, Wolf.SPR_TRANS_SHOOT1, 10, null,    null, Wolf.st_chase1], // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            [0, Wolf.SPR_TRANS_W1, 10, Wolf.AI.T_Chase, null, Wolf.st_chase1s], // Wolf.st_chase1,
            [0, Wolf.SPR_TRANS_W1,  3, null,         null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_TRANS_W2,  8, Wolf.AI.T_Chase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_TRANS_W3, 10, Wolf.AI.T_Chase, null, Wolf.st_chase3s], // Wolf.st_chase3,
            [0, Wolf.SPR_TRANS_W3,  3, null,         null, Wolf.st_chase4],    // Wolf.st_chase3s,
            [0, Wolf.SPR_TRANS_W4,  8, Wolf.AI.T_Chase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_TRANS_W1, 1, null, Wolf.ActorAI.deathScream, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_TRANS_W1, 1, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_TRANS_DIE1, 15, null, null, Wolf.st_die4], // Wolf.st_die3,
            [0, Wolf.SPR_TRANS_DIE2, 15, null, null, Wolf.st_die5], // Wolf.st_die4,
            [0, Wolf.SPR_TRANS_DIE3, 15, null, null, Wolf.st_dead], // Wolf.st_die5,
            ST_INFO_NULL, // Wolf.st_die6,
            ST_INFO_NULL, // Wolf.st_die7,
            ST_INFO_NULL, // Wolf.st_die8,
            ST_INFO_NULL, // Wolf.st_die9,

            [0, Wolf.SPR_TRANS_DEAD, 0, null, null, Wolf.st_dead]  // Wolf.st_dead
        ],
        // en_uber,
        [
            [0, Wolf.SPR_UBER_W1, 0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            ST_INFO_NULL, // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL, // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL, // Wolf.st_pain,
            ST_INFO_NULL, // Wolf.st_pain1,
        
            [0, Wolf.SPR_UBER_SHOOT1, 30, null, null, Wolf.st_shoot2], // Wolf.st_shoot1,
            [0, Wolf.SPR_UBER_SHOOT2, 12, null, Wolf.AI.T_UShoot, Wolf.st_shoot3], // Wolf.st_shoot2,
            [0, Wolf.SPR_UBER_SHOOT3, 12, null, Wolf.AI.T_UShoot, Wolf.st_shoot4], // Wolf.st_shoot3,
            [0, Wolf.SPR_UBER_SHOOT4, 12, null, Wolf.AI.T_UShoot, Wolf.st_shoot5], // Wolf.st_shoot4,
            [0, Wolf.SPR_UBER_SHOOT3, 12, null, Wolf.AI.T_UShoot, Wolf.st_shoot6], // Wolf.st_shoot5,
            [0, Wolf.SPR_UBER_SHOOT2, 12, null, Wolf.AI.T_UShoot, Wolf.st_shoot7], // Wolf.st_shoot6,
            [0, Wolf.SPR_UBER_SHOOT1, 12, null, null, Wolf.st_chase1], // Wolf.st_shoot7,
            ST_INFO_NULL, // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            [0, Wolf.SPR_UBER_W1, 10, Wolf.AI.T_Chase, null, Wolf.st_chase1s], // Wolf.st_chase1,
            [0, Wolf.SPR_UBER_W1,  3, null,         null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_UBER_W2,  8, Wolf.AI.T_Chase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_UBER_W3, 10, Wolf.AI.T_Chase, null, Wolf.st_chase3s], // Wolf.st_chase3,
            [0, Wolf.SPR_UBER_W3,  3, null,         null, Wolf.st_chase4],    // Wolf.st_chase3s,
            [0, Wolf.SPR_UBER_W4,  8, Wolf.AI.T_Chase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_UBER_W1, 1, null, Wolf.ActorAI.deathScream, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_UBER_W1, 1, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_UBER_DIE1, 15, null, null, Wolf.st_die4], // Wolf.st_die3,
            [0, Wolf.SPR_UBER_DIE2, 15, null, null, Wolf.st_die5], // Wolf.st_die4,
            [0, Wolf.SPR_UBER_DIE3, 15, null, null, Wolf.st_die6], // Wolf.st_die5,
            [0, Wolf.SPR_UBER_DIE4, 15, null, null, Wolf.st_dead], // Wolf.st_die6,
            ST_INFO_NULL, // Wolf.st_die7,
            ST_INFO_NULL, // Wolf.st_die8,
            ST_INFO_NULL, // Wolf.st_die9,

            [0, Wolf.SPR_UBER_DEAD, 0, null, null, Wolf.st_dead]  // Wolf.st_dead
        ],
        // en_will,
        [
            [0, Wolf.SPR_WILL_W1, 0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            ST_INFO_NULL, // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL, // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL, // Wolf.st_pain,
            ST_INFO_NULL, // Wolf.st_pain1,
        
            [0, Wolf.SPR_WILL_SHOOT1, 30, null, null, Wolf.st_shoot2], // Wolf.st_shoot1,
            [0, Wolf.SPR_WILL_SHOOT2, 10, null, Wolf.AI.T_Launch, Wolf.st_shoot3], // Wolf.st_shoot2,
            [0, Wolf.SPR_WILL_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot4], // Wolf.st_shoot3,
            [0, Wolf.SPR_WILL_SHOOT4, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot5], // Wolf.st_shoot4,
            [0, Wolf.SPR_WILL_SHOOT3, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot6], // Wolf.st_shoot5,
            [0, Wolf.SPR_WILL_SHOOT4, 10, null, Wolf.AI.T_Shoot, Wolf.st_chase1], // Wolf.st_shoot6,
            ST_INFO_NULL, // Wolf.st_shoot7,
            ST_INFO_NULL, // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            [0, Wolf.SPR_WILL_W1, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase1s], // Wolf.st_chase1,
            [0, Wolf.SPR_WILL_W1,  3, null,     null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_WILL_W2,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_WILL_W3, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase3s], // Wolf.st_chase3,
            [0, Wolf.SPR_WILL_W3,  3, null,     null, Wolf.st_chase4],    // Wolf.st_chase3s,
            [0, Wolf.SPR_WILL_W4,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_WILL_W1, 1, null, Wolf.ActorAI.deathScream, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_WILL_W1, 10, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_WILL_DIE1, 10, null, null, Wolf.st_die4], // Wolf.st_die3,
            [0, Wolf.SPR_WILL_DIE2, 10, null, null, Wolf.st_die5], // Wolf.st_die4,
            [0, Wolf.SPR_WILL_DIE3, 10, null, null, Wolf.st_dead], // Wolf.st_die5,
            ST_INFO_NULL, // Wolf.st_die6,
            ST_INFO_NULL, // Wolf.st_die7,
            ST_INFO_NULL, // Wolf.st_die8,
            ST_INFO_NULL, // Wolf.st_die9,

            [0, Wolf.SPR_WILL_DEAD, 20, null, null, Wolf.st_dead]  // Wolf.st_dead
        ],
        // en_death
        [
            [0, Wolf.SPR_DEATH_W1, 0, Wolf.AI.T_Stand, null, Wolf.st_stand], // Wolf.st_stand,

            ST_INFO_NULL, // Wolf.st_path1,
            ST_INFO_NULL, // Wolf.st_path1s,
            ST_INFO_NULL, // Wolf.st_path2,
            ST_INFO_NULL, // Wolf.st_path3,
            ST_INFO_NULL, // Wolf.st_path3s,
            ST_INFO_NULL, // Wolf.st_path4,

            ST_INFO_NULL, // Wolf.st_pain,
            ST_INFO_NULL, // Wolf.st_pain1,
        
            [0, Wolf.SPR_DEATH_SHOOT1, 30, null, null, Wolf.st_shoot2], // Wolf.st_shoot1,
            [0, Wolf.SPR_DEATH_SHOOT2, 10, null, Wolf.AI.T_Launch, Wolf.st_shoot3], // Wolf.st_shoot2,
            [0, Wolf.SPR_DEATH_SHOOT4, 10, null, Wolf.AI.T_Shoot, Wolf.st_shoot4], // Wolf.st_shoot3,
            [0, Wolf.SPR_DEATH_SHOOT3, 10, null, Wolf.AI.T_Launch, Wolf.st_shoot5], // Wolf.st_shoot4,
            [0, Wolf.SPR_DEATH_SHOOT4, 10, null, Wolf.AI.T_Shoot, Wolf.st_chase1], // Wolf.st_shoot5,
            ST_INFO_NULL, // Wolf.st_shoot6,
            ST_INFO_NULL, // Wolf.st_shoot7,
            ST_INFO_NULL, // Wolf.st_shoot8,
            ST_INFO_NULL, // Wolf.st_shoot9,

            [0, Wolf.SPR_DEATH_W1, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase1s], // Wolf.st_chase1,
            [0, Wolf.SPR_DEATH_W1,  3, null,      null, Wolf.st_chase2], // Wolf.st_chase1s,
            [0, Wolf.SPR_DEATH_W2,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase3], // Wolf.st_chase2,
            [0, Wolf.SPR_DEATH_W3, 10, Wolf.AI.T_BossChase, null, Wolf.st_chase3s], // Wolf.st_chase3,
            [0, Wolf.SPR_DEATH_W3,  3, null,      null, Wolf.st_chase4],    // Wolf.st_chase3s,
            [0, Wolf.SPR_DEATH_W4,  8, Wolf.AI.T_BossChase, null, Wolf.st_chase1], // Wolf.st_chase4,

            [0, Wolf.SPR_DEATH_W1, 1, null, Wolf.ActorAI.deathScream, Wolf.st_die2], // Wolf.st_die1,
            [0, Wolf.SPR_DEATH_W1, 10, null, null, Wolf.st_die3], // Wolf.st_die2,
            [0, Wolf.SPR_DEATH_DIE1, 10, null, null, Wolf.st_die4], // Wolf.st_die3,
            [0, Wolf.SPR_DEATH_DIE2, 10, null, null, Wolf.st_die5], // Wolf.st_die4,
            [0, Wolf.SPR_DEATH_DIE3, 10, null, null, Wolf.st_die6], // Wolf.st_die5,
            [0, Wolf.SPR_DEATH_DIE4, 10, null, null, Wolf.st_die7], // Wolf.st_die6,
            [0, Wolf.SPR_DEATH_DIE5, 10, null, null, Wolf.st_die7], // Wolf.st_die7,
            [0, Wolf.SPR_DEATH_DIE6, 10, null, null, Wolf.st_die7], // Wolf.st_die8,
            ST_INFO_NULL, // Wolf.st_die9,

            [0, Wolf.SPR_DEATH_DEAD, 0, null, null, Wolf.st_dead]  // Wolf.st_dead
        ]
    ];
    
    
    // int    starthitpoints[ 4 ][ NUMENEMIES ] =
    var starthitpoints = [
        //
        // BABY MODE
        //
        [
            25,     // guards
            50,     // officer
            100,    // SS
            1,      // dogs
            850,    // Hans
            850,    // Schabbs
            200,    // fake hitler
            800,    // mecha hitler
            500,    // hitler
            45,     // mutants
            25,     // ghosts
            25,     // ghosts
            25,     // ghosts
            25,     // ghosts

            850,    // Gretel
            850,    // Gift
            850,    // Fat
            // --- Projectiles
            0,      // en_needle,
            0,      // en_fire,
            0,      // en_rocket,
            0,      // en_smoke,
            100,    // en_bj,
            // --- Spear of destiny!
            0,      // en_spark,
            0,      // en_hrocket,
            0,      // en_hsmoke,

            5,      // en_spectre,
            1450,   // en_angel,
            850,    // en_trans,
            1050,   // en_uber,
            950,    // en_will,
            1250    // en_death
        ],
        
        //
        // DON'T HURT ME MODE
        //
        [
            25,     // guards
            50,     // officer
            100,    // SS
            1,      // dogs
            950,    // Hans
            950,    // Schabbs
            300,    // fake hitler
            950,    // mecha hitler
            700,    // hitler
            55,     // mutants
            25,     // ghosts
            25,     // ghosts
            25,     // ghosts
            25,     // ghosts

            950,    // Gretel
            950,    // Gift
            950,    // Fat
            // --- Projectiles
            0,      // en_needle,
            0,      // en_fire,
            0,      // en_rocket,
            0,      // en_smoke,
            100,    // en_bj,
            // --- Spear of destiny!
            0,      // en_spark,
            0,      // en_hrocket,
            0,      // en_hsmoke,

            10,     // en_spectre,
            1550,   // en_angel,
            950,    // en_trans,
            1150,   // en_uber,
            1050,   // en_will,
            1350    // en_death
        ],
        
        //
        // BRING 'EM ON MODE
        //
        [
            25,     // guards
            50,     // officer
            100,    // SS
            1,      // dogs

            1050,   // Hans
            1550,   // Schabbs
            400,    // fake hitler
            1050,   // mecha hitler
            800,    // hitler

            55,     // mutants
            25,     // ghosts
            25,     // ghosts
            25,     // ghosts
            25,     // ghosts

            1050,   // Gretel
            1050,   // Gift
            1050,   // Fat
            // --- Projectiles
            0,      // en_needle,
            0,      // en_fire,
            0,      // en_rocket,
            0,      // en_smoke,
            100,    // en_bj,
            // --- Spear of destiny!
            0,      // en_spark,
            0,      // en_hrocket,
            0,      // en_hsmoke,

            15,     // en_spectre,
            1650,   // en_angel,
            1050,   // en_trans,
            1250,   // en_uber,
            1150,   // en_will,
            1450    // en_death
        ],
        
        //
        // DEATH INCARNATE MODE
        //
        [
            25,     // guards
            50,     // officer
            100,    // SS
            1,      // dogs

            1200,   // Hans
            2400,   // Schabbs
            500,    // fake hitler
            1200,   // mecha hitler
            900,    // hitler

            65,     // mutants
            25,     // ghosts
            25,     // ghosts
            25,     // ghosts
            25,     // ghosts

            1200,   // Gretel
            1200,   // Gift
            1200,   // Fat
            // --- Projectiles
            0,      // en_needle,
            0,      // en_fire,
            0,      // en_rocket,
            0,      // en_smoke,
            100,    // en_bj,
            // --- Spear of destiny!
            0,      // en_spark,
            0,      // en_hrocket,
            0,      // en_hsmoke,

            25,     // en_spectre,
            2000,   // en_angel,
            1200,   // en_trans,
            1400,   // en_uber,
            1300,   // en_will,
            1600    // en_death
        ]
    ];
    
    /*  
    typedef struct
    {
        char rotate; // 1-if object can be rotated, 0 if one sprite for every direction
        int texture; // base object's state texture if rotation is on facing player
        int timeout; // after how man ticks change state to .next_state
        think_t think; // what to do every frame
        think_t action; // what to do once per state
        en_state next_state; // next state
    } 
    */
    
    // convert to state structs
    for (var i=0;i<objstate.length;i++) {
        var obj = objstate[i];
        for (var j=0;j<obj.length;j++) {
            var state = obj[j];
            obj[j] = {
                rotate      : state[0],
                texture     : state[1],
                timeout     : state[2],
                think       : state[3],
                action      : state[4],
                next_state  : state[5]
            };
        }
    }
    
    Wolf.setConsts({
        objstate : objstate,
        starthitpoints : starthitpoints
    });

})();