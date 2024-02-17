import bot from "@bot-whatsapp/bot";
import { typing, delay, sendReaction } from '../utils/utils.js';
import GoogleSheetService from "../services/sheets/index.js";

const googleSheet = new GoogleSheetService(
  "17WUk7QlLnXODMruZcUQvWp1avaB0zuEH-dslKrxVfrw"
);

export const EnviosUnitarios = bot.addKeyword("#send one")
  .addAction(async (ctx, { flowDynamic, provider, endFlow, globalState }) => {

    await sendReaction(provider, ctx, "🤖");

    var regexito = /#send one\s(\d+)/;

    var coincidencias = ctx.body.match(regexito);

    if (coincidencias) {
      var digitos = coincidencias[1];

      try {
        const fila = await googleSheet.getSpecificRow(digitos);

        if (fila) {
          const allGroups = await googleSheet.getAllRowsBySheetName(fila.Grupos);
          await flowDynamic(`Iniciando Envios a *${allGroups.length}* Grupos`);

          for (const group of allGroups) {
            try {
              if (fila.Imagen) {
                await provider.sendMedia(group.JID, fila.Imagen, fila.Mensaje);
              } else {
                await provider.sendText(group.JID, fila.Mensaje);
              }
              
            } catch (error) {
              console.error(`Error al enviar mensaje al grupo ${group.JID}:`, error.message);
              
            }
          }

          await flowDynamic("Envío Terminado ✅");
        } else {
          await flowDynamic('No se pudo obtener la fila.');
        }
      } catch (error) {
        console.error(`Error al obtener la fila específica ${digitos}:`, error.message);
        
      }
    } else {
      await flowDynamic("No se encontraron coincidencias.");
    }
    await endFlow();
  });
