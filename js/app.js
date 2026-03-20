// app.js - Main SPA routing and logic
const wppNumber = "5531985082038";

let productsData = [];
let categoriesData = [
  { id: 'porta', name: 'Porta', icon: 'fa-door-closed' },
  { id: 'janela', name: 'Janela', icon: 'fa-window-maximize' },
  { id: 'bascula', name: 'Básculas', icon: 'fa-layer-group' },
  { id: 'seteira', name: 'Seteiras', icon: 'fa-align-justify' },
  { id: 'panoramica', name: 'Linha Panorâmica', icon: 'fa-panorama' },
  { id: 'vidro-temperado', name: 'Linha Vidro Temperado', icon: 'fa-border-all' },
  { id: 'diagonal', name: 'Linha Diagonal', icon: 'fa-slash' },
  { id: 'tucano', name: 'Linha Tucano', icon: 'fa-kiwi-bird' },
  { id: 'marcos', name: 'Marcos Portais Alisares', icon: 'fa-ruler-combined' },
  { id: 'correr', name: 'Porta de Correr', icon: 'fa-door-open' }
];

async function loadData() {
  try {
    const res = await fetch('data.json');
    if (res.ok) {
      const data = await res.json();
      productsData = data.products || [];
    } else {
      console.warn('data.json not found. Using placeholder data.');
      // Placeholder if scrape failed/pending
      productsData = window.fallbackProducts || [];
    }
    // initialize router
    handleRoute();
  } catch (e) {
    console.error("Error loading products:", e);
    productsData = window.fallbackProducts || [];
    handleRoute();
  }
}

// Router
function navigate(route, id = null) {
  window.history.pushState({ route, id }, '', `#${route}${id ? '?id=' + id : ''}`);
  handleRoute();
  // Close mobile menu if open
  document.getElementById('nav-links').classList.remove('active');
  window.scrollTo(0, 0);
}

window.addEventListener('popstate', handleRoute);

function handleRoute() {
  const hash = window.location.hash || '#home';
  const url = new URL('http://dummy' + hash.replace('#', '/'));
  let route = url.pathname.replace('/', '') || 'home';
  const idParams = new URLSearchParams(url.search);
  const id = idParams.get('id');

  const app = document.getElementById('app');
  app.style.opacity = '0';
  
  setTimeout(() => {
    app.innerHTML = '';
    
    if (route === 'home') {
      renderHome(app);
    } else if (route === 'products') {
      renderProducts(app, id); // id acts as category filter
    } else if (route === 'product') {
      renderProductDetail(app, id);
    }
    
    app.style.opacity = '1';
    app.style.transition = 'opacity 0.4s';
    
    // hide loader
    document.getElementById('loader').style.display = 'none';
  }, 200);
}

function getHighlights() {
  const excludedKeywords = [
    'portas', 'janelas', 'básculas', 'portas de correr', 
    'linha panorâmica', 'linha vidro temperado', 
    'linha tucano', 'linha diagonal', 'outros produtos', 
    'outros linha moderna', 'marcos', 'seteiras', 'outros',
    'linha modernas'
  ];
  
  const validProducts = productsData.filter(p => {
    const t = p.title.toLowerCase().trim();
    if (excludedKeywords.some(ex => t === ex)) return false;
    const cat = classifyCategory(p.title);
    return cat === 'porta' || cat === 'janela';
  });

  const shuffled = validProducts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 12);
}

function classifyCategory(productTitle) {
    const title = productTitle.toLowerCase();
    if(title.includes('panorâmica') || title.includes('panoramica')) return 'panoramica';
    if(title.includes('vidro temperado')) return 'vidro-temperado';
    if(title.includes('diagonal')) return 'diagonal';
    if(title.includes('tucano')) return 'tucano';
    if(title.includes('correr')) return 'correr';
    if(title.includes('marco') || title.includes('portal') || title.includes('alisar')) return 'marcos';
    if(title.includes('seteira')) return 'seteira';
    if(title.includes('báscula') || title.includes('bascula')) return 'bascula';
    if(title.includes('janela')) return 'janela';
    if(title.includes('porta')) return 'porta';
    return 'outros';
}

function WppLink(productName) {
    const msg = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para o produto: ${productName}. Podem me passar mais informações?`);
    return `https://wa.me/${wppNumber}?text=${msg}`;
}

// UI Renderers
function renderHome(container) {
  // Carousel images
  const excludedKeywords = ['portas', 'janelas', 'básculas', 'portas de correr', 'linha panorâmica', 'linha', 'marcos', 'outros'];
  const realProducts = productsData.filter(p => {
    const t = p.title.toLowerCase().trim();
    return !excludedKeywords.some(ex => t === ex);
  });
  const carouselImages = realProducts.slice(0, 5).map(p => p.image).filter(Boolean);
  if(carouselImages.length === 0) carouselImages.push('https://www.gusmaomadeiras.com.br/assets/slider-placeholder.jpg'); // placeholder
  
  const heroHtml = `
    <section class="hero-slider" id="hero-slider">
      ${carouselImages.map((img, i) => `<div class="hero-slide ${i===0?'active':''}" style="background-image: url('${img}');"></div>`).join('')}
      <div class="hero-overlay">
        <div class="container hero-content">
          <h1>Elegância em cada detalhe</h1>
          <p>Madeiras de alta qualidade para construir os melhores momentos da sua vida. Conheça nossa linha completa de portas, janelas e acabamentos.</p>
          <button class="btn" onclick="navigate('products')">Ver Produtos</button>
        </div>
      </div>
    </section>
  `;

  // Categories
  const catHtml = `
    <section class="section-wood">
      <div class="container">
        <h2 class="section-title">Nossas Categorias</h2>
        <div class="categories-grid">
          ${categoriesData.map(c => `
            <a href="#" class="category-card" onclick="event.preventDefault(); navigate('products', '${c.id}')">
              <i class="fas ${c.icon}"></i>
              <h3>${c.name}</h3>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;

  // Highlights
  const highlights = getHighlights();
  const prodHtml = `
    <section class="section-white">
      <div class="container">
        <h2 class="section-title">Produtos em Destaque</h2>
        <div class="products-grid">
          ${highlights.map((p, i) => `
            <div class="product-card" onclick="navigate('product', ${i})">
              <img src="${p.image || 'https://via.placeholder.com/300x250?text=Sem+Foto'}" class="product-img" alt="${p.title}" onerror="this.src='https://via.placeholder.com/300x250?text=Sem+Foto'">
              <div class="product-info">
                <span class="product-category">${classifyCategory(p.title)}</span>
                <h3 class="product-title">${p.title}</h3>
                  <a href="${WppLink(p.title)}" target="_blank" class="whatsapp-btn" onclick="event.stopPropagation()">
                    <i class="fab fa-whatsapp"></i> Solicitar um orçamento
                  </a>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="see-all-container">
          <button class="btn btn-outline" style="color:var(--primary);border-color:var(--primary)" onclick="navigate('products')">Ver todos os produtos</button>
        </div>
      </div>
    </section>
  `;

  container.innerHTML = heroHtml + catHtml + prodHtml;
  startCarousel();
}

function renderProducts(container, categoryId) {
    const excludedKeywords = ['portas', 'janelas', 'básculas', 'portas de correr', 'linha panorâmica', 'linha', 'marcos', 'outros'];
    const realProducts = productsData.filter(p => !excludedKeywords.some(ex => p.title.toLowerCase().trim() === ex));
    const carouselImages = realProducts.slice(0, 5).map(p => p.image).filter(Boolean);
    if(carouselImages.length === 0) carouselImages.push('https://www.gusmaomadeiras.com.br/assets/slider-placeholder.jpg');
    
    const bannerHtml = `
      <section class="hero-slider" style="height: 40vh;" id="hero-slider">
        ${carouselImages.map((img, i) => `<div class="hero-slide ${i===0?'active':''}" style="background-image: url('${img}');"></div>`).join('')}
        <div class="hero-overlay">
          <div class="container hero-content">
            <h1 style="font-size: 2.5rem;">Nossas Categorias e Produtos</h1>
          </div>
        </div>
      </section>
    `;

    const layoutHtml = `
      <section class="section-white">
        <div class="container products-page-layout">
          <aside class="filter-sidebar">
            <h3>Filtrar por Linha</h3>
            <ul class="filter-list">
              <li><a href="#" class="${!categoryId ? 'active' : ''}" onclick="event.preventDefault(); renderProducts(document.getElementById('app'), null)">Todos os Produtos</a></li>
              ${categoriesData.map(c => `
                <li><a href="#" class="${categoryId === c.id ? 'active' : ''}" onclick="event.preventDefault(); renderProducts(document.getElementById('app'), '${c.id}')">${c.name}</a></li>
              `).join('')}
            </ul>
          </aside>

          <div class="products-main" id="products-main-grid">
            <!-- Grid will be injected here -->
          </div>
        </div>
      </section>
    `;

    container.innerHTML = bannerHtml + layoutHtml;
    startCarousel();

    let filtered = productsData;
    if (categoryId) {
        filtered = productsData.filter(p => classifyCategory(p.title) === categoryId);
    }
    
    const gridContainer = document.getElementById('products-main-grid');
    if (filtered.length === 0) {
        gridContainer.innerHTML = '<p style="text-align:center">Nenhum produto encontrado neste filtro.</p>';
        return;
    }
    
    const gridHtml = `
      <div class="products-grid">
        ${filtered.map(p => {
            const idx = productsData.indexOf(p);
            return `
          <div class="product-card" onclick="navigate('product', ${idx})">
            <img src="${p.image || 'https://via.placeholder.com/300x250?text=Sem+Foto'}" class="product-img" alt="${p.title}" onerror="this.src='https://via.placeholder.com/300x250?text=Sem+Foto'">
            <div class="product-info">
              <span class="product-category">${classifyCategory(p.title)}</span>
              <h3 class="product-title">${p.title}</h3>
              <a href="${WppLink(p.title)}" target="_blank" class="whatsapp-btn" onclick="event.stopPropagation()">
                <i class="fab fa-whatsapp"></i> Solicitar um orçamento
              </a>
            </div>
          </div>
        `}).join('')}
      </div>
    `;
    gridContainer.innerHTML = gridHtml;
}

function renderProductDetail(container, productId) {
    const p = productsData[productId];
    if(!p) {
        container.innerHTML = `<div class="container section-white"><h2 class="section-title">Produto não encontrado</h2></div>`;
        return;
    }

    const html = `
      <section class="section-white">
        <div class="container">
          <a href="#" class="back-btn" onclick="event.preventDefault(); window.history.back()">
            <i class="fas fa-arrow-left"></i> Voltar
          </a>
          <div class="product-detail-layout">
            <div class="product-detail-gallery">
              <img src="${p.image || 'https://via.placeholder.com/600x600?text=Sem+Foto'}" alt="${p.title}" onerror="this.src='https://via.placeholder.com/600x600?text=Sem+Foto'">
            </div>
            <div class="product-detail-info">
              <span class="product-category">${classifyCategory(p.title).replace('-', ' ').toUpperCase()}</span>
              <h1>${p.title}</h1>
              <div class="product-detail-desc">
                ${p.description || 'Descrição detalhada não disponível no momento. Entre em contato para mais especificações técnicas.'}
              </div>
              <div class="product-specs">
                <h3>Especificações Técnicas</h3>
                <ul class="spec-list">
                  <li><span class="spec-label">Material:</span> <span>${p.title.includes('angelim') ? 'Madeira Angelim' : 'Consulte'}</span></li>
                  <li><span class="spec-label">Linha:</span> <span>${classifyCategory(p.title).replace('-', ' ').toUpperCase()}</span></li>
                  ${p.title.includes('vidro') ? '<li><span class="spec-label">Detalhe:</span> <span>Com Vidro</span></li>' : ''}
                </ul>
              </div>
              <a href="${WppLink(p.title)}" target="_blank" class="whatsapp-btn" style="font-size: 1.2rem; padding: 15px;">
                <i class="fab fa-whatsapp"></i> Solicitar um orçamento
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
    container.innerHTML = html;
}

// Utils
let carouselInterval;
function startCarousel() {
  clearInterval(carouselInterval);
  let slides = document.querySelectorAll('.hero-slide');
  if(slides.length <= 1) return;
  let current = 0;
  carouselInterval = setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
}

function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('active');
}

// Setup navbar shrink on scroll
window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
        document.getElementById('navbar').style.padding = '10px 0';
        document.getElementById('navbar').style.boxShadow = 'var(--shadow-hover)';
    } else {
        document.getElementById('navbar').style.padding = '15px 0';
        document.getElementById('navbar').style.boxShadow = 'var(--shadow)';
    }
});

// Init
window.addEventListener('DOMContentLoaded', loadData);
