const Order = require("../models/Order");

// [POST] /api/payment/create-qr - Tạo mã thanh toán QR động
exports.createPaymentQR = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng!" });
    }

    const totalAmount = order.totalAmount;
    const orderCode = order.orderCode;
    let qrUrl = "";

    if (paymentMethod === "VIETQR" || !paymentMethod) {
      // 1. Chuẩn VietQR (Napas 247)
      const bankId = process.env.BANK_ID || "MB";
      const accountNo = process.env.BANK_ACCOUNT_NO || "0987654321";
      const accountName = encodeURIComponent(
        process.env.BANK_ACCOUNT_NAME || "LHU ECOMMERCE STORE",
      );
      const addInfo = encodeURIComponent(`DH ${orderCode}`);

      qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${totalAmount}&addInfo=${addInfo}&accountName=${accountName}`;
    } else if (paymentMethod === "MOMO_QR") {
      // 2. Mã QR MoMo
      const momoPhone = process.env.MOMO_PHONE || "0987654321";
      const momoName = encodeURIComponent("LHU STORE");
      const momoData = encodeURIComponent(
        `2|99|${momoPhone}|${momoName}||0|0|${totalAmount}|DH ${orderCode}|transfer_myqr`,
      );

      qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${momoData}`;
    }

    res.status(200).json({
      success: true,
      message: "Tạo mã thanh toán QR thành công",
      data: {
        orderId: order._id,
        orderCode: order.orderCode,
        totalAmount,
        paymentMethod: paymentMethod || "VIETQR",
        qrUrl,
        transferNote: `DH ${orderCode}`,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// [POST] /api/payment/confirm-paid - Xác nhận đã thanh toán
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng!" });
    }

    order.paymentStatus = "PAID";
    order.orderStatus = "CONFIRMED";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Xác nhận thanh toán thành công!",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
