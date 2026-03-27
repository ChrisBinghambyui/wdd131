import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { promises as fs } from 'fs';
import XLSX from 'xlsx';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
// Serve the project files directly so the ngrok URL can host the game page end-to-end.
app.use(express.static('.'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.sendFile('loaded_bones.html', { root: process.cwd() });
});

const CHARACTER_CODE_REGEX = /^\d{6}$/;
const SAVE_SYNC_DIR = path.join(process.cwd(), 'cloud-saves');
const ANALYTICS_DIR = path.join(process.cwd(), 'analytics');
const ANALYTICS_AGGREGATE_PATH = path.join(ANALYTICS_DIR, 'aggregate.json');
const ANALYTICS_EVENTS_CSV_PATH = path.join(ANALYTICS_DIR, 'analytics_events.csv');
const ANALYTICS_EXCEL_CSV_PATH = path.join(ANALYTICS_DIR, 'excel_metrics.csv');
const ANALYTICS_XLSX_PATH = path.join(ANALYTICS_DIR, 'excel_metrics.xlsx');

function normalizeCharacterCode(value) {
  const code = String(value || '').trim();
  return CHARACTER_CODE_REGEX.test(code) ? code : '';
}

async function ensureSaveSyncDirectory() {
  await fs.mkdir(SAVE_SYNC_DIR, { recursive: true });
}

function getSaveSyncFilePath(characterCode) {
  return path.join(SAVE_SYNC_DIR, `${characterCode}.json`);
}

function createEmptyAnalyticsAggregate() {
  return {
    schemaVersion: 1,
    lastUpdatedAt: 0,
    eventsProcessed: 0,
    processedEventIds: {},
    classPicked: {},
    trainingPurchases: {},
    cardAddedToDeck: {},
    cardUsed: {},
    enemyDefeatedPlayer: {},
    runResults: {},
    trackingStarts: {
      newCharacter: 0,
      legacyMigration: 0,
      legacyCarryOver: 0,
      runStartedBeforeTracking: 0,
    }
  };
}

async function ensureAnalyticsDirectory() {
  await fs.mkdir(ANALYTICS_DIR, { recursive: true });
}

async function loadAnalyticsAggregate() {
  try {
    const raw = await fs.readFile(ANALYTICS_AGGREGATE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...createEmptyAnalyticsAggregate(),
      ...parsed,
      processedEventIds: parsed?.processedEventIds && typeof parsed.processedEventIds === 'object'
        ? parsed.processedEventIds
        : {},
    };
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      console.warn('Failed to read analytics aggregate, recreating:', err);
    }
    return createEmptyAnalyticsAggregate();
  }
}

async function saveAnalyticsAggregate(aggregate) {
  await fs.writeFile(ANALYTICS_AGGREGATE_PATH, JSON.stringify(aggregate, null, 2), 'utf8');
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

async function appendCsvRow(filePath, headers, values) {
  let exists = true;
  try {
    await fs.access(filePath);
  } catch {
    exists = false;
  }

  if (!exists) {
    await fs.writeFile(filePath, `${headers.map(csvEscape).join(',')}\n`, 'utf8');
  }

  await fs.appendFile(filePath, `${values.map(csvEscape).join(',')}\n`, 'utf8');
}

function incrementCounter(mapObj, key, amount = 1) {
  const safeKey = String(key || 'unknown').trim() || 'unknown';
  mapObj[safeKey] = (Number(mapObj[safeKey]) || 0) + amount;
}

function sortedEntriesByCount(obj) {
  return Object.entries(obj || {}).sort((a, b) => (Number(b[1]) || 0) - (Number(a[1]) || 0));
}

function buildAggregateMetricRows(aggregate) {
  const rows = [];

  for (const [item, count] of sortedEntriesByCount(aggregate.classPicked)) {
    rows.push({ category: 'class_picked', item, count });
  }
  for (const [item, count] of sortedEntriesByCount(aggregate.trainingPurchases)) {
    rows.push({ category: 'training_purchase', item, count });
  }
  for (const [item, count] of sortedEntriesByCount(aggregate.cardAddedToDeck)) {
    rows.push({ category: 'card_added_to_deck', item, count });
  }
  for (const [item, count] of sortedEntriesByCount(aggregate.cardUsed)) {
    rows.push({ category: 'card_used', item, count });
  }
  for (const [item, count] of sortedEntriesByCount(aggregate.enemyDefeatedPlayer)) {
    rows.push({ category: 'enemy_defeated_player', item, count });
  }
  for (const [item, count] of sortedEntriesByCount(aggregate.runResults)) {
    rows.push({ category: 'run_result', item, count });
  }

  return rows;
}

function buildAnalyticsSummary(aggregate) {
  const top = (obj, limit = 20) => sortedEntriesByCount(obj)
    .slice(0, limit)
    .map(([name, count]) => ({ name, count: Number(count) || 0 }));

  return {
    generatedAt: Date.now(),
    eventsProcessed: Number(aggregate?.eventsProcessed) || 0,
    lastUpdatedAt: Number(aggregate?.lastUpdatedAt) || 0,
    trackingStarts: {
      ...(aggregate?.trackingStarts || {}),
    },
    topClasses: top(aggregate?.classPicked),
    topTrainingUpgrades: top(aggregate?.trainingPurchases),
    topCardsAddedToDeck: top(aggregate?.cardAddedToDeck),
    topCardsUsed: top(aggregate?.cardUsed),
    enemyKillLeaders: top(aggregate?.enemyDefeatedPlayer),
    runResults: top(aggregate?.runResults, 10),
  };
}

async function writeExcelMetricsCsv(aggregate) {
  const headers = ['category', 'item', 'count'];
  const rows = buildAggregateMetricRows(aggregate).map((row) => [row.category, row.item, row.count]);

  const content = [headers, ...rows]
    .map((line) => line.map(csvEscape).join(','))
    .join('\n');
  await fs.writeFile(ANALYTICS_EXCEL_CSV_PATH, `${content}\n`, 'utf8');
}

async function writeExcelWorkbook(aggregate) {
  const metricsRows = buildAggregateMetricRows(aggregate);
  const summaryRows = [
    { metric: 'eventsProcessed', value: Number(aggregate?.eventsProcessed) || 0 },
    { metric: 'lastUpdatedAt', value: Number(aggregate?.lastUpdatedAt) || 0 },
    { metric: 'trackingStarts.newCharacter', value: Number(aggregate?.trackingStarts?.newCharacter) || 0 },
    { metric: 'trackingStarts.legacyMigration', value: Number(aggregate?.trackingStarts?.legacyMigration) || 0 },
    { metric: 'trackingStarts.legacyCarryOver', value: Number(aggregate?.trackingStarts?.legacyCarryOver) || 0 },
    { metric: 'trackingStarts.runStartedBeforeTracking', value: Number(aggregate?.trackingStarts?.runStartedBeforeTracking) || 0 },
  ];

  const workbook = XLSX.utils.book_new();
  const metricsSheet = XLSX.utils.json_to_sheet(metricsRows.length ? metricsRows : [{ category: '', item: '', count: 0 }]);
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);

  XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Metrics');
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  XLSX.writeFile(workbook, ANALYTICS_XLSX_PATH);
}

async function processAnalyticsEvents(characterCode, trigger, saveData) {
  const analytics = saveData?.G?.analytics;
  const events = Array.isArray(analytics?.eventsPending) ? analytics.eventsPending : [];
  if (!events.length) {
    return { processedEventIds: [], processedCount: 0 };
  }

  await ensureAnalyticsDirectory();
  const aggregate = await loadAnalyticsAggregate();
  const processedEventIds = [];

  for (const event of events) {
    const eventId = typeof event?.eventId === 'string' ? event.eventId.trim() : '';
    const eventType = typeof event?.type === 'string' ? event.type.trim() : '';
    if (!eventId || !eventType) continue;
    if (aggregate.processedEventIds[eventId]) continue;

    const payload = event?.payload && typeof event.payload === 'object' ? event.payload : {};
    const timestamp = Number(event?.ts) || Date.now();

    if (eventType === 'class_picked') {
      incrementCounter(aggregate.classPicked, payload.className || payload.classId || 'unknown');
    } else if (eventType === 'training_purchase') {
      incrementCounter(aggregate.trainingPurchases, payload.upgradeType || 'unknown');
    } else if (eventType === 'card_added_to_deck') {
      incrementCounter(aggregate.cardAddedToDeck, payload.cardName || 'unknown');
    } else if (eventType === 'card_used') {
      incrementCounter(aggregate.cardUsed, payload.cardName || 'unknown');
    } else if (eventType === 'player_defeated_by_enemy') {
      incrementCounter(aggregate.enemyDefeatedPlayer, payload.enemyName || 'Unknown Enemy');
    } else if (eventType === 'run_ended') {
      incrementCounter(aggregate.runResults, payload.result || 'unknown');
    } else if (eventType === 'tracking_started') {
      if (saveData?.G?.analytics?.trackingSource === 'new_character') {
        aggregate.trackingStarts.newCharacter += 1;
      } else {
        aggregate.trackingStarts.legacyMigration += 1;
      }
      if (payload.legacyCarryOver) aggregate.trackingStarts.legacyCarryOver += 1;
      if (payload.runStartedBeforeTracking) aggregate.trackingStarts.runStartedBeforeTracking += 1;
    }

    await appendCsvRow(
      ANALYTICS_EVENTS_CSV_PATH,
      [
        'eventId', 'timestamp', 'characterCode', 'trigger', 'eventType',
        'runId', 'className', 'upgradeType', 'cardName', 'enemyName',
        'result', 'biome', 'tier', 'xpEarned', 'goldEarned', 'startedBeforeTracking'
      ],
      [
        eventId,
        timestamp,
        characterCode,
        trigger,
        eventType,
        payload.runId || '',
        payload.className || payload.classId || '',
        payload.upgradeType || '',
        payload.cardName || '',
        payload.enemyName || '',
        payload.result || '',
        payload.biome || '',
        payload.tier || '',
        payload.xpEarned || '',
        payload.goldEarned || '',
        payload.startedBeforeTracking ? '1' : '0',
      ]
    );

    aggregate.processedEventIds[eventId] = true;
    aggregate.eventsProcessed += 1;
    processedEventIds.push(eventId);
  }

  aggregate.lastUpdatedAt = Date.now();
  await saveAnalyticsAggregate(aggregate);
  await writeExcelMetricsCsv(aggregate);
  await writeExcelWorkbook(aggregate);

  return { processedEventIds, processedCount: processedEventIds.length };
}

app.get('/admin', (_req, res) => {
  res.sendFile('admin.html', { root: process.cwd() });
});

app.get('/api/analytics/summary', async (_req, res) => {
  try {
    await ensureAnalyticsDirectory();
    const aggregate = await loadAnalyticsAggregate();
    res.json({ success: true, summary: buildAnalyticsSummary(aggregate) });
  } catch (err) {
    console.error('Failed to build analytics summary:', err);
    res.status(500).json({ success: false, error: 'Failed to build analytics summary.' });
  }
});

app.get('/api/analytics/excel.csv', async (_req, res) => {
  try {
    await ensureAnalyticsDirectory();
    try {
      await fs.access(ANALYTICS_EXCEL_CSV_PATH);
    } catch {
      await writeExcelMetricsCsv(await loadAnalyticsAggregate());
    }
    res.sendFile(ANALYTICS_EXCEL_CSV_PATH);
  } catch (err) {
    console.error('Failed to serve analytics CSV:', err);
    res.status(500).json({ success: false, error: 'Failed to build analytics CSV.' });
  }
});

app.get('/api/analytics/excel.xlsx', async (_req, res) => {
  try {
    await ensureAnalyticsDirectory();
    try {
      await fs.access(ANALYTICS_XLSX_PATH);
    } catch {
      const aggregate = await loadAnalyticsAggregate();
      await writeExcelWorkbook(aggregate);
    }
    res.download(ANALYTICS_XLSX_PATH, 'excel_metrics.xlsx');
  } catch (err) {
    console.error('Failed to serve analytics XLSX:', err);
    res.status(500).json({ success: false, error: 'Failed to build analytics XLSX.' });
  }
});

app.post('/api/save-sync', async (req, res) => {
  const requestedCode = normalizeCharacterCode(req.body?.characterCode);
  const saveDataCode = normalizeCharacterCode(req.body?.saveData?.G?.characterCode);
  const characterCode = requestedCode || saveDataCode;
  const saveData = req.body?.saveData;

  if (!characterCode) {
    return res.status(400).json({ success: false, error: 'A valid six-digit characterCode is required.' });
  }

  if (!saveData || typeof saveData !== 'object') {
    return res.status(400).json({ success: false, error: 'saveData payload is required.' });
  }

  try {
    await ensureSaveSyncDirectory();
    const trigger = typeof req.body?.trigger === 'string' ? req.body.trigger : 'unknown';
    const stampedSaveData = {
      ...saveData,
      G: {
        ...(saveData.G || {}),
        characterCode,
      },
      cloud: {
        trigger,
        updatedAt: Date.now(),
      }
    };

    const analyticsResult = await processAnalyticsEvents(characterCode, trigger, stampedSaveData);

    await fs.writeFile(
      getSaveSyncFilePath(characterCode),
      JSON.stringify(stampedSaveData, null, 2),
      'utf8'
    );

    return res.json({
      success: true,
      characterCode,
      analytics: analyticsResult,
    });
  } catch (err) {
    console.error('Failed to write save sync file:', err);
    return res.status(500).json({ success: false, error: 'Failed to store cloud save.' });
  }
});

app.get('/api/save-sync/:characterCode', async (req, res) => {
  const characterCode = normalizeCharacterCode(req.params?.characterCode);
  if (!characterCode) {
    return res.status(400).json({ success: false, error: 'Invalid character code.' });
  }

  try {
    const saveDataRaw = await fs.readFile(getSaveSyncFilePath(characterCode), 'utf8');
    const saveData = JSON.parse(saveDataRaw);
    return res.json({ success: true, characterCode, saveData });
  } catch (err) {
    if (err?.code === 'ENOENT') {
      return res.status(404).json({ success: false, error: 'No save found for that code.' });
    }
    console.error('Failed to read save sync file:', err);
    return res.status(500).json({ success: false, error: 'Failed to load cloud save.' });
  }
});

// ==================== GAME STATE ====================
const rooms = new Map(); // roomCode -> { players, gameState, turn }
const players = new Map(); // socketId -> { name, roomCode, character }
const quickMatchQueue = new Map(); // socketId -> { socketId, name, class, level, joinedAt }

function getQuickMatchQueueList() {
  return Array.from(quickMatchQueue.values())
    .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0))
    .map((p) => ({
      socketId: p.socketId,
      name: p.name,
      class: p.class,
      level: p.level
    }));
}

function broadcastQuickMatchQueue() {
  io.emit('quickMatchQueueUpdated', {
    players: getQuickMatchQueueList()
  });
}

function normalizePlayerPayload(input) {
  if (typeof input === 'string') {
    const safe = input.trim();
    return { name: safe && safe !== '[object Object]' ? safe : '', profile: null };
  }

  const name = typeof input?.name === 'string'
    ? input.name.trim()
    : '';
  const rawProfile = input?.profile && typeof input.profile === 'object' ? input.profile : null;

  if (!rawProfile) {
    return { name: name !== '[object Object]' ? name : '', profile: null };
  }

  const profile = {
    level: Math.max(1, Number(rawProfile.level) || 1),
    maxHp: Math.max(1, Number(rawProfile.maxHp) || 1),
    hp: Math.max(1, Number(rawProfile.hp) || 1),
    classId: typeof rawProfile.classId === 'string' ? rawProfile.classId : null,
    className: typeof rawProfile.className === 'string' ? rawProfile.className : null,
    handLimit: Number(rawProfile.handLimit) || null,
    diceLimit: Number(rawProfile.diceLimit) || null,
    deck: Array.isArray(rawProfile.deck) ? rawProfile.deck : []
  };

  profile.hp = Math.min(profile.hp, profile.maxHp);
  return { name: name !== '[object Object]' ? name : '', profile };
}

function generateRoomCode() {
  const alphabet = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * alphabet.length);
    code += alphabet[idx];
  }
  return code;
}

function createRoom() {
  let code = generateRoomCode();
  while (rooms.has(code)) {
    code = generateRoomCode();
  }
  rooms.set(code, {
    players: [],
    gameState: null,
    turn: 0,
    status: 'waiting' // waiting, ready, inProgress, finished
  });
  return code;
}

function getRoom(roomCode) {
  return rooms.get(roomCode);
}

function deleteRoom(roomCode) {
  rooms.delete(roomCode);
}

// ==================== SOCKET EVENTS ====================

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create a new game room
  socket.on('createRoom', (playerPayload, callback) => {
    const { name: parsedName, profile } = normalizePlayerPayload(playerPayload);
    const playerName = parsedName || 'Host';
    const roomCode = createRoom();
    const room = getRoom(roomCode);
    
    socket.join(roomCode);
    players.set(socket.id, {
      name: playerName,
      roomCode: roomCode,
      character: null,
      isHost: true,
      profile
    });
    room.players.push({ socketId: socket.id, name: playerName, isHost: true, profile });

    if (quickMatchQueue.delete(socket.id)) {
      broadcastQuickMatchQueue();
    }
    
    console.log(`Room created: ${roomCode} by ${playerName}`);
    callback({ success: true, roomCode, players: room.players });
  });

  // Join an existing game room
  socket.on('joinRoom', (roomCode, playerPayload, callback) => {
    const { name: parsedName, profile } = normalizePlayerPayload(playerPayload);
    const playerName = parsedName || 'Guest';
    const room = getRoom(roomCode);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    
    if (room.players.length >= 2) {
      callback({ success: false, error: 'Room is full' });
      return;
    }
    
    if (room.status !== 'waiting') {
      callback({ success: false, error: 'Game already in progress' });
      return;
    }
    
    socket.join(roomCode);
    players.set(socket.id, {
      name: playerName,
      roomCode: roomCode,
      character: null,
      isHost: false,
      profile
    });
    room.players.push({ socketId: socket.id, name: playerName, isHost: false, profile });

    if (quickMatchQueue.delete(socket.id)) {
      broadcastQuickMatchQueue();
    }
    
    console.log(`${playerName} joined room: ${roomCode}`);
    
    // Notify both players
    io.to(roomCode).emit('playerJoined', {
      players: room.players,
      status: room.status
    });
    
    callback({ success: true, roomCode, players: room.players });
  });

  socket.on('joinQuickMatchQueue', (payload, callback) => {
    const safeName = typeof payload?.name === 'string' && payload.name.trim()
      ? payload.name.trim()
      : 'Adventurer';
    const safeClass = typeof payload?.class === 'string' && payload.class.trim()
      ? payload.class.trim()
      : 'Adventurer';
    const safeLevel = Math.max(1, Number(payload?.level) || 1);

    quickMatchQueue.set(socket.id, {
      socketId: socket.id,
      name: safeName,
      class: safeClass,
      level: safeLevel,
      joinedAt: Date.now()
    });

    const playersInQueue = getQuickMatchQueueList();
    broadcastQuickMatchQueue();
    if (callback) callback({ success: true, players: playersInQueue });
  });

  socket.on('leaveQuickMatchQueue', (callback) => {
    quickMatchQueue.delete(socket.id);
    const playersInQueue = getQuickMatchQueueList();
    broadcastQuickMatchQueue();
    if (callback) callback({ success: true, players: playersInQueue });
  });

  socket.on('quickMatchChallenge', (payload, callback) => {
    const challengerQueued = quickMatchQueue.get(socket.id);
    const targetSocketId = typeof payload?.targetSocketId === 'string' ? payload.targetSocketId : '';
    const targetQueued = targetSocketId ? quickMatchQueue.get(targetSocketId) : null;

    if (!challengerQueued) {
      if (callback) callback({ success: false, error: 'You are not in quick match queue.' });
      return;
    }

    if (!targetQueued) {
      if (callback) callback({ success: false, error: 'Selected opponent is no longer in queue.' });
      return;
    }

    if (targetSocketId === socket.id) {
      if (callback) callback({ success: false, error: 'Cannot challenge yourself.' });
      return;
    }

    const challengerPayload = normalizePlayerPayload(payload?.challenger || payload?.player || challengerQueued.name);
    const challengerName = challengerPayload.name || challengerQueued.name || 'Challenger';
    const roomCode = createRoom();
    const room = getRoom(roomCode);

    socket.join(roomCode);
    players.set(socket.id, {
      name: challengerName,
      roomCode,
      character: challengerQueued.class || null,
      isHost: true,
      profile: challengerPayload.profile
    });
    room.players.push({
      socketId: socket.id,
      name: challengerName,
      isHost: true,
      character: challengerQueued.class || null,
      profile: challengerPayload.profile
    });

    quickMatchQueue.delete(socket.id);
    quickMatchQueue.delete(targetSocketId);
    broadcastQuickMatchQueue();

    io.to(targetSocketId).emit('quickMatchChallenged', {
      roomCode,
      challenger: {
        socketId: socket.id,
        name: challengerName,
        class: challengerQueued.class,
        level: challengerQueued.level
      }
    });

    if (callback) {
      callback({
        success: true,
        roomCode,
        players: room.players
      });
    }
  });

  socket.on('updateProfile', (profilePayload, callback) => {
    const player = players.get(socket.id);
    if (!player) {
      if (callback) callback({ success: false, error: 'Player not found' });
      return;
    }

    const room = getRoom(player.roomCode);
    if (!room) {
      if (callback) callback({ success: false, error: 'Room not found' });
      return;
    }

    const normalized = normalizePlayerPayload({
      name: player.name,
      profile: profilePayload
    }).profile;

    player.profile = normalized;

    const roomPlayer = room.players.find(p => p.socketId === socket.id);
    if (roomPlayer) {
      roomPlayer.profile = normalized;
    }

    if (callback) callback({ success: true });
  });

  // Select character and start game
  socket.on('selectCharacter', (character, callback) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (!room) return;
    
    player.character = character;
    
    // Update player in room
    const roomPlayer = room.players.find(p => p.socketId === socket.id);
    if (roomPlayer) {
      roomPlayer.character = character;
    }
    
    // Check if both players have selected characters
    if (room.players.length === 2 && room.players.every(p => p.character)) {
      room.status = 'ready';
      io.to(player.roomCode).emit('bothPlayersReady', {
        players: room.players
      });
    }
    
    callback({ success: true });
  });

  // Enter deck building phase
  socket.on('enterDeckBuilder', (callback) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (!room) return;
    
    if (!room.deckSubmissions) {
      room.deckSubmissions = {};
    }
    
    room.status = 'deckBuilding';
    
    io.to(player.roomCode).emit('deckBuilderStarted', {
      status: 'deckBuilding'
    });
    
    callback({ success: true });
  });

  // Submit deck for the match
  socket.on('submitDeck', (deckCards, callback) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (!room) return;
    
    if (!room.deckSubmissions) {
      room.deckSubmissions = {};
    }
    
    // Store the deck for this player
    room.deckSubmissions[socket.id] = {
      deck: Array.isArray(deckCards) ? deckCards : [],
      ready: true
    };
    
    // Notify opponent that this player is ready
    io.to(player.roomCode).emit('opponentDeckReady', {
      playerName: player.name
    });
    
    // Check if both players have submitted decks
    const submittedCount = Object.keys(room.deckSubmissions).filter(id => room.deckSubmissions[id]?.ready).length;
    
    if (submittedCount === 2 && room.players.length === 2) {
      // Both players are ready to start the game
      const response = {
        success: true,
        bothReady: true,
        gameState: {
          players: room.players,
          decks: room.deckSubmissions,
          status: 'ready_to_start'
        }
      };
      
      io.to(player.roomCode).emit('bothPlayersDecksReady', response);
      callback(response);
    } else {
      callback({
        success: true,
        bothReady: false,
        message: 'Deck submitted. Waiting for opponent.'
      });
    }
  });

  // Start the game
  socket.on('startGame', (gameData, callback) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (!room) return;

    // Idempotent start: if already running, send current state so late callers can recover.
    if (room.status === 'inProgress' && room.gameState) {
      if (callback) callback({ success: true, alreadyStarted: true, gameState: room.gameState });
      return;
    }

    const readyDeckCount = Object.keys(room.deckSubmissions || {}).filter(id => room.deckSubmissions[id]?.ready).length;
    const playersHaveProfileDecks = room.players.length === 2
      && room.players.every((p) => Array.isArray(p?.profile?.deck) && p.profile.deck.length > 0);
    if (room.players.length !== 2 || (readyDeckCount !== 2 && !playersHaveProfileDecks)) {
      if (callback) callback({ success: false, error: 'Both players must submit decks before starting.' });
      return;
    }
    
    room.status = 'inProgress';
    room.gameState = {
      players: room.players.map(p => {
        // Get the submitted deck for this player, or use empty array as fallback
        const submittedDeck = room.deckSubmissions?.[p.socketId]?.deck || [];
        const profile = p.profile || {};
        const profileDeck = Array.isArray(profile.deck) ? profile.deck : [];
        const deck = submittedDeck.length > 0 ? submittedDeck : profileDeck;
        const classKey = p.character || profile.className || profile.classId;
        const fallbackClassHp = gameData.hpByClass[classKey] || 20;
        const maxHp = Math.max(1, Number(profile.maxHp) || fallbackClassHp);
        const hp = Math.max(1, Math.min(maxHp, Number(profile.hp) || maxHp));
        
        const safeName = typeof p.name === 'string'
          ? (p.name.trim() && p.name.trim() !== '[object Object]' ? p.name.trim() : 'Player')
          : String(p?.name?.name || p.name || '').trim() || 'Player';

        return {
          socketId: p.socketId,
          name: safeName,
          character: p.character || profile.className || profile.classId || null,
          classId: profile.classId || null,
          className: profile.className || null,
          level: Math.max(1, Number(profile.level) || 1),
          handLimit: Number(profile.handLimit) || null,
          diceLimit: Number(profile.diceLimit) || null,
          hp,
          maxHp,
          deck,
          dicePool: [],
          hand: [],
          shield: 0,
          statuses: []
        };
      }),
      turn: 0,
      round: 1,
      activePlayerIndex: 0
    };
    
    io.to(player.roomCode).emit('gameStarted', room.gameState);
    callback({ success: true, gameState: room.gameState });
  });

  // Player rolls dice
  socket.on('rollDice', (diceCount, callback) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (!room) return;
    
    const gameState = room.gameState;
    const currentPlayer = gameState.players.find(p => p.socketId === socket.id);
    
    if (!currentPlayer) return;
    
    // Generate random dice values
    const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
    currentPlayer.dicePool = rolls;
    
    io.to(player.roomCode).emit('diceRolled', {
      playerName: currentPlayer.name,
      rolls: rolls
    });
    
    callback({ success: true, rolls });
  });

  // Player plays card
  socket.on('playCard', (cardIndex, targetPlayerId, callback) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (!room) return;
    
    const gameState = room.gameState;
    const currentPlayer = gameState.players.find(p => p.socketId === socket.id);
    const targetPlayer = gameState.players.find(p => p.socketId === targetPlayerId);
    
    if (!currentPlayer || !targetPlayer) return;
    
    // Card is played - you'd validate this based on your game rules
    io.to(player.roomCode).emit('cardPlayed', {
      playerName: currentPlayer.name,
      cardIndex: cardIndex,
      targetPlayer: targetPlayer.name,
      gameState: gameState
    });
    
    callback({ success: true });
  });

  // End turn
  socket.on('endTurn', (callback) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (!room) return;
    
    const gameState = room.gameState;
    
    // Switch to next player
    gameState.activePlayerIndex = gameState.activePlayerIndex === 0 ? 1 : 0;
    gameState.turn++;
    
    if (gameState.activePlayerIndex === 0) {
      gameState.round++;
    }
    
    io.to(player.roomCode).emit('turnEnded', {
      gameState: gameState
    });
    
    callback({ success: true });
  });

  // Generic real-time combat relay for client-authoritative PvP visuals/state
  socket.on('combatAction', (payload, callback) => {
    const player = players.get(socket.id);
    if (!player) {
      if (callback) callback({ success: false, error: 'Player not found' });
      return;
    }

    const room = getRoom(player.roomCode);
    if (!room) {
      if (callback) callback({ success: false, error: 'Room not found' });
      return;
    }

    io.to(player.roomCode).emit('combatAction', {
      ...payload,
      actorId: socket.id,
      actorName: player.name,
      roomCode: player.roomCode,
      ts: Date.now()
    });

    if (callback) callback({ success: true });
  });

  // Player takes damage
  socket.on('takeDamage', (damage, targetSocketId, callback) => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (!room) return;
    
    const targetPlayer = room.gameState.players.find(p => p.socketId === targetSocketId);
    if (!targetPlayer) return;
    
    // Apply shield first
    const shieldDamage = Math.min(damage, targetPlayer.shield);
    targetPlayer.shield -= shieldDamage;
    const remainingDamage = damage - shieldDamage;
    
    targetPlayer.hp -= remainingDamage;
    targetPlayer.hp = Math.max(0, targetPlayer.hp);
    
    io.to(player.roomCode).emit('damageApplied', {
      targetPlayer: targetPlayer.name,
      damage: damage,
      shieldDamage: shieldDamage,
      hpRemaining: targetPlayer.hp,
      gameState: room.gameState
    });
    
    // Check for game over
    if (targetPlayer.hp <= 0) {
      const winner = room.gameState.players.find(p => p.socketId !== targetSocketId);
      io.to(player.roomCode).emit('gameOver', {
        winner: winner.name,
        loser: targetPlayer.name
      });
      room.status = 'finished';
    }
    
    callback({ success: true });
  });

  // Leave room
  socket.on('leaveRoom', () => {
    const player = players.get(socket.id);
    if (!player) return;
    
    const room = getRoom(player.roomCode);
    if (room) {
      room.players = room.players.filter(p => p.socketId !== socket.id);
      
      if (room.players.length === 0) {
        deleteRoom(player.roomCode);
      } else {
        io.to(player.roomCode).emit('playerLeft', {
          players: room.players
        });
      }
    }
    
    players.delete(socket.id);
    socket.leave(player.roomCode);

    if (quickMatchQueue.delete(socket.id)) {
      broadcastQuickMatchQueue();
    }
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    const player = players.get(socket.id);
    if (player) {
      const room = getRoom(player.roomCode);
      if (room) {
        room.players = room.players.filter(p => p.socketId !== socket.id);
        
        if (room.players.length === 0) {
          deleteRoom(player.roomCode);
        } else {
          io.to(player.roomCode).emit('playerDisconnected', {
            players: room.players
          });
        }
      }
      players.delete(socket.id);
    }

    if (quickMatchQueue.delete(socket.id)) {
      broadcastQuickMatchQueue();
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🎲 LOADED BONES multiplayer server running on port ${PORT}`);
});
