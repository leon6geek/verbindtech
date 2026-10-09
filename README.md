# Verbindtech Machinery — 官网（新版）

基于原网站 [verbind-tech.net](https://verbind-tech.net/home-verbind) 和公司介绍 PDF（CP-Verbindtech02）重新设计的企业官网。
纯静态网站：HTML + CSS + 原生 JavaScript，不需要构建工具，也不需要服务器端程序。

## 页面

| 文件 | 内容 |
| --- | --- |
| `index.html` | 首页：首屏、公司简介与愿景（Quality / Commitment / Trust）、六大业务能力、交钥匙项目（茶粉生产线）、非标设备（SPM）案例、服务行业、六步生产流程、发展历程（2008–2020）、客户与合作伙伴、现场照片、联系方式与询盘表单、地图 |
| `products.html` | 设备目录：81 台标准设备，可按 8 个类别筛选、可搜索，点击可查看详情，并通过 WhatsApp 或邮件一键询价 |

## 设计要点

- **品牌色**：取自 Logo 圆环的橙 → 玫红渐变（`#F5A24A → #DC3566`），搭配暖灰钢色系的中性色。
- **标志性元素**：首屏图片使用斜向「切片」效果，来源于公司 PDF 里反复出现的斜条纹版式。
- **字体**：Archivo（标题使用加宽字形，带工业感）+ JetBrains Mono（编号、标签，模仿工程图纸）。
- **响应式**：适配桌面、平板和手机（390px 宽度已测试，没有横向滚动）。
- **无障碍**：语义化标签、跳转链接、键盘可操作、遵循系统「减少动态效果」设置。

## 目录结构

```
index.html
products.html
assets/
  css/style.css           全站样式（颜色、字体等变量在文件开头 :root）
  js/main.js              导航、滚动动效、筛选、图片灯箱、询盘表单
  js/catalog.js           设备目录页逻辑
  js/products-data.js     设备数据（名称、类别、简介）
  img/                    网站图片（WebP）
  img/products/           设备图片，文件名 = 设备 id
```

## 常见修改

- **联系方式**：WhatsApp 号码和邮箱写在 `assets/js/main.js` 开头（`WA_NUMBER`、`EMAIL`），页面里显示的号码在 `index.html` 的联系方式部分。
- **新增设备**：在 `assets/js/products-data.js` 里加一条记录，再把图片放到 `assets/img/products/<id>.webp`。
- **更换颜色**：修改 `assets/css/style.css` 开头的 `--orange`、`--crimson` 等变量。

## 本地预览

```bash
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 部署

上传全部文件到任意静态主机即可（现有主机、GitHub Pages、Netlify、Cloudflare Pages 等）。
询盘表单不需要后台：提交后会打开 WhatsApp 或邮件客户端，并自动填好询盘内容。

## 内容来源说明

- 文案、发展历程、客户名单、合作伙伴、设备目录来自原网站和公司 PDF，并整理润色为英文。
- 统计数字（2008 年起、25+ 客户、3 个岛屿、6 个合作伙伴）均根据上述资料统计。上线前请再核对一次。
- 客户名单以文字形式展示，没有使用对方 Logo。如需展示 Logo，请先确认客户授权。
