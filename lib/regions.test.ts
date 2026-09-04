import { describe, expect, it } from 'vitest';
import { INDIA_REGIONS, getRegion, getSyntheticRegionLoad } from '@/lib/regions';

describe('India operational regions', () => {
  it('contains all 28 states and eight union territories exactly once', () => {
    expect(INDIA_REGIONS).toHaveLength(36);
    expect(INDIA_REGIONS.filter((region) => region.kind === 'State')).toHaveLength(28);
    expect(INDIA_REGIONS.filter((region) => region.kind === 'Union territory')).toHaveLength(8);
    expect(new Set(INDIA_REGIONS.map((region) => region.code)).size).toBe(36);
  });

  it('resolves case-insensitive region routes and deterministic demo load', () => {
    expect(getRegion('dl')?.name).toBe('Delhi');
    expect(getSyntheticRegionLoad('DL')).toEqual(getSyntheticRegionLoad('DL'));
  });
});
