kontra.init();

kontra.assetPaths.images = "assets/images/";
var key_message_displayed = false;
var chest_message_displayed = false;
var player_has_key = false;
var player_found_pickaxe = false;
var oranges_felled = false;
var x_max = 228;
var x_min = 12;
var y_min = 5;
var y_max = 161;
var tree_x = 16;
var tree_y = 225;
var treasure_x;
var treasure_y;
var game_won = false;
var player_found_key = false;

function is_close(player, object_x, object_y) {
  if (Math.abs(player.x - object_x < 8) && Math.abs(player.y - object_y < 8)) {
    return true;
  }
  return false;
}

function get_tresure_position(boulders) {
  var sum = 0;
  var farthes_boulder;
  boulders.forEach(function(boulder) {
    if (boulder.x + boulder.y > sum) {
      farthes_boulder = boulder;
      sum = boulder.x + boulder.y;
    }
  });
  treasure_x = Math.abs(farthes_boulder.x - tree_x);
  treasure_y = Math.abs(farthes_boulder.y - tree_y);
}

kontra
  .loadAssets(
    "maize_background_small.png",
    "player.png",
    "pickaxe.png",
    "boulder.png",
    "key.png",
    "orange.png"
  )
  .then(function() {
    var orange = kontra.sprite({
        x: 40,
        y: 219,
        image: kontra.images.orange
      });
    var key = kontra.sprite({
      x: 188,
      y: 220,
      image: kontra.images.key
    });
    var rocks = [
      kontra.sprite({
        x: Math.floor(Math.random() * (115 - 13 + 1) + 13),
        y: Math.floor(Math.random() * (158 - 92 + 1) + 92),
        image: kontra.images.boulder,
        boulder_found: false,
        height: 32,
        width: 32
      }),
      kontra.sprite({
        x: Math.floor(Math.random() * (220 -135  + 1) + 135),
        y: Math.floor(Math.random() * (150 - 92 + 1) + 92),
        image: kontra.images.boulder,
        boulder_found: false,
        height: 32,
        width: 32
      }),
      kontra.sprite({
        x: Math.floor(Math.random() * (227 - 120 + 1) + 120),
        y: Math.floor(Math.random() * ( 71- 20 + 1) +20),
        image: kontra.images.boulder,
        boulder_found: false,
        height: 32,
        width: 32
      })
    ];

    var pick_axe = kontra.sprite({
      x: 220,
      y: 220,
      image: kontra.images.pickaxe
    });

    var background = kontra.sprite({
      x: 0,
      y: 0,
      image: kontra.images.maize_background_small
    });

    var player = kontra.sprite({
      x: 120,
      y: 240,
      image: kontra.images.player
    });
    get_tresure_position(rocks);
    var loop = kontra.gameLoop({
      update: function() {
        if (
          player.x == treasure_x &&
          player.y == treasure_y &&
          game_won == false
        ) {
          alert("you found it");
          game_won = true;
        }
        console.log(
          "Player position: x=" +
            player.x +
            " y= " +
            player.y +
            "treasure is at " +
            treasure_x +
            " " +
            treasure_y
        );
        if (kontra.keys.pressed("up")) {
          player.y -= 1;
        }
        if (kontra.keys.pressed("down")) {
          player.y += 1;
        }
        if (kontra.keys.pressed("left")) {
          player.x -= 1;
        }
        if (kontra.keys.pressed("right")) {
          player.x += 1;
        }
        if (kontra.keys.pressed("space")) {
          if (
            player_found_pickaxe &&
            is_close(player, treasure_x, treasure_y)
          ) {
            alert("You won");
            window.location = '';
            
          }
        }
        background.update();
        if (is_close(player, 16, 219) && key_message_displayed == false) {
          alert("You look at the roots of the tree and there you find a key");
          key_message_displayed = true;
          player_has_key = true;
          key.update();
          player_found_key = true;
        }
        function idea() {
          if (oranges_felled == false && is_close(player,16,225)) {
            alert(
              "ouch an orange fell on you head but thanks to it you rembered that you put 4 large rocks on the ground and that the treasure is at the crossing but the filed is so large you cant see anything well time to search for the rocks"
            );
            oranges_felled = true;
          }
        }

        if(oranges_felled==true){
            orange.update();
        }
        if (is_close(player, 16, 225)) {
          setTimeout(function() {
            idea();
          }, 3000);
        }

        if (
          is_close(player, 213, 191) &&
          chest_message_displayed == false &&
          player_has_key == true
        ) {
          alert("You open the chest and find a shovel");
          chest_message_displayed = true;
          pick_axe.update();
          player_found_pickaxe = true;
        }

        rocks.forEach(function(boulder) {
          if (boulder.collidesWith(player) && boulder.boulder_found == false) {
            alert("You found one of the rocks");
            boulder.boulder_found = true;
          }
          if (boulder.boulder_found == true) {
            boulder.update();
          }
        });
      },
      render: function() {
        background.render();
        player.render();
        rocks.forEach(function(boulder) {
          if (boulder.boulder_found == true) {
            boulder.render();
          }
        });
        if (player_found_pickaxe == true) {
          pick_axe.render();
        }
        if (player_found_key == true) {
          key.render();
        }
        if(oranges_felled==true){
            orange.render();
        }
      }
    });

    loop.start();
  });
