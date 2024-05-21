const app = require('./app');
const PORT = process.env.PORT || 8080;


app.listen(PORT, err => {
	err ? console.error(err) : console.log(`listening on port ${PORT}`);
});