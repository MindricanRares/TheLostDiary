kontra.init();

var SIZE = 32;
var wall_list = [];
var number_of_keys=3;
var number_of_keys_colected=0;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function in_maze(row, col) {
  if (row > 0 && row < SIZE - 1 && col > 0 && col < SIZE - 1) {
    return true;
  }
  return false;
}

function add_walls(row, col) {
  var dir = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  for (var k = 0; k < dir.length; k++) {
    var wall_row = row + dir[k][0];
    var wall_col = col + dir[k][1];
    var cell_row = wall_row + dir[k][0];
    var cell_col = wall_col + dir[k][1];

    if (
      in_maze(wall_row, wall_col) == false ||
      in_maze(cell_row, cell_col) == false
    ) {
      continue;
    }
    wall_list.push([[wall_row, wall_col], [cell_row, cell_col]]);
  }
}

function create_maze(player) {
  var maze = [];
  for (var i = 0; i < SIZE; i++) {
    maze[i] = [];
    for (var j = 0; j < SIZE; j++) {
      maze[i][j] = "#";
    }
  }

  var cell_row = player.x / 16;
  var cell_col = player.y / 16;
  maze[cell_row][cell_col] = ".";
  add_walls(cell_row, cell_col);

  while (wall_list.length > 0) {
    var max = wall_list.length - 1;
    var min = 0;
    var id = Math.floor(Math.random() * (max - min + 1)) + min;
    var wall_row = wall_list[id][0][0];
    var wall_col = wall_list[id][0][1];
    cell_row = wall_list[id][1][0];
    cell_col = wall_list[id][1][1];
    wall_list.splice(id, 1);

    if (maze[wall_row][wall_col] != "#") {
      continue;
    }
    if (maze[cell_row][cell_col] == ".") {
      continue;
    }
    maze[wall_row][wall_col] = ".";
    maze[cell_row][cell_col] = ".";
    add_walls(cell_row, cell_col);
  }
  return maze;
}
kontra.loadAssets().then(function() {
  var player_position = new Point(128, 64);
  var player = kontra.sprite({
    x: player_position.x,
    y: player_position.y,
    color: "Blue",
    height: 16,
    width: 16
  });

  var current_maze = create_maze(player_position);
  var current_goal_location = get_random_valid_location(current_maze);
  var fixed_walls = [];
  for (var row = 0; row < SIZE; row++) {
    fixed_walls[row] = [];
    for (var col = 0; col < SIZE; col++) {
      if (current_maze[row][col] == "#") {
        fixed_walls[row][col] = kontra.sprite({
          x: row * 16,
          y: col * 16,
          color: "Black",
          width: 16,
          height: 16
        });
      } else {
        console.warn("empty space");
      }
    }
  }

  function get_valid_locations(maze) {
    var valid_location = [];
    for (var i = 0; i < SIZE; i++) {
      for (var j = 0; j < SIZE; j++) {
        if (maze[i][j] == ".") {
          valid_location.push(new Point(i, j));
        }
      }
    }
    return valid_location;
  }

  function get_random_valid_location(maze) {
    var valid_locations=get_valid_locations(maze);
    var valid_index= Math.floor(Math.random() * (valid_locations.length - 0 + 1)) + 0;
    return valid_locations[valid_index];
  }

  function player_movement() {
    if (kontra.keys.pressed("down")) {
      player.y += 1;
      if (check_for_colision()) {
        player.y -= 1;
      }
      if (check_if_goal()) {
        alert("You have won");
        window.location = "";
      }
      if (check_if_key()) {
        number_of_keys_colected+=1;
      }
    }
    if (kontra.keys.pressed("up")) {
      player.y -= 1;
      if (check_for_colision()) {
        player.y += 1;
      }
      if (check_if_goal()) {
        alert("You have won");
        window.location = "";
      }
      if (check_if_key()) {
        number_of_keys_colected+=1;
      }
    }
    if (kontra.keys.pressed("right")) {
      player.x += 1;
      if (check_for_colision()) {
        player.x -= 1;
      }
      if (check_if_goal()) {
        alert("You have won");
        window.location = "";
      }
      if (check_if_key()) {
        number_of_keys_colected+=1;
      }
    }
    if (kontra.keys.pressed("left")) {
      player.x -= 1;
      if (check_for_colision()) {
        player.x += 1;
      }
      if (check_if_goal()) {
        alert("You have won");
        window.location = "";
      }
      if (check_if_key()) {
        number_of_keys_colected+=1;
      }
    }
  }

  function check_for_colision() {
    var colision = false;
    fixed_walls.forEach(function(wall_row) {
      wall_row.forEach(function(wall) {
        if (player.collidesWith(wall)) {
          console.log(
            "Colision detected at: x= " + player.x + " y= " + player.y
          );
          colision = true;
        }
      });
    });
    return colision;
  }

  function check_if_goal() {
    var goal_found = false;
    if (player.collidesWith(goal) && number_of_keys_colected==number_of_keys) {
      goal_found = true;
    }
    return goal_found;
  }

  function check_if_key(){
    var key_found=false;
    goal_keys.forEach(function (key) {
      if (player.collidesWith(key) && key.colected==false) {
        key_found=true;
        key.colected=true;
        key.color='white';
      }
      });
      return key_found;
  }



  function generate_keys(number){
    var keys=[];
    for (var i = 0; i < number; i++) {
      var random_location=get_random_valid_location(current_maze);
      keys.push(
        kontra.sprite({
          x:random_location.x*16,
          y:random_location.y*16,
          color:'green',
          height:16,
          width:16,
          colected:false
        })
      );      
    }
    return keys;
  }

  var goal_keys=generate_keys(3);
  
  var goal = kontra.sprite({
    x: current_goal_location.x * 16,
    y: current_goal_location.y * 16,
    color: "red",
    height: 16,
    width: 16
  });

  var loop = kontra.gameLoop({
    update: function() {
      player_movement();
      fixed_walls.forEach(function(wall_row) {
        wall_row.forEach(function(wall) {
          wall.update();
        });
      });
      goal.update();
      goal_keys.forEach(function(key){
        key.update();
      });
      player.update();
    },
    render: function() {
      fixed_walls.forEach(function(wall_row) {
        wall_row.forEach(function(wall) {
          wall.render();
        });
      });
      goal_keys.forEach(function(key){
        key.render();
      });
      goal.render();
      player.render();
      
    }
  });
  loop.start();
});
