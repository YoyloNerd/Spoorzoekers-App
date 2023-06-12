const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const Question = require('../../database/schemas/Teacher/Question');
const ScavengerHunt = require('../../database/schemas/Teacher/ScavengerHunt');

router.get("/question/:questionID", async (req, res) => {
    const { questionID } = req.params;
    let question = await Question.findOne({ uuid: questionID });

    if (!question) return res.status(404).send({ error: 'Question not found' })

    res.send({ question });
});

router.get('/new/:huntID', async (req, res) => {
    const { huntID } = req.params;
    const uuid = uuidv4();
    await Question.create({ uuid, question: '', answers: [] });
    await ScavengerHunt.findOneAndUpdate({ uuid: huntID }, { $push: { questionIDs: uuid } });
    res.send({ uuid });
});

router.post('/update/:questionID', async (req, res) => {
    const { questionID } = req.params;
    const { question, answers, hint } = req.body;

    let curQuestion = await Question.findOne({ uuid: questionID });
    if (!curQuestion) return res.status(404).send({ error: 'Question not found' })

    await Question.findOneAndUpdate({ uuid: questionID }, { question, answers, hint });
    res.send({ success: true });
});

router.delete('/delete/:huntID/:questionID', async (req, res) => {
    const { questionID, huntID } = req.params;

    let curQuestion = await Question.findOne({ uuid: questionID });
    if (!curQuestion) return res.status(404).send({ error: 'Question not found' })
    await ScavengerHunt.findOneAndUpdate({ uuid: huntID }, { $pull: { questionIDs: questionID } });
    await Question.deleteOne({ uuid: questionID });
    res.send({ success: true });
});

module.exports = router;