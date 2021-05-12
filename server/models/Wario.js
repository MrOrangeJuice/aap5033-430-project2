const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let WarioModel = {};

// mongoose.Types.ObjectID is a function that converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const WarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

WarioSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

WarioSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return WarioModel.find(search).select('name age').lean().exec(callback);
};

WarioModel = mongoose.model('Wario', WarioSchema);

module.exports.WarioModel = WarioModel;
module.exports.WarioSchema = WarioSchema;