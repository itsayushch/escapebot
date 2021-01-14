import { COLLECTION } from '../util/Constants';
import { Collection, ObjectId } from 'mongodb';
import Client from './Client';

export interface Tag {
	_id?: ObjectId;
	name: string;
	aliases: string[];
	user: string;
	guild: string;
	hoisted: boolean;
	uses: number;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	lastModified: string;
}

export default class TagHandler {
	protected db: Collection<Tag>;

	public constructor(private readonly client: Client) {
		this.db = this.client.db.collection(COLLECTION.TAGS);
	}

	public async create(tag: Tag) {
		await this.db.insertOne({
			name: tag.name,
			aliases: [tag.name],
			user: tag.user,
			guild: tag.guild,
			hoisted: tag.hoisted,
			uses: tag.uses,
			content: tag.content,
			createdAt: tag.createdAt,
			updatedAt: tag.updatedAt,
			lastModified: tag.lastModified
		});
	}

	public async delete(name: string, guild: string) {
		const tag = name.toLowerCase();
		return this.db.deleteOne(
			{
				$and: [
					{ guild },
					{ $or: [{ name: tag }, { aliases: tag }] }
				]
			}
		);
	}

	public async find(name: string, guild: string) {
		return this.db.findOne(
			{
				$and: [
					{ guild },
					{ $or: [{ name }, { aliases: name }] }
				]
			},
			{ collation: { strength: 2, locale: 'en' } }
		);
	}

	public uses(_id: ObjectId) {
		return this.db.updateOne({ _id }, { $inc: { uses: 1 } });
	}
}
