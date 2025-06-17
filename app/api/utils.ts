import { ApiResponse } from '@/lib/apiTypes';
import {
  UserRole,
  UserStatus,
  type Parcel,
  type ParcelListResponse,
  type Customer,
  type CustomerListResponse,
  type User,
} from '@/lib/types';

export const mockAdminUser: User = {
  id: 'admin-1',
  name: 'ผู้ดูแลระบบ',
  role: UserRole.ADMIN
};

export const mockCustomerUser: User = {
  id: 'customer-1',
  name: 'ลูกค้า ทดสอบ',
  role: UserRole.CUSTOMER,
  customerCode: 'C001',
};

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'จอร์จจี้ จอร์จจี้',
    email: 'john@example.com',
    phone: '0800000001',
    customerCode: 'C001',
    address: '123 Mockingbird Lane',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '0800000002',
    customerCode: 'C002',
    address: '456 Example Rd',
    role: UserRole.CUSTOMER,
    status: UserStatus.INACTIVE,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Bob Lee',
    email: 'bob@example.com',
    phone: '0800000003',
    customerCode: 'C003',
    address: '789 Demo Street',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export interface CustomerFilterOptions {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  status?: UserStatus;
}

export function getCustomerListResponse(options: CustomerFilterOptions = {}): ApiResponse<CustomerListResponse> {
  const { page = 1, limit = 10, name, email, status } = options;

  let filteredCustomers = [...mockCustomers];

  if (name) {
    const lower = name.toLowerCase();
    filteredCustomers = filteredCustomers.filter((c) => c.name.toLowerCase().includes(lower));
  }

  if (email) {
    const lower = email.toLowerCase();
    filteredCustomers = filteredCustomers.filter((c) => c.email.toLowerCase().includes(lower));
  }

  if (status) {
    filteredCustomers = filteredCustomers.filter((c) => c.status === status);
  }

  const startIndex = (page - 1) * limit;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + limit);

  const totalPages = Math.ceil(filteredCustomers.length / limit);

  return {
    resultCode: 20000,
    resultStatus: 'Success',
    developerMessage: 'Success',
    resultData: {
      data: paginatedCustomers,
      pagination: {
        total: filteredCustomers.length,
        page,
        limit,
        totalPages,
      },
    },
  };
}

export const mockParcels: Parcel[] = [
  {
    id: "1",
    parcelRef: "P2024001",
    receiveDate: "2024-01-15",
    customerCode: "C001",
    shipment: "SH2024001",
    estimate: 1500,
    status: "shipped",
    cnTracking: "CN123456789",
    length: 100,
    width: 100,
    height: 50,
    volume: 0.5,
    weight: 2.5,
    freight: 300,
    deliveryMethod: "pickup",
    thTracking: "TH987654321",
    paymentStatus: "paid",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    images: [
      "https://picsum.photos/seed/parcel-1-1/800/600",
      "https://picsum.photos/seed/parcel-1-2/800/600",
      "https://picsum.photos/seed/parcel-1-3/800/600",
    ],
  },
  {
    id: "2",
    parcelRef: "P2024002",
    receiveDate: "2024-01-16",
    customerCode: "C001",
    shipment: "SH2024002",
    estimate: 2200,
    status: "pending",
    cnTracking: "CN987654321",
    length: 100,
    width: 100,
    height: 80,
    volume: 0.8,
    weight: 3.2,
    freight: 450,
    deliveryMethod: "delivery",
    paymentStatus: "unpaid",
    createdAt: "2024-01-16T09:30:00Z",
    updatedAt: "2024-01-16T09:30:00Z",
    images: [
      "https://picsum.photos/seed/parcel-2-1/800/600",
      "https://picsum.photos/seed/parcel-2-2/800/600",
      "https://picsum.photos/seed/parcel-2-3/800/600",
    ],
  },
  {
    id: "3",
    parcelRef: "P2024003",
    receiveDate: "2024-01-17",
    customerCode: "C001",
    shipment: "SH2024003",
    estimate: 3200,
    status: "delivered",
    cnTracking: "CN456789123",
    length: 100,
    width: 100,
    height: 120,
    volume: 1.2,
    weight: 4.8,
    freight: 650,
    deliveryMethod: "express",
    thTracking: "TH123456789",
    paymentStatus: "paid",
    createdAt: "2024-01-17T11:15:00Z",
    updatedAt: "2024-01-17T11:15:00Z",
    images: [
      "https://picsum.photos/seed/parcel-3-1/800/600",
      "https://picsum.photos/seed/parcel-3-2/800/600",
      "https://picsum.photos/seed/parcel-3-3/800/600",
    ],
  },
  {
    id: "4",
    parcelRef: "P2024004",
    receiveDate: "2024-01-18",
    customerCode: "C001",
    shipment: "SH2024004",
    estimate: 1800,
    status: "pending",
    cnTracking: "CN789123456",
    length: 100,
    width: 100,
    height: 60,
    volume: 0.6,
    weight: 2.8,
    freight: 380,
    deliveryMethod: "pickup",
    paymentStatus: "partial",
    createdAt: "2024-01-18T14:20:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
    images: [
      "https://picsum.photos/seed/parcel-4-1/800/600",
      "https://picsum.photos/seed/parcel-4-2/800/600",
      "https://picsum.photos/seed/parcel-4-3/800/600",
    ],
  },
  {
    id: "5",
    parcelRef: "P2024005",
    receiveDate: "2024-01-19",
    customerCode: "C001",
    shipment: "SH2024005",
    estimate: 2800,
    status: "shipped",
    cnTracking: "CN321654987",
    length: 100,
    width: 100,
    height: 100,
    volume: 1.0,
    weight: 4.2,
    freight: 580,
    deliveryMethod: "delivery",
    thTracking: "TH456789123",
    paymentStatus: "paid",
    createdAt: "2024-01-19T09:45:00Z",
    updatedAt: "2024-01-19T09:45:00Z",
    images: [
      "https://picsum.photos/seed/parcel-5-1/800/600",
      "https://picsum.photos/seed/parcel-5-2/800/600",
      "https://picsum.photos/seed/parcel-5-3/800/600",
    ],
  },
  {
    id: "6",
    parcelRef: "P2024006",
    receiveDate: "2024-01-20",
    customerCode: "C001",
    shipment: "SH2024006",
    estimate: 4200,
    status: "cancelled",
    cnTracking: "CN654987321",
    length: 100,
    width: 100,
    height: 150,
    volume: 1.5,
    weight: 6.0,
    freight: 750,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-20T16:30:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
    images: [
      "https://picsum.photos/seed/parcel-6-1/800/600",
      "https://picsum.photos/seed/parcel-6-2/800/600",
      "https://picsum.photos/seed/parcel-6-3/800/600",
    ],
  },
  {
    id: "7",
    parcelRef: "P2024007",
    receiveDate: "2024-01-21",
    customerCode: "C001",
    shipment: "SH2024007",
    estimate: 1950,
    status: "shipped",
    cnTracking: "CN147258369",
    length: 100,
    width: 100,
    height: 70,
    volume: 0.7,
    weight: 3.1,
    freight: 420,
    deliveryMethod: "pickup",
    thTracking: "TH789123456",
    paymentStatus: "paid",
    createdAt: "2024-01-21T11:10:00Z",
    updatedAt: "2024-01-21T11:10:00Z",
    images: [
      "https://picsum.photos/seed/parcel-7-1/800/600",
      "https://picsum.photos/seed/parcel-7-2/800/600",
      "https://picsum.photos/seed/parcel-7-3/800/600",
    ],
  },
  {
    id: "8",
    parcelRef: "P2024008",
    receiveDate: "2024-01-22",
    customerCode: "C001",
    shipment: "SH2024008",
    estimate: 3600,
    status: "delivered",
    cnTracking: "CN963852741",
    length: 100,
    width: 100,
    height: 130,
    volume: 1.3,
    weight: 5.2,
    freight: 680,
    deliveryMethod: "delivery",
    thTracking: "TH852963741",
    paymentStatus: "paid",
    createdAt: "2024-01-22T13:25:00Z",
    updatedAt: "2024-01-22T13:25:00Z",
    images: [
      "https://picsum.photos/seed/parcel-8-1/800/600",
      "https://picsum.photos/seed/parcel-8-2/800/600",
      "https://picsum.photos/seed/parcel-8-3/800/600",
    ],
  },
  {
    id: "9",
    parcelRef: "P2024009",
    receiveDate: "2024-01-23",
    customerCode: "C001",
    shipment: "SH2024009",
    estimate: 2400,
    status: "pending",
    cnTracking: "CN741852963",
    length: 100,
    width: 100,
    height: 90,
    volume: 0.9,
    weight: 3.8,
    freight: 520,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-23T08:15:00Z",
    updatedAt: "2024-01-23T08:15:00Z",
    images: [
      "https://picsum.photos/seed/parcel-9-1/800/600",
      "https://picsum.photos/seed/parcel-9-2/800/600",
      "https://picsum.photos/seed/parcel-9-3/800/600",
    ],
  },
  {
    id: "10",
    parcelRef: "P2024010",
    receiveDate: "2024-01-24",
    customerCode: "C001",
    shipment: "SH2024010",
    estimate: 5200,
    status: "shipped",
    cnTracking: "CN159753486",
    length: 100,
    width: 100,
    height: 210,
    volume: 2.1,
    weight: 7.5,
    freight: 920,
    deliveryMethod: "delivery",
    thTracking: "TH159753486",
    paymentStatus: "partial",
    createdAt: "2024-01-24T15:40:00Z",
    updatedAt: "2024-01-24T15:40:00Z",
    images: [
      "https://picsum.photos/seed/parcel-10-1/800/600",
      "https://picsum.photos/seed/parcel-10-2/800/600",
      "https://picsum.photos/seed/parcel-10-3/800/600",
    ],
  },
  // Additional customer parcels for better UI testing
  {
    id: "11",
    parcelRef: "P2024011",
    receiveDate: "2024-01-25",
    customerCode: "C001",
    shipment: "SH2024011",
    estimate: 1200,
    status: "pending",
    cnTracking: "CN111222333",
    length: 100,
    width: 100,
    height: 40,
    volume: 0.4,
    weight: 1.8,
    freight: 250,
    deliveryMethod: "pickup",
    paymentStatus: "unpaid",
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-01-25T09:00:00Z",
    images: [
      "https://picsum.photos/seed/parcel-11-1/800/600",
      "https://picsum.photos/seed/parcel-11-2/800/600",
      "https://picsum.photos/seed/parcel-11-3/800/600",
    ],
  },
  {
    id: "12",
    parcelRef: "P2024012",
    receiveDate: "2024-01-26",
    customerCode: "C001",
    shipment: "SH2024012",
    estimate: 3800,
    status: "shipped",
    cnTracking: "CN444555666",
    length: 100,
    width: 100,
    height: 140,
    volume: 1.4,
    weight: 5.5,
    freight: 720,
    deliveryMethod: "express",
    thTracking: "TH444555666",
    paymentStatus: "paid",
    createdAt: "2024-01-26T14:30:00Z",
    updatedAt: "2024-01-26T14:30:00Z",
    images: [
      "https://picsum.photos/seed/parcel-12-1/800/600",
      "https://picsum.photos/seed/parcel-12-2/800/600",
      "https://picsum.photos/seed/parcel-12-3/800/600",
    ],
  },
  {
    id: "13",
    parcelRef: "P2024013",
    receiveDate: "2024-01-27",
    customerCode: "C001",
    shipment: "SH2024013",
    estimate: 2600,
    status: "delivered",
    cnTracking: "CN777888999",
    length: 100,
    width: 100,
    height: 90,
    volume: 0.9,
    weight: 3.6,
    freight: 480,
    deliveryMethod: "delivery",
    thTracking: "TH777888999",
    paymentStatus: "paid",
    createdAt: "2024-01-27T11:45:00Z",
    updatedAt: "2024-01-27T11:45:00Z",
    images: [
      "https://picsum.photos/seed/parcel-13-1/800/600",
      "https://picsum.photos/seed/parcel-13-2/800/600",
      "https://picsum.photos/seed/parcel-13-3/800/600",
    ],
  },
  {
    id: "14",
    parcelRef: "P2024014",
    receiveDate: "2024-01-28",
    customerCode: "C001",
    shipment: "SH2024014",
    estimate: 4500,
    status: "pending",
    cnTracking: "CN101112131",
    length: 100,
    width: 100,
    height: 180,
    volume: 1.8,
    weight: 6.8,
    freight: 850,
    deliveryMethod: "express",
    paymentStatus: "partial",
    createdAt: "2024-01-28T16:20:00Z",
    updatedAt: "2024-01-28T16:20:00Z",
    images: [
      "https://picsum.photos/seed/parcel-14-1/800/600",
      "https://picsum.photos/seed/parcel-14-2/800/600",
      "https://picsum.photos/seed/parcel-14-3/800/600",
    ],
  },
  {
    id: "15",
    parcelRef: "P2024015",
    receiveDate: "2024-01-29",
    customerCode: "C001",
    shipment: "SH2024015",
    estimate: 1750,
    status: "shipped",
    cnTracking: "CN141516171",
    length: 100,
    width: 100,
    height: 60,
    volume: 0.6,
    weight: 2.9,
    freight: 350,
    deliveryMethod: "pickup",
    thTracking: "TH141516171",
    paymentStatus: "paid",
    createdAt: "2024-01-29T10:15:00Z",
    updatedAt: "2024-01-29T10:15:00Z",
    images: [
      "https://picsum.photos/seed/parcel-15-1/800/600",
      "https://picsum.photos/seed/parcel-15-2/800/600",
      "https://picsum.photos/seed/parcel-15-3/800/600",
    ],
  },
  // Other customers' parcels
  {
    id: "16",
    parcelRef: "P2024016",
    receiveDate: "2024-01-20",
    customerCode: "C002",
    shipment: "SH2024016",
    estimate: 2100,
    status: "delivered",
    cnTracking: "CN181920212",
    length: 100,
    width: 100,
    height: 80,
    volume: 0.8,
    weight: 3.4,
    freight: 420,
    deliveryMethod: "delivery",
    thTracking: "TH181920212",
    paymentStatus: "paid",
    createdAt: "2024-01-20T12:30:00Z",
    updatedAt: "2024-01-20T12:30:00Z",
    images: [
      "https://picsum.photos/seed/parcel-16-1/800/600",
      "https://picsum.photos/seed/parcel-16-2/800/600",
      "https://picsum.photos/seed/parcel-16-3/800/600",
    ],
  },
  {
    id: "17",
    parcelRef: "P2024017",
    receiveDate: "2024-01-21",
    customerCode: "C003",
    shipment: "SH2024017",
    estimate: 3300,
    status: "pending",
    cnTracking: "CN222324252",
    length: 100,
    width: 100,
    height: 110,
    volume: 1.1,
    weight: 4.5,
    freight: 650,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-21T15:45:00Z",
    updatedAt: "2024-01-21T15:45:00Z",
    images: [
      "https://picsum.photos/seed/parcel-17-1/800/600",
      "https://picsum.photos/seed/parcel-17-2/800/600",
      "https://picsum.photos/seed/parcel-17-3/800/600",
    ],
  },
  {
    id: "18",
    parcelRef: "P2024018",
    receiveDate: "2024-01-22",
    customerCode: "C004",
    shipment: "SH2024018",
    estimate: 1900,
    status: "shipped",
    cnTracking: "CN262728293",
    length: 100,
    width: 100,
    height: 70,
    volume: 0.7,
    weight: 3.0,
    freight: 380,
    deliveryMethod: "pickup",
    thTracking: "TH262728293",
    paymentStatus: "paid",
    createdAt: "2024-01-22T09:20:00Z",
    updatedAt: "2024-01-22T09:20:00Z",
    images: [
      "https://picsum.photos/seed/parcel-18-1/800/600",
      "https://picsum.photos/seed/parcel-18-2/800/600",
      "https://picsum.photos/seed/parcel-18-3/800/600",
    ],
  },
  {
    id: "19",
    parcelRef: "P2024019",
    receiveDate: "2024-01-23",
    customerCode: "C005",
    shipment: "SH2024019",
    estimate: 4100,
    status: "delivered",
    cnTracking: "CN303132333",
    length: 100,
    width: 100,
    height: 160,
    volume: 1.6,
    weight: 6.2,
    freight: 780,
    deliveryMethod: "delivery",
    thTracking: "TH303132333",
    paymentStatus: "paid",
    createdAt: "2024-01-23T13:10:00Z",
    updatedAt: "2024-01-23T13:10:00Z",
    images: [
      "https://picsum.photos/seed/parcel-19-1/800/600",
      "https://picsum.photos/seed/parcel-19-2/800/600",
      "https://picsum.photos/seed/parcel-19-3/800/600",
    ],
  },
  {
    id: "20",
    parcelRef: "P2024020",
    receiveDate: "2024-01-24",
    customerCode: "C002",
    shipment: "SH2024020",
    estimate: 2750,
    status: "cancelled",
    cnTracking: "CN343536373",
    length: 100,
    width: 100,
    height: 100,
    volume: 1.0,
    weight: 4.1,
    freight: 520,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-24T11:55:00Z",
    updatedAt: "2024-01-24T11:55:00Z",
    images: [
      "https://picsum.photos/seed/parcel-20-1/800/600",
      "https://picsum.photos/seed/parcel-20-2/800/600",
      "https://picsum.photos/seed/parcel-20-3/800/600",
    ],
  },
]
export interface ParcelFilterOptions {
  page?: number;
  pageSize?: number;
  status?: string;
  paymentStatus?: string;
  trackingNo?: string;
  dateFrom?: string;
  dateTo?: string;
  customerCode?: string;
}

export function getParcelListResponse(options: ParcelFilterOptions = {}): ApiResponse<ParcelListResponse> {
  const {
    page = 1,
    pageSize = 10,
    status,
    paymentStatus,
    trackingNo,
    dateFrom,
    dateTo,
    customerCode,
  } = options;

  let filteredParcels = [...mockParcels];

  if (customerCode) {
    filteredParcels = filteredParcels.filter(p => p.customerCode === customerCode);
  }

  if (status && status !== 'all') {
    filteredParcels = filteredParcels.filter(p => p.status === status);
  }

  if (paymentStatus && paymentStatus !== 'all') {
    filteredParcels = filteredParcels.filter(p => p.paymentStatus === paymentStatus);
  }

  if (trackingNo) {
    const lower = trackingNo.toLowerCase();
    filteredParcels = filteredParcels.filter(
      p =>
        p.cnTracking.toLowerCase().includes(lower) ||
        (p.thTracking && p.thTracking.toLowerCase().includes(lower)) ||
        p.parcelRef.toLowerCase().includes(lower)
    );
  }

  if (dateFrom && dateTo) {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    filteredParcels = filteredParcels.filter(p => {
      const receiveDate = new Date(p.receiveDate);
      return receiveDate >= fromDate && receiveDate <= toDate;
    });
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedParcels = filteredParcels.slice(startIndex, endIndex);

  return {
    resultCode: 20000,
    resultStatus: 'Success',
    developerMessage: 'Success',
    resultData: {
      parcels: paginatedParcels,
      total: filteredParcels.length,
      page,
      pageSize,
    }

  };
}
