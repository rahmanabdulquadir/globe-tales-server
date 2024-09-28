import express from 'express'
import authRoute from "../modules/auth/auth.route";
import userRoute from "../modules/user/user.route";

const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  // {
  //   path: "/payment",
  //   route: paymentRoute,
  // },
  {
    path: "/user",
    route: userRoute,
  },
  // {
  //   path: "/post",
  //   route: postRoute,
  // },
  // {
  //   path: "/category",
  //   route: categoryRoute,
  // },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;