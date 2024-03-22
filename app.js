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
    
    if (name === 'ping') {
      res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
      });
    
      const start = Date.now();
      const end = Date.now();
      const pingTime = end - start;
    
      res.editOriginal({
        content: `🏓 Pong! Took **${pingTime}**ms.`,
      });
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
    
    if (name === 'rate') {
      console.log('I know');
      const options = data.options;
      const userOption = options.find(option => option.name === 'user');
      const userId = userOption.value;
      console.log('User ID:', userId);
      console.log('User Option:', userOption);
    
      const rating = Math.floor(Math.random() * 10) + 1;
    
      const message = `👻 I rate <@${userId}> **${rating}/10**!`;
    
      return res.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: message,
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
  }
});


app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});