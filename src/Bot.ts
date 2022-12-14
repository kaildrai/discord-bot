import { Client } from "discord.js";

import { TOKEN } from './global/Global'

import Intents from "./bot/Intents";
import { partials } from "./bot/Partials";

import interactionCreate from "./events/interactionCreate"
import ready from './events/ready'

const client = new Client({ intents: [ Intents ], partials: [ partials ] })

ready(client)
interactionCreate(client)

client.login(TOKEN)