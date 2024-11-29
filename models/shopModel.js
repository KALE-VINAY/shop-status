import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  name: String,
  status: { type: String, default: "closed" },
});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
