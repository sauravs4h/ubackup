const {
  Swipe,
  Room,
  Chat,
  Offer,
  Coupon,
  Arrival,
  Ledger,
  OutletMenu,
  Unmatch,
} = require("../../models/index.models");
const nodemailer = require("nodemailer");
const sendMailToAdmin = async (emailSubject,emailBody) => {
  // Configuration for nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: 'OAuth2', 
      user: "testwinnotificationmail",
      pass: "testwin@123",
      clientId:
        "116806134891-o649o2q3dvoko2hopru80pjj2r8477jk.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//04nmBnd-W4oESCgYIARAAGAQSNwF-L9IrHTqlhHb71uZBx5JUzIlGT1kS5TKh_vZafZ-WpdDnrmK5i3FhMo6HJL0gN2XIAv1pROY",
    },
  });

      const mailOptions = {
        from: "testwinnotificationmail@gmail.com",
        to: [
          "umlahelp@gmail.com",
          "Testwinhelp@gmail.com",
        ], // Admin's email address
        subject: emailSubject,
        text: emailBody,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info);
      } catch (error) {
        console.error("Error sending email:", error);
      }
  

  // const data = {
  //     web: {
  //         user: "testwinnotificationmail",
  //         pass: "testwin@123",
  //         client_id:
  //             "116806134891-o649o2q3dvoko2hopru80pjj2r8477jk.apps.googleusercontent.com",
  //         client_secret: "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",
  //         refresh_token:
  //             "1//04nmBnd-W4oESCgYIARAAGAQSNwF-L9IrHTqlhHb71uZBx5JUzIlGT1kS5TKh_vZafZ-WpdDnrmK5i3FhMo6HJL0gN2XIAv1pROY",
  //     },
  // };
};

module.exports = { sendMailToAdmin};
