// Frontend test utilities and helpers
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Type definitions for test data
interface MockUser {
  id: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MockTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface MockAuthState {
  isAuthenticated: boolean;
  user: MockUser | null;
  tokens: MockTokens | null;
  loading: boolean;
  error: string | null;
}

interface MockUIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  toasts: unknown[];
}

interface MockApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

interface MockApiError {
  success: false;
  data: null;
  message: string;
  error: string;
}

// Create a test query client
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options

  function Wrapper({ children }: { children?: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export * from '@testing-library/user-event'

// Override the default render with our custom render
export { renderWithProviders as render }

// Mock data factories
export const TestDataFactory = {
  /**
   * Create mock user data
   */
  createMockUser: (overrides: Partial<MockUser> = {}): MockUser => ({
    id: 'test-user-id',
    email: 'test@example.com',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  /**
   * Create mock authentication tokens
   */
  createMockTokens: (overrides: Partial<MockTokens> = {}): MockTokens => ({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 1800,
    ...overrides,
  }),

  /**
   * Create mock authentication state
   */
  createMockAuthState: (overrides: Partial<MockAuthState> = {}): MockAuthState => ({
    isAuthenticated: false,
    user: null,
    tokens: null,
    loading: false,
    error: null,
    ...overrides,
  }),

  /**
   * Create mock UI state
   */
  createMockUIState: (overrides: Partial<MockUIState> = {}): MockUIState => ({
    theme: 'light',
    sidebarOpen: false,
    loading: false,
    toasts: [],
    ...overrides,
  }),

  /**
   * Create mock API response
   */
  createMockApiResponse: function <T>(
    data: T,
    overrides: Partial<Omit<MockApiResponse<T>, 'data'>> = {},
  ): MockApiResponse<T> {
    return {
      success: true,
      data,
      message: 'Success',
      ...overrides,
    }
  },

  /**
   * Create mock API error response
   */
  createMockApiError: (overrides: Partial<MockApiError> = {}): MockApiError => ({
    success: false,
    data: null,
    message: 'An error occurred',
    error: 'INTERNAL_SERVER_ERROR',
    ...overrides,
  }),
}

// Mock axios for API testing
type MockAxiosInstance = {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
  patch: jest.Mock;
  create: jest.Mock;
  defaults: {
    headers: {
      common: Record<string, unknown>;
    };
  };
  interceptors: {
    request: {
      use: jest.Mock;
      eject: jest.Mock;
    };
    response: {
      use: jest.Mock;
      eject: jest.Mock;
    };
  };
};

export const mockAxios: MockAxiosInstance = {
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  patch: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(),
  defaults: {
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
}

// Set up the create method to return mockAxios after initialization
mockAxios.create.mockReturnValue(mockAxios)

// Mock Zustand stores
export function createMockStore<T>(initialState: T) {
  return {
    getState: jest.fn(() => initialState),
    setState: jest.fn(),
    subscribe: jest.fn(),
    destroy: jest.fn(),
  }
}

// Utility functions for testing
export const TestUtils = {
  /**
   * Wait for async operations to complete
   */
  waitForAsync: async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
  },

  /**
   * Simulate delay for testing loading states
   */
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  /**
   * Create a mock event
   */
  createMockEvent: (overrides: Partial<Event> = {}) => ({
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: {
      value: '',
    },
    ...overrides,
  }),

  /**
   * Create mock form data
   */
  createMockFormData: (data: Record<string, string>) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    return formData
  },

  /**
   * Mock window location
   */
  mockLocation: (url: string): void => {
    delete (window as unknown as Record<string, unknown>).location;
    (window as unknown as Record<string, unknown>).location = {
      ...window.location,
      href: url,
      pathname: url,
    };
  },
}

// Common test assertions
export const TestAssertions = {
  /**
   * Assert that element has loading state
   */
  expectLoading: (element: HTMLElement) => {
    expect(element).toBeInTheDocument()
    expect(element).toHaveAttribute('aria-busy', 'true')
  },

  /**
   * Assert that element is accessible
   */
  expectAccessible: (element: HTMLElement) => {
    expect(element).toBeInTheDocument()
    expect(element).toHaveAttribute('role')
  },

  /**
   * Assert API call was made
   */
  expectApiCall: (mockFn: jest.Mock, method: string, url: string) => {
    expect(mockFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method,
        url,
      })
    )
  },
}
