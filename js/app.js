// app.js - Main SPA routing and logic
const wppNumber = "5531985082038";

let productsData = [];
let categoriesData = [
  { id: 'porta', name: 'Porta', icon: 'fa-door-closed' },
  { id: 'janela', name: 'Janela', icon: 'fa-window-maximize' },
  { id: 'bascula', name: 'Básculas', icon: 'fa-layer-group' },
  { id: 'seteira', name: 'Seteiras', icon: 'fa-align-justify' },
  { id: 'marcos', name: 'Marcos Portais Alisares', icon: 'fa-ruler-combined' },
  { id: 'correr', name: 'Porta de Correr', icon: 'fa-door-open' }
];

async function loadData() {
  try {
    const res = await fetch('data.json');
    if (res.ok) {
      const data = await res.json();
      productsData = (data.products || []).filter(p => !p.url.includes('/page/') && p.title.trim().toLowerCase() !== 'produtos');
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
function navigate(route, id = null, search = null) {
  if (route === 'home') {
    window.history.pushState({ route, id, search }, '', 'index.html');
  } else if (route === 'products') {
    let url = 'produtos.html';
    if(id) url += '?categoryId=' + id;
    else if(search) url += '?search=' + encodeURIComponent(search);
    window.history.pushState({ route, id, search }, '', url);
  } else if (route === 'product') {
    window.history.pushState({ route, id, search }, '', `produtos.html#product?id=${id}`);
  }

  handleRoute();
  document.getElementById('nav-links').classList.remove('active');
  window.scrollTo(0, 0);
}

window.addEventListener('popstate', handleRoute);

function handleRoute() {
  const hash = window.location.hash || '';
  const urlParams = new URLSearchParams(window.location.search);
  const isProductsPage = window.location.pathname.includes('produtos.html');

  let route = isProductsPage ? 'products' : 'home';
  let id = urlParams.get('categoryId');
  let search = urlParams.get('search');

  if (hash.startsWith('#product?')) {
    route = 'product';
    const idParams = new URLSearchParams(hash.split('?')[1]);
    id = idParams.get('id');
  }

  const app = document.getElementById('app');
  app.style.opacity = '0';

  setTimeout(() => {
    app.innerHTML = '';
    if (route === 'home') renderHome(app);
    else if (route === 'products') renderProducts(app, id, search);
    else if (route === 'product') renderProductDetail(app, id);

    app.style.opacity = '1';
    app.style.transition = 'opacity 0.2s';

    const loader = document.getElementById('loader');
    if (loader && loader.style.display !== 'none') {
      loader.style.display = 'none';
    }
  }, 50);
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
  if (title.includes('panorâmica') || title.includes('panoramica')) return 'panoramica';
  if (title.includes('vidro temperado')) return 'vidro-temperado';
  if (title.includes('diagonal')) return 'diagonal';
  if (title.includes('tucano')) return 'tucano';
  if (title.includes('correr')) return 'correr';
  if (title.includes('marco') || title.includes('portal') || title.includes('alisar')) return 'marcos';
  if (title.includes('seteira')) return 'seteira';
  if (title.includes('báscula') || title.includes('bascula')) return 'bascula';
  if (title.includes('janela')) return 'janela';
  if (title.includes('porta')) return 'porta';
  return 'outros';
}

function WppLink(productName) {
  const msg = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para o produto: ${productName}. Podem me passar mais informações?`);
  return `https://wa.me/${wppNumber}?text=${msg}`;
}

// UI Renderers
function renderHome(container) {
  const heroHtml = `
    <section id="hero-slider" style="position: relative; overflow: hidden; height: 70vh; min-height: 500px; display: flex; align-items: center; justify-content: center; text-align: center;">
      <!-- Lazy loaded bg video to prevent render blocking -->
      <video id="hero-bg-video" autoplay muted loop playsinline preload="metadata" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">
          <source src="Images/video.webm" type="video/webm">
      </video>
      <!-- Dark overlay 45% -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.45); z-index: 1;"></div>
      
      <div class="container hero-content" style="position: relative; z-index: 2; color: white;">
        <h1 style="font-size: 3rem; margin-bottom: 20px; font-weight: 700;">Produtos que duram gerações</h1>
        <p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9;">Madeiras de alta qualidade para construir os melhores momentos da sua vida. Conheça nossa linha completa de portas, janelas e acabamentos.</p>
        <button class="btn btn-white-red" onclick="navigate('products')">Ver Produtos</button>
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

function renderProducts(container, categoryId, searchQuery) {
  const bannerHtml = `
      <section class="hero-red-section" style="background-color: var(--primary); padding: 60px 0; text-align: center;">
        <div class="container">
          <h1 style="color: white; font-size: 2.5rem; margin: 0;">Nossos Produtos</h1>
        </div>
      </section>
    `;

  const layoutHtml = `
      <section class="section-white">
        <div class="container products-page-layout">
          <aside class="filter-sidebar">
            <div class="filter-header" onclick="toggleMobileFilter()" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin-bottom:0; border:none;">Filtrar por Linha</h3>
                <i class="fas fa-chevron-down mobile-only-icon" id="filter-chevron" style="display:none; color:var(--primary); font-size:1.2rem;"></i>
            </div>
            <ul class="filter-list collapsed-mobile" id="filter-list" style="margin-top: 20px;">
              <li><a href="#" class="${!categoryId && !searchQuery ? 'active' : ''}" onclick="event.preventDefault(); navigate('products', null, null); closeMobileFilter();">Todos os Produtos</a></li>
              ${categoriesData.map(c => `
                <li><a href="#" class="${categoryId === c.id ? 'active' : ''}" onclick="event.preventDefault(); navigate('products', '${c.id}', null); closeMobileFilter();">${c.name}</a></li>
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
  } else if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = productsData.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q)) ||
      classifyCategory(p.title).toLowerCase().includes(q) ||
      categoriesData.some(c => c.id === classifyCategory(p.title) && c.name.toLowerCase().includes(q))
    );
  }

  const gridContainer = document.getElementById('products-main-grid');
  if (filtered.length === 0) {
    gridContainer.innerHTML = '<p style="text-align:center">Nenhum produto encontrado neste filtro ou pesquisa.</p>';
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
            </div>
          </div>
        `}).join('')}
      </div>
    `;
  gridContainer.innerHTML = gridHtml;
}

function renderProductDetail(container, productId) {
  const p = productsData[productId];
  if (!p) {
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
  if (slides.length <= 1) return;
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
  if (window.scrollY > 50) {
    document.getElementById('navbar').style.padding = '10px 0';
    document.getElementById('navbar').style.boxShadow = 'var(--shadow-hover)';
  } else {
    document.getElementById('navbar').style.padding = '15px 0';
    document.getElementById('navbar').style.boxShadow = 'var(--shadow)';
  }
});

// Init
window.addEventListener('DOMContentLoaded', loadData);

// Global Search and Filter functions
window.handleSearchKey = function(event) {
    if (event.key === 'Enter') handleSearchClick();
}

window.handleSearchClick = function() {
    const input = document.getElementById('searchInput');
    if(input) {
        const val = input.value.trim();
        if(val) navigate('products', null, val);
    }
}

window.toggleMobileFilter = function() {
    const list = document.getElementById('filter-list');
    const icon = document.getElementById('filter-chevron');
    if (!list) return;
    if (list.classList.contains('collapsed-mobile')) {
        list.classList.remove('collapsed-mobile');
        if(icon) icon.className = 'fas fa-chevron-up mobile-only-icon';
    } else {
        list.classList.add('collapsed-mobile');
        if(icon) icon.className = 'fas fa-chevron-down mobile-only-icon';
    }
}

window.closeMobileFilter = function() {
    if(window.innerWidth <= 768) {
        const list = document.getElementById('filter-list');
        const icon = document.getElementById('filter-chevron');
        if (list) list.classList.add('collapsed-mobile');
        if (icon) icon.className = 'fas fa-chevron-down mobile-only-icon';
    }
}
