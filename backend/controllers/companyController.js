const Company = require("../models/company");
const user = require("../models/user");
const APIfeatures = require("../utils/APIfeatures");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// 📌 Create Company
exports.createCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//
exports.getAllCompaniesName = async (req, res) => {
  try {
    const companies = await Company.find({}, "id name"); // Fetch only id and name
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies" });
  }
};
// 📌 Get All Companies with Filtering, Sorting, Pagination
exports.getAllCompanies = async (req, res) => {
  try {
    let query = Company.find();

    // Apply APIfeatures for filtering, sorting, limiting, and pagination
    const features = new APIfeatures(query, req.query)
      .multfilter(["name", "industry", "location"]) // Specify searchable fields
      .filter()
      .sort()
      .limiting()
      .paginatinating();

    // Fetch the total number of records for pagination
    const totalRecords = await Company.countDocuments(
      await features.query.getQuery()
    );

    // Fetch the paginated and filtered companies
    const companies = await features.query;

    if (companies.length === 0) {
      return res.status(404).json({ message: "No companies found" });
    }

    const companiesWithUsersCount = await Promise.all(
      companies.map(async (company) => {
        const count = await user.countDocuments({ company: company._id });
        const companyObj = company.toObject();
        companyObj.usersCount = count;
        return companyObj;
      })
    );

    // Calculate total pages based on total records and limit
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      totalPages,
      totalRecords,
      companies: companiesWithUsersCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// 📌 Get Company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Count the number of users associated with the company
    const count = await user.countDocuments({ company: company._id });

    // Convert the company document to a plain JavaScript object
    const companyObj = company.toObject();

    // Add the usersCount property to the company object
    companyObj.usersCount = count;

    // Send the modified company object as the response
    res.json(companyObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Define the uploads directory
const uploadsDir = path.join(__dirname, "uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize the upload middleware
const upload = multer({ storage: storage });
// 📌 Update Company
exports.updateCompany = async (req, res) => {
  upload.single("logo")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload failed", error: err.message });
    }
    try {
      const logo = req.file ? req.file.path : undefined;

      const updateData = { ...req.body };
      if (logo) {
        updateData.logo = logo;
      }
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );
      if (!company)
        return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};

// 📌 Delete Company
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
