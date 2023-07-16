import { Injectable, Logger } from '@nestjs/common'
import { SeedLogMessage } from 'src/interfaces/message-enums/seed-logs'
import { ArticleEntity } from 'src/repository/article.entity'
import { Connection, Repository } from 'typeorm'
import * as fs from 'fs'

@Injectable()
export class SeedService {
	private readonly logger = new Logger(SeedService.name)

	constructor(private connection: Connection) {}

	async seedDatabase(): Promise<void> {
		try {
			this.logger.log(SeedLogMessage.DATABASE_SEEDING_INIT)

			const userRepository: Repository<ArticleEntity> =
				this.connection.getRepository(ArticleEntity)
			const activationLinkRepository: Repository<ActivationLinkEntity> =
				this.connection.getRepository(ActivationLinkEntity)

			const hasData = await this.checkDataExistence(userRepository)

			if (!hasData) {
				// TODO - update PATH
				const testData = fs.readFileSync(
					'/Users/stroka01/Development/medium-clone/user/test_db.json',
					'utf-8'
				)

				const data = JSON.parse(testData)

				for (const userData of data.users) {
					const user = await userRepository.create({
						...userData,
					})
					await userRepository.save(user)
				}

				for (const activationLinkData of data.activationLinks) {
					const activationLink =
						await activationLinkRepository.create({
							userId: activationLinkData.userId,
							link: activationLinkData.link,
						})
					await activationLinkRepository.save(activationLink)
				}

				this.logger.log(SeedLogMessage.DATABASE_SEEDING_COMPLETED)
			} else {
				this.logger.log(SeedLogMessage.DATABASE_ALREADY_CONTAINS_DATA)
			}
		} catch (error) {
			this.logger.log(SeedLogMessage.ERROR_SEEDING_DATABASE)
			await this.clearTables()
			this.logger.error(
				`${SeedLogMessage.ERROR_SEEDING_DATABASE} ${error}`
			)
		}
	}

	async checkDataExistence(
		userRepository: Repository<UserEntity>
	): Promise<boolean> {
		const users = await userRepository.find()
		return users.length > 1
	}

	async clearTables(): Promise<void> {
		try {
			this.logger.log(SeedLogMessage.DATABASE_CLEARING_INITIATED)
			const userRepository: Repository<UserEntity> =
				this.connection.getRepository(UserEntity)
			const activationLinkRepository: Repository<ActivationLinkEntity> =
				this.connection.getRepository(ActivationLinkEntity)

			await activationLinkRepository.query(
				'TRUNCATE TABLE users RESTART IDENTITY'
			)
			await userRepository.query('TRUNCATE TABLE users RESTART IDENTITY')

			this.logger.log(SeedLogMessage.DATABASE_SEEDING_COMPLETED)
		} catch (e) {
			this.logger.error(SeedLogMessage.ERROR_CLEARING_DATABASE)
		}
	}
}
