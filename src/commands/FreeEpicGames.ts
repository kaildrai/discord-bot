import { CommandInteraction, Client, PermissionsBitField, TextChannel } from "discord.js";
import { getGames } from "epic-free-games/dist";
import { CHANNEL_IDS } from "../global/Global";
import { FreeEpicGame } from "../global/Types";
import { Command } from "../global/Command";
import { url } from "inspector";

/**
 * Retrieves a list of the current free games on the Epic Games store 
 * with the game title, description, and date the free sale ends.
 * @returns Array of type 'FreeEpicGame' with current free game information.
 */
async function retrieveFreeEpicGames(): Promise<Array<FreeEpicGame>> {
	const games: Array<FreeEpicGame> = []

	await getGames("US", true).then((res) => {

		res.currentGames.map((game) => {
			const end = game.effectiveDate.substring(0, game.effectiveDate.indexOf('T'))
			const thumbnail = game.keyImages.findIndex((type) => { type.type === 'Thumbnail' })
			// const image: string = (game.keyImages[thumbnail].url) as string

			games.push({
				title: game.title,
				description: game.description,
				effectiveDate: end,
				// img: image
			})
		})
	})
	// games.forEach((t,d) => {console.log(t, d)}) 
	return games
}

/**
 * Posts the current free games from the Epic Games Store to 
 * a specific channel for the purpose. ('CHANNEL_IDS.FREE_EPIC_GAMES')
 * @param client valid 'discord-js' Client object
 */
// TODO: Put this on a timer once server is re-dockerized

// async function postFreeGames(client: Client) {
	
// 	const channel = client.channels.cache.get(CHANNEL_IDS.FREE_EPIC_GAMES) as TextChannel	 
	
// 	retrieveFreeEpicGames().then((res) => {
// 		res.forEach((t,d) => {
// 			// console.log(`Title: ${t.title}\nDescription: ${t.description}\nFinishes: ${t.effectiveDate}`)
// 			const title: string = t.title as string
// 			const des: string = t.description as string
// 			const date: string = t.effectiveDate as string
// 			// channel.send(`Title: ${title}\nDescription: ${des}\nFinishes: ${date}`)
// 		})
// 	})
// }

export const ListFreeGames: Command = {
    name: "free-games",
    description: "Lists the current free games on epic games.",
	defaultMemberPermissions: PermissionsBitField.Flags.Administrator,

    run: async (client: Client, interaction: CommandInteraction) => {
        let content = "I will soon be good content!";
		const games: Array<FreeEpicGame> = await retrieveFreeEpicGames()

		// Format game data for discord message
		// TODO: Add a link to the game
		games.forEach((k, v) => {
			content = `**${k.title}**\n*Offer ends ${k.effectiveDate}*\n\n> ${k.description}\n\n`
		})
		
		await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 