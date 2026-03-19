import { ApplicationBuilder } from './ApplicationBuilder.ts';
import { ApplicationComposer } from './composition/ApplicationComposer.ts';
import { DevelopmentUserProvisioner } from './Services/Auth/DevelopmentUserProvisioner.ts';
import { PasswordHashingService } from './Services/Auth/PasswordHashingService.ts';

export class ServerBootstrapper {
    private readonly host: string;
    private readonly port: number;

    public constructor() {
        this.host = process.env.HOST ?? '0.0.0.0';
        this.port = Number(process.env.PORT ?? 3000);
    }

    public async start(): Promise<void> {
        const applicationComposer = new ApplicationComposer();
        const dependencies = applicationComposer.compose();
        const developmentUserProvisioner = new DevelopmentUserProvisioner({
            dbContext: dependencies.dbContext,
            passwordHashingService: new PasswordHashingService(),
        });

        await developmentUserProvisioner.ensureUser();

        const app = new ApplicationBuilder(dependencies).build();

        try {
            await app.listen({
                host: this.host,
                port: this.port,
            });
        } catch (error) {
            app.log.error(error);
            process.exit(1);
        }
    }
}
