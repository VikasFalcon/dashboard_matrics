
const DashboardService = require("../services/DashboardService");
const ResponseService = require("../services/ResponseService");

async function getMetrics(req,res){
    const _activityResponse = await DashboardService.getMetrics();
    return ResponseService.sendResponse(res,_activityResponse);
}

module.exports = {
    getMetrics
}