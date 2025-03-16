async function getOtosLottoNumbers() {
    let lotteryData;
    let resultMessage = "Unable to get mega million numbers";

    await fetch(process.env.OTOS_LOTTO_API_URL, { method: "GET" }).then(async (res) => {

        lotteryData = await res.json();
        lotteryData = lotteryData.game[0];

        console.log("otos lotto winning numbers retrieved.");

        resultMessage = `**🎉 Ötös lottó eredmények - ${lotteryData.draw.date.substring(0, 10)} 🎉**

        **${lotteryData.draw['win-number-list'].number[0].xml}**, **${lotteryData.draw['win-number-list'].number[1].xml}**, **${lotteryData.draw['win-number-list'].number[2].xml}**, **${lotteryData.draw['win-number-list'].number[3].xml}**, **${lotteryData.draw['win-number-list'].number[4].xml}**`;

    }).catch(err => {
        console.log(err);
        return err.message;
    });

    return resultMessage;
}

export { getOtosLottoNumbers }