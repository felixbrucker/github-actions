const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  const semVerRegex = /([0-9]+.[0-9]+.[0-9]+)/;
  const semVerRegexStart = /^([0-9]+.[0-9]+.[0-9]+)/;
  const releasedVersion = tools.context.ref.match(semVerRegex)[1];
  const projectName = tools.getFile('README.md').split('\n')[0];
  tools.log.info(`Creating a release for ${projectName} ${releasedVersion}`);
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
      break;
    }
    if (startAddingChangelog && line.startsWith('*')) {
      changelog.push(line);
    }
  }
  changelog = changelog.length > 0 ?  `Changelog:\n${changelog.join('\n')}` : '';
  if (changelog !== '') {
    tools.log.debug(`Extracted changelog: ${changelog}`);
  }
  await tools.github.repos.createRelease({
    ...tools.context.repo,
    tag_name: releasedVersion,
    name: `${projectName} ${releasedVersion}`,
    body: changelog,
  });
  tools.log.info(`Successfully created a release for ${projectName} ${releasedVersion}`);
  tools.exit.success();
});
