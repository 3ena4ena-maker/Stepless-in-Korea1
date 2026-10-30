import { Language } from './dictionary';
import { ExitInfo, Station } from '../types';

export interface StationLocalizedContent {
  name: string;
  shortName: string;
  recommendedExits: string;
  elevatorLocationDesc: string;
  avgMovementTime: string;
  transferRouteDesc: string;
  precautions: string;
}

export const STATION_SEARCH_ALIASES: Record<string, string[]> = {
  seomyeon: ['西面', '西面駅', '西面站', 'ソミョン', 'seomyeon'],
  jeonpo: ['田浦', '田浦駅', '田浦站', 'チョンポ', 'jeonpo', '田浦カフェ通り', '田浦咖啡街'],
  bujeon: ['釜田', '釜田駅', '釜田站', 'プジョン', 'bujeon', '釜田市場'],
  haeundae: ['海雲台', '海云台', '海雲台駅', '海雲台站', '海云台站', 'ヘウンデ', 'haeundae'],
  gwangan: ['広安', '廣安', '广安', '広安駅', '廣安站', '广安站', 'クァンアン', '広安里', '廣安里', '广安里', 'gwangan'],
  nampo: ['南浦', '南浦駅', '南浦站', 'ナンポ', '南浦洞', '光復路', 'nampo'],
  busan: ['釜山駅', '釜山站', 'プサン駅', 'KTX釜山', 'busan station'],
  suyeong: ['水営', '水營', '水营', '水営駅', '水營站', '水营站', 'スヨン', 'suyeong'],
  jagalchi: ['チャガルチ', 'チャガルチ駅', '札嘎其', '札嘎其站', 'jagalchi', '国際市場', '富平カントン市場'],
  geumnyeonsan: ['金蓮山', '金莲山', '金蓮山駅', '金蓮山站', '金莲山站', 'クムニョンサン', 'geumnyeonsan'],
  dongbaek: ['冬柏', '冬柏駅', '冬柏站', 'トンベク', '冬柏島', 'ザ・ベイ101', 'dongbaek'],
  bexco: ['BEXCO', 'ベクスコ', 'ベクスコ駅', 'BEXCO站', 'bexco'],
  jungang: ['中央', '中央駅', '中央站', 'チュンアン', '40階段', 'jungang'],
  dadaepo: ['多大浦', '多大浦海水浴場', '多大浦駅', '多大浦站', 'タデポ', 'dadaepo'],
  beomeosa: ['梵魚寺', '梵鱼寺', '梵魚寺駅', '梵魚寺站', '梵鱼寺站', 'ポモサ', 'beomeosa'],
  'centum-city': ['センタムシティ', 'センタムシティ駅', '新世界百貨店', 'Centum City', '센텀시티', '新世界百货', 'スパランド'],
  sasang: ['沙上', '沙上駅', '沙上站', 'ササン', '金海空港', '西部バスターミナル', 'sasang'],
  toseong: ['土城', '土城駅', '土城站', 'トソン', '甘川文化村', 'カムチョン', 'toseong'],
  osiria: ['オシリア', 'オシリア駅', 'Osiria', 'ロッテワールド釜山', '東釜山', '奧西利亞', '奥西利亚', 'osiria'],
  songjeong: ['松亭', '松亭駅', '松亭站', 'ソンジョン', '海辺列車', 'ブルーラインパーク', 'songjeong'],
  namcheon: ['南川', '南川駅', '南川站', 'ナムチョン', 'パンチョンドン', 'パン屋通り', 'namcheon'],
  oncheonjang: ['温泉場', '溫泉場', '温泉场', '温泉場駅', '溫泉場站', '温泉场站', 'オンチョンジャン', '虚心庁', '東莱温泉', 'oncheonjang'],
};

export const STATION_TRANSLATIONS: Record<string, Record<'JA' | 'ZH_TW' | 'ZH_CN', StationLocalizedContent>> = {
  seomyeon: {
    JA: {
      name: '西面駅（ソミョン）',
      shortName: '西面駅',
      recommendedExits: '7番・11番・12番・13番出口（エレベーター）、2番・4番・6番・8番・9番・10番・15番出口（エスカレーター）',
      elevatorLocationDesc: '地下街中央および7・11・12・13番出口付近の地上直結エレベーター',
      avgMovementTime: '約5〜8分（1・2号線乗り換え・地上移動時）',
      transferRouteDesc: '1号線・2号線ホームの専用エレベーターで地下1階改札階へ移動後、フラットな通路で乗り換え',
      precautions: '週末や夕方は西面地下街が非常に混雑します。ベビーカー・車椅子の方はロッテ百貨店地下連絡通路または12・13番出口のエレベーター利用が最もスムーズです。',
    },
    ZH_TW: {
      name: '西面站',
      shortName: '西面站',
      recommendedExits: '7、11、12、13號出口（電梯），2、4、6、8、9、10、15號出口（電扶梯）',
      elevatorLocationDesc: '西面地下街中央及 7、11、12、13號出口旁地面直達電梯',
      avgMovementTime: '約 5～8 分鐘（1・2號線轉乘及前往地面）',
      transferRouteDesc: '搭乘 1號線或 2號線月台專用電梯至 B1 穿堂層，沿平坦通道無障礙轉乘',
      precautions: '週末與傍晚時段地下商街人潮眾多，推嬰兒車或輪椅建議優先利用樂天百貨地下連通道或 12、13號出口電梯。',
    },
    ZH_CN: {
      name: '西面站',
      shortName: '西面站',
      recommendedExits: '7、11、12、13号出口（无障碍直梯），2、4、6、8、9、10、15号出口（扶梯）',
      elevatorLocationDesc: '西面地下商街中央及 7、11、12、13号出口旁地面直达电梯',
      avgMovementTime: '约 5～8 分钟（1・2号线换乘及前往地面）',
      transferRouteDesc: '乘坐 1号线或 2号线站台专用直梯至 B1 站厅层，沿平坦通道无障碍换乘',
      precautions: '周末与傍晚时段地下商街人流密集，推婴儿车或轮椅建议优先使用乐天百货地下连廊或 12、13号出口直梯。',
    },
  },
  jeonpo: {
    JA: {
      name: '田浦駅（チョンポ）',
      shortName: '田浦駅',
      recommendedExits: '4番・7番出口（エレベーター）、3番・6番・8番出口（エスカレーター）',
      elevatorLocationDesc: '4番出口・7番出口横の地上直結エレベーター',
      avgMovementTime: '徒歩約3〜4分',
      transferRouteDesc: '改札階（B1F）とホーム（B3F）を結ぶ垂直エレベーター完備',
      precautions: '田浦カフェ通りへ行くなら7番出口のエレベーターで地上に上がり、緩やかな歩道を進むルートがベビーカーに最も快適です。',
    },
    ZH_TW: {
      name: '田浦站',
      shortName: '田浦站',
      recommendedExits: '4、7號出口（電梯），3、6、8號出口（電扶梯）',
      elevatorLocationDesc: '4號及 7號出口旁地面直達電梯',
      avgMovementTime: '步行約 3～4 分鐘',
      transferRouteDesc: '設有連接 B1 穿堂層與 B3 月台的無障礙垂直電梯',
      precautions: '前往田浦咖啡街建議搭乘 7號出口電梯至地面，沿平坦人行道步行最為輕鬆。',
    },
    ZH_CN: {
      name: '田浦站',
      shortName: '田浦站',
      recommendedExits: '4、7号出口（无障碍直梯），3、6、8号出口（扶梯）',
      elevatorLocationDesc: '4号及 7号出口旁地面直达电梯',
      avgMovementTime: '步行约 3～4 分钟',
      transferRouteDesc: '配备连接 B1 站厅层与 B3 站台的无障碍垂直电梯',
      precautions: '前往田浦咖啡街建议乘坐 7号出口直梯至地面，沿平坦步道前往最为省力。',
    },
  },
  bujeon: {
    JA: {
      name: '釜田駅（プジョン）',
      shortName: '釜田駅',
      recommendedExits: '1番・3番出口（エレベーター）、2番出口（エスカレーター）',
      elevatorLocationDesc: '1番出口（釜田市場側）および3番出口（東海線・KTX釜田駅方面）地上エレベーター',
      avgMovementTime: '約4〜6分（東海線・釜田駅乗り換え時）',
      transferRouteDesc: '1号線改札階 ↔ 1・3番出口エレベーター ↔ 地上広場経由で東海線・KORAIL釜田駅へ平坦連絡',
      precautions: '釜田伝統市場の活気ある通りは日中人通りが多いため、3番出口エレベーター側の広い歩道を利用するとベビーカーやスーツケースでの移動がスムーズです。',
    },
    ZH_TW: {
      name: '釜田站',
      shortName: '釜田站',
      recommendedExits: '1、3號出口（電梯），2號出口（電扶梯）',
      elevatorLocationDesc: '1號出口（釜田市場方向）及 3號出口（東海線・KORAIL釜田站方向）地面電梯',
      avgMovementTime: '約 4～6 分鐘（轉乘東海線釜田站）',
      transferRouteDesc: '1號線穿堂層 ↔ 1・3號出口電梯 ↔ 經地面平坦廣場前往東海線釜田站',
      precautions: '釜田市場白天人潮較多，推嬰兒車或大型行李建議多利用 3號出口側寬敞人行道。',
    },
    ZH_CN: {
      name: '釜田站',
      shortName: '釜田站',
      recommendedExits: '1、3号出口（无障碍直梯），2号出口（扶梯）',
      elevatorLocationDesc: '1号出口（釜田市场方向）及 3号出口（东海线・KORAIL釜田站方向）地面直梯',
      avgMovementTime: '约 4～6 分钟（换乘东海线釜田站）',
      transferRouteDesc: '1号线站厅层 ↔ 1・3号出口直梯 ↔ 经地面平坦广场前往东海线釜田站',
      precautions: '釜田传统市场白天人流较多，推婴儿车或大件行李建议优先走 3号出口侧宽敞步道。',
    },
  },
  haeundae: {
    JA: {
      name: '海雲台駅（ヘウンデ）',
      shortName: '海雲台駅',
      recommendedExits: '1番・2番・3番・4番出口（エレベーター・エスカレーター完備）',
      elevatorLocationDesc: '1・2・3・4番の各出口付近に地上直結エレベーター完備',
      avgMovementTime: '徒歩約2〜3分',
      transferRouteDesc: 'ホーム ↔ 地下1階改札階 ↔ 3・5番出口側エレベーターで海雲台ビーチメイン通り（亀南路）へ直結',
      precautions: '海雲台ビーチや海雲台伝統市場へ段差なしで行くには、3番または1番出口側のエレベーターで上がり、歩行者天国の「亀南路（クナムロ）広場」を直進するのがベストです。',
    },
    ZH_TW: {
      name: '海雲台站',
      shortName: '海雲台站',
      recommendedExits: '1、2、3、4號出口（皆設電梯與電扶梯）',
      elevatorLocationDesc: '1、2、3、4號出口旁皆設有地面直達電梯',
      avgMovementTime: '步行約 2～3 分鐘',
      transferRouteDesc: '月台 ↔ B1 穿堂層 ↔ 1、3號出口電梯直通海雲台海水浴場主街（龜南路）',
      precautions: '前往海雲台海水浴場與海雲台傳統市場，搭乘 1號或 3號出口電梯上地面後，沿著寬敞平坦的「龜南路文化廣場」直走即可免爬階梯抵達沙灘木棧道。',
    },
    ZH_CN: {
      name: '海云台站',
      shortName: '海云台站',
      recommendedExits: '1、2、3、4号出口（均配备直梯与扶梯）',
      elevatorLocationDesc: '1、2、3、4号出口旁均设有地面直达电梯',
      avgMovementTime: '步行约 2～3 分钟',
      transferRouteDesc: '站台 ↔ B1 站厅层 ↔ 1、3号出口直梯直通海云台海水浴场主街（龟南路）',
      precautions: '前往海云台海水浴场与海云台传统市场，乘坐 1号或 3号出口直梯到地面后，沿着宽敞平坦的“龟南路文化广场”直行即可无台阶抵达海滩步道。',
    },
  },
  gwangan: {
    JA: {
      name: '広安駅（クァンアン）',
      shortName: '広安駅',
      recommendedExits: '1番・3番・4番出口（エレベーター）、2番・3番・5番出口（エスカレーター）',
      elevatorLocationDesc: '1番・3番・4番出口横に地上直結エレベーター設置',
      avgMovementTime: '徒歩約2〜3分（広安里ビーチまで平坦徒歩約8分）',
      transferRouteDesc: 'ホーム ↔ 改札階 ↔ 3番・5番出口方向から広安里海水浴場へ緩やかな下り坂・平坦歩道で接続',
      precautions: '広安里ビーチやドローンショー観覧へは3番出口エレベーターの利用が最も便利です。ビーチまでの道は舗装された緩やかな歩道でベビーカーでも楽に移動できます。',
    },
    ZH_TW: {
      name: '廣安站',
      shortName: '廣安站',
      recommendedExits: '1、3、4號出口（電梯），2、3、5號出口（電扶梯）',
      elevatorLocationDesc: '1、3、4號出口旁設有地面直達電梯',
      avgMovementTime: '站內約 2～3 分鐘（步行至廣安里海灘約 8 分鐘平坦步道）',
      transferRouteDesc: '月台 ↔ 穿堂層 ↔ 3號出口電梯出站後直行即可抵達廣安里海水浴場',
      precautions: '前往廣安里海灘觀賞廣安大橋夜景或無人機秀，推薦搭乘 3號出口電梯，沿途人行道平坦順暢。',
    },
    ZH_CN: {
      name: '广安站',
      shortName: '广安站',
      recommendedExits: '1、3、4号出口（无障碍直梯），2、3、5号出口（扶梯）',
      elevatorLocationDesc: '1、3、4号出口旁设有地面直达电梯',
      avgMovementTime: '站内约 2～3 分钟（步行至广安里海滩约 8 分钟平坦步道）',
      transferRouteDesc: '站台 ↔ 站厅层 ↔ 3号出口直梯出站后直行即可抵达广安里海水浴场',
      precautions: '前往广安里海滩观赏广安大桥夜景或无人机表演，推荐乘坐 3号出口直梯，沿途步道平坦顺畅。',
    },
  },
  nampo: {
    JA: {
      name: '南浦駅（ナンポ）',
      shortName: '南浦駅',
      recommendedExits: '5番・7番・8番・10番出口（エレベーター・ロッテ百貨店光復店直結）',
      elevatorLocationDesc: '5番・7番出口横の地上エレベーター、および8・10番出口（ロッテ百貨店光復店地下直結エレベーター）',
      avgMovementTime: '徒歩約3〜4分',
      transferRouteDesc: 'ホーム ↔ 地下1階改札階 ↔ ロッテ百貨店光復店連絡通路または5・7番出口エレベーターで光復路・影島大橋へ直結',
      precautions: '龍頭山公園へ行く場合は光復路側（7番出口付近）の屋外エスカレーターが利用できます。ロッテ百貨店光復店（8・10番出口直結）の店内エレベーターを使うと、授乳室やバリアフリートイレも快適に利用できます。',
    },
    ZH_TW: {
      name: '南浦站',
      shortName: '南浦站',
      recommendedExits: '5、7、8、10號出口（電梯・直通樂天百貨光復店）',
      elevatorLocationDesc: '5號、7號出口旁地面電梯，以及 8・10號出口（直通樂天百貨光復店室內電梯群）',
      avgMovementTime: '步行約 3～4 分鐘',
      transferRouteDesc: '月台 ↔ B1 穿堂層 ↔ 樂天百貨光復店連通道或 5、7號出口電梯直達光復路時尚街與影島大橋',
      precautions: '推嬰兒車或輪椅建議善用與 8・10號出口地下直通的樂天百貨光復店電梯，館內設有完善的育嬰室與無障礙洗手間。',
    },
    ZH_CN: {
      name: '南浦站',
      shortName: '南浦站',
      recommendedExits: '5、7、8、10号出口（无障碍直梯・直通乐天百货光复店）',
      elevatorLocationDesc: '5号、7号出口旁地面直梯，以及 8・10号出口（直通乐天百货光复店室内电梯群）',
      avgMovementTime: '步行约 3～4 分钟',
      transferRouteDesc: '站台 ↔ B1 站厅层 ↔ 乐天百货光复店连廊或 5、7号出口直梯直达光复路步行街与影岛大桥',
      precautions: '推婴儿车或轮椅建议善用与 8・10号出口地下直通的乐天百货光复店电梯，商场内配备完善的母婴室与无障碍卫生间。',
    },
  },
  busan: {
    JA: {
      name: '釜山駅（プサン）',
      shortName: '釜山駅',
      recommendedExits: '2番・4番・6番・8番出口（エレベーター）、KTX釜山駅1番連絡通路（エレベーター・エスカレーター）',
      elevatorLocationDesc: '地下鉄4・6・8番出口エレベーターおよびKTX釜山駅広場直結エレベーター・エスカレーター',
      avgMovementTime: '約4〜6分（地下鉄1号線 ↔ KTX釜山駅乗り換え）',
      transferRouteDesc: '地下鉄1号線ホーム ↔ 地下連絡通路 ↔ KTX釜山駅広場エレベーター・エスカレーターで段差なし乗り換え',
      precautions: 'KTX釜山駅へ乗り換える際は、地上に出るよりも地下連絡通路からKTX釜山駅広場直結エレベーター・大型エスカレーターを利用すると雨の日や大型スーツケースでも快適です。',
    },
    ZH_TW: {
      name: '釜山站',
      shortName: '釜山站',
      recommendedExits: '2、4、6、8號出口（電梯），KTX釜山站連通道（電梯・電扶梯）',
      elevatorLocationDesc: '地鐵 2、4、6、8號出口地面電梯，以及 KTX 釜山站廣場直通電梯與大型電扶梯',
      avgMovementTime: '約 4～6 分鐘（地鐵1號線 ↔ KTX釜山站轉乘）',
      transferRouteDesc: '地鐵1號線月台 ↔ B1 地下連通道 ↔ KTX釜山站廣場直達電梯/電扶梯免淋雨轉乘',
      precautions: '攜帶大型行李箱轉乘 KTX 高鐵時，走 B1 地下連通道搭乘 KTX 廣場直達電梯或電扶梯最為輕鬆省力。',
    },
    ZH_CN: {
      name: '釜山站',
      shortName: '釜山站',
      recommendedExits: '2、4、6、8号出口（无障碍直梯），KTX釜山站连廊（直梯・扶梯）',
      elevatorLocationDesc: '地铁 2、4、6、8号出口地面直梯，以及 KTX 釜山站广场直通电梯与大型扶梯',
      avgMovementTime: '约 4～6 分钟（地铁1号线 ↔ KTX釜山站换乘）',
      transferRouteDesc: '地铁1号线站台 ↔ B1 地下连廊 ↔ KTX釜山站广场直达电梯/扶梯无缝换乘',
      precautions: '携带大件行李箱换乘 KTX 高铁时，通过 B1 地下连廊乘坐 KTX 广场直达电梯或扶梯最为轻松省力。',
    },
  },
  suyeong: {
    JA: {
      name: '水営駅（スヨン）',
      shortName: '水営駅',
      recommendedExits: '2番・5番・11番・16番出口（エレベーター）、1番・7番・12番・15番出口（エスカレーター）',
      elevatorLocationDesc: '2・5・11・16番出口付近の地上直結エレベーターおよび2・3号線乗り換えエレベーター',
      avgMovementTime: '約4〜5分（2号線 ↔ 3号線乗り換え）',
      transferRouteDesc: '2号線・3号線の各ホームからエレベーターで改札階へ移動し、段差なしで相互乗り換え',
      precautions: '2号線と3号線の乗り換え駅です。八道市場や水営史跡公園方面へは2番・5番出口のエレベーターをご利用ください。',
    },
    ZH_TW: {
      name: '水營站',
      shortName: '水營站',
      recommendedExits: '2、5、11、16號出口（電梯），1、7、12、15號出口（電扶梯）',
      elevatorLocationDesc: '2、5、11、16號出口旁地面直達電梯及 2・3號線轉乘電梯',
      avgMovementTime: '約 4～5 分鐘（2號線 ↔ 3號線轉乘）',
      transferRouteDesc: '由 2號線與 3號線月台搭乘專用電梯至穿堂層，免爬樓梯雙向轉乘',
      precautions: '此站為 2號線與 3號線交會轉乘站，前往水營八道市場或水營史蹟公園建議利用 2號或 5號出口電梯。',
    },
    ZH_CN: {
      name: '水营站',
      shortName: '水营站',
      recommendedExits: '2、5、11、16号出口（无障碍直梯），1、7、12、15号出口（扶梯）',
      elevatorLocationDesc: '2、5、11、16号出口旁地面直达电梯及 2・3号线换乘直梯',
      avgMovementTime: '约 4～5 分钟（2号线 ↔ 3号线换乘）',
      transferRouteDesc: '由 2号线与 3号线站台乘坐专用直梯至站厅层，无台阶双向换乘',
      precautions: '本站为 2号线与 3号线换乘站，前往水营八道市场或水营史迹公园建议使用 2号或 5号出口直梯。',
    },
  },
  jagalchi: {
    JA: {
      name: 'チャガルチ駅',
      shortName: 'チャガルチ駅',
      recommendedExits: 'エレベーター（3番・5番出口の間 / 8番・10番出口の間）、7番出口（エスカレーター）',
      elevatorLocationDesc: '3・5番出口の間（国際市場・BIFF広場側）および8・10番出口の間（チャガルチ市場側）地上エレベーター',
      avgMovementTime: '徒歩約2〜3分',
      transferRouteDesc: 'ホーム（B2F） ↔ 改札階（B1F） ↔ 3・5番間または8・10番間の地上エレベーターで市場通りへ平坦直結',
      precautions: 'チャガルチ市場（海鮮市場）へ行くには8・10番出口の間のエレベーター、BIFF広場・国際市場・富平カントン市場へ行くには3・5番出口の間のエレベーターで上がると、大通りを渡らずそのまま平坦に移動できます。',
    },
    ZH_TW: {
      name: '札嘎其站',
      shortName: '札嘎其站',
      recommendedExits: '電梯（3・5號出口之間 / 8・10號出口之間），7號出口（電扶梯）',
      elevatorLocationDesc: '3・5號出口之間（BIFF廣場・國際市場側）與 8・10號出口之間（札嘎其市場側）地面直達電梯',
      avgMovementTime: '步行約 2～3 分鐘',
      transferRouteDesc: 'B2 月台 ↔ B1 穿堂層 ↔ 3・5號或 8・10號出口間地面電梯，免過大馬路直通各大傳統市場',
      precautions: '前往札嘎其海鮮市場請搭 8・10號出口間電梯；前往 BIFF 廣場、國際市場與富平罐頭夜市請搭 3・5號出口間電梯，出站即為平坦騎樓與市場拱廊。',
    },
    ZH_CN: {
      name: '札嘎其站',
      shortName: '札嘎其站',
      recommendedExits: '直梯（3・5号出口之间 / 8・10号出口之间），7号出口（扶梯）',
      elevatorLocationDesc: '3・5号出口之间（BIFF广场・国际市场侧）与 8・10号出口之间（札嘎其市场侧）地面直达电梯',
      avgMovementTime: '步行约 2～3 分钟',
      transferRouteDesc: 'B2 站台 ↔ B1 站厅层 ↔ 3・5号或 8・10号出口间地面直梯，无需横穿主干道直通各大传统市场',
      precautions: '前往札嘎其海鲜市场请乘 8・10号出口间直梯；前往 BIFF 广场、国际市场与富平罐头夜市请乘 3・5号出口间直梯，出站即为平坦街区。',
    },
  },
  geumnyeonsan: {
    JA: {
      name: '金蓮山駅（クムニョンサン）',
      shortName: '金蓮山駅',
      recommendedExits: '3番・4番出口（エレベーター）、2番・6番出口（エスカレーター）',
      elevatorLocationDesc: '3番出口（広安里ビーチ西側方面）および4番出口の地上エレベーター',
      avgMovementTime: '徒歩約1.5〜2分',
      transferRouteDesc: '改札階 ↔ ホームを段差なしで結ぶ垂直エレベーター完備',
      precautions: '広安里海水浴場の西側（南川洞寄り）やカフェ通りへは、隣りの広安駅よりも金蓮山駅3番出口エレベーターまたは1・3番出口から緩やかな下り坂で向かう方が混雑が少なく快適です。',
    },
    ZH_TW: {
      name: '金蓮山站',
      shortName: '金蓮山站',
      recommendedExits: '3、4號出口（電梯），2、6號出口（電扶梯）',
      elevatorLocationDesc: '3號出口（廣安里海灘西側方向）與 4號出口地面直達電梯',
      avgMovementTime: '步行約 1.5～2 分鐘',
      transferRouteDesc: '設有連接穿堂層與月台的無障礙垂直電梯',
      precautions: '前往廣安里海灘西段與海景咖啡街，從金蓮山站 3號出口電梯出站沿緩坡步行約 5 分鐘即可抵達海邊，人潮比廣安站更悠閒舒適。',
    },
    ZH_CN: {
      name: '金莲山站',
      shortName: '金莲山站',
      recommendedExits: '3、4号出口（无障碍直梯），2、6号出口（扶梯）',
      elevatorLocationDesc: '3号出口（广安里海滩西侧方向）与 4号出口地面直达电梯',
      avgMovementTime: '步行约 1.5～2 分钟',
      transferRouteDesc: '配备连接站厅层与站台的无障碍垂直电梯',
      precautions: '前往广安里海滩西段与海景咖啡街，从金莲山站 3号出口直梯出站沿缓坡步行约 5 分钟即可抵达海边，人流比广安站更清静舒适。',
    },
  },
  dongbaek: {
    JA: {
      name: '冬柏駅（トンベク）',
      shortName: '冬柏駅',
      recommendedExits: '1番・2番出口（エレベーター）、3番出口（エスカレーター）',
      elevatorLocationDesc: '1番出口（冬柏島・ザ・ベイ101方面）および2番出口の地上エレベーター',
      avgMovementTime: '徒歩約2〜3分',
      transferRouteDesc: 'ホーム ↔ 地下1階改札階 ↔ 1番・2番出口地上エレベーター完備',
      precautions: '冬柏島（ヌリマルAPECハウス）やザ・ベイ101、マリンシティへ行くなら1番出口エレベーターが最適です。冬柏公園の海辺ウッドデッキ散策路はベビーカーでも快適に散歩できます。',
    },
    ZH_TW: {
      name: '冬柏站',
      shortName: '冬柏站',
      recommendedExits: '1、2號出口（電梯），3號出口（電扶梯）',
      elevatorLocationDesc: '1號出口（冬柏島・The Bay 101 方向）及 2號出口地面直達電梯',
      avgMovementTime: '步行約 2～3 分鐘',
      transferRouteDesc: '月台 ↔ B1 穿堂層 ↔ 1號、2號出口地面電梯',
      precautions: '前往冬柏島、The Bay 101 夜景區與 Marine City 摩天大樓群，請搭乘 1號出口電梯，沿平坦人行道直走即可銜接海濱木棧道。',
    },
    ZH_CN: {
      name: '冬柏站',
      shortName: '冬柏站',
      recommendedExits: '1、2号出口（无障碍直梯），3号出口（扶梯）',
      elevatorLocationDesc: '1号出口（冬柏岛・The Bay 101 方向）及 2号出口地面直达电梯',
      avgMovementTime: '步行约 2～3 分钟',
      transferRouteDesc: '站台 ↔ B1 站厅层 ↔ 1号、2号出口地面直梯',
      precautions: '前往冬柏岛、The Bay 101 夜景打卡点与海云台电影大道（Marine City），请乘坐 1号出口直梯，沿平坦步道直行即可衔接海滨木栈道。',
    },
  },
  bexco: {
    JA: {
      name: 'BEXCO駅（ベクスコ）',
      shortName: 'BEXCO駅',
      recommendedExits: '1番・3番・7番・9番出口（エレベーター）、東海線連絡通路（エレベーター・エスカレーター）',
      elevatorLocationDesc: '2号線1・3・7・9番出口エレベーターおよび東海線BEXCO駅舎エレベーター',
      avgMovementTime: '約5〜7分（2号線 ↔ 東海線乗り換え）',
      transferRouteDesc: '2号線ホーム ↔ 地下乗り換え通路（ムービングウォーク・エレベーター完備） ↔ 東海線BEXCO駅',
      precautions: '2号線と東海線の乗り換え通路には長いムービングウォークとエレベーターが整備されています。釜山市立美術館やBEXCO展示場へは1番・5番出口側が便利です。',
    },
    ZH_TW: {
      name: 'BEXCO站（釜山會展中心）',
      shortName: 'BEXCO站',
      recommendedExits: '1、3、7、9號出口（電梯），東海線轉乘連通道（電梯・電扶梯）',
      elevatorLocationDesc: '2號線 1、3、7、9號出口地面電梯，以及東海線 BEXCO 站內無障礙電梯',
      avgMovementTime: '約 5～7 分鐘（2號線 ↔ 東海線轉乘）',
      transferRouteDesc: '2號線月台 ↔ B1 轉乘連通道（設電動平面步道與電梯） ↔ 東海線 BEXCO 站',
      precautions: '前往機張（樂天世界・松亭）方向可在本站無障礙轉乘東海線；前往釜山市立美術館或 BEXCO 展館建議使用 1號出口電梯。',
    },
    ZH_CN: {
      name: 'BEXCO站（釜山会展中心）',
      shortName: 'BEXCO站',
      recommendedExits: '1、3、7、9号出口（无障碍直梯），东海线换乘连廊（直梯・扶梯）',
      elevatorLocationDesc: '2号线 1、3、7、9号出口地面直梯，以及东海线 BEXCO 站内无障碍电梯',
      avgMovementTime: '约 5～7 分钟（2号线 ↔ 东海线换乘）',
      transferRouteDesc: '2号线站台 ↔ B1 换乘通道（配自动人行道与直梯） ↔ 东海线 BEXCO 站',
      precautions: '前往机张（釜山乐天世界・松亭）方向可在本站无障碍换乘东海线；前往釜山市立美术馆或 BEXCO 展馆建议使用 1号出口直梯。',
    },
  },
  jungang: {
    JA: {
      name: '中央駅（チュンアン）',
      shortName: '中央駅',
      recommendedExits: '12番・14番出口（エレベーター）、1番・17番出口（エスカレーター）',
      elevatorLocationDesc: '12番・14番出口（40階段文化観光テーマ通り・釜山郵便局方面）地上エレベーター',
      avgMovementTime: '徒歩約2〜3分',
      transferRouteDesc: 'ホーム ↔ 地下1階改札階 ↔ 12・14番出口地上エレベーター',
      precautions: '釜山近現代歴史館や40階段テーマ通りへ行くには12番・14番出口のエレベーターを利用すると、大通りの歩道へ段差なしで出られます。',
    },
    ZH_TW: {
      name: '中央站',
      shortName: '中央站',
      recommendedExits: '12、14號出口（電梯），1、17號出口（電扶梯）',
      elevatorLocationDesc: '12號與 14號出口（40階梯文化主題街・釜山郵局方向）地面直達電梯',
      avgMovementTime: '步行約 2～3 分鐘',
      transferRouteDesc: '月台 ↔ B1 穿堂層 ↔ 12、14號出口地面電梯',
      precautions: '前往 40階梯文化街或釜山近現代歷史館，搭乘 12或 14號出口電梯即可免爬階梯直達平坦人行道。',
    },
    ZH_CN: {
      name: '中央站',
      shortName: '中央站',
      recommendedExits: '12、14号出口（无障碍直梯），1、17号出口（扶梯）',
      elevatorLocationDesc: '12号与 14号出口（40阶梯文化主题街・釜山邮局方向）地面直达电梯',
      avgMovementTime: '步行约 2～3 分钟',
      transferRouteDesc: '站台 ↔ B1 站厅层 ↔ 12、14号出口地面直梯',
      precautions: '前往 40阶梯文化街或釜山近现代历史馆，乘坐 12或 14号出口直梯即可无台阶直达平坦步道。',
    },
  },
  dadaepo: {
    JA: {
      name: '多大浦海水浴場駅（タデポ）',
      shortName: '多大浦海水浴場駅',
      recommendedExits: '2番・4番出口（エレベーター・エスカレーター完備）',
      elevatorLocationDesc: '2番出口および4番出口（多大浦海辺公園・夢の落照噴水前）地上エレベーター',
      avgMovementTime: '徒歩約2分（海辺公園入口まで平坦徒歩3分）',
      transferRouteDesc: '1号線終点ホーム ↔ 改札階 ↔ 4番出口エレベーター・エスカレーターで多大浦海辺公園へ直結',
      precautions: '4番出口のエレベーターで地上に上がると、多大浦海辺公園・夢の落照噴水・ゴウニ生態探訪路（木道デッキ）まで完全フラットなバリアフリーコースが続きます。ベビーカー・車椅子旅行に最高のスポットです！',
    },
    ZH_TW: {
      name: '多大浦海水浴場站',
      shortName: '多大浦海水浴場站',
      recommendedExits: '2、4號出口（皆設電梯與電扶梯）',
      elevatorLocationDesc: '2號出口及 4號出口（多大浦海濱公園・夢之夕陽噴泉方向）地面直達電梯',
      avgMovementTime: '站內約 2 分鐘（出站步行 3 分鐘即達海濱公園）',
      transferRouteDesc: '1號線終點站月台 ↔ B1 穿堂層 ↔ 4號出口電梯直達多大浦海濱公園廣場',
      precautions: '從 4號出口搭乘電梯到地面後，前往多大浦夢之夕陽噴泉、海濱公園與生態木棧道全程平坦無階梯，是釜山最頂級的嬰兒車與輪椅友善看海勝地。',
    },
    ZH_CN: {
      name: '多大浦海水浴场站',
      shortName: '多大浦海水浴场站',
      recommendedExits: '2、4号出口（均配备直梯与扶梯）',
      elevatorLocationDesc: '2号出口及 4号出口（多大浦海滨公园・梦之夕阳喷泉方向）地面直达电梯',
      avgMovementTime: '站内约 2 分钟（出站步行 3 分钟即达海滨公园）',
      transferRouteDesc: '1号线终点站台 ↔ B1 站厅层 ↔ 4号出口直梯直达多大浦海滨公园广场',
      precautions: '从 4号出口乘坐直梯到地面后，前往多大浦梦之夕阳喷泉、海滨公园与生态木栈道全程平坦无台阶，是釜山最适合婴儿车与轮椅出行的看海胜地。',
    },
  },
  beomeosa: {
    JA: {
      name: '梵魚寺駅（ポモサ）',
      shortName: '梵魚寺駅',
      recommendedExits: 'エレベーター（4番・6番出口の間）、1番・3番出口（エスカレーター）',
      elevatorLocationDesc: '4番出口と6番出口の間の歩道に地上直結エレベーター設置',
      avgMovementTime: '徒歩約2〜3分',
      transferRouteDesc: 'ホーム ↔ 地下1階改札階 ↔ 4・6番出口の間エレベーターで地上へ移動',
      precautions: '千年古刹・梵魚寺へ行く場合は、4・6番出口間のエレベーターで地上に上がり、5・7番出口間の路地を少し上がったバス停から「90番循環バス」に乗車してください（徒歩では坂道が急なためバス利用が必須です）。',
    },
    ZH_TW: {
      name: '梵魚寺站',
      shortName: '梵魚寺站',
      recommendedExits: '電梯（4・6號出口之間），1、3號出口（電扶梯）',
      elevatorLocationDesc: '位於 4號與 6號出口之間人行道上的地面直達電梯',
      avgMovementTime: '步行約 2～3 分鐘',
      transferRouteDesc: '月台 ↔ B1 穿堂層 ↔ 4・6號出口間地面電梯',
      precautions: '前往千年古剎「梵魚寺」請勿直接步行上山（山路陡峭），建議搭乘 4・6號出口間電梯至地面後，過馬路至 5・7號出口巷口公車站轉乘「90號公車」直達梵魚寺售票處。',
    },
    ZH_CN: {
      name: '梵鱼寺站',
      shortName: '梵鱼寺站',
      recommendedExits: '直梯（4・6号出口之间），1、3号出口（扶梯）',
      elevatorLocationDesc: '位于 4号与 6号出口之间人行道上的地面直达电梯',
      avgMovementTime: '步行约 2～3 分钟',
      transferRouteDesc: '站台 ↔ B1 站厅层 ↔ 4・6号出口间地面直梯',
      precautions: '前往千年古刹“梵鱼寺”请勿直接步行上山（坡度较陡），建议乘坐 4・6号出口间直梯至地面后，前往 5・7号出口旁公交站换乘“90路公交车”直达梵鱼寺入口。',
    },
  },
  'centum-city': {
    JA: {
      name: 'センタムシティ駅',
      shortName: 'センタムシティ駅',
      recommendedExits: '1番・3番・5番・10番・12番出口（エレベーター）、2番・4番・9番・11番出口（エスカレーター）',
      elevatorLocationDesc: '1番出口（BEXCO・市立美術館）、3・5番間、10・12番間（新世界百貨店・スパランド前）地上エレベーター完備',
      avgMovementTime: '約2〜3分（新世界・ロッテ百貨店へは地下広場から平坦直結）',
      transferRouteDesc: '地下2階ホームエレベーター ↔ 地下1階改札階 ↔ 新世界・ロッテ百貨店地下連絡広場または1・3・5・10・12番地上エレベーター',
      precautions: '新世界百貨店センタムシティ店（スパランド）とロッテ百貨店へは、地上に出なくても地下1階改札階から段差なしで直接店内および百貨店エレベーターへ入れます。映画の殿堂へは10・12番間エレベーターが便利です。',
    },
    ZH_TW: {
      name: 'Centum City站（新世界）',
      shortName: 'Centum City站',
      recommendedExits: '1、3、5、10、12號出口（電梯），2、4、9、11號出口（電扶梯）',
      elevatorLocationDesc: '1號出口（BEXCO・市立美術館）、3・5號出口間、10・12號出口間（新世界百貨・Spa Land 地面）皆設直達電梯',
      avgMovementTime: '約 2～3 分鐘（新世界百貨與樂天百貨可由 B1 地下廣場平地直通）',
      transferRouteDesc: 'B2 月台電梯 ↔ B1 穿堂層 ↔ 新世界/樂天百貨地下連通廣場或 1、3・5、10・12號出口地面電梯',
      precautions: '前往世界最大百貨「新世界 Centum City（Spa Land 汗蒸幕）」與樂天百貨，無需出地面，從 B1 穿堂層即可零階梯直通百貨公司內部與專用電梯；前往電影殿堂可搭乘 10・12號出口間地面電梯。',
    },
    ZH_CN: {
      name: 'Centum City站（新世界）',
      shortName: 'Centum City站',
      recommendedExits: '1、3、5、10、12号出口（无障碍直梯），2、4、9、11号出口（扶梯）',
      elevatorLocationDesc: '1号出口（BEXCO・市立美术馆）、3・5号出口间、10・12号出口间（新世界百货・Spa Land 地面）均配直梯',
      avgMovementTime: '约 2～3 分钟（新世界百货与乐天百货可由 B1 地下广场平地直通）',
      transferRouteDesc: 'B2 站台直梯 ↔ B1 站厅层 ↔ 新世界/乐天百货地下连通广场或 1、3・5、10・12号出口地面直梯',
      precautions: '前往世界最大百货“新世界 Centum City（Spa Land 汗蒸幕）”与乐天百货，无需出地面，从 B1 站厅层即可无台阶直通商场内部与商场直梯；前往电影殿堂可乘坐 10・12号出口间地面直梯。',
    },
  },
  sasang: {
    JA: {
      name: '沙上駅（ササン）',
      shortName: '沙上駅',
      recommendedExits: '3番・4番出口、金海軽電鉄1番・2番出口（エレベーター・エスカレーター両方完備） / 2番出口（エスカレーター）',
      elevatorLocationDesc: '2号線3番・4番出口および釜山金海軽電鉄1番・2番出口にエレベーター・エスカレーター完備',
      avgMovementTime: '約5〜7分（2号線 ↔ 金海軽電鉄・西部バスターミナル乗り換え）',
      transferRouteDesc: '2号線ホームエレベーター ↔ 地下1階乗り換え通路 ↔ 金海軽電鉄沙上駅エレベーター（金海国際空港へ直結）',
      precautions: '金海国際空港へ向かう「釜山金海軽電鉄」と釜山西部バスターミナルが集まる西釜山の交通拠点です。空港鉄道への乗り換えは地下連絡通路のエレベーターとムービングウォークでスーツケースのまま移動でき、バスターミナルへは3番・4番出口が直結しています。',
    },
    ZH_TW: {
      name: '沙上站',
      shortName: '沙上站',
      recommendedExits: '3號、4號出口、金海輕軌 1號・2號出口（電梯＋電扶梯） / 2號出口（電扶梯）',
      elevatorLocationDesc: '2號線 3號、4號出口及釜山金海輕軌 1號、2號出口皆設有電梯與電扶梯',
      avgMovementTime: '約 5～7 分鐘（2號線 ↔ 金海輕軌・西部巴士客運站轉乘）',
      transferRouteDesc: '2號線月台電梯 ↔ B1 地下轉乘通道 ↔ 金海輕軌沙上站專用電梯（直達金海國際機場）',
      precautions: '此站為前往「金海國際機場」的輕軌起點站與釜山西部市外巴士客運站樞紐。轉乘機場輕軌可走地下轉乘連通道搭乘電梯；前往西部巴士站（Apple Outlet）從 3號或 4號出口電梯上地面即達。',
    },
    ZH_CN: {
      name: '沙上站',
      shortName: '沙上站',
      recommendedExits: '3号、4号出口、金海轻轨 1号・2号出口（直梯＋扶梯） / 2号出口（扶梯）',
      elevatorLocationDesc: '2号线 3号、4号出口及釜山金海轻轨 1号、2号出口均配备直梯与扶梯',
      avgMovementTime: '约 5～7 分钟（2号线 ↔ 金海轻轨・西部长途汽车站换乘）',
      transferRouteDesc: '2号线站台直梯 ↔ B1 地下换乘通道 ↔ 金海轻轨沙上站专用直梯（直达金海国际机场）',
      precautions: '本站是前往“金海国际机场”的轻轨起点站与釜山西部长途汽车站枢纽。换乘机场轻轨可通过地下换乘连廊乘坐直梯；前往西部汽车站（Apple Outlet）从 3号或 4号出口直梯到地面即达。',
    },
  },
  toseong: {
    JA: {
      name: '土城駅（トソン）',
      shortName: '土城駅',
      recommendedExits: '4番・6番出口の間エレベーター（甘川文化村バス乗換・釜山大病院）、5番出口（エレベーター）、2番出口（エスカレーター）',
      elevatorLocationDesc: '4・6番出口の間（釜山大学病院前）および5番出口横に地上直結エレベーター完備',
      avgMovementTime: '約3分（甘川文化村行きマウルバス停留所まで平坦徒歩1〜2分）',
      transferRouteDesc: '1号線ホームエレベーター ↔ 地下1階改札階 ↔ 4・6番出口の間エレベーター → 6番出口前の釜山大学病院バス停でマウルバス乗車',
      precautions: '甘川文化村へ行く代表的な乗換駅です！6番出口の階段を使わず、「4・6番出口の間の地上エレベーター」で上がってから平坦な歩道を6番出口前（釜山大学病院がんセンター前）バス停へ進むと、ベビーカーや車椅子でも段差なしでマウルバス（西区2・西区2-2・沙下区1-1）に乗車できます。',
    },
    ZH_TW: {
      name: '土城站（甘川文化村轉乘）',
      shortName: '土城站',
      recommendedExits: '4・6號出口之間電梯（甘川文化村公車轉乘・釜山大醫院）、5號出口（電梯）、2號出口（電扶梯）',
      elevatorLocationDesc: '4號與 6號出口之間（釜山大學醫院前）及 5號出口旁皆設地面直達電梯',
      avgMovementTime: '約 3 分鐘（出電梯後平坦步行 1～2 分鐘即達甘川文化村公車站）',
      transferRouteDesc: '1號線月台電梯 ↔ B1 穿堂層 ↔ 4・6號出口間地面電梯 → 平坦步行至 6號出口前釜山大學醫院公車站轉乘社區巴士',
      precautions: '前往「甘川文化村」必看的無障礙訣竅：6號出口本身僅有階梯，請務必搭乘「4・6號出口之間的地面電梯」出站，再沿平坦人行道走到 6號出口前（釜山大醫院癌症中心前）公車站，轉乘西區2、西區2-2或沙下區1-1小巴即可直達甘川文化村入口！',
    },
    ZH_CN: {
      name: '土城站（甘川文化村换乘）',
      shortName: '土城站',
      recommendedExits: '4・6号出口之间直梯（甘川文化村公交换乘・釜山大医院）、5号出口（直梯）、2号出口（扶梯）',
      elevatorLocationDesc: '4号与 6号出口之间（釜山大学医院前）及 5号出口旁均设地面直达电梯',
      avgMovementTime: '约 3 分钟（出直梯后平坦步行 1～2 分钟即达甘川文化村公交站）',
      transferRouteDesc: '1号线站台直梯 ↔ B1 站厅层 ↔ 4・6号出口间地面直梯 → 平坦步行至 6号出口前釜山大学医院公交站换乘小巴',
      precautions: '前往“甘川文化村”的省力秘诀：6号出口本身只有楼梯，请务必乘坐“4・6号出口之间的地面直梯”出站，再沿平坦人行道走到 6号出口前（釜山大医院癌症中心前）公交站，换乘西区2、西区2-2或沙下区1-1路小巴即可直达甘川文化村入口！',
    },
  },
  osiria: {
    JA: {
      name: 'オシリア駅（東釜山観光団地）',
      shortName: 'オシリア駅',
      recommendedExits: '全出口 1階平坦直結（駅舎外エレベーター・エスカレーター不要）',
      elevatorLocationDesc: '2階ホーム ↔ 1階改札階に屋内エレベーター・エスカレーター完備（1階改札から外の歩道へは段差なしの平面直結）',
      avgMovementTime: '約2分（ホーム ↔ 1階改札 ↔ 地上広場）',
      transferRouteDesc: '2階東海線ホームエレベーター・エスカレーター ↔ 1階改札口 ↔ 1〜3番出口の平坦広場へそのまま直結（ロッテワールドへは3番出口前のエレベーター付き歩道橋を利用）',
      precautions: 'オシリア駅は高架駅のため、1階改札を出ると外の歩道とそのまま同じ高さ（段差ゼロ）でつながっています。外の出口に別途エレベーターやエスカレーターを使う必要はありません。ロッテワールド・アドベンチャー釜山へは3番出口前のエレベーター付き専用歩道橋で8車線道路を安全に渡れます。',
    },
    ZH_TW: {
      name: '奧西利亞站（東釜山樂天世界）',
      shortName: '奧西利亞站',
      recommendedExits: '全出口 1樓平地直通（出站無需室外電梯或電扶梯）',
      elevatorLocationDesc: '2樓月台 ↔ 1樓穿堂層設有室內電梯與電扶梯；1樓驗票閘門外與地面人行道完全平齊無階梯',
      avgMovementTime: '約 2 分鐘（2樓月台 ↔ 1樓閘門 ↔ 地面廣場）',
      transferRouteDesc: '2樓東海線月台電梯/電扶梯 ↔ 1樓驗票口 ↔ 平地直通 1～3號出口廣場（前往釜山樂天世界請由 3號出口搭乘行人天橋電梯）',
      precautions: '奧西利亞站為地面 1樓穿堂設計，從 2樓月台搭室內電梯下到 1樓出閘門後，所有出口皆與外面人行道平齊，完全不需要室外電梯或爬樓梯！前往「釜山樂天世界」請由 3號出口搭乘附設電梯的專用天橋安全跨越馬路。',
    },
    ZH_CN: {
      name: '奥西利亚站（东釜山乐天世界）',
      shortName: '奥西利亚站',
      recommendedExits: '全出口 1层平地直通（出站无需室外直梯或扶梯）',
      elevatorLocationDesc: '2层站台 ↔ 1层站厅设有室内直梯与扶梯；1层检票闸机外与地面人行道完全平齐无台阶',
      avgMovementTime: '约 2 分钟（2层站台 ↔ 1层闸机 ↔ 地面广场）',
      transferRouteDesc: '2层东海线站台直梯/扶梯 ↔ 1层检票口 ↔ 平地直通 1～3号出口广场（前往釜山乐天世界请由 3号出口乘坐天桥直梯）',
      precautions: '奥西利亚站采用 1层地面站厅设计，从 2层站台乘室内直梯下到 1层出闸机后，所有出口均与站外人行道平齐，完全无需室外电梯或爬楼梯！前往“釜山乐天世界”请从 3号出口通过配备直梯的专用过街天桥安全前往。',
    },
  },
  songjeong: {
    JA: {
      name: '松亭駅（ソンジョン）',
      shortName: '松亭駅',
      recommendedExits: '1番・2番 全出口 1階平坦直結（駅舎外エレベーター・エスカレーター不要）',
      elevatorLocationDesc: '2階ホーム ↔ 1階改札階に屋内エレベーター2基・エスカレーター4基完備（1階改札から1・2番出口歩道へは段差なし平面直結）',
      avgMovementTime: '約1.5〜2分（ホーム ↔ 1階改札 ↔ 地上歩道）',
      transferRouteDesc: '2階東海線ホームエレベーター・エスカレーター ↔ 1階改札口 ↔ 1・2番出口の地上歩道へ段差なしで直結',
      precautions: '松亭駅も1階改札階がそのまま地上歩道と同じ高さにあるため、改札を出てから外の出口へ出る際にエレベーターやエスカレーターは不要です（全出口段差ゼロ）。2番出口から平坦な歩道を約8分歩くと「海雲台ブルーラインパーク松亭停車場（海辺列車）」と松亭海水浴場に到着します。',
    },
    ZH_TW: {
      name: '松亭站（海濱列車・松亭海灘）',
      shortName: '松亭站',
      recommendedExits: '1號・2號 全出口 1樓平地直通（出站無需室外電梯或電扶梯）',
      elevatorLocationDesc: '2樓月台 ↔ 1樓穿堂層設有室內電梯 2座與電扶梯 4座；1樓閘門外與 1、2號出口人行道完全平齊',
      avgMovementTime: '約 1.5～2 分鐘（2樓月台 ↔ 1樓閘門 ↔ 地面人行道）',
      transferRouteDesc: '2樓東海線月台室內電梯/電扶梯 ↔ 1樓驗票口 ↔ 平地直通 1、2號出口人行道',
      precautions: '松亭站同樣為 1樓地面穿堂設計，出驗票閘門後即與外面人行道完全平齊，不需任何室外電梯即可無障礙出站！從 2號出口沿平坦步道步行約 8 分鐘即可抵達「海雲台藍線公園松亭站（海岸列車）」與松亭海水浴場。',
    },
    ZH_CN: {
      name: '松亭站（海滨列车・松亭海滩）',
      shortName: '松亭站',
      recommendedExits: '1号・2号 全出口 1层平地直通（出站无需室外直梯或扶梯）',
      elevatorLocationDesc: '2层站台 ↔ 1层站厅设有室内直梯 2部与扶梯 4部；1层闸机外与 1、2号出口人行道完全平齐',
      avgMovementTime: '约 1.5～2 分钟（2层站台 ↔ 1层闸机 ↔ 地面人行道）',
      transferRouteDesc: '2层东海线站台室内直梯/扶梯 ↔ 1层检票口 ↔ 平地直通 1、2号出口人行道',
      precautions: '松亭站同样采用 1层地面站厅设计，出检票闸机后即与站外人行道完全平齐，无需任何室外电梯即可无台阶出站！从 2号出口沿平坦步道步行约 8 分钟即可抵达“海云台蓝线公园松亭站（海滨列车）”与松亭海水浴场。',
    },
  },
  namcheon: {
    JA: {
      name: '南川駅（ナムチョン）',
      shortName: '南川駅',
      recommendedExits: '1番出口（パンチョンドン・広安里ビーチ南端）、4番出口（エレベーター）',
      elevatorLocationDesc: '1番出口側（フードエン南川店前）および4番出口側（Tステーション前）に地上直結エレベーター2基完備',
      avgMovementTime: '約2分（ホーム ↔ 地上エレベーター出口）',
      transferRouteDesc: '地下2階2号線ホームエレベーター ↔ 地下1階改札階 ↔ 1番出口地上エレベーター（パンチョンドン・南川海辺市場へ平坦直結）または4番出口地上エレベーター',
      precautions: '釜山を代表するベーカリー巡りの聖地「南川洞（通称パンチョンドン）」と広安里ビーチ南端（サムイクビーチタウン）への玄関口です。1番出口のエレベーターで地上に上がれば、大通りを渡らずそのままパン屋通りや海辺の散策路までずっと平坦に歩けます。',
    },
    ZH_TW: {
      name: '南川站（麵包川洞・廣安里南端）',
      shortName: '南川站',
      recommendedExits: '1號出口（南川洞麵包街・廣安里南端）、4號出口（電梯）',
      elevatorLocationDesc: '1號出口側（東側人行道）與 4號出口側（西側人行道）皆設有地面直達電梯',
      avgMovementTime: '約 2 分鐘（月台 ↔ 地面電梯出口）',
      transferRouteDesc: 'B2 2號線月台電梯 ↔ B1 穿堂層 ↔ 1號出口地面電梯（平地直通麵包川洞與南川海濱市場）或 4號出口地面電梯',
      precautions: '此站為釜山知名烘焙甜點聖地「南川洞（俗稱麵包川洞）」與廣安里海灘南端（三益海灘公寓櫻花道）入口。搭乘 1號出口電梯上地面，無需過馬路即可全程平地漫步至各大名店與海濱步道。',
    },
    ZH_CN: {
      name: '南川站（面包川洞・广安里南端）',
      shortName: '南川站',
      recommendedExits: '1号出口（南川洞面包街・广安里南端）、4号出口（无障碍直梯）',
      elevatorLocationDesc: '1号出口侧（东侧人行道）与 4号出口侧（西侧人行道）均设有地面直达电梯',
      avgMovementTime: '约 2 分钟（站台 ↔ 地面直梯出口）',
      transferRouteDesc: 'B2 2号线站台直梯 ↔ B1 站厅层 ↔ 1号出口地面直梯（平地直通面包川洞与南川海滨市场）或 4号出口地面直梯',
      precautions: '本站是釜山著名烘焙甜品街区“南川洞（俗称面包川洞）”与广安里海滩南端（三益海滩公寓樱花大道）入口。乘坐 1号出口直梯到地面，无需过马路即可全程平地漫步至各大面包名店与海滨步道。',
    },
  },
  oncheonjang: {
    JA: {
      name: '温泉場駅（オンチョンジャン）',
      shortName: '温泉場駅',
      recommendedExits: '3番・7番出口・歩道橋（エレベーター） / 2番・4番出口（階段横の緩やかなスロープ）',
      elevatorLocationDesc: '3・7番出口地上エレベーター、中央大路横断歩道橋エレベーター2基、および2・4番出口の階段横バリアフリースロープ完備',
      avgMovementTime: '約2〜3分（ホーム ↔ 改札階 ↔ 地上エレベーター / 2・4番スロープ）',
      transferRouteDesc: '3階ホームエレベーター ↔ 2階改札階 ↔ [東莱温泉・金剛公園方面] 3・7番出口および歩道橋エレベーター / [温泉川方面] 2・4番出口の階段横スロープで段差なし移動',
      precautions: '東莱温泉・虚心庁（ホシムチョン）・金剛公園方面へは3・7番出口エレベーター、または大通り向かい側へ渡れる歩道橋エレベーターをご利用ください。反対側の温泉川（オンチョンチョン）散策路方面である2番・4番出口には、階段のすぐ横にベビーカー・車椅子がそのまま通れる緩やかなスロープ（傾斜路）が設置されています。',
    },
    ZH_TW: {
      name: '溫泉場站（東萊溫泉・虛心廳）',
      shortName: '溫泉場站',
      recommendedExits: '3號・7號出口・行人天橋（電梯） / 2號・4號出口（階梯旁無障礙緩坡道）',
      elevatorLocationDesc: '3・7號出口地面電梯、跨越中央大路的行人天橋西側電梯 2座，以及 2、4號出口階梯旁緩坡道（Slope）',
      avgMovementTime: '約 2～3 分鐘（月台 ↔ 2樓穿堂層 ↔ 地面電梯 / 2・4號出口坡道）',
      transferRouteDesc: '3樓月台電梯 ↔ 2樓穿堂層 ↔ [東萊溫泉・虛心廳・金剛公園方向] 3・7號出口及天橋電梯 / [溫泉川步道方向] 2號、4號出口階梯旁緩坡道免爬樓梯直達',
      precautions: '前往東萊溫泉露天足浴湯、虛心廳汗蒸幕與金剛公園，請使用 3・7號出口電梯或直接從 2樓連通的行人天橋電梯安全跨越八線道馬路。對面前往「溫泉川河濱步道」的 2號與 4號出口，在樓梯旁皆設有平緩的無障礙坡道（斜坡），嬰兒車與輪椅可直接推行上下！',
    },
    ZH_CN: {
      name: '温泉场站（东莱温泉・虚心厅）',
      shortName: '温泉场站',
      recommendedExits: '3号・7号出口・过街天桥（无障碍直梯） / 2号・4号出口（楼梯旁无障碍缓坡道）',
      elevatorLocationDesc: '3・7号出口地面直梯、跨越中央大路的过街天桥西侧直梯 2部，以及 2、4号出口楼梯旁缓坡道（Slope）',
      avgMovementTime: '约 2～3 分钟（站台 ↔ 2层站厅 ↔ 地面直梯 / 2・4号出口坡道）',
      transferRouteDesc: '3层站台直梯 ↔ 2层站厅 ↔ [东莱温泉・虚心厅・金刚公园方向] 3・7号出口及天桥直梯 / [温泉川步道方向] 2号、4号出口楼梯旁缓坡道无台阶直达',
      precautions: '前往东莱温泉露天足浴汤、虚心厅温泉与金刚公园，请使用 3・7号出口直梯或直接通过 2层连通的过街天桥直梯安全跨越八车道马路。对面前往“温泉川河滨步道”的 2号与 4号出口，在楼梯旁均设有平缓的无障碍坡道（斜坡），婴儿车与轮椅可直接推行上下！',
    },
  },
};

export const KO_NAME_TO_STATION_ID: Record<string, string> = {
  '서면역': 'seomyeon',
  '서면': 'seomyeon',
  '전포역': 'jeonpo',
  '전포': 'jeonpo',
  '부전역': 'bujeon',
  '부전': 'bujeon',
  '해운대역': 'haeundae',
  '해운대': 'haeundae',
  '광안역': 'gwangan',
  '광안': 'gwangan',
  '남포역': 'nampo',
  '남포': 'nampo',
  '부산역': 'busan',
  '부산': 'busan',
  '수영역': 'suyeong',
  '수영': 'suyeong',
  '자갈치역': 'jagalchi',
  '자갈치': 'jagalchi',
  '금련산역': 'geumnyeonsan',
  '금련산': 'geumnyeonsan',
  '동백역': 'dongbaek',
  '동백': 'dongbaek',
  '벡스코역': 'bexco',
  '벡스코': 'bexco',
  '중앙역': 'jungang',
  '중앙': 'jungang',
  '다대포해수욕장역': 'dadaepo',
  '다대포역': 'dadaepo',
  '다대포': 'dadaepo',
  '범어사역': 'beomeosa',
  '범어사': 'beomeosa',
  '센텀시티역': 'centum-city',
  '센텀시티': 'centum-city',
  '사상역': 'sasang',
  '사상': 'sasang',
  '토성역': 'toseong',
  '토성': 'toseong',
  '오시리아역': 'osiria',
  '오시리아': 'osiria',
  '송정역': 'songjeong',
  '송정': 'songjeong',
  '남천역': 'namcheon',
  '남천': 'namcheon',
  '온천장역': 'oncheonjang',
  '온천장': 'oncheonjang',
};


export const STATION_TRANSLATIONS_ES_FR: Record<string, Record<'ES' | 'FR', StationLocalizedContent>> = {
  seomyeon: {
    ES: {
      name: 'Estación de Seomyeon',
      shortName: 'Seomyeon',
      recommendedExits: 'Salidas 7 y 12 (Ascensor), Salidas 9, 10, 11 y 13 (Ascensor), Bujeon Mall Salida 5',
      elevatorLocationDesc: 'Ascensores exteriores en las Salidas 7, 9, 10, 11, 12 y 13 + ascensor en Bujeon Mall Salida 5',
      avgMovementTime: 'Aprox. 6–8 min desde el andén hasta la calle',
      transferRouteDesc: 'El vestíbulo central subterráneo (B1) conecta las Líneas 1 y 2 mediante ascensores de andén sin escalones.',
      precautions: 'Las salidas con escaleras del centro comercial subterráneo son largas; utiliza las Salidas 7, 9–13 o Bujeon Mall Salida 5.'
    },
    FR: {
      name: 'Station Seomyeon',
      shortName: 'Seomyeon',
      recommendedExits: 'Sorties 7 et 12 (Ascenseur), Sorties 9, 10, 11 et 13 (Ascenseur), Bujeon Mall Sortie 5',
      elevatorLocationDesc: 'Ascenseurs directs vers la surface aux Sorties 7, 9, 10, 11, 12 et 13 + Bujeon Mall Sortie 5',
      avgMovementTime: 'Env. 6 à 8 min du quai jusqu’à la chaussée',
      transferRouteDesc: 'La mezzanine centrale (B1) relie les Lignes 1 et 2 par ascenseurs sans aucune marche.',
      precautions: 'Évitez les longs escaliers de la galerie souterraine et privilégiez les Sorties 7, 9 à 13 ou Bujeon Mall Sortie 5.'
    }
  },
  jeonpo: {
    ES: {
      name: 'Estación de Jeonpo',
      shortName: 'Jeonpo',
      recommendedExits: 'Salida 4 (Ascensor y Escalera mecánica), Salida 7 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensor y escalera mecánica bidireccional en la Salida 4',
      avgMovementTime: 'Aprox. 4–5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación de la Línea 2 con andenes laterales; comprueba el sentido del tren antes de pasar los tornos.',
      precautions: 'Para cochecitos y sillas de ruedas, sal por la Salida 4 (ascensor) y cruza el paso de peatones llano hacia la Calle de Cafeterías de Jeonpo.'
    },
    FR: {
      name: 'Station Jeonpo',
      shortName: 'Jeonpo',
      recommendedExits: 'Sortie 4 (Ascenseur & Escalator), Sortie 7 (Escalator)',
      elevatorLocationDesc: 'Ascenseur et escalator bidirectionnel situés à la Sortie 4',
      avgMovementTime: 'Env. 4 à 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Station de la Ligne 2 à quais latéraux ; vérifiez la direction du train avant de franchir les portillons.',
      precautions: 'Avec une poussette ou un fauteuil roulant, empruntez l’ascenseur de la Sortie 4 puis traversez au passage piéton plat vers la rue des cafés de Jeonpo.'
    }
  },
  bujeon: {
    ES: {
      name: 'Estación de Bujeon',
      shortName: 'Bujeon',
      recommendedExits: 'Salidas 1 y 7 (Ascensor), Salidas 2 y 6 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensor en la Salida 1 (Mercado de Bujeon) y Salida 7 (Estación de tren de Bujeon / Línea Donghae)',
      avgMovementTime: 'Aprox. 5–6 min desde el andén hasta la calle',
      transferRouteDesc: 'Transbordo en superficie: sal por el ascensor de la Salida 7 y camina 150 m por acera llana hasta la Estación Bujeon de la Línea Donghae.',
      precautions: 'Para visitar el Mercado Tradicional de Bujeon sin escalones, utiliza el ascensor de la Salida 1.'
    },
    FR: {
      name: 'Station Bujeon',
      shortName: 'Bujeon',
      recommendedExits: 'Sorties 1 et 7 (Ascenseur), Sorties 2 et 6 (Escalator)',
      elevatorLocationDesc: 'Ascenseur à la Sortie 1 (Marché de Bujeon) et à la Sortie 7 (Gare de Bujeon / Ligne Donghae)',
      avgMovementTime: 'Env. 5 à 6 min du quai jusqu’à la surface',
      transferRouteDesc: 'Correspondance en surface : prenez l’ascenseur de la Sortie 7 et marchez 150 m sur un trottoir plat jusqu’à la gare de Bujeon (Ligne Donghae).',
      precautions: 'Pour accéder de plain-pied au marché traditionnel de Bujeon, utilisez l’ascenseur de la Sortie 1.'
    }
  },
  haeundae: {
    ES: {
      name: 'Estación de Haeundae',
      shortName: 'Haeundae',
      recommendedExits: 'Salidas 2 y 3 (Ascensor), Salidas 1 y 5 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensores directos a la calle junto a las Salidas 2 y 3',
      avgMovementTime: 'Aprox. 5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación de la Línea 2 con andenes laterales; el vestíbulo conecta ambos sentidos mediante ascensor.',
      precautions: 'Para ir a la Playa de Haeundae y Gunam-ro sin escalones, toma el ascensor de la Salida 3.'
    },
    FR: {
      name: 'Station Haeundae',
      shortName: 'Haeundae',
      recommendedExits: 'Sorties 2 et 3 (Ascenseur), Sorties 1 et 5 (Escalator)',
      elevatorLocationDesc: 'Ascenseurs directs vers la chaussée situés aux Sorties 2 et 3',
      avgMovementTime: 'Env. 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Station de la Ligne 2 à quais latéraux ; la mezzanine relie les deux directions par ascenseur.',
      precautions: 'Pour rejoindre la plage de Haeundae et l’avenue piétonne Gunam-ro sans marche, prenez l’ascenseur de la Sortie 3.'
    }
  },
  gwangan: {
    ES: {
      name: 'Estación de Gwangan',
      shortName: 'Gwangan',
      recommendedExits: 'Salidas 1 y 3 (Ascensor), Salida 5 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensores exteriores en las Salidas 1 y 3',
      avgMovementTime: 'Aprox. 5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación de la Línea 2; utiliza los ascensores internos entre andén y vestíbulo.',
      precautions: 'Hacia la Playa de Gwangalli hay una suave pendiente descendente; ten precaución al frenar sillas de ruedas o cochecitos.'
    },
    FR: {
      name: 'Station Gwangan',
      shortName: 'Gwangan',
      recommendedExits: 'Sorties 1 et 3 (Ascenseur), Sortie 5 (Escalator)',
      elevatorLocationDesc: 'Ascenseurs directs vers la surface aux Sorties 1 et 3',
      avgMovementTime: 'Env. 5 min du quai jusqu’à la chaussée',
      transferRouteDesc: 'Station de la Ligne 2 ; utilisez les ascenseurs intérieurs entre le quai et le hall.',
      precautions: 'La rue menant à la plage de Gwangalli présente une légère pente descendante ; contrôlez bien votre vitesse en fauteuil roulant ou poussette.'
    }
  },
  nampo: {
    ES: {
      name: 'Estación de Nampo',
      shortName: 'Nampo',
      recommendedExits: 'Salida 5 (Ascensor), Salidas 8 y 10 (Ascensor Grandes Almacenes Lotte)',
      elevatorLocationDesc: 'Ascensor exterior en la Salida 5 y conexión subterránea directa a los ascensores de Lotte Gwangbok (Salidas 8 y 10)',
      avgMovementTime: 'Aprox. 6 min desde el andén hasta la calle',
      transferRouteDesc: 'Andén central (tipo isla) de la Línea 1; un único ascensor conecta el andén con el vestíbulo.',
      precautions: 'Para el Parque Yongdusan o el Puente de Yeongdo, puedes usar el ascensor de la Salida 5 o los ascensores internos de Lotte Department Store.'
    },
    FR: {
      name: 'Station Nampo',
      shortName: 'Nampo',
      recommendedExits: 'Sortie 5 (Ascenseur), Sorties 8 et 10 (Ascenseur Lotte Dept. Store)',
      elevatorLocationDesc: 'Ascenseur extérieur à la Sortie 5 et accès souterrain direct aux ascenseurs du grand magasin Lotte Gwangbok (Sorties 8 et 10)',
      avgMovementTime: 'Env. 6 min du quai jusqu’à la surface',
      transferRouteDesc: 'Quai central (Lignes 1) ; un ascenseur unique relie directement le quai à la mezzanine.',
      precautions: 'Pour le parc Yongdusan ou le pont de Yeongdo, utilisez l’ascenseur de la Sortie 5 ou les ascenseurs du grand magasin Lotte.'
    }
  },
  busan: {
    ES: {
      name: 'Estación de Busan (Metro)',
      shortName: 'Busan Stn.',
      recommendedExits: 'Salidas 4, 6 y 8 (Ascensor — Conexión Plaza KTX Busan)',
      elevatorLocationDesc: 'Ascensores exteriores en las Salidas 4, 6 y 8 + ascensor subterráneo conectado con la estación KTX Busan',
      avgMovementTime: 'Aprox. 6–8 min hasta la estación KTX Busan',
      transferRouteDesc: 'Conectada con la estación de tren KTX Busan mediante pasillo subterráneo climatizado y ascensores hacia la plaza.',
      precautions: 'Para hacer transbordo al tren de alta velocidad KTX con maletas o cochecito, utiliza el ascensor de la Salida 4 o 8.'
    },
    FR: {
      name: 'Station Busan (Métro)',
      shortName: 'Gare de Busan',
      recommendedExits: 'Sorties 4, 6 et 8 (Ascenseur — Liaison Gare KTX de Busan)',
      elevatorLocationDesc: 'Ascenseurs directs vers la surface aux Sorties 4, 6 et 8 + liaison souterraine vers la gare KTX de Busan',
      avgMovementTime: 'Env. 6 à 8 min jusqu’à la gare KTX de Busan',
      transferRouteDesc: 'Reliée à la gare KTX de Busan par un passage souterrain et des ascenseurs donnant sur l’esplanade.',
      precautions: 'Pour rejoindre les trains à grande vitesse KTX avec des valises ou une poussette, empruntez l’ascenseur de la Sortie 4 ou 8.'
    }
  },
  suyeong: {
    ES: {
      name: 'Estación de Suyeong',
      shortName: 'Suyeong',
      recommendedExits: 'Ascensor (entre Salidas 4 y 6), Salida 5 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensor exterior situado en la acera entre las Salidas 4 y 6',
      avgMovementTime: 'Aprox. 6–7 min (incluyendo transbordo Líneas 2 y 3)',
      transferRouteDesc: 'Estación de transbordo entre las Líneas 2 y 3; equipada con ascensores internos directos entre ambos niveles.',
      precautions: 'El ascensor a la calle no está numerado como una salida independiente, sino ubicado entre las Salidas 4 y 6.'
    },
    FR: {
      name: 'Station Suyeong',
      shortName: 'Suyeong',
      recommendedExits: 'Ascenseur (entre Sorties 4 et 6), Sortie 5 (Escalator)',
      elevatorLocationDesc: 'Ascenseur extérieur situé sur le trottoir entre les Sorties 4 et 6',
      avgMovementTime: 'Env. 6 à 7 min (correspondance Lignes 2 et 3 incluse)',
      transferRouteDesc: 'Station de correspondance entre les Lignes 2 et 3, équipée d’ascenseurs internes reliant directement les quais.',
      precautions: 'L’ascenseur vers la chaussée se situe sur le trottoir entre les Sorties 4 et 6.'
    }
  },
  jagalchi: {
    ES: {
      name: 'Estación de Jagalchi',
      shortName: 'Jagalchi',
      recommendedExits: 'Salidas 7 y 10 (Ascensor), Salida 3 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensores exteriores junto a la Salida 7 (Plaza BIFF / Mercado Gukje) y Salida 10 (Mercado de Jagalchi)',
      avgMovementTime: 'Aprox. 5 min desde el andén hasta la calle',
      transferRouteDesc: 'Andén central de la Línea 1 con ascensor directo al vestíbulo.',
      precautions: 'Para el Mercado de Pescado de Jagalchi usa el ascensor de la Salida 10; para BIFF Square y el Mercado Gukje usa la Salida 7.'
    },
    FR: {
      name: 'Station Jagalchi',
      shortName: 'Jagalchi',
      recommendedExits: 'Sorties 7 et 10 (Ascenseur), Sortie 3 (Escalator)',
      elevatorLocationDesc: 'Ascenseurs extérieurs à la Sortie 7 (Place BIFF / Marché Gukje) et à la Sortie 10 (Marché aux poissons de Jagalchi)',
      avgMovementTime: 'Env. 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Quai central de la Ligne 1 avec ascenseur direct vers le hall.',
      precautions: 'Pour le marché de Jagalchi, prenez l’ascenseur de la Sortie 10 ; pour BIFF Square et le marché Gukje, prenez la Sortie 7.'
    }
  },
  geumnyeonsan: {
    ES: {
      name: 'Estación de Geumnyeonsan',
      shortName: 'Geumnyeonsan',
      recommendedExits: 'Salida 2 (Ascensor), Salidas 1 y 3 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensor exterior junto a la Salida 2',
      avgMovementTime: 'Aprox. 5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación de la Línea 2; comprueba el sentido del tren antes de pasar por los tornos.',
      precautions: 'La Salida 2 ofrece el camino más llano hacia el centro y sur de la Playa de Gwangalli.'
    },
    FR: {
      name: 'Station Geumnyeonsan',
      shortName: 'Geumnyeonsan',
      recommendedExits: 'Sortie 2 (Ascenseur), Sorties 1 et 3 (Escalator)',
      elevatorLocationDesc: 'Ascenseur extérieur situé à la Sortie 2',
      avgMovementTime: 'Env. 5 min du quai jusqu’à la chaussée',
      transferRouteDesc: 'Station de la Ligne 2 ; vérifiez la direction du train avant les portillons.',
      precautions: 'La Sortie 2 offre l’accès le plus plat vers le centre et le sud de la plage de Gwangalli.'
    }
  },
  dongbaek: {
    ES: {
      name: 'Estación de Dongbaek',
      shortName: 'Dongbaek',
      recommendedExits: 'Salida 1 (Ascensor), Salidas 2 y 3 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensor exterior situado en la Salida 1',
      avgMovementTime: 'Aprox. 5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación de la Línea 2 con ascensores internos entre andenes y vestíbulo.',
      precautions: 'Desde la Salida 1, el paseo hasta The Bay 101 y la Isla Dongbaekseom dura unos 10 minutos por acera llana.'
    },
    FR: {
      name: 'Station Dongbaek',
      shortName: 'Dongbaek',
      recommendedExits: 'Sortie 1 (Ascenseur), Sorties 2 et 3 (Escalator)',
      elevatorLocationDesc: 'Ascenseur extérieur situé à la Sortie 1',
      avgMovementTime: 'Env. 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Station de la Ligne 2 équipée d’ascenseurs internes entre les quais et le hall.',
      precautions: 'Depuis la Sortie 1, comptez environ 10 minutes à pied sur un trottoir plat jusqu’à The Bay 101 et l’île de Dongbaekseom.'
    }
  },
  bexco: {
    ES: {
      name: 'Estación de BEXCO',
      shortName: 'BEXCO',
      recommendedExits: 'Salidas 1, 5, 7 y 9 (Ascensor), Salida 3 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensores exteriores en las Salidas 1, 5, 7 y 9 (conexión Línea 2 y Línea Donghae)',
      avgMovementTime: 'Aprox. 6–8 min (incluyendo pasillo de transbordo)',
      transferRouteDesc: 'Transbordo sin escalones entre la Línea 2 y la Línea Donghae mediante pasillo móvil y ascensores.',
      precautions: 'El pasillo de transbordo entre la Línea 2 y la Línea Donghae es largo; sigue las señales de ascensor hacia las Salidas 1 o 5.'
    },
    FR: {
      name: 'Station BEXCO',
      shortName: 'BEXCO',
      recommendedExits: 'Sorties 1, 5, 7 et 9 (Ascenseur), Sortie 3 (Escalator)',
      elevatorLocationDesc: 'Ascenseurs directs vers la surface aux Sorties 1, 5, 7 et 9 (liaison Ligne 2 et Ligne Donghae)',
      avgMovementTime: 'Env. 6 à 8 min (couloir de correspondance inclus)',
      transferRouteDesc: 'Correspondance sans marche entre la Ligne 2 et la Ligne Donghae via tapis roulant et ascenseurs.',
      precautions: 'Le couloir de correspondance entre la Ligne 2 et la Ligne Donghae est assez long ; suivez les panneaux d’ascenseur vers les Sorties 1 ou 5.'
    }
  },
  jungang: {
    ES: {
      name: 'Estación de Jungang',
      shortName: 'Jungang',
      recommendedExits: 'Salidas 12 y 14 (Ascensor)',
      elevatorLocationDesc: 'Ascensores exteriores situados junto a las Salidas 12 y 14',
      avgMovementTime: 'Aprox. 5 min desde el andén hasta la calle',
      transferRouteDesc: 'Andén central de la Línea 1 con ascensor directo al vestíbulo.',
      precautions: 'Las salidas impares (1–11) tienen escaleras; utiliza las Salidas 12 o 14 y cruza por el paso de peatones en superficie.'
    },
    FR: {
      name: 'Station Jungang',
      shortName: 'Jungang',
      recommendedExits: 'Sorties 12 et 14 (Ascenseur)',
      elevatorLocationDesc: 'Ascenseurs extérieurs situés aux Sorties 12 et 14',
      avgMovementTime: 'Env. 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Quai central de la Ligne 1 avec ascenseur direct vers la mezzanine.',
      precautions: 'Les sorties impaires comportent des escaliers ; utilisez les Sorties 12 ou 14 puis traversez au passage piéton en surface.'
    }
  },
  dadaepo: {
    ES: {
      name: 'Estación Playa de Dadaepo',
      shortName: 'Dadaepo Beach',
      recommendedExits: 'Salida 4 (Ascensor), Salidas 1, 2 y 3 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensor exterior en la Salida 4 (acceso directo al Parque de la Playa de Dadaepo)',
      avgMovementTime: 'Aprox. 4–5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación terminal de la Línea 1 con instalaciones modernas y amplios ascensores.',
      precautions: 'La Salida 4 te deja directamente frente a la Fuente Musical de los Sueños de Dadaepo y el paseo marítimo llano.'
    },
    FR: {
      name: 'Station Plage de Dadaepo',
      shortName: 'Dadaepo Beach',
      recommendedExits: 'Sortie 4 (Ascenseur), Sorties 1, 2 et 3 (Escalator)',
      elevatorLocationDesc: 'Ascenseur extérieur à la Sortie 4 (accès direct au parc côtier de Dadaepo)',
      avgMovementTime: 'Env. 4 à 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Terminus de la Ligne 1 doté d’installations modernes et d’ascenseurs spacieux.',
      precautions: 'La Sortie 4 débouche directement sur la fontaine musicale de Dadaepo et les promenades sur pilotis sans marche.'
    }
  },
  beomeosa: {
    ES: {
      name: 'Estación de Beomeosa',
      shortName: 'Beomeosa',
      recommendedExits: 'Salida 4 (Ascensor), Salidas 1 y 3 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensor exterior situado junto a la Salida 4',
      avgMovementTime: 'Aprox. 5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación de la Línea 1; para subir al Templo Beomeosa, toma el autobús 90 o taxi tras salir a la superficie.',
      precautions: 'Para tomar el autobús 90 hacia el Templo Beomeosa, sal por el ascensor de la Salida 4 y camina por la acera hacia la parada entre las Salidas 5 y 7.'
    },
    FR: {
      name: 'Station Beomeosa',
      shortName: 'Beomeosa',
      recommendedExits: 'Sortie 4 (Ascenseur), Sorties 1 et 3 (Escalator)',
      elevatorLocationDesc: 'Ascenseur extérieur situé à la Sortie 4',
      avgMovementTime: 'Env. 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Station de la Ligne 1 ; pour monter au temple Beomeosa, prenez le bus n° 90 ou un taxi depuis la surface.',
      precautions: 'Pour rejoindre l’arrêt du bus n° 90 vers le temple Beomeosa, sortez par l’ascenseur de la Sortie 4 puis longez le trottoir vers la ruelle entre les Sorties 5 et 7.'
    }
  },
  'centum-city': {
    ES: {
      name: 'Estación de Centum City',
      shortName: 'Centum City',
      recommendedExits: 'Salidas 2, 4 y 13 (Ascensor), Conexión subterránea directa a Shinsegae y Lotte',
      elevatorLocationDesc: 'Ascensores exteriores en las Salidas 2, 4 y 13 + ascensores internos de los Grandes Almacenes Shinsegae y Lotte',
      avgMovementTime: 'Aprox. 5 min (acceso directo bajo techo a los grandes almacenes)',
      transferRouteDesc: 'Conectada directamente desde el vestíbulo subterráneo con la entrada sin escalones de Shinsegae Centum City y Lotte.',
      precautions: 'En días de lluvia o calor, entra directamente desde el vestíbulo subterráneo a Shinsegae Department Store y usa sus amplios ascensores internos.'
    },
    FR: {
      name: 'Station Centum City',
      shortName: 'Centum City',
      recommendedExits: 'Sorties 2, 4 et 13 (Ascenseur), Accès souterrain direct à Shinsegae & Lotte',
      elevatorLocationDesc: 'Ascenseurs extérieurs aux Sorties 2, 4 et 13 + ascenseurs internes des grands magasins Shinsegae et Lotte',
      avgMovementTime: 'Env. 5 min (accès direct couvert aux grands magasins)',
      transferRouteDesc: 'Reliée directement de plain-pied depuis la mezzanine aux grands magasins Shinsegae Centum City et Lotte.',
      precautions: 'Par temps de pluie, entrez directement dans le grand magasin Shinsegae depuis le niveau souterrain et utilisez ses grands ascenseurs.'
    }
  },
  sasang: {
    ES: {
      name: 'Estación de Sasang',
      shortName: 'Sasang',
      recommendedExits: 'Salida 3 (Ascensor y Escalera mecánica), Salida 4 (Ascensor), Tren ligero LRT Salida 2 (Ascensor)',
      elevatorLocationDesc: 'Ascensor y escalera mecánica en la Salida 3, ascensor en la Salida 4, y ascensor/escalera mecánica en LRT Salida 2',
      avgMovementTime: 'Aprox. 6–8 min (incluyendo transbordo al Tren ligero del Aeropuerto de Gimhae)',
      transferRouteDesc: 'Nodo de conexión entre la Línea 2, el Tren ligero Busan-Gimhae (hacia el Aeropuerto Internacional de Gimhae) y la Terminal de Autobuses del Oeste.',
      precautions: 'La Salida 1 solo tiene escaleras y la Salida 2 solo escalera mecánica; con maletas grandes o cochecito utiliza la Salida 3, la Salida 4 o LRT Salida 2.'
    },
    FR: {
      name: 'Station Sasang',
      shortName: 'Sasang',
      recommendedExits: 'Sortie 3 (Ascenseur & Escalator), Sortie 4 (Ascenseur), Métro léger LRT Sortie 2 (Ascenseur)',
      elevatorLocationDesc: 'Ascenseur et escalator à la Sortie 3, ascenseur à la Sortie 4, et ascenseur/escalator à la Sortie 2 du métro léger LRT',
      avgMovementTime: 'Env. 6 à 8 min (correspondance vers l’aéroport de Gimhae incluse)',
      transferRouteDesc: 'Pôle d’échange entre la Ligne 2, le métro léger Busan-Gimhae (vers l’aéroport international de Gimhae) et le terminal de bus Ouest.',
      precautions: 'La Sortie 1 ne comporte que des escaliers et la Sortie 2 uniquement un escalator ; avec des valises ou une poussette, privilégiez les Sorties 3, 4 ou LRT Sortie 2.'
    }
  },
  toseong: {
    ES: {
      name: 'Estación de Toseong',
      shortName: 'Toseong',
      recommendedExits: 'Salidas 2 y 4 (Ascensor), Salida 6 (Escalera mecánica — Parada de bus a Gamcheon)',
      elevatorLocationDesc: 'Ascensores exteriores en las Salidas 2 y 4 (conectado al Hospital Universitario de Pusan)',
      avgMovementTime: 'Aprox. 5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación de la Línea 1; para ir a la Aldea Cultural de Gamcheon, sube por el ascensor de la Salida 4 y camina por la acera llana hasta la parada de autobús frente a la Salida 6.',
      precautions: 'La Salida 6 solo cuenta con escalera mecánica; con cochecito o silla de ruedas utiliza el ascensor de la Salida 4 y avanza 1 minuto por la acera hasta la Salida 6.'
    },
    FR: {
      name: 'Station Toseong',
      shortName: 'Toseong',
      recommendedExits: 'Sorties 2 et 4 (Ascenseur), Sortie 6 (Escalator — Arrêt de bus pour Gamcheon)',
      elevatorLocationDesc: 'Ascenseurs extérieurs aux Sorties 2 et 4 (devant l’hôpital universitaire de Pusan)',
      avgMovementTime: 'Env. 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Station de la Ligne 1 ; pour le village culturel de Gamcheon, prenez l’ascenseur de la Sortie 4 puis marchez sur le trottoir plat jusqu’à l’arrêt de bus devant la Sortie 6.',
      precautions: 'La Sortie 6 n’ayant qu’un escalator, utilisez l’ascenseur de la Sortie 4 avec une poussette ou un fauteuil roulant.'
    }
  },
  osiria: {
    ES: {
      name: 'Estación de Osiria',
      shortName: 'Osiria',
      recommendedExits: 'Salida 1 (Vestíbulo en planta baja sin escalones), Ascensor de la pasarela peatonal a Lotte World',
      elevatorLocationDesc: 'Ascensores internos entre los andenes (2.ª planta) y el vestíbulo en planta baja (1.ª planta)',
      avgMovementTime: 'Aprox. 4 min desde el andén hasta la plaza exterior',
      transferRouteDesc: 'El vestíbulo y los tornos de la Estación de Osiria están en la planta baja (1F): una vez bajes del andén en ascensor, saldrás directamente a la calle por la Salida 1 sin ningún escalón.',
      precautions: 'Para cruzar hacia Lotte World Adventure Busan, utiliza el ascensor de la pasarela peatonal frente a la Salida 1.'
    },
    FR: {
      name: 'Station Osiria',
      shortName: 'Osiria',
      recommendedExits: 'Sortie 1 (Hall au rez-de-chaussée de plain-pied), Ascenseur de la passerelle vers Lotte World',
      elevatorLocationDesc: 'Ascenseurs internes reliant les quais (2e étage) au hall du rez-de-chaussée (1er étage)',
      avgMovementTime: 'Env. 4 min du quai jusqu’à l’esplanade',
      transferRouteDesc: 'Le hall et les portillons de la station Osiria sont situés au rez-de-chaussée (1F) : après être descendu du quai en ascenseur, vous sortez directement sur le trottoir par la Sortie 1 sans aucune marche.',
      precautions: 'Pour rejoindre Lotte World Adventure Busan, empruntez l’ascenseur de la passerelle piétonne située face à la Sortie 1.'
    }
  },
  songjeong: {
    ES: {
      name: 'Estación de Songjeong',
      shortName: 'Songjeong',
      recommendedExits: 'Salidas 1 y 2 (Vestíbulo en planta baja sin escalones)',
      elevatorLocationDesc: 'Ascensores internos que conectan los andenes directamente con el vestíbulo en planta baja',
      avgMovementTime: 'Aprox. 4 min desde el andén hasta la calle',
      transferRouteDesc: 'El vestíbulo de la Estación de Songjeong (Línea Donghae) está a nivel de calle (planta baja): tras usar el ascensor del andén, las Salidas 1 y 2 conectan directamente con la acera sin escalones.',
      precautions: 'Desde las Salidas 1 y 2 puedes caminar por acera llana hacia la Playa de Songjeong y la estación del Tren Costero Haeundae Blueline Park.'
    },
    FR: {
      name: 'Station Songjeong',
      shortName: 'Songjeong',
      recommendedExits: 'Sorties 1 et 2 (Hall au rez-de-chaussée de plain-pied)',
      elevatorLocationDesc: 'Ascenseurs internes reliant directement les quais au hall du rez-de-chaussée',
      avgMovementTime: 'Env. 4 min du quai jusqu’à la chaussée',
      transferRouteDesc: 'Le hall de la station Songjeong (Ligne Donghae) est de plain-pied au rez-de-chaussée : depuis l’ascenseur du quai, les Sorties 1 et 2 donnent directement sur le trottoir sans marche.',
      precautions: 'Depuis les Sorties 1 et 2, rejoignez facilement la plage de Songjeong et le train côtier Haeundae Blueline Park par un trottoir plat.'
    }
  },
  namcheon: {
    ES: {
      name: 'Estación de Namcheon',
      shortName: 'Namcheon',
      recommendedExits: 'Salida 4 (Ascensor), Salida 1 (Escalera mecánica)',
      elevatorLocationDesc: 'Ascensor exterior situado junto a la Salida 4',
      avgMovementTime: 'Aprox. 4–5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación de la Línea 2 con andenes laterales; el ascensor exterior se encuentra en la Salida 4.',
      precautions: 'Para visitar la famosa calle de panaderías de Namcheon-dong (Bbangcheon-dong) o el extremo sur de Gwangalli sin escalones, utiliza el ascensor de la Salida 4.'
    },
    FR: {
      name: 'Station Namcheon',
      shortName: 'Namcheon',
      recommendedExits: 'Sortie 4 (Ascenseur), Sortie 1 (Escalator)',
      elevatorLocationDesc: 'Ascenseur extérieur situé à la Sortie 4',
      avgMovementTime: 'Env. 4 à 5 min du quai jusqu’à la surface',
      transferRouteDesc: 'Station de la Ligne 2 à quais latéraux ; l’ascenseur vers la surface est situé à la Sortie 4.',
      precautions: 'Pour visiter la rue des boulangeries de Namcheon-dong (Bbangcheon-dong) ou le sud de la plage de Gwangalli sans marche, prenez l’ascenseur de la Sortie 4.'
    }
  },
  oncheonjang: {
    ES: {
      name: 'Estación de Oncheonjang',
      shortName: 'Oncheonjang',
      recommendedExits: 'Salidas 1, 3 y 5 (Ascensor), Salidas 2 y 4 (Rampa accesible sin escalones)',
      elevatorLocationDesc: 'Ascensores en las Salidas 1, 3 y 5 + rampas suaves junto a las escaleras en las Salidas 2 y 4',
      avgMovementTime: 'Aprox. 4–5 min desde el andén hasta la calle',
      transferRouteDesc: 'Estación elevada de la Línea 1; del andén (2F) bajas en ascensor al vestíbulo (1F) y sales por rampa o ascensor a la calle.',
      precautions: 'Las Salidas 2 y 4 cuentan con rampas accesibles junto a las escaleras para que cochecitos y sillas de ruedas salgan sin escalones.'
    },
    FR: {
      name: 'Station Oncheonjang',
      shortName: 'Oncheonjang',
      recommendedExits: 'Sorties 1, 3 et 5 (Ascenseur), Sorties 2 et 4 (Rampe d’accès sans marche)',
      elevatorLocationDesc: 'Ascenseurs aux Sorties 1, 3 et 5 + rampes d’accès douces à côté des escaliers aux Sorties 2 et 4',
      avgMovementTime: 'Env. 4 à 5 min du quai jusqu’à la chaussée',
      transferRouteDesc: 'Station aérienne de la Ligne 1 ; descendez du quai (2F) au hall (1F) en ascenseur puis sortez par rampe ou ascenseur.',
      precautions: 'Les Sorties 2 et 4 disposent de rampes inclinées à côté des marches permettant aux poussettes et fauteuils roulants de sortir sans escalier.'
    }
  }
};

export function getStationLocalized(station: Station, lang: Language): StationLocalizedContent | null {
  if (lang === 'JA' || lang === 'ZH_TW' || lang === 'ZH_CN') {
    return STATION_TRANSLATIONS[station.id]?.[lang] || null;
  }
  if (lang === 'ES' || lang === 'FR') {
    return STATION_TRANSLATIONS_ES_FR[station.id]?.[lang] || null;
  }
  return null;
}

export function getLocalizedStationTitle(station: Station, lang: Language, short = false): string {
  if (lang === 'KR') return station.name;
  if (lang === 'EN') return station.englishName || station.name;
  if (lang === 'JA' || lang === 'ZH_TW' || lang === 'ZH_CN') {
    const loc = STATION_TRANSLATIONS[station.id]?.[lang];
    if (loc) return short ? loc.shortName : loc.name;
  }
  if (lang === 'ES' || lang === 'FR') {
    const loc = STATION_TRANSLATIONS_ES_FR[station.id]?.[lang];
    if (loc) return short ? loc.shortName : loc.name;
  }
  return station.englishName || station.name;
}

export function formatLineLabelI18n(line: string, lang: Language): string {
  const key = String(line).trim();
  if (lang === 'KR') {
    if (key === '동해') return '동해선';
    if (key === '김해') return '부산김해경전철';
    return `${key}호선`;
  }
  if (lang === 'JA') {
    if (key === '동해') return '東海線';
    if (key === '김해') return '釜山金海軽電鉄';
    return `${key}号線`;
  }
  if (lang === 'ZH_TW') {
    if (key === '동해') return '東海線';
    if (key === '김해') return '釜山金海輕軌';
    return `${key}號線`;
  }
  if (lang === 'ZH_CN') {
    if (key === '동해') return '东海线';
    if (key === '김해') return '釜山金海轻轨';
    return `${key}号线`;
  }
  if (lang === 'ES') {
    if (key === '동해') return 'Línea Donghae';
    if (key === '김해') return 'Tren ligero Gimhae';
    return `Línea ${key}`;
  }
  if (lang === 'FR') {
    if (key === '동해') return 'Ligne Donghae';
    if (key === '김해') return 'Métro léger Gimhae';
    return `Ligne ${key}`;
  }
  // EN
  if (key === '동해') return 'Donghae Line';
  if (key === '김해') return 'Busan-Gimhae LRT';
  return `Line ${key}`;
}

export function formatExitNumberI18n(exitNumber: string, lang: Language): string {
  if (lang === 'KR') {
    return exitNumber.includes('출구') || exitNumber.includes('엘리베이터') ? exitNumber : `${exitNumber} 출구`;
  }

  // 1. Elevator between Exits X and Y: "엘리베이터 (4·6번 출구 사이)"
  const elevatorMatch = exitNumber.match(/엘리베이터\s*\((\d+)[·, ]+(\d+)번\s*출구\s*사이\)/);
  if (elevatorMatch) {
    const [, a, b] = elevatorMatch;
    if (lang === 'JA') return `エレベーター（${a}・${b}番出口の間）`;
    if (lang === 'ZH_TW') return `電梯（${a}・${b}號出口之間）`;
    if (lang === 'ZH_CN') return `直梯（${a}・${b}号出口之间）`;
    if (lang === 'ES') return `Ascensor (entre Salidas ${a} y ${b})`;
    if (lang === 'FR') return `Ascenseur (entre Sorties ${a} et ${b})`;
    return `Elevator (between Exits ${a} & ${b})`;
  }

  // 2. Underground Shopping Mall exits
  if (exitNumber.includes('서면지하도상가 부전몰')) {
    const num = exitNumber.match(/(\d+)번/);
    const n = num ? num[1] : '';
    if (lang === 'JA') return `西面地下街 釜田モール ${n}番出口`;
    if (lang === 'ZH_TW') return `西面地下街 釜田Mall ${n}號出口`;
    if (lang === 'ZH_CN') return `西面地下商街 釜田Mall ${n}号出口`;
    if (lang === 'ES') return `Bujeon Mall Salida ${n} (Subterráneo Seomyeon)`;
    if (lang === 'FR') return `Bujeon Mall Sortie ${n} (Souterrain Seomyeon)`;
    return `Bujeon Mall Exit ${n} (Seomyeon Underground)`;
  }
  if (exitNumber.includes('부산역지하쇼핑센터')) {
    const num = exitNumber.match(/(\d+)번/);
    const n = num ? num[1] : '';
    if (lang === 'JA') return `釜山駅地下ショッピングセンター ${n}番出口`;
    if (lang === 'ZH_TW') return `釜山站地下購物中心 ${n}號出口`;
    if (lang === 'ZH_CN') return `釜山站地下购物中心 ${n}号出口`;
    return `Busan Station Underground Shopping Exit ${n}`;
  }
  if (exitNumber.includes('남포지하쇼핑센터')) {
    const num = exitNumber.match(/(\d+)번/);
    const n = num ? num[1] : '';
    if (lang === 'JA') return `南浦地下ショッピングセンター ${n}番出口`;
    if (lang === 'ZH_TW') return `南浦地下購物中心 ${n}號出口`;
    if (lang === 'ZH_CN') return `南浦地下购物中心 ${n}号出口`;
    return `Nampo Underground Shopping Exit ${n}`;
  }

  // 3. Busan KTX Station Exit
  if (exitNumber.includes('부산KTX역')) {
    const num = exitNumber.match(/(\d+)번/);
    const n = num ? num[1] : '';
    if (lang === 'JA') return `KTX釜山駅 ${n}番出口`;
    if (lang === 'ZH_TW') return `KTX釜山站 ${n}號出口`;
    if (lang === 'ZH_CN') return `KTX釜山站 ${n}号出口`;
    if (lang === 'ES') return `Estación KTX Busan Salida ${n}`;
    if (lang === 'FR') return `Gare KTX de Busan Sortie ${n}`;
    return `Busan KTX Station Exit ${n}`;
  }

  // 4. Double Exit linked to department store
  if (exitNumber.includes('8번 10번 출구')) {
    if (lang === 'JA') return '8・10番出口（ロッテ百貨店光復店直結）';
    if (lang === 'ZH_TW') return '8・10號出口（直通樂天百貨光復店）';
    if (lang === 'ZH_CN') return '8・10号出口（直通乐天百货光复店）';
    if (lang === 'ES') return 'Salidas 8 y 10 (Conectado a Lotte Dept. Store)';
    if (lang === 'FR') return 'Sorties 8 et 10 (Relié au grand magasin Lotte)';
    return 'Exits 8 & 10 (Connected to Lotte Dept. Store)';
  }

  // 4b. Gimhae LRT Exit
  const lrtMatch = exitNumber.match(/경전철\s*(\d+)번\s*출구/);
  if (lrtMatch) {
    const n = lrtMatch[1];
    if (lang === 'JA') return `金海軽電鉄 ${n}番出口`;
    if (lang === 'ZH_TW') return `金海輕軌 ${n}號出口`;
    if (lang === 'ZH_CN') return `金海轻轨 ${n}号出口`;
    if (lang === 'ES') return `LRT Gimhae Salida ${n}`;
    if (lang === 'FR') return `LRT Gimhae Sortie ${n}`;
    return `Gimhae LRT Exit ${n}`;
  }

  // 4c. Overpass Elevator
  if (exitNumber.includes('보행육교 엘리베이터')) {
    if (lang === 'JA') return '歩道橋エレベーター';
    if (lang === 'ZH_TW') return '行人天橋電梯';
    if (lang === 'ZH_CN') return '过街天桥直梯';
    if (lang === 'ES') return 'Ascensor de pasarela peatonal';
    if (lang === 'FR') return 'Ascenseur de passerelle piétonne';
    return 'Overpass Elevator';
  }

  // 4d. Paired Exits with optional (경사로)
  const pairRampMatch = exitNumber.match(/(\d+)번[,·\s]+(\d+)번\s*출구\s*\(경사로\)/);
  if (pairRampMatch) {
    const [, a, b] = pairRampMatch;
    if (lang === 'JA') return `${a}・${b}番出口（スロープ）`;
    if (lang === 'ZH_TW') return `${a}・${b}號出口（緩坡道）`;
    if (lang === 'ZH_CN') return `${a}・${b}号出口（缓坡道）`;
    if (lang === 'ES') return `Salidas ${a} y ${b} (Rampa)`;
    if (lang === 'FR') return `Sorties ${a} et ${b} (Rampe)`;
    return `Exits ${a} & ${b} (Ramp)`;
  }
  const pairMatch = exitNumber.match(/(\d+)번[,·\s]+(\d+)번\s*출구/);
  if (pairMatch) {
    const [, a, b] = pairMatch;
    if (lang === 'JA') return `${a}・${b}番出口`;
    if (lang === 'ZH_TW') return `${a}・${b}號出口`;
    if (lang === 'ZH_CN') return `${a}・${b}号出口`;
    if (lang === 'ES') return `Salidas ${a} y ${b}`;
    if (lang === 'FR') return `Sorties ${a} et ${b}`;
    return `Exits ${a} & ${b}`;
  }

  // 4e. Single Exit with (엘리베이터) or (경사로)
  const elevSuffixMatch = exitNumber.match(/(\d+)번\s*출구\s*\(엘리베이터\)/);
  if (elevSuffixMatch) {
    const n = elevSuffixMatch[1];
    if (lang === 'JA') return `${n}番出口（エレベーター）`;
    if (lang === 'ZH_TW') return `${n}號出口（電梯）`;
    if (lang === 'ZH_CN') return `${n}号出口（直梯）`;
    if (lang === 'ES') return `Salida ${n} (Ascensor)`;
    if (lang === 'FR') return `Sortie ${n} (Ascenseur)`;
    return `Exit ${n} (Elevator)`;
  }
  const rampSuffixMatch = exitNumber.match(/(\d+)번\s*출구\s*\(경사로\)/);
  if (rampSuffixMatch) {
    const n = rampSuffixMatch[1];
    if (lang === 'JA') return `${n}番出口（スロープ）`;
    if (lang === 'ZH_TW') return `${n}號出口（緩坡道）`;
    if (lang === 'ZH_CN') return `${n}号出口（缓坡道）`;
    if (lang === 'ES') return `Salida ${n} (Rampa)`;
    if (lang === 'FR') return `Sortie ${n} (Rampe)`;
    return `Exit ${n} (Ramp)`;
  }

  // 5. Normal Exit: "X번 출구"
  const normalMatch = exitNumber.match(/(\d+)번\s*출구/);
  if (normalMatch) {
    const n = normalMatch[1];
    if (lang === 'JA') return `${n}番出口`;
    if (lang === 'ZH_TW') return `${n}號出口`;
    if (lang === 'ZH_CN') return `${n}号出口`;
    if (lang === 'ES') return `Salida ${n}`;
    if (lang === 'FR') return `Sortie ${n}`;
    return `Exit ${n}`;
  }

  return exitNumber;
}

const LANDMARK_TERMS_I18N: Record<string, { JA: string; ZH_TW: string; ZH_CN: string }> = {
  '롯데백화점 부산본점': { JA: 'ロッテ百貨店 釜山本店', ZH_TW: '樂天百貨 釜山本店', ZH_CN: '乐天百货 釜山总店' },
  '롯데백화점 광복점': { JA: 'ロッテ百貨店 光復店', ZH_TW: '樂天百貨 光復店', ZH_CN: '乐天百货 光复店' },
  '롯데백화점 센텀시티점': { JA: 'ロッテ百貨店 センタムシティ店', ZH_TW: '樂天百貨 Centum City店', ZH_CN: '乐天百货 Centum City店' },
  '신세계백화점 센텀시티점': { JA: '新世界百貨店 センタムシティ店', ZH_TW: '新世界百貨 Centum City店', ZH_CN: '新世界百货 Centum City店' },
  '스파랜드': { JA: '新世界スパランド', ZH_TW: 'Spa Land 汗蒸幕', ZH_CN: 'Spa Land 汗蒸幕' },
  '롯데백화점': { JA: 'ロッテ百貨店', ZH_TW: '樂天百貨', ZH_CN: '乐天百货' },
  '롯데마트': { JA: 'ロッテマート', ZH_TW: '樂天超市', ZH_CN: '乐天超市' },
  '서면시장': { JA: '西面市場', ZH_TW: '西面市場', ZH_CN: '西面市场' },
  '부전시장': { JA: '釜田市場', ZH_TW: '釜田市場', ZH_CN: '釜田市场' },
  '부전전통시장': { JA: '釜田伝統市場', ZH_TW: '釜田傳統市場', ZH_CN: '釜田传统市场' },
  '자갈치시장': { JA: 'チャガルチ市場', ZH_TW: '札嘎其市場', ZH_CN: '札嘎其市场' },
  '자갈치 시장': { JA: 'チャガルチ市場', ZH_TW: '札嘎其市場', ZH_CN: '札嘎其市场' },
  '국제시장': { JA: '国際市場', ZH_TW: '國際市場', ZH_CN: '国际市场' },
  '부평깡통시장': { JA: '富平カントン市場', ZH_TW: '富平罐頭市場', ZH_CN: '富平罐头市场' },
  '해운대해수욕장': { JA: '海雲台海水浴場', ZH_TW: '海雲台海水浴場', ZH_CN: '海云台海水浴场' },
  '해운대 해수욕장': { JA: '海雲台海水浴場', ZH_TW: '海雲台海水浴場', ZH_CN: '海云台海水浴场' },
  '광안리해수욕장': { JA: '広安里海水浴場', ZH_TW: '廣安里海水浴場', ZH_CN: '广安里海水浴场' },
  '광안리 해수욕장': { JA: '広安里海水浴場', ZH_TW: '廣安里海水浴場', ZH_CN: '广安里海水浴场' },
  '다대포해수욕장': { JA: '多大浦海水浴場', ZH_TW: '多大浦海水浴場', ZH_CN: '多大浦海水浴场' },
  '다대포 해수욕장': { JA: '多大浦海水浴場', ZH_TW: '多大浦海水浴場', ZH_CN: '多大浦海水浴场' },
  '송정해수욕장': { JA: '松亭海水浴場', ZH_TW: '松亭海水浴場', ZH_CN: '松亭海水浴场' },
  '동백섬': { JA: '冬柏島', ZH_TW: '冬柏島', ZH_CN: '冬柏岛' },
  '더베이101': { JA: 'ザ・ベイ101', ZH_TW: 'The Bay 101', ZH_CN: 'The Bay 101' },
  '마린시티': { JA: 'マリンシティ', ZH_TW: 'Marine City', ZH_CN: 'Marine City' },
  '벡스코': { JA: 'BEXCO（ベクスコ）', ZH_TW: 'BEXCO 釜山會展中心', ZH_CN: 'BEXCO 釜山会展中心' },
  '부산시립미술관': { JA: '釜山市立美術館', ZH_TW: '釜山市立美術館', ZH_CN: '釜山市立美术馆' },
  '영화의전당': { JA: '映画の殿堂', ZH_TW: '電影殿堂', ZH_CN: '电影殿堂' },
  '영도대교': { JA: '影島大橋', ZH_TW: '影島大橋', ZH_CN: '影岛大桥' },
  '용두산공원': { JA: '龍頭山公園', ZH_TW: '龍頭山公園', ZH_CN: '龙头山公园' },
  '광복로 패션거리': { JA: '光復路ファッション通り', ZH_TW: '光復路時尚街', ZH_CN: '光复路时尚街' },
  '비프광장': { JA: 'BIFF広場', ZH_TW: 'BIFF廣場', ZH_CN: 'BIFF广场' },
  '비프거리(BIFF)': { JA: 'BIFF広場通り', ZH_TW: 'BIFF廣場街', ZH_CN: 'BIFF广场街' },
  '전포 카페거리': { JA: '田浦カフェ通り', ZH_TW: '田浦咖啡街', ZH_CN: '田浦咖啡街' },
  '전포카페거리': { JA: '田浦カフェ通り', ZH_TW: '田浦咖啡街', ZH_CN: '田浦咖啡街' },
  '부산시민공원': { JA: '釜山市民公園', ZH_TW: '釜山市民公園', ZH_CN: '釜山市民公园' },
  '감천문화마을': { JA: '甘川文化村', ZH_TW: '甘川文化村', ZH_CN: '甘川文化村' },
  '부산대학교병원': { JA: '釜山大学病院', ZH_TW: '釜山大學醫院', ZH_CN: '釜山大学医院' },
  '부산서부버스터미널': { JA: '釜山西部バスターミナル', ZH_TW: '釜山西部巴士客運站', ZH_CN: '釜山西部长途汽车站' },
  '김해국제공항': { JA: '金海国際空港', ZH_TW: '金海國際機場', ZH_CN: '金海国际机场' },
  '삼락생태공원': { JA: '三楽生態公園', ZH_TW: '三樂生態公園', ZH_CN: '三乐生态公园' },
  '롯데월드 어드벤처 부산': { JA: 'ロッテワールド・アドベンチャー釜山', ZH_TW: '釜山樂天世界', ZH_CN: '釜山乐天世界' },
  '국립부산과학관': { JA: '国立釜山科学館', ZH_TW: '國立釜山科學館', ZH_CN: '国立釜山科学馆' },
  '해동용궁사': { JA: '海東龍宮寺', ZH_TW: '海東龍宮寺', ZH_CN: '海东龙宫寺' },
  '남천동 빵천동(베이커리 거리)': { JA: '南川洞パンチョンドン（ベーカリー通り）', ZH_TW: '南川洞麵包街（麵包川洞）', ZH_CN: '南川洞面包街（面包川洞）' },
  '남천해변시장': { JA: '南川海辺市場', ZH_TW: '南川海濱市場', ZH_CN: '南川海滨市场' },
  '삼익비치타운': { JA: 'サムイクビーチタウン', ZH_TW: '三益海灘公寓', ZH_CN: '三益海滩公寓' },
  '광안리 해변 남단': { JA: '広安里ビーチ南端', ZH_TW: '廣安里海灘南端', ZH_CN: '广安里海滩南端' },
  '수영구청': { JA: '水営区庁', ZH_TW: '水營區廳', ZH_CN: '水营区厅' },
  '동래온천 거리': { JA: '東莱温泉通り', ZH_TW: '東萊溫泉街', ZH_CN: '东莱温泉街' },
  '동래온천 노천족욕탕': { JA: '東莱温泉 露天足湯', ZH_TW: '東萊溫泉 露天足浴湯', ZH_CN: '东莱温泉 露天足浴汤' },
  '허심청': { JA: '虚心庁（ホシムチョン）温泉', ZH_TW: '虛心廳溫泉', ZH_CN: '虚心厅温泉' },
  '금강공원(케이블카)': { JA: '金剛公園（ロープウェイ）', ZH_TW: '金剛公園（纜車）', ZH_CN: '金刚公园（缆车）' },
  '금강공원': { JA: '金剛公園', ZH_TW: '金剛公園', ZH_CN: '金刚公园' },
  '온천천 산책로': { JA: '温泉川（オンチョンチョン）散策路', ZH_TW: '溫泉川河濱步道', ZH_CN: '温泉川河滨步道' },
  '온천천 카페거리': { JA: '温泉川カフェ通り', ZH_TW: '溫泉川咖啡街', ZH_CN: '温泉川咖啡街' },
  '온천시장': { JA: '温泉市場', ZH_TW: '溫泉市場', ZH_CN: '温泉市场' },
  '차이나타운': { JA: 'チャイナタウン', ZH_TW: '中華街（唐人街）', ZH_CN: '中华街（唐人街）' },
  '초량 이바구길': { JA: '草梁イバグ길', ZH_TW: '草梁故事路', ZH_CN: '草梁故事路' },
  '방면': { JA: '方面', ZH_TW: '方向', ZH_CN: '方向' },
  '계단 옆 완만한 경사로 완비': { JA: '階段横に緩やかなスロープ完備', ZH_TW: '階梯旁設有平緩無障礙坡道', ZH_CN: '楼梯旁设有平缓无障碍坡道' },
};

export function translateExitDirectionI18n(exit: ExitInfo, lang: Language): string {
  if (lang === 'KR') return exit.directionDesc;
  if (lang === 'EN') return exit.directionDescEn || exit.directionDesc;
  if (lang === 'ES') {
    const base = (exit.directionDescEn || exit.directionDesc)
      .replace(/^Toward\s+/i, 'Hacia ')
      .replace(/\bBeach\b/gi, 'Playa')
      .replace(/\bMarket\b/gi, 'Mercado')
      .replace(/\bPark\b/gi, 'Parque')
      .replace(/\bBridge\b/gi, 'Puente')
      .replace(/\bHospital\b/gi, 'Hospital')
      .replace(/\bUniversity\b/gi, 'Universidad')
      .replace(/\bMuseum\b/gi, 'Museo')
      .replace(/\bStreet\b/gi, 'Calle')
      .replace(/\bStation\b/gi, 'Estación')
      .replace(/\bRamp\b/gi, 'Rampa accesible');
    return base.startsWith('Hacia ') ? base : `Hacia ${base}`;
  }
  if (lang === 'FR') {
    const base = (exit.directionDescEn || exit.directionDesc)
      .replace(/^Toward\s+/i, 'Vers ')
      .replace(/\bBeach\b/gi, 'Plage')
      .replace(/\bMarket\b/gi, 'Marché')
      .replace(/\bPark\b/gi, 'Parc')
      .replace(/\bBridge\b/gi, 'Pont')
      .replace(/\bHospital\b/gi, 'Hôpital')
      .replace(/\bUniversity\b/gi, 'Université')
      .replace(/\bMuseum\b/gi, 'Musée')
      .replace(/\bStreet\b/gi, 'Rue')
      .replace(/\bStation\b/gi, 'Gare/Station')
      .replace(/\bRamp\b/gi, 'Rampe d’accès');
    return base.startsWith('Vers ') ? base : `Vers ${base}`;
  }

  let text = exit.directionDesc || '';
  for (const [kr, trans] of Object.entries(LANDMARK_TERMS_I18N)) {
    if (text.includes(kr)) {
      text = text.split(kr).join(trans[lang]);
    }
  }
  // If still mostly Korean and directionDescEn exists, provide clean hybrid or localized version
  if (/[가-힣]{3,}/.test(text) && exit.directionDescEn) {
    let enText = exit.directionDescEn;
    if (lang === 'JA') {
      enText = enText.replace(/^Toward\s+/i, '').replace(/\s*&\s*/g, '・') + ' 方面';
    } else if (lang === 'ZH_TW') {
      enText = '往 ' + enText.replace(/^Toward\s+/i, '').replace(/\s*&\s*/g, '、') + ' 方向';
    } else if (lang === 'ZH_CN') {
      enText = '往 ' + enText.replace(/^Toward\s+/i, '').replace(/\s*&\s*/g, '、') + ' 方向';
    }
    return enText;
  }
  return text;
}

export function translateExitTipI18n(exit: ExitInfo, lang: Language): string {
  if (lang === 'KR') return exit.tip;
  if (lang === 'EN') return exit.tipEn || exit.tip;

  const exitLabel = formatExitNumberI18n(exit.number, lang);
  const dirLabel = translateExitDirectionI18n(exit, lang);

  if (lang === 'JA') {
    if (exit.hasElevator && exit.hasEscalator) {
      return `${exitLabel}にはエレベーターとエスカレーターの両方が設置されており、ベビーカー・車椅子・大型スーツケースでも段差なしで快適に移動できます。（${dirLabel}）`;
    }
    if (exit.hasElevator) {
      return `${exitLabel}の地上直結エレベーターを利用して、改札階から歩道まで階段なしでスムーズに出入りできます。（${dirLabel}）`;
    }
    if (exit.hasEscalator) {
      return `${exitLabel}にはエスカレーターが設置されており、スーツケースや徒歩での移動に便利です。（${dirLabel}）`;
    }
    if (exit.isAccessible) {
      return `${exitLabel}には階段のすぐ横にベビーカー・車椅子がそのまま通れる緩やかなバリアフリースロープが設置されており、段差なしで移動できます。（${dirLabel}）`;
    }
  }

  if (lang === 'ZH_TW') {
    if (exit.hasElevator && exit.hasEscalator) {
      return `${exitLabel}同時設有電梯與電扶梯，無論推嬰兒車、輪椅或攜帶大型行李箱皆可免爬樓梯輕鬆進出。（${dirLabel}）`;
    }
    if (exit.hasElevator) {
      return `可搭乘${exitLabel}的地面直達電梯，從穿堂層免爬階梯直接抵達平坦人行道。（${dirLabel}）`;
    }
    if (exit.hasEscalator) {
      return `${exitLabel}設有電扶梯，方便攜帶隨身行李與步行旅客快速進出。（${dirLabel}）`;
    }
    if (exit.isAccessible) {
      return `${exitLabel}於階梯旁設有平緩的無障礙坡道（斜坡），嬰兒車與輪椅無需爬樓梯即可順暢進出。（${dirLabel}）`;
    }
  }

  if (lang === 'ZH_CN') {
    if (exit.hasElevator && exit.hasEscalator) {
      return `${exitLabel}同时配备无障碍直梯与自动扶梯，无论推婴儿车、轮椅或携带大件行李箱均可无台阶轻松进出。（${dirLabel}）`;
    }
    if (exit.hasElevator) {
      return `可乘坐${exitLabel}的地面直达电梯，从站厅层无台阶直接抵达平坦人行道。（${dirLabel}）`;
    }
    if (exit.hasEscalator) {
      return `${exitLabel}配备自动扶梯，方便携带随身行李与步行旅客快速进出。（${dirLabel}）`;
    }
    if (exit.isAccessible) {
      return `${exitLabel}在楼梯旁设有平缓的无障碍坡道（斜坡），婴儿车与轮椅无需爬楼即可顺畅进出。（${dirLabel}）`;
    }
  }

  if (lang === 'ES') {
    if (exit.hasElevator && exit.hasEscalator) {
      return `${exitLabel} cuenta con ascensor y escalera mecánica, permitiendo un acceso sin escalones para cochecitos de bebé, sillas de ruedas y maletas grandes. (${dirLabel})`;
    }
    if (exit.hasElevator) {
      return `Utiliza el ascensor directo a la calle en ${exitLabel} para salir desde el vestíbulo hasta la acera sin ningún escalón. (${dirLabel})`;
    }
    if (exit.hasEscalator) {
      return `${exitLabel} dispone de escalera mecánica, ideal para viajeros a pie o con equipaje de mano. (${dirLabel})`;
    }
    if (exit.isAccessible) {
      return `${exitLabel} cuenta con una rampa accesible de pendiente suave junto a las escaleras para cochecitos y sillas de ruedas. (${dirLabel})`;
    }
  }

  if (lang === 'FR') {
    if (exit.hasElevator && exit.hasEscalator) {
      return `La ${exitLabel} est équipée à la fois d’un ascenseur et d’un escalator pour un accès sans marche avec poussette, fauteuil roulant ou valises. (${dirLabel})`;
    }
    if (exit.hasElevator) {
      return `Empruntez l’ascenseur direct vers la surface à la ${exitLabel} pour rejoindre le trottoir sans aucune marche depuis la mezzanine. (${dirLabel})`;
    }
    if (exit.hasEscalator) {
      return `La ${exitLabel} dispose d’un escalator, pratique pour les piétons et les bagages légers. (${dirLabel})`;
    }
    if (exit.isAccessible) {
      return `La ${exitLabel} dispose d’une rampe d’accès douce à côté des escaliers, accessible aux poussettes et fauteuils roulants. (${dirLabel})`;
    }
  }

  return exit.tipEn || exit.tip;
}
