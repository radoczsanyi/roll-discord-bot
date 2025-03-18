import "dotenv/config";
import express from "express";
import sqlite3 from "sqlite3"; 
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from "discord-interactions";
import { getRandomEmoji, DiscordRequest } from "./utils.js";
import { getShuffledOptions, getResult } from "./game.js";
import { getLatestMegaMillionNumbers } from "./commands/mega-millions.js";
import { getOtosLottoNumbers } from "./commands/otos-lotto.js";
import { roll } from "./commands/roll.js";
import { register } from "./commands/register.js";
import { getBalance } from "./commands/account.js";
import { toMarkup } from "./helpers/balanceHelper.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

let db = new sqlite3.Database("bank.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Database opened successfully");
  }
});

// Create table (bank.db)
//
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bank (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      amount REAL NOT NULL
    )
  `);
});

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    // Interaction id, type and data
    const { id, type, data } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      // MEGA-MILLIONS
      //
      if (name === "mega-millions") {
        let message;

        try {
          message = await getLatestMegaMillionNumbers();
        } catch (err) {
          message = "An error occured. Try again later.";
        }

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }

      // balance
      //
      if (name === "balance") {
        let message = "";

        try {
          message = toMarkup(await getBalance(req.body.member.user.id));
        } catch (err) {
          message = err;
        }

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }

      // register
      //
      if (name === "register") {
        let message = "";

        try {
          const startBalance = 200;

          await register(req.body.member.user.id, startBalance);
          message = `Hello, balance: $${startBalance}`;
        } catch (err) {
          if (
            err.message.includes(
              "SQLITE_CONSTRAINT: UNIQUE constraint failed: bank.name"
            )
          ) {
            const balance = await getBalance(req.body.member.user.id);

            if (balance < 200) {
              message = "csövessss tessek $200";
            } else {
              message = `meg van penzed te zsido, balance: $${balance}`;
            }
          }
        }

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }

      // roll
      //
      //  - color
      //  - amount
      //
      if (name === "roll") {
        const color = data.options.find(
          (option) => option.name === "color"
        )?.value;
        const amount = data.options.find(
          (option) => option.name === "amount"
        )?.value;

        if (!color || !amount) {
          return res
            .status(400)
            .json({ error: "Color and amount are required" });
        }

        let message;

        try {
          message = await roll(req.body.member.user.id, color, amount);
        } catch (err) {
          message = err.message;
        }

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }

      // ötös-lottó
      //
      if (name === "otos-lotto") {
        let message;

        try {
          message = await getOtosLottoNumbers();
        } catch (err) {
          message = "An error occured. Try again later.";
        }

        // Send a message into the channel where command was triggered from
        //
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: message,
          },
        });
      }

      // unknown command
      //
      console.error(`unknown command: ${name}`);
      return res.status(400).json({ error: "unknown command" });
    }

    console.error("unknown interaction type", type);
    return res.status(400).json({ error: "unknown interaction type" });
  }
);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

process.on("exit", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("Database closed");
    }
  });
});

export { db };
