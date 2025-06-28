import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  async executeSeed() {
    await this.insertNewProducts();
    return 'Seed Executed!';
  }

  async insertNewProducts() {
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach((prod) =>
      insertPromises.push(this.productService.create(prod)),
    );

    await Promise.all(insertPromises);

    return true;
  }
}
