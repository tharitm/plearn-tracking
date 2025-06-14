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
    volume: 0.5,
    weight: 2.5,
    freight: 300,
    deliveryMethod: "pickup",
    thTracking: "TH987654321",
    paymentStatus: "paid",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.8,
    weight: 3.2,
    freight: 450,
    deliveryMethod: "delivery",
    paymentStatus: "unpaid",
    createdAt: "2024-01-16T09:30:00Z",
    updatedAt: "2024-01-16T09:30:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.2,
    weight: 4.8,
    freight: 650,
    deliveryMethod: "express",
    thTracking: "TH123456789",
    paymentStatus: "paid",
    createdAt: "2024-01-17T11:15:00Z",
    updatedAt: "2024-01-17T11:15:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.6,
    weight: 2.8,
    freight: 380,
    deliveryMethod: "pickup",
    paymentStatus: "partial",
    createdAt: "2024-01-18T14:20:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.0,
    weight: 4.2,
    freight: 580,
    deliveryMethod: "delivery",
    thTracking: "TH456789123",
    paymentStatus: "paid",
    createdAt: "2024-01-19T09:45:00Z",
    updatedAt: "2024-01-19T09:45:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.5,
    weight: 6.0,
    freight: 750,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-20T16:30:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.7,
    weight: 3.1,
    freight: 420,
    deliveryMethod: "pickup",
    thTracking: "TH789123456",
    paymentStatus: "paid",
    createdAt: "2024-01-21T11:10:00Z",
    updatedAt: "2024-01-21T11:10:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.3,
    weight: 5.2,
    freight: 680,
    deliveryMethod: "delivery",
    thTracking: "TH852963741",
    paymentStatus: "paid",
    createdAt: "2024-01-22T13:25:00Z",
    updatedAt: "2024-01-22T13:25:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.9,
    weight: 3.8,
    freight: 520,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-23T08:15:00Z",
    updatedAt: "2024-01-23T08:15:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 2.1,
    weight: 7.5,
    freight: 920,
    deliveryMethod: "delivery",
    thTracking: "TH159753486",
    paymentStatus: "partial",
    createdAt: "2024-01-24T15:40:00Z",
    updatedAt: "2024-01-24T15:40:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.4,
    weight: 1.8,
    freight: 250,
    deliveryMethod: "pickup",
    paymentStatus: "unpaid",
    createdAt: "2024-01-25T09:00:00Z",
    updatedAt: "2024-01-25T09:00:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.4,
    weight: 5.5,
    freight: 720,
    deliveryMethod: "express",
    thTracking: "TH444555666",
    paymentStatus: "paid",
    createdAt: "2024-01-26T14:30:00Z",
    updatedAt: "2024-01-26T14:30:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.9,
    weight: 3.6,
    freight: 480,
    deliveryMethod: "delivery",
    thTracking: "TH777888999",
    paymentStatus: "paid",
    createdAt: "2024-01-27T11:45:00Z",
    updatedAt: "2024-01-27T11:45:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.8,
    weight: 6.8,
    freight: 850,
    deliveryMethod: "express",
    paymentStatus: "partial",
    createdAt: "2024-01-28T16:20:00Z",
    updatedAt: "2024-01-28T16:20:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.6,
    weight: 2.9,
    freight: 350,
    deliveryMethod: "pickup",
    thTracking: "TH141516171",
    paymentStatus: "paid",
    createdAt: "2024-01-29T10:15:00Z",
    updatedAt: "2024-01-29T10:15:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.8,
    weight: 3.4,
    freight: 420,
    deliveryMethod: "delivery",
    thTracking: "TH181920212",
    paymentStatus: "paid",
    createdAt: "2024-01-20T12:30:00Z",
    updatedAt: "2024-01-20T12:30:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.1,
    weight: 4.5,
    freight: 650,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-21T15:45:00Z",
    updatedAt: "2024-01-21T15:45:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 0.7,
    weight: 3.0,
    freight: 380,
    deliveryMethod: "pickup",
    thTracking: "TH262728293",
    paymentStatus: "paid",
    createdAt: "2024-01-22T09:20:00Z",
    updatedAt: "2024-01-22T09:20:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.6,
    weight: 6.2,
    freight: 780,
    deliveryMethod: "delivery",
    thTracking: "TH303132333",
    paymentStatus: "paid",
    createdAt: "2024-01-23T13:10:00Z",
    updatedAt: "2024-01-23T13:10:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
    volume: 1.0,
    weight: 4.1,
    freight: 520,
    deliveryMethod: "express",
    paymentStatus: "unpaid",
    createdAt: "2024-01-24T11:55:00Z",
    updatedAt: "2024-01-24T11:55:00Z",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
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
