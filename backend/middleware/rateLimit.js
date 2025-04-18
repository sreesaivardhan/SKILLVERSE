const rateLimit = (req, res, next) => {
  // Store in memory - in production, use Redis
  const requests = {};
  
  // Get IP
  const ip = req.ip;
  const now = Date.now();
  
  // Initialize if first request
  if (!requests[ip]) {
    requests[ip] = {
      count: 1,
      firstRequest: now
    };
    return next();
  }
  
  // Check if window has expired (1 minute)
  if (now - requests[ip].firstRequest > 60000) {
    requests[ip] = {
      count: 1,
      firstRequest: now
    };
    return next();
  }
  
  // Increment count
  requests[ip].count++;
  
  // Check if too many requests (100 per minute)
  if (requests[ip].count > 100) {
    return res.status(429).json({
      message: 'Too many requests, please try again later.'
    });
  }
  
  next();
};

module.exports = rateLimit;
