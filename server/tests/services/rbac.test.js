const RBACService = require('../../services/rbac');

describe('RBAC Service', () => {
  describe('Permissions and Roles Structure', () => {
    test('should have PERMISSIONS defined', () => {
      expect(RBACService.PERMISSIONS).toBeDefined();
      expect(typeof RBACService.PERMISSIONS).toBe('object');
    });

    test('should have ROLES defined', () => {
      expect(RBACService.ROLES).toBeDefined();
      expect(typeof RBACService.ROLES).toBe('object');
    });

    test('should have admin role with permissions', () => {
      expect(RBACService.ROLES.admin).toBeDefined();
      expect(Array.isArray(RBACService.ROLES.admin)).toBe(true);
      expect(RBACService.ROLES.admin.length).toBeGreaterThan(0);
    });

    test('should have client role with permissions', () => {
      expect(RBACService.ROLES.client).toBeDefined();
      expect(Array.isArray(RBACService.ROLES.client)).toBe(true);
    });

    test('should have superadmin role', () => {
      expect(RBACService.ROLES.superadmin).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    test('should have checkPermission method', () => {
      expect(typeof RBACService.checkPermission).toBe('function');
    });

    test('should have getUserPermissions method', () => {
      expect(typeof RBACService.getUserPermissions).toBe('function');
    });

    test('should have assignRole method', () => {
      expect(typeof RBACService.assignRole).toBe('function');
    });

    test('should have grantAccess method', () => {
      expect(typeof RBACService.grantAccess).toBe('function');
    });

    test('should have revokeAccess method', () => {
      expect(typeof RBACService.revokeAccess).toBe('function');
    });
  });

  describe('Permission Checks', () => {
    test('should define task permissions', () => {
      expect(RBACService.PERMISSIONS['tasks:view']).toBeDefined();
      expect(RBACService.PERMISSIONS['tasks:create']).toBeDefined();
      expect(RBACService.PERMISSIONS['tasks:edit']).toBeDefined();
    });

    test('should define document permissions', () => {
      expect(RBACService.PERMISSIONS['documents:view']).toBeDefined();
      expect(RBACService.PERMISSIONS['documents:upload']).toBeDefined();
    });

    test('should define admin permissions', () => {
      expect(RBACService.PERMISSIONS['admin:users:view']).toBeDefined();
      expect(RBACService.PERMISSIONS['admin:settings:edit']).toBeDefined();
    });
  });
});
