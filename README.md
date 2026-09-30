# INDEX 索引 — 展览灵感档案平台

**INDEX Final / v1.0 · Exhibition Inspiration Archive**

面向艺术设计学生、设计师与创意工作者的本地优先 Web App。通过「发现 → 检索 → 拆解 → 收藏 → 整理」，把真实展览转化为设计研究资料。沿用 V2 的米白背景、编辑式网格、细线、留白和中英文字体层级。

## 功能

- 12 个真实展览、66 条独立灵感素材，每个展览 4–6 条。
- 首页、档案、六类专业筛选、展览详情、分组即时搜索、关于页面。
- 分类通过首页的「按专业方向浏览」进入；点击直接打开带筛选条件的档案。
- 搜索「灯光 / light / lighting」得到 9 个相关展览、13 条灵感素材；素材结果直接定位到所属详情中的图片。
- 收藏单条素材到已有或新建灵感板；查看、重命名、删除灵感板、移除素材、导出 JSON。
- 同浏览器同源 localStorage 持久化、跨标签页更新；损坏数据恢复备份与存储失败提示。
- 图片缩略图、懒加载、加载失败替代状态；移动端、可见焦点、键盘弹窗与 reduced-motion。

## Tech Stack

React 19 · TypeScript 5 · React Router 7 · Vite 7 · 原生 CSS。Node.js 22.12+（本次验证使用 Node 24.19）。Playwright 用于浏览器测试，无后端、数据库或账号依赖。

## 安装与运行

在本目录打开终端：

```sh
npm install
npm run dev -- --port 5174 --strictPort
```

打开 http://127.0.0.1:5174 。保持终端运行，Ctrl+C 停止。固定使用相同的主机和端口，才能读取同一份本地收藏。

```sh
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run preview -- --port 4174 --strictPort
```

`dist/` 是生产构建，生产预览地址为 http://127.0.0.1:4174 。不要直接双击 `dist/index.html`；需要 HTTP 服务。若部署静态托管，所有前端路径应回退到 `index.html`，可参考附带的 Netlify 配置。

浏览器测试优先使用 Windows 已安装的 Edge。其他环境可执行 `npx playwright install chromium`，或通过 `PLAYWRIGHT_EXECUTABLE_PATH` 指定 Chromium 浏览器路径。QA 测试使用隔离浏览器环境，不修改日常浏览器的收藏。

GitHub 仓库交付源码与资源，不提交 `node_modules/`、`dist/`、环境文件、缓存或临时输出；执行 `npm install` 和 `npm run build` 可重建依赖与生产产物。

## 数据与版权

案例来自 MoMA、V&A、Design Museum、Cooper Hewitt / Smithsonian 的公开官方展览、Press、馆藏与项目资料。名称、机构、地点、展期与来源核实记录见 `SOURCE-VALIDATION.md`。查询于 2026-09-30；网站不在核实日期之后继续宣称实时展览状态。

中文标题与摘要为编辑译写；素材标题、分类和说明属于 INDEX 的视觉观察，不冒充机构原文或技术规格。资料中缺失的设计师、摄影师、版权字段不补造。作品资料图与现场图均按来源标注，不把所有资料图描述为现场摄影。

66 条素材均附官方来源、原图地址与 Credit，见 `IMAGE-SOURCES.json` 和 `src/data/inspirations.json`。图片版权归原权利方所有，来源署名不等于通用使用许可。此交付为课程研究原型；公开作品集上线或商业使用前，需按各机构条款确认许可，尤其是 Press 图像。Inter 字体许可见 `FONT-LICENSE.txt`。

## 本地存储

- 为兼容旧版本保留键名 `index.boards.v2`，值为灵感板数组；该键名不是产品版本号。
- 收藏以素材 ID 保存，旧 V2 ID 仍可解析。没有独立账号与云端副本。
- localStorage 按浏览器、设备、协议、域名和端口隔离；5173、5174、4174 的收藏不自动互通。
- 清除站点数据会删除收藏。导出 JSON 可供离线备份与研究整理，v1.0 未提供导入按钮。
- 存储被禁用或空间不足时会显示提示；当前操作只保留在内存中，不会假称保存成功。
- 损坏的旧数据在首次写入前保存到带时间戳的 recovery 键；恢复备份写入失败时不会覆盖原数据。
- 三个初始空灵感板是可编辑的研究起点，没有伪造收藏数量或预填个人数据。

## 交付目录

| 路径 | 内容 |
|---|---|
| `src/` | React 前端源码 |
| `src/data/` | 展览、灵感素材 JSON 数据集 |
| `src/lib/` | 检索同义词与本地存储校验 |
| `public/images/`, `public/thumbs/` | 本地图片与 WebP 缩略图 |
| `IMAGE-SOURCES.json` | 66 条图片来源及 Credit |
| `SOURCE-VALIDATION.md` | 官方资料核实与日期精度说明 |
| `DESIGN-TOKENS.json` | 沿用 V2 的设计规范与可读性补充 |
| `dist/` | 可部署生产构建 |
| `tests/`, `qa/` | 自动测试、结果与视觉预览 |
| `FINAL-REPORT.md` | 封版报告 |

## 验证与限制

3 项数据/逻辑测试、9 组浏览器测试通过；覆盖七条指定 QA 流程、全部 12 个详情与 66 张素材图，以及 1440 / 1280 / 1024 / 768 / 390px。生产构建另行冒烟验证。自动无障碍审计没有已确认违规；页脚超大字标因裁切产生的自动对比度待判项已人工核对为黑字/米白底。自动测试不等同于完整 WCAG 认证。

无登录、无云同步、无跨设备同步；浏览器测试在 Windows Edge/Chromium 完成，未宣称 Safari、Firefox 或真实手机硬件验证。展览资料是核实日期的快照。未来方向仅保留 Account、Cloud Sync、Cross-device Boards，v1.0 不实现这些功能。

## 版本保护

Final 是独立目录。V1 Figma 插件/首页预览与 V2 源码、旧插件均保留；旧版本内容已进行哈希比对。此轮未改写 Figma 文件，Figma V1 仍作为设计过程档案保留。最终 ZIP 包含源码、数据、图片、Credits、构建、说明与测试记录，不包含 node_modules。
