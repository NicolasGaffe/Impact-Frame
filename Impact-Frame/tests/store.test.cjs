'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const code = fs.readFileSync(path.join(__dirname, '../store.js'), 'utf8');
const KEY = 'impact-frame-archive-v1';
const catalogue = [
  { id: 'tableau', name: 'Grand Line', price: 3990 },
  { id: 'luffy', name: 'Luffy', price: 6990 }
];
function start(saved, blocked = false) {
  const values = new Map(saved === undefined ? [] : [[KEY, typeof saved === 'string' ? saved : JSON.stringify(saved)]]);
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => { if (blocked) throw new Error('blocked'); values.set(key, value); },
    removeItem: key => values.delete(key)
  };
  const listeners = new Map();
  const window = { IFCatalog: catalogue, localStorage: storage, addEventListener: (name, handler) => listeners.set(name, handler) };
  vm.runInNewContext(code, { window, Map, Set, Date, Math, JSON, Array, Number, String, Object, Error });
  const dispatchStorage = event => listeners.get('storage')?.({ storageArea: storage, ...event });
  return { store: window.IFStore, values, storage, dispatchStorage };
}
const plain = value => JSON.parse(JSON.stringify(value));
let count = 0;
function test(name, fn) { fn(); count++; process.stdout.write('OK ' + name + '\n'); }

test('panier, limites, suppressions et isolation des copies', () => {
  const { store } = start();
  store.add('tableau'); store.add('tableau');
  assert.equal(store.read().cart[0].quantity, 2);
  store.quantity('tableau', '40');
  assert.equal(store.read().cart[0].quantity, 20);
  store.add('tableau');
  assert.equal(store.read().cart[0].quantity, 20);
  store.quantity('tableau', 'invalid');
  assert.equal(store.read().cart[0].quantity, 20);
  const copy = store.read(); copy.cart[0].quantity = 999;
  assert.equal(store.read().cart[0].quantity, 20);
  store.quantity('tableau', -1);
  assert.equal(store.read().cart.length, 0);
  store.quantity('luffy', 2.9);
  assert.equal(store.read().cart[0].quantity, 2);
  store.remove('luffy');
  assert.equal(store.read().cart.length, 0);
  assert.throws(() => store.add('not-a-product'), /introuvable/);
});

test('commande : total en centimes, instantané et panier vidé', () => {
  const { store } = start();
  store.quantity('tableau', 2); store.add('luffy');
  const order = store.order();
  assert.equal(order.total, 14970);
  assert.match(order.id, /^IF-/);
  assert.ok(Number.isFinite(Date.parse(order.date)));
  assert.equal(order.items[0].name, 'Grand Line');
  assert.equal(order.items[0].price, 3990);
  assert.equal(store.read().cart.length, 0);
  order.items[0].price = 0;
  assert.equal(store.read().orders[0].items[0].price, 3990);
  assert.throws(() => store.order(), /vide/);
});

test('persistance, favoris et profil pseudonyme', () => {
  const { store, values } = start();
  assert.equal(store.available, true);
  store.add('luffy'); store.favorite('tableau'); store.profile('  Aventure\u0000  ');
  const resumed = start(values.get(KEY)).store;
  assert.equal(resumed.read().cart[0].id, 'luffy');
  assert.deepEqual(plain(resumed.read().favorites), ['tableau']);
  assert.equal(resumed.read().profile.name, 'Aventure');
  resumed.favorite('tableau');
  assert.equal(resumed.read().favorites.length, 0);
  resumed.profile('😀'.repeat(50));
  assert.equal(Array.from(resumed.read().profile.name).length, 40);
});

test('données corrompues : références, prix, doublons, dates et limites', () => {
  const { store } = start({
    cart: [{ id: 'tableau', quantity: 15 }, { id: 'tableau', quantity: 15 }, { id: 'luffy', quantity: '3' }, { id: '<script>', quantity: 1 }],
    favorites: ['tableau', 'tableau', 'unknown'], profile: { name: 12 },
    orders: [
      { id: 'IF-TEST1', date: '2026-10-27T10:00:00.000Z', total: -100, items: [{ id: 'tableau', name: 'forged', price: 1, quantity: 2 }, { id: 'unknown', quantity: 2 }] },
      { id: 'IF-TEST2', date: 'not-a-date', items: [{ id: 'luffy', quantity: 1 }] }
    ]
  });
  assert.deepEqual(plain(store.read().cart), [{ id: 'tableau', quantity: 20 }]);
  assert.deepEqual(plain(store.read().favorites), ['tableau']);
  assert.equal(store.read().profile.name, '');
  assert.equal(store.read().orders.length, 1);
  assert.equal(store.read().orders[0].total, 7980);
  assert.equal(store.read().orders[0].items[0].name, 'Grand Line');
  assert.equal(start('{bad-json').store.read().cart.length, 0);
});

test('stockage indisponible : fonctionnement en mémoire', () => {
  const { store } = start(undefined, true);
  assert.equal(store.available, false);
  store.add('luffy');
  assert.equal(store.order().total, 6990);
  assert.equal(store.read().orders.length, 1);
});

test('quota atteint après ouverture : les interactions continuent', () => {
  const { store, storage } = start();
  storage.setItem = () => { throw new Error('quota'); };
  store.add('tableau');
  assert.equal(store.available, false);
  assert.equal(store.read().cart.length, 1);
});

test('historique borné et remise à zéro complète', () => {
  const { store, values } = start();
  for (let i = 0; i < 25; i++) { store.add('luffy'); store.order(); }
  assert.equal(store.read().orders.length, 20);
  store.favorite('luffy'); store.profile('Marin'); store.add('tableau');
  store.reset();
  assert.deepEqual(plain(store.read()), { cart: [], favorites: [], profile: { name: '' }, orders: [] });
  assert.equal(values.has(KEY), false);
});

test('synchronisation entre onglets : import validé sans réécriture', () => {
  const first = start();
  const second = start();
  first.store.add('luffy'); first.store.favorite('tableau'); first.store.profile('Équipage');
  const saved = first.values.get(KEY);
  second.dispatchStorage({ key: KEY, newValue: saved });
  assert.equal(second.store.read().cart[0].id, 'luffy');
  assert.equal(second.store.read().profile.name, 'Équipage');
  assert.deepEqual(plain(second.store.read().favorites), ['tableau']);
  assert.equal(second.values.has(KEY), false, 'Le listener ne doit pas générer de boucle de stockage');
  second.dispatchStorage({ key: 'unrelated-key', newValue: null });
  assert.equal(second.store.read().cart.length, 1);
  second.dispatchStorage({ key: KEY, newValue: null, storageArea: {} });
  assert.equal(second.store.read().cart.length, 1, 'Les changements de sessionStorage sont ignorés');
  second.dispatchStorage({ key: KEY, newValue: JSON.stringify({ cart: [{ id: 'unknown', quantity: 3 }, { id: 'tableau', quantity: 100 }] }) });
  assert.deepEqual(plain(second.store.read().cart), [{ id: 'tableau', quantity: 20 }]);
  second.store.add('luffy');
  assert.equal(JSON.parse(second.values.get(KEY)).cart.length, 2);
  second.dispatchStorage({ key: KEY, newValue: '{invalid' });
  assert.equal(second.store.read().cart.length, 0);
  second.store.add('tableau');
  second.dispatchStorage({ key: KEY, newValue: null });
  assert.equal(second.store.read().cart.length, 0);
  second.store.add('tableau');
  second.dispatchStorage({ key: null, newValue: null });
  assert.equal(second.store.read().cart.length, 0, 'localStorage.clear() est pris en charge');
});

process.stdout.write(count + ' tests réussis.\n');

