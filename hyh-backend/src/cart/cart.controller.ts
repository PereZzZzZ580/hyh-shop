import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)            // ⬅️ TODAS las rutas del carrito requieren login
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  // GET /cart   (trae/crea el carrito del usuario logueado)
  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user.sub;
    const c = await this.cart.getOrCreateCart({ userId });
    return this.cart.get(c.id);
  }

  @Post('items')
  add(@Req() req: any, @Body() dto: AddItemDto) {
    const userId = req.user.sub;
    return this.cart.addItem({ userId, variantId: dto.variantId, qty: dto.qty });
  }

  @Put('items/:id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateItemDto) {
    const userId = req.user.sub;
    return this.cart.updateItem(userId, id, dto.qty);
  }

  @Delete('items/:id')
  remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.cart.removeItem(userId, id);
  }
}
