const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  const releasedVersion = tools.context.ref;
  const projectName = tools.getFile('README.md').split('\n')[0];
  const semVerRegex = /^[0-9]+.[0-9]+.[0-9]+/;
  const changelogFile = tools.getFile('CHANGELOG.md');
  const changelogLines = changelogFile.split('\n');
  let changelog = [];
  let startAddingChangelog = false;
  for (let line of changelogLines) {
    if (line.match(semVerRegex)) {
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
  await tools.github.repos.createRelease({
    ...tools.context.repo,
    tag_name: releasedVersion,
    name: `${projectName} ${releasedVersion}`,
    body: changelog,
  });
  tools.exit.success();
});
