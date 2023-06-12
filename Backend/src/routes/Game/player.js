const Game = require('../../database/schemas/Game/Game');
const Player = require('../../database/schemas/Game/Player');
const { v4: uuidv4 } = require('uuid');
const Team = require('../../database/schemas/Game/Team');
const Marker = require('../../database/schemas/Game/Marker');

const router = require('express').Router();

router.get('/delete/:gameId/:playerId', async (req, res) => {
    let game = await Game.findOne({ uuid: req.params.gameId });
    if (!game)
        return res.status(404).send({ error: 'Game not found' });

    let player = await Player.findOne({ uuid: req.params.playerId });
    if (!player)
        return res.status(404).send({ error: 'Player not found' });

    if (game.playerWaitingRoom.includes(player.uuid)) {
        game = await Game.findOneAndUpdate({ uuid: req.params.gameId }, { $pull: { playerWaitingRoom: player.uuid } });
    }
    else {
        return res.status(404).send({ error: 'Player not found in game' });
    }

    await Player.findOneAndDelete({ uuid: req.params.playerId });

    res.send({ success: true, game });
});

router.get('/checkjoin/:code', async (req, res) => {
    let game = await Game.findOne({ code: req.params.code });
    let joinable = true;
    if (!game) {
        return res.status(404).send({ error: 'Game not found' });
    }

    if (game.started)
        joinable = false;

    res.send({ joinable });
});

router.get('/join/:code/:name', async (req, res) => {
    let game = await Game.findOne({ code: req.params.code });
    if (!game)
        return res.status(404).send({ error: 'Game not found' });

    if (game.started)
        return res.send({ joined: false });

    let player = await Player.create({
        uuid: uuidv4(),
        name: req.params.name,
    });

    game = await Game.findOneAndUpdate({ code: req.params.code }, { $push: { playerWaitingRoom: player.uuid } }, { new: true });

    res.send({ joined: true, player });
});

router.get('/status/:gameCode/:playerId', async (req, res) => {
    let game = await Game.findOne({ code: req.params.gameCode });
    if (!game)
        return res.send({ success: false, reason: 'Game not found' });

    let player = await Player.findOne({ uuid: req.params.playerId });
    if (!player)
        return res.send({ success: false, reason: 'Player Kicked' });

    await Player.findOneAndUpdate({ uuid: req.params.playerId }, { keepAlive: Date.now() });

    res.send({ success: true, inGame: game.started });
});

router.get('/data/:gameCode/:playerId', async (req, res) => {
    let game = await Game.findOne({ code: req.params.gameCode });
    if (!game)
        return res.status(404).send({ error: 'Game not found' });

    if (!game.started)
        return res.status(404).send({ error: 'Game not started' });

    let player = await Player.findOne({ uuid: req.params.playerId });
    if (!player)
        return res.status(404).send({ error: 'Player not found' });

    let team = await Team.findOne({ uuid: player.teamId });
    if (!team)
        return res.status(404).send({ error: 'Team not found' });

    if (!game.teams.includes(team.uuid))
        return res.status(404).send({ error: 'Team not found in game' });

    let markers = [];
    for (let i = 0; i < team.markers.length; i++) {
        let marker = await Marker.findOne({ uuid: team.markers[i] });
        if (!marker)
            return res.status(404).send({ error: 'Marker not found' });
        markers.push(marker);
    }

    await Player.findOneAndUpdate({ uuid: req.params.playerId }, { keepAlive: Date.now() });

    res.send({ player, points: team.points, markers });
});
router.post('/data/:gameCode/:playerId', async (req, res) => {
    let game = await Game.findOne({ code: req.params.gameCode });
    if (!game)
        return res.status(404).send({ error: 'Game not found' });

    if (!game.started)
        return res.status(404).send({ error: 'Game not started' });

    let player = await Player.findOne({ uuid: req.params.playerId });
    if (!player)
        return res.status(404).send({ error: 'Player not found' });
    
    for(let i = 0; i < req.body.markers.length; i++) {
        await Marker.findOneAndUpdate({ uuid: req.body.markers[i].uuid }, { longitude: req.body.markers[i].longitude, latitude: req.body.markers[i].latitude });
    }
    res.send({ success: true });
})

module.exports = router;