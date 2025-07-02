import logger from "../utils/logger.js"
import axios from "axios"
import dotenv from "dotenv" 
dotenv.config()


const buyDataSubcription = async (req, res) => {
    logger.info("Received request for data subscription")
    const { network, phone, plan } = req.body 
    if (!network || !phone || !plan) {
        return res.status(400).json({ error: "Network, phone, and plan are required."});
    }

    try {
        const response = await axios.post(`${process.env.EXTERNAL_BACKEND_DOMAIN}/data`, 
            {
            network,
            phone,
            plan,
            ported_number: true
        },   {
             headers: {
                 Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`,
                }
            })

        if (response.status === 200) {
            logger.info("Data subscription successful:", response.data);
            return res.status(200).json(response.data);
        } else {
            logger.error("Data subscription failed with status:", response.status);
            return res.status(response.status).json({ error: "Failed to subscribe to data." });
        }
    } catch(error) {
        logger.error("Error in data subscription:", error);
        return res.status(500).json({ success: false, error: "Internal server error." });
    }
}   

const getAllDataTransactions = async (req, res) => {
    logger.info("Received request for all data transactions") 
    try {
        const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/data`, {
            headers: { 
                Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`, 
            }
        })
        return res.status(200).json(response.data)
    } catch(error){
        logger.error("Error fetching all data transactions:", error);
        return res.status(500).json({ success: false, error: "Internal server error." })
    }
}

const queryDataTransaction = async (req, res) => {
    logger.info("Received request for data transaction query")
    const { transactionId } = req.params;
    if (!transactionId) {
        logger.error("Transaction ID is required for querying data transaction")
        return res.status(400).json({ error: "Transaction ID is required." })
    }     

    try {
        const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/data/${transactionId}`, {
            headers: { 
                Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`,
            }
        })
        return res.status(200).json(response.data)
    } catch(error) {
        logger.error("Error querying data transaction:", error)
        return res.status(500).json({ success: false, error: "Internal server error." })
    }
}

const buyAirtimeSubscription = async (req, res) => {
    logger.info("Received request for airtime subscription")
    const { network, phone, amount, airtime_type } = req.body 
    if (!network || !phone || !amount || !airtime_type) {
        return res.status(400).json({ error: "Network, phone, airtime type and amount are required."})
    }

    try {
        const response = await axios.post(`${process.env.EXTERNAL_BACKEND_DOMAIN}/topup`, 
            {
            network,
            phone,
            amount,
            airtime_type,
            ported_number: true
        },   {
             headers: {
                 Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`,
                }
            })

        if (response.status === 200) {
            logger.info("Airtime subscription successful:", response.data);
            return res.status(200).json(response.data);
        } else {
            logger.error("Airtime subscription failed with status:", response.status);
            return res.status(response.status).json({ error: "Failed to subscribe to airtime." });
        }
    } catch(error) {
        logger.error("Error in airtime subscription:", error);
        return res.status(500).json({ success: false, error: "Internal server error." })
    }
}

const queryAirtimeTransaction = async (req, res) => {
    logger.info("Received request for airtime transaction query")
    const { transactionId } = req.params;
    if (!transactionId) {
        logger.error("Transaction ID is required for querying airtime transaction")
        return res.status(400).json({ error: "Transaction ID is required." })
    }     

    try {
        const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/topup/${transactionId}`, {
            headers: { 
                Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`,
            }
        })
        return res.status(200).json(response.data)
    } catch(error) {
        logger.error("Error querying airtime transaction:", error)
        return res.status(500).json({ success: false, error: "Internal server error." })
    }
}

const payElectricityBills = async (req, res) => {
    const { disco_name, amount, meter_number, meter_type } = req.body
    if (!disco_name || !amount || !meter_number || !meter_type) {
        return res.status(400).json({ error: "Disco name, amount, meter number, and meter type are required." });
    }
    try {
        const response = await axios.post(`${process.env.EXTERNAL_BACKEND_DOMAIN}/billpayment`, 
            {
                disco_name,
                amount,
                meter_number,
                meter_type,
            }, {
                headers: {
                    Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`,
                }
            })

        if (response.status === 200) {
            logger.info("Electricity bill payment successful:", response.data);
            return res.status(200).json(response.data);
        } else {
            logger.error("Electricity bill payment failed with status:", response.status);
            return res.status(response.status).json({ error: "Failed to pay electricity bill." });
        }
    } catch(error) {
        logger.error("Error in electricity bill payment:", error);
        return res.status(500).json({ success: false, error: "Internal server error." });
    }
}

const queryElectricityBill = async (req, res) => {
    logger.info("Received request for electricity transaction query")
    const { transactionId } = req.params;
    if (!transactionId) {
        logger.error("Transaction ID is required for querying electricity transaction")
        return res.status(400).json({ error: "Transaction ID is required." })
    }     

    try {
        const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/billpayment/${transactionId}`, {
            headers: { 
                Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`,
            }
        })
        return res.status(200).json(response.data)
    } catch(error) {
        logger.error("Error querying electricity transaction:", error)
        return res.status(500).json({ success: false, error: "Internal server error." })
    }
}

export { buyDataSubcription, getAllDataTransactions, queryDataTransaction, buyAirtimeSubscription, queryAirtimeTransaction, payElectricityBills, queryElectricityBill }