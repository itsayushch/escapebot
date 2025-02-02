import { Reminder } from '../../struct/RemindScheduler';
import { Message, Util } from 'discord.js';
import { Command } from 'discord-akairo';
import ms from 'ms';

const REMINDER_LIMIT = 10;

export default class ReminderAddCommand extends Command {
	public constructor() {
		super('reminder-add', {
			category: 'info',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					id: 'duration',
					type: (msg, text) => {
						if (!text) return null;
						const duration = ms(text);
						if (duration && duration >= 10000 && typeof duration === 'number') return duration;
						return null;
					},
					prompt: {
						start: 'When should I remind you?',
						retry: 'Invalid time format provided.'
					}
				},
				{
					id: 'reason',
					match: 'rest',
					type: 'string',
					prompt: {
						start: 'What should I remind you?'
					}
				},
				{
					id: 'dm',
					match: 'flag',
					flag: ['--dm']
				}
			]
		});
	}

	public async exec(message: Message, { duration, reason, dm }: { duration: number; reason: string; dm: boolean }) {
		const reminders = await this.client.db.collection<Reminder>('reminders').countDocuments({ user: message.author.id });
		if (reminders > REMINDER_LIMIT) {
			return message.util!.send('**You already have too many reminders!**');
		}

		await this.client.reminders.create({
			user: message.author.id,
			channel: message.channel.id,
			reason: Util.cleanContent(reason, message.channel),
			reference: message.url,
			duration: new Date(Date.now() + duration),
			dm: message.channel.type === 'DM' || dm,
			createdAt: new Date()
		});

		return message.util!.send(`**I'll remind you in ${ms(duration, { 'long': true })}**`);
	}
}
