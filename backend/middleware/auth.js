import jwt from "jsonwebtoken";

// Verifies JWT, attaches { id, role } to req.user
export const requireAuth = (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, please log in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Session expired, please log in again" });
  }
};

// Use after requireAuth to restrict a route to admins only
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};
