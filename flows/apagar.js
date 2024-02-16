import bot from "@bot-whatsapp/bot";
import { typing, delay, sendReaction } from '../utils/utils.js';
import GoogleSheetService from "../services/sheets/index.js";

const googleSheet = new GoogleSheetService(
  "17WUk7QlLnXODMruZcUQvWp1avaB0zuEH-dslKrxVfrw"
);

const regexMenu = `/^#off$/i`;

export const Apagar = bot .addKeyword(regexMenu, {regex: true})
  .addAction(async (ctx, { flowDynamic, provider, endFlow, globalState }) => {  

    const Data = await googleSheet.searchAndReturnFirstRow("OFF");
    console.log(Data);


  });