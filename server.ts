// import { Socket } from "socket.io";
// import { IGame, StateEnum } from "./Infertaces/IGame";
// import { Game } from "./models/Game";
// import { Player } from "./models/Player";
// import { ICard } from "./Infertaces/ICard";
// import { PasswordService } from "./services/PasswordService";

// const server = require("express")();
// const http = require("http").createServer(server);
// const cors = require("cors");
// const { Server } = require("socket.io");

// let newGame: IGame = new Game();
// let passwordService: PasswordService = new PasswordService();

// const io = new Server(http, {
//   pingInterval: 80000,
//   pingTimeout: 70000,
// });
// server.use(cors);

// io.on("connection", function (socket: Socket) {
//   console.log("connected");
//   if (newGame.isFullGame()) {
//     console.log("Too much people");
//     io.to(socket.id).emit("closedGame");
//     socket.disconnect();
//     return;
//   }
//   if (newGame.state !== StateEnum.WAITING) {
//     console.log("Game in course");
//     io.to(socket.id).emit("startedGame");
//     socket.disconnect();
//     return;
//   }
//   io.to(socket.id).emit("socketCreated", socket.id);

//   socket.on("addUser", function (name: string) {
//     if (newGame.isPlayerAlreadyAdded(name)) {
//       io.emit("AlreadyAddedUser", name);
//       return;
//     }
//     const newPlayer = new Player(socket.id, name);
//     newGame.addPlayer(newPlayer);
//     io.to(socket.id).emit("addedUser", name);
//     // if (newGame.players.length == 2) {
//     //   //MOCKING CROPS
//     //   newGame.players[0].crop.dictionary = mockCrop1 as any;
//     //   newGame.players[1].crop.dictionary = mockCrop2 as any;
//     //   //SET NEXT CARD AN SPECIAL CARD
//     //   const DISASTER_CARD = newGame.cardDeck.cards.find(
//     //     (card) => card.type === ECard.DISASTER
//     //   )!;
//     //   newGame.cardDeck.cards.unshift(DISASTER_CARD);
//     // }
//     io.emit("updateGame", newGame);
//   });

//   socket.on("ValidateUser", function (password: string) {
//     const result = passwordService.isValidPassword(password);
//     io.to(socket.id).emit("ValidateUser", result);
//   });

//   socket.on("disconnect", function () {
//     console.log("disconnect");
//     if (newGame.state === StateEnum.STARTED) {
//       newGame.addLog(socket.id, "DISCONNECT");
//     }
//     newGame.removePLayer(socket.id);
//     if (newGame.isOnePlayer()) {
//       io.emit("winnerGame", newGame.players[0].socketId);
//       newGame = new Game();
//       return;
//     }
//     if (newGame.isEmptyPlayers()) {
//       newGame = new Game();
//       return;
//     }
//     io.emit("updateGame", newGame);
//   });

//   socket.on("dismiss", function (cardsToDismiss: Array<ICard>) {
//     newGame.dissmis(socket.id, cardsToDismiss, io);
//     newGame.addLog(socket.id, "DISMISS");
//     newGame.changeTurn();
//     newGame.validatePlayersCards();
//     io.emit("updateGame", newGame);
//   });

//   socket.on("playCard", function (cardToPlay: ICard) {
//     newGame.addLog(socket.id, cardToPlay);
//     newGame.playCard(socket.id, cardToPlay, io);
//     const player = newGame.players.find(
//       (player) => player.socketId === socket.id
//     )!;
//     if (player.isPlayerWinner()) {
//       io.emit("winnerGame", socket.id);
//       return;
//     }
//     newGame.changeTurn();
//     newGame.validatePlayersCards();
//     io.emit("updateGame", newGame);
//   });

//   socket.on(
//     "playWildcard",
//     function (wildcarInfo: { newCard: ICard; wildcard: ICard }) {
//       newGame.addLog(socket.id, wildcarInfo.wildcard);
//       newGame.playWildcard(
//         socket.id,
//         wildcarInfo.newCard,
//         wildcarInfo.wildcard
//       );
//       newGame.changeTurn();
//       newGame.validatePlayersCards();
//       io.emit("updateGame", newGame);
//     }
//   );

//   socket.on(
//     "playExtressCard",
//     function (playExtressCardInfo: { card: ICard; playerId: string }) {
//       newGame.addLog(
//         socket.id,
//         playExtressCardInfo.card,
//         playExtressCardInfo.playerId
//       );
//       newGame.playExtressCard(
//         socket.id,
//         playExtressCardInfo.card,
//         playExtressCardInfo.playerId,
//         io
//       );
//       const player = newGame.players.find(
//         (player) => player.socketId === socket.id
//       )!;
//       if (player.isPlayerWinner()) {
//         io.emit("winnerGame", socket.id);
//         return;
//       }
//       newGame.changeTurn();
//       newGame.validatePlayersCards();
//       io.emit("updateGame", newGame);
//     }
//   );

//   // socket.on("nextTurn", function () {
//   //   newGame.changeTurn();
//   //   io.emit("updateGame", newGame);
//   // });
//   socket.on("startGame", function () {
//     newGame.startGame();
//     io.emit("updateGame", newGame);
//   });
// });

// const port = process.env.PORT || 3000;

// http.listen(port, function () {
//   console.log("Server started!");
// });

// const mockCrop1 = {
//   ROOT: {
//     id: "ROOT-1",
//     type: "ROOT",
//     image: "organos/OrganoRaiz.png",
//     group: "VEGETETIVE_ORGAN",
//   },
//   LEAVE: {
//     id: "LEAVE-5",
//     type: "LEAVE",
//     image: "organos/OrganoHoja.png",
//     group: "VEGETETIVE_ORGAN",
//   },
//   STEM: {
//     id: "STEM-3",
//     type: "STEM",
//     image: "organos/OrganoTallo.png",
//     group: "VEGETETIVE_ORGAN",
//   },
//   EXTRES: [
//     {
//       id: "MINERAL_DEFICIENCIES-1",
//       type: "MINERAL_DEFICIENCIES",
//       image: "Enfermedad/DeficienciasMinerales.png",
//       group: "EXTRES",
//     },
//   ],
//   TREATMENT: [
//     {
//       id: "INSECTICIDE-7",
//       type: "INSECTICIDE",
//       image: "Cura/Insecticida.png",
//       group: "TREATMENT",
//     },
//   ],
//   INDUCTING_CONDITION: [
//     {
//       id: "PHOTOPERIOD-4",
//       type: "PHOTOPERIOD",
//       image: "Fotoperiodo/DiaNeutro.png",
//       group: "INDUCTING_CONDITION",
//     },
//     {
//       id: "COLD-5",
//       type: "COLD",
//       image: "Fotoperiodo/Frio.png",
//       group: "INDUCTING_CONDITION",
//     },
//   ],
//   FLOWER: [
//     {
//       id: "FLOWER-2",
//       type: "FLOWER",
//       image: "organos/OrganoFlor.png",
//       group: "FLOWER",
//     },
//   ],
//   FRUIT: [],
// };

// const mockCrop2 = {
//   ROOT: {
//     id: "ROOT-3",
//     type: "ROOT",
//     image: "organos/OrganoRaiz.png",
//     group: "VEGETETIVE_ORGAN",
//   },
//   LEAVE: {
//     image: "organos/OrganoHoja.png",
//     group: "VEGETETIVE_ORGAN",
//     id: "LEAVE-100",
//     type: "LEAVE",
//     isWildCardOrigin: true,
//   },
//   STEM: {
//     id: "STEM-5",
//     type: "STEM",
//     image: "organos/OrganoTallo.png",
//     group: "VEGETETIVE_ORGAN",
//   },
//   EXTRES: [],
//   TREATMENT: [],
//   INDUCTING_CONDITION: [],
//   FLOWER: [
//     {
//       id: "FLOWER-1",
//       type: "FLOWER",
//       image: "organos/OrganoFlor.png",
//       group: "FLOWER",
//     },
//   ],
//   FRUIT: [],
// };
const express = require("express");
const app = express();
const port = 3000;

app.get("/hola", (req: any, res: any) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
