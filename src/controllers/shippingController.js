exports.calculateShipping = (req, res) => {
  try {
    const { province, orderTotal } = req.body;

    if (!province) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng cung cấp tỉnh thành!" });
    }

    // Miễn phí vận chuyển cho đơn hàng từ 500k trở lên
    if (orderTotal && Number(orderTotal) >= 500000) {
      return res.status(200).json({
        success: true,
        data: {
          province,
          shippingFee: 0,
          isFree: true,
          estimatedDays: "2-3 ngày",
        },
      });
    }

    const p = province.toLowerCase();
    let shippingFee = 30000;

    if (
      p.includes("đồng nai") ||
      p.includes("biên hòa") ||
      p.includes("hồ chí minh")
    ) {
      shippingFee = 20000;
    } else if (p.includes("hà nội")) {
      shippingFee = 35000;
    }

    res.status(200).json({
      success: true,
      data: { province, shippingFee, isFree: false, estimatedDays: "3-4 ngày" },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
