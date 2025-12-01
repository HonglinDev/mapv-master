/**
 * 区间映射工具
 * @author kyle / http://nikai.us/
 */

import DataSet from '../../data/DataSet';

// 定义区间规则接口
export interface RangeRule {
    start?: number;
    end?: number;
    value: any;
}

// 定义自定义区间接口
export interface CustomRange {
    start: number;
    end: number;
}

// 定义图例选项接口
export interface LegendOptions {
    [key: string]: any;
}

/**
 * 区间映射类，用于处理区间数据
 */
export default class Choropleth {
    private splitList: RangeRule[];

    /**
     * 构造函数
     * @param {RangeRule[]} splitList - 区间规则
     */
    constructor(splitList: RangeRule[] = [{ start: 0, value: 'red' }]) {
        this.splitList = splitList;
    }

    /**
     * 根据值获取区间结果
     * @param {number} count - 输入值
     * @returns {any} - 区间结果
     */
    get(count: number): any {
        const splitList = this.splitList;
        let value = false;

        for (let i = 0; i < splitList.length; i++) {
            const rule = splitList[i];
            const startCondition = rule.start === undefined || count >= rule.start;
            const endCondition = rule.end === undefined || count < rule.end;
            
            if (startCondition && endCondition) {
                value = rule.value;
                break;
            }
        }

        return value;
    }

    /**
     * 根据DataSet自动生成对应的区间规则
     * @param {DataSet} dataSet - 数据集
     */
    generateByDataSet(dataSet: DataSet): void {
        const min = dataSet.getMin('count') || 0;
        const max = dataSet.getMax('count') || 100;
        this.generateByMinMax(min, max);
    }

    /**
     * 根据最小值和最大值生成区间规则
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     */
    generateByMinMax(min: number, max: number): void {
        const colors = [
            'rgba(255, 255, 0, 0.8)', 
            'rgba(253, 98, 104, 0.8)', 
            'rgba(255, 146, 149, 0.8)', 
            'rgba(255, 241, 193, 0.8)', 
            'rgba(110, 176, 253, 0.8)', 
            'rgba(52, 139, 251, 0.8)', 
            'rgba(17, 102, 252, 0.8)'
        ];
        
        const splitNum = Number((max - min) / 7);
        const maxNum = Number(max);
        let index = Number(min);
        this.splitList = [];
        let count = 0;

        while (index < maxNum) {
            this.splitList.push({
                start: index,
                end: index + splitNum,
                value: colors[count]
            });
            count++;
            index += splitNum;
        }
    }

    /**
     * 根据自定义区间生成区间规则
     * @param {CustomRange[]} ranges - 自定义区间
     * @param {string[]} [colors] - 颜色数组
     */
    generateByCustomRange(ranges: CustomRange[], colors?: string[]): void {
        const colorArray = colors || this.getDefaultColors();
        this.splitList = [];
        
        for (let i = 0; i < ranges.length; i++) {
            this.splitList.push({
                start: ranges[i].start,
                end: ranges[i].end,
                value: colorArray[i % colorArray.length]
            });
        }
    }

    /**
     * 获取默认颜色列表
     * @returns {string[]} - 默认颜色列表
     */
    getDefaultColors(): string[] {
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
     * @param {RangeRule} range - 区间规则
     */
    addRange(range: RangeRule): void {
        this.splitList.push(range);
        // 重新排序以确保区间顺序正确
        this.splitList.sort((a, b) => (a.start || 0) - (b.start || 0));
    }

    /**
     * 移除区间规则
     * @param {number} index - 区间规则索引
     */
    removeRange(index: number): void {
        if (index >= 0 && index < this.splitList.length) {
            this.splitList.splice(index, 1);
        }
    }

    /**
     * 更新区间规则
     * @param {number} index - 区间规则索引
     * @param {RangeRule} range - 新的区间规则
     * @returns {boolean} - 是否更新成功
     */
    updateRange(index: number, range: RangeRule): boolean {
        if (index >= 0 && index < this.splitList.length) {
            this.splitList[index] = range;
            // 重新排序以确保区间顺序正确
            this.splitList.sort((a, b) => (a.start || 0) - (b.start || 0));
            return true;
        }
        return false;
    }

    /**
     * 获取所有区间规则
     * @returns {RangeRule[]} - 区间规则
     */
    getRanges(): RangeRule[] {
        return this.splitList;
    }

    /**
     * 获取图例
     * @param {LegendOptions} options - 图例选项
     * @returns {HTMLDivElement} - 图例元素
     */
    getLegend(options: LegendOptions): HTMLDivElement {
        const splitList = this.splitList;
        const container = document.createElement('div');
        container.style.cssText = "background:#fff; padding: 5px; border: 1px solid #ccc;";
        let html = '';
        
        for (let i = 0; i < splitList.length; i++) {
            const range = splitList[i];
            let label = '';
            
            if (range.start !== undefined && range.end !== undefined) {
                label = `${range.start} - ${range.end}`;
            } else if (range.start !== undefined) {
                label = `> ${range.start}`;
            } else if (range.end !== undefined) {
                label = `< ${range.end}`;
            } else {
                label = 'All';
            }
            
            html += `<div style="line-height: 19px;"><span style="vertical-align: -2px; display: inline-block; width: 30px;height: 19px;background:${range.value};"></span><span style="margin-left: 3px;">${label}<span></div>`;
        }
        
        container.innerHTML = html;
        return container;
    }
}