<template>
  <div class="apple-layout">
    <!-- 左侧系统侧边栏 -->
    <aside class="apple-sidebar">
      <div class="sidebar-top">
        <div class="sidebar-logo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.79 1.06-1.88.94-2.97-1 .04-2.16.67-2.85 1.47-.6.7-1.13 1.81-.99 2.88 1.13.09 2.26-.58 2.9-1.38z" fill="#0071e3"/>
          </svg>
          <div class="logo-title">
            <span class="main-name">定价云工作台</span>
            <span class="version-sub">v2.5 Pro</span>
          </div>
        </div>

        <nav class="sidebar-menu">
          <a class="menu-item active">
            <el-icon :size="18"><HomeFilled /></el-icon>
            <span>首页</span>
          </a>
          <a class="menu-item" @click="handleDownloadTemplate">
            <el-icon :size="18"><Download /></el-icon>
            <span>下载模板</span>
          </a>
          <a class="menu-item" @click="scrollToSection('step1')">
            <el-icon :size="18"><DocumentAdd /></el-icon>
            <span>导入数据</span>
          </a>
          <a class="menu-item" @click="showRuleDrawer = true">
            <el-icon :size="18"><Operation /></el-icon>
            <span>价格规则</span>
          </a>
          <a class="menu-item" @click="scrollToSection('step2')">
            <el-icon :size="18"><Coin /></el-icon>
            <span>上浮管理</span>
          </a>
          <a class="menu-item" @click="scrollToSection('step3')">
            <el-icon :size="18"><DataAnalysis /></el-icon>
            <span>报表中心</span>
          </a>
        </nav>
      </div>

      <!-- 侧边栏底部插画卡片 -->
      <div class="sidebar-footer-card">
        <div class="device-art">
          <div class="mini-phone">
            <div class="notch"></div>
          </div>
          <div class="mini-chart">
            <span class="bar b1"></span>
            <span class="bar b2"></span>
            <span class="bar b3"></span>
          </div>
        </div>
        <span class="art-slogan">让定价更简单！</span>
      </div>
    </aside>

    <!-- 右侧主体内容容器 -->
    <div class="apple-main-container">
      <!-- 顶部 Header -->
      <header class="top-nav-bar">
        <div class="nav-left">
          <div class="header-titles">
            <h1 class="platform-title">分销机型价格上浮管理平台</h1>
            <span class="platform-sub">Distribution Pricing Pro · Apple Design</span>
          </div>
        </div>

        <div class="nav-right">
          <!-- 📥 模板下载功能 -->
          <button class="top-pill-btn highlight-dl" @click="handleDownloadTemplate">
            <el-icon><Download /></el-icon>
            <span>下载标准模板 (.xlsx)</span>
          </button>
          <button class="top-pill-btn" @click="loadSample" :disabled="isLoading">
            <el-icon><DocumentCopy /></el-icon>
            <span>导入演示数据</span>
          </button>
          <button class="top-pill-btn" @click="showRuleDrawer = true">
            <el-icon><Operation /></el-icon>
            <span>表格规则 (Sheet3)</span>
          </button>
          <button v-if="sheet1Data.length > 0" class="top-pill-btn danger" @click="handleReset">
            <el-icon><Refresh /></el-icon>
            <span>重置</span>
          </button>

          <div class="user-pill">
            <div class="avatar-circle">
              <el-icon color="#fff" :size="14"><UserFilled /></el-icon>
            </div>
            <span class="user-name">管理员</span>
            <el-icon :size="12" color="#86868b"><ArrowDown /></el-icon>
          </div>
        </div>
      </header>

      <!-- 主视图滑动区域 -->
      <div class="content-scroll-area">
        <!-- 4大指标看板 -->
        <section class="kpi-grid">
          <div class="kpi-card bg-kpi-blue">
            <div class="kpi-left">
              <div class="kpi-icon-box box-blue">
                <el-icon :size="20"><Document /></el-icon>
              </div>
              <div class="kpi-texts">
                <span class="kpi-label">原始数据行数</span>
                <span class="kpi-number">{{ sheet1Data.length }} <small>条记录</small></span>
              </div>
            </div>
            <div class="kpi-watermark-chart">
              <span></span><span></span><span></span>
            </div>
          </div>

          <div class="kpi-card bg-kpi-purple">
            <div class="kpi-left">
              <div class="kpi-icon-box box-purple">
                <el-icon :size="20"><Cellphone /></el-icon>
              </div>
              <div class="kpi-texts">
                <span class="kpi-label">覆盖机型数量</span>
                <span class="kpi-number">{{ modelList.length }} <small>款机型</small></span>
              </div>
            </div>
            <div class="kpi-watermark-phone"></div>
          </div>

          <div class="kpi-card bg-kpi-orange">
            <div class="kpi-left">
              <div class="kpi-icon-box box-orange">
                <el-icon :size="20"><EditPen /></el-icon>
              </div>
              <div class="kpi-texts">
                <span class="kpi-label">已变更机型</span>
                <span class="kpi-number" :class="{ 'highlight-orange': modifiedModelCount > 0 }">
                  {{ modifiedModelCount }} <small>款已调价</small>
                </span>
              </div>
            </div>
            <div class="kpi-watermark-pen">✎</div>
          </div>

          <div class="kpi-card bg-kpi-green">
            <div class="kpi-left">
              <div class="kpi-icon-box box-green">
                <el-icon :size="20"><Files /></el-icon>
              </div>
              <div class="kpi-texts">
                <span class="kpi-label">输出组合 (Sheet2)</span>
                <span class="kpi-number">{{ sheet2Results.length }} <small>条待导入</small></span>
              </div>
            </div>
            <div class="kpi-watermark-bag"></div>
          </div>
        </section>

        <!-- 步骤 1：导入分销上浮模板 -->
        <section id="step1" class="apple-box-card">
          <div class="card-head">
            <div class="head-left">
              <span class="num-badge">1</span>
              <h2 class="card-title">导入分销上浮模板</h2>
              <el-button size="small" text type="primary" @click="handleDownloadTemplate">
                <el-icon><Download /></el-icon> 下载空白标准模板
              </el-button>
            </div>
            <div class="head-right" v-if="fileName">
              <div class="status-pill-green">
                <span class="dot-green"></span>
                <span>当前模板：<strong>{{ fileName }}</strong></span>
              </div>
            </div>
          </div>

          <div class="upload-area-wrap">
            <el-upload
              drag
              action=""
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileChange"
              accept=".xlsx, .xls"
              class="apple-drop-zone"
            >
              <div class="drop-zone-inner">
                <div class="cloud-icon-circle">
                  <el-icon :size="28" color="#fff"><UploadFilled /></el-icon>
                </div>
                <div class="drop-text-col">
                  <span class="primary-lead">将《机型分销上浮模板.xlsx》拖到此处，或点击浏览</span>
                  <span class="sub-lead">选择包含 Sheet1 数据源与 Sheet3 价格规则的标准表格</span>
                </div>
              </div>
            </el-upload>
          </div>
        </section>

        <!-- 步骤 2：机型上浮值调整中心 -->
        <section id="step2" v-if="modelList.length > 0" class="apple-box-card focus-card">
          <div class="card-head">
            <div class="head-left">
              <span class="num-badge">2</span>
              <h2 class="card-title">机型上浮值调整中心</h2>
              <span class="tag-counter">共 {{ filteredModels.length }} 款机型</span>
            </div>

            <!-- 粘贴领导调价指令按钮 -->
            <div class="head-right">
              <button class="magic-command-button" @click="showCommandDialog = true">
                <span class="spark-star">✨</span>
                <span>粘贴或导入机型价格 (一键自动解析)</span>
              </button>
            </div>
          </div>

          <!-- 苹果机型系列与定位矩阵筛选栏 -->
          <div class="matrix-filter-card">
            <div class="filter-row">
              <span class="filter-title">机型代际：</span>
              <div class="chips-container">
                <button
                  v-for="gen in generationTabs"
                  :key="gen.key"
                  class="matrix-btn"
                  :class="{ active: currentGenTab === gen.key }"
                  @click="currentGenTab = gen.key"
                >
                  {{ gen.label }}
                </button>
              </div>
            </div>

            <div class="filter-row">
              <span class="filter-title">机型定位：</span>
              <div class="chips-container">
                <button
                  v-for="type in typeTabs"
                  :key="type.key"
                  class="matrix-btn type-btn"
                  :class="{ active: currentTypeTab === type.key }"
                  @click="currentTypeTab = type.key"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- 快速搜索与批量操作工具条 -->
          <div class="table-action-bar">
            <div class="bar-left">
              <el-input
                v-model="searchKeyword"
                placeholder="快速搜索型号（如 16 Pro）"
                prefix-icon="Search"
                clearable
                style="width: 260px;"
              />
              <el-switch
                v-model="onlyShowModified"
                active-text="仅看已调价"
                style="margin-left: 12px;"
              />
            </div>

            <div class="bar-right">
              <div v-if="selectedModels.length > 0" class="selection-pill-box">
                <span class="sel-count">已勾选 <strong>{{ selectedModels.length }}</strong> 款</span>
                <el-input-number
                  v-model="batchAdjustDelta"
                  :step="0.5"
                  :precision="1"
                  size="small"
                  style="width: 100px;"
                  placeholder="±数值"
                />
                <el-button size="small" type="primary" plain @click="applyBatchDelta">应用增减</el-button>
                <el-button size="small" @click="resetSelectedModels">还原勾选</el-button>
              </div>

              <div v-else class="batch-btns-wrap">
                <button class="batch-pill-btn" @click="handleBatchAdjustToFiltered(1)">当前结果 +1%</button>
                <button class="batch-pill-btn" @click="handleBatchAdjustToFiltered(-1)">当前结果 -1%</button>
                <button class="batch-pill-btn reset" @click="handleResetAllModels">全部重置</button>
              </div>
            </div>
          </div>

          <!-- 机型列表表格 -->
          <div class="table-container-wrap">
            <el-table
              ref="modelTableRef"
              :data="filteredModels"
              style="width: 100%"
              max-height="520"
              row-key="baseId"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="50" align="center" />
              
              <el-table-column label="机型系列" width="130">
                <template #default="{ row }">
                  <span :class="['model-series-badge', getSeriesBadgeClass(row.seriesType)]">
                    {{ row.seriesType }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column prop="model" label="手机型号" min-width="210">
                <template #default="{ row }">
                  <div class="model-meta-cell">
                    <span class="bold-model-name">{{ row.model }}</span>
                    <span class="base-id-tag">#{{ row.baseId }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="originalPriceUp" label="原模板上浮" width="140" align="center">
                <template #default="{ row }">
                  <span class="dim-percentage">{{ row.originalPriceUp }}%</span>
                </template>
              </el-table-column>

              <el-table-column label="最新上浮设定值" width="220" align="center">
                <template #default="{ row }">
                  <div class="stepper-cell">
                    <el-input-number
                      v-model="row.currentPriceUp"
                      :min="0"
                      :max="200"
                      :step="0.5"
                      :precision="1"
                      size="small"
                      @change="onModelPriceChange(row)"
                    />
                    <span class="pct">%</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="调整状态" width="130" align="center">
                <template #default="{ row }">
                  <div v-if="row.isModified" class="diff-badge" :class="row.currentPriceUp > row.originalPriceUp ? 'plus' : 'minus'">
                    {{ row.currentPriceUp > row.originalPriceUp ? '+' : '' }}{{ (row.currentPriceUp - row.originalPriceUp).toFixed(1) }}%
                  </div>
                  <span v-else class="text-unmodified">未变更</span>
                </template>
              </el-table-column>

              <el-table-column prop="maxPriceRef" label="最高价参考" width="130" align="center">
                <template #default="{ row }">
                  <span class="bold-price">¥{{ row.maxPriceRef }}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="80" align="center">
                <template #default="{ row }">
                  <el-button
                    v-if="row.isModified"
                    link
                    type="primary"
                    size="small"
                    @click="resetSingleModel(row)"
                  >
                    还原
                  </el-button>
                  <span v-else class="action-dots">⋮</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 执行计算底栏 -->
          <div class="card-bottom-actions">
            <div class="tip-indicator">
              <span class="blue-dot"></span>
              <span>调价完成后，系统将基于商家最高价格与 Sheet3 规则自动回填 <strong>Sheet2</strong></span>
            </div>
            <button
              class="primary-run-btn"
              @click="handleRunCalculation"
              :disabled="isProcessing"
            >
              <el-icon><CaretRight /></el-icon>
              <span>{{ isProcessing ? '正在极速运算中...' : '开始执行运算并生成 Sheet2' }}</span>
            </button>
          </div>
        </section>

        <!-- 步骤 3：调整结果导出预览 (支持全量与仅调价增量导出) -->
        <section id="step3" v-if="sheet2Results.length > 0" class="apple-box-card">
          <div class="card-head">
            <div class="head-left">
              <span class="num-badge">3</span>
              <h2 class="card-title">调整结果导出预览 (Sheet2)</h2>
              
              <!-- 视图筛选 Tabs：全部 vs 仅已调价 -->
              <div class="result-view-tabs">
                <button
                  class="res-tab"
                  :class="{ active: resultViewMode === 'all' }"
                  @click="resultViewMode = 'all'"
                >
                  全部结果 ({{ sheet2Results.length }}条)
                </button>
                <button
                  class="res-tab highlight"
                  :class="{ active: resultViewMode === 'modified' }"
                  @click="resultViewMode = 'modified'"
                >
                  🔥 仅已调价机型 ({{ modifiedSheet2Count }}条，含各商家)
                </button>
              </div>
            </div>

            <!-- 双导出按钮：支持全量导出与仅调价增量导出 -->
            <div class="head-right export-button-group">
              <button
                class="export-excel-btn secondary"
                @click="handleExportAll"
                title="导出包含所有机型和商家的完整工作簿"
              >
                <el-icon><Files /></el-icon>
                <span>导出全量结果 ({{ sheet2Results.length }}条)</span>
              </button>

              <button
                class="export-excel-btn primary"
                @click="handleExportModifiedOnly"
                title="只导出今天修改过上浮值的机型及其所有商家行，可直接增量导入后台"
              >
                <el-icon><Download /></el-icon>
                <span>仅导出已调价机型 ({{ modifiedSheet2Count }}条，含各商家)</span>
              </button>
            </div>
          </div>

          <!-- 导出提示条 -->
          <div v-if="modifiedModelCount > 0" class="modified-summary-bar">
            <span class="summary-icon">💡</span>
            <span>本次共微调了 <strong>{{ modifiedModelCount }}</strong> 款机型，覆盖 <strong>{{ modifiedSheet2Count }}</strong> 个商家钱包。点击右上方绿色按钮即可<strong>单独导出调价增量表</strong>，无需全量更新。</span>
          </div>

          <div class="table-container-wrap">
            <el-table
              :data="pagedDisplayResults"
              style="width: 100%"
              max-height="450"
              stripe
            >
              <el-table-column prop="baseId" label="baseId (型号ID)" width="130" align="center" />
              <el-table-column prop="modelName" label="手机型号" min-width="160" />
              <el-table-column prop="walletId" label="walletId (商家钱包账户ID)" width="160" align="center">
                <template #default="{ row }">
                  <span class="code-wallet">{{ row.walletId }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="agentName" label="代理商名称" min-width="170" show-overflow-tooltip />
              <el-table-column prop="priceUp" label="价格上浮值 (固定比例)" width="150" align="center">
                <template #default="{ row }">
                  <span class="result-active-pct">{{ row.priceUp }}%</span>
                </template>
              </el-table-column>
              <el-table-column prop="maxPrice" label="最高价格" width="110" align="center">
                <template #default="{ row }">
                  ¥{{ row.maxPrice }}
                </template>
              </el-table-column>
              <el-table-column label="计算公式 (JSON)" min-width="260">
                <template #default="{ row }">
                  <div class="json-peek-cell">
                    <button class="peek-code-btn" @click="inspectFormula(row)">
                      <el-icon><View /></el-icon> 查看公式
                    </button>
                    <span class="code-summary-tag">{{ getFormulaSummary(row.formulaJson) }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="table-page-nav">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[15, 30, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="currentDisplayResults.length"
            />
          </div>
        </section>
      </div>
    </div>

    <!-- 🌟 智能领导指令解析弹窗 (全场景支持) -->
    <el-dialog
      v-model="showCommandDialog"
      title="智能解析领导调价指令 (文本一键识别)"
      width="720px"
      class="apple-modal"
    >
      <div class="command-modal-content">
        <p class="modal-intro">
          直接将领导在微信/钉钉中发布的指令<strong>整段粘贴在下方</strong>，系统会自动匹配机型和变动幅度：
        </p>

        <!-- 6大领导真实指令一键载入 -->
        <div class="preset-scenarios">
          <span class="scenarios-title">一键载入真实业务指令：</span>
          <div class="scenario-buttons">
            <button class="scenario-chip" @click="loadLeadershipCase(1)">1. 12mini+2% / 15PM+16系+17系+1%</button>
            <button class="scenario-chip" @click="loadLeadershipCase(2)">2. 14全系/15PM/X/XR 梯度上调</button>
            <button class="scenario-chip" @click="loadLeadershipCase(3)">3. 11-14代老机型精细化上调</button>
            <button class="scenario-chip" @click="loadLeadershipCase(4)">4. 17系+16系(不含16e)+15PM 下调1%</button>
            <button class="scenario-chip" @click="loadLeadershipCase(5)">5. XS/12/13/14PM/15P/16e/Air 涨跌</button>
            <button class="scenario-chip" @click="loadLeadershipCase(6)">6. 11~16基础款(除Pro/Max) 上调1%</button>
          </div>
        </div>

        <el-input
          v-model="commandInputText"
          type="textarea"
          :rows="7"
          placeholder="例如粘贴：
分销上浮调整：
iPhone 12 mini，上调2%
iPhone 15 Pro Max，iPhone 16系列，iPhone 17系列，上调1%
@靓仔"
          class="raw-input-textarea"
        />

        <div class="modal-control-row">
          <el-button type="primary" @click="handleAnalyzeCommand">
            <el-icon><Aim /></el-icon> 智能匹配并分析
          </el-button>
          <el-button v-if="commandInputText" text @click="commandInputText = ''">清空输入</el-button>
        </div>

        <!-- 识别结果即时预览 -->
        <div v-if="parsedInstructions.length > 0" class="parsed-preview-panel">
          <div class="preview-lead-bar">
            <span>成功解析出 <strong>{{ parsedInstructions.length }}</strong> 条策略，命中 <strong>{{ totalMatchedCount }}</strong> 款机型：</span>
          </div>

          <div class="preview-scroll-list">
            <div v-for="(item, idx) in parsedInstructions" :key="idx" class="instruction-card">
              <div class="inst-top">
                <span class="inst-text">{{ item.rawLine }}</span>
                <span class="inst-tag" :class="item.actionType">
                  {{ item.actionType === 'set' ? '设定为' : (item.actionType === 'add' ? '上调' : '下调') }}
                  {{ item.value }}%
                </span>
              </div>
              <div class="inst-chips">
                <span
                  v-for="m in item.matchedModels"
                  :key="m.baseId"
                  class="inst-hit-pill"
                >
                  {{ m.model }} <small>({{ m.currentPriceUp }}% ➔ {{ getPreviewPrice(m, item) }}%)</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="modal-footer-btns">
          <el-button @click="showCommandDialog = false">取消</el-button>
          <el-button
            type="primary"
            :disabled="parsedInstructions.length === 0"
            @click="handleApplyInstructions"
          >
            一键应用到当前机型列表
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Sheet3 规则配置抽屉 -->
    <el-drawer
      v-model="showRuleDrawer"
      title="阶梯上浮计算规则配置 (Sheet3)"
      size="480px"
    >
      <div class="drawer-inner-body">
        <p class="drawer-tips">
          系统根据商品的最高价格，自动匹配对应的上浮倍率。默认分界阈值为 <strong>1500元</strong>。
        </p>

        <div v-for="(rule, idx) in activeRules" :key="idx" class="rule-box-card">
          <div class="rule-box-header">
            <span class="rule-tag">区间 {{ idx + 1 }}</span>
            <span class="rule-range-text">范围：{{ rule.min }} ~ {{ rule.max }}</span>
          </div>
          <div class="rule-field">
            <el-form label-position="top">
              <el-form-item label="规则描述与倍率公式">
                <el-input v-model="rule.desc" placeholder="例如：*3（<1500元），*2（≥1500元）" />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="drawer-actions">
          <el-button @click="resetDefaultRules">还原默认规则</el-button>
          <el-button type="primary" @click="showRuleDrawer = false">完成配置</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 公式详情查看弹窗 -->
    <el-dialog
      v-model="showFormulaDialog"
      title="阶梯计算公式详情"
      width="560px"
    >
      <div v-if="currentInspectRow" class="inspect-box">
        <div class="inspect-details">
          <p><strong>机型：</strong>{{ currentInspectRow.modelName }} (baseId: {{ currentInspectRow.baseId }})</p>
          <p><strong>商家：</strong>{{ currentInspectRow.agentName }} (walletId: {{ currentInspectRow.walletId }})</p>
          <p><strong>最高价格基准：</strong>¥{{ currentInspectRow.maxPrice }} | <strong>设定上浮值：</strong>{{ currentInspectRow.priceUp }}%</p>
        </div>
        <pre class="json-code-box">{{ currentInspectRow.formulaJson }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

/* =========================================================================
   1. 完整类型定义 (自包含无外部依赖)
   ========================================================================= */
export type AppleSeriesType = 'Pro Max' | 'Pro' | 'Plus' | 'mini' | 'e' | 'Base' | 'Other'

export interface Sheet1Row {
  id?: number | string
  groupName?: string
  baseId: number
  brandId?: number | string
  walletId: number
  agentId?: number | string
  agentName?: string
  companyName?: string
  brand?: string
  model: string
  priceUp: number
  maxPrice: number
  rawRow?: any
}

export interface ModelSummary {
  baseId: number
  brand: string
  model: string
  originalPriceUp: number
  currentPriceUp: number
  maxPriceRef: number
  agentCount: number
  isModified: boolean
  seriesType: AppleSeriesType
  generation: number | null
}

export interface RuleItem {
  min: number
  max: number
  desc: string
  upperLimit: number | null
}

export interface FormulaEntry {
  min: string
  max: string
  ratio: string
  upperLimit: number | null
}

export interface Sheet2Row {
  baseId: number
  romId: string | null
  machineId: string | null
  walletId: number
  priceUp: number
  priceCap: string | null
  merchantCategoryId: string | null
  formulaJson: string
  modelName?: string
  brandName?: string
  agentName?: string
  maxPrice?: number
}

export interface ParsedInstruction {
  rawLine: string
  actionType: 'add' | 'sub' | 'set'
  value: number
  matchedModels: ModelSummary[]
  unmatchedNames: string[]
}

/* =========================================================================
   2. 阶梯公式计算 (与原 Python 脚本严格对齐)
   ========================================================================= */
const DEFAULT_RULES: RuleItem[] = [
  { min: 0, max: 0.3, desc: '*3（<1500元），*2（≥1500元）', upperLimit: null },
  { min: 0.3, max: 0.5, desc: '*2（<1500元），*1.5（≥1500元）', upperLimit: null },
  { min: 0.5, max: 0.7, desc: '*1.5（<1500元），*1（≥1500元）', upperLimit: null },
  { min: 0.7, max: 1.0, desc: '*1（<1500元），*1（≥1500元）', upperLimit: null }
]

function formatNumber(v: number | string | null | undefined): string {
  if (v === null || v === undefined || v === '') return ''
  const f = typeof v === 'number' ? v : parseFloat(String(v).trim())
  if (isNaN(f)) return ''
  if (Number.isInteger(f)) return String(f)
  return f.toFixed(6).replace(/\.?0+$/, '')
}

function calculateRatio(desc: string, priceUp: number, maxPrice: number): number {
  const multMatches = Array.from(desc.matchAll(/\*(\d+(?:\.\d+)?)/g)).map(m => parseFloat(m[1]))
  const thrMatch = desc.match(/<(\d+(?:\.\d+)?)\s*元/)
  const threshold = thrMatch ? parseFloat(thrMatch[1]) : 1500.0

  let mult = 1.0
  if (multMatches.length >= 2) {
    mult = maxPrice < threshold ? multMatches[0] : multMatches[1]
  } else if (multMatches.length === 1) {
    mult = multMatches[0]
  }

  return Math.round(priceUp * mult * 100000) / 100000
}

function buildFormulaJson(priceUp: number, maxPrice: number, rules: RuleItem[] = DEFAULT_RULES): string {
  const entries: FormulaEntry[] = rules.map(r => {
    const val = calculateRatio(r.desc, priceUp, maxPrice)
    return {
      min: formatNumber(r.min),
      max: formatNumber(r.max),
      ratio: formatNumber(val),
      upperLimit: r.upperLimit
    }
  })
  return JSON.stringify(entries, null, 4)
}

/* =========================================================================
   3. 机型特征与归类 (17系列包含 iPhone Air)
   ========================================================================= */
function classifyAppleModel(modelName: string): { seriesType: AppleSeriesType; generation: number | null } {
  const name = modelName.trim()
  let generation: number | null = null

  const genMatch = name.match(/iPhone\s*(\d+)/i)
  if (genMatch) {
    generation = parseInt(genMatch[1], 10)
  } else if (/iPhone\s*Air/i.test(name)) {
    generation = 17 // 17系列包括 iPhone Air
  }

  let seriesType: AppleSeriesType = 'Other'
  if (/Pro\s*Max/i.test(name)) {
    seriesType = 'Pro Max'
  } else if (/Pro/i.test(name)) {
    seriesType = 'Pro'
  } else if (/Plus/i.test(name)) {
    seriesType = 'Plus'
  } else if (/mini/i.test(name)) {
    seriesType = 'mini'
  } else if (/1[67]e/i.test(name) || /\bSE\b/i.test(name)) {
    seriesType = 'e'
  } else if (/iPhone\s*\d+/i.test(name)) {
    seriesType = 'Base'
  }

  return { seriesType, generation }
}

function getModelMeta(modelName: string) {
  const clean = modelName.replace(/\s+/g, ' ').trim()
  const isProMax = /Pro\s*Max/i.test(clean)
  const isPro = /Pro/i.test(clean) && !isProMax
  const isPlus = /Plus/i.test(clean)
  const isMini = /mini/i.test(clean)
  const isE = /1[67]e/i.test(clean) || /\bSE\b/i.test(clean)
  const isAir = /Air/i.test(clean)
  const isBase = !isPro && !isProMax && !isPlus && !isMini && !isE && !isAir && /iPhone\s*\d+/i.test(clean)

  let generation: number | null = null
  const genMatch = clean.match(/iPhone\s*(\d+)/i)
  if (genMatch) {
    generation = parseInt(genMatch[1], 10)
  } else if (isAir) {
    generation = 17
  }

  return { clean, generation, isBase, isPro, isProMax, isPlus, isMini, isE, isAir }
}

/* =========================================================================
   4. 自然语言领导调价指令智能解析引擎
   ========================================================================= */
function parseInstructions(text: string, allModels: ModelSummary[]): ParsedInstruction[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0)
  const results: ParsedInstruction[] = []

  for (const line of lines) {
    if (/^分销上浮调整[：:]?$/i.test(line) || /^调整要求[：:]?$/i.test(line) || /^[@ ]/.test(line)) continue

    let actionType: 'add' | 'sub' | 'set' = 'add'
    let value = 0

    const setMatch = line.match(/(?:调整为|设为|变为|改为|=)\s*(\d+(?:\.\d+)?)\s*%?/i)
    const subMatch = line.match(/(?:下调|下浮|降|减少|减)\s*(\d+(?:\.\d+)?)\s*%?/i)
    const addMatch = line.match(/(?:上调|上浮|增加|加|\+)\s*(\d+(?:\.\d+)?)\s*%?/i)

    if (setMatch) {
      actionType = 'set'
      value = parseFloat(setMatch[1])
    } else if (subMatch) {
      actionType = 'sub'
      value = parseFloat(subMatch[1])
    } else if (addMatch) {
      actionType = 'add'
      value = parseFloat(addMatch[1])
    } else {
      continue
    }

    const excludes: number[] = []
    const exMatch = line.match(/[（\(](?:不包含|除|排除)(.*?)[）\)]/i)
    if (exMatch) {
      const exContent = exMatch[1].replace(/\s+/g, '').toLowerCase()
      allModels.forEach(m => {
        const mClean = m.model.replace(/\s+/g, '').toLowerCase()
        if (exContent.includes(mClean) || mClean.includes(exContent)) {
          excludes.push(m.baseId)
        }
      })
    }

    let cleanLine = line.replace(/^\d+[\.、，,]\s*/, '')
    cleanLine = cleanLine.replace(/[（\(].*?[）\)]/g, '')
    cleanLine = cleanLine.replace(/(?:上调|下调|上浮|下浮|增加|减少|调整为|设为).*$/, '').trim()

    const rangeMatch = cleanLine.match(/iPhone\s*(\d+)\s*(?:-|至|到)\s*(\d+).*?基础款/i)
    const matchedModels: ModelSummary[] = []
    const unmatchedNames: string[] = []

    if (rangeMatch) {
      const g1 = parseInt(rangeMatch[1], 10)
      const g2 = parseInt(rangeMatch[2], 10)
      const minG = Math.min(g1, g2)
      const maxG = Math.max(g1, g2)

      allModels.forEach(m => {
        const meta = getModelMeta(m.model)
        if (meta.generation && meta.generation >= minG && meta.generation <= maxG && meta.isBase) {
          if (!excludes.includes(m.baseId) && !matchedModels.some(item => item.baseId === m.baseId)) {
            matchedModels.push(m)
          }
        }
      })
    } else {
      const tokens = cleanLine.split(/[,，、；;]+/).map(t => t.trim()).filter(t => t.length > 0)

      for (const token of tokens) {
        const serMatch = token.match(/(?:iPhone\s*)?(\d+)\s*系列/i)
        if (serMatch) {
          const targetGen = parseInt(serMatch[1], 10)
          allModels.forEach(m => {
            const meta = getModelMeta(m.model)
            const isMatch = (meta.generation === targetGen) || (targetGen === 17 && meta.isAir)
            if (isMatch) {
              if (!excludes.includes(m.baseId) && !matchedModels.some(item => item.baseId === m.baseId)) {
                matchedModels.push(m)
              }
            }
          })
          continue
        }

        let searchName = token
        if (!searchName.toLowerCase().startsWith('iphone')) {
          searchName = `iPhone ${searchName}`
        }
        const tClean = searchName.replace(/\s+/g, '').toLowerCase()

        let hit = allModels.find(m => m.model.replace(/\s+/g, '').toLowerCase() === tClean)
        if (!hit) {
          hit = allModels.find(m => {
            const mClean = m.model.replace(/\s+/g, '').toLowerCase()
            return mClean.includes(tClean) || tClean.includes(mClean)
          })
        }

        if (hit && !excludes.includes(hit.baseId) && !matchedModels.some(item => item.baseId === hit!.baseId)) {
          matchedModels.push(hit)
        } else if (/iphone/i.test(token)) {
          unmatchedNames.push(token)
        }
      }
    }

    if (matchedModels.length > 0) {
      results.push({
        rawLine: line,
        actionType,
        value,
        matchedModels,
        unmatchedNames
      })
    }
  }

  return results
}

/* =========================================================================
   5. Excel 读取、计算与导出核心
   ========================================================================= */
function safeNumber(val: any, fallback = 0): number {
  if (val === null || val === undefined || val === '') return fallback
  const num = Number(val)
  return isNaN(num) ? fallback : num
}

async function parseUploadWorkbook(file: File) {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data, { type: 'array' })

  const sheet1Name = workbook.SheetNames.find(n => n.toLowerCase().includes('sheet1')) || workbook.SheetNames[0]
  const ws1 = workbook.Sheets[sheet1Name]
  const rows1: any[][] = XLSX.utils.sheet_to_json(ws1, { header: 1, defval: null })

  if (rows1.length < 2) {
    throw new Error('Sheet1 中没有有效的数据行！')
  }

  const headerRow = rows1[0].map(h => (h ? String(h).trim() : ''))
  const findCol = (keywords: string[], defaultIdx: number) => {
    const idx = headerRow.findIndex(h => keywords.some(k => h.includes(k)))
    return idx >= 0 ? idx : defaultIdx
  }

  const colBaseId = findCol(['baseId', '型号ID'], 2)
  const colWalletId = findCol(['联营钱包ID', 'walletId'], 4)
  const colBrand = findCol(['手机品牌', '品牌'], 8)
  const colModel = findCol(['手机型号', '型号'], 9)
  const colPriceUp = findCol(['价格上浮值', 'priceUp'], 14)
  const colMaxPrice = findCol(['最高价格', 'maxPrice'], 20)
  const colAgentName = findCol(['代理商名称'], 6)

  const sheet1Rows: Sheet1Row[] = []
  const modelMap = new Map<number, any>()

  for (let i = 1; i < rows1.length; i++) {
    const r = rows1[i]
    if (!r || r.length === 0) continue

    const baseIdRaw = r[colBaseId]
    const walletIdRaw = r[colWalletId]

    if (baseIdRaw === null || baseIdRaw === undefined || String(baseIdRaw).trim() === '') continue
    if (walletIdRaw === null || walletIdRaw === undefined || String(walletIdRaw).trim() === '') continue

    const baseId = parseInt(String(baseIdRaw).trim(), 10)
    if (isNaN(baseId)) continue

    const walletId = parseInt(String(walletIdRaw).trim(), 10)
    if (isNaN(walletId)) continue

    const priceUp = safeNumber(r[colPriceUp], 0)
    const maxPrice = safeNumber(r[colMaxPrice], 0)
    const model = r[colModel] ? String(r[colModel]).trim() : `机型-${baseId}`
    const brand = r[colBrand] ? String(r[colBrand]).trim() : 'IPHONE'
    const agentName = r[colAgentName] ? String(r[colAgentName]).trim() : ''

    sheet1Rows.push({ baseId, walletId, brand, model, priceUp, maxPrice, agentName })

    if (!modelMap.has(baseId)) {
      modelMap.set(baseId, { brand, model, priceUp, maxPriceRef: maxPrice, agentSet: new Set([walletId]) })
    } else {
      const item = modelMap.get(baseId)
      item.agentSet.add(walletId)
      if (maxPrice > item.maxPriceRef) item.maxPriceRef = maxPrice
      if (model && model.length > item.model.length) item.model = model
    }
  }

  const models: ModelSummary[] = Array.from(modelMap.entries()).map(([baseId, info]) => {
    const { seriesType, generation } = classifyAppleModel(info.model)
    return {
      baseId,
      brand: info.brand,
      model: info.model,
      originalPriceUp: info.priceUp,
      currentPriceUp: info.priceUp,
      maxPriceRef: info.maxPriceRef,
      agentCount: info.agentSet.size,
      isModified: false,
      seriesType,
      generation
    }
  }).sort((a, b) => {
    const genA = a.generation ?? 0
    const genB = b.generation ?? 0
    if (genB !== genA) return genB - genA
    return b.maxPriceRef - a.maxPriceRef
  })

  // 读取 Sheet3
  let rules: RuleItem[] = [...DEFAULT_RULES]
  const sheet3Name = workbook.SheetNames.find(n => n.toLowerCase().includes('sheet3'))
  if (sheet3Name && workbook.Sheets[sheet3Name]) {
    try {
      const ws3 = workbook.Sheets[sheet3Name]
      const rows3: any[][] = XLSX.utils.sheet_to_json(ws3, { header: 1, defval: null })
      let headerIdx = -1
      for (let i = 0; i < rows3.length; i++) {
        if (rows3[i] && String(rows3[i][0] || '').trim().toLowerCase() === 'min') {
          headerIdx = i
          break
        }
      }
      if (headerIdx >= 0) {
        const parsedRules: RuleItem[] = []
        for (let i = headerIdx + 1; i < rows3.length; i++) {
          const r = rows3[i]
          if (!r || r[0] === null || r[0] === undefined || String(r[0]).trim() === '') break
          parsedRules.push({
            min: safeNumber(r[0]),
            max: safeNumber(r[1]),
            desc: String(r[2] || ''),
            upperLimit: r[3] !== null && r[3] !== undefined && String(r[3]).toLowerCase() !== 'null' ? safeNumber(r[3]) : null
          })
        }
        if (parsedRules.length > 0) rules = parsedRules
      }
    } catch (e) {
      console.warn('解析 Sheet3 失败，使用默认规则：', e)
    }
  }

  return { sheet1Rows, models, rules, rawWorkbook: workbook }
}

function generateSheet2Data(sheet1Rows: Sheet1Row[], modelPriceMap: Map<number, number>, rules: RuleItem[]): Sheet2Row[] {
  const seen = new Set<string>()
  const sheet2Rows: Sheet2Row[] = []

  for (const item of sheet1Rows) {
    const key = `${item.baseId}_${item.walletId}`
    if (seen.has(key)) continue
    seen.add(key)

    const finalPriceUp = modelPriceMap.has(item.baseId) ? modelPriceMap.get(item.baseId)! : item.priceUp
    const formulaJson = buildFormulaJson(finalPriceUp, item.maxPrice, rules)

    sheet2Rows.push({
      baseId: item.baseId,
      romId: null,
      machineId: null,
      walletId: item.walletId,
      priceUp: finalPriceUp,
      priceCap: null,
      merchantCategoryId: null,
      formulaJson,
      modelName: item.model,
      brandName: item.brand,
      agentName: item.agentName,
      maxPrice: item.maxPrice
    })
  }
  return sheet2Rows
}

/* =========================================================================
   6. 界面状态与交互逻辑
   ========================================================================= */
const sheet1Data = ref<Sheet1Row[]>([])
const modelList = ref<ModelSummary[]>([])
const activeRules = ref<RuleItem[]>([...DEFAULT_RULES])
const sheet2Results = ref<Sheet2Row[]>([])
const fileName = ref('')
const isLoading = ref(false)
const isProcessing = ref(false)

const searchKeyword = ref('')
const onlyShowModified = ref(false)
const showRuleDrawer = ref(false)
const showFormulaDialog = ref(false)
const currentInspectRow = ref<Sheet2Row | null>(null)

const showCommandDialog = ref(false)
const commandInputText = ref('')
const parsedInstructions = ref<ParsedInstruction[]>([])

const currentGenTab = ref('all')
const currentTypeTab = ref('all')

// 结果区视图模式：全部 vs 仅已调价机型
const resultViewMode = ref<'all' | 'modified'>('all')

const generationTabs = [
  { key: 'all', label: '全部代际' },
  { key: '17', label: 'iPhone 17' },
  { key: '16', label: 'iPhone 16' },
  { key: '15', label: 'iPhone 15' },
  { key: '14', label: 'iPhone 14' },
  { key: '13', label: 'iPhone 13' },
  { key: '12', label: 'iPhone 12' },
  { key: '11', label: 'iPhone 11' },
  { key: 'older', label: 'X / 旧款' }
]

const typeTabs = [
  { key: 'all', label: '全部定位' },
  { key: 'Base', label: '🌟 基础标准款' },
  { key: 'Pro', label: '👑 Pro / Pro Max' },
  { key: 'Plus', label: '🔹 Plus / mini / e' }
]

const selectedModels = ref<ModelSummary[]>([])
const batchAdjustDelta = ref(1.0)
const currentPage = ref(1)
const pageSize = ref(15)

const modifiedModelCount = computed(() => {
  return modelList.value.filter(m => m.isModified).length
})

// 已调价的 baseId 集合
const modifiedBaseIdSet = computed(() => {
  return new Set(modelList.value.filter(m => m.isModified).map(m => m.baseId))
})

// 已调价机型覆盖的 Sheet2 记录总行数
const modifiedSheet2Count = computed(() => {
  return sheet2Results.value.filter(r => modifiedBaseIdSet.value.has(r.baseId)).length
})

// 当前结果区展示列表 (支持全量与仅调价过滤)
const currentDisplayResults = computed(() => {
  if (resultViewMode.value === 'modified') {
    return sheet2Results.value.filter(r => modifiedBaseIdSet.value.has(r.baseId))
  }
  return sheet2Results.value
})

const pagedDisplayResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return currentDisplayResults.value.slice(start, start + pageSize.value)
})

const filteredModels = computed(() => {
  let list = modelList.value

  if (currentGenTab.value !== 'all') {
    if (currentGenTab.value === 'older') {
      list = list.filter(m => !m.generation || m.generation <= 10)
    } else {
      const g = parseInt(currentGenTab.value, 10)
      list = list.filter(m => m.generation === g)
    }
  }

  if (currentTypeTab.value !== 'all') {
    if (currentTypeTab.value === 'Base') {
      list = list.filter(m => m.seriesType === 'Base')
    } else if (currentTypeTab.value === 'Pro') {
      list = list.filter(m => m.seriesType === 'Pro' || m.seriesType === 'Pro Max')
    } else if (currentTypeTab.value === 'Plus') {
      list = list.filter(m => m.seriesType === 'Plus' || m.seriesType === 'mini' || m.seriesType === 'e')
    }
  }

  if (onlyShowModified.value) {
    list = list.filter(m => m.isModified)
  }

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter(m => 
      m.model.toLowerCase().includes(kw) || 
      String(m.baseId).includes(kw) ||
      m.brand.toLowerCase().includes(kw)
    )
  }

  return list
})

const totalMatchedCount = computed(() => {
  const set = new Set<number>()
  parsedInstructions.value.forEach(item => {
    item.matchedModels.forEach(m => set.add(m.baseId))
  })
  return set.size
})

const handleFileChange = async (fileObj: any) => {
  const rawFile = fileObj.raw as File
  if (!rawFile) return

  isLoading.value = true
  try {
    const parsed = await parseUploadWorkbook(rawFile)
    sheet1Data.value = parsed.sheet1Rows
    modelList.value = parsed.models
    activeRules.value = parsed.rules
    fileName.value = rawFile.name
    sheet2Results.value = []
    ElMessage.success(`成功导入《${rawFile.name}》，已自动归集 ${parsed.models.length} 款独立机型！`)
  } catch (err: any) {
    ElMessage.error(err.message || '文件解析失败！')
  } finally {
    isLoading.value = false
  }
}

// 🌟 新增需求 1：一键下载标准上浮模板 (.xlsx)
const handleDownloadTemplate = () => {
  const wb = XLSX.utils.book_new()

  // 1. Sheet1 标准表头与示例
  const sheet1Header = ['id', '机器分组', 'baseId', 'brandId', '联营钱包ID', '代理商ID', '代理商名称', '公司名称', '手机品牌', '手机型号', '手机型号是否有效', '型号内存', '机器名称', '机器分组id', '价格上浮值', '价格上浮封顶', '计算公式', '配置是否有效', '创建时间', '更新时间', '最高价格']
  const sampleRows = [
    sheet1Header,
    [66498, '', 18472, 1, 1034, 965, '山西小机（苹果）', '山西小机（苹果）', 'IPHONE', 'iPhone 17e', '有效', '', '', '', 12.1, '', '', '有效', '2026-03-30 18:02:40', '2026-07-23 14:57:11', 3573],
    [66482, '', 9234, 1, 5554, 5425, '广东懂机汇（苹果）', '广东懂机汇（苹果）', 'IPHONE', 'iPhone 13 Pro Max', '有效', '', '', '', 19.1, '', '', '有效', '2026-02-07 15:29:28', '2026-07-23 14:57:12', 2383],
    [64340, '', 17569, 1, 5554, 5425, '广东懂机汇（苹果）', '广东懂机汇（苹果）', 'IPHONE', 'iPhone 16 Pro Max', '有效', '', '', '', 8.1, '', '', '有效', '2026-02-07 15:27:54', '2026-05-18 16:50:19', 5801],
    [64060, '', 18226, 1, 5554, 5425, '广东懂机汇（苹果）', '广东懂机汇（苹果）', 'IPHONE', 'iPhone Air', '有效', '', '', '', 10.1, '', '', '有效', '2026-02-07 15:27:40', '2026-06-15 14:49:19', 4539],
    [64059, '', 18225, 1, 5554, 5425, '广东懂机汇（苹果）', '广东懂机汇（苹果）', 'IPHONE', 'iPhone 17', '有效', '', '', '', 13.1, '', '', '有效', '2026-02-07 15:27:40', '2026-07-23 14:57:12', 4729]
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sampleRows), 'Sheet1')

  // 2. Sheet2 空白标准导入 8 列表头
  const sheet2Header = ['baseId（型号ID）', 'romId（内存ID）', 'machineId（机器ID）', 'walletId（商家钱包账户ID）', '价格上浮值（固定比例）', '价格上浮封顶（封顶值）', '商家分类id', '计算公式']
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([sheet2Header]), 'Sheet2')

  // 3. Sheet3 标准阶梯规则
  const sheet3Data = [
    ['min', 'max', 'ratio', 'upperLimit'],
    [0, 0.3, '*3（<1500元），*2（≥1500元）', 'null'],
    [0.3, 0.5, '*2（<1500元），*1.5（≥1500元）', 'null'],
    [0.5, 0.7, '*1.5（<1500元），*1（≥1500元）', 'null'],
    [0.7, 1.0, '*1（<1500元），*1（≥1500元）', 'null']
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheet3Data), 'Sheet3')

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, '机型分销上浮标准模板.xlsx')
  ElMessage.success('《机型分销上浮标准模板.xlsx》已开始下载！')
}

// 载入演示数据
const loadSample = () => {
  const sampleModels = [
    { baseId: 18472, model: 'iPhone 17e', brand: 'IPHONE', priceUp: 12.1, maxPrice: 3573 },
    { baseId: 18228, model: 'iPhone 17 Pro Max', brand: 'IPHONE', priceUp: 8.1, maxPrice: 9370 },
    { baseId: 18227, model: 'iPhone 17 Pro', brand: 'IPHONE', priceUp: 8.1, maxPrice: 7052 },
    { baseId: 18226, model: 'iPhone Air', brand: 'IPHONE', priceUp: 10.1, maxPrice: 4539 },
    { baseId: 18225, model: 'iPhone 17', brand: 'IPHONE', priceUp: 13.1, maxPrice: 4729 },
    { baseId: 17817, model: 'iPhone 16e', brand: 'IPHONE', priceUp: 14.1, maxPrice: 2711 },
    { baseId: 17569, model: 'iPhone 16 Pro Max', brand: 'IPHONE', priceUp: 8.1, maxPrice: 5801 },
    { baseId: 17568, model: 'iPhone 16 Pro', brand: 'IPHONE', priceUp: 8.1, maxPrice: 5160 },
    { baseId: 17567, model: 'iPhone 16 Plus', brand: 'IPHONE', priceUp: 10.1, maxPrice: 3619 },
    { baseId: 17566, model: 'iPhone 16', brand: 'IPHONE', priceUp: 9.1, maxPrice: 3543 },
    { baseId: 12282, model: 'iPhone 15 Pro Max', brand: 'IPHONE', priceUp: 12.1, maxPrice: 4121 },
    { baseId: 12281, model: 'iPhone 15 Pro', brand: 'IPHONE', priceUp: 12.1, maxPrice: 3749 },
    { baseId: 12280, model: 'iPhone 15 Plus', brand: 'IPHONE', priceUp: 14.1, maxPrice: 2585 },
    { baseId: 12279, model: 'iPhone 15', brand: 'IPHONE', priceUp: 14.1, maxPrice: 2471 },
    { baseId: 9660, model: 'iPhone 14 Plus', brand: 'IPHONE', priceUp: 20.1, maxPrice: 1697 },
    { baseId: 9659, model: 'iPhone 14 Pro Max', brand: 'IPHONE', priceUp: 15.1, maxPrice: 3220 },
    { baseId: 9658, model: 'iPhone 14 Pro', brand: 'IPHONE', priceUp: 15.1, maxPrice: 2903 },
    { baseId: 9657, model: 'iPhone 14', brand: 'IPHONE', priceUp: 20.1, maxPrice: 1615 },
    { baseId: 9234, model: 'iPhone 13 Pro Max', brand: 'IPHONE', priceUp: 19.1, maxPrice: 2383 },
    { baseId: 9233, model: 'iPhone 13 Pro', brand: 'IPHONE', priceUp: 19.1, maxPrice: 2187 },
    { baseId: 9232, model: 'iPhone 13', brand: 'IPHONE', priceUp: 25.1, maxPrice: 1143 },
    { baseId: 9231, model: 'iPhone 13 mini', brand: 'IPHONE', priceUp: 26.1, maxPrice: 1138 },
    { baseId: 8986, model: 'iPhone 12 Pro Max', brand: 'IPHONE', priceUp: 22.1, maxPrice: 1597 },
    { baseId: 8983, model: 'iPhone 12', brand: 'IPHONE', priceUp: 26.1, maxPrice: 814 },
    { baseId: 8733, model: 'iPhone 11 Pro Max', brand: 'IPHONE', priceUp: 27.1, maxPrice: 1027 },
    { baseId: 8731, model: 'iPhone 11', brand: 'IPHONE', priceUp: 30.1, maxPrice: 755 },
    { baseId: 8555, model: 'iPhone XS Max', brand: 'IPHONE', priceUp: 30.1, maxPrice: 874 },
    { baseId: 8554, model: 'iPhone XR', brand: 'IPHONE', priceUp: 30.1, maxPrice: 546 },
    { baseId: 7701, model: 'iPhone X', brand: 'IPHONE', priceUp: 30.1, maxPrice: 421 }
  ]

  const agents = [
    { walletId: 5554, agentName: '广东懂机汇（苹果）' },
    { walletId: 5541, agentName: '浙江昇泰（苹果）' },
    { walletId: 2924, agentName: '湖南睿金（苹果）' },
    { walletId: 2346, agentName: '广东茜悦（苹果）' },
    { walletId: 1034, agentName: '山西小机（苹果）' },
    { walletId: 1033, agentName: '重庆万物（苹果）' },
    { walletId: 1032, agentName: '湖南吞机兽（苹果）' },
    { walletId: 1000, agentName: '四川鲸落（苹果）' }
  ]

  const s1: Sheet1Row[] = []
  const ms: ModelSummary[] = sampleModels.map(m => {
    const { seriesType, generation } = classifyAppleModel(m.model)
    return {
      baseId: m.baseId,
      brand: m.brand,
      model: m.model,
      originalPriceUp: m.priceUp,
      currentPriceUp: m.priceUp,
      maxPriceRef: m.maxPrice,
      agentCount: agents.length,
      isModified: false,
      seriesType,
      generation
    }
  })

  for (const m of sampleModels) {
    for (const ag of agents) {
      s1.push({
        baseId: m.baseId,
        walletId: ag.walletId,
        agentName: ag.agentName,
        companyName: ag.agentName,
        brand: m.brand,
        model: m.model,
        priceUp: m.priceUp,
        maxPrice: m.maxPrice
      })
    }
  }

  sheet1Data.value = s1
  modelList.value = ms
  activeRules.value = [...DEFAULT_RULES]
  fileName.value = '机型分销上浮模板_演示数据.xlsx'
  sheet2Results.value = []
  resultViewMode.value = 'all'
  ElMessage.info('已成功载入苹果 iPhone 经典分销机型演示数据！')
}

const getSeriesBadgeClass = (seriesType: string) => {
  switch (seriesType) {
    case 'Pro Max': return 'badge-gold'
    case 'Pro': return 'badge-purple'
    case 'Plus': return 'badge-blue'
    case 'mini':
    case 'e': return 'badge-green'
    case 'Base': return 'badge-gray'
    default: return 'badge-default'
  }
}

const onModelPriceChange = (model: ModelSummary) => {
  model.isModified = Math.abs(model.currentPriceUp - model.originalPriceUp) > 0.001
}

const resetSingleModel = (model: ModelSummary) => {
  model.currentPriceUp = model.originalPriceUp
  model.isModified = false
  ElMessage.info(`【${model.model}】已还原为 ${model.originalPriceUp}%`)
}

const handleSelectionChange = (selection: ModelSummary[]) => {
  selectedModels.value = selection
}

const applyBatchDelta = () => {
  if (selectedModels.value.length === 0) return
  const delta = batchAdjustDelta.value
  selectedModels.value.forEach(m => {
    m.currentPriceUp = Math.max(0, Math.round((m.currentPriceUp + delta) * 10) / 10)
    m.isModified = Math.abs(m.currentPriceUp - m.originalPriceUp) > 0.001
  })
  ElMessage.success(`已为勾选的 ${selectedModels.value.length} 款机型统一调整 ${delta > 0 ? '+' + delta : delta}%`)
}

const resetSelectedModels = () => {
  selectedModels.value.forEach(m => {
    m.currentPriceUp = m.originalPriceUp
    m.isModified = false
  })
  ElMessage.info(`已将勾选的 ${selectedModels.value.length} 款机型还原为初始值`)
}

const handleBatchAdjustToFiltered = (delta: number) => {
  filteredModels.value.forEach(m => {
    m.currentPriceUp = Math.max(0, Math.round((m.currentPriceUp + delta) * 10) / 10)
    m.isModified = Math.abs(m.currentPriceUp - m.originalPriceUp) > 0.001
  })
  ElMessage.success(`已为当前筛选的 ${filteredModels.value.length} 款机型统一调整 ${delta > 0 ? '+' + delta : delta}%`)
}

const handleResetAllModels = () => {
  modelList.value.forEach(m => {
    m.currentPriceUp = m.originalPriceUp
    m.isModified = false
  })
  ElMessage.success('全部机型已恢复为初始上浮值！')
}

const handleAnalyzeCommand = () => {
  if (!commandInputText.value.trim()) {
    ElMessage.warning('请先粘贴或输入指令内容！')
    return
  }
  const parsed = parseInstructions(commandInputText.value, modelList.value)
  parsedInstructions.value = parsed
  if (parsed.length === 0) {
    ElMessage.warning('未能识别到匹配的机型或调价指令，请检查输入格式')
  } else {
    ElMessage.success(`成功识别 ${parsed.length} 条调价策略！`)
  }
}

const getPreviewPrice = (m: ModelSummary, instruction: ParsedInstruction) => {
  let res = m.currentPriceUp
  if (instruction.actionType === 'set') {
    res = instruction.value
  } else if (instruction.actionType === 'add') {
    res = m.currentPriceUp + instruction.value
  } else if (instruction.actionType === 'sub') {
    res = Math.max(0, m.currentPriceUp - instruction.value)
  }
  return Math.round(res * 10) / 10
}

const handleApplyInstructions = () => {
  let count = 0
  parsedInstructions.value.forEach(inst => {
    inst.matchedModels.forEach(target => {
      const m = modelList.value.find(item => item.baseId === target.baseId)
      if (m) {
        m.currentPriceUp = getPreviewPrice(m, inst)
        m.isModified = Math.abs(m.currentPriceUp - m.originalPriceUp) > 0.001
        count++
      }
    })
  })

  showCommandDialog.value = false
  ElMessage.success(`指令应用成功！已更新 ${count} 款机型的上浮值。`)
}

const loadLeadershipCase = (num: number) => {
  switch (num) {
    case 1:
      commandInputText.value = `分销上浮调整：\niPhone 12 mini，上调2%\niPhone 15 Pro Max，iPhone 16系列，iPhone 17系列，上调1%\n@靓仔`
      break
    case 2:
      commandInputText.value = `分销上浮调整：\niPhone 14，上调1%\niPhone 14 Plus，上调1%\niPhone 14 Pro，上调2%\niPhone 14 Pro Max，上调2%\niPhone 15 Pro Max，上调2%\niPhone X，上调3%\niPhone XR，上调3%`
      break
    case 3:
      commandInputText.value = `分销上浮调整：\niPhone 11，上调3%\niPhone 11 Pro，上调5%\niPhone 11 Pro Max，上调2%\niPhone 12 mini，上调3%\niPhone 12 Pro，上调2%\niPhone 13 mini，上调2%\niPhone 13，上调2%\niPhone 13 Pro Max，上调1%\niPhone 14 Pro Max，上调1%`
      break
    case 4:
      commandInputText.value = `分销上浮调整：\niPhone 17系列，iPhone 16系列（不包含iPhone 16e），iPhone 15 Pro Max，下调1%`
      break
    case 5:
      commandInputText.value = `分销上浮调整：\n1，iPhone XS，iPhone XS Max，上调3%\n2，iPhone 12，上调2%\n3，iPhone 13，上调2%\n4，iPhone 14 Pro Max，上调1%\n5，iPhone 15 Pro，上调1%\n6，iPhone 16e，上调1%\n7，iPhone Air，下调1%`
      break
    case 6:
      commandInputText.value = `分销上浮调整：\niPhone 11-16基础款（除Pro，Pro Max以外的）上调1%`
      break
  }
  handleAnalyzeCommand()
}

// 执行运算生成 Sheet2
const handleRunCalculation = () => {
  if (sheet1Data.value.length === 0) {
    ElMessage.warning('请先上传模板或载入演示数据！')
    return
  }

  isProcessing.value = true
  try {
    const priceMap = new Map<number, number>()
    modelList.value.forEach(m => {
      priceMap.set(m.baseId, m.currentPriceUp)
    })

    const results = generateSheet2Data(sheet1Data.value, priceMap, activeRules.value)
    sheet2Results.value = results
    currentPage.value = 1
    ElMessage.success(`计算完毕！共生成 ${results.length} 行 Sheet2 导入结果。`)
  } catch (err: any) {
    ElMessage.error(`计算失败：${err.message}`)
  } finally {
    isProcessing.value = false
  }
}

// 🌟 导出全量结果 (全量机型与全量商家)
const handleExportAll = () => {
  if (sheet2Results.value.length === 0) {
    ElMessage.warning('暂无结果可导出，请先点击运算！')
    return
  }
  const priceMap = new Map<number, number>()
  modelList.value.forEach(m => {
    priceMap.set(m.baseId, m.currentPriceUp)
  })
  exportResultWorkbook(sheet1Data.value, sheet2Results.value, activeRules.value, priceMap, false)
}

// 🌟 新增需求 2：仅导出已调价机型 (包括每个商家钱包的完整8列数据)
const handleExportModifiedOnly = () => {
  if (sheet2Results.value.length === 0) {
    ElMessage.warning('暂无结果可导出，请先点击运算！')
    return
  }
  if (modifiedModelCount.value === 0) {
    ElMessage.warning('当前尚未修改任何机型的上浮值，无需导出增量表！')
    return
  }

  const priceMap = new Map<number, number>()
  modelList.value.forEach(m => {
    priceMap.set(m.baseId, m.currentPriceUp)
  })

  // 筛选出仅变更机型的 Sheet2 记录与 Sheet1 记录
  const targetSheet2Rows = sheet2Results.value.filter(r => modifiedBaseIdSet.value.has(r.baseId))
  const targetSheet1Rows = sheet1Data.value.filter(r => modifiedBaseIdSet.value.has(r.baseId))

  exportResultWorkbook(targetSheet1Rows, targetSheet2Rows, activeRules.value, priceMap, true)
}

function exportResultWorkbook(
  sheet1Rows: Sheet1Row[],
  sheet2Rows: Sheet2Row[],
  rules: RuleItem[],
  modelPriceMap: Map<number, number>,
  isModifiedOnly: boolean
) {
  const wb = XLSX.utils.book_new()

  // Sheet1
  const sheet1Header = ['id', '机器分组', 'baseId', 'brandId', '联营钱包ID', '代理商ID', '代理商名称', '公司名称', '手机品牌', '手机型号', '手机型号是否有效', '型号内存', '机器名称', '机器分组id', '价格上浮值', '价格上浮封顶', '计算公式', '配置是否有效', '创建时间', '更新时间', '最高价格']
  const sheet1Data: any[][] = [sheet1Header]
  for (const row of sheet1Rows) {
    const activePriceUp = modelPriceMap.has(row.baseId) ? modelPriceMap.get(row.baseId)! : row.priceUp
    sheet1Data.push([
      row.id || '', '', row.baseId, row.brandId || 1, row.walletId,
      row.agentId || '', row.agentName || '', row.companyName || '',
      row.brand || 'IPHONE', row.model, '有效', '', '', '',
      activePriceUp, '', '', '有效', '', '', row.maxPrice
    ])
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheet1Data), 'Sheet1')

  // Sheet2 (标准 8 列导入格式：baseId, romId, machineId, walletId, 价格上浮值, 价格上浮封顶, 商家分类id, 计算公式)
  const sheet2Header = ['baseId（型号ID）', 'romId（内存ID）', 'machineId（机器ID）', 'walletId（商家钱包账户ID）', '价格上浮值（固定比例）', '价格上浮封顶（封顶值）', '商家分类id', '计算公式']
  const sheet2Data: any[][] = [sheet2Header]
  for (const r of sheet2Rows) {
    sheet2Data.push([r.baseId, '', '', r.walletId, r.priceUp, '', '', r.formulaJson])
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheet2Data), 'Sheet2')

  // Sheet3
  const sheet3Data: any[][] = [['min', 'max', 'ratio', 'upperLimit']]
  for (const rule of rules) {
    sheet3Data.push([rule.min, rule.max, rule.desc, rule.upperLimit === null ? 'null' : rule.upperLimit])
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sheet3Data), 'Sheet3')

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const now = new Date()
  const timeStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
  const downloadFileName = isModifiedOnly
    ? `机型分销上浮-仅已调价机型(含各商家)${timeStr}.xlsx`
    : `机型分销上浮-全量结果${timeStr}.xlsx`

  saveAs(blob, downloadFileName)
  ElMessage.success(`《${downloadFileName}》导出成功，已包含 ${sheet2Rows.length} 条商家导入记录！`)
}

const inspectFormula = (row: Sheet2Row) => {
  currentInspectRow.value = row
  showFormulaDialog.value = true
}

const getFormulaSummary = (jsonStr: string) => {
  try {
    const arr = JSON.parse(jsonStr)
    return `4档阶梯: [${arr.map((item: any) => item.ratio + '%').join(', ')}]`
  } catch {
    return '已生成公式'
  }
}

const resetDefaultRules = () => {
  activeRules.value = JSON.parse(JSON.stringify(DEFAULT_RULES))
  ElMessage.info('规则已重置')
}

const handleReset = () => {
  ElMessageBox.confirm('确定要清空当前所有数据与调整记录吗？', '确认重置', {
    confirmButtonText: '确定清空',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    sheet1Data.value = []
    modelList.value = []
    sheet2Results.value = []
    fileName.value = ''
    resultViewMode.value = 'all'
    ElMessage.success('数据已重置')
  })
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
/* =========================================================================
   全真 Apple Pro Glassmorphism 样式系统
   ========================================================================= */
.apple-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f7f9fc;
  background-image:
    radial-gradient(at 0% 0%, rgba(0, 113, 227, 0.05) 0px, transparent 45%),
    radial-gradient(at 100% 100%, rgba(52, 199, 89, 0.04) 0px, transparent 45%);
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", sans-serif;
}

/* 1. 左侧边栏 */
.apple-sidebar {
  width: 210px;
  background: #ffffff;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 16px;
  flex-shrink: 0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.02);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 6px;
  margin-bottom: 28px;
}

.logo-title {
  display: flex;
  flex-direction: column;
}

.logo-title .main-name {
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1.2;
}

.logo-title .version-sub {
  font-size: 11px;
  color: #0071e3;
  font-weight: 600;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #48484a;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #1d1d1f;
}

.menu-item.active {
  background: #e8f2fd;
  color: #0071e3;
  font-weight: 600;
}

.sidebar-footer-card {
  background: linear-gradient(135deg, rgba(235, 245, 255, 0.8), rgba(245, 250, 255, 0.9));
  border: 1px solid rgba(0, 113, 227, 0.12);
  border-radius: 16px;
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.device-art {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.mini-phone {
  width: 28px;
  height: 46px;
  border-radius: 6px;
  border: 2px solid #8e8e93;
  background: #ffffff;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.mini-phone .notch {
  width: 10px;
  height: 2px;
  background: #8e8e93;
  border-radius: 2px;
  margin: 2px auto 0;
}

.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 32px;
}

.mini-chart .bar {
  width: 5px;
  border-radius: 2px 2px 0 0;
  background: #0071e3;
}
.mini-chart .b1 { height: 14px; opacity: 0.5; }
.mini-chart .b2 { height: 22px; opacity: 0.8; }
.mini-chart .b3 { height: 30px; opacity: 1; }

.art-slogan {
  font-size: 12px;
  font-weight: 600;
  color: #0071e3;
}

/* 2. 主体区 */
.apple-main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.top-nav-bar {
  height: 68px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-titles .platform-title {
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1.2;
}

.header-titles .platform-sub {
  font-size: 11px;
  color: #86868b;
  letter-spacing: 0.2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.top-pill-btn {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 7px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  color: #1d1d1f;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.top-pill-btn:hover {
  border-color: #0071e3;
  color: #0071e3;
}

.top-pill-btn.highlight-dl {
  background: #f0f7ff;
  border-color: rgba(0, 113, 227, 0.25);
  color: #0071e3;
  font-weight: 600;
}

.top-pill-btn.danger {
  color: #ff3b30;
  border-color: rgba(255, 59, 48, 0.2);
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.03);
  padding: 4px 10px 4px 5px;
  border-radius: 9999px;
  cursor: pointer;
}

.avatar-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #0071e3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1d1d1f;
}

.content-scroll-area {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 1380px;
  width: 100%;
  margin: 0 auto;
}

/* 4大 KPI 统计卡片 */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi-card {
  padding: 18px 22px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.bg-kpi-blue { background: #f2f7fe; }
.bg-kpi-purple { background: #f6f4fe; }
.bg-kpi-orange { background: #fef7ee; }
.bg-kpi-green { background: #f2faf4; }

.kpi-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.kpi-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box-blue { background: #e0edfe; color: #0071e3; }
.box-purple { background: #ece7fd; color: #5856d6; }
.box-orange { background: #fdecd8; color: #ff9500; }
.box-green { background: #def3e4; color: #34c759; }

.kpi-texts {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.kpi-label {
  font-size: 12px;
  font-weight: 500;
  color: #86868b;
}

.kpi-number {
  font-size: 26px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.5px;
}

.kpi-number small {
  font-size: 13px;
  font-weight: 400;
  color: #86868b;
  margin-left: 3px;
}

.kpi-number.highlight-orange {
  color: #ff9500;
}

.kpi-watermark-chart {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  opacity: 0.15;
}
.kpi-watermark-chart span { width: 6px; background: #0071e3; border-radius: 2px; }
.kpi-watermark-chart span:nth-child(1) { height: 16px; }
.kpi-watermark-chart span:nth-child(2) { height: 28px; }
.kpi-watermark-chart span:nth-child(3) { height: 40px; }

.kpi-watermark-phone {
  width: 22px;
  height: 38px;
  border: 3px solid #5856d6;
  border-radius: 6px;
  opacity: 0.15;
}

.kpi-watermark-pen {
  font-size: 34px;
  color: #ff9500;
  opacity: 0.18;
}

.kpi-watermark-bag {
  width: 32px;
  height: 30px;
  border: 3px solid #34c759;
  border-radius: 8px;
  opacity: 0.15;
}

/* 4. 通用大卡片 */
.apple-box-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px 28px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.focus-card {
  border: 1px solid rgba(0, 113, 227, 0.18);
  box-shadow: 0 8px 30px rgba(0, 113, 227, 0.04);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.num-badge {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #0071e3;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1d1d1f;
}

.tag-counter {
  background: rgba(0, 0, 0, 0.04);
  color: #86868b;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 9999px;
  font-weight: 500;
}

.tag-counter.success {
  background: rgba(52, 199, 89, 0.1);
  color: #28a745;
}

.status-pill-green {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(52, 199, 89, 0.08);
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 13px;
  color: #28a745;
}

.dot-green {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34c759;
}

/* 杀手级调价按钮 */
.magic-command-button {
  background: linear-gradient(135deg, #0071e3 0%, #0096ff 100%);
  border: none;
  color: #ffffff;
  padding: 10px 22px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 113, 227, 0.3);
  transition: all 0.2s ease;
}

.magic-command-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 113, 227, 0.4);
}

.spark-star {
  font-size: 16px;
}

/* 上传框 */
.upload-area-wrap :deep(.el-upload-dragger) {
  border-radius: 16px;
  border: 2px dashed rgba(0, 113, 227, 0.25);
  background: #fbfdff;
  padding: 28px 20px;
  transition: all 0.2s ease;
}

.upload-area-wrap :deep(.el-upload-dragger:hover) {
  border-color: #0071e3;
  background: rgba(0, 113, 227, 0.02);
}

.drop-zone-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cloud-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #0071e3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.25);
}

.drop-text-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.primary-lead {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
}

.sub-lead {
  font-size: 12px;
  color: #86868b;
}

/* 矩阵筛选栏 */
.matrix-filter-card {
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-title {
  font-size: 13px;
  font-weight: 600;
  color: #636366;
  width: 70px;
  flex-shrink: 0;
}

.chips-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.matrix-btn {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 12px;
  color: #3a3a3c;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.matrix-btn:hover {
  color: #0071e3;
  border-color: #0071e3;
}

.matrix-btn.active {
  background: #0071e3;
  border-color: #0071e3;
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 113, 227, 0.28);
}

.type-btn.active {
  background: #1d1d1f;
  border-color: #1d1d1f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* 表格工具条 */
.table-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 14px;
}

.bar-left {
  display: flex;
  align-items: center;
}

.batch-btns-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.batch-pill-btn {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: #48484a;
  cursor: pointer;
  transition: all 0.15s ease;
}

.batch-pill-btn:hover {
  border-color: #0071e3;
  color: #0071e3;
}

.batch-pill-btn.reset {
  color: #ff9500;
  border-color: rgba(255, 149, 0, 0.3);
}

.selection-pill-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 113, 227, 0.06);
  padding: 5px 12px;
  border-radius: 12px;
  border: 1px solid rgba(0, 113, 227, 0.15);
}

.sel-count {
  font-size: 12px;
  color: #0071e3;
}

/* 机型表格 */
.table-container-wrap {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.model-series-badge {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.badge-gold { background: #fef8e7; color: #b28000; border: 1px solid rgba(178, 128, 0, 0.2); }
.badge-purple { background: #f5f0ff; color: #5856d6; border: 1px solid rgba(88, 86, 214, 0.15); }
.badge-blue { background: #eef6ff; color: #0071e3; }
.badge-green { background: #eefaf2; color: #28a745; }
.badge-gray { background: #f2f2f7; color: #636366; }
.badge-default { background: #f2f2f7; color: #8e8e93; }

.model-meta-cell {
  display: flex;
  flex-direction: column;
}

.bold-model-name {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
}

.base-id-tag {
  font-size: 11px;
  color: #8e8e93;
  font-family: ui-monospace, monospace;
}

.dim-percentage {
  font-size: 13px;
  color: #8e8e93;
  font-weight: 500;
}

.stepper-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.pct {
  font-size: 12px;
  color: #8e8e93;
}

.diff-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
}

.diff-badge.plus {
  background: rgba(52, 199, 89, 0.12);
  color: #28a745;
}

.diff-badge.minus {
  background: rgba(255, 59, 48, 0.12);
  color: #ff3b30;
}

.text-unmodified {
  font-size: 12px;
  color: #c7c7cc;
}

.bold-price {
  font-size: 14px;
  font-weight: 700;
  color: #1d1d1f;
}

.action-dots {
  font-size: 16px;
  color: #c7c7cc;
  cursor: pointer;
}

/* 底栏操作 */
.card-bottom-actions {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
}

.tip-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #86868b;
}

.blue-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #0071e3;
}

.primary-run-btn {
  background: #0071e3;
  border: none;
  color: #ffffff;
  padding: 12px 30px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 113, 227, 0.3);
  transition: all 0.2s ease;
}

.primary-run-btn:hover {
  background: #0077ed;
  box-shadow: 0 6px 18px rgba(0, 113, 227, 0.4);
}

/* 导出区域新样式 */
.result-view-tabs {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.04);
  padding: 3px;
  border-radius: 9999px;
  gap: 4px;
}

.res-tab {
  background: transparent;
  border: none;
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: #636366;
  cursor: pointer;
  transition: all 0.15s ease;
}

.res-tab.active {
  background: #ffffff;
  color: #1d1d1f;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.res-tab.highlight.active {
  background: #ffffff;
  color: #0071e3;
}

.export-button-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.export-excel-btn {
  border: none;
  color: #ffffff;
  padding: 9px 18px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-excel-btn.primary {
  background: #34c759;
  box-shadow: 0 4px 14px rgba(52, 199, 89, 0.3);
}

.export-excel-btn.primary:hover {
  background: #28a745;
}

.export-excel-btn.secondary {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #1d1d1f;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.export-excel-btn.secondary:hover {
  border-color: #0071e3;
  color: #0071e3;
}

.modified-summary-bar {
  background: rgba(0, 113, 227, 0.05);
  border: 1px solid rgba(0, 113, 227, 0.15);
  border-radius: 12px;
  padding: 10px 16px;
  margin-bottom: 14px;
  font-size: 13px;
  color: #0071e3;
  display: flex;
  align-items: center;
  gap: 8px;
}

.code-wallet {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.03);
  padding: 2px 6px;
  border-radius: 4px;
}

.result-active-pct {
  font-weight: 700;
  color: #0071e3;
}

.json-peek-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.peek-code-btn {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.code-summary-tag {
  font-size: 12px;
  color: #86868b;
  font-family: ui-monospace, monospace;
}

.table-page-nav {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}

/* 智能领导指令弹窗样式 */
.command-modal-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.modal-intro {
  font-size: 13px;
  color: #48484a;
  line-height: 1.5;
}

.preset-scenarios {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scenarios-title {
  font-size: 12px;
  font-weight: 600;
  color: #86868b;
}

.scenario-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.scenario-chip {
  background: rgba(0, 113, 227, 0.06);
  border: 1px solid rgba(0, 113, 227, 0.15);
  color: #0071e3;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.scenario-chip:hover {
  background: #0071e3;
  color: #ffffff;
}

.raw-input-textarea :deep(.el-textarea__inner) {
  border-radius: 12px !important;
  background: #fafafa !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  line-height: 1.6;
}

.modal-control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.parsed-preview-panel {
  background: #f8fafc;
  border: 1px solid rgba(0, 113, 227, 0.15);
  border-radius: 14px;
  padding: 16px;
  max-height: 260px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preview-lead-bar {
  font-size: 13px;
  color: #1d1d1f;
}

.preview-scroll-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.instruction-card {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.inst-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.inst-text {
  font-size: 13px;
  font-weight: 600;
  color: #1d1d1f;
}

.inst-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
}
.inst-tag.add { background: rgba(52, 199, 89, 0.12); color: #28a745; }
.inst-tag.sub { background: rgba(255, 59, 48, 0.12); color: #ff3b30; }
.inst-tag.set { background: rgba(0, 113, 227, 0.12); color: #0071e3; }

.inst-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.inst-hit-pill {
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 11px;
  color: #48484a;
}
.inst-hit-pill small {
  color: #0071e3;
  font-weight: 600;
}

.modal-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 抽屉 & 详情弹窗 */
.drawer-inner-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drawer-tips {
  font-size: 13px;
  color: #86868b;
  line-height: 1.5;
}

.rule-box-card {
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 14px;
  border-radius: 12px;
}

.rule-box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.rule-tag {
  font-size: 11px;
  font-weight: 700;
  color: #0071e3;
  background: rgba(0, 113, 227, 0.08);
  padding: 2px 8px;
  border-radius: 9999px;
}

.drawer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.inspect-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.inspect-details {
  background: #f2f2f7;
  padding: 14px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.8;
}

.json-code-box {
  background: #1e1e1e;
  color: #79c0ff;
  padding: 16px;
  border-radius: 10px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  max-height: 380px;
  overflow-y: auto;
}

@media (max-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .apple-sidebar {
    display: none;
  }
}

@media (max-width: 650px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  .top-nav-bar {
    padding: 0 16px;
  }
  .content-scroll-area {
    padding: 16px;
  }
}
</style>
