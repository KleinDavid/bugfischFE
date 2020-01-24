import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AppInjector } from './@bug-fisch/services/app-injector.service';


const bootstrap = () => platformBrowserDynamic()
    .bootstrapModule(AppModule).then( (moduleRef) => AppInjector.setInjector(moduleRef.injector));

    bootstrap().catch(err => console.log(err));
