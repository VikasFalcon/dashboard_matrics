require("dotenv").config();
const {Pool} = require("pg");
const ResponseService = require("./ResponseService");
const redis = require('redis');


async function redisConnection(){
    try{
        const client = redis.createClient();
        client.on('error', (err) => console.log('Redis Client Error', err));

        await client.connect();

        return client;
    }
    catch(error){
        console.log("Redis Error",error);
    }    
}

async function dbConnection(){
    let pool = null;
    try{
        pool = new Pool({
            user: process.env.DB_USERNAME,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        return pool;
    }
    catch(error){
        console.log(error);
        console.log(`PG connection issue`);
        return pool;
    }
}

async function getMetrics(){
    try{
        const pool = await dbConnection();
        const client = await redisConnection();
        const currentDate = "2022-12-05";

        /* ******************Get Total Transaction Count********************** */
        let transactions_count = await client.get("transactions_count");
        if(transactions_count==null){
            const qryTansCountResponse = await pool.query(`SELECT COUNT(store_id) FROM transactions WHERE transaction_date='${currentDate}'`);
            const _transactions_count = (qryTansCountResponse.rows[0].count)?(qryTansCountResponse.rows[0].count):0;

            if(_transactions_count > 0){
                await client.set("transactions_count",_transactions_count,{'EX':60, 'NX': true});
            }

            transactions_count = _transactions_count;
        }    

        /* ******************Get Total Category wise Transaction Count********************** */
        let category_wise_transactions_count = await client.get("category_wise_transactions_count");
        if(category_wise_transactions_count==null){
            const qryTansCatCountResponse = await pool.query(`SELECT item_category, COUNT(item_category) FROM transactions WHERE transaction_date='${currentDate}' GROUP BY item_category`);
            const _category_wise_transactions_count = (qryTansCatCountResponse.rows)?(qryTansCatCountResponse.rows):{};

            if(_category_wise_transactions_count.length > 0){
                await client.set("category_wise_transactions_count",JSON.stringify(_category_wise_transactions_count),{'EX':60, 'NX': true});
            }

            category_wise_transactions_count = _category_wise_transactions_count;
        }
        else{
            category_wise_transactions_count = JSON.parse(category_wise_transactions_count);
        }

        /* ******************Get Total amount in sales********************** */
        let total_sales_amount = await client.get("total_sales_amount");
        if(total_sales_amount==null){
            const qryTotalSalesAmtResponse = await pool.query(`SELECT SUM(amount) FROM transactions WHERE transaction_date='${currentDate}'`);
            const _total_sales_amount = (qryTotalSalesAmtResponse.rows[0].sum)?(qryTotalSalesAmtResponse.rows[0].sum):0;

            if(_total_sales_amount > 0){
                await client.set("total_sales_amount",_total_sales_amount,{'EX':60, 'NX': true});
            }

            total_sales_amount = _total_sales_amount;
        } 

        /* ******************Get Category wise total amount********************** */
        let category_wise_tot_amount = await client.get("category_wise_tot_amount");
        if(category_wise_tot_amount==null){
            const qryCatTotAmtResponse = await pool.query(`SELECT item_category, SUM(amount) FROM transactions WHERE transaction_date='${currentDate}' GROUP BY item_category`);
            const _category_wise_tot_amount = (qryCatTotAmtResponse.rows)?(qryCatTotAmtResponse.rows):{};

            if(_category_wise_tot_amount.length > 0){
                await client.set("category_wise_tot_amount",JSON.stringify(_category_wise_tot_amount),{'EX':60, 'NX': true});
            }

            // await client.set("category_wise_tot_amount",_category_wise_tot_amount);
            category_wise_tot_amount = _category_wise_tot_amount;
        }
        else{
            category_wise_tot_amount = JSON.parse(category_wise_tot_amount);
        }

        let resData = {
            'transactions_count': transactions_count,
            'category_wise_transactions_count': category_wise_transactions_count,
            'total_sales_amount': total_sales_amount,
            'category_wise_tot_amount': category_wise_tot_amount
        };

        return ResponseService.buildSuccess(`Dashboard Metrics get successfully`, resData);

    }
    catch(error){
        console.log("err",error);
        return ResponseService.buildFailure(`Something went wrong`, error.stack);
    }
}

module.exports = {
    getMetrics
}