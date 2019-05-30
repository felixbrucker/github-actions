const { Toolkit } = require('actions-toolkit');
const Discord = require('discord.js');

Toolkit.run(async tools => {
  const meta = tools.store.get('meta');
  if (!meta) {
    tools.exit.failure('No meta info available');
  }
  const richEmbedConfig = {
    title: `:mega: __**New ${meta.projectName} Version: ${meta.releasedVersion}**__`,
    color: 6488161,
    url: meta.releaseUrl,
    timestamp: meta.createdAt,
    footer: {
      text: 'Released',
    },
  };
  if (meta.changelog.length > 0) {
    richEmbedConfig.fields = [{
      name: 'Changelog:',
      value: meta.changelog.join('\n'),
    }];
  }
  const webhooks = Object.keys(process.env)
    .filter(key => key.indexOf('DISCORD_WEBHOOK_ID') !== -1)
    .map(id => [id, id.replace('_ID', '_TOKEN')])
    .map(([id, token]) => [process.env[id], process.env[token]]);
  for (let [id, token] of webhooks) {
    const hook = new Discord.WebhookClient(id, token);
    await hook.send('', new Discord.RichEmbed(richEmbedConfig));
  }

  tools.exit.success();
});
