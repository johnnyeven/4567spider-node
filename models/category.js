var mongoose = require('mongoose');
var CategorySchema = mongoose.Schema({
    id: {
        type: String,
        index: true
    },
    url: String,
    name: String
});

module.exports = mongoose.model('Category', CategorySchema, 'categories');