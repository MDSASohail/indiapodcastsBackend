export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

// Shorthand role checkers
export const isAdmin = authorize("superadmin");
export const isEditorOrAbove = authorize("superadmin", "editor");
export const isModeratorOrAbove = authorize("superadmin", "editor", "moderator");
export const isAnyRole = authorize("superadmin", "editor", "moderator", "viewer");