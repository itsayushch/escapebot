import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { COLLECTION, SETTINGS } from '../../../util/Constants';

export default class ToggleRoleStateCommand extends Command {
	public constructor() {
		super('toggle-rolestate', {
			category: 'config',
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
			description: {}
		});
	}

	public async exec(message: Message) {
		const roleState = this.client.settings.get<string>(message.guild!, SETTINGS.ROLE_STATE, 0);
		if (roleState) {
			this.client.settings.set(message.guild!, SETTINGS.ROLE_STATE, false);

			await this.client.db.collection(COLLECTION.ROLE_STATES).deleteMany({ guild: message.guild!.id });
			return this.reply(message, { content: '**Successfully removed all the records.**' });
		}

		this.client.settings.set(message.guild!, SETTINGS.ROLE_STATE, true);
		const members = await message.guild!.members.fetch();

		const db = this.client.db.collection(COLLECTION.ROLE_STATES).initializeUnorderedBulkOp();
		for (const member of members.values()) {
			const roles = member.roles.cache.filter(role => role.id !== message.guild!.id && !role.managed)
				.map(role => role.id);

			db.find({ guild: message.guild!.id, user: member.id }).upsert().updateOne({ $set: { roles } });
		}

		await db.execute();
		return this.reply(message, { content: '**Successfully inserted all the records.**' });
	}
}
