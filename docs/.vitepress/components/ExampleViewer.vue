<template>
  <div class="example-viewer">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <div class="example-container">
      <iframe :src="src" frameborder="0" class="example-iframe"></iframe>
    </div>
    <div class="code-container" v-if="code">
      <h3>源代码</h3>
      <div class="code-header">
        <button @click="copyCode" class="copy-btn">
          <span v-if="!copied">复制代码</span>
          <span v-else>已复制</span>
        </button>
      </div>
      <pre><code :class="language">{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  src: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'html'
  }
})

const copied = ref(false)
const code = ref('')

// 从HTML文件中加载代码
onMounted(async () => {
  try {
    const response = await fetch(props.src)
    if (response.ok) {
      code.value = await response.text()
    }
  } catch (err) {
    console.error('加载代码失败:', err)
  }
})

const copyCode = () => {
  navigator.clipboard.writeText(code.value)
    .then(() => {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    })
    .catch(err => {
      console.error('复制失败:', err)
    })
}
</script>

<style scoped>
.example-viewer {
  max-width: 100%;
  margin: 0 auto;
}

.example-container {
  margin: 20px 0;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.example-iframe {
  width: 100%;
  height: 600px;
  border: none;
}

@media (max-width: 768px) {
  .example-iframe {
    height: 400px;
  }
}

.code-container {
  margin: 20px 0;
  background-color: #f7f7f7;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px;
  background-color: #eaeaea;
}

.copy-btn {
  padding: 6px 12px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.copy-btn:hover {
  background-color: #66b1ff;
}

pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
}

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style>