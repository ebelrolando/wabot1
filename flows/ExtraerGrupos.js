import bot from "@bot-whatsapp/bot";
import { typing, delay, sendReaction } from '../utils/utils.js';
import GoogleSheetService from "../services/sheets/index.js";

const googleSheet = new GoogleSheetService(
    "17WUk7QlLnXODMruZcUQvWp1avaB0zuEH-dslKrxVfrw"
  );

const regexMenu = `/^#extract$/i`;

export const ExtraerGrupos = bot .addKeyword(regexMenu, {regex: true})
  .addAction(async (ctx, { flowDynamic, provider, endFlow }) => {   

    await sendReaction(provider, ctx, "🤖");

    const chatsArray = await provider.store.chats.array;

    if (chatsArray) {
      
      const grupos = chatsArray.filter(chat => chat.id && chat.id.endsWith && chat.id.endsWith('@g.us'));
      const jidsArray = [];
      grupos.forEach(grupo => {
        const jidObject = { JID: grupo.id, Nombre: grupo.name || 'Sin nombre' };
        jidsArray.push(jidObject);
      });
      const subir = await googleSheet.saveOrders(jidsArray);
      if (subir.length > 0) {
        await flowDynamic(`*${subir.length}* Grupos subidos a las 2da Hoja Exitosamente`);
      } else {
        await flowDynamic('*Error* No se agregaron filas.');
      }
      
    } else {
      console.log('No se pudo obtener la información de chats.');
    }
    



  });