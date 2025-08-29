import React from 'react'
import { render, screen, fireEvent } from '../../../test/utils/test-helpers'
import { Button } from '../button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with text', () => {
      // Act
      render(<Button>Click me</Button>)

      // Assert
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Click me')
    })

    it('should render button with custom className', () => {
      // Act
      render(<Button className="custom-class">Button</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should render disabled button', () => {
      // Act
      render(<Button disabled>Disabled</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should render button with type attribute', () => {
      // Act
      render(<Button type="submit">Submit</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      // Act
      render(<Button>Default</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('should render destructive variant', () => {
      // Act
      render(<Button variant="destructive">Delete</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive')
    })

    it('should render outline variant', () => {
      // Act
      render(<Button variant="outline">Outline</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('bg-background')
    })

    it('should render secondary variant', () => {
      // Act
      render(<Button variant="secondary">Secondary</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary')
    })

    it('should render ghost variant', () => {
      // Act
      render(<Button variant="ghost">Ghost</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('should render link variant', () => {
      // Act
      render(<Button variant="link">Link</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('text-primary')
      expect(button).toHaveClass('underline-offset-4')
    })
  })

  describe('Sizes', () => {
    it('should render default size', () => {
      // Act
      render(<Button>Default Size</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('px-4')
    })

    it('should render small size', () => {
      // Act
      render(<Button size="sm">Small</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('px-3')
    })

    it('should render large size', () => {
      // Act
      render(<Button size="lg">Large</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-11')
      expect(button).toHaveClass('px-8')
    })

    it('should render icon size', () => {
      // Act
      render(<Button size="icon">🔍</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('w-10')
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      // Arrange
      const handleClick = jest.fn()
      const { user } = render(<Button onClick={handleClick}>Click me</Button>)

      // Act
      const button = screen.getByRole('button')
      await user.click(button)

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      // Arrange
      const handleClick = jest.fn()
      const { user } = render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>
      )

      // Act
      const button = screen.getByRole('button')
      await user.click(button)

      // Assert
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should be focusable', async () => {
      // Arrange
      const { user } = render(<Button>Focusable</Button>)

      // Act
      const button = screen.getByRole('button')
      await user.tab()

      // Assert
      expect(button).toHaveFocus()
    })

    it('should not be focusable when disabled', () => {
      // Act
      render(<Button disabled>Not Focusable</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })

    it('should respond to keyboard events', async () => {
      // Arrange
      const handleClick = jest.fn()
      const { user } = render(
        <Button onClick={handleClick}>Keyboard Test</Button>
      )

      // Act
      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('[Space]')

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should respond to Enter key', async () => {
      // Arrange
      const handleClick = jest.fn()
      const { user } = render(<Button onClick={handleClick}>Enter Test</Button>)

      // Act
      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('[Enter]')

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      // Act
      render(
        <Button aria-label="Custom label" aria-describedby="description">
          Button
        </Button>
      )

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
      expect(button).toHaveAttribute('aria-describedby', 'description')
    })

    it('should support screen readers', () => {
      // Act
      render(<Button>Screen Reader Text</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveAccessibleName('Screen Reader Text')
    })

    it('should indicate loading state to screen readers', () => {
      // Act
      render(
        <Button disabled aria-busy="true">
          Loading...
        </Button>
      )

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toBeDisabled()
    })
  })

  describe('Custom Props', () => {
    it('should forward ref correctly', () => {
      // Arrange
      const ref = React.createRef<HTMLButtonElement>()

      // Act
      render(<Button ref={ref}>Ref Test</Button>)

      // Assert
      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('should spread additional props', () => {
      // Act
      render(
        <Button data-testid="custom-button" title="Custom Title">
          Custom Props
        </Button>
      )

      // Assert
      const button = screen.getByTestId('custom-button')
      expect(button).toHaveAttribute('title', 'Custom Title')
    })

    it('should handle form submission', () => {
      // Arrange
      const handleSubmit = jest.fn(e => e.preventDefault())

      // Act
      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit Form</Button>
        </form>
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Assert
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      // Act
      render(<Button></Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('should handle complex children', () => {
      // Act
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      )

      // Assert
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button.children).toHaveLength(2)
    })

    it('should handle long text content', () => {
      // Arrange
      const longText =
        'This is a very long button text that might wrap to multiple lines'

      // Act
      render(<Button>{longText}</Button>)

      // Assert
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent(longText)
    })
  })
})
