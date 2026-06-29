// app.js - Main SPA routing and logic
const wppNumber = "5531985082038";
const siteOrigin = "https://www.gusmaomadeiras.com.br";

function iconSvg(id, body) {
  return `
    <svg id="${id}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      ${body}
    </svg>
  `;
}

function IconPortas() {
  return iconSvg("icon-portas", `
    <rect x="4" y="1.5" width="16" height="20.5" rx="1" />
    <line x1="3" y1="22" x2="21" y2="22" />
    <rect x="6.5" y="3.5" width="11" height="7" rx="0.5" />
    <circle cx="15.5" cy="14.5" r="0.85" fill="currentColor" stroke="none" />
  `);
}

function IconJanelas() {
  return iconSvg("icon-janelas", `
    <rect x="2.5" y="3.5" width="19" height="17" rx="1.5" />
    <line x1="12" y1="3.5" x2="12" y2="20.5" />
    <line x1="2.5" y1="12" x2="21.5" y2="12" />
    <circle cx="5" cy="5.5" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="19" cy="5.5" r="0.6" fill="currentColor" stroke="none" />
  `);
}

function IconBasculas() {
  return iconSvg("icon-basculas", `
    <rect x="2.5" y="3" width="19" height="18" rx="1.5" />
    <line x1="5" y1="10.5" x2="19" y2="8" />
    <line x1="5" y1="14.5" x2="19" y2="12" />
    <line x1="5" y1="18.5" x2="19" y2="16" />
  `);
}

function IconSeteiras() {
  return iconSvg("icon-seteiras", `
    <rect x="9" y="2" width="6" height="20" rx="3" />
    <line x1="9.5" y1="12" x2="14.5" y2="12" />
  `);
}

function IconAlisaresPortais() {
  return iconSvg("icon-alisares-portais", `
    <rect x="2" y="2" width="20" height="21" rx="1.5" />
    <rect x="4.5" y="4.5" width="15" height="18.5" rx="1" />
    <rect x="7" y="7" width="10" height="16" rx="0.5" />
    <circle cx="14.5" cy="14.5" r="0.85" fill="currentColor" stroke="none" />
  `);
}

function IconPortasCorrer() {
  return iconSvg("icon-portas-correr", `
    <rect x="1.5" y="3" width="21" height="2" rx="1" />
    <rect x="2" y="5" width="12" height="17" rx="0.5" />
    <rect x="10" y="5" width="12" height="17" rx="0.5" />
    <line x1="9.5" y1="12" x2="9.5" y2="15.5" stroke-width="2" />
    <line x1="14.5" y1="12" x2="14.5" y2="15.5" stroke-width="2" />
    <polyline points="5,3 3.5,2 3.5,4" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
    <polyline points="19,3 20.5,2 20.5,4" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
  `);
}

let productsData = [];
const categoriesData = [
  { id: "porta", name: "Porta", pluralName: "Portas", icon: IconPortas() },
  { id: "janela", name: "Janela", pluralName: "Janelas", icon: IconJanelas() },
  { id: "bascula", name: "Básculas", pluralName: "Básculas", icon: IconBasculas() },
  { id: "seteira", name: "Seteiras", pluralName: "Seteiras", icon: IconSeteiras() },
  { id: "marcos", name: "Marcos Portais Alisares", pluralName: "Marcos, Portais e Alisares", icon: IconAlisaresPortais() },
  { id: "correr", name: "Porta de Correr", pluralName: "Portas de Correr", icon: IconPortasCorrer() }
];

const heroFloatingProducts = [
  { src: "Images/hero-floating/porta-101-estruturada.webp", alt: "Porta de angelim estruturada", shape: "door" },
  { src: "Images/hero-floating/janela-41-panoramica.webp", alt: "Janela panorâmica de correr", shape: "wide" },
  { src: "Images/hero-floating/porta-53-panoramica.webp", alt: "Marco panorâmico de angelim", shape: "door" },
  { src: "Images/hero-floating/porta-correr-04-tucano.webp", alt: "Porta de correr tucano", shape: "wide" },
  { src: "Images/hero-floating/janela-10-correr.webp", alt: "Janela dupla de correr", shape: "wide" },
  { src: "Images/hero-floating/porta-36-bigbrother.webp", alt: "Porta BigBrother espaçada", shape: "door" },
  { src: "Images/hero-floating/bascula-15-panoramica.webp", alt: "Báscula panorâmica", shape: "square" },
  { src: "Images/hero-floating/janela-32-napoleao.webp", alt: "Janela napoleão de vidro", shape: "wide" },
  { src: "Images/hero-floating/porta-17-almofadas.webp", alt: "Porta dez almofadas", shape: "door" },
  { src: "Images/hero-floating/seteira-17-panoramica.webp", alt: "Seteira panorâmica", shape: "door" },
  { src: "Images/hero-floating/janela-05-vidro-almofada.webp", alt: "Janela vidro e almofada", shape: "wide" },
  { src: "Images/hero-floating/marco-10-vidro-diagonal.webp", alt: "Marco vidro diagonal", shape: "door" }
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

  syncRouteSeo(route, id, search);
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

function setMetaContent(selector, content) {
  const tag = document.querySelector(selector);
  if (tag) tag.setAttribute("content", content);
}

function setCanonical(url) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function syncRouteSeo(route, categoryId, searchQuery) {
  let title = "Gusmão Madeiras - Portfólio de Produtos";
  let description = "Gusmão Madeiras em Contagem: portas, janelas, marcos, seteiras e peças em Angelim para obras, reformas e projetos sob medida.";
  let canonical = `${siteOrigin}/`;
  let robots = "index, follow, max-image-preview:large";

  if (route === "products") {
    title = "Produtos - Gusmão Madeiras";
    description = "Conheça o catálogo da Gusmão Madeiras com portas, janelas, básculas, marcos, seteiras e portas de correr em Angelim.";
    canonical = `${siteOrigin}/produtos.html`;

    if (categoryId) {
      const category = categoriesData.find((c) => c.id === categoryId);
      if (category) {
        title = `${category.pluralName} - Gusmão Madeiras`;
        description = `Conheça ${category.pluralName.toLowerCase()} em Angelim da Gusmão Madeiras para obras, reformas e projetos sob medida.`;
        canonical = `${siteOrigin}/produtos.html?categoryId=${category.id}`;
      }
    } else if (searchQuery) {
      title = `Busca por ${searchQuery} - Gusmão Madeiras`;
      robots = "noindex, follow, max-image-preview:large";
    }
  } else if (route === "product") {
    title = "Produto - Gusmão Madeiras";
    description = "Veja detalhes do produto e solicite orçamento com a Gusmão Madeiras.";
    canonical = `${siteOrigin}/produtos.html`;
  }

  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[name="robots"]', robots);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonical);
  setCanonical(canonical);
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
  if (title.includes("porta de correr")) return "correr";
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

function getGalleryChoiceLabel(item, index) {
  if (item.type === "ai") return "IA em ambiente";
  return index === 0 ? "Fotos originais" : `Original ${index + 1}`;
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
        <div class="catalog-scene" aria-label="Casa moderna com porta, janela, seteira e báscula clicáveis">
          <img src="Images/catalogo-casa-madeira-interativa.webp" width="1672" height="941" alt="Casa moderna com porta, janela, seteira e báscula de madeira instaladas" loading="lazy" decoding="async">
          <a href="produtos.html?categoryId=porta" class="catalog-scene-link catalog-scene-door" onclick="event.preventDefault(); navigate('products', 'porta')" aria-label="Ver portas">
            <span class="catalog-scene-pin"><span class="catalog-scene-label">Porta</span></span>
          </a>
          <a href="produtos.html?categoryId=janela" class="catalog-scene-link catalog-scene-window" onclick="event.preventDefault(); navigate('products', 'janela')" aria-label="Ver janelas">
            <span class="catalog-scene-pin"><span class="catalog-scene-label">Janela</span></span>
          </a>
          <a href="produtos.html?categoryId=seteira" class="catalog-scene-link catalog-scene-seteira" onclick="event.preventDefault(); navigate('products', 'seteira')" aria-label="Ver seteiras">
            <span class="catalog-scene-pin"><span class="catalog-scene-label">Seteira</span></span>
          </a>
          <a href="produtos.html?categoryId=bascula" class="catalog-scene-link catalog-scene-bascula" onclick="event.preventDefault(); navigate('products', 'bascula')" aria-label="Ver básculas">
            <span class="catalog-scene-pin"><span class="catalog-scene-label">Báscula</span></span>
          </a>
        </div>
        <div class="categories-grid">
          ${categoriesData.map((c) => `
            <a href="produtos.html?categoryId=${c.id}" class="category-card" onclick="event.preventDefault(); navigate('products', '${c.id}')">
              <span class="category-icon" aria-hidden="true">${c.icon}</span>
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
      <img src="Images/janela-02a1-premium-transparent.png" alt="" class="page-hero-window-art" aria-hidden="true">
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
            <li><a href="produtos.html" class="${!categoryId && !searchQuery ? "active" : ""}" onclick="event.preventDefault(); navigate('products', null, null); closeMobileFilter();">Todos os Produtos</a></li>
            ${categoriesData.map((c) => `
              <li><a href="produtos.html?categoryId=${c.id}" class="${categoryId === c.id ? "active" : ""}" onclick="event.preventDefault(); navigate('products', '${c.id}', null); closeMobileFilter();">${c.name}</a></li>
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

  if (Array.isArray(p.images)) {
    p.images.forEach((src) => {
      galleryImages.push({
        type: "original",
        src,
        alt: p.title
      });
    });
  }

  const galleryPayload = encodeURIComponent(JSON.stringify(galleryImages));
  const switcherHtml = galleryImages.length > 1
    ? `
      <div class="gallery-switcher">
        ${galleryImages.map((item, index) => `
          <button type="button" class="gallery-choice ${index === 0 ? "active" : ""}" onclick="setProductDetailImage(${index})" aria-label="Ver ${getGalleryChoiceLabel(item, index)}" aria-current="${index === 0 ? "true" : "false"}"></button>
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

  container.innerHTML = `
    <section class="section-white">
      <div class="container">
        <a href="#" class="back-btn" onclick="event.preventDefault(); window.history.back()">
          <i class="fas fa-arrow-left"></i> Voltar
        </a>
        <div class="product-detail-layout">
          <div class="product-detail-gallery">
            <div class="product-detail-main-image" onclick="handleProductImageClick(event)" onpointerdown="startProductGallerySwipe(event)" onpointerup="endProductGallerySwipe(event)" onpointercancel="cancelProductGallerySwipe()">
              <img id="product-main-image" src="${galleryImages[0].src}" alt="${galleryImages[0].alt}" data-gallery="${galleryPayload}" data-index="0" data-view-type="${galleryImages[0].type}" onerror="handleProductGalleryImageError(this)">
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

function updateProductGalleryControls(activeIndex) {
  const gallery = readProductGallery();
  const switcher = document.querySelector(".gallery-switcher");

  if (switcher) {
    if (gallery.length <= 1) {
      switcher.remove();
    } else {
      switcher.innerHTML = gallery.map((item, index) => `
        <button type="button" class="gallery-choice ${index === activeIndex ? "active" : ""}" onclick="setProductDetailImage(${index})" aria-label="Ver ${getGalleryChoiceLabel(item, index)}" aria-current="${index === activeIndex ? "true" : "false"}"></button>
      `).join("");
    }
  }

  document.querySelectorAll(".gallery-arrow").forEach((btn) => {
    btn.hidden = gallery.length <= 1;
  });
}

function handleProductGalleryImageError(image) {
  const gallery = readProductGallery();
  const failedIndex = Number(image.dataset.index || 0);
  const nextGallery = gallery.filter((_, index) => index !== failedIndex);

  image.dataset.gallery = encodeURIComponent(JSON.stringify(nextGallery));

  if (!nextGallery.length) {
    image.onerror = null;
    image.src = "https://via.placeholder.com/600x600?text=Sem+Foto";
    image.alt = "Produto sem foto";
    image.dataset.index = "0";
    image.dataset.viewType = "original";
    updateProductGalleryControls(0);
    return;
  }

  const nextIndex = Math.min(failedIndex, nextGallery.length - 1);
  updateProductGalleryControls(nextIndex);
  setProductDetailImage(nextIndex);
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

function handleProductImageClick(event) {
  if (isProductGalleryControl(event.target)) return;

  if (Date.now() - productGallerySwipeHandledAt < 350) {
    event.preventDefault();
    return;
  }

  const image = document.getElementById("product-main-image");
  if (!image) return;

  openLightbox(image.currentSrc || image.src, image.alt);
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
window.handleProductGalleryImageError = handleProductGalleryImageError;
window.previousProductDetailImage = previousProductDetailImage;
window.nextProductDetailImage = nextProductDetailImage;
window.startProductGallerySwipe = startProductGallerySwipe;
window.endProductGallerySwipe = endProductGallerySwipe;
window.cancelProductGallerySwipe = cancelProductGallerySwipe;
window.handleProductImageClick = handleProductImageClick;

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

window.openLightbox = function (src, alt) {
  let lightbox = document.getElementById("image-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "image-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Imagem ampliada do produto");
    lightbox.onclick = window.closeLightbox;

    const frame = document.createElement("div");
    frame.id = "lightbox-frame";
    frame.onclick = (event) => event.stopPropagation();

    const img = document.createElement("img");
    img.id = "lightbox-img";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.id = "lightbox-close";
    closeButton.setAttribute("aria-label", "Fechar imagem ampliada");
    closeButton.innerHTML = "&times;";
    closeButton.onclick = window.closeLightbox;

    frame.appendChild(img);
    frame.appendChild(closeButton);
    lightbox.appendChild(frame);
    document.body.appendChild(lightbox);
  }

  const img = document.getElementById("lightbox-img");
  img.src = src;
  img.alt = alt || "Imagem ampliada do produto";
  lightbox.style.display = "flex";
  document.body.classList.add("lightbox-open");

  setTimeout(() => {
    lightbox.style.opacity = "1";
    document.getElementById("lightbox-frame")?.style.setProperty("transform", "scale(1)");
    document.getElementById("lightbox-close")?.focus();
  }, 10);
};

window.closeLightbox = function () {
  const lightbox = document.getElementById("image-lightbox");
  if (!lightbox) return;

  lightbox.style.opacity = "0";
  const frame = document.getElementById("lightbox-frame");
  if (frame) frame.style.transform = "scale(0.96)";

  setTimeout(() => {
    lightbox.style.display = "none";
    document.body.classList.remove("lightbox-open");
  }, 280);
};

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") window.closeLightbox();
});

window.addEventListener("DOMContentLoaded", loadData);
