import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MapPin, ArrowRight } from 'lucide-react';

// --- 中英文案配置字典 ---
const t = {
  en: {
    nav: { portfolio: 'Portfolio', philosophy: 'Philosophy', map: 'Footprint', land: 'Acquisition', contact: 'Contact', lang: '中文' },
    hero: { subtitle: 'Pacific Northwest Premier Developer', title: <>Designed <br/>with Vision.</>, btn1: 'View Collection', btn2: 'Land Acquisition' },
    philosophy: {
      tag: 'Our Ethos',
      title: 'Building the Extraordinary',
      text: 'As a boutique developer with over a decade of industry expertise, our goal has never been mass production for the sake of profit. Instead, we dedicate our limited time to crafting a select few architectural masterpieces. From our roots in modern townhomes to our current focus on ultra-luxury single-family estates, our uncompromising pursuit of ultimate luxury and meticulous attention to detail remains our unwavering signature.'
    },
    map: { tag: 'Regional Presence', title: 'Market Footprint', text: 'Concentrated expertise in high-yield corridors. Every point represents a strategic commitment to architectural excellence and investor transparency.' },
    portfolio: { tag: 'Curated Collection', title: 'The Portfolio', subtitle: 'Boutique Developments', view: 'View Project' },
    land: { tag: 'Capital & Acquisitions', title: <>Unlock Your <br/>Land Value.</>, text: 'We specialize in turning raw land and underutilized properties into high-performance residential assets. Partner with Westwood for transparent, data-driven execution.', btn: 'Request Feasibility Study' },
    footer: { desc: <>Boutique Residential Development. <br/>Strategic Acquisitions. <br/>Visionary Capital Partnerships.</>, nav: 'Navigation', hq: 'Headquarters', rights: '© 2024 Westwood Homes Partners', links: ['Privacy', 'Terms', 'EOE'] },
    modal: { inquire: 'Inquire Now' }
  },
  zh: {
    nav: { portfolio: '作品集', philosophy: '品牌理念', map: '开发版图', land: '土地收购', contact: '联系我们', lang: 'EN' },
    hero: { subtitle: '太平洋西北地区顶尖开发商', title: <>构筑<br/>非凡愿景。</>, btn1: '探索作品', btn2: '土地收购' },
    philosophy: {
      tag: '品牌理念',
      title: '匠心筑造，成就非凡',
      text: '作为拥有十余年行业经验的精品（Boutique）开发商，我们的目标从未是流水线般地建造海量房屋以谋取利润。相反，我们倾注有限的时间，只为创造为数不多的传世精品。从现代联排别墅起步，到如今的高端独栋豪宅，对极致奢华与细节的执着追求，是我们立于不败之地的基石。'
    },
    map: { tag: '区域布局', title: '市场版图', text: '深耕高回报核心地段。地图上的每一个坐标，都代表着我们对卓越建筑品质与投资者透明度的战略承诺。' },
    portfolio: { tag: '精选系列', title: '作品集', subtitle: '精品开发项目', view: '查看项目' },
    land: { tag: '资本与收购', title: <>释放土地的<br/>真正价值。</>, text: '我们专注于将原始土地和未充分利用的房产，转化为高净值的优质住宅资产。与 Westwood 合作，实现透明、数据驱动的卓越执行。', btn: '申请评估' },
    footer: { desc: <>精品住宅开发 <br/>战略性土地收购 <br/>具有远见的资本合作</>, nav: '网站导航', hq: '总部位置', rights: '© 2024 Westwood Homes Partners 版权所有', links: ['隐私政策', '服务条款', '平等机会雇主'] },
    modal: { inquire: '立即咨询' }
  }
};

// --- 定制化高级灰 Google Map 滤镜样式 ---
const customMapStyles = [
  { featureType: "all", elementType: "geometry.fill", stylers: [{ weight: "2.00" }] },
  { featureType: "all", elementType: "geometry.stroke", stylers: [{ color: "#9c9c9c" }] },
  { featureType: "all", elementType: "labels.text", stylers: [{ visibility: "on" }] },
  { featureType: "landscape", elementType: "all", stylers: [{ color: "#f2f2f2" }] },
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "all", stylers: [{ saturation: -100 }, { lightness: 45 }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#eeeeee" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7b7b7b" }] },
  { featureType: "road", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "all", stylers: [{ visibility: "simplified" }] },
  { featureType: "road.arterial", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "all", stylers: [{ color: "#46bcec" }, { visibility: "on" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#e4ebec" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#070707" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] }
];

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lang, setLang] = useState('en');

  // 原生 Google Maps 引用
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200";
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 零依赖注入原生 Google Maps 脚本
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      // 注意：未来您可以直接在等号后面加上您的 API Key 来消除水印
      script.src = `https://maps.googleapis.com/maps/api/js?key=`; 
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsGoogleLoaded(true);
    }
  }, []);

  const navItems = [
    { key: 'portfolio', href: '#portfolio' },
    { key: 'philosophy', href: '#philosophy' },
    { key: 'map', href: '#map' },
    { key: 'land', href: '#land' },
  ];

  const projects = [
    {
      id: 1,
      isMarket: true, // 标记为在售
      coordinates: { lat: 47.565810, lng: -122.169190 }, 
      image: '/12811 SE 44th Pl.jpg',
      gallery: [
        '/12811 SE 44th Pl.jpg', '/12811 SE 44th Pl 1.jpg', '/12811 SE 44th Pl 2.jpg', '/12811 SE 44th Pl 3.jpg', 
        '/12811 SE 44th Pl 4.jpg', '/12811 SE 44th Pl 5.jpg', '/12811 SE 44th Pl 6.jpg', '/12811 SE 44th Pl 7.jpg', '/12811 SE 44th Pl 8.jpg'
      ],
      en: {
        name: '12811 SE 44th Pl', location: 'Bellevue, WA 98006', status: 'On Market', type: 'Single Family',
        shortStatus: 'On Market - $3,380,000',
        description: '4,040 sqft, modern single family luxury home.',
        highlights: ['Open floorplan', 'Luxury finish', 'Somerset schools', 'Plenty of natural light']
      },
      zh: {
        name: '12811 SE 44th Pl', location: 'Bellevue, WA 98006', status: '现房在售', type: '独栋别墅',
        shortStatus: '现房在售 - $3,380,000',
        description: '4,040平方英尺，现代奢华独栋别墅。',
        highlights: ['开放式布局', '奢华装潢', '萨默塞特学区', '采光充足']
      }
    },
    {
      id: 2,
      isMarket: true, // 标记为在售
      coordinates: { lat: 47.575931, lng: -122.382033 }, 
      image: '/3054 Fairmont Ave SW.jpg',
      gallery: [
        '/3054 Fairmont Ave SW.jpg', '/3054 Fairmont Ave SW 1.png', '/3054 Fairmont Ave SW 2.png', 
        '/3054 Fairmont Ave SW 3.png', '/3054 Fairmont Ave SW 4.png', '/3054 Fairmont Ave SW 5.png', '/3054 Fairmont Ave SW 6.png'
      ],
      en: {
        name: '3054 Fairmont Ave SW', location: 'Seattle, WA 98116', status: 'Finished in 2025, On Market', type: 'West Seattle ADU',
        shortStatus: 'On Market - $699,950',
        description: 'An exceptional opportunity to own a stylish, modern standalone new home in West Seattle’s coveted Admiral district. Nestled on a quiet residential block, this street-facing home offers its own driveway for convenient parking and is just a short walk to local schools, PCC, and Metropolitan Market. Enjoy being minutes from Alki Beach with quick access to I-5 and downtown Seattle. The bright main floor features an open kitchen and living area, powder room, in-ceiling speakers, and a pre-wired in-wall iPad control system for seamless modern living.',
        highlights: ['Admiral District', 'Private Driveway', 'Smart Home Ready', 'Open Concept']
      },
      zh: {
        name: '3054 Fairmont Ave SW', location: 'Seattle, WA 98116', status: '2025年完工, 现房在售', type: '西雅图西部独立住宅',
        shortStatus: '现房在售 - $699,950',
        description: '这是在西雅图西部备受追捧的Admiral社区拥有时尚现代独立新房的绝佳机会。这座临街住宅坐落在一个安静的街区，拥有专属的私人车道，步行即可到达当地学校、PCC 和大都会市场。距离Alki海滩仅几分钟路程，并可快速驶入I-5公路前往市中心。明亮的主楼层设有开放式厨房和起居区、化妆间、吸顶式扬声器，以及预装的入墙式iPad智能控制系统，带来无缝的现代生活体验。',
        highlights: ['尊贵社区位置', '专属私人车道', '全屋智能预装', '通透开放布局']
      }
    },
    {
      id: 3,
      isSold: true, // 标记为已售
      coordinates: { lat: 47.673010, lng: -122.298260 },
      image: '/6020 Oberlin.jpg',
      gallery: [
        '/6020 Oberlin.jpg', '/6020 Oberlin 1.jpg', '/6020 Oberlin 2.jpg', '/6020 Oberlin 3.jpg',
        '/6020 Oberlin4.jpg', '/6020 Oberlin 5.jpg', '/6020 Oberlin 6.jpg'
      ],
      en: {
        name: '6020 Oberlin Ave NE', location: 'Seattle, WA 98115', status: 'Sold at $3.1M (Sept 2023)', type: 'Single Family',
        shortStatus: 'Sold at $3.1M',
        description: 'A classic luxury residence in the desirable Hawthorne Hill neighborhood. This meticulously crafted 5-bedroom, 5-bathroom home features premium Sub-zero and Wolf appliances, heated bathroom floors, and an integrated sound system. Perfectly situated near top-tier dining and everyday conveniences with a built-in outdoor BBQ for seamless entertaining.',
        highlights: ['Premium Appliances', 'Heated Bathroom Floors', 'Smart Home Integration', 'Hawthorne Hill Location']
      },
      zh: {
        name: '6020 Oberlin Ave NE', location: 'Seattle, WA 98115', status: '已售出 $3.1M (2023年9月)', type: '独栋别墅',
        shortStatus: '已售出 $3.1M',
        description: '位于备受追捧的 Hawthorne Hill 社区的经典豪华住宅。这座精心打造的5卧5卫住宅配备了顶级的 Sub-zero 和 Wolf 电器、浴室地暖以及集成音响系统。位置优越，靠近顶级餐厅和便利设施，并配有嵌入式户外烧烤架，是家庭生活与娱乐的完美居所。',
        highlights: ['顶级厨房电器', '奢华浴室地暖', '全屋智能系统', '稀缺优质地段']
      }
    },
    {
      id: 4,
      isSold: true,
      coordinates: { lat: 47.669749, lng: -122.360876 },
      image: '/5607 3rd Ave NW.png',
      gallery: [
        '/5607 3rd Ave NW.png', '/5607 3rd Ave NW 1.png', '/5607 3rd Ave NW 2.png', '/5607 3rd Ave NW 3.png',
        '/5607 3rd Ave NW 4.png', '/5607 3rd Ave NW 5.png', '/5607 3rd Ave NW 6.png', '/5607 3rd Ave NW 7.png',
        '/5607 3rd Ave NW 8.png', '/5607 3rd Ave NW 9.png', '/5607 3rd Ave NW 10.png'
      ],
      en: {
        name: 'Woodland Luxury SFH', location: 'Seattle, WA 98107', status: 'Finished and sold in 2019', type: 'Single Family',
        shortStatus: 'Sold in 2019',
        description: 'A contemporary luxury single-family home in the Ballard neighborhood offering stunning views of the Olympic Mountains. This 4-bedroom, 3.5-bath residence features custom cabinetry, premium Sub-Zero and Wolf appliances, heated bathroom floors, and extensive smart home integrations including A/C and EV charging. The lower level includes a large recreation room with a wet bar, perfect for entertaining, all in a prime location with easy access to downtown and I-5.',
        highlights: ['Ballard Neighborhood', 'Olympic Mountain Views', 'Premium Appliances', 'Smart Home & EV Ready']
      },
      zh: {
        name: 'Woodland Luxury SFH', location: 'Seattle, WA 98107', status: '已完工并售出 (2019年)', type: '独栋别墅',
        shortStatus: '已售出 (2019)',
        description: '位于巴拉德（Ballard）社区的现代奢华独栋别墅，可饱览奥林匹克山的壮丽景色。这座拥有4卧3.5卫的住宅配备了定制橱柜、顶级的 Sub-Zero 和 Wolf 厨房电器、浴室地暖，以及包括空调和电车充电在内的全面智能家居配置。底层设有带水吧的宽敞娱乐室，是家庭聚会的理想场所。地理位置优越，靠近学校与商圈，可轻松前往市中心及I-5公路。',
        highlights: ['巴拉德优质社区', '奥林匹克山景', '顶级厨房电器', '全屋智能与电车充电']
      }
    },
    {
      id: 5,
      coordinates: { lat: 47.599420, lng: -122.296530 },
      image: '/321 MLK JR Way S.png',
      gallery: ['/321 MLK JR Way S.png', '/321 MLK JR Way S 2.png'],
      en: {
        name: '321 MLK Jr Way S', location: 'Seattle, WA 98144', status: 'Completed (2023)', type: 'Modern Townhouse',
        description: 'A flagship development in South Seattle, designed for modern urban professionals. This project emphasizes vertical living with massive floor-to-ceiling windows and premium rooftop spaces. The interior flow is optimized for natural light and contemporary art displays.',
        highlights: ['Lake Washington Views', 'Rooftop Entertaining', 'Modern Aesthetic', 'Eco-friendly Siding']
      },
      zh: {
        name: '321 MLK Jr Way S', location: 'Seattle, WA 98144', status: '已完工 (2023)', type: '现代联排别墅',
        description: '位于西雅图南部的旗舰开发项目，专为现代都市精英设计。该项目强调垂直生活空间，拥有巨大的落地窗和优质的屋顶活动空间。室内动线经过优化，以实现绝佳的自然采光。',
        highlights: ['华盛顿湖景', '屋顶娱乐区', '现代先锋美学', '环保外墙材料']
      }
    },
    {
      id: 6,
      coordinates: { lat: 47.598552, lng: -122.297606 },
      image: '/421 MLK JR WAY S.png',
      gallery: ['/421 MLK JR WAY S.png', '/421 MLK JR WAY S 1.png', '/421 MLK JR WAY S 2.png'],
      en: {
        name: '421 MLK Jr Way S', location: 'Seattle, WA 98144', status: 'Finished', type: 'Two Townhome Buildings',
        description: 'A beautifully finished modern townhouse offering 1,240 square feet of thoughtfully designed living space on a 1,015 square foot lot. Featuring 2 bedrooms and 2.5 bathrooms, this home maximizes space and comfort while offering exceptional urban convenience and a private rooftop retreat.',
        highlights: ['Convenient Location', 'Abundant Natural Light', 'Exceptional Floor Plan', 'Rooftop Deck']
      },
      zh: {
        name: '421 MLK Jr Way S', location: 'Seattle, WA 98144', status: '已完工', type: '双子联排别墅',
        description: '一座装修精美的现代联排别墅，在1,015平方英尺的占地上提供了1,240平方英尺精心设计的生活空间。拥有2间卧室和2.5间浴室，该住宅在提供卓越的都市便利性和私人屋顶露台的同时，将空间利用率和居住舒适度提升到了极致。',
        highlights: ['位置便利', '采光极佳', '优秀户型', '顶楼露台']
      }
    },
    {
      id: 7,
      coordinates: { lat: 47.551136, lng: -122.323364 },
      image: '/720 S Orcas St.png',
      gallery: ['/720 S Orcas St.png', '/720 S Orcas St 1.png'],
      en: {
        name: '720 S Orcas St', location: 'Seattle, WA 98108', status: 'Finished in 2020', type: 'Georgetown Townhouse',
        description: 'Located in the vibrant Georgetown neighborhood, this well-appointed 1,300 square foot townhouse sits on a 1,325 square foot lot. With 3 bedrooms and 2.5 bathrooms, it perfectly balances modern design efficiency with comfortable daily living, crowned by an expansive rooftop deck.',
        highlights: ['Convenient Location', 'Great Natural Light', 'Efficient Layout', 'Rooftop Deck']
      },
      zh: {
        name: '720 S Orcas St', location: 'Seattle, WA 98108', status: '2020年完工', type: '乔治城联排别墅',
        description: '这座设施齐全的1,300平方英尺联排别墅位于充满活力的乔治城（Georgetown）社区，占地1,325平方英尺。拥有3间卧室和2.5间浴室，完美平衡了现代空间设计与舒适的日常生活，并配有宽敞的顶层休闲露台。',
        highlights: ['位置便利', '采光充足', '经济型优户', '顶楼露台']
      }
    }
  ];

  // 构建并挂载原生互动地图和图钉
  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 47.6194, lng: -122.2336 },
        zoom: 11,
        styles: customMapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative'
      });
    }

    class HTMLMarker extends window.google.maps.OverlayView {
      constructor(position, proj) {
        super();
        this.position = position;
        this.proj = proj;
        
        const div = document.createElement('div');
        div.className = "transition-all duration-700 cursor-pointer z-20 group/pin absolute";
        div.style.transform = "translate(-50%, -50%)";

        // 如果项目在售，图钉使用翠绿色 (emerald-500)，否则使用高级灰 (slate-900)
        const markerColor = proj.isMarket ? "bg-emerald-500" : "bg-slate-900";
        // 浮层显示优先展示短售价信息，如果没有则显示原状态
        const displayStatus = proj[lang].shortStatus || proj[lang].status;

        div.innerHTML = `
          <div class="w-5 h-5 md:w-6 md:h-6 ${markerColor} rounded-full absolute -inset-0 animate-ping opacity-20"></div>
          <div class="w-5 h-5 md:w-6 md:h-6 ${markerColor} rounded-full relative z-10 border-[4px] md:border-[6px] border-white shadow-2xl group-hover/pin:scale-125 transition-transform duration-500"></div>
          
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 md:mb-6 bg-white px-6 md:px-8 py-4 md:py-5 shadow-3xl border border-slate-100 opacity-0 group-hover/pin:opacity-100 transition-all translate-y-4 group-hover/pin:translate-y-0 whitespace-nowrap z-30 pointer-events-none">
            <span class="text-[10px] md:text-[12px] uppercase tracking-[0.4em] font-black block mb-2">${proj[lang].name}</span>
            <span class="text-[9px] md:text-[10px] ${proj.isMarket ? 'text-emerald-600' : 'text-slate-400'} uppercase tracking-widest font-bold">${displayStatus}</span>
          </div>
        `;
        div.addEventListener('click', () => setSelectedProject(proj));
        this.div = div;
      }
      
      onAdd() {
        this.getPanes().overlayMouseTarget.appendChild(this.div);
      }
      
      draw() {
        const position = this.getProjection().fromLatLngToDivPixel(this.position);
        if (position) {
          this.div.style.left = position.x + 'px';
          this.div.style.top = position.y + 'px';
        }
      }
      
      onRemove() {
        if (this.div.parentNode) {
          this.div.parentNode.removeChild(this.div);
        }
      }
    }

    // 清除旧的标记，重绘新的标记 (用于中英文切换时更新文字)
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = projects.map(proj => {
      const marker = new HTMLMarker(proj.coordinates, proj);
      marker.setMap(mapInstanceRef.current);
      return marker;
    });

  }, [isGoogleLoaded, lang]);

  return (
    <div className={`min-h-screen bg-white font-sans text-slate-900 antialiased tracking-tight ${selectedProject ? 'overflow-hidden' : ''}`}>
      
      {/* --- Project Detail Modal --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-md transition-all duration-500">
          <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-y-auto relative rounded-sm shadow-2xl animate-in zoom-in-95">
            <button onClick={() => setSelectedProject(null)} className="fixed top-6 right-6 md:top-10 md:right-10 z-[110] p-3 md:p-4 bg-white/90 hover:bg-white rounded-full transition-all shadow-2xl border border-slate-100">
              <X size={24} />
            </button>
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-3/5 bg-slate-50 p-6 lg:p-16 space-y-6 md:space-y-10">
                <div className="aspect-[16/10] w-full overflow-hidden shadow-2xl border border-white">
                   <img src={selectedProject.image} className="w-full h-full object-cover" alt={selectedProject[lang].name} onError={handleImageError} />
                </div>
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  {selectedProject.gallery?.map((img, idx) => (
                    <div key={idx} className="aspect-square overflow-hidden shadow-lg hover:scale-105 transition-transform duration-700 bg-slate-200">
                      <img src={img} className="w-full h-full object-cover" alt={`Angle ${idx + 1}`} onError={handleImageError} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-2/5 p-8 lg:p-24 flex flex-col justify-center">
                <span className={`text-[10px] uppercase tracking-[0.5em] block mb-6 md:mb-8 font-bold ${selectedProject.isMarket ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {selectedProject[lang].shortStatus || selectedProject[lang].status}
                </span>
                <h2 className="text-4xl md:text-5xl font-light mb-6 md:mb-8 tracking-tighter leading-tight">{selectedProject[lang].name}</h2>
                <div className="flex items-center text-slate-500 text-[10px] mb-8 md:mb-12 tracking-[0.3em] uppercase font-bold">
                  <MapPin size={16} className="mr-3 text-slate-300" /> {selectedProject[lang].location}
                </div>
                <div className="w-12 md:w-16 h-px bg-slate-200 mb-8 md:mb-12"></div>
                <p className="text-slate-600 leading-relaxed font-light mb-12 md:mb-16 text-lg md:text-xl">{selectedProject[lang].description}</p>
                <div className="grid grid-cols-1 gap-y-4 md:gap-y-6 mb-16 md:mb-20">
                  {selectedProject[lang].highlights?.map((tag, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-1 h-1 bg-slate-900 rounded-full"></div>
                      <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-slate-600 font-bold">{tag}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-6 md:py-8 bg-slate-900 text-white uppercase tracking-[0.4em] text-[10px] font-black hover:bg-black transition-all shadow-2xl">
                  {t[lang].modal.inquire} <ArrowRight className="inline-block ml-4" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Navigation --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4 md:px-16 md:py-6 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent text-white'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <svg width="45" height="35" viewBox="0 0 40 30" fill="none" className={isScrolled ? 'stroke-black' : 'stroke-white'}>
              <path d="M2 28V18L12 12V2L22 8V20L38 24V28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex flex-col -space-y-1">
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] font-light">Homes</span>
              <span className="text-xl md:text-2xl font-bold tracking-tighter uppercase">Westwood</span>
            </div>
          </div>

          <div className="hidden md:flex space-x-12 items-center">
            {navItems.map((item) => (
              <a key={item.key} href={item.href} className={`text-[10px] uppercase tracking-[0.4em] font-black hover:opacity-40 transition-all ${isScrolled ? 'text-slate-900' : 'text-white'}`}>{t[lang].nav[item.key]}</a>
            ))}
            <button className={`px-10 py-3.5 border-2 text-[10px] uppercase tracking-[0.4em] font-black transition-all ${isScrolled ? 'border-black bg-black text-white hover:bg-transparent hover:text-black' : 'border-white hover:bg-white hover:text-black'}`}>
              {t[lang].nav.contact}
            </button>
            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className={`px-4 py-2 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isScrolled ? 'border-slate-300 text-slate-500 hover:text-black hover:border-black' : 'border-white/30 text-white/70 hover:text-white hover:border-white'}`}
            >
              {t[lang].nav.lang}
            </button>
          </div>
          
          <div className="md:hidden flex items-center space-x-4">
             <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className={`text-[10px] font-black ${isScrolled ? 'text-black' : 'text-white'}`}>{t[lang].nav.lang}</button>
             <button onClick={() => setMobileMenuOpen(true)} className={isScrolled ? 'text-black' : 'text-white'}><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <iframe
            src="https://player.vimeo.com/video/1168047428?background=1"
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
            frameBorder="0"
            allow="autoplay; fullscreen"
          ></iframe>
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 md:px-6">
          <span className="text-white/50 text-[9px] md:text-[11px] uppercase tracking-[0.8em] md:tracking-[1em] mb-6 md:mb-10 font-bold">{t[lang].hero.subtitle}</span>
          <h1 className="text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] text-white font-light tracking-tighter mb-12 md:mb-16 max-w-7xl leading-[1.15] md:leading-[1.1]">
            {t[lang].hero.title}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-10 w-full sm:w-auto px-6">
            <a href="#portfolio" className="w-full sm:w-auto px-8 md:px-16 py-5 md:py-7 bg-white text-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-[11px] font-black hover:bg-slate-200 transition-all shadow-2xl text-center">{t[lang].hero.btn1}</a>
            <a href="#land" className="w-full sm:w-auto px-8 md:px-16 py-5 md:py-7 bg-transparent border-2 border-white/40 text-white uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-[11px] font-black hover:bg-white hover:text-black transition-all text-center">{t[lang].hero.btn2}</a>
          </div>
        </div>
      </section>

      {/* --- Philosophy Section --- */}
      <section id="philosophy" className="py-32 md:py-40 px-6 md:px-16 bg-white flex flex-col items-center text-center">
         <div className="max-w-4xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.6em] text-slate-400 block mb-8 md:mb-10 font-black">{t[lang].philosophy.tag}</span>
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-10 md:mb-16 leading-tight text-slate-900">{t[lang].philosophy.title}</h2>
            <div className="w-12 h-px bg-slate-300 mx-auto mb-10 md:mb-16"></div>
            <p className={`text-slate-500 font-light leading-relaxed mx-auto ${lang === 'zh' ? 'text-lg md:text-2xl text-justify md:text-center' : 'text-xl md:text-3xl'}`}>
              {t[lang].philosophy.text}
            </p>
         </div>
      </section>

      {/* --- Market Presence (Native Interactive Google Map) --- */}
      <section id="map" className="py-32 md:py-40 px-6 md:px-16 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8 md:gap-12">
            <div className="max-w-3xl text-left">
              <span className="text-[10px] uppercase tracking-[0.6em] text-slate-400 block mb-6 md:mb-8 font-black underline underline-offset-[12px]">{t[lang].map.tag}</span>
              <h2 className="text-4xl md:text-7xl font-light tracking-tighter mb-6 md:mb-10 leading-tight">{t[lang].map.title}</h2>
              <p className="text-slate-500 text-lg md:text-xl font-light leading-relaxed">{t[lang].map.text}</p>
            </div>
          </div>
          
          <div className="relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[21/9] w-full bg-[#e4ebec] rounded-sm overflow-hidden border border-slate-200 shadow-2xl">
            {/* 这里的 div 将承载原生的 Google Map */}
            <div ref={mapRef} className="w-full h-full"></div>
            
            {!isGoogleLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-50">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 animate-pulse">Loading Map...</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- Portfolio Grid --- */}
      <section id="portfolio" className="py-32 md:py-40 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-32 border-b border-slate-100 pb-12 md:pb-20 gap-8">
            <div className="text-left">
              <span className="text-[10px] uppercase tracking-[0.6em] text-slate-400 block mb-6 md:mb-8 font-black">{t[lang].portfolio.tag}</span>
              <h2 className="text-5xl md:text-8xl font-light tracking-tighter leading-tight">{t[lang].portfolio.title}</h2>
            </div>
            <div className="flex items-center space-x-4 text-slate-300">
               <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold">{t[lang].portfolio.subtitle}</span>
               <div className="w-12 md:w-20 h-px bg-slate-200"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-12 md:gap-20 text-left">
            {projects.map((proj) => (
              <div key={proj.id} className="group cursor-pointer" onClick={() => setSelectedProject(proj)}>
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 mb-8 md:mb-12">
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-1000 z-10 flex items-center justify-center">
                      <span className="px-6 md:px-8 py-3 md:py-4 bg-white text-black text-[10px] md:text-[11px] uppercase tracking-[0.5em] font-black opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-10 group-hover:translate-y-0">{t[lang].portfolio.view}</span>
                  </div>
                  <img src={proj.image} className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-110" alt={proj[lang].name} onError={handleImageError} />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-slate-400 block font-bold">{proj[lang].type}</span>
                  <h3 className="text-2xl md:text-4xl font-light tracking-tight group-hover:text-slate-500 transition-colors leading-tight">{proj[lang].name}</h3>
                  
                  {/* 新增的动态价格/状态显示区域 */}
                  {(proj.isMarket || proj.isSold) && (
                    <div className="flex items-center text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
                      {proj.isMarket && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                      )}
                      <span className={proj.isMarket ? 'text-emerald-600' : 'text-slate-500'}>
                        {proj[lang].shortStatus}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-slate-400 text-[10px] md:text-[11px] pt-2 md:pt-6 uppercase tracking-[0.3em] font-bold"><MapPin size={14} className="mr-3 md:mr-4 text-slate-300" /> {proj[lang].location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Land Intake Section --- */}
      <section id="land" className="py-32 md:py-48 px-6 md:px-16 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-white/5 skew-x-0 md:skew-x-12 md:translate-x-48"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <span className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-[0.8em] md:tracking-[1em] mb-8 md:mb-12 block font-bold">{t[lang].land.tag}</span>
          <h2 className="text-4xl md:text-[8rem] font-light mb-10 md:mb-16 tracking-tighter leading-tight md:leading-[0.85]">{t[lang].land.title}</h2>
          <p className="text-white/50 text-lg md:text-2xl mb-16 md:mb-24 max-w-3xl mx-auto font-light leading-relaxed">{t[lang].land.text}</p>
          <button className="px-10 md:px-20 py-5 md:py-8 bg-white text-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-[12px] font-black hover:bg-slate-200 transition-all shadow-3xl">{t[lang].land.btn}</button>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 md:py-32 px-6 md:px-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 md:gap-24 text-left">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl md:text-3xl font-bold tracking-tighter uppercase mb-8 md:mb-12 flex items-center gap-4 md:gap-6">
               <svg width="30" height="22" viewBox="0 0 40 30" fill="none" className="stroke-black md:w-[40px] md:h-[30px]"><path d="M2 28V18L12 12V2L22 8V20L38 24V28" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
               Westwood
            </div>
            <p className="text-slate-400 text-[10px] md:text-xs leading-[2.5] uppercase tracking-[0.3em] font-bold max-w-md">{t[lang].footer.desc}</p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.6em] font-black text-slate-300 mb-8 md:mb-12">{t[lang].footer.nav}</h4>
            <ul className="space-y-4 md:space-y-6 text-[10px] md:text-[11px] font-black tracking-[0.4em] uppercase">
              {navItems.map(item => <li key={item.key}><a href={item.href} className="hover:opacity-30 transition-all">{t[lang].nav[item.key]}</a></li>)}
            </ul>
          </div>
          <div>
             <h4 className="text-[10px] uppercase tracking-[0.6em] font-black text-slate-300 mb-8 md:mb-12">{t[lang].footer.hq}</h4>
             <div className="text-[10px] md:text-[11px] font-bold tracking-[0.4em] uppercase space-y-6 md:space-y-8 leading-loose">
                <p className="text-slate-500">Bellevue, WA 98004 <br/>United States</p>
                <p className="border-b-2 border-slate-900 pb-2 inline-block">inquiries@westwood.com</p>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 md:mt-40 pt-8 md:pt-12 border-t border-slate-50 text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-slate-300 flex flex-col md:flex-row justify-between gap-6 md:gap-0">
          <span>{t[lang].footer.rights}</span>
          <span className="flex gap-6 md:gap-10">
            {t[lang].footer.links.map((link, i) => <a key={i} className="cursor-pointer hover:text-slate-500">{link}</a>)}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
