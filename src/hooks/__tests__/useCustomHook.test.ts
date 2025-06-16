import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCustomHook(0));
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
});
