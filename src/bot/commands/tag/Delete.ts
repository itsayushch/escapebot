import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class TagDeleteCommand extends Command {
	public constructor() {
		super('tag-delete', {
			category: 'tag',
			channel: 'guild',
			description: {}
		});
	}

	public *args(): unknown {
		const name = yield {
			match: 'content',
			type: 'lowercase'
		};

		return { name };
	}

	public async exec(message: Message, { name }: { name?: string }) {
		if (!name) return message.util!.send('**You must provide a tag name idiot!**');
		const del = await this.client.tags.collection.deleteOne({ guild: message.guild!.id, name });
		if (!del.deletedCount) return message.util!.send('**No matches found!**');
		return message.util!.send('**Successfully deleted the tag from this guild.**');
	}
}
