import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'src/app/app.module';
import { AppInjector } from 'src/@bug-fisch/services/app-injector.service';



const bootstrap = () => platformBrowserDynamic()
    .bootstrapModule(AppModule).then( (moduleRef) => AppInjector.setInjector(moduleRef.injector));

    bootstrap().catch(err => console.log(err));
