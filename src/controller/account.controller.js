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
        return res.status(500).json({ error: "Internal server error." });
    }
}   

const buyAirtimeSubscription = async (req, res) => {
    logger.info("Received request for airtime subscription")
    const { network, phone, amount, airtime_type } = req.body 
    if (!network || !phone || !amount || !airtime_type) {
        return res.status(400).json({ error: "Network, phone, airtime type and amount are required."});
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
        return res.status(500).json({ error: "Internal server error." });
    }
}

export { buyDataSubcription }