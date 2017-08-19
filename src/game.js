kontra.init();
var SIZE = 32;
var wall_list = [];

kontra.assetPaths.images = "assets/images/";

kontra
  .loadAssets(
    "maize_background_small.png",
    "player.png",
    "pickaxe.png",
    "boulder.png",
    "key.png",
    "orange.png"
  )
  .then(function () {
    var player = kontra.sprite({
      x: 128,
      y: 64,
      color:'Blue',
      height:16,
      width:16
    });
    var walls = [];

    var fixed_walls = [];

    // Fill the maze with walls
    var maze = [];
    for (var i = 0; i < SIZE; i++) {
      maze[i] = [];
      for (var j = 0; j < SIZE; j++) {
        maze[i][j] = "#";
      }
    }
    //Create an empty wall list

    //Check if the given position is in the maze and not on the boundry
    function in_maze(row, col) {
      if (row > 0 && row < SIZE - 1 && col > 0 && col < SIZE - 1) {
        return true;
      }
      return false;
    }

    //Add the neighbouring walls of the cell(row,col) to the wall list
    function add_walls(row, col) {
      //It`s a 4-connected grid maze
      var dir = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
      ];
      
      for (var k = 0; k < dir.length; k++) {
        //Calculate the neighbouring wall position and the cell position
        var wall_row = row + dir[k][0];
        var wall_col = col + dir[k][1];
        var cell_row = wall_row + dir[k][0];
        var cell_col = wall_col + dir[k][1];
        
        //Make sure the wall grid is in the range of the maze
        if (
          in_maze(wall_row, wall_col) == false ||
          in_maze(cell_row, cell_col) == false
        ) {
          continue;
        }

        //Add the eall and the neghbouring cell to the list
        wall_list.push([ [wall_row, wall_col],[cell_row,cell_col]]);
        // console.warn(wall_list.length);
      }
    }

    //Pick a random grid first
    // var cell_row = Math.floor(Math.random() * (SIZE - 2 - 1 + 1) + 1);
    // var cell_col = Math.floor(Math.random() * (SIZE - 2 - 1 + 1) + 1);
    var cell_row = player.x / 16;
    var cell_col = player.y / 16;
    maze[cell_row][cell_col] = ".";
    add_walls(cell_row, cell_col);

    while (wall_list.length > 0) {
      //Pick a random wall
      var max=wall_list.length-1;
      var min=0;
      var id=Math.floor(Math.random() * (max - min + 1)) + min;
      // var id = Math.floor(Math.random() * (wall_list.length) + 0);
      // console.warn(id);
      var wall_row = wall_list[id][0][0];
      var wall_col = wall_list[id][0][1];
      cell_row = wall_list[id][1][0];
      cell_col = wall_list[id][1][1];
      wall_list.splice(id,1);



      //Skip if it is no longer a wall
      if (maze[wall_row][wall_col] != "#") {
        continue;
      }
      //Skip if the two cell that the wall divides are visited
      if (maze[cell_row][cell_col] == ".") {
        continue;
      }

      //Make the two grid as passages
      maze[wall_row][wall_col] = ".";
      maze[cell_row][cell_col] = ".";

      //Add the neighbouring walls
    console.table(maze);
    
      add_walls(cell_row, cell_col);
    }

    console.table(maze);
    // maze.forEach(function(row){
    //   row.forEach(function(elem){
    //     console.log(elem);
    //   });
    //   console.log();
    // });
    var a_wall = kontra.sprite({
      x: 16,
      y: 16,
      color: "black"
    });
    fixed_walls = [];
    for (var row = 0; row < SIZE; row++) {
      fixed_walls[row] = [];
      for (var col = 0; col < SIZE; col++) {
        if (maze[row][col] == "#") {
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

    function check_for_intersection(current_wall) {
      var colision = false;
      walls.forEach(function (wall) {
        if (current_wall.collidesWith(wall) && current_wall != wall) {
          console.log(
            "Intersection detected at: x= " + player.x + " y= " + player.y
          );
          colision = true;
        }
      });
      return colision;
    }

    function check_for_colision() {
      var colision = false;
      walls.forEach(function (wall) {
        if (player.collidesWith(wall)) {
          console.log(
            "Colision detected at: x= " + player.x + " y= " + player.y
          );
          colision = true;
        }
      });
      fixed_walls.forEach(function (wall_row) {
        wall_row.forEach(function (wall) {
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

    function randomize_walls() {
      walls.forEach(function (wall) {
        if (Math.random() > 0.5) {
          var original_x = wall.x;
          wall.x = Math.floor(Math.random() * (SIZE - 0) + 0) * SIZE;

          if (check_for_colision() || check_for_intersection(wall)) {
            wall.x = original_x;
          }
        } else {
          var original_y = wall.y;
          wall.y = Math.floor(Math.random() * (SIZE - 0) + 0) * SIZE;
          var original_height = wall.height;
          var original_width = wall.width;
          wall.height = wall.width;
          wall.width = original_height;
          if (check_for_colision() || check_for_intersection(wall)) {
            wall.y = original_y;
            wall.height = original_height;
            wall.width = original_width;
          }
          console.log("wall position  is at: x= " + wall.x + " y= " + wall.y);
        }
      });
      setTimeout(randomize_walls, 1000);
    }
    randomize_walls();
    var loop = kontra.gameLoop({
      update: function () {
        if (kontra.keys.pressed("down")) {
          player.y += 1;
          if (check_for_colision()) {
            player.y -= 1;
          }
        }
        if (kontra.keys.pressed("up")) {
          player.y -= 1;
          if (check_for_colision()) {
            player.y += 1;
          }
        }
        if (kontra.keys.pressed("right")) {
          player.x += 1;
          if (check_for_colision()) {
            player.x -= 1;
          }
        }
        if (kontra.keys.pressed("left")) {
          player.x -= 1;
          if (check_for_colision()) {
            player.x += 1;
          }
        }
        walls.forEach(function (wall) {
          wall.update();
        });
        fixed_walls.forEach(function (wall_row) {
          wall_row.forEach(function (wall) {
            wall.update();
          });
        });
        player.update();
        a_wall.update();
      },
      render: function () {
        player.render();
        walls.forEach(function (wall) {
          wall.render();
        });
        fixed_walls.forEach(function (wall_row) {
          wall_row.forEach(function (wall) {
            wall.render();
          });
        });
        a_wall.render();
      }
    });

    loop.start();
  });
