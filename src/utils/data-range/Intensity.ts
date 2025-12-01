/**
 * 强度映射工具
 * @author kyle / http://nikai.us/
 */

import Canvas from "../Canvas";

// 定义渐变配置接口
export interface Gradient {
    [key: string]: string;
}

// 定义强度选项接口
export interface IntensityOptions {
    gradient?: Gradient;
    maxSize?: number;
    minSize?: number;
    max?: number;
    min?: number;
}

// 定义图例选项接口
export interface LegendOptions {
    width?: number;
    height?: number;
    showLabels?: boolean;
}

/**
 * 强度映射类，用于处理数据的强度映射，包括颜色渐变、大小映射等
 */
export default class Intensity {
    private gradient: Gradient;
    private maxSize: number;
    private minSize: number;
    private max: number;
    private min: number;
    private paletteCtx: CanvasRenderingContext2D | null = null;

    /**
     * 构造函数
     * @param {IntensityOptions} [options] - 配置选项
     */
    constructor(options?: IntensityOptions) {
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

    /**
     * 设置最大值
     * @param {number} value - 最大值
     */
    setMax(value: number): void {
        this.max = value || 100;
    }

    /**
     * 设置最小值
     * @param {number} value - 最小值
     */
    setMin(value: number): void {
        this.min = value || 0;
    }

    /**
     * 设置最大尺寸
     * @param {number} maxSize - 最大尺寸
     */
    setMaxSize(maxSize: number): void {
        this.maxSize = maxSize || 35;
    }

    /**
     * 设置最小尺寸
     * @param {number} minSize - 最小尺寸
     */
    setMinSize(minSize: number): void {
        this.minSize = minSize || 0;
    }

    /**
     * 初始化调色板
     */
    private initPalette(): void {
        const gradient = this.gradient;
        const canvas = Canvas(256, 1);

        if (canvas) {
            this.paletteCtx = canvas.getContext('2d');
            if (this.paletteCtx) {
                const lineGradient = this.paletteCtx.createLinearGradient(0, 0, 256, 1);

                for (const key in gradient) {
                    lineGradient.addColorStop(parseFloat(key), gradient[key]);
                }

                this.paletteCtx.fillStyle = lineGradient;
                this.paletteCtx.fillRect(0, 0, 256, 1);
            }
        }
    }

    /**
     * 根据值获取颜色
     * @param {number} value - 输入值
     * @returns {string} - 颜色字符串
     */
    getColor(value: number): string {
        const imageData = this.getImageData(value);
        return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, ${imageData[3] / 256})`;
    }

    /**
     * 根据值获取图像数据
     * @param {number} [value] - 输入值，可选
     * @returns {Uint8ClampedArray | number[]} - 图像数据
     */
    getImageData(value?: number): Uint8ClampedArray | number[] {
        if (!this.paletteCtx) {
            return [0, 0, 0, 0];
        }

        const imageData = this.paletteCtx.getImageData(0, 0, 256, 1).data;

        if (value === undefined) {
            return imageData;
        }

        const max = this.max;
        const min = this.min;

        let normalizedValue = value;
        if (normalizedValue > max) {
            normalizedValue = max;
        }

        if (normalizedValue < min) {
            normalizedValue = min;
        }

        const index = Math.floor((normalizedValue - min) / (max - min) * (256 - 1)) * 4;

        return [imageData[index], imageData[index + 1], imageData[index + 2], imageData[index + 3]];
    }

    /**
     * 根据值获取尺寸
     * @param {number} value - 输入值
     * @returns {number} - 尺寸
     */
    getSize(value: number): number {
        let size = 0;
        const max = this.max;
        const min = this.min;
        const maxSize = this.maxSize;
        const minSize = this.minSize;

        let normalizedValue = value;
        if (normalizedValue > max) {
            normalizedValue = max;
        }

        if (normalizedValue < min) {
            normalizedValue = min;
        }

        if (max > min) {
            size = minSize + (normalizedValue - min) / (max - min) * (maxSize - minSize);
        } else {
            return maxSize;
        }

        return size;
    }

    /**
     * 设置渐变色
     * @param {Gradient} gradient - 渐变配置
     */
    setGradient(gradient: Gradient): void {
        this.gradient = gradient;
        this.initPalette();
    }

    /**
     * 获取当前渐变色配置
     * @returns {Gradient} - 渐变配置
     */
    getGradient(): Gradient {
        return this.gradient;
    }

    /**
     * 根据预设主题设置渐变色
     * @param {string} theme - 主题名称
     * @returns {boolean} - 是否成功设置主题
     */
    setTheme(theme: string): boolean {
        const themes: { [key: string]: Gradient } = {
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
     * @returns {string[]} - 主题列表
     */
    getThemes(): string[] {
        return ['rainbow', 'fire', 'water', 'earth'];
    }

    /**
     * 更新最大最小值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     */
    setMinMax(min: number, max: number): void {
        this.min = min;
        this.max = max;
    }

    /**
     * 更新最大最小尺寸
     * @param {number} minSize - 最小尺寸
     * @param {number} maxSize - 最大尺寸
     */
    setMinMaxSize(minSize: number, maxSize: number): void {
        this.minSize = minSize;
        this.maxSize = maxSize;
    }

    /**
     * 获取图例
     * @param {LegendOptions} options - 图例选项
     * @returns {HTMLCanvasElement | null} - 图例Canvas元素
     */
    getLegend(options: LegendOptions): HTMLCanvasElement | null {
        const gradient = this.gradient;
        const width = options.width || 20;
        const height = options.height || 180;
        const canvas = Canvas(width, height);

        if (!canvas) {
            return null;
        }

        const paletteCtx = canvas.getContext('2d');
        if (!paletteCtx) {
            return null;
        }

        const lineGradient = paletteCtx.createLinearGradient(0, height, 0, 0);

        for (const key in gradient) {
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
            const maxLabel = this.max.toString();
            const minLabel = this.min.toString();
            
            paletteCtx.fillText(maxLabel, width + 5, 12);
            paletteCtx.fillText(minLabel, width + 5, height);
            
            // 添加中间值标签
            const midValue = (this.max + this.min) / 2;
            const midLabel = midValue.toFixed(1);
            paletteCtx.fillText(midLabel, width + 5, height / 2);
        }

        return canvas;
    }
}