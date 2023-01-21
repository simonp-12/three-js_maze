let ground;

function init() {
    // Adjust camera
    camera.position.set(-5, -5, 3);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 1, 0);

    // We will use the same geometry for all boxes
    // Meshes can be scaled to change size
    const box_geom = new THREE.BoxGeometry(1, 1, 1);

    // Grass texture
    const grass_texture = new THREE.TextureLoader().load("./public/images/grass.jpg");
    grass_texture.wrapS = THREE.RepeatWrapping;
    grass_texture.wrapT = THREE.RepeatWrapping;
    grass_texture.repeat.set(3, 3);

    // Iron wall texture
    const iron_texture = new THREE.TextureLoader().load("./public/images/iron.jpg");
    iron_texture.wrapS = THREE.RepeatWrapping;
    iron_texture.wrapT = THREE.RepeatWrapping;
    iron_texture.repeat.set(1, 1);

    const grass_mat = new THREE.MeshPhongMaterial({
        color: "white",
        map: grass_texture
    });

    // Create ground
    ground = new THREE.Mesh(box_geom, grass_mat);
    ground.scale.set(10, 10, 1);

    let maze = [
        [0, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 0, 1, 1, 1]
    ]
    let maze_walls = [];
    let maze_wall_material = new THREE.MeshPhongMaterial({
        color: "white",
        map: iron_texture
    });
    for (let i = 0; i < maze.length; i++) {
        maze_walls[i] = [];
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j]) {
                maze_walls[i][j] = new THREE.Mesh(box_geom, maze_wall_material);
                maze_walls[i][j].position.set(i - maze.length / 2 + 0.5, j - maze.length / 2 + 0.5, 1);
                scene.add(maze_walls[i][j]);
            }
        }
    }

    const geometry_coin = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 20);;
    const material_coin = new THREE.MeshPhongMaterial({
        color: 0xffff00
    });
    coin = new THREE.Mesh(geometry_coin, material_coin);
    coin.position.set(0.5, 1.5, 1);
    scene.add(coin);

    const geometry_player = new THREE.DodecahedronGeometry(0.4, 0);
    const material_player = new THREE.MeshPhongMaterial({
        color: 0x00ffff
    });
    player = new THREE.Mesh(geometry_player, material_player);
    player.position.set(0.5, 0.5, 1);
    scene.add(player);


    // Point light
    const l1 = new THREE.PointLight("white", 0.8);
    l1.position.set(-1, -2, 4);

    // Ambient light
    const l2 = new THREE.AmbientLight("blue", 0.7);

    // Directional light
    const l3 = new THREE.DirectionalLight("orange", 0.7);
    l3.position.set(-4, -4, 5);
    l3.lookAt(0, 0, 0);

    // Add all objects to scene
    scene.add(l1, l2, l3, ground);

    function overlaps(a, b) {
        // no horizontal overlap
        if (a.position.x >= (b.position.x + 0.25) || b.position.x >= (a.position.x + 0.25)) return false;

        // no vertical overlap
        if (a.position.y >= (b.position.y + 0.25) || b.position.y >= (a.position.y + 0.25)) return false;

        return true;
    }

    window.addEventListener("keydown", function (e) {
        if (e.code == "KeyW") {
            player.position.y++;
        } else if (e.code == "KeyS") {
            player.position.y--;
        } else if (e.code == "KeyA") {
            player.position.x--;
        } else if (e.code == "KeyD") {
            player.position.x++;
        }
        console.log(player.position);
        for(let i = 0; i < maze_walls.length; i++) {
            for(let j = 0; j < maze_walls[i].length; j++) {
                console.log(overlaps(player, maze_walls[i][j]))
            }
        }
    })
}

function update() {
    controls.update();
    coin.rotation.z += 0.01;
    player.rotation.x += 0.01;
    player.rotation.z += 0.01;
    //coin.updateMatrix();
}