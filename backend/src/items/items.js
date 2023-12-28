const express = require('express');
const JOI = require('joi');


const router = express.Router();

const items = [
    { id: 1, name: "Tomato", quantity: "1"},
    { id: 2, name: "Potato", quantity: "2"},
    { id: 3, name: "Onion", quantity: "3"}
];


router.get('/', (req, res) => {
  res.json(items);
});

router.get('/:id', (req, res) => {
    const item = items.find(b => b.id === parseInt(req.params.id, 10));
    if (!item) return res.status(404).send('Item not found');
    return res.json(item);
  });

  const schema = JOI.object({
    id: JOI.number().integer(),
    name: JOI.string().required(),
    quantity: JOI.number().integer().required()
  });

  router.post('/', (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const item = {
      id: items.length + 1,
      name: req.body.name,
      quantity: req.body.quantity
    };
    items.push(item);
    return res.json(item);
  });

  router.delete('/:id', (req, res) => {

    const item = items.find(b => b.id === parseInt(req.params.id, 10));
    if (!item) return res.status(404).send('Item not found');
  
    const index = items.indexOf(item);
    items.splice(index, 1);
  
    return res.json(items);
  
  
  });

module.exports = router;