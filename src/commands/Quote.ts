import { CommandInteraction, Client, TextChannel, MessageManager, Collection } from "discord.js";

import { Command } from "../global/Command";
import { CHANNEL_IDS, MESSAGE_IDS } from "../global/Global";
import { fetchQuotes } from "../global/Utils"

/**
 * Recursive function that fetches ALL messages from a collection of messages
 */
async function getQuotes(messages: MessageManager) {

    if(!messages) throw new Error(`expected messages, got ${typeof messages}`)
    let collection = await fetchQuotes(100, messages) 

    // TODO: Merge collections instead of concatenating fetch results into an array
    if(collection.lastKey() !== MESSAGE_IDS.EARLIEST_QUOTE) {
        const new_fetch = [await fetchQuotes(100, messages, collection.lastKey() as string), ...collection]
    }

    return collection
}

/**
 * Command: /quote  
 * Lists a random quote from the '#quotes' channel
 */
export const Quote: Command = {

    name: "quote",
    description: "Random quote from #quotes",
    run: async (client: Client, interaction: CommandInteraction) => {
        const messages = (client.channels.cache.get(CHANNEL_IDS.QUOTES) as TextChannel).messages as MessageManager
        const collection = await getQuotes(messages)

        let quotes: string[] = []

        // TODO: Format the quote
        for (let val of collection.values()) {
            quotes.push(val as string) 
        }
        console.log(`size of all quotes fetched: ${ quotes.length }`)

        const content = `> ${quotes[Math.floor(Math.random() * quotes.length - 1)]}`
        await interaction.followUp({
            ephemeral: false,
            content
        });
    }
}; 