import { NgModule, LOCALE_ID     } from '@angular/core';
import { BrowserModule           } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent     } from './app.component';
import { HeaderComponent  } from './shared/header/header.component';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SignaturePadModule               } from 'angular2-signaturepad'


import { MatDialogModule    } from '@angular/material/dialog';
import { MatTabsModule      } from '@angular/material/tabs';
import { MatButtonModule    } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule      } from '@angular/material/icon';
import { MatInputModule     } from '@angular/material/input';
import { MatCheckboxModule  } from '@angular/material/checkbox';
import { MatSelectModule    } from '@angular/material/select';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule} from '@angular/material-moment-adapter'
import { MatCardModule      } from '@angular/material/card';
import { MatSnackBarModule  } from '@angular/material/snack-bar';
import { MatTableModule     } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';






import { HomeComponent                } from './components/home/home.component';
import { RegistrarEstudianteComponent } from './components/registrar-estudiante/registrar-estudiante.component';
import { CardEstudiantesComponent     } from './components/card-estudiantes/card-estudiantes.component';
import { PipesPipe                    } from './components/pipes/pipes.pipe';
import { ModalConfirmacionComponent   } from './components/modal-confirmacion/modal-confirmacion.component';

import { ListaEstudiantesComponent } from './components/lista-estudiantes/lista-estudiantes.component';
import { NoImagePipe               } from './components/pipes/no-image.pipe';
import { registerLocaleData        } from '@angular/common';

import localeES from '@angular/common/locales/es'
import { from } from 'rxjs';

registerLocaleData(localeES, 'es')

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RegistrarEstudianteComponent,
    CardEstudiantesComponent,
    PipesPipe,
    ModalConfirmacionComponent,
    ListaEstudiantesComponent,
    NoImagePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    HttpClientModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    SignaturePadModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
