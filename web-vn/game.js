// ゲームステート
let gameState = {
    currentNode: 'start',
    visitedNodes: ['start'],
    collectedInfo: JSON.parse(localStorage.getItem('collectedInfo')) || {},
    completedRoutes: JSON.parse(localStorage.getItem('completedRoutes')) || [],
    settings: {
        textSpeed: 50,
        bgmVolume: 50,
        seVolume: 50
    }
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // タイトル画面から開始
    showTitleScreen();
    setupEventListeners();
});

function initGame() {
    // 情報データの初期化
    if (Object.keys(gameState.collectedInfo).length === 0) {
        for (let char in characterInfo) {
            gameState.collectedInfo[char] = JSON.parse(JSON.stringify(characterInfo[char]));
        }
    }
    
    // 初期ノード表示
    showNode('start');
}

// イベントリスナー設定
function setupEventListeners() {
    // サイドバーボタン
    document.getElementById('flowchart-btn').addEventListener('click', showFlowchart);
    document.getElementById('info-btn').addEventListener('click', showInfo);
    document.getElementById('save-btn').addEventListener('click', () => showSaveLoad('save'));
    document.getElementById('load-btn').addEventListener('click', () => showSaveLoad('load'));
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    
    // 閉じるボタン
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // 設定スライダー
    document.getElementById('text-speed').addEventListener('input', (e) => {
        gameState.settings.textSpeed = e.target.value;
    });
    document.getElementById('bgm-volume').addEventListener('input', (e) => {
        gameState.settings.bgmVolume = e.target.value;
    });
    document.getElementById('se-volume').addEventListener('input', (e) => {
        gameState.settings.seVolume = e.target.value;
    });
}

// ノード表示
function showNode(nodeId) {
    // V2ストーリーデータを使用
    const node = storyDataV2[nodeId] || storyData[nodeId];
    if (!node) return;
    
    // 現在のノードを更新
    gameState.currentNode = nodeId;
    
    // 訪問済みに追加
    if (!gameState.visitedNodes.includes(nodeId)) {
        gameState.visitedNodes.push(nodeId);
    }
    
    // 情報収集処理
    if (node.collectInfo) {
        if (Array.isArray(node.collectInfo)) {
            node.collectInfo.forEach(info => collectInfo(info));
        } else {
            collectInfo(node.collectInfo);
        }
    }
    
    // キャラクター名表示
    document.getElementById('character-name').textContent = node.character || '';
    
    // テキスト表示（タイピングエフェクト）
    typeText(node.text);
    
    // 選択肢表示
    showChoices(node.choices);
    
    // オートセーブ
    autoSave();
}

// テキストタイピングエフェクト
function typeText(text) {
    const element = document.getElementById('dialogue-text');
    
    // タイピングエフェクトを無効にして直接表示（文字化け回避）
    element.innerHTML = text;
}

// 選択肢表示
function showChoices(choices) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    
    if (!choices || choices.length === 0) return;
    
    setTimeout(() => {
        choices.forEach(choice => {
            // 条件チェック
            if (choice.condition && !choice.condition()) {
                return; // 条件を満たさない選択肢は表示しない
            }
            
            const btn = document.createElement('button');
            btn.className = 'choice-btn fade-in';
            btn.textContent = choice.text;
            
            btn.addEventListener('click', () => {
                // カスタムアクション実行
                if (choice.action && typeof choice.action === 'function') {
                    choice.action();
                }
                
                if (choice.action && typeof choice.action === 'string') {
                    // 特殊アクション
                    if (choice.action === 'showFlowchart') {
                        showFlowchart();
                    } else if (choice.action === 'showInfo') {
                        showInfo();
                    }
                } else if (choice.next) {
                    // 情報収集
                    if (choice.collectInfo) {
                        collectInfo(choice.collectInfo);
                    }
                    // 次のノードへ
                    showNode(choice.next);
                }
            });
            
            container.appendChild(btn);
        });
    }, 1000);
}

// 情報収集
function collectInfo(info) {
    if (gameState.collectedInfo[info.character] &&
        gameState.collectedInfo[info.character][info.type] &&
        gameState.collectedInfo[info.character][info.type][info.key]) {
        
        gameState.collectedInfo[info.character][info.type][info.key].unlocked = true;
        
        // ローカルストレージに保存
        localStorage.setItem('collectedInfo', JSON.stringify(gameState.collectedInfo));
        
        // 通知表示
        showNotification(`新しい情報を獲得: ${gameState.collectedInfo[info.character][info.type][info.key].name}`);
    }
}

// フローチャート表示
function showFlowchart() {
    document.getElementById('flowchart-screen').classList.add('active');
    drawFlowchart();
}

// フローチャート描画
function drawFlowchart() {
    const svg = document.getElementById('flowchart-svg');
    svg.innerHTML = '';
    
    // 背景
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '800');
    bg.setAttribute('height', '600');
    bg.setAttribute('fill', '#2a2a2a');
    svg.appendChild(bg);
    
    // V2用のリンク描画
    const links = [
        ['start', 'prologue'],
        ['prologue', 'char_select'],
        ['char_select', 'kyoko_route_start'],
        ['char_select', 'honoka_route_start'],
        ['char_select', 'luna_route_start'],
        ['char_select', 'upper_epilogue'],
        ['upper_epilogue', 'middle_reveal'],
        ['middle_reveal', 'mansion_arrival'],
        ['mansion_arrival', 'three_girls_dead'],
        ['three_girls_dead', 'lower_start'],
        ['lower_start', 'shoujo_route'],
        ['shoujo_route', 'truth_event'],
        ['truth_event', 'shoujo_breakdown'],
        ['shoujo_breakdown', 'final_end']
    ];
    
    links.forEach(([from, to]) => {
        if (flowchartNodes[from] && flowchartNodes[to]) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', flowchartNodes[from].x);
            line.setAttribute('y1', flowchartNodes[from].y);
            line.setAttribute('x2', flowchartNodes[to].x);
            line.setAttribute('y2', flowchartNodes[to].y);
            line.setAttribute('class', 'link');
            svg.appendChild(line);
        }
    });
    
    // ノード描画
    for (let nodeId in flowchartNodes) {
        const node = flowchartNodes[nodeId];
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'node');
        
        // 訪問済みチェック
        if (gameState.visitedNodes.includes(nodeId)) {
            g.classList.add('visited');
        }
        
        // 現在位置チェック
        if (gameState.currentNode === nodeId) {
            g.classList.add('current');
        }
        
        // 矩形
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', node.x - 40);
        rect.setAttribute('y', node.y - 15);
        rect.setAttribute('width', 80);
        rect.setAttribute('height', 30);
        rect.setAttribute('rx', 5);
        g.appendChild(rect);
        
        // テキスト
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + 5);
        text.textContent = node.name;
        g.appendChild(text);
        
        // クリックイベント
        g.addEventListener('click', () => {
            showNodeInfo(nodeId);
        });
        
        svg.appendChild(g);
    }
}

// ノード情報表示
function showNodeInfo(nodeId) {
    const node = flowchartNodes[nodeId];
    const infoDiv = document.getElementById('node-info');
    
    let html = `<h3>${node.name}</h3>`;
    html += `<p>${node.description}</p>`;
    
    if (gameState.visitedNodes.includes(nodeId)) {
        html += `<button onclick="jumpToNode('${nodeId}')">このノードへジャンプ</button>`;
    } else {
        html += `<p style="color: #888;">まだ訪問していません</p>`;
    }
    
    infoDiv.innerHTML = html;
}

// ノードへジャンプ
function jumpToNode(nodeId) {
    closeModal();
    showNode(nodeId);
}

// 情報タブ表示
function showInfo() {
    document.getElementById('info-screen').classList.add('active');
    
    // タブボタン設定
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            showCharacterInfo(e.target.dataset.character);
        });
    });
    
    // 最初のキャラクター表示
    document.querySelector('.tab-btn').click();
}

// キャラクター情報表示
function showCharacterInfo(character) {
    const content = document.getElementById('info-content');
    const info = gameState.collectedInfo[character];
    
    if (!info) return;
    
    let html = `<h3>${info.name}の情報</h3>`;
    
    // 必須情報
    html += '<h4>必須情報</h4>';
    for (let key in info.essential) {
        const item = info.essential[key];
        html += `<div class="info-item ${item.unlocked ? '' : 'locked'}">`;
        html += `<div class="info-label">${item.name}</div>`;
        html += `<div>${item.unlocked ? item.content : '???'}</div>`;
        html += '</div>';
    }
    
    // サブ情報
    if (info.sub) {
        html += '<h4>サブ情報</h4>';
        for (let key in info.sub) {
            const item = info.sub[key];
            html += `<div class="info-item ${item.unlocked ? '' : 'locked'}">`;
            html += `<div class="info-label">${item.name}</div>`;
            html += `<div>${item.unlocked ? item.content : '???'}</div>`;
            html += '</div>';
        }
    }
    
    // 収集率
    const total = Object.keys(info.essential).length + (info.sub ? Object.keys(info.sub).length : 0);
    let unlocked = 0;
    
    for (let key in info.essential) {
        if (info.essential[key].unlocked) unlocked++;
    }
    if (info.sub) {
        for (let key in info.sub) {
            if (info.sub[key].unlocked) unlocked++;
        }
    }
    
    const rate = Math.floor((unlocked / total) * 100);
    html += `<div style="margin-top: 20px;">収集率: ${rate}%</div>`;
    html += `<div style="width: 100%; height: 20px; background: #333; border-radius: 10px; margin-top: 10px;">`;
    html += `<div style="width: ${rate}%; height: 100%; background: #27ae60; border-radius: 10px;"></div>`;
    html += '</div>';
    
    content.innerHTML = html;
}

// セーブ/ロード画面表示
function showSaveLoad(mode) {
    document.getElementById('save-screen').classList.add('active');
    document.getElementById('save-title').textContent = mode === 'save' ? 'セーブ' : 'ロード';
    
    const slots = document.getElementById('save-slots');
    slots.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const slot = document.createElement('div');
        slot.className = 'save-slot';
        
        const saveData = localStorage.getItem(`save_${i}`);
        if (saveData) {
            const data = JSON.parse(saveData);
            slot.innerHTML = `
                <h4>スロット ${i}</h4>
                <p>場所: ${flowchartNodes[data.currentNode]?.name || '不明'}</p>
                <p>日時: ${new Date(data.timestamp).toLocaleString()}</p>
            `;
        } else {
            slot.className += ' empty';
            slot.innerHTML = `
                <h4>スロット ${i}</h4>
                <p>空きスロット</p>
            `;
        }
        
        slot.addEventListener('click', () => {
            if (mode === 'save') {
                saveGame(i);
            } else {
                loadGame(i);
            }
        });
        
        slots.appendChild(slot);
    }
}

// セーブ
function saveGame(slot) {
    const saveData = {
        currentNode: gameState.currentNode,
        visitedNodes: gameState.visitedNodes,
        collectedInfo: gameState.collectedInfo,
        timestamp: Date.now()
    };
    
    localStorage.setItem(`save_${slot}`, JSON.stringify(saveData));
    showNotification(`スロット ${slot} にセーブしました`);
    closeModal();
}

// ロード
function loadGame(slot) {
    const saveData = localStorage.getItem(`save_${slot}`);
    if (!saveData) {
        showNotification('セーブデータがありません');
        return;
    }
    
    const data = JSON.parse(saveData);
    gameState.currentNode = data.currentNode;
    gameState.visitedNodes = data.visitedNodes;
    gameState.collectedInfo = data.collectedInfo;
    
    showNotification(`スロット ${slot} をロードしました`);
    closeModal();
    showNode(gameState.currentNode);
}

// 設定画面表示
function showSettings() {
    document.getElementById('settings-screen').classList.add('active');
    
    // 現在の設定値を反映
    document.getElementById('text-speed').value = gameState.settings.textSpeed;
    document.getElementById('bgm-volume').value = gameState.settings.bgmVolume;
    document.getElementById('se-volume').value = gameState.settings.seVolume;
}

// モーダル閉じる
function closeModal() {
    document.querySelectorAll('.screen').forEach(screen => {
        if (screen.id !== 'main-screen') {
            screen.classList.remove('active');
        }
    });
}

// 通知表示
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: fadeIn 0.5s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// タイトル画面表示
function showTitleScreen() {
    document.getElementById('title-screen').classList.add('active');
    document.getElementById('main-screen').classList.remove('active');
}

// 新規ゲーム開始
function startNewGame() {
    // 現在の設定を保持
    const currentSettings = gameState.settings || {
        textSpeed: 50,
        bgmVolume: 50,
        seVolume: 50
    };
    
    // ゲームステートをリセット
    gameState = {
        currentNode: 'start',
        visitedNodes: ['start'],
        collectedInfo: {},
        completedRoutes: [],
        settings: currentSettings
    };
    
    // 情報データの初期化
    for (let char in characterInfo) {
        gameState.collectedInfo[char] = JSON.parse(JSON.stringify(characterInfo[char]));
    }
    
    // タイトル画面を非表示
    document.getElementById('title-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
    
    // 最初のノードを表示
    showNode('start');
}

// コンティニュー
function continueGame() {
    const lastSave = localStorage.getItem('lastSave');
    if (lastSave) {
        const data = JSON.parse(lastSave);
        gameState.currentNode = data.currentNode;
        gameState.visitedNodes = data.visitedNodes;
        gameState.collectedInfo = data.collectedInfo;
        gameState.completedRoutes = data.completedRoutes || [];
        
        document.getElementById('title-screen').classList.remove('active');
        document.getElementById('main-screen').classList.add('active');
        
        showNode(gameState.currentNode);
    } else {
        showNotification('セーブデータがありません');
    }
}

// ギャラリー表示
function showGallery() {
    showNotification('ギャラリー機能は準備中です');
}

// クレジット表示
function showCredits() {
    const credits = `
        Echo of You - Web Edition
        
        Original Story: story_flowchart.md
        Programming: HTML/CSS/JavaScript
        
        Thank you for playing!
    `;
    alert(credits);
}

// オートセーブ
function autoSave() {
    const saveData = {
        currentNode: gameState.currentNode,
        visitedNodes: gameState.visitedNodes,
        collectedInfo: gameState.collectedInfo,
        completedRoutes: gameState.completedRoutes,
        timestamp: Date.now()
    };
    localStorage.setItem('lastSave', JSON.stringify(saveData));
}