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
  "images",
  "receiveDate",
  "shipment",
  "cabinetCode",
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
  images: true,
  receiveDate: true,
  customerCode: true,
  description: true,
  pack: true,
  shipment: true,
  cabinetCode: true,
  estimate: true,
  status: true,
  cnTracking: true,
  length: true,
  width: true,
  height: true,
  volume: true,
  weight: true,
  shippingRate: true,
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
    ...commonVisibleColumns.reduce((acc, id) => {
      acc[id] = { isVisible: true };
      return acc;
    }, {} as RoleColumnConfig),
    status: { isVisible: true, isEditable: true },
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
  "images",
  "receiveDate",
  "customerCode",
  "description",
  "pack",
  "shipment",
  "cabinetCode",
  "estimate",
  "status",
  "cnTracking",
  "length",
  "width",
  "height",
  "volume",
  "weight",
  "shippingRate",
  "freight",
  "deliveryMethod",
  // "thTracking", // Removed as per request
  // "paymentStatus", // Removed as per request
  "actions",
];
