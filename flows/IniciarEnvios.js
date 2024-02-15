import bot from "@bot-whatsapp/bot";
import GoogleSheetService from "../services/sheets/index.js";

import { typing, delay, sendReaction } from '../utils/utils.js';


const googleSheet = new GoogleSheetService(
  "17WUk7QlLnXODMruZcUQvWp1avaB0zuEH-dslKrxVfrw"
);


const regexMenu = `/^#send all$/i`;

export const IniciarEnvios = bot .addKeyword(regexMenu, {regex: true})
  .addAction(async (ctx, { flowDynamic, provider, endFlow }) => {   

    await sendReaction(provider, ctx, "🤖");

    const allRows = await googleSheet.getAllRows();

    for (const row of allRows) {


        const allGroups = await googleSheet.getAllRowsBySheetName(row.Grupos);
        await flowDynamic(`Iniciando Envios a *${allGroups.length}* Grupos`);
        for (const group of allGroups) {
        
            await provider.sendMedia(group.JID, row.Imagen, row.Mensaje);

            await delay(row.Delay);
    
          }          
      }

      await flowDynamic("Envios Terminados ✅");

  });