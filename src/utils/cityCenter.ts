/**
 * 根据城市名称获取中心坐标
 * @author kyle / http://nikai.us/
 */

// 定义城市数据接口
interface City {
    n: string; // 城市名称
    g: string; // 地理坐标和缩放级别
    cities?: City[]; // 下属城市列表（仅省份有）
}

// 定义城市中心数据结构
interface CityCenterData {
    municipalities: City[]; // 直辖市
    provinces: City[]; // 省份
    other: City[]; // 其他地区
}

// 城市中心数据
const citycenter: CityCenterData = {
    municipalities: [
        {n: "北京", g: "116.395645,39.929986|12"},
        {n: "上海", g: "121.487899,31.249162|12"},
        {n: "天津", g: "117.210813,39.14393|12"},
        {n: "重庆", g: "106.530635,29.544606|12"}
    ],
    provinces: [
        {n: "安徽", g: "117.216005,31.859252|8", cities: [{n: "合肥", g: "117.282699,31.866942|12"}]},
        {n: "福建", g: "117.984943,26.050118|8", cities: [{n: "福州", g: "119.330221,26.047125|12"}]},
        {n: "广东", g: "113.394818,23.408004|8", cities: [{n: "广州", g: "113.30765,23.120049|12"}]},
        {n: "广西", g: "108.671981,23.745228|8", cities: [{n: "南宁", g: "108.377632,22.81689|12"}]},
        {n: "贵州", g: "106.713478,26.578343|8", cities: [{n: "贵阳", g: "106.713478,26.578343|12"}]},
        {n: "海南", g: "110.33119,20.031971|8", cities: [{n: "海口", g: "110.33119,20.031971|12"}]},
        {n: "河北", g: "114.514862,38.042818|8", cities: [{n: "石家庄", g: "114.514862,38.042818|12"}]},
        {n: "河南", g: "113.625368,34.746599|8", cities: [{n: "郑州", g: "113.625368,34.746599|12"}]},
        {n: "黑龙江", g: "126.642464,45.756967|8", cities: [{n: "哈尔滨", g: "126.642464,45.756967|12"}]},
        {n: "湖北", g: "114.305393,30.59285|8", cities: [{n: "武汉", g: "114.305393,30.59285|12"}]},
        {n: "湖南", g: "112.93881,28.22808|8", cities: [{n: "长沙", g: "112.93881,28.22808|12"}]},
        {n: "吉林", g: "125.3245,43.817075|8", cities: [{n: "长春", g: "125.3245,43.817075|12"}]},
        {n: "江苏", g: "118.796877,32.060255|8", cities: [{n: "南京", g: "118.796877,32.060255|12"}]},
        {n: "江西", g: "115.858198,28.682025|8", cities: [{n: "南昌", g: "115.858198,28.682025|12"}]},
        {n: "辽宁", g: "123.43286,41.805698|8", cities: [{n: "沈阳", g: "123.43286,41.805698|12"}]},
        {n: "内蒙古", g: "111.670801,40.818311|6", cities: [{n: "呼和浩特", g: "111.670801,40.818311|12"}]},
        {n: "宁夏", g: "106.258357,38.468011|6", cities: [{n: "银川", g: "106.258357,38.468011|12"}]},
        {n: "青海", g: "101.778245,36.623178|6", cities: [{n: "西宁", g: "101.778245,36.623178|12"}]},
        {n: "山东", g: "117.000923,36.675807|8", cities: [{n: "济南", g: "117.000923,36.675807|12"}]},
        {n: "山西", g: "112.54884,37.857014|8", cities: [{n: "太原", g: "112.54884,37.857014|12"}]},
        {n: "陕西", g: "108.939751,34.341568|8", cities: [{n: "西安", g: "108.939751,34.341568|12"}]},
        {n: "四川", g: "104.065735,30.570206|8", cities: [{n: "成都", g: "104.065735,30.570206|12"}]},
        {n: "西藏", g: "91.117514,29.646921|6", cities: [{n: "拉萨", g: "91.117514,29.646921|12"}]},
        {n: "新疆", g: "87.616842,43.825592|6", cities: [{n: "乌鲁木齐", g: "87.616842,43.825592|12"}]},
        {n: "云南", g: "102.832891,24.880058|8", cities: [{n: "昆明", g: "102.832891,24.880058|12"}]},
        {n: "浙江", g: "120.153576,30.287459|8", cities: [{n: "杭州", g: "120.153576,30.287459|12"}]}
    ],
    other: [
        {n: "钓鱼岛", g: "123.474498,25.746388|15"},
        {n: "三沙", g: "112.338941,16.834872|14"}
    ]
};

// 定义坐标接口
interface Coordinate {
    lng: number; // 经度
    lat: number; // 纬度
}

/**
 * 解析地理坐标字符串
 * @param {string} g - 地理坐标字符串，格式为"lng,lat|zoom"
 * @returns {Coordinate} - 解析后的坐标对象
 */
function getCenter(g: string): Coordinate {
    const item = g.split("|");
    const coords = item[0].split(",");
    return {
        lng: parseFloat(coords[0]),
        lat: parseFloat(coords[1])
    };
}

/**
 * 根据城市名称获取省份名称
 * @param {string} name - 城市名称
 * @returns {string | null} - 省份名称，找不到返回null
 */
export function getProvinceNameByCityName(name: string): string | null {
    const provinces = citycenter.provinces;
    for (let i = 0; i < provinces.length; i++) {
        const provinceName = provinces[i].n;
        const cities = provinces[i].cities || [];
        for (let j = 0; j < cities.length; j++) {
            if (cities[j].n === name) {
                return provinceName;
            }
        }
    }
    return null;
}

/**
 * 根据城市名称获取城市中心坐标
 * @param {string} name - 城市名称
 * @returns {Coordinate | null} - 城市中心坐标，找不到返回null
 */
export function getCenterByCityName(name: string): Coordinate | null {
    // 移除城市名称中的"市"字
    name = name.replace('市', '');
    
    // 先查找直辖市
    for (let i = 0; i < citycenter.municipalities.length; i++) {
        if (citycenter.municipalities[i].n === name) {
            return getCenter(citycenter.municipalities[i].g);
        }
    }
    
    // 查找其他地区
    for (let i = 0; i < citycenter.other.length; i++) {
        if (citycenter.other[i].n === name) {
            return getCenter(citycenter.other[i].g);
        }
    }
    
    // 查找省份和下属城市
    const provinces = citycenter.provinces;
    for (let i = 0; i < provinces.length; i++) {
        // 先查找省份
        if (provinces[i].n === name) {
            return getCenter(provinces[i].g);
        }
        
        // 查找下属城市
        const cities = provinces[i].cities || [];
        for (let j = 0; j < cities.length; j++) {
            if (cities[j].n === name) {
                return getCenter(cities[j].g);
            }
        }
    }
    
    return null;
}

export default {
    getProvinceNameByCityName,
    getCenterByCityName
};