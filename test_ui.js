const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle2' });
  
  // スクリーンショット: ページ全体
  await page.screenshot({ path: '/tmp/ui_full.png', fullPage: true });
  console.log('全体スクリーンショット: /tmp/ui_full.png');
  
  // フォームに入力して計算を実行
  await page.select('#car-class', 'sedan');
  await page.select('#use-years', '5');
  await page.type('#down-payment', '500000');
  await page.type('#mileage', '12000');
  
  // 計算ボタンをクリック
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('比較')) {
      await btn.click();
      break;
    }
  }
  
  // 結果表示まで待機
  await page.waitForSelector('#results', { visible: true, timeout: 3000 });
  
  // スクリーンショット: 結果表示
  const resultsElement = await page.$('#results');
  await resultsElement.screenshot({ path: '/tmp/ui_results.png' });
  console.log('結果スクリーンショット: /tmp/ui_results.png');
  
  // グラフ要素の確認
  const monthlyChart = await page.$('#monthly-chart-js');
  const totalChart = await page.$('#total-chart-js');
  console.log('月額グラフ存在:', !!monthlyChart);
  console.log('総額グラフ存在:', !!totalChart);
  
  await browser.close();
})().catch(console.error);
