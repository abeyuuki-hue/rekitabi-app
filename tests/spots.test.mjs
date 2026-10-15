import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const REGIONS = [
  'hokkaido_tohoku',
  'kanto',
  'chubu_hokuriku',
  'kansai',
  'chugoku',
  'shikoku',
  'kyushu_okinawa',
  'all',
];

test('All 7 region spot data files, all.json, and courses.json exist and are valid JSON', () => {
  for (const region of REGIONS) {
    const p = path.resolve(`public/data/spots/${region}.json`);
    assert.ok(fs.existsSync(p), `${region}.json must exist`);
    const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
    assert.ok(Array.isArray(data), `${region} data must be an array`);
    assert.ok(data.length > 0, `${region} data should not be empty`);
  }

  const coursesPath = path.resolve('public/data/courses.json');
  assert.ok(fs.existsSync(coursesPath), 'courses.json must exist');
  const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));
  assert.equal(courses.length, 12, 'Should have 12 stamp rally courses');
});

test('Spot data entries have required fields, unique IDs, all 47 prefectures, and valid Japan coordinates', () => {
  const allPath = path.resolve('public/data/spots/all.json');
  const allSpots = JSON.parse(fs.readFileSync(allPath, 'utf-8'));
  assert.ok(allSpots.length >= 191, `Expected at least 191 spots, got ${allSpots.length}`);

  const prefectures = new Set(allSpots.map((s) => s.prefecture));
  assert.equal(prefectures.size, 47, `Expected all 47 prefectures, got ${prefectures.size}`);

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

  // Default Home Spot Funabashi Daijingu ('funabashi') must exist
  assert.ok(ids.has('funabashi'), 'Default home spot funabashi (船橋大神宮) must exist in all.json');

  // Verify all course spot_ids exist in all.json
  const courses = JSON.parse(fs.readFileSync(path.resolve('public/data/courses.json'), 'utf-8'));
  for (const course of courses) {
    assert.ok(course.course_id, 'Course must have course_id');
    assert.ok(course.title, 'Course must have title');
    for (const sid of course.spot_ids) {
      assert.ok(ids.has(sid), `Course ${course.course_id} references unknown spot_id ${sid}`);
    }
  }
});

test('Story data, 17 zones, 17 bookmarks, 10-step Fuji animation, and stealth marketing rules are verified', () => {
  const storyDataPath = path.resolve('lib/story_data.ts');
  assert.ok(fs.existsSync(storyDataPath), 'lib/story_data.ts must exist');
  const storyContent = fs.readFileSync(storyDataPath, 'utf-8');

  // Default home spot is funabashi
  assert.ok(
    storyContent.includes("DEFAULT_HOME_SPOT_ID = 'funabashi'"),
    'Default home spot ID must be funabashi'
  );

  // 3 Story scenarios exist
  assert.ok(storyContent.includes("id: 'scenario_1'"), 'Scenario 1 must exist');
  assert.ok(storyContent.includes("id: 'scenario_2'"), 'Scenario 2 must exist');
  assert.ok(storyContent.includes("id: 'scenario_3'"), 'Scenario 3 must exist');

  // 17 Japan zones (ZONE-01 to ZONE-17)
  for (let i = 1; i <= 17; i++) {
    const zId = `ZONE-${String(i).padStart(2, '0')}`;
    assert.ok(storyContent.includes(zId), `Zone ${zId} must be defined`);
  }

  // 17 Sacred Bookmarks (BOOKMARK-01 to BOOKMARK-17)
  for (let i = 1; i <= 17; i++) {
    const bId = `BOOKMARK-${String(i).padStart(2, '0')}`;
    assert.ok(storyContent.includes(bId), `Bookmark ${bId} must be defined`);
  }

  // Required deity quote in 10-step animation
  assert.ok(
    storyContent.includes('神には神の法則（すじみち）があるように、人には人の法則（すじみち）があるようだな'),
    'Required deity sujimichi quote must be included in story_data.ts'
  );

  // Stealth marketing verification: UI strings (excluding developer comments) must not expose raw textbook/organization names
  const uiFiles = [
    'lib/story_data.ts',
    'components/HomeShrineView.tsx',
    'components/ZoneClearFujiModal.tsx',
    'components/DetailModal.tsx',
  ];
  for (const relPath of uiFiles) {
    const rawContent = fs.readFileSync(path.resolve(relPath), 'utf-8');
    const codeOnly = rawContent
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');
    assert.ok(!codeOnly.includes('万人幸福の栞'), `${relPath} UI strings must not explicitly expose 万人幸福の栞`);
    assert.ok(!codeOnly.includes('丸山敏雄'), `${relPath} UI strings must not explicitly expose 丸山敏雄`);
    assert.ok(!codeOnly.includes('倫理法人会'), `${relPath} UI strings must not explicitly expose 倫理法人会`);
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

  assert.equal(calculateDistance(35.6961, 139.9936, 35.6961, 139.9936), 0);

  const dClose = calculateDistance(35.6961, 139.9936, 35.6968, 139.9936);
  assert.ok(dClose > 50 && dClose < 150, `Expected ~78m, got ${dClose}`);
  assert.ok(dClose <= 500, 'Within 500m range for check-in');

  const dFar = calculateDistance(35.6895, 139.6917, 34.9858, 135.7588);
  assert.ok(dFar > 350000 && dFar < 400000, `Expected ~370km, got ${dFar}`);
  assert.ok(dFar > 500, 'Far point must exceed 500m check-in threshold');
});

test('Region key sanitization prevents path traversal', () => {
  function sanitizeRegion(raw) {
    return (raw || 'kanto').replace(/[^a-zA-Z0-9_-]/g, '');
  }

  assert.equal(sanitizeRegion('kanto'), 'kanto');
  assert.equal(sanitizeRegion('hokkaido_tohoku'), 'hokkaido_tohoku');
  assert.equal(sanitizeRegion('../../../etc/passwd'), 'etcpasswd');
  assert.equal(sanitizeRegion('kanto/..'), 'kanto');
});
