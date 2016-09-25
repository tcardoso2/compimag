var getPixels = require("get-pixels");
var events = require("events");

var pixelsPair = [];

function Comparer() {

    this._lastFile = '';
    this._lastPixels;
    this._useLastPixels = false;
    events.EventEmitter.call(this);

    this.requestCompare = function(imgPath1, imgPath2){
        var result = 1;    
        console.time('compare');
        console.log("=====> Comparing both:", imgPath1, imgPath2); 
        this._lastFile = imgPath1;
    
        if(imgPath1 == '' || imgPath2 == ''){
            console.warn("image paths cannot be empty! Was that intended?")
            return result;
        }
        pixelsPair = [];
        //There's no point blocking the thread with the following, so we process on the next available stack event, so that we allow more non-blocking iterations
        setImmediate(processImage, imgPath1, this);
        setImmediate(processImage, imgPath2, this);
        return 0;
    }

    this.requestCompareLast = function(imgPath) {
        var result = 1;
        console.time('compare');
        console.log("=====> Comparing image with last.:");

        if(!imgPath){
            console.error("image path cannt be empty!")
            return result;
        }
        this._useLastPixels = true;
        setImmediate(processImage, imgPath, this);
        return 0;
    }

    this.compareResult = function() {
        var result = 0;
        //console.info("Comparing results...", pixelsPair); 
 
        if(pixelsPair[0] !== undefined && pixelsPair[1] !== undefined){
            //it is assumed image 1 and 2 are of the same size
            var _size = pixelsPair[0].shape.slice();
            console.info("Will traverse through the image ", _size); 

            var _index = 0;
            var _precision = 0.01;
            console.log('Will apply a precision of ', 1/_precision);
            var _nPoints = 0; 
            for(var i = 0; i < _size[0]; i += (1/_precision)){
                for(var j = 0; j < _size[1]; j += (1/_precision)){
                    //In this method we just look to the Red channel and assume that is suficient to detect changes - it will be faster as well
                    _index = i * 4 + j * _size[0];
                    _nPoints++;
                    result += Math.abs(pixelsPair[0].data[_index] - pixelsPair[1].data[_index]);
                }
            }
            result = result / _nPoints;
            if (this._useLastPixels) {
                pixelsPair.shift();
            }
        }
        else
        {
            console.error("The 2 paths must contain valid images!");
        } 

        console.timeEnd('compare');
        //The comparison has successfully completed, will emit the complete event and pass the result

        try{
           console.log('Calculated average of ', _nPoints, 'points'); 
           this.emit("complete", result);
        }
        catch(e)
        {
            console.log("==> Comparer.compareResult:", result);
        }
        return result;
    }

    this.lastFile = function() {
        console.log("returning last file saved", this._lastFile);
        return this._lastFile;
    }
}

function processImage(imagePath, callbackObj){
    getPixels(imagePath, function(err, pixels) {
        pixelsPair.push(pixels);
        if(err) {
            console.error("Bad image path");
            return;
        }
        if (!callbackObj){
            throw "no callbackObj was provided!";
        } 
        if (pixelsPair.length == 2){
            //2 pixel sets exist so now we can compare the result of both
            callbackObj.compareResult();
        };
    });
}

function getPixel(x, y, pixels) {
    console.time('getPixel');
    var out = [];
    var pointer = pixels.offset + (pixels.stride[0] * x) + (pixels.stride[1] * y);

    for(var i=0; i<4; i++) {
        out.push(pixels.data[pointer + (pixels.stride[2] * i)]);
    }
    console.timeEnd('getPixel');
    return out;
}
Comparer.prototype.__proto__ = events.EventEmitter.prototype;

exports.Comparer = Comparer;
exports.getPixel = getPixel;
exports.processImage = processImage;
