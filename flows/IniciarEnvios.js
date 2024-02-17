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
      await flowDynamic(`Iniciando Envíos a *${allGroups.length}* Grupos`);

      for (const group of allGroups) {
        try {
          if (row.Imagen) {
            await provider.sendMedia(group.JID, row.Imagen, row.Mensaje);
          } else {
            await provider.sendText(group.JID, row.Mensaje);
          }
        } catch (error) {
          console.error(`Error al enviar mensaje al grupo ${group.JID}:`, error.message);
        
        }
      }
      await delay(10000)
    }

    await flowDynamic("Envíos Terminados ✅");
    await endFlow();
  });
