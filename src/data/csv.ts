/**
 * CSV解析模块
 * @author kyle / http://nikai.us/
 */

import DataSet from "./DataSet";

// 定义CSV解析结果接口
type CSVArray = string[][];

// 定义CSV数据项接口
interface CSVDataItem {
    [key: string]: any;
}

export default {
    /**
     * 将CSV字符串转换为二维数组
     * @param strData CSV字符串
     * @param strDelimiter 分隔符，默认为逗号
     * @returns 解析后的二维数组
     */
    CSVToArray: function(strData: string, strDelimiter?: string): CSVArray {
        // 检查分隔符是否定义，默认使用逗号
        strDelimiter = (strDelimiter || ",");

        // 创建正则表达式来解析CSV值
        const objPattern = new RegExp(
            (
                // 分隔符
                "(\"" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // 带引号的字段
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // 标准字段
                "([^\"\"" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );

        // 创建数组来保存数据，默认添加一个空的第一行
        const arrData: CSVArray = [[]];

        // 创建数组来保存单个模式匹配组
        let arrMatches: RegExpExecArray | null = null;

        // 循环匹配正则表达式，直到找不到匹配项
        while ((arrMatches = objPattern.exec(strData)) !== null) {
            // 获取找到的分隔符
            const strMatchedDelimiter = arrMatches[1];

            // 检查分隔符是否有长度（不是字符串开头）并且是否匹配字段分隔符
            // 如果不匹配，则表示这是行分隔符
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
            ) {
                // 由于我们已经到达新的数据行，向数据数组添加一个空行
                arrData.push([]);
            }

            let strMatchedValue: string;

            // 检查捕获的是哪种值（带引号或不带引号）
            if (arrMatches[2]) {
                // 找到带引号的值，移除转义的双引号
                strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            } else {
                // 找到不带引号的值
                strMatchedValue = arrMatches[3];
            }

            // 将值添加到数据数组
            arrData[arrData.length - 1].push(strMatchedValue);
        }

        // 返回解析后的数据
        return arrData;
    },

    /**
     * 将CSV字符串转换为DataSet对象
     * @param csvStr CSV字符串
     * @param split 分隔符，默认为逗号
     * @returns DataSet对象
     */
    getDataSet: function (csvStr: string, split?: string): DataSet {
        // 解析CSV字符串为二维数组
        const arr = this.CSVToArray(csvStr, split || ',');

        const data: CSVDataItem[] = [];

        // 获取表头
        const header = arr[0];

        // 遍历数据行，跳过表头和最后一行（可能为空）
        for (let i = 1; i < arr.length - 1; i++) {
            const line = arr[i];
            const item: CSVDataItem = {};
            
            // 遍历每个字段
            for (let j = 0; j < line.length; j++) {
                let value = line[j];
                
                // 如果字段名是'geometry'，则解析为JSON对象
                if (header[j] === 'geometry') {
                    value = JSON.parse(value);
                }
                
                item[header[j]] = value;
            }
            
            data.push(item);
        }

        // 创建并返回DataSet对象
        return new DataSet(data);
    }
};