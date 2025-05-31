const _ = require("lodash");

const mongoose = require("mongoose");

const { Types } = mongoose;

const convertToObjectId = (id) => new Types.ObjectId(id);

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

//[a,b,c] => {a:1,b:1,c:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === null) {
      delete object[key];
    }
  });
  return object;
};

/// khong hieu ham duoi day lam gi
const updateNestedObjectParser = (object) => {
  const final = {};
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === "object" && !Array.isArray(object[key])) {
      const response = updateNestedObjectParser(object[key]);
      Object.keys(response).forEach((key2) => {
        final[`${key}.${key2}`] = response[key2];
      });
    } else {
      final[key] = object[key];
    }
  });
  return final;
};
module.exports = {
  getInfoData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectId,
  getSelectData,
};
