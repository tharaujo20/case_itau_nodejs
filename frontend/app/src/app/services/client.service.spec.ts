import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Client, CreateClient } from '../model/client.model';

describe('ClientService', () => {
  let service: ClientService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    TestBed.configureTestingModule({
      providers: [ClientService, { provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(ClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllClients should call GET and return clients', (done) => {
    const expectedClients: Client[] = [
      { id: '1', name: 'A', email: 'a@test.com', balance: 100 },
    ];
    httpSpy.get.and.returnValue(of(expectedClients));

    service.getAllClients().subscribe((clients) => {
      expect(clients).toEqual(expectedClients);
      expect(httpSpy.get).toHaveBeenCalledWith(
        'http://localhost:8080/clientes'
      );
      done();
    });
  });

  it('getClientById should call GET with id', (done) => {
    const expectedClient: Client = {
      id: '1',
      name: 'A',
      email: 'a@test.com',
      balance: 100,
    };
    httpSpy.get.and.returnValue(of(expectedClient));

    service.getClientById('1').subscribe((client) => {
      expect(client).toEqual(expectedClient);
      expect(httpSpy.get).toHaveBeenCalledWith(
        'http://localhost:8080/clientes/1'
      );
      done();
    });
  });

  it('createClient should call POST', (done) => {
    const newClient: CreateClient = {
      name: 'A',
      email: 'a@test.com',
      password: 1234,
      balance: 100,
    };
    httpSpy.post.and.returnValue(of(void 0));

    service.createClient(newClient).subscribe(() => {
      expect(httpSpy.post).toHaveBeenCalledWith(
        'http://localhost:8080/clientes/novo',
        newClient
      );
      done();
    });
  });

  it('updateClient should call PUT', (done) => {
    const client: Client = {
      id: '1',
      name: 'A',
      email: 'a@test.com',
      balance: 100,
    };
    httpSpy.put.and.returnValue(of(void 0));

    service.updateClient(client).subscribe(() => {
      expect(httpSpy.put).toHaveBeenCalledWith(
        'http://localhost:8080/clientes',
        client
      );
      done();
    });
  });

  it('deleteClient should call DELETE with id', (done) => {
    httpSpy.delete.and.returnValue(of(void 0));

    service.deleteClient('1').subscribe(() => {
      expect(httpSpy.delete).toHaveBeenCalledWith(
        'http://localhost:8080/clientes/1'
      );
      done();
    });
  });

  it('deposit should call POST with amount', (done) => {
    httpSpy.post.and.returnValue(of(200));

    service.deposit('1', 200).subscribe((balance) => {
      expect(balance).toBe(200);
      expect(httpSpy.post).toHaveBeenCalledWith(
        'http://localhost:8080/clientes/1/depositar',
        { amount: 200 }
      );
      done();
    });
  });

  it('withdraw should call POST with amount and password', (done) => {
    httpSpy.post.and.returnValue(of(100));

    service.withdraw('1', 100, 1234).subscribe((balance) => {
      expect(balance).toBe(100);
      expect(httpSpy.post).toHaveBeenCalledWith(
        'http://localhost:8080/clientes/1/sacar',
        { amount: 100, password: 1234 }
      );
      done();
    });
  });
});
