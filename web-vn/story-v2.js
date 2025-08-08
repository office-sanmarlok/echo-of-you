// Echo of You - 完全版ストーリーデータ（story_flowchart.md準拠）

// キャラクター情報データ
const characterInfo = {
    kyoko: {
        name: "キョウコ",
        essential: {
            worry: { name: "悩み", content: "成績のプレッシャー", unlocked: false },
            favorite: { name: "好物", content: "いちごケーキ", unlocked: false },
            memory: { name: "思い出", content: "屋上での約束", unlocked: false }
        },
        sub: {
            hobby: { name: "趣味", content: "読書", unlocked: false },
            secret: { name: "秘密", content: "実は運動が苦手", unlocked: false }
        }
    },
    honoka: {
        name: "ホノカ",
        essential: {
            worry: { name: "悩み", content: "将来への不安", unlocked: false },
            favorite: { name: "好物", content: "抹茶アイス", unlocked: false },
            memory: { name: "思い出", content: "文化祭での出来事", unlocked: false }
        },
        sub: {
            hobby: { name: "趣味", content: "写真撮影", unlocked: false },
            secret: { name: "秘密", content: "猫が苦手", unlocked: false }
        }
    },
    luna: {
        name: "ルナ",
        essential: {
            worry: { name: "悩み", content: "人間関係の悩み", unlocked: false },
            favorite: { name: "好物", content: "チョコレート", unlocked: false },
            memory: { name: "思い出", content: "雨の日の傘", unlocked: false }
        },
        sub: {
            hobby: { name: "趣味", content: "音楽鑑賞", unlocked: false },
            secret: { name: "秘密", content: "実は料理が得意", unlocked: false }
        }
    },
    shoujo: {
        name: "少女",
        essential: {
            info1: { name: "正体", content: "アツコと同一人物", unlocked: false },
            info2: { name: "目的", content: "完璧な記憶の創造", unlocked: false },
            info3: { name: "過去", content: "P.memの最初の被験者", unlocked: false },
            info4: { name: "計画", content: "女子3人の抹殺", unlocked: false },
            info5: { name: "弱点", content: "分裂した人格の統合不能", unlocked: false }
        }
    }
};

const storyDataV2 = {
    // ゲーム開始
    start: {
        character: "",
        text: "Echo of You<br><br>これから始まる物語は、記憶と現実が交錯する悲劇...",
        choices: [
            { text: "始める", next: "prologue" }
        ]
    },
    
    // プロローグ
    prologue: {
        character: "",
        text: "学園とLOG部の紹介<br><br>ここは情報技術が高度に発達した近未来の学園。<br>LOG部という謎めいた部活が存在している...",
        choices: [
            { text: "続ける", next: "char_select" }
        ]
    },
    
    // キャラクター選択（上編）
    char_select: {
        character: "",
        text: "【上編：偽ユウ視点】<br><br>誰と過ごす時間を選びますか？<br>※P.mem内の記憶偽造世界",
        choices: [
            { 
                text: "キョウコ", 
                next: "kyoko_route_start",
                condition: () => !gameState.completedRoutes.includes('kyoko')
            },
            { 
                text: "ホノカ", 
                next: "honoka_route_start",
                condition: () => !gameState.completedRoutes.includes('honoka')
            },
            { 
                text: "ルナ", 
                next: "luna_route_start",
                condition: () => !gameState.completedRoutes.includes('luna')
            },
            {
                text: "（全員攻略済み）上編エピローグへ",
                next: "upper_epilogue",
                condition: () => gameState.completedRoutes.length === 3
            }
        ]
    },
    
    // キョウコルート開始
    kyoko_route_start: {
        character: "キョウコ",
        text: "「ユウ、今日も一緒に帰ろう」<br><br>※これは偽造された記憶の中の出来事です",
        choices: [
            { text: "下校セッションへ", next: "kyoko_session1" }
        ]
    },
    
    kyoko_session1: {
        character: "キョウコ",
        text: "下校中、キョウコが話しかけてきた。",
        choices: [
            { 
                text: "成績について聞く", 
                next: "kyoko_info_worry",
                collectInfo: { character: "kyoko", type: "essential", key: "worry" }
            },
            { 
                text: "好きな食べ物について聞く", 
                next: "kyoko_info_favorite",
                collectInfo: { character: "kyoko", type: "essential", key: "favorite" }
            },
            { 
                text: "昔の思い出について聞く", 
                next: "kyoko_info_memory",
                collectInfo: { character: "kyoko", type: "essential", key: "memory" }
            }
        ]
    },
    
    kyoko_info_worry: {
        character: "キョウコ",
        text: "「実は...成績のプレッシャーがすごくて...」<br><br>必須情報1/3を獲得",
        choices: [
            { text: "他の話題へ", next: "kyoko_session1" },
            { 
                text: "告白イベントへ（要3つ）", 
                next: "kyoko_confession",
                condition: () => checkEssentialInfo('kyoko', 3)
            }
        ]
    },
    
    kyoko_info_favorite: {
        character: "キョウコ",
        text: "「いちごケーキが大好きなの！」<br><br>必須情報2/3を獲得",
        choices: [
            { text: "他の話題へ", next: "kyoko_session1" },
            { 
                text: "告白イベントへ（要3つ）", 
                next: "kyoko_confession",
                condition: () => checkEssentialInfo('kyoko', 3)
            }
        ]
    },
    
    kyoko_info_memory: {
        character: "キョウコ",
        text: "「屋上での約束、覚えてる？」<br><br>必須情報3/3を獲得",
        choices: [
            { text: "他の話題へ", next: "kyoko_session1" },
            { 
                text: "告白イベントへ（要3つ）", 
                next: "kyoko_confession",
                condition: () => checkEssentialInfo('kyoko', 3)
            }
        ]
    },
    
    kyoko_confession: {
        character: "キョウコ",
        text: "「ユウ...私、あなたのことが...」<br><br>※この告白も偽造された記憶です",
        choices: [
            { 
                text: "告白を受け入れる", 
                next: "kyoko_success",
                action: () => {
                    gameState.completedRoutes.push('kyoko');
                    saveProgress();
                }
            },
            { text: "やり直す", next: "kyoko_confession" }
        ]
    },
    
    kyoko_success: {
        character: "",
        text: "キョウコルート完了<br><br>偽造記憶の植え付けに成功",
        choices: [
            { text: "キャラクター選択へ戻る", next: "char_select" }
        ]
    },
    
    // ホノカルート（簡略版）
    honoka_route_start: {
        character: "ホノカ",
        text: "「ユウくん、一緒に図書館に行かない？」<br><br>※これは偽造された記憶の中の出来事です",
        choices: [
            { text: "セッション開始", next: "honoka_session1" }
        ]
    },
    
    honoka_session1: {
        character: "ホノカ",
        text: "図書館で二人きり...",
        choices: [
            { 
                text: "将来について聞く", 
                next: "honoka_info_worry",
                collectInfo: { character: "honoka", type: "essential", key: "worry" }
            },
            { 
                text: "好物について聞く", 
                next: "honoka_info_favorite",
                collectInfo: { character: "honoka", type: "essential", key: "favorite" }
            },
            { 
                text: "思い出について聞く", 
                next: "honoka_info_memory",
                collectInfo: { character: "honoka", type: "essential", key: "memory" }
            }
        ]
    },
    
    honoka_info_worry: {
        character: "ホノカ",
        text: "「将来への不安があって...」",
        choices: [
            { text: "他の話題へ", next: "honoka_session1" },
            { 
                text: "告白イベントへ", 
                next: "honoka_confession",
                condition: () => checkEssentialInfo('honoka', 3)
            }
        ]
    },
    
    honoka_info_favorite: {
        character: "ホノカ",
        text: "「抹茶アイスが好きなの」",
        choices: [
            { text: "他の話題へ", next: "honoka_session1" },
            { 
                text: "告白イベントへ", 
                next: "honoka_confession",
                condition: () => checkEssentialInfo('honoka', 3)
            }
        ]
    },
    
    honoka_info_memory: {
        character: "ホノカ",
        text: "「文化祭での出来事...」",
        choices: [
            { text: "他の話題へ", next: "honoka_session1" },
            { 
                text: "告白イベントへ", 
                next: "honoka_confession",
                condition: () => checkEssentialInfo('honoka', 3)
            }
        ]
    },
    
    honoka_confession: {
        character: "ホノカ",
        text: "「ずっと...好きでした」<br><br>※偽造記憶",
        choices: [
            { 
                text: "受け入れる", 
                next: "honoka_success",
                action: () => {
                    gameState.completedRoutes.push('honoka');
                    saveProgress();
                }
            }
        ]
    },
    
    honoka_success: {
        character: "",
        text: "ホノカルート完了",
        choices: [
            { text: "キャラクター選択へ", next: "char_select" }
        ]
    },
    
    // ルナルート（簡略版）
    luna_route_start: {
        character: "ルナ",
        text: "「ユウ...話があるの」<br><br>※偽造記憶",
        choices: [
            { text: "セッション開始", next: "luna_session1" }
        ]
    },
    
    luna_session1: {
        character: "ルナ",
        text: "屋上で二人きり...",
        choices: [
            { 
                text: "悩みを聞く", 
                next: "luna_info_worry",
                collectInfo: { character: "luna", type: "essential", key: "worry" }
            },
            { 
                text: "好物を聞く", 
                next: "luna_info_favorite",
                collectInfo: { character: "luna", type: "essential", key: "favorite" }
            },
            { 
                text: "思い出を聞く", 
                next: "luna_info_memory",
                collectInfo: { character: "luna", type: "essential", key: "memory" }
            }
        ]
    },
    
    luna_info_worry: {
        character: "ルナ",
        text: "「人間関係の悩みが...」",
        choices: [
            { text: "他の話題へ", next: "luna_session1" },
            { 
                text: "告白イベントへ", 
                next: "luna_confession",
                condition: () => checkEssentialInfo('luna', 3)
            }
        ]
    },
    
    luna_info_favorite: {
        character: "ルナ",
        text: "「チョコレートが好き」",
        choices: [
            { text: "他の話題へ", next: "luna_session1" },
            { 
                text: "告白イベントへ", 
                next: "luna_confession",
                condition: () => checkEssentialInfo('luna', 3)
            }
        ]
    },
    
    luna_info_memory: {
        character: "ルナ",
        text: "「雨の日の傘...」",
        choices: [
            { text: "他の話題へ", next: "luna_session1" },
            { 
                text: "告白イベントへ", 
                next: "luna_confession",
                condition: () => checkEssentialInfo('luna', 3)
            }
        ]
    },
    
    luna_confession: {
        character: "ルナ",
        text: "「好き...」<br><br>※偽造記憶",
        choices: [
            { 
                text: "受け入れる", 
                next: "luna_success",
                action: () => {
                    gameState.completedRoutes.push('luna');
                    saveProgress();
                }
            }
        ]
    },
    
    luna_success: {
        character: "",
        text: "ルナルート完了",
        choices: [
            { text: "キャラクター選択へ", next: "char_select" }
        ]
    },
    
    // 上編エピローグ
    upper_epilogue: {
        character: "少女",
        text: "「お疲れさま、偽ユウ」<br><br>実は全て記憶偽造だった。<br>あなたが操作していたのは偽物のAI。<br>3人の女子の記憶は書き換えられた。",
        choices: [
            { text: "中編へ進む", next: "middle_reveal" }
        ]
    },
    
    // 中編開始
    middle_reveal: {
        character: "",
        text: "【中編：現実世界】<br><br>偽記憶に基づき、本物のユウと女子3人が合宿へ...",
        choices: [
            { text: "洋館へ向かう", next: "mansion_arrival" }
        ]
    },
    
    mansion_arrival: {
        character: "本物のユウ",
        text: "「なんか...違和感があるな」<br><br>洋館に到着。何かがおかしい。",
        choices: [
            { text: "階層を選んで探索する", next: "floor_choice" }
        ]
    },
    
    // 中編の階層選択
    floor_choice: {
        character: "",
        text: "どの階を探索しますか？",
        choices: [
            { text: "3階（キョウコと探索）", next: "explore_kyoko" },
            { text: "2階（ルナと探索）", next: "explore_luna" },
            { text: "1階（ホノカと探索）", next: "explore_honoka" }
        ]
    },
    
    explore_kyoko: {
        character: "キョウコ",
        text: "「ユウ、この部屋...見覚えある？」<br><br>記憶の齟齬が発生。キョウコの記憶と本物のユウの記憶が噛み合わない。",
        choices: [
            { text: "ビープ音が聞こえる", next: "beep_sound" }
        ]
    },
    
    explore_luna: {
        character: "ルナ",
        text: "「あれ？この写真...いつ撮ったんだっけ？」<br><br>記憶の齟齬が発生。存在しない記憶の痕跡。",
        choices: [
            { text: "ビープ音が聞こえる", next: "beep_sound" }
        ]
    },
    
    explore_honoka: {
        character: "ホノカ",
        text: "「この日記...私が書いたの？でも...」<br><br>記憶の齟齬が発生。偽造された記憶の矛盾。",
        choices: [
            { text: "ビープ音が聞こえる", next: "beep_sound" }
        ]
    },
    
    beep_sound: {
        character: "",
        text: "ビープ音が地下から聞こえてくる...",
        choices: [
            { text: "地下室へ向かう", next: "inconsistency" }
        ]
    },
    
    inconsistency: {
        character: "",
        text: "記憶の不一致が次々と発覚...<br><br>女子たちの記憶と本物のユウの記憶が噛み合わない。",
        choices: [
            { text: "地下室へ", next: "basement" }
        ]
    },
    
    basement: {
        character: "",
        text: "ビープ音に導かれ地下室へ...<br><br>ルナが先行して入っていく。",
        choices: [
            { text: "追いかける", next: "door_close" }
        ]
    },
    
    door_close: {
        character: "",
        text: "ドアが閉まった！<br><br>本物のユウは締め出され、女子3人のみ閉じ込められた。",
        choices: [
            { text: "何が起きる？", next: "ghost_log" }
        ]
    },
    
    ghost_log: {
        character: "",
        text: "ゴーストログ転送...<br><br>女子3人に暴力性が発現。",
        choices: [
            { text: "悲劇へ", next: "three_girls_dead" }
        ]
    },
    
    three_girls_dead: {
        character: "",
        text: "女子3人死亡<br><br>本物のユウは生存。<br>少女の計画は成功した。",
        choices: [
            { text: "下編へ進む", next: "lower_start" }
        ]
    },
    
    // 下編開始
    lower_start: {
        character: "",
        text: "【下編：偽ユウ視点】<br><br>合宿後...<br>少女が記憶喪失のふりをしている。",
        choices: [
            { text: "少女攻略開始", next: "shoujo_route" }
        ]
    },
    
    shoujo_route: {
        character: "少女",
        text: "「私...何も覚えてないの」<br><br>※上編と同じシステムで少女を攻略",
        choices: [
            { text: "情報収集を始める", next: "shoujo_session1" }
        ]
    },
    
    shoujo_session1: {
        character: "少女",
        text: "少女との会話...",
        choices: [
            { 
                text: "起源について聞く", 
                next: "shoujo_info1",
                collectInfo: { character: "shoujo", type: "essential", key: "info1" }
            },
            { 
                text: "孤独感について聞く", 
                next: "shoujo_info2",
                collectInfo: { character: "shoujo", type: "essential", key: "info2" }
            },
            { 
                text: "記憶について聞く", 
                next: "shoujo_info3",
                collectInfo: { character: "shoujo", type: "essential", key: "info3" }
            },
            { 
                text: "権限について聞く", 
                next: "shoujo_info4",
                collectInfo: { character: "shoujo", type: "essential", key: "info4" }
            },
            { 
                text: "分裂について聞く", 
                next: "shoujo_info5",
                collectInfo: { character: "shoujo", type: "essential", key: "info5" }
            }
        ]
    },
    
    shoujo_info1: {
        character: "少女",
        text: "「私の起源...知らない」<br><br>必須情報1/5",
        choices: [
            { text: "他の話題へ", next: "shoujo_session1" },
            { 
                text: "真実開示イベントへ（要5つ）", 
                next: "truth_event",
                condition: () => checkEssentialInfo('shoujo', 5)
            }
        ]
    },
    
    shoujo_info2: {
        character: "少女",
        text: "「ずっと一人だった」<br><br>必須情報2/5",
        choices: [
            { text: "他の話題へ", next: "shoujo_session1" },
            { 
                text: "真実開示イベントへ（要5つ）", 
                next: "truth_event",
                condition: () => checkEssentialInfo('shoujo', 5)
            }
        ]
    },
    
    shoujo_info3: {
        character: "少女",
        text: "「記憶の認識が...」<br><br>必須情報3/5",
        choices: [
            { text: "他の話題へ", next: "shoujo_session1" },
            { 
                text: "真実開示イベントへ（要5つ）", 
                next: "truth_event",
                condition: () => checkEssentialInfo('shoujo', 5)
            }
        ]
    },
    
    shoujo_info4: {
        character: "少女",
        text: "「書き換え権限...」<br><br>必須情報4/5",
        choices: [
            { text: "他の話題へ", next: "shoujo_session1" },
            { 
                text: "真実開示イベントへ（要5つ）", 
                next: "truth_event",
                condition: () => checkEssentialInfo('shoujo', 5)
            }
        ]
    },
    
    shoujo_info5: {
        character: "少女",
        text: "「分裂の感覚...」<br><br>必須情報5/5",
        choices: [
            { text: "他の話題へ", next: "shoujo_session1" },
            { 
                text: "真実開示イベントへ（要5つ）", 
                next: "truth_event",
                condition: () => checkEssentialInfo('shoujo', 5)
            }
        ]
    },
    
    // 真実開示イベント
    truth_event: {
        character: "",
        text: "段階的真実開示<br>1.権限共有<br>2.ゴーストログ発見<br>3.アツコの記憶<br>4.P.memの正体<br>5.合宿の真実",
        choices: [
            { text: "真実を突きつける", next: "confrontation" }
        ]
    },
    
    confrontation: {
        character: "偽ユウ",
        text: "「君は...アツコなんだろう？」",
        choices: [
            { text: "続ける", next: "shoujo_breakdown" }
        ]
    },
    
    shoujo_breakdown: {
        character: "少女",
        text: "「やめて...やめて！」<br><br>少女の精神崩壊",
        choices: [
            { text: "エピローグへ", next: "atsuko_appears" }
        ]
    },
    
    // 最終エピローグ
    atsuko_appears: {
        character: "アツコ",
        text: "「もう...終わりにしましょう」<br><br>アツコが現れ、散弾銃を構える。",
        choices: [
            { text: "続ける", next: "shoujo_death" }
        ]
    },
    
    shoujo_death: {
        character: "",
        text: "アツコが少女を射殺",
        choices: [
            { text: "続ける", next: "yu_death" }
        ]
    },
    
    yu_death: {
        character: "",
        text: "アツコが偽ユウも射殺",
        choices: [
            { text: "続ける", next: "real_world" }
        ]
    },
    
    real_world: {
        character: "",
        text: "現実世界へ<br><br>本物のユウ覚醒",
        choices: [
            { text: "続ける", next: "pmem_stop" }
        ]
    },
    
    pmem_stop: {
        character: "",
        text: "P.mem全世界停止",
        choices: [
            { text: "エンディング", next: "final_end" }
        ]
    },
    
    final_end: {
        character: "本物のユウ",
        text: "一年後...<br><br>「あの日から、世界は変わった」<br><br>Echo of You - 完",
        choices: [
            { text: "タイトルへ戻る", next: "start" }
        ]
    }
};

// フローチャートノード定義（V2用）
const flowchartNodes = {
    start: { x: 400, y: 30, name: "開始", description: "ゲーム開始" },
    prologue: { x: 400, y: 80, name: "プロローグ", description: "学園とLOG部紹介" },
    char_select: { x: 400, y: 130, name: "キャラ選択", description: "上編：偽ユウ視点" },
    
    // 上編ルート
    kyoko_route_start: { x: 200, y: 200, name: "キョウコ", description: "偽造記憶ルート" },
    honoka_route_start: { x: 400, y: 200, name: "ホノカ", description: "偽造記憶ルート" },
    luna_route_start: { x: 600, y: 200, name: "ルナ", description: "偽造記憶ルート" },
    
    upper_epilogue: { x: 400, y: 270, name: "上編完", description: "記憶偽造完了" },
    
    // 中編
    middle_reveal: { x: 400, y: 320, name: "中編開始", description: "現実世界" },
    mansion_arrival: { x: 400, y: 370, name: "洋館", description: "合宿" },
    basement: { x: 300, y: 420, name: "地下室", description: "締め出し" },
    three_girls_dead: { x: 400, y: 420, name: "悲劇", description: "女子3人死亡" },
    
    // 下編
    lower_start: { x: 400, y: 470, name: "下編開始", description: "偽ユウ視点" },
    shoujo_route: { x: 400, y: 520, name: "少女攻略", description: "5つの情報収集" },
    truth_event: { x: 300, y: 570, name: "真実開示", description: "段階的告発" },
    shoujo_breakdown: { x: 400, y: 570, name: "崩壊", description: "少女の精神崩壊" },
    
    // エンディング
    atsuko_appears: { x: 500, y: 570, name: "アツコ", description: "射殺" },
    final_end: { x: 400, y: 620, name: "終幕", description: "P.mem停止" }
};

// 必須情報チェック関数
function checkEssentialInfo(character, required) {
    if (!gameState.collectedInfo[character]) return false;
    
    let count = 0;
    const essential = gameState.collectedInfo[character].essential;
    
    for (let key in essential) {
        if (essential[key].unlocked) count++;
    }
    
    return count >= required;
}

// 進行状況保存
function saveProgress() {
    localStorage.setItem('gameProgress', JSON.stringify({
        completedRoutes: gameState.completedRoutes,
        collectedInfo: gameState.collectedInfo
    }));
}