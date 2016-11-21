/**
 * Image tool for scaling aspect ratio of image
 * Reference from ImageZoom magento
 * Author : Aris catan | Incramind
 */
jQuery.fn.extend({
    imageEl         : '',
    containerEl     : '',
    containerDim    : {},
    imageDim        : {},
    ceilingZoom     : 0,
    floorZoom       : 1,
    imageX          : 0,
    imageY          : 0,
    imageZoom       : 1,

    ScaleRatio: function(data) {
        var _data = { ratio : 0 };
        var config = jQuery.extend({}, _data, data);
        console.log('scale starts');
        return jQuery(this).on('load',jQuery.proxy(function(){
            this.imageEl = jQuery(this);
            this.containerEl = jQuery("."+config.parentContainer);
            
            this.containerDim = this.getDimensions(this.containerEl);
            this.imageDim = this.getDimensions(this.imageEl);

            this.imageDim.ratio = this.imageDim.width/this.imageDim.height;

            if (this.imageDim.width > this.imageDim.height) {
                this.ceilingZoom = this.imageDim.width / this.containerDim.width;
            } else {
                this.ceilingZoom = this.imageDim.height / this.containerDim.height;
            }

            if (this.imageDim.width <= this.containerDim.width && this.imageDim.height <= this.containerDim.height) {
                return;
            }
            
        },this));
        
    },
    scale     :     function(v){

                        var centerX  = (this.containerDim.width*(1-this.imageZoom)/2-this.imageX)/this.imageZoom;
                        var centerY  = (this.containerDim.height*(1-this.imageZoom)/2-this.imageY)/this.imageZoom;
                        var overSize = (this.imageDim.width > this.containerDim.width || this.imageDim.height > this.containerDim.height);

                        this.imageZoom = this.floorZoom+(v*(this.ceilingZoom-this.floorZoom));

                        if (overSize) {
                            if (this.imageDim.width > this.containerDim.width) {
                                this.imageEl.css("width",(this.imageZoom*this.containerDim.width)+'px');
                            } else if (this.imageDim.height > this.containerDim.height) {
                                this.imageEl.css("height",(this.imageZoom*this.containerDim.height)+'px');
                            }
                            if(this.containerDim.ratio){
                                jQuery(this.imageEl).css("height",(this.imageZoom*this.containerDim.width*this.containerDim.ratio)+'px');
                            }
                        } else {
                           
                        }

                        this.imageX = this.containerDim.width*(1-this.imageZoom)/2-centerX*this.imageZoom;
                        this.imageY = this.containerDim.height*(1-this.imageZoom)/2-centerY*this.imageZoom;
                        this.contain(this.imageX, this.imageY);

                        return true;
                        

    },
    getDimensions : function(obj){
        return { width : obj.width(),height: obj.height(), ratio : 0.0 }
    },
    contain: function (x,y) {

        var dim = this.getDimensions(this.imageEl);

        var xMin = 0, xMax = this.containerDim.width-dim.width;
        var yMin = 0, yMax = this.containerDim.height-dim.height;

        x = x>xMin ? xMin : x;
        x = x<xMax ? xMax : x;
        y = y>yMin ? yMin : y;
        y = y<yMax ? yMax : y;

        if (this.containerDim.width > dim.width) {
            x = (this.containerDim.width/2) - (dim.width/2);
        }

        if (this.containerDim.height > dim.height) {
            y = (this.containerDim.height/2) - (dim.height/2);
        }

        this.imageX = x;
        this.imageY = y;

        this.imageEl.css("left",this.imageX+'px');
        this.imageEl.css("top",this.imageY+'px');

        return [x,y];
    }
});