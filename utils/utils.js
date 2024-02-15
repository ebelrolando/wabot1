export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const typing = async (provider, ctx, ms) => {
  const refProvider = await provider.getInstance();
  const jid = ctx.key.remoteJid;

  await delay(300);
  await refProvider.sendPresenceUpdate("composing", jid);
  await delay(ms);
  await refProvider.sendPresenceUpdate("available", jid);
};

export const sendReaction = async (provider, ctx, emoji = "🤖") => {
  const id = ctx.key.remoteJid;

  const reactionMessage = {
    react: {
      text: emoji,
      key: ctx.key,
    },
  };

  const abc = await provider.getInstance();
  await abc.sendMessage(id, reactionMessage);
};
