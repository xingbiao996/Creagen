// ==UserScript==
// @name         Creagen Douyin Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fetch current douyin video URL, show floating UI, and send to Creagen webapp API.
// @author       Trae
// @match        *://*.douyin.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      localhost
// @connect      127.0.0.1
// ==/UserScript==

(function() {
    'use strict';

    // Inject styles for the floating UI
    GM_addStyle(`
        #creagen-floating-ui {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
            z-index: 9999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            overflow: hidden;
            border: 1px solid #e5e6eb;
            transition: all 0.3s ease;
        }
        #creagen-header {
            background: #66ccff;
            color: #fff;
            padding: 12px 16px;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #creagen-body {
            padding: 16px;
            background: #fafafa;
        }
        .creagen-info {
            font-size: 13px;
            color: #4e5969;
            margin-bottom: 12px;
            word-break: break-all;
            line-height: 1.5;
            background: #fff;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid #e5e6eb;
        }
        .creagen-btn {
            display: block;
            width: 100%;
            padding: 10px;
            background: #66ccff;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
            box-shadow: 0 2px 0 rgba(0,0,0,0.045);
        }
        .creagen-btn:hover {
            background: #55bbef;
        }
        .creagen-btn:disabled {
            background: #c9cdd4;
            cursor: not-allowed;
            color: #fff;
            box-shadow: none;
        }
        #creagen-status {
            margin-top: 12px;
            font-size: 13px;
            text-align: center;
            color: #86909c;
            min-height: 18px;
        }
        .creagen-success { color: #00b42a !important; }
        .creagen-error { color: #f53f3f !important; }
        #creagen-toggle {
            cursor: pointer;
            user-select: none;
            font-size: 18px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
        }
        #creagen-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        #creagen-content {
            display: block;
        }
        .creagen-collapsed #creagen-content {
            display: none;
        }
    `);

    // Create UI container
    const container = document.createElement('div');
    container.id = 'creagen-floating-ui';

    container.innerHTML = `
        <div id="creagen-header">
            <span>Creagen 分析助手</span>
            <span id="creagen-toggle">−</span>
        </div>
        <div id="creagen-content">
            <div id="creagen-body">
                <div class="creagen-info" id="creagen-url-display">正在获取视频链接...</div>
                <button class="creagen-btn" id="creagen-analyze-btn" disabled>发送至 Creagen 进行分析</button>
                <div id="creagen-status"></div>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    const toggleBtn = document.getElementById('creagen-toggle');
    const urlDisplay = document.getElementById('creagen-url-display');
    const analyzeBtn = document.getElementById('creagen-analyze-btn');
    const statusDiv = document.getElementById('creagen-status');

    // Toggle collapse/expand
    toggleBtn.addEventListener('click', () => {
        container.classList.toggle('creagen-collapsed');
        toggleBtn.textContent = container.classList.contains('creagen-collapsed') ? '+' : '−';
    });

    // Helper to get current clean URL
    function getCurrentUrl() {
        const url = new URL(window.location.href);
        return url.origin + url.pathname;
    }

    let lastUrl = '';

    // Update URL periodically in case of SPA navigation
    setInterval(() => {
        const currentUrl = getCurrentUrl();
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            statusDiv.textContent = '';
            statusDiv.className = '';
        }
        
        if (currentUrl.includes('/video/') || currentUrl.includes('/discover/')) {
            urlDisplay.textContent = currentUrl;
            if (statusDiv.textContent === '') {
                analyzeBtn.disabled = false;
            }
        } else {
            urlDisplay.textContent = '当前页面非视频页，请进入具体视频';
            analyzeBtn.disabled = true;
        }
    }, 1000);

    // Handle analyze click
    analyzeBtn.addEventListener('click', () => {
        const url = getCurrentUrl();
        
        analyzeBtn.disabled = true;
        analyzeBtn.textContent = '分析中...';
        statusDiv.textContent = '正在发送请求至本地 API...';
        statusDiv.className = '';

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://localhost:3000/api/analyze',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({ url: url }),
            onload: function(response) {
                analyzeBtn.textContent = '发送至 Creagen 进行分析';
                
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.success) {
                        statusDiv.textContent = '分析成功！正在跳转...';
                        statusDiv.className = 'creagen-success';
                        setTimeout(() => {
                            window.open('http://localhost:5173/detail/' + res.data.recipeCard.id, '_blank');
                            statusDiv.textContent = '分析成功！已在 WebApp 打开结果';
                        }, 500);
                    } else {
                        statusDiv.textContent = '分析失败: ' + (res.error || '未知错误');
                        statusDiv.className = 'creagen-error';
                        analyzeBtn.disabled = false;
                    }
                } catch (e) {
                    statusDiv.textContent = '解析响应失败';
                    statusDiv.className = 'creagen-error';
                    analyzeBtn.disabled = false;
                }
            },
            onerror: function(err) {
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = '发送至 Creagen 进行分析';
                statusDiv.textContent = '请求失败，请确保 Creagen 后端正在运行 (http://localhost:3000)';
                statusDiv.className = 'creagen-error';
            }
        });
    });
})();
