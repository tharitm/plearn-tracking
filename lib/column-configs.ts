export type Role = "admin" | "customer";

export interface ColumnConfig {
  id: string;
  isVisible: boolean;
  isEditable?: boolean;
}

export interface RoleColumnConfig {
  [columnId: string]: Partial<Omit<ColumnConfig, 'id'>>;
}

const commonVisibleColumns = [
  "thumbnail",
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

const baseColumnAccess: { [key: string]: boolean } = {
  select: false,
  parcelRef: true,
  receiveDate: true,
  customerCode: true,
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
  thumbnail: true,
};

export const ROLES_COLUMN_CONFIG: Record<Role, RoleColumnConfig> = {
  admin: {
    select: { isVisible: true },
    actions: { isVisible: true },
    status: { isVisible: true, isEditable: true },
    ...commonVisibleColumns.reduce((acc, id) => {
      acc[id] = { isVisible: true };
      return acc;
    }, {} as RoleColumnConfig),
  },
  customer: {
    select: { isVisible: false },
    actions: { isVisible: false },
    status: { isVisible: true, isEditable: false },
    ...commonVisibleColumns.reduce((acc, id) => {
      acc[id] = { isVisible: true };
      return acc;
    }, {} as RoleColumnConfig),
    customerCode: { isVisible: false }
  },
};

export const isColumnVisible = (role: Role, columnId: string): boolean => {
  const roleConfig = ROLES_COLUMN_CONFIG[role];
  if (roleConfig && roleConfig[columnId]) {
    return roleConfig[columnId].isVisible !== undefined ? roleConfig[columnId].isVisible! : (baseColumnAccess[columnId] || false);
  }
  return baseColumnAccess[columnId] || false;
};

export const isColumnEditable = (role: Role, columnId: string): boolean => {
  const roleConfig = ROLES_COLUMN_CONFIG[role];
  if (roleConfig && roleConfig[columnId]) {
    return !!roleConfig[columnId].isEditable;
  }
  return false;
};

export const ALL_COLUMN_IDS = [
  "select",
  "thumbnail",
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
