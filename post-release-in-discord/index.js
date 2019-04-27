const { Toolkit } = require('actions-toolkit');
const Discord = require('discord.js');

Toolkit.run(async tools => {
  const meta = tools.store.get('meta');
  if (!meta) {
    tools.exit.failure('No meta info available');
  }
  const hook = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

  await hook.send('', new Discord.RichEmbed({
    title: `__**New ${meta.projectName} Version: ${meta.releasedVersion}**__`,
    color: 6488161,
    fields: [{
      name: 'Changelog:',
      value: meta.changelog.join('\n'),
    }],
    url: meta.releaseUrl,
    timestamp: meta.createdAt,
    footer: {
      text: 'Released',
    },
    author: {
      name: tools.arguments.authorName,
      url: tools.arguments.authorUrl,
      icon: tools.arguments.authorIcon,
    },
  }));

  tools.exit.success();
});
