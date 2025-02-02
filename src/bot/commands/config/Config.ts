import { Flag, Command } from 'discord-akairo';

export default class ConfigCommand extends Command {
	public constructor() {
		super('config', {
			aliases: ['config'],
			category: 'config',
			clientPermissions: ['EMBED_LINKS'],
			userPermissions: ['MANAGE_GUILD'],
			typing: true,
			description: {
				content: [
					'Enable and disable features on the guild',
					'',
					'**Methods**',
					'• set `<key> <...arguments>`',
					'• del `<key>`',
					'',
					'**Keys**',
					'• `muted <role>`',
					'• `restrict <roles>`',
					'• `modlog <channel>`',
					'• `userlog <channel>`',
					'• `webhook <channel>`'
				],
				usage: '<method> <...arguments>',
				examples: []
			}
		});
	}

	public *args(): unknown {
		const sub = yield {
			type: [
				['config-refresh', 'refresh'],
				['config-enable', 'enable', 'set'],
				['config-disable', 'disable', 'del']
			],
			otherwise: 'config_command_failed'
		};

		return Flag.continue(sub);
	}
}
