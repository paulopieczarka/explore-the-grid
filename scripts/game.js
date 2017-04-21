
/* Game activity. */
var Game =
{
	ctx: null,

	mapTile: [],

	init: canvas =>
	{
		Game.ctx = canvas.getContext('2d')

		canvas.addEventListener('mousemove', event => {
			Mouse.x = event.pageX - App.canvas.offsetLeft
			Mouse.y = event.pageY - App.canvas.offsetTop
		})

		Tile.init()
		Map.generate()
		Game.update(1)
	},

	// Render on things on canvas.
	render: ctx =>
	{
		// Clear canvas.
		ctx.clearRect(0, 0, App.canvas.width, App.canvas.height)

		// Draw map tiles.
		for(var i=0; i < 800/32; i++)
		{
			for(var j=0; j < 600/32; j++)
			{
				Draw.rect(32*i, 32*j, 32, 32, Map.getTileColor(i, j))
				
				// Cast shadow.
				if(Map.hasShadow(i, j)){
					Draw.rect(32*i, 32*j, 32, 32, 'rgba(0,0,0,'+Map.getShadow(i, j)+")")
				}
			}
		}

		// Tile hover.
		const hoverX = Math.floor(Mouse.x/Map.TILE_SIZE)
		const hoverY = Math.floor(Mouse.y/Map.TILE_SIZE)

		if(Map.grid[hoverX][hoverY]){
			Draw.rect(hoverX*Map.TILE_SIZE, hoverY*Map.TILE_SIZE, Map.TILE_SIZE, Map.TILE_SIZE, 'rgba(0,255,0,.5)')
		}

		var player = Map.entityList[0]
		Draw.text('Path from '+player.x+', '+player.y+' to '+hoverX+', '+hoverY+'.', 5, 5)

		var path = Pathfinder.findPath(Map.grid, player, {x: hoverX, y: hoverY})

		if(path)
		{
			Draw.text('Path: '+path.length+' nodes.', 5, 20)
			path.forEach(node => {
				Draw.rect(node.x*32+12, node.y*32+12, 8, 8, 'red')
			})
		}
		else {
			Draw.text('Path: not found.', 5, 20)
		}

		// Draw entities.
		Map.entityList.forEach(entity => {
			entity.render(ctx)
		})
	},

	// Run game logic.
	update: delta =>
	{
		Game.render(Game.ctx)
		window.requestAnimationFrame(Game.update)
	}
}

/* Map activity.
   Map controller. */
var Map =
{
	TILE_SIZE: 32,

	grid: [],
	gridShadow: [],

	entityList: [],

	// Map generator.
	generate: () =>
	{
		// Tiles.
		for(var i=0; i < 800/32; i++)
		{
			Map.grid[i] = [];
			Map.gridShadow[i] = []
			for(var j=0; j < 600/32; j++)
			{
				Map.grid[i][j] = Tile.grass

				if(Rand.range(0, 16) == 1)
					Map.grid[i][j] = Tile.wall

				Map.gridShadow[i][j] = Rand.value([.02, .01, .03, 0])
			}
		}

		// Player.
		Map.entityList.push(new EntityPlayer(12, 9))
	},

	getTileColor: (x, y) => {
		return Map.grid[x][y].color
	},

	hasShadow: (x, y) => {
		return Map.gridShadow[x][y] != 0
	},

	getShadow: (x, y) => {
		return Map.gridShadow[x][y]
	}
}

/* Entity activity. @abstract */
var Entity = function(name, x, y, color)
{
	this.name = name
	this.x = x
	this.y = y
	this.color = color

	// Render entity.
	this.render = ctx => {
		Draw.rect((this.x*Map.TILE_SIZE)+2, (this.y*Map.TILE_SIZE)+2, 28, 28, this.color)
	}
}

var EntityPlayer = function(x, y)
{
	Entity.call(this, 'Player', x, y, '#F65866')
}

/* Map tiles. */
var Tile =
{
	list: [],

	// Create tiles.
	init: () => 
	{
		Tile.grass = Tile.create("Grass", "#6FE7A9")
		Tile.wall = Tile.create("Wall", "#702E3E", false)

		Tile.list.push(Tile.grass)
		Tile.list.push(Tile.wall)
	},

	// Scope of a Tile Object.
	create: (_name, _color, _walkable = true) => 
	{
		return ({ name: _name, color: _color, walkable: _walkable })
	}
}

/**************************** ENGINE ****************************************/ 

/* Draw on canvas functions. */
var Draw = 
{
	// position{x, y} | dimensions{width, height} | color
	rect: (x, y, w, h, color) =>
	{
		Game.ctx.fillStyle = color
		Game.ctx.fillRect(x, y, w, h)
	},

	text: (str, x, y, color = 'white') =>
	{
		Game.ctx.fillStyle = color
		Game.ctx.fillText(str, x, y+10)
	}
}

/* Some utils for randoms. */
var Rand =
{
	int: (max) => {
		return Rand.range(0, max)
	},

	range: (min, max) => {
		return Math.floor(Math.random()*(max-min)) + min
	},

	float: (min = 0) => {
		return Math.random()
	},

	value: (arr) => {
		return arr[Rand.int(arr.length)]
	}
}

/* Mouse handler. */ 
var Mouse =
{
	x: 0,
	y: 0
}