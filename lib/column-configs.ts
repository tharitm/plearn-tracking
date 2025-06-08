export type Role = "admin" | "customer";

export interface ColumnConfig {
  id: string; // Corresponds to ColumnDef.id or accessorKey
  isVisible: boolean;
  isEditable?: boolean; // e.g., for the status column
}

export interface RoleColumnConfig {
  [columnId: string]: Partial<Omit<ColumnConfig, 'id'>>;
}

const commonVisibleColumns = [
  "parcelRef",
  "receiveDate",
  "shipment",
  "estimate",
  "status",
  "cnTracking",
  "volume",
  "weight",
  "freight",
  "deliveryMethod",
  "thTracking",
  "paymentStatus",
];

// Define which columns are available by default for all roles (can be overridden)
const baseColumnAccess: { [key: string]: boolean } = {
  select: false,
  parcelRef: true,
  receiveDate: true,
  customerCode: true, // Show by default, can be filtered out in getParcelTableColumns if needed
  shipment: true,
  estimate: true,
  status: true,
  cnTracking: true,
  volume: true,
  weight: true,
  freight: true,
  deliveryMethod: true,
  thTracking: true,
  paymentStatus: true,
  actions: false,
};

export const ROLES_COLUMN_CONFIG: Record<Role, RoleColumnConfig> = {
  admin: {
    // Admin sees all base columns by default, plus select and actions
    // Specific overrides for admin if any column from baseColumnAccess should be hidden
    select: { isVisible: true },
    actions: { isVisible: true },
    status: { isVisible: true, isEditable: true },
    // Ensure all common columns are visible for admin
    ...commonVisibleColumns.reduce((acc, id) => {
      acc[id] = { isVisible: true };
      return acc;
    }, {} as RoleColumnConfig),
    customerCode: { isVisible: true }, // Admin can see customer codes
  },
  customer: {
    // Customer sees common columns, but not select or actions. Status is not editable.
    // Specific overrides for customer
    select: { isVisible: false },
    actions: { isVisible: false },
    status: { isVisible: true, isEditable: false },
    // Ensure all common columns are visible for customer
    ...commonVisibleColumns.reduce((acc, id) => {
      acc[id] = { isVisible: true };
      return acc;
    }, {} as RoleColumnConfig),
    // customerCode: { isVisible: false }, // Example: Customer doesn't need to see their own code in the table
                                        // For now, let's keep it visible as per baseColumnAccess
                                        // and filter it in getParcelTableColumns if truly needed.
    customerCode: { isVisible: true }, // Or decide here if it should be hidden for customer.
                                       // Let's assume it's fine for customers to see their own code.
  },
};

// Helper function to check column visibility for a role
export const isColumnVisible = (role: Role, columnId: string): boolean => {
  const roleConfig = ROLES_COLUMN_CONFIG[role];
  if (roleConfig && roleConfig[columnId]) {
    return roleConfig[columnId].isVisible !== undefined ? roleConfig[columnId].isVisible! : (baseColumnAccess[columnId] || false);
  }
  return baseColumnAccess[columnId] || false;
};

// Helper function to check if a column is editable for a role
export const isColumnEditable = (role: Role, columnId: string): boolean => {
  const roleConfig = ROLES_COLUMN_CONFIG[role];
  if (roleConfig && roleConfig[columnId]) {
    return !!roleConfig[columnId].isEditable;
  }
  return false;
};

// List of all known column IDs that `getParcelTableColumns` can generate.
// This helps in iterating or ensuring all columns are considered.
export const ALL_COLUMN_IDS = [
  "select",
  "parcelRef",
  "receiveDate",
  "customerCode",
  "shipment",
  "estimate",
  "status",
  "cnTracking",
  "volume",
  "weight",
  "freight",
  "deliveryMethod",
  "thTracking",
  "paymentStatus",
  "actions",
];
