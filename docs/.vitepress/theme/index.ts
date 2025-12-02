/*
 * @Author: 李红林 1770679549@qq.com
 * @Date: 2025-12-02 10:22:42
 * @LastEditors: 李红林 1770679549@qq.com
 * @LastEditTime: 2025-12-02 11:56:35
 * @FilePath: \mapv-master\docs\.vitepress\theme\index.ts
 * @Description: 
 * 
 */
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom-style.css'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout() {
    // 简化主题，直接返回默认布局，确保DOM能正常显示
    return h(DefaultTheme.Layout)
  }
}

