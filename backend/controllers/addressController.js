import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res
        .status(400)
        .json({ success: false, message: "Address is required" });
    }

    const savedAddress = await Address.create({
      userId: req.userId,
      ...address,
      phoneNumber: address.phone ?? address.phoneNumber,
      postalCode: address.zipcode ?? address.postalCode,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Address added successfully",
        address: savedAddress,
      });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Addresses : /api/address/get
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
