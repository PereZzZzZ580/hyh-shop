import Ayuda from '@/app/ayuda/page';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Ayuda', () => {
  it('muestra la respuesta al hacer click', async () => {
    render(<Ayuda />);
    const pregunta = screen.getByText('¿Cómo puedo realizar un pedido?');
    await userEvent.click(pregunta);
    expect(
      screen.getByText(
        'Para realizar un pedido, agrega productos al carrito y sigue el proceso de pago.'
      )
    ).toBeInTheDocument();
  });
});