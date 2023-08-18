import { Inject, Injectable } from '@nestjs/common';
import Meteor from './interfaces/Meteor';
import { CACHE_MANAGER } from './cache.constants';
import PagedResponse from './interfaces/PagedResponse';
import { parse } from 'path';

const emptyResponse: PagedResponse = {
  meteors: [],
  totalElements:0,
  totalPages: 1,
  pageNumber: 1,
};
@Injectable()
export class AppService {
  private readonly meteorDb: Array<Meteor>;
  private readonly limit: number = 9;

  constructor(
    @Inject('MeteorDB') MeteorDB: Array<Meteor>,
    @Inject(CACHE_MANAGER) private cm,
  ) {
    this.meteorDb = MeteorDB;
  }

  sliceResponse(data: Array<Meteor>, page: string): PagedResponse {
    let pageNumber: number = parseInt(page);
    if (isNaN(pageNumber) || pageNumber < 1) {
      pageNumber = 1;
    }
    const totalPages = Math.ceil(data.length / this.limit);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const startIndex = (pageNumber - 1) * this.limit;
    const endIndex = startIndex + this.limit;
    const filteredMeteors = data.slice(startIndex, endIndex);
    return {
      meteors: filteredMeteors,
      totalPages,
      pageNumber,
      totalElements: data.length
    };
  }

  getAllMeteors(page: string): PagedResponse {
    return this.sliceResponse(this.meteorDb, page);
  }

  GetAllYears(): Array<number> {
    const yearSet = this.meteorDb.reduce((set, meteor) => {
      if (meteor.year !== undefined) {
        set.add(meteor.year);
      }
      return set;
    }, new Set<number>());

    return [...yearSet];
  }

  getMeteorsByYear(year: string, mass?: string): PagedResponse {
    let y = parseInt(year);
    if (!year || year.toLowerCase() === 'unknown') {
      y = undefined;
    } else if (isNaN(y) && year.toLowerCase() !== 'unknown') {
      return emptyResponse;
    }

    if (!mass) {
      const data = this.meteorDb.filter((m) => m.year === y);
      return this.sliceResponse(data, '1');
    } else {
      let parsedMass: number = parseFloat(mass);
      if (isNaN(parsedMass)) {
        parsedMass = 0;
      }

      const filteredMeteors = this.meteorDb.filter(
        (meteor) => meteor.year === y && meteor.mass > parsedMass,
      );

      if (filteredMeteors.length === 0) {
        const yearWithMatchingMeteor = this.meteorDb.find(
          (m) => m.mass > parsedMass,
        );

        if (yearWithMatchingMeteor) {
          const data = this.meteorDb.filter(
            (meteor) =>
              meteor.year === yearWithMatchingMeteor.year &&
              meteor.mass > parsedMass,
          );
          return this.sliceResponse(data, '1');
        } else {
          // No meteors at all with the given mass
          return emptyResponse;
        }
      }

      return this.sliceResponse(filteredMeteors, '1');
    }
  }
}
