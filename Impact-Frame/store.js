/* État local de l'édition archive : aucune requête réseau ni donnée de paiement. */
(function (root) {
  'use strict';

  var KEY = 'impact-frame-archive-v1';
  var MAX_QUANTITY = 20;
  var MAX_ORDERS = 20;
  var products = new Map();
  (Array.isArray(root.IFCatalog) ? root.IFCatalog : []).forEach(function (product) {
    if (product && typeof product.id === 'string' && /^[a-z0-9-]{1,64}$/i.test(product.id) &&
        Number.isSafeInteger(product.price) && product.price >= 0 && product.price <= 100000000) {
      products.set(product.id, product);
    }
  });

  function fresh() {
    return { cart: [], favorites: [], profile: { name: '' }, orders: [] };
  }

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function cleanName(value) {
    return Array.from(typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, '').trim() : '').slice(0, 40).join('');
  }

  function cleanItems(items) {
    var quantities = new Map();
    (Array.isArray(items) ? items : []).slice(0, 1000).forEach(function (item) {
      if (!item || !products.has(item.id) || !Number.isSafeInteger(item.quantity) || item.quantity < 1) return;
      quantities.set(item.id, Math.min(MAX_QUANTITY, (quantities.get(item.id) || 0) + item.quantity));
    });
    return Array.from(quantities, function (entry) { return { id: entry[0], quantity: entry[1] }; });
  }

  function snapshot(items) {
    return cleanItems(items).map(function (item) {
      var product = products.get(item.id);
      return { id: item.id, name: String(product.name || product.id), price: product.price, quantity: item.quantity };
    });
  }

  function sum(items) {
    return items.reduce(function (total, item) { return total + item.price * item.quantity; }, 0);
  }

  function normalize(raw) {
    var state = fresh();
    if (!raw || typeof raw !== 'object') return state;
    state.cart = cleanItems(raw.cart);
    state.favorites = Array.from(new Set((Array.isArray(raw.favorites) ? raw.favorites : []).filter(function (id) {
      return products.has(id);
    })));
    state.profile.name = cleanName(raw.profile && raw.profile.name);
    state.orders = (Array.isArray(raw.orders) ? raw.orders : []).slice(0, MAX_ORDERS).map(function (order) {
      if (!order || typeof order.id !== 'string' || !/^IF-[A-Z0-9-]{4,60}$/.test(order.id) ||
          typeof order.date !== 'string' || !Number.isFinite(Date.parse(order.date))) return null;
      var items = snapshot(order.items);
      if (!items.length) return null;
      return { id: order.id, date: new Date(order.date).toISOString(), items: items, total: sum(items) };
    }).filter(Boolean);
    return state;
  }

  var storage = null;
  var storageAvailable = false;
  var state = fresh();
  try {
    storage = root.localStorage;
    var probe = KEY + '-probe';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    storageAvailable = true;
    var saved = storage.getItem(KEY);
    if (saved) {
      try { state = normalize(JSON.parse(saved)); } catch (_) { state = fresh(); }
    }
  } catch (_) {
    storageAvailable = false;
  }

  // Le navigateur prévient les autres onglets ; leur état en mémoire doit suivre.
  if (typeof root.addEventListener === 'function') {
    root.addEventListener('storage', function (event) {
      if (!storageAvailable || (event.key !== KEY && event.key !== null)) return;
      if (event.storageArea && event.storageArea !== storage) return;
      if (event.key === null || event.newValue === null) {
        state = fresh();
        return;
      }
      try { state = normalize(JSON.parse(event.newValue)); }
      catch (_) { state = fresh(); }
    });
  }

  function persist() {
    if (storageAvailable) {
      try { storage.setItem(KEY, JSON.stringify(state)); }
      catch (_) { storageAvailable = false; }
    }
    return copy(state);
  }

  function requireProduct(id) {
    if (!products.has(id)) throw new Error('Article introuvable.');
  }

  root.IFStore = Object.freeze({
    get available() { return storageAvailable; },
    read: function () { return copy(state); },
    add: function (id) {
      requireProduct(id);
      var item = state.cart.find(function (entry) { return entry.id === id; });
      if (item) item.quantity = Math.min(MAX_QUANTITY, item.quantity + 1);
      else state.cart.push({ id: id, quantity: 1 });
      return persist();
    },
    quantity: function (id, value) {
      requireProduct(id);
      var count = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
      if (!Number.isFinite(count)) return copy(state);
      count = Math.max(0, Math.min(MAX_QUANTITY, Math.floor(count)));
      var item = state.cart.find(function (entry) { return entry.id === id; });
      if (count === 0) state.cart = state.cart.filter(function (entry) { return entry.id !== id; });
      else if (item) item.quantity = count;
      else state.cart.push({ id: id, quantity: count });
      return persist();
    },
    remove: function (id) {
      state.cart = state.cart.filter(function (entry) { return entry.id !== id; });
      return persist();
    },
    favorite: function (id) {
      requireProduct(id);
      if (state.favorites.indexOf(id) === -1) state.favorites.push(id);
      else state.favorites = state.favorites.filter(function (entry) { return entry !== id; });
      return persist();
    },
    profile: function (name) {
      state.profile.name = cleanName(name);
      return persist();
    },
    order: function () {
      var items = snapshot(state.cart);
      if (!items.length) throw new Error('Votre panier est vide.');
      var order = {
        id: 'IF-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
        date: new Date().toISOString(),
        items: items,
        total: sum(items)
      };
      state.orders.unshift(order);
      state.orders = state.orders.slice(0, MAX_ORDERS);
      state.cart = [];
      persist();
      return copy(order);
    },
    reset: function () {
      state = fresh();
      if (storageAvailable) {
        try { storage.removeItem(KEY); } catch (_) { storageAvailable = false; }
      }
      return copy(state);
    }
  });
})(window);
