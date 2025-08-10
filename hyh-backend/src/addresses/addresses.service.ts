async setDefault(addressId: string, userId: string) {
  // asegura que la address pertenece al usuario
  const addr = await this.prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!addr) throw new NotFoundException('Dirección no encontrada');

  return this.prisma.$transaction(async (tx) => {
    await tx.address.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.address.update({ where: { id: addressId }, data: { isDefault: true } });
  });
}