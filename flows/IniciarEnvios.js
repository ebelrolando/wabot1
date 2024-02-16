import bot from "@bot-whatsapp/bot";
import GoogleSheetService from "../services/sheets/index.js";

import { typing, delay, sendReaction } from '../utils/utils.js';

const googleSheet = new GoogleSheetService(
  "17WUk7QlLnXODMruZcUQvWp1avaB0zuEH-dslKrxVfrw"
);

const regexMenu = `/^#send all$/i`;

export const IniciarEnvios = bot.addKeyword(regexMenu, { regex: true })
  .addAction(async (ctx, { flowDynamic, provider, endFlow, globalState }) => {

    await sendReaction(provider, ctx, "🤖");

    const allRows = await googleSheet.getAllRows();

    for (const row of allRows) {

      const allGroups = await googleSheet.getAllRowsBySheetName(row.Grupos);
      await flowDynamic(`Iniciando Envios a *${allGroups.length}* Grupos`);
      for (const group of allGroups) {

        const Data = await googleSheet.searchAndReturnFirstRow("OFF");

          if (Data[0] === 'ON') {
          
        if (row.Imagen) {
          await provider.sendMedia(group.JID, row.Imagen, row.Mensaje);
        } else {
          await provider.sendMessage(group.JID, row.Mensaje);
        }
        } else if (Data[0] === 'OFF') {
          await flowDynamic("*Envios Apagado*");
          await endFlow();
        }


        await delay(row.Delay);

      }
    }

    await flowDynamic("Envios Terminados ✅");

  });