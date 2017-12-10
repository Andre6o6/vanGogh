function App() {
	this.stage = null,
	this.canvas = null,
	this.layers = [],
	this.activeLayer = -1
}

App.prototype.openFile = function(url, first) {
	var img = new Image();
			
	
	var n = (first ? 0: this.layers.length);
	if (first) this.layers = [];
	this.layers[n] = new Bitmap(img);
	this.layers[n].x = 0;
	this.layers[n].y = 0;
	this.activateLayer(n);
	
	img.src = url;
};
App.prototype.activateLayer = function(n) {
  this.activeLayer = n;
};