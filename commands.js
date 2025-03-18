import "dotenv/config";
import { getRPSChoices } from "./game.js";
import { capitalize, InstallGlobalCommands } from "./utils.js";

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
  description: "Checks the winning numbers on Mega Millions",
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
      type: 3, 
      name: "color",
      description: "Choose a color to bet on",
      required: true, 
      choices: [
        { name: "Red", value: "red" },
        { name: "Black", value: "black" },
        { name: "Green", value: "green" },
        { name: "Bait", value: "bait" },
      ],
    },
    {
      type: 4,
      name: "amount",
      description: "The amount of your bet",
      required: true, 
      min_value: 0.01, 
    },
  ],
};

const OTOSLOTTO_COMMAND = {
  name: "otos-lotto",
  description: "Checks the winning numbers on Ötös lottó",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const REGISTER_COMMAND = {
  name: "register",
  description: " Create an account with a starting balance of $200",
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
