/**
 * 分类映射工具
 * @author kyle / http://nikai.us/
 */

import DataSet from '../../data/DataSet';

// 定义分类规则接口
export interface SplitList {
    [key: string]: any;
}

// 定义分类选项接口
export interface CategoryOptions {
    splitList?: SplitList;
}

// 定义图例选项接口
export interface LegendOptions {
    [key: string]: any;
}

/**
 * 分类映射类，用于处理分类数据
 */
export default class Category {
    private splitList: SplitList;

    /**
     * 构造函数
     * @param {SplitList} splitList - 分类规则
     */
    constructor(splitList: SplitList = { other: 1 }) {
        this.splitList = splitList;
    }

    /**
     * 根据值获取分类结果
     * @param {any} count - 输入值
     * @returns {any} - 分类结果
     */
    get(count: any): any {
        const splitList = this.splitList;
        let value = splitList['other'];

        for (const i in splitList) {
            if (count == i) {
                value = splitList[i];
                break;
            }
        }

        return value;
    }

    /**
     * 根据DataSet自动生成对应的splitList
     * @param {DataSet} dataSet - 数据集
     * @param {string[]} [color] - 颜色数组
     */
    generateByDataSet(dataSet: DataSet, color?: string[]): void {
        const colors = color || [
            'rgba(255, 255, 0, 0.8)', 
            'rgba(253, 98, 104, 0.8)', 
            'rgba(255, 146, 149, 0.8)', 
            'rgba(255, 241, 193, 0.8)', 
            'rgba(110, 176, 253, 0.8)', 
            'rgba(52, 139, 251, 0.8)', 
            'rgba(17, 102, 252, 0.8)'
        ];
        
        const data = dataSet.get();
        this.splitList = {};
        let count = 0;
        
        for (let i = 0; i < data.length; i++) {
            const dataCount = data[i].count;
            if (this.splitList[dataCount] === undefined) {
                this.splitList[dataCount] = colors[count];
                count++;
            }
            if (count >= colors.length - 1) {
                break;
            }
        }

        this.splitList['other'] = colors[colors.length - 1];
    }

    /**
     * 根据唯一值自动生成splitList
     * @param {DataSet} dataSet - 数据集
     * @param {string} columnName - 列名
     * @param {string[]} [colors] - 颜色数组
     */
    generateByUniqueValues(dataSet: DataSet, columnName: string, colors?: string[]): void {
        // 注意：这里假设DataSet有getUnique方法，需要确保DataSet类中有这个方法
        const uniqueValues = (dataSet as any).getUnique(columnName);
        const colorArray = colors || this.getDefaultColors();
        
        this.splitList = {};
        for (let i = 0; i < uniqueValues.length; i++) {
            this.splitList[uniqueValues[i]] = colorArray[i % colorArray.length];
        }
        this.splitList['other'] = colorArray[colorArray.length - 1];
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
     * 添加新的分类规则
     * @param {string} key - 分类键
     * @param {any} value - 分类值
     */
    addCategory(key: string, value: any): void {
        this.splitList[key] = value;
    }

    /**
     * 移除分类规则
     * @param {string} key - 分类键
     */
    removeCategory(key: string): void {
        delete this.splitList[key];
    }

    /**
     * 更新分类规则
     * @param {string} key - 分类键
     * @param {any} value - 分类值
     * @returns {boolean} - 是否更新成功
     */
    updateCategory(key: string, value: any): boolean {
        if (this.splitList[key] !== undefined) {
            this.splitList[key] = value;
            return true;
        }
        return false;
    }

    /**
     * 获取所有分类规则
     * @returns {SplitList} - 分类规则
     */
    getCategories(): SplitList {
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
        for (const key in splitList) {
            html += `<div style="line-height: 19px;" value="${key}"><span style="vertical-align: -2px; display: inline-block; width: 30px;height: 19px;background:${splitList[key]};"></span><span style="margin-left: 3px;">${key}<span></div>`;
        }
        container.innerHTML = html;
        return container;
    }
}