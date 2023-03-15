import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Customer } from '../../interfaces';
import { BaseService } from '../@base/base.service';

@Injectable()
export class CustomerService extends BaseService<Customer> {
    constructor(
        @InjectModel('Customer') private readonly customerModel: Model<Customer>) {
        super(customerModel);
    }

    update(customerKey: string, customer: Customer): Observable<Customer> {
        
        return this.findOne(customerKey, customer.uuid).pipe(
            catchError(() => {
                throw new BadRequestException('wrong customerKey');
            }),
            mergeMap((c) => {
                if (c !== null) {
                    return super.update(customerKey, customer);
                }
            }),
        );
    }

    create(customerKey: string, customer: Customer): Observable<Customer> {
        // Si le name existe
        return this.findByName(customerKey, customer.name).pipe(
            mergeMap((findCustomer: Customer) => {
                if (findCustomer !== null) {
                    throw new BadRequestException('name already exist');
                } else {
                    // Créer et enregistre le nouveau customer
                    return super.create(customerKey, customer);
                }
            }),
        );
    }

    findOne(customerKey: string, id: string): Observable<Customer> {
        const findCustomer: Observable<Customer> = super.findOne(customerKey, id);
        return findCustomer.pipe(
            mergeMap(customer => {
                if (customer) {
                    return of(customer);
                } else {
                    throw new BadRequestException('customer unknown');
                }
            }),
        );
    }

    private findByName(customerKey: string, name: string): Observable<Customer> {
        const obsCustomer: Observable<Customer[]> = super.list(customerKey, { name });
        return obsCustomer.pipe(
            map((customers: Customer[]) => {
                if (customers.length === 0) {
                    return null;
                } else {
                    return customers[0];
                }
            }),
        );
    }

    findByCustomerKey(customerKey: string): Observable<Customer> {
        const obsCustomer: Observable<Customer[]> = super.findAll(customerKey);
        return obsCustomer.pipe(
            map((customers: Array<Customer>) => {
                if (customers.length === 0) {
                    throw new BadRequestException('customerKey not found');
                }
                else {
                    return customers[0];
                }
            }),
        );
    }
}