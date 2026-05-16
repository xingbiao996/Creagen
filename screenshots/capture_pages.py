import asyncio
import os
from pyppeteer import launch

async def screenshot_page(page, url, path, full=True):
    await page.setViewport({'width': 1920, 'height': 1080})
    await page.goto(url, {'waitUntil': 'networkidle0', 'timeout': 30000})
    await asyncio.sleep(2)
    await page.screenshot({'path': path, 'fullPage': full})
    print(f"Saved: {path}")

async def main():
    output_dir = '/workspace/screenshots'
    os.makedirs(output_dir, exist_ok=True)
    
    browser = await launch({
        'headless': True,
        'args': ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    })
    
    pages = [
        ('http://localhost:5173', '01_home.png', '首页 (Home)'),
        ('http://localhost:5173/history', '02_history.png', '历史页 (History)'),
        ('http://localhost:5173/settings', '03_settings.png', '设置页 (Settings)'),
        ('http://localhost:5173/favorites', '04_favorites.png', '收藏页 (Favorites)'),
    ]
    
    for i, (url, filename, title) in enumerate(pages):
        print(f"\n[{i+1}/{len(pages)}] Capturing {title}...")
        page = await browser.newPage()
        try:
            await screenshot_page(page, url, os.path.join(output_dir, filename))
        except Exception as e:
            print(f"Error capturing {title}: {e}")
        await page.close()
    
    await browser.close()
    print(f"\nAll screenshots saved to {output_dir}")

if __name__ == '__main__':
    asyncio.run(main())
