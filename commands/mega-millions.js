import xml2js from 'xml2js';

async function getLatestMegaMillionNumbers() {
    let lotteryData;
    let resultMessage = "Unable to get mega million numbers";

    await fetch(process.env.MEGA_MILLION_API_URL, { method: "POST" }).then(async (res) => {
        xml2js.parseString(await res.text(), (err, result) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }

            lotteryData = JSON.parse(result.string._)
            lotteryData = lotteryData.Drawing;

            console.log("mega-millions winning numbers retrieved.");

            resultMessage = `**🎉 Mega Millions Results - ${lotteryData.PlayDate.substring(0, 10)} 🎉**

                    **📝 Winning Numbers**:  

                    **${lotteryData.N1}**, **${lotteryData.N2}**, **${lotteryData.N3}**, **${lotteryData.N4}**, **${lotteryData.N5}**

                    **🎱 Mega Ball**: **${lotteryData.MBall}**  
                    **💥 Megaplier**: **x${lotteryData.Megaplier}**
                    **Good luck! 🍀**`;
        });
    }).catch(err => {
        console.log(err.message);

        return err.message;
    });

    return resultMessage;
}

export { getLatestMegaMillionNumbers }