import "dotenv/config";
import { getRPSChoices } from "./game.js";
import { capitalize, InstallGlobalCommands } from "./utils.js";

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

const MEGAMILLION_COMMAND = {
  name: "mega-millions",
  description: "See the winning numbers on Mega Millions",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const ROLL_COMMAND = {
  name: "roll",
  description: "Place a bet on roulette",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      type: 3, // String type for the color selection
      name: "color",
      description: "Choose a color to bet on",
      required: true, // Set as required
      choices: [
        { name: "Red", value: "red" },
        { name: "Black", value: "black" },
        { name: "Green", value: "green" },
        { name: "Bait", value: "bait" },
      ],
    },
    {
      type: 4, // Integer type for the amount (but you can handle decimal values)
      name: "amount",
      description: "The amount of your bet",
      required: true, // Set as required
      min_value: 0.01, // Start from 0.01
    },
  ],
};

const OTOSLOTTO_COMMAND = {
  name: "otos-lotto",
  description: "See the winning numbers on Ötös lottó",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const REGISTER_COMMAND = {
  name: "register",
  description: "Create an account",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const BALANCE_COMMAND = {
  name: "balance",
  description: "Check your current balance",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: "challenge",
  description: "Challenge to a match of rock paper scissors",
  options: [
    {
      type: 3,
      name: "object",
      description: "Pick your object",
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 2],
};

const ALL_COMMANDS = [
  MEGAMILLION_COMMAND,
  REGISTER_COMMAND,
  ROLL_COMMAND,
  BALANCE_COMMAND,
  OTOSLOTTO_COMMAND,
  CHALLENGE_COMMAND,
];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
