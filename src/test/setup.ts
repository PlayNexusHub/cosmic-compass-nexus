import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'

// Cleanup after each test case
afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver
(global as any).IntersectionObserver = class MockIntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver  
(global as any).ResizeObserver = class MockResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock WebGL context for Three.js tests
const mockWebGLContext = {
  getExtension: () => null,
  getParameter: () => null,
  getShaderPrecisionFormat: () => ({
    precision: 23,
    rangeMin: 127,
    rangeMax: 127,
  }),
}

const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(contextId: any) {
  if (contextId === 'webgl' || contextId === 'experimental-webgl') {
    return mockWebGLContext as any
  }
  return originalGetContext.call(this, contextId)
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock scrollTo
window.scrollTo = () => {}

// Suppress console warnings during tests
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args: any[]) => {
    // Suppress known warnings
    if (
      args[0]?.includes?.('Three.js') ||
      args[0]?.includes?.('WebGL') ||
      args[0]?.includes?.('Canvas')
    ) {
      return
    }
    originalWarn(...args)
  }

  console.error = (...args: any[]) => {
    // Suppress known errors
    if (
      args[0]?.includes?.('Three.js') ||
      args[0]?.includes?.('WebGL') ||
      args[0]?.includes?.('Canvas')
    ) {
      return
    }
    originalError(...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})