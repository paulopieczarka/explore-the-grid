var Node = function(x, y)
{
	this.x = x
	this.y = y

	this.walkable = true

	this.gCost = 0 //distance from the starting node
	this.hCost = 0 //distance from the end node

	this.parent = null

	this.fCost = () => {
		return this.gCost + this.hCost
	}

	this.equals = otherNode => {
		return this.x == otherNode.x && this.y == otherNode.y
	}
}

var Pathfinder =
{
	distanceBy: null,

	// Start {x,y} : target {x,y} @return PATH
	findPath: (grid, start, target) =>
	{
		var startNode = new Node(start.x, start.y)
		var targetNode = new Node(target.x, target.y)

		var openSet = []
		var closedSet = []

		openSet.push(startNode)

		while(openSet.length > 0)
		{
			var currentNode = openSet[0]
			for(var i=1; i < openSet.length; i++)
			{
				if(openSet[i].fCost() < currentNode.fCost() || 
					openSet[i].fCost() == currentNode.gCost && 
					openSet[i].hCost < currentNode.hCost)
				{
					currentNode = openSet[i]
				}
			}

			openSet.remove(currentNode)
			closedSet.push(currentNode)

			if(currentNode.equals(targetNode)){
				return Pathfinder.tracePath(currentNode);
			}

			var neighbours = Pathfinder.getNeighbours(currentNode, grid)
			neighbours.forEach(node => {
				if(!node.walkable || contains(closedSet, node)){
					// Continue
				}
				else
				{
					var moveCostToNeighbour = currentNode.gCost + Pathfinder.getDistance(currentNode, node)
					if(moveCostToNeighbour < node.gCost || !contains(openSet, node))
					{
						node.gCost = moveCostToNeighbour
						node.hCost = Pathfinder.getDistance(node, targetNode)
						node.parent = currentNode

						if(!contains(node))
							openSet.push(node)
					}
				}
			})
		}
	},

	tracePath: node =>
	{
		var path = []
		while(node != null)
		{
			path.push(node)
			node = node.parent
		}

		path.reverse()
		return path
	},

	getDistance: (nodeA, nodeB) =>
	{
		return Pathfinder.distanceMethod(nodeA, nodeB)
	},

	manhattanDistance: (nodeA, nodeB) =>
	{
		var dx = Math.abs(nodeA.x - nodeB.x)
		var dy = Math.abs(nodeA.y - nodeB.y)
		return 10 * (dx + dy)
	},

	manhattanDiagDistance: (nodeA, nodeB) =>
	{
		var dx = Math.abs(nodeA.x - nodeB.x)
		var dy = Math.abs(nodeA.y - nodeB.y)

		if(dx > dy)
			return 14*dy + 10 * (dx-dy)

		return 14*dx + 10 * (dy-dx)
	},

	getNeighbours: (node, grid) =>
	{
		var neighbours = []
		
		for(var i=-1; i <= 1; i++){
			for(var j=-1; j <= 1; j++)
			{
				if(i == 0 && j == 0)
					continue

				var x = node.x + i
				var y = node.y + j

				if(x < 0 || y < 0 || x >= grid.length || y >= grid[0].length)
					continue

				if(grid[x][y].walkable)
					neighbours.push(new Node(x, y))
			}
		}

		return neighbours
	}
}