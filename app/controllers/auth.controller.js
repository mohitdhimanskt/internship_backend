const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
// const Employee = db.employee;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  console.log(req.body);
  const user = User.findOne({
    email: req.body.email,
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Email Not found." });
      }

      console.log(user)

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );  

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
        console.log(token)
   

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
      
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
// exports.signup = (req, res) => {
//   const employee = new Employee({
//     username: req.body.username,
//     email: req.body.email,
//     password: bcrypt.hashSync(req.body.password, 8),
//   });

//   employee.save((err, employee) => {
//     if (err) {
//       res.status(500).send({ message: err });
//       return;
//     }

//     if (req.body.roles) {
//       Role.find(
//         {
//           name: { $in: req.body.roles },
//         },
//         (err, roles) => {
//           if (err) {
//             res.status(500).send({ message: err });
//             return;
//           }

//           employee.roles = roles.map((role) => role._id);
//           employee.save((err) => {
//             if (err) {
//               res.status(500).send({ message: err });
//               return;
//             }

//             res.send({ message: "Employee was registered successfully!" });
//           });
//         }
//       );
//     } else {
//       Role.findOne({ name: "employee" }, (err, role) => {
//         if (err) {
//           res.status(500).send({ message: err });
//           return;
//         }

//         employee.roles = [role._id];
//         employee.save((err) => {
//           if (err) {
//             res.status(500).send({ message: err });
//             return;
//           }

//           res.send({ message: "employee was registered successfully!" });
//         });
//       });
//     }
//   });
// };

// exports.signin = (req, res) => {
//   Employee.findOne({
//     username: req.body.username,
//   })
//     .populate("roles", "-__v")
//     .exec((err, employee) => {
//       if (err) {
//         res.status(500).send({ message: err });
//         return;
//       }

//       if (!employee) {
//         return res.status(404).send({ message: "Employee Not found." });
//       }

//       var passwordIsValid = bcrypt.compareSync(
//         req.body.password,
//         employee.password
//       );

//       if (!passwordIsValid) {
//         return res.status(401).send({ message: "Invalid Password!" });
//       }

//       var token = jwt.sign({ id: employee.id }, config.secret, {
//         expiresIn: 86400, // 24 hours
//       });

//       var authorities = [];

//       for (let i = 0; i < employee.roles.length; i++) {
//         authorities.push("ROLE_" + employee.roles[i].name.toUpperCase());
//       }

//       req.session.token = token;

//       res.status(200).send({
//         id: employee._id,
//         username: employee.username,
//         email: employee.email,
//         roles: authorities,
//       });
//     });
// };

// exports.signout = async (req, res) => {
//   try {
//     req.session = null;
//     return res.status(200).send({ message: "You've been signed out!" });
//   } catch (err) {
//     this.next(err);
//   }
// };
