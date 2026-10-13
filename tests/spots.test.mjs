import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const kantoPath = path.resolve('public/data/spots/kanto.json');
const kansaiPath = path.resolve('public/data/spots/kansai.json');

test('Spot data files exist and are valid JSON', () => {
  assert.ok(fs.existsSync(kantoPath), 'kanto.json must exist');
  assert.ok(fs.existsSync(kansaiPath), 'kansai.json must exist');

  const kantoData = JSON.parse(fs.readFileSync(kantoPath, 'utf-8'));
  const kansaiData = JSON.parse(fs.readFileSync(kansaiPath, 'utf-8'));

  assert.ok(Array.isArray(kantoData), 'kanto data must be an array');
  assert.ok(Array.isArray(kansaiData), 'kansai data must be an array');
  assert.ok(kantoData.length > 0, 'kanto data should not be empty');
  assert.ok(kansaiData.length > 0, 'kansai data should not be empty');
});

test('Spot data entries have required fields and valid coordinates', () => {
  const kantoData = JSON.parse(fs.readFileSync(kantoPath, 'utf-8'));
  const kansaiData = JSON.parse(fs.readFileSync(kansaiPath, 'utf-8'));

  const allSpots = [...kantoData, ...kansaiData];
  const ids = new Set();

  for (const spot of allSpots) {
    assert.ok(spot.id, `Spot ${spot.name || 'unknown'} must have an id`);
    assert.ok(!ids.has(spot.id), `Spot id ${spot.id} must be unique`);
    ids.add(spot.id);

    assert.ok(spot.name, `Spot ${spot.id} must have a name`);
    assert.ok(spot.region, `Spot ${spot.id} must have a region`);
    assert.ok(spot.prefecture, `Spot ${spot.id} must have a prefecture`);
    assert.ok(typeof spot.lat === 'number', `Spot ${spot.id} lat must be number`);
    assert.ok(typeof spot.lng === 'number', `Spot ${spot.id} lng must be number`);
    assert.ok(spot.lat >= 20 && spot.lat <= 46, `Spot ${spot.id} lat within Japan`);
    assert.ok(spot.lng >= 122 && spot.lng <= 154, `Spot ${spot.id} lng within Japan`);
    assert.ok(spot.stampName, `Spot ${spot.id} must have a stampName`);
    assert.ok(spot.history, `Spot ${spot.id} must have a history`);
  }
});

test('Haversine distance calculation is accurate', () => {
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const p1 = (lat1 * Math.PI) / 180;
    const p2 = (lat2 * Math.PI) / 180;
    const dp = ((lat2 - lat1) * Math.PI) / 180;
    const dl = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dp / 2) ** 2 +
      Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  // Same point
  assert.equal(calculateDistance(35.6961, 139.9936, 35.6961, 139.9936), 0);

  // Approximately 78m away
  const dClose = calculateDistance(35.6961, 139.9936, 35.6968, 139.9936);
  assert.ok(dClose > 50 && dClose < 150, `Expected ~78m, got ${dClose}`);
  assert.ok(dClose <= 500, 'Within 500m range for check-in');

  // Tokyo to Kyoto (~370km)
  const dFar = calculateDistance(35.6895, 139.6917, 34.9858, 135.7588);
  assert.ok(dFar > 350000 && dFar < 400000, `Expected ~370km, got ${dFar}`);
  assert.ok(dFar > 500, 'Far point must exceed 500m check-in threshold');
});

test('Region key sanitization prevents path traversal', () => {
  function sanitizeRegion(raw) {
    return (raw || 'kanto').replace(/[^a-zA-Z0-9_-]/g, '');
  }

  assert.equal(sanitizeRegion('kanto'), 'kanto');
  assert.equal(sanitizeRegion('kansai'), 'kansai');
  assert.equal(sanitizeRegion('../../../etc/passwd'), 'etcpasswd');
  assert.equal(sanitizeRegion('kanto/..'), 'kanto');
});
