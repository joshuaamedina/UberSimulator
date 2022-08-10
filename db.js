const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);


mongoose.connect('mongodb+srv://epona:epona@cluster0.xea4m.mongodb.net/Nuber?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
