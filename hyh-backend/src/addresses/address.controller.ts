@Patch(':id/default')
setDefault(@Param('id') id: string, @Body() body: SetDefaultDto) {
  return this.addressesService.setDefault(id, body.userId);
}