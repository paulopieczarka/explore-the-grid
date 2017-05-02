
/* Main activity. */
var App =
{
	canvas: null,

	width: 800,
	height: 600,

	// App initialization.
	init: () => 
	{
		console.log('Game init.')
		App.canvas = document.querySelector('#canvas')

		// If is mobile.
		if(App.canvas.width > window.innerWidth)
		{
			App.canvas.width = window.innerWidth
			App.canvas.height = window.innerHeight - 60
		}

		// Set final canvas dimensions
		App.width = App.canvas.width
		App.height = App.canvas.height

		// Call @game.init
		Game.init(App.canvas)
	}
}

/* Run @app.init on page loaded. */ 
document.body.onload = App.init

/*********** POLLYFILL ***********/

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


/* If array a1 include node a2. */
function contains(list, nodeB)
{
	if(!list || !list.every || list.length == 0)
		return false

	return !list.every(function(node){
		return !node.equals(nodeB);
	});
}