'use strict';

module.exports = {
  types: [
    {value: 'feat',     name: 'feat:     new features'},
    {value: 'fix',      name: 'fix:      bug fix'},
    {value: 'docs',     name: 'docs:     documentation changes'},
    {value: 'style',    name: 'style:    code format (changes that do not affect code operation)'},
    {value: 'refactor', name: 'refactor: refactoring (neither adding features nor fixing bugs)'},
    {value: 'perf',     name: 'perf:     performance optimization'},
    {value: 'test',     name: 'test:     add tests'},
    {value: 'chore',    name: 'chore:    changes in the build process or auxiliary tools'},
    {value: 'revert',   name: 'revert:   rollback'},
    {value: 'build',    name: 'build:    package'}
  ],
  // override the messages, defaults are as follows
  messages: {
    type: 'Please select the submission type:',
    // scope: 'Please enter the scope of file modification (optional):',
    // used if allowCustomScopes is true
    customScope: 'Please enter the scope of modification (optional):',
    subject: 'Please briefly describe the submission (required):',
    body: 'Please enter a detailed description (optional, to be optimized and removed, just skip):',
    // breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'Please enter the issue to be closed (to be optimized and removed, just skip):',
    confirmCommit: 'Confirm to submit using the above information? (y/n/e/h)'
  },
  allowCustomScopes: true,
  // allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['body', 'footer'],
  // limit subject length, commitlint default is 72
  subjectLimit: 72
};