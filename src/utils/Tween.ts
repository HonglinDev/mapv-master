/**
 * Tween.js - 基于MIT许可证
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * 查看 https://github.com/tweenjs/tween.js/graphs/contributors 获取完整贡献者列表。
 * 谢谢大家，你们太棒了！
 */

// 定义缓动函数类型
export type EasingFunction = (k: number) => number;

// 定义插值函数类型
export type InterpolationFunction = (v: number[], k: number) => number;

// 定义回调函数类型
export type TweenCallback = (object: any) => void;
export type UpdateCallback = (progress: number) => void;

// 定义Tween类接口
export interface TweenInstance {
    to(properties: any, duration?: number): this;
    start(time?: number): this;
    stop(): this;
    end(): this;
    stopChainedTweens(): this;
    delay(amount: number): this;
    repeat(times: number): this;
    repeatDelay(amount: number): this;
    yoyo(yoyo: boolean): this;
    easing(easing: EasingFunction): this;
    interpolation(interpolation: InterpolationFunction): this;
    chain(...tweens: TweenInstance[]): this;
    onStart(callback: TweenCallback): this;
    onUpdate(callback: UpdateCallback): this;
    onComplete(callback: TweenCallback): this;
    onStop(callback: TweenCallback): this;
    update(time: number): boolean;
}

// 定义TWEEN主对象接口
export interface TWEENStatic {
    getAll(): TweenInstance[];
    removeAll(): void;
    add(tween: TweenInstance): void;
    remove(tween: TweenInstance): void;
    update(time?: number, preserve?: boolean): boolean;
    now(): number;
    Tween: new (object: any) => TweenInstance;
    Easing: any;
    Interpolation: any;
}

// TWEEN主对象实现
const TWEEN: TWEENStatic = (function () {

    const _tweens: TweenInstance[] = [];

    return {
        /**
         * 获取所有活动的tween实例
         */
        getAll: function (): TweenInstance[] {
            return _tweens;
        },

        /**
         * 移除所有tween实例
         */
        removeAll: function (): void {
            _tweens.length = 0;
        },

        /**
         * 添加一个tween实例
         */
        add: function (tween: TweenInstance): void {
            _tweens.push(tween);
        },

        /**
         * 移除一个tween实例
         */
        remove: function (tween: TweenInstance): void {
            const i = _tweens.indexOf(tween);
            if (i !== -1) {
                _tweens.splice(i, 1);
            }
        },

        /**
         * 更新所有tween实例
         */
        update: function (time?: number, preserve?: boolean): boolean {
            if (_tweens.length === 0) {
                return false;
            }

            let i = 0;
            time = time !== undefined ? time : TWEEN.now();

            while (i < _tweens.length) {
                if (_tweens[i].update(time) || preserve) {
                    i++;
                } else {
                    _tweens.splice(i, 1);
                }
            }

            return true;
        },

        /**
         * 获取当前时间
         */
        now: function (): number {
            return 0; // 初始值，后续会被覆盖
        }
    };

})() as any;

// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
    TWEEN.now = function (): number {
        const time = process.hrtime();
        // Convert [seconds, nanoseconds] to milliseconds.
        return time[0] * 1000 + time[1] / 1000000;
    };
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined' &&
         window.performance !== undefined &&
         window.performance.now !== undefined) {
    // This must be bound, because directly assigning this function
    // leads to an invocation exception in Chrome.
    TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
    TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
    TWEEN.now = function (): number {
        return new Date().getTime();
    };
}

/**
 * Tween类实现
 */
TWEEN.Tween = function (object: any): TweenInstance {
    const _object = object;
    const _valuesStart: { [key: string]: number | number[] } = {};
    let _valuesEnd: { [key: string]: number | number[] | string } = {};
    let _valuesStartRepeat: { [key: string]: number } = {};
    let _duration = 1000;
    let _repeat = 0;
    let _repeatDelayTime: number | undefined;
    let _yoyo = false;
    let _isPlaying = false;
    let _reversed = false;
    let _delayTime = 0;
    let _startTime: number | null = null;
    let _easingFunction: EasingFunction = TWEEN.Easing.Linear.None;
    let _interpolationFunction: InterpolationFunction = TWEEN.Interpolation.Linear;
    const _chainedTweens: TweenInstance[] = [];
    let _onStartCallback: TweenCallback | null = null;
    let _onStartCallbackFired = false;
    let _onUpdateCallback: UpdateCallback | null = null;
    let _onCompleteCallback: TweenCallback | null = null;
    let _onStopCallback: TweenCallback | null = null;

    const tween = {
        /**
         * 设置目标属性和持续时间
         */
        to: function (properties: any, duration?: number): TweenInstance {
            _valuesEnd = properties;
            if (duration !== undefined) {
                _duration = duration;
            }
            return this;
        },

        /**
         * 开始tween动画
         */
        start: function (time?: number): TweenInstance {
            TWEEN.add(this);
            _isPlaying = true;
            _onStartCallbackFired = false;
            _startTime = time !== undefined ? time : TWEEN.now();
            _startTime += _delayTime;

            for (const property in _valuesEnd) {
                // Check if an Array was provided as property value
                if (_valuesEnd[property] instanceof Array) {
                    if ((_valuesEnd[property] as any).length === 0) {
                        continue;
                    }
                    // Create a local copy of the Array with the start value at the front
                    (_valuesEnd[property] as any) = [_object[property]].concat(_valuesEnd[property]);
                }

                // If `to()` specifies a property that doesn't exist in the source object,
                // we should not set that property in the object
                if (_object[property] === undefined) {
                    continue;
                }

                // Save the starting value.
                _valuesStart[property] = _object[property];
                if ((_valuesStart[property] instanceof Array) === false) {
                    _valuesStart[property] = Number(_valuesStart[property]); // Ensures we're using numbers, not strings
                }
                _valuesStartRepeat[property] = _valuesStart[property] as number || 0;
            }

            return this;
        },

        /**
         * 停止tween动画
         */
        stop: function (): TweenInstance {
            if (!_isPlaying) {
                return this;
            }

            TWEEN.remove(this);
            _isPlaying = false;

            if (_onStopCallback !== null) {
                _onStopCallback.call(_object, _object);
            }

            this.stopChainedTweens();
            return this;
        },

        /**
         * 立即结束tween动画
         */
        end: function (): TweenInstance {
            this.update((_startTime as number) + _duration);
            return this;
        },

        /**
         * 停止所有链式tween动画
         */
        stopChainedTweens: function (): TweenInstance {
            for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                _chainedTweens[i].stop();
            }
            return this;
        },

        /**
         * 设置延迟时间
         */
        delay: function (amount: number): TweenInstance {
            _delayTime = amount;
            return this;
        },

        /**
         * 设置重复次数
         */
        repeat: function (times: number): TweenInstance {
            _repeat = times;
            return this;
        },

        /**
         * 设置重复延迟时间
         */
        repeatDelay: function (amount: number): TweenInstance {
            _repeatDelayTime = amount;
            return this;
        },

        /**
         * 设置是否反向播放
         */
        yoyo: function (yoyo: boolean): TweenInstance {
            _yoyo = yoyo;
            return this;
        },

        /**
         * 设置缓动函数
         */
        easing: function (easing: EasingFunction): TweenInstance {
            _easingFunction = easing;
            return this;
        },

        /**
         * 设置插值函数
         */
        interpolation: function (interpolation: InterpolationFunction): TweenInstance {
            _interpolationFunction = interpolation;
            return this;
        },

        /**
         * 设置链式tween动画
         */
        chain: function (...args: TweenInstance[]): TweenInstance {
            _chainedTweens.length = 0;
            for (let i = 0, numArgs = args.length; i < numArgs; i++) {
                _chainedTweens.push(args[i]);
            }
            return this;
        },

        /**
         * 设置开始回调
         */
        onStart: function (callback: TweenCallback): TweenInstance {
            _onStartCallback = callback;
            return this;
        },

        /**
         * 设置更新回调
         */
        onUpdate: function (callback: UpdateCallback): TweenInstance {
            _onUpdateCallback = callback;
            return this;
        },

        /**
         * 设置完成回调
         */
        onComplete: function (callback: TweenCallback): TweenInstance {
            _onCompleteCallback = callback;
            return this;
        },

        /**
         * 设置停止回调
         */
        onStop: function (callback: TweenCallback): TweenInstance {
            _onStopCallback = callback;
            return this;
        },

        /**
         * 更新tween动画
         */
        update: function (time: number): boolean {
            let property: string;
            let elapsed: number;
            let value: number;

            if (time < _startTime!) {
                return true;
            }

            if (_onStartCallbackFired === false) {
                if (_onStartCallback !== null) {
                    _onStartCallback.call(_object, _object);
                }
                _onStartCallbackFired = true;
            }

            elapsed = (time - _startTime!) / _duration;
            elapsed = elapsed > 1 ? 1 : elapsed;

            value = _easingFunction(elapsed);

            for (property in _valuesEnd) {
                // Don't update properties that do not exist in the source object
                if (_valuesStart[property] === undefined) {
                    continue;
                }

                const start = _valuesStart[property] as number;
                const end = _valuesEnd[property];

                if (end instanceof Array) {
                    _object[property] = _interpolationFunction(end, value);
                } else {
                    // Parses relative end values with start as base (e.g.: +10, -3)
                    let parsedEnd: number;
                    if (typeof end === 'string') {
                        if (end.charAt(0) === '+' || end.charAt(0) === '-') {
                            parsedEnd = start + parseFloat(end);
                        } else {
                            parsedEnd = parseFloat(end);
                        }
                    } else {
                        parsedEnd = end as number;
                    }

                    // Protect against non numeric properties.
                    if (typeof parsedEnd === 'number') {
                        _object[property] = start + (parsedEnd - start) * value;
                    }
                }
            }

            if (_onUpdateCallback !== null) {
                _onUpdateCallback.call(_object, value);
            }

            if (elapsed === 1) {
                if (_repeat > 0) {
                    if (isFinite(_repeat)) {
                        _repeat--;
                    }

                    // Reassign starting values, restart by making startTime = now
                    for (property in _valuesStartRepeat) {
                        const endValue = _valuesEnd[property];
                        if (typeof endValue === 'string') {
                            _valuesStartRepeat[property] += parseFloat(endValue);
                        } else if (typeof endValue === 'number') {
                            _valuesStartRepeat[property] += endValue;
                        }

                        if (_yoyo) {
                            const tmp = _valuesStartRepeat[property];
                            const endVal = _valuesEnd[property];
                            if (typeof endVal === 'number') {
                                _valuesStartRepeat[property] = endVal;
                                _valuesEnd[property] = tmp;
                            }
                        }

                        _valuesStart[property] = _valuesStartRepeat[property];
                    }

                    if (_yoyo) {
                        _reversed = !_reversed;
                    }

                    if (_repeatDelayTime !== undefined) {
                        _startTime = time + _repeatDelayTime;
                    } else {
                        _startTime = time + _delayTime;
                    }

                    return true;
                } else {
                    if (_onCompleteCallback !== null) {
                        _onCompleteCallback.call(_object, _object);
                    }

                    for (let i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++) {
                        // Make the chained tweens start exactly at the time they should,
                        // even if the `update()` method was called way past the duration of the tween
                        _chainedTweens[i].start((_startTime as number) + _duration);
                    }

                    return false;
                }
            }

            return true;
        }
    };

    return tween;
} as any;

/**
 * 缓动函数集合
 */
TWEEN.Easing = {
    Linear: {
        None: function (k: number): number {
            return k;
        }
    },

    Quadratic: {
        In: function (k: number): number {
            return k * k;
        },

        Out: function (k: number): number {
            return k * (2 - k);
        },

        InOut: function (k: number): number {
            if ((k *= 2) < 1) {
                return 0.5 * k * k;
            }
            return -0.5 * (--k * (k - 2) - 1);
        }
    },

    Cubic: {
        In: function (k: number): number {
            return k * k * k;
        },

        Out: function (k: number): number {
            return --k * k * k + 1;
        },

        InOut: function (k: number): number {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k + 2);
        }
    },

    Quartic: {
        In: function (k: number): number {
            return k * k * k * k;
        },

        Out: function (k: number): number {
            return 1 - (--k * k * k * k);
        },

        InOut: function (k: number): number {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k;
            }
            return -0.5 * ((k -= 2) * k * k * k - 2);
        }
    },

    Quintic: {
        In: function (k: number): number {
            return k * k * k * k * k;
        },

        Out: function (k: number): number {
            return --k * k * k * k * k + 1;
        },

        InOut: function (k: number): number {
            if ((k *= 2) < 1) {
                return 0.5 * k * k * k * k * k;
            }
            return 0.5 * ((k -= 2) * k * k * k * k + 2);
        }
    },

    Sinusoidal: {
        In: function (k: number): number {
            return 1 - Math.cos(k * Math.PI / 2);
        },

        Out: function (k: number): number {
            return Math.sin(k * Math.PI / 2);
        },

        InOut: function (k: number): number {
            return 0.5 * (1 - Math.cos(Math.PI * k));
        }
    },

    Exponential: {
        In: function (k: number): number {
            return k === 0 ? 0 : Math.pow(1024, k - 1);
        },

        Out: function (k: number): number {
            return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        },

        InOut: function (k: number): number {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            if ((k *= 2) < 1) {
                return 0.5 * Math.pow(1024, k - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
        }
    },

    Circular: {
        In: function (k: number): number {
            return 1 - Math.sqrt(1 - k * k);
        },

        Out: function (k: number): number {
            return Math.sqrt(1 - (--k * k));
        },

        InOut: function (k: number): number {
            if ((k *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - k * k) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        }
    },

    Elastic: {
        In: function (k: number): number {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
        },

        Out: function (k: number): number {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
        },

        InOut: function (k: number): number {
            if (k === 0) {
                return 0;
            }
            if (k === 1) {
                return 1;
            }
            k *= 2;
            if (k < 1) {
                return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
            }
            return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
        }
    },

    Back: {
        In: function (k: number): number {
            const s = 1.70158;
            return k * k * ((s + 1) * k - s);
        },

        Out: function (k: number): number {
            const s = 1.70158;
            return --k * k * ((s + 1) * k + s) + 1;
        },

        InOut: function (k: number): number {
            const s = 1.70158 * 1.525;
            if ((k *= 2) < 1) {
                return 0.5 * (k * k * ((s + 1) * k - s));
            }
            return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        }
    },

    Bounce: {
        In: function (k: number): number {
            return 1 - TWEEN.Easing.Bounce.Out(1 - k);
        },

        Out: function (k: number): number {
            if (k < (1 / 2.75)) {
                return 7.5625 * k * k;
            } else if (k < (2 / 2.75)) {
                return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
            } else if (k < (2.5 / 2.75)) {
                return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
            } else {
                return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
            }
        },

        InOut: function (k: number): number {
            if (k < 0.5) {
                return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
            }
            return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
        }
    }
};

/**
 * 插值函数集合
 */
TWEEN.Interpolation = {
    Linear: function (v: number[], k: number): number {
        const m = v.length - 1;
        const f = m * k;
        const i = Math.floor(f);
        const fn = TWEEN.Interpolation.Utils.Linear;

        if (k < 0) {
            return fn(v[0], v[1], f);
        }

        if (k > 1) {
            return fn(v[m], v[m - 1], m - f);
        }

        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
    },

    Bezier: function (v: number[], k: number): number {
        let b = 0;
        const n = v.length - 1;
        const pw = Math.pow;
        const bn = TWEEN.Interpolation.Utils.Bernstein;

        for (let i = 0; i <= n; i++) {
            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
        }

        return b;
    },

    CatmullRom: function (v: number[], k: number): number {
        const m = v.length - 1;
        let f = m * k;
        let i = Math.floor(f);
        const fn = TWEEN.Interpolation.Utils.CatmullRom;

        if (v[0] === v[m]) {
            if (k < 0) {
                i = Math.floor(f = m * (1 + k));
            }
            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
        } else {
            if (k < 0) {
                return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
            }

            if (k > 1) {
                return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }

            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
        }
    },

    Utils: {
        Linear: function (p0: number, p1: number, t: number): number {
            return (p1 - p0) * t + p0;
        },

        Bernstein: function (n: number, i: number): number {
            const fc = TWEEN.Interpolation.Utils.Factorial;
            return fc(n) / fc(i) / fc(n - i);
        },

        Factorial: (function () {
            const a: number[] = [1];

            return function (n: number): number {
                let s = 1;

                if (a[n]) {
                    return a[n];
                }

                for (let i = n; i > 1; i--) {
                    s *= i;
                }

                a[n] = s;
                return s;
            };
        })(),

        CatmullRom: function (p0: number, p1: number, p2: number, p3: number, t: number): number {
            const v0 = (p2 - p0) * 0.5;
            const v1 = (p3 - p1) * 0.5;
            const t2 = t * t;
            const t3 = t * t2;

            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        }
    }
};

export default TWEEN;
