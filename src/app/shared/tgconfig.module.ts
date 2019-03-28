import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { TG_CONFIG } from '../services/config.service';


@NgModule()
export class TgConfigModule
{
    constructor(@Optional() @SkipSelf() parentModule: TgConfigModule)
    {
        if ( parentModule )
        {
            throw new Error('TgConfigModule is already loaded. Import it in the AppModule only!');
        }
    }

    static forChild(config): ModuleWithProviders
    {
        return {
            ngModule : TgConfigModule,
            providers: [
                {
                    provide : TG_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
