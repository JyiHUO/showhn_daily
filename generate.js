const fs = require('fs');
const path = require('path');

async function run() {
  // 动态导入 got 库
  const { default: got } = await import('got');
  const date = new Date();
  date.setDate(date.getDate() - 2); // 获取两天前的日期
  const formattedDate = date.toISOString().slice(0, 10);
  
  // 创建日期目录
  const dateDir = path.join('releases', formattedDate);
  if (!fs.existsSync('releases')) {
    fs.mkdirSync('releases');
  }
  if (!fs.existsSync(dateDir)) {
    fs.mkdirSync(dateDir);
  }
  const apiURL = `https://showhntoday.com/api/showHN/select/articleDetailVo?articleUrl=show-hn-daily-roundup-${formattedDate}-zh-cn`;

  console.log(`正在获取两天前的数据，日期：${formattedDate}`);

  try {
    const response = await got(apiURL);
    const data = JSON.parse(response.body);


    if (data.code === 200) {
      const articleData = data.data;
      const showHNData = articleData.showHNArticleDataBo;
      
      // 文章标题和日期
      let markdown = `# ${articleData.articleTitle}\n\n`;
      markdown += `**发布日期：** ${articleData.publishDate}\n\n`;
      
      // 今日简报部分
      if (showHNData && showHNData.todaySummary) {
        markdown += `## 今日简报\n\n`;
        
        const summary = showHNData.todaySummary;
        
        // 今日最热产品
        if (summary.todayHottestProduct) {
          markdown += `### 今日最热产品\n\n`;
          markdown += `**名称：** ${summary.todayHottestProduct.productName}\n\n`;
          markdown += `**亮点：** ${summary.todayHottestProduct.highlight}\n\n`;
        }
        
        // 热门统计
        if (summary.popularStats) {
          markdown += `### 热门统计\n\n`;
          if (summary.popularStats.popularCategory) {
            markdown += `**热门分类：** ${summary.popularStats.popularCategory.join('、')}\n\n`;
          }
          if (summary.popularStats.popularKeyword) {
            markdown += `**热门关键字：** ${summary.popularStats.popularKeyword.join('、')}\n\n`;
          }
        }
        
        // 技术趋势
        if (summary.technologyTrends) {
          markdown += `### 技术趋势\n\n`;
          summary.technologyTrends.forEach((trend, index) => {
            markdown += `${index + 1}. ${trend}\n`;
          });
          markdown += `\n`;
        }
        
        // 趋势洞察
        if (summary.trendInsights) {
          markdown += `### 趋势洞察\n\n`;
          markdown += `${summary.trendInsights}\n\n`;
        }
      }
      
      // 今日热门产品排行榜
      if (showHNData && showHNData.rankings && Array.isArray(showHNData.rankings)) {
        markdown += `## 今日热门产品排行榜\n\n`;
        markdown += `| 排名 | 产品名称 | 点赞数 | 评论数 |\n`;
        markdown += `|------|----------|--------|--------|\n`;
        
        showHNData.rankings.slice(0, 15).forEach((item) => {
          markdown += `| ${item.idx} | ${item.productName} | ${item.likes} | ${item.comments} |\n`;
        });
        markdown += `\n`;
      }
      
      // 产品详细介绍
      if (showHNData && showHNData.productList && Array.isArray(showHNData.productList)) {
        markdown += `## 产品详细介绍\n\n`;
        
        showHNData.productList.forEach((item, index) => {
          markdown += `### ${item.idx}.${item.productName}\n\n`;
          
          // 产品图片（如果有）
          if (item.imageUrl) {
            markdown += `![${item.productName}](${item.imageUrl})\n\n`;
          }
          
          // 基本信息
          if (item.productUrl) {
            markdown += `**URL：** [${item.productUrl}](${item.productUrl})\n\n`;
          }
          
          if (item.author) {
            markdown += `**作者：** ${item.author}\n\n`;
          }
          
          // 产品描述
          if (item.description) {
            markdown += `**描述：**\n${item.description}\n\n`;
          }
          
          // 如何使用
          if (item.productFAQ && item.productFAQ.howUse) {
            markdown += `**如何使用：**\n${item.productFAQ.howUse}\n\n`;
          }
          
          // 核心功能
        //   if (item.productFAQ && item.productFAQ.coreFunctionList && Array.isArray(item.productFAQ.coreFunctionList)) {
        //     markdown += `**核心功能：**\n`;
        //     item.productFAQ.coreFunctionList.forEach((func, index) => {
        //       markdown += `${index + 1}. ${func}\n`;
        //     });
        //     markdown += `\n`;
        //   }
          
          // 使用案例
        //   if (item.productFAQ && item.productFAQ.showCases && Array.isArray(item.productFAQ.showCases)) {
        //     markdown += `**使用案例：**\n`;
        //     item.productFAQ.showCases.forEach((useCase, index) => {
        //       markdown += `${index + 1}. ${useCase}\n`;
        //     });
        //     markdown += `\n`;
        //   }
          
          // 点赞和评论数
          markdown += `❤️ ${item.likes}   💬 ${item.comments}\n\n`;
          
          markdown += `---\n\n`;
        });
      }

      const markdownFilePath = path.join(dateDir, `release-${formattedDate}.md`);
      fs.writeFileSync(markdownFilePath, markdown);
      
      // 同时保存一份到根目录作为最新版本
      fs.writeFileSync('release-body.md', markdown);
      
      console.log(`Markdown 文件已成功生成：${markdownFilePath}`);
    } else {
      console.log(`API 返回失败，代码：${data.code}，消息：${data.message}`);
    }
  } catch (error) {
    console.error('获取数据失败:', error.message);
  }
}

run();