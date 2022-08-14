const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.buyPack = async (req, res) => {
  const { token, setId, price } = req.body;
  if (!token || !setId || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let decodedId
  try {
    decodedId = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }

  const user = await User.findOne({ id: decodedId });
  if ((user.wallet * 100) >= (price * 100)) {
    user.wallet = user.wallet - price;
    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'Good luck!',
      setId,
      newWallet: user.wallet
    });
  } else {
    res.status(400).json({ 
      status: "failed",
      message: 'You do not have enough money'
    });
  }

}

exports.openPack = async (req, res) => {
  const { token, setId, cards, dateOpened } = req.body;
  if (!token || !setId || !cards || !dateOpened) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  let decodedId
  try {
    decodedId = jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }

  const user = await User.findOne({ id: decodedId });
  user.cards.push(...cards)
  await user.save();
  res.json({
      status: 'success',
      message: 'You have opened a pack',
      setId: req.body.setId,
      cards: req.body.cards,
      dateOpened: req.body.dateOpened
    })
}