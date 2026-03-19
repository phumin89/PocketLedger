import type { ISystemService } from '../../services/system/Contracts/ISystemService';

export interface IUseApiHealthDependencies {
    readonly systemService?: ISystemService;
}
