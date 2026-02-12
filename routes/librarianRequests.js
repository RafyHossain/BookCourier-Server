const { verifyToken, verifyAdmin } = require("../middleware/auth");

function librarianRequestRoutes(app, controllers) {
  const controller = controllers.librarianRequest;

  app.post(
    "/librarian-request",
    verifyToken,
    (req, res) => controller.sendRequest(req, res)
  );

  app.get(
    "/admin/librarian-requests",
    verifyToken,
    verifyAdmin,
    (req, res) => controller.getAllRequests(req, res)
  );

  app.patch(
    "/admin/librarian-requests/:id/approve",
    verifyToken,
    verifyAdmin,
    (req, res) => controller.approveRequest(req, res)
  );
}

module.exports = librarianRequestRoutes;
