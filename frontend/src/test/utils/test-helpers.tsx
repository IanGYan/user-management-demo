import {
  render,
  RenderOptions,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactElement, ReactNode } from 'react'

/**
 * Custom render function for React components
 * Provides default providers and utilities
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  user?: ReturnType<typeof userEvent.setup>
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const {
    initialEntries: _initialEntries = ['/'],
    user = userEvent.setup(),
    ...renderOptions
  } = options

  // Wrapper component that provides context
  function Wrapper({ children }: { children?: ReactNode }) {
    return <div data-testid="test-wrapper">{children}</div>
  }

  const rendered = render(ui, { wrapper: Wrapper, ...renderOptions })

  return {
    user,
    ...rendered,
    // Additional utilities
    rerender: (rerenderUi: ReactElement) =>
      rendered.rerender(<Wrapper>{rerenderUi}</Wrapper>),
  }
}

/**
 * Form testing utilities
 * Provides helpers for testing form interactions
 */
export class FormTestHelpers {
  /**
   * Fill form field by label
   * @param labelText Label text to find the field (supports string or RegExp)
   * @param value Value to enter
   * @param user User event instance
   */
  static async fillFieldByLabel(
    labelText: string | RegExp,
    value: string,
    user = userEvent.setup()
  ) {
    const field = screen.getByLabelText(labelText)
    await user.clear(field)
    await user.type(field, value)
  }

  /**
   * Fill form field by placeholder
   * @param placeholderText Placeholder text to find the field
   * @param value Value to enter
   * @param user User event instance
   */
  static async fillFieldByPlaceholder(
    placeholderText: string,
    value: string,
    user = userEvent.setup()
  ) {
    const field = screen.getByPlaceholderText(placeholderText)
    await user.clear(field)
    await user.type(field, value)
  }

  /**
   * Submit form by button text
   * @param buttonText Button text to find and click (supports string or RegExp)
   * @param user User event instance
   */
  static async submitForm(buttonText: string | RegExp, user = userEvent.setup()) {
    const submitButton = screen.getByRole('button', { name: buttonText })
    await user.click(submitButton)
  }

  /**
   * Fill and submit a login form
   * @param email Email value
   * @param password Password value
   * @param user User event instance
   */
  static async fillAndSubmitLoginForm(
    email: string,
    password: string,
    user = userEvent.setup()
  ) {
    await this.fillFieldByLabel(/email|邮箱/i, email, user)
    await this.fillFieldByLabel(/password|密码/i, password, user)
    await this.submitForm(/login|登录/i, user)
  }

  /**
   * Fill and submit a registration form
   * @param email Email value
   * @param password Password value
   * @param confirmPassword Confirm password value
   * @param user User event instance
   */
  static async fillAndSubmitRegisterForm(
    email: string,
    password: string,
    confirmPassword: string,
    user = userEvent.setup()
  ) {
    await this.fillFieldByLabel(/email|邮箱/i, email, user)
    await this.fillFieldByLabel(/^password|^密码/i, password, user)
    await this.fillFieldByLabel(/confirm|确认/i, confirmPassword, user)
    await this.submitForm(/register|注册/i, user)
  }
}

/**
 * API mock helpers
 * Provides utilities for mocking API calls
 */
export class ApiMockHelpers {
  /**
   * Mock successful API response
   * @param data Response data
   * @param status HTTP status code
   */
  static mockSuccessResponse(data: Record<string, unknown> = {}, status: number = 200) {
    return Promise.resolve({
      ok: true,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  }

  /**
   * Mock API error response
   * @param message Error message
   * @param status HTTP status code
   */
  static mockErrorResponse(
    message: string = 'API Error',
    status: number = 400
  ) {
    return Promise.reject({
      ok: false,
      status,
      json: () => Promise.resolve({ message }),
      text: () => Promise.resolve(JSON.stringify({ message })),
    })
  }

  /**
   * Mock network error
   * @param message Error message
   */
  static mockNetworkError(message: string = 'Network Error') {
    return Promise.reject(new Error(message))
  }

  /**
   * Mock fetch with custom responses
   * @param responses Map of URL patterns to responses
   */
  static setupFetchMock(responses: Record<string, Promise<Response>>) {
    const originalFetch = global.fetch

    global.fetch = jest
      .fn()
      .mockImplementation((url: string, options?: RequestInit) => {
        const method = options?.method || 'GET'
        const key = `${method} ${url}`

        // Check for exact match first
        if (responses[key]) {
          return responses[key]
        }

        // Check for pattern match
        for (const [pattern, response] of Object.entries(responses)) {
          if (url.includes(pattern.replace(/^[A-Z]+ /, ''))) {
            return response
          }
        }

        // Default to 404
        return this.mockErrorResponse('Not Found', 404)
      })

    // Return cleanup function
    return () => {
      global.fetch = originalFetch
    }
  }
}

/**
 * Component testing utilities
 * Provides helpers for common component testing patterns
 */
export class ComponentTestHelpers {
  /**
   * Wait for element to appear
   * @param selector Element selector or text
   * @param timeout Timeout in milliseconds
   */
  static async waitForElement(selector: string, timeout: number = 5000) {
    return waitFor(
      () => {
        const element =
          screen.getByText(selector) || screen.getByTestId(selector)
        expect(element).toBeInTheDocument()
        return element
      },
      { timeout }
    )
  }

  /**
   * Wait for element to disappear
   * @param selector Element selector or text
   * @param timeout Timeout in milliseconds
   */
  static async waitForElementToDisappear(
    selector: string,
    timeout: number = 5000
  ) {
    return waitFor(
      () => {
        expect(
          screen.queryByText(selector) || screen.queryByTestId(selector)
        ).not.toBeInTheDocument()
      },
      { timeout }
    )
  }

  /**
   * Check if loading state is shown
   */
  static expectLoadingState() {
    expect(
      screen.getByText(/loading|加载|请稍候/i) ||
        screen.getByTestId('loading') ||
        screen.getByRole('status')
    ).toBeInTheDocument()
  }

  /**
   * Check if error message is shown
   * @param message Expected error message
   */
  static expectErrorMessage(message?: string) {
    if (message) {
      expect(screen.getByText(message)).toBeInTheDocument()
    } else {
      expect(
        screen.getByText(/error|错误|失败/i) ||
          screen.getByTestId('error') ||
          screen.getByRole('alert')
      ).toBeInTheDocument()
    }
  }

  /**
   * Check if success message is shown
   * @param message Expected success message
   */
  static expectSuccessMessage(message?: string) {
    if (message) {
      expect(screen.getByText(message)).toBeInTheDocument()
    } else {
      expect(
        screen.getByText(/success|成功|完成/i) || screen.getByTestId('success')
      ).toBeInTheDocument()
    }
  }
}

/**
 * Authentication testing utilities
 * Provides helpers for testing authentication flows
 */
export class AuthTestHelpers {
  /**
   * Mock authenticated user state
   * @param user User data
   */
  static mockAuthenticatedUser(user: Record<string, unknown> = {}) {
    const defaultUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      isVerified: true,
      ...user,
    }

    // Mock localStorage with tokens
    localStorage.setItem('accessToken', 'mock-access-token')
    localStorage.setItem('refreshToken', 'mock-refresh-token')
    localStorage.setItem('user', JSON.stringify(defaultUser))

    return defaultUser
  }

  /**
   * Mock unauthenticated state
   */
  static mockUnauthenticatedUser() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  /**
   * Mock expired token state
   */
  static mockExpiredToken() {
    localStorage.setItem('accessToken', 'expired-token')
    localStorage.setItem('refreshToken', 'expired-refresh-token')
  }
}

/**
 * Validation testing utilities
 * Provides helpers for testing form validation
 */
export class ValidationTestHelpers {
  /**
   * Get test data for invalid emails
   */
  static getInvalidEmailTestData() {
    return [
      { email: 'invalid-email', expected: /无效的邮箱格式|invalid email/i },
      { email: '', expected: /邮箱不能为空|email is required/i },
      { email: '@domain.com', expected: /无效的邮箱格式|invalid email/i },
    ]
  }

  /**
   * Get test data for invalid passwords
   */
  static getInvalidPasswordTestData() {
    return [
      { password: '123', expected: /密码至少8位|password must be at least 8/i },
      { password: '', expected: /密码不能为空|password is required/i },
      { password: 'weakpass', expected: /密码强度不够|password too weak/i },
    ]
  }

  /**
   * Test field validation
   * @param fieldLabel Field label to test
   * @param invalidValue Invalid value to enter
   * @param expectedError Expected error message pattern
   * @param user User event instance
   */
  static async testFieldValidation(
    fieldLabel: string,
    invalidValue: string,
    expectedError: RegExp,
    user = userEvent.setup()
  ) {
    await FormTestHelpers.fillFieldByLabel(fieldLabel, invalidValue, user)

    // Trigger validation by moving focus away
    await user.tab()

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(expectedError)).toBeInTheDocument()
    })
  }
}

// Re-export commonly used testing utilities
export { screen, fireEvent, waitFor, userEvent }
export * from '@testing-library/react'
export { renderWithProviders as render }
