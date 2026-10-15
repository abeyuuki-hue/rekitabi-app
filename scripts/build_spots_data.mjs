import fs from 'node:fs';
import path from 'node:path';

const rawV2 = JSON.parse(fs.readFileSync(path.resolve('power_spots_japan-v2.json'), 'utf-8'));

// Exact GPS coordinates, stamp names, gourmet, sanpaiTime, etiquette, and official URLs for all 49 spots in power_spots_japan-v2.json
const ENRICHMENT = {
  // 北海道・東北
  'HT-001': {
    lat: 43.0545, lng: 141.3077,
    stampName: '蝦夷国新一の宮\n(北海道神宮印)',
    gourmet: '名物：境内の六花亭「判官さま（焼きたて蕎麦餅）」＆神宮茶屋の福レ餅',
    sanpaiTime: '開門 6:00〜17:00（季節により変動）',
    etiquetteNotes: '第二鳥居は「縁切りの鳥居」とも呼ばれるため、良縁祈願の方は第三鳥居（公園口鳥居）からの参拝が吉とされています。',
    officialUrl: 'http://www.hokkaidojingu.or.jp/'
  },
  'HT-002': {
    lat: 41.3204, lng: 141.0879,
    stampName: '日本三大霊場\n(恐山延命地蔵印)',
    gourmet: '名物：蓮華庵の恐山そば・下北名物みそ貝焼き',
    sanpaiTime: '開山期間 5月1日〜10月31日（6:00〜18:00）',
    etiquetteNotes: '境内の霊泉（冷抜の湯・古滝の湯など）で心身を清めてからお参りすることもできます。石積みの崩落にご注意ください。',
    officialUrl: 'https://osorezan.or.jp/'
  },
  'HT-003': {
    lat: 40.6231, lng: 140.3350,
    stampName: '津軽国一宮\n(岩木山大権現印)',
    gourmet: '名物：門前の嶽きみ（とうもろこし）天ぷら＆津軽アップルパイ',
    sanpaiTime: '境内参拝自由（授与所 8:30〜17:00）',
    etiquetteNotes: '楼門脇の狛犬は上向き（金運）と下向き（恋愛運）で異なるご利益があると伝わります。',
    officialUrl: 'http://iwakiyamajinja.or.jp/'
  },
  'HT-004': {
    lat: 38.3189, lng: 141.0125,
    stampName: '陸奥国一宮\n(鹽竈大神印)',
    gourmet: '名物：門前の志波彦神社門前菓子「志ほがま」＆塩釜港の極上寿司',
    sanpaiTime: '開門 5:00〜20:00（季節により変動）',
    etiquetteNotes: '202段の表参道（男坂）を登り、別宮→左宮・右宮の順にお参りするのが正式な参拝順序です。',
    officialUrl: 'http://www.shiogamajinja.jp/'
  },
  'HT-005': {
    lat: 38.7044, lng: 140.0156,
    stampName: '三神合祭殿\n(出羽三山印)',
    gourmet: '名物：斎館の精進料理（ごま豆腐・山菜料理）＆二の坂茶屋の力餅',
    sanpaiTime: '開門 8:30〜17:00',
    etiquetteNotes: '国宝五重塔と樹齢数百年の杉並木（2,446段の石段）を歩き、過去・現在・未来の三神を同時に拝する三神合祭殿へ参ります。',
    officialUrl: 'http://www.dewasanzan.jp/'
  },
  'HT-006': {
    lat: 37.4939, lng: 141.0014,
    stampName: '相馬総鎮守\n(初發神社印)',
    gourmet: '名物：浪江焼そば＆請戸港の新鮮しらす丼',
    sanpaiTime: '境内参拝自由（授与所 9:00〜16:00）',
    etiquetteNotes: '相馬野馬追ゆかりの古社。震災復興の象徴として再建された社殿にて静かに二礼二拍手一礼でお参りください。',
    officialUrl: 'https://www.fukushima-jinjacho.or.jp/'
  },

  // 関東
  'KT-001': {
    lat: 35.6764, lng: 139.6993,
    stampName: '鎮守の杜\n(明治神宮印)',
    gourmet: '名物：フォレストテラスの和甘味・清正井ゆかりの銘菓',
    sanpaiTime: '日の出〜日の入り（季節により変動）',
    etiquetteNotes: '日本一の大鳥居（木造明神鳥居）をくぐる前に一礼し、参道の中央（正中）を避けて歩きましょう。',
    officialUrl: 'https://www.meijijingu.or.jp/'
  },
  'KT-002': {
    lat: 35.7001, lng: 139.7469,
    stampName: '東京のお伊勢さま\n(東京大神宮印)',
    gourmet: '名物：神楽坂の和カフェ抹茶スイーツ＆門前甘酒',
    sanpaiTime: '開門 6:00〜21:00（授与所 8:00〜19:00）',
    etiquetteNotes: '神前結婚式創始の社。境内のハート型の猪目（いのめ）金具を探しながら穏やかな心でお参りください。',
    officialUrl: 'https://www.tokyodaijingu.or.jp/'
  },
  'KT-003': {
    lat: 35.7020, lng: 139.7679,
    stampName: '江戸総鎮守\n(神田明神印)',
    gourmet: '名物：明神甘酒（天野屋）＆EDOCCOカフェの勝守パフェ',
    sanpaiTime: '境内 24時間参拝可能（授与所 9:00〜18:00）',
    etiquetteNotes: '随神門をくぐる前に一礼。本殿参拝後は裏手の末社やだいこく様尊像・えびす様尊像へもお参りください。',
    officialUrl: 'https://www.kandamyoujin.or.jp/'
  },
  'KT-004': {
    lat: 35.6056, lng: 139.7219,
    stampName: '白蛇辨財天\n(蛇窪神社印)',
    gourmet: '名物：戸越銀座商店街の食べ歩きコロッケ＆白蛇開運だんご',
    sanpaiTime: '開門 9:00〜17:00',
    etiquetteNotes: '「撫で白蛇」を撫でて再生・気力の充実を祈り、白蛇辨財天社で銭回し・銭洗いを行って金運を授かります。',
    officialUrl: 'https://hebikubo.jp/'
  },
  'KT-005': {
    lat: 35.6845, lng: 139.7803,
    stampName: '強運厄除\n(小網神社印)',
    gourmet: '名物：日本橋人形町の人形焼・老舗の玉ひで親子丼',
    sanpaiTime: '境内参拝自由（授与所 9:00〜17:00）',
    etiquetteNotes: '「東京銭洗い弁天」の井戸で金銭を清め、清めたお金は使わずに「種銭」としてお財布に大切に収めましょう。',
    officialUrl: 'https://www.koamijinja.or.jp/'
  },
  'KT-006': {
    lat: 35.3258, lng: 139.5564,
    stampName: '鎌倉総鎮守\n(鶴岡八幡宮印)',
    gourmet: '名物：小町通りの鳩サブレー・鎌倉しらす丼＆抹茶わらび餅',
    sanpaiTime: '開門 6:00〜21:00',
    etiquetteNotes: '源頼朝公ゆかりの段葛（だんかずら）を通り、大石段を登って本宮（上宮）へ参拝した後は源平池の旗上弁財天社へ。',
    officialUrl: 'https://www.hachimangu.or.jp/'
  },
  'KT-007': {
    lat: 35.2047, lng: 139.0253,
    stampName: '関東総鎮守\n(箱根・九頭龍印)',
    gourmet: '名物：芦ノ湖畔の権現からめもち（5色餅）＆箱根蕎麦',
    sanpaiTime: '境内参拝自由（授与所 8:15〜17:00）',
    etiquetteNotes: '箱根神社本殿のすぐ隣にある「九頭龍神社 新宮」の龍神水で口と手を清め、芦ノ湖の平和の鳥居へも足を運びましょう。',
    officialUrl: 'https://hakonejinja.or.jp/'
  },
  'KT-008': {
    lat: 35.9250, lng: 138.9289,
    stampName: '秩父三社\n(三峯神社印)',
    gourmet: '名物：大島屋のくるみ汁ざる蕎麦・秩父名物わらじカツ丼＆みそポテト',
    sanpaiTime: '開門 8:00〜18:00（授与所 9:00〜17:00）',
    etiquetteNotes: '全国的にも珍しい「三ツ鳥居」は、中央をくぐる前に左右の柱を八の字にくぐる作法が伝わります。御眷属（オオカミ）の狛犬に一礼を。',
    officialUrl: 'https://www.mitsuminejinja.or.jp/'
  },
  'KT-009': {
    lat: 35.8861, lng: 140.5289,
    stampName: '下総国一宮\n(香取神宮印)',
    gourmet: '名物：門前の厄落しだんご・わらび餅＆佐原の川魚うなぎ料理',
    sanpaiTime: '開門 5:00〜18:00（授与所 8:30〜17:00）',
    etiquetteNotes: '黒漆塗りの荘厳な本殿を参拝した後、地震を抑えると伝わる「要石（かなめいし・凸型）」と奥宮にも必ずお参りしましょう。',
    officialUrl: 'https://katori-jingu.or.jp/'
  },
  'KT-010': {
    lat: 35.9681, lng: 140.6315,
    stampName: '常陸国一宮\n(鹿島神宮印)',
    gourmet: '名物：御手洗池茶屋の焼き立てみたらし団子＆一休の湧水蕎麦',
    sanpaiTime: '境内 24時間参拝可能（授与所 8:30〜16:30）',
    etiquetteNotes: '本殿参拝後、樹叢の奥参道を進み、武甕槌大神の荒魂を祀る「奥宮」、凹型の「要石」、神秘の湧水「御手洗池」まで巡拝するのが正式です。',
    officialUrl: 'https://kashimajingu.jp/'
  },
  'KT-011': {
    lat: 36.7581, lng: 139.5989,
    stampName: '東照大権現\n(日光東照宮印)',
    gourmet: '名物：日光湯波（ゆば）御膳・日光羊羹＆天然氷のかき氷',
    sanpaiTime: '開門 9:00〜17:00（11月〜3月は16:00まで）',
    etiquetteNotes: '石鳥居手前の「北辰の道の起点」や陽明門前のパワースポットを体感し、眠り猫をくぐって家康公の墓所「奥社宝塔」まで登拝しましょう。',
    officialUrl: 'https://www.toshogu.jp/'
  },
  'KT-012': {
    lat: 36.5503, lng: 139.1819,
    stampName: '上毛三山\n(赤城神社印)',
    gourmet: '名物：赤城山名物の山菜おっきりこみうどん＆焼きまんじゅう',
    sanpaiTime: '境内参拝自由（授与所 9:00〜17:00）',
    etiquetteNotes: '赤城大沼の琢鹿島（小鳥ヶ島）に鎮座する朱塗りの社殿。女性の願いを叶える「赤城姫」の伝説を胸にお参りください。',
    officialUrl: 'https://akagijinja.or.jp/'
  },

  // 中部・甲信越・北陸
  'CB-001': {
    lat: 35.2272, lng: 138.6100,
    stampName: '駿河国一宮\n(富士浅間大社印)',
    gourmet: '名物：お宮横丁の富士宮やきそば＆富士山湧水かき氷',
    sanpaiTime: '開門 5:00〜20:00（季節により変動）',
    etiquetteNotes: '二階建ての「浅間造」本殿を参拝した後は、富士山の雪解け水が湧き出る国指定特別天然記念物「湧玉池」の水屋神社でお水取りができます。',
    officialUrl: 'http://fuji-hongu.or.jp/sengen/'
  },
  'CB-002': {
    lat: 35.9981, lng: 138.1194,
    stampName: '信濃国一宮\n(諏訪大社四社印)',
    gourmet: '名物：諏訪湖畔の信州蕎麦・うなぎ蒲焼＆下諏訪の塩羊羹',
    sanpaiTime: '境内参拝自由（授与所 8:30〜17:00）',
    etiquetteNotes: '上社（本宮・前宮）と下社（秋宮・春宮）の「四社まいり」が理想です。各社殿の四隅に立つ巨大な「御柱（おんばしら）」にも注目。',
    officialUrl: 'https://suwataisha.or.jp/'
  },
  'CB-003': {
    lat: 36.7575, lng: 138.0753,
    stampName: '天岩戸開神\n(戸隠神社五社印)',
    gourmet: '名物：日本三大そば「戸隠そば（ぼっち盛り）」＆そばソフトクリーム',
    sanpaiTime: '境内参拝自由（授与所 9:00〜17:00）',
    etiquetteNotes: '宝光社・火之御子社・中社・九頭龍社・奥社の「五社巡り」が人気。奥社参道は約2kmの樹齢400年を超える杉並木を歩くため歩きやすい靴で。',
    officialUrl: 'https://www.togakushi-jinja.jp/'
  },
  'CB-004': {
    lat: 35.1258, lng: 136.9089,
    stampName: '三種の神器奉斎\n(熱田神宮印)',
    gourmet: '名物：境内の宮きしめん＆門前のあつた蓬莱軒ひつまぶし',
    sanpaiTime: '境内 24時間参拝可能（授与所 8:30〜17:00）',
    etiquetteNotes: '本宮参拝後、本宮裏手の「こころの小径」を進み、熱田大神の荒魂を祀る「一之御前神社」と美肌祈願の「清水社」をお参りしましょう。',
    officialUrl: 'https://www.atsutajingu.or.jp/'
  },
  'CB-005': {
    lat: 35.3600, lng: 136.5236,
    stampName: '美濃国一宮\n(南宮大社印)',
    gourmet: '名物：門前の南宮名物・鉱山最中＆大垣の水まんじゅう',
    sanpaiTime: '開門 5:00〜18:00（授与所 8:30〜16:30）',
    etiquetteNotes: '全国の金属・鉱山・財運の総本宮。本殿参拝後は百連鳥居が美しい「南宮稲荷神社」へもお参りください。',
    officialUrl: 'https://www.nangu-san.com/'
  },
  'CB-006': {
    lat: 36.6003, lng: 137.3672,
    stampName: '越中国一宮\n(立山雄山神社印)',
    gourmet: '名物：富山湾の白えび天丼・ますの寿し＆立山湧水珈琲',
    sanpaiTime: '境内参拝自由（授与所 8:30〜17:00）',
    etiquetteNotes: '立山信仰の拠点。麓の「前立社壇（岩峅寺）」、山麓の「中宮祈願殿（芦峅寺）」、標高3,003m立山山頂の「峰本社」の三社から成ります。',
    officialUrl: 'https://www.oyamajinja.org/'
  },
  'CB-007': {
    lat: 36.4353, lng: 136.6353,
    stampName: '加賀国一宮\n(白山比咩神社印)',
    gourmet: '名物：表参道のおはぎ屋・白山霊水を使った堅豆腐＆くるみそば',
    sanpaiTime: '境内参拝自由（授与所 8:30〜16:30）',
    etiquetteNotes: '全国約3,000社の白山神社の総本宮。杉・欅・楓の古木に囲まれた表参道をゆっくり登り、ご縁を「括る（くくる）」菊理媛神にお祈りします。',
    officialUrl: 'https://www.shirayama.or.jp/'
  },
  'CB-008': {
    lat: 36.9258, lng: 136.7681,
    stampName: '能登国一宮\n(氣多大社印)',
    gourmet: '名物：能登の海鮮丼・いしる焼き＆羽咋の神饌菓子',
    sanpaiTime: '開門 8:30〜16:30',
    etiquetteNotes: '本殿背後に広がる国指定天然記念物「入らずの森」から強い気が満ちています。奥宮への遥拝所も忘れずにお参りください。',
    officialUrl: 'https://www.keta.jp/'
  },

  // 関西（近畿）
  'KS-001': {
    lat: 34.9671, lng: 135.7727,
    stampName: '稲荷総本宮\n(伏見稲荷印)',
    gourmet: '名物：参道のきつねうどん・いなり寿司＆うずら・雀の焼き鳥',
    sanpaiTime: '境内 24時間参拝可能（授与所 8:30〜16:30）',
    etiquetteNotes: '本殿参拝後、朱色の「千本鳥居」をくぐり、奥社奉拝所の「おもかる石」で願い事の軽重を占うことができます。',
    officialUrl: 'https://inari.jp/'
  },
  'KS-002': {
    lat: 34.9949, lng: 135.7850,
    stampName: '音羽山大悲閣\n(清水寺本尊印)',
    gourmet: '名物：産寧坂・二年坂の生八ツ橋＆音羽の滝茶屋の湯豆腐・宇治抹茶',
    sanpaiTime: '開門 6:00〜18:00（季節・夜間特別拝観により変動）',
    etiquetteNotes: '「音羽の滝」の三筋の霊水は「学業成就・恋愛成就・延命長寿」を表し、柄杓でいずれか一筋のみを掬っていただくのが作法です。',
    officialUrl: 'https://www.kiyomizudera.or.jp/'
  },
  'KS-003': {
    lat: 35.1217, lng: 135.7628,
    stampName: '水神総本宮\n(貴船神社印)',
    gourmet: '名物：貴船川の川床料理（流しそうめん・鮎の塩焼き）＆水占パフェ',
    sanpaiTime: '開門 6:00〜20:00（12月〜4月は18:00まで）',
    etiquetteNotes: '「三社詣」として、本宮→奥宮（龍穴の上）→結社（縁結びの磐長姫命）の順番に参拝するのが古くからの習わしです。',
    officialUrl: 'https://kifunejinja.jp/'
  },
  'KS-004': {
    lat: 35.0117, lng: 135.7556,
    stampName: '金運招福\n(御金神社金印)',
    gourmet: '名物：二条城周辺の京町家カフェ金箔抹茶スイーツ＆京漬物茶漬け',
    sanpaiTime: '境内 24時間参拝可能（授与所 10:00〜16:00）',
    etiquetteNotes: '黄金色に輝く鳥居をくぐり、イチョウの葉をモチーフにした絵馬や福包み守りを通じて金属・通貨・資産繁栄のご加護を祈願します。',
    officialUrl: 'https://mikane-jinja.or.jp/'
  },
  'KS-005': {
    lat: 34.6125, lng: 135.4935,
    stampName: '摂津国一之宮\n(住吉大社印)',
    gourmet: '名物：住吉名物の初辰まいり焼餅・末廣堂のさつま焼＆洋食やろくの玉子コロッケ',
    sanpaiTime: '開門 6:00〜17:00（冬期 6:30〜17:00）',
    etiquetteNotes: '反橋（太鼓橋）を渡って心身を清め、国宝の第一本宮〜第四本宮すべてを巡拝します。「五大力」の小石探しも有名です。',
    officialUrl: 'https://www.sumiyoshitaisha.net/'
  },
  'KS-006': {
    lat: 34.6814, lng: 135.8483,
    stampName: '南都春日社\n(春日大社印)',
    gourmet: '名物：春日荷茶屋の万葉粥＆奈良名産の柿の葉寿司・葛切り',
    sanpaiTime: '開門 6:30〜17:30（冬期 7:00〜17:00）',
    etiquetteNotes: '約3,000基の石燈籠・釣燈籠が並ぶ参道を進み、本殿参拝後は夫婦大黒社や金龍神社など「若宮十五社めぐり」もおすすめです。',
    officialUrl: 'https://www.kasugataisha.or.jp/'
  },
  'KS-007': {
    lat: 34.4883, lng: 135.7867,
    stampName: '日本建国聖地\n(橿原神宮印)',
    gourmet: '名物：今井町の飛鳥鍋・大和茶スイーツ＆埴輪まんじゅう',
    sanpaiTime: '開門 6:00〜17:30（季節により変動）',
    etiquetteNotes: '畝傍山（うねびやま）の東南麓、初代・神武天皇が即位された橿原宮跡に鎮座します。広大な玉砂利の表参道を一歩ずつ踏みしめて進みましょう。',
    officialUrl: 'https://www.kashiharajingu.or.jp/'
  },
  'KS-008': {
    lat: 33.8403, lng: 135.7736,
    stampName: '甦りの聖地\n(熊野三山八咫烏印)',
    gourmet: '名物：本宮のめはり寿司・もうで餅＆那智の黒飴ソフトクリーム',
    sanpaiTime: '開門 6:00〜19:00（各社により異なる）',
    etiquetteNotes: '熊野本宮大社（大斎原の日本一の大鳥居）・熊野速玉大社・熊野那智大社（那智の滝・飛瀧神社）の三山を巡ることで過去・現在・未来が救済されると伝わります。',
    officialUrl: 'https://www.hongutaisha.jp/'
  },
  'KS-009': {
    lat: 34.4550, lng: 136.7258,
    stampName: '日本総氏神\n(伊勢神宮内宮外宮印)',
    gourmet: '名物：おかげ横丁・おはらい町の赤福餅＆伊勢うどん・松阪牛串',
    sanpaiTime: '開門 5:00〜18:00（季節により17:00・19:00まで）',
    etiquetteNotes: '古来からの習わし通り「外宮（豊受大神宮）→ 内宮（皇大神宮）」の順にお参りします。正宮では個人的なお願いではなく日々の感謝を伝え、個人的な祈願は荒祭宮・多賀宮で行います。',
    officialUrl: 'https://www.isejingu.or.jp/'
  },

  // 中国
  'CG-001': {
    lat: 35.4019, lng: 132.6856,
    stampName: '縁結び総本山\n(出雲大社印)',
    gourmet: '名物：神門通りの出雲そば（三段割子そば）＆発祥の地・出雲ぜんざい',
    sanpaiTime: '開門 6:00〜19:00',
    etiquetteNotes: '出雲大社の参拝作法は一般的な二拍手ではなく「二礼四拍手一礼」です。参拝前に稲佐の浜で砂を採取し、本殿裏の素鵞社（そがのやしろ）でお砂交換をするのが正式な習わしです。',
    officialUrl: 'https://izumooyashiro.or.jp/'
  },
  'CG-002': {
    lat: 35.3742, lng: 133.0772,
    stampName: '出雲国一之宮\n(熊野大社火発印)',
    gourmet: '名物：八雲の日本一こだわり卵かけご飯＆松江の宍道湖しじみ汁',
    sanpaiTime: '開門 8:30〜16:30',
    etiquetteNotes: '日本火出初之社（ひでぞめのやしろ）と呼ばれる出雲国一之宮。こちらも出雲大社と同じく「二礼四拍手一礼」でお参りください。',
    officialUrl: 'http://www.kumanotaisha.or.jp/'
  },
  'CG-003': {
    lat: 34.2958, lng: 132.3197,
    stampName: '安芸国一宮\n(嚴島神社印)',
    gourmet: '名物：宮島の焼きたてあなごめし・焼き牡蠣＆揚げもみじ饅頭',
    sanpaiTime: '開門 6:30〜18:00（季節・潮位により変動）',
    etiquetteNotes: '満潮時には海に浮かぶ朱塗りの社殿、干潮時には大鳥居の根元まで歩いて参拝できます。背後の神体山・弥山（みせん）霊火堂への登拝も格別です。',
    officialUrl: 'https://www.itsukushimajinja.jp/'
  },
  'CG-004': {
    lat: 34.6708, lng: 133.8506,
    stampName: '備中国一宮\n(吉備津神社印)',
    gourmet: '名物：岡山名物のきびだんご・ばら寿司＆白桃パフェ',
    sanpaiTime: '開門 5:00〜18:00（授与所 9:00〜16:00）',
    etiquetteNotes: '国宝の「比翼入母屋造（吉備津造）」本殿を参拝した後、全長360mの美しい大廻廊を歩いて御釜殿（鳴釜神事の舞台）へ参りましょう。',
    officialUrl: 'https://kibitujinja.com/'
  },

  // 四国
  'SK-001': {
    lat: 34.1839, lng: 133.8094,
    stampName: '讃岐こんぴらさん\n(金刀比羅宮印)',
    gourmet: '名物：門前の讃岐うどん（ぶっかけ・釜揚げ）＆灸まん・おいりソフト',
    sanpaiTime: '開門 6:00〜18:00（季節により変動）',
    etiquetteNotes: '御本宮まで785段、さらに奥社（厳魂神社）まで合計1,368段の石段を登拝します。参道入口で金剛杖を借りると足腰の負担が和らぎます。',
    officialUrl: 'https://www.konpira.or.jp/'
  },
  'SK-002': {
    lat: 34.2481, lng: 133.0058,
    stampName: '日本総鎮守\n(大山祇神社印)',
    gourmet: '名物：しまなみ海道・大三島の海鮮丼（大三島まかない丼）＆伯方の塩ソフト',
    sanpaiTime: '開門 7:00〜17:00',
    etiquetteNotes: '境内にそびえる樹齢2,600年の御神木「乎千命御手植の楠」の周りを息を止めて3周すると願いが叶うと伝わります。国宝の甲冑・刀剣が揃う宝物館も必見。',
    officialUrl: 'https://oomishimagu.jp/'
  },
  'SK-003': {
    lat: 33.5914, lng: 133.5769,
    stampName: '土佐国一宮\n(土佐神社印)',
    gourmet: '名物：ひろめ市場の藁焼き鰹のたたき＆土佐文旦スイーツ',
    sanpaiTime: '境内参拝自由（授与所 8:30〜17:00）',
    etiquetteNotes: '戦国武将・長宗我部元親が再建した入蜻蛉（いりとんぼ）様式の国重文社殿。本殿裏の「つぶて石」と神明宮にもお参りください。',
    officialUrl: 'https://tosajinja.com/'
  },
  'SK-004': {
    lat: 34.1856, lng: 134.5025,
    stampName: '阿波国一宮\n(大麻比古神社印)',
    gourmet: '名物：鳴門鯛の鯛めし・徳島ラーメン＆なると金時スイートポテト',
    sanpaiTime: '開門 6:00〜17:00',
    etiquetteNotes: '樹齢1,000年を超える御神木の大楠と、本殿裏の優美な「ドイツ橋・めがね橋」および心願鏡池を巡拝しましょう。',
    officialUrl: 'https://www.ooasahikojinja.jp/'
  },

  // 九州・沖縄
  'KO-001': {
    lat: 33.5214, lng: 130.5347,
    stampName: '天満宮総本宮\n(太宰府天満宮印)',
    gourmet: '名物：参道の焼きたて「梅ヶ枝餅」＆太宰府合格ラーメン',
    sanpaiTime: '開門 6:30〜19:00（季節により変動）',
    etiquetteNotes: '心字池に架かる3つの太鼓橋（過去・現在・未来）を「振り返らずに」渡り、御神牛の頭を撫でて知恵を授かってから御本殿へ参りましょう。',
    officialUrl: 'https://www.dazaifutenmangu.or.jp/'
  },
  'KO-002': {
    lat: 33.8314, lng: 130.5142,
    stampName: '道主貴総本宮\n(宗像大社印)',
    gourmet: '名物：玄界灘の宗像あなごちゃん・天然真鯛茶漬け＆鐘崎の海鮮丼',
    sanpaiTime: '開門 6:00〜17:00（授与所 9:00〜17:00）',
    etiquetteNotes: '世界文化遺産。辺津宮本殿を参拝した後は、樹齢500年の楢の巨木が立つ宗像大神降臨の地「高宮祭場（古代祭場）」へ必ず参拝しましょう。',
    officialUrl: 'https://munakata-taisha.or.jp/'
  },
  'KO-003': {
    lat: 32.9478, lng: 131.1161,
    stampName: '肥後国一宮\n(阿蘇神社印)',
    gourmet: '名物：門前町水基めぐりの阿蘇あか牛丼・馬ロッケ＆阿蘇高菜めし',
    sanpaiTime: '開門 6:00〜18:00（授与所 9:00〜17:00）',
    etiquetteNotes: '全国的にも珍しい「横参道」と日本三大楼門（震災から見事復旧）を抜け、縁結びの「高砂の松」と願掛けの石を巡りましょう。',
    officialUrl: 'https://asojinja.or.jp/'
  },
  'KO-004': {
    lat: 32.7072, lng: 131.3075,
    stampName: '天孫降臨神話郷\n(高千穂・青島印)',
    gourmet: '名物：元祖高千穂峡流しそうめん・高千穂牛ステーキ＆チキン南蛮',
    sanpaiTime: '境内参拝自由（各社授与所 8:30〜17:00）',
    etiquetteNotes: '荒立神社では「七回打てば願いが叶う」板木を心を込めて7回打ち、高千穂神社・天岩戸神社・天安河原とあわせて神話の聖地を巡拝します。',
    officialUrl: 'https://takachiho-kanko.info/'
  },
  'KO-005': {
    lat: 31.8586, lng: 130.8714,
    stampName: '天孫降臨本宮\n(霧島神宮印)',
    gourmet: '名物：黒豚しゃぶしゃぶ・霧島温泉蒸し饅頭＆薩摩蒸気屋のかすたどん',
    sanpaiTime: '境内 24時間参拝可能（授与所 8:00〜17:00）',
    etiquetteNotes: '「西の日光」とも称される朱塗りの国宝本殿。樹齢800年の御神木（霧島メアサ杉）の枝先に「烏帽子をかぶった神官の姿」が見えることでも有名です。',
    officialUrl: 'https://kirishimajingu.or.jp/'
  },
  'KO-006': {
    lat: 26.2206, lng: 127.6711,
    stampName: '琉球国一の宮\n(波上宮印)',
    gourmet: '名物：那覇の沖縄そば（ソーキそば）・海ぶどう丼＆サーターアンダギー',
    sanpaiTime: '境内参拝自由（授与所 9:00〜17:00）',
    etiquetteNotes: '那覇港を望む珊瑚礁の断崖の上に鎮座する琉球八社最上位の社。赤瓦屋根の本殿と沖縄ならではのシーサー狛犬に一礼してお参りください。',
    officialUrl: 'http://naminouegu.jp/'
  }
};

// Extra classic spots from original kanto.json / kansai.json so zero spots are lost!
const EXTRA_SPOTS = {
  kanto: [
    {
      id: 'funabashi',
      name: '船橋大神宮（意富比神社）',
      region: '関東',
      prefecture: '千葉県',
      lat: 35.6961,
      lng: 139.9936,
      stampName: '意富比神社\n(船橋印)',
      history: '1900年以上の歴史を誇る房総屈指の古社。境内の木造洋式灯台（常夜灯）は県指定有形民俗文化財。',
      gourmet: '名物：船橋宿本町通りの老舗和菓子＆船橋クラフトビール・ホンビノス貝料理',
      deity: '天照皇大御神',
      benefits: ['開運招福', '海上安全', '厄除け', '家内安全'],
      sanpaiTime: '開門 6:00〜17:00',
      enshrinedDeities: ['天照皇大御神'],
      blessings: ['所願成就', '海上安全', '家内安全', '商売繁盛'],
      etiquetteNotes: '参道正面の鳥居で一礼し、手水舎で身を清めてから本殿へ。境内奥の常磐神社・灯明台も必見です。',
      officialUrl: 'http://www.oohikoushin.jp/'
    },
    {
      id: 'naritasan',
      name: '成田山新勝寺',
      region: '関東',
      prefecture: '千葉県',
      lat: 35.7865,
      lng: 140.3182,
      stampName: '大本山本尊\n(成田不動印)',
      history: '天慶3年(940年)開山。弘法大師空海が自ら敬刻開眼した不動明王を御本尊とする真言宗智山派の大本山。',
      gourmet: '名物：成田山表参道の職人が捌く焼きたてうなぎ重＆栗羊羹',
      deity: '不動明王',
      benefits: ['厄除け開運', '交通安全', '商売繁昌', '心願成就'],
      sanpaiTime: '境内参拝自由（御護摩受付 8:00〜16:00）',
      enshrinedDeities: ['不動明王（御本尊）', '大日如来', '聖徳太子'],
      blessings: ['厄除開運', '家内安全', '交通安全', '商売繁昌'],
      etiquetteNotes: '総門・仁王門で一礼し、大本堂での御護摩祈祷に参列すると強い霊験をいただけます。出世稲荷・平和大塔も巡拝しましょう。',
      officialUrl: 'https://www.naritasan.or.jp/'
    }
  ],
  kansai: [
    {
      id: 'yasaka',
      name: '八坂神社',
      region: '関西（近畿）',
      prefecture: '京都府',
      lat: 35.0037,
      lng: 135.7785,
      stampName: '祇園総鎮守\n(八坂印)',
      history: '日本三大祭「祇園祭」で名高い全国約2,300社の祇園社の総本社。本殿下には龍穴（青龍の池）が眠ると伝わる。',
      gourmet: '名物：祇園辻利の宇治抹茶パフェ・祇園きなこわらび餅＆いづ重の鯖寿司',
      deity: '素戔嗚尊・櫛稲田姫命・八柱御子神',
      benefits: ['厄除け', '疫病退散', '良縁成就', '美容祈願'],
      sanpaiTime: '境内 24時間参拝可能（授与所 9:00〜17:00）',
      enshrinedDeities: ['素戔嗚尊', '櫛稲田姫命', '八柱御子神'],
      blessings: ['厄除け', '無病息災', '美徳向上', '良縁成就'],
      etiquetteNotes: '境内末社の美御前社（うつくしごぜんしゃ）の御神水「美容水」を2〜3滴肌に塗ると、身も心も美しく磨かれると有名です。',
      officialUrl: 'https://www.yasaka-jinja.or.jp/'
    },
    {
      id: 'kitano-tenmangu',
      name: '北野天満宮',
      region: '関西（近畿）',
      prefecture: '京都府',
      lat: 35.0315,
      lng: 135.7351,
      stampName: '天神信仰総本社\n(北野天満印)',
      history: '天暦元年(947年)創建。菅原道真公をお祀りする全国約1万2千社の天満宮・天神社の総本社。',
      gourmet: '名物：門前の長五郎餅・粟餅所澤屋の出来立て粟餅＆とようけ茶屋の湯葉丼',
      deity: '菅原道真公',
      benefits: ['学業成就', '受験合格', '芸能上達', '厄除け'],
      sanpaiTime: '開門 7:00〜17:00',
      enshrinedDeities: ['菅原道真公', '中将殿', '吉祥女'],
      blessings: ['学業成就', '受験合格', '至誠・厄除け', '技芸上達'],
      etiquetteNotes: '楼門と本殿の間にある「三光門」の彫刻（日・月・星）を見上げ、境内の「撫で牛」を撫でてから国宝の八棟造本殿へ参りましょう。',
      officialUrl: 'https://kitanotenmangu.or.jp/'
    }
  ]
};

const outDir = path.resolve('public/data/spots');
fs.mkdirSync(outDir, { recursive: true });

const allSpots = [];

for (const region of rawV2.regions) {
  const regionKey = region.region_id;
  const regionName = region.region_name;
  const regionSpots = [];

  for (const s of region.spots) {
    const info = ENRICHMENT[s.spot_id];
    if (!info) {
      throw new Error(`Missing enrichment for ${s.spot_id}`);
    }
    const deities = s.deity_or_main_object.split(/[・、]/).map((d) => d.trim()).filter(Boolean);
    const spotObj = {
      id: s.spot_id,
      name: s.name,
      type: s.type,
      region: regionName,
      regionKey,
      prefecture: s.prefecture,
      location: s.location,
      lat: info.lat,
      lng: info.lng,
      stampName: info.stampName,
      history: s.description,
      gourmet: info.gourmet,
      deity: s.deity_or_main_object,
      benefits: s.blessings,
      sanpaiTime: info.sanpaiTime,
      enshrinedDeities: deities,
      blessings: s.blessings,
      etiquetteNotes: info.etiquetteNotes,
      officialUrl: info.officialUrl
    };
    regionSpots.push(spotObj);
    allSpots.push(spotObj);
  }

  if (EXTRA_SPOTS[regionKey]) {
    for (const extra of EXTRA_SPOTS[regionKey]) {
      const enrichedExtra = { ...extra, regionKey, type: extra.name.includes('寺') ? '寺院' : '神社' };
      regionSpots.push(enrichedExtra);
      allSpots.push(enrichedExtra);
    }
  }

  fs.writeFileSync(
    path.join(outDir, `${regionKey}.json`),
    JSON.stringify(regionSpots, null, 2) + '\n',
    'utf-8'
  );
  console.log(`Wrote ${regionKey}.json (${regionSpots.length} spots)`);
}

fs.writeFileSync(
  path.join(outDir, 'all.json'),
  JSON.stringify(allSpots, null, 2) + '\n',
  'utf-8'
);
console.log(`Wrote all.json (${allSpots.length} total spots)`);

const coursesOut = path.resolve('public/data/courses.json');
fs.writeFileSync(
  coursesOut,
  JSON.stringify(rawV2.stamp_rally_courses, null, 2) + '\n',
  'utf-8'
);
console.log(`Wrote courses.json (${rawV2.stamp_rally_courses.length} courses)`);
