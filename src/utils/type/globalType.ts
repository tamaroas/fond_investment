type DictionaryType = { [key: string]: string }

type ResponseUseFetch = {
    message: string,
    status: number,
    datas: any | null
    success?: boolean
}

type ResponseUseFetchClient = ResponseUseFetch & {
    success?: boolean
}

type CallBackResponseUseFetch = (response: ResponseUseFetchClient) => void

type CustomCookie = {
    access_token: string | null,
    deleteAccessToken: (key: string) => void
    setAccessTokenWithExpiry: (value: string | null, maxAge: number) => void
}

type Help = {
    code_authentication: number,
    local_api_url?: string,
    api_key?: string,
    api_url?: string,
    client_api_key?: string,
}

type Role = {
    id: number;
    name: string;
    selug: string;
}

type Roles = {
    role: Role[]
}

type Administrator = {
    id: number;
    firstname: string | null | undefined;
    lastname: string;
    email: string;
    emailVerifiedAt: Date | null | undefined;
    rememberToken: string | null | undefined
    roles: Roles
}

type Customer = {
    id: number;
    firstname: string | null | undefined;
    lastname: string;
    email: string;
    tel: number;
    callingCode: number;
    company: string;
    identityType: string;
    identity: string;
    publicKey: string;
    privateKey: string;
    status: boolean;
    emailVerifiedAt: Date | null | undefined;
    rememberToken: string | null | undefined;
    roles: Roles;
    wallet: Wallet
}

type UserCustomer = {
    id: number;
    firstname: string | null | undefined;
    lastname: string;
    email: string;
    tel: number;
    callingCode: number;
    company: string;
    identityType: string;
    identity: string;
    publicKey: string;
    privateKey: string;
    status: boolean;
    emailVerifiedAt: Date | null | undefined;
    rememberToken: string | null | undefined;
    roles: Roles;
    wallet: Wallet
    createdAt: string;
    updatedAt: string;
}

type ViaziCustomer = {
    access_token: string;
    token_type: string;
    expire: number;
    customer: Customer | null;
    administrator: Administrator | null
}

type Currency = {
    id: number;
    name: string;
    isoCode: string;
    symbol: string;
    rate: number;
    rateWithout: number;
    current: boolean;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

type Wallet = {
    id: number;
    amount: number;
    tmpAmount: number;
    omAmount: number;
    momoAmount: number;
    coinbaseAmount: number;
    cartAmount: number;
    transfertAmount: number;
    status: number;
    currency: Currency
}

type Sender = {
    id: number;
    firstname: string;
    lastname: string;
}

type Receiver = {
    id: number;
    firstname: string;
    lastname: string;
}

type CurrencySender = {
    isoCode: string;
    symbol: string;
}

type CurrencyReceiver = {
    isoCode: string;
    symbol: string;
}
type WalletTransactions = {
    content: WalletTransaction[];
    totalElements: number;
    totalPages: number;
}


type WalletTransaction = {
    id: number;
    amount: number;
    amountWithRate: number;
    amountSenderAfter: number;
    amountSenderBefore: number;
    amountReceiverAfter: number;
    amountReceiverBefore: number;
    status: string;
    type: string;
    method: string;
    sender: Sender;
    receiver: Receiver;
    currencySender: CurrencySender;
    currencyReceiver: CurrencyReceiver;
    createdAt: Date;
    updatedAt: Date;
}

type Transaction = {
    id: number;
    orderId: string;
    initAmount: number;
    amount: number;
    amountCommission: number;
    commission: number;
    status: string;
    customer: Customer;
    walletTransaction: WalletTransaction;
    om: string;
    momo: string;
    stripe: string;
    createdAt: Date;
    updatedAt: Date;
}

type Transactions = {
    content: Transaction[];
    totalElements: number;
    totalPages: number;
}

type PaymentMethod = {
    id: number;
    name: string;
    slug: string;
}

type Withdrawals_admin = {
    id: number;
    fullName: string;
    countryCode: string;
    tel: string;
    bankNumber: string;
    bankIban: string;
    bankSwift: string;
    status: boolean;
    active: boolean;
    customer: Customer;
    paymentMethod: PaymentMethod;
    createdAt: Date;
    updatedAt: Date;
}

type Withdrawals_admins = {
    [x: string]: any
    content: Withdrawals_admin[];
    totalElements: number;
    totalPages: number;
}



type WithdrawalMethod = {
    id: number;
    name: string;
    slug: string;
};

type UserCustomers = {
    content: UserCustomer[];
    totalElements: number;
    totalPages: number;
}

type Admin = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    emailVerifiedAt: string | null;
    password: string;
    rememberToken: string | null;
    createdAt: string;
    updatedAt: string;
    roles: any[];
};

type Withdrawal = {
    id:number;
    fullName:string;
    tel:string | null;
    countryCode:string | null;
    bankNumber:string | null;
    bankIban:string | null;
    bankSwift:string | null;
    status:boolean;
    paymentMethod:PaymentMethod;
}

type BootstrapUserInfo = {
    transactions: Transactions;
    wallet_transactions: WalletTransactions;
    withdrawals_admin: Withdrawals_admins;
    customers: UserCustomers;
    withdrawal_methods: WithdrawalMethod[];
    payment_methods: PaymentMethod[];
    withdrawals: Withdrawal[];
    currencies: Currency[];
    settings: Setting[];
    currency_usd: Currency;
    currency_eur: Currency;
    wallet: Wallet;
    role: string;
    customer: Customer | null;
    admin: Administrator | null;
}

type Setting = {
    id: number,
    name: string,
    slug: string,
    value: string,
    createdAt: string,
    updatedAt: string,
}


type Companie = {
    id:number,
    company:string
}

type BootsrtapApp = {
    companies:Companie[]
}