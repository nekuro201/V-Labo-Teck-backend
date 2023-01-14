const express = require('express')
const router = express.Router()

// middleware
const authenticateToken = require("../plugins/authenticate")

const Exercice = require("../database/Schemas/Exercice");
const Serie = require("../database/Schemas/Serie");

router.use(authenticateToken);

router.get('/count', async (req, res) => {
  try{
    Exercice.countDocuments({}, function (err, count) {
      return res.send(`Existe ${count} exercícios cadastradas no db!`)
    });
  } catch (err) {
    return res.status(400).send({error: "Error loading total exercices"});
  }
})

router.post('/delete', async (req, res) => {
  const { id } = req.body;
  Exercice.findByIdAndDelete(id, function (err) {
    if (err) return handleError(err);
    res.status(200).send(`DELETADOS`)
  });
})

router.get('/', async (req, res) => {
  try{
    const exercices = await Exercice.find().populate('series');
    return res.send({exercices}); 
  } catch (err) {
    return res.status(400).send({error: "Error loading exercices"});
  }
})

router.post('/', async (req, res) => {

  try{
    const { type, date, series } = req.body;

    const exercice = await Exercice.create({
      type,
      date,
      userId: req.googleId
    });

    await Promise.all(series.map(async serie => {
      const exerciceSerie = new Serie({...serie, exerciceId: exercice._id})
      
      await exerciceSerie.save();
      exercice.series.push(exerciceSerie);
    }));

    await exercice.save();

    return res.send({ exercice });
  } catch (err) {
    console.log(err);
    return res.status(400).send({error: "Error create exercice"});
  }
})

module.exports = router