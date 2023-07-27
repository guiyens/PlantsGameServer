import { Socket } from "socket.io";
import { IGame, StateEnum } from "./Infertaces/IGame";
import { Game } from "./models/Game";
import { IPlayer } from "./Infertaces/IPlayer";
import { Player } from "./models/Player";

const server = require("express")();
const http = require("http").createServer(server);
const cors = require("cors");
const { Server } = require("socket.io");

const newGame: IGame = new Game();

const io = new Server(http);
server.use(cors);

io.on("connection", function (socket: Socket) {
  if (newGame.players.length >= 4) {
    io.to(socket.id).emit("closedGame");
    socket.disconnect();
    return;
  }
  io.to(socket.id).emit("socketCreated", socket.id);
  socket.on("addUser", function (name: string) {
    console.log("A userAdded: " + name);
    const isPlayerAlreadyAdded = newGame.players.some(
      (player: IPlayer) => player.name === name
    );
    if (!isPlayerAlreadyAdded) {
      const newPlayer = new Player(socket.id, name);
      newGame.players.push(newPlayer);
      io.to(socket.id).emit("addedUser", name);
      if (newGame.players.length === 4) {
        newGame.state = StateEnum.STARTED;
        newGame.userActive = newGame.players[0].socketId;
      }
      io.emit("updateGame", newGame);
    } else {
      io.emit("AlreadyAddedUser", name);
    }
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    newGame.players = newGame.players.filter(
      (player) => player.socketId !== socket.id
    );
  });

  socket.on("nextTurn", function () {
    changeTurn();
    io.emit("updateGame", newGame);
  });
});

const port = process.env.PORT || 3000;

http.listen(port, function () {
  console.log("Server started!");
});

const changeTurn = () => {
  const indexPlayerActive = newGame.players.findIndex(
    (player) => player.socketId === newGame.userActive
  );
  if (indexPlayerActive === 3) {
    newGame.userActive = newGame.players[0].socketId;
    return;
  }
  newGame.userActive = newGame.players[indexPlayerActive + 1].socketId;
};
