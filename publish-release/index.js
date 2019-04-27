const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  const semVerRegex = /([0-9]+.[0-9]+.[0-9]+)/;
  const semVerRegexStart = /^([0-9]+.[0-9]+.[0-9]+)/;
  const isSemVerTag = tools.context.ref.match(semVerRegex);
  if (!isSemVerTag) {
    tools.exit.neutral('Not a semver tag');
  }
  const releasedVersion = isSemVerTag[1];
  const projectName = tools.arguments.name ? tools.arguments.name : tools.getFile('README.md').split('\n')[0];
  const name = `${projectName} v${releasedVersion}`;
  tools.log.info(`Creating a release for ${name}`);
  const changelogFile = tools.getFile('CHANGELOG.md');
  const changelogLines = changelogFile.split('\n');
  let changelog = [];
  let startAddingChangelog = false;
  for (let line of changelogLines) {
    if (line.match(semVerRegexStart)) {
      if (line.startsWith(releasedVersion)) {
        startAddingChangelog = true;
        continue;
      }
      if (!startAddingChangelog) {
        continue;
      }
      break;
    }
    if (startAddingChangelog && line.startsWith('*')) {
      changelog.push(line);
    }
  }
  const formattedChangelog = changelog.length > 0 ?  `Changelog:\n${changelog.join('\n')}` : '';
  if (formattedChangelog !== '') {
    tools.log.debug(`Extracted changelog: ${formattedChangelog}`);
  } else {
    tools.log.debug(`Could not extract a changelog!`);
  }
  const result = await tools.github.repos.createRelease({
    ...tools.context.repo,
    tag_name: releasedVersion,
    name: name,
    body: formattedChangelog,
  });
  tools.log.info(`Successfully created a release for ${name}`);
  tools.store.set('meta', {
    releasedVersion,
    projectName,
    name,
    changelog,
    releaseUrl: result.data.html_url,
    createdAt: result.data.published_at,
  });
  tools.exit.success();
});
