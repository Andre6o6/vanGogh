describe("Editor", function() {
  var app;
  
  beforeEach(function() {
    app = new App();
  });
  
  it("should be able to load image", function() {
	app.openFile('www.google.ru/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', true );
    expect(app.layers[0]).not.toBeUndefined();
  });
  
  describe("when image is loaded", function() {
    beforeEach(function() {
      app.openFile('www.google.ru/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', true );
    });
	
	it("it should be put in (x, y) = (0, 0)", function() {
      expect(app.layers[0].x).toBe(0);
      expect(app.layers[0].y).toBe(0);
    });
	
    it("and first layer should be activated", function() {
      expect(app.activeLayer).toBe(0);
    });
    
  });

});