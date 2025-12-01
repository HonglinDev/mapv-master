/*
 * @Author: 李红林 1770679549@qq.com
 * @Date: 2025-12-01 14:42:23
 * @LastEditors: 李红林 1770679549@qq.com
 * @LastEditTime: 2025-12-01 15:27:41
 * @FilePath: \mapv-master\src\utils\Event.ts
 * @Description: 
 * 
 */

// 定义事件回调函数类型
export type EventCallback = (event: string, params: any, senderId: string | null) => void;

// 定义订阅者类型
export interface Subscriber {
    callback: EventCallback;
}

// 定义事件类
export default class Event {
    private _subscribers: { [event: string]: Subscriber[] };

    constructor() {
        this._subscribers = {};  // 事件订阅者集合
    }

    /**
     * 订阅事件，添加事件监听器
     * @param {String} event        事件名称。可用事件: 'put', 'update', 'remove'
     * @param {function} callback   回调方法。接收三个参数:
     *                                  {String} event - 事件名称
     *                                  {Object | null} params - 事件参数
     *                                  {String | Number} senderId - 发送者ID
     */
    on(event: string, callback: EventCallback): void {
        let subscribers = this._subscribers[event];
        if (!subscribers) {
            subscribers = [];
            this._subscribers[event] = subscribers;
        }

        subscribers.push({
            callback: callback
        });
    }

    /**
     * 取消订阅事件，移除事件监听器
     * @param {String} event - 事件名称
     * @param {function} callback - 回调函数
     */
    off(event: string, callback: EventCallback): void {
        const subscribers = this._subscribers[event];
        if (subscribers) {
            //this._subscribers[event] = subscribers.filter(listener => listener.callback != callback);
            for (let i = 0; i < subscribers.length; i++) {
                if (subscribers[i].callback === callback) {
                    subscribers.splice(i, 1);
                    i--;
                }
            }
        }
    }

    /**
     * 触发事件
     * @param {String} event - 事件名称
     * @param {Object | null} params - 事件参数
     * @param {String} [senderId] - 可选的发送者ID
     * @private
     */
    protected _trigger(event: string, params: any, senderId?: string): void {
        if (event === '*') {
            throw new Error('不能触发事件 *');
        }

        const subscribers: Subscriber[] = [];
        if (event in this._subscribers) {
            subscribers.push(...this._subscribers[event]);
        }
        if ('*' in this._subscribers) {
            subscribers.push(...this._subscribers['*']);
        }

        for (let i = 0, len = subscribers.length; i < len; i++) {
            const subscriber = subscribers[i];
            if (subscriber.callback) {
                subscriber.callback(event, params, senderId || null);
            }
        }
    }

    /**
     * 将事件方法绑定到对象
     * @param {Object} obj - 要绑定事件方法的对象
     */
    static bind(obj: any): void {
        const event = new Event();
        obj.on = event.on.bind(event);
        obj.off = event.off.bind(event);
        obj._trigger = event._trigger.bind(event);
        obj._subscribers = event._subscribers;
    }
}
