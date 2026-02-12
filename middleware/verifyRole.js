const verifyAdmin = async (req, res, next) => {
  try {
    const user = await req.models.User.findByEmail(req.user.email);

    if (!user || user.role !== "admin") {
      return res.status(403).send({ message: "Admin Only" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};

const verifyLibrarian = async (req, res, next) => {
  try {
    const user = await req.models.User.findByEmail(req.user.email);

    if (!user || user.role !== "librarian") {
      return res.status(403).send({ message: "Librarian Only" });
    }

    next();
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};

module.exports = { verifyAdmin, verifyLibrarian };
