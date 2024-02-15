import "dotenv/config";
import bot from "@bot-whatsapp/bot";
import QRPortalWeb from "@bot-whatsapp/portal";
import BaileysProvider from "@bot-whatsapp/provider/baileys";
import MockAdapter from "@bot-whatsapp/database/json";

import { IniciarEnvios } from "./flows/IniciarEnvios.js";
import { EnviosUnitarios } from "./flows/EnviosUnitarios.js";
import { ExtraerGrupos } from "./flows/ExtraerGrupos.js";



const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = bot.createFlow([
    IniciarEnvios,
    EnviosUnitarios,
    ExtraerGrupos
  ]);
  const adapterProvider = bot.createProvider(BaileysProvider);

  bot.createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  
  QRPortalWeb();

};

main();
