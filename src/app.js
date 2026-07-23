const APP_CONTENT = document.getElementById('app-content');
const SEARCH_FORM = document.getElementById('search-form');
const SEARCH_INPUT = document.getElementById('searchInput');
const SIDEBAR = document.getElementById('sidebar');
const MOBILE_BTN = document.getElementById('mobile-menu-btn');
const OVERLAY = document.getElementById('sidebar-overlay');
const NAV_LINKS = document.querySelectorAll('.nav-link');

const WIKI_API_URL = 'https://ru.wikipedia.org/w/api.php?origin=*&action=query&format=json';

// Allowed search tags for VIGER Easter Egg
const VIGER_TAGS = [
    'viger',
    'viger yt',
    'vigerix',
    'temurshoh',
    'temurshoh ahmadaliyev'
];

// --- API Functions ---

async function fetchWikiSearch(query, limit = 12) {
    try {
        const res = await fetch(`${WIKI_API_URL}&list=search&srsearch=${encodeURIComponent(query)}&utf8=&srlimit=${limit}`);
        const data = await res.json();
        return data.query.search;
    } catch (e) {
        console.error("Wiki Search Error:", e);
        return [];
    }
}

async function fetchWikiArticle(title) {
    try {
        const res = await fetch(`${WIKI_API_URL}&prop=extracts|pageimages&exintro=1&explaintext=0&piprop=original&titles=${encodeURIComponent(title)}`);
        const data = await res.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        return pages[pageId];
    } catch (e) {
        console.error("Wiki Article Error:", e);
        return null;
    }
}

async function fetchCategoryPreviews(query) {
    return await fetchWikiSearch(query, 12);
}

// --- UI Functions ---

function showSkeletonLoading() {
    APP_CONTENT.innerHTML = `
        <div class="article-view" style="width: 100%;">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
        </div>
    `;
}

function updateActiveNav(hash) {
    NAV_LINKS.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash || (hash === '' && link.getAttribute('href') === '#home')) {
            link.classList.add('active');
        }
    });
}

function closeMobileMenu() {
    SIDEBAR.classList.remove('open');
}

// --- Render Views ---

function renderCardsGrid(items, title, desc) {
    let html = `
        <div class="page-header">
            <h2 class="page-title">${title}</h2>
            <p class="page-desc">${desc}</p>
        </div>
        <div class="grid-cards">
    `;
    
    if (!items || items.length === 0) {
        html += `</div><p class="error-msg">По вашему запросу ничего не найдено. Попробуйте изменить ключевые слова.</p>`;
    } else {
        items.forEach(item => {
            // Remove HTML tags from snippet returned by Wiki API
            const cleanSnippet = item.snippet.replace(/<[^>]*>?/gm, '');
            html += `
                <a href="#article/${encodeURIComponent(item.title)}" class="wiki-card glass-panel">
                    <h3>${item.title}</h3>
                    <p>${cleanSnippet}...</p>
                </a>
            `;
        });
        html += `</div>`;
    }
    
    APP_CONTENT.innerHTML = html;
}

function renderArticle(pageData) {
    if (!pageData || pageData.missing) {
        APP_CONTENT.innerHTML = `<div class="error-msg">Статья не найдена или была удалена.</div>`;
        return;
    }

    const imageHtml = pageData.original ? `<img src="${pageData.original.source}" alt="${pageData.title}" class="article-image">` : '';
    
    APP_CONTENT.innerHTML = `
        <div class="article-view">
            <div class="article-header">
                <h1 class="article-title">${pageData.title}</h1>
            </div>
            ${imageHtml}
            <div class="article-content">
                ${pageData.extract}
            </div>
        </div>
    `;
}

function renderVigerPage() {
    APP_CONTENT.innerHTML = `
        <div class="article-view">
            <div class="viger-header">
                <div class="viger-avatar"></div>
                <h1 class="viger-title">Темуршох Ахмадалиев</h1>
                <p class="viger-subtitle">Широко известен как <strong>VIGER YT</strong> (или VIGERIX)</p>
            </div>
            
            <div class="disclaimer">
                <strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> Представленная ниже биография является художественным произведением и концептуальной историей, созданной для демонстрации возможностей платформы ZETA Wiki. Все цифры, стартапы и инвестиционные раунды являются вымышленными.
            </div>

            <div class="article-content">
                <p><strong>Темуршох Ахмадалиев</strong> (род. в начале 2000-х годов), более известный в сети под псевдонимами <strong>VIGER YT</strong> и <strong>VIGERIX</strong> — вымышленный гениальный программист, технологический визионер и серийный предприниматель. Он получил мировую известность благодаря созданию экосистемы ZETA и популяризации подхода <em>«AI-Driven Development»</em> (Разработка, управляемая ИИ).</p>
                
                <h2>Ранние годы и YouTube</h2>
                <p>Свой путь VIGER начинал как создатель контента на платформе YouTube. Первоначально он выпускал ролики по видеоиграм, включая модификации для Minecraft, однако вскоре его контент эволюционировал в сторону программирования и технологий. На своем канале он одним из первых начал демонстрировать, как искусственный интеллект может полностью заменять целые отделы разработчиков.</p>
                
                <h2>Создание ZETA-Core и инвестиции</h2>
                <p>В 21 год VIGER основал стартап <em>ZETA-Core</em> — платформу, способную автономно генерировать сложную веб-архитектуру на основе текстовых запросов. По легенде, первоначальный код ZETA был написан всего за 48 часов в рамках внутреннего хакатона.</p>
                
                <p>Проект произвел фурор в Кремниевой долине. Во время посевного раунда (Seed round) стартап привлек внимание крупных венчурных фондов. В результате успешной монетизации своих AI-решений и продажи лицензий крупным корпорациям, капитал Темуршоха быстро превысил отметку в <strong>$2,000,000</strong>, сделав его одним из самых молодых и успешных IT-предпринимателей нового поколения.</p>

                <div class="stats-grid">
                    <div class="stat-card glass-panel">
                        <div class="stat-value">$2.4M</div>
                        <div class="stat-label">Оценка капитала</div>
                    </div>
                    <div class="stat-card glass-panel">
                        <div class="stat-value">ZETA</div>
                        <div class="stat-label">Флагманский проект</div>
                    </div>
                    <div class="stat-card glass-panel">
                        <div class="stat-value">99%</div>
                        <div class="stat-label">Автоматизация кода</div>
                    </div>
                </div>

                <h2>Философия и влияние</h2>
                <p>Темуршох активно продвигает идею того, что ручное написание кода уходит в прошлое. Его самая известная цитата: <em>«Будущее не за теми, кто знает синтаксис языка, а за теми, кто умеет правильно формулировать мысли для машин»</em>.</p>
                
                <p>Его деятельность вдохновила сотни тысяч молодых людей по всему миру отказаться от стандартного изучения программирования в пользу освоения нейросетей, промпт-инжиниринга и архитектурного мышления.</p>
            </div>
        </div>
    `;
}

// --- Router ---

async function handleRoute() {
    const hash = window.location.hash || '#home';
    updateActiveNav(hash);
    closeMobileMenu();
    showSkeletonLoading();

    APP_CONTENT.scrollTo(0,0);

    try {
        if (hash === '#home') {
            const items = await fetchCategoryPreviews('Научные открытия');
            renderCardsGrid(items, 'ZETA Wiki', 'Свободная современная энциклопедия. Ищите всё, что угодно.');
        } 
        else if (hash.startsWith('#category/')) {
            const category = decodeURIComponent(hash.replace('#category/', ''));
            const items = await fetchCategoryPreviews(category);
            renderCardsGrid(items, `Категория: ${category}`, `Самые популярные и релевантные статьи в разделе «${category}».`);
        }
        else if (hash.startsWith('#search/')) {
            const query = decodeURIComponent(hash.replace('#search/', ''));
            const items = await fetchWikiSearch(query, 20);
            renderCardsGrid(items, `Результаты поиска`, `Показаны статьи по запросу: "${query}"`);
        }
        else if (hash.startsWith('#article/')) {
            const title = decodeURIComponent(hash.replace('#article/', ''));
            const articleData = await fetchWikiArticle(title);
            renderArticle(articleData);
        }
        else if (hash === '#viger') {
            renderVigerPage();
        }
        else {
            APP_CONTENT.innerHTML = `<div class="error-msg">Упс! Страница не найдена. Воспользуйтесь меню или поиском.</div>`;
        }
    } catch (e) {
        APP_CONTENT.innerHTML = `<div class="error-msg">Произошла ошибка при загрузке данных. Проверьте подключение к интернету.</div>`;
    }
}

// --- Event Listeners ---

window.addEventListener('hashchange', handleRoute);

SEARCH_FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = SEARCH_INPUT.value.trim();
    if (query) {
        // Check for VIGER secret tags
        if (VIGER_TAGS.includes(query.toLowerCase())) {
            window.location.hash = `#viger`;
        } else {
            window.location.hash = `#search/${encodeURIComponent(query)}`;
        }
        SEARCH_INPUT.value = '';
        SEARCH_INPUT.blur(); // Hide keyboard on mobile
    }
});

MOBILE_BTN.addEventListener('click', () => { SIDEBAR.classList.add('open'); });
OVERLAY.addEventListener('click', closeMobileMenu);

// Intercept wiki links inside loaded articles
APP_CONTENT.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('/wiki/')) {
        e.preventDefault();
        const title = e.target.getAttribute('href').replace('/wiki/', '');
        window.location.hash = `#article/${title}`;
    }
});

// Init
handleRoute();
