// const { authJwt } = require("../middlewares");
// const controller = require("../controllers/employee.controller");

// module.exports = function(app) {
//   app.use(function(req, res, next) {
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, Content-Type, Accept"
//     ); 
//     next();
//   });

//   app.get("/api/test/all", controller.allAccess);

//   app.get("/api/test/employee", [authJwt.verifyToken], controller.employeeBoard);

//   app.get(
//     "/api/test/mod",
//     [authJwt.verifyToken, authJwt.isModerator],
//     controller.moderatorBoard
//   );

//   app.get(
//     "/api/test/admin",
//     [authJwt.verifyToken, authJwt.isAdmin],
//     controller.adminBoard
//   );
// };