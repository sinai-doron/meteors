import { Test } from '@nestjs/testing';
import { AppService } from './app.service';
import { CacheModule } from './cache.module';

const mockDB = [
  {
    name: 'Aachen',
    id: 1,
    nametype: 'Valid',
    recclass: 'L5',
    mass: 21,
    fall: 'Fell',
    year: 1880,
    reclat: '50.775000',
    reclong: '6.083330',
    geolocation: {
      type: 'Point',
      coordinates: [6.08333, 50.775],
    },
  },
  {
    name: 'Aarhus',
    id: 2,
    nametype: 'Valid',
    recclass: 'H6',
    mass: 720,
    fall: 'Fell',
    year: 1951,
    reclat: '56.183330',
    reclong: '10.233330',
    geolocation: {
      type: 'Point',
      coordinates: [10.23333, 56.18333],
    },
  },
  {
    name: 'Abee',
    id: 6,
    nametype: 'Valid',
    recclass: 'EH4',
    mass: 107000,
    fall: 'Fell',
    year: 1952,
    reclat: '54.216670',
    reclong: '-113.000000',
    geolocation: {
      type: 'Point',
      coordinates: [-113, 54.21667],
    },
  },
  {
    name: 'Acapulco',
    id: 10,
    nametype: 'Valid',
    recclass: 'Acapulcoite',
    mass: 1914,
    fall: 'Fell',
    year: 1976,
    reclat: '16.883330',
    reclong: '-99.900000',
    geolocation: {
      type: 'Point',
      coordinates: [-99.9, 16.88333],
    },
  },
  {
    name: 'Achiras',
    id: 370,
    nametype: 'Valid',
    recclass: 'L6',
    mass: 780,
    fall: 'Fell',
    year: 1902,
    reclat: '-33.166670',
    reclong: '-64.950000',
    geolocation: {
      type: 'Point',
      coordinates: [-64.95, -33.16667],
    },
  },
  {
    name: 'Adhi Kot',
    id: 379,
    nametype: 'Valid',
    recclass: 'EH4',
    mass: 4239,
    fall: 'Fell',
    year: 1919,
    reclat: '32.100000',
    reclong: '71.800000',
    geolocation: {
      type: 'Point',
      coordinates: [71.8, 32.1],
    },
  },
  {
    name: 'Aguada',
    id: 398,
    nametype: 'Valid',
    recclass: 'L6',
    mass: 1620,
    fall: 'Fell',
    year: 1930,
    reclat: '-31.600000',
    reclong: '-65.233330',
    geolocation: {
      type: 'Point',
      coordinates: [-65.23333, -31.6],
    },
  },
  {
    name: 'Aguila Blanca',
    id: 417,
    nametype: 'Valid',
    recclass: 'L',
    mass: 1440,
    fall: 'Fell',
    year: 1930,
    reclat: '-30.866670',
    reclong: '-64.550000',
    geolocation: {
      type: 'Point',
      coordinates: [-64.55, -30.86667],
    },
  },
  {
    name: 'Unknown year',
    id: 417,
    nametype: 'Valid',
    recclass: 'L',
    mass: 856,
    fall: 'Fell',
    reclat: '-30.866670',
    reclong: '-64.550000',
    geolocation: {
      type: 'Point',
      coordinates: [-64.55, -30.86667],
    },
  },
];

describe('App service', () => {
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports:[CacheModule],
      providers: [
        {
          provide: 'MeteorDB',
          useValue: mockDB,
        },
        AppService,
      ],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
  });

  describe('Get All Meteors', () => {
    test('should return all meteors', () => {
        const result = appService.getAllMeteors('1');
        expect(result.meteors).toEqual(mockDB);
        expect(result.totalPages).toEqual(1);
        expect(result.pageNumber).toEqual(1);
    });
  })

  describe('Get all available years', () => {
    test('should return all unique years in the DB', () => {
        const result = appService.GetAllYears();
        expect(result).toHaveLength(7);
        expect(result).toEqual([1880, 1951, 1952, 1976, 1902, 1919, 1930]);
    });
  })

  describe('getMeteorsByYear function', () => {

    test('should return meteors for a valid year', () => {
        const result = appService.getMeteorsByYear('1930');
        expect(result.meteors).toHaveLength(2);
        expect(result.meteors).toEqual([{
            name: 'Aguada',
            id: 398,
            nametype: 'Valid',
            recclass: 'L6',
            mass: 1620,
            fall: 'Fell',
            year: 1930,
            reclat: '-31.600000',
            reclong: '-65.233330',
            geolocation: {
              type: 'Point',
              coordinates: [-65.23333, -31.6],
            },
          },
          {
            name: 'Aguila Blanca',
            id: 417,
            nametype: 'Valid',
            recclass: 'L',
            mass: 1440,
            fall: 'Fell',
            year: 1930,
            reclat: '-30.866670',
            reclong: '-64.550000',
            geolocation: {
              type: 'Point',
              coordinates: [-64.55, -30.86667],
            },
          }]);
    });

    test('should return meteors without a year when year is undefined', () => {
        const result = appService.getMeteorsByYear(undefined);
        expect(result.meteors).toEqual([{
            name: 'Unknown year',
            id: 417,
            nametype: 'Valid',
            recclass: 'L',
            mass: 856,
            fall: 'Fell',
            reclat: '-30.866670',
            reclong: '-64.550000',
            geolocation: {
              type: 'Point',
              coordinates: [-64.55, -30.86667],
            },
          }]);
    });

    test('should return empty array for non-numeric strings', () => {
        const result = appService.getMeteorsByYear('invalidYear');
        expect(result.meteors).toEqual([]);
    });

    test('should return empty array when there are no meteors for the given year', () => {
        const result = appService.getMeteorsByYear('2000');
        expect(result.meteors).toEqual([]);
    });

});

  describe('Get meteors by year and mass', () => {
    it('should return meteors for the given year and mass', async () => {
      const result = appService.getMeteorsByYear('1919', '4239');
      
      expect(result.meteors.length).toEqual(1);
      expect(result.meteors[0].year).toEqual(1952);
      expect(result.meteors[0].mass).toEqual(107000);
    });

    it('should return multiple meteors for a given year and mass', async () => {
        const result = appService.getMeteorsByYear('1930', '1000');
        
        expect(result.meteors.length).toEqual(2);
        expect(result.meteors[0].year).toEqual(1930);
        expect(result.meteors[0].mass).toBeGreaterThanOrEqual(1000);
        expect(result.meteors[1].year).toEqual(1930);
        expect(result.meteors[1].mass).toBeGreaterThanOrEqual(1000);
      });

    it('should reset year if no meteor found for the given mass in the specified year', () => {
      const result = appService.getMeteorsByYear('1919', '4240');
      
      expect(result.meteors.length).toEqual(1);
      expect(result.meteors[0].year).toEqual(1952);
      expect(result.meteors[0].mass).toEqual(107000);

    });

    it('should return an empty array if no meteors found larger than the specified mass in any year', () => {
      const result = appService.getMeteorsByYear('2021', '10700000');
      expect(result.meteors).toEqual([]);
    });

    test('should return empty array for non-numeric strings', () => {
        const result = appService.getMeteorsByYear('invalidYear', 'invalidMass');
        expect(result.meteors).toEqual([]);
    });
  });
});
