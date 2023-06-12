const Game = require('../../database/schemas/Game/Game');
const Player = require('../../database/schemas/Game/Player');
const Team = require('../../database/schemas/Game/Team');
const Marker = require('../../database/schemas/Game/Marker');
const ScavengerHunt = require('../../database/schemas/Teacher/ScavengerHunt');
const Question = require('../../database/schemas/Teacher/Question');

const AcceptedNames = require('../../utils/names');

const router = require('express').Router();
const LoggedIn = require('../../utils/middleware');

const { v4: uuidv4 } = require('uuid');
const generateCode = require('../../utils/CodeGen');
const shuffleArray = require('../../utils/shuffleArray');
const { createCanvas } = require('canvas');
const QRcode = require('qrcode');

router.get('/start/:huntID/:teamSize', LoggedIn, async (req, res) => {
    let code = generateCode();
    while (await Game.findOne({ code })) {
        code = generateCode();
    }

    let game = await Game.create({
        uuid: uuidv4(),
        code,
        teamSize: Number(req.params.teamSize),
        scavengerhunt: req.params.huntID,
        keepAlive: Date.now()
    });

    res.send({ uuid: game.uuid });
});

router.get('/update/:gameID/:teamSize', LoggedIn, async (req, res) => {
    let game = await Game.findOne({ uuid: req.params.gameID });
    if (!game)
        return res.status(404).send({ error: 'Game not found' });

    game = await Game.findOneAndUpdate({ uuid: req.params.gameID }, { teamSize: Number(req.params.teamSize), keepAlive: Date.now() }, { new: true });

    res.send({ game });
});

router.get('/cur/:gameID/:qr/:teams', LoggedIn, async (req, res) => {
    let game = await Game.findOne({ uuid: req.params.gameID });
    let canvas;
    if (!game)
        return res.status(404).send({ error: 'Game not found' });

    game = await Game.findOneAndUpdate({ uuid: req.params.gameID }, { keepAlive: Date.now() }, { new: true });

    if (req.params.qr === 'true') {
        canvas = createCanvas(200, 200)
        QRcode.toCanvas(canvas, game.code, function (err) {
            if (err)
                console.error(err)
        })
    }

    let players = []
    for (let i = 0; i < game.playerWaitingRoom.length; i++) {
        players.push(await Player.findOne({ uuid: game.playerWaitingRoom[i] }));
    }

    if (players.length === 0)
        players = null;

    if (req.params.teams === 'true') {
        let teams = [];
        for (let i = 0; i < game.teams.length; i++) {
            teams.push(await Team.findOne({ uuid: game.teams[i] }));
        }
        return res.send({ game, players, teams, qr: req.params.qr === 'true' ? canvas.toDataURL() : null });
    }
    res.send({ game, players, qr: req.params.qr === 'true' ? canvas.toDataURL() : null });
});

router.get("/play/:gameID/:teamsize", LoggedIn, async (req, res) => {
    let game = await Game.findOne({ uuid: req.params.gameID });
    if (!game)
        return res.status(404).send({ error: 'Game not found' });

    game = await Game.findOneAndUpdate({ uuid: req.params.gameID }, { started: true, teamSize: req.params.teamsize }, { new: true });

    if (game.playerWaitingRoom.length === 0)
        return res.status(404).send({ error: 'No players in game' });

    //divide players into teams
    let players = [];
    for (let i = 0; i < game.playerWaitingRoom.length; i++) {
        players.push(await Player.findOne({ uuid: game.playerWaitingRoom[i] }));
    }
    shuffleArray(players);

    let hunt = await ScavengerHunt.findOne({ uuid: game.scavengerhunt });
    let teams = [];
    let team = [];

    for (let i = 0; i < players.length; i++) {
        team.push(players[i].uuid);
        if (team.length === game.teamSize) {
            teams.push(team);
            team = [];
        }
    }
    if (team.length > 0)
        teams.push(team);

    //create teams
    let teamNames = [];
    for (let i = 0; i < teams.length; i++) {
        let markers = [];
        for (let i = 0; i < hunt.questionIDs.length; i++) {
            let question = await Question.findOne({ uuid: hunt.questionIDs[i] });
            let marker = await Marker.create({
                uuid: uuidv4(),
                questionID: question.uuid
            });
            markers.push(marker.uuid);
        }

        let name;
        do {
            name = AcceptedNames[Math.floor(Math.random() * AcceptedNames.length)];
        } while (teamNames.includes(name));
        teamNames.push(name);

        let team = await Team.create({
            uuid: uuidv4(),
            playerIds: teams[i],
            markers,
            keepAlive: Date.now(),
            totalQuestionCount: hunt.questionIDs.length,
            name
        });
        for (let j = 0; j < teams[i].length; j++) {
            await Player.findOneAndUpdate({ uuid: teams[i][j] }, { teamId: team.uuid, isInGame: true, keepAlive: Date.now() });
        }
        await Player.findOneAndUpdate({ uuid: team.playerIds[0] }, { isLeader: true })

        teams[i] = team.uuid;
    }

    game = await Game.findOneAndUpdate({ uuid: req.params.gameID }, { teams: teams, keepAlive: Date.now() }, { new: true });

    res.send({ game });
});

router.use('/player', require('./player'));

module.exports = router;