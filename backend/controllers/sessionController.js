const Session = require('../models/Session');
const User = require('../models/User');

// Create a new session booking
exports.bookSession = async (req, res) => {
  try {
    const { instructorId, skill, startTime, duration } = req.body;
    const learnerId = req.user.id;
    
    // Calculate credits (1 credit per 30 mins)
    const creditsRequired = Math.ceil(duration / 30);
    
    // Check if learner has enough credits
    const learner = await User.findById(learnerId);
    if (learner.credits < creditsRequired) {
      return res.status(400).json({ message: 'Not enough credits' });
    }

    // Verify instructor exists and has the skill
    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== 'instructor') {
      return res.status(400).json({ message: 'Invalid instructor' });
    }

    const hasSkill = instructor.skills.some(s => 
      s.name.toLowerCase() === skill.toLowerCase() && s.verified
    );
    if (!hasSkill) {
      return res.status(400).json({ message: 'Instructor does not have this verified skill' });
    }
    
    // Create session
    const session = new Session({
      instructor: instructorId,
      learner: learnerId,
      skill,
      startTime,
      duration,
      credits: creditsRequired
    });
    
    await session.save();
    
    // Reserve credits (will be transferred upon session completion)
    await User.findByIdAndUpdate(learnerId, { 
      $inc: { credits: -creditsRequired } 
    });
    
    res.status(201).json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Confirm session booking
exports.confirmSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    // Find session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user is the instructor
    if (session.instructor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if session can be confirmed
    if (session.status !== 'pending') {
      return res.status(400).json({ message: 'Session cannot be confirmed' });
    }
    
    // Update session status
    session.status = 'confirmed';
    await session.save();
    
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Complete session and transfer credits
exports.completeSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    // Find session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user is the instructor
    if (session.instructor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if session is confirmed
    if (session.status !== 'confirmed') {
      return res.status(400).json({ message: 'Session must be confirmed first' });
    }
    
    // Update session status
    session.status = 'completed';
    await session.save();
    
    // Transfer credits to instructor
    await User.findByIdAndUpdate(session.instructor, { 
      $inc: { credits: session.credits } 
    });
    
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Cancel session and refund credits
exports.cancelSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    // Find session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user is the learner or instructor
    if (session.learner.toString() !== req.user.id && 
        session.instructor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if session can be cancelled
    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Completed sessions cannot be cancelled' });
    }
    
    // Return credits to learner if not a same-day cancellation
    const now = new Date();
    const sessionDate = new Date(session.startTime);
    
    // Update session status
    session.status = 'cancelled';
    await session.save();
    
    // Refund credits to learner if not same day cancellation
    if (sessionDate.getDate() !== now.getDate() || 
        sessionDate.getMonth() !== now.getMonth() || 
        sessionDate.getFullYear() !== now.getFullYear()) {
      await User.findByIdAndUpdate(session.learner, { 
        $inc: { credits: session.credits } 
      });
    }
    
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Rate and review completed session
exports.rateSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const { rating, review } = req.body;
    
    // Find session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if user is the learner
    if (session.learner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if session is completed
    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Session must be completed before rating' });
    }
    
    // Update session with rating and review
    session.rating = rating;
    session.review = review;
    await session.save();
    
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get upcoming sessions
exports.getUpcomingSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all sessions where user is instructor or learner
    const sessions = await Session.find({
      $or: [
        { instructor: userId },
        { learner: userId }
      ],
      status: { $in: ['pending', 'confirmed'] },
      startTime: { $gt: new Date() }
    }).populate('instructor learner', 'name email');
    
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
