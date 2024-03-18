import 'dotenv/config';
import express from 'express';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { VerifyDiscordRequest, getServerLeaderboard, Avatar, createPlayerEmbed} from './utils.js';
import { getFakeProfile, getWikiItem } from './game.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.post('/interactions', async function (req, res) {
  const { type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;


    if (name === 'profile') {
      const profileMessage = createPlayerEmbed();
    
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [profileMessage],
        },
      });
    }
    
    function createProfileMessage() {
      return "# <a:Conure3:1181758342230712351> @Bugbirt\n> Bugsy is a person who is currently building an army and planning to take over the world.\n\n## 🏆 Achievements\n- Took over Canada\n- Taken over manhatten with hamsters\n- Made an empire\n\n## 🧭 Projects\n<:Scaredbirb:1178005514584596580> <https://astrobirb.dev>"
    }   


    if (name === 'farm') {
      const option = data.options[0];
      const selectedItem = getWikiItem(option.value);
      const maxGain = 10; 
      const gainedItems = Math.floor(Math.random() * maxGain) + 1;         
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `${selectedItem.emoji} You've farmed **${gainedItems} ${selectedItem.name}**${gainedItems > 1 ? 's' : ''} graciously!`
        },
      });
    }

    if (name === 'say') {
      const { value: message } = data.options[0];
      console.log(message); 
    
      return res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: message,
        }
      });
    }

    if (name === 'avatar') {
      const user = data.targetId || req.body.member.user.id;
      const avatarUrl = `https://cdn.discordapp.com/avatars/${user}/${req.body.member.user.avatar}.png`;
    
      const embed = Avatar(avatarUrl)

    
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [embed]
        }
      });
    }    
  }




});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});