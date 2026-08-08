import { slugify } from './slugify';
import { describe, it, expect } from 'vitest';

describe('slugify', () => {
  it('should return empty string if input is falsy', () => {
    expect(slugify('')).toBe('');
    expect(slugify(undefined as any)).toBe('');
    expect(slugify(null as any)).toBe('');
  });

  it('should convert to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world');
  });

  it('should replace spaces with dashes', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('should handle multiple consecutive spaces', () => {
    expect(slugify('hello    world')).toBe('hello-world');
  });

  it('should replace & with and', () => {
    expect(slugify('apples & oranges')).toBe('apples-and-oranges');
  });

  it('should remove special characters', () => {
    expect(slugify('hello!@#$%^world*()')).toBe('helloworld');
  });

  it('should replace multiple dashes with a single dash', () => {
    expect(slugify('hello---world')).toBe('hello-world');
  });

  it('should trim leading and trailing whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('should stringify non-string inputs', () => {
    expect(slugify(12345 as any)).toBe('12345');
  });
});
