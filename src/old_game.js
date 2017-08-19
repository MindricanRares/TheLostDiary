kontra.init();

kontra.assetPaths.images = "assets/images/";
var game_page=false;
var key_message_displayed = false;
var chest_message_displayed = false;
var player_has_key = false;
var player_found_pickaxe = false;
var oranges_felled = false;
var treasure_x;
var treasure_y;
var game_won = false;
var player_found_key = false;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
var tree = new Point(16, 219);

function is_close(player, point) {
  if (Math.abs(player.x - point.x < 8) && Math.abs(player.y - point.y < 8)) {
    return true;
  }
  return false;
}

//works well if the boulders and tree form a rectangle
function get_tresure_position(boulders) {
  var sum = 0;
  var farthest_boulder;
  boulders.forEach(function (boulder) {
    if (boulder.x + boulder.y > sum) {
      farthest_boulder = boulder;
      sum = boulder.x + boulder.y;
    }
  });
  treasure_x = Math.abs(farthest_boulder.x - tree.x);
  treasure_y = Math.abs(farthest_boulder.y - tree.y);
}

kontra
  .loadAssets(
    "maize_background_small.png",
    "player.png",
    "pickaxe.png",
    "boulder.png",
    "key.png",
    "orange.png",
    "start_page.png"
  )
  .then(function () {
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
        x: Math.floor(Math.random() * (220 - 135 + 1) + 135),
        y: Math.floor(Math.random() * (150 - 92 + 1) + 92),
        image: kontra.images.boulder,
        boulder_found: false,
        height: 32,
        width: 32
      }),
      kontra.sprite({
        x: Math.floor(Math.random() * (227 - 120 + 1) + 120),
        y: Math.floor(Math.random() * (71 - 20 + 1) + 20),
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
    var start_page = kontra.sprite({
      x: 0,
      y: 0,
      image: kontra.images.start_page
    });
    get_tresure_position(rocks);
    var start_page_loop = kontra.gameLoop({
      update: function () {
        start_page.update();
        if (kontra.keys.pressed("space")) {
          start_page_loop.stop();
          loop.start();
        }
      },
      render: function () {
        start_page.render();
      }
    });
    var loop = kontra.gameLoop({
      update: function () {
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
        var treasure = new Point(treasure_x, treasure_y);
        if (kontra.keys.pressed("space")) {
          if (
            player_found_pickaxe &&
            is_close(player, treasure)
          ) {
            alert("You found your diary");
            window.location = '';
          }
        }
        if (is_close(player, tree) && key_message_displayed == false) {
          alert("You look at the roots of the tree and there you find a key");
          key_message_displayed = true;
          player_has_key = true;
          key.update();
          player_found_key = true;
        }

        function idea() {
          if (oranges_felled == false && is_close(player, tree)) {
            alert(
              "ouch an orange fell on you head but thanks to it you rembered that you put 4 large rocks on the ground and that the treasure is at the crossing but the filed is so large you cant see anything well time to search for the rocks"
            );
            oranges_felled = true;
          }
        }

        if (oranges_felled == true) {
          orange.update();
        }
        if (is_close(player, tree)) {
          setTimeout(function () {
            idea();
          }, 3000);
        }
        var chest = new Point(213, 101);
        if (
          is_close(player, chest) &&
          chest_message_displayed == false &&
          player_has_key == true
        ) {
          alert("You open the chest and find a shovel");
          chest_message_displayed = true;
          pick_axe.update();
          player_found_pickaxe = true;
        }

        rocks.forEach(function (boulder) {
          if (boulder.collidesWith(player) && boulder.boulder_found == false) {
            alert("You found a rock");
            boulder.boulder_found = true;
          }
          if (boulder.boulder_found == true) {
            boulder.update();
          }
        });
        background.update();
      },
      render: function () {
        background.render();
        player.render();
        rocks.forEach(function (boulder) {
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
        if (oranges_felled == true) {
          orange.render();
        }
      }
    });
    start_page_loop.start();

  });
