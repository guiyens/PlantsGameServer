import { Socket } from "socket.io";
import { IGame, StateEnum } from "./Infertaces/IGame";
import { Game } from "./models/Game";
import { Player } from "./models/Player";
import { CardDeck } from "./models/CardDeck";
import { Card } from "./models/Card";
import { ICard } from "./Infertaces/ICard";

const server = require("express")();
const http = require("http").createServer(server);
const cors = require("cors");
const { Server } = require("socket.io");

let newGame: IGame = new Game();

const io = new Server(http);
server.use(cors);

io.on("connection", function (socket: Socket) {
  if (newGame.isFullGame()) {
    console.log("Too much people");
    io.to(socket.id).emit("closedGame");
    socket.disconnect();
    return;
  }
  if (newGame.state !== StateEnum.WAITING) {
    console.log("Game in course");
    io.to(socket.id).emit("startedGame");
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
    newGame.removePLayer(socket.id);
    if (newGame.isOnePlayer()) {
      io.emit("winnerGame", socket.id);
      newGame = new Game();
    }
    if (newGame.isEmptyPlayers()) {
      newGame = new Game();
    }
  });

  socket.on("dismiss", function (cardsToDismiss: Array<ICard>) {
    newGame.dissmis(socket.id, cardsToDismiss);
    newGame.changeTurn();
    io.emit("updateGame", newGame);
  });

  socket.on("playCard", function (cardsToPlay: ICard) {
    newGame.playCard(socket.id, cardsToPlay);
    const player = newGame.players.find(
      (player) => player.socketId === socket.id
    )!;
    if (player.isPlayerWinner()) {
      io.emit("winnerGame", socket.id);
      return;
    }
    newGame.changeTurn();
    io.emit("updateGame", newGame);
  });

  socket.on(
    "playWildcard",
    function (wildcarInfo: { newCard: ICard; wildcard: ICard }) {
      newGame.playWildcard(
        socket.id,
        wildcarInfo.newCard,
        wildcarInfo.wildcard
      );
      newGame.changeTurn();
      io.emit("updateGame", newGame);
    }
  );

  socket.on(
    "playExtressCard",
    function (playExtressCardInfo: { card: ICard; playerId: string }) {
      newGame.playExtressCard(
        socket.id,
        playExtressCardInfo.card,
        playExtressCardInfo.playerId
      );
      const player = newGame.players.find(
        (player) => player.socketId === socket.id
      )!;
      if (player.isPlayerWinner()) {
        io.emit("winnerGame", socket.id);
        return;
      }
      newGame.changeTurn();
      io.emit("updateGame", newGame);
    }
  );

  socket.on("nextTurn", function () {
    newGame.changeTurn();
    io.emit("updateGame", newGame);
  });
});

const port = process.env.PORT || 3000;

http.listen(port, function () {
  console.log("Server started!");
});
