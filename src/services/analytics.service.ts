import User from '../models/user.model';
import Order from '../models/order.model';
import Subscription from '../models/subscription.model';
import Attendance from '../models/attendance.model';

class AnalyticsService {
  /**
   * Get key dashboard statistics
   * @returns {Promise<any>}
   */
  public async getDashboardStats(): Promise<any> {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = salesData.length > 0 ? salesData[0].totalRevenue : 0;
    const totalOrders = salesData.length > 0 ? salesData[0].totalOrders : 0;

    // This is a simplified example. More complex queries could be added for
    // subscription revenue, peak hours from attendance, etc.

    return {
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      totalOrders,
    };
  }
}

export default new AnalyticsService();
