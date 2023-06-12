const Question = require('../../database/schemas/Teacher/Question');
const ScavengerHunt = require('../../database/schemas/Teacher/ScavengerHunt');
const User = require('../../database/schemas/Teacher/User');
const { v4: uuidv4 } = require('uuid');

const router = require('express').Router();

router.get('/all', async (req, res) => {
    const user = await User.findOne({ uuid: req.user.uuid })
    let hunts = [];
    for (let i = 0; i < user.scavengerHuntIds.length; i++) {
        hunts.push(await ScavengerHunt.findOne({ uuid: user.scavengerHuntIds[i] }))
    }
    //sort hunts by name
    let sortedHunts = hunts.sort((a, b) => {
        if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
            return -1;
        }
        if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
            return 1;
        }
        return 0;
    })
    res.send({ hunts: sortedHunts });
});

router.get('/hunt/:uuid/:update', async (req, res) => {
    const { uuid, update } = req.params;
    const hunt = await ScavengerHunt.findOne({ uuid });

    if (!hunt) {
        return res.status(404).send({ error: 'Scavenger hunt not found' });
    }
    let questions = [];
    for (let i = 0; i < hunt.questionIDs.length; i++) {
        let question = await Question.findOne({ uuid: hunt.questionIDs[i] })
        if (update == "true")
            if (question.question == '' && question.answers.length === 0) {
                await Question.deleteOne({ uuid: hunt.questionIDs[i] });
                await ScavengerHunt.findOneAndUpdate({ uuid: hunt.uuid }, { $pull: { questionIDs: hunt.questionIDs[i] } });
            } else {
                questions.push(question);
            }
        else
            questions.push(question);
    }
    res.send({ hunt, questions });
})
router.get("/update/:uuid/:name", async (req, res) => {
    const { uuid, name } = req.params;
    let hunt = await ScavengerHunt.findOneAndUpdate({ uuid }, { name }, { new: true });
    res.send({ hunt });
})

router.get('/new/:name', async (req, res) => {
    const { name } = req.params;
    const uuid = uuidv4();
    let hunt = await ScavengerHunt.create({ uuid, name, questionIDs: [] });
    await User.findOneAndUpdate({ uuid: req.user.uuid }, { $push: { scavengerHuntIds: uuid } });

    res.send({ hunt });
})

router.get('/delete/:uuid', async (req, res) => {
    const { uuid } = req.params;
    const hunt = await ScavengerHunt.findOne({ uuid });
    if (hunt) {
        for (let i = 0; i < hunt.questionIDs.length; i++) {
            await Question.deleteOne({ uuid: hunt.questionIDs[i] });
        }
        await ScavengerHunt.deleteOne({ uuid });
        await User.findOneAndUpdate({ uuid: req.user.uuid }, { $pull: { scavengerHuntIds: uuid } });
        res.send({ success: true });
    } else {
        res.status(404).send({ error: 'Scavenger hunt not found' });
    }
})

module.exports = router;