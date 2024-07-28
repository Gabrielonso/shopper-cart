import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entity/product';
import { ProductDto } from './dto/product.dto';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async createProduct(product: ProductDto): Promise<void> {
    await this.productRepository.save(product);
  }

  async getProduct(id: string): Promise<Product> {
    const product = this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async updateProduct(id: string, description: string) {
    this.productRepository.update({ id }, { description });
  }

  async deleteProduct(id: string) {
    this.productRepository.delete({ id });
  }
}
