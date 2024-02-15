import bot from "@bot-whatsapp/bot";
import { typing, delay, sendReaction } from '../utils/utils.js';


const regexMenu = `/^#off$/i`;

export const Apagar = bot .addKeyword(regexMenu, {regex: true})
  .addAction(async (ctx, { flowDynamic, provider, endFlow, globalState }) => {   

    await sendReaction(provider, ctx, "🚫");

    await globalState.update({encendido:false});
    

    await delay(10000);

    await globalState.update({encendido:true})
    



  });