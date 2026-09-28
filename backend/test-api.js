// Comprehensive test script to verify all Orbit Notes API endpoints
import app from './src/app.js';

let server;
const PORT = 5099;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log('🚀 Starting Orbit Notes API Endpoint Verification Suite...');

  server = app.listen(PORT);
  let authToken = '';
  let createdEventId = '';
  let createdDiscoveryId = '';
  let createdReportId = '';

  const assert = (condition, msg) => {
    if (!condition) {
      console.error(`❌ FAIL: ${msg}`);
      throw new Error(`Test assertion failed: ${msg}`);
    }
    console.log(`✅ PASS: ${msg}`);
  };

  try {
    // 1. Health check
    console.log('\n--- 1. Testing GET /api/health ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'GET /api/health returns 200');
    assert(healthData.status === 'ok', 'Health status is ok');
    assert(healthData.rssScheduler.active === true, 'RSS scheduler metadata present');

    // 2. Auth Signup
    console.log('\n--- 2. Testing POST /api/auth/signup ---');
    const testEmail = `astronomer_${Date.now()}@observatory.org`;
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SuperSecretPassword123!',
        displayName: 'Sub-arcsecond Observer'
      })
    });
    const signupData = await signupRes.json();
    assert(signupRes.status === 201, 'Signup returns 201 Created');
    assert(signupData.token && signupData.token.length > 20, 'JWT token returned on signup');
    authToken = signupData.token;

    // 3. Auth Login
    console.log('\n--- 3. Testing POST /api/auth/login ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SuperSecretPassword123!'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Login returns 200 OK');
    assert(loginData.token, 'JWT token returned on login');

    // 4. Sky Events: GET & POST
    console.log('\n--- 4. Testing GET & POST /api/events ---');
    const listEventsRes = await fetch(`${BASE_URL}/events`);
    const listEventsData = await listEventsRes.json();
    assert(listEventsRes.status === 200, 'GET /api/events returns 200');
    assert(Array.isArray(listEventsData.events), 'Events list is array');

    const createEventRes = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Leonids Peak Radiant Test Observation',
        event_type: 'Meteor Shower',
        event_date: new Date().toISOString(),
        visibility_notes: 'Radiant in Leo constellation. Peak rate: 15-20/hr.',
        equipment: 'Binoculars (7x50+)',
        status: 'upcoming'
      })
    });
    const createEventData = await createEventRes.json();
    assert(createEventRes.status === 201, 'POST /api/events returns 201 Created');
    assert(createEventData.event.title.includes('Leonids'), 'Created event title verified');
    createdEventId = createEventData.event.id;

    // 5. Discoveries: GET, POST & Sync
    console.log('\n--- 5. Testing GET, POST & Sync /api/discoveries ---');
    const getDiscRes = await fetch(`${BASE_URL}/discoveries`);
    const getDiscData = await getDiscRes.json();
    assert(getDiscRes.status === 200, 'GET /api/discoveries returns 200');
    assert(getDiscData.discoveries.length > 0, 'Seed/initial discoveries exist');

    const createDiscRes = await fetch(`${BASE_URL}/discoveries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Spectroscopic Map of Proxima Centauri b Atmosphere',
        source_name: 'Nature Astronomy',
        source_url: 'https://nature.com/articles/astronomy-test-entry',
        category: 'Exoplanets',
        summary: 'Direct molecular detection in the habitable zone red dwarf planetary atmosphere.',
        tags: ['Exoplanet', 'Habitable', 'Test']
      })
    });
    const createDiscData = await createDiscRes.json();
    assert(createDiscRes.status === 201, 'POST /api/discoveries returns 201 Created');
    createdDiscoveryId = createDiscData.discovery.id;

    const syncRes = await fetch(`${BASE_URL}/discoveries/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const syncData = await syncRes.json();
    assert(syncRes.status === 200, 'POST /api/discoveries/sync returns 200 OK');
    assert(syncData.stats.success === true, 'RSS Sync reported success');

    // 5b. Social Channels & Feeds
    console.log('\n--- 5b. Testing GET & POST /api/social ---');
    const socialChanRes = await fetch(`${BASE_URL}/social/channels`);
    const socialChanData = await socialChanRes.json();
    assert(socialChanRes.status === 200, 'GET /api/social/channels returns 200');
    assert(socialChanData.channels.length >= 4, 'All 4 social media platforms listed');

    const socialSyncRes = await fetch(`${BASE_URL}/social/sync`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const socialSyncData = await socialSyncRes.json();
    assert(socialSyncRes.status === 200, 'POST /api/social/sync returns 200');
    assert(socialSyncData.stats.success === true, 'Social media sync reports success');

    // 6. Reports: GET, POST & generate-today
    console.log('\n--- 6. Testing GET, POST & generate-today /api/reports ---');
    const getReportsRes = await fetch(`${BASE_URL}/reports`);
    const getReportsData = await getReportsRes.json();
    assert(getReportsRes.status === 200, 'GET /api/reports returns 200');

    const createReportRes = await fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        title: 'Night Sky Dispatch — Atmospheric Inversion Test',
        summary: 'Excellent sub-arcsecond stability recorded under Bortle 3 skies.',
        highlights: ['Jupiter Galilean shadow transit logged', 'M42 Orion Nebula core resolved'],
        seeing_conditions: {
          bortleClass: 3,
          seeing: '0.9 arcsec',
          transparency: 'High',
          cloudCover: '0%'
        }
      })
    });
    const createReportData = await createReportRes.json();
    assert(createReportRes.status === 201, 'POST /api/reports returns 201 Created');
    createdReportId = createReportData.report.id;

    const genTodayRes = await fetch(`${BASE_URL}/reports/generate-today`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const genTodayData = await genTodayRes.json();
    assert(genTodayRes.status === 201, 'POST /api/reports/generate-today returns 201 Created');

    // 7. DELETE /api/:kind/:id
    console.log('\n--- 7. Testing DELETE /api/:kind/:id ownership check ---');
    const delEventRes = await fetch(`${BASE_URL}/events/${createdEventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert(delEventRes.status === 200, 'DELETE /api/events/:id succeeds for owner');

    const delDiscRes = await fetch(`${BASE_URL}/discoveries/${createdDiscoveryId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert(delDiscRes.status === 200, 'DELETE /api/discoveries/:id succeeds for owner');

    const delRepRes = await fetch(`${BASE_URL}/reports/${createdReportId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    assert(delRepRes.status === 200, 'DELETE /api/reports/:id succeeds for owner');

    console.log('\n🎉 ALL ORBIT NOTES API TESTS PASSED SUCCESSFULLY! 🚀');
  } catch (err) {
    console.error('\n❌ Test Suite encountered an error:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
