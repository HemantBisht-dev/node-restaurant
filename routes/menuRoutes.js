const express = require("express");
const router = express.Router();
const MenuItem = require("../model/menu");

// Menu
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const newItem = new MenuItem(data);
    const response = await newItem.save();
    console.log("menu items saved to database");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

// fetch menu
router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("menu list fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

// query params
router.get("/:taste", async (req, res) => {
  try {
    const taste = req.params.taste;
    if (taste === "spicy" || taste === "sweet" || taste === "sour") {
      const response = await MenuItem.find({ taste: taste });
      console.log("taste specific found");
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "taste not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

// update
router.put("/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const updatedMenuData = req.body;

    const updatedMenu = await MenuItem.findByIdAndUpdate(
      menuId,
      updatedMenuData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMenu) {
      res.status(404).json({ message: "menu not found" });
    }

    console.log("menu updated successfully");
    res.status(200).json(updatedMenu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

// delete
router.delete("/:id", async (req, res) => {
  try {
    const menuId = req.params.id;
    const deletedPerson = await MenuItem.findByIdAndDelete(menuId);

    if (!deletedPerson) {
      res.status(404).json({ error: "menu item not found" });
    }

    console.log("deleted successfully");
    res.status(200).json({ message: "menu item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
