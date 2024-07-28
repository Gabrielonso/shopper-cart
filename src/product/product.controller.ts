import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Get('/:id')
  async getProduct(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.getProduct(id);
  }

  @Post()
  async createProduct(@Body() productDto: ProductDto) {
    return await this.productService.createProduct(productDto);
  }

  @Patch('/:id')
  async updateProduct(
    @Body() { description }: UpdateProductDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return await this.productService.updateProduct(id, description);
  }

  @Delete('/:id')
  async deleteProduct(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productService.deleteProduct(id);
  }
}
