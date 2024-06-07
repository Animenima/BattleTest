$(document).ready(function () {

    $(window).ready(function(){
        Update();
    })

    let state = {
        exp: 0,
        str: 0,
        def: 0,
        hp: 100,
        maxhp: 100,
        expnext: 10,
        level: 1,
        points: 20,
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
            str: 10,
            def: 0,
            hp: 50,
            expreward: 1,
            maxhp: 50,
            coinreward: 10,
        },
        m2: {
            str: 20,
            def: 20,
            hp: 100,
            expreward: 2,
            maxhp: 100,
            coinreward: 20,
        },
        m3: {
            str: 50,
            def: 40,
            hp: 200,
            expreward: 5,
            maxhp: 200,
            coinreward: 50,
        },
        m4: {
            str: 100,
            def: 80,
            hp: 350,
            expreward: 10,
            maxhp: 350,
            coinreward: 100,
        },
        m5: {
            str: 0,
            def: 0,
            hp: 1,
            expreward: 10000,
            maxhp: 1,
            coinreward: 10000,
        },
    }

    let items = [
        { id: "item1", cost: 0, quantity: 0, equip: 0, strength: 50, defence: 0, type: "sword" },
        { id: "item2", cost: 0, quantity: 0, equip: 0, strength: 0, defence: 30, type: "shield" },
        { id: "item3", cost: 0, quantity: 0, equip: 0, strength: 0, defence: 50, type: "armor" },
        { id: "item4", cost: 0, quantity: 0, equip: 0, strength: 1000, defence: 1000, type: "sword" },
        { id: "item5", cost: 0, quantity: 0, equip: 0, strength: 100, defence: 0, type: "sword" },
        { id: "item6", cost: 0, quantity: 0, equip: 0, strength: 0, defence: 100, type: "shield" },
        { id: "item7", cost: 0, quantity: 0, equip: 0, strength: 0, defence: 200, type: "armor" },
    ]

    let currentlyEquippedItems = {
        sword: null,
        armor: null,
        shield: null,
    };

    $("#monsters").change(function () {
        var selectedMonsterKey = $(this).val();
        var selectedMonster = monsters[selectedMonsterKey];
        monstertest.str = selectedMonster.str;
        monstertest.def = selectedMonster.def;
        monstertest.hp = selectedMonster.hp;
        monstertest.expreward = selectedMonster.expreward;
        monstertest.maxhp = selectedMonster.maxhp;
        monstertest.coinreward = selectedMonster.coinreward;
        StopBattle();
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
        StopBattle();
        Update();
    })

    function StopBattle () {
        clearInterval(IntervalID);
        IntervalID = null;
        progress = 0;
        $("#progressbar").css("width", "0%");
        Update();
    }

    $("#heal").click(function () {
        if (state.hp === state.maxhp) {
            alert("Already Full Health")
        } else {
        if (state.coins >= state.maxhp * 0.5) {
            state.hp = state.maxhp;
            state.coins -= state.maxhp * 0.5;
        } else {
            alert("Not Enough Coins!");
        }
        Update();
    }
    })

    $("#increasestr").click(function () {
        if (state.points > 0) {
            state.str += 1;
            state.points -= 1;
        }
        else {
            alert("Not Enough Points");
        }
        Update();
    })

    $("#increasedef").click(function () {
        if (state.points > 0) {
            state.def += 1;
            state.points -= 1;
        }
        else {
            return "Not Enough Points";
        }
        Update();
    })

    $("#inventory").click(function (){
        $("#inventorydialog").dialog("open");
    })

    $("#shop").click(function (){
        $("#shopdialog").dialog("open");
    })

    $("#resetstats").on("click", function() {
        let equippedItems = Object.values(currentlyEquippedItems).filter(item => item !== null);
        if (state.str > 0 || state.def > 0) {
            if (equippedItems.length === 0) {
                state.points += state.str + state.def;
                state.str = 0;
                state.def = 0;
            } else {
                alert("Unequip First!");
                return;
            }
        } else {
            alert("Nothing To Reset!");
            return;
        }
        Update();
    });

    $("#unequipitems").on("click", function UnequipAllItems() {
        Object.keys(currentlyEquippedItems).forEach(function(type) {
            let item = currentlyEquippedItems[type];
            if (item) {
                state.str -= item.strength;
                state.def -= item.defence;
                item.equip = 0;
                currentlyEquippedItems[type] = null;
            }
        });
        Update();
    });
 

    //Buy Items
    items.forEach(function(item, index) {
        $("#" + item.id).on("click", function() {
            if (state.coins >= item.cost) {
                item.quantity += 1;
                state.coins -= item.cost;
                if (item.quantity >= 1) {
                    $("#" + item.id + "equip").css("display", "block");
                }
            } else {
                alert("Not Enough Coins!");
            }
        });
        Update();
    });


    //Equip Items
    items.forEach(function(item, index) {
        $("#" + item.id + "equip").on("click", function() {
            if (item.quantity >= 1 && item.equip === 0) {
                // Check currently equipped item of the same type
                let currentEquipped = currentlyEquippedItems[item.type];
                if (currentEquipped) {
                    currentEquipped.equip = 0;
                    state.str -= currentEquipped.strength;
                    state.def -= currentEquipped.defence;
                }
                item.equip = 1;
                state.str += item.strength;
                state.def += item.defence;
                currentlyEquippedItems[item.type] = item;
            } else if (item.equip === 1) {
                alert("Already Equipped!");
            }
        });
        Update();
    });

    function Update() {
        var experience = state.exp.toFixed(0);
        var experiencenext = state.expnext.toFixed(0);
        var coins = state.coins.toFixed(2);
        $("#exp").html("EXP: " + experience + "/" + experiencenext);
        $("#hp").html("HP: " + state.hp + "/" + state.maxhp);
        $("#str").html("STR: " + state.str);
        $("#def").html("DEF: " + state.def);
        $("#monsterhp").html("HP: " + monstertest.hp + "/" + monstertest.maxhp);
        $("#points").html("POINTS: " + state.points);
        $("#monsteratk").html("ATK: " + monstertest.str);
        $("#monsterdef").html("DEF: " + monstertest.def);
        $("#monsterexpreward").html("EXP REWARD: " + monstertest.expreward);
        $("#monstercoinreward").html("COIN REWARD: " + monstertest.coinreward);
        $("#level").html("LEVEL: " + state.level);
        $("#coins").html("COINS: " + coins);
        if (state.exp >= state.expnext) {
            LevelUp();
        }
        saveState(state);
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
            }
            else {
                NoDamage();
            };

            if (state.def < monstertest.str) {
                state.hp -= (monstertest.str - state.def);
            }
            else {
                NoDamage();
            }
            if (monstertest.hp <= 0) {
                monstertest.hp = 0;
                state.exp += monstertest.expreward;
                monstertest.hp = monstertest.maxhp;
                state.coins += monstertest.coinreward;
            }
        }

        if (state.hp <= 0) {
            alert("You lose!");
            state.exp -= monstertest.expreward;
            state.hp = state.maxhp;
            clearInterval(IntervalID);
            IntervalID = null;
        }
        if (state.exp <= 0) {
            state.exp = 0;
        }
        }
        Update();
    }

    function LevelUp () {
        if (state.exp >= state.expnext) {
            state.exp -= state.expnext;
            state.points += 20;
            state.maxhp += 50;
            state.expnext *= 1.2;
            state.level += 1;
            state.hp = state.maxhp;
        }
        Update();
    }

    function NoDamage() {
        alert("No Damage");
        Update();
    }
});