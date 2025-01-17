import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionsRoutingModule } from './collections-routing.module';
import { BreadcrumbModule, BreadcrumbService  } from 'xng-breadcrumb';
import { MaterialModule } from '../../core/material.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AddCollectionsComponent } from './add-collections/add-collections.component';
import { ViewCollectionsComponent } from './view-collections/view-collections.component';


@NgModule({
  declarations: [
    AddCollectionsComponent,
    ViewCollectionsComponent
  ],
  imports: [
    CommonModule,
    CollectionsRoutingModule,
    BreadcrumbModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BreadcrumbService]
})
export class CollectionsModule { }
