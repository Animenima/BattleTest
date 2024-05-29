$(document).ready(function () {

    $(window).ready(function(){
        Update();
    })

    let state = {
        exp: 0,
        str: 0,
        def: 0,
        hp: 10,
        maxhp: 10,
        expnext: 10,
        level: 1,
        points: 2,
        coins: 0,
    };

    let monstertest = {
        str: 0,
        def: 0,
        hp: 0,
        expreward: 0,
        maxhp: 0,
        coinreward: 0,
    };

    let monsters = {
        default: {
            str: 0,
            def: 0,
            hp: 0,
            expreward: 0,
            maxhp: 0,
            coinreward: 0,
        },
        m1: {
            str: 1,
            def: 0,
            hp: 5,
            expreward: 1,
            maxhp: 5,
            coinreward: 1,
        },
        m2: {
            str: 2,
            def: 2,
            hp: 10,
            expreward: 2,
            maxhp: 10,
            coinreward: 2,
        },
        m3: {
            str: 5,
            def: 4,
            hp: 20,
            expreward: 5,
            maxhp: 20,
            coinreward: 5,
        },
        m4: {
            str: 10,
            def: 8,
            hp: 35,
            expreward: 10,
            maxhp: 35,
            coinreward: 10,
        },
    }

    let items = {
        item1: 0,
        item1equip: 0,
    }

    $("#monsters").change(function () {
        var selectedMonsterKey = $(this).val();
        var selectedMonster = monsters[selectedMonsterKey];
        monstertest.str = selectedMonster.str;
        monstertest.def = selectedMonster.def;
        monstertest.hp = selectedMonster.hp;
        monstertest.expreward = selectedMonster.expreward;
        monstertest.maxhp = selectedMonster.maxhp;
        monstertest.coinreward = selectedMonster.coinreward;
        Update();
    });
    

    let progress = 0;

    $("#battle").click(function () {
        if (!IntervalID) {
            IntervalID =
        setInterval(Battle, 15);
        }
    });

    let IntervalID;

    $("#stopbattle").click(function () {
        clearInterval(IntervalID);
        IntervalID = null;
        progress = 0;
        $("#progressbar").css("width", "0%");
        Update();
    })

    $("#heal").click(function () {
        if (state.hp === state.maxhp) {
            alert("Already Full Health")
        } else {
        if (state.coins >= state.maxhp * 0.5) {
            state.hp = state.maxhp;
            state.coins -= state.maxhp * 0.5;
            Update();
        } else {
            alert("Not Enough Coins!");
            Update();
        }
    }
    })

    $("#increasestr").click(function () {
        if (state.points > 0) {
            state.str += 1;
            state.points -= 1;
            Update();
        }
        else {
            return "Not Enough Points";
            Update();
        }
    })

    $("#increasedef").click(function () {
        if (state.points > 0) {
            state.def += 1;
            state.points -= 1;
            Update();
        }
        else {
            return "Not Enough Points";
            Update();
        }
    })

    $("#inventory").click(function (){
        $("#inventorydialog").dialog("open");
    })

    $("#shop").click(function (){
        $("#shopdialog").dialog("open");
    })

    $("#item1").on("click", function(){
        items.item1 += 1;
        if (items.item1 >= 1){
            $("#item1equip").css("display", "block");
        }
        Update();
    })

    $("#item1equip").on("click", function(){
        if (items.item1 >= 1){
            if (items.item1equip >= 1) {
                alert("Already Equipped!");
            } else {
                items.item1equip = 1;
                state.str += 1;
                state.def += 1;
            }
        } else {
            alert("You don't have the item yet!");
        }
        Update();
    });

    function Update() {
        $("#exp").html("EXP: " + state.exp + "/" + state.expnext);
        $("#hp").html("HP: " + state.hp + "/" + state.maxhp);
        $("#str").html("STR: " + state.str);
        $("#def").html("DEF: " + state.def);
        $("#monsterhp").html("HP: " + monstertest.hp + "/" + monstertest.maxhp);
        $("#points").html("POINTS: " + state.points);
        $("#monsteratk").html("ATK: " + monstertest.str);
        $("#monsterdef").html("DEF: " + monstertest.def);
        $("#monsterexpreward").html("EXP REWARD: " + monstertest.expreward)
        $("#level").html("LEVEL: " + state.level);
        $("#coins").html("COINS: " + state.coins);
        if (state.exp >= state.expnext) {
            LevelUp();
        }
    };

    function Battle() {
        progress += (100 / 100);
        $("#progressbar").css("width", progress + "%");

        if (progress >= 100) {
            progress = 0
            $("#progressbar").css("width", "0%");

        if (monstertest.hp > 0) {
            if (monstertest.def < state.str) {
                monstertest.hp -= (state.str - monstertest.def)
                Update();
            }
            else {
                NoDamage();
                Update();
            };

            if (state.def < monstertest.str) {
                state.hp -= (monstertest.str - state.def);
                Update();
            }
            else {
                NoDamage();
                Update();
            }
            if (monstertest.hp <= 0) {
                monstertest.hp = 0;
                state.exp += monstertest.expreward;
                monstertest.hp = monstertest.maxhp;
                state.coins += monstertest.coinreward;
                Update();
            }
        }

        if (state.hp <= 0) {
            alert("You lose!");
            state.exp -= monstertest.expreward;
            state.hp = state.maxhp;
            clearInterval(IntervalID);
            IntervalID = null;
            Update();
        }
        if (state.exp <= 0) {
            state.exp = 0;
            Update();
        }
        }
    }

    function LevelUp () {
        if (state.exp >= state.expnext) {
            state.exp -= state.expnext;
            state.points += 2;
            state.maxhp += 5;
            state.expnext *= 2;
            state.level += 1;
            state.hp = state.maxhp;
            Update();
        }
        else {
            Update();
        }
    }

    function NoDamage() {
        return "No Damage";
    }
});