const Expense = require("../models/Expense");
const Category = require("../models/Category");

exports.createChart = async (query, userId) => {
	let firstdate, lastdate;
	const currentDate = new Date();

	firstdate = new Date();
	firstdate.setDate(currentDate.getDate() - 30);
	lastdate = currentDate;

	if (query && query.filter) {
		const filter = query.filter;
		switch(filter) {
			case 'today':
				firstdate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
				lastdate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
			break;
			case 'last_7_days':
				firstdate = new Date();
				firstdate.setDate(currentDate.getDate() - 7);
				lastdate = currentDate;
			break;
			case 'last_30_days':
				firstdate = new Date();
				firstdate.setDate(currentDate.getDate() - 30);
				lastdate = currentDate;
			break;
			case 'month_to_date':
				firstdate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
				lastdate = currentDate;
			break;
			case 'year_to_date':
				firstdate = new Date(currentDate.getFullYear(), 0, 1);
				lastdate = currentDate;
			break;
		}
	}

	const expenses = await Expense.find({ userid: userId, date: { $gte: firstdate, $lte: lastdate }});

	const existingcategory = [];
	const filteredexpenses = expenses.sort((a, b) => new Date(a.date) - new Date(b.date)).reduce((acc, item) => {
		const dateObj = new Date(item.date);
		if (dateObj >= firstdate && dateObj <= lastdate) {
			const formattedDate = dateObj.toLocaleDateString('en-US', {
				month: 'short',
				day: '2-digit',
				year: '2-digit'
			});

			if (!Array.isArray(acc[formattedDate])) acc[formattedDate] = [];
			const existingobj = acc[formattedDate].find(k => k.category == item.category);
			if (existingobj !== undefined) {
				existingobj.price += parseInt(item.price);
			} else {
				acc[formattedDate].push({ category: item.category, price: parseInt(item.price) });
			}
			if(existingcategory.indexOf(item.category) === -1) existingcategory.push(item.category);
			acc[formattedDate].sort((a, b) => {
				if (a.category < b.category) return -1;
				if (a.category > b.category) return 1;
				return 0; // a and b are equal
			});
			return acc;
		}

	}, {});

	const expensecategories = existingcategory.sort();

	const labels = Object.keys(filteredexpenses);

	const alldata = [];

	labels.forEach((item, index) => {
		const expenses = filteredexpenses[item];
		const arr = Array(expensecategories.length).fill(0);
		expenses.forEach((item, index) => {
			arr[expensecategories.indexOf(item.category)] = item.price;
		});
		alldata.push(arr);
	});

	const data = {
		labels: labels,
		datasets: []
	};

	expensecategories.forEach((item, index) => {
		if(existingcategory.indexOf(item) !== -1) data.datasets.push({ label: item, backgroundColor: categorycolors[item], borderColor: categorycolors[item], borderWidth: 1});
	});

	data.datasets.forEach((item, index) => {
		const dataset = alldata.map(entry => entry[index]);
		item.data = dataset;
	});


	const config = {
		type: 'bar',
		data: data,
		options: {
		  responsive: true,
		  scales: {
			x: {
			  stacked: true,
			},
			y: {
			  stacked: true,
			}
		  }
		}
	};

	return config;
}

const categorycolors = {
	"Bills": "rgba(255, 0, 0, 0.2)",
	"Debt": "rgba(0, 255, 0, 0.2)",
	"EMI": "rgba(0, 0, 255, 0.2)",
	"Education": "rgba(255, 165, 0, 0.2)",
	"Entertainment": "rgba(128, 0, 128, 0.2)",
	"Food": "rgba(255, 255, 0, 0.2)",
	"Grocery": "rgba(0, 255, 255, 0.2)",
	"Loan": "rgba(255, 0, 255, 0.2)",
	"Medical": "rgba(50, 205, 50, 0.2)",
	"Others": "rgba(255, 105, 180, 0.2)",
	"Rent": "rgba(0, 128, 128, 0.2)",
	"Savings": "rgba(75, 0, 130, 0.2)",
	"Shopping": "rgba(165, 42, 42, 0.2)",
	"Sports": "rgba(128, 128, 0, 0.2)",
	"Travel": "rgba(128, 128, 128, 0.2)"
};