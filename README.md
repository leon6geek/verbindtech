# Verbindtech Machinery 官网（第二版）

参照行业头部企业（Syntegon、GEA、IMA、Krones、ATS）的官网结构，围绕商业定位和客户画像重新设计的双语企业官网（英文 / 印尼语）。

- 定位、对标、客户画像和网站结构的说明：[`docs/strategy.md`](docs/strategy.md)
- 内容来源：公司介绍 PDF（CP-Verbindtech02）、原网站 verbind-tech.net 及其博客文章

## 页面（每页都有英文版和印尼语版，共 24 页）

| 页面 | 文件 | 主要服务的客户 |
| --- | --- | --- |
| 首页 | `index.html` | 所有访客。首屏有 4 个按需求分流的入口 |
| 行业页 ×5 | `industries/*.html` | 制药、食品、快消、化工、汽车行业的工厂和工程负责人 |
| 解决方案 | `solutions.html` | 交钥匙生产线 / 非标设备 / 标准设备 / 制造 |
| 服务 | `services.html` | 维修和设备负责人：报修、维保、改造、备件 |
| 项目案例 | `projects.html` | 工程师和管理层：挑战 → 方案 → 结果，可按行业筛选 |
| 公司 | `about.html` | 采购和管理层：发展历程、能力、合作伙伴、客户、展会 |
| 联系与询价 | `contact.html` | 三步询价表单、服务热线、来厂参观、常见问题 |
| 设备目录 | `catalogue.html` | 81 台设备，可筛选、搜索、一键询价 |

印尼语版本的路径在 `id/` 目录下，例如 `id/index.html`。

## 修改内容

网站由 `src/` 目录里的模板和数据生成，**不要直接改根目录下的 HTML 文件**（它们是生成出来的，会被覆盖）。

```
src/
  data.py          所有文案（英文和印尼语对照）：行业、方案、服务、案例、客户、常见问题、联系方式
  catalog.json     设备目录（名称、类别、英文和印尼语简介）
  templates/       页面模板（base.html 是公共的页头和页脚）
  build.py         生成脚本
assets/
  css/site.css     设计系统（颜色、字体、组件）
  js/site.js       菜单、标签页、筛选、图片灯箱、询价表单
  js/catalog.js    设备目录
  img/             图片（WebP），img/products/ 是设备图片
```

修改后重新生成网站：

```bash
pip install jinja2 pillow
python3 src/build.py
```

常见改动：
- **联系方式**：改 `src/data.py` 里的 `COMPANY`。
- **新增案例**：在 `src/data.py` 的 `PROJECTS` 里加一条，图片放到 `assets/img/`。
- **新增设备**：在 `src/catalog.json` 里加一条，图片放到 `assets/img/products/<id>.webp`。
- **展会信息**：改 `src/data.py` 里的 `EVENT`，以及 `src/templates/about.html` 中的展会区块。

## 本地预览

```bash
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 部署

上传全部文件（`src/` 和 `docs/` 可以不传）到任意静态主机即可。询价表单不需要后台：提交后会打开 WhatsApp 或邮件，并自动填好结构化的询价内容。
