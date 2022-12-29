const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const dashboardController = require("./controllers/dashboardController");

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/dashboard/metrics",
        dashboardController.getMetrics);

app.listen(port, ()=>{
    console.log(`Server is running on port:${port}`);
});