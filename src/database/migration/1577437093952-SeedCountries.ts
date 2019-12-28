// @ts-ignore

import {
  MigrationInterface,
  QueryRunner,
  getConnection,
  InsertResult
} from 'typeorm';

import { countries } from '../../country/interfaces/country.interfaces';

export class SeedCountries1577437093952 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<any> {
    const promises: Promise<InsertResult>[] = [];
    for (let index = 0; index < countries.length; index += 20) {
      promises.push(
        getConnection()
          .createQueryBuilder()
          .insert()
          .into('country')
          .values(countries.slice(index, index + 20))
          .execute()
      );
    }

    return Promise.all(promises);
  }

  public async down(_: QueryRunner): Promise<any> {
    // do nothing
  }
}
