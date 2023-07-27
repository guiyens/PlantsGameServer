import { Socket } from "socket.io";
import { IGame } from "./Infertaces/IGame";
import { Game } from "./models/Game";
import { Player } from "./models/Player";

const server = require("express")();
const http = require("http").createServer(server);
const cors = require("cors");
const { Server } = require("socket.io");

const newGame: IGame = new Game();

const io = new Server(http);
server.use(cors);

io.on("connection", function (socket: Socket) {
  console.log("A user connected: " + socket.id);

  if (newGame.isFullGame()) {
    console.log("Too much people");
    io.to(socket.id).emit("closedGame");
    socket.disconnect();
    return;
  }
  io.to(socket.id).emit("socketCreated", socket.id);

  socket.on("addUser", function (name: string) {
    if (newGame.isPlayerAlreadyAdded(name)) {
      io.emit("AlreadyAddedUser", name);
      return;
    }
    const newPlayer = new Player(socket.id, name);
    newGame.addPlayer(newPlayer);
    io.to(socket.id).emit("addedUser", name);

    io.emit("updateGame", newGame);
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    newGame.removePLayer(socket.id);
  });

  socket.on("nextTurn", function () {
    newGame.changeTurn();
    io.emit("updateGame", newGame);
  });
});

const port = process.env.PORT || 3000;

http.listen(port, function () {
  console.log("Server started!");
});
