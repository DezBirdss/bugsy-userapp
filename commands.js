import 'dotenv/config';
import { fakeGameItems } from './game.js';
import { InstallGlobalCommands } from './utils.js';

const WIKI_COMMAND = {
  name: 'farm',
  type: 1,
  description: 'Farm crops like a really farmer',
  options: [
    {
      type: 3,
      name: 'item',
      description: 'Item to farm',
      choices: fakeGameItems,
      required: true,
    },
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};


const pingCommand = {
  name: 'ping',
  type: 1,
  description: 'Replies with Pong!',
  integration_types: [1],
  contexts: [0, 1, 2],
};



const PROFILE_COMMAND = {
  name: 'profile',
  type: 1,
  description: 'Description of Bugsy',
  integration_types: [1],
  contexts: [0, 1, 2],
};


const SAY_COMMAND = {
  name: 'say',
  type: 1,
  description: 'Echoes back a message.',
  integration_types: [1],
  contexts: [0, 1, 2],
  options: [
    {
      name: 'message',
      description: 'The message to echo back.',
      type: 3,
      required: true
    }
  ]
};

const RATE_COMMAND = {
  name: 'rate',
  type: 1,
  description: 'I\'ll rate someone for you!',
  integration_types: [1],
  contexts: [0, 1, 2],
  options: [
    {
      name: 'user',
      description: 'The user you wanna rate',
      type: 6,
      required: true
    }
  ]
};

const ALL_COMMANDS = [
  WIKI_COMMAND,
  PROFILE_COMMAND,
  SAY_COMMAND,
  RATE_COMMAND,
  pingCommand
];



InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
