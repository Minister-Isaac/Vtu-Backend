import logger from "../utils/logger.js"
import Account from "../models/account.model.js"
import Transaction from "../models/transaction.model.js"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const buyDataSubcription = async (req, res) => {
  logger.info("Received request for data subscription")
  const { network, phone, plan, userId } = req.body
  if (!network || !phone || !plan || !userId) {
    return res.status(400).json({ error: "Network, phone, plan, and user ID are required" })
  }

  try {
    const response = await axios.post(`${process.env.EXTERNAL_BACKEND_DOMAIN}/data`, {
      network,
      phone,
      plan,
      ported_number: true
    }, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })

    if (response.status === 200) {
      const account = await Account.findOne({ user: userId })
      if (!account) return res.status(404).json({ error: "Account not found" })
      if (account.wallet_balance < response.data.discountAmount) return res.status(400).json({ error: "Insufficient wallet balance" })

      account.wallet_balance -= response.data.discountAmount
      account.total_funding += response.data.discountAmount

      const transaction = await Transaction.create({
        user: userId,
        type: "data",
        amount: response.data.discountAmount,
        status: "success",
        reference: response.data.id,
        metadata: response.data
      })

      account.transactions.push(transaction._id)
      await account.save()

      logger.info("Data subscription successful:", response.data)
      return res.status(200).json(response.data)
    } else {
      logger.error("Data subscription failed with status:", response.status)
      return res.status(response.status).json({ error: "Failed to subscribe to data" })
    }
  } catch (error) {
    logger.error("Error in data subscription:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

const getAllDataTransactions = async (req, res) => {
  logger.info("Received request for all data transactions")
  try {
    const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/data`, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })
    return res.status(200).json(response.data)
  } catch (error) {
    logger.error("Error fetching all data transactions:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

const queryDataTransaction = async (req, res) => {
  logger.info("Received request for data transaction query")
  const { transactionId } = req.params
  if (!transactionId) {
    logger.error("Transaction ID is required for querying data transaction")
    return res.status(400).json({ error: "Transaction ID is required" })
  }

  try {
    const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/data/${transactionId}`, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })
    return res.status(200).json(response.data)
  } catch (error) {
    logger.error("Error querying data transaction:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

const buyAirtimeSubscription = async (req, res) => {
  logger.info("Received request for airtime subscription")
  const { network, phone, amount, airtime_type, userId } = req.body
  if (!network || !phone || !amount || !airtime_type || !userId) {
    return res.status(400).json({ error: "Network, phone, airtime type, amount, and user ID are required" })
  }

  try {
    const response = await axios.post(`${process.env.EXTERNAL_BACKEND_DOMAIN}/topup`, {
      network,
      phone,
      amount,
      airtime_type,
      ported_number: true
    }, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })

    if (response.status === 200) {
      const account = await Account.findOne({ user: userId })
      if (!account) return res.status(404).json({ error: "Account not found" })
      if (account.wallet_balance < amount) return res.status(400).json({ error: "Insufficient wallet balance" })

      account.wallet_balance -= amount
      account.total_funding += amount

      const transaction = await Transaction.create({
        user: userId,
        type: "airtime",
        amount: amount,
        status: "success",
        reference: response.data.id,
        metadata: response.data
      })

      account.transactions.push(transaction._id)
      await account.save()

      logger.info("Airtime subscription successful:", response.data)
      return res.status(200).json(response.data)
    } else {
      logger.error("Airtime subscription failed with status:", response.status)
      return res.status(response.status).json({ error: "Failed to subscribe to airtime" })
    }
  } catch (error) {
    logger.error("Error in airtime subscription:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}


const queryAirtimeTransaction = async (req, res) => {
  logger.info("Received request for airtime transaction query")
  const { transactionId } = req.params
  if (!transactionId) {
    logger.error("Transaction ID is required for querying airtime transaction")
    return res.status(400).json({ error: "Transaction ID is required" })
  }

  try {
    const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/topup/${transactionId}`, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })
    return res.status(200).json(response.data)
  } catch (error) {
    logger.error("Error querying airtime transaction:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}



const payElectricityBills = async (req, res) => {
  const { disco_name, amount, meter_number, meter_type } = req.body
  if (!disco_name || !amount || !meter_number || !meter_type) {
    return res.status(400).json({ error: "Disco name, amount, meter number, and meter type are required" })
  }

  try {
    const response = await axios.post(`${process.env.EXTERNAL_BACKEND_DOMAIN}/billpayment`, {
      disco_name,
      amount,
      meter_number,
      meter_type
    }, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })

    if (response.status === 200) {
       const account = await Account.findOne({ user: userId })
      if (!account) return res.status(404).json({ error: "Account not found" })
      if (account.wallet_balance < amount) return res.status(400).json({ error: "Insufficient wallet balance" })

      account.wallet_balance -= amount
      account.total_funding += amount

      const transaction = await Transaction.create({
        user: userId,
        type: "electricity",
        amount: amount,
        status: "success",
        reference: response.data.id,
        metadata: response.data
      })

      account.transactions.push(transaction._id)
      await account.save()
      logger.info("Electricity bill payment successful:", response.data)
      return res.status(200).json(response.data)
    } else {
      logger.error("Electricity bill payment failed with status:", response.status)
      return res.status(response.status).json({ error: "Failed to pay electricity bill" })
    }
  } catch (error) {
    logger.error("Error in electricity bill payment:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

const queryElectricityBill = async (req, res) => {
  logger.info("Received request for electricity transaction query")
  const { transactionId } = req.params
  if (!transactionId) {
    logger.error("Transaction ID is required for querying electricity transaction")
    return res.status(400).json({ error: "Transaction ID is required" })
  }

  try {
    const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/billpayment/${transactionId}`, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })
    return res.status(200).json(response.data)
  } catch (error) {
    logger.error("Error querying electricity transaction:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}



const buyCableSubscription = async (req, res) => {
  logger.info("Received request for cable subscription")
  const { cable_name, cable_plan, smart_card_number, userId, amount } = req.body
  if (!cable_name || !cable_plan || !smart_card_number || !userId || !amount) {
    logger.error("Cable name, cable plan, smart card number, amount, and user ID are required")
    return res.status(400).json({ error: "Cable name, cable plan, smart card number, amount, and user ID are required" })
  }

  try {
    const response = await axios.post(`${process.env.EXTERNAL_BACKEND_DOMAIN}/cablesub`, {
      cable_name,
      cable_plan,
      smart_card_number
    }, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })

    if (response.status === 200) {
      const account = await Account.findOne({ user: userId })
      if (!account) return res.status(404).json({ error: "Account not found" })
      if (account.wallet_balance < amount) return res.status(400).json({ error: "Insufficient wallet balance" })

      account.wallet_balance -= amount
      account.total_funding += amount

      const transaction = await Transaction.create({
        user: userId,
        type: "cable",
        amount: amount,
        status: "success",
        reference: response.data.id,
        metadata: response.data
      })

      account.transactions.push(transaction._id)
      await account.save()

      logger.info("Cable subscription successful:", response.data)
      return res.status(200).json(response.data)
    } else {
      logger.error("Cable subscription failed with status:", response.status)
      return res.status(response.status).json({ error: "Failed to subscribe to cable" })
    }
  } catch (error) {
    logger.error("Error in cable subscription:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

const queryCableSubscription = async (req, res) => {
  const { transactionId } = req.params
  if (!transactionId) {
    logger.error("Transaction ID is required for querying cable subscription")
    return res.status(400).json({ error: "Transaction ID is required" })
  }

  try {
    const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/cablesub/${transactionId}`, {
      headers: {
        Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
      }
    })
    if (response.status === 200) {
      logger.info("Cable subscription query successful:", response.data)
      return res.status(200).json(response.data)
    }
    logger.error("Cable subscription query failed with status:", response.status)
    return res.status(response.status).json({ error: "Failed to query cable subscription" })
  } catch (error) {
    logger.error("Error querying cable subscription:", error)
    return res.status(500).json({ success: false, error: "Internal server error" })
  }
}

const validateUIC = async (req, res) => {
    logger.info("Validating UIC")
    const { smart_card_number, cable_name } = req.params
    if (!smart_card_number || !cable_name) {
        logger.error("Smart card number and cable name are required for UIC validation")
        return res.status(400).json({ error: "Smart card number and cable name are required" })
    }
    try {
        const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/validateiuc?smart_card_number=${smart_card_number}&&cable_name=${cable_name}`, {
            headers: {
                Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
            }
        })
        if (response.status === 200) {
            logger.info("UIC validation successful:", response.data)
            return res.status(200).json(response.data)
        }
        logger.error("UIC validation failed with status:", response.status)
        return res.status(response.status).json({ error: "Failed to validate UIC" })
    } catch (error) {
        logger.error("Error validating UIC:", error)
        return res.status(500).json({ success: false, error: "Internal server error" })
    }
}

const validateMeter = async (req, res) => {
    logger.info("Validating METER")
    const { meter_number, disco_name, meter_type } = req.params 
    if (!meter_number || !disco_name || !meter_type) {
        logger.error("Meter number, disco name, and meter type are required for meter validation")
        return res.status(400).json({ error: "Meter number, disco name, and meter type are required" })
    }
    const response = await axios.get(`${process.env.EXTERNAL_BACKEND_DOMAIN}/validatemeter?meternumber=${meter_number}&disconame=${disco_name}&metertype=${meter_type}`, {
        headers: { 
            Authorization: `Token ${process.env.EXTERNAL_BACKEND_API_KEY}`
        }
    })
    if (response.status === 200) {
        logger.info("Meter validation successful:", response.data)
        return res.status(200).json(response.data)
    }
    logger.error("Meter validation failed with status:", response.status)
    return res.status(response.status).json({ error: "Failed to validate meter" })
}

export { buyDataSubcription, getAllDataTransactions, queryDataTransaction, buyAirtimeSubscription, queryAirtimeTransaction, payElectricityBills, queryElectricityBill, buyCableSubscription, queryCableSubscription, validateUIC, validateMeter }
