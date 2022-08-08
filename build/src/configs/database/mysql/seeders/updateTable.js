"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const mysql_config_1 = require("../mysql.config");
async function updateTable() {
    try {
        new models_1.User();
        new models_1.Form();
        new models_1.FormStore();
        new models_1.ProbationaryForm();
        new models_1.AnnualReviewForm();
        mysql_config_1.sequelize.sync({ alter: true, benchmark: true, logging: true });
    }
    catch (error) {
        console.log(error);
    }
}
updateTable();
