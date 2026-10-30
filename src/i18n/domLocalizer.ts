import { useLayoutEffect } from 'react';
import { Language } from './dictionary';
import staticPhraseCache from './staticPhraseCache.json';

type TargetLang = 'JA' | 'ZH_TW' | 'ZH_CN' | 'ES' | 'FR';
const ALL_TARGET_LANGS: TargetLang[] = ['JA', 'ZH_TW', 'ZH_CN', 'ES', 'FR'];

type LocalizedTargetMap = {
  JA: string;
  ZH_TW: string;
  ZH_CN: string;
  ES: string;
  FR: string;
};

/**
 * Curated Native Dictionary for UI headers, tabs, categories, course titles,
 * transit guides, calendar labels, and exploration articles across all views.
 * Resolves in 0ms synchronously with 100% domain-accurate native transit terminology.
 */
const EXACT_PHRASE_DICTIONARY: Record<string, LocalizedTargetMap> = {
  // Navigation & Common Actions
  'Home': { JA: 'ホーム', ZH_TW: '首頁', ZH_CN: '首页', ES: 'Inicio', FR: 'Accueil' },
  'Stations': { JA: '駅検索', ZH_TW: '車站搜尋', ZH_CN: '车站搜索', ES: 'Estaciones', FR: 'Stations' },
  'Transit': { JA: '交通ヒント', ZH_TW: '交通指南', ZH_CN: '交通指南', ES: 'Transporte', FR: 'Transports' },
  'Courses': { JA: 'おすすめコース', ZH_TW: '推薦路線', ZH_CN: '推荐路线', ES: 'Rutas', FR: 'Itinéraires' },
  'Schedule': { JA: 'イベント日程', ZH_TW: '慶典行事曆', ZH_CN: '庆典日程', ES: 'Eventos', FR: 'Agenda' },
  'Explore': { JA: '釜山探求生活', ZH_TW: '釜山探索生活', ZH_CN: '釜山探索生活', ES: 'Guía Local', FR: 'Guide Local' },
  'Back to Station Search': {
    JA: '他の地下鉄駅を検索（一覧へ）',
    ZH_TW: '返回地鐵站搜尋列表',
    ZH_CN: '返回地铁站搜索列表',
    ES: 'Volver a la lista de estaciones',
    FR: 'Retour à la liste des stations'
  },
  'Select Subway Station': {
    JA: '地下鉄駅を選択',
    ZH_TW: '選擇地鐵站',
    ZH_CN: '选择地铁站',
    ES: 'Seleccionar estación de metro',
    FR: 'Choisir une station de métro'
  },
  'Subway Exit Information Index': {
    JA: '釜山地下鉄 駅・出口バリアフリー案内',
    ZH_TW: '釜山地鐵站出口無障礙資訊總覽',
    ZH_CN: '釜山地铁站出口无障碍信息总览',
    ES: 'Índice de Salidas Accesibles del Metro de Busan',
    FR: 'Index des Sorties Accessibles du Métro de Busan'
  },
  'Analyze general escalators, elevator configurations across major transit sectors.': {
    JA: '釜山の主要22駅のエレベーター・エスカレーター・段差なし出口情報をひと目で比較・検索できます。',
    ZH_TW: '一目了然比較並搜尋釜山 22 個主要地鐵站的電梯、電扶梯與無階梯出口資訊。',
    ZH_CN: '一目了然比较并搜索釜山 22 个主要地铁站的直梯、扶梯与无台阶出口信息。',
    ES: 'Compara y busca de un vistazo los ascensores, escaleras mecánicas y salidas sin escalones de las 22 estaciones principales de Busan.',
    FR: 'Comparez et recherchez en un coup d’œil les ascenseurs, escalators et sorties sans marche des 22 principales stations de Busan.'
  },
  'Naver Map': { JA: 'NAVERマップ', ZH_TW: 'NAVER地圖', ZH_CN: 'NAVER地图', ES: 'Naver Map', FR: 'Naver Map' },
  'Google Maps': { JA: 'Googleマップ', ZH_TW: 'Google地圖', ZH_CN: 'Google地图', ES: 'Google Maps', FR: 'Google Maps' },
  'View on Naver Map': {
    JA: 'NAVERマップで見る',
    ZH_TW: '在 NAVER 地圖查看',
    ZH_CN: '在 NAVER 地图查看',
    ES: 'Ver en Naver Map',
    FR: 'Voir sur Naver Map'
  },
  'View on Google Maps': {
    JA: 'Googleマップで見る',
    ZH_TW: '在 Google 地圖查看',
    ZH_CN: '在 Google 地图查看',
    ES: 'Ver en Google Maps',
    FR: 'Voir sur Google Maps'
  },
  'Normal': { JA: '通常運行', ZH_TW: '正常運行', ZH_CN: '正常运行', ES: 'En servicio', FR: 'En service' },
  'Service': { JA: '点検中', ZH_TW: '維護檢修', ZH_CN: '维护检修', ES: 'Mantenimiento', FR: 'Maintenance' },
  'Stairs Only': { JA: '階段のみ', ZH_TW: '僅有樓梯', ZH_CN: '仅有楼梯', ES: 'Solo escaleras', FR: 'Escaliers uniquement' },

  // Transit Guide (대중교통 이용 팁) Headers & Cards
  'Busan Public Transit Guide': {
    JA: '釜山 公共交通＆タクシー利用ガイド',
    ZH_TW: '釜山大眾運輸＆計程車實用指南',
    ZH_CN: '釜山公共交通＆出租车实用指南',
    ES: 'Guía de Transporte Público de Busan',
    FR: 'Guide des Transports Publics de Busan'
  },
  'Busan Public Transit & Taxi Guide': {
    JA: '釜山 公共交通＆タクシー利用ガイド',
    ZH_TW: '釜山大眾運輸＆計程車實用指南',
    ZH_CN: '釜山公共交通＆出租车实用指南',
    ES: 'Guía de Transporte Público y Taxis de Busan',
    FR: 'Guide des Transports Publics & Taxis de Busan'
  },
  'Essential transit rules, transfer discounts, and luggage guidelines for traveling around Busan.': {
    JA: '釜山旅行で知っておくと便利な乗換割引・子ども無料特典・スーツケース持ち込み基準・タクシー呼び出しアプリまとめ。',
    ZH_TW: '釜山旅遊必知的轉乘優惠、兒童免費搭乘福利、公車大型行李攜帶規定與叫車 App 總整理。',
    ZH_CN: '釜山旅游必知的换乘优惠、儿童免费乘车福利、公交大件行李携带规定与打车 App 全整理。',
    ES: 'Reglas esenciales de transporte, descuentos por transbordo, límites de equipaje y apps de taxi para moverte por Busan.',
    FR: 'Règles essentielles, réductions de correspondance, bagages dans les bus et applications de taxi pour voyager à Busan.'
  },
  'All Children Free Benefit': {
    JA: 'すべての子ども（満6〜12歳）交通費無料',
    ZH_TW: '所有兒童（滿6～12歲）免費搭乘福利',
    ZH_CN: '所有儿童（满6～12岁）免费乘车福利',
    ES: 'Transporte gratuito para niños (6–12 años)',
    FR: 'Gratuité pour tous les enfants (6–12 ans)'
  },
  'Busan Bus QR Pay': {
    JA: '釜山バス QRコード決済（カード不要）',
    ZH_TW: '釜山公車 QR 掃碼乘車（免交通卡）',
    ZH_CN: '釜山公交 QR 扫码乘车（免交通卡）',
    ES: 'Pago con código QR en autobuses de Busan',
    FR: 'Paiement par QR Code dans les bus de Busan'
  },
  'Busan Transit Transfer Benefits': {
    JA: '釜山 地下鉄・バス広域乗換割引',
    ZH_TW: '釜山地鐵・公車廣域轉乘優惠',
    ZH_CN: '釜山地铁・公交广域换乘优惠',
    ES: 'Descuentos por transbordo Metro y Bus en Busan',
    FR: 'Réductions de correspondance Métro & Bus à Busan'
  },
  'Bus Carry-on Limits': {
    JA: '市内バス スーツケース・荷物持ち込み基準',
    ZH_TW: '市區公車 大型行李攜帶規定',
    ZH_CN: '市内公交 大件行李携带规定',
    ES: 'Límites de equipaje y maletas en autobuses',
    FR: 'Règles sur les valises et bagages dans les bus'
  },
  'Busan Taxi & Calling Apps': {
    JA: '釜山タクシー＆配車アプリ・福祉タクシー',
    ZH_TW: '釜山計程車＆叫車 App・無障礙計程車',
    ZH_CN: '釜山出租车＆打车 App・无障碍出租车',
    ES: 'Taxis en Busan, Apps y Taxis Accesibles',
    FR: 'Taxis à Busan, Applications & Taxis PMR'
  },
  'Details': { JA: '詳細を見る', ZH_TW: '查看詳情', ZH_CN: '查看详情', ES: 'Detalles', FR: 'Détails' },
  'Close': { JA: '閉じる', ZH_TW: '關閉', ZH_CN: '关闭', ES: 'Cerrar', FR: 'Fermer' },
  'ALLOWED / APPLIES TO': {
    JA: '対象・持ち込み可能なケース',
    ZH_TW: '適用對象 / 可攜帶範圍',
    ZH_CN: '适用对象 / 可携带范围',
    ES: 'PERMITIDO / SE APLICA A',
    FR: 'AUTORISÉ / S’APPLIQUE À'
  },
  'EXCLUSIONS / DISALLOWED': {
    JA: '対象外・制限されるケース',
    ZH_TW: '不適用 / 限制攜帶項目',
    ZH_CN: '不适用 / 限制携带项目',
    ES: 'EXCLUSIONES / NO PERMITIDO',
    FR: 'EXCLUSIONS / NON AUTORISÉ'
  },

  // Course Categories & Sub-tabs
  'All Courses': { JA: 'すべてのコース', ZH_TW: '所有路線', ZH_CN: '所有路线', ES: 'Todas las rutas', FR: 'Tous les parcours' },
  'Gourmet & Cafes': { JA: 'グルメ＆カフェ', ZH_TW: '美食＆咖啡廳', ZH_CN: '美食＆咖啡厅', ES: 'Gastronomía y Cafés', FR: 'Gastronomie & Cafés' },
  'Gourmet': { JA: '釜山グルメ', ZH_TW: '釜山美食', ZH_CN: '釜山美食', ES: 'Gastronomía', FR: 'Gastronomie' },
  'Attractions': { JA: '代表名所', ZH_TW: '必訪景點', ZH_CN: '必游景点', ES: 'Lugares imprescindibles', FR: 'Sites incontournables' },
  'Attraction': { JA: '代表名所', ZH_TW: '必訪景點', ZH_CN: '必游景点', ES: 'Atracciones', FR: 'Incontournables' },
  'Traditional Markets': { JA: '伝統市場ツアー', ZH_TW: '傳統市場巡禮', ZH_CN: '传统市场巡礼', ES: 'Mercados tradicionales', FR: 'Marchés traditionnels' },
  'Traditional Market': { JA: '伝統市場', ZH_TW: '傳統市場', ZH_CN: '传统市场', ES: 'Mercado tradicional', FR: 'Marché traditionnel' },
  'Markets': { JA: '伝統市場', ZH_TW: '傳統市場', ZH_CN: '传统市场', ES: 'Mercados', FR: 'Marchés' },
  'Market': { JA: '伝統市場', ZH_TW: '傳統市場', ZH_CN: '传统市场', ES: 'Mercado', FR: 'Marché' },
  'Experience & Museums': { JA: '体験＆ミュージアム', ZH_TW: '體驗＆博物館', ZH_CN: '体验＆博物馆', ES: 'Experiencias y Museos', FR: 'Expériences & Musées' },
  'Experience & Museum': { JA: '体験＆ミュージアム', ZH_TW: '體驗＆博物館', ZH_CN: '体验＆博物馆', ES: 'Experiencia y Museo', FR: 'Expérience & Musée' },
  'Experiences': { JA: '体験・展示', ZH_TW: '體驗・展覽', ZH_CN: '体验・展览', ES: 'Experiencias', FR: 'Expériences' },
  'Experience': { JA: '体験・展示', ZH_TW: '體驗・展覽', ZH_CN: '体验・展览', ES: 'Experiencia', FR: 'Expérience' },
  'By Duration': { JA: '日程別コース', ZH_TW: '依天數推薦', ZH_CN: '按天数推荐', ES: 'Por duración', FR: 'Par durée' },
  'Itinerary': { JA: '日程別コース', ZH_TW: '依天數行程', ZH_CN: '按天数行程', ES: 'Por duración', FR: 'Par durée' },
  'Itinerary by Duration': { JA: '日程別おすすめコース', ZH_TW: '依天數推薦行程', ZH_CN: '按天数推荐行程', ES: 'Itinerarios por duración', FR: 'Itinéraires par durée' },
  'Itinerary Travel': { JA: '日程別おすすめ旅行コース', ZH_TW: '依天數推薦旅遊行程', ZH_CN: '按天数推荐旅游行程', ES: 'Viajes por duración', FR: 'Voyages par durée' },
  'Subway Theme': { JA: '地下鉄テーマ旅', ZH_TW: '地鐵主題路線', ZH_CN: '地铁主题路线', ES: 'Rutas en metro', FR: 'Parcours en métro' },
  'Subway': { JA: '地下鉄コース', ZH_TW: '地鐵路線', ZH_CN: '地铁路线', ES: 'Rutas Metro', FR: 'Parcours Métro' },
  'Busan Metro Course': { JA: '釜山地下鉄テーマコース', ZH_TW: '釜山地鐵主題路線', ZH_CN: '釜山地铁主题路线', ES: 'Ruta en Metro de Busan', FR: 'Parcours en Métro de Busan' },
  'Barrier-Free': { JA: 'バリアフリー観光', ZH_TW: '無障礙友善景點', ZH_CN: '无障碍友好景点', ES: 'Turismo accesible', FR: 'Tourisme accessible' },
  'Barrier-Free Spots': { JA: 'バリアフリー観光地', ZH_TW: '無障礙開放景點', ZH_CN: '无障碍开放景点', ES: 'Lugares sin barreras', FR: 'Lieux accessibles' },
  'My Route': { JA: 'マイルート', ZH_TW: '我的行程', ZH_CN: '我的行程', ES: 'Mi ruta', FR: 'Mon parcours' },
  'My Travel Route': { JA: 'マイルート作成', ZH_TW: '自訂我的行程', ZH_CN: '定制我的行程', ES: 'Mi ruta de viaje', FR: 'Mon itinéraire' },
  'My Custom Route': { JA: 'マイルート作成', ZH_TW: '自訂我的行程', ZH_CN: '定制我的行程', ES: 'Mi ruta personalizada', FR: 'Mon parcours sur mesure' },
  'Custom Map': { JA: 'カスタム地図', ZH_TW: '自訂地圖', ZH_CN: '定制地图', ES: 'Mapa a medida', FR: 'Carte sur mesure' },
  'View Details >': { JA: '詳しく見る >', ZH_TW: '查看詳情 >', ZH_CN: '查看详情 >', ES: 'Ver detalles >', FR: 'Voir les détails >' },
  'View Map >': { JA: '地図を見る >', ZH_TW: '查看地圖 >', ZH_CN: '查看地图 >', ES: 'Ver mapa >', FR: 'Voir la carte >' },
  'Day Trip': { JA: '日帰りコース', ZH_TW: '一日遊', ZH_CN: '一日游', ES: 'Ruta de 1 día', FR: 'Excursion d’un jour' },
  '1 Night': { JA: '1泊2日', ZH_TW: '2天1夜', ZH_CN: '2天1晚', ES: '1 noche', FR: '1 nuit' },
  '2 Nights': { JA: '2泊3日', ZH_TW: '3天2夜', ZH_CN: '3天2晚', ES: '2 noches', FR: '2 nuits' },
  '3 Nights': { JA: '3泊4日', ZH_TW: '4天3夜', ZH_CN: '4天3晚', ES: '3 noches', FR: '3 nuits' },
  '1 Night 2 Days': { JA: '1泊2日コース', ZH_TW: '2天1夜', ZH_CN: '2天1晚', ES: '2 días / 1 noche', FR: '2 jours / 1 nuit' },
  '2 Nights 3 Days': { JA: '2泊3日コース', ZH_TW: '3天2夜', ZH_CN: '3天2晚', ES: '3 días / 2 noches', FR: '3 jours / 2 nuits' },
  '3 Nights 4 Days': { JA: '3泊4日コース', ZH_TW: '4天3夜', ZH_CN: '4天3晚', ES: '4 días / 3 noches', FR: '4 jours / 3 nuits' },
  '4 Nights 5 Days': { JA: '4泊5日コース', ZH_TW: '5天4夜', ZH_CN: '5天4晚', ES: '5 días / 4 noches', FR: '5 jours / 4 nuits' },

  // Transit Tips Sub-tabs
  'Subway & Bus Transfer': { JA: '地下鉄・バス乗換ガイド', ZH_TW: '地鐵・公車轉乘指南', ZH_CN: '地铁・公交换乘指南', ES: 'Transbordo Metro y Bus', FR: 'Correspondance Métro & Bus' },
  'Children Free Fare': { JA: '子ども交通費無料ガイド', ZH_TW: '兒童免費搭乘大眾運輸指南', ZH_CN: '儿童免费乘坐公共交通指南', ES: 'Tarifa gratuita infantil', FR: 'Gratuité enfants (6–12 ans)' },
  'Bus QR Payment': { JA: '市内バスQR決済ガイド', ZH_TW: '市區公車 QR 乘車付款指南', ZH_CN: '市内公交 QR 扫码乘车指南', ES: 'Pago con QR en autobuses', FR: 'Paiement par QR dans les bus' },
  'Call Taxi & Voucher Taxi': { JA: 'コールタクシー・福祉タクシー', ZH_TW: '叫車＆無障礙計程車指南', ZH_CN: '叫车＆无障碍出租车指南', ES: 'Taxis adaptados y especiales', FR: 'Taxis adaptés & transport PMR' },
  'Taxi & Special Transit': { JA: 'タクシー＆交通弱者支援', ZH_TW: '計程車＆無障礙接駁', ZH_CN: '出租车＆无障碍接驳', ES: 'Taxis y transporte accesible', FR: 'Taxis & mobilité réduite' },

  // Busan Exploration (부산 탐구생활)
  'Busan Exploration': { JA: '釜山探求生活（ローカルお得情報）', ZH_TW: '釜山探索生活（在地實用秘訣）', ZH_CN: '釜山探索生活（本地实用秘籍）', ES: 'Secretos Locales de Busan', FR: 'Astuces Locales de Busan' },
  'Free Luggage Storage': { JA: '無料荷物預かり所まとめ', ZH_TW: '免費行李寄放處總整理', ZH_CN: '免费行李寄存处全整理', ES: 'Consignas de equipaje gratuitas', FR: 'Consignes à bagages gratuites' },
  'Free Stroller & Wheelchair Rental': { JA: 'ベビーカー・車椅子 無料レンタル', ZH_TW: '嬰兒車・輪椅免費租借處', ZH_CN: '婴儿车・轮椅免费租借处', ES: 'Préstamo gratuito de cochecitos y sillas de ruedas', FR: 'Prêt gratuit de poussettes et fauteuils roulants' },
  '10-Min Free Metro Re-entry': { JA: '地下鉄 反対ホーム誤入場10分無料再入場', ZH_TW: '地鐵走錯月台 10 分鐘內免費重進站', ZH_CN: '地铁走错站台 10 分钟内免费重进站', ES: 'Reingreso gratuito al metro en 10 min', FR: 'Réentrée gratuite au métro sous 10 min' },
  '5-Second Korean Cheat Codes': { JA: '5秒で使える韓国語フレーズ', ZH_TW: '5秒學會超實用韓語發音秘訣', ZH_CN: '5秒学会超实用韩语发音秘籍', ES: 'Frases útiles en coreano en 5 segundos', FR: 'Phrases coréennes essentielles en 5 secondes' },

  // Footer & Legal
  'Step-free transit exits and curated local travel tips for Busan.': {
    JA: '階段のない安全な移動ルートと地元ならではの旅行ヒントをお届けする、釜山バリアフリー地下鉄ガイド。',
    ZH_TW: '提供無階梯安全移動路線與在地旅遊秘訣的釜山無障礙地鐵指南。',
    ZH_CN: '提供无台阶安全出行路线与本地旅游秘籍的釜山无障碍地铁指南。',
    ES: 'Guía de salidas de metro sin escalones y recomendaciones locales verificadas para viajar por Busan.',
    FR: 'Guide des sorties de métro sans marche et conseils locaux vérifiés pour voyager à Busan.'
  },
  'Agencies & Community': { JA: '関連機関＆コミュニティ', ZH_TW: '相關機構＆社群', ZH_CN: '相关机构＆社区', ES: 'Organismos y Comunidad', FR: 'Organismes & Communauté' },
  'Reddit Community': { JA: 'Redditコミュニティ', ZH_TW: 'Reddit 旅遊社群', ZH_CN: 'Reddit 旅游社区', ES: 'Comunidad en Reddit', FR: 'Communauté Reddit' },
  'Operator & Inquiries': { JA: '運営者情報・お問い合わせ', ZH_TW: '營運者資訊與聯絡', ZH_CN: '运营者信息与联系', ES: 'Sobre el proyecto y contacto', FR: 'À propos & Contact' },
  'For comments or suggesting accessibility paths, contact the support team.': {
    JA: 'データの修正リクエストやバリアフリー経路の情報提供は、いつでもお気軽にお問い合わせください。',
    ZH_TW: '若有任何資料更正建議或無障礙路線回報，歡迎隨時與我們聯繫。',
    ZH_CN: '若有任何数据更正建议或无障碍路线反馈，欢迎随时与我们联系。',
    ES: 'Para sugerir rutas accesibles o corregir datos de estaciones, escríbenos en cualquier momento.',
    FR: 'Pour suggérer un itinéraire accessible ou signaler une mise à jour, contactez-nous à tout moment.'
  },
  'Contact Us': { JA: 'お問い合わせ', ZH_TW: '聯絡我們', ZH_CN: '联系我们', ES: 'Contáctanos', FR: 'Nous contacter' },
  'Operator': { JA: '👤 運営者紹介', ZH_TW: '👤 營運者介紹', ZH_CN: '👤 运营者介绍', ES: '👤 Sobre el creador', FR: '👤 À propos' },
  'Inquiries & Edits': { JA: '✉️ 情報修正・お問い合わせ', ZH_TW: '✉️ 勘誤回報與聯絡', ZH_CN: '✉️ 勘误反馈与联系', ES: '✉️ Contacto y sugerencias', FR: '✉️ Signalements & Contact' },
  'Privacy': { JA: '🔒 プライバシーポリシー', ZH_TW: '🔒 隱私權政策', ZH_CN: '🔒 隐私政策', ES: '🔒 Privacidad', FR: '🔒 Confidentialité' },
  'Terms': { JA: '📄 利用規約', ZH_TW: '📄 服務條款', ZH_CN: '📄 服务条款', ES: '📄 Términos', FR: '📄 Conditions' },
  'Data Sources': { JA: '📊 データ出典', ZH_TW: '📊 資料來源', ZH_CN: '📊 数据来源', ES: '📊 Fuentes de datos', FR: '📊 Sources des données' },
};

/**
 * Pattern replacements for common composite strings (Exit numbers, Lines, Walking times, etc.)
 */
function applyPatternLocalization(text: string, lang: TargetLang): string {
  let out = text;

  const trimmed = out.trim();
  if (EXACT_PHRASE_DICTIONARY[trimmed]) {
    return out.replace(trimmed, EXACT_PHRASE_DICTIONARY[trimmed][lang]);
  }

  if (lang === 'JA') {
    out = out
      .replace(/\bExits?\s+(\d+)\s*&\s*(\d+)\b/gi, '$1・$2番出口')
      .replace(/\bExit\s+(\d+)\b/gi, '$1番出口')
      .replace(/\bLine\s+1\b/gi, '1号線')
      .replace(/\bLine\s+2\b/gi, '2号線')
      .replace(/\bLine\s+3\b/gi, '3号線')
      .replace(/\bLine\s+4\b/gi, '4号線')
      .replace(/\bDonghae\s+Line\b/gi, '東海線')
      .replace(/\bGimhae\s+LRT\b/gi, '金海軽電鉄')
      .replace(/\b(\d+)\s*min\s+walk\b/gi, '徒歩約$1分')
      .replace(/\bApprox\.\s*(\d+)m\s+Away\s+on\s+Foot\b/gi, '現在地から徒歩約$1m')
      .replace(/\bAdd to My Route\b/gi, 'マイルートに追加')
      .replace(/\bAdded to Route\b/gi, '追加済み')
      .replace(/\bView Details\b/gi, '詳細を見る')
      .replace(/\bClose Details\b/gi, '閉じる')
      .replace(/\bStep-Free\b/gi, '段差なし')
      .replace(/\bWheelchair Accessible\b/gi, '車椅子対応')
      .replace(/\bStroller Friendly\b/gi, 'ベビーカー快適');
  } else if (lang === 'ZH_TW') {
    out = out
      .replace(/\bExits?\s+(\d+)\s*&\s*(\d+)\b/gi, '$1、$2號出口')
      .replace(/\bExit\s+(\d+)\b/gi, '$1號出口')
      .replace(/\bLine\s+1\b/gi, '1號線')
      .replace(/\bLine\s+2\b/gi, '2號線')
      .replace(/\bLine\s+3\b/gi, '3號線')
      .replace(/\bLine\s+4\b/gi, '4號線')
      .replace(/\bDonghae\s+Line\b/gi, '東海線')
      .replace(/\bGimhae\s+LRT\b/gi, '金海輕軌')
      .replace(/\b(\d+)\s*min\s+walk\b/gi, '步行約 $1 分鐘')
      .replace(/\bApprox\.\s*(\d+)m\s+Away\s+on\s+Foot\b/gi, '距離目前位置步行約 $1 公尺')
      .replace(/\bAdd to My Route\b/gi, '加入我的行程')
      .replace(/\bAdded to Route\b/gi, '已加入行程')
      .replace(/\bView Details\b/gi, '查看詳情')
      .replace(/\bClose Details\b/gi, '收起詳情')
      .replace(/\bStep-Free\b/gi, '無階梯')
      .replace(/\bWheelchair Accessible\b/gi, '輪椅友善')
      .replace(/\bStroller Friendly\b/gi, '嬰兒車友善');
  } else if (lang === 'ZH_CN') {
    out = out
      .replace(/\bExits?\s+(\d+)\s*&\s*(\d+)\b/gi, '$1、$2号出口')
      .replace(/\bExit\s+(\d+)\b/gi, '$1号出口')
      .replace(/\bLine\s+1\b/gi, '1号线')
      .replace(/\bLine\s+2\b/gi, '2号线')
      .replace(/\bLine\s+3\b/gi, '3号线')
      .replace(/\bLine\s+4\b/gi, '4号线')
      .replace(/\bDonghae\s+Line\b/gi, '东海线')
      .replace(/\bGimhae\s+LRT\b/gi, '金海轻轨')
      .replace(/\b(\d+)\s*min\s+walk\b/gi, '步行约 $1 分钟')
      .replace(/\bApprox\.\s*(\d+)m\s+Away\s+on\s+Foot\b/gi, '距当前位置步行约 $1 米')
      .replace(/\bAdd to My Route\b/gi, '加入我的行程')
      .replace(/\bAdded to Route\b/gi, '已加入行程')
      .replace(/\bView Details\b/gi, '查看详情')
      .replace(/\bClose Details\b/gi, '收起详情')
      .replace(/\bStep-Free\b/gi, '无台阶')
      .replace(/\bWheelchair Accessible\b/gi, '轮椅友好')
      .replace(/\bStroller Friendly\b/gi, '婴儿车友好');
  } else if (lang === 'ES') {
    out = out
      .replace(/\bExits?\s+(\d+)\s*&\s*(\d+)\b/gi, 'Salidas $1 y $2')
      .replace(/\bExit\s+(\d+)\b/gi, 'Salida $1')
      .replace(/\bLine\s+1\b/gi, 'Línea 1')
      .replace(/\bLine\s+2\b/gi, 'Línea 2')
      .replace(/\bLine\s+3\b/gi, 'Línea 3')
      .replace(/\bLine\s+4\b/gi, 'Línea 4')
      .replace(/\bDonghae\s+Line\b/gi, 'Línea Donghae')
      .replace(/\bGimhae\s+LRT\b/gi, 'Tren ligero Gimhae')
      .replace(/\b(\d+)\s*min\s+walk\b/gi, '$1 min a pie')
      .replace(/\bApprox\.\s*(\d+)m\s+Away\s+on\s+Foot\b/gi, 'Aprox. a $1 m a pie')
      .replace(/\bAdd to My Route\b/gi, 'Añadir a mi ruta')
      .replace(/\bAdded to Route\b/gi, 'Añadido a la ruta')
      .replace(/\bView Details\b/gi, 'Ver detalles')
      .replace(/\bClose Details\b/gi, 'Cerrar detalles')
      .replace(/\bStep-Free\b/gi, 'Sin escalones')
      .replace(/\bWheelchair Accessible\b/gi, 'Accesible en silla de ruedas')
      .replace(/\bStroller Friendly\b/gi, 'Apto para cochecitos');
  } else if (lang === 'FR') {
    out = out
      .replace(/\bExits?\s+(\d+)\s*&\s*(\d+)\b/gi, 'Sorties $1 et $2')
      .replace(/\bExit\s+(\d+)\b/gi, 'Sortie $1')
      .replace(/\bLine\s+1\b/gi, 'Ligne 1')
      .replace(/\bLine\s+2\b/gi, 'Ligne 2')
      .replace(/\bLine\s+3\b/gi, 'Ligne 3')
      .replace(/\bLine\s+4\b/gi, 'Ligne 4')
      .replace(/\bDonghae\s+Line\b/gi, 'Ligne Donghae')
      .replace(/\bGimhae\s+LRT\b/gi, 'Métro léger Gimhae')
      .replace(/\b(\d+)\s*min\s+walk\b/gi, '$1 min à pied')
      .replace(/\bApprox\.\s*(\d+)m\s+Away\s+on\s+Foot\b/gi, 'À env. $1 m à pied')
      .replace(/\bAdd to My Route\b/gi, 'Ajouter à mon itinéraire')
      .replace(/\bAdded to Route\b/gi, 'Ajouté à l’itinéraire')
      .replace(/\bView Details\b/gi, 'Voir les détails')
      .replace(/\bClose Details\b/gi, 'Fermer les détails')
      .replace(/\bStep-Free\b/gi, 'Sans marche')
      .replace(/\bWheelchair Accessible\b/gi, 'Accessible en fauteuil roulant')
      .replace(/\bStroller Friendly\b/gi, 'Adapté aux poussettes');
  }

  return out;
}

function polishNativeTerminology(joined: string, targetLang: TargetLang): string {
  if (!joined || !joined.trim()) return joined;
  if (targetLang === 'JA') {
    return joined
      .replace(/階段なし/g, '段差なし')
      .replace(/エレベータ\b/g, 'エレベーター');
  }
  if (targetLang === 'ZH_TW') {
    return joined
      .replace(/直梯/g, '電梯')
      .replace(/扶梯/g, '電扶梯')
      .replace(/婴儿车/g, '嬰兒車');
  }
  if (targetLang === 'ZH_CN') {
    return joined
      .replace(/電梯/g, '直梯')
      .replace(/電扶梯/g, '扶梯');
  }
  if (targetLang === 'ES') {
    return joined
      .replace(/\belevador\b/gi, 'ascensor')
      .replace(/\bSalida\s+(\d+)\b/g, 'Salida $1');
  }
  if (targetLang === 'FR') {
    return joined
      .replace(/\bSortie\s+(\d+)\b/g, 'Sortie $1');
  }
  return joined;
}

// Pre-populated in-memory cache with 1,050+ static UI phrases for 0ms instantaneous switching
const memCache: Record<TargetLang, Record<string, string>> = {
  JA: { ...(staticPhraseCache.JA as Record<string, string>) },
  ZH_TW: { ...(staticPhraseCache.ZH_TW as Record<string, string>) },
  ZH_CN: { ...(staticPhraseCache.ZH_CN as Record<string, string>) },
  ES: { ...(staticPhraseCache.ES as Record<string, string>) },
  FR: { ...(staticPhraseCache.FR as Record<string, string>) },
};

const cacheLoadedFlags: Record<TargetLang, boolean> = {
  JA: false,
  ZH_TW: false,
  ZH_CN: false,
  ES: false,
  FR: false,
};

function loadCache(lang: TargetLang): Record<string, string> {
  if (!cacheLoadedFlags[lang]) {
    cacheLoadedFlags[lang] = true;
    try {
      const raw = localStorage.getItem(`stepless_i18n_v4_${lang}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.assign(memCache[lang], parsed);
      }
    } catch {}
  }
  return memCache[lang];
}

function saveCache(lang: TargetLang, newEntries: Record<string, string>) {
  try {
    const raw = localStorage.getItem(`stepless_i18n_v4_${lang}`);
    const existing = raw ? JSON.parse(raw) : {};
    Object.assign(existing, newEntries);
    localStorage.setItem(`stepless_i18n_v4_${lang}`, JSON.stringify(existing));
  } catch {}
}

/**
 * Two-WeakMap state machine:
 * - `reactBaseTextMap`: What React most recently wrote into `textNode.nodeValue`
 * - `domLocalizedTextMap`: What `domLocalizer` most recently wrote into `textNode.nodeValue`
 */
const reactBaseTextMap = new WeakMap<Text, string>();
const domLocalizedTextMap = new WeakMap<Text, string>();
const inFlightTexts = new Set<string>();

/**
 * Translate a batch of up to 40 strings in a SINGLE HTTP request via clients5.google.com
 * (with automatic fallback to our own `/api/translate-batch` server endpoint).
 */
async function fetchBatchNaturalTranslations(
  texts: string[],
  targetLang: TargetLang
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (texts.length === 0) return result;

  const tl =
    targetLang === 'JA' ? 'ja' :
    targetLang === 'ZH_TW' ? 'zh-TW' :
    targetLang === 'ZH_CN' ? 'zh-CN' :
    targetLang === 'ES' ? 'es' : 'fr';

  const parseBatchData = (data: unknown) => {
    if (!Array.isArray(data)) return false;
    for (let i = 0; i < texts.length; i++) {
      const orig = texts[i];
      const item = data[i];
      if (Array.isArray(item) && typeof item[0] === 'string') {
        const translated = item[0];
        const detectedSrc = typeof item[1] === 'string' ? item[1].toLowerCase() : '';
        if (detectedSrc === tl.toLowerCase()) {
          result[orig] = orig;
        } else if (translated.trim().length > 0) {
          result[orig] = polishNativeTerminology(translated, targetLang);
        }
      } else if (typeof item === 'string' && item.trim().length > 0) {
        result[orig] = polishNativeTerminology(item, targetLang);
      }
    }
    return Object.keys(result).length > 0;
  };

  try {
    const params = new URLSearchParams();
    for (const t of texts) {
      params.append('q', t);
    }
    const res = await fetch(
      `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${tl}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (parseBatchData(data)) {
        return result;
      }
    }
  } catch {}

  try {
    const res = await fetch('/api/translate-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, tl }),
    });
    if (res.ok) {
      const data = await res.json();
      parseBatchData(data);
    }
  } catch {}

  return result;
}

function shouldTranslateTextNode(raw: string, lang: TargetLang): boolean {
  const t = raw.trim();
  if (t.length < 2) return false;
  if (/^[\d\s.,:/\-+~()%@#&*!?'"[\]{}|\\<>]+$/.test(t)) return false;
  if (/^(https?:\/\/|floreur88@|STEPLESS\s+IN\s+BUSAN$|STEPLESS$|IN\s+BUSAN$|KR$|EN$|JA$|ZH$|ES$|FR$)/i.test(t)) return false;

  if (/[가-힣]/.test(t)) return true;

  if (lang === 'JA') {
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(t) && !/[a-zA-Z]{3,}\s+[a-zA-Z]{3,}\s+[a-zA-Z]{3,}/.test(t)) {
      return false;
    }
  }

  if (lang === 'ZH_TW' || lang === 'ZH_CN') {
    if (/[\u4E00-\u9FFF]/.test(t) && !/[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/.test(t)) {
      return false;
    }
  }

  return /[a-zA-Z]{2,}/.test(t);
}

/**
 * React hook that keeps all visible DOM text nodes naturally localized
 * with 0ms synchronous `useLayoutEffect` execution before browser paint.
 */
export function useDomLocalizer(language: Language) {
  useLayoutEffect(() => {
    if (typeof document === 'undefined') return;

    let isCancelled = false;

    document.documentElement.lang =
      language === 'KR' ? 'ko' :
      language === 'JA' ? 'ja' :
      language === 'ZH_TW' ? 'zh-Hant' :
      language === 'ZH_CN' ? 'zh-Hans' :
      language === 'ES' ? 'es' :
      language === 'FR' ? 'fr' : 'en';

    const processDomTree = () => {
      if (isCancelled) return;
      const root = document.getElementById('root');
      if (!root) return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA' || tag === 'CODE') {
            return NodeFilter.FILTER_REJECT;
          }
          if (
            parent.closest('#header-logo-container') ||
            parent.closest('[translate="no"]') ||
            parent.closest('[data-no-localize="true"]') ||
            parent.closest('[aria-label="Language switcher"]') ||
            parent.closest('[aria-label="Select Language"]')
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const pendingNodes: { node: Text; base: string; normKey: string }[] = [];
      let current: Node | null = walker.nextNode();

      while (current) {
        const textNode = current as Text;
        const currentVal = textNode.nodeValue || '';

        if (!reactBaseTextMap.has(textNode) || currentVal !== domLocalizedTextMap.get(textNode)) {
          reactBaseTextMap.set(textNode, currentVal);
          domLocalizedTextMap.delete(textNode);
        }

        const baseText = reactBaseTextMap.get(textNode) ?? currentVal;

        if (language === 'KR' || language === 'EN') {
          if (domLocalizedTextMap.has(textNode)) {
            if (textNode.nodeValue !== baseText) {
              textNode.nodeValue = baseText;
            }
            domLocalizedTextMap.delete(textNode);
          }
        } else {
          const targetLang: TargetLang = language;
          const cache = loadCache(targetLang);
          const trimmed = baseText.trim();
          const normKey = trimmed.replace(/\s+/g, ' ');

          // Never localize the brand logo text "STEPLESS" / "IN BUSAN"
          if (/^(STEPLESS|IN\s+BUSAN|STEPLESS\s+IN\s+BUSAN)$/i.test(normKey)) {
            if (textNode.nodeValue !== baseText) {
              textNode.nodeValue = baseText;
            }
            domLocalizedTextMap.delete(textNode);
            current = walker.nextNode();
            continue;
          }

          const exactMatch = EXACT_PHRASE_DICTIONARY[trimmed] || EXACT_PHRASE_DICTIONARY[normKey];
          const cachedMatch = cache[trimmed] || cache[normKey];

          if (exactMatch) {
            const replaced = baseText.replace(trimmed, exactMatch[targetLang]);
            if (textNode.nodeValue !== replaced) {
              textNode.nodeValue = replaced;
            }
            domLocalizedTextMap.set(textNode, replaced);
          } else if (cachedMatch) {
            const replaced = baseText.replace(trimmed, cachedMatch);
            if (textNode.nodeValue !== replaced) {
              textNode.nodeValue = replaced;
            }
            domLocalizedTextMap.set(textNode, replaced);
          } else {
            const patterned = applyPatternLocalization(baseText, targetLang);
            if (patterned !== baseText) {
              if (textNode.nodeValue !== patterned) {
                textNode.nodeValue = patterned;
              }
              domLocalizedTextMap.set(textNode, patterned);
            }
            if (shouldTranslateTextNode(patterned, targetLang)) {
              pendingNodes.push({ node: textNode, base: baseText, normKey });
            }
          }
        }

        current = walker.nextNode();
      }

      if (language !== 'KR' && language !== 'EN' && pendingNodes.length > 0) {
        const targetLang: TargetLang = language;
        const cache = loadCache(targetLang);

        const uniqueToFetch: string[] = [];
        const seenInPass = new Set<string>();

        for (const item of pendingNodes) {
          const key = item.normKey;
          if (key && !cache[key] && !seenInPass.has(key) && !inFlightTexts.has(`${targetLang}:${key}`)) {
            seenInPass.add(key);
            uniqueToFetch.push(key);
            inFlightTexts.add(`${targetLang}:${key}`);
          }
        }

        if (uniqueToFetch.length > 0) {
          const CHUNK_SIZE = 40;
          const chunks: string[][] = [];
          for (let i = 0; i < uniqueToFetch.length; i += CHUNK_SIZE) {
            chunks.push(uniqueToFetch.slice(i, i + CHUNK_SIZE));
          }

          const newEntries: Record<string, string> = {};

          Promise.all(
            chunks.map(async (chunk) => {
              try {
                const batchMap = await fetchBatchNaturalTranslations(chunk, targetLang);
                for (const rawKey of chunk) {
                  inFlightTexts.delete(`${targetLang}:${rawKey}`);
                  if (batchMap[rawKey]) {
                    cache[rawKey] = batchMap[rawKey];
                    newEntries[rawKey] = batchMap[rawKey];
                  }
                }
              } catch {
                for (const rawKey of chunk) {
                  inFlightTexts.delete(`${targetLang}:${rawKey}`);
                }
              }
            })
          ).then(() => {
            if (isCancelled) return;
            if (Object.keys(newEntries).length > 0) {
              saveCache(targetLang, newEntries);
            }
            for (const item of pendingNodes) {
              const key = item.normKey;
              const trimmed = item.base.trim();
              if (cache[key] && item.node.isConnected) {
                const updated = item.base.replace(trimmed, cache[key]);
                if (item.node.nodeValue !== updated) {
                  item.node.nodeValue = updated;
                }
                domLocalizedTextMap.set(item.node, updated);
              }
            }

            // Pre-warm the other 4 languages in the background so switching to them is 0ms!
            for (const otherLang of ALL_TARGET_LANGS) {
              if (otherLang === targetLang) continue;
              const otherCache = loadCache(otherLang);
              const missingInOther = uniqueToFetch.filter(
                (k) => !otherCache[k] && !inFlightTexts.has(`${otherLang}:${k}`)
              );
              if (missingInOther.length > 0) {
                for (const k of missingInOther) inFlightTexts.add(`${otherLang}:${k}`);
                fetchBatchNaturalTranslations(missingInOther.slice(0, 40), otherLang)
                  .then((map) => {
                    for (const k of missingInOther) inFlightTexts.delete(`${otherLang}:${k}`);
                    Object.assign(otherCache, map);
                    saveCache(otherLang, map);
                  })
                  .catch(() => {
                    for (const k of missingInOther) inFlightTexts.delete(`${otherLang}:${k}`);
                  });
              }
            }
          });
        }
      }
    };

    processDomTree();

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        processDomTree();
      }, 16);
    });

    const root = document.getElementById('root');
    if (root) {
      observer.observe(root, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      isCancelled = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [language]);
}
