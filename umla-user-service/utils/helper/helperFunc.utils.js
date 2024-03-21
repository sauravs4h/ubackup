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

const blockUser = async (currentUserId, blockUserId, block) => {
  try {
    console.log(currentUserId, blockUserId);
    const currentUserSwipe = await Swipe.findOne({ uid: currentUserId });
    const blockUserSwipe = await Swipe.findOne({ uid: blockUserId });
    const room = await Room.findOne({
      $and: [
        {
          $or: [
            { "firstUser.userId": currentUserId },
            { "firstUser.userId": blockUserId },
          ],
        },
        {
          $or: [
            { "secondUser.userId": currentUserId },
            { "secondUser.userId": blockUserId },
          ],
        },
      ],
    });

    if (room.offer) {
      const offer = await Offer.findById(room.offer);
      if (offer) {
        if ((offer.status = "shared")) {
          if (offer.owner === currentUserId) {
            await Coupon.deleteMany({
              offer: room.offer,
              owner: currentUserId,
            });
            if (offer.orderDetails.forMe.item) {
              const data = await Offer.create({
                owner: currentUserId,
                time: offer.time,
                offering: offer.offering,
                purpose: offer.purpose,
                status: "archived",
                outlet: offer.outlet,
                loc: offer.loc,
                bill: offer.bill,
                billStatus: "success",
                offerType: "scheduled",
                orderDetails: {
                  forYou: {
                    item: offer.orderDetails.forMe.item,
                  },
                },
              });
              const item = await OutletMenu.findById(
                offer.orderDetails.forMe.item
              );
              await Ledger.findOneAndUpdate(
                { offerId: room.offer }, // filter
                {
                  $set: {
                    offerId: data._id,
                    price: item.price,
                  },
                }, // update
                { new: true, useFindAndModify: false } // options
              );
            }
          } else {
            await Coupon.deleteMany({ offer: room.offer });
            offer.status = "archived";
            offer.guest = null;
            await offer.save();
            await Arrival.deleteMany({ offer: room.offer });
          }
        }
      }
    }

    console.log(currentUserSwipe, blockUserSwipe, room);
    currentUserSwipe.match.pull(blockUserId);
    blockUserSwipe.match.pull(currentUserId);
    currentUserSwipe.swipeId.pull(blockUserId);
    blockUserSwipe.swipeId.pull(currentUserId);
    if (block) {
      currentUserSwipe.blockedUser.push(blockUserId);
      blockUserSwipe.blockedUser.push(currentUserId);
    } else {
      await Unmatch.create({
        userId: currentUserId,
        unmatchUserId: blockUserId,
      });

      await Unmatch.create({
        userId: blockUserId,
        unmatchUserId: currentUserId,
      });
    }

    await Room.findOneAndDelete({
      $and: [
        {
          $or: [
            { "firstUser.userId": currentUserId },
            { "firstUser.userId": blockUserId },
          ],
        },
        {
          $or: [
            { "secondUser.userId": currentUserId },
            { "secondUser.userId": blockUserId },
          ],
        },
      ],
    }),
      Chat.deleteMany({
        roomId: room._id,
      });
    await Promise.all([currentUserSwipe.save(), blockUserSwipe.save()]);
  } catch (err) {
    throw new Error(err);
  }
};

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

module.exports = { blockUser, sendMailToAdmin };
