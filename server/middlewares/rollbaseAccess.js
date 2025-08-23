
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user; 

      if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Requires role: ${allowedRoles.join(", ")}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
};
