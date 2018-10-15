/**
 * @author archmagece
 * @since 2014-09-23-18
 * @with WebGrimPan
 */
//http://users7.jabry.com/overlord/mug.html

function ImageController(imgObj){
	console.log("생성 iamgeObj", imgObj.width, imgObj.height, imgObj.color);
	this.mug = imgObj;
	this.mugCanvas = document.createElement("canvas");
	this.mugCtx = this.mugCanvas.getContext("2d");
	this.originalPixels = null;
	this.currentPixels = null;
	this.getPixels(this.mug);
}

ImageController.prototype.HexToRGB = function(Hex)
{
	var Long = parseInt(Hex.replace(/^#/, ""), 16);
	return {
		R: (Long >>> 16) & 0xff,
		G: (Long >>> 8) & 0xff,
		B: Long & 0xff
	};
}

ImageController.prototype.changeColor = function(color)
{
	if(!this.originalPixels) return; // Check if image has loaded
//		var newColor = this.HexToRGB(color);
	var newColor = color.length <= 7 ? this.HexToRGB(color) : color;
	console.log(newColor);
	for(var I = 0, L = this.originalPixels.data.length; I < L; I += 4)
	{
		if(this.currentPixels.data[I + 3] > 0)
		{
			this.currentPixels.data[I] = this.originalPixels.data[I] / 255 * newColor.R;
			this.currentPixels.data[I + 1] = this.originalPixels.data[I + 1] / 255 * newColor.G;
			this.currentPixels.data[I + 2] = this.originalPixels.data[I + 2] / 255 * newColor.B;
		}
	}

	this.mugCtx.putImageData(this.currentPixels, 0, 0);
	this.mug.src = this.mugCanvas.toDataURL("image/png");
	console.log("brushsrc1", this.mug.src);
	return this.mug;
}

ImageController.prototype.getPixels = function(img)
{
	this.mugCanvas.width = img.width;
	this.mugCanvas.height = img.height;

	this.mugCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
	this.originalPixels = this.mugCtx.getImageData(0, 0, img.width, img.height);
	this.currentPixels = this.mugCtx.getImageData(0, 0, img.width, img.height);

	img.onload = null;
}