# INDEX Final / v1.0 — 封版报告

INDEX 索引 — 展览灵感档案平台  
Exhibition Inspiration Archive  
封版日期：2026-10-01。保留既有 V2 视觉与产品架构，不新增大型版本。

## 01 最终 Exhibition 数量

**12 个真实展览**，原有案例全部保留。MoMA、V&A、Design Museum、Cooper Hewitt / Smithsonian 官方来源；正式数据中无 V1 虚构项目。

## 02 最终 Inspiration Items 数量

**66 条独立灵感素材**，每个展览 4–6 条。66 个唯一图像文件（SHA-256 校验无重复），不是重复封面。灯光相关素材 13 条，搜索关联到 9 个展览。素材以空间、图形、字体、材料、灯光、装置的具体视觉线索组织。

## 03 新增 / 修改功能

- 独立素材数据模型、66 条中文视觉观察、标签、来源和 Credit。
- 即时双分组搜索及结果数量、分组跳转、空结果建议、素材锚点定位。
- Archive 六类筛选与素材标签联动，详情返回保留筛选条件。
- 详情的逐条素材收藏入口、可见按钮、图片来源与完整观察说明。
- 灵感板 JSON 导出、旧 V2 ID 兼容、跨标签页同步、损坏/禁用存储处理。
- 真实分类预览、五档布局、标题换行、图片 fallback、缩略图与懒加载。
- About 正式品牌文案、字体与灰字/小字号蓝字对比度微调；主体色彩及编辑式布局保留。
- 搜索弹窗焦点恢复、原生模态语义、触屏操作、减少动态效果；修复素材定位和分组标题被固定栏遮挡。
- 生产站点 favicon / 描述完善，消除浏览器自动请求 favicon 的 404。

## 04 Search 可检索字段

展览中文名、英文原名、机构、城市、展览标签、中文简介、英文简介（如有）、英文/中文检索别名；素材中文标题、英文标题、中文说明、标签及所属展览名称/机构/城市。匹配的素材也会关联出所属展览。

支持灯光/light/lighting、材质/material、金属/metal/metallic、字体/type/typography、空间/space、装置/installation、信息/information 等同义词。大小写与全半角规范化，多词查询采用 AND；英文字词边界避免 type 误命中 prototype。结果随输入即时更新。

## 05 Boards 功能状态

通过：单条素材收藏、加入已有板、新建、查看、重命名、删除、移除素材、刷新持久保留、JSON 导出。删除灵感板有明确确认；空板有清晰引导。旧 V2 已收藏图片仍可解析，未知 ID 明确显示不可用并允许移除。

## 06 localStorage 状态

通过：保存、刷新还原、删除同步、跨标签页更新、损坏数据校验与 recovery 备份、写入失败提示。兼容键 `index.boards.v2` 未更换。不读取或修改用户日常浏览器收藏；测试在隔离环境执行。同浏览器、同设备、同源持久保存。

## 07 Responsive 结果

**1440 / 1280 / 1024 / 768 / 390px 全部通过。** 首页、Archive、详情、Boards、单个 Board、About 无整体横向溢出；五档下 Search、Archive Filter 可用。390px 保留可操作导航、响应式图像、按钮和可读正文。浏览器为 Windows Edge（Chromium），未进行真实手机硬件或 Safari/Firefox 验证。

## 08 Accessibility 完成项

重要图片 alt、语义链接/按钮、表单标签、跳到内容、可见 focus、原生 dialog 背景隔离与键盘焦点约束、Esc 关闭及焦点恢复、hover 的键盘/触屏等效入口、aria-pressed/数量播报、prefers-reduced-motion。小字号灰字 #666 与蓝字 #4458F5 作为可读性衍生色；基础品牌 #777/#485CFF 保留。

axe-core WCAG 2 A/AA + 2.1 AA 规则审计：首页、Archive、分类区域、详情、Boards、单个 Board、About、搜索、收藏弹窗共 9 个页面/状态，**0 个已确认违规**。超大页脚 INDEX 因裁切被自动工具列为待人工判定，已核对为 #111111 黑字、#F3F2EE 米白底。此结果不等同于完整 WCAG 认证。

## 09 数据真实性检查

12 个项目官方页/Press/馆藏来源核实，查询日期 2026-09-30；名称、机构、地点、年份、展期、来源记录见 SOURCE-VALIDATION.md。时间冲突优先当前主展期；仅给月份的日期不编造具体日；未提供的设计师等字段留空。核实日期之后不继续显示实时状态。中文译写及素材说明明确标作编辑观察。

## 10 Image Credit 状态

**66/66 有官方来源与 Credit**；36 条有明确摄影师结构化署名，22 条有来源提供的明确 copyright 字段，其余留空，不推断。原始 Credit 文字完整保留。图片版权归原权利方，来源公开不表示 INDEX 获得商业/公开传播授权。公开上线作品集前仍需核对机构许可。

## 11 安装 / 开发 / Build

`npm install` 成功，`npm run dev` 本地运行正常，`npm run typecheck` 成功，`npm run build` 成功。使用 Node 24.19 与官方 npm CLI；本机没有全局 npm，但所有 npm 脚本已用同一 CLI 执行。独立环境安装 Node/npm 后可以使用标准命令。

Vite 7.3.6：47 modules；主 JS 约 386.93 kB（gzip 116.00 kB），CSS 约 23.45 kB（gzip 5.41 kB）。构建产物位于 dist。无新增运行时重型依赖，无 WebGL/3D。图片资源不计入 JS bundle，列表使用 640px WebP 缩略图，详情图片按需载入。

## 12 测试结果

**3/3 数据与逻辑测试、9/9 浏览器测试通过。**

| 流程 | 结果 |
|---|---|
| Homepage → Archive → SPACE → 项目 → 返回原筛选 | 通过 |
| 搜索灯光 → 两类结果 → 定位所属项目素材 | 通过，9 展览 / 13 素材 |
| 详情收藏 → 已有板 / 新建板 → 查看 → 移除 → 刷新 | 通过 |
| Board 重命名 → 删除 → localStorage 检查 | 通过 |
| 五档 Responsive + Search / Filter | 通过 |
| 空结果、无效筛选、无效路径、破图、损坏/拒绝存储 | 通过 |
| 主要导航、分类焦点/点击、弹窗键盘与 reduced-motion | 通过 |
| 全部 12 详情 / 66 图像 / 素材锚点 | 通过 |
| 旧 V2 收藏兼容与跨标签页同步 | 通过 |

生产构建另外在 4174 端口打开首页、筛选档案、详情、Boards、About 与 Search：无控制台 error/warning，无资源 HTTP 失败。测试详情见 qa/browser-results.json、qa/production-smoke.json、qa/accessibility-audit.json。桌面/手机截图见 qa。现场视觉检查覆盖首页完整纵向布局、移动首屏与搜索素材网格。

## 13 本地运行方式

在 Final 目录中：

```sh
npm install
npm run dev -- --port 5174 --strictPort
```

打开 http://127.0.0.1:5174 。生产版本：`npm run build` 后运行 `npm run preview -- --port 4174 --strictPort`，打开 http://127.0.0.1:4174 。两端口的收藏独立；现场演示固定使用同一地址。README 包含本机 npm CLI 等效命令。

## 14 Final 目录与备份

`C:\Users\34769\Documents\Codex\2026-09-30\index-master-brief-project-index-a\outputs\INDEX-FINAL-v1.0`

同级 `INDEX-FINAL-v1.0.zip` 为完整冻结交付包（源码、数据、assets、credits、README、dist、测试与预览；排除 node_modules）。`RELEASE-MANIFEST.json` 记录交付文件 SHA-256。

Final 独立复制自 V2。原 V2 88 个文件、V1 24 个文件哈希全部一致；V2 开工前 ZIP 与 V1 存档仍保留在工作区，旧 Figma 插件不覆盖。Figma V1 保留，本次没有在 Figma 中新增或改写 Final 页面。

## 15 已知限制

- 无登录、无云同步、无跨设备收藏；清除浏览器站点数据会清除本地 Boards。
- JSON 为离线导出，未实现导入与图片整板导出。
- 展览内容为来源核实日期的快照，不提供实时自动更新；缺失事实保留为空。
- 图片使用权限按各机构条款确认，课程原型来源标注不等于公开或商业授权。
- 已在 Windows Edge/Chromium 自动与视觉检查；未宣称真实手机、Safari、Firefox 全覆盖。
- Figma V1 保留为过程档案；本轮最终交付是可运行 Web App。

在上述已测范围内，未发现仍未解决的功能 Bug。后续仅处理 Bug；账号、云同步、跨设备 Boards 只是文档中的未来方向。
