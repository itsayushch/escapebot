import { SETTINGS } from '../../../util/Constants';
import { Message, TextChannel } from 'discord.js';
import { Command } from 'discord-akairo';

export default class ConfigEnableModLogCommand extends Command {
	public constructor() {
		super('config-enable-modlog', {
			category: 'config',
			clientPermissions: ['EMBED_LINKS'],
			typing: true,
			description: {}
		});
	}

	public *args(): unknown {
		const channel = yield {
			type: 'textChannel'
		};

		return { channel };
	}

	public exec(message: Message, { channel }: { channel?: TextChannel }) {
		if (!channel) return message.util!.send('**No matches found!**');

		this.client.settings.set(message.guild!, SETTINGS.MOD_LOG, channel.id);
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
		return message.util!.send(`**Moderation channel enabled.** [${channel.toString()}]`);
	}
}
