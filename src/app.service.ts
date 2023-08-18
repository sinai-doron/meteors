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
    // Handle 'year' argument
    let y: number | undefined;
    if (year && year.toLowerCase() !== 'unknown') {
        y = parseInt(year);
        if (isNaN(y)) {
            return emptyResponse;
        }
    }

    // Handle 'mass' argument
    let parsedMass = 0;
    if (mass) {
        parsedMass = parseFloat(mass);
        if (isNaN(parsedMass)) {
            return emptyResponse;
        }
    }

    // Filter meteors based on year and mass
    const filteredMeteors = this.meteorDb.filter((meteor) => {
        const yearMatches = meteor.year === y;
        const massMatches = meteor.mass > parsedMass;
        return yearMatches && massMatches;
    });

    // If no meteors found and mass was provided, try finding any year with the given mass
    if (filteredMeteors.length === 0 && mass) {
        const yearWithMatchingMeteor = this.meteorDb.find((m) => m.mass > parsedMass);
        if (yearWithMatchingMeteor) {
            return this.sliceResponse(
                this.meteorDb.filter((meteor) => meteor.year === yearWithMatchingMeteor.year && meteor.mass > parsedMass),
                '1'
            );
        } else {
            return emptyResponse;
        }
    }

    return this.sliceResponse(filteredMeteors, '1');
}

}
