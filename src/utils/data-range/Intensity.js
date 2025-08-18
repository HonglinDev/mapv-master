/**
 * @author kyle / http://nikai.us/
 */

import Canvas from "../Canvas";

/**
 * Category
 * @param {Object} [options]   Available options:
 *                             {Object} gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"}
 */
function Intensity(options) {

    options = options || {};
    this.gradient = options.gradient || { 
        0.25: "rgba(0, 0, 255, 1)",
        0.55: "rgba(0, 255, 0, 1)",
        0.85: "rgba(255, 255, 0, 1)",
        1.0: "rgba(255, 0, 0, 1)"
    };
    this.maxSize = options.maxSize || 35;
    this.minSize = options.minSize || 0;
    this.max = options.max || 100;
    this.min = options.min || 0;
    this.initPalette();
}

Intensity.prototype.setMax = function (value) {
    this.max = value || 100;
}

Intensity.prototype.setMin = function (value) {
    this.min = value || 0;
}

Intensity.prototype.setMaxSize = function (maxSize) {
    this.maxSize = maxSize || 35;
}

Intensity.prototype.setMinSize = function (minSize) {
    this.minSize = minSize || 0;
}

Intensity.prototype.initPalette = function () {

    var gradient = this.gradient;

    var canvas = new Canvas(256, 1);

    var paletteCtx = this.paletteCtx = canvas.getContext('2d');

    var lineGradient = paletteCtx.createLinearGradient(0, 0, 256, 1);

    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }

    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, 256, 1);

}

Intensity.prototype.getColor = function (value) {

    var imageData = this.getImageData(value);

    return "rgba(" + imageData[0] + ", " + imageData[1] + ", " + imageData[2] + ", " + imageData[3] / 256 + ")";

}

Intensity.prototype.getImageData = function (value) {

    var imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

    if (value === undefined) {
        return imageData;
    }

    var max = this.max;
    var min = this.min;

    if (value > max) {
        value = max;
    }

    if (value < min) {
        value = min;
    }

    var index = Math.floor((value - min) / (max - min) * (256 - 1)) * 4;

    return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
}

/**
 * @param Number value 
 * @param Number max of value
 * @param Number max of size
 * @param Object other options
 */
Intensity.prototype.getSize = function (value) {

    var size = 0;
    var max = this.max;
    var min = this.min;
    var maxSize = this.maxSize;
    var minSize = this.minSize;

    if (value > max) {
        value = max;
    }

    if (value < min) {
        value = min;
    }

    if (max > min) {
        size = minSize + (value - min) / (max - min) * (maxSize - minSize);
    } else {
        return maxSize;
    }

    return size;

}

/**
 * 设置渐变色
 */
Intensity.prototype.setGradient = function (gradient) {
    this.gradient = gradient;
    this.initPalette();
}

/**
 * 获取当前渐变色配置
 */
Intensity.prototype.getGradient = function () {
    return this.gradient;
}

/**
 * 根据预设主题设置渐变色
 */
Intensity.prototype.setTheme = function (theme) {
    const themes = {
        'rainbow': {
            0.0: 'blue',
            0.25: 'cyan',
            0.5: 'lime',
            0.75: 'yellow',
            1.0: 'red'
        },
        'fire': {
            0.0: 'black',
            0.25: 'purple',
            0.5: 'orange',
            0.75: 'yellow',
            1.0: 'white'
        },
        'water': {
            0.0: 'white',
            0.25: 'lightblue',
            0.5: 'blue',
            0.75: 'darkblue',
            1.0: 'black'
        },
        'earth': {
            0.0: 'green',
            0.25: 'yellowgreen',
            0.5: 'yellow',
            0.75: 'orange',
            1.0: 'brown'
        }
    };
    
    if (themes[theme]) {
        this.gradient = themes[theme];
        this.initPalette();
        return true;
    }
    return false;
}

/**
 * 获取预设主题列表
 */
Intensity.prototype.getThemes = function () {
    return ['rainbow', 'fire', 'water', 'earth'];
}

/**
 * 更新最大最小值
 */
Intensity.prototype.setMinMax = function (min, max) {
    this.min = min;
    this.max = max;
}

/**
 * 更新最大最小尺寸
 */
Intensity.prototype.setMinMaxSize = function (minSize, maxSize) {
    this.minSize = minSize;
    this.maxSize = maxSize;
}

Intensity.prototype.getLegend = function (options) {
    var gradient = this.gradient;


    var width = options.width || 20;
    var height = options.height || 180;

    var canvas = new Canvas(width, height);

    var paletteCtx = canvas.getContext('2d');

    var lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);

    for (var key in gradient) {
        lineGradient.addColorStop(parseFloat(key), gradient[key]);
    }

    paletteCtx.fillStyle = lineGradient;
    paletteCtx.fillRect(0, 0, width, height);
    
    // 添加数值标签
    if (options.showLabels !== false) {
        paletteCtx.fillStyle = 'black';
        paletteCtx.font = '12px Arial';
        paletteCtx.textAlign = 'left';
        
        // 添加最大值和最小值标签
        var maxLabel = this.max.toString();
        var minLabel = this.min.toString();
        
        paletteCtx.fillText(maxLabel, width + 5, 12);
        paletteCtx.fillText(minLabel, width + 5, height);
        
        // 添加中间值标签
        var midValue = (this.max + this.min) / 2;
        var midLabel = midValue.toFixed(1);
        paletteCtx.fillText(midLabel, width + 5, height / 2);
    }

    return canvas;
}

export default Intensity;