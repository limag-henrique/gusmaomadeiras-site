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
  // Physical categories prioritization
  if (title.includes('marco') || title.includes('portal') || title.includes('alisar')) return 'marcos';
  if (title.includes('seteira')) return 'seteira';
  if (title.includes('correr')) return 'correr';
  if (title.includes('báscula') || title.includes('bascula')) return 'bascula';
  if (title.includes('janela')) return 'janela';
  if (title.includes('porta')) return 'porta';
  return 'outros';
}

function getCategoryName(id) {
  const cat = categoriesData.find(c => c.id === id);
  return cat ? cat.name : 'Outros';
}

function getProductLine(title) {
  title = title.toLowerCase();
  if (title.includes('panorâmica') || title.includes('panoramica')) return 'Panorâmica';
  if (title.includes('vidro temperado')) return 'Vidro Temperado';
  if (title.includes('diagonal')) return 'Diagonal';
  if (title.includes('tucano')) return 'Tucano';
  if (title.includes('bigbrother') || title.includes('big brother')) return 'Big Brother';
  if (title.includes('mexicana')) return 'Mexicana';
  if (title.includes('genova') || title.includes('gênova')) return 'Gênova';
  if (title.includes('milão') || title.includes('milao')) return 'Milão';
  if (title.includes('escama de peixe')) return 'Escama de Peixe';
  if (title.includes('imperial')) return 'Imperial';
  if (title.includes('napoleão') || title.includes('napoleao')) return 'Napoleão';
  if (title.includes('colonial')) return 'Colonial';
  if (title.includes('estruturada')) return 'Estruturada';
  if (title.includes('quadriculado')) return 'Maciça / Quadriculado';
  return 'Linha Tradicional';
}

function renderProductCard(product) {
  const idx = productsData.indexOf(product);
  const productImage = product.image || 'https://via.placeholder.com/300x250?text=Sem+Foto';
  const usageImage = product.aiImage || '';
  const aiPreview = usageImage ? `
        <img src="${usageImage}" class="product-img product-img-ai" alt="${product.title} em uso" onerror="this.style.display='none'">
      ` : '';

  return `
    <div class="product-card ${usageImage ? 'has-ai-preview' : ''}" onclick="navigate('product', ${idx})">
      <div class="product-img-wrap">
        <img src="${productImage}" class="product-img product-img-original" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x250?text=Sem+Foto'">
        ${aiPreview}
      </div>
      <div class="product-info">
        <span class="product-category">${getCategoryName(classifyCategory(product.title))}</span>
        <h3 class="product-title">${product.title}</h3>
      </div>
    </div>
  `;
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
      <!-- Modern gradient overlay -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(45, 55, 72, 0.85) 0%, rgba(45, 55, 72, 0.4) 100%); z-index: 1;"></div>
      
      <div class="container hero-content" style="position: relative; z-index: 2; color: white;">
        <h1 style="font-size: 3.5rem; margin-bottom: 20px; font-weight: 700; line-height: 1.2;">Produtos que duram gerações</h1>
        <p style="font-size: 1.25rem; margin-bottom: 40px; opacity: 0.95; max-width: 800px; margin-left: auto; margin-right: auto;">Madeiras de alta qualidade para construir os melhores momentos da sua vida. Conheça nossa linha completa de portas, janelas e acabamentos.</p>
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
          ${highlights.map(p => renderProductCard(p)).join('')}
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
      getCategoryName(classifyCategory(p.title)).toLowerCase().includes(q) ||
      getProductLine(p.title).toLowerCase().includes(q)
    );
  }

  const gridContainer = document.getElementById('products-main-grid');
  if (filtered.length === 0) {
    gridContainer.innerHTML = '<p style="text-align:center">Nenhum produto encontrado neste filtro ou pesquisa.</p>';
    return;
  }

  const gridHtml = `
      <div class="products-grid">
        ${filtered.map(p => renderProductCard(p)).join('')}
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

  const galleryImages = [
    {
      type: 'original',
      label: 'Fotos originais',
      icon: 'fa-image',
      src: p.image || 'https://via.placeholder.com/600x600?text=Sem+Foto',
      alt: p.title
    }
  ];

  if (p.aiImage) {
    galleryImages.push({
      type: 'ai',
      label: 'Foto em uso',
      icon: 'fa-house',
      src: p.aiImage,
      alt: `${p.title} em uso`
    });
  }

  const galleryPayload = encodeURIComponent(JSON.stringify(galleryImages));
  const switcherHtml = galleryImages.length > 1 ? `
              <div class="gallery-switcher" style="display: flex; justify-content: center; gap: 12px; margin-top: 15px;">
                ${galleryImages.map((_, index) => `
                  <button type="button" class="gallery-dot" onclick="setProductDetailImage(${index})" aria-label="Foto ${index + 1}" style="width: 16px; height: 16px; border-radius: 50%; background: ${index === 0 ? 'var(--primary)' : 'transparent'}; border: 2px solid var(--primary); cursor: pointer; transition: all 0.3s; padding: 0; box-sizing: border-box;"></button>
                `).join('')}
              </div>
            ` : '';

  if (galleryImages.length > 1) {
    clearInterval(window.autoToggleInterval);
    window.autoToggleInterval = setInterval(() => {
      const image = document.getElementById('product-main-image');
      if (image) nextProductDetailImage();
    }, 3000);
  }

  const html = `
      <section class="section-white">
        <div class="container">
          <a href="#" class="back-btn" onclick="event.preventDefault(); window.history.back()">
            <i class="fas fa-arrow-left"></i> Voltar
          </a>
          <div class="product-detail-layout">
            <div class="product-detail-gallery">
              <div class="product-detail-main-image">
                <img id="product-main-image" src="${galleryImages[0].src}" alt="${galleryImages[0].alt}" data-gallery="${galleryPayload}" data-index="0" onclick="openLightbox(this.src)" onerror="this.src='https://via.placeholder.com/600x600?text=Sem+Foto'">
              </div>
              ${switcherHtml}
            </div>
            <div class="product-detail-info">
              <span class="product-category">${getCategoryName(classifyCategory(p.title))}</span>
              <h1>${p.title}</h1>
              <div class="product-detail-desc">
                ${p.description || 'Descrição detalhada não disponível no momento. Entre em contato para mais especificações técnicas.'}
              </div>
              <div class="product-specs">
                <h3>Especificações Técnicas</h3>
                <ul class="spec-list">
                  <li><span class="spec-label">Material:</span> <span>${p.title.includes('angelim') ? 'Madeira Angelim' : 'Consulte'}</span></li>
                  <li><span class="spec-label">Linha:</span> <span>${getProductLine(p.title)}</span></li>
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

function readProductGallery() {
  const image = document.getElementById('product-main-image');
  if (!image) return [];

  try {
    return JSON.parse(decodeURIComponent(image.dataset.gallery || '[]'));
  } catch (e) {
    return [];
  }
}

function setProductDetailImage(index) {
  const image = document.getElementById('product-main-image');
  const gallery = readProductGallery();
  const selected = gallery[index];
  if (!image || !selected) return;

  image.src = selected.src;
  image.alt = selected.alt;
  image.dataset.index = String(index);

  document.querySelectorAll('.gallery-dot').forEach((btn, i) => {
    if (i === index) {
      btn.style.background = 'var(--primary)';
    } else {
      btn.style.background = 'transparent';
    }
  });
}

function nextProductDetailImage() {
  const image = document.getElementById('product-main-image');
  const gallery = readProductGallery();
  if (!image || gallery.length <= 1) return;

  const nextIndex = (Number(image.dataset.index || 0) + 1) % gallery.length;
  setProductDetailImage(nextIndex);
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

// Lightbox functions
window.openLightbox = function(src) {
  let lightbox = document.getElementById('image-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); display: flex; justify-content: center; align-items: center; z-index: 10000; cursor: pointer; opacity: 0; transition: opacity 0.3s;';
    lightbox.onclick = window.closeLightbox;
    
    const img = document.createElement('img');
    img.id = 'lightbox-img';
    img.style.cssText = 'max-width: 90vw; max-height: 90vh; object-fit: contain; transform: scale(0.9); transition: transform 0.3s;';
    
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
  }
  
  const img = document.getElementById('lightbox-img');
  img.src = src;
  
  lightbox.style.display = 'flex';
  setTimeout(() => {
    lightbox.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }, 10);
};

window.closeLightbox = function() {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    lightbox.style.opacity = '0';
    const img = document.getElementById('lightbox-img');
    if(img) img.style.transform = 'scale(0.9)';
    setTimeout(() => {
      lightbox.style.display = 'none';
    }, 300);
  }
};
