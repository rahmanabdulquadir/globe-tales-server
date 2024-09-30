import express from 'express'
import authRoute from "../modules/auth/auth.route";
import userRoute from "../modules/user/user.route";
import postRoute from '../modules/post/post.route';
import categoryRoute from '../modules/category/category.route';
import paymentRoute from '../modules/payment/payment.route';
import commentRoute from '../modules/comments/comment.route';

const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/post",
    route: postRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/comment",
    route: commentRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;