import { EMPTY_DRAFT } from '../constants/clothing';
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateAll,
} from './formValidation';

describe('validateStep1', () => {
  it('fails on empty draft', () => {
    const res = validateStep1(EMPTY_DRAFT);
    expect(res.valid).toBe(false);
    expect(res.errors.imageUri).toBeDefined();
    expect(res.errors.title).toBeDefined();
  });

  it('rejects title longer than 60 characters', () => {
    const res = validateStep1({
      ...EMPTY_DRAFT,
      imageUri: 'file:///tmp/x.jpg',
      title: 'a'.repeat(61),
    });
    expect(res.valid).toBe(false);
    expect(res.errors.title).toMatch(/60/);
  });

  it('passes with valid data', () => {
    const res = validateStep1({
      ...EMPTY_DRAFT,
      imageUri: 'file:///tmp/x.jpg',
      title: 'Campera',
    });
    expect(res.valid).toBe(true);
  });
});

describe('validateStep2', () => {
  it('requires size, condition, category', () => {
    const res = validateStep2(EMPTY_DRAFT);
    expect(res.valid).toBe(false);
    expect(Object.keys(res.errors)).toEqual(
      expect.arrayContaining(['size', 'condition', 'category']),
    );
  });

  it('passes with all three selected', () => {
    const res = validateStep2({
      ...EMPTY_DRAFT,
      size: 'M',
      condition: 'Como nuevo',
      category: 'Remeras',
    });
    expect(res.valid).toBe(true);
  });
});

describe('validateStep3', () => {
  it('rejects missing price', () => {
    const res = validateStep3(EMPTY_DRAFT);
    expect(res.valid).toBe(false);
    expect(res.errors.price).toBeDefined();
  });

  it('rejects non-positive price', () => {
    const res = validateStep3({ ...EMPTY_DRAFT, price: '0' });
    expect(res.valid).toBe(false);
    expect(res.errors.price).toBeDefined();
  });

  it('rejects invalid price', () => {
    const res = validateStep3({ ...EMPTY_DRAFT, price: 'abc' });
    expect(res.valid).toBe(false);
  });

  it('accepts valid price', () => {
    const res = validateStep3({ ...EMPTY_DRAFT, price: '1500' });
    expect(res.valid).toBe(true);
  });
});

describe('validateAll', () => {
  it('is valid when all steps pass', () => {
    const res = validateAll({
      imageUri: 'file:///tmp/x.jpg',
      title: 'Campera',
      size: 'M',
      condition: 'Como nuevo',
      category: 'Camperas',
      price: '12000',
      description: '',
      acceptsTrade: false,
    });
    expect(res.valid).toBe(true);
  });
});
