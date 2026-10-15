import { ShrineSpot } from '@/types/spot';

export const DEFAULT_HOME_SPOT_ID = 'funabashi';

// ==========================================
// 1. ストーリーシナリオ 3候補（要件7・8）
// ==========================================
export interface StoryScenario {
  id: 'scenario_1' | 'scenario_2' | 'scenario_3';
  title: string;
  subtitle: string;
  badge: string;
  prologue: string;
  missionSummary: string;
  awakeningNarrative: string;
  endingSummary: string;
}

export const STORY_SCENARIOS: StoryScenario[] = [
  {
    id: 'scenario_1',
    title: '候補①：『零（こぼ）れた神光と、ちいさな御祭神の帰還』',
    subtitle: '王道・感動作｜ちいさくなった守護神と全国を巡る絆の物語',
    badge: '王道・感動作（推奨）',
    prologue:
      '時代の喧騒の中で人々の「祈り」と「感謝」が少しずつ薄れ、あなたがホームに選んだ本宮の御祭神は神力を失い、手のひらサイズの「ちいさなデフォルメ姿（微睡みの御霊）」となってしまいました。',
    missionSummary:
      '全国の社寺を参拝して御朱印（神縁の証）を集めるたび、澄んだ「神力（しんりょく）」が宿ります。それを本宮へ持ち帰り献上することで、ちいさな御祭神は本来の輝きと力を取り戻していきます。',
    awakeningNarrative:
      '神力を献上するたびに御祭神は「微睡み」から「顕現」「瑞光」へと段階的に覚醒し、あなたに感謝の言葉と守護の御神影（特典画像）を授けてくれます。',
    endingSummary:
      '全国17ゾーンの1つが満願を迎えるたび、力を取り戻した御祭神は霊峰・富士の頂へと舞い上がり、達成した大地をやさしい光で包み込みながら、人が人として生きる「ひとつの道（すじみち）」を説き示します。',
  },
  {
    id: 'scenario_2',
    title: '候補②：『十七の結界と、封じられた言霊（ことだま）の栞』',
    subtitle: '神秘・探求編｜日本列島17の霊域を繋ぎ直す神話再生譚',
    badge: '神秘・探求編',
    prologue:
      '古より日本列島を守護していた「十七の霊域結界」がほころび、それを繋ぎ止めるために全ての力を注いだホーム神社の御祭神は、幼いデフォルメ姿へと還って眠りについてしまいました。',
    missionSummary:
      '結界を再び結び直す鍵は、全国47都道府県・17ゾーンの社寺に点在する「御朱印の神力」を集め、本宮の祭壇へ還すこと。あなたが持ち帰る一雫の神力が、失われた神威を呼び覚まします。',
    awakeningNarrative:
      '本宮に神力が満ちるほど御祭神の神格が回復し、古の霊力を秘めた「守護御神影」が次々と解放されていきます。',
    endingSummary:
      '各ゾーンの結界が修復されるたび、御祭神は富士山頂から列島へ黄金の瑞光を放ち、「天地の法則と人の法則」を刻んだ『導きの栞（全十七葉）』をあなたの手に結晶化させます。',
  },
  {
    id: 'scenario_3',
    title: '候補③：『千年灯明と、迷い世を照らす「ひとつの道」』',
    subtitle: '灯明・現代再生編｜船橋大神宮の灯明台から始まる心の羅針盤',
    badge: '灯明・現代再生編',
    prologue:
      '船橋大神宮の「灯明台」をはじめ、日本の社（やしろ）は千年以上にわたり人々の「心の灯台」でした。しかし現代、心の羅針盤を見失う人が増え、本宮のデフォルメ御祭神が抱える灯火も今まさに消えかかっています。',
    missionSummary:
      '現地で本物の御朱印を授かり、その神力をホーム神社へ持ち帰って献上することで、御祭神の灯火に再びあたたかな光が宿ります。',
    awakeningNarrative:
      '灯火が大きくなるにつれて御祭神は本来の柔和で力強い姿を取り戻し、旅の記憶を彩る特別な「御神影アートカード」を贈ってくれます。',
    endingSummary:
      '17のゾーンを制覇するごとに、力を取り戻した御祭神が富士の頂上から日本列島をやさしい光で包み込み、日々の暮らしを幸福へと導く「ひとつの道（すじみち）」を17枚の栞として授けます。',
  },
];

// ==========================================
// 2. 全国17ゾーン定義（全47都道府県完全網羅・要件10・11）
// ==========================================
export interface JapanZone {
  zoneId: string;
  zoneNumber: number;
  name: string;
  shortName: string;
  prefectures: string[];
  description: string;
  // SVG Japan Map coordinates (viewBox 0 0 400 420)
  mapX: number;
  mapY: number;
  mapRadius: number;
}

export const JAPAN_17_ZONES: JapanZone[] = [
  {
    zoneId: 'ZONE-01',
    zoneNumber: 1,
    name: '第1霊域：蝦夷・北の大地ゾーン',
    shortName: '① 北海道',
    prefectures: ['北海道'],
    description: '大自然の原野と開拓の祈りが息づく北の大聖域',
    mapX: 330,
    mapY: 58,
    mapRadius: 28,
  },
  {
    zoneId: 'ZONE-02',
    zoneNumber: 2,
    name: '第2霊域：北奥羽・みちのくゾーン',
    shortName: '② 青森・岩手・秋田',
    prefectures: ['青森県', '岩手県', '秋田県'],
    description: '岩木山・恐山・平泉黄金文化と古四王が鎮まる北東北の霊域',
    mapX: 298,
    mapY: 122,
    mapRadius: 22,
  },
  {
    zoneId: 'ZONE-03',
    zoneNumber: 3,
    name: '第3霊域：南奥羽・出羽三山ゾーン',
    shortName: '③ 宮城・山形・福島',
    prefectures: ['宮城県', '山形県', '福島県'],
    description: '出羽三山の生まれ変わりの山岳信仰と陸奥一宮の聖域',
    mapX: 286,
    mapY: 165,
    mapRadius: 22,
  },
  {
    zoneId: 'ZONE-04',
    zoneNumber: 4,
    name: '第4霊域：房総・常陸 東国三社ゾーン',
    shortName: '④ 千葉・茨城',
    prefectures: ['千葉県', '茨城県'],
    description: '船橋大神宮・香取・鹿島・息栖の東国鎮護と海原の聖域',
    mapX: 288,
    mapY: 222,
    mapRadius: 20,
  },
  {
    zoneId: 'ZONE-05',
    zoneNumber: 5,
    name: '第5霊域：北関東・日光秩父霊山ゾーン',
    shortName: '⑤ 栃木・群馬・埼玉',
    prefectures: ['栃木県', '群馬県', '埼玉県'],
    description: '日光・榛名・赤城・三峯・氷川の山岳と武州鎮護の聖域',
    mapX: 262,
    mapY: 206,
    mapRadius: 20,
  },
  {
    zoneId: 'ZONE-06',
    zoneNumber: 6,
    name: '第6霊域：江戸・武蔵総鎮守ゾーン',
    shortName: '⑥ 東京',
    prefectures: ['東京都'],
    description: '明治神宮・神田明神・東京大神宮・浅草寺など江戸開運の中枢',
    mapX: 268,
    mapY: 234,
    mapRadius: 16,
  },
  {
    zoneId: 'ZONE-07',
    zoneNumber: 7,
    name: '第7霊域：不二霊峰・箱根相模ゾーン',
    shortName: '⑦ 神奈川・山梨・静岡',
    prefectures: ['神奈川県', '山梨県', '静岡県'],
    description: '霊峰富士の本宮・箱根・鎌倉・三嶋を結ぶ日本精神の要衝',
    mapX: 248,
    mapY: 248,
    mapRadius: 21,
  },
  {
    zoneId: 'ZONE-08',
    zoneNumber: 8,
    name: '第8霊域：信濃・越後 神代アルプスゾーン',
    shortName: '⑧ 長野・新潟',
    prefectures: ['長野県', '新潟県'],
    description: '諏訪大社・戸隠・善光寺・彌彦神社が鎮座する脊梁山脈の聖域',
    mapX: 244,
    mapY: 196,
    mapRadius: 21,
  },
  {
    zoneId: 'ZONE-09',
    zoneNumber: 9,
    name: '第9霊域：北陸三州・白山立山ゾーン',
    shortName: '⑨ 富山・石川・福井',
    prefectures: ['富山県', '石川県', '福井県'],
    description: '霊峰白山・立山雄山・氣比・永平寺の清浄なる北陸霊場',
    mapX: 212,
    mapY: 204,
    mapRadius: 20,
  },
  {
    zoneId: 'ZONE-10',
    zoneNumber: 10,
    name: '第10霊域：尾張・三河・美濃飛騨ゾーン',
    shortName: '⑩ 愛知・岐阜',
    prefectures: ['愛知県', '岐阜県'],
    description: '草薙神剣を祀る熱田神宮・南宮大社・飛騨一宮の中京聖域',
    mapX: 216,
    mapY: 244,
    mapRadius: 19,
  },
  {
    zoneId: 'ZONE-11',
    zoneNumber: 11,
    name: '第11霊域：伊勢・近江 神路山と琵琶湖ゾーン',
    shortName: '⑪ 三重・滋賀',
    prefectures: ['三重県', '滋賀県'],
    description: '日本総氏神・伊勢神宮と比叡・日吉・多賀・竹生島の水と太陽の聖域',
    mapX: 198,
    mapY: 262,
    mapRadius: 19,
  },
  {
    zoneId: 'ZONE-12',
    zoneNumber: 12,
    name: '第12霊域：千年王城・山城平安ゾーン',
    shortName: '⑫ 京都',
    prefectures: ['京都府'],
    description: '伏見稲荷・賀茂両社・八坂・伊勢向日など千年の都を守護する聖域',
    mapX: 178,
    mapY: 246,
    mapRadius: 17,
  },
  {
    zoneId: 'ZONE-13',
    zoneNumber: 13,
    name: '第13霊域：大和・紀伊 熊野高野ゾーン',
    shortName: '⑬ 奈良・和歌山',
    prefectures: ['奈良県', '和歌山県'],
    description: '日本最古の大神神社・春日・橿原から熊野三山へと続く甦りの聖域',
    mapX: 182,
    mapY: 282,
    mapRadius: 21,
  },
  {
    zoneId: 'ZONE-14',
    zoneNumber: 14,
    name: '第14霊域：難波津・播磨 住吉生田ゾーン',
    shortName: '⑭ 大阪・兵庫',
    prefectures: ['大阪府', '兵庫県'],
    description: '住吉大社・四天王寺・生田・廣田・伊和が鎮まる瀬戸内海運の要衝',
    mapX: 162,
    mapY: 264,
    mapRadius: 18,
  },
  {
    zoneId: 'ZONE-15',
    zoneNumber: 15,
    name: '第15霊域：出雲・吉備・安芸 神話海道ゾーン',
    shortName: '⑮ 中国五県（山陰・山陽）',
    prefectures: ['鳥取県', '島根県', '岡山県', '広島県', '山口県'],
    description: '出雲大社・美保神社・厳島神社・吉備津神社が紡ぐ八雲と瀬戸内の神話域',
    mapX: 118,
    mapY: 256,
    mapRadius: 26,
  },
  {
    zoneId: 'ZONE-16',
    zoneNumber: 16,
    name: '第16霊域：四国四州・遍路と一宮ゾーン',
    shortName: '⑯ 四国四県',
    prefectures: ['徳島県', '香川県', '愛媛県', '高知県'],
    description: '金刀比羅宮・大山祇神社・石鎚山・八十八ヶ所発心の四国霊場',
    mapX: 136,
    mapY: 298,
    mapRadius: 22,
  },
  {
    zoneId: 'ZONE-17',
    zoneNumber: 17,
    name: '第17霊域：筑紫・日向・琉球 天孫降臨ゾーン',
    shortName: '⑰ 九州・沖縄八県',
    prefectures: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'],
    description: '太宰府・宗像・宇佐・阿蘇・高千穂・霧島・斎場御嶽に至る神話源流の聖域',
    mapX: 74,
    mapY: 326,
    mapRadius: 32,
  },
];

// ==========================================
// 3. 『古の導きの栞（全十七葉）』データ（要件11・12・13）
// ※完全ステルスマーケティング仕様：直接的な書籍名・著者名・団体名を一切出さず、
//   17か条の核心を神話の御祭神からの優しい語りかけとして昇華。
// ==========================================
export interface SacredBookmark {
  id: string;
  number: number;
  kanjiNumber: string;
  title: string;
  subtitle: string;
  deityQuote: string; // 御祭神から授かる短文セリフ（会員なら即座に解るエッセンス）
  practicalWisdom: string; // 日常の実践ヒント
  colorAccent: string;
}

export const SACRED_BOOKMARKS_17: SacredBookmark[] = [
  {
    id: 'BOOKMARK-01',
    number: 1,
    kanjiNumber: '第壱葉',
    title: '最良の一日（日々好日のしおり）',
    subtitle: '目覚めの瞬間から、新しい命が始まる',
    deityQuote:
      '「朝、目が覚めたその瞬間が新しい命の始まりじゃ。『今日は最良の一日』と喜んでぱっと起きれば、すべての歯車が幸いへと回り出すぞ。」',
    practicalWisdom: '朝の目覚めとともに今日という日を喜び、軽やかに最初の一歩を踏み出す。',
    colorAccent: 'from-amber-500 to-orange-600',
  },
  {
    id: 'BOOKMARK-02',
    number: 2,
    kanjiNumber: '第弐葉',
    title: '幸いへの門（試練突破のしおり）',
    subtitle: '目の前の壁は、幸せへ通じる扉である',
    deityQuote:
      '「苦しみや逆境は、お前を困らせるために来るのではないぞ。逃げずに素直な心で向き合った時、それはそのまま大きな幸福への門となって開くのじゃ。」',
    practicalWisdom: '困難に出会ったときこそ「これでまた一つ磨かれる」と受け止め、前へ進む。',
    colorAccent: 'from-red-600 to-amber-600',
  },
  {
    id: 'BOOKMARK-03',
    number: 3,
    kanjiNumber: '第参葉',
    title: '心の設計図（運命開拓のしおり）',
    subtitle: '運命は自らまねき、境遇は自ら造る',
    deityQuote:
      '「運も境遇も、外から勝手に降ってくるものではない。すべては己の『心』が呼び寄せ、己の手で造り上げるものじゃ。心が変われば、世界はいつだって変えられるぞ。」',
    practicalWisdom: '環境や他人のせいにせず、自分の心の持ち方と行動から未来を創り出す。',
    colorAccent: 'from-indigo-600 to-purple-700',
  },
  {
    id: 'BOOKMARK-04',
    number: 4,
    kanjiNumber: '第四葉',
    title: '万象のうつし鏡（澄心のしおり）',
    subtitle: '周りの人々はみな、わが心を映す鏡',
    deityQuote:
      '「目の前の人も出来事も、すべてはお前の心を映し出す鏡なのじゃ。鏡の中の姿を変えたければ、まず己自身の心を澄ませ、笑顔を向けてごらん。」',
    practicalWisdom: '周囲の振る舞いの中に自分の心の投影を見つけ、自分から先に温かく接する。',
    colorAccent: 'from-sky-600 to-blue-700',
  },
  {
    id: 'BOOKMARK-05',
    number: 5,
    kanjiNumber: '第五葉',
    title: '一対の反射鏡（和合のしおり）',
    subtitle: '最も身近な伴侶と響き合う心の鏡',
    deityQuote:
      '「共に歩む伴侶とは、互いを映し合う一対の反射鏡のようなものじゃ。いたわりと感謝を響かせ合えば、家庭という社（やしろ）にはいつも春の陽だまりが満ちるぞ。」',
    practicalWisdom: '一番身近な家族やパートナーにこそ、日頃の「ありがとう」を言葉と態度で伝える。',
    colorAccent: 'from-rose-500 to-pink-600',
  },
  {
    id: 'BOOKMARK-06',
    number: 6,
    kanjiNumber: '第六葉',
    title: '心の名優（継承のしおり）',
    subtitle: '次世代は親の心をそのまま演じる',
    deityQuote:
      '「幼き者や後に続く者たちは、言葉での言い聞かせではなく、お前の『心根』をそのまま写し取って演じる名優なのじゃ。まず己が澄んだ背中を見せることだな。」',
    practicalWisdom: '後輩や子どもを導くときは、まず自分自身が喜びと誠実さを持って生きる。',
    colorAccent: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'BOOKMARK-07',
    number: 7,
    kanjiNumber: '第七葉',
    title: '心のうつわ（健体のしおり）',
    subtitle: '身は心の象徴、いのちの声に耳を澄ます',
    deityQuote:
      '「この身体は、お前の心のかたちを映す尊いお社（やしろ）じゃ。無理や乱れがあれば身体が赤信号で教えてくれる。心を整え、いのちの器を慈しむのじゃぞ。」',
    practicalWisdom: '心身の小さなサインを見逃さず、穏やかな心と規則正しい暮らしで生命力を養う。',
    colorAccent: 'from-green-600 to-emerald-700',
  },
  {
    id: 'BOOKMARK-08',
    number: 8,
    kanjiNumber: '第八葉',
    title: '太陽と大地（明朗愛和のしおり）',
    subtitle: 'ほがらかな心は父、なごやかな愛は母',
    deityQuote:
      '「ほがらかで明るい心は健やかさの父であり、なごやかな愛は幸福の母じゃ。お前が太陽のように明るく微笑むところに、八百万の福が集まってくるぞ。」',
    practicalWisdom: 'どんな場面でもまず「ほがらかな笑顔」と「なごやかな言葉」を心がける。',
    colorAccent: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'BOOKMARK-09',
    number: 9,
    kanjiNumber: '第九葉',
    title: '信義のむすび（誠実のしおり）',
    subtitle: '小さな約束ひとつが、天地との結びとなる',
    deityQuote:
      '「時刻ひとつ、小さな約束ひとつを守ることは、お互いの幸いを守ることじゃ。約束を違えれば己の福も逃げてしまう。誠実さこそが最強の護符なのだよ。」',
    practicalWisdom: '時間や小さな約束を徹底して守り、周囲との揺るぎない信頼を築く。',
    colorAccent: 'from-cyan-600 to-blue-700',
  },
  {
    id: 'BOOKMARK-10',
    number: 10,
    kanjiNumber: '第拾葉',
    title: '働くよろこび（天職のしおり）',
    subtitle: '世のため人のために動くことが最上の歓喜',
    deityQuote:
      '「ただ見返りのためだけでなく、誰かの役に立つこと自体を面白がり、喜んで手を動かしてみよ。働きが『最上の喜び』に変わった時、お前の才は無限に花開くぞ。」',
    practicalWisdom: '目の前の仕事や家事に心を込め、働くことそのものの喜びを味わう。',
    colorAccent: 'from-orange-500 to-red-600',
  },
  {
    id: 'BOOKMARK-11',
    number: 11,
    kanjiNumber: '第拾壱葉',
    title: '万物のいのち（活物のしおり）',
    subtitle: '物はそれを生かす人のもとへ集まる',
    deityQuote:
      '「道具も衣食も金銭も、すべてには命が宿っておる。粗末にせず、その働きを存分に生かし切る人のもとへ、万物は喜んで集まってくるものなのじゃ。」',
    practicalWisdom: '身近な道具や資源・お金に感謝し、整理整頓して最後まで大切に活かし切る。',
    colorAccent: 'from-amber-600 to-yellow-700',
  },
  {
    id: 'BOOKMARK-12',
    number: 12,
    kanjiNumber: '第拾弐葉',
    title: '手放すゆとり（布施のしおり）',
    subtitle: '真に得る道は、まず手放すことにある',
    deityQuote:
      '「失うことを恐れて握りしめてばかりでは、新しい幸いは入ってこられぬ。執着をさらりと捨て、まず先に与える人にこそ、天地は大きな実りを返すのじゃ。」',
    practicalWisdom: '見返りを求めず先に与え、こだわりや我欲を手放して心に豊かな余白を作る。',
    colorAccent: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'BOOKMARK-13',
    number: 13,
    kanjiNumber: '第拾参葉',
    title: '根と枝葉（報恩のしおり）',
    subtitle: '本（もと）を忘れず、末（すえ）を乱さず',
    deityQuote:
      '「どれほど枝葉が栄えようとも、根っこへの感謝を忘れた樹は立ち枯れてしまう。ご先祖や恩人という『本』を敬い、日々の細やかな後始末という『末』を整えるのじゃ。」',
    practicalWisdom: 'ルーツや恩人への感謝を忘れず、靴揃えや後片付けなど日常の締めくくりを丁寧に行う。',
    colorAccent: 'from-stone-600 to-amber-800',
  },
  {
    id: 'BOOKMARK-14',
    number: 14,
    kanjiNumber: '第拾四葉',
    title: '胸中の太陽（希望のしおり）',
    subtitle: '希望はつねに心の太陽である',
    deityQuote:
      '「たとえ外が嵐の夜であっても、お前の胸の中にある『希望』という太陽だけは決して曇らせてはならぬ。心に太陽を掲げ続ける限り、道は必ず照らし出される。」',
    practicalWisdom: 'どんな状況でも「きっと良くなる」と心に明るい目標を掲げ続ける。',
    colorAccent: 'from-red-500 to-amber-500',
  },
  {
    id: 'BOOKMARK-15',
    number: 15,
    kanjiNumber: '第拾五葉',
    title: '信ずる力（信念のしおり）',
    subtitle: '信ずれば成り、憂えれば崩れる',
    deityQuote:
      '「『必ず成る』と信じる一念は物事を結び、取り越し苦労や疑いは足元から力を奪ってしまう。天地の計らいと己の力を信じて、迷わず突き進むのじゃ。」',
    practicalWisdom: 'まだ起きてもいない不安を手放し、信じた道を最後までやり抜く。',
    colorAccent: 'from-blue-600 to-indigo-800',
  },
  {
    id: 'BOOKMARK-16',
    number: 16,
    kanjiNumber: '第拾六葉',
    title: '自他への敬い（仁愛のしおり）',
    subtitle: '己を尊び、その敬いを人へと及ぼす',
    deityQuote:
      '「まず自分というかけがえのない命を大切に尊ぶこと。そしてその同じ敬いを、周りのすべての人へと広げていくのじゃ。礼節と慈しみが世を美しく結ぶぞ。」',
    practicalWisdom: '自分自身を卑下せず大切にし、周囲の人にも同じように礼節と敬意を持って接する。',
    colorAccent: 'from-teal-600 to-cyan-700',
  },
  {
    id: 'BOOKMARK-17',
    number: 17,
    kanjiNumber: '第拾七葉',
    title: '神の舞台の主役（大調和のしおり）',
    subtitle: '人生は天地と創る大いなる舞台、主役は己自身',
    deityQuote:
      '「この人生という壮大な舞台は、神々と人とが共に織りなす神聖な演劇じゃ。そして、その舞台の主役は他の誰でもない、今ここに立つお前自身なのだよ。」',
    practicalWisdom: '自分の人生の主役としての誇りを持ち、今日という舞台を力の限り輝かせる。',
    colorAccent: 'from-amber-400 via-red-600 to-purple-800',
  },
];

// ==========================================
// 4. 富士山頂ゾーンクリア 10項目アニメーション定義（要件10・11）
// ==========================================
export interface FujiAnimationStep {
  stepNumber: number;
  phaseTitle: string;
  caption: string;
  visualType:
    | 'stamp_resonance'
    | 'deity_awaken'
    | 'fuji_ascent'
    | 'sunrise_break'
    | 'archipelago_light'
    | 'law_of_gods_and_humans'
    | 'one_true_path'
    | 'ethos_whisper'
    | 'light_convergence'
    | 'bookmark_acquired';
}

export const FUJI_10_ANIMATION_STEPS: FujiAnimationStep[] = [
  {
    stepNumber: 1,
    phaseTitle: '壱之儀：霊域満願・御朱印共鳴',
    caption: '達成したゾーンの全御朱印が黄金の円陣を描き、集められた神力がひとつに共鳴し始めます。',
    visualType: 'stamp_resonance',
  },
  {
    stepNumber: 2,
    phaseTitle: '弐之儀：本宮御祭神・神威覚醒',
    caption: 'あなたの献上によって力を取り戻したホーム神社の御祭神が、まばゆい瑞光とともに覚醒します。',
    visualType: 'deity_awaken',
  },
  {
    stepNumber: 3,
    phaseTitle: '参之儀：霊峰不二への天昇',
    caption: '力を取り戻した御祭神が光の衣をまとい、日本の中心・富士山の頂上へと舞い上がります。',
    visualType: 'fuji_ascent',
  },
  {
    stepNumber: 4,
    phaseTitle: '四之儀：富士頂上・金剛日輪の開闢',
    caption: '富士山頂の雲海が大きく割れ、天照す黄金のご来光が八紘を照らし出します。',
    visualType: 'sunrise_break',
  },
  {
    stepNumber: 5,
    phaseTitle: '五之儀：日本列島・達成霊域の慈光包摂',
    caption: '富士山頂から放たれたやさしい光が、日本列島の達成ゾーンの大地と人々をあたたかく包み込みます。',
    visualType: 'archipelago_light',
  },
  {
    stepNumber: 6,
    phaseTitle: '六之儀：天地の理（すじみち）の啓示',
    caption: '「神には神の法則（すじみち）があるように、人には人の法則（すじみち）があるようだな…」',
    visualType: 'law_of_gods_and_humans',
  },
  {
    stepNumber: 7,
    phaseTitle: '七之儀：人として進む「ひとつの道」',
    caption: '富士の頂から大地へと真っ直ぐに伸びる一筋の光の道――古より変わらぬ人の歩むべき道が示されます。',
    visualType: 'one_true_path',
  },
  {
    stepNumber: 8,
    phaseTitle: '八之儀：御祭神からの言霊の伝授',
    caption: '御祭神があなたを見つめ、日々の暮らしを幸いへと変える「ひとつの道」の秘訣を語りかけます。',
    visualType: 'ethos_whisper',
  },
  {
    stepNumber: 9,
    phaseTitle: '九之儀：瑞光凝縮・言霊の結晶化',
    caption: '達成したゾーンを包んでいたやさしい光が富士の頂へと集まり、1枚の神聖な「栞」へと姿を変えます。',
    visualType: 'light_convergence',
  },
  {
    stepNumber: 10,
    phaseTitle: '拾之儀：神宝『導きの栞』授与完了',
    caption: '達成の証として、心に太陽を灯す『古の導きの栞』があなたの参拝帳に授与されました！',
    visualType: 'bookmark_acquired',
  },
];

// ==========================================
// 5. 神力保持量による特典画像（御神影アートカード 全8種・要件4）
// ==========================================
export interface ShinryokuRewardArt {
  id: string;
  requiredShinryoku: number;
  title: string;
  subtitle: string;
  themeColor: string;
  motif: 'lantern_sunrise' | 'guardian_talisman' | 'golden_clouds' | 'four_guardians' | 'twin_dragons' | 'three_sacred_mountains' | 'red_fuji' | 'supreme_one_path';
  description: string;
  blessingText: string;
}

export const SHINRYOKU_REWARDS: ShinryokuRewardArt[] = [
  {
    id: 'REWARD-01',
    requiredShinryoku: 100,
    title: '特典壱：『初穂の灯明・朝日の御神影』',
    subtitle: '神力 100 達成特典｜船橋灯明台と瑞穂の夜明け',
    themeColor: '#b45309',
    motif: 'lantern_sunrise',
    description: '最初の御朱印と神力を本宮へ献上した証。旅路の安全を照らす常夜灯と朝日のデジタル護符。',
    blessingText: '道中安全・初願成就',
  },
  {
    id: 'REWARD-02',
    requiredShinryoku: 500,
    title: '特典弐：『本宮御祭神・覚醒守護符』',
    subtitle: '神力 500 達成特典｜力を取り戻し始めたデフォルメ御祭神の特別護符',
    themeColor: '#991b1b',
    motif: 'guardian_talisman',
    description: '5社以上の参拝を経て御祭神が「芽吹きの御魂」へ覚醒した記念の特製守護カード。',
    blessingText: '開運招福・心身堅固',
  },
  {
    id: 'REWARD-03',
    requiredShinryoku: 1500,
    title: '特典参：『黄金瑞雲・錦織御朱印帳絵巻』',
    subtitle: '神力 1,500 達成特典｜金運と良縁を招く瑞雲吉祥図',
    themeColor: '#ca8a04',
    motif: 'golden_clouds',
    description: '15社相当の神力が結実し、黄金の瑞雲と鳳凰の羽根が描かれた豪華御神影アート。',
    blessingText: '金運隆昌・良縁成就',
  },
  {
    id: 'REWARD-04',
    requiredShinryoku: 3000,
    title: '特典四：『四神相応・八百万鎮護曼荼羅』',
    subtitle: '神力 3,000 達成特典｜東西南北を守護する青龍・白虎・朱雀・玄武の結界図',
    themeColor: '#1e40af',
    motif: 'four_guardians',
    description: '30社相当の巡礼を達成した巡礼者に授けられる、四方除け・八方除けの守護曼荼羅。',
    blessingText: '八方除け・厄難消除',
  },
  {
    id: 'REWARD-05',
    requiredShinryoku: 6000,
    title: '特典五：『天孫降臨・伊勢と高千穂の双龍図』',
    subtitle: '神力 6,000 達成特典｜天と地を結ぶ金銀双龍の昇天画',
    themeColor: '#4338ca',
    motif: 'twin_dragons',
    description: '60社相当の神力を本宮へ奉納した証。大いなる飛躍と勝負運をもたらす双龍図。',
    blessingText: '大願成就・飛躍昇進',
  },
  {
    id: 'REWARD-06',
    requiredShinryoku: 10000,
    title: '特典六：『出雲・熊野・出羽 三大聖地結界図』',
    subtitle: '神力 10,000 達成特典｜過去・現在・未来を浄化する三光の御神影',
    themeColor: '#0f766e',
    motif: 'three_sacred_mountains',
    description: '100社相当の巡拝を達成した大巡礼者の証。八咫烏・大国主・三山が輝く神秘の護符。',
    blessingText: '過去浄化・未来開拓',
  },
  {
    id: 'REWARD-07',
    requiredShinryoku: 15000,
    title: '特典七：『不二霊峰・金剛赤富士開運画』',
    subtitle: '神力 15,000 達成特典｜朝日に染まる赤富士と金剛日輪の吉祥画',
    themeColor: '#be123c',
    motif: 'red_fuji',
    description: '150社相当の神力が満ち、御祭神が富士山頂へと昇る直前の壮麗な赤富士記念画。',
    blessingText: '家運隆盛・商売繁盛',
  },
  {
    id: 'REWARD-08',
    requiredShinryoku: 19000,
    title: '特典八：『天照大調和・富士頂上「ひとつの道」大光明図』',
    subtitle: '神力 19,000 達成（全国制覇級）｜日本列島を優しい光で包む究極の御神影',
    themeColor: '#7c2d12',
    motif: 'supreme_one_path',
    description: '全国47都道府県の神力を結集し、完全覚醒した御祭神が富士山頂から日本を優しい光で包む最高位の奉納画。',
    blessingText: '万象調和・万人幸福',
  },
];

// ==========================================
// 6. ホームスポット特有のデフォルメ御祭神キャラ生成（要件6・8・9）
// ※御祭神が他社と被る場合は、配祀神・神使（しんし）・地域固有の由緒モチーフを組み合わせて
//   191社寺すべてで固有の二つ名・キャラ造形・口調になる設計
// ==========================================
export type DeityVisualStyle =
  | 'sun_lantern' // 船橋大神宮ほか（日輪＋常夜灯）
  | 'amaterasu_mirror' // 伊勢ほか（八咫鏡＋瑞穂）
  | 'inari_fox' // 稲荷系（白狐耳＋宝珠・千本鳥居）
  | 'warrior_sword' // 鹿島・香取・八幡・東照宮（武神・宝剣・兜）
  | 'enmusubi_rabbit' // 出雲・大国主・白兎（大黒袋＋白うさぎ・縁結び紐）
  | 'dragon_water' // 龍神・弁財天・海神・厳島（金龍・水珠・琵琶）
  | 'tenjin_plum' // 天満宮・学問（梅花冠＋巻物・撫で牛）
  | 'mountain_tengu' // 山岳・修験・熊野・古峯・出羽（山伏頭巾・八咫烏・狼）
  | 'buddha_lotus'; // 寺院・観音・不動・大仏（蓮華光背＋錫杖・宝珠）

export interface DeformedDeityCharacter {
  spotId: string;
  spotName: string;
  charaName: string; // デフォルメキャラ名
  title: string; // 二つ名
  originDeity: string; // 元となった御祭神または次点関連候補（配祀神・神使・ゆかりの英傑）
  visualStyle: DeityVisualStyle;
  primaryColor: string;
  secondaryColor: string;
  companionItem: string; // 手に持つ固有アイテム
  catchphrase: string; // 挨拶セリフ
  awakeningQuotes: [string, string, string, string, string]; // Lv1〜Lv5のセリフ
}

export function getDeityCharacterForSpot(spot: ShrineSpot | null | undefined): DeformedDeityCharacter {
  // デフォルトは船橋大神宮（意富比神社）
  if (!spot || spot.id === 'funabashi') {
    return {
      spotId: 'funabashi',
      spotName: '船橋大神宮（意富比神社）',
      charaName: '灯明のアマテラスちゃん（意富比ノミコト）',
      title: '房総千年の常夜灯と太陽の守護神',
      originDeity: '天照皇大御神 ＆ 船橋灯明台の守護精霊（配祀：日本武尊・常磐公）',
      visualStyle: 'sun_lantern',
      primaryColor: '#dc2626',
      secondaryColor: '#f59e0b',
      companionItem: '木造洋式灯台「灯明台」の黄金ランタン',
      catchphrase: '「船橋の灯明台から、あなたの旅路と日本の未来をぽかぽか照らすよ！」',
      awakeningQuotes: [
        'Lv.1 微睡み：「ふぁぁ…まだ力が小さくて灯明台の明かりも心もとないけれど、あなたと一緒に全国の神縁を集めたいな！」',
        'Lv.2 芽吹き：「ありがとう！集めてくれた御朱印の神力で、灯明台のランタンが温かく灯り始めたよ！」',
        'Lv.3 顕現：「すごい神力だね！房総の海から全国へと、私の光が届くようになってきたのを感じるよ！」',
        'Lv.4 瑞光：「身体中に黄金の神力が満ちていくよ！もうすぐ富士の頂から、日本中を優しい光で包めそう！」',
        'Lv.5 完全覚醒：「満願達成ありがとう！神には神のすじみちがあるように、人には人のすじみちがある…共に最高の人生を歩もう！」',
      ],
    };
  }

  const name = spot.name;
  const deityStr = spot.deity || (spot.enshrinedDeities || []).join('・') || '八百万の大神';
  const pref = spot.prefecture.replace(/[都府県]$/, '');

  // スポット固有の次点候補（被り回避ロジック）
  let charaName = `${pref}のミコト丸`;
  let originDeity = deityStr;
  let visualStyle: DeityVisualStyle = 'amaterasu_mirror';
  let primaryColor = '#b91c1c';
  let secondaryColor = '#d97706';
  let companionItem = `${name}の黄金御朱印珠`;

  if (name.includes('稲荷') || deityStr.includes('宇迦之御魂') || deityStr.includes('保食') || deityStr.includes('倉稲魂')) {
    visualStyle = 'inari_fox';
    primaryColor = '#ea580c';
    secondaryColor = '#facc15';
    charaName = `${name.replace(/(神社|大社|寺).*$/, '')}の白狐ウカちゃん`;
    originDeity = `${deityStr}（神使：${pref}の黄金白狐）`;
    companionItem = '稲穂と如意宝珠の鍵';
  } else if (name.includes('天満宮') || name.includes('天神') || deityStr.includes('菅原道真')) {
    visualStyle = 'tenjin_plum';
    primaryColor = '#7e22ce';
    secondaryColor = '#f43f5e';
    charaName = `${pref}の天神ミチザネくん`;
    originDeity = `菅原道真公（神使：${name.slice(0, 3)}の撫で牛＆飛梅の精）`;
    companionItem = '紅白の飛梅枝と智慧の巻物';
  } else if (
    spot.type === '寺院' ||
    /(寺|観音|大師|院|不動|大仏)/.test(name)
  ) {
    visualStyle = 'buddha_lotus';
    primaryColor = '#4338ca';
    secondaryColor = '#f59e0b';
    charaName = `${name.replace(/(寺|院).*$/, '')}の蓮華童子`;
    originDeity = `${deityStr}（護法善神・蓮華の精霊）`;
    companionItem = '黄金の蓮華と厄除け錫杖';
  } else if (
    deityStr.includes('建御雷') ||
    deityStr.includes('経津主') ||
    deityStr.includes('応神天皇') ||
    deityStr.includes('誉田別') ||
    deityStr.includes('日本武尊') ||
    deityStr.includes('徳川家康') ||
    deityStr.includes('武田信玄') ||
    deityStr.includes('上杉謙信') ||
    deityStr.includes('加藤清正') ||
    name.includes('八幡') ||
    name.includes('東照宮')
  ) {
    visualStyle = 'warrior_sword';
    primaryColor = '#1e3a8a';
    secondaryColor = '#eab308';
    const subHero = deityStr.split(/[・、]/)[0];
    charaName = `${pref}鎮護・ちび${subHero.slice(0, 4)}丸`;
    originDeity = `${deityStr}（${name}固有の勝運御魂）`;
    companionItem = '破邪の霊剣と勝運の白鳩';
  } else if (
    deityStr.includes('大国主') ||
    deityStr.includes('大己貴') ||
    deityStr.includes('事代主') ||
    deityStr.includes('少彦名') ||
    name.includes('出雲') ||
    name.includes('美保') ||
    name.includes('白兎')
  ) {
    visualStyle = 'enmusubi_rabbit';
    primaryColor = '#be185d';
    secondaryColor = '#f59e0b';
    charaName = `${name.replace(/(大社|神社).*$/, '')}の縁結びオオクニちゃん`;
    originDeity = `${deityStr}（神使：因幡の白兎＆紅白の結び紐）`;
    companionItem = '打出の小槌と紅白の縁結び鈴';
  } else if (
    deityStr.includes('龍') ||
    deityStr.includes('市杵島') ||
    deityStr.includes('宗像') ||
    deityStr.includes('綿津見') ||
    deityStr.includes('住吉') ||
    deityStr.includes('水') ||
    name.includes('厳島') ||
    name.includes('江島') ||
    name.includes('貴船') ||
    name.includes('竹生島')
  ) {
    visualStyle = 'dragon_water';
    primaryColor = '#0284c7';
    secondaryColor = '#38bdf8';
    charaName = `${name.replace(/(大社|神社|神宮).*$/, '')}の瑞龍ミズハちゃん`;
    originDeity = `${deityStr}（守護神使：${pref}の金龍・白蛇）`;
    companionItem = '潮満珠と清流の琵琶';
  } else if (
    name.includes('熊野') ||
    name.includes('三峯') ||
    name.includes('戸隠') ||
    name.includes('古峯') ||
    name.includes('出羽') ||
    name.includes('白山') ||
    name.includes('石鎚') ||
    name.includes('御嶽') ||
    name.includes('榛名') ||
    name.includes('筑波')
  ) {
    visualStyle = 'mountain_tengu';
    primaryColor = '#065f46';
    secondaryColor = '#f59e0b';
    charaName = `${name.replace(/(大社|神社|三山).*$/, '')}の霊峰モリヒコ`;
    originDeity = `${deityStr}（神使：導きの八咫烏＆霊山の白狼）`;
    companionItem = '八咫烏の羽扇と金剛杖';
  } else {
    visualStyle = 'amaterasu_mirror';
    primaryColor = '#991b1b';
    secondaryColor = '#fbbf24';
    const firstDeity = deityStr.split(/[・、]/)[0].replace(/(命|尊|大神|神)$/, '');
    charaName = `${name.replace(/(神宮|大社|神社).*$/, '')}の${firstDeity.slice(0, 4)}ミコト`;
    originDeity = `${deityStr}（${pref}・${name}の本宮守護魂）`;
    companionItem = '八咫の瑞鏡と黄金の榊';
  }

  return {
    spotId: spot.id,
    spotName: spot.name,
    charaName,
    title: `${spot.prefecture}・${spot.name}の専属守護キャラ`,
    originDeity,
    visualStyle,
    primaryColor,
    secondaryColor,
    companionItem,
    catchphrase: `「ここは${spot.name}！あなたが全国から持ち帰る神力で、私の本来の神威を取り戻してね！」`,
    awakeningQuotes: [
      `Lv.1 微睡み：「${spot.name}をホームに選んでくれてありがとう！まだ小さな姿だけど、あなたの旅を全力で守るよ！」`,
      `Lv.2 芽吹き：「わぁ、温かい神力…！${companionItem}が少しずつ光を取り戻してきたよ！」`,
      `Lv.3 顕現：「${spot.prefecture}から全国へと神縁が広がっているね！私の力もどんどん湧いてくるよ！」`,
      `Lv.4 瑞光：「素晴らしい神力だよ！もうすぐ霊峰・富士の頂から日本中を優しい光で照らせそう！」`,
      `Lv.5 完全覚醒：「ありがとう！神には神の法則（すじみち）があるように、人には人の法則（すじみち）がある…共にひとつの道を歩もう！」`,
    ],
  };
}

export function getAwakeningStage(offeredShinryoku: number): {
  level: 1 | 2 | 3 | 4 | 5;
  stageName: string;
  nextThreshold: number;
  progressPercent: number;
} {
  if (offeredShinryoku >= 10000) {
    return { level: 5, stageName: '第5形態：富士開闢・幸魂（完全覚醒）', nextThreshold: 19100, progressPercent: 100 };
  }
  if (offeredShinryoku >= 4000) {
    return {
      level: 4,
      stageName: '第4形態：瑞光の和魂（大覚醒）',
      nextThreshold: 10000,
      progressPercent: Math.round(((offeredShinryoku - 4000) / 6000) * 100),
    };
  }
  if (offeredShinryoku >= 1500) {
    return {
      level: 3,
      stageName: '第3形態：顕現の荒魂（中覚醒）',
      nextThreshold: 4000,
      progressPercent: Math.round(((offeredShinryoku - 1500) / 2500) * 100),
    };
  }
  if (offeredShinryoku >= 300) {
    return {
      level: 2,
      stageName: '第2形態：芽吹きの御魂（小覚醒）',
      nextThreshold: 1500,
      progressPercent: Math.round(((offeredShinryoku - 300) / 1200) * 100),
    };
  }
  return {
    level: 1,
    stageName: '第1形態：微睡みのちいさな御霊',
    nextThreshold: 300,
    progressPercent: Math.round((offeredShinryoku / 300) * 100),
  };
}

export function getZoneForPrefecture(prefecture: string): JapanZone | undefined {
  const clean = (prefecture || '').trim();
  return JAPAN_17_ZONES.find((z) =>
    z.prefectures.some((p) => p === clean || p.replace(/[都府県]$/, '') === clean.replace(/[都府県]$/, ''))
  );
}

export function pickRandomBookmark(alreadyUnlockedIds: string[]): SacredBookmark {
  const remaining = SACRED_BOOKMARKS_17.filter((b) => !alreadyUnlockedIds.includes(b.id));
  const pool = remaining.length > 0 ? remaining : SACRED_BOOKMARKS_17;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

