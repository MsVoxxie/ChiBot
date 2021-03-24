const mongoose = require('mongoose');

module.exports = {
	init: () => {
		const dbOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: false,
			poolSize: 5,
			connectTimeoutMS: 10000,
			family: 4,
		};

		mongoose.connect('mongodb+srv://Chibot:Rikapoo12@chidatabase.83lmz.mongodb.net/ChiBot', dbOptions);
		mongoose.set('useFindAndModify', false);
		mongoose.Promise = global.Promise;

		mongoose.connection.on('connected', () => {
			console.log('Connected To Database');
		});

		mongoose.connection.on('err', err => {
			console.error(`Database Connection Error: \n${err.stack}`);
		});

		mongoose.connection.on('disconnect', () => {
			console.log('Database Disconnected');
		});
	},
};