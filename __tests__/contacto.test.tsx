import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from '@/app/contacto/page';

describe('Contacto', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    // @ts-ignore
    window.alert = jest.fn();
  });

  it('envía el formulario', async () => {
    render(<Contacto />);
    await userEvent.type(screen.getByPlaceholderText('Nombre'), 'Juan');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'juan@example.com');
    await userEvent.type(screen.getByPlaceholderText('Mensaje'), 'Hola');
    await userEvent.click(screen.getByRole('button', { name: /enviar/i }));
    expect(screen.getByPlaceholderText('Nombre')).toHaveValue('');
  });
});
