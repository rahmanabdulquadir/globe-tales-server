import Payment from "../payment/payment.model";
import User from "../user/user.model";

const getPaymentStatistic = async ({ from, to }: { from: Date; to: Date }) => {
  const result = await Payment.find({
    createdAt: {
      $gte: from,
      $lte: to,
    },
  });

  return result;
};

const getUserStatistics = async () => {
  const premiumUserCount = await User.countDocuments({
    isPremium: true,
    role: { $ne: "admin" },
  });
  const normalUserCount = await User.countDocuments({
    isPremium: false,
    role: { $ne: "admin" },
  });

  return { premiumUserCount, normalUserCount };
};

const statisticsService = {
  getPaymentStatistic,
  getUserStatistics,
};

export default statisticsService;