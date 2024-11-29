import express from "express";
import Shop from "../models/shopModel.js";

const router = express.Router();

// Create a new shop
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        message: "Please provide the shop name.",
      });
    }

    const newShop = {
      name,
    };

    const shop = await Shop.create(newShop);
    return res.status(201).send(shop);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get a specific shop by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).send({ message: "Shop not found." });
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get all shops
router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find({});
    return res.status(200).json({
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Update a shop's status
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["open", "closed"].includes(status)) {
      return res.status(400).send({
        message: "Invalid status. Allowed values are 'open' or 'closed'.",
      });
    }

    const shop = await Shop.findByIdAndUpdate(id, { status }, { new: true });
    if (!shop) {
      return res.status(404).send({ message: "Shop not found." });
    }

    return res.status(200).send({
      message: "Shop status updated successfully.",
      shop,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Delete a shop
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findByIdAndDelete(id);
    if (!shop) {
      return res.status(404).send({ message: "Shop not found." });
    }
    return res.status(200).send({ message: "Shop deleted successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
