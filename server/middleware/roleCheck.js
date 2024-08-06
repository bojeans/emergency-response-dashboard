export default (roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
