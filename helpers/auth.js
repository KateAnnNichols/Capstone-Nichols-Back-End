module.exports = {
  ensureAuthenticated: (request, response, next) => {
    if (!request.isAuthenticated()) {
      response.status(401).json({ success: "false", message: "not logged in" });
    } else {
      return next();
    }
    request.flash("error_msg", "Not authorized");
    response.redirect("/teachers/login");
  }
};
