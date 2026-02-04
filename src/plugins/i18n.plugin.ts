import messages from '@intlify/unplugin-vue-i18n/messages';
import { get } from '@vueuse/core';
import type { Plugin } from 'vue';
import { createI18n } from 'vue-i18n';

// 1. 获取浏览器当前的语言设置 (例如 "zh-CN", "en-US", "ja-JP")
const browserLang = window.navigator.language.toLowerCase();
// 2. 判断逻辑：如果是以 'zh' 开头（包含 zh-CN, zh-TW, zh-HK），则设为 'zh' 否则，一律设为 'en'
const defaultLocale = browserLang.startsWith('zh') ? 'zh' : 'en';
// 3. 这里的 'locale' 是为了兼容用户手动切换语言后的持久化存储
// 如果用户之前手动选过语言，优先用选过的；否则用上面判断出来的默认值
const initialLocale = localStorage.getItem('locale') || defaultLocale;

const i18n = createI18n({
  legacy: false,
  locale: initialLocale, // 使用计算后的语言
  fallbackLocale: 'en',  // 如果某个词条没中文，自动回退到英文
  messages,
});

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export const translate = function (localeKey: string) {
  const hasKey = i18n.global.te(localeKey, get(i18n.global.locale));
  return hasKey ? i18n.global.t(localeKey) : localeKey;
};
