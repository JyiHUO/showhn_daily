# Show HN 今日精选

每日自动汇总 Show HN 最热门的开发者项目，通过 GitHub Actions 自动生成 Release。

## 功能特性

- 📅 每日自动抓取两天前的 Show HN 数据
- 📝 生成结构化的 Markdown 格式报告
- 🚀 自动创建 GitHub Release
- 📁 按日期组织文件结构
- ⚡ GitHub Actions 自动化工作流

## 订阅方式

### Atom 订阅 (推荐)
使用RSS阅读器订阅GitHub自带的atom链接：
```
https://github.com/JyiHUO/showhn_daily/releases.atom
```

### GitHub Release
在 [Releases](https://github.com/JyiHUO/showhn_daily/releases) 页面查看每日精选

## 自动化设置

### 1. 克隆仓库
```bash
git clone https://github.com/hjy/showhn_daily.git
cd showhn_daily
```

### 2. 安装依赖
```bash
npm install
```

### 3. 手动测试
```bash
# 生成 Markdown
npm run generate

# 或直接运行构建
npm run build
```

### 4. GitHub Actions 设置
工作流会在每天早上8点（UTC）自动运行，你也可以在 Actions 页面手动触发。

## 项目结构

```
showhn_daily/
├── .github/
│   └── workflows/
│       └── daily-release.yml    # GitHub Actions 工作流
├── releases/                    # 按日期存储的发布内容
│   └── 2025-XX-XX/
│       └── release-2025-XX-XX.md
├── generate.js                  # Markdown 生成脚本  
├── package.json                # 项目配置
├── release-body.md             # 最新内容（用于Release）
└── README.md                   # 项目说明
```

## 内容格式

每日精选包含：
- 📊 今日简报（热门产品、统计、趋势洞察）
- 🏆 热门产品排行榜
- 📋 产品详细介绍（描述、使用方法、核心功能、案例）

## 定制化

如需修改时间、格式或添加功能，编辑相应的 JavaScript 文件即可。
