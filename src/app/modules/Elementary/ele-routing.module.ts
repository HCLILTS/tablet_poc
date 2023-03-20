import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NTemplate1Component } from './ntemplate1/ntemplate1.component';
import { NTemplate2Component } from './ntemplate2/ntemplate2.component';
import { NTemplate3Component } from './ntemplate3/ntemplate3.component';
import { NTemplate10Component } from './ntemplate10/ntemplate10.component';
import { NTemplate5Component } from './ntemplate5/ntemplate5.component';
import { NTemplate13Component } from './ntemplate13/ntemplate13.component';
import { NTemplate6Component } from './ntemplate6/ntemplate6.component';
import { NTemplate4Component } from './ntemplate4/ntemplate4.component';
import { NTemplate7Component } from './ntemplate7/ntemplate7.component';
import { NTemplate9Component } from './ntemplate9/ntemplate9.component';
import { NTemplate8Component } from './ntemplate8/ntemplate8.component';
import { Ntemplate12Component } from './ntemplate12/ntemplate12.component';
import { Ntemplate23Component } from './Ntemplate23/Ntemplate23.component';
import { Ntemplate23V1Component } from './Ntemplate23_1/Ntemplate23_1.component';
import { Ntemplate14Component } from './Ntemplate14/Ntemplate14.component';
import { Ntemplate15Component } from './Ntemplate15/Ntemplate15.component';
import { Ntemplate16Component } from './Ntemplate16/Ntemplate16.component';
import { Ntemplate17Component } from './ntemplate17/ntemplate17.component';
import { Ntemplate18Component } from './Ntemplate18/Ntemplate18.component';
import { Ntemplate18V1Component } from './Ntemplate18_1/Ntemplate18_1.component';
import { Ntemplate19Component } from './ntemplate19/ntemplate19.component';
import { Ntemplate20Component } from './Ntemplate20/Ntemplate20.component';
import { Ntemplate21Component } from './Ntemplate21/Ntemplate21.component';
import { Ntemplate22Component } from './Ntemplate22/Ntemplate22.component';
import { Ntemplate24Component } from './ntemplate24/ntemplate24.component';
import { Ntemplate24V1Component } from './Ntemplate24_1/Ntemplate24_1.component';
import { NTemplate13V1Component } from './ntemplate13_1/ntemplate13_1.component';
import { NTemplate2V1Component } from './Ntemplate2_1/Ntemplate2_1.component';
import { NTemplate4V1Component } from './ntemplate4_1/ntemplate4_1.component';
import { NTemplate6V1Component } from './ntemplate6_1/ntemplate6_1.component';
import { Ntemplate11Component } from './ntemplate11/ntemplate11.component';
import { NTemplate7V1Component } from './ntemplate7_1/ntemplate7_1.component';
import { Ntemplate20V1Component } from './Ntemplate20_1/Ntemplate20_1.component';

const routes: Routes = [
  { path: 'ntemp3', component: NTemplate3Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp3ext', component: NTemplate3Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp10', component: NTemplate10Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp10ext', component: NTemplate10Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp1', component: NTemplate1Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp1ext', component: NTemplate1Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp2', component: NTemplate2Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp2ext', component: NTemplate2Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp5', component: NTemplate5Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp5ext', component: NTemplate5Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp13', component: NTemplate13Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp13ext', component: NTemplate13Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp13_1', component: NTemplate13V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp13_1ext', component: NTemplate13V1Component, runGuardsAndResolvers: 'always' },

  { path: 'ntemp6', component: NTemplate6Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp6ext', component: NTemplate6Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp6_1', component: NTemplate6V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp6_1ext', component: NTemplate6V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp7_1', component: NTemplate7V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp7_1ext', component: NTemplate7V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp4', component: NTemplate4Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp4ext', component: NTemplate4Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp4_1', component: NTemplate4V1Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp4_1ext', component: NTemplate4V1Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp7', component: NTemplate7Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp7ext', component: NTemplate7Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp9', component: NTemplate9Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp9ext', component: NTemplate9Component, runGuardsAndResolvers: 'always'},
  { path: 'ntemp8', component: NTemplate8Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp8ext', component: NTemplate8Component, runGuardsAndResolvers: 'always' },

  { path: 'ntemp11', component: Ntemplate11Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp11ext', component: Ntemplate11Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp12', component: Ntemplate12Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp12ext', component: Ntemplate12Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp15', component: Ntemplate15Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp15ext', component: Ntemplate15Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp14', component: Ntemplate14Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp14ext', component: Ntemplate14Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp16', component: Ntemplate16Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp16ext', component: Ntemplate16Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp17', component: Ntemplate17Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp17ext', component: Ntemplate17Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp18', component: Ntemplate18Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp18ext', component: Ntemplate18Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp18_1', component: Ntemplate18V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp18_1ext', component: Ntemplate18V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp19', component: Ntemplate19Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp19ext', component: Ntemplate19Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp20', component: Ntemplate20Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp20ext', component: Ntemplate20Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp21', component: Ntemplate21Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp21ext', component: Ntemplate21Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp22', component: Ntemplate22Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp22ext', component: Ntemplate22Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp23', component: Ntemplate23Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp23ext', component: Ntemplate23Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp23_1', component: Ntemplate23V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp23_1ext', component: Ntemplate23V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp24', component: Ntemplate24Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp24ext', component: Ntemplate24Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp24_1', component: Ntemplate24V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp24_1ext', component: Ntemplate24V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp2_1', component: NTemplate2V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp2_1ext', component: NTemplate2V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp20_1', component: Ntemplate20V1Component, runGuardsAndResolvers: 'always' },
  { path: 'ntemp20_1ext', component: Ntemplate20V1Component, runGuardsAndResolvers: 'always' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]  
})
export class ElementaryRoutingModule { }
