var mongoose = require('mongoose');
var MovieSchema = mongoose.Schema({
    id: {
        type: Number,
        index: true,
        unique: true,
        dropDups: true
    },
    url: String,
    pic_name: String,
    name: String,
    types: [String],
    performers: [String],
    area: String,
    update: String,
    content: String,
    category: Number,
    downlist: [{
        name: String,
        link: String
    }]
});

module.exports = mongoose.model('Movie', MovieSchema, 'movies');