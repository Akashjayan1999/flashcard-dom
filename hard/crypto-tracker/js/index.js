  let allCoins = [];
  let currency = 'usd';
  let searchQuery = '';

  const currencySymbols = { usd: '$', eur: '€', inr: '₹' };
  const currencyNames = { usd: 'USD', eur: 'EUR', inr: 'INR' };

  const coinList = document.getElementById('coinList');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const errorBox = document.getElementById('errorBox');
  const noResults = document.getElementById('noResults');
  const searchInput = document.getElementById('searchInput');
  const lastUpdated = document.getElementById('lastUpdated');

  function formatPrice(val, curr) {
    const sym = currencySymbols[curr];
    if (val >= 1000) return sym + val.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (val >= 1) return sym + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    return sym + val.toFixed(6);
  }

  function formatLarge(val, curr) {
    const sym = currencySymbols[curr];
    if (val >= 1e12) return sym + (val / 1e12).toFixed(2) + 'T';
    if (val >= 1e9) return sym + (val / 1e9).toFixed(2) + 'B';
    if (val >= 1e6) return sym + (val / 1e6).toFixed(2) + 'M';
    return sym + val.toLocaleString();
  }

  function setLoading(on) {
    loadingOverlay.classList.toggle('active', on);
  }

  function setError(msg) {
    errorBox.classList.add('active');
    document.getElementById('errorMsg').textContent = msg || 'Unable to fetch data.';
  }

  function clearError() { errorBox.classList.remove('active'); }

  async function fetchCoins() {
    setLoading(true);
    clearError();
    coinList.innerHTML = '';
    noResults.classList.remove('active');
    try {
     const options = {method: 'GET', headers: {'x-cg-demo-api-key': '<API-KEY>'}};
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;
      const res = await fetch(url,options);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      allCoins = await res.json();
      renderCoins();
      updateStats();
      lastUpdated.textContent = 'Updated ' + new Date().toLocaleTimeString();
    } catch (e) {
      setError(e.message.includes('429') ? 'Rate limit reached. Please wait a moment.' : 'Could not connect to CoinGecko API.');
    } finally {
      setLoading(false);
    }
  }

  function renderCoins() {
    const q = searchQuery.toLowerCase().trim();
    const filtered = allCoins.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    );

    noResults.classList.toggle('active', filtered.length === 0);
    coinList.innerHTML = '';

    filtered.forEach((coin, i) => {
      const change = coin.price_change_percentage_24h;
      const isUp = change >= 0;
      const changeStr = (isUp ? '+' : '') + (change ? change.toFixed(2) : '0.00') + '%';

      const row = document.createElement('div');
      row.className = 'coin-row';
      row.style.animationDelay = (i * 0.03) + 's';

      row.innerHTML = `
        <div class="rank">${coin.market_cap_rank}</div>
        <div class="coin-info">
          <img class="coin-icon" src="${coin.image}" alt="${coin.name}" loading="lazy">
          <div class="coin-name-block">
            <span class="coin-name">${coin.name}</span>
            <span class="coin-symbol">${coin.symbol}</span>
          </div>
        </div>
        <div class="price">${formatPrice(coin.current_price, currency)}</div>
        <div><span class="change ${isUp ? 'up' : 'down'}">${changeStr}</span></div>
        <div class="market-cap col-cap">${coin.market_cap ? formatLarge(coin.market_cap, currency) : '—'}</div>
        <div class="volume col-vol">${coin.total_volume ? formatLarge(coin.total_volume, currency) : '—'}</div>
      `;

      coinList.appendChild(row);
    });
  }

  function updateStats() {
    if (!allCoins.length) return;

    document.getElementById('statCoins').textContent = allCoins.length;

    const sorted = [...allCoins].filter(c => c.price_change_percentage_24h != null)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);

    if (sorted.length) {
      const top = sorted[0];
      const bot = sorted[sorted.length - 1];
      document.getElementById('statGainer').textContent = `${top.symbol.toUpperCase()} +${top.price_change_percentage_24h.toFixed(1)}%`;
      document.getElementById('statLoser').textContent = `${bot.symbol.toUpperCase()} ${bot.price_change_percentage_24h.toFixed(1)}%`;

      const avg = allCoins.reduce((sum, c) => sum + (c.price_change_percentage_24h || 0), 0) / allCoins.length;
      const avgEl = document.getElementById('statAvg');
      avgEl.textContent = (avg >= 0 ? '+' : '') + avg.toFixed(2) + '%';
      avgEl.style.color = avg >= 0 ? 'var(--up)' : 'var(--down)';
    }
  }

  // Search
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    renderCoins();
  });

  // Currency toggle
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currency = btn.dataset.currency;
      fetchCoins();
    });
  });

  // Auto-refresh every 60 seconds
  fetchCoins();
  setInterval(fetchCoins, 600000);