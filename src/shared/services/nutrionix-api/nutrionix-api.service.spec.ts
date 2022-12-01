import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { nutrionixNaturalNutriensMock } from '@mocks/nutrionix-api.mock';
import { NutrionixAPIService } from './nutrionix-api.service';
import { NutrionixFoodEntity } from './entities/nutrionix-food.entity';

type HttpAxiosRefMock = DeepMockProxy<HttpService & { axiosRef: DeepMockProxy<HttpService['axiosRef']> }>;

describe('NutrionixAPIService', () => {
  let service: NutrionixAPIService;
  let httpService: HttpAxiosRefMock;

  beforeEach(async () => {
    const httpServiceMock = mockDeep<HttpService>();
    const axiosRefMock = mockDeep<HttpService['axiosRef']>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NutrionixAPIService,
        {
          provide: HttpService,
          useValue: {
            ...httpServiceMock,
            axiosRef: axiosRefMock,
          },
        },
      ],
    }).compile();

    service = module.get<NutrionixAPIService>(NutrionixAPIService);
    httpService = module.get<HttpAxiosRefMock>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findFoods()', () => {
    it('should return information of foods in a text', async () => {
      httpService.axiosRef.post.mockResolvedValue({ data: nutrionixNaturalNutriensMock });

      const foods = await service.findFoods('I ate mashed potato');

      expect(foods).toBeDefined();
      foods.map((food) => expect(food).toBeInstanceOf(NutrionixFoodEntity));
      expect(httpService.axiosRef.post).toHaveBeenCalled();
      expect(httpService.axiosRef.post).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception when api returns not found', async () => {
      httpService.axiosRef.post.mockRejectedValue({ response: { status: HttpStatus.NOT_FOUND } });

      try {
        await service.findFoods('I ate mashed potato');
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw an internal server error when an unrecognized error is returned by api', async () => {
      httpService.axiosRef.post.mockRejectedValue(new Error());

      try {
        await service.findFoods('I ate mashed potato');
      } catch (e) {
        expect(e).toBeDefined();
        expect(e).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
