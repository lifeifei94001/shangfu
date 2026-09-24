# 机型分销价格上浮调整工作台 (Phone Uplift Workbench)

> 一款基于 **Vue 3 + TypeScript + Element Plus + SheetJS** 构建的现代化机型分销上浮调整工作台。采用 **Apple Design 苹果极简美学风格**，支持纯静态前端运行，可一键部署至 **Vercel** 托管平台，代码零门槛托管于 **GitHub**。

---

## 🌟 核心特性

- **🍎 苹果质感美学设计 (Apple Design)**：浅灰背景、高精毛玻璃卡片（`backdrop-filter`）、胶囊拟态控件、SF/苹方字体规范、柔和状态徽章与精致留白。
- **⚡ 纯前端零服务端架构 (Pure SPA)**：
  - 基于 SheetJS 在浏览器纯内存中高速解析与生成 Excel 文件；
  - 核心计算与去重算法 100% 本地运行，敏感价格数据**无需上传任何第三方后端服务器**，安全合规、即开即用；
  - 完美契合 **Vercel** 静态托管，全球 CDN 加速，零运维成本。
- **📱 智能机型上浮值调整中心**：
  - 上传模板后自动聚合提取所有不重复机型（手机品牌、手机型号、baseId、关联代理商数量、最高价格参考）；
  - 支持**单个机型直接微调上浮值**（带绿色变更徽章与一键还原功能）；
  - 支持**批量快捷增减调整**（如当前筛选机型一键 `+1%` / `-1%` / 全部重置）。
- **📊 自动化阶梯公式生成**：
  - 完整复刻原 Python 数据处理脚本核心算法，按 `(baseId, walletId)` 自动去重；
  - 动态适配 Sheet3 阶梯规则（`0~0.3`、`0.3~0.5`、`0.5~0.7`、`0.7~1.0`），依据商品最高价格（以 1500 元为界）匹配精准倍率；
  - 生成结构化、多层级阶梯 JSON 公式并输出标准 Sheet2 8列导入格式。
- **📥 多 Sheet 完整工作簿导出**：
  - 一键导出包含 `Sheet1`（数据源）、`Sheet2`（上浮处理导入结果）、`Sheet3`（规则定义）的完整 `.xlsx` 文件。
- **🧪 内置演示数据**：无需准备文件，点击「载入演示数据」即可体验 iPhone 系列机型的完整调价流。

---

## 🚀 极速上手 (本地开发)

### 1. 环境准备
确保本机已安装 [Node.js](https://nodejs.org/) (建议 v18.0.0 以上)。

### 2. 克隆与安装依赖
```bash
# 1. 进入项目根目录
cd phone-uplift-workbench

# 2. 安装依赖包
npm install
```

### 3. 启动本地开发服务
```bash
npm run dev
```
启动成功后，浏览器访问控制台提示的地址（默认 `http://localhost:3000`）即可使用。

### 4. 本地构建打包
```bash
npm run build
```
构建产物将输出在 `dist/` 目录下。

---

## 🌐 部署指南：GitHub + Vercel 一键上线

本项目为纯前端静态应用，天然支持 Vercel 托管平台。

### 第一步：推送到 GitHub 仓库

1. 在 [GitHub](https://github.com/) 上新建一个公开或私有仓库，例如命名为 `phone-uplift-workbench`。
2. 在本地项目根目录下依次执行：

```bash
git init
git add .
git commit -m "feat: init phone uplift apple-style workbench"
git branch -M main
git remote add origin https://github.com/你的GitHub用户名/phone-uplift-workbench.git
git push -u origin main
```

### 第二步：在 Vercel 导入并一键部署

1. 登录 [Vercel 官网](https://vercel.com/)（使用 GitHub 账号直接登录）。
2. 点击右上角的 **"Add New..."** -> **"Project"**。
3. 在 Import Git Repository 列表中找到刚刚推送的 `phone-uplift-workbench`，点击 **"Import"**。
4. 在配置页面中，Vercel 会自动识别到根目录下的 `vercel.json` 与 Vite 框架：
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 直接点击 **"Deploy"** 按钮，等待 30 秒左右即可完成自动构建与上线！
6. Vercel 会为你生成一个公共域名（如 `https://phone-uplift-workbench.vercel.app`），以后每次你在本地 `git push` 到 GitHub，Vercel 都会自动触发构建并无缝更新！

---

## 📂 核心文件目录结构

```
phone-uplift-workbench/
├── package.json              # 依赖与打包脚本
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 配置文件
├── vercel.json               # Vercel 一键部署配置
├── index.html                # HTML 入口
├── README.md                 # 说明文档
└── src/
    ├── main.ts               # Vue 应用主入口与 Element Plus 初始化
    ├── App.vue               # 核心交互页面（Apple 风格设计系统与三步工作流）
    ├── style.css             # 苹果风格定制样式表
    ├── types/
    │   └── index.ts          # 数据模型与表结构 TypeScript 类型定义
    └── utils/
        ├── calculator.ts     # 阶梯计算公式、倍率与阈值解析核心引擎
        └── excel.ts          # SheetJS 读取解析、机型聚合与多 Sheet 导出
```

---

## 📐 业务字段对照与输出规范

### 1. 导入模板表结构 (`Sheet1`)
| 序号 | 字段名称 | 对应英文键 | 说明 |
|---|---|---|---|
| 1 | id | id | 记录主键 |
| 2 | 机器分组 | groupName | 机器分组类别 |
| 3 | baseId | baseId | 手机机型 ID（核心关联键） |
| 4 | brandId | brandId | 品牌 ID |
| 5 | 联营钱包ID | walletId | 商家钱包账户 ID（核心关联键） |
| 6 | 代理商ID | agentId | 代理商编号 |
| 7 | 代理商名称 | agentName | 代理商名称 |
| 8 | 公司名称 | companyName | 公司全称 |
| 9 | 手机品牌 | brand | 品牌（如 IPHONE） |
| 10 | 手机型号 | model | 型号名称（如 iPhone 17e） |
| 11 | 价格上浮值 | priceUp | 基准价格上浮固定比例 |
| 12 | 最高价格 | maxPrice | 当前机型对应商家的最高价格参考 |

### 2. 输出结果表结构 (`Sheet2` 8列标准导入格式)
| 列序号 | 目标列名 | 取值与处理规则 |
|---|---|---|
| A | baseId（型号ID） | 取自当前组合的 `baseId` |
| B | romId（内存ID） | 留空 |
| C | machineId（机器ID） | 留空 |
| D | walletId（商家钱包账户ID） | 取自当前组合的 `walletId` |
| E | 价格上浮值（固定比例） | 取自用户调整后（或原模板）的机型价格上浮值 |
| F | 价格上浮封顶（封顶值） | 留空 |
| G | 商家分类id | 留空 |
| H | 计算公式 | 依据最高价格档位与阶梯规则动态生成的结构化 JSON 数组 |

### 3. 阶梯规则 (`Sheet3`) 默认计算标准
| 区间范围 (min ~ max) | 判定条件与计算倍率 | 示例 (以设定上浮值 12.1 为例) |
|---|---|---|
| **0.0 ~ 0.3** | `< 1500元` 乘 3；`≥ 1500元` 乘 2 | 最高价 3573 (≥1500) -> 12.1 × 2 = **24.2** |
| **0.3 ~ 0.5** | `< 1500元` 乘 2；`≥ 1500元` 乘 1.5 | 最高价 3573 (≥1500) -> 12.1 × 1.5 = **18.15** |
| **0.5 ~ 0.7** | `< 1500元` 乘 1.5；`≥ 1500元` 乘 1 | 最高价 3573 (≥1500) -> 12.1 × 1 = **12.1** |
| **0.7 ~ 1.0** | `< 1500元` 乘 1；`≥ 1500元` 乘 1 | 最高价 3573 (≥1500) -> 12.1 × 1 = **12.1** |
