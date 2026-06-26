// app.js - Main SPA routing and logic
const wppNumber = "5531985082038";

let productsData = [];
const categoriesData = [
  { id: "porta", name: "Porta", icon: "fa-door-closed" },
  { id: "janela", name: "Janela", icon: "fa-window-maximize" },
  { id: "bascula", name: "Básculas", icon: "fa-layer-group" },
  { id: "seteira", name: "Seteiras", icon: "fa-align-justify" },
  { id: "marcos", name: "Marcos Portais Alisares", icon: "fa-ruler-combined" },
  { id: "correr", name: "Porta de Correr", icon: "fa-door-open" }
];

const heroFloatingProducts = [
  { src: "Images/hero-floating/porta-101-estruturada.png", alt: "Porta de angelim estruturada", shape: "door" },
  { src: "Images/hero-floating/janela-41-panoramica.png", alt: "Janela panoramica de correr", shape: "wide" },
  { src: "Images/hero-floating/porta-53-panoramica.png", alt: "Marco panoramico de angelim", shape: "door" },
  { src: "Images/hero-floating/porta-correr-04-tucano.png", alt: "Porta de correr tucano", shape: "wide" },
  { src: "Images/hero-floating/janela-10-correr.png", alt: "Janela dupla de correr", shape: "wide" },
  { src: "Images/hero-floating/porta-36-bigbrother.png", alt: "Porta BigBrother espacada", shape: "door" },
  { src: "Images/hero-floating/bascula-15-panoramica.png", alt: "Bascula panoramica", shape: "square" },
  { src: "Images/hero-floating/janela-32-napoleao.png", alt: "Janela napoleao de vidro", shape: "wide" },
  { src: "Images/hero-floating/porta-17-almofadas.png", alt: "Porta dez almofadas", shape: "door" },
  { src: "Images/hero-floating/seteira-17-panoramica.png", alt: "Seteira panoramica", shape: "door" },
  { src: "Images/hero-floating/janela-05-vidro-almofada.png", alt: "Janela vidro e almofada", shape: "wide" },
  { src: "Images/hero-floating/marco-10-vidro-diagonal.png", alt: "Marco vidro diagonal", shape: "door" }
];

async function loadData() {
  try {
    const res = await fetch("data.json");
    if (res.ok) {
      const data = await res.json();
      productsData = (data.products || []).filter((p) => !p.url.includes("/page/") && p.title.trim().toLowerCase() !== "produtos");
    } else {
      console.warn("data.json not found. Using placeholder data.");
      productsData = window.fallbackProducts || [];
    }
  } catch (e) {
    console.error("Error loading products:", e);
    productsData = window.fallbackProducts || [];
  }

  handleRoute();
}

function navigate(route, id = null, search = null) {
  if (route === "home") {
    window.history.pushState({ route, id, search }, "", "index.html");
  } else if (route === "products") {
    let url = "produtos.html";
    if (id) url += "?categoryId=" + id;
    else if (search) url += "?search=" + encodeURIComponent(search);
    window.history.pushState({ route, id, search }, "", url);
  } else if (route === "product") {
    window.history.pushState({ route, id, search }, "", `produtos.html#product?id=${id}`);
  }

  handleRoute();
  closeMenu();
  window.scrollTo(0, 0);
}

window.addEventListener("popstate", handleRoute);

function handleRoute() {
  const hash = window.location.hash || "";
  const urlParams = new URLSearchParams(window.location.search);
  const isProductsPage = window.location.pathname.includes("produtos.html");

  let route = isProductsPage ? "products" : "home";
  let id = urlParams.get("categoryId");
  let search = urlParams.get("search");

  if (hash.startsWith("#product?")) {
    route = "product";
    const idParams = new URLSearchParams(hash.split("?")[1]);
    id = idParams.get("id");
  }

  clearInterval(window.autoToggleInterval);
  stopHeroFloatMotion();

  const app = document.getElementById("app");
  app.style.opacity = "0";

  setTimeout(() => {
    app.innerHTML = "";
    if (route === "home") renderHome(app);
    else if (route === "products") renderProducts(app, id, search);
    else if (route === "product") renderProductDetail(app, id);

    app.style.opacity = "1";
    updateActiveNav(route);

    const loader = document.getElementById("loader");
    if (loader && loader.style.display !== "none") {
      loader.style.display = "none";
    }
  }, 50);
}

function updateActiveNav(route) {
  document.querySelectorAll(".nav-links a").forEach((link) => link.classList.remove("active"));
  const selector = route === "home" ? 'a[href="index.html"]' : 'a[href="produtos.html"]';
  const active = document.querySelector(`.nav-links ${selector}`);
  if (active) active.classList.add("active");
}

function getHighlights() {
  const excludedKeywords = [
    "portas",
    "janelas",
    "básculas",
    "basculas",
    "portas de correr",
    "linha panorâmica",
    "linha panoramica",
    "linha vidro temperado",
    "linha tucano",
    "linha diagonal",
    "outros produtos",
    "outros linha moderna",
    "marcos",
    "seteiras",
    "outros",
    "linha modernas"
  ];

  const validProducts = productsData.filter((p) => {
    const t = p.title.toLowerCase().trim();
    if (excludedKeywords.some((ex) => t === ex)) return false;
    const cat = classifyCategory(p.title);
    return cat === "porta" || cat === "janela";
  });

  return validProducts.sort(() => 0.5 - Math.random()).slice(0, 12);
}

function classifyCategory(productTitle) {
  const title = productTitle.toLowerCase();
  if (title.includes("marco") || title.includes("portal") || title.includes("alisar")) return "marcos";
  if (title.includes("seteira")) return "seteira";
  if (title.includes("correr")) return "correr";
  if (title.includes("báscula") || title.includes("bascula")) return "bascula";
  if (title.includes("janela")) return "janela";
  if (title.includes("porta")) return "porta";
  return "outros";
}

function getCategoryName(id) {
  const cat = categoriesData.find((c) => c.id === id);
  return cat ? cat.name : "Outros";
}

function getProductLine(title) {
  const normalized = title.toLowerCase();
  if (normalized.includes("panorâmica") || normalized.includes("panoramica")) return "Panorâmica";
  if (normalized.includes("vidro temperado")) return "Vidro Temperado";
  if (normalized.includes("diagonal")) return "Diagonal";
  if (normalized.includes("tucano")) return "Tucano";
  if (normalized.includes("bigbrother") || normalized.includes("big brother")) return "Big Brother";
  if (normalized.includes("mexicana")) return "Mexicana";
  if (normalized.includes("genova") || normalized.includes("gênova")) return "Gênova";
  if (normalized.includes("milão") || normalized.includes("milao")) return "Milão";
  if (normalized.includes("escama de peixe")) return "Escama de Peixe";
  if (normalized.includes("imperial")) return "Imperial";
  if (normalized.includes("napoleão") || normalized.includes("napoleao")) return "Napoleão";
  if (normalized.includes("colonial")) return "Colonial";
  if (normalized.includes("estruturada")) return "Estruturada";
  if (normalized.includes("quadriculado")) return "Maciça / Quadriculado";
  return "Linha Tradicional";
}

function getCatalogCount(categoryId = null) {
  if (!categoryId) return productsData.length;
  return productsData.filter((p) => classifyCategory(p.title) === categoryId).length;
}

function WppLink(productName) {
  const msg = encodeURIComponent(`Olá! Gostaria de solicitar um orçamento para o produto: ${productName}. Podem me passar mais informações?`);
  return `https://wa.me/${wppNumber}?text=${msg}`;
}

function getProductDetailHref(idx) {
  return `produtos.html#product?id=${idx}`;
}

function renderProductCard(product) {
  const idx = productsData.indexOf(product);
  const productImage = product.image || "https://via.placeholder.com/300x250?text=Sem+Foto";
  const usageImage = product.aiImage || "";
  const aiPreview = usageImage
    ? `<img src="${usageImage}" class="product-img product-img-ai" alt="${product.title}" onerror="this.style.display='none'">`
    : "";

  return `
    <a class="product-card ${usageImage ? "has-ai-preview" : ""}" href="${getProductDetailHref(idx)}" onclick="handleProductCardClick(event, ${idx})">
      <div class="product-img-wrap">
        <img src="${productImage}" class="product-img product-img-original" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x250?text=Sem+Foto'">
        ${aiPreview}
      </div>
      <div class="product-info">
        <span class="product-category">${getCategoryName(classifyCategory(product.title))}</span>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-card-actions">
          <span class="product-action details">Ver detalhes</span>
        </div>
      </div>
    </a>
  `;
}

function renderHome(container) {
  const floatingProductsHtml = heroFloatingProducts.map((product, index) => `
    <figure class="hero-float-item" data-shape="${product.shape}" style="--i: ${index}">
      <img class="hero-float-img" src="${product.src}" alt="${product.alt}" loading="${index < 5 ? "eager" : "lazy"}" decoding="async">
    </figure>
  `).join("");

  const heroHtml = `
    <section id="hero-slider" class="hero-slider">
      <video id="hero-bg-video" class="hero-bg-video" autoplay muted loop playsinline preload="metadata">
        <source src="Images/video.webm" type="video/webm">
      </video>
      <div class="hero-overlay"></div>
      <div class="hero-product-stage" aria-hidden="true">
        <div class="hero-product-orbit" id="hero-product-orbit">
          ${floatingProductsHtml}
        </div>
      </div>
      <div class="container hero-shell">
        <div class="hero-copy">
          <h1>Produtos que duram gerações</h1>
          <p>Madeiras de alta qualidade para construir os melhores momentos da sua vida. Conheça nossa linha completa de portas, janelas e acabamentos.</p>
          <div class="hero-actions">
            <button class="btn btn-white-red" onclick="navigate('products')">
              <i class="fas fa-border-all"></i>
              Ver Produtos
            </button>
            <a class="btn btn-glass" href="contato.html">
              <i class="fas fa-location-dot"></i>
              Fale Conosco
            </a>
          </div>
        </div>
      </div>
    </section>
  `;

  const catHtml = `
    <section class="section-wood catalog-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Catálogo</span>
            <h2 class="section-title">Escolha por tipo de peça</h2>
          </div>
        </div>
        <div class="categories-grid">
          ${categoriesData.map((c) => `
            <a href="#" class="category-card" onclick="event.preventDefault(); navigate('products', '${c.id}')">
              <i class="fas ${c.icon}"></i>
              <h3>${c.name}</h3>
            </a>
          `).join("")}
        </div>
      </div>
    </section>
  `;

  const highlights = getHighlights();
  const prodHtml = `
    <section class="section-white highlights-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Destaques</span>
            <h2 class="section-title">Peças para começar seu projeto</h2>
          </div>
          <button class="btn btn-select-outline" onclick="navigate('products')">Ver todos</button>
        </div>
        <div class="products-grid">
          ${highlights.map((p) => renderProductCard(p)).join("")}
        </div>
      </div>
    </section>
  `;

  container.innerHTML = heroHtml + catHtml + prodHtml;
  initHeroFloatMotion();
}

function stopHeroFloatMotion() {
  if (window.heroFloatMotionFrame) {
    cancelAnimationFrame(window.heroFloatMotionFrame);
    window.heroFloatMotionFrame = null;
  }
}

function initHeroFloatMotion() {
  stopHeroFloatMotion();

  const hero = document.getElementById("hero-slider");
  const orbit = document.getElementById("hero-product-orbit");
  if (!hero || !orbit) return;

  const items = Array.from(orbit.querySelectorAll(".hero-float-item"));
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const itemCount = items.length || 1;

  const renderFrame = (time = 0) => {
    const rect = hero.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const visible = rect.bottom > -viewportHeight * 0.2 && rect.top < viewportHeight * 1.2;
    const orbitRect = orbit.getBoundingClientRect();
    const orbitWidth = Math.max(orbitRect.width, 1);
    const orbitHeight = Math.max(orbitRect.height, 1);
    const isMobile = window.innerWidth < 760;
    const rx = orbitWidth * (isMobile ? 0.42 : 0.46);
    const ry = orbitHeight * (isMobile ? 0.24 : 0.3);
    const progress = reducedMotion ? 0.12 : time * 0.000055;

    items.forEach((item, index) => {
      const phase = ((index / itemCount) + progress) % 1;
      const angle = phase * Math.PI * 2;
      const xBase = Math.cos(angle) * rx;
      const yBase = Math.sin(angle) * ry + Math.cos(angle * 2) * (isMobile ? 10 : 24);
      const depth = (Math.sin(angle) + 1) / 2;
      const scale = (isMobile ? 0.5 : 0.44) + depth * (isMobile ? 0.42 : 0.5);
      const opacity = 0.2 + depth * 0.8;
      const rotate = Math.cos(angle) * (isMobile ? 7 : 10);
      const blur = Math.max(0, (1 - depth) * 1.5);
      const shadow = 0.18 + depth * 0.2;

      item.style.zIndex = String(Math.round(depth * 100));
      item.style.opacity = opacity.toFixed(3);
      item.style.filter = `blur(${blur.toFixed(2)}px) drop-shadow(0 ${Math.round(18 + depth * 20)}px ${Math.round(24 + depth * 34)}px rgba(0, 0, 0, ${shadow.toFixed(2)}))`;
      item.style.transform = `translate3d(calc(-50% + ${xBase.toFixed(2)}px), calc(-50% + ${yBase.toFixed(2)}px), 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`;
    });

    if (!reducedMotion || visible) {
      window.heroFloatMotionFrame = requestAnimationFrame(renderFrame);
    }
  };

  renderFrame();
}

function getResultsTitle(categoryId, searchQuery) {
  if (categoryId) return getCategoryName(categoryId);
  if (searchQuery) return `Busca por "${searchQuery}"`;
  return "Todos os Produtos";
}

function renderProducts(container, categoryId, searchQuery) {
  const bannerHtml = `
    <section class="page-hero">
      <div class="container">
        <h1>Nossos Produtos</h1>
        <p>Filtre por linha, procure pelo modelo desejado e abra o detalhe para ver especificações e solicitar orçamento.</p>
      </div>
    </section>
  `;

  const layoutHtml = `
    <section class="section-white">
      <div class="container products-page-layout">
        <aside class="filter-sidebar">
          <div class="filter-header" onclick="toggleMobileFilter()">
            <h3>Filtrar por Linha</h3>
            <i class="fas fa-chevron-down mobile-only-icon" id="filter-chevron"></i>
          </div>
          <ul class="filter-list collapsed-mobile" id="filter-list">
            <li><a href="#" class="${!categoryId && !searchQuery ? "active" : ""}" onclick="event.preventDefault(); navigate('products', null, null); closeMobileFilter();">Todos os Produtos</a></li>
            ${categoriesData.map((c) => `
              <li><a href="#" class="${categoryId === c.id ? "active" : ""}" onclick="event.preventDefault(); navigate('products', '${c.id}', null); closeMobileFilter();">${c.name}</a></li>
            `).join("")}
          </ul>
        </aside>
        <div class="products-main" id="products-main-grid"></div>
      </div>
    </section>
  `;

  container.innerHTML = bannerHtml + layoutHtml;

  let filtered = productsData;
  if (categoryId) {
    filtered = productsData.filter((p) => classifyCategory(p.title) === categoryId);
  } else if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = productsData.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      classifyCategory(p.title).toLowerCase().includes(q) ||
      getCategoryName(classifyCategory(p.title)).toLowerCase().includes(q) ||
      getProductLine(p.title).toLowerCase().includes(q)
    );
  }

  const gridContainer = document.getElementById("products-main-grid");
  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state">
        <h2>Nenhum produto encontrado</h2>
        <p>Nenhum produto encontrado neste filtro ou pesquisa.</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = `
    <div class="results-bar">
      <div>
        <h2>${getResultsTitle(categoryId, searchQuery)}</h2>
        <p>${filtered.length} ${filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}</p>
      </div>
    </div>
    <div class="products-grid">
      ${filtered.map((p) => renderProductCard(p)).join("")}
    </div>
  `;
}

function renderProductDetail(container, productId) {
  const p = productsData[productId];
  if (!p) {
    container.innerHTML = `
      <section class="section-white">
        <div class="container">
          <div class="empty-state">
            <h2>Produto não encontrado</h2>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const galleryImages = [
    {
      type: "original",
      src: p.image || "https://via.placeholder.com/600x600?text=Sem+Foto",
      alt: p.title
    }
  ];

  if (p.aiImage) {
    galleryImages.push({
      type: "ai",
      src: p.aiImage,
      alt: p.title
    });
  }

  const galleryPayload = encodeURIComponent(JSON.stringify(galleryImages));
  const switcherHtml = galleryImages.length > 1
    ? `
      <div class="gallery-switcher">
        ${galleryImages.map((item, index) => `
          <button type="button" class="gallery-choice ${index === 0 ? "active" : ""}" onclick="setProductDetailImage(${index})" aria-label="Ver imagem ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>
        `).join("")}
      </div>
    `
    : "";

  const arrowsHtml = galleryImages.length > 1
    ? `
      <button type="button" class="gallery-arrow gallery-arrow-prev" onclick="event.stopPropagation(); previousProductDetailImage()" aria-label="Foto anterior">
        <i class="fas fa-chevron-left" aria-hidden="true"></i>
      </button>
      <button type="button" class="gallery-arrow gallery-arrow-next" onclick="event.stopPropagation(); nextProductDetailImage()" aria-label="Próxima foto">
        <i class="fas fa-chevron-right" aria-hidden="true"></i>
      </button>
    `
    : "";

  if (galleryImages.length > 1) {
    window.autoToggleInterval = setInterval(() => {
      const image = document.getElementById("product-main-image");
      if (image) nextProductDetailImage();
    }, 3200);
  }

  container.innerHTML = `
    <section class="section-white">
      <div class="container">
        <a href="#" class="back-btn" onclick="event.preventDefault(); window.history.back()">
          <i class="fas fa-arrow-left"></i> Voltar
        </a>
        <div class="product-detail-layout">
          <div class="product-detail-gallery">
            <div class="product-detail-main-image" onpointerdown="startProductGallerySwipe(event)" onpointerup="endProductGallerySwipe(event)" onpointercancel="cancelProductGallerySwipe()">
              <img id="product-main-image" src="${galleryImages[0].src}" alt="${galleryImages[0].alt}" data-gallery="${galleryPayload}" data-index="0" data-view-type="${galleryImages[0].type}" onclick="handleProductImageClick(event, this)" onerror="this.src='https://via.placeholder.com/600x600?text=Sem+Foto'">
              ${arrowsHtml}
            </div>
            ${switcherHtml}
          </div>
          <div class="product-detail-info">
            <span class="product-category">${getCategoryName(classifyCategory(p.title))}</span>
            <h1>${p.title}</h1>
            <div class="product-detail-desc">
              ${p.description || "Descrição detalhada não disponível no momento. Entre em contato para mais especificações técnicas."}
            </div>
            <div class="product-specs">
              <h3>Especificações Técnicas</h3>
              <ul class="spec-list">
                <li><span class="spec-label">Material:</span> <span>${p.title.toLowerCase().includes("angelim") ? "Madeira Angelim" : "Consulte"}</span></li>
                <li><span class="spec-label">Linha:</span> <span>${getProductLine(p.title)}</span></li>
                ${p.title.toLowerCase().includes("vidro") ? "<li><span class=\"spec-label\">Detalhe:</span> <span>Com Vidro</span></li>" : ""}
              </ul>
            </div>
            <div class="detail-actions">
              <a href="${WppLink(p.title)}" target="_blank" rel="noopener" class="whatsapp-btn">
                <i class="fab fa-whatsapp"></i>
                Solicitar orçamento
              </a>
              <button class="btn btn-outline" onclick="navigate('products', '${classifyCategory(p.title)}')">
                Ver linha ${getCategoryName(classifyCategory(p.title))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

let productGallerySwipeStart = null;
let productGallerySwipeHandledAt = 0;

function readProductGallery() {
  const image = document.getElementById("product-main-image");
  if (!image) return [];

  try {
    return JSON.parse(decodeURIComponent(image.dataset.gallery || "[]"));
  } catch (e) {
    return [];
  }
}

function setProductDetailImage(index) {
  const image = document.getElementById("product-main-image");
  const gallery = readProductGallery();
  const selected = gallery[index];
  if (!image || !selected) return;

  image.src = selected.src;
  image.alt = selected.alt;
  image.dataset.index = String(index);
  image.dataset.viewType = selected.type || "original";

  document.querySelectorAll(".gallery-choice").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
    btn.setAttribute("aria-current", i === index ? "true" : "false");
  });
}

function previousProductDetailImage() {
  const image = document.getElementById("product-main-image");
  const gallery = readProductGallery();
  if (!image || gallery.length <= 1) return;

  const currentIndex = Number(image.dataset.index || 0);
  const previousIndex = (currentIndex - 1 + gallery.length) % gallery.length;
  setProductDetailImage(previousIndex);
}

function nextProductDetailImage() {
  const image = document.getElementById("product-main-image");
  const gallery = readProductGallery();
  if (!image || gallery.length <= 1) return;

  const nextIndex = (Number(image.dataset.index || 0) + 1) % gallery.length;
  setProductDetailImage(nextIndex);
}

function handleProductImageClick(event, image) {
  if (Date.now() - productGallerySwipeHandledAt < 350) {
    event.preventDefault();
    return;
  }

  openLightbox(image.src);
}

function startProductGallerySwipe(event) {
  if (isProductGalleryControl(event.target)) return;

  const gallery = readProductGallery();
  if (gallery.length <= 1) return;

  event.currentTarget.setPointerCapture?.(event.pointerId);

  productGallerySwipeStart = {
    x: event.clientX,
    y: event.clientY
  };
}

function endProductGallerySwipe(event) {
  if (!productGallerySwipeStart) return;

  const deltaX = event.clientX - productGallerySwipeStart.x;
  const deltaY = event.clientY - productGallerySwipeStart.y;
  const isHorizontalSwipe = Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

  cancelProductGallerySwipe();

  if (!isHorizontalSwipe) return;

  productGallerySwipeHandledAt = Date.now();
  event.preventDefault();

  if (deltaX < 0) nextProductDetailImage();
  else previousProductDetailImage();
}

function cancelProductGallerySwipe() {
  productGallerySwipeStart = null;
}

function isProductGalleryControl(target) {
  return target?.closest?.(".gallery-arrow, .gallery-choice");
}

window.setProductDetailImage = setProductDetailImage;
window.previousProductDetailImage = previousProductDetailImage;
window.nextProductDetailImage = nextProductDetailImage;
window.startProductGallerySwipe = startProductGallerySwipe;
window.endProductGallerySwipe = endProductGallerySwipe;
window.cancelProductGallerySwipe = cancelProductGallerySwipe;

function toggleMenu() {
  const nav = document.getElementById("nav-links");
  if (!nav) return;
  nav.classList.toggle("active");
  document.body.classList.toggle("menu-open", nav.classList.contains("active"));
}

function closeMenu() {
  const nav = document.getElementById("nav-links");
  if (!nav) return;
  nav.classList.remove("active");
  document.body.classList.remove("menu-open");
}

window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "var(--shadow)";
  } else {
    navbar.style.boxShadow = "none";
  }
});

window.handleSearchKey = function (event) {
  if (event.key === "Enter") handleSearchClick();
};

window.handleSearchClick = function () {
  const input = document.getElementById("searchInput");
  if (!input) return;
  const val = input.value.trim();
  if (val) navigate("products", null, val);
};

window.handleProductCardClick = function (event, idx) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  navigate("product", idx);
};

window.toggleMobileFilter = function () {
  if (window.innerWidth > 860) return;

  const list = document.getElementById("filter-list");
  const icon = document.getElementById("filter-chevron");
  if (!list) return;

  const collapsed = list.classList.toggle("collapsed-mobile");
  if (icon) icon.className = collapsed ? "fas fa-chevron-down mobile-only-icon" : "fas fa-chevron-up mobile-only-icon";
};

window.closeMobileFilter = function () {
  if (window.innerWidth <= 860) {
    const list = document.getElementById("filter-list");
    const icon = document.getElementById("filter-chevron");
    if (list) list.classList.add("collapsed-mobile");
    if (icon) icon.className = "fas fa-chevron-down mobile-only-icon";
  }
};

window.openLightbox = function (src) {
  let lightbox = document.getElementById("image-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "image-lightbox";
    lightbox.onclick = window.closeLightbox;

    const img = document.createElement("img");
    img.id = "lightbox-img";

    lightbox.appendChild(img);
    document.body.appendChild(lightbox);
  }

  const img = document.getElementById("lightbox-img");
  img.src = src;
  lightbox.style.display = "flex";

  setTimeout(() => {
    lightbox.style.opacity = "1";
    img.style.transform = "scale(1)";
  }, 10);
};

window.closeLightbox = function () {
  const lightbox = document.getElementById("image-lightbox");
  if (!lightbox) return;

  lightbox.style.opacity = "0";
  const img = document.getElementById("lightbox-img");
  if (img) img.style.transform = "scale(0.96)";

  setTimeout(() => {
    lightbox.style.display = "none";
  }, 280);
};

window.addEventListener("DOMContentLoaded", loadData);
