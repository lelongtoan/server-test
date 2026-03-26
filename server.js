const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());

const rooms = {};
let nextRoomId = 1;

function createInitialSnapshot() {
  return {
    tick: 0,
    gameDay: 1,
    gameHour: 12,
    players: [],
    enemies: [],
    worldItems: [],
    placedObjects: [],
    resources: [],
    brokenResourceIds: []
  };
}

app.get("/", (req, res) => {
  res.send("Server test is running");
});

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.post("/create-room", (req, res) => {
  const roomId = String(nextRoomId++);
  rooms[roomId] = {
    roomId,
    snapshot: createInitialSnapshot()
  };

  res.json({
    ok: true,
    roomId,
    snapshot: rooms[roomId].snapshot
  });
});

app.post("/join-player", (req, res) => {
  const { roomId, player } = req.body;
  const room = rooms[roomId];

  if (!room) {
    res.status(404).json({ ok: false, error: "room_not_found" });
    return;
  }

  if (!player || typeof player.playerId !== "number") {
    res.status(400).json({ ok: false, error: "invalid_player" });
    return;
  }

  const players = room.snapshot.players;
  const idx = players.findIndex(p => p.playerId === player.playerId);

  const playerState = {
    playerId: player.playerId,
    playerName: player.playerName || `Player ${player.playerId}`,
    hp: player.hp ?? 100,
    maxHp: player.maxHp ?? 100,
    position: player.position || { x: 0, y: 0 }
  };

  if (idx >= 0) players[idx] = playerState;
  else players.push(playerState);

  res.json({
    ok: true,
    roomId,
    player: playerState,
    playerCount: players.length
  });
});

app.get("/snapshot/:roomId", (req, res) => {
  const room = rooms[req.params.roomId];
  if (!room) {
    res.status(404).json({ ok: false, error: "room_not_found" });
    return;
  }

  res.json({
    ok: true,
    roomId: room.roomId,
    snapshot: room.snapshot
  });
});

app.post("/command", (req, res) => {
  const { roomId, command } = req.body;
  const room = rooms[roomId];

  if (!room) {
    res.status(404).json({ ok: false, error: "room_not_found" });
    return;
  }

  room.snapshot.tick += 1;

  res.json({
    ok: true,
    roomId,
    tick: room.snapshot.tick,
    received: command
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});