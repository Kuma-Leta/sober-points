// routes/routes.js
const express = require("express");
const router = express.Router();

const { authenticate, authorize } = require("../middleware/authMiddleware");
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getAllCompaniesName,
} = require("../controllers/companyController");
const { getAllCompanyUsers } = require("../controllers/userController");

router.post("/", authenticate, authorize(["super-user"]), createCompany);
router.get("/", authenticate, authorize(["super-user"]), getAllCompanies);
router.get("/company-names", authenticate, authorize(["super-user"]), getAllCompaniesName);
router.get(
  "/company-users/:companyId",
  authenticate,
  authorize(["super-user", "admin"]),
  getAllCompanyUsers
);
router.get(
  "/:id",
  authenticate,
  authorize(["super-user", "admin"]),
  getCompanyById
);
router.put(
  "/:id",
  authenticate,
  authorize(["super-user", "admin"]),
  updateCompany
);
router.delete("/:id", authenticate, authorize(["super-user"]), deleteCompany);

module.exports = router;
