import { TestBed, async, inject } from '@angular/core/testing';

import { RoleAuthGuard } from './role-auth.guard';

describe('RoleAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoleAuthGuard]
    });
  });

  it('should ...', inject([RoleAuthGuard], (guard: RoleAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
