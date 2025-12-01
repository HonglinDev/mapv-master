/**
 * GeoJSON解析模块
 * @author kyle / http://nikai.us/
 */

import DataSet from "./DataSet";

// 定义GeoJSON几何类型接口
interface Geometry {
    type: string;
    coordinates: number[] | number[][] | number[][][];
    [key: string]: any;
}

// 定义GeoJSON属性接口
interface Properties {
    [key: string]: any;
}

// 定义GeoJSON要素接口
interface Feature {
    type: string;
    geometry: Geometry;
    properties: Properties;
    [key: string]: any;
}

// 定义GeoJSON对象接口
interface GeoJSON {
    type: string;
    features: Feature[];
    [key: string]: any;
}

// 定义转换后的数据项接口
interface DataItem {
    geometry: Geometry;
    [key: string]: any;
}

export default {
    /**
     * 将GeoJSON对象转换为DataSet对象
     * @param geoJson GeoJSON对象
     * @returns DataSet对象
     */
    getDataSet: function (geoJson: GeoJSON): DataSet {
        const data: DataItem[] = [];
        const features = geoJson.features;
        
        // 遍历GeoJSON要素
        if (features) {
            for (let i = 0; i < features.length; i++) {
                const feature = features[i];
                const geometry = feature.geometry;
                const properties = feature.properties;
                const item: DataItem = {
                    geometry: geometry
                };
                
                // 复制属性
                for (const key in properties) {
                    item[key] = properties[key];
                }
                
                data.push(item);
            }
        }
        
        // 创建并返回DataSet对象
        return new DataSet(data);
    }
};