// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { createServer } = require("http");

// Import routes and utilities
const indexRouter = require("./routes/index.routes");
const connectDB = require("./utils/db/connectdb.utils");
const {
    handleMessage,
    handleOfflineTarget,
    handleUnreadMesaageCount,
    makeSeenMessage,
    getAllConnectedUser,
    notificationTarget
} = require("./controllers/index.controllers");

// Load environment variables
dotenv.config();

// Create an instance of the Express application
const app = express();
const httpServer = createServer(app);

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming requests with JSON payloads
app.use(express.json());

// Parse incoming requests with JSON payloads and set a size limit
app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
        res.locals.responseBody = body;
        originalJson.call(this, body);
    };
    next();
});

app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        res.locals.responseBody = body;
        originalSend.call(this, body);
    };
    next();
});

// logger
morgan.token("reqBody", (req, res) => {
    try {
        return JSON.parse(req.body);
    } catch (error) {
        return req.body;
    }
});

morgan.token("resBody", (req, res) => {
    try {
        return JSON.parse(res.locals.responseBody);
    } catch (error) {
        return res.locals.responseBody;
    }
});

morgan.token("request-headers", (req, res) => {
    try {
        return JSON.parse(req.headers);
    } catch (error) {
        return req.headers;
    }
});

const logFormat = (tokens, req, res) => {
    const statusValue = tokens.status(req, res);
    let statusString = `${statusValue} ❌`;
    if (statusValue === "200" || statusValue === "201") {
        statusString = `${statusValue} 🟢`;
    }
    return JSON.stringify(
        {
            date: new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
            }),
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: statusString,
            contentLength: tokens.res(req, res, "content-length"),
            responseTime: `${tokens["response-time"](req, res)} ms`,
            requestHeaders: tokens["request-headers"](req, res),
            params: req.params,
            query: req.query,
            requestBody: tokens["reqBody"](req, res),
            responseBody: tokens["resBody"](req, res),
            _s: "——————————————————————————————————————————————————————————————————————————————————————————————————————————",
        },
        null,
        2
    ).replace(/\\/g, "");
};

// Configure Morgan to use the custom formatting function
app.use(morgan(logFormat, { stream: process.stdout }));

//SET Global Variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Define routes for the application
app.use("/api/v1/umla", indexRouter);

// SOCKET.io
const io = require("socket.io")(httpServer, { path: "/chatSocket" });

const clients = {};

const openChatUsers={};

// Event listener for a new socket connection
io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    // Event listener for 'signin' event
    socket.on("signin", async (id) => {
        if (typeof id === "string") {
            console.log(`${id} has signed in`);
            // Store the socket associated with the user ID
            clients[id] = socket;
            openChatUsers[id]="";
            console.log("Connected Clients:", Object.keys(clients));

            //code for show online functionlity.
            const connectedIds = await getAllConnectedUser(id);

            console.log("connected users..............", connectedIds);

            let connectedOnlineIds = connectedIds.filter((ele) => {
                if (clients[ele]) {
                    //sending every user who already online that this new person come online.
                    clients[ele].emit("newUserOnline",id)
                    return ele;
                }
                
            });

            clients[id].emit("userOnline", connectedOnlineIds);

        } else {
            console.error("Invalid signin request");
        }
    });

    // Event listener for 'message' event
    socket.on("message", async (msg) => {
        console.log("Received Message:", msg);

        const { targetId, sourceId, message } = msg;
        if (
            typeof targetId === "string" &&
            typeof sourceId === "string" &&
            typeof message === "string"
        ) {

            let messageSeen=false

            console.log("openChatUsers.....",openChatUsers)

            if(openChatUsers[targetId]==sourceId && openChatUsers[sourceId]==targetId){
                messageSeen=true
                await handleMessage(targetId, sourceId, message,messageSeen);

            }else{
                await handleMessage(targetId, sourceId, message,messageSeen);
            }


            let msgSend={...msg,messageSeen};
            
            console.log("msgSend......",msgSend);


            // Check if the target client is online, if so, forward the message
            if (clients[targetId]) {

                if(!messageSeen){
                    console.error(`Target client ${targetId} is notification target`);
                    await notificationTarget(targetId, sourceId, message);
                }
                clients[targetId].emit("message", msgSend);

                clients[sourceId].emit("messageSeenStatus",msgSend)
                console.log(`Message forwarded to ${targetId}`);
            } else {
                console.error(`Target client ${targetId} is offline`);
                clients[sourceId].emit("messageSeenStatus",msgSend)
                await handleOfflineTarget(targetId, sourceId, message);
            }
        } else {
            console.error("Invalid message format");
        }
    });

    // Event listener for 'typing' event
    socket.on("typing", async (typingData) => {
        // Sending the typing status to  connected client.
        //console.log("something in typing")
        const { targetId, sourceId } = typingData;
        if (clients[targetId]) {
            clients[targetId].emit("userTyping", {
                userId: sourceId,
                isTyping: true,
            });
        }

        console.log(
            `sourseId ${sourceId} is typing.......to targetId ${targetId}`
        );
    });

    socket.on("openChat", async (openChatData) => {
        const { thisUserId,anotherUserId} = openChatData;

        // targetId is :- user's id who open chat . main user emit coming from.
        // sourceId is :- another user who may send the message.

        openChatUsers[thisUserId]=anotherUserId

        console.log("user tab on contect.........openChat running");

        console.log("openChatUsers......",openChatUsers)

        console.log("thisUserId...",thisUserId);
        console.log("anotherUserId...",anotherUserId); 
        
        // check another user is online or not

        let anotherUserOnline=false;

        if(clients[anotherUserId]){
            anotherUserOnline=true
        }
        
        try {
            await makeSeenMessage(anotherUserId,thisUserId);

            // another user is online or offline;
            clients[thisUserId].emit("isAnotherOnline", anotherUserOnline);

            console.log("...making message seen successfull");
        } catch (error) {
            console.log(error);
        }
    });


    socket.on("closeChat",async(closeChatData)=>{

        const {userId}=closeChatData;

        console.log("closing chat.....",userId);


        openChatUsers[userId]=""
    })

    // event for report and block

    socket.on("block", async (blockData) => {
        // Sending the typing status to  connected client.
        //console.log("something in typing")
        const { targetId, sourceId } = blockData;
        if (clients[targetId]) {
            clients[targetId].emit("blockUser", { userId: sourceId });
        }
    });

    // event for unmatch
    socket.on("unmatch", async (unmatchData) => {
        // Sending the typing status to  connected client.
        //console.log("something in typing")
        const { targetId, sourceId } = unmatchData;
        if (clients[targetId]) {
            clients[targetId].emit("unmatchUser", { userId: sourceId });
        }
    });

    // event for createdOffer
    socket.on("createdOffer", async (createdOfferData) => {
        // Sending the typing status to  connected client.
        //console.log("something in typing")
        const { targetId, sourceId, roomId } = createdOfferData;
        if (clients[targetId]) {
            clients[targetId].emit("createdOfferUser", {
                userId: sourceId,
                roomId,
            });
        }
    });

    // event for createdOffer
    socket.on("acceptOffer", async (acceptOfferData) => {
        // Sending the typing status to  connected client.
        //console.log("something in typing")
        const { targetId, sourceId, roomId } = acceptOfferData;
        if (clients[targetId]) {
            clients[targetId].emit("acceptOfferUser", {
                userId: sourceId,
                roomId,
            });
        }
    });

    // event for createdOffer
    socket.on("rejectOffer", async (rejectOfferData) => {
        // Sending the typing status to  connected client.
        //console.log("something in typing")
        const { targetId, sourceId, roomId } = rejectOfferData;
        if (clients[targetId]) {
            clients[targetId].emit("rejectOfferUser", {
                userId: sourceId,
                roomId,
            });
        }
    });

    socket.on("paymentDone", async (acceptOfferData) => {
        // Sending the typing status to  connected client.
        //console.log("something in typing")
        const { targetId, sourceId, roomId } = acceptOfferData;
        if (clients[targetId]) {
            clients[targetId].emit("paymentDoneUser", {
                userId: sourceId,
                roomId,
            });
        }
    });

    // Event listener for 'disconnect' event
    socket.on("disconnect", async() => {
        // Find the ID of the disconnected client
        const disconnectedClientId = Object.keys(clients).find(
            (id) => clients[id] === socket
        );

        // we have to send every connected user that this user went offline.

        const connectedIds = await getAllConnectedUser(disconnectedClientId);

        connectedIds.forEach((ele) => {
            if (clients[ele]) {
                //sending every user who already online that this new person Go offline.
                clients[ele].emit("userGoOffline",disconnectedClientId)

            }
            
        });

        if (disconnectedClientId) {
            console.log(`${disconnectedClientId} has disconnected`);
            // Remove the disconnected client from the clients object
            delete clients[disconnectedClientId];
            delete openChatUsers[disconnectedClientId]
            console.log("Connected Clients:", Object.keys(clients));
        }
    });
});

// Start the server
const PORT = process.env.CHAT_PORT || 3003;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        httpServer.listen(PORT, "0.0.0.0", () =>
            console.log(`chat-service on port ${PORT} :)`)
        );
    } catch (error) {
        console.log(":(", error);
    }
};
start();
