import { getBalance, updateBalance } from "./account.js";
import { toMarkup } from "../helpers/balanceHelper.js";

async function roll(userId, color, amount) {
  let activeBalance = await getBalance(userId);

  if (activeBalance < amount) {
    return "insufficient funds. " + toMarkup(amount);
  }

  const result = roulette(amount, color);

  // update the user's active balance accordingly
  //
  await updateBalance(userId, result.winAmount);

  activeBalance = toMarkup(await getBalance(userId));
  return `${result.message} > ${activeBalance}`;
}

function roulette(betAmount, betChoice) {
  const wheel = [
    { color: "red", multiplier: 2 },
    { color: "black", multiplier: 2 },
    { color: "bait", multiplier: 7 },
    { color: "bait", multiplier: 7 }, 
    { color: "green", multiplier: 14 }, 
  ];

  const randomIndex = Math.floor(Math.random() * wheel.length);
  const result = wheel[randomIndex];

  let message = "";
  let winAmount = 0;

  if (betChoice === result.color) {
    winAmount = betAmount * result.multiplier;
    message = `> **You win**! The result is ${result.color} and you win $${winAmount}.`;
  } else {
    winAmount = -betAmount;
    message = `> **You lose**. The result is ${result.color}. You lose your bet of $${betAmount}.`;
  }

  return { resultMessage: message, winAmount };
}

export { roll };
