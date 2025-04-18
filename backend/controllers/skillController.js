const User = require('../models/User');

// Add a skill to user
exports.addSkill = async (req, res) => {
  try {
    const { name, level } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if skill already exists
    if (user.skills.some(skill => skill.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ message: 'Skill already exists' });
    }

    user.skills.push({ name, level });
    await user.save();

    res.json(user.skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a skill
exports.updateSkill = async (req, res) => {
  try {
    const { name, level } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skillIndex = user.skills.findIndex(
      skill => skill.name.toLowerCase() === name.toLowerCase()
    );

    if (skillIndex === -1) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    user.skills[skillIndex].level = level;
    await user.save();

    res.json(user.skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const { name } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skillIndex = user.skills.findIndex(
      skill => skill.name.toLowerCase() === name.toLowerCase()
    );

    if (skillIndex === -1) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    user.skills.splice(skillIndex, 1);
    await user.save();

    res.json(user.skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Verify a skill (moderator/admin only)
exports.verifySkill = async (req, res) => {
  try {
    const { userId, skillName } = req.params;
    
    // Check if user is moderator or admin
    if (!['moderator', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to verify skills' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const skillIndex = user.skills.findIndex(
      skill => skill.name.toLowerCase() === skillName.toLowerCase()
    );

    if (skillIndex === -1) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    user.skills[skillIndex].verified = true;
    await user.save();

    res.json(user.skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
