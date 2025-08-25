import { Routes } from '@angular/router';
import { ClientCreateComponent } from './components/client-create/client-create.component';
import { ClientDeleteComponent } from './components/client-delete/client-delete.component';
import { ClientDepositComponent } from './components/client-deposit/client-deposit.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientUnitComponent } from './components/client-unit/client-unit.component';
import { ClientUpdateComponent } from './components/client-update/client-update.component';
import { ClientWithdrawComponent } from './components/client-withdraw/client-withdraw.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClientListComponent },
  { path: 'clientes/unico', component: ClientUnitComponent },
  { path: 'clientes/novo', component: ClientCreateComponent },
  { path: 'clientes/atualizar', component: ClientUpdateComponent },
  { path: 'clientes/deletar', component: ClientDeleteComponent },
  { path: 'clientes/depositar', component: ClientDepositComponent },
  { path: 'clientes/sacar', component: ClientWithdrawComponent },
  { path: '**', redirectTo: 'clientes' },
];
