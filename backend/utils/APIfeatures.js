class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.searchFields = [];
  }

  multfilter(fields = []) {
    this.searchFields = fields;
    const searchQuery = this.queryString.q || "";
    if (typeof searchQuery === "string" && fields.length > 0) {
      const regexSearch = {
        $or: fields.map((field) => ({
          [field]: { $regex: searchQuery, $options: "i" },
        })),
      };
      this.query.find(regexSearch);
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields", "q"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const filterKeys = Object.keys(queryObj);
    filterKeys.forEach((key) => {
      if (typeof queryObj[key] === "string") {
        const operatorMatch = queryObj[key].match(/(gte|gt|lte|lt|eq):(.+)/);
        if (operatorMatch) {
          queryObj[key] = {
            [`$${operatorMatch[1]}`]: Number(operatorMatch[2]),
          };
        }
      }
    });

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limiting() {
    if (this.queryString.fields) {
      const selectedFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select("-__v -password");
    }
    return this;
  }

  paginatinating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIfeatures;
