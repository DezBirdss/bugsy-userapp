import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';
import { getFakeUsername } from './game.js';

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent':
        'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options,
  });
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getServerLeaderboard(guildId) {
  let members = await getServerMembers(guildId, 3);
  members = members
    .map((id, i) => `${i + 1}. <@${id}> (\`${getFakeUsername(i)}\`)`)
    .join('\n');
  return `## :trophy: Server Leaderboard\n*This is a very fake leaderboard that just pulls random server members. Pretend it's pulling real game data and it's much more fun* :zany_face:\n\n### This week\n${members}\n\n### All time\n${members}`;
}

async function getServerMembers(guildId, limit) {
  const endpoint = `guilds/${guildId}/members?limit=${limit}`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const parsedRes = await res.json();
    return parsedRes.map((member) => member.user.id);
  } catch (err) {
    return console.error(err);
  }
}

export function createPlayerEmbed(profile) {
  return {
    type: 'rich',
    title: `@Bugsbirt`,
    description: "Bugsbirt/Bugsy is a guy who is building an army and is planning to take over the world.",
    color: 0x5b65e8,
    url: `https://discord.com/users/795743076520820776`, 
    thumbnail: {
      url: 'https://cdn.discordapp.com/avatars/795743076520820776/6b9d50d21b4209bae5ef666d570aaa2b.png?size=512',
    },
    fields: [
      {
        name: 'Projects',
        value: '**Astro Birb** - https://astrobirb.dev',
        inline: true 


      }
    ]
  };
}

export function Avatar(avatar) {
  return {
    type: 'rich',
    color: 0x5b65e8,
    image: {
      url: 'https://cdn.discordapp.com/avatars/795743076520820776/6b9d50d21b4209bae5ef666d570aaa2b.png?size=512',
    },

  };
}