import express from "express";
import handlebars from "express-handlebars"
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.config.js";

import __dirname from "./utils.js"
import run from "./run.js";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser())
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

const MONGO_URI = "mongodb://127.0.0.1:27017"
const MONGO_DB_NAME = "integradora2"

app.use(session({
    // store: MongoStore.create({
    //     mongoUrl: MONGO_URI,
    //     dbName: MONGO_DB_NAME
    // }),
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(MONGO_URI, {
    dbName: MONGO_DB_NAME
}, (error) => {
    if(error){
        console.log("DB No conected...")
        return
    }
    const httpServer = app.listen(8080, () => console.log("Listening..."))
    const socketServer = new Server(httpServer)
    httpServer.on("error", (e) => console.log("ERROR: " + e))

    run(socketServer, app)
})