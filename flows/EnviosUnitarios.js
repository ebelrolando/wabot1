import bot from "@bot-whatsapp/bot";
import { typing, delay, sendReaction } from '../utils/utils.js';
import GoogleSheetService from "../services/sheets/index.js";

const googleSheet = new GoogleSheetService(
  "17WUk7QlLnXODMruZcUQvWp1avaB0zuEH-dslKrxVfrw"
);


export const EnviosUnitarios = bot.addKeyword("#send one")
  .addAction(async (ctx, { flowDynamic, provider, endflow, globalState }) => {

    await sendReaction(provider, ctx, "🤖");

    var regexito = /#send one\s(\d+)/;

    var coincidencias = ctx.body.match(regexito);

    if (coincidencias) {
      var digitos = coincidencias[1];

      const fila = await googleSheet.getSpecificRow(digitos);
      if (fila) {
        const allGroups = await googleSheet.getAllRowsBySheetName(fila.Grupos);
        await flowDynamic(`Iniciando Envios a *${allGroups.length}* Grupos`);


        for (const group of allGroups) {

          const currentGlobalState = globalState.getMyState();
          if (currentGlobalState.encendido) {
            await provider.sendMedia(group.JID, fila.Imagen, fila.Mensaje);
          } else {
            await flowDynamic("envio cancelado 🚫");
            await endflow();
          }

          

        }

        await flowDynamic("Envio Terminado ✅");
      } else {
        await flowDynamic('No se pudo obtener la fila.');
      }



    } else {
      await flowDynamic("No se encontraron coincidencias.");
    }
  })
