const { Toolkit } = require('actions-toolkit');
const Discord = require('discord.js');

Toolkit.run(async tools => {
  const meta = tools.store.get('meta');
  if (!meta) {
    tools.exit.failure('No meta info available');
  }
  const richEmbedConfig = {
    title: `__**New ${meta.projectName} Version: ${meta.releasedVersion}**__`,
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
  tools.log.debug(meta.createdAt);
  const hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

  await hook.send('', new Discord.RichEmbed(richEmbedConfig));

  tools.exit.success();
});
