import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    // 실제 구현에서는 셀레니움을 사용하여 크롤링
    // 여기서는 시뮬레이션으로 구현
    const isLive = await checkStreamingStatus(url);

    return NextResponse.json({
      success: true,
      liveStatus: isLive ? 'online' : 'offline',
      message: isLive ? '라이브 상태입니다.' : '오프라인 상태입니다.',
    });
  } catch (error) {
    console.error('Crawling error:', error);
    return NextResponse.json(
      { success: false, error: '크롤링 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

// 스트리밍 상태 확인 함수 (실제로는 셀레니움 사용)
async function checkStreamingStatus(url: string): Promise<boolean> {
  try {
    // 실제 구현에서는 셀레니움을 사용하여 다음을 확인:
    // 1. live_information_video_dimmed__Hrmtd 태그가 있으면 오프라인
    // 2. live_information_video_container__E3LbD 태그가 있으면 라이브

    // 시뮬레이션: URL에 'live'가 포함되어 있으면 라이브로 간주
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      return false;
    }

    const html = await response.text();

    // 실제 셀레니움 크롤링 로직 (시뮬레이션)
    const hasLiveContainer = html.includes('live_information_video_container__E3LbD');
    const hasDimmedContainer = html.includes('live_information_video_dimmed__Hrmtd');

    // 라이브 컨테이너가 있고, 딤드 컨테이너가 없으면 라이브
    return hasLiveContainer && !hasDimmedContainer;
  } catch (error) {
    console.error('Error checking streaming status:', error);
    return false;
  }
}

// 실제 셀레니움 구현 예시 (참고용)
/*
import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

async function checkStreamingStatusWithSelenium(url: string): Promise<boolean> {
  let driver;
  
  try {
    // Chrome 드라이버 설정
    const options = new chrome.Options();
    options.addArguments('--headless'); // 헤드리스 모드
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    
    // 페이지 로드
    await driver.get(url);
    
    // 라이브 컨테이너 확인
    const liveContainer = await driver.findElements(By.className('live_information_video_container__E3LbD'));
    const dimmedContainer = await driver.findElements(By.className('live_information_video_dimmed__Hrmtd'));
    
    // 라이브 컨테이너가 있고, 딤드 컨테이너가 없으면 라이브
    return liveContainer.length > 0 && dimmedContainer.length === 0;
    
  } catch (error) {
    console.error('Selenium error:', error);
    return false;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}
*/
