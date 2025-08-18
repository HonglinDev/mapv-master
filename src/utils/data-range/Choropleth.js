/**
 * @author kyle / http://nikai.us/
 */

/**
 * Choropleth
 * @param {Object} splitList:
 *       [
 *           {
 *               start: 0,
 *               end: 2,
 *               value: randomColor()
 *           },{
 *               start: 2,
 *               end: 4,
 *               value: randomColor()
 *           },{
 *               start: 4,
 *               value: randomColor()
 *           }
 *       ];
 *
 */
function Choropleth(splitList) {
    this.splitList = splitList || [{
        start: 0,
        value: 'red'
    }];
}

Choropleth.prototype.get = function (count) {
    var splitList = this.splitList;

    var value = false;

    for (var i = 0; i < splitList.length; i++) {
        if ((splitList[i].start === undefined ||
                splitList[i].start !== undefined &&
                count >= splitList[i].start) &&
            (splitList[i].end === undefined ||
                splitList[i].end !== undefined && count < splitList[i].end)) {
            value = splitList[i].value;
            break;
        }
    }

    return value;

}

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByDataSet = function (dataSet) {

    var min = dataSet.getMin('count');
    var max = dataSet.getMax('count');

    this.generateByMinMax(min, max);

}

/**
 * 根据DataSet自动生成对应的splitList
 */
Choropleth.prototype.generateByMinMax = function (min, max) {
    var colors = ['rgba(255, 255, 0, 0.8)', 'rgba(253, 98, 104, 0.8)', 'rgba(255, 146, 149, 0.8)', 'rgba(255, 241, 193, 0.8)', 'rgba(110, 176, 253, 0.8)', 'rgba(52, 139, 251, 0.8)', 'rgba(17, 102, 252, 0.8)'];
    var splitNum = Number((max - min) / 7);
    // console.log(splitNum)
    max = Number(max);
    var index = Number(min);
    this.splitList = [];
    var count = 0;

    while (index < max) {
        this.splitList.push({
            start: index,
            end: index + splitNum,
            value: colors[count]
        });
        count++;
        index += splitNum;
        // console.log(index, max)
    }
    // console.log('splitNum')
}

/**
 * 根据自定义区间生成splitList
 */
Choropleth.prototype.generateByCustomRange = function (ranges, colors) {
    var colorArray = colors || this.getDefaultColors();
    this.splitList = [];
    
    for (var i = 0; i < ranges.length; i++) {
        this.splitList.push({
            start: ranges[i].start,
            end: ranges[i].end,
            value: colorArray[i % colorArray.length]
        });
    }
}

/**
 * 获取默认颜色列表
 */
Choropleth.prototype.getDefaultColors = function () {
    return [
        'rgba(255, 255, 0, 0.8)', 
        'rgba(253, 98, 104, 0.8)', 
        'rgba(255, 146, 149, 0.8)', 
        'rgba(255, 241, 193, 0.8)', 
        'rgba(110, 176, 253, 0.8)', 
        'rgba(52, 139, 251, 0.8)', 
        'rgba(17, 102, 252, 0.8)',
        'rgba(0, 176, 104, 0.8)',
        'rgba(128, 128, 128, 0.8)',
        'rgba(255, 0, 255, 0.8)'
    ];
}

/**
 * 添加新的区间规则
 */
Choropleth.prototype.addRange = function (range) {
    this.splitList.push(range);
    // 重新排序以确保区间顺序正确
    this.splitList.sort((a, b) => (a.start || 0) - (b.start || 0));
}

/**
 * 移除区间规则
 */
Choropleth.prototype.removeRange = function (index) {
    if (index >= 0 && index < this.splitList.length) {
        this.splitList.splice(index, 1);
    }
}

/**
 * 更新区间规则
 */
Choropleth.prototype.updateRange = function (index, range) {
    if (index >= 0 && index < this.splitList.length) {
        this.splitList[index] = range;
        return true;
    }
    return false;
}

/**
 * 获取所有区间规则
 */
Choropleth.prototype.getRanges = function () {
    return this.splitList;
}

Choropleth.prototype.getLegend = function (options) {
    var splitList = this.splitList;
    var container = document.createElement('div');
    container.style.cssText = "background:#fff; padding: 5px; border: 1px solid #ccc;";
    var html = '';
    
    for (var i = 0; i < splitList.length; i++) {
        var range = splitList[i];
        var label = '';
        if (range.start !== undefined && range.end !== undefined) {
            label = range.start + ' - ' + range.end;
        } else if (range.start !== undefined) {
            label = '> ' + range.start;
        } else if (range.end !== undefined) {
            label = '< ' + range.end;
        } else {
            label = 'All';
        }
        
        html += '<div style="line-height: 19px;"><span style="vertical-align: -2px; display: inline-block; width: 30px;height: 19px;background:' + range.value + ';"></span><span style="margin-left: 3px;">' + label + '<span></div>';
    }
    
    container.innerHTML = html;
    return container;
}

export default Choropleth;